// Gera app/_data/midia.js (fotos HD, vídeos curados e créditos) e public/bandeiras/*.png
// a partir de um índice de metadados da Wikimedia Commons (nada é inventado: cada item
// tem arquivo, autor e licença da Commons). Uso:
//   node scripts/midia/gerar-midia.mjs <indice.json> <pasta-bandeiras-png>
// O índice é produzido por scripts/midia/indice-midia.mjs (bandeiras) e indice-midia-2.mjs
// (imagens principais das páginas da Wikipédia + vídeos candidatos). Os vídeos NÃO entram
// automaticamente: só os da lista CURADOS abaixo, conferidos um a um por relevância.
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import crypto from 'node:crypto';
import sharp from 'sharp';

const [ARQ, PASTA_BAND] = process.argv.slice(2);
if (!ARQ || !PASTA_BAND) { console.error('uso: node gerar-midia.mjs <indice.json> <pasta-bandeiras>'); process.exit(1); }
const RAIZ = path.resolve(import.meta.dirname, '../..');
const UA = { 'User-Agent': 'MundoSemFim/1.0 (https://mundo-sem-fim-lac.vercel.app; geracao de midia)' };
const idx = JSON.parse(fs.readFileSync(ARQ, 'utf8'));
const { PAISES_REF } = await import(pathToFileURL(path.join(RAIZ, 'app/_engine/data.js')).href);
const { ATRACOES } = await import(pathToFileURL(path.join(RAIZ, 'app/_engine/atracoes.js')).href);

const nomeArq = (titulo) => titulo.replace(/^File:/, '').replace(/ /g, '_');
const hashDir = (n) => { const h = crypto.createHash('md5').update(n).digest('hex'); return h[0] + '/' + h.slice(0, 2); };
const limpaAutor = (a) => String(a || '').replace(/\s+/g, ' ').replace(/^by\s+/i, '').trim().slice(0, 90) || 'autor na página do arquivo';
const NAO_FOTO = /\.(svg|png|gif|tif|tiff)$|flag|bandeira|coat[_ ]of[_ ]arms|bras[aã]o|emblem|escudo|\bseal\b|\blogo|locator|location|orthographic|\bmapa?\b|_map|map_|mapa_|relief|topographic|satellite|banknote|stamp|coin|selo/i;

// Conferidas no olho e recusadas: mapa, satélite, montagem, gravura antiga, retrato,
// estátua borrada por direito autoral, foto que não mostra o lugar.
const BLOQUEIO = new Set(['Beach_cleaning.jpg', 'Rail_transportation.jpg', 'Bay_of_Kotor_maps.jpg', "L'Isle_de_Gore_Schley_1772.jpg",
  "Diocletian's_Palace_(original_appearance).jpg", 'Barbuda_ISS008-E-7945.jpg', 'Lagoons_and_Reefs_of_New_Caledonia_May_10,_2001.jpg',
  'Kuwaiti_islands.jpg', 'Galapagos_archipelago_250m.jpg', 'Maman_de_Berberati.jpg', 'Tripoli_Montage.jpg', 'Willemstad_Montage.jpg',
  'Petite_sirène_de_Copenhague_(conforme_à_la_loi_danoise).JPG', 'Brésil_vs_Serbie.jpg', 'Falmouth_Cornwall.jpg']);

// ----- fotos -----
function img(arquivo, w, h, autor, licenca, extra = {}) {
  const n = nomeArq(arquivo);
  return { n, p: hashDir(n), w, h, a: limpaAutor(autor), l: licenca || 'licença livre', ...extra };
}
function daPagina(tituloWiki) {
  const im = idx.imagens[tituloWiki];
  if (!im || !im.arquivo) return null;
  const li = idx.licencas[im.arquivo];
  if (!li || NAO_FOTO.test(im.arquivo) || /montage|ISS0\d/i.test(im.arquivo) || BLOQUEIO.has(nomeArq(im.arquivo))) return null;
  return img(im.arquivo, im.w, im.h, li.autor, li.licenca);
}

