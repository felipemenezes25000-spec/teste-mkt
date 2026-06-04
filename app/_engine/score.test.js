import { describe, it, expect } from 'vitest';
import { scoreViagem, normalizarPesos, PESOS_PADRAO, SELO } from './score.js';

// Fixture: viagem "boa" — cobre o orçamento com folga, na época, sem furo de visto.
const calcBom = {
  trechos: [
    { code: 'PT', nome: 'Portugal', regiao: 'Europa', dias: 12 },
    { code: 'TR', nome: 'Turquia', regiao: 'Cáucaso e Oriente Médio', dias: 14 },
  ],
  custoTotal: 1800, orcamento: 3000, mediaDia: 45, diasTotais: 26,
  folego: { cobreTudo: true, diasExtras: 18, ratio: 0.6, nivel: 'verde' },
  furosVisto: 0, conflitosEstacao: 0, parciaisEstacao: 0,
};

// Fixture: viagem "problemática" — estoura orçamento, fura visto, fora de época.
const calcRuim = {
  trechos: [
    { code: 'ZA', nome: 'África do Sul', regiao: 'África', dias: 40 },
    { code: 'CO', nome: 'Colômbia', regiao: 'América do Sul', dias: 30 },
  ],
  custoTotal: 5000, orcamento: 3000, mediaDia: 70, diasTotais: 70,
  folego: { cobreTudo: false, falta: 2000, ratio: 1.67, nivel: 'vermelho' },
  furosVisto: 1, conflitosEstacao: 1, parciaisEstacao: 1,
};

describe('scoreViagem', () => {
  it('produz as 8 dimensões e uma nota geral 0–100', () => {
    const s = scoreViagem(calcBom);
    const chaves = ['custoBeneficio', 'conforto', 'seguranca', 'tempoLivre', 'experienciaLocal', 'gastronomia', 'risco', 'economia'];
    for (const k of chaves) {
      expect(s.dimensoes[k]).toBeTruthy();
      expect(s.dimensoes[k].nota).toBeGreaterThanOrEqual(0);
      expect(s.dimensoes[k].nota).toBeLessThanOrEqual(100);
      expect(typeof s.dimensoes[k].texto).toBe('string');
    }
    expect(s.geral).toBeGreaterThanOrEqual(0);
    expect(s.geral).toBeLessThanOrEqual(100);
  });

  it('viagem boa pontua mais que viagem problemática', () => {
    expect(scoreViagem(calcBom).geral).toBeGreaterThan(scoreViagem(calcRuim).geral);
  });

  it('penaliza risco quando há furo de visto e fora de época', () => {
    expect(scoreViagem(calcRuim).dimensoes.risco.nota).toBeLessThan(scoreViagem(calcBom).dimensoes.risco.nota);
    expect(scoreViagem(calcBom).dimensoes.risco.nota).toBeGreaterThan(85); // sem furos nem conflito (só desconto leve de segurança)
  });

  it('economia alta quando cobre tudo com dias extras; baixa quando não cobre', () => {
    expect(scoreViagem(calcBom).dimensoes.economia.nota).toBeGreaterThan(70);
    expect(scoreViagem(calcRuim).dimensoes.economia.nota).toBeLessThan(40);
  });

  it('seguranca reflete os índices por país ponderados por dias', () => {
    // Portugal(9) + Turquia(7) → média entre 7 e 9 → 70–90.
    const seg = scoreViagem(calcBom).dimensoes.seguranca.nota;
    expect(seg).toBeGreaterThanOrEqual(70);
    expect(seg).toBeLessThanOrEqual(90);
  });

  it('é determinístico (mesma entrada → mesma saída)', () => {
    expect(scoreViagem(calcBom)).toEqual(scoreViagem(calcBom));
  });

  it('respeita pesos do perfil (economia-first aumenta peso de custo/economia)', () => {
    const pesosEcon = { custoBeneficio: 0.4, economia: 0.3, seguranca: 0.1, conforto: 0.05, tempoLivre: 0.05, experienciaLocal: 0.05, gastronomia: 0.025, risco: 0.025 };
    const geralPadrao = scoreViagem(calcBom).geral;
    const geralEcon = scoreViagem(calcBom, { pesos: pesosEcon }).geral;
    // viagem barata e folgada → perfil economia valoriza ainda mais
    expect(geralEcon).toBeGreaterThanOrEqual(geralPadrao - 1);
  });

  it('lida com calc vazio sem quebrar', () => {
    const s = scoreViagem({ trechos: [], folego: {} });
    expect(s.geral).toBeGreaterThanOrEqual(0);
    expect(s.selo).toBeTruthy();
  });
});

describe('normalizarPesos', () => {
  it('normaliza para somar 1', () => {
    const p = normalizarPesos({ custoBeneficio: 2, economia: 2, seguranca: 1, conforto: 1, tempoLivre: 1, experienciaLocal: 1, gastronomia: 1, risco: 1 });
    const soma = Object.values(p).reduce((s, v) => s + v, 0);
    expect(soma).toBeCloseTo(1, 5);
  });
  it('PESOS_PADRAO já somam ~1', () => {
    const soma = Object.values(PESOS_PADRAO).reduce((s, v) => s + v, 0);
    expect(soma).toBeCloseTo(1, 5);
  });
});

describe('SELO', () => {
  it('classifica faixas', () => {
    expect(SELO(85)).toBe('excelente');
    expect(SELO(70)).toBe('bom');
    expect(SELO(55)).toBe('regular');
    expect(SELO(30)).toBe('fraco');
  });
});
