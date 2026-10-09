// @ts-check
// Rotas e otimizador de roteiro (OMEGA V4 §18-19 / §76-E).
// - Trechos ESTIMADOS por distância (haversine × fator de desvio × velocidade do
//   modo) quando não há motor de rota; trechos REAIS vêm do provider (OSRM/FOSSGIS)
//   e substituem a estimativa mantendo a evidência.
// - Otimizador do dia: respeita horário FIXO (reserva), janelas de abertura,
//   duração de cada parada, buffer e fim do dia. Semente vizinho-mais-próximo +
//   melhoria 2-opt; nunca aprova roteiro impossível em silêncio.
//   Status: VALID | VALID_WITH_WARNINGS | UNFEASIBLE | UNKNOWN_DATA.

/** @typedef {'WALK'|'BIKE'|'DRIVE'|'TRANSIT'} Modo */
/**
 * @typedef {{ id: string, nome: string, lat?: number, lng?: number, duracaoMin?: number,
 *   abre?: string, fecha?: string, fixoInicio?: string }} Parada
 */

const VEL_KMH = { WALK: 4.5, BIKE: 14, DRIVE: 28, TRANSIT: 20 };
const DESVIO = { WALK: 1.3, BIKE: 1.3, DRIVE: 1.4, TRANSIT: 1.35 };
const ESPERA_MIN = { WALK: 0, BIKE: 0, DRIVE: 5, TRANSIT: 8 };

/** @param {{lat:number,lng:number}} a @param {{lat:number,lng:number}} b */
export function distanciaKm(a, b) {
  const R = 6371, rad = (x) => (x * Math.PI) / 180;
  const dLat = rad(b.lat - a.lat), dLng = rad(b.lng - a.lng);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.min(1, Math.sqrt(h)));
}

const temCoord = (p) => Number.isFinite(p && p.lat) && Number.isFinite(p && p.lng);

/** Escolhe o modo plausível pela distância (a pé até ~1,5 km; senão transporte). */
export function modoSugerido(km) {
  if (km <= 1.5) return 'WALK';
  if (km <= 25) return 'TRANSIT';
  return 'DRIVE';
}

/**
 * Trecho estimado (sem motor de rota). Sempre marcado como ESTIMATE.
 * @param {Parada} a @param {Parada} b @param {Modo} [modo]
 */
export function trechoEstimado(a, b, modo) {
  if (!temCoord(a) || !temCoord(b)) {
    return { fromPlaceId: a.id, toPlaceId: b.id, mode: modo || 'TRANSIT', distanceMeters: null, durationSeconds: null, provider: 'nenhum', freshness: 'UNAVAILABLE', warnings: ['Sem coordenadas para estimar este deslocamento.'] };
  }
  const reta = distanciaKm(/** @type {any} */ (a), /** @type {any} */ (b));
  const m = modo || modoSugerido(reta);
  const km = reta * DESVIO[m];
  const min = (km / VEL_KMH[m]) * 60 + ESPERA_MIN[m];
  const warnings = [];
  if (m === 'WALK' && km > 3) warnings.push('Caminhada longa (> 3 km).');
  if (m === 'TRANSIT') warnings.push('Transporte público estimado — horários reais não consultados.');
  return {
    fromPlaceId: a.id, toPlaceId: b.id, mode: m,
    distanceMeters: Math.round(km * 1000), durationSeconds: Math.round(min * 60),
    provider: 'estimativa-msf', freshness: 'ESTIMATE', warnings,
  };
}