// Capas escolhidas a dedo (as mesmas dos protótipos aprovados).
const CAPAS = {
  JP: ['File:Mount Fuji from Lake Shoji (15443819010).jpg', 'Monte Fuji'], VN: ['File:Junk Halong Bay Vietnam.jpg', 'Baía de Ha Long'],
  ID: ['File:Tanah-Lot Bali Indonesia Pura-Tanah-Lot-01.jpg', 'Tanah Lot, Bali'], PT: ['File:Lisbon (36831596786) (cropped).jpg', 'Lisboa'],
  PE: ['File:Machu Picchu, Peru (2018).jpg', 'Machu Picchu'], MX: ['File:Chichen Itza-18 (cropped).jpg', 'Chichén Itzá'],
  TR: ['File:Cappadocia Aerial View (6998755984).jpg', 'Capadócia'], AR: ['File:Puerto Madero, Buenos Aires (40689219792) (cropped).jpg', 'Buenos Aires'],
  CL: ['File:Torres del Paine, Laguna Azul 09.jpg', 'Torres del Paine'], ES: ['File:SF maig 2 cropped.jpg', 'Sagrada Família'],
  NO: ['File:Geirangerfjord .jpg', 'Geirangerfjord'], BA: ['File:Mostar Old Town Panorama 2007.jpg', 'Mostar'],
  BO: ['File:Salar Uyuni au01.jpg', 'Salar de Uyuni'], TH: ['File:4Y1A1159 Bangkok (33536795515).jpg', 'Bangkok'],
};

