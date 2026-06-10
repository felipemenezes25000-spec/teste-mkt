import { AI_PROVIDERS, SYSTEM_PROMPT_OTIMIZADOR, SYSTEM_PROMPT_OPORTUNIDADES, SYSTEM_PROMPT_ROTEIRO, MESES_PT, MESES_PT_LONGO } from './data.js';
import { num } from './utils.js';
import { tokenAtual } from './supabase.js';

/* ===== Câmbio (FX) — API gratuita, sem chave, com timeout e degradação segura ===== */
// Dedup de chamadas concorrentes: várias instâncias de useCambioBRL montam juntas
// na mesma página (OQueFazer, PasseiosIngressos, ComoSeLocomove...) e, sem cache
// fresco, cada uma dispararia seu próprio fetch. Enquanto houver request em voo,
// todas compartilham a mesma Promise; ao terminar (ok ou erro), libera pra próxima.
let _cambioEmVoo = null;

export function buscarCambio() {
  if (_cambioEmVoo) return _cambioEmVoo;
  _cambioEmVoo = buscarCambioDireto().finally(() => { _cambioEmVoo = null; });
  return _cambioEmVoo;
}

async function buscarCambioDireto() {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), 15000);
  try {
    // base USD sempre; ratios independem da moeda base de exibição.
    const res = await fetch('https://open.er-api.com/v6/latest/USD', { signal: ctrl.signal });
    if (!res.ok) throw new Error('HTTP ' + res.status);
    const data = await res.json();
    if (data.result !== 'success' || !data.rates) throw new Error('Resposta de câmbio inválida.');
    return { base: 'USD', rates: data.rates, atualizadoEm: (data.time_last_update_unix || 0) * 1000 };
  } catch (err) {
    if (err.name === 'AbortError') throw new Error('Câmbio demorou demais (timeout).');
    if (err instanceof TypeError) throw new Error('Sem internet para atualizar o câmbio — usando taxas salvas.');
    throw err;
  } finally { clearTimeout(t); }
}

/* ===== Fotos + info de lugares — Wikipedia REST (grátis, sem chave, CORS aberto) ===== */
const _lugarCache = new Map(); // query -> Promise<{img, extract, url}> (dedup entre re-renders)

export function buscarLugar(query) {
  if (!query) return Promise.resolve(null);
  if (_lugarCache.has(query)) return _lugarCache.get(query);
  const p = (async () => {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), 12000);
    try {
      const url = 'https://pt.wikipedia.org/api/rest_v1/page/summary/' + encodeURIComponent(query.replace(/ /g, '_'));
      const res = await fetch(url, { signal: ctrl.signal, headers: { accept: 'application/json' } });
      if (!res.ok) throw new Error('HTTP ' + res.status);
      const d = await res.json();
      return {
        img: (d.thumbnail && d.thumbnail.source) || (d.originalimage && d.originalimage.source) || null,
        extract: d.extract || '',
        url: (d.content_urls && d.content_urls.desktop && d.content_urls.desktop.page) || null,
      };
    } catch (e) {
      return null; // degradação silenciosa: sem foto não quebra a UI
    } finally { clearTimeout(t); }
  })();
  _lugarCache.set(query, p);
  return p;
}

/* ===== IA — uma função de chamada, trocável de provedor ===== */

// Extrai JSON mesmo se o modelo embrulhar em ```json ... ``` ou texto solto.
export function extrairJSON(texto) {
  if (!texto) throw new Error('Resposta vazia da IA.');
  let s = texto.trim().replace(/^```(json)?/i, '').replace(/```$/i, '').trim();
  const ini = s.indexOf('{'); const fim = s.lastIndexOf('}');
  if (ini !== -1 && fim !== -1 && fim > ini) s = s.slice(ini, fim + 1);
  return JSON.parse(s);
}

