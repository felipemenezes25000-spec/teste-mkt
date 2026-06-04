// Pontos turísticos REAIS via Wikidata SPARQL (no servidor, cacheado). Pega itens
// que são "atração turística" (Q570116 + subclasses) OU Patrimônio Mundial da
// UNESCO no país, com imagem. Degrada com segurança: timeout + try/catch → [].
const DIA = 86400;
const ENDPOINT = 'https://query.wikidata.org/sparql';
const UA = 'MundoSemFim/1.0 (planejador de viagem; contato via app)';

function consulta(qid) {
  return `SELECT DISTINCT ?item ?itemLabel ?img ?desc WHERE {
    { ?item wdt:P31/wdt:P279* wd:Q570116. } UNION { ?item wdt:P1435 wd:Q9259. }
    ?item wdt:P17 wd:${qid}; wdt:P18 ?img.
    OPTIONAL { ?item schema:description ?desc. FILTER(LANG(?desc) = "pt") }
    SERVICE wikibase:label { bd:serviceParam wikibase:language "pt,en". }
  } LIMIT 18`;
}

// Miniatura via Special:FilePath (?width) pra não baixar a imagem em resolução cheia.
function thumb(url, width = 480) {
  if (!url) return null;
  return url.includes('Special:FilePath/') ? `${url}${url.includes('?') ? '&' : '?'}width=${width}` : url;
}

export async function atracoesDe(qid, { revalidate = DIA, limite = 8 } = {}) {
  if (!qid) return [];
  try {
    const url = `${ENDPOINT}?format=json&query=${encodeURIComponent(consulta(qid))}`;
    const res = await fetch(url, {
      headers: { accept: 'application/sparql-results+json', 'user-agent': UA },
      next: { revalidate },
      signal: AbortSignal.timeout(9000),
    });
    if (!res.ok) return [];
    const data = await res.json();
    const linhas = (data && data.results && data.results.bindings) || [];
    const vistos = new Set();
    const out = [];
    for (const b of linhas) {
      const nome = b.itemLabel && b.itemLabel.value;
      const img = b.img && b.img.value;
      if (!nome || !img || /^Q\d+$/.test(nome)) continue; // ignora rótulo cru (QID)
      const chave = nome.toLowerCase();
      if (vistos.has(chave)) continue;
      vistos.add(chave);
      out.push({
        nome,
        img: thumb(img),
        descricao: (b.desc && b.desc.value) || '',
      });
      if (out.length >= limite) break;
    }
    return out;
  } catch {
    return [];
  }
}
