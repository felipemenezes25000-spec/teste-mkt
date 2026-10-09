// Proxy (antigo middleware) — só atua no modo CSP_NONCE=1: gera um nonce por
// requisição e envia a CSP com 'nonce-…' + 'strict-dynamic'. O Next aplica o nonce
// automaticamente aos próprios scripts ao ler a CSP do cabeçalho da requisição.
import { NextResponse } from 'next/server';
import { buildSecurityHeaders } from './app/_lib/security.mjs';

export function proxy(request) {
  if (process.env.CSP_NONCE !== '1') return NextResponse.next();
  const nonce = Buffer.from(crypto.randomUUID()).toString('base64');
  const csp = buildSecurityHeaders({ production: process.env.NODE_ENV === 'production', vercel: Boolean(process.env.VERCEL), nonce })
    .find((h) => h.key === 'Content-Security-Policy').value;
  const headers = new Headers(request.headers);
  headers.set('x-nonce', nonce);
  headers.set('content-security-policy', csp);
  const res = NextResponse.next({ request: { headers } });
  res.headers.set('content-security-policy', csp);
  return res;
}

export const config = {
  matcher: [{ source: '/((?!api|_next/static|_next/image|favicon|icon|manifest).*)', missing: [{ type: 'header', key: 'next-router-prefetch' }] }],
};
