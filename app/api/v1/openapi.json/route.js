// GET /api/v1/openapi.json — especificação da API pública (sem limite de chave).
import { OPENAPI } from '../../../_lib/plataforma/openapi.js';
import { CORS } from '../_comum.js';

export const dynamic = 'force-static';

export function GET() {
  return Response.json(OPENAPI, { headers: { ...CORS, 'cache-control': 'public, max-age=3600' } });
}
