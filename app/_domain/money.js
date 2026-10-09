// @ts-check
// Dinheiro canônico (OMEGA V4 §38 / §76-A): valor inteiro em UNIDADES MENORES da
// moeda (centavos, ienes, fils…) + código ISO 4217. Nada de float para dinheiro.
// Conversões carregam taxa, data de observação e fonte — nunca "convertido do nada".

/**
 * @typedef {{ amountMinor: number, currency: string }} Money
 * @typedef {{ original: Money, converted: Money, rate: number, rateObservedAt: string, fxSource: string, includesCardSpread: boolean, spreadPct?: number }} ConvertedMoney
 */

// Casas decimais por moeda (ISO 4217). Padrão 2; aqui só as exceções relevantes.
const CASAS = {
  BIF: 0, CLP: 0, DJF: 0, GNF: 0, ISK: 0, JPY: 0, KMF: 0, KRW: 0, PYG: 0, RWF: 0,
  UGX: 0, UYI: 0, VND: 0, VUV: 0, XAF: 0, XOF: 0, XPF: 0,
  BHD: 3, IQD: 3, JOD: 3, KWD: 3, LYD: 3, OMR: 3, TND: 3,
};

/** @param {string} currency */
export function casasDecimais(currency) {
  const c = String(currency || '').toUpperCase();
  return Object.prototype.hasOwnProperty.call(CASAS, c) ? CASAS[c] : 2;
}

/** @param {string} currency */
export function moedaValida(currency) {
  return typeof currency === 'string' && /^[A-Z]{3}$/.test(currency);
}

function exigeMoeda(currency) {
  if (!moedaValida(currency)) throw new TypeError(`Moeda inválida: ${currency}`);
}

/**
 * Arredondamento declarado: HALF-UP simétrico (0,5 afasta do zero).
 * @param {number} x
 */
export function arredondar(x) {
  return Math.sign(x) * Math.round(Math.abs(x) + Number.EPSILON * Math.abs(x));
}

/**
 * Cria Money a partir de um valor decimal "humano" (ex.: 12.34 USD → 1234).
 * @param {number|string} decimal
 * @param {string} currency
 * @returns {Money}
 */
export function money(decimal, currency) {
  exigeMoeda(currency);
  const n = typeof decimal === 'string' ? Number(decimal.replace(',', '.')) : decimal;
  if (!Number.isFinite(n)) throw new TypeError(`Valor inválido: ${decimal}`);
  const fator = 10 ** casasDecimais(currency);
  return { amountMinor: arredondar(n * fator), currency };
}

/**
 * @param {number} amountMinor
 * @param {string} currency
 * @returns {Money}
 */
export function fromMinor(amountMinor, currency) {
  exigeMoeda(currency);
  if (!Number.isInteger(amountMinor)) throw new TypeError('amountMinor precisa ser inteiro');
  return { amountMinor, currency };
}

/** @param {Money} m */
export function toDecimal(m) {
  return m.amountMinor / 10 ** casasDecimais(m.currency);
}

/** @param {Money} m */
export function toDecimalString(m) {
  return toDecimal(m).toFixed(casasDecimais(m.currency));
}

function mesmaMoeda(a, b) {
  if (a.currency !== b.currency) throw new Error(`Moedas diferentes: ${a.currency} × ${b.currency} — converta antes`);
}

/** @param {Money} a @param {Money} b @returns {Money} */
export function add(a, b) {
  mesmaMoeda(a, b);
  return { amountMinor: a.amountMinor + b.amountMinor, currency: a.currency };
}

/** @param {Money} a @param {Money} b @returns {Money} */
export function subtract(a, b) {
  mesmaMoeda(a, b);
  return { amountMinor: a.amountMinor - b.amountMinor, currency: a.currency };
}

/**
 * @param {Money[]} lista
 * @param {string} currency moeda esperada (também usada se a lista estiver vazia)
 * @returns {Money}
 */
export function sum(lista, currency) {
  exigeMoeda(currency);
  return lista.reduce((acc, m) => add(acc, m), { amountMinor: 0, currency });
}

/** @param {Money} m @param {number} fator @returns {Money} */
export function multiply(m, fator) {
  if (!Number.isFinite(fator)) throw new TypeError('fator inválido');
  return { amountMinor: arredondar(m.amountMinor * fator), currency: m.currency };
}

/**
 * Divide em N partes que SOMAM exatamente o total (o resto vai para as primeiras).
 * @param {Money} m @param {number} partes @returns {Money[]}
 */
export function allocate(m, partes) {
  if (!Number.isInteger(partes) || partes < 1) throw new RangeError('partes deve ser inteiro ≥ 1');
  const base = Math.trunc(m.amountMinor / partes);
  let resto = m.amountMinor - base * partes;
  const passo = Math.sign(resto);
  return Array.from({ length: partes }, () => {
    const extra = resto !== 0 ? passo : 0;
    resto -= extra;
    return { amountMinor: base + extra, currency: m.currency };
  });
}

/**
 * Converte com taxa explícita (1 unidade da moeda de origem = `rate` da destino).
 * @param {Money} m
 * @param {string} to
 * @param {{ rate: number, observedAt: string, source: string, spreadPct?: number }} fx
 * @returns {ConvertedMoney}
 */
export function convert(m, to, fx) {
  exigeMoeda(to);
  if (!fx || !(fx.rate > 0)) throw new RangeError('taxa de câmbio inválida');
  if (!fx.observedAt || !fx.source) throw new Error('conversão exige data e fonte da taxa');
  const spread = fx.spreadPct ? 1 + fx.spreadPct / 100 : 1;
  const decimalDestino = toDecimal(m) * fx.rate * spread;
  return {
    original: m,
    converted: money(decimalDestino, to),
    rate: fx.rate,
    rateObservedAt: fx.observedAt,
    fxSource: fx.source,
    includesCardSpread: !!fx.spreadPct,
    ...(fx.spreadPct ? { spreadPct: fx.spreadPct } : {}),
  };
}

/**
 * @param {Money} m
 * @param {string} [locale]
 * @param {{ compact?: boolean }} [opts]
 */
export function format(m, locale = 'pt-BR', opts = {}) {
  const casas = casasDecimais(m.currency);
  try {
    return new Intl.NumberFormat(locale, {
      style: 'currency', currency: m.currency,
      minimumFractionDigits: opts.compact ? 0 : casas,
      maximumFractionDigits: opts.compact ? 0 : casas,
    }).format(toDecimal(m));
  } catch {
    return `${m.currency} ${toDecimalString(m)}`;
  }
}

/** @param {Money} a @param {Money} b */
export function compare(a, b) {
  mesmaMoeda(a, b);
  return Math.sign(a.amountMinor - b.amountMinor);
}

/** @param {unknown} x @returns {x is Money} */
export function isMoney(x) {
  return !!x && typeof x === 'object' && Number.isInteger(/** @type {any} */ (x).amountMinor) && moedaValida(/** @type {any} */ (x).currency);
}
