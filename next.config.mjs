/** @type {import('next').NextConfig} */
import { buildSecurityHeaders } from './app/_lib/security.mjs';

// Cabeçalhos de segurança aplicados a todas as rotas. A política é montada por uma
// função pura testada (app/_lib/security.mjs) e varia por ambiente: dev libera o que
// o HMR do Next precisa; HSTS/upgrade-insecure só saem em deploy HTTPS (Vercel).
const securityHeaders = buildSecurityHeaders({
  production: process.env.NODE_ENV === 'production',
  vercel: Boolean(process.env.VERCEL),
  // no modo nonce a CSP vem do proxy.js (por requisição); aqui só os demais cabeçalhos
  semCsp: process.env.CSP_NONCE === '1',
});

const nextConfig = {
  reactStrictMode: true,
  // raiz explícita: um package-lock.json solto na pasta do usuário confundia o Turbopack
  turbopack: { root: import.meta.dirname },
  // pré-geração dos 205 destinos sem estourar as APIs abertas (Wikipedia/Commons)
  experimental: { staticGenerationMaxConcurrency: 4, staticGenerationRetryCount: 2 },
  async headers() {
    return [{ source: '/(.*)', headers: securityHeaders }];
  },
};

export default nextConfig;
