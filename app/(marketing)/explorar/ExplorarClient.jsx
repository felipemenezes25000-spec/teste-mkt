'use client';
import { useEffect, useMemo, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { DestinoCard } from '../../_components/DestinoCard.jsx';
import { colecoesEditorial, TEMAS_EXPLORAR, temasDoDestino } from '../../_lib/editorial.js';
import { vistoDe, MESES_PT } from '../../_engine/data.js';
import { flagUrl } from '../../_lib/flags.js';
import { coordTexto } from '../../_lib/brand.jsx';
import { wikiThumb } from '../../_lib/wikiThumb.js';
import { Icon } from '../../_ui/Icon.jsx';
import { Foto } from '../../_ui/Foto.jsx';
import { SourceTrust } from '../../_ui/SourceTrust.jsx';
import { FavoriteButton } from '../../_components/FavoriteButton.jsx';
import { useIdioma } from '../../_lib/i18n.js';

// WORLD EXPLORER (OMEGA V4 §15/§29): lista ⇄ mapa sincronizados nos dois sentidos,
// camadas de dados (custo, melhor época no mês, visto BR), filtros e estado na URL
// (link compartilhável). A lista é a alternativa textual completa do mapa.
const MapaInterativo = dynamic(() => import('../../_components/mapa/MapaInterativo.jsx').then((m) => m.MapaInterativo), {
  ssr: false,
  loading: () => <div className="h-full rounded-2xl border border-line bg-paper2 grid place-items-center"><span className="eyebrow">Carregando mapa…</span></div>,
});

const CAMADAS = [
  { id: 'custo', k: 'c_custo', label: 'Custo/dia', icon: 'coins' },
  { id: 'epoca', k: 'c_epoca', label: 'Melhor época', icon: 'sun' },
  { id: 'visto', k: 'c_visto', label: 'Visto BR', icon: 'passport' },
];
const ORDENS = [
  { id: 'relevancia', k: 'o_rel', label: 'Camada ativa' },
  { id: 'nome', k: 'o_az', label: 'A–Z' },
  { id: 'barato', k: 'o_barato', label: 'Mais barato' },
  { id: 'caro', k: 'o_caro', label: 'Mais caro' },
];
const COR = { mar: '#0A7F70', meridiano: '#2742F5', ambar: '#E59A00', infra: '#D12C1F', neutro: '#8A94A8' };
const VISTO_INFO = {
  isento: { cor: COR.mar, k: 'isento' }, 'e-visa': { cor: COR.meridiano, k: 'evisa' }, eta: { cor: COR.meridiano, k: 'eta' },
  'on-arrival': { cor: COR.ambar, k: 'chegada' }, visto: { cor: COR.infra, k: 'consular' }, consultar: { cor: COR.neutro, k: 'consultar' },
};

function infoCamada(d, camada, mes, t = (k) => k) {
  if (camada === 'custo') {
    const c = d.custoDia;
    const cor = c <= 25 ? COR.mar : c <= 40 ? COR.meridiano : c <= 60 ? COR.ambar : COR.infra;
    return { cor, valor: `US$ ${c}/${t('card.dia')}`, ordem: c };
  }
  if (camada === 'epoca') {
    const bom = (d.melhoresMeses || []).includes(mes);
    return { cor: bom ? COR.mar : COR.neutro, valor: bom ? t('exp.boaEm').replace('{m}', MESES_PT[mes - 1]) : t('exp.fora'), ordem: bom ? 0 : 1 };
  }
  const v = vistoDe(d.code, 'BR');
  const vi = VISTO_INFO[v.tipo] || VISTO_INFO.consultar;
  return { cor: vi.cor, valor: `${t(`exp.${vi.k}`)}${v.dias ? ` · ${v.dias}d` : ''}`, ordem: ['isento', 'e-visa', 'eta', 'on-arrival', 'visto', 'consultar'].indexOf(v.tipo) };
}

function Legenda({ camada, mes, t }) {
  const itens = camada === 'custo'
    ? [[COR.mar, '≤ US$ 25'], [COR.meridiano, '≤ 40'], [COR.ambar, '≤ 60'], [COR.infra, '> 60']]
    : camada === 'epoca'
      ? [[COR.mar, t('exp.boaEm').replace('{m}', MESES_PT[mes - 1])], [COR.neutro, t('exp.fora')]]
      : [[COR.mar, t('exp.isento')], [COR.meridiano, `${t('exp.evisa')}/ETA`], [COR.ambar, t('exp.chegada')], [COR.infra, t('exp.consular')], [COR.neutro, t('exp.consultar')]];
  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-[11px] text-inksoft">
      {itens.map(([c, t]) => <span key={t} className="inline-flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full ring-1 ring-black/10" style={{ background: c }} />{t}</span>)}
    </div>
  );
}

