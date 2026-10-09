// Chaves da API pública: geradas no navegador/servidor com CSPRNG, mostradas
// UMA vez e guardadas só como SHA-256 (tabela api_keys). Formato:
//   msf_live_<32 base62>   prefixo exibível = msf_live_<6 primeiros>
const B62 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
export const FORMATO_CHAVE = /^msf_(live|test)_[A-Za-z0-9]{32}$/;

function aleatorio(n) {
  const buf = new Uint8Array(n);
  globalThis.crypto.getRandomValues(buf);
  return buf;
}

/** Gera uma chave nova (rejeição de viés: só bytes < 248 = 62*4). */
export function gerarChave(ambiente = 'live') {
  if (!['live', 'test'].includes(ambiente)) throw new Error('ambiente inválido');
  let s = '';
  while (s.length < 32) {
    for (const b of aleatorio(48)) {
      if (b < 248 && s.length < 32) s += B62[b % 62];
    }
  }
  return `msf_${ambiente}_${s}`;
}

export function prefixoDe(chave) {
  if (!FORMATO_CHAVE.test(String(chave || ''))) return null;
  const [, amb, corpo] = /^msf_(live|test)_(.+)$/.exec(chave);
  return `msf_${amb}_${corpo.slice(0, 6)}`;
}

/** SHA-256 em hex (WebCrypto: funciona no Node 20+, edge e navegador). */
export async function hashChave(chave) {
  const dados = new TextEncoder().encode(String(chave));
  const dig = await globalThis.crypto.subtle.digest('SHA-256', dados);
  return [...new Uint8Array(dig)].map((b) => b.toString(16).padStart(2, '0')).join('');
}

/** Lê a chave do pedido: header x-api-key ou Authorization: Bearer msf_… */
export function chaveDoPedido(req) {
  const h = req.headers.get('x-api-key');
  if (h) return h.trim();
  const a = req.headers.get('authorization') || '';
  const m = /^bearer\s+(msf_\S+)$/i.exec(a.trim());
  return m ? m[1] : null;
}
