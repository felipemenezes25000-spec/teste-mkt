import { describe, it, expect } from 'vitest';
import { escolherMelhorCB } from './flights.js';

describe('escolherMelhorCB — selo "custo-benefício" pondera escalas + duração', () => {
  it('prefere o DIRETO barato a um 1-escala marginalmente mais barato e lento', () => {
    // Cenário real flagrado na auditoria (GRU→BKK): a Gol 1-escala/25h não deve
    // levar o selo só por ser US$110 mais barata que a Copa direta/22h.
    const voos = [
      { id: 'gol', preco: 1090, escalas: 1, duracaoH: 25.05 },
      { id: 'copa', preco: 1200, escalas: 0, duracaoH: 22.85 },
      { id: 'klm', preco: 1535, escalas: 0, duracaoH: 22.85 },
      { id: 'latam', preco: 1970, escalas: 0, duracaoH: 22.85 },
    ];
    expect(escolherMelhorCB(voos).id).toBe('copa');
  });

  it('entre equivalentes, o mais barato vence', () => {
    const voos = [
      { id: 'a', preco: 800, escalas: 0, duracaoH: 12 },
      { id: 'b', preco: 950, escalas: 0, duracaoH: 12 },
    ];
    expect(escolherMelhorCB(voos).id).toBe('a');
  });

  it('um direto bem mais barato ainda vence um 1-escala', () => {
    const voos = [
      { id: 'barato', preco: 700, escalas: 0, duracaoH: 14 },
      { id: 'caro1escala', preco: 1100, escalas: 1, duracaoH: 16 },
    ];
    expect(escolherMelhorCB(voos).id).toBe('barato');
  });
});
