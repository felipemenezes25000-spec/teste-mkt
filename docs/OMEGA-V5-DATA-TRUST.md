# OMEGA V5 — confiança nos dados

## Simulador da Home (P0 corrigido)

| Camada | Classe | Fonte | O que NÃO é |
|---|---|---|---|
| Custo em terra | ESTIMATE | custo/dia de referência jun/2026 × dias × viajantes × fator do estilo; faixa −15%/+25% | cotação de hotel |
| Passagem ida e volta | ESTIMATE (ilustrativa) | faixa por distância origem→destino (`estimarPrecoVoo`) | preço de companhia aérea |
| Total provável | ESTIMATE, `verificado: false` | terra + passagem + seguro/dia + 12% de reserva (premissas do RealCost) | preço final; exclui visto, bagagem extra, spread/IOF |
| Câmbio | RECENT | BCE/Frankfurter, fallback open.er-api, com **data** | taxa do cartão |

Regras: orçamento comparado na moeda escolhida (padrão por idioma: BRL/USD/EUR/JPY, seleção explícita
prevalece); sem origem → sem total e veredito "só o custo em terra"; sem câmbio → nenhuma conversão
inventada ("Câmbio indisponível: valores em US$"). Testes: `simulador.test.js` (HOME-01..07) e
`e2e-v5.mjs`.

## Imagens

- Capas: **205/205 com licença livre verificada** no Commons (`docs/IMAGE-COVERAGE-REPORT.md`, auditoria real).
- Atrações sem foto própria: foto do país rotulada **ilustrativa**; sem nenhuma foto: placeholder honesto
  (removido o fallback que mostrava Machu Picchu em outro país).
- Falha de CDN antes da hidratação vira placeholder (DST-11).

## Mapas e geo

- Pontos só com coordenada verificada (Wikidata/Wikipedia); rotas LIVE (OSRM) ou ESTIMATE tracejadas.
- Prévia do mapa usa as MESMAS coordenadas; o estilo MERIDIANO altera só cores.

## Pendências de verdade

- Revisão humana amostral foto↔POI (prioritários) — NÃO AVALIADA.
- Visto: só regras verificadas para passaporte brasileiro; demais "consultar".
- Preços de atrações são HISTÓRICO (jun/2026) até haver provedor.