// Vídeos conferidos um a um (país → [trecho do título na Commons, rótulo em pt-BR]).
// Fora daqui: militares, discursos, bichos fora de contexto, satélite, telejornal, eventos.
const CURADOS = {
  JP: [['Shibuya crossing time-lapse 2019-01-05', 'Cruzamento de Shibuya, Tóquio'], ['Fushimi Inari-taisha Senbon torii', 'Fushimi Inari, Quioto'], ['Togetsukyo - kyoto', 'Ponte Togetsukyo, Arashiyama'], ['Video-Diamond-Fuji Mihama-Ohashi-Bridge 2021-02-21 01', 'Monte Fuji ao pôr do sol']],
  TH: [['Bangkok Traffic During Enduring Partners', 'Trânsito de Bangkok']],
  PE: [['Machu-Pichu (video 2011)', 'Machu Picchu'], ['Lake Titicaca time-lapse', 'Lago Titicaca']],
  VN: [['Ha Long Bay, Vietnam - Dec 2024', 'Baía de Ha Long']], KH: [['Angkor Wat.webm', 'Angkor Wat']], ID: [['Borobudur 2019.webm', 'Borobudur']],
  IN: [['Eu.Video-Taj Mahal', 'Taj Mahal, Agra']], NP: [['Kala Patthar', 'Everest visto do Kala Patthar']],
  BO: [['Lake Titicaca time-lapse', 'Lago Titicaca']], AR: [["Devil's Throat from the Argentine viewpoint", 'Garganta do Diabo, Iguaçu']],
  BR: [['Cascadas en Garganta del Diablo', 'Cataratas do Iguaçu']], CL: [['Valparaiso Port Dusk Time Lapse', 'Porto de Valparaíso']],
  MX: [['Atrio sur de la Catedral Metropolitana', 'Catedral Metropolitana, Cidade do México']], PT: [['Porto, with a view on the Dom Luís I Bridge', 'Ponte Dom Luís I, Porto']],
  GE: [['Jvari Monastery at Mtskheta', 'Mosteiro de Jvari, Mtskheta']], TR: [['Aya Sofya, May 2016', 'Santa Sofia, Istambul']],
  MA: [['Djemaa el Fna Marrakech', 'Praça Jemaa el-Fna, Marrakech']], ZA: [['View of Cape Town from Table mountain 01', 'Cidade do Cabo vista da Table Mountain']],
  AL: [['Berat 50', 'Berat']], DE: [['Der Kölner Dom im Zeitraffer', 'Catedral de Colônia']], DZ: [['Sunrise in Tassili', 'Tassili n’Ajjer']],
  AU: [['Sydney Opera House drone', 'Ópera de Sydney']], AT: [['Schönbrunn Palace 173526', 'Palácio de Schönbrunn, Viena']],
  AZ: [['View from Hilton, Baku', 'Baku']], BS: [['Paradise Island Ferry Boat Ride', 'Paradise Island, Nassau']],
  BD: [["View of Cox's Bazar beach, Bangladesh.webm", "Praia de Cox's Bazar"]], BE: [['Grand place, Bruxelles', 'Grand-Place, Bruxelas']],
  BA: [['Stari Most, Mostar 103652', 'Stari Most, Mostar']], BG: [['Plovdiv 04.03.2016', 'Plovdiv']], BT: [['Human traffic light in Thimphu', 'Thimphu']],
  CV: [['Praia cidade velha cabo verde', 'Cidade Velha']], CA: [['Niagara Falls from Journey Behind The Falls', 'Cataratas do Niágara']],
  EC: [['Galapagos sea lions', 'Leões-marinhos em Galápagos']], ES: [['Acueducto de Segovia en 2016', 'Aqueduto de Segóvia']],
  US: [['Grand Canyon Clouds time lapse', 'Grand Canyon']], FI: [["Polar Day's Night-HD", 'Sol da meia-noite']],
  FR: [['La tour Eiffel illuminée', 'Torre Eiffel, Paris']], GA: [['Sunset timelapse on the beach in Libreville', 'Praia de Libreville']],
  GH: [['Drone video shot of Kakum National Park', 'Parque Nacional Kakum']], GR: [['Meteora rock, Thessalia', 'Meteora'], ['Acropolis.webm', 'Acrópole, Atenas']],
  HK: [['Hong Kong Skyline at Night', 'Hong Kong à noite']], IE: [['Interior of the Old Library, Trinity College', 'Old Library, Trinity College']],
  IS: [['Gullfoss waterfall in Iceland', 'Cachoeira Gullfoss']], IL: [['South transept, Church of the Holy Sepulchre, MVI 1124', 'Igreja do Santo Sepulcro, Jerusalém']],
  IT: [['Fontaine de Trevi', 'Fontana di Trevi, Roma']], JO: [['Dead Sea, Israel and Jordan', 'Mar Morto']], LU: [['Luxembourg, circulation tram', 'Luxemburgo']],
  MV: [['Mathiveri Island Apartments', 'Ilha de Mathiveri']], MT: [['Malta - Cominotto + Small Blue Lagoon', 'Lagoa Azul, Comino']],
  MM: [['Sunset seen from Shwesandaw Pagoda', 'Pôr do sol em Bagan']], MC: [['Drone - Casino de Monte-Carlo', 'Cassino de Monte Carlo']],
  MN: [['Mongolia Gobi train', 'Trem no Gobi']], NA: [['Fish River Canyon, Kolmanskop', 'Fish River Canyon e Kolmanskop']],
  NL: [['Amsterdam 2016', 'Amsterdã']], NO: [['LOFOTEN ISLANDS - NORWAY', 'Ilhas Lofoten']], NZ: [['Paparoa Track, New Zealand', 'Paparoa Track']],
  PA: [['Canal de Panama, Panama', 'Canal do Panamá']], PK: [['Hunza Valley - 5th position', 'Vale de Hunza']],
  SG: [['Time-lapse video of the Merlion statue', 'Merlion, Singapura']], SE: [['Stockholms slott fontän 2', 'Palácio Real, Estocolmo']],
  CH: [['Timelapse of the Matterhorn viewed from Zermatt', 'Matterhorn visto de Zermatt']], TW: [['Taipei 101 - 2013 12 9', 'Taipei 101']],
  CZ: [['Prague 2018-04-19', 'Praga']], SK: [['Bratislava 2018-04-15', 'Bratislava']], GB: [['Tower Bridge, London Time Lapse', 'Tower Bridge, Londres']],
  UA: [['Pecherska gora, lavra ta Dnipro', 'Lavra de Pechersk, Kiev']], ZM: [['Victoria Falls 2019 8', 'Cataratas Vitória']],
  ZW: [['Video - Above Victoria Falls', 'Cataratas Vitória vistas do alto']], RW: [['Mountain gorilla (Gorilla beringei beringei) climbing', 'Gorila-das-montanhas']],
  KE: [['Traditional Maasai homestead in Amboseli', 'Aldeia maasai em Amboseli']], PL: [['Wawel Castle dragon', 'Dragão do Wawel, Cracóvia']],
  MK: [['North Macedonian folk dance at an event in Ohrid', 'Dança folclórica em Ohrid']], LK: [['Kandy danses sri lankaises', 'Danças de Kandy']],
  BJ: [['Vaudou à Ouidah-Percussions', 'Percussão vodum em Ouidah']], NG: [['African Drum Festival 2', 'Festival de tambores']],
  TG: [['Kamou, danse traditionelle', 'Dança kamou, Lomé']], IR: [['Tour guide recite Adhan in the Shah mosque', 'Mesquita do Xá, Isfahan']],
  BY: [['Футажи Минска', 'Minsk']], DO: [['Barcelo Bavaro beach', 'Praia de Bávaro, Punta Cana']], AE: [['Dubai Part I - Aug 10, 2012', 'Dubai']],
  LT: [['Off to Lithuania by drone', 'Lituânia vista de drone']], ET: [['ET Afar asv2018-01 Ertale video', 'Vulcão Erta Ale']],
};

