'use client';
import { useEffect, useMemo, useState } from 'react';
import { DESTINOS } from '../../_lib/destinos.js';
import { Autocomplete } from '../../_components/Autocomplete.jsx';
import { useIdioma } from '../../_lib/i18n.js';
import { supabase, supabaseConfigurado, usuarioAtual } from '../../_engine/supabase.js';
import {
  novaProposta, adicionarItemProposta, removerItemProposta, totais, paraPublico, codificarPublico,
  carregarPropostas, salvarPropostas, TIPOS_ITEM, MARGEM_MAX,
} from '../../_lib/plataforma/proposta.js';
import { normalizarMarca, varsDaMarca } from '../../_lib/plataforma/marca.js';
import { fmtMinor } from '../../_lib/plataforma/produtos.js';
import { slugify } from '../../_lib/slug.js';
import { Icon } from '../../_ui/Icon.jsx';
import { useConfirm } from '../../_engine/useConfirm.jsx';

const field = 'w-full h-10 px-3 rounded-lg border border-line bg-input text-ink text-sm focusring';
const lbl = 'block text-xs font-medium text-inksoft';
const hoje = () => new Date().toISOString().slice(0, 10);

export function AgenciasClient() {
  const { t, tf, locale } = useIdioma();
  const { confirm, confirmElement } = useConfirm();
  const [estado, setEstado] = useState(null);
  const [selId, setSelId] = useState(null);
  const [destino, setDestino] = useState(null);
  const [msg, setMsg] = useState(null);

  useEffect(() => { setEstado(carregarPropostas()); }, []); // eslint-disable-line react-hooks/set-state-in-effect

  function gravar(novo) { setEstado(novo); if (!salvarPropostas(novo)) setMsg({ tom: 'erro', txt: t('plat.naoSalvou') }); }
  const sel = estado && estado.propostas.find((p) => p.id === selId);
  const marca = useMemo(() => normalizarMarca(estado ? estado.marca : {}), [estado]);
  const tema = useMemo(() => varsDaMarca(marca), [marca]);

  function criar(e) {
    e.preventDefault();
    const f = Object.fromEntries(new FormData(e.currentTarget));
    try {
      const p = novaProposta({ ...f, destinoCode: destino ? destino.code : '', destinoNome: destino ? destino.nome : '' });
      gravar({ ...estado, propostas: [p, ...estado.propostas] });
      setSelId(p.id); setMsg(null); e.currentTarget.reset(); setDestino(null);
    } catch (err) { setMsg({ tom: 'erro', txt: err.message }); }
  }
  function atualizar(fn) {
    try { gravar({ ...estado, propostas: estado.propostas.map((p) => (p.id === selId ? fn(p) : p)) }); setMsg(null); }
    catch (err) { setMsg({ tom: 'erro', txt: err.message }); }
  }
  function addItem(e) {
    e.preventDefault();
    const f = Object.fromEntries(new FormData(e.currentTarget));
    const form = e.currentTarget;
    atualizar((p) => adicionarItemProposta(p, f));
    form.reset();
  }
  function salvarMarca(e) {
    e.preventDefault();
    const f = Object.fromEntries(new FormData(e.currentTarget));
    gravar({ ...estado, marca: normalizarMarca(f) });
    setMsg({ tom: 'ok', txt: t('plat.marcaSalva') });
  }
  async function copiarLink() {
    try {
      const cod = codificarPublico(paraPublico(sel, marca));
      const url = `${window.location.origin}/proposta#${cod}`;
      await navigator.clipboard.writeText(url).catch(() => {});
      atualizar((p) => ({ ...p, status: p.status === 'rascunho' ? 'enviada' : p.status, link: url }));
      setMsg({ tom: 'ok', txt: t('plat.linkCopiado') });
    } catch (err) { setMsg({ tom: 'erro', txt: err.message }); }
  }
  async function salvarNaConta() {
    if (!supabase) return;
    const u = await usuarioAtual().catch(() => null);
    if (!u) { setMsg({ tom: 'erro', txt: t('plat.entrarSalvar') }); return; }
    // organização da pessoa (cria na primeira vez, com a marca atual)
    let { data: org } = await supabase.from('organizations').select('id').eq('owner_id', u.id).maybeSingle();
    if (!org) {
      const slug = `${slugify(marca.nomeExibido).slice(0, 30) || 'agencia'}-${Math.random().toString(36).slice(2, 6)}`;
      const r = await supabase.from('organizations').insert({ slug, nome: marca.nomeExibido, owner_id: u.id, marca }).select('id').single();
      if (r.error) { setMsg({ tom: 'erro', txt: r.error.message }); return; }
      org = r.data;
    } else {
      await supabase.from('organizations').update({ marca, nome: marca.nomeExibido }).eq('id', org.id);
    }
    const tot = totais(sel);
    const linha = {
      org_id: org.id, titulo: sel.titulo, cliente_nome: sel.clienteNome, cliente_email: sel.clienteEmail || null,
      destino_code: sel.destinoCode || null, data_inicio: sel.inicio || null, data_fim: sel.fim || null, pessoas: sel.pessoas, moeda: sel.moeda,
      itens: sel.itens.map((i) => ({ titulo: i.titulo, dia: i.dia, tipo: i.tipo, descricao: i.descricao, custo_minor: i.custoMinor })),
      custo_minor: tot.custoMinor, margem_pct: sel.margemPct, status: 'enviada', valida_ate: sel.validaAte || null,
    };
    const r = sel.nuvemId
      ? await supabase.from('proposals').update(linha).eq('id', sel.nuvemId).select('id,token_publico,status').single()
      : await supabase.from('proposals').insert(linha).select('id,token_publico,status').single();
    if (r.error) { setMsg({ tom: 'erro', txt: r.error.message }); return; }
    const url = `${window.location.origin}/proposta?t=${r.data.token_publico}`;
    await navigator.clipboard.writeText(url).catch(() => {});
    atualizar((p) => ({ ...p, nuvemId: r.data.id, status: 'enviada', link: url }));
    setMsg({ tom: 'ok', txt: t('plat.salvaConta') });
  }
  async function excluir(p) {
    if (await confirm({ title: tf('plat.excluirT', { t: p.titulo }), message: t('plat.excluirM'), confirmLabel: t('ws.remover') })) {
      gravar({ ...estado, propostas: estado.propostas.filter((x) => x.id !== p.id) });
      if (selId === p.id) setSelId(null);
    }
  }

  if (!estado) return <p className="text-sm text-inksoft">{t('plat.carregando')}</p>;
  const tot = sel ? totais(sel) : null;
  return (
    <div className="grid lg:grid-cols-[320px_1fr] gap-6 items-start">
      {confirmElement}
      <aside className="space-y-4">
        <form onSubmit={salvarMarca} className="rounded-2xl border border-line bg-card p-4 space-y-3" aria-label={t('plat.suaMarca')}>
          <h2 className="eyebrow">{t('plat.suaMarca')}</h2>
          <label className={lbl}>{t('plat.nomeAgencia')}<input name="nomeExibido" defaultValue={estado.marca.nomeExibido || ''} maxLength={60} className={`${field} mt-1`} /></label>
          <div className="grid grid-cols-[1fr_auto] gap-2 items-end">
            <label className={lbl}>{t('plat.corMarca')}<input name="corPrimaria" defaultValue={marca.corPrimaria} pattern="#[0-9A-Fa-f]{6}" className={`${field} mt-1 font-mono`} /></label>
            <span className="w-10 h-10 rounded-lg border border-line" style={{ background: marca.corPrimaria }} aria-hidden />
          </div>
          <label className={lbl}>{t('plat.logo')}<input name="logoUrl" type="url" defaultValue={estado.marca.logoUrl || ''} placeholder="https://…" className={`${field} mt-1`} /></label>
          <label className={lbl}>{t('plat.rodape')}<input name="rodape" defaultValue={estado.marca.rodape || ''} maxLength={200} placeholder="CNPJ · Cadastur · contato" className={`${field} mt-1`} /></label>
          {tema.ajustadaParaTexto && <p className="text-xs text-warn">{t('plat.corAjustada')}</p>}
          <button type="submit" className="h-9 px-3 rounded-lg bg-pine text-onpine text-sm font-semibold focusring">{t('ws.salvar')}</button>
        </form>

        <div className="rounded-2xl border border-line bg-card p-4">
          <h2 className="eyebrow mb-2">{t('plat.propostas')}</h2>
          {estado.propostas.length === 0 ? <p className="text-sm text-inksoft">{t('plat.semPropostas')}</p> : (
            <ul className="divide-y divide-line">
              {estado.propostas.map((p) => (
                <li key={p.id} className="py-2 flex items-center justify-between gap-2">
                  <button type="button" onClick={() => setSelId(p.id)} aria-current={p.id === selId || undefined} className={`text-left text-sm focusring rounded ${p.id === selId ? 'text-pine font-semibold' : 'text-ink'}`}>
                    {p.titulo}<span className="block text-[11px] text-inksoft">{p.clienteNome} · {t(`plat.ps_${p.status}`)}</span>
                  </button>
                  <button type="button" onClick={() => excluir(p)} aria-label={`${t('ws.remover')} ${p.titulo}`} className="text-inksoft hover:text-danger focusring rounded p-1"><Icon name="trash" size={15} /></button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <form onSubmit={criar} className="rounded-2xl border border-line bg-card p-4 space-y-3" aria-label={t('plat.novaProposta')}>
          <h2 className="eyebrow">{t('plat.novaProposta')}</h2>
          <label className={lbl}>{t('ws.titulo')}<input name="titulo" required minLength={2} maxLength={160} placeholder={t('v2.exNome')} className={`${field} mt-1`} /></label>
          <label className={lbl}>{t('plat.cliente')}<input name="clienteNome" required maxLength={120} className={`${field} mt-1`} /></label>
          <label className={lbl}>{t('plat.emailCliente')}<input name="clienteEmail" type="email" maxLength={160} className={`${field} mt-1`} /></label>
          <div><span className={lbl}>{t('viag.destino')}</span>
            <Autocomplete items={DESTINOS} value={destino} onChange={setDestino} toText={(d) => d.nome} toKey={(d) => d.code} toRight={(d) => d.regiao}
              label={t('viag.paisDestino')} placeholder={t('cmp.buscar')} className="mt-1" />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <label className={lbl}>{t('viag.ida')}<input name="inicio" type="date" min={hoje()} className={`${field} mt-1`} /></label>
            <label className={lbl}>{t('viag.volta')}<input name="fim" type="date" min={hoje()} className={`${field} mt-1`} /></label>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <label className={lbl}>{t('viag.pessoas')}<input name="pessoas" type="number" min="1" max="99" defaultValue="2" className={`${field} mt-1`} /></label>
            <label className={lbl}>{t('plat.margem')}<input name="margemPct" type="number" min="0" max={MARGEM_MAX} step="0.5" defaultValue="12" className={`${field} mt-1`} /></label>
          </div>
          <label className={lbl}>{t('plat.validaAte')}<input name="validaAte" type="date" min={hoje()} className={`${field} mt-1`} /></label>
          <button type="submit" className="w-full h-10 rounded-lg bg-coral text-oncoral text-sm font-semibold focusring">{t('plat.criarProposta')}</button>
        </form>
      </aside>

      <section aria-live="polite">
        {msg && <p role={msg.tom === 'erro' ? 'alert' : 'status'} className={`mb-4 rounded-lg border px-3 py-2 text-sm ${msg.tom === 'erro' ? 'bg-danger-bg text-danger border-danger-bd' : 'bg-success-bg text-success border-success-bd'}`}>{msg.txt}</p>}
        {!sel ? (
          <div className="rounded-2xl border border-dashed border-line bg-card p-10 text-center text-sm text-inksoft">{t('plat.escolhaProposta')}</div>
        ) : (
          <div className="space-y-4">
            <div className="rounded-2xl border border-line bg-card p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h2 className="font-display text-2xl text-ink">{sel.titulo}</h2>
                  <p className="text-sm text-inksoft">{sel.clienteNome}{sel.destinoNome ? ` · ${sel.destinoNome}` : ''}{sel.inicio ? ` · ${sel.inicio} → ${sel.fim || '—'}` : ''} · {sel.pessoas} {sel.pessoas > 1 ? t('viag.pessoasPl') : t('viag.pessoa')}</p>
                </div>
                <label className="text-xs text-inksoft">{t('plat.margem')}
                  <input type="number" min="0" max={MARGEM_MAX} step="0.5" value={sel.margemPct} onChange={(e) => atualizar((p) => ({ ...p, margemPct: Math.min(MARGEM_MAX, Math.max(0, Number(e.target.value) || 0)) }))} className="ml-2 w-20 h-9 px-2 rounded-lg border border-line bg-input text-ink text-sm focusring tnum" />
                </label>
              </div>
              <dl className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[[t('plat.custo'), tot.custoMinor], [t('plat.lucro'), tot.lucroMinor], [t('plat.precoCliente'), tot.precoMinor], [t('ws.porPessoa'), tot.porPessoaMinor]].map(([k, v], i) => (
                  <div key={k} className={`rounded-xl border px-3 py-2 ${i === 2 ? 'border-pine/50 bg-pine/5' : 'border-line'}`}><dt className="text-[11px] text-inksoft">{k}</dt><dd className="font-mono text-ink">{fmtMinor(v, sel.moeda, locale)}</dd></div>
                ))}
              </dl>
            </div>

            <div className="rounded-2xl border border-line bg-card p-5">
              <h3 className="eyebrow mb-3">{t('plat.itens')}</h3>
              {sel.itens.length === 0 ? <p className="text-sm text-inksoft">{t('plat.semItens')}</p> : (
                <ul className="divide-y divide-line">
                  {[...sel.itens].sort((a, b) => a.dia - b.dia).map((i) => (
                    <li key={i.id} className="py-2 flex items-center justify-between gap-3 text-sm">
                      <span className="text-ink"><span className="font-mono text-xs text-inksoft mr-2">{t('ws.dia')} {i.dia}</span>{i.titulo} <span className="text-inksoft">· {t(`plat.ti_${i.tipo}`)}</span></span>
                      <span className="flex items-center gap-2"><span className="font-mono text-inksoft">{fmtMinor(i.custoMinor, sel.moeda, locale)}</span>
                        <button type="button" onClick={() => atualizar((p) => removerItemProposta(p, i.id))} aria-label={`${t('ws.remover')} ${i.titulo}`} className="text-inksoft hover:text-danger focusring rounded p-1"><Icon name="x" size={14} /></button></span>
                    </li>
                  ))}
                </ul>
              )}
              <form onSubmit={addItem} className="mt-4 grid sm:grid-cols-[1fr_140px_90px_120px_auto] gap-2 items-end" aria-label={t('plat.addItem')}>
                <label className={lbl}>{t('ws.titulo')}<input name="titulo" required maxLength={160} className={`${field} mt-1`} /></label>
                <label className={lbl}>{t('ws.tipo')}<select name="tipo" className={`${field} mt-1`}>{TIPOS_ITEM.map((k) => <option key={k} value={k}>{t(`plat.ti_${k}`)}</option>)}</select></label>
                <label className={lbl}>{t('ws.dia')}<input name="dia" type="number" min="1" max="120" defaultValue="1" className={`${field} mt-1`} /></label>
                <label className={lbl}>{t('plat.custo')} ({sel.moeda})<input name="custo" type="number" min="0" step="0.01" required className={`${field} mt-1`} /></label>
                <button type="submit" className="h-10 px-3 rounded-lg bg-pine text-onpine text-sm font-semibold focusring" aria-label={t('plat.addItem')}><Icon name="plus" size={16} /></button>
                <label className={`${lbl} sm:col-span-5`}>{t('ws.descricao')}<input name="descricao" maxLength={400} className={`${field} mt-1`} /></label>
              </form>
            </div>

            <div className="flex flex-wrap gap-2">
              <button type="button" onClick={copiarLink} disabled={!sel.itens.length} className="inline-flex items-center gap-2 h-10 px-4 rounded-lg bg-coral text-oncoral text-sm font-semibold disabled:opacity-50 focusring"><Icon name="link" size={16} /> {t('plat.copiarLink')}</button>
              {supabaseConfigurado && <button type="button" onClick={salvarNaConta} disabled={!sel.itens.length} className="inline-flex items-center gap-2 h-10 px-4 rounded-lg border border-line text-ink text-sm font-semibold disabled:opacity-50 focusring"><Icon name="save" size={16} /> {t('plat.salvarConta')}</button>}
              {sel.link && <a href={sel.link} target="_blank" rel="noopener" className="inline-flex items-center gap-2 h-10 px-4 rounded-lg border border-line text-ink text-sm focusring"><Icon name="eye" size={16} /> {t('plat.verComoCliente')}</a>}
            </div>
            <p className="text-xs text-inksoft">{t('plat.linkInfo')}</p>

            <div className="rounded-2xl border border-line overflow-hidden" style={tema.style}>
              <div className="px-5 py-3 flex items-center gap-3" style={{ background: 'rgb(var(--c-marca))', color: 'rgb(var(--c-on-marca))' }}>
                {marca.logoUrl && <img src={marca.logoUrl} alt="" className="h-7 w-auto" />}
                <span className="font-display text-lg">{marca.nomeExibido}</span>
                <span className="ml-auto text-xs opacity-90">{t('plat.previa')}</span>
              </div>
              <div className="p-5 bg-card">
                <p className="font-display text-xl text-ink">{sel.titulo}</p>
                <p className="mt-1 text-pine font-semibold">{fmtMinor(tot.precoMinor, sel.moeda, locale)}</p>
                <button type="button" className="mt-3 h-9 px-4 rounded-lg bg-pine text-onpine text-sm font-semibold" tabIndex={-1} aria-hidden>{t('plat.aceitar')}</button>
              </div>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
