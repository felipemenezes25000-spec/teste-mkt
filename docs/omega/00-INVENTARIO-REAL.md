# 00 — Inventário real (V3 §5)

> Estado ao fim da sessão de 2026-10-09. Colunas exigidas: recurso · caminho · status · evidência · risco · prioridade · dependências · próxima ação.

| Recurso | Caminho | Status | Evidência | Risco | Prioridade | Dependências | Próxima ação |
|---|---|---|---|---|---|---|---|
| Catálogo de 205 países | `app/_engine/data.js`, `paisesMundo.js` | TESTED | contagem por script (BASELINE) | dados de jun/2026 envelhecem | P2 | pesquisa | regerar semestralmente |
| Preços de atrações (2.871) | `app/_engine/atracoesPrecos.js` | IMPLEMENTED (HISTORICAL) | selo nos blocos de preço | lido como preço atual | P1 | provedor de experiências | contratar Viator/GYG |
| Coordenadas canônicas | `app/_data/geo/lugares.json` | LIVE | script + mapa | ponto ≠ entrada | P2 | Wikipedia/Wikidata | entradas OSM |
| Serviço de mídia | `app/_lib/media.js` | LIVE | auditoria 205/205 | política Wikimedia muda | P1 | Commons | monitorar 4xx |
| Domínio (dinheiro/frescor/reserva/fuso/provider/rotas) | `app/_domain/*` | TESTED | 28 testes + tsc | — | P0 | — | estender para quotes reais |
| Banco + RLS | `supabase/migrations/*` | TESTED | 34/34 RLS | migrations não aplicadas no projeto | P0 | Supabase do dono | aplicar e ligar sync |
| Webhook Stripe | `app/api/stripe/webhook` | TESTED | 6 testes | chaves ausentes | P1 | Stripe | sandbox com chaves |
| Identidade visual | `app/_ui/*`, `globals.css` | TESTED | QA 7×2×19 | gosto subjetivo | P2 | — | revisão do dono |
| Home | `app/(marketing)/page.jsx` | TESTED | QA | — | P2 | — | A/B do CTA |
| World Explorer | `app/(marketing)/explorar` | TESTED | QA + mapa | OpenFreeMap sem SLA | P2 | OpenFreeMap | self-host de tiles se escalar |
| Destino | `app/(marketing)/destino/[slug]` | TESTED | QA 4 destinos | muitas chamadas externas por página | P2 | Wikipedia | pré-gerar mais destinos |
| Decisão/Comparar | `decisao`, `comparar` | TESTED | QA + neutralidade | — | P2 | — | — |
| Custo real | `custo-real` | TESTED | QA | estimativa lida como cotação | P2 | — | — |
| Voos | `voos`, `_lib/flights.js` | PROVIDER_READY | cenários sem marca | — | P1 | Duffel/Travelpayouts | contrato |
| Roteiro com IA | `roteiro`, `/api/ai` | PROVIDER_READY | — | custo de IA | P2 | chave LLM | cota por plano |
| Planner multi-país | `planejar`, `_engine/App.jsx` | TESTED | QA | componente grande (36 KB) | P3 | — | dividir |
| Trip workspace | `viagens/*` | TESTED | E2E 12/12 | só no aparelho sem conta | P1 | Supabase | sync |
| Modo Viagem | `viagens/[id]/hoje` | TESTED | E2E | Open-Meteo não comercial | P1 | contrato Open-Meteo | contratar |
| Rotas reais | `_lib/roteamento.js` | LIVE | E2E LIVE | 1 req/s | P1 | FOSSGIS | OSRM próprio |
| Provedores/fontes | `_lib/provedores.js`, `/fontes` | TESTED | página + matriz | — | P2 | — | atualizar a cada integração |
| Saída rastreada | `/api/out` | TESTED | testes anti-redirect | — | P2 | IDs de afiliado | cadastrar programas |
| SEO | `sitemap.js`, `robots.js`, OG | TESTED | build | — | P3 | — | i18n de rotas |
| Segurança HTTP | `_lib/security.mjs` | TESTED | testes | `unsafe-inline` | P2 | — | CSP com nonce |
| QA/E2E | `scripts/qa-telas.mjs`, `scripts/e2e-viagem.mjs` | TESTED | relatórios em `_proof` | — | P1 | Playwright | rodar em CI |
| B2B/white-label/API/creators | — | DEFERRED_WITH_REASON | — | — | P3 | modelo comercial | fase futura |
