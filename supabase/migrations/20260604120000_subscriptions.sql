-- Assinaturas: 1 linha por usuário, preenchida pelo webhook do Stripe (service role).
-- O cliente só LÊ a própria (RLS); escrita é exclusiva do servidor (service role).
create table if not exists public.subscriptions (
  user_id uuid primary key references auth.users(id) on delete cascade,
  plan text not null default 'free',
  status text not null default 'inactive',
  stripe_customer_id text,
  stripe_subscription_id text,
  current_period_end timestamptz,
  updated_at timestamptz not null default now()
);

create index if not exists subscriptions_stripe_sub_idx
  on public.subscriptions (stripe_subscription_id);

alter table public.subscriptions enable row level security;

-- Leitura: cada usuário vê só a própria assinatura.
drop policy if exists "ler propria assinatura" on public.subscriptions;
create policy "ler propria assinatura" on public.subscriptions
  for select using (auth.uid() = user_id);

-- Sem policy de INSERT/UPDATE/DELETE: só o service role (que ignora RLS) escreve.
