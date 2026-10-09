# Privacy & security

> V4 §33-35, §44 · V3 §61-64.

## Controles implementados e testados

| Controle | Onde | Evidência |
|---|---|---|
| RLS em todas as tabelas; papéis owner/editor/viewer; anti-IDOR | `supabase/migrations/*` | `npm run test:rls` → 76/76 (Postgres real) |
| Organizações (owner/admin/agent), propostas, chaves de API, marketplace e compras com RLS | `20261009120000_plataforma.sql` | 41 casos RLS (ver `docs/PLATAFORMA.md`) |
| Visão pública da proposta sem custo, margem nem e-mail do cliente | RPC `proposta_publica` | caso RLS + E2E |
| Chave de API só como SHA-256; limite/escopo forçados; revogação definitiva | `api_keys` + `api_key_guard` | casos RLS |
| Compras só pelo servidor (webhook assinado), idempotentes por sessão Stripe | `purchases`, `compraDaSessao` | casos RLS + `stripeWebhook.test.js` |
| Rate limit por IP/rota nas APIs (429 + Retry-After) | `app/_lib/rateLimit.js` | `rateLimit.test.js`, E2E |
| CSP com nonce + `strict-dynamic` (opcional, `CSP_NONCE=1`) | `proxy.js`, `security.mjs` | `security.test.js`; QA no modo nonce |
| Exportação de dados (LGPD art. 18) e exclusão local/da conta pela UI | `MeusDados.jsx`, `/api/me/export` | `meusDados.test.js` |
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

- CSP padrão mantém `'unsafe-inline'` para preservar as páginas estáticas (CDN). O modo nonce (`CSP_NONCE=1`) remove isso ao custo de render dinâmico — escolha de produção documentada.
- Rate limit é em memória por instância; em escala horizontal, trocar o armazenamento por Redis/Upstash (mesma API).
- Repasse a criadores é manual até ativar Stripe Connect (KYC por criador).
