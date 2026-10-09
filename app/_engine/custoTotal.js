/* =============================================================================
   CUSTO TOTAL REALISTA
   ---------------------------------------------------------------------------
   O concorrente mostra "voo + hotel". A gente mostra o CUSTO REAL da viagem:
   vida diária + transporte entre trechos + seguro + chip/eSIM + vistos + uma
   reserva pra imprevistos. E ainda em 3 níveis (mochila/médio/conforto), pra o
   viajante não tomar susto. Recebe o `calc` pronto. Função PURA → testável.
   ========================================================================== */
import { num, distanciaKm, estimarPrecoVoo } from './utils.js';

const TIERS = { mochila: 0.7, medio: 1.0, conforto: 1.9 };

// Defaults editáveis (US$). seguroDia: seguro-viagem. esimPais: chip por país.
// vistoMedio: taxa média de e-visa/on-arrival. contingencia: % p/ imprevistos.
export const PREMISSAS_PADRAO = {
  seguroDia: 2.5,
  esimPais: 8,
  vistoMedio: 25,
  contingencia: 0.12,
};

// Quais trechos têm taxa de visto (e-visa / on-arrival custam; isento/Mercosul não).
function trechoTemTaxaVisto(t) {
  const tipo = (t.vistoTipo || (t.visto && t.visto.tipo) || '').toLowerCase();
  return tipo.includes('visa') || tipo.includes('on-arrival') || tipo.includes('arrival');
}

export function custoTotalRealista(calc, premissas = {}) {
  const p = { ...PREMISSAS_PADRAO, ...premissas };
  const trechos = (calc && calc.trechos) || [];
  const dias = num(calc && calc.diasTotais);
  const numPaises = trechos.length;

  const vida = num(calc && calc.custoTerraTotal);          // vida diária (nível "médio")
  const transporte = num(calc && calc.custoTransporteTotal); // voos/ônibus entre trechos
  const seguro = Math.round(p.seguroDia * dias);
  const esim = Math.round(p.esimPais * numPaises);
  const vistos = trechos.reduce((s, t) => s + (trechoTemTaxaVisto(t) ? p.vistoMedio : 0), 0);

  const subtotal = vida + transporte + seguro + esim + vistos;
  const contingencia = Math.round(subtotal * p.contingencia);
  const total = subtotal + contingencia;

  const categorias = [
    { id: 'vida', label: 'Vida diária (hospedagem, comida, transporte local)', icon: '🛏️', valor: Math.round(vida) },
    { id: 'transporte', label: 'Transporte entre trechos (voos/ônibus)', icon: '✈️', valor: Math.round(transporte) },
    { id: 'seguro', label: 'Seguro-viagem', icon: '🛡️', valor: seguro },
    { id: 'esim', label: 'Chip / eSIM', icon: '📶', valor: esim },
    { id: 'vistos', label: 'Vistos & taxas de entrada', icon: '🛂', valor: vistos },
    { id: 'contingencia', label: 'Reserva p/ imprevistos (12%)', icon: '🧯', valor: contingencia },
  ];

  // Faixa por nível: escala só a VIDA diária pelos tiers; o resto é fixo.
  const faixa = {};
  for (const [tier, mult] of Object.entries(TIERS)) {
    const vidaTier = vida * mult;
    const sub = vidaTier + transporte + seguro + esim + vistos;
    faixa[tier] = Math.round(sub * (1 + p.contingencia));
  }

  return {
    categorias,
    subtotal: Math.round(subtotal),
    contingencia,
    total: Math.round(total),
    porDia: dias > 0 ? Math.round(total / dias) : 0,
    faixa, // { mochila, medio, conforto }
    premissas: p,
  };
}

// Fração da vida diária que vai pra HOSPEDAGEM (espelha custos.js → CATEGORIAS).
// O "preço de vitrine" das OTAs mostra só passagem + diária de hotel.
const PESO_HOSPEDAGEM = 0.40;

// Os DOIS percentuais do custo escondido — pra não enganar: "% acima da vitrine"
// (escondido/vitrine, sobre o preço ANUNCIADO) é maior que "% do custo final"
// (escondido/real, fração do TOTAL). Mostrar só um colado no comparativo confunde. Pura.
export function percentuaisEscondido({ vitrine, real, escondido } = {}) {
  const e = num(escondido), v = num(vitrine), r = num(real);
  return {
    sobreVitrine: v > 0 ? Math.round((e / v) * 100) : 0,
    doFinal: r > 0 ? Math.round((e / r) * 100) : 0,
  };
}

