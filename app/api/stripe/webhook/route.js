// Webhook do Stripe: verifica a assinatura (HMAC, sem SDK), deduplica por event.id
// (tabela stripe_events), descarta eventos fora de ordem (subscriptions.ultimo_evento_em)
// e grava o plano via service role. 503 se não configurado.
import { createClient } from '@supabase/supabase-js';
import { verificarAssinatura, planoDoPrice, eventoForaDeOrdem } from '../../../_lib/stripeWebhook.js';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const WHSEC = process.env.STRIPE_WEBHOOK_SECRET;
const SECRET = process.env.STRIPE_SECRET_KEY;
const SUPA_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE = process.env.SUPABASE_SERVICE_ROLE_KEY;

async function stripeGet(path) {
  const res = await fetch('https://api.stripe.com/v1/' + path, {
    headers: { authorization: `Bearer ${SECRET}` },
    signal: AbortSignal.timeout(15000),
  });
  if (!res.ok) throw new Error(`Stripe API ${res.status} em ${path}`);
  return res.json();
}

// supabase-js v2 NÃO lança em falha de query — devolve { error }. Sem este check,
// uma gravação que falhou responderia 200 ao Stripe e o evento se perderia.
function exigeOk({ error }, contexto) {
  if (error) throw new Error(`${contexto}: ${error.message}`);
}

const iso = (s) => (s ? new Date(s * 1000).toISOString() : null);

export async function POST(req) {
  if (!WHSEC || !SECRET) return Response.json({ error: 'Webhook não configurado.' }, { status: 503 });

  const payload = await req.text();
  if (!verificarAssinatura(payload, req.headers.get('stripe-signature'), WHSEC)) {
    return Response.json({ error: 'Assinatura inválida.' }, { status: 400 });
  }

  let evt;
  try { evt = JSON.parse(payload); } catch { return Response.json({ error: 'JSON inválido.' }, { status: 400 }); }
  if (!evt || typeof evt.id !== 'string' || !evt.type) return Response.json({ error: 'Evento inválido.' }, { status: 400 });

  const db = SUPA_URL && SERVICE ? createClient(SUPA_URL, SERVICE, { auth: { persistSession: false } }) : null;
  if (!db) return Response.json({ received: true, note: 'sem service role — evento ignorado' });

  // Deduplicação: um evento já PROCESSADO não é aplicado de novo (Stripe re-entrega).
  const { data: existente, error: e0 } = await db.from('stripe_events').select('id,processado_em').eq('id', evt.id).maybeSingle();
  if (e0) return Response.json({ error: 'Falha ao registrar evento.' }, { status: 500 });
  if (existente && existente.processado_em) return Response.json({ received: true, duplicate: true });
  if (!existente) {
    const ins = await db.from('stripe_events').insert({ id: evt.id, tipo: evt.type, criado_stripe: iso(evt.created) });
    // corrida com outra entrega simultânea: a outra processa
    if (ins.error && !/duplicate key/i.test(ins.error.message)) return Response.json({ error: 'Falha ao registrar evento.' }, { status: 500 });
  }

  try {
    const obj = evt.data && evt.data.object;
    if (evt.type === 'checkout.session.completed' && obj && obj.client_reference_id && obj.subscription) {
      const s = await stripeGet(`subscriptions/${encodeURIComponent(obj.subscription)}`);
      const priceId = s.items?.data?.[0]?.price?.id;
      exigeOk(
        await db.from('subscriptions').upsert(
          {
            user_id: obj.client_reference_id,
            plan: planoDoPrice(priceId),
            status: s.status || 'active',
            stripe_customer_id: obj.customer || null,
            stripe_subscription_id: obj.subscription,
            current_period_end: iso(s.current_period_end),
            ultimo_evento_em: iso(evt.created),
            updated_at: new Date().toISOString(),
          },
          { onConflict: 'user_id' },
        ),
        'upsert subscriptions',
      );
    } else if ((evt.type === 'customer.subscription.updated' || evt.type === 'customer.subscription.deleted') && obj && obj.id) {
      const { data: atual } = await db.from('subscriptions').select('ultimo_evento_em').eq('stripe_subscription_id', obj.id).maybeSingle();
      if (atual && eventoForaDeOrdem(evt.created, atual.ultimo_evento_em)) {
        await db.from('stripe_events').update({ processado_em: new Date().toISOString(), erro: 'ignorado: fora de ordem' }).eq('id', evt.id);
        return Response.json({ received: true, ignored: 'out_of_order' });
      }
      const cancelado = evt.type.endsWith('deleted');
      const priceId = obj.items?.data?.[0]?.price?.id;
      exigeOk(
        await db
          .from('subscriptions')
          .update({
            plan: cancelado ? 'free' : planoDoPrice(priceId),
            status: cancelado ? 'canceled' : obj.status,
            current_period_end: iso(obj.current_period_end),
            ultimo_evento_em: iso(evt.created),
            updated_at: new Date().toISOString(),
          })
          .eq('stripe_subscription_id', obj.id),
        'update subscriptions',
      );
    }
    await db.from('stripe_events').update({ processado_em: new Date().toISOString(), erro: null }).eq('id', evt.id);
  } catch (e) {
    console.error('[stripe-webhook]', evt.type, e && e.message);
    await db.from('stripe_events').update({ erro: String(e && e.message).slice(0, 300) }).eq('id', evt.id);
    return Response.json({ error: 'Falha ao processar evento.' }, { status: 500 });
  }

  return Response.json({ received: true });
}
