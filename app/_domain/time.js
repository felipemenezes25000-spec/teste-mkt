// @ts-check
// Tempo e fuso (OMEGA V4 §38 / §76-G): instantes guardados em UTC; atividades
// descritas em hora LOCAL + IANA timezone. Conversões via Intl (sem libs), com DST.

/**
 * Offset (minutos) do fuso `timeZone` no instante `date` (positivo a leste de UTC).
 * @param {string} timeZone @param {Date} date
 */
export function offsetMinutos(timeZone, date) {
  const dtf = new Intl.DateTimeFormat('en-US', {
    timeZone, hourCycle: 'h23', year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', second: '2-digit',
  });
  const p = Object.fromEntries(dtf.formatToParts(date).map((x) => [x.type, x.value]));
  const comoUTC = Date.UTC(+p.year, +p.month - 1, +p.day, +p.hour, +p.minute, +p.second);
  return Math.round((comoUTC - date.getTime()) / 60000);
}

/** @param {string} tz */
export function fusoValido(tz) {
  try { new Intl.DateTimeFormat('en-US', { timeZone: tz }); return true; } catch { return false; }
}

/**
 * Converte data/hora LOCAL ("2026-03-29T09:00") num fuso para instante UTC ISO.
 * Em horário inexistente (salto de DST) avança para o primeiro instante válido;
 * em horário ambíguo (recuo de DST) escolhe a primeira ocorrência.
 * @param {string} local "YYYY-MM-DDTHH:mm"
 * @param {string} timeZone IANA
 */
export function localParaUTC(local, timeZone) {
  const m = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})/.exec(local);
  if (!m) throw new Error(`Data local inválida: ${local}`);
  if (!fusoValido(timeZone)) throw new Error(`Fuso inválido: ${timeZone}`);
  const alvo = Date.UTC(+m[1], +m[2] - 1, +m[3], +m[4], +m[5]);
  // duas iterações resolvem o offset mesmo perto de transições de DST
  let t = alvo - offsetMinutos(timeZone, new Date(alvo)) * 60000;
  t = alvo - offsetMinutos(timeZone, new Date(t)) * 60000;
  const volta = utcParaLocal(new Date(t).toISOString(), timeZone);
  if (volta.slice(0, 16) !== local.slice(0, 16)) {
    // gap de DST: o horário local não existe; empurra para depois do salto
    const depois = alvo - offsetMinutos(timeZone, new Date(t + 3 * 3600000)) * 60000;
    return new Date(Math.max(t, depois)).toISOString();
  }
  return new Date(t).toISOString();
}

/**
 * Instante UTC → "YYYY-MM-DDTHH:mm" no fuso.
 * @param {string} iso @param {string} timeZone
 */
export function utcParaLocal(iso, timeZone) {
  const dtf = new Intl.DateTimeFormat('en-CA', {
    timeZone, hourCycle: 'h23', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit',
  });
  const p = Object.fromEntries(dtf.formatToParts(new Date(iso)).map((x) => [x.type, x.value]));
  return `${p.year}-${p.month}-${p.day}T${p.hour}:${p.minute}`;
}

/**
 * Duração real entre dois horários locais em fusos possivelmente diferentes
 * (ex.: voo GRU 22:00 → NRT 05:30+2). Retorna minutos.
 * @param {{local:string,tz:string}} a @param {{local:string,tz:string}} b
 */
export function duracaoMinutos(a, b) {
  return Math.round((Date.parse(localParaUTC(b.local, b.tz)) - Date.parse(localParaUTC(a.local, a.tz))) / 60000);
}

/**
 * Lista de datas locais (YYYY-MM-DD) entre início e fim inclusive.
 * @param {string} inicio @param {string} fim
 */
export function diasEntre(inicio, fim) {
  const out = [];
  const a = Date.UTC(+inicio.slice(0, 4), +inicio.slice(5, 7) - 1, +inicio.slice(8, 10));
  const b = Date.UTC(+fim.slice(0, 4), +fim.slice(5, 7) - 1, +fim.slice(8, 10));
  for (let t = a; t <= b; t += 86400000) out.push(new Date(t).toISOString().slice(0, 10));
  return out;
}
