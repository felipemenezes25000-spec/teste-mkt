# Ligar a assinatura (Stripe) — passo a passo

O app funciona 100% sem Stripe (todo mundo fica no plano **grátis**). Para cobrar de verdade:

## 1. Banco (Supabase)
Aplique a migração `supabase/migrations/20260604120000_subscriptions.sql` (cria a tabela `subscriptions` + RLS). No painel do Supabase → SQL Editor, cole e rode o arquivo (ou use `supabase db push` se usar a CLI).

## 2. Stripe — produtos e preços
No painel do Stripe → **Products**, crie 2 produtos recorrentes (mensais) e copie os **Price IDs**:
- Premium → `price_...`
- Pro → `price_...`

## 3. Variáveis de ambiente (servidor — Vercel/Render)
```
STRIPE_SECRET_KEY=sk_live_...        # ou sk_test_ pra testar
STRIPE_WEBHOOK_SECRET=whsec_...      # do passo 4
STRIPE_PRICE_PREMIUM=price_...
STRIPE_PRICE_PRO=price_...
SUPABASE_SERVICE_ROLE_KEY=...        # já no .env.example; o webhook escreve com ela
NEXT_PUBLIC_SITE_URL=https://seu-dominio
```

## 4. Webhook
No Stripe → **Developers → Webhooks → Add endpoint**:
- URL: `https://seu-dominio/api/stripe/webhook`
- Eventos: `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`
- Copie o **Signing secret** (`whsec_...`) pra `STRIPE_WEBHOOK_SECRET`.

## 5. Pronto
- `/planos` → botão **Assinar** abre o Checkout do Stripe.
- Após pagar, o webhook grava o plano em `subscriptions` e `/api/me/plan` passa a devolver `premium`/`pro`.
- O `<Gate>` libera os recursos pagos automaticamente.

## Como testar antes de ligar
Em `/conta` há um **preview de planos (demo)** que só muda o que VOCÊ vê (localStorage), sem mexer na assinatura real — útil pra revisar o paywall.

## Onde a trava acontece
- **UX:** `<Gate>` / `useLibera()` (client) — esconde/mostra recurso.
- **Verdade:** `/api/me/plan` lê a `subscriptions` no servidor (service role) — o cliente não tem como forjar.
- Próximo passo de hardening (opcional): exigir plano no servidor também para gerar roteiro (hoje a defesa é o login + cota diária do `/api/ai`).
