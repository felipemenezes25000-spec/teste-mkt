'use client';
import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { useViagens } from '../../../_lib/viagens/useViagens.js';
import {
  adicionarItem, removerItem, atualizarItem, itensDoDia, reordenarDia, adicionarReserva, mudarStatusReserva, removerReserva,
  adicionarDespesa, removerDespesa, adicionarDocumento, removerDocumento, alertasDocumentos, prontidao, atualizarViagem,
  TIPOS_RESERVA, CATEGORIAS_DESPESA, TIPOS_DOC,
} from '../../../_lib/viagens/store.js';
import { otimizarDia, simular, distanciaKm, STATUS_ROTEIRO } from '../../../_domain/rotas.js';
import { explicarStatus, TRANSICOES } from '../../../_domain/booking.js';
import { rotaDoDia, ATRIBUICAO_ROTAS } from '../../../_lib/roteamento.js';
import { previsao, descreverTempo, ATRIBUICAO_CLIMA } from '../../../_lib/clima.js';
import { taxa as taxaFx } from '../../../_lib/fx.js';
import { flagUrl } from '../../../_lib/flags.js';
import { supabase, supabaseConfigurado, usuarioAtual } from '../../../_engine/supabase.js';
import { sincronizarViagem } from '../../../_lib/viagens/sync.js';
import { Icon } from '../../../_ui/Icon.jsx';
import { SourceTrust } from '../../../_ui/SourceTrust.jsx';
import { useIdioma } from '../../../_lib/i18n.js';

// Workspace da viagem (OMEGA V4 §31/§75): Roteiro (dias + mapa + rota real +
// otimizador com antes/depois), Reservas (wallet com status honesto), Despesas
// (multimoeda com taxa e data), Documentos (validade + alertas) e Resumo.
const MapaInterativo = dynamic(() => import('../../../_components/mapa/MapaInterativo.jsx').then((m) => m.MapaInterativo), {
  ssr: false, loading: () => <div className="h-[380px] rounded-2xl border border-line bg-paper2" />,
});

const ABAS = [['roteiro', 'Roteiro', 'route'], ['reservas', 'Reservas', 'ticket'], ['despesas', 'Despesas', 'wallet'], ['documentos', 'Documentos', 'passport'], ['resumo', 'Resumo', 'list']];
const MODOS = [['WALK', 'ws.apé', 'walk'], ['TRANSIT', 'ws.transporte', 'metro'], ['DRIVE', 'ws.carro', 'car'], ['BIKE', 'ws.bike', 'bike']];
const fmtDia = (iso, loc = 'pt-BR') => new Date(iso + 'T12:00:00Z').toLocaleDateString(loc, { weekday: 'short', day: '2-digit', month: 'short' });
const fmtMoeda = (v, m) => { try { return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: m, maximumFractionDigits: m === 'JPY' || m === 'KRW' ? 0 : 2 }).format(v); } catch { return `${m} ${v}`; } };
const field = 'w-full h-10 px-3 rounded-lg border border-line bg-input text-ink focusring text-sm';
const lbl = 'block text-xs font-medium text-inksoft';

function useLugares(code) {
  const [d, setD] = useState({ status: 'carregando', atracoes: [], cidades: [] });
  useEffect(() => {
    let vivo = true;
    fetch(`/api/lugares/${code}`).then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
      .then((j) => { if (vivo) setD({ status: 'ok', ...j }); })
      .catch(() => { if (vivo) setD({ status: 'erro', atracoes: [], cidades: [] }); });
    return () => { vivo = false; };
  }, [code]);
  return d;
}

