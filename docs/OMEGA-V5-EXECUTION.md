# OMEGA V5 — execução por lote

> Branch `feat/omega-v5` a partir de `4da2bac` · 2026-10-09 · sem workflows (decisão do dono).
> Template V5 §16.2 resumido por lote; detalhes de cada problema em `OMEGA-V5-ISSUES.md`.

| Lote | Escopo | Commit(s) | Testes / evidência | Status |
|---|---|---|---|---|
| F0 | Baseline real, backup, reconciliação de docs | — | verify 313/313, build 258, Lighthouse baseline (`OMEGA-V5-BASELINE.md`) | PASS |
| F1 | Simulador da Home: moeda, origem, viajantes, 3 camadas, câmbio, Top 3 com orçamento, URL | `375e71f` | HOME-01..07 (unit) · HOME-01/02/03/05/06 (E2E) · revisão visual 1440/375, pt/en | PASS |
| F2 | Home e navegação | `375e71f`, `d985117` | hero com título fixo; barra móvel montada e adaptativa | PASS_WITH_LIMITATIONS (sem revisão humana de composição) |
| F3 | Cartografia | `52b33fd`, `f9662a2` | prévia SVG Natural Earth; paleta MERIDIANO claro/escuro; EXP-04/09/10 | PASS_WITH_LIMITATIONS (zoom país→POI sem camadas novas) |
| F4 | Destino/cidade/bairro/POI | — | navegação de seções já existia (DST-10); cidade/bairro/POI não criados para evitar thin pages | DEFERRED_WITH_REASON |
| F5 | Fotos e licenças | `d985117`, `43f568b`, `b91fcfe` | 205/205 capas verificadas; DST-03/11 | PASS |
| F6 | Planner / rota / otimização | — | inalterado; E2E 12/12 segue verde | PASS (V4) |
| F7 | Mobile / Modo Viagem | `d985117` | barra com "Hoje" contextual; teste `viagemDoMomento`; 320 px sem overflow | PASS_WITH_LIMITATIONS (sem aparelho físico) |
| F8 | Voos/hotéis/experiências/reservas | — | estados honestos revalidados (`PROVIDER-BLOCKERS`) | BLOCKED_EXTERNAL |
| F9 | Segurança/RLS/LGPD/API/B2B | — | RLS 76/76; SEC-03/08; COM-01/03 (`OMEGA-V5-SECURITY.md`) | PASS_WITH_LIMITATIONS |
| F10 | Performance | `52b33fd` + cookie Wikimedia | `OMEGA-V5-PERFORMANCE.md` (antes/depois, 3 execuções) | PASS_WITH_LIMITATIONS (lab < 90 em 2 rotas) |
| F11 | A11y/i18n/SEO | `52b33fd` | axe 0; 947 chaves × 4 idiomas; canonical/OG | PASS_WITH_LIMITATIONS (sem leitor de tela real) |
| F12 | Observabilidade/FinOps/release | — | não há Sentry/OTel/SLO | BLOCKED_EXTERNAL |
| F13 | QA adversarial | `b91fcfe` | e2e-v5 27/27, e2e-viagem 12/12, e2e-plataforma 23/23, QA 24 rotas × 7 × 2, Firefox 42/42 | PASS |
| F14 | Validação final e relatório | este conjunto de docs | `OMEGA-V5-QUALITY-SCORECARD.md` (706/1000) | PASS |

Rollback: cada lote é um commit isolado em `feat/omega-v5`; `git revert <sha>` desfaz um lote sem
afetar os demais. Backup completo pré-V5 em `mundo-sem-fim-backups/…4da2bac-v5-baseline.bundle`.
