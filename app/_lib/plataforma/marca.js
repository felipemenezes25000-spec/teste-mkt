// White-label: a marca de uma agência (nome, cor, logo) aplicada sobre os
// tokens MERIDIANO sem quebrar contraste. A cor escolhida vira --c-pine (rota/
// ação primária) e o texto sobre ela é escolhido pelo MAIOR contraste WCAG.

const HEX = /^#([0-9a-f]{6})$/i;
export const MARCA_PADRAO = { nomeExibido: 'Mundo Sem Fim', corPrimaria: '#1C3FD1', logoUrl: '', rodape: '' };

export function hexParaRgb(hex) {
  const m = HEX.exec(String(hex || '').trim());
  if (!m) return null;
  const n = parseInt(m[1], 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

function canal(c) {
  const s = c / 255;
  return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
}
export function luminancia([r, g, b]) {
  return 0.2126 * canal(r) + 0.7152 * canal(g) + 0.0722 * canal(b);
}
/** Razão de contraste WCAG entre duas cores RGB. */
export function contraste(a, b) {
  const [l1, l2] = [luminancia(a), luminancia(b)].sort((x, y) => y - x);
  return (l1 + 0.05) / (l2 + 0.05);
}

const BRANCO = [255, 255, 255];
const TINTA = [10, 16, 32];
const PAPEL = [243, 245, 248];

/** Escurece uma cor RGB (fator 0–1) para o estado hover. */
function escurecer([r, g, b], f = 0.15) {
  return [r, g, b].map((c) => Math.max(0, Math.round(c * (1 - f))));
}
/** Escurece até a cor ser legível como TEXTO no papel (≥ 4.5:1). */
function legivelComoTexto(rgb) {
  let c = rgb;
  for (let i = 0; i < 20 && contraste(c, PAPEL) < 4.5; i++) c = escurecer(c, 0.08);
  return c;
}

/**
 * Normaliza a marca vinda do formulário/banco. Campos inválidos caem no padrão,
 * logo só https (sem data:/javascript:), textos com limite.
 */
export function normalizarMarca(m = {}) {
  const nome = String(m.nomeExibido || '').trim().slice(0, 60) || MARCA_PADRAO.nomeExibido;
  const cor = hexParaRgb(m.corPrimaria) ? String(m.corPrimaria).trim().toUpperCase() : MARCA_PADRAO.corPrimaria;
  let logo = '';
  try {
    const u = new URL(String(m.logoUrl || ''));
    if (u.protocol === 'https:') logo = u.href.slice(0, 500);
  } catch { /* sem logo */ }
  const rodape = String(m.rodape || '').trim().slice(0, 200);
  return { nomeExibido: nome, corPrimaria: cor, logoUrl: logo, rodape };
}

/**
 * Variáveis CSS para aplicar a marca num contêiner (style={...}).
 * Retorna também o diagnóstico de contraste para a UI avisar o usuário.
 */
export function varsDaMarca(marca) {
  const m = normalizarMarca(marca);
  const rgb = hexParaRgb(m.corPrimaria);
  const cBranco = contraste(rgb, BRANCO);
  const cTinta = contraste(rgb, TINTA);
  const on = cBranco >= cTinta ? BRANCO : TINTA;
  const texto = legivelComoTexto(rgb);
  const triplo = (c) => c.join(' ');
  return {
    style: {
      '--c-pine': triplo(texto),
      '--c-pine-dk': triplo(escurecer(texto)),
      '--c-on-pine': triplo(contraste(texto, BRANCO) >= contraste(texto, TINTA) ? BRANCO : TINTA),
      '--c-marca': triplo(rgb),
      '--c-on-marca': triplo(on),
    },
    contrasteBotao: Math.round(Math.max(cBranco, cTinta) * 10) / 10,
    ajustadaParaTexto: triplo(texto) !== triplo(rgb),
    marca: m,
  };
}
