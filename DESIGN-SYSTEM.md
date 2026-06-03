# Design System — Mundo Sem Fim

Fonte única da verdade para visual e componentes. Objetivo: consistência, acessibilidade e velocidade ao crescer para as telas do MVP.

## Tokens (`app/_ui/tokens.css`)
- **Cor de marca:** `--c-paper`, `--c-card`, `--c-ink`, `--c-ink-soft`, `--c-line`, `--c-pine`, `--c-ochre`, `--c-clay`.
- **Semânticas de status:** `--c-success(-bg/-bd)`, `--c-warn(-bg/-bd)`, `--c-danger(-bg/-bd)` — pares texto/fundo/borda com contraste AA.
- **Espaço:** `--s-1..6` (escala 4/8). **Raio:** `--r-sm..xl`, `--r-full`. **Elevação:** `--e-1`, `--e-2`. **Motion:** `--motion(-fast)`, `--ease`.
- Tipografia via `next/font`: display *Fraunces* (`.font-display` / `--font-fraunces`), UI *Hanken Grotesk* (`--font-hanken`).
- Cores também expostas no Tailwind (`tailwind.config.js`) como `pine`, `ochre`, `paper`, etc.

## Componentes (`app/_ui/`)
| Componente | Uso | Estados |
|---|---|---|
| `Button` | ações | variant: primary/secondary/ghost/danger/accent · size: sm/md/lg · `loading` · `disabled` |
| `Badge` | selos de status | tone: neutral/success/warn/danger |
| `Modal` | diálogos | role=dialog, Esc, **focus trap**, foco inicial, restaura foco, `footer` |
| `EmptyState` | telas/listas vazias | `icon`, `title`, descrição, `action` (CTA) |
| `Skeleton` *(classe `.skel`)* | loading | — |

### Exemplos
```jsx
import { Button } from './_ui/Button.jsx';
<Button variant="accent" loading={otimizando}>🧭 Otimizar rota</Button>

import { Badge } from './_ui/Badge.jsx';
<Badge tone="danger">Fura o visto</Badge>

import { Modal } from './_ui/Modal.jsx';
<Modal title="IA & Configurações" onClose={fechar} footer={<Button variant="secondary" onClick={fechar}>Fechar</Button>}>…</Modal>
```

## Regras
- **Nunca** cor como único sinal de status — sempre acompanhar rótulo/ícone.
- Áreas de toque ≥ 44×44px no mobile.
- Todo ícone-botão precisa de `aria-label`.
- Respeitar `prefers-reduced-motion` (já no globals).
- Novos componentes entram aqui (com estados documentados) antes de serem usados nas telas.

## Próximos (roadmap DS)
`Field` (label+input+erro+ajuda com `aria-describedby`), `Select`, `Tabs/Nav` (para o MVP multi-tela), `MapPin` acessível, `Toast` com "desfazer", e migração progressiva de `TrechoCard`/`Tripe`/`App` para os primitivos. Meta: Storybook como documentação viva.
