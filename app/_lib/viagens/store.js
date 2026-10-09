// Trip Workspace local-first (OMEGA V4 §31 / §76-G). As viagens vivem no
// dispositivo (localStorage, versão de esquema + migração) e funcionam offline;
// a sincronização com a conta (Supabase, tabelas trips/itinerary_items/…) é um
// adaptador separado. Funções PURAS (recebem/retornam estado) + persistência fina.
import { diasEntre } from '../../_domain/time.js';
import { transicionar } from '../../_domain/booking.js';

export const CHAVE = 'msf.viagens.v1';
export const VERSAO = 1;

export const TIPOS_RESERVA = {
  FLIGHT: 'Voo', LODGING: 'Hospedagem', EXPERIENCE: 'Experiência', TICKET: 'Ingresso', TRAIN: 'Trem', BUS: 'Ônibus',
  FERRY: 'Balsa', TRANSFER: 'Transfer', RESTAURANT: 'Restaurante', INSURANCE: 'Seguro', ESIM: 'eSIM', CAR: 'Carro', OTHER: 'Outro',
};
export const CATEGORIAS_DESPESA = {
  HOSPEDAGEM: 'Hospedagem', TRANSPORTE: 'Transporte', ALIMENTACAO: 'Alimentação', ATRACOES: 'Atrações',
  COMPRAS: 'Compras', SEGURO: 'Seguro', DOCUMENTOS: 'Documentos', COMUNICACAO: 'Comunicação', OUTROS: 'Outros',
};
export const TIPOS_DOC = { PASSAPORTE: 'Passaporte', VISTO: 'Visto', SEGURO: 'Seguro', VACINA: 'Vacina', VOUCHER: 'Voucher', INGRESSO: 'Ingresso', CNH: 'CNH internacional', OUTRO: 'Outro' };

export const uid = (p = 'id') => `${p}_${Math.random().toString(36).slice(2, 9)}${Date.now().toString(36).slice(-4)}`;

export function estadoVazio() { return { versao: VERSAO, viagens: [] }; }

export function carregar(storage = typeof localStorage !== 'undefined' ? localStorage : null) {
  if (!storage) return estadoVazio();
  try {
    const raw = storage.getItem(CHAVE);
    if (!raw) return estadoVazio();
    const s = JSON.parse(raw);
    return migrar(s);
  } catch { return estadoVazio(); }
}

export function salvar(estado, storage = typeof localStorage !== 'undefined' ? localStorage : null) {
  if (!storage) return false;
  try { storage.setItem(CHAVE, JSON.stringify(estado)); return true; } catch { return false; }
}

export function migrar(s) {
  if (!s || typeof s !== 'object' || !Array.isArray(s.viagens)) return estadoVazio();
  return { versao: VERSAO, viagens: s.viagens.map(normalizarViagem).filter(Boolean) };
}

function normalizarViagem(v) {
  if (!v || !v.id) return null;
  return {
    itens: [], reservas: [], despesas: [], documentos: [], checklist: [], notas: '', pessoas: 1, moeda: 'BRL', estado: 'PLANNING',
    ...v,
  };
}

/**
 * Cria uma viagem com dias gerados a partir das datas locais.
 * @param {{ titulo:string, destinoCode:string, destinoNome:string, inicio:string, fim:string, pessoas?:number, moeda?:string, orcamento?:number, timeZone?:string, origem?:string }} dados
 */
export function novaViagem(dados) {
  if (!dados.titulo || !dados.destinoCode) throw new Error('título e destino são obrigatórios');
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dados.inicio || '') || !/^\d{4}-\d{2}-\d{2}$/.test(dados.fim || '')) throw new Error('datas inválidas');
  if (dados.fim < dados.inicio) throw new Error('a volta não pode ser antes da ida');
  const dias = diasEntre(dados.inicio, dados.fim);
  if (dias.length > 120) throw new Error('viagem acima de 120 dias — divida em etapas');
  return normalizarViagem({
    id: uid('trip'),
    titulo: dados.titulo.trim().slice(0, 120),
    destinoCode: dados.destinoCode, destinoNome: dados.destinoNome,
    inicio: dados.inicio, fim: dados.fim, dias,
    pessoas: Math.max(1, Math.min(20, Number(dados.pessoas) || 1)),
    moeda: /^[A-Z]{3}$/.test(dados.moeda || '') ? dados.moeda : 'BRL',
    orcamento: Math.max(0, Number(dados.orcamento) || 0),
    timeZone: dados.timeZone || 'UTC',
    origem: dados.origem || 'São Paulo',
    criadaEm: new Date().toISOString(),
    estado: 'PLANNING',
  });
}

