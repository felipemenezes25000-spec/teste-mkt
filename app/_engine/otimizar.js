/* =============================================================================
   OTIMIZADOR DE ORDEM (determinístico, grátis)
   ---------------------------------------------------------------------------
   Reordena os trechos de uma viagem pra (1) chegar em cada país na MELHOR ÉPOCA
   e (2) reduzir o ZIGUE-ZAGUE geográfico. É o "resolve pra mim" sem IA: busca
   local 2-opt sobre um custo = peso_estação × conflitos + distância. Como a
   chegada de cada trecho = início + soma dos dias anteriores, mudar a ORDEM muda
   o mês em que se chega em cada país. Função PURA → testável.
   ========================================================================== */
import { num, parseDate, addDays, distanciaKm } from './utils.js';
import { statusEstacao } from './calc.js';

const PESO_ESTACAO = 2.0;   // estação é o diferencial → pesa mais
const KM_POR_PONTO = 5000;  // 5.000 km de deslocamento = 1 ponto de custo

const penalEstacao = (nivel) => (nivel === 'bom' ? 0 : nivel === 'parcial' ? 1 : nivel === 'ruim' ? 3 : 0.5);

// Custo de uma ordem (array de índices em legs).
function custoOrdem(legs, ordem, start, origemCoords) {
  let cursor = new Date(start);
  let estacao = 0, km = 0;
  let prev = origemCoords || null;
  for (const i of ordem) {
    const leg = legs[i];
    const chegada = new Date(cursor);
    const dias = Math.max(0, Math.round(num(leg.dias)));
    estacao += penalEstacao(statusEstacao(chegada, dias, leg.melhoresMeses).nivel);
    if (prev && leg.coords) km += distanciaKm(prev, leg.coords);
    if (leg.coords) prev = leg.coords;
    cursor = addDays(chegada, dias);
  }
  return PESO_ESTACAO * estacao + km / KM_POR_PONTO;
}

// Conta conflitos de estação (ruim) e parciais de uma ordem (pra o resumo).
function conflitos(legs, ordem, start) {
  let cursor = new Date(start), ruim = 0, parcial = 0;
  for (const i of ordem) {
    const leg = legs[i];
    const dias = Math.max(0, Math.round(num(leg.dias)));
    const nivel = statusEstacao(new Date(cursor), dias, leg.melhoresMeses).nivel;
    if (nivel === 'ruim') ruim++; else if (nivel === 'parcial') parcial++;
    cursor = addDays(cursor, dias);
  }
  return { ruim, parcial };
}

function doisOpt(legs, ordemInicial, start, origemCoords) {
  let best = ordemInicial.slice();
  let bestCost = custoOrdem(legs, best, start, origemCoords);
  let improved = true, guard = 0;
  while (improved && guard++ < 300) {
    improved = false;
    for (let i = 0; i < best.length - 1; i++) {
      for (let j = i + 1; j < best.length; j++) {
        const cand = best.slice(0, i).concat(best.slice(i, j + 1).reverse(), best.slice(j + 1));
        const c = custoOrdem(legs, cand, start, origemCoords);
        if (c < bestCost - 1e-9) { best = cand; bestCost = c; improved = true; }
      }
    }
  }
  return { ordem: best, cost: bestCost };
}

export function otimizarOrdemLocal(plan) {
  const legs = (plan && plan.legs) || [];
  if (legs.length < 2) return { order: legs.map((l) => l.id), melhorou: false };

  const start = parseDate(plan.settings && plan.settings.dataInicio);
  const origemCoords = (plan.settings && plan.settings.origemCoords) || null;
  const atual = legs.map((_, i) => i);

  // Duas sementes determinísticas (ordem atual e invertida) → pega a melhor.
  const r1 = doisOpt(legs, atual, start, origemCoords);
  const r2 = doisOpt(legs, atual.slice().reverse(), start, origemCoords);
  const melhor = r1.cost <= r2.cost ? r1 : r2;

  const order = melhor.ordem.map((i) => legs[i].id);
  const igual = order.every((id, k) => id === legs[k].id);
  const antes = conflitos(legs, atual, start);
  const depois = conflitos(legs, melhor.ordem, start);

  return {
    order,
    melhorou: !igual && melhor.cost < custoOrdem(legs, atual, start, origemCoords) - 1e-6,
    antes, depois,
    resumo: montarResumo(igual, antes, depois),
  };
}

function montarResumo(igual, antes, depois) {
  if (igual) return 'A ordem atual já está bem otimizada — sem mudança sugerida.';
  const ganhoRuim = antes.ruim - depois.ruim;
  const partes = [];
  if (ganhoRuim > 0) partes.push(`${ganhoRuim} trecho(s) saíram de "fora de época"`);
  if (depois.parcial < antes.parcial) partes.push(`menos chegadas parciais`);
  partes.push('rota com menos zigue-zague');
  return `Reordenei pra: ${partes.join(', ')}.`;
}
