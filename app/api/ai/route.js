// Backend de IA (roda no servidor — ex.: Render/Vercel). A chave fica em variável
// de ambiente (OPENAI_API_KEY), NUNCA no navegador. Compatível com OpenAI/Groq/
// OpenRouter via AI_BASE_URL.
//
// PROTEÇÃO (decisão de produto): a IA do servidor SÓ funciona para usuários
// LOGADOS — o token do Supabase é verificado aqui. Assim, visitante anônimo (ou
// um curl direto) não queima os créditos. Quem não quer logar usa a própria chave
// (client-side, direto no navegador). Camada extra: cota diária por usuário
// (AI_DAILY_LIMIT) via RPC atômica no Postgres.
import { createClient } from '@supabase/supabase-js';
import { limitar } from '../../_lib/rateLimit.js';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const SUPA_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPA_ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const LIMITE_DIA = Math.max(0, parseInt(process.env.AI_DAILY_LIMIT || '50', 10) || 0);
const MODELOS_PERMITIDOS = new Set((process.env.AI_MODEL || 'gpt-4o-mini').split(',').map(s => s.trim()).concat(['gpt-4o-mini', 'gpt-4.1-mini', 'gpt-4.1-nano']));

function erro(msg, status) { return Response.json({ error: msg }, { status }); }

// Verifica o JWT do Supabase. Devolve { user, supa } (cliente já autenticado como
// o usuário, p/ a RPC de cota enxergar auth.uid()) ou { erro: Response } (401/503).
async function autenticar(req) {
  if (!SUPA_URL || !SUPA_ANON) return { erro: erro('Login não configurado no servidor.', 503) };
  const header = req.headers.get('authorization') || '';
  const token = header.toLowerCase().startsWith('bearer ') ? header.slice(7).trim() : '';
  if (!token) return { erro: erro('Faça login para usar a IA do servidor (ou cole sua chave em IA / Config).', 401) };
  const supa = createClient(SUPA_URL, SUPA_ANON, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: { headers: { Authorization: `Bearer ${token}` } },
  });
  const { data, error } = await supa.auth.getUser(token);
  if (error || !data || !data.user) return { erro: erro('Sessão inválida ou expirada. Entre de novo.', 401) };
  return { user: data.user, supa };
}

// Consome 1 unidade da cota diária. Fail-open se a RPC ainda não existe (migração
// não aplicada) — o login obrigatório já é a proteção principal.
async function dentroDaCota(supa) {
  if (!LIMITE_DIA) return true;
  try {
    const { data, error } = await supa.rpc('consumir_ia', { p_limite: LIMITE_DIA });
    if (error) { console.warn('[ai] cota indisponível (fail-open):', error.message); return true; }
    const row = Array.isArray(data) ? data[0] : data;
    return row ? Boolean(row.permitido) : true;
  } catch (e) {
    console.warn('[ai] cota erro (fail-open):', e && e.message);
    return true;
  }
}

export async function POST(req) {
  const bloqueio = limitar(req, 'ai', { limite: 20 });
  if (bloqueio) return bloqueio;
  const key = process.env.OPENAI_API_KEY;
  if (!key) return erro('IA não configurada no servidor.', 503);

  // 1) Exige login válido (proteção principal contra abuso anônimo).
  const auth = await autenticar(req);
  if (auth.erro) return auth.erro;

  // 2) Valida o corpo antes de consumir cota (não gasta cota com request inválido).
  let body;
  try { body = await req.json(); } catch { return erro('JSON inválido.', 400); }
  const { system, user, model } = body || {};
  if (!system || !user || typeof system !== 'string' || typeof user !== 'string') return erro('Faltam system/user (strings).', 400);
  if (system.length > 8000 || user.length > 12000) return erro('Prompt muito longo.', 400);
  const modeloFinal = (model && MODELOS_PERMITIDOS.has(model)) ? model : (process.env.AI_MODEL || 'gpt-4o-mini');

  // 3) Cota diária por usuário.
  if (!(await dentroDaCota(auth.supa))) {
    return erro(`Você atingiu o limite diário de IA (${LIMITE_DIA}/dia). Tente amanhã ou cole sua própria chave em IA / Config.`, 429);
  }

  // 4) Chama o provedor com a chave do servidor.
  const base = (process.env.AI_BASE_URL || 'https://api.openai.com/v1').replace(/\/$/, '');
  const ctrl = new AbortController();
  const timeout = setTimeout(() => ctrl.abort(), 60000);
  try {
    const res = await fetch(base + '/chat/completions', {
      method: 'POST',
      headers: { 'content-type': 'application/json', authorization: `Bearer ${key}` },
      body: JSON.stringify({
        model: modeloFinal,
        temperature: 0.5,
        messages: [{ role: 'system', content: system }, { role: 'user', content: user }],
      }),
      signal: ctrl.signal,
    });
    if (!res.ok) {
      return erro('O provedor de IA não conseguiu gerar a resposta.', 502);
    }
    const data = await res.json();
    const text = data?.choices?.[0]?.message?.content || '';
    return Response.json({ text });
  } catch (err) {
    const msg = err?.name === 'AbortError' ? 'A IA demorou demais (timeout).' : 'Falha ao chamar o provedor de IA.';
    return erro(msg, err?.name === 'AbortError' ? 504 : 502);
  } finally { clearTimeout(timeout); }
}
