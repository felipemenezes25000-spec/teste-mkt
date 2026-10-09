# OMEGA V5 — matriz de rotas (§19)

Legenda de evidência: **QA** = `qa-telas.mjs` (7 larguras × 2 temas) · **A11y** = `a11y.mjs` (axe + teclado + zoom) ·
**FF** = Firefox 157 · **E2E-V/P/5** = e2e-viagem / e2e-plataforma / e2e-v5 · **U** = teste unitário.

| Rota | Estado no HEAD V5 | Evidência |
|---|---|---|
| `/` | PASS — simulador corrigido (P0) | QA · A11y · FF · E2E-5 (HOME-01..06, VIS-01, PER-06, SEC-03/08) · U |
| `/explorar` | PASS — prévia + mapa sob interação, paleta MERIDIANO | QA · A11y · FF · E2E-5 (EXP-04/09/10, ACC-03) |
| `/decisao` | PASS_WITH_LIMITATIONS — DEC-05/07 manuais | QA · A11y · FF · U (neutralidade) |
| `/comparar` | PASS | QA · A11y · FF |
| `/destino/[slug]` (205) | PASS — fotos licenciadas, placeholder honesto | QA · A11y · FF · E2E-5 (DST-03/09/14) |
| `/cidade`, `/bairro`, `/lugar` | NÃO IMPLEMENTADO — avaliado: sem dados próprios suficientes para páginas úteis (evita thin pages) | — |
| `/custo-real` | PASS | QA · A11y · FF |
| `/voos` | PASS_WITH_LIMITATIONS — cenários estimados sem marcas (sem provider) | QA · A11y · FF |
| `/roteiro` | PASS_WITH_LIMITATIONS — IA sem chave | QA · A11y · FF |
| `/planejar` | PASS | QA · A11y · FF |
| `/viagens`, `/viagens/[id]`, `/viagens/[id]/hoje` | PASS | QA · A11y · FF · E2E-V 12/12 |
| `/salvos`, `/conta`, `/planos`, `/fontes`, `/offline` | PASS | QA · A11y · FF |
| `/agencias`, `/proposta` | PASS | QA · A11y · FF · E2E-P · RLS |
| `/marketplace`, `/marketplace/r/[slug]`, `/marketplace/c/[slug]` | PASS (sem criadores fictícios) | QA · A11y · FF · E2E-P · RLS |
| `/desenvolvedores`, `/api/v1/*` | PASS_WITH_LIMITATIONS — firewall Vercel desafia scripts | QA · E2E-P · U |
| `/api/out` | PASS | E2E-5 COM-01 · U |
| `/api/stripe/checkout`, `/api/stripe/webhook` | PASS (sem chave → 503) | E2E-5 COM-03 · U |
| `/api/ai` | BLOCKED_EXTERNAL (sem chave) | U (cota) |
| `/api/me/plan`, `/api/me/export` | PASS | U · RLS |
| `/api/health`, `/api/lugares/[code]`, `/api/fotos` | PASS | produção 200 |
| 404 | PASS | QA (`/rota-que-nao-existe`) |
| Navegação global / barra móvel | PASS | QA · A11y · U (`viagemDoMomento`) |
| PWA / service worker | PASS_WITH_LIMITATIONS — offline do Modo Viagem testado; download seletivo de viagem não implementado | E2E-V |
| Notificações / e-mail | NÃO IMPLEMENTADO | — |
| Admin / ops | NÃO IMPLEMENTADO (depende de observabilidade) | — |
