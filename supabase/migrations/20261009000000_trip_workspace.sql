-- ============================================================================
-- OMEGA V4 · Lote 1/9 — Trip Workspace, colaboração, reservas, despesas,
-- documentos, alertas, idempotência de webhooks e ledger de afiliados.
-- Princípios: RLS em TODAS as tabelas; autorização por papel na viagem
-- (owner/editor/viewer); dinheiro em unidades menores (bigint) + ISO 4217;
-- horário local + IANA timezone; CONFIRMED só por fonte confiável.
-- ============================================================================

-- ---------- Correções de segurança herdadas ----------
-- profiles.plano era editável pelo próprio usuário (policy de update) → qualquer
-- leitura futura dessa coluna viraria bypass de assinatura. A fonte de verdade é
-- public.subscriptions (escrita só pelo service role). Travamos a coluna.
alter table public.profiles drop constraint if exists profiles_plano_check;
alter table public.profiles add constraint profiles_plano_check check (plano in ('free','premium','pro'));

create or replace function public.bloqueia_plano_cliente() returns trigger
language plpgsql as $$
begin
  if new.plano is distinct from old.plano and coalesce(auth.role(), '') <> 'service_role' then
    raise exception 'plano só pode ser alterado pelo servidor (assinatura)' using errcode = '42501';
  end if;
  return new;
end; $$;
drop trigger if exists profiles_plano_guard on public.profiles;
create trigger profiles_plano_guard before update on public.profiles
  for each row execute function public.bloqueia_plano_cliente();

-- trips: campos novos do contrato V4 §76-G
alter table public.trips add column if not exists estado text not null default 'PLANNING'
  check (estado in ('DREAMING','PLANNING','BOOKING','READY','IN_PROGRESS','COMPLETED','ARCHIVED'));
alter table public.trips add column if not exists data_fim date;
alter table public.trips add column if not exists origem text;
alter table public.trips add column if not exists orcamento_minor bigint;
alter table public.trips add column if not exists local_id text unique; -- id local-first (sync do app)

