// Wikipedia REST (pt) no SERVIDOR — cacheado pelo fetch do Next (revalidate).
// Degrada com segurança (retorna null) pra nunca quebrar o build/render quando
// a rede falha (ex.: build offline). A página linkada é a fonte/atribuição.
const DIA = 86400;

async function pegarResumo(query, revalidate) {
  if (!query) return null;
  try {
    const url = 'https://pt.wikipedia.org/api/rest_v1/page/summary/' + encodeURIComponent(String(query).replace(/ /g, '_'));
    const res = await fetch(url, {
      headers: { accept: 'application/json' },
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

export async function imagemWiki(query, opts) {
  const r = await resumoWiki(query, opts);
  return r ? r.img || r.thumb : null;
}
