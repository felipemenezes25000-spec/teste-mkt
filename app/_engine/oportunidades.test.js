import { describe, it, expect } from 'vitest';
import { escanearOportunidades } from './oportunidades.js';

// calc com: furo de visto (Indonésia), fora de época (Nepal), orçamento estoura,
// 2 conflitos de estação e vida diária alta (gatilho do modo mochila).
const calc = {
  trechos: [
    { id: 't1', nome: 'Indonésia', dias: 45, vistoDias: 30, custoEfetivoDia: 30, visto: { nivel: 'over', excesso: 15 }, estacao: { nivel: 'parcial' }, melhoresMeses: [4, 5, 6] },
    { id: 't2', nome: 'Nepal', dias: 20, vistoDias: 90, custoEfetivoDia: 22, visto: { nivel: 'ok' }, estacao: { nivel: 'ruim' }, melhoresMeses: [10, 11] },
  ],
  folego: { cobreTudo: false, falta: 800 },
  custoTerraTotal: 1790,
  custoTransporteTotal: 400,
  conflitosEstacao: 1,
  parciaisEstacao: 1,
  orcamento: 2000,
  custoTotal: 2800,
  diasTotais: 65,
};

describe('escanearOportunidades', () => {
  it('detecta furo de visto como P0', () => {
    const ops = escanearOportunidades(calc);
    const v = ops.find((o) => o.tipo === 'visto');
    expect(v).toBeTruthy();
    expect(v.prioridade).toBe('P0');
    expect(v.titulo).toContain('Indonésia');
  });

  it('detecta estouro de orçamento e sugere cortes', () => {
    const o = escanearOportunidades(calc).find((x) => x.tipo === 'orcamento');
    expect(o).toBeTruthy();
    expect(o.economia).toBeGreaterThan(0);
  });

  it('detecta trecho fora de época', () => {
    const o = escanearOportunidades(calc).find((x) => x.tipo === 'estacao');
    expect(o).toBeTruthy();
    expect(o.titulo).toContain('Nepal');
  });

  it('sugere reordenar quando há ≥2 conflitos de estação', () => {
    expect(escanearOportunidades(calc).some((x) => x.tipo === 'reordenar')).toBe(true);
  });

  it('sugere modo mochila quando a vida diária é relevante', () => {
    const o = escanearOportunidades(calc).find((x) => x.tipo === 'tier');
    expect(o).toBeTruthy();
    expect(o.economia).toBeGreaterThanOrEqual(50);
  });

  it('ordena por prioridade (P0 primeiro)', () => {
    const ops = escanearOportunidades(calc);
    expect(ops[0].prioridade).toBe('P0');
  });

  it('calc vazio/sem trechos → lista vazia, sem quebrar', () => {
    expect(escanearOportunidades({})).toEqual([]);
    expect(escanearOportunidades(null)).toEqual([]);
  });
});
