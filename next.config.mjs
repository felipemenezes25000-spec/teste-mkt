/** @type {import('next').NextConfig} */
import { buildSecurityHeaders } from './app/_lib/security.mjs';

// Cabeçalhos de segurança aplicados a todas as rotas. A política é montada por uma
// função pura testada (app/_lib/security.mjs) e varia por ambiente: dev libera o que
// o HMR do Next precisa; HSTS/upgrade-insecure só saem em deploy HTTPS (Vercel).
const securityHeaders = buildSecurityHeaders({
  production: process.env.NODE_ENV === 'production',
  vercel: Boolean(process.env.VERCEL),
});

const nextConfig = {
  reactStrictMode: true,
  async headers() {
    return [{ source: '/(.*)', headers: securityHeaders }];
  },
};

export default nextConfig;
