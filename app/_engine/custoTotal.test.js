import { describe, it, expect } from 'vitest';
import { custoTotalRealista, resumoVitrineVsReal, calcExemploDestino, percentuaisEscondido, PREMISSAS_PADRAO } from './custoTotal.js';

const calc = {
  diasTotais: 26,
  custoTerraTotal: 1170,
  custoTransporteTotal: 600,
  trechos: [
    { nome: 'Vietnã', visto: { tipo: 'e-visa' } },
    { nome: 'Tailândia', visto: { tipo: 'isento' } },
  ],
};

describe('custoTotalRealista', () => {
  it('soma todas as categorias e bate com o total', () => {
    const r = custoTotalRealista(calc);
    const soma = r.categorias.reduce((s, c) => s + c.valor, 0);
    expect(soma).toBe(r.total);
  });

  it('o total inclui mais que voo+hotel (seguro, eSIM, vistos, contingência)', () => {
    const r = custoTotalRealista(calc);
    expect(r.total).toBeGreaterThan(calc.custoTerraTotal + calc.custoTransporteTotal);
    expect(r.contingencia).toBeGreaterThan(0);
    const ids = r.categorias.map((c) => c.id);
    expect(ids).toContain('seguro');
    expect(ids).toContain('esim');
    expect(ids).toContain('vistos');
    expect(ids).toContain('contingencia');
  });

  it('cobra taxa de visto só nos trechos com e-visa/on-arrival', () => {
    const vistos = custoTotalRealista(calc).categorias.find((c) => c.id === 'vistos').valor;
    expect(vistos).toBe(PREMISSAS_PADRAO.vistoMedio); // só Vietnã (e-visa); Tailândia isento
  });

  it('faixa mochila < médio < conforto', () => {
    const { faixa } = custoTotalRealista(calc);
    expect(faixa.mochila).toBeLessThan(faixa.medio);
    expect(faixa.medio).toBeLessThan(faixa.conforto);
  });

  it('calcula custo por dia', () => {
    const r = custoTotalRealista(calc);
    expect(r.porDia).toBe(Math.round(r.total / calc.diasTotais));
  });

  it('aceita premissas customizadas', () => {
    const r = custoTotalRealista(calc, { contingencia: 0 });
    expect(r.contingencia).toBe(0);
  });
});

describe('resumoVitrineVsReal', () => {
  it('vitrine (voo+hotel) é menor que o custo real total', () => {
    const r = resumoVitrineVsReal(calc);
    expect(r.vitrine).toBeLessThan(r.real);
    expect(r.escondido).toBeGreaterThan(0);
    expect(r.escondido).toBe(r.real - r.vitrine);
  });

  it('vitrine = hospedagem (~40% da vida) + transporte', () => {
    // terra=1170 → hospedagem ~468; transporte=600 → vitrine ~1068
    const r = resumoVitrineVsReal(calc);
    expect(r.vitrine).toBe(Math.round(1170 * 0.4) + 600);
  });

  it('expõe o breakdown completo do custo real', () => {
    const r = resumoVitrineVsReal(calc);
    expect(Array.isArray(r.categorias)).toBe(true);
    expect(r.categorias.length).toBeGreaterThan(0);
    expect(r.porDia).toBeGreaterThan(0);
  });

  it('expõe os dois percentuais (sobre vitrine ≥ do total)', () => {
    const r = resumoVitrineVsReal(calc);
    expect(r.pct.sobreVitrine).toBeGreaterThan(0);
    expect(r.pct.doFinal).toBeGreaterThan(0);
    expect(r.pct.sobreVitrine).toBeGreaterThanOrEqual(r.pct.doFinal);
  });
});

describe('calcExemploDestino', () => {
  const peru = { code: 'PE', nome: 'Peru', custoDia: 28, coords: [-77.04, -12.05] };

  it('monta um calc mínimo válido p/ 1 destino', () => {
    const c = calcExemploDestino(peru, 7);
    expect(c.diasTotais).toBe(7);
    expect(c.custoTerraTotal).toBe(28 * 7);
    expect(c.custoTransporteTotal).toBeGreaterThan(0); // estimou o voo pela distância
    expect(c.trechos).toHaveLength(1);
  });

  it('alimenta o resumoVitrineVsReal (vitrine < real)', () => {
    const r = resumoVitrineVsReal(calcExemploDestino(peru, 7));
    expect(r.vitrine).toBeLessThan(r.real);
    expect(r.real).toBeGreaterThan(0);
  });

  it('usa defaults seguros com destino incompleto', () => {
    const c = calcExemploDestino({}, 0);
    expect(c.diasTotais).toBe(7); // dias inválido → default
    expect(c.custoTransporteTotal).toBeGreaterThan(0);
  });
});

describe('percentuaisEscondido', () => {
  it('distingue % sobre a vitrine (maior) de % do custo final (menor)', () => {
    // exemplo da review: vitrine 897, real 1292, escondido 395
    const p = percentuaisEscondido({ vitrine: 897, real: 1292, escondido: 395 });
    expect(p.sobreVitrine).toBe(44); // 395/897
    expect(p.doFinal).toBe(31);      // 395/1292
    expect(p.sobreVitrine).toBeGreaterThan(p.doFinal);
  });

  it('é seguro com valores zero/ausentes', () => {
    expect(percentuaisEscondido({})).toEqual({ sobreVitrine: 0, doFinal: 0 });
    expect(percentuaisEscondido({ vitrine: 0, real: 0, escondido: 100 })).toEqual({ sobreVitrine: 0, doFinal: 0 });
  });
});
