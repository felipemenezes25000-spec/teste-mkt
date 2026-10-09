// GET /api/v1/destinos?region=&max_cost=&month=&limit=&offset=
import { entrada, ok, invalido, preflight, META_CATALOGO } from '../_comum.js';
import { listar } from '../_dados.js';

export const runtime = 'nodejs';

export function OPTIONS() { return preflight(); }

export async function GET(req) {
  const { resposta, ctx } = await entrada(req);
  if (resposta) return resposta;
  const q = new URL(req.url).searchParams;
  const limite = q.has('limit') ? Number(q.get('limit')) : 50;
  const offset = q.has('offset') ? Number(q.get('offset')) : 0;
  const mes = q.has('month') ? Number(q.get('month')) : null;
  const maxCusto = q.has('max_cost') ? Number(q.get('max_cost')) : null;
  if (!Number.isInteger(limite) || limite < 1 || limite > 250) return invalido('limit deve ser inteiro entre 1 e 250.');
  if (!Number.isInteger(offset) || offset < 0) return invalido('offset deve ser inteiro ≥ 0.');
  if (mes !== null && (!Number.isInteger(mes) || mes < 1 || mes > 12)) return invalido('month deve ser de 1 a 12.');
  if (maxCusto !== null && (!Number.isFinite(maxCusto) || maxCusto <= 0)) return invalido('max_cost deve ser número positivo (USD/dia).');
  const r = listar({ regiao: q.get('region') || '', maxCusto, mes, limite, offset });
  return ok(ctx, r.itens, { ...META_CATALOGO, total: r.total, limit: limite, offset });
}
