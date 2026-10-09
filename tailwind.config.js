/** @type {import('tailwindcss').Config} */
// CALÇADÃO (tema sempre claro). Cada token vira rgb(var(--c-x) / <alpha-value>),
// então bg-pine/10, border-ochre/40 etc. funcionam; as triplas RGB ficam em _ui/tokens.css.
const c = (v) => `rgb(var(${v}) / <alpha-value>)`;

module.exports = {
  content: ['./app/**/*.{js,jsx,ts,tsx,mdx}'],
  theme: {
    extend: {
      fontFamily: {
        // Display: League Spartan (títulos, poema concreto, números grandes)
        display: ['var(--font-display)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        // UI: Barlow (texto, controles)
        sans: ['var(--font-ui)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        // Condensada: Barlow Condensed (rótulos, navegação, placar, figurinhas)
        cond: ['var(--font-cond)', 'var(--font-ui)', 'sans-serif'],
        // "mono" = dados tabulares (preço, código IATA) na condensada; código de verdade usa font-code
        mono: ['var(--font-cond)', 'var(--font-ui)', 'sans-serif'],
        code: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Consolas', 'monospace'],
      },
      colors: {
        paper: c('--c-paper'), paper2: c('--c-paper-2'), card: c('--c-card'),
        ink: c('--c-ink'), inksoft: c('--c-ink-soft'), line: c('--c-line'),
        // nomes semânticos novos (aliases dos legados)
        meridiano: c('--c-pine'), lima: c('--c-coral'), ambar: c('--c-ochre'), infra: c('--c-clay'), mar: c('--c-sage'),
        pine: c('--c-pine'), pinedk: c('--c-pine-dk'), onpine: c('--c-on-pine'),
        ochre: c('--c-ochre'), ochresoft: c('--c-ochre-soft'), clay: c('--c-clay'),
        sage: c('--c-sage'), amberx: c('--c-amberx'),
        coral: c('--c-coral'), oncoral: c('--c-on-coral'),
        solar: c('--c-solar'), onsolar: c('--c-on-solar'),
        input: c('--c-input'), onochre: c('--c-on-ochre'),
        success: c('--c-success'), 'success-bg': c('--c-success-bg'), 'success-bd': c('--c-success-bd'),
        warn: c('--c-warn'), 'warn-bg': c('--c-warn-bg'), 'warn-bd': c('--c-warn-bd'),
        danger: c('--c-danger'), 'danger-bg': c('--c-danger-bg'), 'danger-bd': c('--c-danger-bd'),
        // nomes da marca Calçadão
        cobalto: c('--c-pine'), amarelo: c('--c-coral'), amarelodk: c('--c-amarelo-dk'), verde: c('--c-sage'),
        risco: c('--c-clay'), rosa: c('--c-rosa'), papel: c('--c-paper-2'),
      },
      // Raios de figurinha/azulejo: cantos macios
      borderRadius: {
        sm: '4px', DEFAULT: '6px', md: '8px', lg: '12px', xl: '16px', '2xl': '20px', '3xl': '28px',
      },
      letterSpacing: { tightest: '-.045em', tighter: '-.03em' },
      boxShadow: { e1: 'var(--e-1)', e2: 'var(--e-2)' },
    },
  },
  plugins: [],
};
