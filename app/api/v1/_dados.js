// Montagem dos objetos públicos da API v1 (nomes de campo em inglês, estáveis).
import { DESTINOS, destinoPorCode } from '../../_lib/destinos.js';
import { custoPorDia, custoEstadia } from '../../_lib/custos.js';
import { vistoDe } from '../../_engine/data.js';

export function resumoDestino(d) {
  return {
    code: d.code, name_pt: d.nome, slug: d.slug, region: d.regiao, currency: d.moeda,
    cost_per_day_usd: d.custoDia, best_months: d.melhoresMeses || [],
    capital_or_main_city: d.cidadePrincipal || null,
    coordinates: d.coords ? { lng: d.coords[0], lat: d.coords[1] } : null,
    url: `/destino/${d.slug}`,
  };
}

export function detalheDestino(d) {
  const niveis = custoPorDia(d.custoDia);
  return {
    ...resumoDestino(d),
    season_notes_pt: d.estacao || null,
    cities: d.cidades || [],
    foods_pt: d.comidas || [],
    main_airport_iata: d.iata || null,
    cost_tiers_usd_per_day: Object.fromEntries(Object.entries(niveis).map(([k, v]) => [k, { total: v.total, breakdown: Object.fromEntries(v.categorias.map((c) => [c.id, c.valor])) }])),
    visa_brazilian_passport: vistoPublico(d.code, 'BR'),
  };
}

export function vistoPublico(code, passaporte) {
  const v = vistoDe(code, passaporte);
  return {
    passport: passaporte, destination: code, type: v.tipo, days: v.dias || null, note_pt: v.nota || null,
    verified: v.tipo !== 'consultar',
    warning: 'Regra de referência: confirme no consulado/embaixada antes de comprar.',
  };
}

export function listar({ regiao, maxCusto, mes, limite = 50, offset = 0 }) {
  let r = DESTINOS;
  if (regiao) r = r.filter((d) => d.regiao.toLowerCase() === regiao.toLowerCase());
  if (maxCusto) r = r.filter((d) => d.custoDia <= maxCusto);
  if (mes) r = r.filter((d) => (d.melhoresMeses || []).includes(mes));
  return { total: r.length, itens: r.slice(offset, offset + limite).map(resumoDestino) };
}

export function custoViagem(code, { dias, estilo, pessoas }) {
  const d = destinoPorCode(code);
  if (!d) return null;
  const e = custoEstadia(d.custoDia, dias, estilo);
  return {
    destination: d.code, days: e.dias, style: estilo, travelers: pessoas,
    per_day_per_person_usd: e.porDia, total_per_person_usd: e.total, total_group_usd: e.total * pessoas,
    excludes: ['international_flights', 'travel_insurance', 'card_fx_spread'],
  };
}

export { destinoPorCode };
