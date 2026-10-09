# OMEGA V4 — status por lote

> Branch `feat/omega-v4-foundation` · origem `846eea8` (main) · sessão de 2026-10-09.
> Status conforme V4 §42: `PASS` · `PASS_WITH_LIMITATIONS` · `BLOCKED_EXTERNAL` · `FAIL`.
> “100%” aqui = todo o inventário de fluxos examinado e classificado (V3 §4), não cobertura
> de todos os preços/fornecedores do planeta. Nada abaixo é autodeclarado sem evidência.

| Lote | Missão | Status | Evidência principal | O que falta / bloqueio |
|---|---|---|---|---|
| 0 | Recuperação, backup, diagnóstico, baseline | **PASS** | bundle `mundo-sem-fim-backups/…846eea8….bundle` verificado; `docs/BASELINE.md`; QA baseline `_proof/omega-v4-lote0-antes` | — |
| 1 | Foundations, segurança, banco, contratos | **PASS** | `app/_domain/*` (19 testes); `npm run test:rls` 76/76 em Postgres real; migrations aplicadas no Supabase `mundo-sem-fim` (sa-east-1); webhook Stripe com dedupe/ordem; CSP com nonce opcional; rate limit nas APIs | — |
| 2 | Identidade visual, tokens, componentes | **PASS** | `docs/BRAND-RATIONALE.md` (3 direções, contraste medido); tokens MERIDIANO; ~300 emojis-ícone → `Icon`; QA 390–1920 claro/escuro | Revisão humana de gosto (subjetiva) |
| 3 | Home, World Explorer, descoberta | **PASS** | Home com simulador no hero; `/explorar` mapa⇄lista, 3 camadas, URL compartilhável | — |
| 4 | Knowledge graph, fotos, POIs | **PASS_WITH_LIMITATIONS** | `docs/IMAGE-COVERAGE-REPORT.md` (205/205 capas, 97,1% licença verificada); `app/_lib/media.js`; foto ilustrativa rotulada; coordenadas 2.755/3.310 atrações + 1.063/1.181 cidades com QID | Revisão humana amostral foto↔POI; fotos de hotel/restaurante dependem de provedor |
| 5 | Decision engine, perfil, comparador | **PASS** | Teste de neutralidade (comissão fora do ranking); comparador com pesos ajustáveis e `?d=`; visto sem regra = “consultar” | — |
| 6 | RealCost, pricing, câmbio, budget | **PASS_WITH_LIMITATIONS** | Dinheiro em unidades menores (`money.js`); selos HISTÓRICO/RECENTE; câmbio com data; despesas multimoeda com taxa | Preços de atrações são referência jun/2026 (sem cotação viva) |
| 7 | Geo, mapas, rotas, otimizador | **PASS_WITH_LIMITATIONS** | Rota real OSRM/FOSSGIS (E2E: LIVE); otimizador com janelas/horário fixo e status; mapa do país | Transporte público só estimado (GTFS-RT exige contrato); FOSSGIS ≤ 1 req/s não escala |
| 8 | Voos, hotéis, experiências, restaurantes | **BLOCKED_EXTERNAL** | Registro de provedores com estados reais (`/fontes`, `docs/PROVIDER-MATRIX.md`); voos = cenários estimados sem marcas; DEEPLINK honesto | Chaves/contratos: Duffel/Travelpayouts, Expedia/Booking, Viator/GYG |
| 9 | Trip Workspace, reservas, documentos | **PASS** | `/viagens` local-first; reservas com máquina de estados; documentos com alerta de 6 meses; E2E 12/12; sync com a conta sobre o Supabase real | — |
| 10 | Trip Mode, offline, clima, Plano B | **PASS_WITH_LIMITATIONS** | `/viagens/[id]/hoje`; localização consentida; Plano B revisável; offline (E2E) | Open-Meteo gratuito é não comercial → contratar antes de lançar |
| 11 | Monetização, Stripe, afiliados, B2B, API | **PASS_WITH_LIMITATIONS** | `/api/out` com allowlist; B2B `/agencias` + white-label `/proposta`; API pública `/api/v1` (OpenAPI 3.1, chaves com hash); marketplace `/marketplace` (criadores/consultores); checkout nativo de produtos próprios (Trip Pass, roteiro, consultoria) — `docs/PLATAFORMA.md`; E2E 23/23 | Chaves Stripe (sem elas o checkout responde 503 honesto); Stripe Connect para repasse automático; revisão jurídica dos termos |
| 12 | SEO, conteúdo, idiomas, growth | **PASS_WITH_LIMITATIONS** | sitemap/robots (pessoais e propostas fora); 205 destinos pré-gerados (SSG) + 20 roteiros; telas novas em pt/en/es/ja com paridade testada | Conteúdo editorial longo (alertas, coleções) segue em pt-BR |
| 13 | QA global, segurança, red team, observabilidade | **PASS_WITH_LIMITATIONS** | QA tela a tela PASS (336/336 sem problema); axe 0 violações (21 rotas × 2 temas), teclado e zoom 200%; Firefox 157 e WebKit; Lighthouse mobile (home 79, destino 76); E2E 12/12 + 23/23 | Dispositivo real (iOS/Android) e monitoramento de produção (SLO/alertas) |
| 14 | Hardening, rollout, docs | **PASS** | docs §47 + `docs/PLATAFORMA.md`; Supabase `mundo-sem-fim` com migrations; deploy na Vercel (projeto `mundo-sem-fim`); `main` atualizada | — |

## Alegações antigas do README/docs × realidade

| Alegação | Realidade verificada | Ação |
|---|---|---|
| “205 países” | 205 (22 curados + 183 extras) | Confirmada |
| “2.871 atrações com preço” | 2.871 itens em `ATRACOES_PRECOS` (205 países) | Confirmada — são **referência jun/2026**, agora rotuladas HISTÓRICO |
| “1.483 cidades enriquecidas” | Catálogo de preços por cidade cobre 205 países; contagem de cidades com coordenada: 1.063/1.181 das cidades listadas por país | Mantida com ressalva |
| “Câmbio ao vivo” | Taxa de referência **diária** (open.er-api) | Corrigida para “câmbio do dia com fonte e data” |
| “Cada país vira rota estática” | 8 pré-renderizados + ISR sob demanda (1 dia) | Documentado |
| “Preços ao vivo · Aviasales/Viator” (`/preview-apis`) | Mockup com dados ilustrativos | Página removida |
| “Não temos comissão de hotel” (FAQ) | Links de afiliado existem | Texto corrigido (comissão declarada, fora do ranking) |
| Visto padrão “isento 90 dias” sem regra | Inventava política | Trocado por “consultar consulado” |
