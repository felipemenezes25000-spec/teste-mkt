# Image coverage report

## Mídia HD do redesign CALÇADÃO (2026-10-09)

> Gerada por `scripts/midia/gerar-midia.mjs` a partir de metadados da Wikimedia Commons (índices de
> `scripts/midia/indice-midia*.mjs` e `indice-cidades.mjs`). Nada é baixado para o repositório além das bandeiras;
> fotos e vídeos são servidos pelo CDN da Wikimedia em larguras padrão, com autor, licença e link.

| Métrica | Valor |
|---|---|
| Países no catálogo | 205 |
| Bandeira oficial (Commons, servida em `public/bandeiras`, 0,44 MB) | 205 (100%) |
| Capa HD de lugar real do país (foto de atração, do artigo do país ou de cidade) | 193 (94%) |
| Sem capa verificável → a **bandeira oficial é a arte** (nunca foto de outro lugar) | 12: AG, BB, CW, SZ, KW, CF, DJ, LR, MH, FM, NR, KN |
| Países com vídeo curado (conferido um a um; sem militar, discurso, satélite, bicho fora de contexto) | 82 (87 vídeos) |
| Atrações do catálogo base com foto HD da Commons | 972 de 2.004 (933 arquivos) |

Licenças das capas: CC BY-SA 3.0 (62), CC BY-SA 4.0 (51), CC BY 2.0 (19), domínio público (16), CC BY-SA 2.0 (13),
CC BY 2.5 (6), CC BY 3.0 (6), FAL (5), CC BY-SA 2.5 (4), CC BY 4.0 (3), CC0 (2), demais (6).

Filtros aplicados: arquivos que são bandeira, brasão, mapa, localizador, satélite, montagem, gravura ou SVG ficam
fora; 15 capas foram recusadas no olho (mapa, satélite, retrato, estátua borrada por direito autoral, homônimo
errado — ex.: Falmouth da Cornualha no lugar de Antígua). Vídeos acima de 12 MB usam a transcodificação 720p/480p
da própria Commons; todo vídeo tem pôster.

Limites honestos: 123 países não têm vídeo livre relevante na Commons — nesses a figurinha usa a foto HD; a
correspondência foto↔atração vem do verbete da Wikipédia pt (revisão humana feita só por amostragem).

---

# Histórico — cobertura anterior

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
