-- ============================================================================
-- Cota diária de IA por usuário (defesa em profundidade além do login obrigatório
-- no /api/ai). A tabela é PRIVADA: RLS ligada e SEM policies → nenhum cliente lê
-- ou escreve direto. Só a função SECURITY DEFINER consumir_ia() mexe nela, sempre
-- limitada ao auth.uid() do JWT de quem chamou.
-- ============================================================================

create table if not exists public.ai_usage (
  user_id uuid    not null references auth.users(id) on delete cascade,
  dia     date    not null default (now() at time zone 'utc')::date,
  count   integer not null default 0,
  primary key (user_id, dia)
);

alter table public.ai_usage enable row level security;
-- (nenhuma policy de propósito: acesso exclusivamente via a RPC abaixo)

-- Consome 1 unidade da cota do dia para o usuário do JWT. Atômica: o SELECT ...
-- FOR UPDATE trava a linha do dia, evitando corrida entre requests concorrentes.
-- Retorna se a chamada é permitida, quanto já foi usado e qual o limite.
create or replace function public.consumir_ia(p_limite integer)
returns table (permitido boolean, usado integer, limite integer)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_uid   uuid    := auth.uid();
  v_dia   date    := (now() at time zone 'utc')::date;
  v_count integer;
begin
  if v_uid is null then
    return query select false, 0, p_limite;
    return;
  end if;

  insert into public.ai_usage (user_id, dia, count)
    values (v_uid, v_dia, 0)
    on conflict (user_id, dia) do nothing;

  select count into v_count
    from public.ai_usage
    where user_id = v_uid and dia = v_dia
    for update;

  if v_count >= p_limite then
    return query select false, v_count, p_limite;
    return;
  end if;

  update public.ai_usage set count = count + 1
    where user_id = v_uid and dia = v_dia
    returning count into v_count;

  return query select true, v_count, p_limite;
end;
$$;

-- Só usuários autenticados podem chamar; anônimo não.
revoke all on function public.consumir_ia(integer) from public, anon;
grant execute on function public.consumir_ia(integer) to authenticated;
