import { cookies } from 'next/headers';
import { IDIOMA_PADRAO, IDIOMAS } from './i18n.js';
import pt from './i18n/pt.js';
import en from './i18n/en.js';
import es from './i18n/es.js';
import ja from './i18n/ja.js';

const STRINGS = { pt, en, es, ja };

// Versão server do i18n: lê o cookie msf.lang.v1 via next/headers e devolve
// idioma + função t(). Usar em Server Components.
//
// Importante: chamar isso FORÇA dynamic rendering da página (cookies() é
// dynamic). Para páginas SSG que não precisam de i18n no servidor, use o
// client useIdioma() em sub-componentes específicos em vez de tudo SSR.

export async function getIdiomaServer() {
  try {
    const ck = await cookies();
    const v = ck.get('msf.lang.v1')?.value;
    return IDIOMAS.some((i) => i.code === v) ? v : IDIOMA_PADRAO;
  } catch {
    return IDIOMA_PADRAO;
  }
}

// Devolve { idioma, t } — mesmo algoritmo de t() do hook client.
export async function tServerFactory() {
  const idioma = await getIdiomaServer();
  function t(path) {
    const partes = String(path || '').split('.');
    const tentar = (dict) => {
      let cur = dict;
      for (const p of partes) {
        if (cur && typeof cur === 'object' && p in cur) cur = cur[p];
        else return null;
      }
      return typeof cur === 'string' ? cur : null;
    };
    return tentar(STRINGS[idioma]) || tentar(STRINGS[IDIOMA_PADRAO]) || path;
  }
  return { idioma, t };
}
