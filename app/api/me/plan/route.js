// Plano do usuário logado, lido da tabela subscriptions (preenchida pelo webhook
// do Stripe). Tudo é "no-op seguro": sem Supabase/sem login/sem tabela → 'free'.
import { createClient } from '@supabase/supabase-js';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const SERVICE = process.env.SUPABASE_SERVICE_ROLE_KEY;

const free = (extra) => Response.json({ plano: 'free', ...extra });

export async function GET(req) {
  if (!URL || !ANON) return free({ config: false });
  try {
    const header = req.headers.get('authorization') || '';
    const token = header.toLowerCase().startsWith('bearer ') ? header.slice(7).trim() : '';
    if (!token) return free();

    const supaAuth = createClient(URL, ANON, {
      auth: { persistSession: false, autoRefreshToken: false },
      global: { headers: { Authorization: `Bearer ${token}` } },
    });
    const { data: u } = await supaAuth.auth.getUser(token);
    if (!u || !u.user) return free();

    // Service role ignora RLS; sem ela, tenta como o próprio usuário (RLS de leitura).
    const db = SERVICE ? createClient(URL, SERVICE, { auth: { persistSession: false } }) : supaAuth;
    const { data, error } = await db
      .from('subscriptions')
      .select('plan,status,current_period_end')
      .eq('user_id', u.user.id)
      .maybeSingle();

    if (error || !data) return free();
    const ativo = data.status === 'active' || data.status === 'trialing';
    const venceu = data.current_period_end && new Date(data.current_period_end) < new Date();
    return Response.json({ plano: ativo && !venceu ? data.plan : 'free', status: data.status });
  } catch {
    return free();
  }
}
