import { describe, it, expect } from 'vitest';
import { otimizarOrdemLocal } from './otimizar.js';

// Plano com a ordem ERRADA de propósito: começa 1º junho.
// y = melhor em julho, x = melhor em junho. Ordem [y,x] põe os dois fora de época;
// a ordem ótima é [x,y] (x chega em junho=bom, y chega em julho=bom).
function plano(legs) {
  return { settings: { dataInicio: '2026-06-01' }, legs };
}
const Y = { id: 'y', melhoresMeses: [7], dias: 30, coords: [0, 0] };
const X = { id: 'x', melhoresMeses: [6], dias: 30, coords: [0, 0] };

describe('otimizarOrdemLocal', () => {
  it('reordena pra encaixar os trechos na melhor época', () => {
    const r = otimizarOrdemLocal(plano([Y, X]));
    expect(r.order).toEqual(['x', 'y']);
    expect(r.melhorou).toBe(true);
    expect(r.depois.ruim).toBeLessThan(r.antes.ruim);
    expect(r.depois.ruim).toBe(0);
  });

  it('mantém a ordem quando já está ótima', () => {
    const r = otimizarOrdemLocal(plano([X, Y]));
    expect(r.order).toEqual(['x', 'y']);
    expect(r.melhorou).toBe(false);
  });

  it('a saída é sempre uma permutação dos ids de entrada', () => {
    const legs = [Y, X, { id: 'z', melhoresMeses: [8], dias: 20, coords: [5, 5] }];
    const r = otimizarOrdemLocal(plano(legs));
    expect([...r.order].sort()).toEqual(['x', 'y', 'z']);
  });

  it('é determinístico', () => {
    expect(otimizarOrdemLocal(plano([Y, X]))).toEqual(otimizarOrdemLocal(plano([Y, X])));
  });

  it('reduz zigue-zague quando a estação empata (geografia desempata)', () => {
    // 3 trechos sem dado de estação (empate), em zigue-zague geográfico.
    // Com origem à esquerda (âncora de direção), o ótimo é a→c→b (esquerda→direita).
    const a = { id: 'a', melhoresMeses: [], dias: 10, coords: [0, 0] };
    const b = { id: 'b', melhoresMeses: [], dias: 10, coords: [100, 0] };
    const c = { id: 'c', melhoresMeses: [], dias: 10, coords: [2, 0] };
    const p = { settings: { dataInicio: '2026-06-01', origemCoords: [-10, 0] }, legs: [a, b, c] };
    const r = otimizarOrdemLocal(p);
    expect(r.order).toEqual(['a', 'c', 'b']);
  });

  it('lida com 0/1 trecho sem quebrar', () => {
    expect(otimizarOrdemLocal(plano([])).order).toEqual([]);
    expect(otimizarOrdemLocal(plano([X])).order).toEqual(['x']);
    expect(otimizarOrdemLocal(plano([X])).melhorou).toBe(false);
  });
});
