/* =============================================================================
   MODO GRUPO — rateio ANTES da viagem
   ---------------------------------------------------------------------------
   O Splitwise só divide DEPOIS de gastar. A gente já tem o custo total e por
   categoria — então divide ANTES: "vocês são 3, dá US$ X por pessoa, e olha
   quanto cada categoria pesa por cabeça". Função PURA → testável.
   ========================================================================== */
import { num } from './utils.js';

export function dividirCusto(total, n, categorias) {
  const pessoas = Math.max(1, Math.round(num(n) || 1));
  const t = Math.max(0, num(total));
  const porPessoa = Math.round(t / pessoas);
  const porCategoria = Array.isArray(categorias)
    ? categorias.map((c) => ({
        id: c.id, label: c.label, icon: c.icon,
        total: Math.round(num(c.valor)),
        porPessoa: Math.round(num(c.valor) / pessoas),
      }))
    : [];
  return { n: pessoas, total: Math.round(t), porPessoa, porCategoria };
}

// Acerto de contas: dado quem já pagou o quê, quem deve quanto pra fechar igual.
// (Diferencial vs Splitwise: dá pra simular ANTES, no planejamento.) Puro.
export function acertarContas(pagamentos, n) {
  const pessoas = Math.max(1, Math.round(num(n) || (pagamentos || []).length || 1));
  const pagos = (pagamentos || []).map((p) => ({ pessoa: String(p.pessoa || '?'), pagou: Math.max(0, num(p.valor)) }));
  const total = pagos.reduce((s, p) => s + p.pagou, 0);
  const justo = total / pessoas;
  // saldo > 0 = tem a receber; < 0 = deve.
  const saldos = pagos.map((p) => ({ pessoa: p.pessoa, pagou: Math.round(p.pagou), saldo: Math.round(p.pagou - justo) }));

  // Acertos: casa quem deve com quem tem a receber (guloso, determinístico).
  const credores = saldos.filter((s) => s.saldo > 0).map((s) => ({ ...s })).sort((a, b) => b.saldo - a.saldo);
  const devedores = saldos.filter((s) => s.saldo < 0).map((s) => ({ ...s, saldo: -s.saldo })).sort((a, b) => b.saldo - a.saldo);
  const acertos = [];
  let i = 0, j = 0;
  while (i < devedores.length && j < credores.length) {
    const v = Math.min(devedores[i].saldo, credores[j].saldo);
    if (v > 0) acertos.push({ de: devedores[i].pessoa, para: credores[j].pessoa, valor: Math.round(v) });
    devedores[i].saldo -= v; credores[j].saldo -= v;
    if (devedores[i].saldo <= 0) i++;
    if (credores[j].saldo <= 0) j++;
  }
  return { total: Math.round(total), justo: Math.round(justo), saldos, acertos };
}
