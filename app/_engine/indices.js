/* =============================================================================
   ÍNDICES DE PERFIL POR PAÍS (0–10)
   ---------------------------------------------------------------------------
   Notas de REFERÊNCIA, na ótica do viajante, para alimentar o Score de Viagem,
   o Motor de Decisão e a Comparação inteligente. São ESTIMATIVAS curadas (como
   o resto do `data.js`) — editáveis e não substituem a fonte oficial.

   Dimensões:
     seguranca  – sensação de segurança para turista (10 = muito seguro)
     gastronomia– riqueza/variedade gastronômica
     natureza   – paisagens, trilhas, vida selvagem
     cultura    – história, museus, patrimônio, vida local
     praia      – qualidade/oferta de praias (0 = sem litoral relevante)
     vidaNoturna– bares, baladas, cena noturna
     aventura   – trekking, mergulho, esportes, adrenalina
   ========================================================================== */

export const INDICES_PAIS = {
  TH: { seguranca: 7, gastronomia: 9, natureza: 8, cultura: 8, praia: 9, vidaNoturna: 8, aventura: 7 },
  VN: { seguranca: 7, gastronomia: 9, natureza: 8, cultura: 8, praia: 7, vidaNoturna: 6, aventura: 7 },
  KH: { seguranca: 6, gastronomia: 6, natureza: 7, cultura: 9, praia: 6, vidaNoturna: 5, aventura: 6 },
  LA: { seguranca: 7, gastronomia: 6, natureza: 8, cultura: 7, praia: 1, vidaNoturna: 4, aventura: 7 },
  ID: { seguranca: 6, gastronomia: 7, natureza: 9, cultura: 8, praia: 9, vidaNoturna: 6, aventura: 8 },
  MY: { seguranca: 7, gastronomia: 8, natureza: 8, cultura: 7, praia: 8, vidaNoturna: 6, aventura: 7 },
  PH: { seguranca: 6, gastronomia: 6, natureza: 9, cultura: 6, praia: 10, vidaNoturna: 6, aventura: 8 },
  IN: { seguranca: 5, gastronomia: 9, natureza: 8, cultura: 10, praia: 6, vidaNoturna: 5, aventura: 8 },
  NP: { seguranca: 7, gastronomia: 6, natureza: 10, cultura: 8, praia: 0, vidaNoturna: 4, aventura: 10 },
  LK: { seguranca: 7, gastronomia: 7, natureza: 9, cultura: 8, praia: 8, vidaNoturna: 5, aventura: 8 },
  PE: { seguranca: 6, gastronomia: 9, natureza: 9, cultura: 10, praia: 5, vidaNoturna: 6, aventura: 9 },
  BO: { seguranca: 6, gastronomia: 6, natureza: 10, cultura: 8, praia: 0, vidaNoturna: 5, aventura: 9 },
  CO: { seguranca: 5, gastronomia: 7, natureza: 9, cultura: 8, praia: 7, vidaNoturna: 8, aventura: 8 },
  AR: { seguranca: 7, gastronomia: 9, natureza: 9, cultura: 8, praia: 5, vidaNoturna: 9, aventura: 8 },
  CL: { seguranca: 7, gastronomia: 7, natureza: 10, cultura: 7, praia: 5, vidaNoturna: 6, aventura: 9 },
  MX: { seguranca: 5, gastronomia: 10, natureza: 8, cultura: 10, praia: 9, vidaNoturna: 8, aventura: 8 },
  GT: { seguranca: 5, gastronomia: 6, natureza: 9, cultura: 9, praia: 4, vidaNoturna: 5, aventura: 8 },
  PT: { seguranca: 9, gastronomia: 9, natureza: 7, cultura: 9, praia: 8, vidaNoturna: 7, aventura: 6 },
  GE: { seguranca: 8, gastronomia: 8, natureza: 9, cultura: 8, praia: 4, vidaNoturna: 6, aventura: 8 },
  TR: { seguranca: 7, gastronomia: 9, natureza: 8, cultura: 10, praia: 8, vidaNoturna: 7, aventura: 8 },
  MA: { seguranca: 6, gastronomia: 8, natureza: 8, cultura: 9, praia: 6, vidaNoturna: 5, aventura: 8 },
  ZA: { seguranca: 4, gastronomia: 7, natureza: 10, cultura: 7, praia: 8, vidaNoturna: 7, aventura: 10 },
};

// Índice neutro (5/10) quando o país não está na tabela — degradação segura.
export const INDICE_NEUTRO = { seguranca: 5, gastronomia: 5, natureza: 5, cultura: 5, praia: 5, vidaNoturna: 5, aventura: 5 };

export function indiceDe(code) {
  return INDICES_PAIS[code] || INDICE_NEUTRO;
}

export const DIMENSOES_INDICE = ['seguranca', 'gastronomia', 'natureza', 'cultura', 'praia', 'vidaNoturna', 'aventura'];
