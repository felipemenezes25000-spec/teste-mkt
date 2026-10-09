'use client';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useIdioma } from '../_lib/i18n.js';
import { Icon } from '../_ui/Icon.jsx';
import { SourceTrust } from '../_ui/SourceTrust.jsx';
import { Foto } from '../_ui/Foto.jsx';
import { MOEDAS_SIMULADOR, MOEDA_POR_IDIOMA, simularCusto, fmtFaixa, contras, ordenarPorOrcamento } from '../_lib/simulador.js';
import { buscarOrigens, origemPorIata } from '../_lib/origens.js';

// Simulador da Home (OMEGA V5 F1). O custo é mostrado em TRÊS camadas no mesmo
// escopo e na mesma moeda do orçamento (terra · passagem ilustrativa · total
// provável). Sem origem não há total; sem câmbio não há comparação — nunca
// "cabe no orçamento" fora do escopo certo. Motor e catálogo carregam sob demanda.
const MESES = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
const ESTILOS = [
  ['equilibrado', 'Equilibrado'], ['mochileiro', 'Mochileiro'], ['luxo', 'Luxo'], ['gastronomico', 'Gastronômico'], ['romantico', 'Romântico'],
  ['familia', 'Família'], ['aventura', 'Aventura'], ['cultural', 'Cultural'], ['praia', 'Praia & relax'],
  ['primeira-viagem', 'Primeira viagem internacional'], ['descansar', 'Eu só quero descansar'], ['casal-economico', 'Casal sem estourar o cartão'], ['mochilao-sem-perrengue', 'Mochilão sem perrengue'],
];
const TOM = { CABE: 'bg-success-bg text-success border-success-bd', NO_LIMITE: 'bg-warn-bg text-warn border-warn-bd', ACIMA: 'bg-danger-bg text-danger border-danger-bd' };

function lerUrl() {
  try {
    const q = new URLSearchParams(window.location.search);
    if (!q.has('sim')) return null;
    return { origem: q.get('o') || '', moeda: q.get('m') || '', dias: q.get('d') || '', adultos: q.get('a') || '', criancas: q.get('c') || '', orcamento: q.get('b') || '', mes: q.get('mes') || '', estilo: q.get('e') || '' };
  } catch { return null; }
}

