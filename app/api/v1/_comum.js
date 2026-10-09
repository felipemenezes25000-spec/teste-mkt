// Infra comum da API pública v1 (somente leitura do catálogo).
//   • sem chave: 30 req/min por IP (uso de avaliação);
//   • com chave (x-api-key): limite da chave (padrão 600/min), validada por hash
//     no Supabase (RPC validar_api_key) com cache de 60 s por instância;
//   • CORS aberto para GET; toda resposta traz fonte e frescor do dado.
import { createClient } from '@supabase/supabase-js';
import { consumir, ipDe } from '../../_lib/rateLimit.js';
import { chaveDoPedido, hashChave, FORMATO_CHAVE } from '../../_lib/plataforma/apiKeys.js';

export const VERSAO_API = '1.0.0';
export const LIMITE_ANONIMO = 30;
const SUPA_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPA_ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const cache = new Map();

export const CORS = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET, OPTIONS',
  'access-control-allow-headers': 'x-api-key, authorization, content-type',
  'access-control-max-age': '86400',
};

export function preflight() {
  return new Response(null, { status: 204, headers: CORS });
}

function erro(status, codigo, mensagem, extra = {}) {
  return Response.json({ error: { code: codigo, message: mensagem } }, { status, headers: { ...CORS, 'cache-control': 'no-store', ...extra } });
}

async function validarChave(chave) {
  if (!FORMATO_CHAVE.test(chave)) return null;
  const hash = await hashChave(chave);
  const hit = cache.get(hash);
  if (hit && hit.ate > Date.now()) return hit.valor;
  let valor = null;
  if (SUPA_URL && SUPA_ANON) {
    try {
      const supa = createClient(SUPA_URL, SUPA_ANON, { auth: { persistSession: false, autoRefreshToken: false } });
      const { data, error } = await supa.rpc('validar_api_key', { p_hash: hash });
      if (!error && Array.isArray(data) && data[0]) valor = { id: data[0].id, limite: data[0].limite_min, escopos: data[0].escopos };
    } catch { /* sem banco: chave não validada */ }
  }
  cache.set(hash, { valor, ate: Date.now() + 60000 });
  if (cache.size > 5000) cache.delete(cache.keys().next().value);
  return valor;
}

/**
 * Autentica e aplica o limite. Retorna { resposta } (erro) ou { ctx }.
 * @returns {Promise<{ resposta?: Response, ctx?: { plano: 'anonimo'|'chave', limite: number, restante: number } }>}
 */
export async function entrada(req) {
  const chave = chaveDoPedido(req);
  let plano = 'anonimo';
  let limite = LIMITE_ANONIMO;
  let balde = `v1|ip|${ipDe(req)}`;
  if (chave) {
    const v = await validarChave(chave);
    if (!v) return { resposta: erro(401, 'invalid_api_key', 'Chave de API inválida ou revogada.') };
    plano = 'chave';
    limite = v.limite;
    balde = `v1|key|${v.id}`;
  }
  const r = consumir(balde, limite, 60000);
  const cab = { 'x-ratelimit-limit': String(limite), 'x-ratelimit-remaining': String(r.restante) };
  if (!r.ok) return { resposta: erro(429, 'rate_limited', 'Limite de requisições atingido.', { ...cab, 'retry-after': String(r.retryAfter) }) };
  return { ctx: { plano, limite, restante: r.restante, cab } };
}

/** Resposta de sucesso padronizada: { data, meta } + cabeçalhos de limite e cache. */
export function ok(ctx, data, meta = {}, cacheSeg = 3600) {
  return Response.json(
    { data, meta: { api: VERSAO_API, ...meta } },
    { headers: { ...CORS, ...ctx.cab, 'cache-control': `public, max-age=${Math.min(cacheSeg, 300)}, s-maxage=${cacheSeg}`, vary: 'x-api-key, authorization' } },
  );
}

export function naoEncontrado(mensagem) { return erro(404, 'not_found', mensagem); }
export function invalido(mensagem) { return erro(400, 'invalid_request', mensagem); }

/** Fonte/frescor do catálogo (dados compilados, não ao vivo). */
export const META_CATALOGO = {
  freshness: 'HISTORICAL',
  source: 'Catálogo Mundo Sem Fim (compilado jun/2026; custos são referência, não cotação)',
  methodology: '/fontes',
};
