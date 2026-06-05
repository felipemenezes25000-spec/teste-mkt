// Devolve a imagem do Wikimedia Commons numa largura adequada via o endpoint oficial
// Special:FilePath/<arquivo>?width=N. Esse endpoint lida com os dois casos SEM erro 400:
// se N ≥ largura do original, redireciona pro original; se N < original, gera o thumb.
// Assim não precisamos saber o tamanho do original (construir "/thumb/<N>px-" à mão
// quebra (400) quando o original é menor que N). Pura (server + client).
export function wikiThumb(url, width = 640) {
  if (!url) return url;
  // Já é Special:FilePath → só (re)define o width (preserva o host: commons/en/…).
  if (url.includes('Special:FilePath/')) {
    return url.split('?')[0] + '?width=' + width;
  }
  // upload.wikimedia.org, original OU thumb, de qualquer projeto:
  //  /wikipedia/commons/a/ab/Arquivo.ext   (Wikimedia Commons)
  //  /wikipedia/en/a/ab/Arquivo.ext        (upload local da en.wikipedia, ex.: fair-use)
  //  /wikipedia/<proj>/thumb/a/ab/Arquivo.ext/123px-Arquivo.ext
  const m = url.match(/\/wikipedia\/([a-z-]+)\/(?:thumb\/)?[0-9a-f]\/[0-9a-f]{2}\/([^/?]+)/);
  if (!m) return url; // não-Wikimedia: passa direto
  const host = m[1] === 'commons' ? 'commons.wikimedia.org' : `${m[1]}.wikipedia.org`;
  return `https://${host}/wiki/Special:FilePath/${m[2]}?width=${width}`;
}
