// Viagem "do momento" para a navegação móvel (atalho Hoje). Puro e testado.
const hojeISO = () => new Date().toISOString().slice(0, 10);
const somaDias = (iso, n) => { const d = new Date(iso + 'T00:00:00Z'); d.setUTCDate(d.getUTCDate() + n); return d.toISOString().slice(0, 10); };

/** Viagem "do momento": em curso, senão a próxima que começa em até 3 dias. */
export function viagemDoMomento(viagens, hoje = hojeISO()) {
  const lista = viagens || [];
  const emCurso = lista.find((v) => v.inicio <= hoje && v.fim >= hoje);
  if (emCurso) return emCurso;
  const limite = somaDias(hoje, 3);
  return [...lista].filter((v) => v.inicio > hoje && v.inicio <= limite).sort((a, b) => a.inicio.localeCompare(b.inicio))[0] || null;
}
