// @ts-check
// Contrato de provedores (OMEGA V4 §27-29 / §76-H): todo acesso externo passa por
// aqui — timeout, retry só quando seguro, circuit breaker e resultado com status
// explícito. Falha de provider NÃO derruba a UX: devolve UNAVAILABLE + evidência.

/** @typedef {'UNRESEARCHED'|'RESEARCHED'|'CONTRACT_REQUIRED'|'KEY_REQUIRED'|'MOCK_ONLY'|'ADAPTER_READY'|'SANDBOX_VERIFIED'|'LIVE_VERIFIED'|'DEGRADED'|'DISABLED'} ProviderState */
/**
 * @template T
 * @typedef {{ data: T|null, status: 'LIVE'|'DEGRADED'|'UNAVAILABLE', evidence: import('./evidence.js').Evidence[], errors: Array<{code:string, retryable:boolean, message?:string}> }} ProviderResult
 */

export const PROVIDER_STATES = /** @type {const} */ ([
  'UNRESEARCHED', 'RESEARCHED', 'CONTRACT_REQUIRED', 'KEY_REQUIRED', 'MOCK_ONLY',
  'ADAPTER_READY', 'SANDBOX_VERIFIED', 'LIVE_VERIFIED', 'DEGRADED', 'DISABLED',
]);

/** Estados que permitem chamada real. Os demais devolvem UNAVAILABLE sem rede. */
export const ESTADOS_CHAMAVEIS = new Set(['ADAPTER_READY', 'SANDBOX_VERIFIED', 'LIVE_VERIFIED', 'DEGRADED']);

const circuitos = new Map();

/**
 * Circuit breaker simples por provider: após `limite` falhas seguidas, abre por
 * `janelaMs` e as chamadas devolvem UNAVAILABLE imediatamente.
 * @param {string} nome
 */
export function circuito(nome, limite = 3, janelaMs = 60000) {
  if (!circuitos.has(nome)) circuitos.set(nome, { falhas: 0, abertoAte: 0 });
  const c = circuitos.get(nome);
  return {
    aberto: (agora = Date.now()) => c.abertoAte > agora,
    sucesso: () => { c.falhas = 0; c.abertoAte = 0; },
    falha: (agora = Date.now()) => { c.falhas += 1; if (c.falhas >= limite) c.abertoAte = agora + janelaMs; },
    estado: () => ({ ...c }),
  };
}

export function _resetCircuitos() { circuitos.clear(); }

/**
 * Executa `fn` com timeout, retry (somente se `idempotente`) e circuit breaker.
 * @template T
 * @param {{ nome: string, estado?: ProviderState, timeoutMs?: number, tentativas?: number, idempotente?: boolean, freshness?: import('./evidence.js').Freshness, sourceUrl?: string, attribution?: string, validadeMs?: number }} cfg
 * @param {(signal: AbortSignal) => Promise<T>} fn
 * @returns {Promise<ProviderResult<T>>}
 */
export async function chamarProvider(cfg, fn) {
  const agora = new Date();
  const ev = (status, freshness) => ({
    provider: cfg.nome, fetchedAt: agora.toISOString(), freshness,
    ...(cfg.sourceUrl ? { sourceUrl: cfg.sourceUrl } : {}),
    ...(cfg.attribution ? { attribution: cfg.attribution } : {}),
    ...(cfg.validadeMs && status !== 'UNAVAILABLE' ? { validUntil: new Date(agora.getTime() + cfg.validadeMs).toISOString() } : {}),
  });
  const estado = cfg.estado || 'ADAPTER_READY';
  if (!ESTADOS_CHAMAVEIS.has(estado)) {
    return { data: null, status: 'UNAVAILABLE', evidence: [ev('UNAVAILABLE', 'UNAVAILABLE')], errors: [{ code: `PROVIDER_${estado}`, retryable: false }] };
  }
  const cb = circuito(cfg.nome);
  if (cb.aberto()) {
    return { data: null, status: 'UNAVAILABLE', evidence: [ev('UNAVAILABLE', 'UNAVAILABLE')], errors: [{ code: 'CIRCUIT_OPEN', retryable: true }] };
  }
  const tentativas = cfg.idempotente ? Math.max(1, cfg.tentativas ?? 2) : 1;
  /** @type {Array<{code:string,retryable:boolean,message?:string}>} */
  const erros = [];
  for (let i = 0; i < tentativas; i++) {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), cfg.timeoutMs ?? 8000);
    try {
      const data = await fn(ctrl.signal);
      clearTimeout(timer);
      cb.sucesso();
      const status = estado === 'DEGRADED' ? 'DEGRADED' : 'LIVE';
      return { data, status, evidence: [ev(status, cfg.freshness || 'LIVE')], errors: erros };
    } catch (e) {
      clearTimeout(timer);
      const abort = ctrl.signal.aborted;
      erros.push({ code: abort ? 'TIMEOUT' : 'ERROR', retryable: true, message: String((e && /** @type {any} */ (e).message) || e).slice(0, 200) });
      if (i < tentativas - 1) await new Promise((r) => setTimeout(r, 250 * 2 ** i));
    }
  }
  cb.falha();
  return { data: null, status: 'UNAVAILABLE', evidence: [ev('UNAVAILABLE', 'UNAVAILABLE')], errors: erros };
}
