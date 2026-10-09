#!/usr/bin/env node
// Geocodificação com PROVENIÊNCIA (OMEGA V4 §16-17): coordenadas de atrações e
// cidades a partir da Wikipédia (prop=coordinates, pt → en) + QID do Wikidata.
// Valida plausibilidade (distância ao centróide do país) e descarta o que cai
// longe demais — melhor sem coordenada do que pino no lugar errado.
//
// Uso: node scripts/geo/geocodificar.mjs   (gera app/_data/geo/lugares.json)
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const RAIZ = path.resolve('.');
const imp = (f) => import(pathToFileURL(path.join(RAIZ, f)).href);
const { PAISES_REF } = await imp('app/_engine/data.js');
const { atracoesDoPais } = await imp('app/_engine/atracoes.js');
const { cidadeWiki } = await imp('app/_lib/cidadeWiki.js');
const { slugify } = await imp('app/_lib/slug.js');

const UA = 'MundoSemFim/0.2 (geocodificação de catálogo; https://github.com/felipemenezes25000-spec/teste-mkt)';
const HOJE = new Date().toISOString().slice(0, 10);
const GRANDES = new Set(['RU', 'US', 'CA', 'BR', 'AU', 'CN', 'CL', 'AR', 'IN', 'ID', 'FR', 'NO', 'DK', 'GB', 'NZ', 'MX', 'KZ', 'EC', 'ES', 'PT', 'NL', 'JP', 'PH', 'PG', 'ZA', 'CD', 'DZ', 'SA', 'IR', 'MN', 'PE', 'CO', 'VE', 'BO', 'KI', 'FM', 'FJ', 'SB', 'VU', 'MH', 'PF', 'CK', 'TV', 'TO', 'WS']);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function distKm(a, b) {
  const R = 6371, rad = (x) => (x * Math.PI) / 180;
  const dLat = rad(b[1] - a[1]), dLng = rad(b[0] - a[0]);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(rad(a[1])) * Math.cos(rad(b[1])) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

async function lote(lang, titulos) {
  const params = new URLSearchParams({
    action: 'query', format: 'json', formatversion: '2', prop: 'coordinates|pageprops',
    ppprop: 'wikibase_item', redirects: '1', titles: titulos.join('|'), colimit: 'max',
  });
  for (let t = 0; t < 4; t++) {
    try {
      const r = await fetch(`https://${lang}.wikipedia.org/w/api.php?${params}`, { headers: { 'user-agent': UA }, signal: AbortSignal.timeout(20000) });
      if (r.status === 429) { await sleep(3000 * (t + 1)); continue; }
      const d = await r.json();
      const mapa = new Map();
      const alias = new Map();
      for (const n of d.query?.normalized || []) alias.set(n.to, n.from);
      for (const n of d.query?.redirects || []) alias.set(n.to, alias.get(n.from) || n.from);
      for (const p of d.query?.pages || []) {
        if (p.missing) continue;
        const c = p.coordinates && p.coordinates[0];
        const info = { titulo: p.title, qid: p.pageprops?.wikibase_item || null, coords: c ? [c.lon, c.lat] : null };
        mapa.set(p.title, info);
        let orig = alias.get(p.title);
        while (orig) { mapa.set(orig, info); orig = alias.get(orig) !== orig ? alias.get(orig) : null; }
      }
      return mapa;
    } catch { await sleep(1500); }
  }
  return new Map();
}

async function resolver(itens, rotulo) {
  // itens: [{ chave, titulos:[…], pais:[lng,lat], code }]
  const out = {};
  let ok = 0, longe = 0, sem = 0;
  const pend = [...itens];
  for (const lang of ['pt', 'en']) {
    const restantes = pend.filter((i) => !out[i.chave]);
    const titulos = [...new Set(restantes.flatMap((i) => i.titulos))];
    const achados = new Map();
    for (let i = 0; i < titulos.length; i += 50) {
      const m = await lote(lang, titulos.slice(i, i + 50));
      for (const [k, v] of m) achados.set(k, v);
      await sleep(250);
      process.stdout.write(`\r${rotulo} ${lang}: ${Math.min(i + 50, titulos.length)}/${titulos.length}   `);
    }
    for (const it of restantes) {
      for (const t of it.titulos) {
        const a = achados.get(t);
        if (a && !a.coords && a.qid && lang === 'pt' && !it.qid) it.qid = a.qid; // página pt existe, sem coordenada
        if (!a || !a.coords) continue;
        const d = distKm(it.pais, a.coords);
        const limite = GRANDES.has(it.code) ? 9000 : 2500;
        if (d > limite) { it.longe = { titulo: a.titulo, km: Math.round(d) }; continue; }
        out[it.chave] = {
          lat: +a.coords[1].toFixed(5), lng: +a.coords[0].toFixed(5), qid: a.qid,
          precisao: 'WIKIPEDIA_COORD', fonte: `wikipedia-${lang}`, titulo: a.titulo, obtidoEm: HOJE,
        };
        break;
      }
    }
  }
  // 3ª passada: Wikidata P625 pelo QID da página pt (identidade canônica, evita homônimos)
  const porQid = itens.filter((i) => !out[i.chave] && i.qid);
  for (let i = 0; i < porQid.length; i += 50) {
    const ids = porQid.slice(i, i + 50).map((x) => x.qid);
    try {
      const r = await fetch(`https://www.wikidata.org/w/api.php?action=wbgetentities&format=json&props=claims&ids=${ids.join('|')}`, { headers: { 'user-agent': UA }, signal: AbortSignal.timeout(20000) });
      const d = await r.json();
      for (const it of porQid.slice(i, i + 50)) {
        const v = d.entities?.[it.qid]?.claims?.P625?.[0]?.mainsnak?.datavalue?.value;
        if (!v) continue;
        const c = [v.longitude, v.latitude];
        const km = distKm(it.pais, c);
        if (km > (GRANDES.has(it.code) ? 9000 : 2500)) { it.longe = { titulo: it.qid, km: Math.round(km) }; continue; }
        out[it.chave] = { lat: +v.latitude.toFixed(5), lng: +v.longitude.toFixed(5), qid: it.qid, precisao: 'WIKIDATA_P625', fonte: 'wikidata', titulo: it.qid, obtidoEm: HOJE };
        delete it.longe;
      }
    } catch { /* segue */ }
    await sleep(300);
  }
  for (const it of itens) { if (out[it.chave]) ok++; else if (it.longe) longe++; else sem++; }
  process.stdout.write('\n');
  return { out, ok, longe, sem, descartados: itens.filter((i) => !out[i.chave] && i.longe).map((i) => `${i.chave} → ${i.longe.titulo} (${i.longe.km} km)`) };
}

const atr = [];
const cid = [];
for (const p of PAISES_REF) {
  if (!Array.isArray(p.coords)) continue;
  for (const a of atracoesDoPais(p.code) || []) {
    const ts = [a.wiki, a.nome].filter(Boolean);
    atr.push({ chave: `atr:${p.code}:${slugify(a.nome)}`, titulos: [...new Set(ts)], pais: p.coords, code: p.code });
  }
  for (const c of p.cidades || []) {
    const base = cidadeWiki(p.code, c);
    const limpo = base.replace(/\s*\(.*?\)\s*/g, '').trim();
    cid.push({ chave: `cid:${p.code}:${slugify(c)}`, titulos: [...new Set([base, limpo, `${limpo} (${p.nome})`])], pais: p.coords, code: p.code });
  }
}

const rA = await resolver(atr, 'atrações');
const rC = await resolver(cid, 'cidades');
const saida = {
  _meta: {
    geradoEm: HOJE, fonte: 'Wikipedia (prop=coordinates) + Wikidata QID', licenca: 'Coordenadas: dados factuais; Wikipedia CC BY-SA',
    validacao: 'distância ao centróide do país ≤ 2.500 km (≤ 9.000 km em países extensos/territórios dispersos)',
    precisao: 'WIKIPEDIA_COORD = coordenada do artigo (ponto representativo), NÃO a entrada praticável',
    totais: { atracoes: atr.length, atracoesComCoord: rA.ok, atracoesDescartadas: rA.longe, cidades: cid.length, cidadesComCoord: rC.ok, cidadesDescartadas: rC.longe },
  },
  lugares: { ...rA.out, ...rC.out },
};
fs.mkdirSync('app/_data/geo', { recursive: true });
fs.writeFileSync('app/_data/geo/lugares.json', JSON.stringify(saida));
fs.writeFileSync('docs/plataforma/_dados/geo-descartados.txt', [...rA.descartados, ...rC.descartados].join('\n'));
console.log(JSON.stringify(saida._meta.totais, null, 1));
