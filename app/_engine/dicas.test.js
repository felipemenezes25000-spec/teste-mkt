import { describe, it, expect } from 'vitest';
import { dicasDe, SECOES_DICAS } from './dicas.js';

describe('dicasDe', () => {
  it('retorna as 5 seções pra um país conhecido', () => {
    const d = dicasDe('TH'); // Sudeste Asiático
    for (const s of SECOES_DICAS) expect(Array.isArray(d[s.id])).toBe(true);
    expect(d.seguranca.length).toBeGreaterThan(0);
    expect(d.golpes.length).toBeGreaterThan(0);
  });

  it('mescla overrides do país com a base da região', () => {
    const th = dicasDe('TH'); // tem override em golpes (moto/jetski)
    expect(th.golpes.some((g) => /moto|jetski/i.test(g))).toBe(true);
    // e mantém os golpes da região (tuk-tuk)
    expect(th.golpes.some((g) => /tuk-tuk|táxi/i.test(g))).toBe(true);
  });

  it('Peru e Bolívia trazem aviso de altitude em saúde', () => {
    expect(dicasDe('PE').saude.some((s) => /altitude|aclimat|Cusco/i.test(s))).toBe(true);
    expect(dicasDe('BO').saude.some((s) => /altitude|soroche|3\.600/i.test(s))).toBe(true);
  });

  it('país desconhecido → seções vazias, sem quebrar', () => {
    const d = dicasDe('XX');
    for (const s of SECOES_DICAS) expect(d[s.id]).toEqual([]);
  });
});
