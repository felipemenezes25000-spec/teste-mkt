// Saída rastreada para parceiros (OMEGA V4 §30/§39/§44): todo link de parceiro passa
// por /api/out, que (1) só redireciona para hosts da lista de parceiros — sem open
// redirect —, (2) registra o clique de afiliado (atribuição) e (3) devolve 302.
// Pura e testável; usada no client (montar o link) e no servidor (validar).
export const HOSTS_PARCEIROS = [
  'booking.com', 'airbnb.com', 'airbnb.com.br', 'getyourguide.com', 'viator.com', 'tripadvisor.com', 'tripadvisor.com.br',
  'rome2rio.com', 'google.com', 'wise.com', 'klook.com', 'safetywing.com', 'civitatis.com', 'aviasales.com', 'kiwi.com',
  'skyscanner.com.br', 'skyscanner.net', 'omio.com', 'trip.com',
];

export function hostPermitido(url) {
  let u;
  try { u = new URL(url); } catch { return false; }
  if (u.protocol !== 'https:') return false;
  if (u.username || u.password) return false;
  const h = u.hostname.toLowerCase();
  return HOSTS_PARCEIROS.some((p) => h === p || h.endsWith('.' + p));
}

/** Link de saída rastreado. Se o destino não for parceiro conhecido, devolve o próprio. */
export function linkSaida(url, parceiro, produto = 'geral') {
  if (!hostPermitido(url)) return url;
  const q = new URLSearchParams({ to: url, p: String(parceiro || 'parceiro').slice(0, 40), k: String(produto).slice(0, 40) });
  return `/api/out?${q}`;
}
