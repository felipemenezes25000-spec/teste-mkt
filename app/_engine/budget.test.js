import { describe, it, expect } from 'vitest';
import { calcular } from './calc.js';
import { planoExemplo } from './storage.js';
import { sugerirOrcamento, aplicarCortes } from './budget.js';

// Monta um calc real a partir do plano-exemplo (custa US$ 5.870) com um teto dado.
function calcCom(orcamento) {
  const p = planoExemplo();
  p.settings.orcamento = orcamento;
  return { calc: calcular(p), plan: p };
}

describe('sugerirOrcamento (modo orçamento prescritivo)', () => {
  it('quando já cabe no teto, não sugere cortes', () => {
    const { calc } = calcCom(6500);
    const r = sugerirOrcamento(calc);
    expect(r.status).toBe('cabe');
    expect(r.cortes).toEqual([]);
    expect(r.folga).toBeGreaterThan(0);
  });

  it('sem orçamento definido, avisa em vez de sugerir', () => {
    const { calc } = calcCom(0);
    expect(sugerirOrcamento(calc).status).toBe('sem-orcamento');
  });

  it('estourando o teto, sugere cortes que fazem caber', () => {
    const { calc } = calcCom(4000); // excesso de US$ 1.870
    const r = sugerirOrcamento(calc);
    expect(r.status).toBe('ok');
    expect(r.novoTotal).toBeLessThanOrEqual(4000);
    expect(r.diasCortados).toBeGreaterThan(0);
  });

  it('prioriza cortar o país que fura o visto (Indonésia +15) primeiro', () => {
    const { calc, plan } = calcCom(4000);
    const idIndonesia = plan.legs.find(l => l.code === 'ID').id;
    const r = sugerirOrcamento(calc);
    expect(r.cortes[0].id).toBe(idIndonesia);
    expect(r.cortes[0].motivo).toBe('visto');
  });

  it('respeita o piso mínimo de dias por país', () => {
    const piso = 5;
    const { calc } = calcCom(4000);
    const diasOrig = Object.fromEntries(calc.trechos.map(t => [t.id, t.dias]));
    const r = sugerirOrcamento(calc, { pisoMin: piso });
    for (const c of r.cortes) {
      expect(diasOrig[c.id] - c.dias).toBeGreaterThanOrEqual(piso);
    }
  });

  it('quando nem cortando ao piso cabe, retorna insuficiente com o que falta', () => {
    const { calc } = calcCom(200); // só o transporte (US$ 1.320) já estoura
    const r = sugerirOrcamento(calc);
    expect(r.status).toBe('insuficiente');
    expect(r.faltam).toBeGreaterThan(0);
  });
});

describe('aplicarCortes', () => {
  it('reduz só os dias dos trechos cortados, sem mutar o original', () => {
    const p = planoExemplo();
    const diasID = p.legs[2].dias; // Indonésia = 45
    const novo = aplicarCortes(p, [{ id: p.legs[2].id, dias: 10 }]);
    expect(novo.legs[2].dias).toBe(diasID - 10);
    expect(novo.legs[0].dias).toBe(p.legs[0].dias); // outros intactos
    expect(p.legs[2].dias).toBe(diasID);            // original não mutado
    expect(novo).not.toBe(p);
  });

  it('aplicar a sugestão realmente faz a viagem caber no teto', () => {
    const p = planoExemplo();
    p.settings.orcamento = 4000;
    const r = sugerirOrcamento(calcular(p));
    const novoTotal = calcular(aplicarCortes(p, r.cortes)).custoTotal;
    expect(novoTotal).toBeLessThanOrEqual(4000 + 1e-6);
  });
});
