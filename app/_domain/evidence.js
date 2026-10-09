// @ts-check
// Proveniência e frescor de dados (OMEGA V4 §22 / §76-B). Todo fato exibido carrega
// de onde veio, quando foi obtido e até quando vale. "Nenhum dado é ao vivo por
// aparência visual": a classe de frescor é calculada, não declarada pela UI.

/** @typedef {'LIVE'|'RECENT'|'ESTIMATE'|'HISTORICAL'|'UNVERIFIED'|'UNAVAILABLE'} Freshness */
/**
 * @typedef {{
 *   provider: string, sourceUrl?: string, fetchedAt: string, observedAt?: string,
 *   validUntil?: string, attribution?: string, licenseId?: string, confidence?: number,
 *   freshness: Freshness, note?: string
 * }} Evidence
 */
/**
 * @template T
 * @typedef {{ value: T|null, evidence: Evidence }} Fact
 */

export const FRESHNESS = /** @type {const} */ (['LIVE', 'RECENT', 'ESTIMATE', 'HISTORICAL', 'UNVERIFIED', 'UNAVAILABLE']);

/** Rótulos em pt-BR + explicação curta, usados por <SourceTrust>. */
export const FRESHNESS_INFO = {
  LIVE: { rotulo: 'Ao vivo', explica: 'Consultado agora na fonte.' },
  RECENT: { rotulo: 'Recente', explica: 'Obtido na fonte há pouco tempo e ainda dentro da validade.' },
  ESTIMATE: { rotulo: 'Estimativa', explica: 'Calculado por modelo/heurística — não é cotação.' },
  HISTORICAL: { rotulo: 'Histórico', explica: 'Valor de referência de pesquisa anterior; pode ter mudado.' },
  UNVERIFIED: { rotulo: 'Não verificado', explica: 'Sem confirmação em fonte confiável.' },
  UNAVAILABLE: { rotulo: 'Indisponível', explica: 'A fonte não respondeu ou não cobre este item.' },
};

const MIN = 60 * 1000;

/**
 * Janela em que um dado obtido de fonte "viva" ainda pode ser chamado de LIVE.
 * Depois disso vira RECENT até `validUntil`; depois de vencido, HISTORICAL.
 */
export const LIVE_JANELA_MS = 10 * MIN;

/**
 * Calcula o frescor efetivo AGORA a partir da evidência bruta.
 * - ESTIMATE/UNVERIFIED/UNAVAILABLE nunca "sobem" de classe.
 * - LIVE envelhece: > LIVE_JANELA → RECENT; após validUntil → HISTORICAL.
 * @param {Evidence} ev
 * @param {Date} [agora]
 * @returns {Freshness}
 */
export function freshnessEfetiva(ev, agora = new Date()) {
  if (!ev || !FRESHNESS.includes(ev.freshness)) return 'UNVERIFIED';
  if (ev.freshness === 'ESTIMATE' || ev.freshness === 'UNVERIFIED' || ev.freshness === 'UNAVAILABLE' || ev.freshness === 'HISTORICAL') return ev.freshness;
  const t = Date.parse(ev.fetchedAt);
  if (!Number.isFinite(t)) return 'UNVERIFIED';
  const vence = ev.validUntil ? Date.parse(ev.validUntil) : NaN;
  if (Number.isFinite(vence) && agora.getTime() > vence) return 'HISTORICAL';
  if (ev.freshness === 'LIVE' && agora.getTime() - t <= LIVE_JANELA_MS) return 'LIVE';
  return 'RECENT';
}

/**
 * @param {Partial<Evidence> & { provider: string, freshness: Freshness }} e
 * @returns {Evidence}
 */
export function evidencia(e) {
  if (!e || !e.provider) throw new Error('evidência exige provider');
  if (!FRESHNESS.includes(e.freshness)) throw new Error(`freshness inválida: ${e.freshness}`);
  return { fetchedAt: new Date().toISOString(), ...e };
}

/**
 * @template T
 * @param {T|null} value
 * @param {Evidence} evidence
 * @returns {Fact<T>}
 */
export function fato(value, evidence) {
  return { value: value ?? null, evidence };
}

/**
 * Evidência padrão dos datasets curados do repositório (pesquisa jun/2026).
 * São HISTÓRICOS por definição: nunca exibir como preço atual.
 * @param {string} dataset
 * @param {string} [observedAt]
 */
export function evidenciaCatalogo(dataset, observedAt = '2026-06-06') {
  return evidencia({
    provider: `catalogo-msf:${dataset}`,
    freshness: 'HISTORICAL',
    fetchedAt: `${observedAt}T00:00:00.000Z`,
    observedAt,
    note: 'Pesquisa de referência do Mundo Sem Fim (jun/2026). Confira na fonte antes de comprar.',
  });
}

/**
 * Idade legível ("há 3 h", "há 2 meses") para exibir junto do selo.
 * @param {string} iso @param {Date} [agora]
 */
export function idadeLegivel(iso, agora = new Date()) {
  const t = Date.parse(iso);
  if (!Number.isFinite(t)) return 'data desconhecida';
  const s = Math.max(0, Math.round((agora.getTime() - t) / 1000));
  if (s < 60) return 'agora';
  const m = Math.round(s / 60);
  if (m < 60) return `há ${m} min`;
  const h = Math.round(m / 60);
  if (h < 48) return `há ${h} h`;
  const d = Math.round(h / 24);
  if (d < 60) return `há ${d} dias`;
  const mes = Math.round(d / 30);
  if (mes < 24) return `há ${mes} meses`;
  return `há ${Math.round(mes / 12)} anos`;
}
