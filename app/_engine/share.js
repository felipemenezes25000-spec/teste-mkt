import { normalizarPlano } from './storage.js';

// ─────────────────────────────────────────────────────────────────────────────
// LINK COMPARTILHÁVEL — serializa o plano num texto URL-safe e de volta.
// Recomendado pôr no HASH da URL (#r=...) pra não esbarrar em limites de servidor.
// NUNCA inclui a chave de IA (segredo). Isomórfico: funciona no browser e no Node
// (TextEncoder/TextDecoder/btoa/atob são globais nos dois). Função pura, isolada.
// ─────────────────────────────────────────────────────────────────────────────

function semChave(plan) {
  const ai = { ...((plan.settings && plan.settings.ai) || {}) };
  delete ai.apiKey; // o link jamais carrega a chave
  return { version: 3, settings: { ...plan.settings, ai }, legs: plan.legs };
}

function toBase64Url(str) {
  const bytes = new TextEncoder().encode(str); // UTF-8 (preserva acentos)
  let bin = '';
  for (const b of bytes) bin += String.fromCharCode(b);
  return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function fromBase64Url(s) {
  const b64 = s.replace(/-/g, '+').replace(/_/g, '/');
  const bin = atob(b64); // lança em caractere inválido
  const bytes = Uint8Array.from(bin, (c) => c.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

export function encodePlan(plan) {
  return toBase64Url(JSON.stringify(semChave(plan)));
}

export function decodePlan(s) {
  if (!s || typeof s !== 'string') throw new Error('Link vazio ou inválido.');
  let obj;
  try {
    obj = JSON.parse(fromBase64Url(s.trim()));
  } catch (e) {
    throw new Error('Link de rota inválido ou corrompido.');
  }
  if (!obj || !Array.isArray(obj.legs)) throw new Error('Link de rota sem trechos.');
  const plano = normalizarPlano(obj);          // preenche defaults e valida
  plano.settings.ai = { ...plano.settings.ai, apiKey: '' }; // dupla garantia: sem chave
  return plano;
}
