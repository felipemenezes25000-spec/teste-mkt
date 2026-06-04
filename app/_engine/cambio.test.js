import { describe, it, expect } from 'vitest';
import { custoEmReais, PREMISSAS_CAMBIO } from './cambio.js';

describe('custoEmReais', () => {
  it('converte pro real mid-market e ordena banco > wise > mid', () => {
    const r = custoEmReais(1000, 5);
    expect(r.brlMid).toBe(5000);
    expect(r.brlBanco).toBeGreaterThan(r.brlWise);
    expect(r.brlWise).toBeGreaterThan(r.brlMid);
  });

  it('a economia com Wise = banco − wise', () => {
    const r = custoEmReais(1000, 5);
    expect(r.economiaWise).toBe(r.brlBanco - r.brlWise);
    expect(r.economiaWise).toBeGreaterThan(0);
  });

  it('expõe o % a mais do banco (IOF + spread)', () => {
    const r = custoEmReais(1000, 5);
    expect(r.pctBanco).toBe(Math.round((PREMISSAS_CAMBIO.iof + PREMISSAS_CAMBIO.spreadBanco) * 100));
  });

  it('retorna null sem rate ou sem valor (degrada na UI)', () => {
    expect(custoEmReais(1000, 0)).toBe(null);
    expect(custoEmReais(0, 5)).toBe(null);
    expect(custoEmReais(1000, null)).toBe(null);
  });

  it('aceita premissas customizadas', () => {
    const semIof = custoEmReais(1000, 5, { iof: 0, spreadBanco: 0 });
    expect(semIof.brlBanco).toBe(semIof.brlMid);
  });
});
