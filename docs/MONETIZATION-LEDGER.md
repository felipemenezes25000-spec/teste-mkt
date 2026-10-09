# Monetization & attribution ledger

> V4 §39 / V3 §51-54. **A comissão nunca define o ranking** — garantido por `app/_engine/neutralidade.test.js` (os módulos de ranking não podem importar afiliados/links/planos, e o ranking é idêntico com/sem tags).

## Linhas de receita (estado)

| Linha | Estado | Mecanismo |
|---|---|---|
| Assinatura Premium/Pro | ADAPTER_READY | Stripe Checkout (`/api/stripe/checkout`) + webhook → `subscriptions`; entitlement lido no servidor (`/api/me/plan`) |
| Afiliados (Booking, Viator, GYG, Klook, Civitatis, Travelpayouts, Wise, SafetyWing) | ADAPTER_READY | Tag por env (`withAffiliate`) + saída rastreada `/api/out` |
| Trip Pass, família, B2B, white-label, API, creators | Não implementado | Fora desta sessão (ver OMEGA-V4-EXECUTION) |

## Fluxo de atribuição

1. Link de parceiro é montado com a tag (se configurada) e passa por `/api/out?to=…&p=…&k=…`.
2. `/api/out` valida o host (allowlist https), grava `affiliate_clicks {provider, produto, host_destino, pagina, destino_code}` (sem IP) e redireciona (302, `no-referrer`).
3. Conversões/comissões chegam do painel do parceiro e entram em `commission_ledger` com `status PENDING → APPROVED → PAID | REVERSED`, único por `(provider, referencia_externa)` (idempotente).
4. Ledger e cliques são **somente servidor** (RLS sem policies; testado).

## Métricas

- cliques por provedor/produto/página (`affiliate_clicks`)
- comissões por status e por viagem (`commission_ledger.click_id`)
- ROI por viagem = comissões aprovadas ÷ custo de aquisição (fora do app)

## Pendências do dono

Cadastro nos programas e envio dos IDs (`NEXT_PUBLIC_AFF_*`), chaves Stripe e `STRIPE_PRICE_*`, rotina de importação dos relatórios de comissão.
