// Roteamento REAL no browser (OMEGA V4 §18): FOSSGIS OSRM (routing.openstreetmap.de),
// perfis a pé / bicicleta / carro. Política do provedor: ≤ 1 req/s, uso leve,
// atribuição obrigatória → 1 requisição por dia de roteiro, cache e fila.
// Transporte público NÃO é coberto → o chamador usa a estimativa rotulada.
import { chamarProvider } from '../_domain/provider.js';
import { trechoEstimado } from '../_domain/rotas.js';

const PERFIL = { WALK: 'routed-foot', BIKE: 'routed-bike', DRIVE: 'routed-car' };
export const ATRIBUICAO_ROTAS = 'Rotas: OSRM · FOSSGIS (routing.openstreetmap.de) · dados © OpenStreetMap';
const cache = new Map();
let ultima = 0;

async function aguardarVez() {
  const espera = Math.max(0, ultima + 1100 - Date.now());
  ultima = Date.now() + espera;
  if (espera) await new Promise((r) => setTimeout(r, espera));
}

/**
 * Calcula a rota real passando por todas as paradas (na ordem dada).
 * @param {Array<{id:string,nome:string,lat:number,lng:number}>} paradas
 * @param {'WALK'|'BIKE'|'DRIVE'|'TRANSIT'} modo
 * @returns {Promise<{ status:'LIVE'|'DEGRADED'|'UNAVAILABLE', trechos:any[], geometria:number[][]|null, evidencia:any, motivo?:string }>}
 */
export async function rotaDoDia(paradas, modo = 'WALK') {
  const pts = paradas.filter((p) => Number.isFinite(p.lat) && Number.isFinite(p.lng));
  const estimativa = (motivo) => ({
    status: 'UNAVAILABLE', motivo,
    trechos: pts.slice(1).map((p, i) => trechoEstimado(pts[i], p, modo === 'TRANSIT' ? 'TRANSIT' : modo)),
    geometria: null,
    evidencia: { provider: 'estimativa-msf', freshness: 'ESTIMATE', fetchedAt: new Date().toISOString() },
  });
  if (pts.length < 2) return { ...estimativa('menos de duas paradas com coordenada'), trechos: [] };
  if (!PERFIL[modo]) return estimativa('transporte público não coberto pelo roteador aberto — tempo estimado');
  const coords = pts.map((p) => `${p.lng.toFixed(5)},${p.lat.toFixed(5)}`).join(';');
  const chave = `${modo}|${coords}`;
  if (cache.has(chave)) return cache.get(chave);
  await aguardarVez();
  const url = `https://routing.openstreetmap.de/${PERFIL[modo]}/route/v1/driving/${coords}?overview=full&geometries=geojson&steps=false`;
  const r = await chamarProvider(
    { nome: 'fossgis-osrm', estado: 'LIVE_VERIFIED', timeoutMs: 12000, idempotente: true, tentativas: 2, attribution: ATRIBUICAO_ROTAS, sourceUrl: 'https://routing.openstreetmap.de' },
    async (signal) => {
      const res = await fetch(url, { signal });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const d = await res.json();
      if (d.code !== 'Ok' || !d.routes || !d.routes[0]) throw new Error(d.code || 'sem rota');
      return d.routes[0];
    },
  );
  if (r.status === 'UNAVAILABLE' || !r.data) return estimativa('roteador indisponível agora — tempos estimados por distância');
  const rota = r.data;
  const trechos = (rota.legs || []).map((leg, i) => ({
    fromPlaceId: pts[i].id, toPlaceId: pts[i + 1].id, mode: modo,
    distanceMeters: Math.round(leg.distance), durationSeconds: Math.round(leg.duration),
    provider: 'fossgis-osrm', freshness: 'LIVE',
    warnings: modo === 'DRIVE' ? ['Sem trânsito em tempo real.'] : [],
  }));
  const out = { status: 'LIVE', trechos, geometria: rota.geometry && rota.geometry.coordinates, evidencia: r.evidence[0] };
  cache.set(chave, out);
  return out;
}
