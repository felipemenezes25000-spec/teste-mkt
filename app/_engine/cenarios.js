import { calcular } from './calc.js';
import { uid } from './utils.js';

// ─────────────────────────────────────────────────────────────────────────────
// CENÁRIOS — "Rota A vs B". Tira fotos (snapshots) nomeadas do plano atual e
// compara as métricas-chave lado a lado. Aditivo e isolado: vive numa chave
// própria do localStorage, não toca no plano ativo nem na sincronização.
// ─────────────────────────────────────────────────────────────────────────────
export const CENARIOS_KEY = 'mundosemfim.cenarios.v1';

export function carregarCenarios() {
  try {
    const raw = localStorage.getItem(CENARIOS_KEY);
    const arr = raw ? JSON.parse(raw) : [];
    return Array.isArray(arr) ? arr : [];
  } catch (e) { return []; }
}

export function salvarCenarios(lista) {
  try { localStorage.setItem(CENARIOS_KEY, JSON.stringify(lista || [])); } catch (e) {}
}

// Métricas-chave de um plano (derivadas do mesmo motor estação×visto×fôlego).
export function resumoDe(plan) {
  const c = calcular(plan);
  return {
    base: c.base,
    nPaises: c.trechos.length,
    diasTotais: c.diasTotais,
    custoTotal: c.custoTotal,
    cabe: c.folego.cobreTudo,
    folgaOuFalta: c.folego.cobreTudo ? c.folego.sobra : c.folego.falta,
    furosVisto: c.furosVisto,
    conflitosEstacao: c.conflitosEstacao,
    fimViagem: c.fimViagem,
  };
}

// Snapshot nomeado do plano — DEEP CLONE pra ficar 100% independente do plano ativo
// (editar a rota depois NÃO muda o cenário salvo) e NUNCA guarda a chave de IA.
export function snapshotCenario(plan, nome) {
  const clone = JSON.parse(JSON.stringify(plan));
  if (clone.settings && clone.settings.ai) clone.settings.ai.apiKey = '';
  return { id: uid(), nome: (nome || 'Cenário').slice(0, 40), plan: clone };
}
