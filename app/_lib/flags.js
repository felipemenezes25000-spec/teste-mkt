// Bandeira do destino a partir do código ISO-2 (`code`). Usamos SVG do flagcdn
// em vez de emoji porque o emoji de bandeira NÃO renderiza no Windows/Chrome
// (cai pras duas letras). O SVG renderiza igual em todo navegador/SO.
// flagcdn cobre todos os códigos ISO 3166-1 alpha-2 + alguns extras (ex.: xk).
export function flagUrl(code) {
  if (!code || !/^[A-Za-z]{2}$/.test(code)) return null;
  return `https://flagcdn.com/${code.toLowerCase()}.svg`;
}
