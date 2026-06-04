import { describe, it, expect } from 'vitest';
import { planoExemplo } from './storage.js';
import { resumoDe, snapshotCenario } from './cenarios.js';

describe('cenarios (Rota A vs B)', () => {
  it('resumoDe traz as métricas-chave do motor', () => {
    const r = resumoDe(planoExemplo());
    expect(r.nPaises).toBe(5);
    expect(r.diasTotais).toBeGreaterThan(0);
    expect(r.custoTotal).toBeGreaterThan(0);
    expect(typeof r.cabe).toBe('boolean');
    expect(r.furosVisto).toBeGreaterThanOrEqual(0);
  });

  it('snapshot nomeia, gera id e nunca guarda a chave de IA', () => {
    const p = planoExemplo();
    p.settings.ai.apiKey = 'sk-segredo';
    const c = snapshotCenario(p, 'Plano A');
    expect(c.nome).toBe('Plano A');
    expect(c.id).toBeTruthy();
    expect(c.plan.settings.ai.apiKey).toBe('');
  });

  it('compara dois cenários: menos dias num deles reduz o total', () => {
    const a = snapshotCenario(planoExemplo(), 'A');
    const p2 = planoExemplo();
    p2.legs[0].dias = 5; // corta dias do 1º país
    const b = snapshotCenario(p2, 'B');
    expect(resumoDe(b.plan).diasTotais).toBeLessThan(resumoDe(a.plan).diasTotais);
  });

  it('snapshot é imutável em relação ao plano original', () => {
    const p = planoExemplo();
    const c = snapshotCenario(p, 'X');
    p.legs[0].dias = 1; // muta o original depois
    expect(c.plan.legs[0].dias).not.toBe(1); // o snapshot não acompanha
  });
});
