# Travel capabilities (matriz rastreável)

> Estados V3 §4: `NOT_MAPPED · MAPPED · DESIGNED · IMPLEMENTED · TESTED · PROVIDER_READY · LIVE · DEGRADED · BLOCKED_EXTERNAL · DEFERRED_WITH_REASON`.

| Capacidade | Estado | Arquivo | Evidência |
|---|---|---|---|
| Descobrir destinos no mapa com camadas | TESTED | `app/(marketing)/explorar/*`, `_components/mapa/MapaInterativo.jsx` | QA + screenshot mapa |
| Recomendação pelo perfil (Top N, porquê) | TESTED | `_engine/decisao.js` | testes + QA |
| Neutralidade do ranking | TESTED | `_engine/neutralidade.test.js` | teste |
| Comparar 2–4 destinos com pesos | TESTED | `comparar/CompararClient.jsx` | QA |
| Custo real com frescor | TESTED | `custo-real`, `SourceTrust` | QA |
| Fotos reais com licença | LIVE | `_lib/media.js` | auditoria 205/205 |
| Coordenadas canônicas | LIVE | `_data/geo/lugares.json` | script + mapa |
| Mapa do país (atrações/cidades) | TESTED | `MapaPais.jsx` | screenshot Itália |
| Rota real a pé/bike/carro | LIVE | `_lib/roteamento.js` | E2E (LIVE) |
| Transporte público em tempo real | BLOCKED_EXTERNAL | — | requer GTFS-RT/contrato |
| Otimizador do dia (janelas, fixo, status) | TESTED | `_domain/rotas.js` | 9 testes + E2E |
| Workspace de viagem (local-first) | TESTED | `viagens/*`, `_lib/viagens/store.js` | 7 testes + E2E |
| Reservas (wallet) com status honesto | TESTED | `_domain/booking.js` | testes + E2E |
| Despesas multimoeda com taxa/data | TESTED | `_lib/fx.js` | E2E (JPY→BRL) |
| Documentos e alerta de validade | TESTED | `store.js` | testes + E2E |
| Modo Viagem (próximo passo, hora de sair, GPS) | TESTED | `viagens/[id]/hoje` | E2E |
| Clima e Plano B | LIVE (não comercial) | `_lib/clima.js` | API real |
| Offline | TESTED | `public/sw.js`, localStorage | E2E offline |
| Busca de voos real | BLOCKED_EXTERNAL | `_lib/flights.js` (cenários) | KEY_REQUIRED |
| Hotéis/experiências reserváveis | BLOCKED_EXTERNAL | DEEPLINK | contrato |
| Assinaturas | PROVIDER_READY | Stripe | testes webhook |
| Sync de viagens com conta | PROVIDER_READY | migrations + RLS | 34 casos RLS |
| Atribuição de afiliados | IMPLEMENTED | `/api/out` | testes anti-redirect |
| IA de roteiro | PROVIDER_READY | `/api/ai` | KEY_REQUIRED |
| B2B / white-label / API pública / creators | DEFERRED_WITH_REASON | — | ver OMEGA-V4-EXECUTION |
| i18n das telas novas | DEFERRED_WITH_REASON | — | só pt-BR nesta sessão |
