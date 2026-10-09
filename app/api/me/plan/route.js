// Plano do usuário logado, lido da tabela subscriptions (preenchida pelo webhook
// do Stripe). Tudo é "no-op seguro": sem Supabase/sem login/sem tabela → 'free'.
import { createClient } from '@supabase/supabase-js';
import { limitar } from '../../../_lib/rateLimit.js';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const SUPA_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const SERVICE = process.env.SUPABASE_SERVICE_ROLE_KEY;

const free = (extra) => Response.json({ plano: 'free', ...extra });

export async function GET(req) {
  const bloqueio = limitar(req, 'plan', { limite: 60 });
  if (bloqueio) return bloqueio;
  if (!SUPA_URL || !ANON) return free({ config: false });
  try {
    const header = req.headers.get('authorization') || '';
    const token = header.toLowerCase().startsWith('bearer ') ? header.slice(7).trim() : '';
    if (!token) return free();

    const supaAuth = createClient(SUPA_URL, ANON, {
      auth: { persistSession: false, autoRefreshToken: false },
      global: { headers: { Authorization: `Bearer ${token}` } },
    });
    const { data: u } = await supaAuth.auth.getUser(token);
    if (!u || !u.user) return free();

    // Service role ignora RLS; sem ela, tenta como o próprio usuário (RLS de leitura).
    const db = SERVICE ? createClient(SUPA_URL, SERVICE, { auth: { persistSession: false } }) : supaAuth;
    const { data, error } = await db
      .from('subscriptions')
      .select('plan,status,current_period_end')
      .eq('user_id', u.user.id)
      .maybeSingle();

    const ativo = !error && data && (data.status === 'active' || data.status === 'trialing');
    const venceu = ativo && data.current_period_end && new Date(data.current_period_end) < new Date();
    if (ativo && !venceu && data.plan !== 'free') return Response.json({ plano: data.plan, status: data.status });
    // Trip Pass (pagamento único): Premium por 30 dias a partir da compra
    const { data: ate } = await supaAuth.rpc('trip_pass_ativo_ate');
    if (ate && new Date(ate) > new Date()) return Response.json({ plano: 'premium', status: 'trip_pass', ate });
    return free(data ? { status: data.status } : undefined);
  } catch (e) {
    console.warn('[me/plan]', e && e.message);
    return free();
  }
}
