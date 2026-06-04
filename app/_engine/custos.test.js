import { describe, it, expect } from 'vitest';
import { custoPorDia, custoEstadia } from '../_lib/custos.js';

describe('custoPorDia', () => {
  it('gera 3 níveis crescentes com categorias que somam ~total', () => {
    const n = custoPorDia(30);
    expect(n.mochila.total).toBeLessThan(n.medio.total);
    expect(n.medio.total).toBeLessThan(n.conforto.total);
    const soma = n.medio.categorias.reduce((s, c) => s + c.valor, 0);
    expect(Math.abs(soma - n.medio.total)).toBeLessThanOrEqual(2); // arredondamento
  });

  it('tem um piso pra valores muito baixos/ inválidos', () => {
    expect(custoPorDia(0).medio.total).toBeGreaterThanOrEqual(8);
    expect(custoPorDia(undefined).medio.total).toBeGreaterThan(0);
  });
});

describe('custoEstadia', () => {
  it('multiplica por dias e soma seguro/dia', () => {
    const base = custoEstadia(30, 5, 'medio').total;
    expect(base).toBe(custoPorDia(30).medio.total * 5);
    const comSeguro = custoEstadia(30, 5, 'medio', 4).total;
    expect(comSeguro).toBe((custoPorDia(30).medio.total + 4) * 5);
  });

  it('não quebra com dias inválidos', () => {
    expect(custoEstadia(30, -3, 'medio').total).toBe(0);
    expect(custoEstadia(30, 'x', 'medio').total).toBe(0);
  });
});
