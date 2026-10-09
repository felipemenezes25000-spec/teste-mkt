// Limite de requisições por IP (janela deslizante em memória, por instância).
// Defesa de primeira linha contra abuso das APIs (V4 §44 "envio excessivo"). Em
// produção multi-instância, troque o armazenamento por Redis/Upstash (mesma API).
const baldes = new Map();
const MAX_CHAVES = 10000;

export function ipDe(req) {
  const xf = req.headers.get('x-forwarded-for');
  return (xf ? xf.split(',')[0] : req.headers.get('x-real-ip')) || 'local';
}

/** @returns {{ ok: boolean, restante: number, retryAfter: number }} */
export function consumir(chave, limite, janelaMs, agora = Date.now()) {
  const lista = (baldes.get(chave) || []).filter((t) => agora - t < janelaMs);
  if (lista.length >= limite) {
    baldes.set(chave, lista);
    return { ok: false, restante: 0, retryAfter: Math.ceil((janelaMs - (agora - lista[0])) / 1000) };
  }
  lista.push(agora);
  baldes.set(chave, lista);
  if (baldes.size > MAX_CHAVES) baldes.delete(baldes.keys().next().value);
  return { ok: true, restante: limite - lista.length, retryAfter: 0 };
}

/** Aplica o limite numa rota. Retorna Response 429 ou null (seguir). */
export function limitar(req, rota, { limite = 60, janelaMs = 60000 } = {}) {
  const r = consumir(`${rota}|${ipDe(req)}`, limite, janelaMs);
  if (r.ok) return null;
  return Response.json({ error: 'Muitas requisições. Tente de novo em instantes.' }, {
    status: 429, headers: { 'retry-after': String(r.retryAfter), 'cache-control': 'no-store' },
  });
}

export function _limpar() { baldes.clear(); }
