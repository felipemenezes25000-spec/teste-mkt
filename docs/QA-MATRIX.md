# QA matrix

> Ferramenta: `scripts/qa-telas.mjs` (Playwright, Chromium, WebGL por software). Coleta por combinação: status HTTP,
> erros de console, exceções, requests falhos, overflow horizontal (com elemento culpado), imagens quebradas e
> screenshots. Evidências em `docs/plataforma/_proof/` (não versionado).

## Rodadas

| Rodada | Build | Combinações | Com problema | Principais achados → correção |
|---|---|---|---|---|
| Lote 0 (antes) | Next 14 original | 68 (17 rotas × 390/1440 × 2 temas) | 20 | Fotos Wikimedia quebradas (400/429) → larguras padrão + `media.js` |
| L13-r1 | Next 16 + MERIDIANO | 76 | 16 | Header 390 transbordando; aviso de sprite no mapa escuro → wordmark oculto < 400px; `styleimagemissing` |
| L13-r2 | | 228 (19 × 6 larguras × 2) | 36 | Header transbordando em 768/1280 → busca compacta < 2xl, ícones de link só ≥ xl |
| L13-r3 | | 266 (19 × 7 larguras incl. 1024 × 2) | 8 | Foto original sem redimensionar em `/decisao` → `fotoCapa` + `media.js` + `<Foto>` |
| L13-r4/r5 | final | rotas corrigidas × 7 × 2 | **0** | — |

Resultado final da fase 1: **266/266 combinações sem problema detectado** (19 rotas × 320/390/768/1024/1280/1440/1920 × claro/escuro).

| Fase 2 (i18n + plataforma) | build final | 24 rotas × 7 larguras × 2 temas (Chromium) | PASS (336/336 sem problema) | rotas novas: marketplace, roteiro, agências, desenvolvedores, proposta |

## Outras verificações

| Verificação | Resultado |
|---|---|
| E2E jornada Japão 14 dias (`scripts/e2e-viagem.mjs`) — dev e produção | 12/12 (rota LIVE, otimizador, reserva, JPY→BRL, alerta de passaporte, Modo Viagem, GPS, offline) |
| Mapa renderizado (explorar claro/escuro, Itália, roteiro de Quioto) | inspecionado em screenshot |
| Revisão visual humana-assistida (pranchas 1440 claro/escuro e 390 escuro) | sem quebras; ajustes de UX aplicados (salvos, comparar, planner, 404) |

| Firefox 157 (puppeteer) e WebKit (Playwright) | 0 problemas reais (WebKit: só cancelamento de tiles do mapa, ruído) |
| axe-core (21 rotas × 2 temas), teclado, zoom 200% | 0 violações · OK · OK |
| Lighthouse mobile (4G simulado) | home 79 · explorar 75 · destino 76 (era 39) |
| E2E plataforma (`scripts/e2e-plataforma.mjs`) | 23/23 |
| i18n en/ja das telas novas (varredura de texto pt residual) | só conteúdo editorial longo segue em pt |

## Lacunas

iOS/Android físicos e leitor de tela real (NVDA/VoiceOver) não foram executados.
