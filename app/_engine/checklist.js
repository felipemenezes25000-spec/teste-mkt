// ─────────────────────────────────────────────────────────────────────────────
// CHECKLIST DE PREPARATIVOS — derivado da rota (vistos/comprovante por país) +
// itens universais seguros. Não afirma dado médico: vacina aponta pra fonte
// oficial. O "feito" persiste por id estável (não some ao reordenar a rota).
// ─────────────────────────────────────────────────────────────────────────────
export const CHECKLIST_KEY = 'mundosemfim.checklist.v1';

export function carregarCheck() {
  try { const o = JSON.parse(localStorage.getItem(CHECKLIST_KEY) || '{}'); return (o && typeof o === 'object') ? o : {}; }
  catch (e) { return {}; }
}
export function salvarCheck(map) {
  try { localStorage.setItem(CHECKLIST_KEY, JSON.stringify(map || {})); } catch (e) {}
}

export function gerarChecklist(plan) {
  const grupos = [];

  grupos.push({
    titulo: 'Documentos & seguro',
    itens: [
      { id: 'doc-passaporte', texto: 'Passaporte com 6+ meses de validade na data da volta' },
      { id: 'doc-seguro', texto: 'Seguro viagem com cobertura médica internacional' },
      { id: 'doc-copias', texto: 'Cópias digitais de passaporte, vistos e seguro (nuvem + offline)' },
      { id: 'doc-vacina', texto: 'Cartão de vacinação — confira as exigências de cada país na fonte oficial (ANVISA/embaixada)' },
      { id: 'doc-pagamento', texto: 'Meios de pagamento: cartão internacional + algum dinheiro local' },
    ],
  });

  const porPais = [];
  (plan.legs || []).forEach((l) => {
    const nome = l.nome || 'país';
    if (l.vistoTipo && l.vistoTipo !== 'isento') {
      porPais.push({ id: `visto-${l.id}`, texto: `Visto de ${nome}: ${l.vistoTipo}${l.vistoDias ? ` (até ${l.vistoDias} dias)` : ''}${l.vistoExtensao ? ' — extensão possível' : ''}` });
    } else {
      porPais.push({ id: `visto-${l.id}`, texto: `${nome}: confirme o limite de dias${l.vistoDias ? ` (${l.vistoDias}d)` : ''} e a regra do seu passaporte na fonte oficial` });
    }
    if (l.vistoComprovanteSaida) porPais.push({ id: `onward-${l.id}`, texto: `Comprovante de saída de ${nome} (passagem de volta/onward)` });
  });
  if (porPais.length) grupos.push({ titulo: 'Vistos & entrada (pela sua rota)', itens: porPais });

  grupos.push({
    titulo: 'Antes de embarcar',
    itens: [
      { id: 'prep-chip', texto: 'Chip/eSIM internacional ou plano de dados' },
      { id: 'prep-saude', texto: 'Check-up médico/odontológico e remédios de uso contínuo' },
      { id: 'prep-clima', texto: 'Roupas certas para a estação de cada trecho (veja o diagnóstico de estação)' },
    ],
  });

  return grupos;
}