// "Vitrine vs Real": o que uma OTA te mostra (voo + hotel) vs o custo REAL da
// viagem inteira. É o gancho de conversão — materializa a dor nº 1 do mercado.
// Função PURA → testável.
export function resumoVitrineVsReal(calc, premissas = {}) {
  const real = custoTotalRealista(calc, premissas);
  const terra = num(calc && calc.custoTerraTotal);
  const transporte = num(calc && calc.custoTransporteTotal);
  const hospedagem = Math.round(terra * PESO_HOSPEDAGEM);
  const vitrine = hospedagem + Math.round(transporte); // só voo + hotel
  const escondido = Math.max(0, real.total - vitrine);
  return {
    vitrine,
    real: real.total,
    escondido,                 // quanto a vitrine não te conta
    pct: percentuaisEscondido({ vitrine, real: real.total, escondido }), // {sobreVitrine, doFinal}
    porDia: real.porDia,
    categorias: real.categorias, // breakdown completo do custo real
    faixa: real.faixa,
  };
}

// Monta um `calc` MÍNIMO pra um único destino (n dias) — alimenta o bloco
// "vitrine vs real" nas telas que não têm uma rota completa (/destino, /roteiro).
// Estima o voo de ida pela distância da origem (default São Paulo/GRU). Puro.
const ORIGEM_PADRAO = [-46.47, -23.43]; // GRU
export function calcExemploDestino(destino, dias = 7, origemCoords = ORIGEM_PADRAO) {
  const d = Math.max(1, Math.round(num(dias) || 7));
  const custoDia = Math.max(8, num(destino && destino.custoDia, 30));
  const km = destino && destino.coords && origemCoords ? distanciaKm(origemCoords, destino.coords) : 0;
  const faixa = estimarPrecoVoo(km);
  const voo = faixa ? Math.round((faixa.min + faixa.max) / 2) : 600;
  return {
    trechos: [{ code: destino && destino.code, nome: destino && destino.nome, dias: d, custoEfetivoDia: custoDia, vistoTipo: (destino && destino.vistoTipo) || '' }],
    diasTotais: d,
    custoTerraTotal: custoDia * d,
    custoTransporteTotal: voo,
  };
}

// Alta temporada (heurística): meses ótimos do destino + pico global de viagem
// (dez-fev, férias de verão BR, e julho). Sem calendário de feriados por país.
export function mesEhAlto(destino, mes) {
  const otimos = new Set((destino && destino.melhoresMeses) || []);
  const picoGlobal = new Set([12, 1, 2, 7]);
  return otimos.has(mes) || picoGlobal.has(mes);
}

// Simulação da calculadora /custo-real (e do exemplo da home): vitrine (voo + 40% da
// vida em terra como hospedagem) × custo real completo (custoTotalRealista + passeios
// + bagagem), em US$. `mes` em 1–12. Puro — mesma conta nas duas telas.
export function simularCustoReal({ destino, origemCoords = ORIGEM_PADRAO, dias = 8, pessoas = 2, mes = 5, passeiosDia = 20, bagagem = 80 }) {
  const km = destino && destino.coords && origemCoords ? distanciaKm(origemCoords, destino.coords) : 0;
  const faixaVoo = estimarPrecoVoo(km);
  const vooUSDPP = faixaVoo ? Math.round((faixaVoo.min + faixaVoo.max) / 2) : 600;
  const ehAltaTemporada = mesEhAlto(destino, mes);
  const fatorAltaTemp = ehAltaTemporada ? 1.18 : 1.0;
  const vooUSD = vooUSDPP * pessoas * fatorAltaTemp;
  const custoTerraPP = Math.max(8, (destino && destino.custoDia) || 30) * dias;
  const custoTerra = custoTerraPP * pessoas * fatorAltaTemp;
  const out = custoTotalRealista({
    trechos: [{ code: destino.code, nome: destino.nome, dias, custoEfetivoDia: destino.custoDia, vistoTipo: destino.vistoTipo || '' }],
    diasTotais: dias,
    custoTerraTotal: custoTerra,
    custoTransporteTotal: vooUSD,
  });
  const extras = [
    { id: 'passeios', label: 'Passeios e ingressos (média/dia × dias × pessoas)', icon: '🎟️', valor: Math.round(passeiosDia * dias * pessoas) },
    { id: 'bagagem', label: 'Bagagem despachada', icon: '🧳', valor: Math.round(bagagem * pessoas) },
  ];
  const total = out.total + extras.reduce((acc, e) => acc + e.valor, 0);
  const hospedagem = Math.round(custoTerra * 0.40);
  const vitrine = hospedagem + Math.round(vooUSD);
  return {
    vooUSD: Math.round(vooUSD),
    vitrine,
    escondido: Math.max(0, total - vitrine),
    total,
    porDia: Math.round(total / Math.max(1, dias)),
    porPessoa: Math.round(total / Math.max(1, pessoas)),
    categorias: [...out.categorias, ...extras],
    faixa: out.faixa,
    ehAltaTemporada,
    premissas: out.premissas,
    faixaVoo,
  };
}
