// Exportação LGPD dos dados da CONTA (o que está no servidor), como o próprio
// usuário: o cliente Supabase usa o JWT dele → RLS garante só os próprios dados.
import { createClient } from '@supabase/supabase-js';
import { limitar } from '../../../_lib/rateLimit.js';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const URL_ = process.env.NEXT_PUBLIC_SUPABASE_URL;
const ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export async function GET(req) {
  const bloqueio = limitar(req, 'export', { limite: 5 });
  if (bloqueio) return bloqueio;
  if (!URL_ || !ANON) return Response.json({ conta: null, motivo: 'Conta não configurada neste ambiente.' });
  const h = req.headers.get('authorization') || '';
  const token = h.toLowerCase().startsWith('bearer ') ? h.slice(7).trim() : '';
  if (!token) return Response.json({ error: 'Faça login para exportar os dados da conta.' }, { status: 401 });
  const db = createClient(URL_, ANON, { auth: { persistSession: false }, global: { headers: { Authorization: `Bearer ${token}` } } });
  const { data: u } = await db.auth.getUser(token);
  if (!u || !u.user) return Response.json({ error: 'Sessão inválida.' }, { status: 401 });
  const tabelas = ['profiles', 'subscriptions', 'trips', 'trip_members', 'trip_legs', 'itinerary_items', 'reservations', 'expenses', 'trip_documents', 'trip_alerts'];
  const conta = { usuario: { id: u.user.id, email: u.user.email, criadoEm: u.user.created_at } };
  for (const t of tabelas) {
    const { data, error } = await db.from(t).select('*').limit(5000);
    conta[t] = error ? { erro: error.message } : data;
  }
  return Response.json({ conta }, { headers: { 'cache-control': 'no-store' } });
}
