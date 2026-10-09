-- ============================================================================
-- Plataforma: B2B para agências (organizações + white-label + propostas),
-- API pública (chaves com hash), marketplace de criadores e consultores e
-- compras de produtos PRÓPRIOS (Trip Pass, roteiro de criador, consultoria).
--
-- Regras de segurança (testadas em scripts/rls-test.mjs):
--   • tudo com RLS; papéis por organização (owner/admin/agent);
--   • custo e margem da agência NUNCA saem pela visão pública da proposta;
--   • chave de API guardada só como SHA-256; o servidor valida por RPC;
--   • compras, "verificado" e conta Stripe do criador só pelo servidor;
--   • conteúdo de roteiro pago só para o autor ou para quem comprou.
-- Reserva de viagem (voo/hotel) NÃO é vendida aqui: continua com parceiros.
-- ============================================================================

-- ---------------------------------------------------------------- organizações
create table if not exists public.organizations (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9][a-z0-9-]{1,38}[a-z0-9]$'),
  nome text not null check (char_length(nome) between 2 and 120),
  owner_id uuid not null references auth.users(id) on delete cascade,
  -- white-label: { nomeExibido, corPrimaria '#RRGGBB', logoUrl 'https://…', rodape }
  marca jsonb not null default '{}'::jsonb check (jsonb_typeof(marca) = 'object'),
  dominio text unique check (dominio is null or dominio ~ '^[a-z0-9.-]+\.[a-z]{2,}$'),
  margem_padrao_pct numeric(5,2) not null default 12 check (margem_padrao_pct between 0 and 60),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.org_members (
  org_id uuid not null references public.organizations(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  papel text not null check (papel in ('owner', 'admin', 'agent')),
  created_at timestamptz not null default now(),
  primary key (org_id, user_id)
);
create unique index if not exists org_members_um_owner on public.org_members(org_id) where papel = 'owner';
create index if not exists org_members_user on public.org_members(user_id);

create or replace function public.org_owner_member() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  insert into public.org_members(org_id, user_id, papel) values (new.id, new.owner_id, 'owner')
  on conflict do nothing;
  return new;
end; $$;
drop trigger if exists org_owner_member on public.organizations;
create trigger org_owner_member after insert on public.organizations
  for each row execute function public.org_owner_member();

create or replace function public.org_dono_imutavel() returns trigger
language plpgsql as $$
begin
  if new.owner_id <> old.owner_id and coalesce(auth.role(), '') <> 'service_role' then
    raise exception 'o dono da organização não pode ser trocado pelo cliente' using errcode = '42501';
  end if;
  new.updated_at := now();
  return new;
end; $$;
drop trigger if exists org_dono_imutavel on public.organizations;
create trigger org_dono_imutavel before update on public.organizations
  for each row execute function public.org_dono_imutavel();

create or replace function public.papel_na_org(p_org uuid) returns text
language sql stable security definer set search_path = public as $$
  select papel from public.org_members where org_id = p_org and user_id = auth.uid()
$$;
create or replace function public.membro_da_org(p_org uuid) returns boolean
language sql stable security definer set search_path = public as $$
  select public.papel_na_org(p_org) is not null
$$;
create or replace function public.admin_da_org(p_org uuid) returns boolean
language sql stable security definer set search_path = public as $$
  select coalesce(public.papel_na_org(p_org) in ('owner', 'admin'), false)
$$;

alter table public.organizations enable row level security;
alter table public.org_members enable row level security;

drop policy if exists "orgs: membros leem" on public.organizations;
create policy "orgs: membros leem" on public.organizations for select using (public.membro_da_org(id));
drop policy if exists "orgs: usuário cria a sua" on public.organizations;
create policy "orgs: usuário cria a sua" on public.organizations for insert with check (owner_id = auth.uid());
drop policy if exists "orgs: admins atualizam" on public.organizations;
create policy "orgs: admins atualizam" on public.organizations for update using (public.admin_da_org(id)) with check (public.admin_da_org(id));
drop policy if exists "orgs: dono apaga" on public.organizations;
create policy "orgs: dono apaga" on public.organizations for delete using (owner_id = auth.uid());

drop policy if exists "org_members: membros veem" on public.org_members;
create policy "org_members: membros veem" on public.org_members for select using (public.membro_da_org(org_id));
drop policy if exists "org_members: admins adicionam" on public.org_members;
create policy "org_members: admins adicionam" on public.org_members for insert with check (public.admin_da_org(org_id) and papel <> 'owner');
drop policy if exists "org_members: admins alteram" on public.org_members;
create policy "org_members: admins alteram" on public.org_members for update
  using (public.admin_da_org(org_id) and papel <> 'owner') with check (public.admin_da_org(org_id) and papel <> 'owner');
drop policy if exists "org_members: admins removem ou o próprio sai" on public.org_members;
create policy "org_members: admins removem ou o próprio sai" on public.org_members for delete
  using (papel <> 'owner' and (public.admin_da_org(org_id) or user_id = auth.uid()));

-- Convite por e-mail (o cliente não enxerga auth.users).
create or replace function public.convidar_para_org(p_org uuid, p_email text, p_papel text default 'agent') returns boolean
language plpgsql security definer set search_path = public, auth as $$
declare v uuid;
begin
  if not public.admin_da_org(p_org) then raise exception 'sem permissão' using errcode = '42501'; end if;
  if p_papel not in ('admin', 'agent') then raise exception 'papel inválido' using errcode = '22023'; end if;
  select id into v from auth.users where lower(email) = lower(trim(p_email));
  if v is null then return false; end if;
  insert into public.org_members(org_id, user_id, papel) values (p_org, v, p_papel)
  on conflict (org_id, user_id) do update set papel = excluded.papel where public.org_members.papel <> 'owner';
  return true;
end; $$;
revoke all on function public.convidar_para_org(uuid, text, text) from public, anon;
grant execute on function public.convidar_para_org(uuid, text, text) to authenticated;

-- ------------------------------------------------------------------- propostas
create table if not exists public.proposals (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.organizations(id) on delete cascade,
  criado_por uuid references auth.users(id) on delete set null default auth.uid(),
  titulo text not null check (char_length(titulo) between 2 and 160),
  cliente_nome text not null check (char_length(cliente_nome) between 1 and 120),
  cliente_email text check (cliente_email is null or cliente_email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
  destino_code text check (destino_code is null or destino_code ~ '^[A-Z]{2}$'),
  data_inicio date,
  data_fim date,
  pessoas integer not null default 1 check (pessoas between 1 and 99),
  moeda text not null default 'BRL' check (moeda ~ '^[A-Z]{3}$'),
  -- [{ titulo, dia, tipo, descricao, custo_minor }] — custo é interno da agência
  itens jsonb not null default '[]'::jsonb check (jsonb_typeof(itens) = 'array'),
  custo_minor bigint not null default 0 check (custo_minor >= 0),
  margem_pct numeric(5,2) not null default 12 check (margem_pct between 0 and 60),
  preco_minor bigint generated always as (round(custo_minor * (1 + margem_pct / 100))::bigint) stored,
  status text not null default 'rascunho' check (status in ('rascunho', 'enviada', 'aceita', 'recusada', 'expirada')),
  token_publico uuid not null unique default gen_random_uuid(),
  valida_ate date,
  respondida_em timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (data_fim is null or data_inicio is null or data_fim >= data_inicio)
);
create index if not exists proposals_org on public.proposals(org_id, created_at desc);
drop trigger if exists proposals_touch on public.proposals;
create trigger proposals_touch before update on public.proposals for each row execute function public.touch_updated_at();

alter table public.proposals enable row level security;
drop policy if exists "propostas: membros leem" on public.proposals;
create policy "propostas: membros leem" on public.proposals for select using (public.membro_da_org(org_id));
drop policy if exists "propostas: membros criam" on public.proposals;
create policy "propostas: membros criam" on public.proposals for insert with check (public.membro_da_org(org_id));
drop policy if exists "propostas: membros editam" on public.proposals;
create policy "propostas: membros editam" on public.proposals for update using (public.membro_da_org(org_id)) with check (public.membro_da_org(org_id));
drop policy if exists "propostas: admins apagam" on public.proposals;
create policy "propostas: admins apagam" on public.proposals for delete using (public.admin_da_org(org_id));

-- Visão do CLIENTE FINAL por token: sem custo, sem margem, sem e-mail.
create or replace function public.proposta_publica(p_token uuid) returns jsonb
language sql stable security definer set search_path = public as $$
  select jsonb_build_object(
    'titulo', p.titulo, 'cliente', p.cliente_nome, 'destino', p.destino_code,
    'inicio', p.data_inicio, 'fim', p.data_fim, 'pessoas', p.pessoas, 'moeda', p.moeda,
    'preco_minor', p.preco_minor, 'status', p.status, 'valida_ate', p.valida_ate,
    'itens', coalesce((select jsonb_agg(jsonb_build_object('titulo', i->>'titulo', 'dia', i->'dia', 'tipo', i->>'tipo', 'descricao', i->>'descricao'))
                       from jsonb_array_elements(p.itens) i), '[]'::jsonb),
    'agencia', jsonb_build_object('nome', o.nome, 'marca', o.marca))
  from public.proposals p join public.organizations o on o.id = p.org_id
  where p.token_publico = p_token and p.status in ('enviada', 'aceita', 'recusada', 'expirada')
$$;
revoke all on function public.proposta_publica(uuid) from public;
grant execute on function public.proposta_publica(uuid) to anon, authenticated;

create or replace function public.responder_proposta(p_token uuid, p_aceita boolean) returns text
language plpgsql security definer set search_path = public as $$
declare v public.proposals;
begin
  select * into v from public.proposals where token_publico = p_token for update;
  if v.id is null or v.status <> 'enviada' then return 'indisponivel'; end if;
  if v.valida_ate is not null and v.valida_ate < current_date then
    update public.proposals set status = 'expirada' where id = v.id;
    return 'expirada';
  end if;
  update public.proposals set status = case when p_aceita then 'aceita' else 'recusada' end, respondida_em = now() where id = v.id;
  return case when p_aceita then 'aceita' else 'recusada' end;
end; $$;
revoke all on function public.responder_proposta(uuid, boolean) from public;
grant execute on function public.responder_proposta(uuid, boolean) to anon, authenticated;

-- ---------------------------------------------------------- chaves da API v1
create table if not exists public.api_keys (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade default auth.uid(),
  org_id uuid references public.organizations(id) on delete cascade,
  nome text not null check (char_length(nome) between 1 and 80),
  prefixo text not null check (prefixo ~ '^msf_[a-z]+_[A-Za-z0-9]{6}$'),
  hash text not null unique check (hash ~ '^[a-f0-9]{64}$'),
  escopos text[] not null default array['catalogo:ler'],
  limite_min integer not null default 600 check (limite_min between 1 and 6000),
  criado_em timestamptz not null default now(),
  ultimo_uso timestamptz,
  revogada_em timestamptz
);
create index if not exists api_keys_owner on public.api_keys(owner_id);

-- O cliente só cria/revoga: hash, dono, limite e escopos não mudam por ele.
create or replace function public.api_key_guard() returns trigger
language plpgsql as $$
begin
  if coalesce(auth.role(), '') = 'service_role' then return new; end if;
  if tg_op = 'INSERT' then
    new.limite_min := 600;
    new.escopos := array['catalogo:ler'];
    new.ultimo_uso := null;
    new.revogada_em := null;
    if new.org_id is not null and not public.admin_da_org(new.org_id) then
      raise exception 'sem permissão na organização' using errcode = '42501';
    end if;
    return new;
  end if;
  if new.hash <> old.hash or new.owner_id <> old.owner_id or new.limite_min <> old.limite_min
     or new.escopos <> old.escopos or new.prefixo <> old.prefixo or new.org_id is distinct from old.org_id then
    raise exception 'só é possível renomear ou revogar a chave' using errcode = '42501';
  end if;
  if old.revogada_em is not null and new.revogada_em is null then
    raise exception 'chave revogada não volta a valer' using errcode = '42501';
  end if;
  return new;
end; $$;
drop trigger if exists api_key_guard on public.api_keys;
create trigger api_key_guard before insert or update on public.api_keys for each row execute function public.api_key_guard();

alter table public.api_keys enable row level security;
drop policy if exists "api_keys: dono lê" on public.api_keys;
create policy "api_keys: dono lê" on public.api_keys for select using (owner_id = auth.uid());
drop policy if exists "api_keys: dono cria" on public.api_keys;
create policy "api_keys: dono cria" on public.api_keys for insert with check (owner_id = auth.uid());
drop policy if exists "api_keys: dono revoga" on public.api_keys;
create policy "api_keys: dono revoga" on public.api_keys for update using (owner_id = auth.uid()) with check (owner_id = auth.uid());
drop policy if exists "api_keys: dono apaga" on public.api_keys;
create policy "api_keys: dono apaga" on public.api_keys for delete using (owner_id = auth.uid());

-- Validação pelo servidor da API (anon pode chamar: só confirma um hash válido).
create or replace function public.validar_api_key(p_hash text) returns table (id uuid, escopos text[], limite_min integer)
language plpgsql security definer set search_path = public as $$
begin
  if p_hash !~ '^[a-f0-9]{64}$' then return; end if;
  update public.api_keys k set ultimo_uso = now()
   where k.hash = p_hash and k.revogada_em is null and (k.ultimo_uso is null or k.ultimo_uso < now() - interval '1 minute');
  return query select k.id, k.escopos, k.limite_min from public.api_keys k where k.hash = p_hash and k.revogada_em is null;
end; $$;
revoke all on function public.validar_api_key(text) from public;
grant execute on function public.validar_api_key(text) to anon, authenticated, service_role;

-- --------------------------------------------------- marketplace (criadores)
create table if not exists public.creator_profiles (
  user_id uuid primary key references auth.users(id) on delete cascade default auth.uid(),
  slug text not null unique check (slug ~ '^[a-z0-9][a-z0-9-]{1,38}[a-z0-9]$'),
  nome_publico text not null check (char_length(nome_publico) between 2 and 80),
  bio text check (bio is null or char_length(bio) <= 1200),
  tipos text[] not null default array['criador'] check (tipos <@ array['criador', 'consultor'] and cardinality(tipos) >= 1),
  especialidades text[] not null default '{}',
  idiomas text[] not null default array['pt'],
  consultoria_preco_minor bigint check (consultoria_preco_minor is null or consultoria_preco_minor between 0 and 100000000),
  moeda text not null default 'BRL' check (moeda ~ '^[A-Z]{3}$'),
  verificado boolean not null default false,
  stripe_account_id text,
  ativo boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.creator_guard() returns trigger
language plpgsql as $$
begin
  if coalesce(auth.role(), '') = 'service_role' then return new; end if;
  if tg_op = 'INSERT' then
    new.verificado := false; new.stripe_account_id := null;
  else
    if new.verificado <> old.verificado or new.stripe_account_id is distinct from old.stripe_account_id or new.user_id <> old.user_id then
      raise exception 'campo controlado pelo servidor' using errcode = '42501';
    end if;
  end if;
  new.updated_at := now();
  return new;
end; $$;
drop trigger if exists creator_guard on public.creator_profiles;
create trigger creator_guard before insert or update on public.creator_profiles for each row execute function public.creator_guard();

alter table public.creator_profiles enable row level security;
drop policy if exists "criadores: perfis ativos são públicos" on public.creator_profiles;
create policy "criadores: perfis ativos são públicos" on public.creator_profiles for select using (ativo or user_id = auth.uid());
drop policy if exists "criadores: o próprio cria" on public.creator_profiles;
create policy "criadores: o próprio cria" on public.creator_profiles for insert with check (user_id = auth.uid());
drop policy if exists "criadores: o próprio edita" on public.creator_profiles;
create policy "criadores: o próprio edita" on public.creator_profiles for update using (user_id = auth.uid()) with check (user_id = auth.uid());
drop policy if exists "criadores: o próprio apaga" on public.creator_profiles;
create policy "criadores: o próprio apaga" on public.creator_profiles for delete using (user_id = auth.uid());

create table if not exists public.creator_itineraries (
  id uuid primary key default gen_random_uuid(),
  autor_id uuid not null references public.creator_profiles(user_id) on delete cascade default auth.uid(),
  slug text not null unique check (slug ~ '^[a-z0-9][a-z0-9-]{1,78}[a-z0-9]$'),
  titulo text not null check (char_length(titulo) between 4 and 140),
  destino_code text not null check (destino_code ~ '^[A-Z]{2}$'),
  dias integer not null check (dias between 1 and 60),
  resumo text not null check (char_length(resumo) between 20 and 600),
  estilo text,
  preco_minor bigint not null default 0 check (preco_minor between 0 and 10000000),
  moeda text not null default 'BRL' check (moeda ~ '^[A-Z]{3}$'),
  status text not null default 'rascunho' check (status in ('rascunho', 'publicado', 'removido')),
  publicado_em timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists creator_itineraries_pub on public.creator_itineraries(status, destino_code);
drop trigger if exists creator_itineraries_touch on public.creator_itineraries;
create trigger creator_itineraries_touch before update on public.creator_itineraries for each row execute function public.touch_updated_at();

create table if not exists public.creator_itinerary_content (
  itinerary_id uuid primary key references public.creator_itineraries(id) on delete cascade,
  -- [{ dia: 1, itens: [{ titulo, placeId, lat, lng, duracaoMin, notas }] }]
  dias jsonb not null check (jsonb_typeof(dias) = 'array'),
  updated_at timestamptz not null default now()
);

alter table public.creator_itineraries enable row level security;
alter table public.creator_itinerary_content enable row level security;
drop policy if exists "roteiros: publicados são públicos" on public.creator_itineraries;
create policy "roteiros: publicados são públicos" on public.creator_itineraries for select using (status = 'publicado' or autor_id = auth.uid());
drop policy if exists "roteiros: autor cria" on public.creator_itineraries;
create policy "roteiros: autor cria" on public.creator_itineraries for insert with check (autor_id = auth.uid());
drop policy if exists "roteiros: autor edita" on public.creator_itineraries;
create policy "roteiros: autor edita" on public.creator_itineraries for update using (autor_id = auth.uid()) with check (autor_id = auth.uid());
drop policy if exists "roteiros: autor apaga" on public.creator_itineraries;
create policy "roteiros: autor apaga" on public.creator_itineraries for delete using (autor_id = auth.uid());

-- --------------------------------------------------------------- compras
create table if not exists public.purchases (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  produto text not null check (produto in ('trip_pass', 'roteiro', 'consultoria')),
  produto_id uuid,
  vendedor_id uuid references auth.users(id) on delete set null,
  valor_minor bigint not null check (valor_minor >= 0),
  moeda text not null check (moeda ~ '^[A-Z]{3}$'),
  taxa_plataforma_minor bigint not null default 0 check (taxa_plataforma_minor >= 0),
  stripe_session_id text unique,
  status text not null default 'pendente' check (status in ('pendente', 'pago', 'reembolsado', 'falhou')),
  pago_em timestamptz,
  created_at timestamptz not null default now(),
  check (taxa_plataforma_minor <= valor_minor)
);
create index if not exists purchases_user on public.purchases(user_id, produto);
alter table public.purchases enable row level security;
-- leitura: comprador e vendedor. Escrita: SÓ service role (webhook do Stripe).
drop policy if exists "compras: comprador e vendedor leem" on public.purchases;
create policy "compras: comprador e vendedor leem" on public.purchases for select using (user_id = auth.uid() or vendedor_id = auth.uid());

create or replace function public.comprou_roteiro(p_itinerary uuid) returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.purchases where user_id = auth.uid() and produto = 'roteiro' and produto_id = p_itinerary and status = 'pago')
$$;

drop policy if exists "conteúdo: autor, grátis publicado ou comprador" on public.creator_itinerary_content;
create policy "conteúdo: autor, grátis publicado ou comprador" on public.creator_itinerary_content for select using (
  exists (select 1 from public.creator_itineraries r where r.id = itinerary_id and (
    r.autor_id = auth.uid() or (r.status = 'publicado' and (r.preco_minor = 0 or public.comprou_roteiro(r.id))))));
drop policy if exists "conteúdo: autor escreve" on public.creator_itinerary_content;
create policy "conteúdo: autor escreve" on public.creator_itinerary_content for insert with check (
  exists (select 1 from public.creator_itineraries r where r.id = itinerary_id and r.autor_id = auth.uid()));
drop policy if exists "conteúdo: autor atualiza" on public.creator_itinerary_content;
create policy "conteúdo: autor atualiza" on public.creator_itinerary_content for update using (
  exists (select 1 from public.creator_itineraries r where r.id = itinerary_id and r.autor_id = auth.uid()));

-- Trip Pass ativo (30 dias a partir do pagamento) — usado por /api/me/plan.
create or replace function public.trip_pass_ativo_ate() returns timestamptz
language sql stable security definer set search_path = public as $$
  select max(pago_em) + interval '30 days' from public.purchases
  where user_id = auth.uid() and produto = 'trip_pass' and status = 'pago' and pago_em > now() - interval '30 days'
$$;
grant execute on function public.trip_pass_ativo_ate() to authenticated;

-- ---------------------------------------------------- consultorias (pedidos)
create table if not exists public.consult_requests (
  id uuid primary key default gen_random_uuid(),
  consultor_id uuid not null references public.creator_profiles(user_id) on delete cascade,
  cliente_id uuid not null references auth.users(id) on delete cascade default auth.uid(),
  destino_code text check (destino_code is null or destino_code ~ '^[A-Z]{2}$'),
  mensagem text not null check (char_length(mensagem) between 10 and 2000),
  data_inicio date,
  data_fim date,
  status text not null default 'nova' check (status in ('nova', 'aceita', 'recusada', 'paga', 'concluida', 'cancelada')),
  preco_minor bigint check (preco_minor is null or preco_minor between 0 and 100000000),
  moeda text not null default 'BRL' check (moeda ~ '^[A-Z]{3}$'),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (consultor_id <> cliente_id)
);
create index if not exists consult_requests_consultor on public.consult_requests(consultor_id, status);

-- Transições permitidas (V4: estados explícitos, nada pulado pelo cliente):
--   consultor: nova → aceita (com preço) | recusada ; paga → concluida
--   cliente:   nova | aceita → cancelada
--   servidor:  aceita → paga (webhook do Stripe)
create or replace function public.consulta_guard() returns trigger
language plpgsql as $$
declare eu uuid := auth.uid();
begin
  if coalesce(auth.role(), '') = 'service_role' then new.updated_at := now(); return new; end if;
  if tg_op = 'INSERT' then
    if new.status <> 'nova' or new.preco_minor is not null then
      raise exception 'pedido nasce como nova, sem preço' using errcode = '42501';
    end if;
    if not exists (select 1 from public.creator_profiles c where c.user_id = new.consultor_id and c.ativo and 'consultor' = any(c.tipos)) then
      raise exception 'consultor indisponível' using errcode = '22023';
    end if;
    return new;
  end if;
  if new.consultor_id <> old.consultor_id or new.cliente_id <> old.cliente_id or new.mensagem <> old.mensagem then
    raise exception 'pedido não pode mudar de partes nem de mensagem' using errcode = '42501';
  end if;
  if new.status = old.status and new.preco_minor is not distinct from old.preco_minor then new.updated_at := now(); return new; end if;
  if eu = old.consultor_id and (
       (old.status = 'nova' and new.status = 'aceita' and new.preco_minor is not null)
    or (old.status = 'nova' and new.status = 'recusada')
    or (old.status = 'paga' and new.status = 'concluida' and new.preco_minor is not distinct from old.preco_minor)) then
    new.updated_at := now(); return new;
  end if;
  if eu = old.cliente_id and old.status in ('nova', 'aceita') and new.status = 'cancelada' and new.preco_minor is not distinct from old.preco_minor then
    new.updated_at := now(); return new;
  end if;
  raise exception 'transição não permitida: % → %', old.status, new.status using errcode = '42501';
end; $$;
drop trigger if exists consulta_guard on public.consult_requests;
create trigger consulta_guard before insert or update on public.consult_requests for each row execute function public.consulta_guard();

alter table public.consult_requests enable row level security;
drop policy if exists "consultas: partes leem" on public.consult_requests;
create policy "consultas: partes leem" on public.consult_requests for select using (auth.uid() in (cliente_id, consultor_id));
drop policy if exists "consultas: cliente pede" on public.consult_requests;
create policy "consultas: cliente pede" on public.consult_requests for insert with check (cliente_id = auth.uid());
drop policy if exists "consultas: partes atualizam" on public.consult_requests;
create policy "consultas: partes atualizam" on public.consult_requests for update using (auth.uid() in (cliente_id, consultor_id));
