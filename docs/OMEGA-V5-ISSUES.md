# OMEGA V5 — issues P0–P3

> Encontrados por auditoria de código, medição e navegador nesta sessão. Status conforme V5 §16.1.

| ID | Sev | Problema | Causa | Correção / commit | Status |
|---|---|---|---|---|---|
| SIM-1 | **P0** | Simulador dizia "cabe no orçamento" comparando orçamento sem moeda com custo **em terra** em USD; sem origem, sem passagem, sem câmbio | Fórmula local no componente | `simulador.js` (3 camadas, mesma moeda/escopo, câmbio com fonte/data) — `375e71f` | PASS |
| SIM-2 | P1 | Top 3 ignorava o orçamento (com R$ 18 mil, 3 destinos "acima") | Ranking só por perfil | `ordenarPorOrcamento` estável — `375e71f` | PASS |
| SIM-3 | P2 | "Por que sim" em português com a interface em en/es/ja | Texto pronto no motor | Motor devolve `motivos` estruturados; UI traduz — `375e71f` | PASS |
| IMG-1 | P1 | Último recurso de foto = Machu Picchu para qualquer país | `FOTO_ULTIMO` | Placeholder honesto — `d985117` | PASS |
| IMG-2 | P1 | 6 capas sem licença verificada (5 eram arquivos locais da Wikipédia de prédios sem liberdade de panorama) | `fotoQuery` em edifícios modernos do Golfo | Trocadas por patrimônio/paisagem com licença Commons — `43f568b` | PASS (205/205) |
| IMG-3 | P1 | Foto que falha antes da hidratação ficava quebrada (ícone + alt) | `onError` não dispara antes do React | `Foto` confere `naturalWidth` na montagem — `b91fcfe` | PASS (DST-11) |
| IMG-4 | P2 | Cookie de terceiro `WMF-Uniq` (Lighthouse boas práticas 79) | CDN Wikimedia grava cookie | `crossOrigin="anonymous"` só para upload.wikimedia.org (CORS `*` verificado) | PASS (boas práticas 79 → 100) |
| NAV-1 | P1 | Barra inferior móvel não montada; sem Viagens/Hoje | Componente órfão | Barra adaptativa com "Hoje" contextual, safe area, ≥44 px — `d985117` | PASS |
| PERF-1 | P1 | MapLibre (~270 KB gz) executava 2,2 s no carregamento do Explorar | `requestIdleCallback` ainda dentro da janela | Prévia SVG + carga sob interação (EXP-10) — `52b33fd` | PASS |
| PERF-2 | P1 | Catálogo de 205 países no bundle da Home | `utils.js` → `data.js` (MESES_PT) — **regressão introduzida no F1 e corrigida no F10** | `meses.js` leve — `52b33fd` | PASS |
| PERF-3 | P1 | SDK do Supabase (58 KB gz) no Destino para anônimos | `usePlano`, `cambioClient` → `services.js` | Sessão salva ⇒ SDK sob demanda; `cambioRede.js` — `52b33fd` | PASS |
| PERF-4 | P2 | Dicionários dos 4 idiomas no bundle de todos | i18n monolítico | `i18n/{pt,en,es,ja}.js`, só pt no bundle — `52b33fd` | PASS |
| MAP-1 | P2 | Mapa com estilo genérico (positron/dark) | Estilo base sem marca | Paleta MERIDIANO via paint (tiles/atribuição intactos) — `f9662a2` | PASS |
| UX-1 | P2 | Título do hero "descia" quando o simulador crescia | `items-end` | Coluna fixa (sticky) — `375e71f` | PASS |
| UX-2 | P3 | Seletor "Mês" truncado ("Qual") em 1440 px | Grade 6 col | Redistribuição — `375e71f` | PASS |
| PERF-5 | P2 | Lighthouse mobile ≥ 90 não atingido em Home/Destino (≈ 80) | Simulação Lantern soma o runtime React/Next (~150 KB gz) e a foto do hero; LCP real (CPU 4×) = 0,8–1,0 s | Documentado em PERFORMANCE | PASS_WITH_LIMITATIONS |
| OPS-1 | P2 | Sem observabilidade (Sentry/OTel), SLO e alertas | Fora do código atual | — | BLOCKED_EXTERNAL (conta/contrato) |
| QA-1 | P2 | Sem teste em iPhone/Android físicos e leitor de tela real | Hardware/sessão humana | — | NÃO AVALIADO |

Nenhum P0 aberto ao fim da sessão. P1 abertos: nenhum no código; limitações externas listadas em PROVIDER-BLOCKERS.
