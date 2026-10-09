import { describe, it, expect } from 'vitest';
import { simularCusto, veredito, fmtFaixa, contras, tierDoEstilo, BANDA } from './simulador.js';
import { buscarOrigens, origemPorIata } from './origens.js';
import { custoEstadia } from './custos.js';

const JP = { code: 'JP', custoDia: 90, coords: [139.69, 35.69], melhoresMeses: [3, 4, 10, 11] };
const PT = { code: 'PT', custoDia: 55, coords: [-9.14, 38.72], melhoresMeses: [5, 6, 9] };
const GRU = origemPorIata('GRU');
const FX_BRL = { taxa: 5.4, data: '2026-10-08', fonte: 'BCE via Frankfurter' };

describe('simulador da Home (V5 F1)', () => {
  it('HOME-01: BRL 18.000, 2 pessoas, origem SP — tudo em BRL e terra ≠ passagem', () => {
    const r = simularCusto(JP, { dias: 14, adultos: 2, estilo: 'equilibrado', origem: GRU, moeda: 'BRL', fx: FX_BRL, orcamento: 18000 });
    const terraUsd = custoEstadia(90, 14, 'medio').total * 2;
    expect(r.terra.usd.centro).toBe(terraUsd);
    expect(r.terra.valor.centro).toBeCloseTo(terraUsd * 5.4, 2); // convertido, não USD cru
    expect(r.passagem.ilustrativa).toBe(true);
    expect(r.total.verificado).toBe(false);
    expect(r.total.valor.min).toBeGreaterThan(r.terra.valor.min + r.passagem.valor.min - 0.01);
    expect(r.veredito.escopo).toBe('TOTAL'); // compara com o total provável, não com a terra
    expect(r.cambio).toMatchObject({ taxa: 5.4, data: '2026-10-08' });
  });
  it('HOME-02/03: sem origem → sem passagem e sem total; veredito só da terra, nunca "cabe a viagem"', () => {
    const r = simularCusto(PT, { dias: 10, adultos: 2, moeda: 'BRL', fx: FX_BRL, orcamento: 50000 });
    expect(r.passagem).toBeNull();
    expect(r.total).toBeNull();
    expect(r.veredito.codigo).toBe('TERRA_CABE');
    expect(r.veredito.escopo).toBe('TERRA');
  });
  it('HOME-04: câmbio indisponível → nenhuma conversão inventada e comparação suspensa', () => {
    const r = simularCusto(JP, { dias: 7, adultos: 1, origem: GRU, moeda: 'BRL', fx: { taxa: null }, orcamento: 9000 });
    expect(r.terra.valor).toBeNull();
    expect(r.cambio.indisponivel).toBe(true);
    expect(r.veredito.codigo).toBe('SEM_CAMBIO');
    expect(r.terra.usd.centro).toBeGreaterThan(0); // USD continua disponível para exibir com rótulo
  });
  it('HOME-06: trocar moeda e viajantes recalcula proporcionalmente', () => {
    const um = simularCusto(PT, { dias: 7, adultos: 1, moeda: 'USD', orcamento: 0 });
    const dois = simularCusto(PT, { dias: 7, adultos: 1, criancas: 1, moeda: 'USD', orcamento: 0 });
    expect(dois.terra.valor.centro).toBeCloseTo(um.terra.valor.centro * 2, 2);
    const eur = simularCusto(PT, { dias: 7, adultos: 1, moeda: 'EUR', fx: { taxa: 0.9, data: 'x', fonte: 'y' } });
    expect(eur.terra.valor.centro).toBeCloseTo(um.terra.valor.centro * 0.9, 2);
    expect(um.veredito.codigo).toBe('SEM_ORCAMENTO');
  });
  it('HOME-07: moeda sem centavos (JPY) e valores altos sem arredondamento errado', () => {
    const r = simularCusto(JP, { dias: 120, adultos: 20, origem: GRU, moeda: 'JPY', fx: { taxa: 149.37, data: 'x', fonte: 'y' }, orcamento: 1e9 });
    expect(Number.isInteger(r.terra.valor.centro)).toBe(true);
    expect(r.veredito.codigo).toBe('TOTAL_CABE');
    expect(fmtFaixa({ min: 1234567, max: 2345678 }, 'JPY', 'ja-JP')).toMatch(/1,235,000.*2,346,000/);
    expect(fmtFaixa({ min: 12345.6, max: 23456.7 }, 'BRL')).toMatch(/12\.350.*23\.460/);
  });
  it('faixas e limites do veredito', () => {
    const r = { terra: { valor: { min: 100, max: 200 } }, total: null };
    expect(veredito(r, 250).codigo).toBe('TERRA_CABE');
    expect(veredito(r, 150).codigo).toBe('TERRA_NO_LIMITE');
    expect(veredito(r, 50).codigo).toBe('TERRA_ACIMA');
    expect(BANDA.min).toBeLessThan(1);
    expect(tierDoEstilo('mochileiro')).toBe('mochila');
    expect(tierDoEstilo('luxo')).toBe('conforto');
    expect(tierDoEstilo('qualquer')).toBe('medio');
  });
  it('dias e viajantes são saneados', () => {
    const r = simularCusto(PT, { dias: -5, adultos: 0, moeda: 'XYZ', fx: FX_BRL });
    expect(r.dias).toBe(1);
    expect(r.viajantes).toBe(1);
    expect(r.moeda).toBe('BRL');
  });
  it('contras honestos (por que talvez não)', () => {
    expect(contras(JP, { mes: 7, horasVoo: 25, vistoTipo: 'consultar', veredito: { codigo: 'TOTAL_ACIMA' } }))
      .toEqual(['fora_epoca', 'voo_longo', 'visto_verificar', 'orcamento_apertado']);
    expect(contras(PT, { mes: 6, horasVoo: 10, vistoTipo: 'isento', veredito: { codigo: 'TOTAL_CABE' } })).toEqual([]);
  });
});

describe('origens', () => {
  it('busca sem acento, por IATA e desambigua homônimos pelo país', () => {
    expect(buscarOrigens('sao paulo')[0].iata).toBe('GRU');
    expect(buscarOrigens('gig')[0].cidade).toBe('Rio de Janeiro');
    expect(buscarOrigens('porto').map((o) => o.iata)).toEqual(expect.arrayContaining(['OPO', 'POA']));
    expect(buscarOrigens('zzzz')).toEqual([]);
    expect(origemPorIata('xxx')).toBeNull();
  });
});

describe('Top 3 respeita o orçamento', () => {
  it('quem cabe vem antes, mantendo a ordem do perfil entre iguais', async () => {
    const { ordenarPorOrcamento } = await import('./simulador.js');
    const it_ = (n, c) => ({ n, custo: { veredito: { codigo: c } } });
    const r = ordenarPorOrcamento([it_('a', 'TOTAL_ACIMA'), it_('b', 'TOTAL_CABE'), it_('c', 'TOTAL_NO_LIMITE'), it_('d', 'TOTAL_CABE'), it_('e', 'SEM_ORCAMENTO')]);
    expect(r.map((x) => x.n)).toEqual(['b', 'd', 'e', 'c', 'a']);
  });
});
