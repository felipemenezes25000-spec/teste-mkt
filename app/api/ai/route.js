// Backend de IA (roda no servidor — ex.: Render). A chave fica em variável de
// ambiente (OPENAI_API_KEY), NUNCA no navegador. Compatível com OpenAI/Groq/
// OpenRouter via AI_BASE_URL. Assim o usuário final usa a IA sem chave própria.
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req) {
  const key = process.env.OPENAI_API_KEY;
  if (!key) {
    return Response.json({ error: 'IA não configurada no servidor.' }, { status: 503 });
  }

  let body;
  try { body = await req.json(); } catch { return Response.json({ error: 'JSON inválido.' }, { status: 400 }); }
  const { system, user, model } = body || {};
  if (!system || !user) return Response.json({ error: 'Faltam system/user.' }, { status: 400 });

  const base = (process.env.AI_BASE_URL || 'https://api.openai.com/v1').replace(/\/$/, '');
  const ctrl = new AbortController();
  const timeout = setTimeout(() => ctrl.abort(), 60000);
  try {
    const res = await fetch(base + '/chat/completions', {
      method: 'POST',
      headers: { 'content-type': 'application/json', authorization: `Bearer ${key}` },
      body: JSON.stringify({
        model: model || process.env.AI_MODEL || 'gpt-4o-mini',
        temperature: 0.5,
        messages: [{ role: 'system', content: system }, { role: 'user', content: user }],
      }),
      signal: ctrl.signal,
    });
    if (!res.ok) {
      const t = await res.text().catch(() => '');
      return Response.json({ error: `Provedor respondeu ${res.status}. ${t.slice(0, 200)}` }, { status: 502 });
    }
    const data = await res.json();
    const text = data?.choices?.[0]?.message?.content || '';
    return Response.json({ text });
  } catch (err) {
    const msg = err?.name === 'AbortError' ? 'A IA demorou demais (timeout).' : 'Falha ao chamar o provedor de IA.';
    return Response.json({ error: msg }, { status: 502 });
  } finally { clearTimeout(timeout); }
}