export function WorkspaceClient({ id }) {
  const { t, tf, locale } = useIdioma();
  const { estado, aplicar, carregando } = useViagens();
  const [aba, setAba] = useState('roteiro');
  const [msg, setMsg] = useState(null);
  const v = estado && estado.viagens.find((x) => x.id === id);
  const lugares = useLugares(v ? v.destinoCode : 'XX');

  useEffect(() => {
    const h = window.location.hash.replace('#', '');
    if (ABAS.some((a) => a[0] === h)) setAba(h); // eslint-disable-line react-hooks/set-state-in-effect
  }, []);
  const trocarAba = (a) => { setAba(a); window.history.replaceState(null, '', `#${a}`); };
  const exec = (fn) => { const r = aplicar(fn); setMsg(r.erro ? { tom: 'erro', txt: r.erro } : r.aviso ? { tom: 'aviso', txt: r.aviso } : null); return !r.erro; };

  if (carregando) return <main className="max-w-7xl mx-auto px-4 sm:px-6 py-10"><div className="h-64 rounded-2xl skel" /></main>;
  if (!v) {
    return (
      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-16 text-center">
        <Icon name="suitcase" size={30} className="text-inksoft" />
        <h1 className="mt-3 font-display text-3xl text-ink">{t('ws.naoEncontrada')}</h1>
        <p className="mt-2 text-inksoft">{t('ws.naoEncontradaTxt')}</p>
        <Link href="/viagens" className="mt-6 inline-flex items-center gap-2 h-11 px-5 rounded-full bg-ink text-white font-cond font-extrabold uppercase tracking-[.05em] focusring">{t('ws.verViagens')}</Link>
      </main>
    );
  }
  const p = prontidao(v);

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-8 pb-14">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div className="min-w-0">
          <Link href="/viagens" className="text-sm text-inksoft hover:text-ink inline-flex items-center gap-1 focusring rounded"><Icon name="arrow-left" size={14} /> {t('ws.voltar')}</Link>
          <div className="mt-3 eyebrow flex items-center gap-2">
            {flagUrl(v.destinoCode) && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={flagUrl(v.destinoCode)} alt="" width="18" height="13" className="rounded-[2px] ring-1 ring-line" />
            )}
            {v.destinoNome} · {t('ws.fuso')} {v.timeZone}
          </div>
          <h1 className="mt-1 font-display text-4xl sm:text-5xl tracking-tighter text-ink">{v.titulo}</h1>
          <p className="mt-1 text-inksoft">{fmtDia(v.inicio, locale)} → {fmtDia(v.fim, locale)} · {tf('v2.resumoViagem', { d: v.dias.length, p: `${v.pessoas} ${v.pessoas > 1 ? t('viag.pessoasPl') : t('viag.pessoa')}` })}</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="rounded-xl border border-line bg-card px-4 py-2.5 min-w-[150px]">
            <div className="flex items-center justify-between text-xs text-inksoft"><span>{t('viag.prontidao')}</span><span className="font-mono text-ink">{p.nota}%</span></div>
            <div className="mt-1.5 h-1.5 rounded-full bg-paper2 overflow-hidden"><div className="h-full bg-pine gauge-fill" style={{ width: `${p.nota}%` }} /></div>
          </div>
          <Link href={`/viagens/${v.id}/hoje`} className="inline-flex items-center gap-2 h-11 px-4 rounded-full bg-coral text-oncoral font-cond font-extrabold uppercase tracking-[.05em] hover:brightness-95 focusring"><Icon name="compass" size={18} /> {t('viag.modo')}</Link>
        </div>
      </header>

      {msg && <p role={msg.tom === 'erro' ? 'alert' : 'status'} className={`mt-4 text-sm rounded-lg px-3 py-2 border ${msg.tom === 'erro' ? 'bg-danger-bg text-danger border-danger-bd' : 'bg-warn-bg text-warn border-warn-bd'}`}>{msg.txt}</p>}

      <nav className="mt-6 border-b border-line flex gap-1 overflow-x-auto no-scrollbar" role="tablist" aria-label="Seções da viagem">
        {ABAS.map(([k, l, ic]) => (
          <button key={k} role="tab" aria-selected={aba === k} aria-controls={`painel-${k}`} id={`aba-${k}`} onClick={() => trocarAba(k)}
            className={`shrink-0 inline-flex items-center gap-2 h-11 px-3.5 text-sm font-medium border-b-2 -mb-px focusring ${aba === k ? 'border-pine text-ink' : 'border-transparent text-inksoft hover:text-ink'}`}>
            <Icon name={ic} size={16} />{t(`ws.a_${k}`)}
            {k === 'reservas' && v.reservas.length > 0 && <span className="font-mono text-[11px] text-inksoft">{v.reservas.length}</span>}
            {k === 'documentos' && alertasDocumentos(v).some((a) => a.sev !== 'INFO') && <span className="w-1.5 h-1.5 rounded-full bg-danger" aria-label={t('v2.alertas')} />}
          </button>
        ))}
      </nav>

      <section id={`painel-${aba}`} role="tabpanel" aria-labelledby={`aba-${aba}`} className="mt-6">
        {aba === 'roteiro' && <Roteiro v={v} exec={exec} lugares={lugares} />}
        {aba === 'reservas' && <Reservas v={v} exec={exec} />}
        {aba === 'despesas' && <Despesas v={v} exec={exec} />}
        {aba === 'documentos' && <Documentos v={v} exec={exec} />}
        {aba === 'resumo' && <Resumo v={v} exec={exec} irPara={trocarAba} />}
      </section>
    </main>
  );
}

