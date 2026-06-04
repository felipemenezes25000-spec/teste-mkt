// Planos e o que cada um libera — fonte única da verdade do paywall (client+server).
export const PLANOS = {
  free: { id: 'free', nome: 'Grátis', ordem: 0 },
  premium: { id: 'premium', nome: 'Premium', ordem: 1 },
  pro: { id: 'pro', nome: 'Pro', ordem: 2 },
};

// feature -> plano mínimo necessário. Features ausentes daqui são livres (free).
export const FEATURES = {
  'roteiro-pdf': 'premium',
  'comparar-avancado': 'premium',
  'alertas-preco': 'premium',
  'custos-detalhados': 'premium',
  'multipais': 'pro',
  'colaboracao': 'pro',
};

export function planoLibera(planoId, feature) {
  const need = FEATURES[feature];
  if (!need) return true;
  const tem = (PLANOS[planoId] || PLANOS.free).ordem;
  return tem >= PLANOS[need].ordem;
}

export function nomePlano(planoId) {
  return (PLANOS[planoId] || PLANOS.free).nome;
}
