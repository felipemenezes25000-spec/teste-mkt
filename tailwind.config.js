/** @type {import('tailwindcss').Config} */
// Cores tema-áveis: cada token vira rgb(var(--c-x) / <alpha-value>), então os
// utilitários com opacidade (bg-pine/5, border-ochre/40, bg-paper/80) funcionam,
// e o dark mode é só reescrever as triplas RGB em _ui/tokens.css.
const c = (v) => `rgb(var(${v}) / <alpha-value>)`;

module.exports = {
  content: ['./app/**/*.{js,jsx,ts,tsx,mdx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['var(--font-fraunces)', 'Georgia', 'serif'],
        sans: ['var(--font-hanken)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      colors: {
        paper: c('--c-paper'), paper2: c('--c-paper-2'), card: c('--c-card'),
        ink: c('--c-ink'), inksoft: c('--c-ink-soft'), line: c('--c-line'),
        pine: c('--c-pine'), pinedk: c('--c-pine-dk'),
        ochre: c('--c-ochre'), ochresoft: c('--c-ochre-soft'), clay: c('--c-clay'),
        sage: c('--c-sage'), amberx: c('--c-amberx'),
        input: c('--c-input'), onochre: c('--c-on-ochre'),
        success: c('--c-success'), 'success-bg': c('--c-success-bg'), 'success-bd': c('--c-success-bd'),
        warn: c('--c-warn'), 'warn-bg': c('--c-warn-bg'), 'warn-bd': c('--c-warn-bd'),
        danger: c('--c-danger'), 'danger-bg': c('--c-danger-bg'), 'danger-bd': c('--c-danger-bd'),
      },
    },
  },
  plugins: [],
};