export async function chamarLLM(ai, systemPrompt, userPrompt) {
  // Sem chave própria → usa o backend do servidor (ex.: Render), que guarda a
  // chave em variável de ambiente. Assim a IA funciona sem o usuário ter chave.
  if (!ai || !ai.apiKey) {
    const ctrlS = new AbortController();
    const tS = setTimeout(() => ctrlS.abort(), 60000);
    try {
      // IA do servidor exige login: manda o token do Supabase (se houver sessão).
      const token = await tokenAtual();
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'content-type': 'application/json', ...(token ? { authorization: `Bearer ${token}` } : {}) },
        body: JSON.stringify({ system: systemPrompt, user: userPrompt, model: ai && ai.model }),
        signal: ctrlS.signal,
      });
      if (res.status === 401) throw new Error('Entre pra usar a IA do servidor (ou cole sua chave em "IA / Config").');
      if (res.status === 429) { let d = {}; try { d = await res.json(); } catch (e) {} throw new Error(d.error || 'Você atingiu o limite diário de IA. Tente amanhã ou use sua própria chave.'); }
      if (res.status === 503) throw new Error('IA do servidor indisponível: configure a chave no servidor, ou cole a sua em "IA / Config".');
      if (!res.ok) { let d = {}; try { d = await res.json(); } catch (e) {} throw new Error(d.error || `Erro do servidor de IA (${res.status}).`); }
      const d = await res.json();
      return d.text || '';
    } catch (err) {
      if (err.name === 'AbortError') throw new Error('A IA demorou demais (timeout). Tente de novo.');
      if (err instanceof TypeError) throw new Error('Não consegui falar com o servidor de IA.');
      throw err;
    } finally { clearTimeout(tS); }
  }
  const ctrl = new AbortController();
  const timeout = setTimeout(() => ctrl.abort(), 60000);
  try {
    let url, headers, body, pickText;
    if (ai.provider === 'anthropic') {
      url = (ai.baseUrl || AI_PROVIDERS.anthropic.baseUrl).replace(/\/$/, '') + '/v1/messages';
      headers = {
        'content-type': 'application/json',
        'x-api-key': ai.apiKey,
        'anthropic-version': '2023-06-01',
        'anthropic-dangerous-direct-browser-access': 'true',
      };
      body = { model: ai.model, max_tokens: 1500, system: systemPrompt, messages: [{ role: 'user', content: userPrompt }] };
      pickText = (d) => (d.content || []).map(c => c.text).join('');
    } else {
      const base = (ai.baseUrl || AI_PROVIDERS.openai.baseUrl).replace(/\/$/, '');
      url = base + '/chat/completions';
      headers = { 'content-type': 'application/json', 'authorization': `Bearer ${ai.apiKey}` };
      body = {
        model: ai.model, temperature: 0.5,
        messages: [{ role: 'system', content: systemPrompt }, { role: 'user', content: userPrompt }],
      };
      if (ai.provider === 'openai') body.response_format = { type: 'json_object' };
      pickText = (d) => (d.choices && d.choices[0] && d.choices[0].message && d.choices[0].message.content) || '';
    }

    const res = await fetch(url, { method: 'POST', headers, body: JSON.stringify(body), signal: ctrl.signal });
    if (!res.ok) {
      let det = '';
      try { det = (await res.text()).slice(0, 300); } catch (e) {}
      throw new Error(`Provedor respondeu ${res.status}. ${det}`);
    }
    const data = await res.json();
    return pickText(data);
  } catch (err) {
    if (err.name === 'AbortError') throw new Error('A IA demorou demais (timeout). Tente de novo.');
    if (err instanceof TypeError) throw new Error('Falha de rede/CORS. Confira a chave, o endpoint e sua internet.');
    throw err;
  } finally { clearTimeout(timeout); }
}

export async function otimizarRota(plan, calc) {
  const payload = {
    dataInicioFixa: plan.settings.dataInicio,
    trechos: calc.trechos.map(t => ({
      id: t.id, pais: t.nome, regiao: t.regiao,
      diasPlanejados: t.dias, mesChegadaAtual: MESES_PT_LONGO[t.mesChegada - 1],
      melhoresMeses: (t.melhoresMeses || []).map(m => MESES_PT[m - 1]),
      vistoDiasPermitidos: t.vistoDias,
    })),
  };
  const userPrompt = `Reordene esta viagem. As datas de chegada mudam conforme a ordem (chegada = início + soma dos dias anteriores). Dados:\n${JSON.stringify(payload, null, 2)}`;
  const texto = await chamarLLM(plan.settings.ai, SYSTEM_PROMPT_OTIMIZADOR, userPrompt);
  const out = extrairJSON(texto);

  // "order" precisa ser uma permutação dos ids atuais. Salvamos o que der.
  const idsAtuais = plan.legs.map(l => l.id);
  let order = Array.isArray(out.order) ? out.order.filter(id => idsAtuais.includes(id)) : [];
  order = [...new Set(order)];
  for (const id of idsAtuais) if (!order.includes(id)) order.push(id);
  if (order.length !== idsAtuais.length) throw new Error('A IA devolveu uma ordem inválida. Tente novamente.');
  return { order, rationales: out.rationales || {}, resumo: out.resumo || '' };
}

