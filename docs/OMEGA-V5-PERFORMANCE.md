# OMEGA V5 — performance (F10)

## Método

- Build de produção local, `next start`, Lighthouse 12.8.2 mobile (Moto G Power emulado, 4G simulado,
  CPU 4×), **mediana de 3 execuções** por rota (a variação observada entre execuções foi de 5–10 pontos).
- Medição complementar em navegador real (Playwright/Chromium, CPU 4× via CDP, sem throttling de rede):
  `PerformanceObserver('largest-contentful-paint')`.
- Peso de JS = soma gzip dos chunks `<script>` que o HTML da rota carrega.

## Antes × depois

| Rota | Perf antes | Perf depois (3 execuções) | LCP lab antes → depois | JS gz antes → depois |
|---|---:|---|---|---|
| `/` | 75 | 79 · 79 · 80 | 5,3 s → 4,8 s | 301 → **238 KB** |
| `/explorar` | 70 | 85 · 84 · 85 | 4,6 s → 3,9–4,5 s | 300 (MapLibre fora do carregamento) |
| `/destino/japao` | 75 | 77 · 76 · 80 | 6,3 s → 5,3–6,1 s | 361 → **235 KB** |
| `/viagens` | 75 | 90 · 89 · 90 | 4,5 s → 3,6 s | 287 KB |
| `/decisao` | — | 84 · 80 · 86 | 3,6–4,6 s | 303 KB |

LCP **real** no navegador com CPU 4×: `/viagens` 0,79 s · `/` 0,96 s · `/destino/japao` 0,79 s.

## Causas encontradas e corrigidas

1. **MapLibre (~270 KB gz, 2,2 s de execução)** carregava no Explorar mesmo sem uso → prévia SVG
   (contorno Natural Earth 110m + pontos reais) e carregamento ao interagir; seleção vinda da lista
   também ativa. Workspace/planejador mantêm carga por ociosidade (mapa é o conteúdo principal).
2. **Catálogo de 205 países** entrava na Home por `utils.js → data.js` só por `MESES_PT`
   (regressão criada no F1) → `meses.js`.
3. **SDK do Supabase** no Destino para visitantes anônimos (`usePlano`, `cambioClient → services.js`)
   → só baixa com sessão salva; câmbio em `cambioRede.js` sem dependências.
4. **Dicionários dos 4 idiomas** em todas as páginas → `i18n/{pt,en,es,ja}.js`, só pt no bundle.
5. `ProvaSocial`, `FavoriteButton` e `AddToRouteButton` puxavam catálogo/motor → número vem do
   servidor; motor carrega no clique.
6. Cookie de terceiro do Wikimedia (`WMF-Uniq`) → `crossOrigin="anonymous"` nas fotos do
   `upload.wikimedia.org` (CORS `*` conferido com curl). Boas práticas da Home: 79 → **100**.

## Meta ≥ 90 — por que não em todas as rotas

O lab (Lantern) estima o LCP somando o download/execução de todo JS pedido antes da pintura.
O runtime React 19 + Next 16 sozinho soma ~150 KB gz, e a foto do hero (960 px, ~190 KB)
compete pela mesma banda simulada. No navegador real o LCP fica abaixo de 1 s. Próximos passos com
ganho real: (a) servir as fotos do hero em AVIF/WebP pelo próprio domínio (exige orçamento de
otimização de imagem da Vercel ou CDN própria), (b) RUM de campo com consentimento para medir p75
de verdade (sem tráfego/consentimento hoje → **NÃO AVALIADO**).

## Budgets propostos (por rota, gzip)

| Recurso | Budget | Atual |
|---|---|---|
| JS inicial | ≤ 250 KB | Home 238 · Destino 235 · Explorar 300 · Viagens 287 |
| Imagem LCP | ≤ 200 KB | ~190 KB |
| Requisições de mapa antes da interação | 0 | 0 (EXP-10) |