async function head(url) {
  for (let t = 0; t < 4; t++) {
    const r = await fetch(url, { method: 'HEAD', headers: UA });
    if (r.status === 429) { await new Promise((ok) => setTimeout(ok, 8000 * (t + 1))); continue; }
    await new Promise((ok) => setTimeout(ok, 250));
    return r.ok ? +(r.headers.get('content-length') || 0) : 0;
  }
  return 0;
}
async function info(titulos) {
  const r = await fetch('https://commons.wikimedia.org/w/api.php?' + new URLSearchParams({ action: 'query', format: 'json', formatversion: '2', titles: titulos.join('|'), prop: 'imageinfo', iiprop: 'size|extmetadata|mediatype' }), { headers: UA });
  const j = await r.json();
  const norm = {}; (j.query.normalized || []).forEach((n) => { norm[n.to] = n.from; });
  const out = {};
  (j.query.pages || []).forEach((p) => {
    const ii = p.imageinfo && p.imageinfo[0]; if (!ii) return;
    const md = ii.extmetadata || {}; const limpa = (h) => String(h || '').replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
    out[norm[p.title] || p.title] = { w: ii.width, h: ii.height, dur: ii.duration, bytes: ii.size, autor: limpa(md.Artist && md.Artist.value), licenca: limpa(md.LicenseShortName && md.LicenseShortName.value) };
  });
  return out;
}

const CAPA_INFO = await info(Object.values(CAPAS).map((c) => c[0]));
const VIDEOS_EXTRA = ['File:Shibuya crossing time-lapse 2019-01-05.webm', 'File:Fushimi Inari-taisha Senbon torii - one section - 2015-12-29.webm', 'File:Togetsukyo - kyoto - March 16 2020.webm', 'File:Bangkok Traffic During Enduring Partners 26 (1009429).webm', 'File:Machu-Pichu (video 2011).webm'];
const EXTRA_INFO = await info(VIDEOS_EXTRA);

