// História da Wikipédia buscada NO BROWSER quando o usuário abre o modal de um
// ponto/cidade. Usa a Action API com `exchars=1200` (limite máximo da Wikipédia)
// pra trazer 3-4 parágrafos de história REAL — não o lead seco da REST summary.
// O resultado é texto rico: história + curiosidades + contexto cultural.
import { wikiThumb } from './wikiThumb.js';
//
// Estratégia em camadas:
//   1. cache em memória (Map) → 0ms na 2ª chamada do mesmo título
//   2. dedupe in-flight → 1 fetch só pra N chamadas simultâneas
//   3. sessionStorage (só sucesso) → sobrevive nav dentro da aba
//   4. tenta pt; se vazio, cai pra en (cobre pontos obscuros sem verbete pt)
//   5. erro/desambig/sem extrato → { erro: true } pra o componente cair no
//      contextoPais (histórico editorial do país)

const cache = new Map();   // titulo -> resultado|{erro:true}
const emVoo = new Map();   // titulo -> Promise (deduplica chamadas simultâneas)
const SS_PREFIXO = 'msf.wiki.v3.'; // v2 = invalida cache antigo da REST summary

const EXCHARS = 1200; // limite máximo da Action API; ~3 parágrafos
const PI_WIDTH = 960; // thumb pro modal (renderizado em 960px)

function lerSS(chave) {
  try { if (typeof sessionStorage === 'undefined') return null; const v = sessionStorage.getItem(chave); return v ? JSON.parse(v) : null; } catch { return null; }
}
function gravarSS(chave, valor) {
  try { if (typeof sessionStorage !== 'undefined') sessionStorage.setItem(chave, JSON.stringify(valor)); } catch { /* quota/privado: ignora */ }
}

// Limpa marcadores que a Wikipédia deixa: notas "[carece de fontes]", "(?)"
// soltos do parser de IPA, e linhas só de espaço. Mantém quebras de parágrafo.
function limparExtrato(s) {
  return String(s || '')
    .replace(/\[\d+\]/g, '')              // referências [1] [2]
    .replace(/\[carece[^\]]*\]/gi, '')    // "[carece de fontes]"
    .replace(/\(\s*\?\s*\)/g, '')         // "(?)" de transliteração
    .replace(/\n{3,}/g, '\n\n')           // colapsa múltiplas linhas
    .trim();
}

async function buscarLang(titulo, lang) {
  try {
    const params = new URLSearchParams({
      action: 'query',
      format: 'json',
      prop: 'extracts|pageimages|info|pageprops',
      exchars: String(EXCHARS),
      explaintext: '1',
      piprop: 'original|thumbnail',
      pithumbsize: String(PI_WIDTH),
      inprop: 'url',
      titles: titulo,
      redirects: '1',
      origin: '*', // CORS no browser
    });
    const url = `https://${lang}.wikipedia.org/w/api.php?${params}`;
    const res = await fetch(url, { headers: { accept: 'application/json' } });
    if (!res.ok) return null;
    const data = await res.json();
    const pages = data?.query?.pages;
    if (!pages) return null;
    const page = Object.values(pages)[0];
    if (!page || page.missing !== undefined || !page.extract) return null;
    // página de desambiguação tem pageprops.disambiguation
    if (page.pageprops && 'disambiguation' in page.pageprops) return null;
    const extrato = limparExtrato(page.extract);
    if (extrato.length < 80) return null; // texto curto demais ≈ stub
    return {
      extrato,
      url: page.fullurl || `https://${lang}.wikipedia.org/wiki/${encodeURIComponent(String(titulo).replace(/ /g, '_'))}`,
      titulo: page.title || String(titulo),
      img: wikiThumb((page.original && page.original.source) || (page.thumbnail && page.thumbnail.source) || null, 960),
    };
  } catch {
    return null;
  }
}

async function buscar(titulo) {
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
    if (!r.erro) gravarSS(SS_PREFIXO + titulo, r);
    return r;
  }).finally(() => emVoo.delete(titulo));

  emVoo.set(titulo, p);
  return p;
}
