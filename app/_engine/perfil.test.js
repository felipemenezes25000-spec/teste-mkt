import { describe, it, expect } from 'vitest';
import { perfilPadrao, perfilDoPreset, pesosScore, destinoParaInteresses, aprender, topInteresses, INTERESSES, PERFIS_PRONTOS } from './perfil.js';

describe('perfil — base', () => {
  it('perfilPadrao tem todos os interesses em 0.5', () => {
    const p = perfilPadrao();
    expect(Object.keys(p).sort()).toEqual([...INTERESSES].sort());
    expect(Object.values(p).every((v) => v === 0.5)).toBe(true);
  });

  it('cada preset resolve para um vetor completo', () => {
    for (const id of Object.keys(PERFIS_PRONTOS)) {
      const p = perfilDoPreset(id);
      expect(Object.keys(p).sort()).toEqual([...INTERESSES].sort());
    }
    expect(perfilDoPreset('mochileiro').economia).toBe(1);
    expect(perfilDoPreset('luxo').conforto).toBe(1);
  });

  it('preset desconhecido cai no equilibrado', () => {
    expect(perfilDoPreset('xyz')).toEqual(perfilPadrao());
  });
});

describe('pesosScore', () => {
  it('mapeia interesses nas 8 dimensões do score, todas positivas', () => {
    const w = pesosScore(perfilDoPreset('gastronomico'));
    const dims = ['custoBeneficio', 'conforto', 'seguranca', 'tempoLivre', 'experienciaLocal', 'gastronomia', 'risco', 'economia'];
    for (const k of dims) expect(w[k]).toBeGreaterThan(0);
    // gastronômico → peso de gastronomia alto
    expect(w.gastronomia).toBeGreaterThan(pesosScore(perfilDoPreset('aventura')).gastronomia);
  });
});

describe('aprender', () => {
  it('empurra o perfil na direção do alvo, só nas chaves presentes', () => {
    const base = perfilPadrao();
    const novo = aprender(base, { gastronomia: 1 }, 0.2);
    expect(novo.gastronomia).toBeCloseTo(0.6, 5); // 0.5 + 0.2*(1-0.5)
    expect(novo.conforto).toBe(0.5);              // intocado
  });

  it('mantém os valores em [0,1]', () => {
    const novo = aprender({ ...perfilPadrao(), economia: 0.95 }, { economia: 1 }, 1);
    expect(novo.economia).toBeLessThanOrEqual(1);
    expect(novo.economia).toBeGreaterThanOrEqual(0);
  });
});

describe('destinoParaInteresses', () => {
  it('normaliza índices 0–10 para 0–1 e infere economia do custo', () => {
    const alvo = destinoParaInteresses({ gastronomia: 10, seguranca: 8 }, 20);
    expect(alvo.gastronomia).toBe(1);
    expect(alvo.seguranca).toBe(0.8);
    expect(alvo.economia).toBeGreaterThan(0.7); // barato → economia alta
  });
});

describe('topInteresses', () => {
  it('retorna os N maiores rotulados', () => {
    const top = topInteresses(perfilDoPreset('aventura'), 2);
    expect(top).toHaveLength(2);
    expect(top[0].id).toBe('aventura');
    expect(typeof top[0].label).toBe('string');
  });
});
