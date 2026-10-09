/** @type {import('tailwindcss').Config} */
// MERIDIANO (docs/BRAND-RATIONALE.md). Cores tema-áveis: cada token vira
// rgb(var(--c-x) / <alpha-value>), então bg-pine/10, border-ochre/40 etc. funcionam
// e o dark mode é só reescrever as triplas RGB em _ui/tokens.css.
const c = (v) => `rgb(var(${v}) / <alpha-value>)`;

module.exports = {
  content: ['./app/**/*.{js,jsx,ts,tsx,mdx}'],
  theme: {
    extend: {
      fontFamily: {
        // Display: Bricolage Grotesque (títulos, expressiva, tracking negativo)
        display: ['var(--font-display)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        // UI: Geist (texto, controles)
        sans: ['var(--font-ui)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        // Dados: Geist Mono (coordenadas, preços tabulares, códigos IATA)
        mono: ['var(--font-mono)', 'ui-monospace', 'SFMono-Regular', 'monospace'],
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
      },
      // Raios de instrumento: mais nítidos que o padrão do Tailwind
      borderRadius: {
        sm: '3px', DEFAULT: '4px', md: '5px', lg: '6px', xl: '8px', '2xl': '12px', '3xl': '16px',
      },
      letterSpacing: { tightest: '-.045em', tighter: '-.03em' },
      boxShadow: { e1: 'var(--e-1)', e2: 'var(--e-2)' },
    },
  },
  plugins: [],
};
