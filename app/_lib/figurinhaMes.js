// Parte leve e pura das figurinhas (pode ir para o navegador: não importa o catálogo).
// Regra de segurança (decisão de produto): "hora certa" exige época boa no mês E
// índice de segurança ≥ 4; segurança ≤ 3 vira "Alerta de viagem" em qualquer mês.
export const MESES = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];
export const M3 = ['JAN', 'FEV', 'MAR', 'ABR', 'MAI', 'JUN', 'JUL', 'AGO', 'SET', 'OUT', 'NOV', 'DEZ'];

/** Faixas de meses bons em texto curto: [3,4,10,11] → "MAR-ABR OUT-NOV". `meses` em 1–12. */
export function faixaMeses(meses) {
  const vis = Array.from({ length: 12 }, (_, i) => meses.includes(i + 1));
  const ini = vis.indexOf(false);
  if (ini < 0) return 'ANO TODO';
  if (vis.indexOf(true) < 0) return '—';
  const res = []; let dentro = false; let a = 0;
  for (let t = 1; t <= 12; t++) {
    const i = (ini + t) % 12;
    if (vis[i] && !dentro) { dentro = true; a = i; }
    if (!vis[i] && dentro) { dentro = false; const b = (i + 11) % 12; res.push(a === b ? M3[a] : `${M3[a]}-${M3[b]}`); }
  }
  return res.join(' ');
}

/** Base da figurinha (independe do mês) → figurinha do mês `mes` (0–11). */
export function noMes(base, mes) {
  if (!base) return null;
  const epoca = base.meses.includes(mes + 1);
  return { ...base, epoca, bom: epoca && base.seguranca >= 4 };
}

/** Completa/corta para n caracteres (colunas do placar). */
export function pad(s, n) { s = String(s ?? '').slice(0, n); return s + ' '.repeat(Math.max(0, n - s.length)); }