export async function buscarOportunidades(ai, leg, moedaLabel) {
  const userPrompt = `País: ${leg.nome} (região: ${leg.regiao || 'n/d'}). Custo diário estimado atual: ${moedaLabel} ${leg.custoDia}. Use a moeda "${moedaLabel}" nas estimativas. Liste oportunidades realistas para baixar o custo diário.`;
  const texto = await chamarLLM(ai, SYSTEM_PROMPT_OPORTUNIDADES, userPrompt);
  const out = extrairJSON(texto);
  const lista = Array.isArray(out.oportunidades) ? out.oportunidades : [];
  return lista.slice(0, 4).map(o => ({
    tipo: String(o.tipo || 'Troca'),
    descricao: String(o.descricao || ''),
    economiaDiaEstimada: Math.max(0, Math.round(num(o.economiaDiaEstimada))),
    comoComecar: String(o.comoComecar || ''),
  }));
}

// Gera um roteiro dia a dia com IA. `ai` é o config do usuário (chave própria) ou
// {} → cai pro servidor (login). Sanitiza a saída pra a UI nunca quebrar.
export async function gerarRoteiro(params, ai) {
  const {
    destino, dias, orcamento, moeda = 'USD', ritmo = 'equilibrado',
    interesses = [], restricao = 'nenhuma', conforto = 'médio',
    companhia = 'casal', transporte = 'transporte público', inicioDia = '10:00',
    planoChuva = true,
  } = params || {};
  const userPrompt = [
    `Destino: ${destino}.`,
    `Dias: ${dias}.`,
    `Orçamento total aproximado (fora passagem internacional): ${moeda} ${orcamento}.`,
    `Ritmo: ${ritmo}.`,
    `Companhia: ${companhia}.`,
    `Transporte preferido: ${transporte}.`,
    `Começar os dias por volta de: ${inicioDia}.`,
    `Interesses: ${(interesses || []).join(', ') || 'variados'}.`,
    `Restrição alimentar: ${restricao || 'nenhuma'}.`,
    `Nível de conforto: ${conforto}.`,
    `Plano B de chuva: ${planoChuva ? 'sim, inclua alternativas cobertas por dia' : 'não obrigatório'}.`,
    `Use a moeda ${moeda} nas estimativas de custo. Monte exatamente ${dias} dia(s). Seja opinativo: diga quando uma escolha parece bonita no mapa, mas ruim na vida real.`,
  ].join(' ');

  const texto = await chamarLLM(ai, SYSTEM_PROMPT_ROTEIRO, userPrompt);
  return sanitizeRoteiro(extrairJSON(texto));
}

// Normaliza/saneia a saída crua da IA pra a UI nunca quebrar. Puro → testável.
export function sanitizeRoteiro(out) {
  out = out || {};
  const arr = (x) => (Array.isArray(x) ? x.map((v) => String(v)).filter(Boolean) : []);
  const dias = Array.isArray(out.dias)
    ? out.dias.map((d, i) => ({
        dia: Number(d && d.dia) || i + 1,
        titulo: String((d && d.titulo) || `Dia ${i + 1}`),
        itens: Array.isArray(d && d.itens)
          ? d.itens.map((it) => ({
              hora: String((it && it.hora) || ''),
              atividade: String((it && it.atividade) || ''),
              local: String((it && it.local) || ''),
              duracao: String((it && it.duracao) || ''),
              custo: String((it && it.custo) || ''),
              categoria: String((it && it.categoria) || ''),
              planoB: String((it && it.planoB) || ''),
              gratis: String((it && it.gratis) || ''),
              dica: String((it && it.dica) || ''),
            }))
          : [],
      }))
    : [];

  if (dias.length === 0) throw new Error('A IA não retornou um roteiro válido. Tente de novo.');

  return {
    resumo: String(out.resumo || ''),
    custoEstimado: String(out.custoEstimado || ''),
    dias,
    checklist: arr(out.checklist),
    documentos: arr(out.documentos),
    seguranca: arr(out.seguranca),
    economia: arr(out.economia),
  };
}
