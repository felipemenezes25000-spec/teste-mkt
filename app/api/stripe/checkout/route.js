// Cria uma sessão de Checkout do Stripe (via REST, sem SDK). 503 se não configurado.
// Defina STRIPE_SECRET_KEY, STRIPE_PRICE_PREMIUM e STRIPE_PRICE_PRO no servidor.
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const SECRET = process.env.STRIPE_SECRET_KEY;
const PRICES = { premium: process.env.STRIPE_PRICE_PREMIUM, pro: process.env.STRIPE_PRICE_PRO };
const SITE = process.env.NEXT_PUBLIC_SITE_URL || '';

export async function POST(req) {
  if (!SECRET) return Response.json({ error: 'Pagamento ainda não configurado.' }, { status: 503 });

  let body;
  try { body = await req.json(); } catch { return Response.json({ error: 'JSON inválido.' }, { status: 400 }); }

  const price = PRICES[body && body.plano];
  if (!price) return Response.json({ error: 'Plano inválido ou sem price configurado.' }, { status: 400 });

  const origin = req.headers.get('origin') || SITE || '';
  const form = new URLSearchParams();
  form.set('mode', 'subscription');
  form.set('line_items[0][price]', price);
  form.set('line_items[0][quantity]', '1');
  form.set('success_url', `${origin}/conta?ok=1`);
  form.set('cancel_url', `${origin}/planos`);
  form.set('allow_promotion_codes', 'true');
  if (body.userId) form.set('client_reference_id', String(body.userId));
  if (body.email) form.set('customer_email', String(body.email));

  try {
    const res = await fetch('https://api.stripe.com/v1/checkout/sessions', {
      method: 'POST',
      headers: { authorization: `Bearer ${SECRET}`, 'content-type': 'application/x-www-form-urlencoded' },
      body: form.toString(),
    });
    const data = await res.json();
    if (!res.ok) return Response.json({ error: (data.error && data.error.message) || 'Falha no Stripe.' }, { status: 502 });
    return Response.json({ url: data.url });
  } catch {
    return Response.json({ error: 'Falha ao falar com o Stripe.' }, { status: 502 });
  }
}