const lerURL = () => {
  if (typeof window === 'undefined') return {};
  const p = new URLSearchParams(window.location.search);
  return { q: p.get('q') || '', regiao: p.get('regiao') || '', camada: p.get('camada') || '', mes: Number(p.get('mes')) || 0, sel: p.get('sel') || '', tema: p.get('tema') || '', ordem: p.get('ordem') || '' };
};

export function ExplorarClient({ destinos }) {
  const { t, tf, idioma } = useIdioma();
  const [q, setQ] = useState('');
  const [regiao, setRegiao] = useState('');
  const [maxCusto, setMaxCusto] = useState(0);
  const [ordem, setOrdem] = useState('relevancia');
  const [tema, setTema] = useState('');
  const [camada, setCamada] = useState('custo');
  const [mes, setMes] = useState(() => new Date().getMonth() + 1);
  const [sel, setSel] = useState('');
  const [hover, setHover] = useState('');
  const [vista, setVista] = useState('mapa'); // mobile: mapa | lista
  const listaRef = useRef(null);
  const pronto = useRef(false);

  // estado inicial da URL (link compartilhável)
  useEffect(() => {
    const u = lerURL();
    /* eslint-disable react-hooks/set-state-in-effect */
    if (u.q) setQ(u.q);
    if (u.regiao) setRegiao(u.regiao);
    if (CAMADAS.some((c) => c.id === u.camada)) setCamada(u.camada);
    if (u.mes >= 1 && u.mes <= 12) setMes(u.mes);
    if (u.sel) setSel(u.sel);
    if (u.tema) setTema(u.tema);
    if (ORDENS.some((o) => o.id === u.ordem)) setOrdem(u.ordem);
    /* eslint-enable react-hooks/set-state-in-effect */
    pronto.current = true;
    if (u.sel) {
      // rola a lista até o destino vindo do link compartilhado
      setTimeout(() => {
        const el = listaRef.current && listaRef.current.querySelector(`[data-code="${u.sel}"]`);
        if (el) el.scrollIntoView({ block: 'center' });
      }, 300);
    }
  }, []);
  useEffect(() => {
    if (!pronto.current) return;
    const p = new URLSearchParams();
    if (q) p.set('q', q); if (regiao) p.set('regiao', regiao); if (camada !== 'custo') p.set('camada', camada);
    if (camada === 'epoca') p.set('mes', String(mes)); if (sel) p.set('sel', sel); if (tema) p.set('tema', tema);
    if (ordem !== 'relevancia') p.set('ordem', ordem);
    const s = p.toString();
    window.history.replaceState(null, '', s ? `?${s}` : window.location.pathname);
  }, [q, regiao, camada, mes, sel, tema, ordem]);

  const regioes = useMemo(() => [...new Set(destinos.map((d) => d.regiao))].sort(), [destinos]);
  const colecoes = useMemo(() => colecoesEditorial(destinos), [destinos]);
  const temasPorCode = useMemo(() => new Map(destinos.map((d) => [d.code, temasDoDestino(d)])), [destinos]);
  const contagemTema = useMemo(() => {
    const c = {};
    for (const temas of temasPorCode.values()) for (const t of temas) c[t] = (c[t] || 0) + 1;
    return c;
  }, [temasPorCode]);

  const filtrados = useMemo(() => {
    const termo = q.trim().toLowerCase();
    let lista = destinos.filter((d) => {
      if (regiao && d.regiao !== regiao) return false;
      if (maxCusto && d.custoDia > maxCusto) return false;
      if (tema && !(temasPorCode.get(d.code) || []).includes(tema)) return false;
      if (termo && !(`${d.nome} ${d.regiao} ${(d.cidades || []).join(' ')}`).toLowerCase().includes(termo)) return false;
      return true;
    }).map((d) => ({ ...d, camada: infoCamada(d, camada, mes, t) }));
    if (ordem === 'barato') lista.sort((a, b) => a.custoDia - b.custoDia);
    else if (ordem === 'caro') lista.sort((a, b) => b.custoDia - a.custoDia);
    else if (ordem === 'nome') lista.sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR'));
    else lista.sort((a, b) => a.camada.ordem - b.camada.ordem || a.nome.localeCompare(b.nome, 'pt-BR'));
    return lista;
  }, [destinos, q, regiao, maxCusto, ordem, tema, temasPorCode, camada, mes, idioma]); // eslint-disable-line react-hooks/exhaustive-deps

  const pontos = useMemo(() => filtrados.filter((d) => Array.isArray(d.coords)).map((d) => ({
    id: d.code, nome: d.nome, lng: d.coords[0], lat: d.coords[1], cor: d.camada.cor,
  })), [filtrados]);
  const atual = useMemo(() => destinos.find((d) => d.code === sel) || null, [destinos, sel]);
  const atualCamada = atual ? infoCamada(atual, camada, mes, t) : null;

  function selecionar(code, origem) {
    setSel(code);
    if (origem === 'mapa') {
      const el = listaRef.current && listaRef.current.querySelector(`[data-code="${code}"]`);
      if (el) el.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      setVista('lista');
    }
  }

  const field = 'h-10 px-3 rounded-lg border border-line bg-input text-ink focusring text-sm';
  const temFiltro = q.trim() || regiao || maxCusto || tema;

  return (
    <div className="space-y-14">
      {/* EXPLORER: filtros + lista | mapa */}
      <section aria-label="Explorador do mundo" className="rounded-2xl border border-line bg-card overflow-hidden">
        {/* barra de controles */}
        <div className="p-4 border-b border-line space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative flex-1 min-w-[200px]">
              <Icon name="search" size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-inksoft pointer-events-none" />
              <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={t('exp.busca')} aria-label={t('nav2.buscar')} className={`${field} w-full pl-9`} />
            </div>
            <select value={regiao} onChange={(e) => setRegiao(e.target.value)} aria-label="Região" className={field}>
              <option value="">{t('exp.regioes')}</option>
              {regioes.map((r) => <option key={r} value={r}>{r}</option>)}
            </select>
            <select value={maxCusto} onChange={(e) => setMaxCusto(Number(e.target.value))} aria-label="Orçamento diário" className={field}>
              <option value={0}>{t('exp.custo')}</option>
              <option value={25}>{tf('exp.ate', { n: 25 })}</option>
              <option value={40}>{tf('exp.ate', { n: 40 })}</option>
              <option value={60}>{tf('exp.ate', { n: 60 })}</option>
            </select>
            <select value={ordem} onChange={(e) => setOrdem(e.target.value)} aria-label={t('exp.ordem')} className={field}>
              {ORDENS.map((o) => <option key={o.id} value={o.id}>{t(`exp.${o.k}`)}</option>)}
            </select>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="inline-flex rounded-lg border border-line p-0.5 bg-paper2" role="radiogroup" aria-label="Camada do mapa">
              {CAMADAS.map((c) => (
                <button key={c.id} type="button" role="radio" aria-checked={camada === c.id} onClick={() => setCamada(c.id)}
                  className={`inline-flex items-center gap-1.5 h-8 px-3 rounded-md text-sm font-medium transition focusring ${camada === c.id ? 'bg-card text-ink shadow-e1' : 'text-inksoft hover:text-ink'}`}>
                  <Icon name={c.icon} size={15} />{t(`exp.${c.k}`)}
                </button>
              ))}
            </div>
            {camada === 'epoca' && (
              <label className="inline-flex items-center gap-2 text-sm text-inksoft">{t('exp.mes')}
                <select value={mes} onChange={(e) => setMes(Number(e.target.value))} className={field}>
                  {MESES_PT.map((m, i) => <option key={m} value={i + 1}>{m}</option>)}
                </select>
              </label>
            )}
            <Legenda camada={camada} mes={mes} t={t} />
          </div>
          <div className="flex flex-wrap items-center gap-1.5" role="group" aria-label="Estilo de viagem">
            {TEMAS_EXPLORAR.map((t) => {
              const n = contagemTema[t.id] || 0;
              if (!n) return null;
              const ativo = tema === t.id;
              return (
                <button key={t.id} type="button" aria-pressed={ativo} onClick={() => setTema(ativo ? '' : t.id)}
                  className={`inline-flex items-center gap-1.5 rounded-md h-8 px-2.5 text-[13px] font-medium border transition focusring ${ativo ? 'bg-pine text-onpine border-pine' : 'bg-card text-ink border-line hover:border-pine/50'}`}>
                  <Icon emoji={t.icon} size={14} />{t.label}<span className={`font-mono text-[11px] ${ativo ? '' : 'text-inksoft'}`}>{n}</span>
                </button>
              );
            })}
            {temFiltro && <button type="button" onClick={() => { setQ(''); setRegiao(''); setMaxCusto(0); setTema(''); }} className="ml-1 text-sm text-pine hover:underline px-2 h-8 focusring">{t('exp.limpar')}</button>}
          </div>
        </div>

        {/* alternância mobile */}
        <div className="lg:hidden flex border-b border-line" role="tablist" aria-label="Visualização">
          {[['mapa', t('exp.mapa'), 'map'], ['lista', `${t('exp.lista')} (${filtrados.length})`, 'list']].map(([id, label, ic]) => (
            <button key={id} role="tab" aria-selected={vista === id} onClick={() => setVista(id)}
              className={`flex-1 inline-flex items-center justify-center gap-2 h-11 text-sm font-medium border-b-2 focusring ${vista === id ? 'border-pine text-ink' : 'border-transparent text-inksoft'}`}>
              <Icon name={ic} size={16} />{label}
            </button>
          ))}
        </div>

        <div className="grid lg:grid-cols-[380px_minmax(0,1fr)]">
          {/* LISTA */}
          <div className={`${vista === 'lista' ? 'block' : 'hidden'} lg:block border-r border-line`}>
            <p className="px-4 py-2.5 text-xs text-inksoft border-b border-line flex items-center justify-between" aria-live="polite">
              <span>{tf('exp.destinos', { n: filtrados.length })}</span>
              <SourceTrust freshness="HISTORICAL" fonte="Catálogo Mundo Sem Fim" data="jun/2026" compacto />
            </p>
            <ul ref={listaRef} className="max-h-[560px] lg:max-h-[640px] overflow-y-auto divide-y divide-line" aria-label="Destinos">
              {filtrados.length === 0 && (
                <li className="p-8 text-center text-sm text-inksoft">{t('exp.vazio')}</li>
              )}
              {filtrados.map((d) => {
                const ativo = d.code === sel;
                return (
                  <li key={d.code} data-code={d.code}>
                    <button type="button" onClick={() => selecionar(d.code, 'lista')} onMouseEnter={() => setHover(d.code)} onMouseLeave={() => setHover('')}
                      onFocus={() => setHover(d.code)} onBlur={() => setHover('')} aria-pressed={ativo}
                      className={`w-full text-left px-4 py-3 flex items-center gap-3 transition focusring ${ativo ? 'bg-pine/10' : 'hover:bg-paper2'}`}>
                      <span className="w-2.5 h-2.5 rounded-full shrink-0 ring-1 ring-black/10" style={{ background: d.camada.cor }} aria-hidden />
                      {flagUrl(d.code) && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={flagUrl(d.code)} alt="" width="20" height="15" loading="lazy" className="rounded-[2px] ring-1 ring-line shrink-0" />
                      )}
                      <span className="min-w-0 flex-1">
                        <span className="block text-sm font-semibold text-ink truncate">{d.nome}</span>
                        <span className="block text-[11px] text-inksoft truncate">{d.regiao}</span>
                      </span>
                      <span className="font-mono text-[11px] text-ink tnum shrink-0 text-right">{d.camada.valor}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* MAPA + detalhe */}
          <div className={`${vista === 'mapa' ? 'block' : 'hidden'} lg:block relative p-3 lg:p-4`}>
            <MapaInterativo
              pontos={pontos} selecionado={sel} destacado={hover} onSelecionar={(c) => selecionar(c, 'mapa')}
              className="h-[440px] sm:h-[520px] lg:h-[620px]" rotulo={`${t('exp.mapa')} · ${pontos.length} · ${t(`exp.${CAMADAS.find((c) => c.id === camada).k}`)}`}
              enquadrar={!sel} cluster={false}
            />
            {atual && (
              <div className="absolute left-5 right-16 top-5 lg:left-7 lg:right-auto lg:top-7 lg:w-[340px] rounded-xl border border-line bg-card shadow-e2 overflow-hidden rise">
                <div className="relative h-32">
                  <Foto src={atual.img ? wikiThumb(atual.img, 500) : null} alt={atual.nome} className="absolute inset-0" largura={500} altura={260} mostrarCredito={false} />
                  <div className="absolute inset-0 photo-scrim pointer-events-none" aria-hidden />
                  <FavoriteButton code={atual.code} nome={atual.nome} className="absolute top-2 right-11 z-10" />
                  <button type="button" onClick={() => setSel('')} aria-label={t('exp.fechar')} className="absolute top-2 right-2 w-8 h-8 grid place-items-center rounded-md bg-ink/70 text-white hover:bg-ink focusring"><Icon name="x" size={16} /></button>
                  <div className="absolute left-3 bottom-2 text-white">
                    <div className="coord text-coral">{coordTexto(atual.coords)}</div>
                    <div className="font-display text-2xl tracking-tighter">{atual.nome}</div>
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex items-center justify-between gap-2 text-sm">
                    <span className="text-inksoft">{t(`exp.${CAMADAS.find((c) => c.id === camada).k}`)}</span>
                    <span className="font-mono text-ink">{atualCamada.valor}</span>
                  </div>
                  <p className="mt-2 text-xs text-inksoft line-clamp-2">{atual.estacao}</p>
                  <div className="mt-3 flex gap-2">
                    <Link href={`/destino/${atual.slug}`} className="flex-1 inline-flex items-center justify-center gap-1.5 h-10 rounded-lg bg-coral text-oncoral text-sm font-semibold hover:brightness-95 focusring">{t('exp.verDestino')} <Icon name="arrow-right" size={15} /></Link>
                    <Link href={`/comparar?d=${atual.slug}`} className="inline-flex items-center justify-center gap-1.5 h-10 px-3 rounded-lg border border-line text-sm font-medium text-ink hover:border-pine/50 focusring"><Icon name="scale" size={15} />{t('exp.comparar')}</Link>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* COLEÇÕES editoriais */}
      {!temFiltro && colecoes.map((colecao) => (
        <section key={colecao.id} aria-labelledby={`${colecao.id}-h`}>
          <div className="mb-5">
            <div className="eyebrow mb-2">{t('exp.colecao')}</div>
            <h2 id={`${colecao.id}-h`} className="font-display text-3xl sm:text-4xl tracking-tighter text-ink">{colecao.titulo}</h2>
            <p className="mt-1.5 text-sm text-inksoft max-w-2xl">{colecao.subtitulo}</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {colecao.destinos.slice(0, 4).map((d) => <DestinoCard key={`${colecao.id}-${d.code}`} d={d} img={d.img} />)}
          </div>
        </section>
      ))}
    </div>
  );
}