const mapViagem = (estado, id, fn) => ({ ...estado, viagens: estado.viagens.map((v) => (v.id === id ? { ...fn(v), atualizadaEm: new Date().toISOString() } : v)) });

export function adicionarViagem(estado, v) { return { ...estado, viagens: [v, ...estado.viagens] }; }
export function removerViagem(estado, id) { return { ...estado, viagens: estado.viagens.filter((v) => v.id !== id) }; }
export function atualizarViagem(estado, id, patch) { return mapViagem(estado, id, (v) => ({ ...v, ...patch })); }

// ---------- itinerário ----------
export function adicionarItem(estado, tripId, item) {
  const novo = {
    id: uid('item'), dia: item.dia, titulo: String(item.titulo || '').slice(0, 200), placeId: item.placeId || null,
    lat: Number.isFinite(item.lat) ? item.lat : null, lng: Number.isFinite(item.lng) ? item.lng : null,
    duracaoMin: Number(item.duracaoMin) || 90, abre: item.abre || '', fecha: item.fecha || '', fixoInicio: item.fixoInicio || '',
    reservaId: item.reservaId || null, custoEstimado: Number(item.custoEstimado) || 0, notas: item.notas || '',
  };
  if (!novo.titulo) throw new Error('item sem título');
  return mapViagem(estado, tripId, (v) => {
    if (!v.dias.includes(novo.dia)) throw new Error('dia fora da viagem');
    return { ...v, itens: [...v.itens, novo] };
  });
}
export function removerItem(estado, tripId, itemId) { return mapViagem(estado, tripId, (v) => ({ ...v, itens: v.itens.filter((i) => i.id !== itemId) })); }
export function atualizarItem(estado, tripId, itemId, patch) { return mapViagem(estado, tripId, (v) => ({ ...v, itens: v.itens.map((i) => (i.id === itemId ? { ...i, ...patch } : i)) })); }
export function itensDoDia(v, dia) { return v.itens.filter((i) => i.dia === dia); }
/** Reordena os itens de um dia conforme lista de ids (resultado do otimizador). */
export function reordenarDia(estado, tripId, dia, ids) {
  return mapViagem(estado, tripId, (v) => {
    const doDia = new Map(v.itens.filter((i) => i.dia === dia).map((i) => [i.id, i]));
    const novos = ids.map((id) => doDia.get(id)).filter(Boolean);
    const outros = v.itens.filter((i) => i.dia !== dia);
    return { ...v, itens: [...outros, ...novos] };
  });
}

// ---------- reservas (wallet) ----------
export function adicionarReserva(estado, tripId, r) {
  const base = {
    id: uid('res'), tipo: TIPOS_RESERVA[r.tipo] ? r.tipo : 'OTHER', provider: String(r.provider || '').slice(0, 120) || 'Fornecedor',
    localizador: String(r.localizador || '').slice(0, 120), modo: r.modo || 'DEEPLINK', status: 'DRAFT', history: [],
    preco: Number(r.preco) || 0, moeda: /^[A-Z]{3}$/.test(r.moeda || '') ? r.moeda : 'BRL',
    inicioLocal: r.inicioLocal || '', fimLocal: r.fimLocal || '', cancelamentoAte: r.cancelamentoAte || '', politica: r.politica || '', notas: r.notas || '',
  };
  // reserva informada pelo usuário (voucher/e-mail): passa por PENDING e vira
  // CONFIRMED rotulada como "informado por você" — nunca como verificada.
  let res = transicionar(base, 'PENDING_PROVIDER', { source: 'import_manual' });
  if (r.confirmada) res = transicionar(res, 'CONFIRMED', { source: 'import_manual' });
  return mapViagem(estado, tripId, (v) => ({ ...v, reservas: [...v.reservas, res] }));
}
export function mudarStatusReserva(estado, tripId, resId, para) {
  return mapViagem(estado, tripId, (v) => ({ ...v, reservas: v.reservas.map((r) => (r.id === resId ? transicionar(r, para, { source: 'import_manual' }) : r)) }));
}
export function removerReserva(estado, tripId, resId) { return mapViagem(estado, tripId, (v) => ({ ...v, reservas: v.reservas.filter((r) => r.id !== resId) })); }

