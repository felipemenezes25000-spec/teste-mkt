# Brand rationale — identidade MERIDIANO

> OMEGA V4 §7-10 · Lote 2 · 2026-10-09. Substitui integralmente a identidade anterior
> (papel creme, verde-pinho, ocre, Fraunces/Hanken, emojis como ícones), rejeitada pelo
> dono do produto.

## 1. O problema da identidade anterior

| Sintoma | Por que falhava |
|---|---|
| Papel creme + verde-pinho + ocre | Lia como "caderno de viagem artesanal": simpático, mas genérico e sem autoridade para dinheiro, mapa e risco. |
| Fraunces (serifada) em todos os títulos | Editorial demais para um produto que precisa parecer **instrumento** de decisão. |
| ~750 linhas com emoji como ícone | Proibido pelo V4 §7; inconsistente entre sistemas, sem controle de cor/tamanho/contraste. |
| Coral como CTA e ocre como destaque | Pouca distinção entre "próxima ação", "alerta" e "dado". |

## 2. Três direções avaliadas

| Critério (V4 §8) | A · **Meridiano** (escolhida) | B · Aurora | C · Carimbo |
|---|---|---|---|
| Conceito | Instrumento de navegação: carta náutica, graticule, coordenadas, sinal lima | Céu polar: degradês índigo/teal, brilho | Passaporte: papel, carimbos vermelho/azul |
| Personalidade de marca | Precisa, confiante, moderna | Sonhadora, etérea | Nostálgica, artesanal |
| Distinção visual (vs. Booking/Airbnb/Google) | **Alta** — lima sobre tinta não existe em travel | Média — degradês viraram clichê de IA | Baixa — próxima da identidade rejeitada |
| Emoção de viagem | Fotografia faz a emoção; a UI faz a precisão | Alta, mas compete com a foto | Alta, mas datada |
| Legibilidade de mapa | **Alta** — azul meridiano para rota, lima para "você está aqui" | Baixa — fundo degradê polui camadas | Média |
| Legibilidade financeira | **Alta** — mono tabular, neutros frios | Média | Média |
| Semântica de alerta | Clara — âmbar (atenção), infravermelho (risco), separados do CTA | Confusa com o degradê | Vermelho do carimbo colide com risco |
| Light/dark | Os dois nativos; hero sempre escuro | Só funciona no escuro | Só funciona no claro |
| Internacionalização | Sem metáfora cultural específica | Neutra | Ligada a carimbo/passaporte |

**Decisão:** Meridiano. É a única que separa com nitidez **emoção** (fotografia real),
**decisão** (neutros + mono) e **orientação** (azul/lima), como o V3 §21 pede.

## 3. Sistema

### Cor (tokens em `app/_ui/tokens.css`)

| Papel | Light | Dark | Uso |
|---|---|---|---|
| Papel polar / Noite atlas | `#F3F5F8` | `#070B14` | fundo |
| Card | `#FFFFFF` | `#0F1626` | superfícies |
| Tinta | `#0A1020` | `#EAF0FA` | texto principal |
| Tinta suave | `#4B5567` | `#98A3B8` | secundário |
| **Meridiano** (alias `pine`) | `#2742F5` | `#7D8FFF` | rota, seleção, links, foco |
| **Lima** (alias `coral`) | `#C8FA3C` | `#C8FA3C` | **somente** fundo da próxima ação; texto sempre tinta |
| Âmbar (alias `ochre/solar`) | `#FFB224` | `#FFB224` | destaque/economia/atenção suave (fundo) |
| Infravermelho (alias `clay`) | `#D12C1F` | `#FF7A6B` | risco/urgência |
| Mar (alias `sage`) | `#0A7F70` | `#40D6BA` | positivo como acento |

Os nomes legados (`pine`, `coral`, `ochre`…) foram mantidos como **aliases semânticos**
para migrar ~1.500 usos sem big-bang; nomes novos (`meridiano`, `lima`, `ambar`, `infra`,
`mar`) existem no Tailwind para código novo.

### Contraste medido (WCAG 2.2)

| Par | Razão | Resultado |
|---|---|---|
| Branco sobre Meridiano (light) | 6.60 | AA |
| Meridiano sobre papel (texto) | 6.04 | AA |
| Tinta suave sobre papel | 6.88 | AA |
| Tinta sobre Lima | 15.52 | AAA |
| Meridiano dark (texto) sobre noite | 6.79 | AA |
| Texto `on-pine` (noite) sobre Meridiano dark | 6.79 | AA |
| Sucesso / Atenção / Perigo (light) | 4.80 / 5.76 / 5.54 | AA |
| Sucesso / Atenção / Perigo (dark) | 9.72 / 9.19 / 7.78 | AAA |

Regra: cor **nunca** é o único sinal — selos têm texto (`SourceTrust`) e ícone.

### Tipografia

| Família | Papel | Por quê |
|---|---|---|
| **Bricolage Grotesque** 500/700/800 | Display (títulos, nomes de lugar) | Grotesca expressiva com ótica variável; tracking negativo dá presença sem serifa editorial. |
| **Geist** | UI e texto | Neutra, legível em densidade alta, ótima em formulários. |
| **Geist Mono** 400/500 | Dados: coordenadas, preços, códigos IATA, selos | Números tabulares; reforça o "instrumento". |

Três fontes, cada uma com função; carregadas por `next/font` (self-hosted, `display: swap`).

### Assinaturas reconhecíveis sem logotipo

1. **Graticule** — meridianos/paralelos a 96 px no fundo (4,5% de opacidade).
2. **Coordenadas** em mono junto ao nome do lugar (`35.68° N · 139.69° E`).
3. **Ponto lima** — o "você está aqui / próxima ação" (marca, CTA, sinal pulsante).
4. **Selos de frescor** — `AO VIVO · ESTIMATIVA · HISTÓRICO · NÃO VERIFICADO`.
5. **Fotografia real com crédito** (`©` no canto) e rótulo **FOTO ILUSTRATIVA** quando não é do lugar exato.

### Forma, elevação e movimento

- Raios de instrumento: 3–16 px (antes 16–24 px "bolha").
- Elevação plana com borda nítida (`--e-1/--e-2`); sem glassmorphism decorativo (blur só na barra fixa e sobre foto).
- Movimento curto (160–320 ms, `cubic-bezier(.2,.8,.2,1)`); `prefers-reduced-motion` desliga animações.

### Marca

Globo (círculo + meridiano) sobre quadrado tinta, com o ponto lima da próxima parada —
`app/icon.svg`, `app/_ui/Marca.jsx`, `app/_lib/brand.jsx` (PWA e cards sociais).

### Ícones

`app/_ui/Icon.jsx` — ~120 glifos de linha próprios (grid 24, traço 1.75), cobrindo
transporte, lugares, dinheiro, documentos, clima, estados e ações. Emojis legados de
dados são mapeados (`<Icon emoji="✈️" />`). Codemods em `scripts/codemods/`.

## 4. Trade-offs aceitos

- **Lima é estreita**: só funciona como fundo (texto tinta). Texto lima apenas sobre foto/escuro.
- **Azul muda de tom no dark** (`#2742F5` → `#7D8FFF`) para servir de texto; por isso botões azuis usam `text-onpine`.
- **Aliases legados** convivem com nomes novos até a migração completa do código antigo.
