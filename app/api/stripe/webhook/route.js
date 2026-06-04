// Webhook do Stripe: verifica a assinatura (HMAC, sem SDK) e grava o plano na
// tabela subscriptions via service role. 503 se não configurado. Idempotente por user.
import crypto from 'node:crypto';
import { createClient } from '@supabase/supabase-js';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const WHSEC = process.env.STRIPE_WEBHOOK_SECRET;
const SECRET = process.env.STRIPE_SECRET_KEY;
const URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Verificação da assinatura "Stripe-Signature: t=..,v1=.." (tolerância de 5 min).
function assinaturaOk(payload, sig) {
  if (!sig) return false;
  const parts = Object.fromEntries(sig.split(',').map((s) => s.split('=')));
  if (!parts.t || !parts.v1) return false;
  const esperado = crypto.createHmac('sha256', WHSEC).update(`${parts.t}.${payload}`).digest('hex');
  try {
    if (!crypto.timingSafeEqual(Buffer.from(esperado), Buffer.from(parts.v1))) return false;
  } catch {
    return false;
  }
  const idade = Math.abs(Date.now() / 1000 - Number(parts.t));
  return idade < 300;
}

function planoDoPrice(priceId) {
  if (priceId && priceId === process.env.STRIPE_PRICE_PRO) return 'pro';
  return 'premium';
}

async function stripeGet(path) {
  const res = await fetch('https://api.stripe.com/v1/' + path, { headers: { authorization: `Bearer ${SECRET}` } });
  return res.json();
}

export async function POST(req) {
  if (!WHSEC || !SECRET) return Response.json({ error: 'Webhook não configurado.' }, { status: 503 });

  const payload = await req.text();
  if (!assinaturaOk(payload, req.headers.get('stripe-signature'))) {
    return Response.json({ error: 'Assinatura inválida.' }, { status: 400 });
  }

  let evt;
  try { evt = JSON.parse(payload); } catch { return Response.json({ error: 'JSON inválido.' }, { status: 400 }); }

  const db = URL && SERVICE ? createClient(URL, SERVICE, { auth: { persistSession: false } }) : null;
  if (!db) return Response.json({ received: true, note: 'sem service role — evento ignorado' });

  try {
    const obj = evt.data && evt.data.object;
    if (evt.type === 'checkout.session.completed' && obj.client_reference_id && obj.subscription) {
      const s = await stripeGet(`subscriptions/${obj.subscription}`);
      const priceId = s.items && s.items.data && s.items.data[0] && s.items.data[0].price && s.items.data[0].price.id;
      await db.from('subscriptions').upsert(
        {
          user_id: obj.client_reference_id,
          plan: planoDoPrice(priceId),
          status: s.status || 'active',
          stripe_customer_id: obj.customer || null,
          stripe_subscription_id: obj.subscription,
          current_period_end: s.current_period_end ? new Date(s.current_period_end * 1000).toISOString() : null,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'user_id' },
      );
    } else if (evt.type === 'customer.subscription.updated' || evt.type === 'customer.subscription.deleted') {
      const cancelado = evt.type.endsWith('deleted');
      const priceId = obj.items && obj.items.data && obj.items.data[0] && obj.items.data[0].price && obj.items.data[0].price.id;
      await db
        .from('subscriptions')
        .update({
          plan: cancelado ? 'free' : planoDoPrice(priceId),
          status: cancelado ? 'canceled' : obj.status,
          current_period_end: obj.current_period_end ? new Date(obj.current_period_end * 1000).toISOString() : null,
          updated_at: new Date().toISOString(),
        })
        .eq('stripe_subscription_id', obj.id);
    }
  } catch (e) {
    // Não derruba o webhook por erro de gravação — o Stripe re-tenta.
    console.warn('[stripe-webhook]', e && e.message);
  }

  return Response.json({ received: true });
}
