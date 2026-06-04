import { describe, it, expect } from 'vitest';
import { withAffiliate, temAfiliado, EXIBICAO, PARCEIROS_AFILIADO } from './afiliados.js';

const IDS = { booking: 'aff-bk', viator: 'aff-vt', travelpayouts: 'mkr-123', wise: 'ref-9' };

describe('withAffiliate', () => {
  it('injeta o parâmetro certo por parceiro quando há env', () => {
    expect(withAffiliate('https://www.booking.com/searchresults.html?ss=Lisboa', 'booking', IDS))
      .toBe('https://www.booking.com/searchresults.html?ss=Lisboa&aid=aff-bk');
    expect(withAffiliate('https://www.viator.com/searchResults/all?text=Cusco', 'viator', IDS))
      .toContain('pid=aff-vt');
    expect(withAffiliate('https://kiwi.com/x', 'travelpayouts', IDS)).toContain('marker=mkr-123');
  });

  it('no-op quando a env do parceiro não existe', () => {
    const url = 'https://www.booking.com/x';
    expect(withAffiliate(url, 'booking', {})).toBe(url);
    expect(withAffiliate(url, 'klook', IDS)).toBe(url); // sem klook no IDS
  });

  it('no-op para parceiros de EXIBIÇÃO (não pagam tráfego)', () => {
    const url = 'https://www.google.com/travel/flights?q=x';
    for (const p of EXIBICAO) expect(withAffiliate(url, p, IDS)).toBe(url);
  });

  it('no-op para parceiro desconhecido', () => {
    const url = 'https://x.com/y';
    expect(withAffiliate(url, 'inexistente', IDS)).toBe(url);
  });

  it('lida com URL que já tem query (acrescenta com &, não sobrescreve)', () => {
    const out = withAffiliate('https://www.viator.com/s?text=Lima&lang=pt', 'viator', IDS);
    expect(out).toContain('text=Lima');
    expect(out).toContain('lang=pt');
    expect(out).toContain('pid=aff-vt');
  });

  it('lida com URL relativa/sem protocolo (fallback manual)', () => {
    expect(withAffiliate('/go?to=booking', 'booking', IDS)).toBe('/go?to=booking&aid=aff-bk');
    expect(withAffiliate('/go', 'booking', IDS)).toBe('/go?aid=aff-bk');
  });

  it('não substitui um aid já existente de forma duplicada (usa searchParams.set)', () => {
    const out = withAffiliate('https://www.booking.com/x?aid=old', 'booking', IDS);
    expect(out).toContain('aid=aff-bk');
    expect(out).not.toContain('aid=old');
  });

  it('entradas inválidas não quebram', () => {
    expect(withAffiliate('', 'booking', IDS)).toBe('');
    expect(withAffiliate('https://x.com', '', IDS)).toBe('https://x.com');
    expect(withAffiliate(null, 'booking', IDS)).toBe(null);
  });
});

describe('temAfiliado', () => {
  it('true só quando o parceiro tem param e env', () => {
    expect(temAfiliado('booking', IDS)).toBe(true);
    expect(temAfiliado('klook', IDS)).toBe(false); // sem env
    expect(temAfiliado('google', IDS)).toBe(false); // exibição
    expect(temAfiliado('inexistente', IDS)).toBe(false);
  });
});

describe('metadados', () => {
  it('PARCEIROS_AFILIADO lista os monetizáveis (sem os de exibição)', () => {
    expect(PARCEIROS_AFILIADO).toContain('booking');
    expect(PARCEIROS_AFILIADO).toContain('viator');
    for (const p of EXIBICAO) expect(PARCEIROS_AFILIADO).not.toContain(p);
  });
});
