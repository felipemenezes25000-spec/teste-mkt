import { describe, it, expect } from 'vitest';
import { verificarAssinatura, assinarParaTeste, planoDoPrice, eventoForaDeOrdem, TOLERANCIA_S } from './stripeWebhook.js';

const SEG = 'whsec_teste';
const body = JSON.stringify({ id: 'evt_1', type: 'customer.subscription.updated' });

describe('webhook Stripe — assinatura', () => {
  it('aceita assinatura válida', () => {
    expect(verificarAssinatura(body, assinarParaTeste(body, SEG), SEG)).toBe(true);
  });
  it('rejeita payload adulterado, segredo errado e header malformado', () => {
    const h = assinarParaTeste(body, SEG);
    expect(verificarAssinatura(body + ' ', h, SEG)).toBe(false);
    expect(verificarAssinatura(body, h, 'whsec_outro')).toBe(false);
    expect(verificarAssinatura(body, 'lixo', SEG)).toBe(false);
    expect(verificarAssinatura(body, '', SEG)).toBe(false);
    expect(verificarAssinatura(body, 't=abc,v1=00', SEG)).toBe(false);
  });
  it('rejeita replay fora da tolerância', () => {
    const velho = Math.floor(Date.now() / 1000) - TOLERANCIA_S - 10;
    expect(verificarAssinatura(body, assinarParaTeste(body, SEG, velho), SEG)).toBe(false);
  });
  it('aceita qualquer v1 válido (rotação de segredo)', () => {
    const t = Math.floor(Date.now() / 1000);
    const bom = assinarParaTeste(body, SEG, t).split('v1=')[1];
    expect(verificarAssinatura(body, `t=${t},v1=${'0'.repeat(64)},v1=${bom}`, SEG)).toBe(true);
  });
});

describe('webhook Stripe — regras', () => {
  it('mapeia price → plano sem confiar em valor desconhecido', () => {
    const env = { STRIPE_PRICE_PRO: 'price_pro', STRIPE_PRICE_PREMIUM: 'price_prem' };
    expect(planoDoPrice('price_pro', env)).toBe('pro');
    expect(planoDoPrice('price_prem', env)).toBe('premium');
    expect(planoDoPrice('price_hack', env)).toBe('free');
    expect(planoDoPrice(undefined, env)).toBe('free');
  });
  it('detecta evento fora de ordem', () => {
    expect(eventoForaDeOrdem(1000, new Date(2000 * 1000).toISOString())).toBe(true);
    expect(eventoForaDeOrdem(3000, new Date(2000 * 1000).toISOString())).toBe(false);
    expect(eventoForaDeOrdem(3000, null)).toBe(false);
  });
});
