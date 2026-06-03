import { AI_PROVIDERS, SYSTEM_PROMPT_OTIMIZADOR, SYSTEM_PROMPT_OPORTUNIDADES, MESES_PT, MESES_PT_LONGO } from './data.js';
import { num } from './utils.js';

/* ===== Câmbio (FX) — API gratuita, sem chave, com timeout e degradação segura ===== */
export async function buscarCambio() {
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
      const res = await fetch('/api/ai', {
        method: 'POST', headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ system: systemPrompt, user: userPrompt, model: ai && ai.model }),
        signal: ctrlS.signal,
      });
      if (res.status === 503) throw new Error('Sem chave de IA: configure no servidor (Render) ou cole a sua em "IA / Config".');
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
