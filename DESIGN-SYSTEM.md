# Design system — CALÇADÃO

> Racional e decisões: `docs/BRAND-RATIONALE.md`. Detalhes de tokens e componentes: `docs/DESIGN-SYSTEM.md`.

- Tokens: `app/_ui/tokens.css` (tema **sempre claro**: branco, papel `#F3F3F0`, tinta `#111`, cobalto `#1C3FD1`,
  amarelo-álbum `#FFC400`, verde `#00804D`, risco `#C8281C`, rosa `#FF5A7A`), Tailwind em `tailwind.config.js`.
- Tipografia: League Spartan (títulos e poema) · Barlow (texto) · Barlow Condensed (rótulos, placar, figurinhas).
- Objetos da marca: `Placar`, `Figurinha`, `Azulejo`/`FaixaAzulejos`, `Calcadao`, `Poema`, `Marca` (`app/_ui`).
- Primitivos: `Button`, `Badge`, `Modal`, `Tabs`, `EmptyState`; domínio: `Icon`, `Foto`, `SourceTrust`,
  `MapaInterativo`, `MapaPais`, `DestinoCard`.
- Mídia: `app/_lib/midia.js` (capas HD, vídeos curados, fotos de atrações, bandeiras), dados gerados em
  `app/_data/midia.js` por `scripts/midia/gerar-midia.mjs`.
