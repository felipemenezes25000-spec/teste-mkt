# Travel knowledge graph (estado atual)

> V4 §16-17 / V3 §32-33, §76-C.

## Entidades e IDs canônicos

| Entidade | ID interno | Crosswalk | Fonte | Cobertura |
|---|---|---|---|---|
| País | ISO 3166-1 alfa-2 (`JP`) + slug (`japao`) | Wikidata QID (22 curados + extras) | catálogo | 205 |
| Cidade | `cid:{ISO}:{slug}` | Wikidata QID | `app/_data/geo/lugares.json` | 1.063/1.181 com coordenada |
| Atração | `atr:{ISO}:{slug}` | Wikidata QID | idem | 2.755/3.310 com coordenada |
| Foto | `commons:{arquivo}` | Commons file page | `app/_lib/media.js` | ver IMAGE-COVERAGE-REPORT |
| Viagem/itinerário/reserva/despesa/documento | `trip_*`, `item_*`, `res_*`, `desp_*`, `doc_*` (local) e UUID (banco) | — | `/viagens` + migrations | — |

Nenhum ID externo é chave canônica: o QID é atributo de crosswalk.

## Precisão de localização

- `WIKIPEDIA_COORD` / `WIKIDATA_P625`: ponto representativo do artigo — **não** é a entrada praticável (dito na UI).
- Validação: distância ao país ≤ 2.500 km (≤ 9.000 km em países extensos/territórios dispersos); homônimos descartados (ex.: “Atenas” → Atenas, Costa Rica; corrigido via QID da página pt).
- Descartados ficam listados em `docs/plataforma/_dados/geo-descartados.txt`.

## Proveniência por fato

`app/_domain/evidence.js` (`Evidence`, `Fact<T>`, `freshnessEfetiva`). Catálogo de jun/2026 entra como `HISTORICAL` (`evidenciaCatalogo`). Coordenadas guardam `fonte`, `qid`, `precisao`, `obtidoEm`.

## Próximos passos

Entrada praticável (OSM `entrance=*`), horários de funcionamento (OSM `opening_hours`) e timezone por cidade — com licença ODbL e atribuição.