/** "09:30" → minutos desde 00:00 (ou null). */
export function hm(s) {
  const m = /^(\d{1,2}):(\d{2})$/.exec(String(s || ''));
  return m ? +m[1] * 60 + +m[2] : null;
}
/** minutos → "HH:MM" */
export function mh(min) {
  const h = Math.floor(min / 60), m = Math.round(min % 60);
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

/**
 * Simula a sequência: horários de chegada/saída, esperas, violações.
 * @param {Parada[]} ordem
 * @param {{ inicio?: string, fim?: string, bufferMin?: number, origem?: Parada, modo?: Modo, trecho?: (a:Parada,b:Parada)=>any }} [cfg]
 */
export function simular(ordem, cfg = {}) {
  const inicio = hm(cfg.inicio || '09:00') ?? 540;
  const fim = hm(cfg.fim || '20:00') ?? 1200;
  const buffer = cfg.bufferMin ?? 10;
  const trecho = cfg.trecho || ((a, b) => trechoEstimado(a, b, cfg.modo));
  let t = inicio;
  let prev = cfg.origem || null;
  const passos = [];
  const avisos = [];
  let violacoes = 0;
  let desconhecidos = 0;
  let deslocMin = 0, deslocM = 0, esperaMin = 0;
  for (const p of ordem) {
    let seg = null;
    if (prev) {
      seg = trecho(prev, p);
      if (seg.durationSeconds == null) desconhecidos++;
      const d = (seg.durationSeconds || 0) / 60;
      t += d + buffer;
      deslocMin += d;
      deslocM += seg.distanceMeters || 0;
    }
    const abre = hm(p.abre), fecha = hm(p.fecha), fixo = hm(p.fixoInicio);
    let chegada = t;
    if (fixo != null) {
      if (t > fixo + 5) { violacoes++; avisos.push(`${p.nome}: chega ${mh(t)}, depois do horário reservado (${mh(fixo)}).`); }
      else { esperaMin += Math.max(0, fixo - t); t = fixo; }
    } else if (abre != null && t < abre) { esperaMin += abre - t; t = abre; }
    const dur = p.duracaoMin ?? 90;
    if (fecha != null && t + dur > fecha) {
      violacoes++;
      avisos.push(`${p.nome}: fecha ${mh(fecha)} e a visita iria até ${mh(t + dur)}.`);
    }
    if (p.duracaoMin == null) desconhecidos++;
    passos.push({ id: p.id, nome: p.nome, chegada: mh(chegada), inicio: mh(t), fim: mh(t + dur), trecho: seg });
    t += dur;
    prev = p;
  }
  if (t > fim) { violacoes++; avisos.push(`O dia termina às ${mh(t)}, depois do limite (${mh(fim)}).`); }
  return { passos, avisos, violacoes, desconhecidos, termino: mh(t), deslocMin: Math.round(deslocMin), deslocKm: +(deslocM / 1000).toFixed(1), esperaMin: Math.round(esperaMin) };
}

const custo = (s) => s.violacoes * 10000 + s.deslocMin + s.esperaMin * 0.3;

/**
 * Otimiza a ordem de um dia mantendo paradas com horário fixo em ordem cronológica.
 * @param {Parada[]} paradas
 * @param {{ inicio?: string, fim?: string, bufferMin?: number, origem?: Parada, modo?: Modo }} [cfg]
 */
export function otimizarDia(paradas, cfg = {}) {
  const lista = [...paradas];
  if (!lista.length) return { status: 'VALID', ordem: [], antes: simular([], cfg), depois: simular([], cfg), avisos: [], naoEncaixados: [], delta: { deslocMin: 0, deslocKm: 0, esperaMin: 0 } };
  const semCoord = lista.filter((p) => !temCoord(p));
  const antes = simular(lista, cfg);

  // semente: vizinho mais próximo, respeitando ordem dos fixos
  const fixos = lista.filter((p) => hm(p.fixoInicio) != null).sort((a, b) => /** @type {number} */ (hm(a.fixoInicio)) - /** @type {number} */ (hm(b.fixoInicio)));
  const livres = lista.filter((p) => hm(p.fixoInicio) == null);
  const seq = [];
  let atual = cfg.origem && temCoord(cfg.origem) ? cfg.origem : null;
  const restantes = [...livres];
  const proxFixo = [...fixos];
  while (restantes.length || proxFixo.length) {
    // insere fixo quando "o relógio" alcançar o horário (aproximação: antes de livres mais distantes)
    if (proxFixo.length && (!restantes.length || simular([...seq, proxFixo[0]], cfg).violacoes === simular(seq, cfg).violacoes && simular([...seq, ...restantes.slice(0, 1), proxFixo[0]], cfg).violacoes > simular([...seq, proxFixo[0]], cfg).violacoes)) {
      const f = /** @type {Parada} */ (proxFixo.shift());
      seq.push(f); atual = f; continue;
    }
    let melhor = 0, melhorD = Infinity;
    restantes.forEach((p, i) => {
      const d = atual && temCoord(atual) && temCoord(p) ? distanciaKm(/** @type {any} */ (atual), /** @type {any} */ (p)) : 1e6 + i;
      if (d < melhorD) { melhorD = d; melhor = i; }
    });
    const p = restantes.splice(melhor, 1)[0];
    seq.push(p); atual = p;
  }

  // melhoria 2-opt (não inverte a ordem relativa de fixos)
  let melhorSeq = seq, melhorCusto = custo(simular(seq, cfg));
  let melhorou = true, iter = 0;
  const ordemFixosOk = (s) => { const f = s.filter((p) => hm(p.fixoInicio) != null).map((p) => hm(p.fixoInicio)); return f.every((v, i) => i === 0 || v >= f[i - 1]); };
  while (melhorou && iter++ < 60) {
    melhorou = false;
    for (let i = 0; i < melhorSeq.length - 1; i++) {
      for (let k = i + 1; k < melhorSeq.length; k++) {
        const cand = [...melhorSeq.slice(0, i), ...melhorSeq.slice(i, k + 1).reverse(), ...melhorSeq.slice(k + 1)];
        if (!ordemFixosOk(cand)) continue;
        const c = custo(simular(cand, cfg));
        if (c + 0.01 < melhorCusto) { melhorSeq = cand; melhorCusto = c; melhorou = true; }
      }
    }
  }
  // se a ordem original já era melhor, mantém (nunca piora)
  if (custo(antes) <= melhorCusto) melhorSeq = lista;
  const depois = simular(melhorSeq, cfg);

  // paradas que não cabem: as que causam violação de fechamento/fim do dia
  const naoEncaixados = depois.violacoes ? depois.avisos.map((a) => a.split(':')[0]) : [];
  let status = 'VALID';
  if (depois.violacoes) status = 'UNFEASIBLE';
  else if (semCoord.length || depois.desconhecidos) status = depois.desconhecidos >= lista.length ? 'UNKNOWN_DATA' : 'VALID_WITH_WARNINGS';
  const avisos = [...depois.avisos];
  if (semCoord.length) avisos.push(`${semCoord.length} parada(s) sem coordenada: deslocamento não calculado.`);
  if (depois.desconhecidos) avisos.push('Algumas durações/deslocamentos são desconhecidos — o horário é aproximado.');
  return {
    status, ordem: melhorSeq.map((p) => p.id), antes, depois, avisos, naoEncaixados,
    delta: { deslocMin: depois.deslocMin - antes.deslocMin, deslocKm: +(depois.deslocKm - antes.deslocKm).toFixed(1), esperaMin: depois.esperaMin - antes.esperaMin },
    mudou: melhorSeq.some((p, i) => p.id !== lista[i].id),
  };
}

export const STATUS_ROTEIRO = {
  VALID: { rotulo: 'Viável', tom: 'success' },
  VALID_WITH_WARNINGS: { rotulo: 'Viável com ressalvas', tom: 'warn' },
  UNFEASIBLE: { rotulo: 'Inviável', tom: 'danger' },
  UNKNOWN_DATA: { rotulo: 'Dados insuficientes', tom: 'neutral' },
};
