/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,jsx,ts,tsx,mdx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['var(--font-fraunces)', 'Georgia', 'serif'],
        sans: ['var(--font-hanken)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      colors: {
        paper: '#F4EDDE', paper2: '#ECE2CD', card: '#FFFDF7',
        ink: '#222D2B', inksoft: '#5A645F', line: '#E4D9C2',
        pine: '#0E5A4E', pinedk: '#0A453B',
        ochre: '#C98A2B', ochresoft: '#E6B45A',
        clay: '#B6452E', sage: '#2F7A57', amberx: '#B7791F',
      },
    },
  },
  plugins: [],
};
