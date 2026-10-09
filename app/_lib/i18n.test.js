import { describe, it, expect } from 'vitest';
import pt from './i18n/pt.js';
import en from './i18n/en.js';
import es from './i18n/es.js';
import ja from './i18n/ja.js';
import { interpolar, STRINGS, carregarIdioma } from './i18n.js';

const TELAS = { pt, en, es, ja };

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

describe('dicionários (pt/en/es/ja)', () => {
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
  it('só o pt vem no bundle; outro idioma carrega sob demanda e uma vez só', async () => {
    expect(Object.keys(STRINGS)).toEqual(['pt']);
    const a = carregarIdioma('ja');
    const b = carregarIdioma('ja');
    expect(await a).toBe(await b);
    expect(STRINGS.ja.nav2.viagens).toBe(ja.nav2.viagens);
    expect(await carregarIdioma('xx')).toBeNull();
  });
});

describe('prévia do mapa', () => {
  it('enquadra pontos com margem e cai no mundo sem pontos', async () => {
    const { enquadrarPrevia } = await import('../_components/mapa/MapaInterativo.jsx');
    const w = enquadrarPrevia([]);
    expect(w).toEqual({ x0: 0, y0: 0, w: 360, h: 180 });
    const q = enquadrarPrevia([{ lng: 0, lat: 0 }, { lng: 10, lat: 10 }]);
    expect(q.x0).toBeLessThan(180);
    expect(q.x0 + q.w).toBeGreaterThan(190);
    expect(enquadrarPrevia([{ lng: 5, lat: 5 }]).w).toBeGreaterThan(0);
  });
});
