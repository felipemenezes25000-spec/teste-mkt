// Estima custo por dia em 3 níveis (mochila / médio / conforto) e por categoria,
// a partir do custo/dia de referência do destino. Tudo em USD. Puro → testável.
const TIERS = { mochila: 0.7, medio: 1.0, conforto: 1.9 };

// Distribuição típica do gasto diário por categoria (soma ~1.0).
const CATEGORIAS = [
  { id: 'hospedagem', label: 'Hospedagem', icon: '🛏️', peso: 0.40 },
  { id: 'comida', label: 'Comida', icon: '🍽️', peso: 0.28 },
  { id: 'transporte', label: 'Transporte local', icon: '🚇', peso: 0.12 },
  { id: 'atracoes', label: 'Atrações & passeios', icon: '🎟️', peso: 0.12 },
  { id: 'outros', label: 'Internet, taxas & extras', icon: '📶', peso: 0.08 },
];

export const TIERS_LABEL = { mochila: 'Mochila', medio: 'Médio', conforto: 'Conforto' };

export function custoPorDia(custoDiaRef) {
  const base = Math.max(8, Number(custoDiaRef) || 30);
  const niveis = {};
  for (const [tier, mult] of Object.entries(TIERS)) {
    const total = Math.round(base * mult);
    niveis[tier] = {
      total,
      categorias: CATEGORIAS.map((c) => ({ ...c, valor: Math.round(total * c.peso) })),
    };
  }
  return niveis;
}

// Custo de uma estadia (dias) num nível. seguroDia opcional (somado por dia).
export function custoEstadia(custoDiaRef, dias, tier = 'medio', seguroDia = 0) {
  const niveis = custoPorDia(custoDiaRef);
  const n = niveis[tier] || niveis.medio;
  const d = Math.max(0, Math.round(Number(dias) || 0));
  const porDia = n.total + Math.max(0, Number(seguroDia) || 0);
  return { porDia, dias: d, total: porDia * d };
}