/* ---------------- ROTEIRO ---------------- */
function Roteiro({ v, exec, lugares }) {
  const { t, tf, locale } = useIdioma();
  const [dia, setDia] = useState(v.dias[0]);
  const [modoEscolhido, setModo] = useState(null); // null = automático pela distância
  const [busca, setBusca] = useState('');
  const [proposta, setProposta] = useState(null);
  const [rota, setRota] = useState(null);
  const [clima, setClima] = useState(null);
  const [sel, setSel] = useState(null);
  const itens = itensDoDia(v, dia);
  const paradas = itens.map((i) => ({ id: i.id, nome: i.titulo, lat: i.lat ?? undefined, lng: i.lng ?? undefined, duracaoMin: i.duracaoMin, abre: i.abre || undefined, fecha: i.fecha || undefined, fixoInicio: i.fixoInicio || undefined }));
  const chaveParadas = paradas.map((x) => `${x.id}:${x.lat}:${x.lng}`).join('|');
  // automático: a pé se todos os trechos forem curtos (≤ 2 km); senão transporte
  const comCoordDia = paradas.filter((x) => Number.isFinite(x.lat));
  const maiorTrecho = comCoordDia.slice(1).reduce((m, x, i) => Math.max(m, distanciaKm(comCoordDia[i], x)), 0);
  const modo = modoEscolhido || (maiorTrecho <= 2 ? 'WALK' : 'TRANSIT');

  // rota real do dia (uma requisição por mudança; transporte público = estimativa)
  useEffect(() => {
    let vivo = true;
    setRota(null); // eslint-disable-line react-hooks/set-state-in-effect
    const comCoord = paradas.filter((x) => Number.isFinite(x.lat));
    if (comCoord.length < 2) return undefined;
    const t = setTimeout(() => { rotaDoDia(comCoord, modo).then((r) => { if (vivo) setRota(r); }); }, 300);
    return () => { vivo = false; clearTimeout(t); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chaveParadas, modo]);

  // previsão do tempo para o dia (se dentro de 16 dias)
  useEffect(() => {
    let vivo = true;
    const ate = (Date.parse(dia) - Date.now()) / 86400000;
    if (ate > 15 || ate < -1) { setClima({ status: 'FORA', dias: [] }); return undefined; } // eslint-disable-line react-hooks/set-state-in-effect
    const ref = paradas.find((x) => Number.isFinite(x.lat)) || (lugares.centro ? { lat: lugares.centro[1], lng: lugares.centro[0] } : null);
    if (!ref) return undefined;
    previsao(ref.lat, ref.lng, 16).then((c) => { if (vivo) setClima(c); });
    return () => { vivo = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dia, lugares.centro]);

  const trechoPorPar = useMemo(() => {
    const m = new Map();
    if (rota) for (const t of rota.trechos) m.set(`${t.fromPlaceId}>${t.toPlaceId}`, t);
    return m;
  }, [rota]);
  const simReal = simular(paradas, { modo, inicio: '09:00', fim: '21:00', ...(trechoPorPar.size ? { trecho: (a, b) => trechoPorPar.get(`${a.id}>${b.id}`) || { durationSeconds: null, distanceMeters: null, freshness: 'UNAVAILABLE', warnings: [] } } : {}) });
  const status = simReal.violacoes ? 'UNFEASIBLE' : (simReal.desconhecidos || paradas.some((x) => !Number.isFinite(x.lat))) ? (paradas.length ? 'VALID_WITH_WARNINGS' : 'VALID') : 'VALID';

  const sugestoes = useMemo(() => {
    const t = busca.trim().toLowerCase();
    const jaNoDia = new Set(itens.map((i) => i.placeId));
    const base = [...(lugares.atracoes || []).map((a) => ({ ...a, tipo: 'atracao' })), ...(lugares.cidades || []).map((c) => ({ ...c, tipo: 'cidade', cidade: v.destinoNome }))];
    return base.filter((a) => !jaNoDia.has(a.id) && (!t || `${a.nome} ${a.cidade || ''}`.toLowerCase().includes(t))).slice(0, 8);
  }, [busca, lugares, itens, v.destinoNome]);

  function addLugar(a) {
    const dur = a.duracao && /(\d+)\s*h/.test(a.duracao) ? Number(a.duracao.match(/(\d+)\s*h/)[1]) * 60 : 90;
    exec((s) => adicionarItem(s, v.id, { dia, titulo: a.nome, placeId: a.id, lat: a.lat, lng: a.lng, duracaoMin: dur, custoEstimado: a.precoUSD || 0 }));
    setBusca('');
  }
  function addLivre(e) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const ok = exec((s) => adicionarItem(s, v.id, { dia, titulo: f.get('titulo'), duracaoMin: Number(f.get('dur')) || 60, fixoInicio: f.get('hora') || '' }));
    if (ok) e.currentTarget.reset();
  }
  function otimizar() { setProposta(otimizarDia(paradas, { modo, inicio: '09:00', fim: '21:00' })); }
  function aplicarProposta() { exec((s) => reordenarDia(s, v.id, dia, proposta.ordem)); setProposta(null); }

  const pontosMapa = itens.filter((i) => Number.isFinite(i.lat)).map((i, k) => ({ id: i.id, nome: `${k + 1}. ${i.titulo}`, lat: i.lat, lng: i.lng, cor: '#1C3FD1' }));
  const linhas = rota && rota.geometria ? [{ id: 'rota', coords: rota.geometria }] : pontosMapa.length > 1 ? [{ id: 'reta', coords: pontosMapa.map((p) => [p.lng, p.lat]), estimada: true }] : [];
  const climaDia = clima && clima.dias && clima.dias.find((d) => d.data === dia);
  const st = STATUS_ROTEIRO[status];

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
      <div className="min-w-0 space-y-4">
        {/* dias */}
        <div className="flex gap-1.5 overflow-x-auto no-scrollbar pb-1" role="tablist" aria-label="Dias da viagem">
          {v.dias.map((d, i) => {
            const n = itensDoDia(v, d).length;
            return (
              <button key={d} role="tab" aria-selected={d === dia} onClick={() => { setDia(d); setProposta(null); }}
                className={`shrink-0 rounded-lg border px-3 py-2 text-left focusring ${d === dia ? 'border-pine bg-pine/10' : 'border-line bg-card hover:border-pine/40'}`}>
                <span className="block font-mono text-[10px] text-inksoft">{t('ws.dia')} {String(i + 1).padStart(2, '0')}</span>
                <span className="block text-sm font-medium text-ink capitalize">{fmtDia(d, locale)}</span>
                <span className="block text-[11px] text-inksoft">{n ? `${n} ${n > 1 ? t('ws.paradas') : t('ws.parada')}` : t('ws.livre')}</span>
              </button>
            );
          })}
        </div>

        {/* cabeçalho do dia */}
        <div className="rounded-2xl border border-line bg-card p-4 flex flex-wrap items-center gap-3 justify-between">
          <div className="flex items-center gap-3">
            {climaDia ? (
              <span className="inline-flex items-center gap-2 text-sm text-ink" title={ATRIBUICAO_CLIMA}>
                <Icon name={descreverTempo(climaDia.codigo)[1]} size={20} className="text-pine" />
                {descreverTempo(climaDia.codigo)[0]} · {Math.round(climaDia.min)}–{Math.round(climaDia.max)}°C · {t('ws.chuva')} {climaDia.chuva ?? '—'}%
                <SourceTrust freshness="LIVE" fonte="Open-Meteo" compacto />
              </span>
            ) : (
              <span className="text-xs text-inksoft">{clima && clima.status === 'FORA' ? t('ws.climaFora') : t('ws.climaCarregando')}</span>
            )}
          </div>
          <div className="inline-flex items-center rounded-lg border border-line p-0.5 bg-paper2" role="radiogroup" aria-label={t('ws.comoIr')}>
            {!modoEscolhido && <span className="px-2 font-mono text-[10px] text-inksoft">AUTO</span>}
            {MODOS.map(([k, l, ic]) => (
              <button key={k} role="radio" aria-checked={modo === k} onClick={() => setModo(k)} className={`inline-flex items-center gap-1.5 h-8 px-2.5 rounded-md text-[13px] focusring ${modo === k ? 'bg-card text-ink shadow-e1' : 'text-inksoft hover:text-ink'}`}><Icon name={ic} size={15} />{t(l)}</button>
            ))}
          </div>
        </div>

        {/* lista do dia */}
        {itens.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-line bg-card p-6 text-center text-sm text-inksoft">{t('ws.diaLivre')}</div>
        ) : (
          <div className="rounded-2xl border border-line bg-card overflow-hidden">
            <div className="px-4 py-3 border-b border-line flex flex-wrap items-center justify-between gap-2">
              <span className={`inline-flex items-center gap-2 text-sm font-medium ${st.tom === 'success' ? 'text-success' : st.tom === 'warn' ? 'text-warn' : st.tom === 'danger' ? 'text-danger' : 'text-inksoft'}`}>
                <Icon name={st.tom === 'success' ? 'check-circle' : st.tom === 'danger' ? 'x-circle' : 'alert'} size={17} />{st.rotulo}
                <span className="font-mono text-[11px] text-inksoft">· {tf('v2.termina', { h: simReal.termino, km: simReal.deslocKm, min: simReal.deslocMin })}</span>
              </span>
              {itens.length > 1 && <button type="button" onClick={otimizar} className="inline-flex items-center gap-1.5 h-9 px-3 rounded-lg border border-line text-sm font-medium text-ink hover:border-pine/50 focusring"><Icon name="refresh" size={15} /> {t('ws.otimizar')}</button>}
            </div>
            <ol className="divide-y divide-line">
              {itens.map((it, k) => {
                const passo = simReal.passos[k];
                const tr = passo && passo.trecho;
                return (
                  <li key={it.id} className={sel === it.id ? 'bg-pine/5' : ''}>
                    {tr && (
                      <div className="px-4 py-1.5 text-[11px] text-inksoft flex items-center gap-2 bg-paper2/50">
                        <Icon name={modo === 'WALK' ? 'walk' : modo === 'DRIVE' ? 'car' : modo === 'BIKE' ? 'bike' : 'metro'} size={13} />
                        {tr.durationSeconds != null ? `${Math.round(tr.durationSeconds / 60)} min · ${(tr.distanceMeters / 1000).toFixed(1)} km` : t('v2.desconhecido')}
                        <SourceTrust freshness={tr.freshness || 'ESTIMATE'} fonte={tr.provider} compacto />
                      </div>
                    )}
                    <div className="px-4 py-3 flex items-start gap-3">
                      <span className="mt-0.5 w-7 h-7 rounded-md bg-pine text-onpine grid place-items-center font-mono text-xs shrink-0">{k + 1}</span>
                      <button type="button" className="min-w-0 flex-1 text-left focusring rounded" onClick={() => setSel(it.id)}>
                        <span className="block text-sm font-semibold text-ink">{it.titulo}</span>
                        <span className="block font-mono text-[11px] text-inksoft">{passo ? `${passo.inicio}–${passo.fim}` : ''}{it.fixoInicio ? ` · ${t('v2.horarioFixo')}` : ''}{!Number.isFinite(it.lat) ? ` · ${t('ws.semCoord')}` : ''}</span>
                      </button>
                      <label className="sr-only" htmlFor={`dur-${it.id}`}>{t('v2.duracaoMin')}</label>
                      <input id={`dur-${it.id}`} type="number" min="10" max="720" step="10" value={it.duracaoMin} onChange={(e) => exec((s) => atualizarItem(s, v.id, it.id, { duracaoMin: Number(e.target.value) || 60 }))} className="w-20 h-9 px-2 rounded-md border border-line bg-input text-ink text-xs tnum focusring" title={t('ws.duracao')} />
                      <button type="button" onClick={() => exec((s) => removerItem(s, v.id, it.id))} aria-label={`Remover ${it.titulo}`} className="w-9 h-9 grid place-items-center rounded-md text-inksoft hover:text-danger focusring"><Icon name="trash" size={16} /></button>
                    </div>
                  </li>
                );
              })}
            </ol>
            {simReal.avisos.length > 0 && <ul className="px-4 py-3 border-t border-line bg-warn-bg text-xs text-warn space-y-1">{simReal.avisos.map((a) => <li key={a} className="flex gap-2"><Icon name="alert" size={14} />{a}</li>)}</ul>}
          </div>
        )}

        {/* proposta do otimizador: nada é aplicado sem confirmação */}
        {proposta && (
          <div className="rounded-2xl border border-pine/40 bg-pine/5 p-4 rise" role="region" aria-label="Proposta de nova ordem">
            <div className="flex items-center justify-between gap-2">
              <span className="font-semibold text-ink">{proposta.mudou ? t('ws.novaOrdem') : t('ws.jaMelhor')}</span>
              <span className="font-mono text-xs text-inksoft">{STATUS_ROTEIRO[proposta.status].rotulo}</span>
            </div>
            {proposta.mudou && (
              <>
                <ol className="mt-2 text-sm text-ink list-decimal pl-5">{proposta.ordem.map((oid) => <li key={oid}>{itens.find((i) => i.id === oid)?.titulo}</li>)}</ol>
                <dl className="mt-3 grid grid-cols-3 gap-2 text-center">
                  {[[t('ws.deslocamento'), `${proposta.delta.deslocMin > 0 ? '+' : ''}${proposta.delta.deslocMin} min`], [t('ws.distancia'), `${proposta.delta.deslocKm > 0 ? '+' : ''}${proposta.delta.deslocKm} km`], [t('ws.espera'), `${proposta.delta.esperaMin > 0 ? '+' : ''}${proposta.delta.esperaMin} min`]].map(([k, val]) => (
                    <div key={k} className="rounded-lg bg-card border border-line p-2"><dt className="text-[11px] text-inksoft">{k}</dt><dd className="font-mono text-sm text-ink">{val}</dd></div>
                  ))}
                </dl>
                <p className="mt-2 text-[11px] text-inksoft">{t('ws.comparacao')}</p>
              </>
            )}
            {proposta.avisos.length > 0 && <ul className="mt-2 text-xs text-warn space-y-1">{proposta.avisos.map((a) => <li key={a}>• {a}</li>)}</ul>}
            <div className="mt-3 flex gap-2">
              {proposta.mudou && <button type="button" onClick={aplicarProposta} className="h-9 px-4 rounded-full bg-ink text-white text-[15px] font-cond font-extrabold uppercase tracking-[.05em] focusring">{t('ws.aplicar')}</button>}
              <button type="button" onClick={() => setProposta(null)} className="h-9 px-4 rounded-lg border border-line text-sm text-ink focusring">{proposta.mudou ? t('ws.manter') : t('ws.fecharP')}</button>
            </div>
          </div>
        )}

        {/* adicionar */}
        <div className="rounded-2xl border border-line bg-card p-4 space-y-3">
          <div className="relative">
            <Icon name="search" size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-inksoft pointer-events-none" />
            <input value={busca} onChange={(e) => setBusca(e.target.value)} placeholder={tf('ws.addLugar', { d: v.destinoNome })} aria-label={tf('ws.addLugar', { d: v.destinoNome })} className={`${field} pl-9`} />
          </div>
          {lugares.status === 'erro' && <p className="text-xs text-danger">{t('ws.erroLugares')}</p>}
          <ul className="grid sm:grid-cols-2 gap-1.5">
            {sugestoes.map((a) => (
              <li key={a.id}>
                <button type="button" onClick={() => addLugar(a)} className="w-full text-left rounded-lg border border-line px-3 py-2 hover:border-pine/50 hover:bg-paper2/50 focusring">
                  <span className="flex items-center justify-between gap-2"><span className="text-sm font-medium text-ink truncate">{a.nome}</span><Icon name="plus" size={15} className="text-pine shrink-0" /></span>
                  <span className="block text-[11px] text-inksoft truncate">{a.tipo === 'cidade' ? t('ws.cidade') : a.cidade || t('ws.atracao')}{a.precoUSD != null ? ` · ${t('ws.ref')} US$ ${a.precoUSD}` : ''}{!Number.isFinite(a.lat) ? ` · ${t('ws.semCoord')}` : ''}</span>
                </button>
              </li>
            ))}
          </ul>
          <form onSubmit={addLivre} className="grid grid-cols-[1fr_88px_88px_auto] gap-2 items-end">
            <label className={lbl}>{t('ws.livreAtv')}<input name="titulo" required maxLength={200} placeholder={t('ws.exAtv')} className={`${field} mt-1`} /></label>
            <label className={lbl}>{t('ws.horaFixa')}<input name="hora" type="time" className={`${field} mt-1 px-2`} /></label>
            <label className={lbl}>Min<input name="dur" type="number" min="10" step="10" defaultValue="60" className={`${field} mt-1 px-2 tnum`} /></label>
            <button type="submit" className="h-10 px-3 rounded-full bg-ink text-white text-[15px] font-cond font-extrabold uppercase tracking-[.05em] focusring" aria-label={t('v2.addLivre')}><Icon name="plus" size={17} /></button>
          </form>
        </div>
      </div>

      {/* mapa do dia */}
      <div className="min-w-0 lg:sticky lg:top-24 self-start space-y-2">
        <MapaInterativo ativacao="idle" pontos={pontosMapa} linhas={linhas} selecionado={sel} onSelecionar={setSel} className="h-[380px] lg:h-[560px]" rotulo={tf('v2.mapaDia', { d: fmtDia(dia, locale) })} zoomMaximo={15}
          centro={lugares.centro || [0, 20]} zoom={lugares.centro ? 4 : 1.3} />
        <p className="text-[11px] text-inksoft flex flex-wrap items-center gap-2">
          {rota && rota.status === 'LIVE' ? <><SourceTrust freshness="LIVE" fonte="OSRM/FOSSGIS" compacto /> {t('ws.rotaLive')} ({ATRIBUICAO_ROTAS}).</>
            : rota ? <><SourceTrust freshness="ESTIMATE" compacto /> {rota.motivo}. {t('ws.linhaAprox')}</>
              : pontosMapa.length > 1 ? t('ws.calculando') : t('ws.semRota')}
        </p>
      </div>
    </div>
  );
}

