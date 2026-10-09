# OMEGA V5 — release gates

| Gate | Comando / evidência | Resultado |
|---|---|---|
| Nenhum P0 aberto | `OMEGA-V5-ISSUES.md` | PASS |
| Lint · typecheck · testes | `npm run verify` | PASS — 0 erros · OK · 47 arquivos / 329 testes |
| RLS (Postgres real descartável) | `npm run test:rls` | PASS — 76/76 |
| Build de produção | `npm run build` | PASS — 258 páginas |
| E2E V5 | `node scripts/e2e-v5.mjs` | PASS — 27/27 |
| E2E jornada / plataforma | `e2e-viagem` / `e2e-plataforma` | PASS — 12/12 · 23/23 |
| QA tela a tela | `node scripts/qa-telas.mjs` (24 rotas × 7 larguras × 2 temas) | PASS — 336/336 sem problema |
| Boas práticas (Lighthouse) | Home | PASS — 79 → 100 (sem cookie de terceiro) |
| Firefox | puppeteer + Firefox 157 (21 rotas × 2 temas) | PASS — 42/42 |
| Acessibilidade | `node scripts/a11y.mjs` | PASS — 0 violações, teclado, zoom 200% |
| Imagens | `node scripts/midia/auditoria.mjs` | PASS — 205/205 capas com licença verificada |
| Performance lab ≥ 90 | Lighthouse mobile mediana de 3 | PARCIAL — Viagens 90; Explorar 85; Decisão 84; Home 80; Destino 77 |
| RUM p75 | — | NÃO AVALIADO (sem instrumentação/consentimento/tráfego) |
| Dispositivo físico / leitor de tela | — | NÃO AVALIADO |
| Providers live (voo/hotel/experiência/Stripe/IA) | `OMEGA-V5-PROVIDER-BLOCKERS.md` | BLOCKED_EXTERNAL |
| Observabilidade / rollback ensaiado | — | BLOCKED_EXTERNAL |

**Veredito:** liberável como produto de descoberta/planejamento honesto (sem P0); **não** liberável
como plataforma de reservas "live" nem com alegação "10/10 validado".
