/* =============================================================================
   SCORE DE VIAGEM — 8 dimensões (0–100)
   ---------------------------------------------------------------------------
   Recebe o `calc` pronto (motor estação×visto×fôlego) e os índices por país, e
   devolve uma nota por dimensão + uma nota geral ponderada. É o coração da
   "camada de inteligência": transforma DADOS (custo, visto, estação, índices)
   em uma LEITURA acionável — algo que nenhum concorrente entrega.

   Dimensões: custoBeneficio, conforto, seguranca, tempoLivre, experienciaLocal,
   gastronomia, risco (10=baixo risco), economia.

   Função PURA → testável. Sem React, sem fetch.
   ========================================================================== */
import { num, clamp } from './utils.js';
import { indiceDe } from './indices.js';

const round = (v) => Math.round(clamp(v, 0, 100));

// Média de um índice (0–10) ponderada pelos dias de cada trecho → 0–10.
function indiceMedioPorDia(trechos, campo) {
  let soma = 0, dias = 0;
  for (const t of trechos) {
    const d = Math.max(0, num(t.dias));
    if (d <= 0) continue;
    soma += indiceDe(t.code)[campo] * d;
    dias += d;
  }
  return dias > 0 ? soma / dias : 5;
}

// Trecho com o pior índice de um campo (pra explicar a nota).
function piorTrecho(trechos, campo) {
  let pior = null, val = Infinity;
  for (const t of trechos) {
    const v = indiceDe(t.code)[campo];
    if (v < val) { val = v; pior = t; }
  }
  return pior ? { nome: pior.nome, valor: val } : null;
}

export const SELO = (geral) =>
  geral >= 80 ? 'excelente' : geral >= 65 ? 'bom' : geral >= 50 ? 'regular' : 'fraco';

// Pesos padrão por dimensão (somam 1). Um perfil pode sobrescrever via opts.pesos.
export const PESOS_PADRAO = {
  custoBeneficio: 0.18, conforto: 0.10, seguranca: 0.14, tempoLivre: 0.10,
  experienciaLocal: 0.16, gastronomia: 0.10, risco: 0.12, economia: 0.10,
};