/* ---------------- RESERVAS ---------------- */
function Reservas({ v, exec }) {
  const { t } = useIdioma();
  const [aberto, setAberto] = useState(v.reservas.length === 0);
  function add(e) {
    e.preventDefault();
    const f = Object.fromEntries(new FormData(e.currentTarget));
    const ok = exec((s) => adicionarReserva(s, v.id, { ...f, preco: Number(f.preco) || 0, confirmada: f.confirmada === 'on' }));
    if (ok) { e.currentTarget.reset(); setAberto(false); }
  }
  const ordenadas = [...v.reservas].sort((a, b) => (a.inicioLocal || 'z').localeCompare(b.inicioLocal || 'z'));
  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_380px]">
      <div className="space-y-3">
        {ordenadas.length === 0 && <div className="rounded-2xl border border-dashed border-line bg-card p-8 text-center text-sm text-inksoft">{t('ws.semRes')}</div>}
        {ordenadas.map((r) => {
          const ex = explicarStatus({ ...r, mode: r.modo });
          const prazo = r.cancelamentoAte ? Math.ceil((Date.parse(r.cancelamentoAte) - Date.now()) / 86400000) : null;
          const proximos = (TRANSICOES[r.status] || []).filter((s) => ['CANCELLED', 'CANCELLATION_PENDING', 'CONFIRMED', 'MODIFIED', 'REFUNDED'].includes(s));
          return (
            <article key={r.id} className="rounded-2xl border border-line bg-card p-4">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div className="min-w-0">
                  <div className="eyebrow">{t(`v2.res.${r.tipo}`)} · {r.provider}</div>
                  <div className="mt-1 font-display text-xl text-ink">{r.localizador ? <span className="font-mono">{r.localizador}</span> : t('ws.semLoc')}</div>
                  <div className="mt-0.5 text-sm text-inksoft">{r.inicioLocal ? r.inicioLocal.replace('T', ' ') : t('ws.semData')}{r.fimLocal ? ` → ${r.fimLocal.replace('T', ' ')}` : ''}{r.preco ? ` · ${fmtMoeda(r.preco, r.moeda)}` : ''}</div>
                </div>
                <span className={`font-mono text-[11px] px-2 py-1 rounded border ${r.status === 'CONFIRMED' ? 'bg-success-bg text-success border-success-bd' : r.status.includes('CANCEL') ? 'bg-danger-bg text-danger border-danger-bd' : 'bg-paper2 text-inksoft border-line'}`}>{r.status}</span>
              </div>
              <p className="mt-2 text-xs text-ink">{ex.texto}</p>
              <p className="text-xs text-inksoft">{ex.suporte}</p>
              {prazo != null && <p className={`mt-1 text-xs ${prazo < 3 ? 'text-danger' : 'text-inksoft'}`}><Icon name="clock" size={13} /> Cancelamento grátis até {r.cancelamentoAte}{prazo >= 0 ? ` (em ${prazo} dias)` : ' (prazo encerrado)'}</p>}
              <div className="mt-3 flex flex-wrap gap-2">
                {proximos.map((s) => <button key={s} type="button" onClick={() => exec((st) => mudarStatusReserva(st, v.id, r.id, s))} className="h-8 px-3 rounded-md border border-line text-xs text-ink hover:border-pine/50 focusring">{t('ws.marcar')} {s.toLowerCase().replace('_', ' ')}</button>)}
                <button type="button" onClick={() => exec((st) => removerReserva(st, v.id, r.id))} className="h-8 px-3 rounded-md text-xs text-inksoft hover:text-danger focusring">{t('ws.remover')}</button>
              </div>
            </article>
          );
        })}
      </div>
      <div>
        <button type="button" onClick={() => setAberto((x) => !x)} aria-expanded={aberto} className="w-full inline-flex items-center justify-center gap-2 h-11 rounded-full bg-ink text-white font-cond font-extrabold uppercase tracking-[.05em] focusring"><Icon name="plus" size={17} /> {t('ws.registrar')}</button>
        {aberto && (
          <form onSubmit={add} className="mt-3 rounded-2xl border border-line bg-card p-4 grid grid-cols-2 gap-3 rise">
            <label className={lbl}>{t('ws.tipo')}<select name="tipo" className={`${field} mt-1`}>{Object.keys(TIPOS_RESERVA).map((k) => <option key={k} value={k}>{t(`v2.res.${k}`)}</option>)}</select></label>
            <label className={lbl}>{t('ws.fornecedor')}<input name="provider" required maxLength={120} placeholder="Ex.: LATAM, Booking.com" className={`${field} mt-1`} /></label>
            <label className={lbl}>{t('ws.localizador')}<input name="localizador" maxLength={120} className={`${field} mt-1 font-mono`} /></label>
            <label className={lbl}>{t('ws.preco')}<div className="mt-1 flex gap-1"><input name="preco" type="number" min="0" step="0.01" className={`${field} tnum`} /><select name="moeda" className="h-10 px-2 rounded-lg border border-line bg-input text-ink text-sm focusring">{['BRL', 'USD', 'EUR', 'JPY'].map((m) => <option key={m}>{m}</option>)}</select></div></label>
            <label className={lbl}>{t('ws.inicio')}<input name="inicioLocal" type="datetime-local" className={`${field} mt-1`} /></label>
            <label className={lbl}>{t('ws.fim')}<input name="fimLocal" type="datetime-local" className={`${field} mt-1`} /></label>
            <label className={`${lbl} col-span-2`}>{t('ws.cancelAte')}<input name="cancelamentoAte" type="date" className={`${field} mt-1`} /></label>
            <label className="col-span-2 flex items-start gap-2 text-sm text-ink"><input name="confirmada" type="checkbox" className="mt-1" /> <span>{t('ws.jaConfirmada')} <span className="text-inksoft text-xs">{t('ws.informada')}</span></span></label>
            <button type="submit" className="col-span-2 h-10 rounded-full bg-coral text-oncoral font-cond font-extrabold uppercase tracking-[.05em] focusring">{t('ws.salvarRes')}</button>
          </form>
        )}
        <p className="mt-3 text-xs text-inksoft">{t('ws.naoEmite')}</p>
      </div>
    </div>
  );
}

