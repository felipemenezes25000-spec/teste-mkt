// GET /api/v1/custo?code=JP&days=10&style=medio&travelers=2
import { entrada, ok, invalido, naoEncontrado, preflight, META_CATALOGO } from '../_comum.js';
import { custoViagem } from '../_dados.js';

export const runtime = 'nodejs';
const ESTILOS = ['mochila', 'medio', 'conforto'];

export function OPTIONS() { return preflight(); }

export async function GET(req) {
  const { resposta, ctx } = await entrada(req);
  if (resposta) return resposta;
  const q = new URL(req.url).searchParams;
  const code = String(q.get('code') || '').toUpperCase();
  const dias = Number(q.get('days') || 7);
  const pessoas = Number(q.get('travelers') || 1);
  const estilo = q.get('style') || 'medio';
  if (!/^[A-Z]{2}$/.test(code)) return invalido('code (ISO de 2 letras) é obrigatório.');
  if (!Number.isInteger(dias) || dias < 1 || dias > 120) return invalido('days deve ser inteiro de 1 a 120.');
  if (!Number.isInteger(pessoas) || pessoas < 1 || pessoas > 20) return invalido('travelers deve ser inteiro de 1 a 20.');
  if (!ESTILOS.includes(estilo)) return invalido(`style deve ser ${ESTILOS.join(', ')}.`);
  const r = custoViagem(code, { dias, estilo, pessoas });
  if (!r) return naoEncontrado('Destino não encontrado.');
  return ok(ctx, r, { ...META_CATALOGO, freshness: 'ESTIMATE' });
}
