// Coordenadas canônicas com proveniência (gerado por scripts/geo/geocodificar.mjs).
// Uso no SERVIDOR (o JSON tem ~550 KB; páginas recebem só o recorte do país).
import GEO from '../_data/geo/lugares.json';
import { slugify } from './slug.js';
import { atracoesDoPais } from '../_engine/atracoes.js';

export const GEO_META = GEO._meta;

/** Coordenada de uma atração/cidade do catálogo (ou null). */
export function coordDe(tipo, code, nome) {
  const r = GEO.lugares[`${tipo}:${code}:${slugify(nome)}`];
  return r ? { lat: r.lat, lng: r.lng, qid: r.qid, fonte: r.fonte, precisao: r.precisao, obtidoEm: r.obtidoEm } : null;
}

/** Pontos do país para o mapa: atrações e cidades com coordenada verificada. */
export function pontosDoPais(d) {
  const atr = (atracoesDoPais(d.code) || []).map((a) => {
    const c = coordDe('atr', d.code, a.nome);
    return c ? { id: `atr:${slugify(a.nome)}`, nome: a.nome, lng: c.lng, lat: c.lat, tipo: 'atracao', sub: a.cidade || '', qid: c.qid } : null;
  }).filter((p, i, arr) => p && arr.findIndex((q) => q && q.id === p.id) === i); // catálogo pode repetir a atração
  const cid = (d.cidades || []).map((nome) => {
    const c = coordDe('cid', d.code, nome);
    return c ? { id: `cid:${slugify(nome)}`, nome, lng: c.lng, lat: c.lat, tipo: 'cidade', sub: d.nome, qid: c.qid } : null;
  }).filter(Boolean);
  const total = (atracoesDoPais(d.code) || []).length + (d.cidades || []).length;
  return { atracoes: atr, cidades: cid, cobertura: total ? Math.round(((atr.length + cid.length) / total) * 100) : 0 };
}
