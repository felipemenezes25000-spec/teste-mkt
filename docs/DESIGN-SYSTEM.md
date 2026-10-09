# Design system — CALÇADÃO (detalhe)

## Tokens (`app/_ui/tokens.css`)

Tema **sempre claro** (decisão do dono, 2026-10-09): não há `data-theme`, alternância nem script anti-flash.
Cores em triplas RGB (`rgb(var(--c-x) / <alpha-value>)` no Tailwind). Os nomes legados continuam como aliases
semânticos do código existente:

| Token | Valor | Papel |
|---|---|---|
| `paper` / `card` | `#FFFFFF` | fundo da página / superfícies |
| `paper-2` (`papel`) | `#F3F3F0` | blocos, faixas, quadro do placar |
| `ink` / `ink-soft` / `line` | `#111111` / `#55554F` / `#E3E3DD` | texto / secundário / divisórias |
| `pine` (`cobalto`) | `#1C3FD1` | rota, seleção, navegação, links |
| `coral` (`amarelo`), `ochre`, `solar` | `#FFC400` | próxima ação (sempre fundo, texto tinta) |
| `amarelo-dk` | `#B88A00` | degrau do botão álbum |
| `sage` (`verde`) / `success` | `#00804D` / `#006B40` | época boa, positivo (texto de selo pequeno mais escuro p/ AA) |
| `clay` (`risco`) / `danger` | `#C8281C` | alerta, risco |
| `amberx` / `warn` | `#9A5B00` | atenção (texto) |
| `rosa` | `#FF5A7A` | só decoração (azulejos) |

Fontes (`app/layout.jsx`, `next/font/google`): `--font-display` League Spartan 600–900, `--font-ui` Barlow 400–700,
`--font-cond` Barlow Condensed 600–900 (+ itálico). `font-mono`/`.coord` = condensada com números tabulares;
código de verdade usa `font-code`. Raios: sm 4 · DEFAULT 6 · md 8 · lg 12 · xl 16 · 2xl 20 · 3xl 28.

## Classes da marca (`app/globals.css`, em `@layer components`)

| Classe | Uso |
|---|---|
| `ms-btn` + `ms-btn-album` / `ms-btn-tinta` / `ms-btn-linha` (+ `ms-btn-sm`) | botões em pílula, Barlow Condensed caixa-alta; álbum = amarelo com degrau |
| `ms-rotulo`, `ms-titulo` | rótulo condensado espaçado; título League Spartan 800 |
| `ms-poema` | poema concreto (letras ondulam; `Poema.jsx`) |
| `ms-frase`, `ms-campo` | frase com lacunas (simulador da home) |
| `ms-placas`, `ms-placa`, `ms-rolaA/B` | placar de plaquinhas (`Placar.jsx`) |
| `ms-fig`, `ms-face`, `ms-foto`, `ms-num`, `ms-band`, `ms-nome`, `ms-pips`, `ms-tag`, `ms-brilho`, `ms-tras`, `ms-virar` | figurinha (`Figurinha.jsx`) |
| `ms-calcadao`, `ms-azulejo` | ondas do calçadão e azulejos |

Utilitários antigos mantidos e reestilizados: `eyebrow`, `coord`, `signal-dot` (amarelo), `photo-scrim`,
`route-line`, `skel`, `rise`, `focusring` (contorno cobalto 3 px). `prefers-reduced-motion` desliga ondas, placar,
brilho, poema e o vídeo da figurinha viva.

## Componentes

| Componente | Arquivo | Estados / regras |
|---|---|---|
| `Placar` | `_ui/Placar.jsx` | gira até o texto; regira quando o texto muda; `aria-label` com o valor real |
| `Figurinha` | `_ui/Figurinha.jsx` | foto HD / vídeo / bandeira como arte; brilho só na hora certa; selo "Alerta de viagem" (segurança ≤ 3); vira com botão (frente) e "↺" (verso), sem interativos aninhados; crédito no verso |
| `Azulejo`, `FaixaAzulejos` | `_ui/Azulejo.jsx` | 6 motivos × 5 cores, determinístico |
| `Calcadao` | `_ui/Calcadao.jsx` | ondas animadas no rodapé |
| `Poema` | `_ui/Poema.jsx` | texto inteiro no `aria-label` |
| `Marca`/`MarcaIcone` | `_ui/Marca.jsx` | quadrado de tinta com ondas e sol amarelo; wordmark "mundo sem fim" |
| `Button` | `_ui/Button.jsx` | primary (tinta) / secondary (contorno) / ghost / danger / accent (amarelo); sm/md/lg; loading |
| `Foto` | `_ui/Foto.jsx` | falha lembrada por URL (se a foto chega depois, aparece); ilustrativa; crédito © |
| `SourceTrust` | `_ui/SourceTrust.jsx` | 6 classes de frescor, texto + cor + fonte/data |
| `MapaInterativo` | `_components/mapa/MapaInterativo.jsx` | só claro; JS **e CSS** do MapLibre carregam ao ativar |
| `HeroDestino` / `FiguraViva` | `(marketing)/destino/[slug]/` | placar do destino, 12 meses em azulejos, vídeo/foto HD com crédito |
| `HomeCalcadao` | `_components/home/HomeCalcadao.jsx` | frase-simulador, leque, placar "partidas na hora certa", fileira do álbum, vitrine (mesmo cálculo de `/custo-real`) |
| `AlbumExplorar` | `(marketing)/explorar/AlbumExplorar.jsx` | 205 figurinhas, região/mês/só brilhantes/busca, pacotinho, mapa em `?vista=mapa` |
| `PlacarRota`, `FitaDoAno` | `_engine/components.jsx` | diagnóstico da rota em placar; fita proporcional aos dias por estação |

## Regras

Tema claro sempre · "hora certa" = época boa **e** segurança ≥ 4 · segurança ≤ 3 = "Alerta de viagem" ·
amarelo só como fundo (texto tinta) · cor nunca é o único sinal · fotos/vídeos sempre com autor, licença e link
da Commons · nunca foto de outro lugar sem rótulo "ilustrativa" · dados com selo de frescor · contraste AA medido
(axe: 0 violações nas rotas auditadas).
