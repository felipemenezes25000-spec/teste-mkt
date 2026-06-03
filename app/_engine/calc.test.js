import { describe, it, expect } from 'vitest';
import { calcular, statusVisto, statusEstacao } from './calc.js';
import { converter } from './utils.js';
import { planoExemplo } from './storage.js';

describe('motor de cálculo (estação × visto × fôlego)', () => {
  const calc = calcular(planoExemplo());

  it('soma o custo em terra dos 5 trechos (USD)', () => {
    expect(calc.custoTerraTotal).toBe(4550); // 30*28+35*26+45*30+25*22+30*30
  });
  it('soma o transporte entre trechos', () => {
    expect(calc.custoTransporteTotal).toBe(1320); // 700+70+130+180+240
  });
  it('custo total = terra + transporte', () => {
    expect(calc.custoTotal).toBe(5870);
  });
  it('conta os dias totais', () => {
    expect(calc.diasTotais).toBe(165);
  });
  it('fôlego: cobre a viagem toda mas fica "apertado" (ratio ~0.90)', () => {
    expect(calc.folego.cobreTudo).toBe(true);
    expect(calc.folego.nivel).toBe('amarelo');
  });
  it('detecta 1 trecho furando o visto (Indonésia 45d > 30d p/ passaporte BR)', () => {
    expect(calc.furosVisto).toBe(1);
  });
});

describe('regras isoladas', () => {
  it('statusVisto sinaliza ultrapassagem', () => {
    const v = statusVisto(45, 30);
    expect(v.nivel).toBe('over');
    expect(v.excesso).toBe(15);
  });
  it('statusVisto dentro do limite', () => {
    expect(statusVisto(20, 90).nivel).toBe('ok');
  });
  it('statusEstacao marca fora de época quando a estadia não pega os melhores meses', () => {
    const chegadaJulho = new Date(2026, 6, 1); // julho
    const s = statusEstacao(chegadaJulho, 20, [11, 12, 1, 2, 3]); // melhor nov–mar
    expect(s.nivel).toBe('ruim');
  });
  it('converte moeda pelo pivô USD', () => {
    expect(converter(100, 'USD', 'BRL', { USD: 1, BRL: 5 })).toBe(500);
    expect(converter(500, 'BRL', 'USD', { USD: 1, BRL: 5 })).toBe(100);
  });
});
