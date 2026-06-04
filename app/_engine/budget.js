import { num } from './utils.js';

// ─────────────────────────────────────────────────────────────────────────────
// MODO ORÇAMENTO PRESCRITIVO
// Recebe o `calc` já pronto (motor estação×visto×fôlego) e, se o custo total
// estoura o teto, sugere ONDE cortar dias pra caber — com estratégia "inteligente":
// corta primeiro os países que JÁ são problema (furando visto > fora de época),
// e dentro disso os de maior custo/dia (fecham a conta com menos dias sacrificados).
// Respeita um piso mínimo de dias por país e nunca remove um país (só sugere cortes).
// Função PURA: sem React, sem tokens — isolada de propósito.
// ─────────────────────────────────────────────────────────────────────────────

const EPS = 1e-9;

// Prioridade de corte de um trecho (maior = corta antes).
function prioridadeDe(t) {
  if (t.visto && t.visto.nivel === 'over') return 3;     // furando visto: cortar ajuda 2x
  if (t.estacao && t.estacao.nivel === 'ruim') return 2;  // estadia toda fora de época
  if (t.estacao && t.estacao.nivel === 'parcial') return 1;
  return 0;                                               // boa época + visto ok: cortar por último
}

function motivoDe(t) {
  if (t.visto && t.visto.nivel === 'over') return 'visto';
  if (t.estacao && (t.estacao.nivel === 'ruim' || t.estacao.nivel === 'parcial')) return 'estacao';
  return 'custo';
}

export function sugerirOrcamento(calc, opts = {}) {
  const pisoMin = Math.max(0, opts.pisoMin != null ? opts.pisoMin : 5);
  const orcamento = num(calc.orcamento);
  const custoTotal = num(calc.custoTotal);

  if (orcamento <= 0) return { status: 'sem-orcamento', cortes: [] };

  const excesso = custoTotal - orcamento; // base; > 0 = estoura o teto
  if (excesso <= EPS) {
    return { status: 'cabe', folga: orcamento - custoTotal, cortes: [], diasCortados: 0, economiaTotal: 0, novoTotal: custoTotal };
  }

  // Candidatos a corte: quanto cada país pode ceder (até o piso) e quanto poupa por dia.
  // Transporte é custo fixo (não cai cortando dias), então só conta a vida diária.
  const candidatos = calc.trechos
    .map(t => ({
      id: t.id,
      nome: t.nome,
      sDia: Math.max(0, num(t.custoEfetivoDia)), // poupança por dia cortado (moeda base)
      maxCorte: Math.max(0, num(t.dias) - pisoMin),
      prioridade: prioridadeDe(t),
      motivo: motivoDe(t),
    }))
    .filter(c => c.sDia > EPS && c.maxCorte > 0);

  // Problema primeiro; empate → maior poupança/dia (fecha a conta com menos dias).
  candidatos.sort((a, b) => (b.prioridade - a.prioridade) || (b.sDia - a.sDia));

  let restante = excesso;
  const cortes = [];
  for (const c of candidatos) {
    if (restante <= EPS) break;
    const diasNecessarios = Math.ceil((restante - EPS) / c.sDia);
    const dias = Math.min(diasNecessarios, c.maxCorte);
    if (dias <= 0) continue;
    const economia = dias * c.sDia;
    restante -= economia;
    cortes.push({ id: c.id, nome: c.nome, dias, economia, motivo: c.motivo });
  }

  const cabe = restante <= EPS;
  const economiaTotal = cortes.reduce((s, x) => s + x.economia, 0);
  const diasCortados = cortes.reduce((s, x) => s + x.dias, 0);

  return {
    status: cabe ? 'ok' : 'insuficiente',
    excesso,
    cortes,
    diasCortados,
    economiaTotal,
    novoTotal: custoTotal - economiaTotal,
    faltam: cabe ? 0 : restante, // ainda falta cortar isto (base) mesmo todos no piso
  };
}

// Aplica os cortes sugeridos: devolve um NOVO plano com os dias reduzidos nos
// trechos indicados (imutável — não toca no plano original). Permite ao usuário
// aceitar a prescrição com 1 clique.
export function aplicarCortes(plan, cortes) {
  const reducao = new Map((cortes || []).map(c => [c.id, num(c.dias)]));
  return {
    ...plan,
    legs: plan.legs.map(l => {
      const corte = reducao.get(l.id);
      if (!corte) return l;
      return { ...l, dias: Math.max(0, num(l.dias) - corte) };
    }),
  };
}
