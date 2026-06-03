import { createClient } from '@supabase/supabase-js';

// Lê das variáveis de ambiente (NEXT_PUBLIC_*). Sem elas, o app funciona 100%
// em modo local (localStorage) — nada quebra. Com elas, a sincronização na
// nuvem é ativada.
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const supabaseConfigurado = Boolean(url && anon);
export const supabase = supabaseConfigurado ? createClient(url, anon, {
  auth: { persistSession: true, autoRefreshToken: true },
}) : null;

// ---- Auth (no-op seguro se não configurado) ----
export async function usuarioAtual() {
  if (!supabase) return null;
  const { data } = await supabase.auth.getUser();
  return data?.user || null;
}
// Token de acesso (JWT) da sessão atual — enviado ao /api/ai para autenticar.
export async function tokenAtual() {
  if (!supabase) return null;
  const { data } = await supabase.auth.getSession();
  return data?.session?.access_token || null;
}
export async function entrarComEmail(email) {
  if (!supabase) throw new Error('Supabase não configurado.');
  // signInWithOtp envia o magic link e cria a conta se o e-mail for novo.
  // IMPORTANTE: supabase-js devolve o erro em { error }, NÃO lança — então
  // precisamos checar e relançar, senão o erro passa despercebido.
  const { error } = await supabase.auth.signInWithOtp({ email });
  if (error) throw new Error(error.message || 'Falha ao enviar o link de acesso.');
}
export async function sair() { if (supabase) await supabase.auth.signOut(); }

// ---- Sync do plano (viagem + trechos) ----
// Estratégia: 1 viagem "ativa" por usuário no MVP. Carrega a da nuvem; se não
// houver, sobe a local. Salva (upsert) a cada mudança.
export async function carregarViagemNuvem(userId) {
  if (!supabase) return null;
  const { data: trips } = await supabase.from('trips').select('*').eq('user_id', userId).order('updated_at', { ascending: false }).limit(1);
  if (!trips || trips.length === 0) return null;
  const trip = trips[0];
  const { data: legs } = await supabase.from('trip_legs').select('*').eq('trip_id', trip.id).order('ordem');
  return { trip, legs: (legs || []).map(l => ({ id: l.id, ...l.dados })) };
}

export async function salvarViagemNuvem(userId, tripId, plan) {
  if (!supabase) return null;
  const s = plan.settings;
  const row = {
    user_id: userId, titulo: 'Minha viagem', moeda_base: s.moedaBase,
    orcamento: Number(s.orcamento) || 0, data_inicio: s.dataInicio || null,
    passaporte: s.passaporte, fx: s.fx || {},
    ai: { provider: s.ai?.provider, baseUrl: s.ai?.baseUrl, model: s.ai?.model }, // NUNCA salva apiKey
  };
  let id = tripId;
  if (id) {
    await supabase.from('trips').update(row).eq('id', id);
  } else {
    const { data } = await supabase.from('trips').insert(row).select('id').single();
    id = data?.id;
  }
  if (!id) return null;
  // Substitui as legs (simples e correto p/ MVP).
  await supabase.from('trip_legs').delete().eq('trip_id', id);
  if (plan.legs.length) {
    await supabase.from('trip_legs').insert(plan.legs.map((l, i) => {
      const { id: _omit, ...dados } = l;
      return { trip_id: id, ordem: i, code: l.code || null, dados };
    }));
  }
  return id;
}
