/* =============================================================================
   SUPER-PERFIL DO VIAJANTE
   ---------------------------------------------------------------------------
   Um vetor de PREFERÊNCIAS (0–1) que personaliza o Score e o Motor de Decisão.
   Começa de um preset (mochileiro, luxo, gastronômico, romântico, família,
   aventura, cultural, praia, equilibrado) e APRENDE com as ações do usuário
   (favoritar destino, escolher roteiro) — empurrando o vetor na direção do que
   ele demonstra preferir. Núcleo PURO (testável); persistência isolada no fim.
   ========================================================================== */
import { clamp, num } from './utils.js';
import { indiceDe } from './indices.js';
import { refDe } from './data.js';

export const INTERESSES = ['economia', 'conforto', 'natureza', 'gastronomia', 'praia', 'cultura', 'vidaNoturna', 'seguranca', 'aventura'];

export const INTERESSE_LABEL = {
  economia: 'Economia', conforto: 'Conforto', natureza: 'Natureza', gastronomia: 'Gastronomia',
  praia: 'Praia', cultura: 'Cultura', vidaNoturna: 'Vida noturna', seguranca: 'Segurança', aventura: 'Aventura',
};

export function perfilPadrao() {
  return INTERESSES.reduce((o, k) => ((o[k] = 0.5), o), {});
}

// Presets prontos — espelham os "tipos de roteiro" do produto.
export const PERFIS_PRONTOS = {
  equilibrado: { nome: 'Equilibrado', emoji: '⚖️', pesos: perfilPadrao() },
  mochileiro: { nome: 'Mochileiro', emoji: '🎒', pesos: { economia: 1, conforto: 0.1, natureza: 0.7, gastronomia: 0.5, praia: 0.5, cultura: 0.6, vidaNoturna: 0.4, seguranca: 0.4, aventura: 0.8 } },
  luxo: { nome: 'Luxo', emoji: '✨', pesos: { economia: 0.0, conforto: 1, natureza: 0.5, gastronomia: 0.8, praia: 0.6, cultura: 0.6, vidaNoturna: 0.5, seguranca: 0.8, aventura: 0.2 } },
  gastronomico: { nome: 'Gastronômico', emoji: '🍽️', pesos: { economia: 0.4, conforto: 0.5, natureza: 0.3, gastronomia: 1, praia: 0.3, cultura: 0.7, vidaNoturna: 0.6, seguranca: 0.5, aventura: 0.3 } },
  romantico: { nome: 'Romântico', emoji: '💞', pesos: { economia: 0.3, conforto: 0.8, natureza: 0.5, gastronomia: 0.7, praia: 0.7, cultura: 0.6, vidaNoturna: 0.4, seguranca: 0.7, aventura: 0.3 } },
  familia: { nome: 'Família', emoji: '👨‍👩‍👧', pesos: { economia: 0.5, conforto: 0.7, natureza: 0.6, gastronomia: 0.5, praia: 0.6, cultura: 0.5, vidaNoturna: 0.1, seguranca: 1, aventura: 0.3 } },
  aventura: { nome: 'Aventura', emoji: '🧗', pesos: { economia: 0.5, conforto: 0.2, natureza: 0.9, gastronomia: 0.4, praia: 0.4, cultura: 0.5, vidaNoturna: 0.3, seguranca: 0.4, aventura: 1 } },
  cultural: { nome: 'Cultural', emoji: '🏛️', pesos: { economia: 0.5, conforto: 0.5, natureza: 0.4, gastronomia: 0.6, praia: 0.3, cultura: 1, vidaNoturna: 0.4, seguranca: 0.5, aventura: 0.4 } },
  praia: { nome: 'Praia & relax', emoji: '🏖️', pesos: { economia: 0.4, conforto: 0.6, natureza: 0.6, gastronomia: 0.5, praia: 1, cultura: 0.3, vidaNoturna: 0.6, seguranca: 0.6, aventura: 0.4 } },
  'primeira-viagem': { nome: 'Primeira viagem internacional', emoji: '🛂', pesos: { economia: 0.4, conforto: 0.7, natureza: 0.4, gastronomia: 0.5, praia: 0.5, cultura: 0.6, vidaNoturna: 0.3, seguranca: 0.9, aventura: 0.2 } },
  descansar: { nome: 'Eu só quero descansar', emoji: '😌', pesos: { economia: 0.4, conforto: 0.9, natureza: 0.5, gastronomia: 0.5, praia: 0.8, cultura: 0.2, vidaNoturna: 0.2, seguranca: 0.7, aventura: 0.1 } },
  'casal-economico': { nome: 'Casal sem estourar o cartão', emoji: '💕', pesos: { economia: 0.8, conforto: 0.6, natureza: 0.5, gastronomia: 0.7, praia: 0.6, cultura: 0.5, vidaNoturna: 0.3, seguranca: 0.7, aventura: 0.3 } },
  'mochilao-sem-perrengue': { nome: 'Mochilão sem perrengue', emoji: '🎒', pesos: { economia: 0.7, conforto: 0.5, natureza: 0.7, gastronomia: 0.5, praia: 0.5, cultura: 0.6, vidaNoturna: 0.4, seguranca: 0.7, aventura: 0.6 } },
};

