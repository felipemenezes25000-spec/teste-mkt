// PWA manifest (Next App Router serve /manifest.webmanifest a partir daqui).
export default function manifest() {
  return {
    name: 'Mundo Sem Fim — o copiloto que decide a viagem',
    short_name: 'Mundo Sem Fim',
    description: 'Decide pra onde ir pelo seu perfil, mostra o custo real e monta o roteiro que recalcula. O mundo inteiro num app.',
    start_url: '/',
    display: 'standalone',
    background_color: '#070B14',
    theme_color: '#070B14',
    lang: 'pt-BR',
    icons: [
      { src: '/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
      { src: '/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
      { src: '/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
  };
}
