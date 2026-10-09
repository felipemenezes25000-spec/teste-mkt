// Mídia CALÇADÃO: capa HD, vídeos curados e bandeira de cada país, e foto HD de cada
// atração — tudo da Wikimedia Commons com autor e licença (dados em _data/midia.js,
// gerados por scripts/midia/gerar-midia.mjs). Pura (server + client).
//
// Regra do CDN do Wikimedia (ver _lib/wikiThumb.js): só miniaturas em LARGURAS PADRÃO
// e sempre menores que o original — o original "unscaled" é limitado por taxa (429).
import { MIDIA_PAISES, MIDIA_ATRACOES, BANDEIRAS } from '../_data/midia.js';

const BASE = 'https://upload.wikimedia.org/wikipedia/commons';
const LARGURAS = [250, 330, 500, 960, 1280, 1920];

const pagina = (n) => `https://commons.wikimedia.org/wiki/File:${encodeURIComponent(n)}`;
const miniatura = (f, w) => { const e = encodeURIComponent(f.n); return `${BASE}/thumb/${f.p}/${e}/${w}px-${e}`; };

/** Foto da Commons → { src, srcSet, w, h, credito, lugar } em larguras padrão (≤ alvo quando possível). */
export function fotoCommons(f, largura = 960) {
  if (!f || !f.n) return null;
  const ws = LARGURAS.filter((w) => w < f.w);
  const usar = ws.length ? ws : [LARGURAS[0]];
  const src = miniatura(f, usar.find((w) => w >= largura) || usar[usar.length - 1]);
  return {
    src,
    srcSet: usar.map((w) => `${miniatura(f, w)} ${w}w`).join(', '),
    w: f.w, h: f.h, lugar: f.lugar || null,
    credito: { fonte: 'Wikimedia Commons', autor: f.a, licenca: f.l, link: pagina(f.n) },
  };
}

/** Capa HD do país (foto de um lugar real do país) ou null (aí a arte é a bandeira). */
export function capaPais(code, largura = 960) {
  const m = MIDIA_PAISES[code];
  return m && m.capa ? fotoCommons(m.capa, largura) : null;
}

/** Vídeos curados do país: [{ src, poster, lugar, dur, credito }]. */
export function videosPais(code) {
  const m = MIDIA_PAISES[code];
  return (m && m.videos ? m.videos : []).map((v) => ({
    src: v.src, poster: v.poster, lugar: v.lugar, dur: v.dur, w: v.w, h: v.h,
    credito: { fonte: 'Wikimedia Commons', autor: v.a, licenca: v.l, link: pagina(v.n) },
  }));
}

/** Foto HD de uma atração pelo título da Wikipédia (campo `wiki` de _engine/atracoes.js). */
export function fotoAtracao(tituloWiki, largura = 960) {
  return tituloWiki && MIDIA_ATRACOES[tituloWiki] ? fotoCommons(MIDIA_ATRACOES[tituloWiki], largura) : null;
}

/** Bandeira oficial servida pelo próprio site (PNG ~320 px) + crédito da Commons. */
export function bandeira(code) {
  const b = BANDEIRAS[code];
  return { src: `/bandeiras/${code}.png`, credito: { fonte: 'Wikimedia Commons', autor: 'bandeira oficial', licenca: b ? b.l : 'domínio público', link: b ? b.pagina : null } };
}

/** Resumo leve para listas no cliente (álbum): { code: { capa, video? } } sem as atrações. */
export function midiaResumo(codes, largura = 500) {
  const out = {};
  for (const c of codes) {
    const capa = capaPais(c, largura);
    const v = videosPais(c)[0];
    out[c] = { capa, video: v ? { src: v.src, poster: v.poster, lugar: v.lugar, credito: v.credito } : null };
  }
  return out;
}

export function temVideo(code) { return !!(MIDIA_PAISES[code] && MIDIA_PAISES[code].videos.length); }
