import { describe, it, expect } from 'vitest';
import { custoTotalRealista, PREMISSAS_PADRAO } from './custoTotal.js';

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
