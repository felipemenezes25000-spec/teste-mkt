// Favoritos no localStorage (lista de codes de destino). Síncrono e simples, com
// um evento custom pra sincronizar todos os botões/telas abertos. Só roda no client.
const KEY = 'mundosemfim.favoritos.v1';
export const FAV_EVENT = 'msf:favoritos';

export function lerFavoritos() {
  try { return JSON.parse(localStorage.getItem(KEY) || '[]'); } catch { return []; }
}

function escrever(lista) {
  try { localStorage.setItem(KEY, JSON.stringify(lista)); } catch {}
  try { window.dispatchEvent(new CustomEvent(FAV_EVENT)); } catch {}
}

export function ehFavorito(code) {
  return lerFavoritos().includes(code);
}

// Alterna e retorna true se PASSOU a ser favorito.
export function alternarFavorito(code) {
  const lista = lerFavoritos();
  const i = lista.indexOf(code);
  if (i >= 0) lista.splice(i, 1);
  else lista.push(code);
  escrever(lista);
  return i < 0;
}
