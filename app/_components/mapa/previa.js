// Prévia leve do mapa: projeção equirretangular (a do contorno Natural Earth). Puro.
export const ex = (lng) => lng + 180;
export const ey = (lat) => 90 - lat;

/** Enquadra os pontos (com margem) no plano 360×180. Sem pontos → mundo. Puro. */
export function enquadrarPrevia(pontos, margem = 0.12) {
  const ps = (pontos || []).filter((p) => Number.isFinite(p.lng) && Number.isFinite(p.lat));
  if (!ps.length) return { x0: 0, y0: 0, w: 360, h: 180 };
  let x0 = 360, x1 = 0, y0 = 180, y1 = 0;
  for (const p of ps) { x0 = Math.min(x0, ex(p.lng)); x1 = Math.max(x1, ex(p.lng)); y0 = Math.min(y0, ey(p.lat)); y1 = Math.max(y1, ey(p.lat)); }
  const w = Math.max(x1 - x0, 2), h = Math.max(y1 - y0, 2);
  return { x0: x0 - w * margem, y0: y0 - h * margem, w: w * (1 + 2 * margem), h: h * (1 + 2 * margem) };
}