export function HeroSimulador() {
  const { t, tf, idioma, locale } = useIdioma();
  const [origemTxt, setOrigemTxt] = useState('');
  const [origem, setOrigem] = useState(null);
  const [sugestoes, setSugestoes] = useState([]);
  const [ativa, setAtiva] = useState(-1);
  const [moeda, setMoeda] = useState('');
  const [dias, setDias] = useState(14);
  const [adultos, setAdultos] = useState(2);
  const [criancas, setCriancas] = useState(0);
  const [orcamento, setOrcamento] = useState('');
  const [mes, setMes] = useState(0);
  const [estilo, setEstilo] = useState('equilibrado');
  const [res, setRes] = useState(null);
  const [busy, setBusy] = useState(false);
  const autoRodou = useRef(false);
  const moedaEfetiva = moeda || MOEDA_POR_IDIOMA[idioma] || 'BRL';

  // estado compartilhável pela URL (nada pessoal: só parâmetros da simulação)
  useEffect(() => {
    const u = lerUrl();
    if (!u || autoRodou.current) return;
    autoRodou.current = true;
    const o = origemPorIata(u.origem);
    /* eslint-disable react-hooks/set-state-in-effect */
    if (o) { setOrigem(o); setOrigemTxt(`${o.cidade} (${o.iata})`); }
    if (MOEDAS_SIMULADOR.includes(u.moeda)) setMoeda(u.moeda);
    if (u.dias) setDias(Number(u.dias));
    if (u.adultos) setAdultos(Number(u.adultos));
    if (u.criancas) setCriancas(Number(u.criancas));
    if (u.orcamento) setOrcamento(u.orcamento);
    if (u.mes) setMes(Number(u.mes));
    if (u.estilo) setEstilo(u.estilo);
    /* eslint-enable react-hooks/set-state-in-effect */
    simular(null, { origem: o, moeda: MOEDAS_SIMULADOR.includes(u.moeda) ? u.moeda : null, dias: Number(u.dias) || 14, adultos: Number(u.adultos) || 2, criancas: Number(u.criancas) || 0, orcamento: Number(u.orcamento) || 0, mes: Number(u.mes) || 0, estilo: u.estilo || 'equilibrado' });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  function digitarOrigem(v) {
    setOrigemTxt(v);
    setOrigem(null);
    setSugestoes(v.trim() ? buscarOrigens(v, 6) : []);
    setAtiva(-1);
  }
  function escolher(o) {
    setOrigem(o);
    setOrigemTxt(o ? `${o.cidade} (${o.iata})` : '');
    setSugestoes([]);
  }
  function teclaOrigem(e) {
    if (!sugestoes.length) return;
    if (e.key === 'ArrowDown') { e.preventDefault(); setAtiva((i) => Math.min(sugestoes.length - 1, i + 1)); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setAtiva((i) => Math.max(0, i - 1)); }
    else if (e.key === 'Enter' && ativa >= 0) { e.preventDefault(); escolher(sugestoes[ativa]); }
    else if (e.key === 'Escape') setSugestoes([]);
  }

  async function simular(e, forcado) {
    if (e) e.preventDefault();
    const p = forcado || { origem, moeda: moedaEfetiva, dias, adultos, criancas, orcamento: Number(orcamento) || 0, mes, estilo };
    const m = p.moeda || moedaEfetiva;
    setBusy(true);
    const [{ DESTINOS, destinoPorCode }, { recomendarDestinos }, { perfilDoPreset }, { vistoDe }, { taxa }] = await Promise.all([
      import('../_lib/destinos.js'), import('../_engine/decisao.js'), import('../_engine/perfil.js'), import('../_engine/data.js'), import('../_lib/fx.js'),
    ]);
    const fx = m === 'USD' ? null : await taxa('USD', m).catch(() => ({ taxa: null }));
    const naBoaEpoca = (code, mm) => { const d = destinoPorCode(code); return d && (d.melhoresMeses || []).includes(mm) ? 1 : 0; };
    let lista = recomendarDestinos(DESTINOS, perfilDoPreset(p.estilo));
    if (p.mes > 0) lista = [...lista].sort((a, b) => naBoaEpoca(b.id, p.mes) - naBoaEpoca(a.id, p.mes));
    // calcula os 15 melhores do perfil e, com orçamento, prioriza quem cabe (ordem estável)
    const candidatos = lista.slice(0, 15).map((r) => {
      const d = destinoPorCode(r.id);
      const c = simularCusto(d, { dias: p.dias, adultos: p.adultos, criancas: p.criancas, estilo: p.estilo, origem: p.origem, moeda: m, fx: fx ? { taxa: fx.taxa, data: fx.data, fonte: fx.fonte } : null, orcamento: p.orcamento });
      const horasVoo = c.passagem ? Math.round(c.passagem.km / 750 + 1) : null;
      return {
        code: d.code, nome: d.nome, slug: d.slug, regiao: d.regiao, motivos: r.motivos, custo: c,
        boaEpoca: p.mes > 0 ? !!naBoaEpoca(d.code, p.mes) : null,
        contras: contras(d, { mes: p.mes, horasVoo, vistoTipo: vistoDe(d.code, 'BR').tipo, veredito: c.veredito }),
      };
    });
    const top = ordenarPorOrcamento(candidatos).slice(0, 3);
    setRes({ top, moeda: m, cambio: top[0] ? top[0].custo.cambio : null, fotos: {} });
    setBusy(false);
    try {
      const q = new URLSearchParams({ sim: '1', m, d: String(p.dias), a: String(p.adultos), c: String(p.criancas), e: p.estilo });
      if (p.origem) q.set('o', p.origem.iata);
      if (p.orcamento) q.set('b', String(p.orcamento));
      if (p.mes) q.set('mes', String(p.mes));
      window.history.replaceState(null, '', `${window.location.pathname}?${q}`);
    } catch { /* URL opcional */ }
    // fotos reais com crédito, depois do resultado (não atrasam o primeiro valor)
    fetch(`/api/fotos?codes=${top.map((x) => x.code).join(',')}`).then((r) => (r.ok ? r.json() : {})).then((f) => setRes((s) => (s ? { ...s, fotos: f } : s))).catch(() => {});
  }

  const field = 'mt-1.5 w-full h-11 px-3 rounded-lg border border-line bg-input text-ink focusring text-sm';
  const lbl = 'text-xs text-inksoft font-medium';
  const faixa = (f) => fmtFaixa(f, res.moeda, locale);
  const faixaUsd = (f) => fmtFaixa(f, 'USD', locale);
  const porQueSim = (m) => {
    if (!m) return '';
    const base = m.fortes.length ? tf('sim2.forte', { a: m.fortes.map((k) => t(`sim2.d_${k}`)).join(t('sim2.e')) }) : t('sim2.equilibrada');
    return m.alerta ? `${base} ${tf('sim2.atencao', { a: t(`sim2.d_${m.alerta}`) })}` : base;
  };

  return (
    <section aria-labelledby="sim-titulo" className="relative">
      <div className="rounded-[28px] bg-paper2 p-5 sm:p-7">
        <div className="flex items-center justify-between gap-3">
          <h2 id="sim-titulo" className="font-display font-extrabold text-2xl sm:text-3xl tracking-[-.03em] text-ink">{t('simulador.titulo')}</h2>
          <span className="shrink-0 font-mono text-[10px] uppercase tracking-widest text-oncoral bg-coral px-2 py-1 rounded">{t('simulador.badge30s')}</span>
        </div>

        <form onSubmit={simular} className="mt-5 grid grid-cols-6 gap-3 items-end">
          <div className="col-span-6 sm:col-span-4 relative">
            <label htmlFor="sim-origem" className={lbl}>{t('sim2.origem')}</label>
            <input id="sim-origem" role="combobox" aria-expanded={sugestoes.length > 0} aria-controls="sim-origem-lista" aria-autocomplete="list"
              aria-activedescendant={ativa >= 0 ? `sim-o-${sugestoes[ativa].iata}` : undefined}
              value={origemTxt} onChange={(e) => digitarOrigem(e.target.value)} onKeyDown={teclaOrigem} onBlur={() => setTimeout(() => setSugestoes([]), 150)}
              placeholder={t('sim2.origemPh')} autoComplete="off" className={field} />
            {sugestoes.length > 0 && (
              <ul id="sim-origem-lista" role="listbox" className="absolute z-20 mt-1 w-full rounded-lg border border-line bg-card shadow-e2 py-1 max-h-60 overflow-auto">
                {sugestoes.map((o, i) => (
                  <li key={o.iata} id={`sim-o-${o.iata}`} role="option" aria-selected={i === ativa}
                    onMouseDown={(e) => { e.preventDefault(); escolher(o); }}
                    className={`px-3 py-2 text-sm cursor-pointer flex justify-between gap-2 ${i === ativa ? 'bg-pine/10 text-ink' : 'text-ink hover:bg-paper2'}`}>
                    <span>{o.cidade} <span className="text-inksoft">· {o.pais}</span></span><span className="font-mono text-xs text-inksoft">{o.iata}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <label className={`${lbl} col-span-6 sm:col-span-2`}>{t('sim2.moeda')}
            <select value={moedaEfetiva} onChange={(e) => setMoeda(e.target.value)} className={field}>
              {MOEDAS_SIMULADOR.map((m) => <option key={m} value={m}>{m}</option>)}
            </select>
          </label>
          <label className={`${lbl} col-span-2`}>{t('sim2.dias')}
            <input type="number" min="1" max="120" value={dias} onChange={(e) => setDias(e.target.value)} className={`${field} tnum`} />
          </label>
          <label className={`${lbl} col-span-2`}>{t('sim2.adultos')}
            <input type="number" min="1" max="20" value={adultos} onChange={(e) => setAdultos(e.target.value)} className={`${field} tnum`} />
          </label>
          <label className={`${lbl} col-span-2`}>{t('sim2.criancas')}
            <input type="number" min="0" max="10" value={criancas} onChange={(e) => setCriancas(e.target.value)} className={`${field} tnum`} />
          </label>
          <label className={`${lbl} col-span-6 sm:col-span-2`}>{tf('sim2.orcamento', { m: moedaEfetiva })}
            <input type="number" min="0" step="100" inputMode="numeric" placeholder={t('simulador.placeholderOpcional')} value={orcamento} onChange={(e) => setOrcamento(e.target.value)} className={`${field} tnum`} />
          </label>
          <label className={`${lbl} col-span-3 sm:col-span-2`}>{t('sim2.mes')}
            <select value={mes} onChange={(e) => setMes(Number(e.target.value))} className={field}>
              <option value={0}>{t('sim2.qualquer')}</option>
              {MESES.map((m, i) => <option key={m} value={i + 1}>{m}</option>)}
            </select>
          </label>
          <label className={`${lbl} col-span-3 sm:col-span-2`}>{t('sim2.estilo')}
            <select value={estilo} onChange={(e) => setEstilo(e.target.value)} className={field}>
              {ESTILOS.map(([id, l]) => <option key={id} value={id}>{l}</option>)}
            </select>
          </label>
          <button type="submit" disabled={busy} className="col-span-6 inline-flex items-center justify-center gap-2 rounded-full bg-coral text-oncoral font-cond font-extrabold uppercase tracking-[.05em] px-4 h-12 hover:brightness-95 transition focusring disabled:opacity-70">
            {busy ? t('sim2.calculando') : t('sim2.cta')} <Icon name="arrow-right" size={17} />
          </button>
        </form>

        {res ? (
          <div className="mt-5" aria-live="polite">
            <ol className="grid grid-cols-1 gap-3">
              {res.top.map((d, i) => {
                const c = d.custo;
                const v = c.veredito;
                const tom = TOM[(v.codigo.match(/CABE|NO_LIMITE|ACIMA/) || [])[0]];
                const foto = res.fotos[d.code];
                return (
                  <li key={d.code} className="rounded-[20px] bg-white overflow-hidden shadow-[0_0_0_1px_#E3E3DD]">
                    <div className="flex gap-3 p-3">
                      <div className="w-20 h-20 shrink-0 rounded-lg overflow-hidden bg-paper2">
                        <Foto src={foto && foto.img ? foto.img : null} alt={d.nome} mostrarCredito={false} rotuloFalha="" className="w-full h-full" largura={80} altura={80} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-mono text-[11px] text-pine">{String(i + 1).padStart(2, '0')}</span>
                          <span className="eyebrow truncate">{d.regiao}</span>
                        </div>
                        <h3 className="font-display text-lg text-ink leading-tight">{d.nome}</h3>
                        {foto && foto.credito && <p className="text-[10px] text-inksoft truncate">{foto.credito.autor || foto.credito.fonte} · {foto.credito.licenca}</p>}
                      </div>
                    </div>
                    <dl className="px-3 pb-2 grid grid-cols-1 gap-1 text-xs">
                      <div className="flex justify-between gap-2"><dt className="text-inksoft">{t('sim2.terra')} <span className="block text-[10px]">{t('sim2.terraX')}</span></dt><dd className="font-mono text-ink tnum text-right">{c.terra.valor ? faixa(c.terra.valor) : faixaUsd(c.terra.usd)}</dd></div>
                      <div className="flex justify-between gap-2"><dt className="text-inksoft">{t('sim2.passagem')} <span className="block text-[10px]">{c.passagem ? t('sim2.passagemX') : t('sim2.passagemSem')}</span></dt><dd className="font-mono text-ink tnum text-right">{c.passagem ? (c.passagem.valor ? faixa(c.passagem.valor) : faixaUsd(c.passagem.usd)) : '—'}</dd></div>
                      <div className="flex justify-between gap-2 border-t border-line pt-1"><dt className="text-ink font-medium">{t('sim2.total')} <span className="block text-[10px] font-normal text-inksoft">{c.total ? t('sim2.totalX') : t('sim2.totalSem')}</span></dt><dd className="font-mono text-ink font-semibold tnum text-right">{c.total ? (c.total.valor ? faixa(c.total.valor) : faixaUsd(c.total.usd)) : '—'}</dd></div>
                    </dl>
                    <div className="px-3 flex flex-wrap gap-1">
                      {v.codigo !== 'SEM_ORCAMENTO' && <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${tom || 'bg-paper2 text-inksoft border-line'}`}>{t(`sim2.v_${v.codigo}`)}</span>}
                      {d.boaEpoca === true && <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-success-bg text-success border border-success-bd">{t('sim2.epoca')}</span>}
                    </div>
                    <div className="px-3 pt-2 pb-3 grid sm:grid-cols-2 gap-2 text-xs">
                      <div><p className="font-semibold text-ink">{t('sim2.porQueSim')}</p><p className="text-inksoft line-clamp-3">{porQueSim(d.motivos)}</p></div>
                      <div><p className="font-semibold text-ink">{t('sim2.porQueNao')}</p>
                        {d.contras.length ? <ul className="text-inksoft list-disc pl-4">{d.contras.map((k) => <li key={k}>{t(`sim2.c_${k}`)}</li>)}</ul> : <p className="text-inksoft">{t('sim2.nadaContra')}</p>}
                      </div>
                    </div>
                    <div className="px-3 pb-3 flex flex-wrap gap-x-4 gap-y-1">
                      <Link href={`/destino/${d.slug}`} className="text-xs font-semibold text-pine hover:underline focusring rounded">{t('sim2.verDestino')}</Link>
                      <Link href={`/viagens?destino=${d.code}`} className="text-xs font-semibold text-inksoft hover:text-pine focusring rounded">{t('sim2.criarViagem')}</Link>
                    </div>
                  </li>
                );
              })}
            </ol>
            <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-inksoft">
              <Link href={`/comparar?d=${res.top.map((d) => d.slug).join(',')}`} className="text-pine font-semibold hover:underline focusring rounded">{t('sim2.comparar')}</Link>
              <Link href="/decisao" className="text-pine font-semibold hover:underline focusring rounded">{t('sim2.decisao')}</Link>
            </div>
            <p className="mt-2 text-[11px] text-inksoft flex flex-wrap items-center gap-1">
              <SourceTrust freshness="ESTIMATE" compacto />
              {res.moeda === 'USD' ? t('sim2.cambioUsd') : res.cambio && !res.cambio.indisponivel ? tf('sim2.cambio', { f: `${res.cambio.taxa.toLocaleString(locale, { maximumFractionDigits: 4 })} (${res.cambio.fonte})`, d: res.cambio.data || '—' }) : t('sim2.v_SEM_CAMBIO')}
              {' · '}{t('sim2.ref')}
            </p>
          </div>
        ) : (
          <p className="mt-3 text-xs text-inksoft">{t('sim2.rodape')}</p>
        )}
      </div>
    </section>
  );
}
