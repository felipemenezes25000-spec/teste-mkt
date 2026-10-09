// Sincronização das viagens locais com a conta (Supabase) — OMEGA V4 §31/§34.
// O app continua local-first; com login, a viagem é espelhada nas tabelas
// trips / itinerary_items / reservations / expenses / trip_documents (RLS por papel,
// testado em scripts/rls-test.mjs). Mapeamento PURO (testado) + execução fina.
import { money } from '../../_domain/money.js';

const minor = (valor, moeda) => {
  try { return money(Number(valor) || 0, moeda).amountMinor; } catch { return null; }
};
const isoOuNulo = (s) => (s && /^\d{4}-\d{2}-\d{2}/.test(s) ? s : null);
const localOuNulo = (s) => (s && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/.test(s) ? s.slice(0, 16) : null);

/** Viagem local → linhas das tabelas (sem trip_id nos filhos; preenchido após o upsert). */
export function paraLinhas(v, userId) {
  return {
    trip: {
      local_id: v.id, user_id: userId, titulo: v.titulo, moeda_base: v.moeda, orcamento: v.orcamento || 0,
      orcamento_minor: v.orcamento ? minor(v.orcamento, v.moeda) : null, data_inicio: v.inicio, data_fim: v.fim,
      origem: v.origem || null, estado: v.estado || 'PLANNING', passaporte: 'BR',
    },
    itens: v.itens.map((i, k) => ({
      titulo: i.titulo, place_id: i.placeId, dia: i.dia, fixed_time: !!i.fixoInicio,
      local_start: i.fixoInicio ? `${i.dia}T${i.fixoInicio}` : null, time_zone: v.timeZone || null,
      lat: i.lat, lng: i.lng, ordem: k, notas: i.notas || null,
      estimated_cost_minor: i.custoEstimado ? minor(i.custoEstimado, 'USD') : null, currency: i.custoEstimado ? 'USD' : null,
    })),
    reservas: v.reservas.map((r) => ({
      tipo: r.tipo, provider: r.provider, provider_booking_id: null, modo: r.modo || 'DEEPLINK', status: r.status,
      // do cliente, confirmação SEMPRE como informada pelo usuário (o banco recusa as verificadas)
      confirmed_by: r.status === 'CONFIRMED' ? 'import_manual' : null, confirmed_at: r.confirmedAt || null,
      preco_minor: r.preco ? minor(r.preco, r.moeda) : null, currency: r.preco ? r.moeda : null,
      local_start: localOuNulo(r.inicioLocal), local_end: localOuNulo(r.fimLocal), time_zone: v.timeZone || null,
      cancelamento_ate: isoOuNulo(r.cancelamentoAte), politica_cancelamento: r.politica || null, localizador: r.localizador || null,
      historico: r.history || [],
    })),
    despesas: v.despesas.map((d) => ({
      valor_minor: minor(d.valor, d.moeda), currency: d.moeda, fx_rate: d.taxa || null, fx_fonte: d.taxaFonte || null,
      categoria: d.categoria, descricao: d.descricao || null, gasto_em: isoOuNulo(d.data) || v.inicio,
    })),
    documentos: v.documentos.map((d) => ({ owner_id: userId, tipo: d.tipo, titulo: d.titulo, validade: isoOuNulo(d.validade), compartilhado: false })),
  };
}

/**
 * Espelha a viagem na conta. Estratégia simples e idempotente: upsert da viagem por
 * local_id e substituição dos filhos. Retorna { ok, erro? }.
 */
export async function sincronizarViagem(supabase, v, userId) {
  if (!supabase || !userId) return { ok: false, erro: 'Entre na sua conta para sincronizar.' };
  const L = paraLinhas(v, userId);
  const { data: trip, error: e1 } = await supabase.from('trips').upsert(L.trip, { onConflict: 'local_id' }).select('id').single();
  if (e1 || !trip) return { ok: false, erro: e1 ? e1.message : 'falha ao salvar a viagem' };
  const tid = trip.id;
  for (const [tabela, linhas] of [['itinerary_items', L.itens], ['reservations', L.reservas], ['expenses', L.despesas], ['trip_documents', L.documentos]]) {
    const del = await supabase.from(tabela).delete().eq('trip_id', tid);
    if (del.error) return { ok: false, erro: `${tabela}: ${del.error.message}` };
    if (linhas.length) {
      const ins = await supabase.from(tabela).insert(linhas.map((x) => ({ ...x, trip_id: tid })));
      if (ins.error) return { ok: false, erro: `${tabela}: ${ins.error.message}` };
    }
  }
  return { ok: true, tripId: tid, em: new Date().toISOString() };
}
