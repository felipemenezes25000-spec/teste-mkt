// Completa o índice de mídia com a imagem principal (Wikipédia pt → Commons, com autor e
// licença) das cidades de cada país. Serve de capa para países sem foto de atração.
// Uso: node scripts/midia/indice-cidades.mjs <indice.json>
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
const ARQ = process.argv[2];
const UA = { 'User-Agent': 'MundoSemFim/1.0 (https://mundo-sem-fim-lac.vercel.app; indice de midia)', 'Api-User-Agent': 'MundoSemFim/1.0 (https://mundo-sem-fim-lac.vercel.app)' };
const dorme = (ms) => new Promise((r) => setTimeout(r, ms));
const limpa = (h) => String(h || '').replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
async function api(base, params, tent = 0) {
  const r = await fetch(base + '?' + new URLSearchParams({ format: 'json', formatversion: '2', ...params }), { headers: UA });
  if (r.status === 429 || r.status >= 500) { if (tent > 6) throw new Error('falhou ' + r.status); await dorme(10000 * (tent + 1)); return api(base, params, tent + 1); }
  const j = await r.json(); await dorme(800); return j;
}
const RAIZ = path.resolve(import.meta.dirname, '../..');
const { PAISES_REF } = await import(pathToFileURL(path.join(RAIZ, 'app/_engine/data.js')).href);
const idx = JSON.parse(fs.readFileSync(ARQ, 'utf8'));
const titulos = [...new Set(PAISES_REF.flatMap((p) => (p.cidades || []).map((c) => c.nome || c)).filter(Boolean))].filter((t) => !(t in idx.imagens));
for (let i = 0; i < titulos.length; i += 50) {
  const lote = titulos.slice(i, i + 50);
  const j = await api('https://pt.wikipedia.org/w/api.php', { action: 'query', titles: lote.join('|'), prop: 'pageimages', piprop: 'original|name', redirects: '1' });
  const red = {}; [...(j.query.normalized || []), ...(j.query.redirects || [])].forEach((n) => { red[n.from] = n.to; });
  const pg = {}; (j.query.pages || []).forEach((p) => { pg[p.title] = p; });
  lote.forEach((t) => { let x = t; for (let k = 0; k < 3 && red[x]; k++) x = red[x]; const p = pg[x]; idx.imagens[t] = p && p.pageimage ? { arquivo: 'File:' + p.pageimage.replace(/_/g, ' '), w: p.original ? p.original.width : 0, h: p.original ? p.original.height : 0 } : null; });
  console.log('cidades', Math.min(i + 50, titulos.length), '/', titulos.length);
}
const arquivos = [...new Set(Object.values(idx.imagens).filter(Boolean).map((x) => x.arquivo))].filter((f) => !(f in idx.licencas));
for (let i = 0; i < arquivos.length; i += 50) {
  const lote = arquivos.slice(i, i + 50);
  const j = await api('https://commons.wikimedia.org/w/api.php', { action: 'query', titles: lote.join('|'), prop: 'imageinfo', iiprop: 'url|extmetadata', iiurlwidth: '1600' });
  const norm = {}; (j.query.normalized || []).forEach((n) => { norm[n.to] = n.from; });
  (j.query.pages || []).forEach((p) => { const orig = norm[p.title] || p.title; const ii = p.imageinfo && p.imageinfo[0]; idx.licencas[orig] = ii ? { autor: limpa(ii.extmetadata && ii.extmetadata.Artist && ii.extmetadata.Artist.value).slice(0, 120), licenca: limpa(ii.extmetadata && ii.extmetadata.LicenseShortName && ii.extmetadata.LicenseShortName.value), url1600: ii.thumburl || ii.url, pagina: ii.descriptionurl } : null; });
  lote.forEach((f) => { if (!(f in idx.licencas)) idx.licencas[f] = null; });
  console.log('licenças', Math.min(i + 50, arquivos.length), '/', arquivos.length);
}
fs.writeFileSync(ARQ, JSON.stringify(idx, null, 1));
console.log('FIM');
