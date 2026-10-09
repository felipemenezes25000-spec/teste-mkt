// Índice de mídia dos 205 países (só METADADOS da Wikimedia, nenhum arquivo baixado):
// bandeira oficial, títulos em inglês dos pontos turísticos e vídeos livres por país, com autor e licença.
// Uso: node scripts/midia/indice-midia.mjs <saida.json>   (retoma de onde parou se o arquivo já existir)
import fs from 'node:fs';
const SAIDA = process.argv[2];
const UA = { 'User-Agent': 'MundoSemFimDesign/1.0 (https://mundo-sem-fim-lac.vercel.app; indice de midia)', 'Api-User-Agent': 'MundoSemFimDesign/1.0 (https://mundo-sem-fim-lac.vercel.app)' };
const dorme = (ms) => new Promise((r) => setTimeout(r, ms));
const limpa = (h) => String(h || '').replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
async function api(base, params, tent = 0) {
  const u = base + '?' + new URLSearchParams({ format: 'json', formatversion: '2', ...params });
  const r = await fetch(u, { headers: UA });
  if (r.status === 429 || r.status >= 500) { if (tent > 5) throw new Error('falhou ' + r.status); await dorme(8000 * (tent + 1)); return api(base, params, tent + 1); }
  const j = await r.json(); await dorme(900); return j;
}
const COMMONS = 'https://commons.wikimedia.org/w/api.php', PTWIKI = 'https://pt.wikipedia.org/w/api.php';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
const RAIZ = path.resolve(import.meta.dirname, '../..');
const mod = (r) => import(pathToFileURL(path.join(RAIZ, r)).href);
const d = await mod('app/_engine/data.js');
const a = await mod('app/_engine/atracoes.js');
const nomesEn = new Intl.DisplayNames(['en'], { type: 'region' });
// Nomes de arquivo de bandeira na Commons que fogem do padrão "Flag of <nome em inglês>.svg".
const BANDEIRA_FIXA = { US: 'Flag of the United States.svg', GB: 'Flag of the United Kingdom.svg', NL: 'Flag of the Netherlands.svg', PH: 'Flag of the Philippines.svg', BS: 'Flag of the Bahamas.svg', GM: 'Flag of The Gambia.svg', CZ: 'Flag of the Czech Republic.svg', CD: 'Flag of the Democratic Republic of the Congo.svg', CG: 'Flag of the Republic of the Congo.svg', CF: 'Flag of the Central African Republic.svg', KM: 'Flag of the Comoros.svg', DO: 'Flag of the Dominican Republic.svg', MV: 'Flag of Maldives.svg', MH: 'Flag of the Marshall Islands.svg', SB: 'Flag of the Solomon Islands.svg', AE: 'Flag of the United Arab Emirates.svg', CK: 'Flag of the Cook Islands.svg', VA: 'Flag of the Vatican City.svg', FM: 'Flag of the Federated States of Micronesia.svg', CI: "Flag of Côte d'Ivoire.svg", TR: 'Flag of Turkey.svg', MM: 'Flag of Myanmar.svg', HK: 'Flag of Hong Kong.svg', MO: 'Flag of Macau.svg', MK: 'Flag of North Macedonia.svg', TL: 'Flag of East Timor.svg', SZ: 'Flag of Eswatini.svg', CV: 'Flag of Cape Verde.svg', ST: 'Flag of São Tomé and Príncipe.svg', KN: 'Flag of Saint Kitts and Nevis.svg', LC: 'Flag of Saint Lucia.svg', VC: 'Flag of Saint Vincent and the Grenadines.svg', BA: 'Flag of Bosnia and Herzegovina.svg', AG: 'Flag of Antigua and Barbuda.svg', TT: 'Flag of Trinidad and Tobago.svg', PS: 'Flag of Palestine.svg', KP: 'Flag of North Korea.svg', KR: 'Flag of South Korea.svg', XK: 'Flag of Kosovo.svg', CW: 'Flag of Curaçao.svg', PF: 'Flag of French Polynesia.svg', NC: 'Flags of New Caledonia.svg', TW: 'Flag of the Republic of China.svg', CN: "Flag of the People's Republic of China.svg", RU: 'Flag of Russia.svg', VN: 'Flag of Vietnam.svg', LA: 'Flag of Laos.svg', SY: 'Flag of Syria.svg', IR: 'Flag of Iran.svg', BN: 'Flag of Brunei.svg', MD: 'Flag of Moldova.svg', BO: 'Flag of Bolivia.svg', VE: 'Flag of Venezuela.svg', TZ: 'Flag of Tanzania.svg', PR: 'Flag of Puerto Rico.svg', AW: 'Flag of Aruba.svg', GQ: 'Flag of Equatorial Guinea.svg', GW: 'Flag of Guinea-Bissau.svg' };
const EXCLUI = /protest|manifesta|\bwar\b|guerra|bomb|military|army|soldier|navy|air force|speech|discurso|interview|entrevista|lecture|conference|press|news|election|president|minister|funeral|attack|explos|riot|police|crash|accident|propaganda|rally|parade|weapon|missile|tank|ukrain|refugee|covid|vaccin|surgery|autopsy|anthem|hino|ceremony|trailer|music video|official video|lyric|song|tutorial|unboxing|webinar|podcast|game|gameplay|screen recording|animation|render|3d model|simulation|map|mapa|chart|graph/i;
const PREFERE = /timelapse|time-lapse|time lapse|aerial|drone|panorama|skyline|view|vista|walk|street|beach|temple|templo|old town|harbou?r|waterfall|mountain|lake|river|sunset|sunrise|market|square|bridge|castle|cathedral|mosque|palace|nature|national park|island|bay|canyon|desert|forest|city|cidade|tram|boat/i;
let idx = fs.existsSync(SAIDA) ? JSON.parse(fs.readFileSync(SAIDA, 'utf8')) : { geradoEm: new Date().toISOString(), paises: {} };
const salvar = () => fs.writeFileSync(SAIDA, JSON.stringify(idx, null, 1));
const paises = d.PAISES_REF;
// 1) bandeiras
const faltaBandeira = paises.filter((p) => !(idx.paises[p.code] && idx.paises[p.code].bandeira));
for (let i = 0; i < faltaBandeira.length; i += 45) {
  const lote = faltaBandeira.slice(i, i + 45);
  const titulos = lote.map((p) => 'File:' + (BANDEIRA_FIXA[p.code] || ('Flag of ' + nomesEn.of(p.code) + '.svg')));
  const j = await api(COMMONS, { action: 'query', titles: titulos.join('|'), prop: 'imageinfo', iiprop: 'url|extmetadata', iiurlwidth: '640' });
  const porTitulo = {}; (j.query.pages || []).forEach((pg) => { porTitulo[pg.title.replace(/_/g, ' ')] = pg; });
  const norm = {}; (j.query.normalized || []).forEach((n) => { norm[n.from] = n.to; });
  lote.forEach((p, k) => {
    const t = titulos[k], pg = porTitulo[norm[t] || t] || porTitulo[t];
    const e = (idx.paises[p.code] = idx.paises[p.code] || { code: p.code, nome: p.nome, en: nomesEn.of(p.code) });
    if (pg && !pg.missing && pg.imageinfo) { const ii = pg.imageinfo[0]; e.bandeira = { arquivo: pg.title, svg: ii.url, png640: ii.thumburl, licenca: limpa(ii.extmetadata && ii.extmetadata.LicenseShortName && ii.extmetadata.LicenseShortName.value), pagina: ii.descriptionurl }; }
    else e.bandeira = null;
  });
  salvar(); console.log('bandeiras', Math.min(i + 45, faltaBandeira.length), '/', faltaBandeira.length);
}
console.log('sem bandeira:', paises.filter((p) => !idx.paises[p.code].bandeira).map((p) => p.code + ' (' + nomesEn.of(p.code) + ')').join(', ') || 'nenhum');
// 2) títulos em inglês dos pontos turísticos (pt.wikipedia → en)
const todas = []; paises.forEach((p) => { (a.ATRACOES[p.code] || []).forEach((x) => { if (x.wiki) todas.push([p.code, x]); }); });
if (!idx.enTitulos) idx.enTitulos = {};
const faltaEn = [...new Set(todas.map((t) => t[1].wiki))].filter((w) => !(w in idx.enTitulos));
for (let i = 0; i < faltaEn.length; i += 50) {
  const lote = faltaEn.slice(i, i + 50);
  const j = await api(PTWIKI, { action: 'query', titles: lote.join('|'), prop: 'langlinks', lllang: 'en', redirects: '1', lllimit: '500' });
  const red = {}; [...(j.query.normalized || []), ...(j.query.redirects || [])].forEach((n) => { red[n.from] = n.to; });
  const en = {}; (j.query.pages || []).forEach((pg) => { en[pg.title] = pg.langlinks && pg.langlinks[0] ? pg.langlinks[0].title : null; });
  lote.forEach((w) => { let t = w; for (let k = 0; k < 3 && red[t]; k++) t = red[t]; idx.enTitulos[w] = en[t] || null; });
  salvar(); console.log('títulos en', Math.min(i + 50, faltaEn.length), '/', faltaEn.length);
}
// 3) vídeos livres por país
async function buscaVideos(q) {
  const j = await api(COMMONS, { action: 'query', generator: 'search', gsrnamespace: '6', gsrlimit: '12', gsrsearch: q + ' filemime:video/webm', prop: 'imageinfo', iiprop: 'url|size|extmetadata' });
  return (j.query && j.query.pages ? j.query.pages : []).map((pg) => { const ii = pg.imageinfo && pg.imageinfo[0]; if (!ii) return null; const md = ii.extmetadata || {}; return { arquivo: pg.title, url: ii.url, pagina: ii.descriptionurl, w: ii.width, h: ii.height, dur: Math.round(ii.duration || 0), mb: +(ii.size / 1048576).toFixed(1), autor: limpa(md.Artist && md.Artist.value).slice(0, 120), licenca: limpa(md.LicenseShortName && md.LicenseShortName.value), desc: limpa(md.ImageDescription && md.ImageDescription.value).slice(0, 200) }; }).filter(Boolean);
}
const livre = (l) => /^(CC0|Public domain|PD|CC BY(-SA)? ?[0-9.]*|Attribution|FAL)/i.test(l || '');
for (const p of paises) {
  const e = idx.paises[p.code]; if (e.videos) continue;
  const atr = (a.ATRACOES[p.code] || []).slice(0, 4).map((x) => idx.enTitulos[x.wiki] || x.wiki);
  const consultas = [e.en, ...atr.slice(0, 3)].filter(Boolean);
  const vistos = new Map();
  for (const q of consultas) {
    let L = []; try { L = await buscaVideos('"' + q.replace(/"/g, '') + '"'); } catch (err) { console.log('erro', p.code, q, err.message); }
    L.forEach((v) => { if (!vistos.has(v.arquivo)) vistos.set(v.arquivo, { ...v, consulta: q }); });
  }
  const cand = [...vistos.values()].filter((v) => v.w >= 1280 && v.dur >= 6 && v.dur <= 300 && livre(v.licenca) && !EXCLUI.test(v.arquivo + ' ' + v.desc));
  cand.forEach((v) => { let s = 0; if (PREFERE.test(v.arquivo + ' ' + v.desc)) s += 3; if (v.consulta !== e.en) s += 2; if (v.dur >= 10 && v.dur <= 90) s += 2; if (v.w >= 1920) s += 1; if (v.mb > 200) s -= 2; v.nota = s; });
  cand.sort((x, y) => y.nota - x.nota || x.mb - y.mb);
  e.videos = cand.slice(0, 4); e.videosBrutos = vistos.size;
  salvar(); console.log(p.code.padEnd(3), String(e.videos.length).padStart(1), 'vídeos de', String(vistos.size).padStart(2), 'achados ·', e.videos[0] ? e.videos[0].arquivo.slice(5, 70) : '—');
}
const comVideo = paises.filter((p) => idx.paises[p.code].videos && idx.paises[p.code].videos.length).length;
idx.resumo = { paises: paises.length, comBandeira: paises.filter((p) => idx.paises[p.code].bandeira).length, comVideo, comAtracoes: paises.filter((p) => (a.ATRACOES[p.code] || []).length).length };
salvar(); console.log('FIM', JSON.stringify(idx.resumo));
