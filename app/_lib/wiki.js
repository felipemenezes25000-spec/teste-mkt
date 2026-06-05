// Wikipedia REST (pt) + crédito de imagem (Wikimedia Commons) no SERVIDOR —
// cacheado pelo fetch do Next (revalidate). Degrada com segurança (retorna null)
// pra nunca quebrar o build/render quando a rede falha.
const DIA = 86400;
const UA = 'MundoSemFim/1.0 (planejador de viagem; +https://mundo-sem-fim.vercel.app)';

async function pegarResumo(query, revalidate, lang = 'pt') {
  if (!query) return null;
  try {
    const url = `https://${lang}.wikipedia.org/api/rest_v1/page/summary/` + encodeURIComponent(String(query).replace(/ /g, '_'));
    const res = await fetch(url, {
      headers: { accept: 'application/json', 'user-agent': UA },
      next: { revalidate },
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

export async function resumoWiki(query, { revalidate = DIA } = {}) {
  const d = await pegarResumo(query, revalidate);
  if (!d || d.type === 'disambiguation') return null;
  return {
    titulo: d.title || String(query),
    extrato: d.extract || '',
    img: (d.originalimage && d.originalimage.source) || (d.thumbnail && d.thumbnail.source) || null,
    thumb: (d.thumbnail && d.thumbnail.source) || null,
    url: (d.content_urls && d.content_urls.desktop && d.content_urls.desktop.page) || null,
    fonte: 'Wikipédia',
  };
}

const imgDe = (d) => (d && d.type !== 'disambiguation' ? ((d.originalimage && d.originalimage.source) || (d.thumbnail && d.thumbnail.source) || null) : null);

// Lixo comum na media-list (bandeiras, ícones, mapas, brasões, áudio, svg).
const RUIM = /\.svg|\.ogg|\.pdf|flag|logo|icon|coat[_ ]of[_ ]arms|locator|_map|map_|wiki(media|pedia)-logo/i;

async function pegarMediaList(query, revalidate, lang) {
  if (!query) return null;
  try {
    const url = `https://${lang}.wikipedia.org/api/rest_v1/page/media-list/` + encodeURIComponent(String(query).replace(/ /g, '_'));
    const res = await fetch(url, { headers: { accept: 'application/json', 'user-agent': UA }, next: { revalidate }, signal: AbortSignal.timeout(8000) });
    if (!res.ok) return null;
    return await res.json();
  } catch { return null; }
}

// Várias imagens "do local": junta as fotos do ARTIGO (media-list pt+en),
// filtrando bandeiras/ícones/mapas. É o banco de fotos por atração/destino.
export async function imagensDe(query, { n = 4, revalidate = DIA } = {}) {
  const urls = [];
  for (const lang of ['pt', 'en']) {
    const d = await pegarMediaList(query, revalidate, lang);
    for (const it of (d && d.items) || []) {
      if (it.type !== 'image') continue;
      const src = it.srcset && it.srcset[0] && it.srcset[0].src;
      if (!src || RUIM.test(src)) continue;
      const full = src.startsWith('//') ? 'https:' + src : src;
      if (!urls.includes(full)) urls.push(full);
      if (urls.length >= n) return urls;
    }
    if (urls.length >= n) break;
  }
  return urls;
}

export async function imagemWiki(query, { revalidate = DIA } = {}) {
  // 1) thumbnail do resumo (pt→en). 2) fallback: 1ª foto da media-list do artigo
  // (pt→en) — enche muito mais e elimina os placeholders.
  const ptImg = imgDe(await pegarResumo(query, revalidate, 'pt'));
  if (ptImg) return ptImg;
  const enImg = imgDe(await pegarResumo(query, revalidate, 'en'));
  if (enImg) return enImg;
  const ml = await imagensDe(query, { n: 1, revalidate });
  return ml[0] || null;
}

// Busca no Openverse (Creative Commons oficial) — agrega Flickr-CC, Wikimedia, museus
// etc. Filtra p/ licenças de USO COMERCIAL + modificável (seguro p/ produto pago). Sem
// chave de API. Devolve a 1ª foto boa COM crédito pronto (autor/licença/link da origem)
// pra exibir atribuição. Degrada com segurança (null). Amplia muito a cobertura real.
export async function imagemOpenverse(query, { revalidate = DIA } = {}) {
  if (!query) return null;
  try {
    const url = 'https://api.openverse.org/v1/images/?page_size=4&mature=false&license_type=commercial,modification&q=' + encodeURIComponent(query);
    const res = await fetch(url, { headers: { accept: 'application/json', 'user-agent': UA }, next: { revalidate }, signal: AbortSignal.timeout(8000) });
    if (!res.ok) return null;
    const d = await res.json();
    for (const r of (d && d.results) || []) {
      const src = r.url;
      if (!src || RUIM.test(src) || RUIM.test(r.title || '')) continue;
      if (!/\.(jpe?g|png)(\?|$)/i.test(src) && !/staticflickr|upload\.wikimedia/.test(src)) continue;
      return {
        url: src,
        autor: autorLimpo(r.creator) || null,
        licenca: r.license ? `CC ${String(r.license).toUpperCase().replace(/-/g, '-')}${r.license_version ? ' ' + r.license_version : ''}` : null,
        link: r.foreign_landing_url || src,
        fonte: r.source || 'Openverse',
      };
    }
    return null;
  } catch {
    return null;
  }
}

// Busca DIRETA no Wikimedia Commons (namespace File:) — cobre lugares que não têm
// artigo na Wikipédia (a maioria tem foto no Commons mesmo assim). Usado como
// fallback pra GARANTIR foto em todo card. Filtra lixo (bandeira/ícone/mapa/svg) e
// só aceita .jpg/.png. Degrada com segurança (null).
export async function imagemCommons(query, { revalidate = DIA } = {}) {
  if (!query) return null;
  try {
    const url = 'https://commons.wikimedia.org/w/api.php?action=query&format=json&prop=imageinfo&iiprop=url&iiurlwidth=640&generator=search&gsrnamespace=6&gsrlimit=12&gsrsearch=' + encodeURIComponent(query);
    const res = await fetch(url, { headers: { accept: 'application/json', 'user-agent': UA }, next: { revalidate }, signal: AbortSignal.timeout(8000) });
    if (!res.ok) return null;
    const d = await res.json();
    const pages = Object.values((d && d.query && d.query.pages) || {}).sort((a, b) => (a.index || 0) - (b.index || 0));
    for (const p of pages) {
      const ii = p.imageinfo && p.imageinfo[0];
      if (!ii || !ii.url || RUIM.test(ii.url) || RUIM.test(p.title || '')) continue;
      if (!/\.(jpe?g|png)$/i.test(ii.url)) continue; // só fotos
      return ii.url;
    }
    return null;
  } catch {
    return null;
  }
}

function stripHtml(s) {
  return String(s).replace(/<[^>]*>/g, '').replace(/&[a-z]+;/gi, ' ').replace(/\s+/g, ' ').trim().slice(0, 90);
}

// Filtra autores-lixo/placeholder do Commons (ex.: "hoge asdf", "test", "unknown").
// Num produto cuja proposta é confiança/neutralidade, um crédito-lixo é veneno.
function autorLimpo(valor) {
  if (!valor) return null;
  const t = stripHtml(valor);
  if (!t || t.length < 2) return null;
  if (/\b(hoge|fuga|piyo|asdf|qwer|zxcv|test|teste|lorem|ipsum|example|unknown|desconhecido|n\/?a|none|null)\b/i.test(t)) return null;
  if (!/[a-zA-ZÀ-ÿ]{2,}/.test(t)) return null; // precisa ter letras de verdade
  return t;
}

// Nome do arquivo no Commons a partir da URL da imagem (lida com thumbs).
function fileDeUrl(u) {
  try {
    const path = new URL(u).pathname;
    const parts = path.split('/');
    if (path.includes('/thumb/')) return decodeURIComponent(parts[parts.length - 2]);
    return decodeURIComponent(parts[parts.length - 1]);
  } catch {
    return null;
  }
}

// Crédito (autor + licença + link da origem) de uma imagem do Wikimedia Commons.
// Atende a exigência de fonte/autoria/licença. Best-effort: null se não der.
export async function creditoImagem(imgUrl, { revalidate = DIA } = {}) {
  if (!imgUrl || !/upload\.wikimedia\.org\/wikipedia\/commons\//.test(imgUrl)) return null;
  const file = fileDeUrl(imgUrl);
  if (!file) return null;
  try {
    const api =
      'https://commons.wikimedia.org/w/api.php?action=query&format=json&prop=imageinfo&iiprop=extmetadata&titles=' +
      encodeURIComponent('File:' + file);
    const res = await fetch(api, {
      headers: { accept: 'application/json', 'user-agent': UA },
      next: { revalidate },
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) return null;
    const d = await res.json();
    const pages = (d && d.query && d.query.pages) || {};
    const page = Object.values(pages)[0];
    const meta = (page && page.imageinfo && page.imageinfo[0] && page.imageinfo[0].extmetadata) || {};
    return {
      autor: autorLimpo(meta.Artist && meta.Artist.value),
      licenca: (meta.LicenseShortName && meta.LicenseShortName.value) || null,
      fileUrl: 'https://commons.wikimedia.org/wiki/' + encodeURIComponent('File:' + file),
    };
  } catch {
    return null;
  }
}