/* ---------------- DESPESAS ---------------- */
function Despesas({ v, exec }) {
  const { t, tf } = useIdioma();
  const [salvando, setSalvando] = useState(false);
  const [erroFx, setErroFx] = useState('');
  const totalConv = v.despesas.reduce((s, d) => s + (d.moeda === v.moeda ? d.valor : d.taxa ? d.valor * d.taxa : 0), 0);
  const semTaxa = v.despesas.filter((d) => d.moeda !== v.moeda && !d.taxa).length;
  const porCat = Object.keys(CATEGORIAS_DESPESA).map((k) => [t(`v2.cat.${k}`), v.despesas.filter((d) => d.categoria === k).reduce((s, d) => s + (d.moeda === v.moeda ? d.valor : d.taxa ? d.valor * d.taxa : 0), 0)]).filter(([, x]) => x > 0);
  async function add(e) {
    e.preventDefault();
    const form = e.currentTarget;
    const f = Object.fromEntries(new FormData(form));
    setSalvando(true); setErroFx('');
    let fx = { taxa: null, data: null, fonte: null };
    if (f.moeda !== v.moeda) {
      fx = await taxaFx(f.moeda, v.moeda);
      if (!fx.taxa) setErroFx(tf('v2.cambioFalhou', { de: f.moeda, para: v.moeda }));
    }
    const ok = exec((s) => adicionarDespesa(s, v.id, { ...f, valor: Number(f.valor), taxa: fx.taxa, taxaFonte: fx.fonte, taxaData: fx.data }));
    setSalvando(false);
    if (ok) form.reset();
  }
  const pct = v.orcamento ? Math.min(100, Math.round((totalConv / v.orcamento) * 100)) : 0;
  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_380px]">
      <div className="space-y-4">
        <div className="grid sm:grid-cols-3 gap-3">
          <div className="rounded-2xl border border-line bg-card p-4"><div className="text-xs text-inksoft">{t('ws.gastoReal')}</div><div className="mt-1 font-mono text-2xl text-ink">{fmtMoeda(totalConv, v.moeda)}</div>{semTaxa > 0 && <div className="text-[11px] text-warn">{semTaxa} sem conversão</div>}</div>
          <div className="rounded-2xl border border-line bg-card p-4"><div className="text-xs text-inksoft">{t('ws.orcamento')}</div><div className="mt-1 font-mono text-2xl text-ink">{v.orcamento ? fmtMoeda(v.orcamento, v.moeda) : '—'}</div></div>
          <div className="rounded-2xl border border-line bg-card p-4"><div className="text-xs text-inksoft">{t('ws.porPessoa')}</div><div className="mt-1 font-mono text-2xl text-ink">{fmtMoeda(totalConv / v.pessoas, v.moeda)}</div></div>
        </div>
        {v.orcamento > 0 && (
          <div>
            <div className="flex justify-between text-xs text-inksoft"><span>{t('ws.usoOrc')}</span><span className="font-mono">{pct}%</span></div>
            <div className="mt-1.5 h-2 rounded-full bg-paper2 overflow-hidden"><div className={`h-full gauge-fill ${pct > 90 ? 'bg-danger' : pct > 70 ? 'bg-ochre' : 'bg-pine'}`} style={{ width: `${pct}%` }} /></div>
          </div>
        )}
        {porCat.length > 0 && (
          <div className="rounded-2xl border border-line bg-card p-4">
            <div className="eyebrow mb-2">{t('ws.porCat')}</div>
            <ul className="space-y-1.5">{porCat.map(([l, x]) => <li key={l} className="flex justify-between text-sm"><span className="text-ink">{l}</span><span className="font-mono text-ink">{fmtMoeda(x, v.moeda)}</span></li>)}</ul>
          </div>
        )}
        <ul className="rounded-2xl border border-line bg-card divide-y divide-line">
          {v.despesas.length === 0 && <li className="p-6 text-center text-sm text-inksoft">{t('ws.semGasto')}</li>}
          {[...v.despesas].reverse().map((d) => (
            <li key={d.id} className="px-4 py-3 flex items-center gap-3">
              <div className="min-w-0 flex-1">
                <div className="text-sm text-ink truncate">{d.descricao || t(`v2.cat.${d.categoria}`)}</div>
                <div className="text-[11px] text-inksoft">{d.data} · {t(`v2.cat.${d.categoria}`)}{d.taxa ? ` · ${t('v2.taxa')} ${d.taxa.toFixed(4)} (${d.taxaFonte}, ${d.taxaData})` : ''}</div>
              </div>
              <div className="text-right">
                <div className="font-mono text-sm text-ink">{fmtMoeda(d.valor, d.moeda)}</div>
                {d.moeda !== v.moeda && <div className="font-mono text-[11px] text-inksoft">{d.taxa ? `≈ ${fmtMoeda(d.valor * d.taxa, v.moeda)}` : t('ws.semConv')}</div>}
              </div>
              <button type="button" onClick={() => exec((s) => removerDespesa(s, v.id, d.id))} aria-label="Remover despesa" className="w-9 h-9 grid place-items-center rounded-md text-inksoft hover:text-danger focusring"><Icon name="trash" size={15} /></button>
            </li>
          ))}
        </ul>
      </div>
      <form onSubmit={add} className="rounded-2xl border border-line bg-card p-4 grid grid-cols-2 gap-3 self-start">
        <div className="col-span-2 eyebrow">{t('ws.lancar')}</div>
        <label className={lbl}>{t('ws.valor')}<input name="valor" required type="number" min="0.01" step="0.01" className={`${field} mt-1 tnum`} /></label>
        <label className={lbl}>Moeda<select name="moeda" defaultValue={v.moeda} className={`${field} mt-1`}>{[...new Set([v.moeda, 'BRL', 'USD', 'EUR', 'JPY', 'GBP', 'THB', 'MXN', 'ARS', 'CLP', 'PEN', 'TRY', 'MAD', 'IDR', 'VND', 'INR', 'KRW', 'CNY', 'AUD', 'CAD', 'CHF', 'ZAR'])].map((m) => <option key={m}>{m}</option>)}</select></label>
        <label className={lbl}>{t('ws.categoria')}<select name="categoria" className={`${field} mt-1`}>{Object.keys(CATEGORIAS_DESPESA).map((k) => <option key={k} value={k}>{t(`v2.cat.${k}`)}</option>)}</select></label>
        <label className={lbl}>{t('ws.data')}<input name="data" type="date" defaultValue={new Date().toISOString().slice(0, 10)} className={`${field} mt-1`} /></label>
        <label className={`${lbl} col-span-2`}>{t('ws.descricao')}<input name="descricao" maxLength={300} className={`${field} mt-1`} /></label>
        <button type="submit" disabled={salvando} className="col-span-2 h-10 rounded-full bg-coral text-oncoral font-cond font-extrabold uppercase tracking-[.05em] disabled:opacity-60 focusring">{salvando ? t('ws.convertendo') : t('ws.addGasto')}</button>
        {erroFx && <p className="col-span-2 text-xs text-warn" role="status">{erroFx}</p>}
        <p className="col-span-2 text-[11px] text-inksoft">{t('ws.taxaRef')}</p>
      </form>
    </div>
  );
}

