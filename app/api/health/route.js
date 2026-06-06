// Health check para o Render (healthCheckPath: /api/health).
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export function GET() {
  return Response.json({ ok: true });
}
