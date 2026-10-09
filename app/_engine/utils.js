import { MESES_PT } from './meses.js';

let _idc = 0;
export function uid() { return 't' + Date.now().toString(36) + (_idc++).toString(36) + Math.floor(Math.random() * 1e6).toString(36); }

// Datas tratadas como locais (meia-noite) pra evitar surpresa de fuso.
export function parseDate(iso) {
  if (!iso) return new Date();
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, (m || 1) - 1, d || 1);
}
export function toISO(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}
export function addDays(date, n) { const d = new Date(date); d.setDate(d.getDate() + n); return d; }
export function diffDays(a, b) { return Math.round((b - a) / 86400000); }
export function fmtData(date) { return date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' }); }

export function num(v, fallback = 0) { const n = parseFloat(v); return isNaN(n) ? fallback : n; }
export function clamp(v, lo, hi) { return Math.max(lo, Math.min(hi, v)); }

// Validação básica de e-mail (UX, não segurança): algo@algo.tld, sem espaços,
// TLD com 2+ caracteres. Seguro com entradas não-string.
export function emailValido(s) {
  if (typeof s !== 'string') return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(s.trim());
}

const _nf = new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 0 });

// Formata um valor monetário numa moeda ISO. Cai num formato simples se a moeda
// não for reconhecida pelo Intl.
export function fmtMoeda(amount, code = 'USD') {
  const v = Math.round(num(amount));
  try { return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: code, maximumFractionDigits: 0 }).format(v); }
  catch (e) { return `${code} ${_nf.format(v)}`; }
}
// Símbolo curto de uma moeda (ex.: US$, R$, €) p/ usar como sufixo de input.
export function simbolo(code = 'USD') {
  try {
    const parts = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: code, maximumFractionDigits: 0 }).formatToParts(0);
    const s = parts.find(p => p.type === 'currency');
    return s ? s.value : code;
  } catch (e) { return code; }
}

// Converte um valor entre moedas usando uma tabela com pivô em USD (rates[USD]=1).
// convert(x, FROM, TO) = x * rate[TO] / rate[FROM]. Sem taxa → não converte (degrada com segurança).
export function converter(amount, from, to, rates) {
  if (!from || !to || from === to) return num(amount);
  const rf = rates && rates[from], rt = rates && rates[to];
  if (!rf || !rt) return num(amount);
  return num(amount) * rt / rf;
}

export function dur(dias) {
  if (dias < 31) return `${dias} dias`;
  const meses = Math.floor(dias / 30); const resto = dias % 30;
  return resto ? `${meses} m ${resto} d` : `${meses} meses`;
}

// "junho de 2026" a partir de um timestamp (ms). Vazio se 0.
export function fmtTimestamp(ms) {
  if (!ms) return '';
  return new Date(ms).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' });
}

/* ===== Links externos (voos e mapas) — só construção de URL, sem API ===== */

// Links de busca de passagem para um trecho (origem → destino numa data).
// dataISO = 'YYYY-MM-DD'. iatas opcionais melhoram Skyscanner/Kayak.
export function linksVoo({ origemCidade, origemIata, destinoCidade, destinoIata, dataISO }) {
  const o = origemCidade || '';
  const d = destinoCidade || '';
  const q = `voos de ${o || 'qualquer lugar'} para ${d} em ${dataISO}`;
  const google = 'https://www.google.com/travel/flights?q=' + encodeURIComponent(q);
  let skyscanner = null, kayak = null;
  if (origemIata && destinoIata && dataISO) {
    const [y, m, day] = dataISO.split('-');
    const yymmdd = `${y.slice(2)}${m}${day}`;
    skyscanner = `https://www.skyscanner.com.br/transporte/voos/${origemIata.toLowerCase()}/${destinoIata.toLowerCase()}/${yymmdd}/`;
    kayak = `https://www.kayak.com.br/flights/${origemIata}-${destinoIata}/${dataISO}`;
  }
  return { google, skyscanner, kayak };
}

// Google Maps: busca por texto (cidade/país) ou por coordenadas [lng,lat].
export function linkMapaTexto(query) { return 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(query); }
export function linkMapaCoord(coords) { return coords ? `https://www.google.com/maps/search/?api=1&query=${coords[1]},${coords[0]}` : null; }

/* ===== Estimativa de voo por distância (sem API — só ordem de grandeza) ===== */
// Haversine entre [lng,lat] e [lng,lat] -> km.
export function distanciaKm(a, b) {
  if (!Array.isArray(a) || !Array.isArray(b)) return 0;
  const R = 6371, rad = Math.PI / 180;
  const dLat = (b[1] - a[1]) * rad, dLng = (b[0] - a[0]) * rad;
  const la1 = a[1] * rad, la2 = b[1] * rad;
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(la1) * Math.cos(la2) * Math.sin(dLng / 2) ** 2;
  return Math.round(2 * R * Math.asin(Math.min(1, Math.sqrt(h))));
}
// Faixa de preço de voo (USD) por distância: base + $/km com margem. NÃO é preço
// real — é ordem de grandeza pra ajudar a preencher "transporte". Arredonda em $5.
export function estimarPrecoVoo(km) {
  if (!km || km <= 0) return null;
  const min = Math.round((40 + 0.055 * km) / 5) * 5;
  const max = Math.round((60 + 0.12 * km) / 5) * 5;
  return { min, max, km };
}

export { MESES_PT };