-- ---------- Membros e papéis ----------
create table if not exists public.trip_members (
  trip_id uuid not null references public.trips(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  papel text not null check (papel in ('owner','editor','viewer')),
  convidado_por uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  primary key (trip_id, user_id)
);
create index if not exists trip_members_user_idx on public.trip_members(user_id);

-- O dono da viagem vira membro owner automaticamente.
create or replace function public.trip_owner_member() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  insert into public.trip_members (trip_id, user_id, papel) values (new.id, new.user_id, 'owner')
  on conflict (trip_id, user_id) do update set papel = 'owner';
  return new;
end; $$;
drop trigger if exists trips_owner_member on public.trips;
create trigger trips_owner_member after insert on public.trips
  for each row execute function public.trip_owner_member();

-- Papel do usuário atual na viagem (null = sem acesso). SECURITY DEFINER evita
-- recursão de RLS entre trips ↔ trip_members.
create or replace function public.papel_na_viagem(p_trip uuid) returns text
language sql stable security definer set search_path = public as $$
  select case
    when exists (select 1 from public.trips t where t.id = p_trip and t.user_id = auth.uid()) then 'owner'
    else (select m.papel from public.trip_members m where m.trip_id = p_trip and m.user_id = auth.uid())
  end
$$;
revoke all on function public.papel_na_viagem(uuid) from public;
grant execute on function public.papel_na_viagem(uuid) to anon, authenticated; -- anon recebe null → sem acesso

create or replace function public.pode_ler_viagem(p_trip uuid) returns boolean
language sql stable as $$ select public.papel_na_viagem(p_trip) is not null $$;
create or replace function public.pode_editar_viagem(p_trip uuid) returns boolean
language sql stable as $$ select public.papel_na_viagem(p_trip) in ('owner','editor') $$;

-- trips: dono faz tudo; membros leem; editores atualizam (mas não trocam o dono).
drop policy if exists "viagens próprias (all)" on public.trips;
create policy "trips: dono gerencia" on public.trips
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "trips: membros leem" on public.trips
  for select using (public.pode_ler_viagem(id));
create policy "trips: editores atualizam" on public.trips
  for update using (public.pode_editar_viagem(id)) with check (public.pode_editar_viagem(id));

create or replace function public.trip_dono_imutavel() returns trigger
language plpgsql as $$
begin
  if new.user_id is distinct from old.user_id then
    raise exception 'o dono da viagem não pode ser trocado' using errcode = '42501';
  end if;
  return new;
end; $$;
drop trigger if exists trips_dono_imutavel on public.trips;
create trigger trips_dono_imutavel before update on public.trips
  for each row execute function public.trip_dono_imutavel();

-- trip_legs passa a respeitar papéis
drop policy if exists "legs das minhas viagens (all)" on public.trip_legs;
create policy "legs: membros leem" on public.trip_legs for select using (public.pode_ler_viagem(trip_id));
create policy "legs: editores escrevem" on public.trip_legs for insert with check (public.pode_editar_viagem(trip_id));
create policy "legs: editores atualizam" on public.trip_legs for update using (public.pode_editar_viagem(trip_id)) with check (public.pode_editar_viagem(trip_id));
create policy "legs: editores apagam" on public.trip_legs for delete using (public.pode_editar_viagem(trip_id));

alter table public.trip_members enable row level security;
create policy "membros: participantes veem a lista" on public.trip_members
  for select using (public.pode_ler_viagem(trip_id));
-- só o dono convida/remove/muda papel; ninguém se auto-promove a owner
create policy "membros: dono convida" on public.trip_members
  for insert with check (public.papel_na_viagem(trip_id) = 'owner' and papel <> 'owner');
create policy "membros: dono altera" on public.trip_members
  for update using (public.papel_na_viagem(trip_id) = 'owner') with check (papel <> 'owner');
create policy "membros: dono remove ou o próprio sai" on public.trip_members
  for delete using (public.papel_na_viagem(trip_id) = 'owner' or user_id = auth.uid());

-- ---------- Itinerário ----------
create table if not exists public.itinerary_items (
  id uuid primary key default gen_random_uuid(),
  trip_id uuid not null references public.trips(id) on delete cascade,
  place_id text,                         -- ID canônico interno (ex.: atr:JP:fushimi-inari)
  titulo text not null check (char_length(titulo) between 1 and 200),
  dia date,
  local_start text check (local_start is null or local_start ~ '^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$'),
  local_end text check (local_end is null or local_end ~ '^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$'),
  time_zone text,
  fixed_time boolean not null default false,
  reservation_id uuid,
  estimated_cost_minor bigint,
  currency text check (currency is null or currency ~ '^[A-Z]{3}$'),
  lat double precision check (lat is null or lat between -90 and 90),
  lng double precision check (lng is null or lng between -180 and 180),
  ordem int not null default 0,
  notas text check (notas is null or char_length(notas) <= 4000),
  created_by uuid references auth.users(id) on delete set null default auth.uid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists itinerary_trip_idx on public.itinerary_items(trip_id, dia, ordem);
alter table public.itinerary_items enable row level security;
create policy "itinerário: membros leem" on public.itinerary_items for select using (public.pode_ler_viagem(trip_id));
create policy "itinerário: editores escrevem" on public.itinerary_items for insert with check (public.pode_editar_viagem(trip_id));
create policy "itinerário: editores atualizam" on public.itinerary_items for update using (public.pode_editar_viagem(trip_id)) with check (public.pode_editar_viagem(trip_id));
create policy "itinerário: editores apagam" on public.itinerary_items for delete using (public.pode_editar_viagem(trip_id));

-- ---------- Reservas (wallet) ----------
create table if not exists public.reservations (
  id uuid primary key default gen_random_uuid(),
  trip_id uuid not null references public.trips(id) on delete cascade,
  tipo text not null check (tipo in ('FLIGHT','LODGING','EXPERIENCE','TICKET','TRAIN','BUS','FERRY','TRANSFER','RESTAURANT','INSURANCE','ESIM','CAR','OTHER')),
  provider text not null check (char_length(provider) between 1 and 120),
  provider_booking_id text,
  modo text not null default 'DEEPLINK' check (modo in ('VIEW_ONLY','DEEPLINK','EMBEDDED','NATIVE_TRANSACTION')),
  status text not null default 'DRAFT' check (status in ('DRAFT','PRICE_CHECK_REQUIRED','AWAITING_PAYMENT','PENDING_PROVIDER','CONFIRMED','MODIFIED','CANCELLATION_PENDING','CANCELLED','REFUND_PENDING','REFUNDED','FAILED','UNKNOWN')),
  confirmed_by text check (confirmed_by in ('provider_webhook','reconciliation','import_verified','import_manual')),
  confirmed_at timestamptz,
  preco_minor bigint,
  currency text check (currency is null or currency ~ '^[A-Z]{3}$'),
  local_start text,
  local_end text,
  time_zone text,
  cancelamento_ate timestamptz,
  politica_cancelamento text check (politica_cancelamento is null or char_length(politica_cancelamento) <= 2000),
  localizador text check (localizador is null or char_length(localizador) <= 120),
  idempotency_key text unique,
  historico jsonb not null default '[]'::jsonb,
  created_by uuid references auth.users(id) on delete set null default auth.uid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint confirmada_tem_fonte check (status <> 'CONFIRMED' or confirmed_by is not null)
);
create index if not exists reservations_trip_idx on public.reservations(trip_id);
alter table public.reservations enable row level security;
create policy "reservas: membros leem" on public.reservations for select using (public.pode_ler_viagem(trip_id));
create policy "reservas: editores escrevem" on public.reservations for insert with check (public.pode_editar_viagem(trip_id));
create policy "reservas: editores atualizam" on public.reservations for update using (public.pode_editar_viagem(trip_id)) with check (public.pode_editar_viagem(trip_id));
create policy "reservas: editores apagam" on public.reservations for delete using (public.pode_editar_viagem(trip_id));

-- Cliente só pode declarar confirmação como "import_manual" (informada pelo
-- usuário). Fontes verificadas são exclusivas do servidor (service role).
create or replace function public.reserva_fonte_guard() returns trigger
language plpgsql as $$
begin
  if coalesce(auth.role(), '') <> 'service_role'
     and new.confirmed_by in ('provider_webhook','reconciliation','import_verified')
     and (tg_op = 'INSERT' or new.confirmed_by is distinct from old.confirmed_by) then
    raise exception 'confirmação verificada só pode ser gravada pelo servidor' using errcode = '42501';
  end if;
  new.updated_at := now();
  return new;
end; $$;
drop trigger if exists reservations_fonte_guard on public.reservations;
create trigger reservations_fonte_guard before insert or update on public.reservations
  for each row execute function public.reserva_fonte_guard();

alter table public.itinerary_items drop constraint if exists itinerary_reservation_fk;
alter table public.itinerary_items add constraint itinerary_reservation_fk
  foreign key (reservation_id) references public.reservations(id) on delete set null;

-- ---------- Despesas ----------
create table if not exists public.expenses (
  id uuid primary key default gen_random_uuid(),
  trip_id uuid not null references public.trips(id) on delete cascade,
  pago_por uuid references auth.users(id) on delete set null default auth.uid(),
  valor_minor bigint not null check (valor_minor >= 0),
  currency text not null check (currency ~ '^[A-Z]{3}$'),
  fx_rate numeric check (fx_rate is null or fx_rate > 0),
  fx_observado_em timestamptz,
  fx_fonte text,
  categoria text not null default 'OUTROS' check (categoria in ('HOSPEDAGEM','TRANSPORTE','ALIMENTACAO','ATRACOES','COMPRAS','SEGURO','DOCUMENTOS','COMUNICACAO','OUTROS')),
  descricao text check (descricao is null or char_length(descricao) <= 300),
  gasto_em date not null default current_date,
  rateio jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
create index if not exists expenses_trip_idx on public.expenses(trip_id, gasto_em);
alter table public.expenses enable row level security;
create policy "despesas: membros leem" on public.expenses for select using (public.pode_ler_viagem(trip_id));
create policy "despesas: editores lançam" on public.expenses for insert with check (public.pode_editar_viagem(trip_id));
create policy "despesas: editores atualizam" on public.expenses for update using (public.pode_editar_viagem(trip_id)) with check (public.pode_editar_viagem(trip_id));
create policy "despesas: editores apagam" on public.expenses for delete using (public.pode_editar_viagem(trip_id));

-- ---------- Documentos (sensíveis: só quem enviou + dono da viagem) ----------
create table if not exists public.trip_documents (
  id uuid primary key default gen_random_uuid(),
  trip_id uuid not null references public.trips(id) on delete cascade,
  owner_id uuid not null references auth.users(id) on delete cascade default auth.uid(),
  tipo text not null check (tipo in ('PASSAPORTE','VISTO','SEGURO','VACINA','VOUCHER','INGRESSO','CNH','OUTRO')),
  titulo text not null check (char_length(titulo) between 1 and 160),
  storage_path text,       -- bucket privado; nunca URL pública
  validade date,
  compartilhado boolean not null default false, -- se true, membros da viagem veem metadados
  created_at timestamptz not null default now()
);
alter table public.trip_documents enable row level security;
create policy "docs: dono do documento" on public.trip_documents
  for all using (owner_id = auth.uid()) with check (owner_id = auth.uid() and public.pode_ler_viagem(trip_id));
create policy "docs: membros veem compartilhados" on public.trip_documents
  for select using (compartilhado and public.pode_ler_viagem(trip_id));

-- ---------- Alertas ----------
create table if not exists public.trip_alerts (
  id uuid primary key default gen_random_uuid(),
  trip_id uuid not null references public.trips(id) on delete cascade,
  severidade text not null check (severidade in ('INFO','ATENCAO','CRITICO')),
  tipo text not null,
  titulo text not null check (char_length(titulo) <= 200),
  corpo text check (corpo is null or char_length(corpo) <= 4000),
  fonte text not null,
  fonte_url text,
  observado_em timestamptz not null default now(),
  resolvido_em timestamptz
);
alter table public.trip_alerts enable row level security;
create policy "alertas: membros leem" on public.trip_alerts for select using (public.pode_ler_viagem(trip_id));
create policy "alertas: editores resolvem" on public.trip_alerts for update using (public.pode_editar_viagem(trip_id)) with check (public.pode_editar_viagem(trip_id));
-- inserção de alertas: só servidor (service role)

-- ---------- Webhooks: deduplicação e ordenação ----------
create table if not exists public.stripe_events (
  id text primary key,                  -- evt_… do Stripe
  tipo text not null,
  criado_stripe timestamptz,            -- event.created
  recebido_em timestamptz not null default now(),
  processado_em timestamptz,
  erro text
);
alter table public.stripe_events enable row level security; -- sem policies: só service role

-- assinatura guarda o timestamp do último evento aplicado (descarta fora de ordem)
alter table public.subscriptions add column if not exists ultimo_evento_em timestamptz;

-- ---------- Afiliados: cliques e ledger de comissão ----------
create table if not exists public.affiliate_clicks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  anon_id text,
  provider text not null,
  produto text not null,
  destino_code text,
  host_destino text not null,
  pagina text,
  created_at timestamptz not null default now()
);
alter table public.affiliate_clicks enable row level security; -- escrita/leitura só servidor

create table if not exists public.commission_ledger (
  id uuid primary key default gen_random_uuid(),
  click_id uuid references public.affiliate_clicks(id) on delete set null,
  provider text not null,
  referencia_externa text,
  status text not null check (status in ('PENDING','APPROVED','PAID','REVERSED')),
  valor_minor bigint not null,
  currency text not null check (currency ~ '^[A-Z]{3}$'),
  observado_em timestamptz not null default now(),
  unique (provider, referencia_externa)
);
alter table public.commission_ledger enable row level security; -- só servidor

-- ---------- LGPD: exclusão de conta pelo próprio usuário ----------
create or replace function public.excluir_minha_conta() returns void
language plpgsql security definer set search_path = public, auth as $$
declare v uuid := auth.uid();
begin
  if v is null then raise exception 'não autenticado' using errcode = '42501'; end if;
  delete from auth.users where id = v; -- cascata remove profiles/trips/membros/docs/…
end; $$;
revoke all on function public.excluir_minha_conta() from public, anon;
grant execute on function public.excluir_minha_conta() to authenticated;
