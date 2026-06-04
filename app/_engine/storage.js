import { STORAGE_KEY, PAISES_REF, PASSAPORTES, AI_PROVIDERS, SEED_FX, vistoDe, refDe } from './data.js';
import { uid, num, toISO } from './utils.js';

export function novoTrechoDeRef(ref, passaporte) {
  const v = vistoDe(ref.code, passaporte);
  return {
    id: uid(), code: ref.code, nome: ref.nome, regiao: ref.regiao,
    dias: 30, custoDia: ref.custoDia, moeda: ref.moeda || 'USD',
    economiaDia: 0, economiaLabel: '', transporte: 0, transporteNota: '',
    melhoresMeses: [...ref.melhoresMeses], estacaoLabel: ref.estacao,
    vistoTipo: v.tipo, vistoDias: v.dias, vistoNota: v.nota,
    vistoExtensao: false, vistoExtensaoNota: '', vistoComprovanteSaida: true,
    iata: ref.iata || '', cidadePrincipal: ref.cidadePrincipal || ref.nome,
    coords: ref.coords ? [...ref.coords] : null, fotoQuery: ref.fotoQuery || ref.nome,
    cidades: ref.cidades ? [...ref.cidades] : [], comidas: ref.comidas ? [...ref.comidas] : [],
    cidadesCusto: {},
    oportunidades: null,
  };
}

export function planoExemplo() {
  const pais = (code, patch) => ({ ...novoTrechoDeRef(PAISES_REF.find(p => p.code === code), 'BR'), ...patch });
  return {
    version: 3,
    settings: {
      moedaBase: 'USD',
      orcamento: 6500,
      dataInicio: '2026-07-01',
      passaporte: 'BR',
      origemCidade: 'São Paulo',
      origemIata: 'GRU',
      fx: { ...SEED_FX, rates: { ...SEED_FX.rates } },
      ai: { provider: 'openai', apiKey: '', baseUrl: AI_PROVIDERS.openai.baseUrl, model: AI_PROVIDERS.openai.model },
    },
    legs: [
      pais('TH', { dias: 30, moeda: 'USD', transporte: 700, transporteNota: 'Voo Brasil → Bangkok' }), // chega em julho -> monção
      pais('VN', { dias: 35, moeda: 'USD', transporte: 70,  transporteNota: 'Voo regional' }),
      pais('ID', { dias: 45, moeda: 'USD', transporte: 130, transporteNota: 'Voo p/ Bali' }),           // 45d > visto 30 -> fura
      pais('NP', { dias: 25, moeda: 'USD', transporte: 180, transporteNota: 'Voo p/ Katmandu' }),
      pais('GE', { dias: 30, moeda: 'USD', transporte: 240, transporteNota: 'Voo p/ Tbilisi' }),
    ],
  };
}

// Garante que um plano importado/antigo tenha todos os campos esperados.
export function normalizarPlano(p) {
  const base = planoExemplo();
  const settings = { ...base.settings, ...(p.settings || {}) };
  settings.ai = { ...base.settings.ai, ...((p.settings && p.settings.ai) || {}) };
  settings.fx = (p.settings && p.settings.fx && p.settings.fx.rates) ? p.settings.fx : base.settings.fx;
  if (!PASSAPORTES[settings.passaporte]) settings.passaporte = 'BR';
  if (!settings.moedaBase) settings.moedaBase = 'USD';
  const legs = Array.isArray(p.legs) ? p.legs.map(l => {
    const ref = l.code ? refDe(l.code) : null; // backfill de dados estáticos (mapa/voo/cidades) em planos antigos
    return {
      id: l.id || uid(), code: l.code || '', nome: l.nome || 'País', regiao: l.regiao || '',
      dias: num(l.dias, 0), custoDia: num(l.custoDia, 0), moeda: l.moeda || 'USD',
      economiaDia: num(l.economiaDia, 0), economiaLabel: l.economiaLabel || '',
      transporte: num(l.transporte, 0), transporteNota: l.transporteNota || '',
      melhoresMeses: Array.isArray(l.melhoresMeses) ? l.melhoresMeses : [],
      estacaoLabel: l.estacaoLabel || '',
      vistoTipo: l.vistoTipo || 'isento', vistoDias: num(l.vistoDias, 0), vistoNota: l.vistoNota || '',
      vistoExtensao: typeof l.vistoExtensao === 'boolean' ? l.vistoExtensao : false,
      vistoExtensaoNota: l.vistoExtensaoNota || '',
      vistoComprovanteSaida: typeof l.vistoComprovanteSaida === 'boolean' ? l.vistoComprovanteSaida : true,
      cidadesCusto: (l.cidadesCusto && typeof l.cidadesCusto === 'object') ? l.cidadesCusto : {},
      iata: l.iata || (ref && ref.iata) || '',
      cidadePrincipal: l.cidadePrincipal || (ref && ref.cidadePrincipal) || (l.nome || ''),
      coords: l.coords || (ref && ref.coords ? [...ref.coords] : null),
      fotoQuery: l.fotoQuery || (ref && ref.fotoQuery) || (l.nome || ''),
      cidades: Array.isArray(l.cidades) && l.cidades.length ? l.cidades : (ref && ref.cidades ? [...ref.cidades] : []),
      comidas: Array.isArray(l.comidas) && l.comidas.length ? l.comidas : (ref && ref.comidas ? [...ref.comidas] : []),
      oportunidades: Array.isArray(l.oportunidades) ? l.oportunidades : null,
    };
  }) : [];
  return { version: 3, settings, legs };
}

export function carregarPlano() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return planoExemplo();
    return normalizarPlano(JSON.parse(raw));
  } catch (e) { return planoExemplo(); }
}

// Retorna true se gravou, false se o navegador recusou (aba anônima, cota cheia) —
// o indicador "Salvo" usa esse sinal pra ser honesto em vez de falhar em silêncio.
export function salvarPlano(plan) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(plan)); return true; }
  catch (e) { return false; }
}

export function exportarPlano(plan) {
  // Nunca exporta a chave de API (é segredo). Zera antes de salvar o arquivo.
  const limpo = { ...plan, settings: { ...plan.settings, ai: { ...plan.settings.ai, apiKey: '' } } };
  const blob = new Blob([JSON.stringify(limpo, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = `rota-mundosemfim-${toISO(new Date())}.json`;
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
