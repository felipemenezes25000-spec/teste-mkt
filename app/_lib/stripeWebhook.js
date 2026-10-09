// Lógica pura do webhook do Stripe (testável sem rede). OMEGA V4 §44:
// assinatura falsa, webhook duplicado e fora de ordem.
import crypto from 'node:crypto';

export const TOLERANCIA_S = 300;

/**
 * Verifica "Stripe-Signature: t=…,v1=…,v1=…" (pode haver vários v1 durante a
 * rotação do segredo). Compara em tempo constante e rejeita timestamps velhos.
 */
export function verificarAssinatura(payload, header, segredo, agoraS = Date.now() / 1000) {
  if (!header || !segredo) return false;
  let t = null;
  const v1 = [];
  for (const parte of String(header).split(',')) {
    const i = parte.indexOf('=');
    if (i < 0) continue;
    const k = parte.slice(0, i).trim();
    const v = parte.slice(i + 1).trim();
    if (k === 't') t = v;
    else if (k === 'v1') v1.push(v);
  }
  if (!t || !/^\d+$/.test(t) || !v1.length) return false;
  if (Math.abs(agoraS - Number(t)) > TOLERANCIA_S) return false;
  const esperado = Buffer.from(crypto.createHmac('sha256', segredo).update(`${t}.${payload}`).digest('hex'));
  return v1.some((s) => {
    const b = Buffer.from(s);
    return b.length === esperado.length && crypto.timingSafeEqual(b, esperado);
  });
}

export function planoDoPrice(priceId, env = process.env) {
  if (!priceId) return 'free';
  if (priceId === env.STRIPE_PRICE_PRO) return 'pro';
  if (priceId === env.STRIPE_PRICE_PREMIUM) return 'premium';
  return 'free';
}

/** Evento mais antigo que o último aplicado à assinatura deve ser ignorado. */
export function eventoForaDeOrdem(eventoCreatedS, ultimoAplicadoIso) {
  if (!ultimoAplicadoIso || !eventoCreatedS) return false;
  return eventoCreatedS * 1000 < Date.parse(ultimoAplicadoIso);
}

/** Gera um header válido (usado nos testes e em scripts de QA local). */
export function assinarParaTeste(payload, segredo, t = Math.floor(Date.now() / 1000)) {
  const sig = crypto.createHmac('sha256', segredo).update(`${t}.${payload}`).digest('hex');
  return `t=${t},v1=${sig}`;
}
