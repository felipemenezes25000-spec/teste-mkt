import { describe, it, expect } from 'vitest';
import { TELAS } from './i18nTelas.js';
import { interpolar } from './i18n.js';

// Achata { a: { b: 'x' } } → { 'a.b': 'x' } para comparar idiomas chave a chave.
function achatar(obj, prefixo = '', out = {}) {
  for (const [k, v] of Object.entries(obj)) {
    const chave = prefixo ? `${prefixo}.${k}` : k;
    if (v && typeof v === 'object') achatar(v, chave, out);
    else out[chave] = v;
  }
  return out;
}
const vars = (s) => [...String(s).matchAll(/\{(\w+)\}/g)].map((m) => m[1]).sort();

describe('dicionário das telas', () => {
  const pt = achatar(TELAS.pt);
  for (const lang of ['en', 'es', 'ja']) {
    const outro = achatar(TELAS[lang]);
    it(`${lang} tem todas as chaves do pt, sem vazias`, () => {
      const faltam = Object.keys(pt).filter((k) => !(k in outro));
      expect(faltam).toEqual([]);
      const vazias = Object.entries(outro).filter(([, v]) => typeof v !== 'string' || !v.trim()).map(([k]) => k);
      expect(vazias).toEqual([]);
    });
    it(`${lang} preserva as variáveis de interpolação`, () => {
      const diferentes = Object.keys(pt).filter((k) => k in outro && vars(pt[k]).join() !== vars(outro[k]).join());
      expect(diferentes).toEqual([]);
    });
  }
  it('interpolar troca variáveis e mantém as desconhecidas', () => {
    expect(interpolar('Saia às {h}', { h: '09:40' })).toBe('Saia às 09:40');
    expect(interpolar('{a} e {b}', { a: 1 })).toBe('1 e {b}');
  });
});