// ---------- despesas ----------
export function adicionarDespesa(estado, tripId, d) {
  const valor = Number(d.valor);
  if (!(valor > 0)) throw new Error('valor deve ser maior que zero');
  const nova = {
    id: uid('desp'), valor, moeda: /^[A-Z]{3}$/.test(d.moeda || '') ? d.moeda : 'BRL',
    categoria: CATEGORIAS_DESPESA[d.categoria] ? d.categoria : 'OUTROS', descricao: String(d.descricao || '').slice(0, 300),
    data: d.data || new Date().toISOString().slice(0, 10), pagoPor: d.pagoPor || 'eu',
    taxa: Number(d.taxa) || null, taxaFonte: d.taxaFonte || null, taxaData: d.taxaData || null,
  };
  return mapViagem(estado, tripId, (v) => ({ ...v, despesas: [...v.despesas, nova] }));
}
export function removerDespesa(estado, tripId, id) { return mapViagem(estado, tripId, (v) => ({ ...v, despesas: v.despesas.filter((x) => x.id !== id) })); }

// ---------- documentos (metadados; arquivos ficam com o usuário) ----------
export function adicionarDocumento(estado, tripId, d) {
  const doc = { id: uid('doc'), tipo: TIPOS_DOC[d.tipo] ? d.tipo : 'OUTRO', titulo: String(d.titulo || '').slice(0, 160) || TIPOS_DOC[d.tipo] || 'Documento', validade: d.validade || '', titular: String(d.titular || '').slice(0, 80), notas: String(d.notas || '').slice(0, 500) };
  return mapViagem(estado, tripId, (v) => ({ ...v, documentos: [...v.documentos, doc] }));
}
export function removerDocumento(estado, tripId, id) { return mapViagem(estado, tripId, (v) => ({ ...v, documentos: v.documentos.filter((x) => x.id !== id) })); }

/** Alertas de documento: passaporte vencendo antes de 6 meses após a volta, etc. */
export function alertasDocumentos(v, hoje = new Date().toISOString().slice(0, 10)) {
  const out = [];
  const seisMeses = (iso) => { const d = new Date(iso + 'T00:00:00Z'); d.setUTCMonth(d.getUTCMonth() + 6); return d.toISOString().slice(0, 10); };
  for (const d of v.documentos) {
    if (!d.validade) continue;
    if (d.validade < hoje) out.push({ sev: 'CRITICO', doc: d, txt: `${d.titulo} está vencido (${d.validade}).` });
    else if (d.tipo === 'PASSAPORTE' && d.validade < seisMeses(v.fim)) out.push({ sev: 'ATENCAO', doc: d, txt: `${d.titulo} vence em ${d.validade} — muitos países exigem 6 meses de validade após a volta.` });
    else if (d.validade < v.fim) out.push({ sev: 'ATENCAO', doc: d, txt: `${d.titulo} vence durante a viagem (${d.validade}).` });
  }
  if (!v.documentos.some((d) => d.tipo === 'PASSAPORTE')) out.push({ sev: 'INFO', doc: null, txt: 'Cadastre a validade do passaporte para o Mundo Sem Fim checar a regra dos 6 meses.' });
  if (!v.documentos.some((d) => d.tipo === 'SEGURO') && !v.reservas.some((r) => r.tipo === 'INSURANCE')) out.push({ sev: 'INFO', doc: null, txt: 'Nenhum seguro-viagem registrado (obrigatório em Schengen e em vários países).' });
  return out;
}

/** Prontidão da viagem (0–100) com o que falta — métrica calculada, não decorativa. */
export function prontidao(v) {
  const checks = [
    { ok: v.itens.length > 0, txt: 'Montar o roteiro (pelo menos um lugar)', peso: 20 },
    { ok: v.reservas.some((r) => r.tipo === 'FLIGHT'), txt: 'Registrar o voo', peso: 20 },
    { ok: v.reservas.some((r) => r.tipo === 'LODGING'), txt: 'Registrar a hospedagem', peso: 20 },
    { ok: v.documentos.some((d) => d.tipo === 'PASSAPORTE'), txt: 'Cadastrar passaporte', peso: 15 },
    { ok: v.documentos.some((d) => d.tipo === 'SEGURO') || v.reservas.some((r) => r.tipo === 'INSURANCE'), txt: 'Seguro-viagem', peso: 15 },
    { ok: v.orcamento > 0, txt: 'Definir orçamento', peso: 10 },
  ];
  const nota = checks.reduce((s, c) => s + (c.ok ? c.peso : 0), 0);
  return { nota, faltando: checks.filter((c) => !c.ok) };
}
