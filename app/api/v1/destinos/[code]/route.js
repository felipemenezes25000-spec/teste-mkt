// GET /api/v1/destinos/{code}  (ISO 3166-1 alfa-2)
import { entrada, ok, naoEncontrado, preflight, META_CATALOGO } from '../../_comum.js';
import { detalheDestino, destinoPorCode } from '../../_dados.js';

export const runtime = 'nodejs';

export function OPTIONS() { return preflight(); }

export async function GET(req, ctx2) {
  const { resposta, ctx } = await entrada(req);
  if (resposta) return resposta;
  const { code } = await ctx2.params;
  const c = String(code || '').toUpperCase();
  const d = /^[A-Z]{2}$/.test(c) ? destinoPorCode(c) : null;
  if (!d) return naoEncontrado('Destino não encontrado (use o código ISO de 2 letras).');
  return ok(ctx, detalheDestino(d), META_CATALOGO);
}
