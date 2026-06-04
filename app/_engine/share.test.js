import { describe, it, expect } from 'vitest';
import { planoExemplo } from './storage.js';
import { encodePlan, decodePlan } from './share.js';

describe('share link codec', () => {
  it('round-trip preserva os trechos e settings', () => {
    const p = planoExemplo();
    const back = decodePlan(encodePlan(p));
    expect(back.legs.map(l => l.nome)).toEqual(p.legs.map(l => l.nome));
    expect(back.settings.orcamento).toBe(p.settings.orcamento);
    expect(back.settings.passaporte).toBe(p.settings.passaporte);
  });

  it('nunca traz a chave de IA no plano decodificado', () => {
    const p = planoExemplo();
    p.settings.ai.apiKey = 'sk-segredo-123';
    const back = decodePlan(encodePlan(p));
    expect(back.settings.ai.apiKey).toBe('');
  });

  it('gera string URL-safe (sem +, / ou =)', () => {
    expect(encodePlan(planoExemplo())).toMatch(/^[A-Za-z0-9._-]+$/);
  });

  it('preserva acentos (Indonésia, São Paulo)', () => {
    const back = decodePlan(encodePlan(planoExemplo()));
    expect(back.legs.some(l => l.nome === 'Indonésia')).toBe(true);
    expect(back.settings.origemCidade).toBe('São Paulo');
  });

  it('link vazio ou corrompido lança erro claro', () => {
    expect(() => decodePlan('')).toThrow();
    expect(() => decodePlan('!!!corrompido!!!')).toThrow();
  });
});
