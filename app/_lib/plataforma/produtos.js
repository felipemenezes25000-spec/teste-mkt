// Produtos PRÓPRIOS vendidos no checkout nativo (Stripe) e regras de repasse.
// Reserva de viagem (voo, hotel, passeio) NÃO entra aqui: exige licença de
// agência/IATA e continua com parceiros (saída rastreada em /api/out).

/** Fatia da plataforma nas vendas de criadores e consultores (marketplace). */
export const TAXA_PLATAFORMA = 0.2;

export const PRODUTOS = {
  trip_pass: {
    id: 'trip_pass',
    nome: 'Trip Pass',
    descricao: 'Tudo do Premium por 30 dias, pagamento único — sem assinatura.',
    precoMinor: 4900,
    moeda: 'BRL',
    dias: 30,
    plano: 'premium',
  },
};

/** Taxa da plataforma sobre uma venda (centavos, arredondada). */
export function taxaPlataforma(valorMinor) {
  const v = Math.max(0, Math.round(Number(valorMinor) || 0));
  return Math.round(v * TAXA_PLATAFORMA);
}

/** Quanto vai para o criador/consultor depois da taxa. */
export function repasse(valorMinor) {
  const v = Math.max(0, Math.round(Number(valorMinor) || 0));
  return v - taxaPlataforma(v);
}

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Valida o corpo do POST /api/stripe/checkout. O PREÇO nunca vem do cliente:
 * assinatura usa price do Stripe; produto usa tabela/banco no servidor.
 * @returns {{ tipo: 'assinatura', plano: string } | { tipo: 'produto', produto: string, id: string|null } | { erro: string }}
 */
export function pedidoCheckout(body) {
  if (!body || typeof body !== 'object') return { erro: 'Pedido inválido.' };
  if (body.plano) {
    return ['premium', 'pro'].includes(body.plano) ? { tipo: 'assinatura', plano: body.plano } : { erro: 'Plano inválido.' };
  }
  if (body.produto === 'trip_pass') return { tipo: 'produto', produto: 'trip_pass', id: null };
  if (body.produto === 'roteiro' || body.produto === 'consultoria') {
    return UUID.test(String(body.id || '')) ? { tipo: 'produto', produto: body.produto, id: String(body.id).toLowerCase() } : { erro: 'Identificador inválido.' };
  }
  return { erro: 'Produto inválido.' };
}

/** Formata centavos numa moeda para exibição. */
export function fmtMinor(valorMinor, moeda = 'BRL', locale = 'pt-BR') {
  try {
    return new Intl.NumberFormat(locale, { style: 'currency', currency: moeda }).format((Number(valorMinor) || 0) / 100);
  } catch {
    return `${moeda} ${((Number(valorMinor) || 0) / 100).toFixed(2)}`;
  }
}