export function perfilDoPreset(id) {
  const p = PERFIS_PRONTOS[id] || PERFIS_PRONTOS.equilibrado;
  return { ...perfilPadrao(), ...p.pesos };
}

// Converte o vetor de interesses (0–1) nos PESOS das 8 dimensões do Score.
// (Ver score.js → scoreViagem({ pesos })). Não precisa somar 1: o score normaliza.
export function pesosScore(perfil) {
  const p = { ...perfilPadrao(), ...(perfil || {}) };
  return {
    custoBeneficio: 0.1 + 0.5 * p.economia,
    conforto: 0.1 + 0.8 * p.conforto,
    seguranca: 0.1 + 0.8 * p.seguranca,
    tempoLivre: 0.3 + 0.4 * p.conforto,
    experienciaLocal: 0.1 + (p.cultura + p.natureza + p.aventura + p.praia) / 4,
    gastronomia: 0.1 + 0.8 * p.gastronomia,
    risco: 0.1 + 0.6 * p.seguranca,
    economia: 0.1 + 0.6 * p.economia,
  };
}

// Converte os índices (0–10) de um destino + custo/dia num vetor de interesses
// (0–1) — usado pra APRENDER com um destino favoritado.
export function destinoParaInteresses(indices, custoDia) {
  const i = indices || {};
  const alvo = {
    natureza: num(i.natureza) / 10,
    gastronomia: num(i.gastronomia) / 10,
    praia: num(i.praia) / 10,
    cultura: num(i.cultura) / 10,
    vidaNoturna: num(i.vidaNoturna) / 10,
    aventura: num(i.aventura) / 10,
    seguranca: num(i.seguranca) / 10,
  };
  if (custoDia != null) alvo.economia = clamp(1 - num(custoDia) / 80, 0, 1); // barato → economia alta
  return alvo;
}

// Empurra o perfil na direção de um alvo (só as chaves presentes no alvo). PURO.
export function aprender(perfil, alvo, taxa = 0.15) {
  const base = { ...perfilPadrao(), ...(perfil || {}) };
  const out = { ...base };
  for (const k of Object.keys(alvo || {})) {
    if (!(k in base)) continue;
    out[k] = clamp(base[k] + taxa * (num(alvo[k]) - base[k]), 0, 1);
  }
  return out;
}

// Top interesses (pra rotular o perfil na UI).
export function topInteresses(perfil, n = 3) {
  return Object.entries({ ...perfilPadrao(), ...(perfil || {}) })
    .sort((a, b) => b[1] - a[1])
    .slice(0, n)
    .map(([k, v]) => ({ id: k, label: INTERESSE_LABEL[k], peso: v }));
}

/* ===== Persistência (isolada — só no browser) ===== */
export const PERFIL_KEY = 'mundosemfim.perfil.v1';
export const PERFIL_EVENT = 'msf:perfil'; // dispara quando o perfil muda (UI re-renderiza)

export function carregarPerfil() {
  try {
    const raw = localStorage.getItem(PERFIL_KEY);
    if (!raw) return null;
    const obj = JSON.parse(raw);
    return { ...perfilPadrao(), ...(obj && obj.pesos ? obj.pesos : obj) };
  } catch { return null; }
}

export function salvarPerfil(perfil, presetId) {
  let ok = false;
  try { localStorage.setItem(PERFIL_KEY, JSON.stringify({ pesos: perfil, preset: presetId || null, v: 1 })); ok = true; }
  catch { ok = false; }
  try { window.dispatchEvent(new CustomEvent(PERFIL_EVENT)); } catch {}
  return ok;
}

// Aprende com uma AÇÃO do usuário (favoritar um destino): empurra o perfil na
// direção dos índices+custo daquele país e persiste. Falha em silêncio.
export function aprenderComFavorito(code) {
  try {
    const ref = refDe(code);
    const alvo = destinoParaInteresses(indiceDe(code), ref && ref.custoDia);
    const novo = aprender(carregarPerfil() || perfilPadrao(), alvo);
    salvarPerfil(novo);
    return novo;
  } catch { return null; }
}
