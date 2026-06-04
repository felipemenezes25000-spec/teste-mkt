import { describe, it, expect } from 'vitest';
import { dividirCusto, acertarContas } from './split.js';

describe('dividirCusto', () => {
  const categorias = [
    { id: 'vida', label: 'Vida diária', icon: '🛏️', valor: 900 },
    { id: 'transporte', label: 'Voos', icon: '✈️', valor: 600 },
  ];

  it('divide o total e cada categoria por pessoa', () => {
    const r = dividirCusto(1500, 3, categorias);
    expect(r.n).toBe(3);
    expect(r.porPessoa).toBe(500);
    expect(r.porCategoria[0].porPessoa).toBe(300);
    expect(r.porCategoria[1].porPessoa).toBe(200);
  });

  it('n inválido → pelo menos 1 pessoa', () => {
    expect(dividirCusto(1000, 0).n).toBe(1);
    expect(dividirCusto(1000, 0).porPessoa).toBe(1000);
  });

  it('sem categorias → lista vazia', () => {
    expect(dividirCusto(1000, 2).porCategoria).toEqual([]);
  });
});

describe('acertarContas', () => {
  it('calcula saldos e os acertos pra fechar igual', () => {
    // A pagou 600, B 0, C 0 de um total 600 entre 3 → justo 200.
    const r = acertarContas([{ pessoa: 'A', valor: 600 }, { pessoa: 'B', valor: 0 }, { pessoa: 'C', valor: 0 }], 3);
    expect(r.justo).toBe(200);
    expect(r.acertos).toHaveLength(2);
    // B e C devem 200 cada pra A.
    const paraA = r.acertos.filter((a) => a.para === 'A');
    expect(paraA.reduce((s, a) => s + a.valor, 0)).toBe(400);
  });

  it('quando todos pagaram igual, não há acertos', () => {
    const r = acertarContas([{ pessoa: 'A', valor: 300 }, { pessoa: 'B', valor: 300 }], 2);
    expect(r.acertos).toHaveLength(0);
  });
});