export function scoreViagem(calc, opts = {}) {
  const trechos = (calc && calc.trechos) || [];
  const folego = (calc && calc.folego) || {};
  const ratio = isFinite(folego.ratio) ? folego.ratio : (calc && calc.orcamento > 0 ? calc.custoTotal / calc.orcamento : 1);
  const mediaDia = num(calc && calc.mediaDia);
  const numPaises = trechos.length || 1;
  const diasTotais = num(calc && calc.diasTotais);

  // 1) CUSTO-BENEFÍCIO — quão bem o dinheiro rende. Se há orçamento, parte do
  // quanto da meta é usada (folga = mais valor); senão, do custo/dia absoluto.
  let custoBeneficio;
  if (calc && calc.orcamento > 0) {
    custoBeneficio = 100 - (ratio - 0.6) * 120; // 0.6→100, 0.85→70, 1.0→52, 1.2→28
  } else {
    custoBeneficio = 110 - mediaDia * 1.1;       // 25/dia→83, 50→55, 80→22
  }
  custoBeneficio = round(custoBeneficio);

  // 2) CONFORTO — sobe com o gasto diário (mais gasto = mais conforto possível).
  // Penaliza se o fôlego não cobre tudo (não dá pra bancar o conforto).
  let conforto = 18 + mediaDia * 0.95; // 20→37, 45→61, 70→84, 95→108→100
  if (folego.cobreTudo === false) conforto -= 18;
  conforto = round(conforto);

  // 3) SEGURANÇA — média ponderada do índice de segurança por dias.
  const segIdx = indiceMedioPorDia(trechos, 'seguranca');
  const seguranca = round(segIdx * 10);
  const segPior = piorTrecho(trechos, 'seguranca');

  // 4) TEMPO LIVRE — ritmo. Mais dias por país = menos corrido.
  const pace = diasTotais / numPaises; // dias médios por país
  let tempoLivre = (pace - 3) * 9 + 30; // 3→30, 7→66, 10→93
  tempoLivre = round(tempoLivre);

  // 5) EXPERIÊNCIA LOCAL — diversidade de regiões + imersão cultural.
  const regioes = new Set(trechos.map((t) => t.regiao).filter(Boolean));
  const diversidade = clamp((regioes.size / Math.max(1, numPaises)) * 100, 0, 100);
  const cultIdx = indiceMedioPorDia(trechos, 'cultura');
  const experienciaLocal = round(diversidade * 0.4 + cultIdx * 10 * 0.6);

  // 6) GASTRONOMIA — média ponderada do índice gastronômico.
  const gastIdx = indiceMedioPorDia(trechos, 'gastronomia');
  const gastronomia = round(gastIdx * 10);

  // 7) RISCO — 100 = baixo risco. Penaliza furo de visto, fora de época e
  // baixa segurança. (É o "alerta" antes de a viagem dar errado.)
  let risco = 100
    - num(calc && calc.furosVisto) * 25
    - num(calc && calc.conflitosEstacao) * 15
    - num(calc && calc.parciaisEstacao) * 6
    - (10 - segIdx) * 4;
  risco = round(risco);

  // 8) ECONOMIA — quanto de fôlego sobra (dias extras bancáveis).
  let economia;
  if (folego.cobreTudo) {
    const extras = num(folego.diasExtras);
    economia = 52 + extras * 1.6; // 0→52, 10→68, 30→100
  } else {
    economia = 22; // não cobre tudo → pouca margem
  }
  economia = round(economia);

  const dimensoes = {
    custoBeneficio: { nota: custoBeneficio, texto: textoCB(calc, ratio, mediaDia) },
    conforto: { nota: conforto, texto: `Gasto médio de ~US$ ${Math.round(mediaDia)}/dia${folego.cobreTudo === false ? ' — mas o fôlego não cobre tudo.' : '.'}` },
    seguranca: { nota: seguranca, texto: `Segurança média ${segIdx.toFixed(1)}/10${segPior ? `; trecho mais sensível: ${segPior.nome} (${segPior.valor}/10).` : '.'}` },
    tempoLivre: { nota: tempoLivre, texto: `~${pace.toFixed(1)} dia(s) por país (${pace < 5 ? 'corrido' : pace < 9 ? 'equilibrado' : 'tranquilo'}).` },
    experienciaLocal: { nota: experienciaLocal, texto: `${regioes.size} região(ões) e imersão cultural ${cultIdx.toFixed(1)}/10.` },
    gastronomia: { nota: gastronomia, texto: `Riqueza gastronômica média ${gastIdx.toFixed(1)}/10.` },
    risco: { nota: risco, texto: textoRisco(calc) },
    economia: { nota: economia, texto: folego.cobreTudo ? `Sobram ~${num(folego.diasExtras)} dia(s) de fôlego.` : 'Orçamento não cobre a viagem inteira.' },
  };

  const pesos = normalizarPesos(opts.pesos || PESOS_PADRAO);
  let geral = 0;
  for (const k of Object.keys(pesos)) geral += (dimensoes[k] ? dimensoes[k].nota : 0) * pesos[k];
  geral = round(geral);

  return { dimensoes, geral, selo: SELO(geral), pesos };
}

function textoCB(calc, ratio, mediaDia) {
  if (calc && calc.orcamento > 0) {
    const pct = Math.round(ratio * 100);
    return `A viagem usa ~${pct}% do orçamento (${pct <= 85 ? 'folgado' : pct <= 100 ? 'no limite' : 'estoura'}).`;
  }
  return `Custo médio de ~US$ ${Math.round(mediaDia)}/dia (sem orçamento definido).`;
}

function textoRisco(calc) {
  const fv = num(calc && calc.furosVisto), ce = num(calc && calc.conflitosEstacao);
  const partes = [];
  if (fv) partes.push(`${fv} furo(s) de visto`);
  if (ce) partes.push(`${ce} trecho(s) fora de época`);
  return partes.length ? `Atenção: ${partes.join(' e ')}.` : 'Sem furos de visto nem conflito de estação.';
}

// Garante que os pesos somem 1 (robusto a perfis arbitrários).
export function normalizarPesos(pesos) {
  const total = Object.values(pesos).reduce((s, v) => s + Math.max(0, num(v)), 0) || 1;
  const out = {};
  for (const k of Object.keys(PESOS_PADRAO)) out[k] = Math.max(0, num(pesos[k])) / total;
  return out;
}
