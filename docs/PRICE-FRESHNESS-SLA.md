# Price & data freshness SLA

> Código: `app/_domain/evidence.js` (`freshnessEfetiva`), `app/_ui/SourceTrust.jsx`. V4 §22-25.

## Classes

| Classe | Rótulo | Quando |
|---|---|---|
| `LIVE` | Ao vivo | Consultado agora na fonte; **vale 10 min** (`LIVE_JANELA_MS`), depois vira RECENT automaticamente |
| `RECENT` | Recente | Obtido na fonte dentro da validade (ex.: câmbio do dia, até 48 h) |
| `ESTIMATE` | Estimativa | Calculado por modelo (custo da viagem, tempo de trajeto por distância, cenários de voo) |
| `HISTORICAL` | Histórico | Pesquisa de referência (catálogo jun/2026) ou dado vencido |
| `UNVERIFIED` | Não verificado | Sem fonte confiável (ex.: visto sem regra) |
| `UNAVAILABLE` | Indisponível | Fonte fora do ar / não cobre |

Regra: ESTIMATE/HISTORICAL/UNVERIFIED **nunca sobem** de classe; LIVE envelhece sozinho.

## Por tipo de dado (estado atual)

| Dado | Fonte | Classe exibida | Validade | Revalidação |
|---|---|---|---|---|
| Rota a pé/bike/carro | OSRM/FOSSGIS | LIVE | sessão | a cada mudança do dia/modo |
| Tempo de transporte público | modelo por distância | ESTIMATE | — | — |
| Previsão do tempo | Open-Meteo | LIVE (3 h) | 3 h | ao abrir o dia |
| Câmbio de referência | open.er-api / BCE (Frankfurter) | RECENT (com data) | 48 h | 2 h (cache local 12 h) |
| Custo diário por país | catálogo jun/2026 | HISTORICAL | — | regerar pesquisa |
| Preço de atração/ingresso | catálogo jun/2026 | HISTORICAL | — | regerar pesquisa / provedor contratado |
| Preço de voo | cenário por distância | ESTIMATE | — | provedor (KEY_REQUIRED) |
| Visto | compilação jun/2026 | HISTORICAL / UNVERIFIED | — | confirmar no consulado |
| Fotos | Commons (licença) | RECENT | 7 dias (cache) | automática |
| Coordenadas | Wikipedia/Wikidata | RECENT | por geração | `scripts/geo/geocodificar.mjs` |

## Preço entre seleção e checkout

Sem provedor transacional, não há checkout de viagem. Quando houver: toda `PriceQuote` com `revalidationRequired=true` deve ser recotada antes de `AWAITING_PAYMENT` (estado `PRICE_CHECK_REQUIRED` já existe na máquina de reservas).
