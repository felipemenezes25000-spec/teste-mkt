// GET /api/v1/visto?code=JP&passport=BR
// Só o passaporte brasileiro tem regras verificadas; outros recebem "consultar".
import { entrada, ok, invalido, naoEncontrado, preflight, META_CATALOGO } from '../_comum.js';
import { vistoPublico, destinoPorCode } from '../_dados.js';

export const runtime = 'nodejs';

export function OPTIONS() { return preflight(); }

export async function GET(req) {
  const { resposta, ctx } = await entrada(req);
  if (resposta) return resposta;
  const q = new URL(req.url).searchParams;
  const code = String(q.get('code') || '').toUpperCase();
  const passaporte = String(q.get('passport') || 'BR').toUpperCase();
  if (!/^[A-Z]{2}$/.test(code) || !/^[A-Z]{2}$/.test(passaporte)) return invalido('code e passport devem ser ISO de 2 letras.');
  if (!destinoPorCode(code)) return naoEncontrado('Destino não encontrado.');
  return ok(ctx, vistoPublico(code, passaporte), META_CATALOGO, 86400);
}
