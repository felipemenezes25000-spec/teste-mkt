import { describe, it, expect, beforeEach } from 'vitest';
import { consumir, limitar, _limpar } from './rateLimit.js';

describe('rate limit', () => {
  beforeEach(() => _limpar());
  it('bloqueia acima do limite e libera após a janela', () => {
    for (let i = 0; i < 3; i++) expect(consumir('k', 3, 1000, 1000 + i).ok).toBe(true);
    const r = consumir('k', 3, 1000, 1500);
    expect(r.ok).toBe(false);
    expect(r.retryAfter).toBeGreaterThan(0);
    expect(consumir('k', 3, 1000, 2100).ok).toBe(true);
  });
  it('separa por IP e rota; responde 429 com Retry-After', () => {
    const req = (ip) => ({ headers: new Headers({ 'x-forwarded-for': ip }) });
    expect(limitar(req('1.1.1.1'), 'ai', { limite: 1 })).toBeNull();
    const r = limitar(req('1.1.1.1'), 'ai', { limite: 1 });
    expect(r.status).toBe(429);
    expect(r.headers.get('retry-after')).toBeTruthy();
    expect(limitar(req('2.2.2.2'), 'ai', { limite: 1 })).toBeNull();
    expect(limitar(req('1.1.1.1'), 'out', { limite: 1 })).toBeNull();
  });
});
