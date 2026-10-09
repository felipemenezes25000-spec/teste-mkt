'use client';
import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase, supabaseConfigurado, usuarioAtual } from '../../_engine/supabase.js';
import { useIdioma } from '../../_lib/i18n.js';
import { fmtMinor, repasse } from '../../_lib/plataforma/produtos.js';
import { destinoPorCode } from '../../_lib/destinos.js';
import { BotaoCheckout } from '../../_components/BotaoCheckout.jsx';
import { Tabs } from '../../_ui/Tabs.jsx';
import { Icon } from '../../_ui/Icon.jsx';
import { useViagens } from '../../_lib/viagens/useViagens.js';
import { slugify } from '../../_lib/slug.js';

const field = 'w-full h-10 px-3 rounded-lg border border-line bg-input text-ink text-sm focusring';
const lbl = 'block text-xs font-medium text-inksoft';

// Parte "viva" do marketplace: roteiros da comunidade, consultores, pedidos e o
// painel do criador. Tudo vem do Supabase com RLS; sem servidor configurado, a
// página explica isso em vez de mostrar vitrine falsa.
export function MarketplaceClient() {
  const { t, tf, locale } = useIdioma();
  const [aba, setAba] = useState('comunidade');
  const [user, setUser] = useState(null);
  const [roteiros, setRoteiros] = useState(null);
  const [consultores, setConsultores] = useState(null);
  const [perfil, setPerfil] = useState(null);
  const [erro, setErro] = useState('');

  const carregar = useCallback(async () => {
    if (!supabase) { setRoteiros([]); setConsultores([]); return; }
    const u = await usuarioAtual().catch(() => null);
    setUser(u);
    const [r, c, p] = await Promise.all([
      supabase.from('creator_itineraries').select('id,slug,titulo,destino_code,dias,resumo,preco_minor,moeda,autor_id,creator_profiles(nome_publico,slug,verificado)').eq('status', 'publicado').order('publicado_em', { ascending: false }).limit(60),
      supabase.from('creator_profiles').select('user_id,slug,nome_publico,bio,especialidades,idiomas,consultoria_preco_minor,moeda,verificado,tipos').contains('tipos', ['consultor']).eq('ativo', true).limit(60),
      u ? supabase.from('creator_profiles').select('*').eq('user_id', u.id).maybeSingle() : Promise.resolve({ data: null }),
    ]);
    if (r.error || c.error) setErro(t('plat.erroCarregar'));
    setRoteiros(r.data || []);
    setConsultores(c.data || []);
    setPerfil(p.data || null);
  }, [t]);

  useEffect(() => {
    const p = new URLSearchParams(window.location.search).get('aba');
    if (p && ['comunidade', 'consultores', 'painel'].includes(p)) setAba(p); // eslint-disable-line react-hooks/set-state-in-effect
    carregar();
  }, [carregar]);

  const abas = [
    { id: 'comunidade', label: t('plat.abaComunidade'), icon: '🧭' },
    { id: 'consultores', label: t('plat.abaConsultores'), icon: '🧑‍💼' },
    { id: 'painel', label: t('plat.abaPainel'), icon: '🛠️' },
  ];

  return (
    <section className="mt-12" aria-labelledby="comunidade-h">
      <h2 id="comunidade-h" className="sr-only">{t('plat.abaComunidade')}</h2>
      <Tabs tabs={abas} value={aba} onChange={setAba} />
      {!supabaseConfigurado && (
        <p className="mt-4 rounded-xl border border-line bg-paper2/60 px-4 py-3 text-sm text-inksoft flex gap-2">
          <Icon name="info" size={17} /> {t('plat.semServidor')}
        </p>
      )}
      {erro && <p role="alert" className="mt-4 text-sm text-danger">{erro}</p>}

      {aba === 'comunidade' && (
        <div className="mt-6">
          {roteiros === null ? <p className="text-sm text-inksoft">{t('plat.carregando')}</p> : roteiros.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-line bg-card p-8 text-center">
              <p className="font-semibold text-ink">{t('plat.semComunidade')}</p>
              <p className="mt-1 text-sm text-inksoft max-w-md mx-auto">{t('plat.semComunidadeP')}</p>
              <button type="button" onClick={() => setAba('painel')} className="mt-4 inline-flex items-center gap-2 h-10 px-4 rounded-full bg-ink text-white text-[15px] font-cond font-extrabold uppercase tracking-[.05em] focusring"><Icon name="plus" size={16} /> {t('plat.publicar')}</button>
            </div>
          ) : (
            <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {roteiros.map((r) => (
                <li key={r.id} className="rounded-2xl border border-line bg-card p-4 flex flex-col">
                  <div className="font-mono text-[11px] text-inksoft">{(destinoPorCode(r.destino_code) || {}).nome || r.destino_code} · {r.dias} {t('plat.dias')}</div>
                  <h3 className="mt-1 font-display text-lg text-ink">{r.titulo}</h3>
                  <p className="mt-1 text-sm text-inksoft line-clamp-3 flex-1">{r.resumo}</p>
                  <p className="mt-3 text-xs text-inksoft">{t('plat.por')} {r.creator_profiles ? r.creator_profiles.nome_publico : '—'}{r.creator_profiles && r.creator_profiles.verificado ? ` · ${t('plat.verificado')}` : ''}</p>
                  <div className="mt-3 flex items-center justify-between gap-2">
                    <span className="font-mono text-sm text-ink">{r.preco_minor ? fmtMinor(r.preco_minor, r.moeda, locale) : t('plat.gratis')}</span>
                    <Link href={`/marketplace/c/${r.slug}`} className="text-sm text-pine font-medium hover:underline focusring rounded">{t('plat.ver')}</Link>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {aba === 'consultores' && <Consultores consultores={consultores} user={user} t={t} tf={tf} locale={locale} />}
      {aba === 'painel' && <Painel user={user} perfil={perfil} recarregar={carregar} t={t} tf={tf} locale={locale} />}
    </section>
  );
}

function Consultores({ consultores, user, t, locale }) {
  const [alvo, setAlvo] = useState(null);
  const [msg, setMsg] = useState('');
  const [meus, setMeus] = useState([]);

  const carregarMeus = useCallback(async () => {
    if (!supabase || !user) return;
    const { data } = await supabase.from('consult_requests').select('id,status,preco_minor,moeda,destino_code,created_at,consultor_id,creator_profiles(nome_publico)').eq('cliente_id', user.id).order('created_at', { ascending: false });
    setMeus(data || []);
  }, [user]);
  useEffect(() => { carregarMeus(); }, [carregarMeus]);

  async function pedir(e) {
    e.preventDefault();
    const f = Object.fromEntries(new FormData(e.currentTarget));
    setMsg('');
    const { error } = await supabase.from('consult_requests').insert({
      consultor_id: alvo.user_id, mensagem: String(f.mensagem || '').trim(), destino_code: f.destino || null,
      data_inicio: f.inicio || null, data_fim: f.fim || null,
    });
    if (error) { setMsg(error.message); return; }
    setAlvo(null); setMsg(t('plat.pedidoEnviado'));
    carregarMeus();
  }

  if (consultores === null) return <p className="mt-6 text-sm text-inksoft">{t('plat.carregando')}</p>;
  return (
    <div className="mt-6 space-y-6">
      {msg && <p role="status" className="text-sm text-success">{msg}</p>}
      {meus.length > 0 && (
        <div className="rounded-2xl border border-line bg-card p-4">
          <h3 className="eyebrow mb-3">{t('plat.meusPedidos')}</h3>
          <ul className="divide-y divide-line">
            {meus.map((p) => (
              <li key={p.id} className="py-3 flex flex-wrap items-center justify-between gap-3 text-sm">
                <span className="text-ink">{p.creator_profiles ? p.creator_profiles.nome_publico : '—'} · {p.destino_code || '—'}</span>
                <span className="font-mono text-xs text-inksoft">{t(`plat.st_${p.status}`)}{p.preco_minor ? ` · ${fmtMinor(p.preco_minor, p.moeda, locale)}` : ''}</span>
                {p.status === 'aceita' && <div className="w-full sm:w-56"><BotaoCheckout produto="consultoria" id={p.id} rotulo={t('plat.pagarConsultoria')} /></div>}
              </li>
            ))}
          </ul>
        </div>
      )}
      {consultores.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-line bg-card p-8 text-center">
          <p className="font-semibold text-ink">{t('plat.semConsultores')}</p>
          <p className="mt-1 text-sm text-inksoft max-w-md mx-auto">{t('plat.semConsultoresP')}</p>
        </div>
      ) : (
        <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {consultores.map((c) => (
            <li key={c.user_id} className="rounded-2xl border border-line bg-card p-4 flex flex-col">
              <h3 className="font-display text-lg text-ink">{c.nome_publico}{c.verificado && <span className="ml-2 align-middle text-[11px] font-mono text-success">{t('plat.verificado')}</span>}</h3>
              <p className="mt-1 text-sm text-inksoft line-clamp-4 flex-1">{c.bio || '—'}</p>
              {c.especialidades && c.especialidades.length > 0 && <p className="mt-2 text-xs text-inksoft">{c.especialidades.join(' · ')}</p>}
              <p className="mt-3 font-mono text-sm text-ink">{c.consultoria_preco_minor ? `${t('plat.aPartir')} ${fmtMinor(c.consultoria_preco_minor, c.moeda, locale)}` : t('plat.precoCombinar')}</p>
              {user && user.id !== c.user_id
                ? <button type="button" onClick={() => setAlvo(c)} className="mt-3 h-10 rounded-full bg-ink text-white text-[15px] font-cond font-extrabold uppercase tracking-[.05em] focusring">{t('plat.pedirConsultoria')}</button>
                : !user && <Link href="/conta" className="mt-3 text-sm text-pine hover:underline focusring rounded">{t('plat.entrarPedir')}</Link>}
            </li>
          ))}
        </ul>
      )}
      {alvo && (
        <form onSubmit={pedir} className="rounded-2xl border border-pine/40 bg-card p-5 grid sm:grid-cols-2 gap-3" aria-label={t('plat.pedirConsultoria')}>
          <p className="sm:col-span-2 font-semibold text-ink">{t('plat.pedirPara')} {alvo.nome_publico}</p>
          <label className={lbl}>{t('plat.destinoCod')}<input name="destino" maxLength={2} pattern="[A-Z]{2}" placeholder="JP" className={`${field} mt-1 uppercase`} /></label>
          <div className="grid grid-cols-2 gap-2">
            <label className={lbl}>{t('viag.ida')}<input name="inicio" type="date" className={`${field} mt-1`} /></label>
            <label className={lbl}>{t('viag.volta')}<input name="fim" type="date" className={`${field} mt-1`} /></label>
          </div>
          <label className={`${lbl} sm:col-span-2`}>{t('plat.mensagem')}<textarea name="mensagem" required minLength={10} maxLength={2000} rows={4} className={`${field} mt-1 h-auto py-2`} /></label>
          <p className="sm:col-span-2 text-xs text-inksoft">{t('plat.fluxoConsulta')}</p>
          <div className="sm:col-span-2 flex gap-2">
            <button type="submit" className="h-10 px-4 rounded-full bg-coral text-oncoral font-cond font-extrabold uppercase tracking-[.05em] focusring">{t('plat.enviarPedido')}</button>
            <button type="button" onClick={() => setAlvo(null)} className="h-10 px-4 rounded-lg border border-line text-ink focusring">{t('ws.fecharP')}</button>
          </div>
        </form>
      )}
    </div>
  );
}

function Painel({ user, perfil, recarregar, t, locale }) {
  const { estado } = useViagens();
  const [msg, setMsg] = useState('');
  const [pedidos, setPedidos] = useState([]);
  const [meus, setMeus] = useState([]);
  const [vendas, setVendas] = useState([]);

  const carregar = useCallback(async () => {
    if (!supabase || !user || !perfil) return;
    const [p, r, v] = await Promise.all([
      supabase.from('consult_requests').select('*').eq('consultor_id', user.id).order('created_at', { ascending: false }),
      supabase.from('creator_itineraries').select('id,slug,titulo,status,preco_minor,moeda').eq('autor_id', user.id).order('created_at', { ascending: false }),
      supabase.from('purchases').select('id,produto,valor_minor,moeda,taxa_plataforma_minor,pago_em').eq('vendedor_id', user.id).eq('status', 'pago'),
    ]);
    setPedidos(p.data || []); setMeus(r.data || []); setVendas(v.data || []);
  }, [user, perfil]);
  useEffect(() => { carregar(); }, [carregar]);

  if (!supabaseConfigurado) return <p className="mt-6 text-sm text-inksoft">{t('plat.semServidor')}</p>;
  if (!user) return <p className="mt-6 text-sm text-inksoft">{t('plat.entrarPainel')} <Link href="/conta" className="text-pine underline">{t('ws.entrar')}</Link></p>;

  async function salvarPerfil(e) {
    e.preventDefault();
    const f = Object.fromEntries(new FormData(e.currentTarget));
    const tipos = ['criador', ...(f.consultor ? ['consultor'] : [])];
    const linha = {
      user_id: user.id, slug: slugify(f.slug || f.nome).slice(0, 40), nome_publico: String(f.nome).trim(), bio: String(f.bio || '').trim() || null,
      tipos, especialidades: String(f.especialidades || '').split(',').map((x) => x.trim()).filter(Boolean).slice(0, 8),
      consultoria_preco_minor: f.consultor && f.preco ? Math.round(Number(f.preco) * 100) : null,
    };
    const { error } = await supabase.from('creator_profiles').upsert(linha, { onConflict: 'user_id' });
    setMsg(error ? error.message : t('plat.perfilSalvo'));
    if (!error) recarregar();
  }

  async function publicar(e) {
    e.preventDefault();
    const f = Object.fromEntries(new FormData(e.currentTarget));
    const v = estado && estado.viagens.find((x) => x.id === f.viagem);
    if (!v) { setMsg(t('plat.escolhaViagem')); return; }
    const dias = v.dias.map((d, i) => ({ dia: i + 1, itens: v.itens.filter((it) => it.dia === d).map((it) => ({ titulo: it.titulo, placeId: it.placeId, lat: it.lat, lng: it.lng, duracaoMin: it.duracaoMin, notas: it.notas || '' })) }));
    if (!dias.some((d) => d.itens.length)) { setMsg(t('plat.viagemVazia')); return; }
    const slug = `${slugify(f.titulo || v.titulo).slice(0, 60)}-${Math.random().toString(36).slice(2, 6)}`;
    const { data, error } = await supabase.from('creator_itineraries').insert({
      autor_id: user.id, slug, titulo: String(f.titulo || v.titulo).trim(), destino_code: v.destinoCode, dias: v.dias.length,
      resumo: String(f.resumo || '').trim(), preco_minor: Math.round((Number(f.preco) || 0) * 100), moeda: 'BRL', status: 'publicado', publicado_em: new Date().toISOString(),
    }).select('id').single();
    if (error) { setMsg(error.message); return; }
    const c = await supabase.from('creator_itinerary_content').insert({ itinerary_id: data.id, dias });
    setMsg(c.error ? c.error.message : t('plat.publicado'));
    carregar();
  }

  async function responder(p, status) {
    let preco = null;
    if (status === 'aceita') {
      const v = window.prompt(t('plat.precoPrompt'), perfil && perfil.consultoria_preco_minor ? String(perfil.consultoria_preco_minor / 100) : '');
      if (!v) return;
      preco = Math.round(Number(String(v).replace(',', '.')) * 100);
      if (!Number.isFinite(preco) || preco <= 0) return;
    }
    const { error } = await supabase.from('consult_requests').update(status === 'aceita' ? { status, preco_minor: preco } : { status }).eq('id', p.id);
    setMsg(error ? error.message : t('plat.atualizado'));
    carregar();
  }

  const totalVendas = vendas.reduce((s, x) => s + x.valor_minor, 0);
  return (
    <div className="mt-6 grid lg:grid-cols-2 gap-6">
      {msg && <p role="status" className="lg:col-span-2 text-sm text-ink">{msg}</p>}
      <form onSubmit={salvarPerfil} className="rounded-2xl border border-line bg-card p-5 space-y-3">
        <h3 className="font-display text-xl text-ink">{perfil ? t('plat.seuPerfil') : t('plat.virarCriador')}</h3>
        <label className={lbl}>{t('plat.nomePublico')}<input name="nome" required minLength={2} maxLength={80} defaultValue={perfil ? perfil.nome_publico : ''} className={`${field} mt-1`} /></label>
        <label className={lbl}>{t('plat.endereco')}<input name="slug" maxLength={40} defaultValue={perfil ? perfil.slug : ''} placeholder="ana-viaja" className={`${field} mt-1`} /></label>
        <label className={lbl}>{t('plat.bio')}<textarea name="bio" maxLength={1200} rows={3} defaultValue={perfil ? perfil.bio || '' : ''} className={`${field} mt-1 h-auto py-2`} /></label>
        <label className={lbl}>{t('plat.especialidades')}<input name="especialidades" defaultValue={perfil ? (perfil.especialidades || []).join(', ') : ''} placeholder="Japão, lua de mel, mochilão" className={`${field} mt-1`} /></label>
        <label className="flex items-center gap-2 text-sm text-ink"><input name="consultor" type="checkbox" defaultChecked={perfil ? (perfil.tipos || []).includes('consultor') : false} /> {t('plat.ofereco')}</label>
        <label className={lbl}>{t('plat.precoBase')}<input name="preco" type="number" min="0" step="1" defaultValue={perfil && perfil.consultoria_preco_minor ? perfil.consultoria_preco_minor / 100 : ''} className={`${field} mt-1`} /></label>
        <p className="text-xs text-inksoft">{t('plat.taxaInfo')}</p>
        <button type="submit" className="h-10 px-4 rounded-full bg-ink text-white text-[15px] font-cond font-extrabold uppercase tracking-[.05em] focusring">{t('ws.salvar')}</button>
      </form>

      {perfil && (
        <div className="space-y-6">
          <form onSubmit={publicar} className="rounded-2xl border border-line bg-card p-5 space-y-3">
            <h3 className="font-display text-xl text-ink">{t('plat.publicar')}</h3>
            <label className={lbl}>{t('plat.daViagem')}<select name="viagem" required className={`${field} mt-1`}>
              <option value="">—</option>
              {(estado ? estado.viagens : []).map((v) => <option key={v.id} value={v.id}>{v.titulo} · {v.dias.length} {t('plat.dias')}</option>)}
            </select></label>
            <label className={lbl}>{t('ws.titulo')}<input name="titulo" minLength={4} maxLength={140} className={`${field} mt-1`} /></label>
            <label className={lbl}>{t('plat.resumo')}<textarea name="resumo" required minLength={20} maxLength={600} rows={3} className={`${field} mt-1 h-auto py-2`} /></label>
            <label className={lbl}>{t('plat.precoRoteiro')}<input name="preco" type="number" min="0" step="1" defaultValue="0" className={`${field} mt-1`} /></label>
            <button type="submit" className="h-10 px-4 rounded-full bg-coral text-oncoral text-[15px] font-cond font-extrabold uppercase tracking-[.05em] focusring">{t('plat.publicarBtn')}</button>
          </form>
          <div className="rounded-2xl border border-line bg-card p-5">
            <h3 className="eyebrow mb-2">{t('plat.vendas')}</h3>
            <p className="font-mono text-ink">{fmtMinor(totalVendas, 'BRL', locale)} · {t('plat.repasse')} {fmtMinor(repasse(totalVendas), 'BRL', locale)}</p>
            <p className="mt-1 text-xs text-inksoft">{t('plat.repasseInfo')}</p>
            {meus.length > 0 && <ul className="mt-3 text-sm divide-y divide-line">{meus.map((r) => <li key={r.id} className="py-2 flex justify-between gap-2"><Link href={`/marketplace/c/${r.slug}`} className="text-pine hover:underline focusring rounded">{r.titulo}</Link><span className="font-mono text-xs text-inksoft">{r.preco_minor ? fmtMinor(r.preco_minor, r.moeda, locale) : t('plat.gratis')}</span></li>)}</ul>}
          </div>
          {(perfil.tipos || []).includes('consultor') && (
            <div className="rounded-2xl border border-line bg-card p-5">
              <h3 className="eyebrow mb-2">{t('plat.pedidosRecebidos')}</h3>
              {pedidos.length === 0 ? <p className="text-sm text-inksoft">{t('plat.semPedidos')}</p> : (
                <ul className="divide-y divide-line">
                  {pedidos.map((p) => (
                    <li key={p.id} className="py-3 text-sm">
                      <div className="flex justify-between gap-2"><span className="text-ink">{p.destino_code || '—'} · {p.data_inicio || '—'}</span><span className="font-mono text-xs text-inksoft">{t(`plat.st_${p.status}`)}</span></div>
                      <p className="mt-1 text-inksoft">{p.mensagem}</p>
                      <div className="mt-2 flex gap-2">
                        {p.status === 'nova' && <><button type="button" onClick={() => responder(p, 'aceita')} className="h-8 px-3 rounded-full bg-ink text-white text-[13px] font-cond font-extrabold uppercase tracking-[.05em] focusring">{t('plat.aceitar')}</button>
                          <button type="button" onClick={() => responder(p, 'recusada')} className="h-8 px-3 rounded-md border border-line text-xs focusring">{t('plat.recusar')}</button></>}
                        {p.status === 'paga' && <button type="button" onClick={() => responder(p, 'concluida')} className="h-8 px-3 rounded-full bg-ink text-white text-[13px] font-cond font-extrabold uppercase tracking-[.05em] focusring">{t('plat.concluir')}</button>}
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
