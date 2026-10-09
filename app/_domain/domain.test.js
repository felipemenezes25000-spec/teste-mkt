import { describe, it, expect, beforeEach } from 'vitest';
import { money, fromMinor, toDecimal, add, sum, multiply, allocate, convert, format, casasDecimais, compare } from './money.js';
import { freshnessEfetiva, evidencia, evidenciaCatalogo, idadeLegivel, LIVE_JANELA_MS } from './evidence.js';
import { transicionar, transicaoPermitida, explicarStatus } from './booking.js';
import { localParaUTC, utcParaLocal, duracaoMinutos, diasEntre, offsetMinutos } from './time.js';
import { chamarProvider, _resetCircuitos } from './provider.js';

describe('money', () => {
  it('guarda em unidades menores sem float', () => {
    expect(money(0.1, 'USD').amountMinor + money(0.2, 'USD').amountMinor).toBe(30);
    expect(money('12,345', 'BRL').amountMinor).toBe(1235); // half-up
    expect(money(-2.5, 'USD').amountMinor).toBe(-250);
  });
  it('respeita moedas zero-decimal e três casas', () => {
    expect(casasDecimais('JPY')).toBe(0);
    expect(money(1234.6, 'JPY').amountMinor).toBe(1235);
    expect(money(1.2345, 'KWD').amountMinor).toBe(1235);
    expect(toDecimal(fromMinor(1235, 'KWD'))).toBe(1.235);
  });
  it('recusa somar moedas diferentes e valores inválidos', () => {
    expect(() => add(money(1, 'USD'), money(1, 'BRL'))).toThrow(/Moedas diferentes/);
    expect(() => money(NaN, 'USD')).toThrow();
    expect(() => money(1, 'usd')).toThrow(/Moeda inválida/);
    expect(() => fromMinor(1.5, 'USD')).toThrow();
  });
  it('soma, multiplica e reparte sem perder centavo', () => {
    expect(sum([money(1.11, 'USD'), money(2.22, 'USD')], 'USD').amountMinor).toBe(333);
    expect(sum([], 'EUR')).toEqual({ amountMinor: 0, currency: 'EUR' });
    expect(multiply(money(10, 'USD'), 1 / 3).amountMinor).toBe(333);
    const partes = allocate(money(100, 'USD'), 3);
    expect(partes.map((p) => p.amountMinor)).toEqual([3334, 3333, 3333]);
    expect(partes.reduce((s, p) => s + p.amountMinor, 0)).toBe(10000);
    expect(allocate(fromMinor(-10, 'USD'), 3).reduce((s, p) => s + p.amountMinor, 0)).toBe(-10);
  });
  it('converte com taxa, data, fonte e spread declarados', () => {
    const c = convert(money(100, 'USD'), 'BRL', { rate: 5.4321, observedAt: '2026-10-08', source: 'frankfurter/ECB' });
    expect(c.converted).toEqual({ amountMinor: 54321, currency: 'BRL' });
    expect(c.includesCardSpread).toBe(false);
    const s = convert(money(100, 'USD'), 'BRL', { rate: 5, observedAt: 'x', source: 'y', spreadPct: 4 });
    expect(s.converted.amountMinor).toBe(52000);
    expect(() => convert(money(1, 'USD'), 'BRL', { rate: 5 })).toThrow(/data e fonte/);
    expect(() => convert(money(1, 'USD'), 'JPY', { rate: 0, observedAt: 'x', source: 'y' })).toThrow();
    expect(convert(money(10, 'USD'), 'JPY', { rate: 149.567, observedAt: 'x', source: 'y' }).converted.amountMinor).toBe(1496);
  });
  it('formata e compara', () => {
    expect(format(money(1234.5, 'BRL'))).toMatch(/R\$\s?1\.234,50/);
    expect(format(money(1500, 'JPY'), 'pt-BR')).not.toMatch(/,\d\d$/);
    expect(compare(money(1, 'USD'), money(2, 'USD'))).toBe(-1);
  });
});

describe('evidence / freshness', () => {
  const agora = new Date('2026-10-09T12:00:00Z');
  it('LIVE envelhece para RECENT e depois HISTORICAL', () => {
    const recente = evidencia({ provider: 'x', freshness: 'LIVE', fetchedAt: new Date(agora.getTime() - 60000).toISOString() });
    expect(freshnessEfetiva(recente, agora)).toBe('LIVE');
    const velho = { ...recente, fetchedAt: new Date(agora.getTime() - LIVE_JANELA_MS - 1).toISOString() };
    expect(freshnessEfetiva(velho, agora)).toBe('RECENT');
    expect(freshnessEfetiva({ ...velho, validUntil: '2026-10-09T11:00:00Z' }, agora)).toBe('HISTORICAL');
  });
  it('estimativas e catálogo nunca viram ao vivo', () => {
    expect(freshnessEfetiva(evidencia({ provider: 'm', freshness: 'ESTIMATE' }), agora)).toBe('ESTIMATE');
    expect(freshnessEfetiva(evidenciaCatalogo('precos'), agora)).toBe('HISTORICAL');
    expect(freshnessEfetiva(/** @type any */ ({ provider: 'x', freshness: 'MAGIC' }), agora)).toBe('UNVERIFIED');
    expect(() => evidencia(/** @type any */ ({ freshness: 'LIVE' }))).toThrow();
  });
  it('idade legível', () => {
    expect(idadeLegivel('2026-10-09T09:00:00Z', agora)).toBe('há 3 h');
    expect(idadeLegivel('2026-06-06T00:00:00Z', agora)).toBe('há 4 meses');
    expect(idadeLegivel('lixo', agora)).toBe('data desconhecida');
  });
});

