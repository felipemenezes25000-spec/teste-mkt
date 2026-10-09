# Image coverage report

> Gerado por `scripts/midia/auditoria.mjs` em 2026-10-09 (requisições reais à Wikipedia/Commons). OMEGA V4 §11-13.

## Países (foto de capa)

| Métrica | Valor |
|---|---|
| Países no catálogo | 205 |
| Com foto de capa encontrada | 205 (100.0%) |
| …com licença livre verificada (Commons) | 205 (100.0%) |
| …sem licença verificável (fonte não-Commons ou metadado ausente) | 0 |
| Sem foto (fallback honesto “Sem foto verificada”) | 0 |

Licenças das capas verificadas: Public domain (53), CC BY-SA 3.0 (49), CC BY-SA 4.0 (40), CC BY 2.0 (15), CC BY-SA 2.0 (15), CC BY 3.0 (8), CC BY 4.0 (7), CC0 (4), FAL (4), CC BY 2.5 (3), CC BY-SA 2.5 (3), CC BY-SA 3.0 at (1), CC BY-SA 3.0 de (1), GFDL 1.2 (1), CC BY-SA 1.0 (1).




## Atrações

| Métrica | Valor |
|---|---|
| Atrações no catálogo consolidado | 3310 |
| Com URL de foto direta (override auditado) | 171 |
| …dessas, reaproveitadas para várias atrações → exibidas como **FOTO ILUSTRATIVA** | 72 |
| Demais | foto resolvida na página (verbete → Openverse → Commons → piso do país **rotulado ilustrativo**) |

## Regras aplicadas

- Thumbnails apenas em larguras padrão do Wikimedia; largura nunca maior que o original (evita 400/429).
- Autor e licença exibidos no botão © de cada foto resolvida pelo serviço de mídia (`app/_lib/media.js`).
- Foto que não é do lugar exato recebe o rótulo **FOTO ILUSTRATIVA · {país}**.
- Falha de carregamento → placeholder editorial “Foto indisponível” (nunca imagem genérica fingindo ser o lugar).

## Pendências

- Revisão humana amostral de correspondência foto↔POI para os destinos prioritários (o V4 pede amostragem humana; aqui foi automática + visual em Japão/Itália).
- Fotos de restaurantes/hotéis dependem de provedores contratados (ver docs/PROVIDER-MATRIX.md).
