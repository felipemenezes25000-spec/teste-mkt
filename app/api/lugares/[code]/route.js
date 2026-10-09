// Lugares (atrações + cidades) de um país com coordenadas verificadas e proveniência.
// Servido pelo servidor para não empacotar o dataset de coordenadas no browser.
import { destinoPorCode } from '../../../_lib/destinos.js';
import { pontosDoPais, GEO_META } from '../../../_lib/geo.js';
import { atracoesDoPais } from '../../../_engine/atracoes.js';
import { atracoesPrecosDoPais } from '../../../_engine/atracoesPrecos.js';
import { slugify } from '../../../_lib/slug.js';
import { limitar } from '../../../_lib/rateLimit.js';

export const runtime = 'nodejs';
export const revalidate = 86400;

export async function GET(req, ctx) {
  const bloqueio = limitar(req, 'lugares', { limite: 120 });
  if (bloqueio) return bloqueio;
  const { code } = await ctx.params;
  const d = /^[A-Z]{2}$/.test(String(code || '').toUpperCase()) ? destinoPorCode(String(code).toUpperCase()) : null;
  if (!d) return Response.json({ error: 'País não encontrado.' }, { status: 404 });
  const { atracoes, cidades, cobertura } = pontosDoPais(d);
  // preço de referência (HISTÓRICO) quando a atração existe no catálogo de preços
  const precos = new Map((atracoesPrecosDoPais(d.code) || []).map((p) => [slugify(p.nome), p]));
  const todos = (atracoesDoPais(d.code) || []).map((a) => {
    const id = `atr:${slugify(a.nome)}`;
    const geo = atracoes.find((x) => x.id === id);
    const p = precos.get(slugify(a.nome));
    return {
      id, nome: a.nome, cidade: a.cidade || '', lat: geo ? geo.lat : null, lng: geo ? geo.lng : null,
      precoUSD: p && Number.isFinite(p.precoUSD) ? p.precoUSD : null, precoTipo: p ? p.precoTipo : null, duracao: p ? p.duracao : null,
    };
  });
  return Response.json(
    { code: d.code, nome: d.nome, centro: d.coords, atracoes: todos, cidades, cobertura, fonte: GEO_META.fonte, geradoEm: GEO_META.geradoEm },
    { headers: { 'cache-control': 'public, max-age=3600, s-maxage=86400' } },
  );
}
