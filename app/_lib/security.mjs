// Cabeçalhos de segurança HTTP. Função PURA (testável); next.config.mjs a chama com
// o ambiente atual. A CSP é "estática-friendly": usa 'unsafe-inline' p/ scripts em vez
// de nonce — assim as 167 páginas de destino seguem SSG/ISR (nonce forçaria render
// dinâmico em tudo). Mesmo assim trava clickjacking, MIME-sniffing e restringe as
// origens de rede/imagem/iframe ao que o app de fato toca NO BROWSER.
//
// O que NÃO precisa entrar na CSP: deep-links de afiliado (Booking/Viator/…) são <a>
// target=_blank (navegação, não é regida por CSP) e o Stripe é fetch no SERVIDOR.

const WIKI = 'https://*.wikipedia.org https://*.wikimedia.org https://upload.wikimedia.org';
const SUPABASE = 'https://*.supabase.co';
const IA_BYOK = 'https://api.openai.com https://api.groq.com https://api.anthropic.com';

export function buildSecurityHeaders({ production = true, vercel = false } = {}) {
  const dev = !production;

  const scriptSrc = ["'self'", "'unsafe-inline'", dev && "'unsafe-eval'"].filter(Boolean).join(' ');
  const connectSrc = [
    "'self'", SUPABASE, 'wss://*.supabase.co',
    WIKI, 'https://query.wikidata.org', 'https://open.er-api.com', IA_BYOK,
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
    `img-src 'self' data: blob: ${WIKI} ${SUPABASE}`,
    `frame-src 'self' https://www.openstreetmap.org`,
    `connect-src ${connectSrc}`,
    // só sob HTTPS real (Vercel): localmente quebraria o `next start` em http://localhost
    vercel && 'upgrade-insecure-requests',
  ].filter(Boolean).join('; ');

  const headers = [
    { key: 'Content-Security-Policy', value: csp },
    { key: 'X-Content-Type-Options', value: 'nosniff' },
    { key: 'X-Frame-Options', value: 'DENY' },
    { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
    { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), browsing-topics=()' },
  ];
  // HSTS só faz sentido (e só é seguro) sob HTTPS de deploy — fora em http://localhost.
  if (vercel) {
    headers.push({ key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' });
  }
  return headers;
}
