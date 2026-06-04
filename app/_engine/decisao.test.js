import { describe, it, expect } from 'vitest';
import { dimensoesDoDestino, ranquear, recomendarDestinos, DIM_LABEL } from './decisao.js';
import { perfilDoPreset } from './perfil.js';

const BOLIVIA = { code: 'BO', nome: 'Bolívia', slug: 'bolivia', regiao: 'América do Sul', custoDia: 22 };
const PORTUGAL = { code: 'PT', nome: 'Portugal', slug: 'portugal', regiao: 'Europa', custoDia: 55 };

describe('dimensoesDoDestino', () => {
  it('produz 8 dimensões 0–100', () => {
    const d = dimensoesDoDestino(BOLIVIA);
    expect(Object.keys(d).sort()).toEqual(Object.keys(DIM_LABEL).sort());
    for (const v of Object.values(d)) {
      expect(v).toBeGreaterThanOrEqual(0);
      expect(v).toBeLessThanOrEqual(100);
    }
  });

  it('destino barato pontua mais em custo-benefício e economia', () => {
    expect(dimensoesDoDestino(BOLIVIA).custoBeneficio).toBeGreaterThan(dimensoesDoDestino(PORTUGAL).custoBeneficio);
    expect(dimensoesDoDestino(BOLIVIA).economia).toBeGreaterThan(dimensoesDoDestino(PORTUGAL).economia);
  });

  it('destino mais seguro pontua mais em segurança e conforto sustentável', () => {
    expect(dimensoesDoDestino(PORTUGAL).seguranca).toBeGreaterThan(dimensoesDoDestino(BOLIVIA).seguranca);
    expect(dimensoesDoDestino(PORTUGAL).conforto).toBeGreaterThan(dimensoesDoDestino(BOLIVIA).conforto);
  });
});

describe('ranquear', () => {
  it('ordena por pontos, atribui posição e gera o "porque"', () => {
    const ranked = ranquear(
      [
        { id: 'a', nome: 'A', dimensoes: { custoBeneficio: 90, conforto: 50, seguranca: 50, tempoLivre: 50, experienciaLocal: 50, gastronomia: 50, risco: 50, economia: 90 } },
        { id: 'b', nome: 'B', dimensoes: { custoBeneficio: 20, conforto: 50, seguranca: 50, tempoLivre: 50, experienciaLocal: 50, gastronomia: 50, risco: 50, economia: 20 } },
      ],
      { custoBeneficio: 1, economia: 1, conforto: 0, seguranca: 0, tempoLivre: 0, experienciaLocal: 0, gastronomia: 0, risco: 0 }
    );
    expect(ranked[0].id).toBe('a');
    expect(ranked[0].posicao).toBe(1);
    expect(typeof ranked[0].porque).toBe('string');
    expect(ranked[0].porque.length).toBeGreaterThan(0);
  });
});

describe('recomendarDestinos — personalização real', () => {
  it('mochileiro prefere o barato; luxo prefere o premium (mesmos 2 destinos)', () => {
    const mochileiro = recomendarDestinos([BOLIVIA, PORTUGAL], perfilDoPreset('mochileiro'));
    const luxo = recomendarDestinos([BOLIVIA, PORTUGAL], perfilDoPreset('luxo'));
    expect(mochileiro[0].nome).toBe('Bolívia');
    expect(luxo[0].nome).toBe('Portugal');
  });

  it('é determinístico', () => {
    const a = recomendarDestinos([BOLIVIA, PORTUGAL], perfilDoPreset('equilibrado'));
    const b = recomendarDestinos([BOLIVIA, PORTUGAL], perfilDoPreset('equilibrado'));
    expect(a).toEqual(b);
  });
});
