# Privacy & security

> V4 §33-35, §44 · V3 §61-64.

## Controles implementados e testados

| Controle | Onde | Evidência |
|---|---|---|
| RLS em todas as tabelas; papéis owner/editor/viewer; anti-IDOR | `supabase/migrations/*` | `npm run test:rls` → 34/34 (Postgres real) |
| Dono da viagem imutável; ninguém cria segundo owner nem se autopromove | triggers/policies | casos RLS |
| Plano/assinatura não editáveis pelo cliente | trigger `profiles_plano_guard`; `subscriptions` só service role | casos RLS |
| Confirmação verificada de reserva só pelo servidor | trigger `reserva_fonte_guard` | casos RLS |
| Documentos privados (só dono; membros só veem se compartilhado) | `trip_documents` | casos RLS |
| Exclusão de conta (LGPD) com cascata | `excluir_minha_conta()` | caso RLS |
| Webhook Stripe: HMAC, tolerância 5 min, múltiplos v1, dedupe, ordem | `app/_lib/stripeWebhook.js`, rota | `stripeWebhook.test.js` |
| Sem open redirect em links de parceiro | `app/_lib/saida.js`, `/api/out` | `saida.test.js` |
| Preview de planos desligado em produção | `usePlano.js` | revisão + build |
| CSP com allowlist de origens; `frame-ancestors 'none'`; nosniff; Referrer-Policy; HSTS em deploy | `app/_lib/security.mjs` | `security.test.js` |
| Geolocalização só com permissão do site e ação explícita; nada enviado ao servidor | Permissions-Policy `geolocation=(self)`; Modo Viagem | E2E |
| Documentos de viagem: só metadados (sem número, sem imagem) | `/viagens` | código |
| Segredos: nenhum no histórico | gitleaks (4 falsos positivos) | Lote 0 |
| Dependências | `npm audit --omit=dev` → 0 | Lote 1 |
| IA só para usuário logado, com cota diária atômica | `/api/ai`, `consumir_ia` | caso RLS (anon não consome) |

## Dados pessoais

| Dado | Onde fica | Minimização |
|---|---|---|
| Viagens, roteiro, reservas, despesas, documentos (metadados) | **dispositivo** (localStorage) | sem sync sem conta; exclusão local pela UI |
| Posição GPS | memória da página | não persistida; usada só para distância/rota |
| Conta/assinatura | Supabase (quando configurado) | RLS; exclusão pelo próprio usuário |
| Cliques de afiliado | `affiliate_clicks` (servidor) | sem IP; só provedor, produto, host e página |

## Pendências conhecidas

- CSP ainda com `'unsafe-inline'` em scripts (exigência do App Router sem nonce); migrar para nonce quando o custo de render dinâmico for aceitável.
- Rate limit genérico de API (além da cota de IA) não configurado — depende da plataforma de deploy.
- Exportação de dados (LGPD art. 18) pela UI: viagens podem ser lidas/removidas localmente; export JSON existe no planner; export unificado da conta pendente.
