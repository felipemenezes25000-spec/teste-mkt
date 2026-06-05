import { describe, it, expect } from 'vitest';
import { DESTINOS_PRIORITARIOS } from './destinos-prioritarios.js';
import { DESTINOS } from './destinos.js';

describe('DESTINOS_PRIORITARIOS', () => {
  it('lista 30 codes válidos', () => {
    expect(DESTINOS_PRIORITARIOS).toHaveLength(30);
    const codigos = new Set(DESTINOS.map((d) => d.code));
    for (const code of DESTINOS_PRIORITARIOS) {
      expect(codigos.has(code)).toBe(true);
    }
  });

  it('inclui os 3 vereditos já curados', () => {
    expect(DESTINOS_PRIORITARIOS).toContain('PT');
    expect(DESTINOS_PRIORITARIOS).toContain('TH');
    expect(DESTINOS_PRIORITARIOS).toContain('PE');
  });

  it('inclui top destinos brasileiros (heurística)', () => {
    const top = ['AR', 'CL', 'UY', 'ES', 'IT', 'FR', 'US', 'MX'];
    for (const code of top) expect(DESTINOS_PRIORITARIOS).toContain(code);
  });
});
