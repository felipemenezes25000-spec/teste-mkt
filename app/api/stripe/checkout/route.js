// Cria uma sessão de Checkout do Stripe (via REST, sem SDK). 503 se não configurado.
// Exige JWT do Supabase — o userId vem do token, nunca do body.
//   • { plano: 'premium'|'pro' }            → assinatura (price do Stripe)
//   • { produto: 'trip_pass' }              → pagamento único (tabela PRODUTOS)
//   • { produto: 'roteiro', id }            → roteiro pago de criador (preço do banco)
//   • { produto: 'consultoria', id }        → consultoria ACEITA pelo consultor (preço do banco)
// O preço NUNCA vem do cliente. Reserva de viagem não é vendida aqui (parceiros).
import { createClient } from '@supabase/supabase-js';
import { limitar } from '../../../_lib/rateLimit.js';
import { PRODUTOS, pedidoCheckout, taxaPlataforma } from '../../../_lib/plataforma/produtos.js';

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
  return { user: data.user, supa };
}

/** Item avulso: resolve nome/preço/vendedor NO SERVIDOR (RLS como o próprio usuário). */
async function itemDoProduto(pedido, { user, supa }) {
  if (pedido.produto === 'trip_pass') {
    const p = PRODUTOS.trip_pass;
    return { nome: p.nome, descricao: p.descricao, valorMinor: p.precoMinor, moeda: p.moeda, vendedorId: null, voltar: '/planos' };
  }
  if (pedido.produto === 'roteiro') {
    const { data } = await supa.from('creator_itineraries').select('id,titulo,preco_minor,moeda,autor_id,status,slug').eq('id', pedido.id).maybeSingle();
    if (!data || data.status !== 'publicado') return { erro: 'Roteiro indisponível.' };
    if (data.preco_minor <= 0) return { erro: 'Este roteiro é gratuito.' };
    if (data.autor_id === user.id) return { erro: 'Você é o autor deste roteiro.' };
    return { nome: `Roteiro: ${data.titulo}`, valorMinor: data.preco_minor, moeda: data.moeda, vendedorId: data.autor_id, voltar: `/marketplace/c/${data.slug}` };
  }
  const { data } = await supa.from('consult_requests').select('id,status,preco_minor,moeda,consultor_id,cliente_id').eq('id', pedido.id).maybeSingle();
  if (!data || data.cliente_id !== user.id) return { erro: 'Consultoria não encontrada.' };
  if (data.status !== 'aceita' || !data.preco_minor) return { erro: 'A consultoria ainda não foi aceita com preço pelo consultor.' };
  return { nome: 'Consultoria de viagem', valorMinor: data.preco_minor, moeda: data.moeda, vendedorId: data.consultor_id, voltar: '/marketplace?aba=consultores' };
}

export async function POST(req) {
  const bloqueio = limitar(req, 'checkout', { limite: 10 });
  if (bloqueio) return bloqueio;
  if (!SECRET) return erro('Pagamento ainda não configurado.', 503);

  const auth = await autenticar(req);
  if (!auth) return erro('Faça login para pagar.', 401);

  let body;
  try { body = await req.json(); } catch { return erro('JSON inválido.', 400); }
  const pedido = pedidoCheckout(body);
  if (pedido.erro) return erro(pedido.erro, 400);

  const base = SITE || '';
  const form = new URLSearchParams();
  form.set('client_reference_id', auth.user.id);
  if (auth.user.email) form.set('customer_email', auth.user.email);

  if (pedido.tipo === 'assinatura') {
    const price = PRICES[pedido.plano];
    if (!price) return erro('Plano sem price configurado.', 400);
    form.set('mode', 'subscription');
    form.set('line_items[0][price]', price);
    form.set('line_items[0][quantity]', '1');
    form.set('success_url', `${base}/conta?ok=1`);
    form.set('cancel_url', `${base}/planos`);
    form.set('allow_promotion_codes', 'true');
  } else {
    const item = await itemDoProduto(pedido, auth);
    if (item.erro) return erro(item.erro, 400);
    form.set('mode', 'payment');
    form.set('line_items[0][quantity]', '1');
    form.set('line_items[0][price_data][currency]', item.moeda.toLowerCase());
    form.set('line_items[0][price_data][unit_amount]', String(item.valorMinor));
    form.set('line_items[0][price_data][product_data][name]', item.nome);
    if (item.descricao) form.set('line_items[0][price_data][product_data][description]', item.descricao);
    form.set('success_url', `${base}/conta?compra=1`);
    form.set('cancel_url', `${base}${item.voltar}`);
    // metadados definidos pelo SERVIDOR; o webhook (assinado) grava a compra com eles
    form.set('metadata[produto]', pedido.produto);
    if (pedido.id) form.set('metadata[produto_id]', pedido.id);
    if (item.vendedorId) form.set('metadata[vendedor_id]', item.vendedorId);
    form.set('metadata[taxa_plataforma_minor]', String(item.vendedorId ? taxaPlataforma(item.valorMinor) : item.valorMinor));
  }

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