/* ---------------- DOCUMENTOS ---------------- */
function Documentos({ v, exec }) {
  const { t, tf } = useIdioma();
  const alertas = alertasDocumentos(v);
  function add(e) {
    e.preventDefault();
    const f = Object.fromEntries(new FormData(e.currentTarget));
    if (exec((s) => adicionarDocumento(s, v.id, f))) e.currentTarget.reset();
  }
  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_380px]">
      <div className="space-y-3">
        {alertas.map((a) => (
          <div key={a.txt} className={`rounded-xl border px-4 py-3 text-sm flex gap-2 ${a.sev === 'CRITICO' ? 'bg-danger-bg text-danger border-danger-bd' : a.sev === 'ATENCAO' ? 'bg-warn-bg text-warn border-warn-bd' : 'bg-paper2 text-ink border-line'}`}>
            <Icon name={a.sev === 'INFO' ? 'info' : 'alert'} size={17} />{a.cod ? tf(`v2.al.${a.cod}`, { t: a.doc ? a.doc.titulo : '', d: a.doc ? a.doc.validade : '' }) : a.txt}
          </div>
        ))}
        <ul className="rounded-2xl border border-line bg-card divide-y divide-line">
          {v.documentos.length === 0 && <li className="p-6 text-center text-sm text-inksoft">{t('ws.semDoc')}</li>}
          {v.documentos.map((d) => (
            <li key={d.id} className="px-4 py-3 flex items-center gap-3">
              <span className="w-9 h-9 rounded-md bg-paper2 text-pine grid place-items-center"><Icon name={d.tipo === 'PASSAPORTE' ? 'passport' : d.tipo === 'SEGURO' ? 'shield' : d.tipo === 'VACINA' ? 'syringe' : 'document'} size={18} /></span>
              <div className="min-w-0 flex-1">
                <div className="text-sm font-medium text-ink">{d.titulo}</div>
                <div className="text-[11px] text-inksoft">{t(`v2.doc.${d.tipo}`)}{d.titular ? ` · ${d.titular}` : ''}{d.validade ? ` · ${tf('v2.validoAte', { d: d.validade })}` : ''}</div>
              </div>
              <button type="button" onClick={() => exec((s) => removerDocumento(s, v.id, d.id))} aria-label={`Remover ${d.titulo}`} className="w-9 h-9 grid place-items-center rounded-md text-inksoft hover:text-danger focusring"><Icon name="trash" size={15} /></button>
            </li>
          ))}
        </ul>
        <p className="text-xs text-inksoft">{t('ws.privDoc')}</p>
      </div>
      <form onSubmit={add} className="rounded-2xl border border-line bg-card p-4 grid grid-cols-2 gap-3 self-start">
        <div className="col-span-2 eyebrow">{t('ws.addDoc')}</div>
        <label className={lbl}>{t('ws.tipo')}<select name="tipo" className={`${field} mt-1`}>{Object.keys(TIPOS_DOC).map((k) => <option key={k} value={k}>{t(`v2.doc.${k}`)}</option>)}</select></label>
        <label className={lbl}>{t('ws.validade')}<input name="validade" type="date" className={`${field} mt-1`} /></label>
        <label className={lbl}>{t('ws.titulo')}<input name="titulo" maxLength={160} placeholder={t('v2.exDoc')} className={`${field} mt-1`} /></label>
        <label className={lbl}>{t('ws.titular')}<input name="titular" maxLength={80} className={`${field} mt-1`} /></label>
        <button type="submit" className="col-span-2 h-10 rounded-full bg-ink text-white font-cond font-extrabold uppercase tracking-[.05em] focusring">{t('ws.salvar')}</button>
      </form>
    </div>
  );
}

