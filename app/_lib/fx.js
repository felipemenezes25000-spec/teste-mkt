// Câmbio para despesas (OMEGA V4 §38): Frankfurter (taxas de referência do BCE,
// publicadas em dias úteis). Frescor RECENTE com a DATA da taxa — não é a taxa do
// cartão (spread/IOF ficam de fora e isso é dito na UI).
import { chamarProvider } from '../_domain/provider.js';

const cache = new Map();
export async function taxa(de, para) {
  if (de === para) return { taxa: 1, data: null, fonte: 'mesma moeda', status: 'LIVE' };
  const k = `${de}>${para}`;
  if (cache.has(k)) return cache.get(k);
  const r = await chamarProvider(
    { nome: 'frankfurter-ecb', estado: 'LIVE_VERIFIED', timeoutMs: 8000, idempotente: true, freshness: 'RECENT', sourceUrl: 'https://frankfurter.dev' },
    async (signal) => {
      const res = await fetch(`https://api.frankfurter.dev/v1/latest?base=${de}&symbols=${para}`, { signal });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return res.json();
    },
  );
  const v = r.data && r.data.rates && r.data.rates[para];
  let out = v ? { taxa: v, data: r.data.date, fonte: 'BCE via Frankfurter', status: 'RECENT' } : null;
  if (!out) {
    // moedas fora da lista do BCE (ex.: VND, ARS): taxa de referência diária da open.er-api
    const r2 = await chamarProvider({ nome: 'open-er-api', estado: 'LIVE_VERIFIED', timeoutMs: 8000, idempotente: true, freshness: 'RECENT' }, async (signal) => {
      const res = await fetch(`https://open.er-api.com/v6/latest/${de}`, { signal });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return res.json();
    });
    const v2 = r2.data && r2.data.rates && r2.data.rates[para];
    out = v2 ? { taxa: v2, data: (r2.data.time_last_update_utc || '').slice(5, 16), fonte: 'open.er-api.com', status: 'RECENT' } : { taxa: null, data: null, fonte: 'indisponível', status: 'UNAVAILABLE' };
  }
  if (v) cache.set(k, out);
  return out;
}
