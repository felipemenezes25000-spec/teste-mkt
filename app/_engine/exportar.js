/* =============================================================================
   EXPORTAR — calendário (.ics) + Google Maps da rota
   ---------------------------------------------------------------------------
   Fecha o ciclo: a rota planejada vira eventos no seu calendário e uma rota
   desenhada no Google Maps. Funções PURAS (geram texto/URL) → testáveis; o
   download em si é um helper de browser no fim.
   ========================================================================== */

function fmtICSDate(d) {
  const x = d instanceof Date ? d : new Date(d);
  return `${x.getFullYear()}${String(x.getMonth() + 1).padStart(2, '0')}${String(x.getDate()).padStart(2, '0')}`;
}
// Escapa vírgula, ponto-e-vírgula, barra e quebra de linha (RFC 5545).
function escICS(s) {
  return String(s || '').replace(/[\\;,]/g, (m) => '\\' + m).replace(/\r?\n/g, '\\n');
}

// Calendário com um evento de dia inteiro por trecho (chegada → saída).
export function gerarICS(calc) {
  const trechos = (calc && calc.trechos) || [];
  const linhas = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Mundo Sem Fim//Roteiro//PT-BR', 'CALSCALE:GREGORIAN'];
  for (const t of trechos) {
    if (!t.chegada || !t.saida) continue;
    linhas.push('BEGIN:VEVENT');
    linhas.push(`UID:${escICS(t.id || t.code || t.nome)}@mundosemfim`);
    linhas.push(`DTSTART;VALUE=DATE:${fmtICSDate(t.chegada)}`);
    linhas.push(`DTEND;VALUE=DATE:${fmtICSDate(t.saida)}`);
    linhas.push(`SUMMARY:${escICS(`${t.nome} · ${t.dias} dia(s)`)}`);
    if (t.cidadePrincipal) linhas.push(`LOCATION:${escICS(t.cidadePrincipal)}`);
    const desc = [t.estacao && t.estacao.texto, t.visto && t.visto.texto].filter(Boolean).join(' ');
    if (desc) linhas.push(`DESCRIPTION:${escICS(desc)}`);
    linhas.push('END:VEVENT');
  }
  linhas.push('END:VCALENDAR');
  return linhas.join('\r\n');
}

// URL do Google Maps com a rota (origem + cidades dos trechos como waypoints).
export function linkMapaRota(plan) {
  const legs = (plan && plan.legs) || [];
  const pts = [];
  const origem = plan && plan.settings && plan.settings.origemCidade;
  if (origem) pts.push(origem);
  for (const l of legs) pts.push(l.cidadePrincipal || l.nome);
  const limpos = pts.filter(Boolean).map((p) => encodeURIComponent(p));
  if (limpos.length < 2) return null;
  return 'https://www.google.com/maps/dir/' + limpos.join('/');
}

// Helper de browser: baixa o .ics. (Fora das funções puras de propósito.)
export function baixarICS(calc, nome = 'roteiro-mundosemfim') {
  try {
    const blob = new Blob([gerarICS(calc)], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `${nome}.ics`;
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    return true;
  } catch { return false; }
}
