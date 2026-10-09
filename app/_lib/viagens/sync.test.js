import { describe, it, expect } from 'vitest';
import { paraLinhas, sincronizarViagem } from './sync.js';
import { novaViagem, adicionarViagem, estadoVazio, adicionarItem, adicionarReserva, adicionarDespesa, adicionarDocumento } from './store.js';

function viagemCompleta() {
  const v = novaViagem({ titulo: 'Japão', destinoCode: 'JP', destinoNome: 'Japão', inicio: '2026-11-01', fim: '2026-11-03', moeda: 'BRL', orcamento: 18000, timeZone: 'Asia/Tokyo' });
  let s = adicionarViagem(estadoVazio(), v);
  s = adicionarItem(s, v.id, { dia: '2026-11-01', titulo: 'Fushimi', lat: 34.96, lng: 135.77, custoEstimado: 0 });
  s = adicionarItem(s, v.id, { dia: '2026-11-01', titulo: 'Jantar', fixoInicio: '19:30' });
  s = adicionarReserva(s, v.id, { tipo: 'LODGING', provider: 'Booking.com', preco: 1234.5, moeda: 'BRL', confirmada: true, inicioLocal: '2026-11-01T15:00' });
  s = adicionarDespesa(s, v.id, { valor: 3200, moeda: 'JPY', categoria: 'ALIMENTACAO', taxa: 0.0317, taxaFonte: 'BCE', data: '2026-11-01' });
  s = adicionarDocumento(s, v.id, { tipo: 'PASSAPORTE', titulo: 'Passaporte', validade: '2030-01-01' });
  return s.viagens[0];
}

describe('viagens/sync — mapeamento para o schema', () => {
  it('converte dinheiro para unidades menores respeitando a moeda', () => {
    const L = paraLinhas(viagemCompleta(), 'user-1');
    expect(L.trip).toMatchObject({ local_id: expect.any(String), user_id: 'user-1', orcamento_minor: 1800000, moeda_base: 'BRL', data_inicio: '2026-11-01' });
    expect(L.reservas[0]).toMatchObject({ preco_minor: 123450, currency: 'BRL', status: 'CONFIRMED', confirmed_by: 'import_manual', local_start: '2026-11-01T15:00' });
    expect(L.despesas[0]).toMatchObject({ valor_minor: 3200, currency: 'JPY', fx_rate: 0.0317 });
  });
  it('itens: horário fixo vira local_start com fuso; ordem preservada', () => {
    const L = paraLinhas(viagemCompleta(), 'u');
    expect(L.itens.map((i) => i.titulo)).toEqual(['Fushimi', 'Jantar']);
    expect(L.itens[1]).toMatchObject({ fixed_time: true, local_start: '2026-11-01T19:30', time_zone: 'Asia/Tokyo' });
  });
  it('documentos não levam número nem imagem; ficam privados', () => {
    const L = paraLinhas(viagemCompleta(), 'u');
    expect(Object.keys(L.documentos[0]).sort()).toEqual(['compartilhado', 'owner_id', 'tipo', 'titulo', 'validade']);
    expect(L.documentos[0].compartilhado).toBe(false);
  });
  it('sem conta, não tenta sincronizar', async () => {
    expect((await sincronizarViagem(null, viagemCompleta(), null)).ok).toBe(false);
  });
  it('executa upsert + substituição dos filhos (cliente simulado)', async () => {
    const chamadas = [];
    const q = (tabela) => ({
      upsert: (row, o) => { chamadas.push(['upsert', tabela, o.onConflict]); return { select: () => ({ single: async () => ({ data: { id: 'uuid-1' }, error: null }) }) }; },
      delete: () => ({ eq: async (c, val) => { chamadas.push(['delete', tabela, val]); return { error: null }; } }),
      insert: async (linhas) => { chamadas.push(['insert', tabela, linhas.length, linhas[0].trip_id]); return { error: null }; },
    });
    const r = await sincronizarViagem({ from: q }, viagemCompleta(), 'u');
    expect(r.ok).toBe(true);
    expect(chamadas[0]).toEqual(['upsert', 'trips', 'local_id']);
    expect(chamadas).toContainEqual(['insert', 'itinerary_items', 2, 'uuid-1']);
    expect(chamadas).toContainEqual(['insert', 'reservations', 1, 'uuid-1']);
  });
});
