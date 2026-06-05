import { describe, test, expect } from 'vitest';
import { escolherSobre } from './wiki.js';

const pais = { titulo: 'Alemanha', extrato: 'A Alemanha é um país da Europa Central...', url: 'https://pt.wikipedia.org/wiki/Alemanha' };
const ponto = { titulo: 'Portão de Brandemburgo', extrato: 'O Portão de Brandemburgo é um monumento em Berlim...', url: 'https://pt.wikipedia.org/wiki/Portao' };

// Conserta o bug "Sobre {país}" mostrar texto da capital: o texto vem do PAÍS;
// só cai no ponto (fotoQuery) — com rótulo honesto — se o país não tiver extrato.
describe('escolherSobre', () => {
  test('prioriza o resumo do país (doPais=true)', () => {
    const r = escolherSobre({ pais, ponto });
    expect(r.doPais).toBe(true);
    expect(r.titulo).toBe('Alemanha');
    expect(r.extrato).toBe(pais.extrato);
  });

  test('sem extrato do país, cai no ponto com rótulo honesto (doPais=false)', () => {
    const r = escolherSobre({ pais: null, ponto });
    expect(r.doPais).toBe(false);
    expect(r.titulo).toBe('Portão de Brandemburgo');
    expect(r.extrato).toBe(ponto.extrato);
  });

  test('país com extrato vazio também cai no ponto', () => {
    const r = escolherSobre({ pais: { titulo: 'X', extrato: '' }, ponto });
    expect(r.doPais).toBe(false);
  });

  test('nada com extrato → null (esconde a seção)', () => {
    expect(escolherSobre({ pais: null, ponto: null })).toBe(null);
    expect(escolherSobre({})).toBe(null);
    expect(escolherSobre()).toBe(null);
  });
});
