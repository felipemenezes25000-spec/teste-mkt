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

export async function imagemWiki(query, { revalidate = DIA } = {}) {
  // Tenta pt.wikipedia; se não houver imagem, tenta en.wikipedia (cobertura de
  // imagens muito maior pra atrações menos famosas). Imagem independe do idioma.
  const ptImg = imgDe(await pegarResumo(query, revalidate, 'pt'));
  if (ptImg) return ptImg;
  return imgDe(await pegarResumo(query, revalidate, 'en'));
}

function stripHtml(s) {
  return String(s).replace(/<[^>]*>/g, '').replace(/&[a-z]+;/gi, ' ').replace(/\s+/g, ' ').trim().slice(0, 90);
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
      autor: meta.Artist && meta.Artist.value ? stripHtml(meta.Artist.value) : null,
      licenca: (meta.LicenseShortName && meta.LicenseShortName.value) || null,
      fileUrl: 'https://commons.wikimedia.org/wiki/' + encodeURIComponent('File:' + file),
    };
  } catch {
    return null;
  }
}