/* ---------------- RESUMO ---------------- */
function Sincronizar({ v, exec }) {
  const { t, tf, locale } = useIdioma();
  const [st, setSt] = useState({ fase: 'idle' });
  async function sync() {
    setSt({ fase: 'enviando' });
    const u = await usuarioAtual();
    if (!u) { setSt({ fase: 'login' }); return; }
    const r = await sincronizarViagem(supabase, v, u.id);
    if (r.ok) { exec((s) => atualizarViagem(s, v.id, { sincronizadaEm: r.em })); setSt({ fase: 'ok' }); } else setSt({ fase: 'erro', msg: r.erro });
  }
  return (
    <div className="rounded-2xl border border-line bg-card p-5 lg:col-span-2">
      <div className="eyebrow">{t('ws.contaEy')}</div>
      {!supabaseConfigurado ? (
        <p className="mt-2 text-sm text-inksoft">{t('ws.soAparelho')}</p>
      ) : (
        <div className="mt-2 flex flex-wrap items-center gap-3">
          <button type="button" onClick={sync} disabled={st.fase === 'enviando'} className="inline-flex items-center gap-2 h-10 px-4 rounded-full bg-ink text-white text-[15px] font-cond font-extrabold uppercase tracking-[.05em] disabled:opacity-60 focusring"><Icon name="refresh" size={16} />{st.fase === 'enviando' ? t('ws.sincronizando') : t('ws.sincronizar')}</button>
          <span className="text-sm text-inksoft" role="status">
            {st.fase === 'ok' ? t('ws.sincOk') : st.fase === 'login' ? <>{t('ws.sincLogin')} <Link href="/conta" className="text-pine underline">{t('ws.entrar')}</Link></> : st.fase === 'erro' ? <span className="text-danger">{t('ws.falhou')}: {st.msg}</span> : v.sincronizadaEm ? tf('v2.ultima', { d: new Date(v.sincronizadaEm).toLocaleString(locale) }) : t('ws.nunca')}
          </span>
        </div>
      )}
    </div>
  );
}

