import { describe, it, expect } from 'vitest';
import { curvaPreco, vereditoCompra } from './previsaoVoo.js';

const faixa = { min: 400, max: 900 };

describe('curvaPreco', () => {
  it('gera `dias` pontos dentro de uma faixa razoável', () => {
    const c = curvaPreco('GRU-LIS-2026-07-01', faixa, 30);
    expect(c).toHaveLength(30);
    for (const p of c) {
      expect(p.preco).toBeGreaterThan(0);
      expect(p.preco).toBeLessThan(faixa.max * 1.6);
    }
  });

  it('é determinística (mesma rota → mesma curva)', () => {
    expect(curvaPreco('GRU-BKK-2026-08-01', faixa)).toEqual(curvaPreco('GRU-BKK-2026-08-01', faixa));
  });

  it('rotas diferentes geram curvas diferentes', () => {
    const a = curvaPreco('GRU-LIS', faixa);
    const b = curvaPreco('GRU-NRT', faixa);
    expect(a).not.toEqual(b);
  });
});

describe('vereditoCompra', () => {
  const curva = curvaPreco('GRU-LIS-2026-07-01', faixa, 30);
  const min = curva.reduce((m, p) => (p.preco < m ? p.preco : m), Infinity);

  it('"comprar" quando o preço atual está perto da mínima', () => {
    const v = vereditoCompra(curva, min);
    expect(v.acao).toBe('comprar');
  });

  it('"esperar" quando há um dia bem mais barato à frente', () => {
    const v = vereditoCompra(curva, min * 1.5);
    expect(v.acao).toBe('esperar');
    expect(v.economia).toBeGreaterThan(0);
    expect(v.melhorDia).toBeGreaterThanOrEqual(0);
  });

  it('"estavel" quando o atual está só um pouco acima da mínima', () => {
    const v = vereditoCompra(curva, min * 1.04);
    expect(v.acao).toBe('estavel');
  });

  it('curva vazia → null', () => {
    expect(vereditoCompra([], 500)).toBe(null);
  });
});
