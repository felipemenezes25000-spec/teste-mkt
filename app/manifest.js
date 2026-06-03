// PWA manifest (Next App Router serve /manifest.webmanifest a partir daqui).
export default function manifest() {
  return {
    name: 'Mundo Sem Fim — Planejador de viagem',
    short_name: 'Mundo Sem Fim',
    description: 'Planeje a ordem dos países por estação, visto e fôlego de grana.',
    start_url: '/',
    display: 'standalone',
    background_color: '#F4EDDE',
    theme_color: '#0E5A4E',
    lang: 'pt-BR',
  };
}
