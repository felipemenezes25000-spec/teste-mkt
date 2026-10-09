// Índice de mídia v2 (só metadados, nada baixado): fotos HD dos pontos turísticos e do país (Wikipédia → Commons,
// com autor e licença) e vídeos livres com critério rígido de relevância. Retoma de onde parou.
// Uso: node scripts/midia/indice-midia-2.mjs <midia-paises.json>
import fs from 'node:fs';
const ARQ = process.argv[2];
const UA = { 'User-Agent': 'MundoSemFimDesign/1.0 (https://mundo-sem-fim-lac.vercel.app; indice de midia)', 'Api-User-Agent': 'MundoSemFimDesign/1.0 (https://mundo-sem-fim-lac.vercel.app)' };
const dorme = (ms) => new Promise((r) => setTimeout(r, ms));
const limpa = (h) => String(h || '').replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
async function api(base, params, tent = 0) {
  const r = await fetch(base + '?' + new URLSearchParams({ format: 'json', formatversion: '2', ...params }), { headers: UA });
  if (r.status === 429 || r.status >= 500) { if (tent > 6) throw new Error('falhou ' + r.status); await dorme(10000 * (tent + 1)); return api(base, params, tent + 1); }
  const j = await r.json(); await dorme(800); return j;
}
const COMMONS = 'https://commons.wikimedia.org/w/api.php', PTWIKI = 'https://pt.wikipedia.org/w/api.php';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
const RAIZ = path.resolve(import.meta.dirname, '../..');
const mod = (r) => import(pathToFileURL(path.join(RAIZ, r)).href);
const d = await mod('app/_engine/data.js');
const a = await mod('app/_engine/atracoes.js');
const idx = JSON.parse(fs.readFileSync(ARQ, 'utf8'));
const salvar = () => fs.writeFileSync(ARQ, JSON.stringify(idx, null, 1));
const paises = d.PAISES_REF;
idx.imagens = idx.imagens || {}; // título pt.wiki → { arquivo, w, h }
idx.licencas = idx.licencas || {}; // arquivo Commons → { autor, licenca, url1600, pagina }
// 1) imagem principal de cada artigo (pontos turísticos + o próprio país)
const titulos = new Set();
paises.forEach((p) => { titulos.add(p.nome); (a.ATRACOES[p.code] || []).forEach((x) => x.wiki && titulos.add(x.wiki)); });
const faltam = [...titulos].filter((t) => !(t in idx.imagens));
for (let i = 0; i < faltam.length; i += 50) {
  const lote = faltam.slice(i, i + 50);
  const j = await api(PTWIKI, { action: 'query', titles: lote.join('|'), prop: 'pageimages', piprop: 'original|name', redirects: '1' });
  const red = {}; [...(j.query.normalized || []), ...(j.query.redirects || [])].forEach((n) => { red[n.from] = n.to; });
  const pg = {}; (j.query.pages || []).forEach((p) => { pg[p.title] = p; });
  lote.forEach((t) => { let x = t; for (let k = 0; k < 3 && red[x]; k++) x = red[x]; const p = pg[x]; idx.imagens[t] = p && p.pageimage ? { arquivo: 'File:' + p.pageimage.replace(/_/g, ' '), w: p.original ? p.original.width : 0, h: p.original ? p.original.height : 0 } : null; });
  salvar(); console.log('imagens', Math.min(i + 50, faltam.length), '/', faltam.length);
}
// 2) autor e licença de cada arquivo (a imagem da Wikipédia pt pode ser local; só arquivos da Commons entram)
const arquivos = [...new Set(Object.values(idx.imagens).filter(Boolean).map((x) => x.arquivo))].filter((f) => !(f in idx.licencas));
for (let i = 0; i < arquivos.length; i += 50) {
  const lote = arquivos.slice(i, i + 50);
  const j = await api(COMMONS, { action: 'query', titles: lote.join('|'), prop: 'imageinfo', iiprop: 'url|extmetadata', iiurlwidth: '1600' });
  const norm = {}; (j.query.normalized || []).forEach((n) => { norm[n.to] = n.from; });
  (j.query.pages || []).forEach((p) => { const orig = norm[p.title] || p.title; const ii = p.imageinfo && p.imageinfo[0]; idx.licencas[orig] = ii ? { autor: limpa(ii.extmetadata && ii.extmetadata.Artist && ii.extmetadata.Artist.value).slice(0, 120), licenca: limpa(ii.extmetadata && ii.extmetadata.LicenseShortName && ii.extmetadata.LicenseShortName.value), url1600: ii.thumburl || ii.url, pagina: ii.descriptionurl } : null; });
  lote.forEach((f) => { if (!(f in idx.licencas)) idx.licencas[f] = null; });
  salvar(); console.log('licenças', Math.min(i + 50, arquivos.length), '/', arquivos.length);
}
// 3) vídeos com relevância rígida
const EXCLUI = /protest|manifesta|\bwar\b|guerra|bomb|militar|military|army|soldier|navy|air force|national guard|speech|discurso|interview|entrevista|lecture|conference|press|news|election|president|minister|senator|parliament|congress|court|trial|funeral|attack|explos|riot|police|crash|accident|propaganda|rally|parade|weapon|missile|tank|refugee|covid|vaccin|surgery|anthem|hino|ceremony|award|trailer|music video|official video|lyric|song|concert|performance|choir|sermon|prayer|tutorial|webinar|podcast|gameplay|screen ?recording|animation|render|3d model|simulation|\bmap\b|mapa|chart|graph|wikitongues|speaking|speaks|says|gives|talk\b|pronunciation|author|writer|insect|\bfly\b|flies|\bbee\b|\bant\b|spider|beetle|moth|mosquito|larva|worm|wasp|coenosia|diptera|hymenoptera|lepidoptera|microscop|laborator|experiment|x-ray|ultrasound|patient|hospital/i;
const PREFERE = /timelapse|time-lapse|time lapse|aerial|drone|panorama|skyline|view|vista|walk|street|beach|temple|templo|old town|harbou?r|waterfall|mountain|lake|river|sunset|sunrise|market|square|bridge|castle|cathedral|mosque|palace|national park|island|bay|canyon|desert|forest|city|tram|boat|ferry|train|landscape|scenery|tour/i;
const livre = (l) => /^(CC0|Public domain|PD|CC BY(-SA)? ?[0-9.]*|Attribution|FAL)/i.test(l || '');
const tokens = (s) => String(s || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().split(/[^a-z0-9]+/).filter((t) => t.length >= 4 && !/^(the|and|of|national|park|temple|church|palace|museum|city|island|lake|mount|saint|santo|santa|old|town|great|grand)$/.test(t));
async function busca(q) {
  const j = await api(COMMONS, { action: 'query', generator: 'search', gsrnamespace: '6', gsrlimit: '15', gsrsearch: q + ' filemime:video/webm', prop: 'imageinfo', iiprop: 'url|size|extmetadata' });
  return (j.query && j.query.pages ? j.query.pages : []).map((pg) => { const ii = pg.imageinfo && pg.imageinfo[0]; if (!ii) return null; const md = ii.extmetadata || {}; return { arquivo: pg.title, url: ii.url, pagina: ii.descriptionurl, w: ii.width, h: ii.height, dur: Math.round(ii.duration || 0), mb: +(ii.size / 1048576).toFixed(1), autor: limpa(md.Artist && md.Artist.value).slice(0, 120), licenca: limpa(md.LicenseShortName && md.LicenseShortName.value), desc: limpa(md.ImageDescription && md.ImageDescription.value).slice(0, 240) }; }).filter(Boolean);
}
for (const p of paises) {
  const e = idx.paises[p.code]; if (e.videos2) continue;
  const atr = (a.ATRACOES[p.code] || []).slice(0, 5).map((x) => ({ q: idx.enTitulos[x.wiki] || x.wiki, nome: x.nome }));
  const consultas = atr.map((x) => ({ q: '"' + x.q.replace(/"/g, '') + '"', alvo: tokens(x.q + ' ' + x.nome) }));
  consultas.push({ q: '"' + e.en + '" (timelapse OR aerial OR drone OR panorama OR skyline OR landscape)', alvo: null });
  const vistos = new Map();
  for (const c of consultas) {
    let L = []; try { L = await busca(c.q); } catch (err) { console.log('erro', p.code, err.message); }
    L.forEach((v) => {
      const texto = (v.arquivo + ' ' + v.desc).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
      const casa = c.alvo ? c.alvo.some((t) => texto.includes(t)) : PREFERE.test(texto);
      if (!casa) return;
      if (!vistos.has(v.arquivo)) vistos.set(v.arquivo, { ...v, consulta: c.q, deAtracao: !!c.alvo });
    });
  }
  const cand = [...vistos.values()].filter((v) => v.w >= 1280 && v.dur >= 6 && v.dur <= 300 && livre(v.licenca) && !EXCLUI.test(v.arquivo + ' ' + v.desc));
  cand.forEach((v) => { let s = 0; if (v.deAtracao) s += 4; if (PREFERE.test(v.arquivo + ' ' + v.desc)) s += 3; if (v.dur >= 10 && v.dur <= 90) s += 2; if (v.w >= 1920) s += 1; if (v.mb > 200) s -= 2; v.nota = s; });
  cand.sort((x, y) => y.nota - x.nota || x.mb - y.mb);
  e.videos2 = cand.slice(0, 3);
  salvar(); console.log(p.code.padEnd(3), e.videos2.length, 'vídeos ·', e.videos2[0] ? e.videos2[0].arquivo.slice(5, 72) : '—');
}
const fotosPais = (p) => (a.ATRACOES[p.code] || []).filter((x) => { const im = idx.imagens[x.wiki]; return im && idx.licencas[im.arquivo]; }).length;
idx.resumo2 = { paises: paises.length, comBandeira: paises.filter((p) => idx.paises[p.code].bandeira).length, comVideo: paises.filter((p) => (idx.paises[p.code].videos2 || []).length).length, comFotoDoPais: paises.filter((p) => { const im = idx.imagens[p.nome]; return im && idx.licencas[im.arquivo]; }).length, fotosDeAtracoes: paises.reduce((s, p) => s + fotosPais(p), 0), paisesComFotoDeAtracao: paises.filter((p) => fotosPais(p) > 0).length };
salvar(); console.log('FIM', JSON.stringify(idx.resumo2));
