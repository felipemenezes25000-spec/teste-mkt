// Cabeçalhos de segurança HTTP. Função PURA (testável); next.config.mjs a chama com
// o ambiente atual.
//
// CSP × SSG: o App Router injeta ~7 inline <script> (self.__next_f.push) no HTML de
// páginas estáticas (RSC flight data). Sem nonce, 'unsafe-inline' é obrigatório para
// script-src — hash não serve porque adicionar hash faz CSP3 IGNORAR 'unsafe-inline',
// quebrando os scripts do Next.js. A migração exige middleware com nonce, o que força
// render dinâmico e inviabiliza ISR/SSG nos 205 destinos.
//   → Hash do themeInit (layout.jsx): sha256-caMvgfOMGKZQziYAaE6UNl41PseEusyxAlaBo83GMSo=
//     Guardado aqui para uso imediato quando migrar para nonce-based CSP.
//
// Mesmo com 'unsafe-inline', a CSP trava clickjacking, MIME-sniffing e restringe as
// origens de rede/imagem/iframe ao que o app de fato toca NO BROWSER.
//
// O que NÃO precisa entrar na CSP: deep-links de afiliado (Booking/Viator/…) são <a>
// target=_blank (navegação, não é regida por CSP) e o Stripe é fetch no SERVIDOR.

const WIKI = 'https://*.wikipedia.org https://*.wikimedia.org https://upload.wikimedia.org';
const SUPABASE = 'https://*.supabase.co';
const IA_BYOK = 'https://api.openai.com https://api.groq.com https://api.anthropic.com';
// PostHog carrega `array.js` (capture script) e envia eventos via XHR. O domínio
// us.i.posthog.com cobre script + ingestão; us-assets cobre alguns assets estáticos.
const POSTHOG = 'https://us.i.posthog.com https://us-assets.i.posthog.com';
// Provedores de dados abertos usados no browser (docs/PROVIDER-MATRIX.md):
// mapas (OpenFreeMap/OSM), rotas (OSRM), clima (Open-Meteo), câmbio (Frankfurter/BCE).
const MAPAS = 'https://tiles.openfreemap.org';
const ABERTOS = 'https://routing.openstreetmap.de https://router.project-osrm.org https://api.open-meteo.com https://archive-api.open-meteo.com https://api.frankfurter.dev https://api.frankfurter.app';

// Modo NONCE (CSP_NONCE=1): script-src sem 'unsafe-inline' — cada requisição recebe
// um nonce (proxy.js) e 'strict-dynamic' propaga confiança aos chunks do Next. Custo:
// todas as páginas passam a renderizar por requisição (sem SSG/ISR). Por isso é opt-in;
// o padrão mantém as 230 páginas estáticas (ver docs/PRIVACY-SECURITY.md).
export function buildSecurityHeaders({ production = true, vercel = false, nonce = null, semCsp = false } = {}) {
  const dev = !production;

  const scriptSrc = nonce
    ? [`'self'`, `'nonce-${nonce}'`, "'strict-dynamic'", POSTHOG, dev && "'unsafe-eval'"].filter(Boolean).join(' ')
    : ["'self'", "'unsafe-inline'", POSTHOG, dev && "'unsafe-eval'"].filter(Boolean).join(' ');
  const connectSrc = [
    "'self'", SUPABASE, 'wss://*.supabase.co',
    WIKI, 'https://query.wikidata.org', 'https://open.er-api.com', IA_BYOK, MAPAS, ABERTOS,
    POSTHOG,
    dev && 'ws:', dev && 'http://localhost:*',
  ].filter(Boolean).join(' ');

  const csp = [
    `default-src 'self'`,
    `base-uri 'self'`,
    `object-src 'none'`,
    `form-action 'self'`,
    `frame-ancestors 'none'`,
    `script-src ${scriptSrc}`,
    `style-src 'self' 'unsafe-inline'`,
    `font-src 'self'`,
    `worker-src 'self' blob:`,
    // Fotos de fontes livres (Wikimedia, Flickr-CC via Openverse, museus…) vêm de
    // muitos domínios HTTPS → liberamos img https: (imagem não executa código; o
    // script-src segue restrito). Crédito+licença de cada foto aparecem no modal.
    `img-src 'self' data: blob: https:`,
    // Vídeos curados das figurinhas (Wikimedia Commons, licença livre, com crédito).
    `media-src 'self' https://upload.wikimedia.org`,
    `frame-src 'self' https://www.openstreetmap.org https://api.maptiler.com`,
    `connect-src ${connectSrc}`,
    // só sob HTTPS real (Vercel): localmente quebraria o `next start` em http://localhost
    vercel && 'upgrade-insecure-requests',
  ].filter(Boolean).join('; ');

  const headers = [
    ...(semCsp ? [] : [{ key: 'Content-Security-Policy', value: csp }]),
    { key: 'X-Content-Type-Options', value: 'nosniff' },
    { key: 'X-Frame-Options', value: 'DENY' },
    { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
    // geolocalização só para o próprio site (Modo Viagem, com consentimento explícito)
    { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(self), browsing-topics=()' },
  ];
  // HSTS só faz sentido (e só é seguro) sob HTTPS de deploy — fora em http://localhost.
  if (vercel) {
    headers.push({ key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' });
  }
  return headers;
}