describe('booking state machine', () => {
  const base = { id: 'b1', status: 'DRAFT', provider: 'Viator', history: [] };
  it('não confirma por clique do usuário', () => {
    const p = transicionar(base, 'PENDING_PROVIDER', { source: 'user' });
    expect(() => transicionar(p, 'CONFIRMED', { source: 'user' })).toThrow(/fonte confiável/);
    const ok = transicionar(p, 'CONFIRMED', { source: 'provider_webhook', eventId: 'evt_1' });
    expect(ok.status).toBe('CONFIRMED');
    expect(ok.confirmedBy).toBe('provider_webhook');
  });
  it('é idempotente por eventId e bloqueia transição inválida', () => {
    const p = transicionar(base, 'PENDING_PROVIDER', { source: 'user' });
    const c1 = transicionar(p, 'CONFIRMED', { source: 'provider_webhook', eventId: 'evt_1' });
    const c2 = transicionar(c1, 'CONFIRMED', { source: 'provider_webhook', eventId: 'evt_1' });
    expect(c2).toBe(c1);
    expect(() => transicionar(base, 'REFUNDED', { source: 'reconciliation' })).toThrow(/proibida/);
    expect(transicaoPermitida('REFUNDED', 'CONFIRMED')).toBe(false);
  });
  it('importação manual fica rotulada como informada pelo usuário', () => {
    const p = transicionar(base, 'PENDING_PROVIDER', { source: 'import_manual' });
    const c = transicionar(p, 'CONFIRMED', { source: 'import_manual' });
    expect(explicarStatus(c).texto).toMatch(/informado por você/);
    expect(explicarStatus({ status: 'CONFIRMED', mode: 'DEEPLINK', provider: 'Booking.com' }).suporte).toMatch(/Booking.com/);
  });
});

describe('time / timezone', () => {
  it('converte local→UTC considerando o fuso', () => {
    expect(localParaUTC('2026-07-10T09:00', 'Asia/Tokyo')).toBe('2026-07-10T00:00:00.000Z');
    expect(localParaUTC('2026-07-10T09:00', 'America/Sao_Paulo')).toBe('2026-07-10T12:00:00.000Z');
    expect(utcParaLocal('2026-07-10T00:00:00.000Z', 'Asia/Tokyo')).toBe('2026-07-10T09:00');
  });
  it('lida com horário de verão (gap e offset)', () => {
    // Europa/Lisboa: 29/03/2026 01:00 → 02:00 (01:30 não existe)
    const r = localParaUTC('2026-03-29T01:30', 'Europe/Lisbon');
    expect(utcParaLocal(r, 'Europe/Lisbon') >= '2026-03-29T02:00').toBe(true);
    expect(offsetMinutos('Europe/Lisbon', new Date('2026-07-01T00:00:00Z'))).toBe(60);
    expect(offsetMinutos('Europe/Lisbon', new Date('2026-01-01T00:00:00Z'))).toBe(0);
  });
  it('mede duração entre fusos e lista dias', () => {
    // GRU 22:00 (UTC-3) → NRT 05:30 dois dias depois (UTC+9) = 19h30 de viagem
    expect(duracaoMinutos({ local: '2026-11-01T22:00', tz: 'America/Sao_Paulo' }, { local: '2026-11-03T05:30', tz: 'Asia/Tokyo' })).toBe(19 * 60 + 30);
    expect(diasEntre('2026-02-27', '2026-03-02')).toEqual(['2026-02-27', '2026-02-28', '2026-03-01', '2026-03-02']);
    expect(() => localParaUTC('2026-07-10T09:00', 'Mars/Olympus')).toThrow(/Fuso inválido/);
  });
});

describe('provider contract', () => {
  beforeEach(() => _resetCircuitos());
  it('sem chave/contrato não chama a rede e devolve UNAVAILABLE', async () => {
    let chamou = false;
    const r = await chamarProvider({ nome: 'duffel', estado: 'KEY_REQUIRED' }, async () => { chamou = true; return 1; });
    expect(chamou).toBe(false);
    expect(r.status).toBe('UNAVAILABLE');
    expect(r.errors[0].code).toBe('PROVIDER_KEY_REQUIRED');
  });
  it('timeout vira UNAVAILABLE e abre o circuito após falhas', async () => {
    const lento = (signal) => new Promise((_, rej) => signal.addEventListener('abort', () => rej(new Error('abort'))));
    for (let i = 0; i < 3; i++) {
      const r = await chamarProvider({ nome: 'lento', timeoutMs: 20 }, lento);
      expect(r.status).toBe('UNAVAILABLE');
    }
    const r = await chamarProvider({ nome: 'lento', timeoutMs: 20 }, async () => 'ok');
    expect(r.errors[0].code).toBe('CIRCUIT_OPEN');
  });
  it('sucesso traz evidência com validade', async () => {
    const r = await chamarProvider({ nome: 'fx', validadeMs: 3600000, freshness: 'LIVE' }, async () => ({ BRL: 5.4 }));
    expect(r.status).toBe('LIVE');
    expect(r.evidence[0].validUntil).toBeTruthy();
    expect(r.data).toEqual({ BRL: 5.4 });
  });
  it('retry só quando idempotente', async () => {
    let n = 0;
    const falhaUmaVez = async () => { n += 1; if (n === 1) throw new Error('x'); return 'ok'; };
    const r1 = await chamarProvider({ nome: 'nao-idem' }, falhaUmaVez);
    expect(r1.status).toBe('UNAVAILABLE');
    n = 0;
    const r2 = await chamarProvider({ nome: 'idem', idempotente: true }, falhaUmaVez);
    expect(r2.status).toBe('LIVE');
  });
});
