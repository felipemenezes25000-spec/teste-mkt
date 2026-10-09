# Design system — MERIDIANO (detalhe)

## Tokens (`app/_ui/tokens.css`)

Cor (triplas RGB, tema por `[data-theme="dark"]`): `paper`, `paper-2`, `card`, `input`, `ink`, `ink-soft`, `line`,
`pine` (meridiano), `pine-dk`, `on-pine`, `coral` (lima), `on-coral`, `ochre`/`solar` (âmbar), `amberx` (âmbar-texto),
`clay` (infravermelho), `sage` (mar), semânticas `success|warn|danger` (+ `-bg`, `-bd`). Aliases novos no Tailwind:
`meridiano`, `lima`, `ambar`, `infra`, `mar`.

Espaço 4/8 (`--s-1…8`), raios 3–16 px, elevação `shadow-e1/e2`, movimento 160–320 ms, alvo de toque 44 px.
`data-theme="dark"` pode ser aplicado a um trecho (hero, Modo Viagem) para reaproveitar o tema escuro localmente.

## Utilitários de assinatura (`app/globals.css`)

`eyebrow` (mono caixa-alta), `coord` (coordenada tabular), `signal-dot` (ponto lima pulsante), `photo-scrim`
(legibilidade sobre foto), `route-line`, `skel`, `rise`, `focusring`. `prefers-reduced-motion` desliga animações.

## Componentes

| Componente | Arquivo | Estados |
|---|---|---|
| `Icon` | `_ui/Icon.jsx` | ~120 glifos; `emoji=` mapeia legado; sempre `aria-hidden` (texto ao lado) |
| `Foto` | `_ui/Foto.jsx` | carregando, erro (placeholder honesto), ilustrativa (rótulo), crédito (©) |
| `SourceTrust` | `_ui/SourceTrust.jsx` | 6 classes de frescor, texto + cor + título com fonte/data |
| `Marca`/`MarcaIcone` | `_ui/Marca.jsx` | com/sem wordmark |
| `Button` | `_ui/Button.jsx` | primary/secondary/ghost/danger/accent; sm/md/lg; loading/disabled |
| `MapaInterativo` | `_components/mapa/MapaInterativo.jsx` | carregando, pronto, erro; seleção/hover; linhas reais e estimadas; tema |
| `MapaPais` | `_components/mapa/MapaPais.jsx` | vazio honesto (sem coordenadas), filtro, detalhe |
| `DestinoCard` | `_components/DestinoCard.jsx` | foto/fallback, score, custos, referência rotulada |

## Regras

Sem emoji como ícone · cor nunca é o único sinal · lima só como fundo (texto tinta) · fotos sempre com crédito ·
dados sempre com selo · nada de glassmorphism decorativo · contraste AA medido.