function Resumo({ v, exec, irPara }) {
  const { t, tf, locale } = useIdioma();
  const p = prontidao(v);
  const custoEst = v.itens.reduce((s, i) => s + (i.custoEstimado || 0), 0);
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="rounded-2xl border border-line bg-card p-5">
        <div className="eyebrow">{t('ws.proximos')}</div>
        <ul className="mt-3 space-y-2">
          {p.faltando.length === 0 && <li className="text-sm text-success flex items-center gap-2"><Icon name="check-circle" size={17} /> {t('ws.tudoOk')}</li>}
          {p.faltando.map((f) => (
            <li key={f.txt} className="flex items-center justify-between gap-2 text-sm">
              <span className="flex items-center gap-2 text-ink"><span className="w-1.5 h-1.5 rounded-full bg-coral" />{t(`v2.ck.${f.cod}`)}</span>
              <button type="button" onClick={() => irPara(f.aba || 'resumo')} className="text-xs text-pine hover:underline focusring">{t('ws.resolver')}</button>
            </li>
          ))}
        </ul>
      </div>
      <div className="rounded-2xl border border-line bg-card p-5">
        <div className="eyebrow">{t('ws.ajustes')}</div>
        <div className="mt-3 grid grid-cols-2 gap-3">
          <label className={lbl}>{tf('v2.orcamentoM', { m: v.moeda })}<input type="number" min="0" step="100" defaultValue={v.orcamento || ''} onBlur={(e) => exec((s) => atualizarViagem(s, v.id, { orcamento: Math.max(0, Number(e.target.value) || 0) }))} className={`${field} mt-1 tnum`} /></label>
          <label className={lbl}>{t('viag.pessoas')}<input type="number" min="1" max="20" defaultValue={v.pessoas} onBlur={(e) => exec((s) => atualizarViagem(s, v.id, { pessoas: Math.max(1, Math.min(20, Number(e.target.value) || 1)) }))} className={`${field} mt-1 tnum`} /></label>
        </div>
        <p className="mt-3 text-sm text-inksoft">{t('ws.ingressos')} <span className="font-mono text-ink">US$ {custoEst.toLocaleString(locale)}</span> {t('ws.porPessoaMin')} <Link href="/custo-real" className="text-pine hover:underline">{t('ws.verCusto')}</Link></p>
      </div>
      <Sincronizar v={v} exec={exec} />
    </div>
  );
}
