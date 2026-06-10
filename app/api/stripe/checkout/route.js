// Cria uma sessão de Checkout do Stripe (via REST, sem SDK). 503 se não configurado.
// Exige JWT do Supabase — o userId vem do token, nunca do body.
import { createClient } from '@supabase/supabase-js';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const SECRET = process.env.STRIPE_SECRET_KEY;
const PRICES = { premium: process.env.STRIPE_PRICE_PREMIUM, pro: process.env.STRIPE_PRICE_PRO };
const SITE = process.env.NEXT_PUBLIC_SITE_URL || '';
const SUPA_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPA_ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

function erro(msg, status) { return Response.json({ error: msg }, { status }); }

async function autenticar(req) {
  if (!SUPA_URL || !SUPA_ANON) return null;
  const header = req.headers.get('authorization') || '';
  const token = header.toLowerCase().startsWith('bearer ') ? header.slice(7).trim() : '';
  if (!token) return null;
  const supa = createClient(SUPA_URL, SUPA_ANON, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: { headers: { Authorization: `Bearer ${token}` } },
  });
  const { data, error } = await supa.auth.getUser(token);
  if (error || !data || !data.user) return null;
  return data.user;
}

export async function POST(req) {
  if (!SECRET) return erro('Pagamento ainda não configurado.', 503);

  const user = await autenticar(req);
  if (!user) return erro('Faça login para assinar.', 401);

  let body;
  try { body = await req.json(); } catch { return erro('JSON inválido.', 400); }

  const price = PRICES[body && body.plano];
  if (!price) return erro('Plano inválido ou sem price configurado.', 400);

  const base = SITE || '';
  const form = new URLSearchParams();
  form.set('mode', 'subscription');
  form.set('line_items[0][price]', price);
  form.set('line_items[0][quantity]', '1');
  form.set('success_url', `${base}/conta?ok=1`);
  form.set('cancel_url', `${base}/planos`);
  form.set('allow_promotion_codes', 'true');
  form.set('client_reference_id', user.id);
  if (user.email) form.set('customer_email', user.email);

  try {
    const res = await fetch('https://api.stripe.com/v1/checkout/sessions', {
      method: 'POST',
      headers: { authorization: `Bearer ${SECRET}`, 'content-type': 'application/x-www-form-urlencoded' },
      body: form.toString(),
      signal: AbortSignal.timeout(20000),
    });
    const data = await res.json().catch(() => null);
    if (!res.ok || !data || !data.url) return erro('Falha ao criar sessão de pagamento.', 502);
    return Response.json({ url: data.url });
  } catch {
    return erro('Falha ao falar com o Stripe.', 502);
  }
}
