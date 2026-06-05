import { describe, it, expect } from 'vitest';
import { colecoesEditorial, custoEstimadoDias, mundoScoreDestino, vereditoDestino, fitTagsDestino } from './editorial.js';

const PORTUGAL = { code: 'PT', nome: 'Portugal', slug: 'portugal', regiao: 'Europa', custoDia: 55, moeda: 'EUR', melhoresMeses: [5, 9], estacao: 'Primavera e outono são mais gentis.' };
const PERU = { code: 'PE', nome: 'Peru', slug: 'peru', regiao: 'América do Sul', custoDia: 32, moeda: 'PEN', melhoresMeses: [5, 6, 7, 8, 9], estacao: 'Seca nos Andes.' };
const TAILANDIA = { code: 'TH', nome: 'Tailândia', slug: 'tailandia', regiao: 'Ásia', custoDia: 34, moeda: 'THB', melhoresMeses: [11, 12, 1, 2, 3], estacao: 'Melhor fora da monção.' };
const ISLANDIA = { code: 'IS', nome: 'Islândia', slug: 'islandia', regiao: 'Europa', custoDia: 105, moeda: 'ISK', melhoresMeses: [6, 7, 8], estacao: 'Verão.' };

describe('mundoScoreDestino', () => {
  it('gera score e subnotas coerentes entre 0 e 100', () => {
    const score = mundoScoreDestino(PORTUGAL);
    expect(score.total).toBeGreaterThanOrEqual(0);
    expect(score.total).toBeLessThanOrEqual(100);
    expect(score.subnotas.custoReal).toBeGreaterThanOrEqual(0);
    expect(score.subnotas.facilidade).toBeGreaterThanOrEqual(0);
    expect(score.chanceArrependimento).toMatch(/baixa|média|alta/);
  });

  it('penaliza destino muito caro em custo real', () => {
    expect(mundoScoreDestino(PERU).subnotas.custoReal).toBeGreaterThan(mundoScoreDestino(ISLANDIA).subnotas.custoReal);
  });
});

describe('vereditoDestino', () => {
  it('entrega copy humana com combina e não combina', () => {
    const v = vereditoDestino(PORTUGAL);
    expect(v.titulo).toContain('Portugal');
    expect(v.texto).toContain('euro');
    expect(v.combina.length).toBeGreaterThanOrEqual(3);
    expect(v.naoCombina.length).toBeGreaterThanOrEqual(2);
  });
});

describe('custoEstimadoDias', () => {
  it('calcula custo por 7, 10 e 15 dias a partir do custo diário', () => {
    expect(custoEstimadoDias(PERU)).toEqual([
      { dias: 7, total: 224 },
      { dias: 10, total: 320 },
      { dias: 15, total: 480 },
    ]);
  });
});

describe('fitTagsDestino', () => {
  it('gera tags editoriais limitadas', () => {
    const tags = fitTagsDestino(PORTUGAL);
    expect(tags.length).toBeGreaterThan(0);
    expect(tags.length).toBeLessThanOrEqual(4);
  });
});

describe('colecoesEditorial', () => {
  it('cria coleções humanas sem duplicar destino dentro da mesma coleção', () => {
    const colecoes = colecoesEditorial([PORTUGAL, PERU, TAILANDIA, ISLANDIA]);
    expect(colecoes.length).toBeGreaterThan(3);
    const primeira = colecoes.find((c) => c.id === 'primeira-viagem');
    expect(primeira.destinos.map((d) => d.code)).toContain('PT');
    for (const c of colecoes) {
      const codes = c.destinos.map((d) => d.code);
      expect(new Set(codes).size).toBe(codes.length);
    }
  });
});
