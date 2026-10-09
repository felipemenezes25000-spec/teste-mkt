// Miniaturas do Wikimedia em LARGURAS PADRÃO. Desde 2025-2026 o Wikimedia só serve
// thumbnails nas larguras listadas em https://w.wiki/GHai; outras larguras dão 400 e
// o arquivo original "unscaled" é limitado por taxa (429) para hotlink — era a causa
// das fotos quebradas no QA do Lote 0. Aqui toda largura pedida é ENCAIXADA na
// largura padrão mais próxima (teto 1280 no cliente). O lado servidor resolve a
// largura exata pelo tamanho real do original em _lib/media.js. Pura (server+client).

export const LARGURAS_PADRAO = [120, 250, 330, 500, 960, 1280, 1920];

/** Largura padrão mais próxima (em escala log), limitada a `teto`. */
export function larguraPadrao(w, teto = 1280) {
  const alvo = Math.max(1, Math.min(Number(w) || 500, teto));
  let melhor = LARGURAS_PADRAO[0];
  for (const l of LARGURAS_PADRAO) {
    if (l > teto) break;
    if (Math.abs(Math.log(l / alvo)) < Math.abs(Math.log(melhor / alvo))) melhor = l;
  }
  return melhor;
}

export function wikiThumb(url, width = 500) {
  if (!url) return url;
  // Wikidata (wdt:P18) devolve http://commons… → https senão a CSP bloqueia.
  url = url.replace(/^http:\/\//, 'https://');
  const w = larguraPadrao(width);
  // Já é thumbnail em largura PADRÃO (ex.: resolvido pelo servidor em _lib/media.js,
  // que garante largura ≤ original) → não mexe: reescrever poderia pedir largura maior
  // que o original e cair no "unscaled" (429).
  const jaThumb = url.match(/\/thumb\/.+\/(\d+)px-[^/]+$/);
  if (jaThumb && LARGURAS_PADRAO.includes(Number(jaThumb[1]))) return url;
  if (url.includes('Special:FilePath/')) {
    return url.split('?')[0] + '?width=' + w;
  }
  //  /wikipedia/commons/a/ab/Arquivo.ext  ·  /wikipedia/en/a/ab/Arquivo.ext
  //  /wikipedia/<proj>/thumb/a/ab/Arquivo.ext/123px-Arquivo.ext
  const m = url.match(/\/wikipedia\/([a-z-]+)\/(?:thumb\/)?[0-9a-f]\/[0-9a-f]{2}\/([^/?]+)/);
  if (!m) return url; // não-Wikimedia: passa direto
  const host = m[1] === 'commons' ? 'commons.wikimedia.org' : `${m[1]}.wikipedia.org`;
  return `https://${host}/wiki/Special:FilePath/${m[2]}?width=${w}`;
}

/** Nome do arquivo Commons a partir de qualquer URL do Wikimedia (ou null). */
export function arquivoWikimedia(url) {
  if (!url) return null;
  const fp = url.match(/Special:FilePath\/([^?#]+)/);
  if (fp) return decodeURIComponent(fp[1]).replace(/ /g, '_');
  const m = url.match(/\/wikipedia\/[a-z-]+\/(?:thumb\/)?[0-9a-f]\/[0-9a-f]{2}\/([^/?#]+)/);
  return m ? decodeURIComponent(m[1]).replace(/ /g, '_') : null;
}
