// Foto de capa (com crédito) por destino, resolvida no servidor: /api/fotos?codes=JP,TH
// Evita chamar APIs do Wikimedia direto do browser e devolve URL em largura segura.
import { destinoPorCode } from '../../_lib/destinos.js';
import { fotoCapa } from '../../_lib/wiki.js';
import { resolverImagens } from '../../_lib/media.js';
import { arquivoWikimedia } from '../../_lib/wikiThumb.js';

export const runtime = 'nodejs';

export async function GET(req) {
  const codes = [...new Set((new URL(req.url).searchParams.get('codes') || '').toUpperCase().split(',').filter((c) => /^[A-Z]{2}$/.test(c)))].slice(0, 40);
  const dests = codes.map(destinoPorCode).filter(Boolean);
  const brutas = await Promise.all(dests.map((d) => fotoCapa(d)));
  const assets = await resolverImagens(brutas.filter(Boolean), { largura: 500 });
  const out = {};
  dests.forEach((d, i) => {
    const a = brutas[i] ? assets.get(arquivoWikimedia(brutas[i]) || '') : null;
    out[d.code] = a
      ? { img: a.url, credito: { fonte: 'Wikimedia Commons', autor: a.photographer, licenca: a.license, link: a.pageUrl } }
      : { img: brutas[i] || null, credito: null };
  });
  return Response.json(out, { headers: { 'cache-control': 'public, max-age=3600, s-maxage=86400' } });
}
