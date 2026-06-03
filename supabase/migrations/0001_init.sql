-- ============================================================================
-- Mundo Sem Fim — schema inicial (Supabase / Postgres)
-- Aplique no projeto Supabase (project_ref vemfwnhjdzscqqthegvh) via:
--   - SQL Editor do dashboard, OU
--   - supabase db push (CLI), OU
--   - o MCP do Supabase depois de autenticado.
-- RLS LIGADO: cada usuário só enxerga/edita os próprios dados.
-- ============================================================================

-- Perfil (1:1 com auth.users)
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  nome text,
  idioma text default 'pt-BR',
  passaporte text default 'BR',
  plano text default 'free' check (plano in ('free','premium')),
  preferencias jsonb default '{}'::jsonb,
  created_at timestamptz default now()
);

-- Viagem
create table if not exists public.trips (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  titulo text default 'Minha viagem',
  moeda_base text default 'USD',
  orcamento numeric default 0,
  data_inicio date,
  passaporte text default 'BR',
  fx jsonb default '{}'::jsonb,          -- snapshot de câmbio
  ai jsonb default '{}'::jsonb,          -- config de IA (SEM apiKey — chave fica no servidor)
  updated_at timestamptz default now(),
  created_at timestamptz default now()
);
create index if not exists trips_user_idx on public.trips(user_id);

-- Trechos (legs) da viagem
create table if not exists public.trip_legs (
  id uuid primary key default gen_random_uuid(),
  trip_id uuid not null references public.trips(id) on delete cascade,
  ordem int not null default 0,
  code text,                -- código do país de referência (ex.: TH) ou null p/ custom
  dados jsonb not null default '{}'::jsonb,  -- nome, dias, custoDia, moeda, transporte, visto*, melhoresMeses, etc.
  created_at timestamptz default now()
);
create index if not exists trip_legs_trip_idx on public.trip_legs(trip_id, ordem);

-- updated_at automático em trips
create or replace function public.touch_updated_at() returns trigger
language plpgsql as $$ begin new.updated_at = now(); return new; end; $$;
drop trigger if exists trips_touch on public.trips;
create trigger trips_touch before update on public.trips
  for each row execute function public.touch_updated_at();

-- Cria profile ao registrar usuário
create or replace function public.handle_new_user() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, nome) values (new.id, new.raw_user_meta_data->>'name')
  on conflict (id) do nothing;
  return new;
end; $$;
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users
  for each row execute function public.handle_new_user();

-- ===== RLS =====
alter table public.profiles  enable row level security;
alter table public.trips     enable row level security;
alter table public.trip_legs enable row level security;

create policy "perfil próprio (select)" on public.profiles for select using (auth.uid() = id);
create policy "perfil próprio (update)" on public.profiles for update using (auth.uid() = id);
create policy "perfil próprio (insert)" on public.profiles for insert with check (auth.uid() = id);

create policy "viagens próprias (all)" on public.trips
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- legs acessíveis se a viagem-pai é do usuário
create policy "legs das minhas viagens (all)" on public.trip_legs
  for all using (exists (select 1 from public.trips t where t.id = trip_legs.trip_id and t.user_id = auth.uid()))
  with check (exists (select 1 from public.trips t where t.id = trip_legs.trip_id and t.user_id = auth.uid()));
