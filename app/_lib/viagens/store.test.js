import { describe, it, expect } from 'vitest';
import {
  estadoVazio, novaViagem, adicionarViagem, adicionarItem, reordenarDia, itensDoDia, adicionarReserva, mudarStatusReserva,
  adicionarDespesa, adicionarDocumento, alertasDocumentos, prontidao, carregar, salvar, migrar, CHAVE,
} from './store.js';

const memStorage = () => { const m = new Map(); return { getItem: (k) => (m.has(k) ? m.get(k) : null), setItem: (k, v) => m.set(k, String(v)) }; };
const base = () => novaViagem({ titulo: 'Japão 14 dias', destinoCode: 'JP', destinoNome: 'Japão', inicio: '2026-11-01', fim: '2026-11-14', pessoas: 2, moeda: 'BRL', orcamento: 18000, timeZone: 'Asia/Tokyo' });

describe('viagens/store', () => {
  it('cria viagem com dias e valida entrada', () => {
    const v = base();
    expect(v.dias).toHaveLength(14);
    expect(v.dias[0]).toBe('2026-11-01');
    expect(() => novaViagem({ titulo: 'x', destinoCode: 'JP', inicio: '2026-11-10', fim: '2026-11-01' })).toThrow(/volta/);
    expect(() => novaViagem({ titulo: '', destinoCode: 'JP', inicio: '2026-11-01', fim: '2026-11-02' })).toThrow();
    expect(() => novaViagem({ titulo: 'x', destinoCode: 'JP', inicio: '2026-01-01', fim: '2026-12-31' })).toThrow(/120/);
  });

  it('itinerário: adiciona, rejeita dia fora da viagem e reordena', () => {
    const v = base();
    let s = adicionarViagem(estadoVazio(), v);
    s = adicionarItem(s, v.id, { dia: '2026-11-02', titulo: 'Fushimi Inari', lat: 34.96, lng: 135.77 });
    s = adicionarItem(s, v.id, { dia: '2026-11-02', titulo: 'Kiyomizu', lat: 34.99, lng: 135.78 });
    expect(() => adicionarItem(s, v.id, { dia: '2027-01-01', titulo: 'x' })).toThrow(/fora/);
    const ids = itensDoDia(s.viagens[0], '2026-11-02').map((i) => i.id);
    s = reordenarDia(s, v.id, '2026-11-02', [...ids].reverse());
    expect(itensDoDia(s.viagens[0], '2026-11-02').map((i) => i.titulo)).toEqual(['Kiyomizu', 'Fushimi Inari']);
  });

  it('reserva importada fica "informada por você", nunca verificada', () => {
    const v = base();
    let s = adicionarViagem(estadoVazio(), v);
    s = adicionarReserva(s, v.id, { tipo: 'LODGING', provider: 'Booking.com', localizador: 'ABC123', confirmada: true });
    const r = s.viagens[0].reservas[0];
    expect(r.status).toBe('CONFIRMED');
    expect(r.confirmedBy).toBe('import_manual');
    s = mudarStatusReserva(s, v.id, r.id, 'CANCELLATION_PENDING');
    expect(s.viagens[0].reservas[0].status).toBe('CANCELLATION_PENDING');
    expect(() => mudarStatusReserva(s, v.id, r.id, 'DRAFT')).toThrow(/proibida/);
  });

  it('despesas validam valor e moeda', () => {
    const v = base();
    let s = adicionarViagem(estadoVazio(), v);
    expect(() => adicionarDespesa(s, v.id, { valor: 0 })).toThrow();
    s = adicionarDespesa(s, v.id, { valor: 1200, moeda: 'JPY', categoria: 'ALIMENTACAO' });
    s = adicionarDespesa(s, v.id, { valor: 50, moeda: 'xx', categoria: 'INEXISTENTE' });
    expect(s.viagens[0].despesas[0].moeda).toBe('JPY');
    expect(s.viagens[0].despesas[1]).toMatchObject({ moeda: 'BRL', categoria: 'OUTROS' });
  });

  it('alertas de documento: regra dos 6 meses e seguro ausente', () => {
    const v = base();
    let s = adicionarViagem(estadoVazio(), v);
    s = adicionarDocumento(s, v.id, { tipo: 'PASSAPORTE', titulo: 'Passaporte', validade: '2027-02-01' });
    const al = alertasDocumentos(s.viagens[0], '2026-10-09');
    expect(al.some((a) => a.sev === 'ATENCAO' && /6 meses/.test(a.txt))).toBe(true);
    expect(al.some((a) => /seguro/i.test(a.txt))).toBe(true);
    expect(alertasDocumentos({ ...s.viagens[0], documentos: [{ tipo: 'PASSAPORTE', titulo: 'P', validade: '2020-01-01' }] }, '2026-10-09')[0].sev).toBe('CRITICO');
  });

  it('prontidão é calculada pelo que existe', () => {
    const v = base();
    expect(prontidao(v).nota).toBe(10); // só orçamento
    expect(prontidao(v).faltando.length).toBe(5);
  });

  it('persistência com versão e migração tolerante', () => {
    const st = memStorage();
    const s = adicionarViagem(estadoVazio(), base());
    expect(salvar(s, st)).toBe(true);
    expect(carregar(st).viagens).toHaveLength(1);
    st.setItem(CHAVE, '{lixo');
    expect(carregar(st).viagens).toEqual([]);
    expect(migrar({ viagens: [{ id: 'x', titulo: 'antiga' }] }).viagens[0].reservas).toEqual([]);
  });
});
