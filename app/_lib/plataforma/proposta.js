// Propostas B2B (agências): itens com CUSTO interno + margem → preço ao cliente.
// Local-first (localStorage msf.propostas.v1) com espelho opcional no Supabase
// (tabela proposals; preço gerado no banco com a MESMA regra — testado).
export const CHAVE_PROPOSTAS = 'msf.propostas.v1';
export const TIPOS_ITEM = ['LODGING', 'FLIGHT', 'EXPERIENCE', 'TRANSFER', 'TICKET', 'INSURANCE', 'GUIDE', 'OTHER'];
export const MARGEM_MAX = 60;

const uid = (p) => `${p}_${Math.random().toString(36).slice(2, 9)}${Date.now().toString(36).slice(-4)}`;
const limpar = (s, n) => String(s || '').trim().slice(0, n);

/** Preço ao cliente — mesma regra do banco: round(custo * (1 + margem/100)). */
export function precoComMargem(custoMinor, margemPct) {
  const c = Math.max(0, Math.round(Number(custoMinor) || 0));
  // em pontos-base inteiros: evita 10 × 1.15 = 11.4999… (o banco usa numeric exato)
  const bp = Math.round(Math.min(MARGEM_MAX, Math.max(0, Number(margemPct) || 0)) * 100);
  return Math.round((c * (10000 + bp)) / 10000);
}

export function novaProposta(d = {}) {
  const titulo = limpar(d.titulo, 160);
  const cliente = limpar(d.clienteNome, 120);
  if (titulo.length < 2) throw new Error('Dê um título à proposta.');
  if (!cliente) throw new Error('Informe o nome do cliente.');
  if (d.inicio && d.fim && d.fim < d.inicio) throw new Error('A volta não pode ser antes da ida.');
  const email = limpar(d.clienteEmail, 160);
  if (email && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) throw new Error('E-mail do cliente inválido.');
  return {
    id: uid('prop'),
    titulo,
    clienteNome: cliente,
    clienteEmail: email,
    destinoCode: /^[A-Z]{2}$/.test(d.destinoCode || '') ? d.destinoCode : '',
    destinoNome: limpar(d.destinoNome, 80),
    inicio: d.inicio || '',
    fim: d.fim || '',
    pessoas: Math.max(1, Math.min(99, Number(d.pessoas) || 1)),
    moeda: /^[A-Z]{3}$/.test(d.moeda || '') ? d.moeda : 'BRL',
    margemPct: Math.min(MARGEM_MAX, Math.max(0, Number(d.margemPct ?? 12) || 0)),
    validaAte: d.validaAte || '',
    itens: [],
    status: 'rascunho',
    criadaEm: new Date().toISOString(),
  };
}

export function adicionarItemProposta(p, it = {}) {
  const titulo = limpar(it.titulo, 160);
  if (!titulo) throw new Error('Item sem título.');
  const custo = Math.round((Number(it.custo) || 0) * 100);
  if (custo < 0) throw new Error('Custo não pode ser negativo.');
  return {
    ...p,
    itens: [...p.itens, {
      id: uid('pit'), titulo, tipo: TIPOS_ITEM.includes(it.tipo) ? it.tipo : 'OTHER',
      dia: Math.max(1, Math.min(120, Number(it.dia) || 1)), descricao: limpar(it.descricao, 400), custoMinor: custo,
    }],
  };
}
export function removerItemProposta(p, id) { return { ...p, itens: p.itens.filter((i) => i.id !== id) }; }

export function totais(p) {
  const custoMinor = p.itens.reduce((s, i) => s + (i.custoMinor || 0), 0);
  const precoMinor = precoComMargem(custoMinor, p.margemPct);
  return { custoMinor, precoMinor, lucroMinor: precoMinor - custoMinor, porPessoaMinor: Math.round(precoMinor / Math.max(1, p.pessoas)) };
}

/** O que o CLIENTE FINAL vê: sem custo, margem, e-mail ou lucro. */
export function paraPublico(p, marca) {
  const { precoMinor } = totais(p);
  return {
    v: 1,
    titulo: p.titulo, cliente: p.clienteNome, destino: p.destinoCode, destinoNome: p.destinoNome,
    inicio: p.inicio, fim: p.fim, pessoas: p.pessoas, moeda: p.moeda, precoMinor, validaAte: p.validaAte,
    itens: p.itens.map((i) => ({ titulo: i.titulo, tipo: i.tipo, dia: i.dia, descricao: i.descricao })),
    marca: marca || null,
  };
}

// ---- link compartilhável sem servidor (dados no fragmento #, não vão ao servidor) ----
const MAX_LINK = 12000;
function b64urlEncode(str) {
  const bytes = new TextEncoder().encode(str);
  let bin = '';
  for (const b of bytes) bin += String.fromCharCode(b);
  return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}
function b64urlDecode(s) {
  const pad = s.replace(/-/g, '+').replace(/_/g, '/') + '==='.slice((s.length + 3) % 4);
  const bin = atob(pad);
  return new TextDecoder().decode(Uint8Array.from(bin, (c) => c.charCodeAt(0)));
}

export function codificarPublico(pub) {
  const s = b64urlEncode(JSON.stringify(pub));
  if (s.length > MAX_LINK) throw new Error('Proposta grande demais para link; salve na conta para gerar um link curto.');
  return s;
}

/** Decodifica e VALIDA (nada de HTML/URL arbitrária passa adiante). */
export function decodificarPublico(s) {
  if (!s || s.length > MAX_LINK || !/^[A-Za-z0-9_-]+$/.test(s)) return null;
  let o;
  try { o = JSON.parse(b64urlDecode(s)); } catch { return null; }
  if (!o || o.v !== 1 || typeof o.titulo !== 'string' || !Array.isArray(o.itens)) return null;
  const txt = (x, n) => (typeof x === 'string' ? x.slice(0, n) : '');
  return {
    titulo: txt(o.titulo, 160), cliente: txt(o.cliente, 120), destino: /^[A-Z]{2}$/.test(o.destino || '') ? o.destino : '',
    destinoNome: txt(o.destinoNome, 80), inicio: txt(o.inicio, 10), fim: txt(o.fim, 10),
    pessoas: Math.max(1, Math.min(99, Number(o.pessoas) || 1)), moeda: /^[A-Z]{3}$/.test(o.moeda || '') ? o.moeda : 'BRL',
    precoMinor: Math.max(0, Math.round(Number(o.precoMinor) || 0)), validaAte: txt(o.validaAte, 10),
    itens: o.itens.slice(0, 200).map((i) => ({ titulo: txt(i && i.titulo, 160), tipo: TIPOS_ITEM.includes(i && i.tipo) ? i.tipo : 'OTHER', dia: Math.max(1, Math.min(120, Number(i && i.dia) || 1)), descricao: txt(i && i.descricao, 400) })),
    marca: o.marca && typeof o.marca === 'object' ? o.marca : null,
  };
}

export function carregarPropostas(storage = typeof localStorage !== 'undefined' ? localStorage : null) {
  try {
    const raw = storage && storage.getItem(CHAVE_PROPOSTAS);
    const o = raw ? JSON.parse(raw) : null;
    return { marca: o && o.marca ? o.marca : {}, propostas: o && Array.isArray(o.propostas) ? o.propostas : [] };
  } catch {
    return { marca: {}, propostas: [] };
  }
}
export function salvarPropostas(estado, storage = typeof localStorage !== 'undefined' ? localStorage : null) {
  try { storage && storage.setItem(CHAVE_PROPOSTAS, JSON.stringify(estado)); return true; } catch { return false; }
}
