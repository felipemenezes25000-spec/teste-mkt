// @ts-check
// Reserva + máquina de estados (OMEGA V4 §30-32 / §76-F).
// Regra de ouro: CONFIRMED só pode vir de fonte confiável (webhook do provider,
// reconciliação ou importação verificada) — NUNCA de clique ou "return URL success".

/**
 * @typedef {'DRAFT'|'PRICE_CHECK_REQUIRED'|'AWAITING_PAYMENT'|'PENDING_PROVIDER'|'CONFIRMED'|'MODIFIED'|'CANCELLATION_PENDING'|'CANCELLED'|'REFUND_PENDING'|'REFUNDED'|'FAILED'|'UNKNOWN'} BookingStatus
 * @typedef {'VIEW_ONLY'|'DEEPLINK'|'EMBEDDED'|'NATIVE_TRANSACTION'} BookingMode
 * @typedef {'user'|'provider_webhook'|'reconciliation'|'import_verified'|'import_manual'|'system'} TransitionSource
 */

export const BOOKING_MODES = /** @type {const} */ (['VIEW_ONLY', 'DEEPLINK', 'EMBEDDED', 'NATIVE_TRANSACTION']);

/** @type {Record<BookingStatus, BookingStatus[]>} */
export const TRANSICOES = {
  DRAFT: ['PRICE_CHECK_REQUIRED', 'AWAITING_PAYMENT', 'PENDING_PROVIDER', 'FAILED', 'CANCELLED'],
  PRICE_CHECK_REQUIRED: ['AWAITING_PAYMENT', 'PENDING_PROVIDER', 'FAILED', 'CANCELLED'],
  AWAITING_PAYMENT: ['PENDING_PROVIDER', 'FAILED', 'CANCELLED', 'PRICE_CHECK_REQUIRED'],
  PENDING_PROVIDER: ['CONFIRMED', 'FAILED', 'CANCELLED', 'UNKNOWN'],
  CONFIRMED: ['MODIFIED', 'CANCELLATION_PENDING', 'CANCELLED'],
  MODIFIED: ['MODIFIED', 'CANCELLATION_PENDING', 'CANCELLED'],
  CANCELLATION_PENDING: ['CANCELLED', 'CONFIRMED', 'REFUND_PENDING'],
  CANCELLED: ['REFUND_PENDING'],
  REFUND_PENDING: ['REFUNDED', 'FAILED'],
  REFUNDED: [],
  FAILED: ['DRAFT'],
  UNKNOWN: ['CONFIRMED', 'FAILED', 'CANCELLED', 'PENDING_PROVIDER'],
};

/** Fontes que podem atestar confirmação/cancelamento definitivo. */
const FONTES_CONFIAVEIS = new Set(['provider_webhook', 'reconciliation', 'import_verified']);

/**
 * Estados que exigem fonte confiável para serem atingidos. Uma reserva importada
 * manualmente (voucher digitado pelo usuário) fica como CONFIRMED somente com
 * `verifiedBy: 'user'` explícito no registro, e a UI mostra "informado por você".
 */
const EXIGEM_FONTE = new Set(['CONFIRMED', 'REFUNDED']);

/**
 * @param {BookingStatus} de @param {BookingStatus} para
 */
export function transicaoPermitida(de, para) {
  return (TRANSICOES[de] || []).includes(para);
}

/**
 * Aplica uma transição validando regra de estado e fonte. Retorna NOVO registro
 * (imutável) com histórico. Lança erro se for proibida.
 * @param {{ status: BookingStatus, history?: Array<{from:string,to:string,at:string,source:string,eventId?:string}>, [k:string]: any }} reserva
 * @param {BookingStatus} para
 * @param {{ source: TransitionSource, at?: string, eventId?: string }} ctx
 */
export function transicionar(reserva, para, ctx) {
  if (!ctx || !ctx.source) throw new Error('transição exige source');
  const de = reserva.status;
  // idempotência: o mesmo eventId aplicado duas vezes não duplica nada
  if (ctx.eventId && (reserva.history || []).some((h) => h.eventId === ctx.eventId)) return reserva;
  if (!transicaoPermitida(de, para)) throw new Error(`Transição proibida: ${de} → ${para}`);
  if (EXIGEM_FONTE.has(para) && !FONTES_CONFIAVEIS.has(ctx.source) && ctx.source !== 'import_manual') {
    throw new Error(`${para} exige fonte confiável (webhook/reconciliação/importação), não "${ctx.source}"`);
  }
  const at = ctx.at || new Date().toISOString();
  return {
    ...reserva,
    status: para,
    ...(para === 'CONFIRMED' ? { confirmedAt: at, confirmedBy: ctx.source } : {}),
    history: [...(reserva.history || []), { from: de, to: para, at, source: ctx.source, ...(ctx.eventId ? { eventId: ctx.eventId } : {}) }],
  };
}

/**
 * Explica, para a UI, o que o status significa e quem responde pelo suporte.
 * @param {{ status: BookingStatus, mode?: BookingMode, provider?: string, confirmedBy?: string }} r
 */
export function explicarStatus(r) {
  const prov = r.provider || 'o fornecedor';
  const base = {
    DRAFT: 'Rascunho — nada foi reservado ainda.',
    PRICE_CHECK_REQUIRED: 'O preço precisa ser revalidado antes de seguir.',
    AWAITING_PAYMENT: 'Aguardando pagamento.',
    PENDING_PROVIDER: `Aguardando confirmação de ${prov}.`,
    CONFIRMED: r.confirmedBy === 'import_manual' ? 'Confirmada — informado por você (não verificado com o fornecedor).' : `Confirmada por ${prov}.`,
    MODIFIED: 'Reserva alterada.',
    CANCELLATION_PENDING: 'Cancelamento em andamento.',
    CANCELLED: 'Cancelada.',
    REFUND_PENDING: 'Reembolso pendente.',
    REFUNDED: 'Reembolsada.',
    FAILED: 'Falhou — nada foi cobrado por nós.',
    UNKNOWN: 'Status desconhecido — confira com o fornecedor.',
  }[r.status] || 'Status desconhecido.';
  const suporte = r.mode === 'NATIVE_TRANSACTION'
    ? 'Suporte: Mundo Sem Fim.'
    : `Pagamento, alteração e reembolso são responsabilidade de ${prov}.`;
  return { texto: base, suporte };
}
