import { describe, it, expect } from 'vitest';
import { colecoesEditorial, custoEstimadoDias, mundoScoreDestino, vereditoDestino, fitTagsDestino, alertaHumanoDestino } from './editorial.js';
import { DESTINOS_PRIORITARIOS } from './destinos-prioritarios.js';
import { DESTINOS } from './destinos.js';

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

describe('cobertura editorial dos destinos prioritários', () => {
  it('todos os 30 prioritários têm veredito curado (texto não-template)', () => {
    const FALLBACK_PHRASES = [
      'tem apelo forte, mas não deve ser vendido como viagem barata',
      'tende a render bem no orçamento',
      'pode ser uma boa escolha se o mês, o ritmo e o orçamento fecharem juntos',
    ];
    const naoCurados = [];
    for (const code of DESTINOS_PRIORITARIOS) {
      const destino = DESTINOS.find((d) => d.code === code);
      const veredito = vereditoDestino(destino);
      const ehFallback = FALLBACK_PHRASES.some((p) => veredito.texto.includes(p));
      if (ehFallback) naoCurados.push(code);
    }
    expect(naoCurados).toEqual([]);
  });

  it('cada veredito tem 3-5 combina e 3-5 naoCombina', () => {
    for (const code of DESTINOS_PRIORITARIOS) {
      const destino = DESTINOS.find((d) => d.code === code);
      const v = vereditoDestino(destino);
      expect(v.combina.length, `${code} combina length`).toBeGreaterThanOrEqual(3);
      expect(v.combina.length, `${code} combina length`).toBeLessThanOrEqual(5);
      expect(v.naoCombina.length, `${code} naoCombina length`).toBeGreaterThanOrEqual(3);
      expect(v.naoCombina.length, `${code} naoCombina length`).toBeLessThanOrEqual(5);
    }
  });

  it('cada veredito tem oportunidade não-genérica', () => {
    const GENERICAS = [
      'Destino de desejo: planeje antes',
      'Boa oportunidade para viajar com orçamento controlado',
      'Vale olhar custo, mês e ritmo',
    ];
    for (const code of DESTINOS_PRIORITARIOS) {
      const destino = DESTINOS.find((d) => d.code === code);
      const v = vereditoDestino(destino);
      const ehGenerica = GENERICAS.some((p) => v.oportunidade.includes(p));
      expect(ehGenerica, `${code} tem oportunidade genérica`).toBe(false);
    }
  });
});

describe('alertaHumanoDestino — cobertura dos prioritários', () => {
  it('todos os 30 prioritários têm alerta curado (não-fallback)', () => {
    const FALLBACK = [
      'Destino de desejo: planeje antes',
      'Boa oportunidade para viajar com orçamento controlado',
      'Vale olhar custo, mês e ritmo antes de comprar passagem',
    ];
    const naoCurados = [];
    for (const code of DESTINOS_PRIORITARIOS) {
      const destino = DESTINOS.find((d) => d.code === code);
      const alerta = alertaHumanoDestino(destino);
      if (FALLBACK.some((p) => alerta.includes(p))) naoCurados.push(code);
    }
    expect(naoCurados).toEqual([]);
  });
});

describe('mundoScoreDestino — subnota custoEmocional', () => {
  it('Portugal tem custo emocional alto (idioma+sem visto+melhores meses)', () => {
    const destino = { code: 'PT', regiao: 'Europa', custoDia: 55, melhoresMeses: [4,5,6,9,10] };
    const score = mundoScoreDestino(destino);
    expect(score.subnotas.custoEmocional).toBeGreaterThan(75);
  });

  it('Tailândia tem custo emocional menor que Portugal (idioma diferente + score de região)', () => {
    const tailandia = { code: 'TH', regiao: 'Ásia', custoDia: 35, melhoresMeses: [11,12,1,2,3] };
    const portugal = { code: 'PT', regiao: 'Europa', custoDia: 55, melhoresMeses: [4,5,6,9,10] };
    const scoreTH = mundoScoreDestino(tailandia);
    const scorePT = mundoScoreDestino(portugal);
    expect(scoreTH.subnotas.custoEmocional).toBeLessThan(scorePT.subnotas.custoEmocional);
  });

  it('custoEmocional fica entre 0 e 100', () => {
    const destinos = [
      { code: 'AR', regiao: 'América do Sul', custoDia: 40, melhoresMeses: [3,4,5,9,10,11] },
      { code: 'JP', regiao: 'Ásia', custoDia: 80, melhoresMeses: [10,11,4] },
      { code: 'EG', regiao: 'Oriente Médio', custoDia: 35, melhoresMeses: [10,11,12,1,2,3] },
    ];
    for (const d of destinos) {
      const score = mundoScoreDestino(d);
      expect(score.subnotas.custoEmocional).toBeGreaterThanOrEqual(0);
      expect(score.subnotas.custoEmocional).toBeLessThanOrEqual(100);
    }
  });

  it('total recalcula com peso de custoEmocional', () => {
    const destino = { code: 'PT', regiao: 'Europa', custoDia: 55, melhoresMeses: [4,5,6,9,10] };
    const score = mundoScoreDestino(destino);
    expect(score.total).toBeGreaterThan(0);
    expect(score.total).toBeLessThanOrEqual(100);
  });
});
