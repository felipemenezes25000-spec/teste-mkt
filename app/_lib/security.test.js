import { describe, it, expect } from 'vitest';
import { buildSecurityHeaders } from './security.mjs';

const asMap = (headers) => Object.fromEntries(headers.map((h) => [h.key, h.value]));
const csp = (headers) => asMap(headers)['Content-Security-Policy'] || '';

describe('buildSecurityHeaders — cabeçalhos de segurança', () => {
  it('inclui os cabeçalhos base em qualquer ambiente', () => {
    const h = asMap(buildSecurityHeaders({ production: true, vercel: true }));
    expect(h['X-Content-Type-Options']).toBe('nosniff');
    expect(h['X-Frame-Options']).toBe('DENY');
    expect(h['Referrer-Policy']).toBe('strict-origin-when-cross-origin');
    expect(h['Permissions-Policy']).toContain('geolocation=()');
    expect(h['Permissions-Policy']).toContain('camera=()');
    expect(h['Permissions-Policy']).toContain('microphone=()');
    expect(h['Content-Security-Policy']).toBeTruthy();
  });

  it('a CSP trava clickjacking e bases perigosas', () => {
    const c = csp(buildSecurityHeaders({ production: true, vercel: true }));
    expect(c).toContain("default-src 'self'");
    expect(c).toContain("frame-ancestors 'none'");
    expect(c).toContain("object-src 'none'");
    expect(c).toContain("base-uri 'self'");
    expect(c).toContain("form-action 'self'");
    expect(c).toMatch(/script-src[^;]*'unsafe-inline'/);
    expect(c).toMatch(/worker-src[^;]*'self'/);
  });

  it('a CSP libera exatamente as origens que o app usa NO BROWSER', () => {
    const c = csp(buildSecurityHeaders({ production: true, vercel: true }));
    // mapa OpenStreetMap (iframe real no /destino)
    expect(c).toMatch(/frame-src[^;]*https:\/\/www\.openstreetmap\.org/);
    // supabase (auth/sync client-side) — fetch + websocket
    expect(c).toContain('https://*.supabase.co');
    expect(c).toContain('wss://*.supabase.co');
    // IA com chave do usuário (BYO-key) chamada direto do browser
    expect(c).toContain('https://api.openai.com');
    expect(c).toContain('https://api.groq.com');
    expect(c).toContain('https://api.anthropic.com');
    // fotos de fontes de licença livre (Wikimedia, Flickr-CC via Openverse, museus…)
    // vêm de muitos domínios HTTPS → img-src libera https: (imagem não executa código)
    expect(c).toMatch(/img-src[^;]*https:/);
    expect(c).toContain('https://query.wikidata.org');
    expect(c).toContain('https://open.er-api.com');
  });

  it('produção é estrita: sem unsafe-eval e sem ws', () => {
    const c = csp(buildSecurityHeaders({ production: true, vercel: true }));
    expect(c).not.toContain("'unsafe-eval'");
    expect(c).not.toContain('ws:');
  });

  it('dev libera unsafe-eval e ws pro HMR do Next', () => {
    const c = csp(buildSecurityHeaders({ production: false, vercel: false }));
    expect(c).toContain("'unsafe-eval'");
    expect(c).toContain('ws:');
  });

  it('HSTS e upgrade-insecure-requests só em deploy real (Vercel)', () => {
    const naVercel = buildSecurityHeaders({ production: true, vercel: true });
    expect(csp(naVercel)).toContain('upgrade-insecure-requests');
    expect(asMap(naVercel)['Strict-Transport-Security']).toMatch(/max-age=\d+/);

    const local = buildSecurityHeaders({ production: true, vercel: false });
    expect(csp(local)).not.toContain('upgrade-insecure-requests');
    expect(asMap(local)['Strict-Transport-Security']).toBeUndefined();
  });
});
