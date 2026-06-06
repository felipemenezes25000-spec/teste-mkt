// Resumo da Wikipédia (pt) buscado NO BROWSER quando o usuário abre o modal de um
// ponto/cidade. Cache em memória (Map) + dedupe de chamadas in-flight + persistência
// em sessionStorage (só sucessos) pra não repetir a chamada à API. Fallback seguro:
// retorna { erro: true } quando o verbete não existe, é desambiguação ou a rede falha.
const cache = new Map(); // titulo -> { extrato, url, titulo, img } | { erro: true }
const emVoo = new Map(); // titulo -> Promise (deduplica chamadas simultâneas)
const SS_PREFIXO = 'msf.wiki.';

function lerSS(chave) {
  try { if (typeof sessionStorage === 'undefined') return null; const v = sessionStorage.getItem(chave); return v ? JSON.parse(v) : null; } catch { return null; }
}
function gravarSS(chave, valor) {
  try { if (typeof sessionStorage !== 'undefined') sessionStorage.setItem(chave, JSON.stringify(valor)); } catch { /* quota/privado: ignora */ }
}

async function buscarLang(titulo, lang) {
  try {
    const url = `https://${lang}.wikipedia.org/api/rest_v1/page/summary/` + encodeURIComponent(String(titulo).replace(/ /g, '_'));
    const res = await fetch(url, { headers: { accept: 'application/json' } });
    if (!res.ok) return null;
    const d = await res.json();
    if (!d || d.type === 'disambiguation' || !d.extract) return null;
    return {
      extrato: d.extract,
      url: (d.content_urls && d.content_urls.desktop && d.content_urls.desktop.page) || null,
      titulo: d.title || String(titulo),
      img: (d.originalimage && d.originalimage.source) || (d.thumbnail && d.thumbnail.source) || null,
    };
  } catch {
    return null;
  }
}

async function buscar(titulo) {
  // Tenta pt; se vier vazio, tenta en. Articula pra que pontos turísticos
  // obscuros (Iêmen, RDC, Tuvalu, Comores) ainda contem história — a Wikipédia
  // em pt não cobre 100% dos sítios menos visitados.
  const pt = await buscarLang(titulo, 'pt');
  if (pt) return pt;
  const en = await buscarLang(titulo, 'en');
  if (en) return en;
  return { erro: true };
}

export async function resumoClient(titulo) {
  if (!titulo) return { erro: true };
  if (cache.has(titulo)) return cache.get(titulo);
  const doSS = lerSS(SS_PREFIXO + titulo);
  if (doSS) { cache.set(titulo, doSS); return doSS; }
  if (emVoo.has(titulo)) return emVoo.get(titulo);

  const p = buscar(titulo).then((r) => {
    cache.set(titulo, r);
    if (!r.erro) gravarSS(SS_PREFIXO + titulo, r); // só persiste sucesso (erro pode ser transitório)
    return r;
  }).finally(() => emVoo.delete(titulo));

  emVoo.set(titulo, p);
  return p;
}