const PAISES = {};
const ATR = {};
let nVideos = 0;
for (const p of PAISES_REF) {
  const e = idx.paises[p.code] || {};
  // fotos das atrações (só Commons, só foto de verdade)
  for (const a of ATRACOES[p.code] || []) {
    if (!a.wiki || ATR[a.wiki] !== undefined) continue;
    const f = daPagina(a.wiki);
    if (f && f.w >= 640) ATR[a.wiki] = f;
  }
  // capa: curada → 1ª atração em HD → foto do artigo do país → qualquer atração → cidade
  let capa = null;
  if (CAPAS[p.code]) {
    const [t, lugar] = CAPAS[p.code]; const ci = CAPA_INFO[t];
    if (ci) capa = img(t, ci.w, ci.h, ci.autor, ci.licenca, { lugar });
  }
  const atrs = (ATRACOES[p.code] || []).filter((a) => ATR[a.wiki]);
  if (!capa) { const a = atrs.find((x) => ATR[x.wiki].w >= 1200 && ATR[x.wiki].w >= ATR[x.wiki].h); if (a) capa = { ...ATR[a.wiki], lugar: a.nome }; }
  if (!capa) { const f = daPagina(p.nome); if (f && f.w >= 1000) capa = { ...f, lugar: p.nome }; }
  if (!capa && atrs[0]) capa = { ...ATR[atrs[0].wiki], lugar: atrs[0].nome };
  // sem atração com foto: imagem principal das cidades do país (scripts/midia/indice-cidades.mjs)
  for (const c of capa ? [] : (p.cidades || []).map((x) => x.nome || x)) { const f = daPagina(c); if (f && f.w >= 800) { capa = { ...f, lugar: c }; break; } }
  // vídeos curados
  const videos = [];
  for (const [trecho, rotulo] of CURADOS[p.code] || []) {
    let v = (e.videos2 || []).find((x) => x.arquivo.includes(trecho));
    if (!v) {
      const t = VIDEOS_EXTRA.find((x) => x.includes(trecho)); const xi = t && EXTRA_INFO[t];
      if (xi) v = { arquivo: t, w: xi.w, h: xi.h, dur: Math.round(xi.dur || 0), mb: xi.bytes / 1048576, autor: xi.autor, licenca: xi.licenca };
    }
    if (!v) { console.log('  sem vídeo', p.code, trecho); continue; }
    const n = nomeArq(v.arquivo); const dir = hashDir(n); const enc = encodeURIComponent(n);
    // Sempre a transcodificação da própria Commons (derivado, como as miniaturas): o
    // arquivo ORIGINAL é limitado por taxa para hotlink (429 visto no QA de 2026-10-09).
    let src = null; let tam = v.mb;
    for (const q of ['720p', '480p']) {
      const u = `https://upload.wikimedia.org/wikipedia/commons/transcoded/${dir}/${enc}/${enc}.${q}.vp9.webm`;
      const b = await head(u); if (b) { src = u; tam = b / 1048576; break; }
    }
    if (!src) { console.log('  sem transcodificação', p.code, n); continue; }
    const poster = `https://upload.wikimedia.org/wikipedia/commons/thumb/${dir}/${enc}/1280px--${enc}.jpg`;
    if (!(await head(poster))) { console.log('  sem pôster', p.code, n); continue; }
    videos.push({ n, src, poster, w: v.w, h: v.h, dur: v.dur, mb: +tam.toFixed(1), a: limpaAutor(v.autor), l: v.licenca, lugar: rotulo });
    nVideos++;
  }
  PAISES[p.code] = { capa, videos };
  console.log(p.code.padEnd(3), capa ? 'capa ✓' : 'capa —', videos.length + ' vídeo(s)', atrs.length + ' atrações c/ foto');
}

// bandeiras locais (PNG com paleta, ~320 px)
const destino = path.join(RAIZ, 'public/bandeiras');
fs.mkdirSync(destino, { recursive: true });
let bytes = 0;
for (const p of PAISES_REF) {
  const o = path.join(PASTA_BAND, p.code + '.png');
  if (!fs.existsSync(o)) { console.log('  sem bandeira', p.code); continue; }
  const buf = await sharp(o).resize({ width: 320, withoutEnlargement: true }).png({ palette: true, quality: 92, compressionLevel: 9, effort: 10 }).toBuffer();
  fs.writeFileSync(path.join(destino, p.code + '.png'), buf); bytes += buf.length;
}
const BANDEIRA_CRED = {};
for (const p of PAISES_REF) { const b = (idx.paises[p.code] || {}).bandeira; if (b) BANDEIRA_CRED[p.code] = { pagina: b.pagina, l: b.licenca || 'domínio público' }; }

const cab = `// GERADO por scripts/midia/gerar-midia.mjs a partir de metadados da Wikimedia Commons\n// (${new Date().toISOString().slice(0, 10)}). Não editar à mão: rode o gerador de novo.\n// Cada foto/vídeo guarda arquivo, autor e licença; as URLs são montadas em _lib/midia.js.\n`;
const corpo = `${cab}export const MIDIA_PAISES = ${JSON.stringify(PAISES)};\nexport const MIDIA_ATRACOES = ${JSON.stringify(ATR)};\nexport const BANDEIRAS = ${JSON.stringify(BANDEIRA_CRED)};\n`;
fs.writeFileSync(path.join(RAIZ, 'app/_data/midia.js'), corpo);
const comCapa = Object.values(PAISES).filter((x) => x.capa).length;
const comVideo = Object.values(PAISES).filter((x) => x.videos.length).length;
console.log(`\nFIM: ${PAISES_REF.length} países · ${comCapa} com capa HD · ${comVideo} com vídeo (${nVideos} vídeos) · ${Object.keys(ATR).length} fotos de atrações · bandeiras ${(bytes / 1048576).toFixed(2)} MB · midia.js ${(corpo.length / 1024).toFixed(0)} KB`);
