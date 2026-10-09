// Foto de capa (com crédito) por destino, resolvida no servidor: /api/fotos?codes=JP,TH
// Capa HD curada da Commons (_data/midia.js, sem rede) primeiro; só sem ela cai na
// busca antiga pela Wikipédia. `&lugares=1` devolve também as fotos HD das atrações
// e os vídeos curados do país (usados no Modo Viagem para o "próximo passo").
import { destinoPorCode } from '../../_lib/destinos.js';
import { fotoCapa } from '../../_lib/wiki.js';
import { resolverImagens } from '../../_lib/media.js';
import { arquivoWikimedia } from '../../_lib/wikiThumb.js';
import { limitar } from '../../_lib/rateLimit.js';
import { capaPais, videosPais, fotoAtracao } from '../../_lib/midia.js';
import { ATRACOES } from '../../_engine/atracoes.js';

export const runtime = 'nodejs';

export async function GET(req) {
  const bloqueio = limitar(req, 'fotos', { limite: 60 });
  if (bloqueio) return bloqueio;
  const url = new URL(req.url);
  const codes = [...new Set((url.searchParams.get('codes') || '').toUpperCase().split(',').filter((c) => /^[A-Z]{2}$/.test(c)))].slice(0, 40);
  const comLugares = url.searchParams.get('lugares') === '1' && codes.length <= 3;
  const dests = codes.map(destinoPorCode).filter(Boolean);
  const out = {};
  const semHD = [];
  for (const d of dests) {
    const c = capaPais(d.code, 960);
    if (c) out[d.code] = { img: c.src, srcSet: c.srcSet, lugar: c.lugar, credito: c.credito };
    else semHD.push(d);
    if (comLugares) {
      const lugares = {};
      for (const a of ATRACOES[d.code] || []) { const f = fotoAtracao(a.wiki, 960); if (f) lugares[a.nome] = { img: f.src, srcSet: f.srcSet, credito: f.credito }; }
      out[d.code] = { ...(out[d.code] || {}), lugares, videos: videosPais(d.code) };
    }
  }
  if (semHD.length) {
    const brutas = await Promise.all(semHD.map((d) => fotoCapa(d)));
    const assets = await resolverImagens(brutas.filter(Boolean), { largura: 500 });
    semHD.forEach((d, i) => {
      const a = brutas[i] ? assets.get(arquivoWikimedia(brutas[i]) || '') : null;
      const base = a
        ? { img: a.url, credito: { fonte: 'Wikimedia Commons', autor: a.photographer, licenca: a.license, link: a.pageUrl } }
        : { img: brutas[i] || null, credito: null };
      out[d.code] = { ...(out[d.code] || {}), ...base };
    });
  }
  return Response.json(out, { headers: { 'cache-control': 'public, max-age=3600, s-maxage=86400' } });
}
