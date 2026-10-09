// Busca de voos. Provider MOCK (resultados realistas e DETERMINÍSTICOS por rota+data)
// + SEAM pronto pra API real (Amadeus/Kiwi/Duffel). Sem chave → mock.
import { distanciaKm, estimarPrecoVoo } from '../_engine/utils.js';


// Hash + PRNG (mulberry32) → mesma rota/data sempre gera os mesmos voos (sem Math.random).
function hash(str) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); }
  return h >>> 0;
}
function rng(seed) {
  return function () {
    seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function horas(km, escalas) { return km / 750 + escalas * 2.2 + 1; }
function fmtDur(h) { const H = Math.floor(h); const M = Math.round((h - H) * 60); return `${H}h${M ? ' ' + M + 'm' : ''}`; }
function fmtHora(frac) {
  const total = Math.floor(frac * 24 * 60);
  const h = Math.floor(total / 60) % 24;
  const m = Math.floor((total % 60) / 15) * 15;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

export function buscarVoosMock({ origemIata, origemCoords, destinoIata, destinoCoords, dataISO, origemCidade, destinoCidade }) {
  const km = origemCoords && destinoCoords ? distanciaKm(origemCoords, destinoCoords) : 0;
  const faixa = estimarPrecoVoo(km) || { min: 120, max: 700, km };
  const r = rng(hash(`${origemIata || origemCidade}-${destinoIata || destinoCidade}-${dataISO}`));
  const n = 5 + Math.floor(r() * 2);
  const resultados = [];
  for (let i = 0; i < n; i++) {
    const escalas = r() < 0.45 ? 0 : r() < 0.82 ? 1 : 2;
    const preco = Math.max(40, Math.round((faixa.min + (faixa.max - faixa.min) * r()) * (1 - escalas * 0.05) / 5) * 5);
    const dur = horas(km || 1200, escalas) * (0.92 + r() * 0.16); // ±8% → diretos não ficam idênticos
    const partida = 0.18 + r() * 0.62;
    resultados.push({
      id: 'f' + i,
      // sem nome de companhia real: é um CENÁRIO estimado, não uma oferta (V4 §29/§30)
      companhia: `Cenário estimado ${String.fromCharCode(65 + i)}`,
      _sorteioCompanhia: r(),
      escalas,
      preco,
      duracaoH: dur,
      duracao: fmtDur(dur),
      partida: fmtHora(partida),
      chegada: fmtHora((partida + dur / 24) % 1),
    });
  }
  resultados.sort((a, b) => a.preco - b.preco);
  const melhor = escolherMelhorCB(resultados);
  if (melhor) melhor.melhorCustoBeneficio = true;
  return { km, faixa, resultados, moeda: 'USD', fonte: 'mock' };
}

// Selo "custo-benefício": menor score = preço + penalidade FORTE por escala (conexão
// custa tempo/risco real) + penalidade por duração. Pondera os 3 — um 1-escala só
// leva o selo se for BEM mais barato que o melhor direto (corrige o caso da auditoria
// em que um 1-escala lento vencia um direto por só US$110).
export function escolherMelhorCB(resultados) {
  let melhor = null, best = Infinity;
  for (const f of resultados) {
    const score = f.preco + f.escalas * 120 + f.duracaoH * 10;
    if (score < best) { best = score; melhor = f; }
  }
  return melhor;
}

// SEAM — quando tiver chave, plugue o provider real aqui:
// async function buscarVoosAmadeus(params) { /* fetch https://api.amadeus.com/... */ }
export async function buscarVoos(params) {
  // const provider = process.env.NEXT_PUBLIC_FLIGHTS_PROVIDER;
  // if (provider === 'amadeus') return buscarVoosAmadeus(params);
  return buscarVoosMock(params);
}

// Origens comuns (com coords/IATA) pra estimar distância de verdade.
export const ORIGENS = [
  { cidade: 'São Paulo', iata: 'GRU', coords: [-46.47, -23.43] },
  { cidade: 'Rio de Janeiro', iata: 'GIG', coords: [-43.25, -22.81] },
  { cidade: 'Lisboa', iata: 'LIS', coords: [-9.14, 38.77] },
  { cidade: 'Madri', iata: 'MAD', coords: [-3.57, 40.49] },
  { cidade: 'Nova York', iata: 'JFK', coords: [-73.78, 40.64] },
  { cidade: 'Londres', iata: 'LHR', coords: [-0.45, 51.47] },
  { cidade: 'Buenos Aires', iata: 'EZE', coords: [-58.54, -34.82] },
];
