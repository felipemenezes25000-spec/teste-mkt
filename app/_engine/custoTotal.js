/* =============================================================================
   CUSTO TOTAL REALISTA
   ---------------------------------------------------------------------------
   O concorrente mostra "voo + hotel". A gente mostra o CUSTO REAL da viagem:
   vida diária + transporte entre trechos + seguro + chip/eSIM + vistos + uma
   reserva pra imprevistos. E ainda em 3 níveis (mochila/médio/conforto), pra o
   viajante não tomar susto. Recebe o `calc` pronto. Função PURA → testável.
   ========================================================================== */
import { num } from './utils.js';

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
