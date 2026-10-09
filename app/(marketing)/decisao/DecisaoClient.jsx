'use client';
import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { STORAGE_KEY, MESES_PT } from '../../_engine/data.js';
import { carregarPlano } from '../../_engine/storage.js';
import { calcular } from '../../_engine/calc.js';
import { scoreViagem } from '../../_engine/score.js';
import { custoTotalRealista, resumoVitrineVsReal } from '../../_engine/custoTotal.js';
import { escanearOportunidades } from '../../_engine/oportunidades.js';
import { CustoVitrineVsReal } from '../../_components/CustoVitrineVsReal.jsx';
import { ServicosDaViagem } from '../../_components/ServicosDaViagem.jsx';
import { ModoGrupo } from '../../_components/ModoGrupo.jsx';
import { recomendarDestinos } from '../../_engine/decisao.js';
import { carregarPerfil, salvarPerfil, perfilDoPreset, pesosScore, topInteresses, PERFIS_PRONTOS, INTERESSE_LABEL, PERFIL_EVENT } from '../../_engine/perfil.js';
import { fmtMoeda } from '../../_engine/utils.js';
import { track } from '../../_lib/analytics.js';
import { useIdioma } from '../../_lib/i18n.js';
import { FavoriteButton } from '../../_components/FavoriteButton.jsx';
import { CardsSkeleton } from '../../_components/Skeleton.jsx';
import { Icon } from '../../_ui/Icon.jsx';
import { Foto } from '../../_ui/Foto.jsx';
import { wikiThumb } from '../../_lib/wikiThumb.js';

// Ordem e rótulo das 8 dimensões do score.
const DIM = [
  ['custoBeneficio', 'Custo-benefício', '💰'],
  ['experienciaLocal', 'Experiência local', '🎭'],
  ['seguranca', 'Segurança', '🛡️'],
  ['risco', 'Baixo risco', '✅'],
  ['gastronomia', 'Gastronomia', '🍽️'],
  ['conforto', 'Conforto', '🛋️'],
  ['tempoLivre', 'Tempo livre', '🌿'],
  ['economia', 'Economia', '🪙'],
];

const SELO = {
  excelente: { label: 'Excelente', cls: 'bg-success-bg text-success border-success-bd' },
  bom: { label: 'Boa viagem', cls: 'bg-success-bg text-success border-success-bd' },
  regular: { label: 'Dá pra melhorar', cls: 'bg-warn-bg text-warn border-warn-bd' },
  fraco: { label: 'Atenção', cls: 'bg-danger-bg text-danger border-danger-bd' },
};

const PRIO = {
  P0: { label: 'Urgente', cls: 'bg-danger-bg text-danger border-danger-bd' },
  P1: { label: 'Importante', cls: 'bg-warn-bg text-warn border-warn-bd' },
  P2: { label: 'Dica', cls: 'bg-card text-inksoft border-line' },
  P3: { label: 'Dica', cls: 'bg-card text-inksoft border-line' },
};

const corNota = (n) => (n >= 70 ? 'bg-success' : n >= 50 ? 'bg-warn' : 'bg-danger');

function Barra({ nota, label, icon, texto }) {
  return (
    <div>
      <div className="flex items-center justify-between text-sm">
        <span className="text-ink"><span aria-hidden className="mr-1"><Icon emoji={icon} /></span>{label}</span>
        <span className="tnum font-semibold text-ink">{nota}</span>
      </div>
      <div className="mt-1 h-2 rounded-full bg-paper2 overflow-hidden" role="img" aria-label={`${label}: ${nota} de 100`}>
        <div className={`h-full rounded-full ${corNota(nota)}`} style={{ width: `${nota}%` }} />
      </div>
      {texto ? <p className="mt-1 text-[11px] text-inksoft leading-snug">{texto}</p> : null}
    </div>
  );
}

export function DecisaoClient({ destinos }) {
  const [perfil, setPerfil] = useState(null);
  const [presetId, setPresetId] = useState('equilibrado');
  const [calc, setCalc] = useState(null);
  const [rates, setRates] = useState(null);
  const [temPlanoSalvo, setTemPlanoSalvo] = useState(false);
  const [diasPretendidos, setDiasPretendidos] = useState(8);
  const [orcamentoBRL, setOrcamentoBRL] = useState(6500);
  const [companhia, setCompanhia] = useState('casal');
  const [perrengue, setPerrengue] = useState('medio');
  const [origem, setOrigem] = useState('GRU');
  const [mes, setMes] = useState(0); // 0 = qualquer mês
  const { t } = useIdioma();

  useEffect(() => {
    const salvo = carregarPerfil();
    setPerfil(salvo || perfilDoPreset('equilibrado'));
    try { setTemPlanoSalvo(!!localStorage.getItem(STORAGE_KEY)); } catch {}
    try {
      const pl = carregarPlano();
      setCalc(calcular(pl));
      setRates((pl.settings && pl.settings.fx && pl.settings.fx.rates) || null);
    } catch {}

    // Re-renderiza quando o perfil muda (ex.: favoritou um destino recomendado).
    const onPerfil = () => { const p = carregarPerfil(); if (p) setPerfil(p); };
    window.addEventListener(PERFIL_EVENT, onPerfil);
    return () => window.removeEventListener(PERFIL_EVENT, onPerfil);
  }, []);

  function escolherPreset(id) {
    setPresetId(id);
    const p = perfilDoPreset(id);
    setPerfil(p);
    salvarPerfil(p, id);
    track('perfil_definido', { preset: id });
  }

  const imgPorCode = useMemo(() => {
    const m = {};
    for (const d of destinos) m[d.code] = d.img;
    return m;
  }, [destinos]);

  const taxaBRL = (rates && rates.BRL) || 5.4;
  const budgetDiaUSD = Math.max(12, (Number(orcamentoBRL) / taxaBRL) / Math.max(1, Number(diasPretendidos)) * 0.55);
  const ranked = useMemo(() => {
    if (!perfil) return [];
    const base = recomendarDestinos(destinos, perfil);
    return base.map((destino) => {
      const folga = budgetDiaUSD - destino.custoDia;
      const ajusteBudget = folga >= 10 ? 7 : folga >= 0 ? 3 : folga > -18 ? -7 : -15;
      const ajustePerrengue = perrengue === 'baixo' && destino.custoDia < 30 ? -2 : perrengue === 'alto' && destino.custoDia < 40 ? 4 : 0;
      // Mês: se o usuário escolheu um mês, premiamos quem está na melhor época e
      // penalizamos quem está fora. Quando "qualquer mês", não interfere.
      const destinoFull = destinos.find((d) => d.code === destino.id);
      const naMelhorEpoca = mes > 0 && destinoFull && (destinoFull.melhoresMeses || []).includes(mes);
      const foraDaEpoca = mes > 0 && destinoFull && (destinoFull.melhoresMeses || []).length > 0 && !naMelhorEpoca;
      const ajusteMes = naMelhorEpoca ? 6 : foraDaEpoca ? -5 : 0;
      const pontos = Math.max(0, Math.min(100, Math.round(destino.pontos + ajusteBudget + ajustePerrengue + ajusteMes)));
      let porqueExtra = folga >= 0 ? 'Cabe melhor no seu orçamento informado.' : 'Pode exigir cortes ou mais dias para respirar.';
      if (naMelhorEpoca) porqueExtra += ` ${MESES_PT[mes - 1]} está na janela ótima.`;
      if (foraDaEpoca) porqueExtra += ` Atenção: ${MESES_PT[mes - 1]} está fora da melhor época.`;
      return {
        ...destino,
        pontos,
        porque: `${destino.porque} ${porqueExtra}`,
      };
    }).sort((a, b) => b.pontos - a.pontos).map((destino, index) => ({ ...destino, posicao: index + 1 })).slice(0, 8);
  }, [destinos, perfil, budgetDiaUSD, perrengue, mes]);
  const score = useMemo(() => (perfil && calc ? scoreViagem(calc, { pesos: pesosScore(perfil) }) : null), [perfil, calc]);
  const ops = useMemo(() => (calc ? escanearOportunidades(calc) : []), [calc]);
  const custo = useMemo(() => (calc ? custoTotalRealista(calc) : null), [calc]);
  const vitrine = useMemo(() => (calc ? resumoVitrineVsReal(calc) : null), [calc]);
  const top = perfil ? topInteresses(perfil, 3) : [];

  if (!perfil) return (
    <div className="mt-6 space-y-6" role="status" aria-label="Carregando sua decisão" aria-busy="true">
      <div className="flex flex-wrap gap-2">{[0, 1, 2, 3].map((i) => <div key={i} className="skel h-9 w-28 rounded-xl" />)}</div>
      <CardsSkeleton n={4} />
    </div>
  );

  return (
    <div className="mt-6 space-y-12">
      {/* ============ WIZARD ============ */}
      <section aria-labelledby="wizard-h" className="rounded-2xl border border-line bg-card p-5 sm:p-6 shadow-e1">
        <div className="grid lg:grid-cols-[1fr_0.95fr] gap-6">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-pine font-bold">{t('decisao.wizardSelo')}</p>
            <h2 id="wizard-h" className="mt-1 font-display text-2xl sm:text-3xl text-ink">{t('decisao.wizardH2')}</h2>
            <p className="mt-2 text-sm text-inksoft">Tudo recalcula no momento em que você muda. Sem botão de “gerar”.</p>

            {/* INDICADOR DE ETAPAS — visual, não bloqueante */}
            <ol className="mt-4 flex flex-wrap gap-1.5 text-[10px] uppercase tracking-wider font-semibold">
              {['Origem','Mês','Dias','Orçamento','Companhia','Estilo','Tolerância','Resultado'].map((etapa) => (
                <li key={etapa} className="px-2 py-1 rounded-full bg-pine/10 text-pine">{etapa}</li>
              ))}
            </ol>

            <div className="mt-5 grid sm:grid-cols-2 gap-3">
              <label className="text-xs text-inksoft font-semibold">{t('decisao.saindoDe')}
                <select value={origem} onChange={(e) => setOrigem(e.target.value)} className="mt-1 w-full px-3 py-2 rounded-xl border border-line bg-input text-ink focusring">
                  <option value="GRU">São Paulo (GRU)</option>
                  <option value="GIG">Rio de Janeiro (GIG)</option>
                  <option value="BSB">Brasília (BSB)</option>
                  <option value="POA">Porto Alegre (POA)</option>
                  <option value="CNF">Belo Horizonte (CNF)</option>
                  <option value="REC">Recife (REC)</option>
                  <option value="SSA">Salvador (SSA)</option>
                  <option value="FOR">Fortaleza (FOR)</option>
                  <option value="CWB">Curitiba (CWB)</option>
                </select>
              </label>
              <label className="text-xs text-inksoft font-semibold">{t('decisao.mes')}
                <select value={mes} onChange={(e) => setMes(Number(e.target.value))} className="mt-1 w-full px-3 py-2 rounded-xl border border-line bg-input text-ink focusring">
                  <option value={0}>{t('decisao.mesQualquer')}</option>
                  {MESES_PT.map((m, i) => <option key={m} value={i + 1}>{m}</option>)}
                </select>
              </label>
              <label className="text-xs text-inksoft font-semibold">{t('decisao.dias')}
                <input type="number" min="3" max="45" value={diasPretendidos} onChange={(e) => setDiasPretendidos(Math.max(3, Math.min(45, Number(e.target.value) || 8)))} className="mt-1 w-full px-3 py-2 rounded-xl border border-line bg-input text-ink focusring tnum" />
              </label>
              <label className="text-xs text-inksoft font-semibold">{t('decisao.orcamento')}
                <div className="mt-1 flex rounded-xl border border-line bg-input overflow-hidden focus-within:outline focus-within:outline-2 focus-within:outline-pine">
                  <span className="px-3 py-2 text-sm text-inksoft bg-paper2 border-r border-line">R$</span>
                  <input type="number" min="500" value={orcamentoBRL} onChange={(e) => setOrcamentoBRL(Math.max(500, Number(e.target.value) || 6500))} className="w-full px-3 py-2 bg-transparent text-ink tnum outline-none" />
                </div>
              </label>
              <label className="text-xs text-inksoft font-semibold">{t('decisao.estilo')}
                <select value={presetId} onChange={(e) => escolherPreset(e.target.value)} className="mt-1 w-full px-3 py-2 rounded-xl border border-line bg-input text-ink focusring">
                  {Object.entries(PERFIS_PRONTOS).map(([id, p]) => <option key={id} value={id}>{p.nome}</option>)}
                </select>
              </label>
              <label className="text-xs text-inksoft font-semibold">{t('decisao.companhia')}
                <select value={companhia} onChange={(e) => setCompanhia(e.target.value)} className="mt-1 w-full px-3 py-2 rounded-xl border border-line bg-input text-ink focusring">
                  <option value="solo">Solo</option>
                  <option value="casal">Casal</option>
                  <option value="amigos">Amigos</option>
                  <option value="familia">Família</option>
                </select>
              </label>
              <label className="text-xs text-inksoft font-semibold sm:col-span-2">{t('decisao.tolerancia')}
                <div className="mt-1 grid grid-cols-3 rounded-xl border border-line bg-paper2 p-1">
                  {[
                    ['baixo', t('decisao.tolBaixo')],
                    ['medio', t('decisao.tolMedio')],
                    ['alto', t('decisao.tolAlto')],
                  ].map(([id, label]) => (
                    <button key={id} type="button" onClick={() => setPerrengue(id)} aria-pressed={perrengue === id}
                      className={`rounded-lg px-3 py-2 text-sm font-semibold transition focusring ${perrengue === id ? 'bg-card text-pine shadow-sm' : 'text-inksoft hover:text-ink'}`}>
                      {label}
                    </button>
                  ))}
                </div>
              </label>
            </div>
            <p className="mt-3 text-xs text-inksoft">
              Leitura rápida: ~US$ {Math.round(budgetDiaUSD)}/dia útil para destino, hospedagem e chão da viagem. Passagem cara pode mudar tudo.
            </p>
          </div>

          <div className="rounded-2xl border border-line bg-paper2/60 p-4">
            <div className="flex items-center justify-between gap-3">
              <h3 className="font-display text-xl text-ink">{t('decisao.resultadoInst')}</h3>
              <span className="text-xs text-inksoft">{origem} · {mes > 0 ? MESES_PT[mes - 1] : 'qualquer mês'} · {diasPretendidos} dias · {companhia}</span>
            </div>
            <div className="mt-3 space-y-3">
              {ranked.slice(0, 3).map((destino) => (
                <Link key={destino.id} href={`/destino/${destino.slug}`} className="block rounded-2xl border border-line bg-card p-3 hover:border-pine/40 hover:shadow-e1 transition focusring">
                  <div className="flex items-start gap-3">
                    <div className="w-14 h-14 rounded-2xl bg-pine text-onpine grid place-items-center shrink-0">
                      <span className="font-display text-2xl tnum">{destino.pontos}</span>
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-baseline gap-2">
                        <h4 className="font-display text-lg text-ink truncate">{destino.nome}</h4>
                        <span className="text-xs text-inksoft tnum shrink-0">US$ {destino.custoDia}/dia</span>
                      </div>
                      <p className="text-xs text-inksoft leading-snug line-clamp-2">{destino.porque}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ============ PERFIL ============ */}
      <section aria-labelledby="perfil-h">
        <h2 id="perfil-h" className="font-display text-2xl text-ink">Ajuste fino do seu perfil</h2>
        <p className="mt-1 text-inksoft text-sm max-w-2xl">
          A gente personaliza tudo — recomendações e notas — pelo seu jeito de viajar. Escolha um ponto de partida (dá pra mudar quando quiser).
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          {Object.entries(PERFIS_PRONTOS).map(([id, p]) => {
            const ativo = presetId === id;
            return (
              <button
                key={id}
                type="button"
                aria-pressed={ativo}
                onClick={() => escolherPreset(id)}
                className={`px-3.5 py-2 rounded-xl text-sm font-semibold border transition focusring ${ativo ? 'bg-pine text-onpine border-pine shadow-sm' : 'bg-card text-ink border-line hover:border-pine/40'}`}
              >
                <span aria-hidden className="mr-1"><Icon emoji={p.emoji} /></span>{p.nome}
              </button>
            );
          })}
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-inksoft">
          <span>Prioriza:</span>
          {top.map((t) => (
            <span key={t.id} className="px-2 py-0.5 rounded-full bg-pine/10 text-pine font-semibold">{INTERESSE_LABEL[t.id]}</span>
          ))}
        </div>
      </section>

      {/* ============ RECOMENDAÇÕES ============ */}
      <section aria-labelledby="rec-h">
        <h2 id="rec-h" className="font-display text-2xl text-ink">2 · Destinos recomendados pra você</h2>
        <p className="mt-1 text-inksoft text-sm max-w-2xl">
          Ranqueados pelo seu perfil — não é lista alfabética, é <strong className="text-ink">decisão</strong>. Cada um vem com o porquê.
        </p>
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {ranked.map((d) => {
            const img = imgPorCode[d.id];
            const fortes = DIM.filter(([k]) => d.dimensoes[k] >= 60).sort((a, b) => d.dimensoes[b[0]] - d.dimensoes[a[0]]).slice(0, 3);
            return (
              <div key={d.id} className="relative group">
                <FavoriteButton code={d.id} nome={d.nome} className="absolute top-2 right-2 z-10" />
                <div className="absolute top-2 left-2 z-10 flex items-center gap-1">
                  <span className="text-[11px] font-bold bg-ink/70 text-white w-6 h-6 grid place-items-center rounded-full">{d.posicao}º</span>
                  <span className="text-[11px] font-bold bg-pine text-onpine px-2 h-6 grid place-items-center rounded-full tnum">{d.pontos}</span>
                </div>
                <Link href={`/destino/${d.slug}`} className="block rounded-2xl border border-line bg-card overflow-hidden hover:shadow-e1 hover:-translate-y-0.5 transition focusring">
                  <div className="relative h-36 bg-paper2 overflow-hidden">
                    <Foto src={img ? wikiThumb(img, 500) : null} alt={d.nome} className="absolute inset-0" imgClassName="group-hover:scale-[1.03] transition duration-700" mostrarCredito={false} largura={500} altura={300} />
                  </div>
                  <div className="p-3.5">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="font-display text-lg text-ink truncate">{d.nome}</h3>
                      <span className="text-xs text-inksoft tnum shrink-0">~US$ {d.custoDia}/dia</span>
                    </div>
                    <p className="mt-1 text-xs text-inksoft leading-snug line-clamp-2">{d.porque}</p>
                    <div className="mt-2 flex flex-wrap gap-1">
                      {fortes.map(([k, label, icon]) => (
                        <span key={k} className="text-[10px] font-semibold px-1.5 py-0.5 rounded-md bg-sage/15 text-pine"><Icon emoji={icon} /> {label}</span>
                      ))}
                    </div>
                  </div>
                </Link>
              </div>
            );
          })}
        </div>
      </section>

      {/* ============ SCORE DA VIAGEM ============ */}
      <section aria-labelledby="score-h">
        <div className="flex items-end justify-between gap-3 flex-wrap">
          <div>
            <h2 id="score-h" className="font-display text-2xl text-ink">3 · Score da sua viagem</h2>
            <p className="mt-1 text-inksoft text-sm max-w-2xl">
              {temPlanoSalvo ? 'Da rota que você montou no planejador' : 'Você ainda não montou uma rota — mostrando uma viagem-exemplo'}, avaliada em 8 dimensões pelo seu perfil.
            </p>
          </div>
          <Link href="/planejar" className="rounded-xl bg-card border border-line text-ink font-semibold text-sm px-4 py-2 hover:border-pine/40 focusring">
            {temPlanoSalvo ? 'Abrir no planejador ' : 'Montar minha rota '}
          </Link>
        </div>

        {score && (
          <div className="mt-4 grid lg:grid-cols-3 gap-4">
            {/* Nota geral + custo total */}
            <div className="rounded-2xl border border-line bg-card p-5 flex flex-col">
              <div className="flex items-center gap-4">
                <div className="shrink-0 w-20 h-20 rounded-2xl bg-pine text-onpine grid place-items-center">
                  <span className="font-display text-3xl leading-none tnum">{score.geral}</span>
                </div>
                <div>
                  <span className={`inline-block text-xs font-bold px-2 py-0.5 rounded-full border ${SELO[score.selo].cls}`}>{SELO[score.selo].label}</span>
                  <p className="mt-1 text-sm text-inksoft">Nota geral de 0 a 100, ponderada pelo seu perfil.</p>
                </div>
              </div>
              {custo && (
                <div className="mt-5 pt-4 border-t border-line">
                  <p className="text-xs uppercase tracking-wide text-inksoft font-semibold">Custo total realista</p>
                  <p className="mt-1 font-display text-2xl text-ink tnum">{fmtMoeda(custo.total, 'USD')}</p>
                  <p className="text-xs text-inksoft">~{fmtMoeda(custo.porDia, 'USD')}/dia · inclui seguro, eSIM, vistos e 12% de reserva</p>
                  <div className="mt-2 flex gap-1.5 text-[11px]">
                    <span className="px-2 py-0.5 rounded-full bg-paper2 text-inksoft">Mochila {fmtMoeda(custo.faixa.mochila, 'USD')}</span>
                    <span className="px-2 py-0.5 rounded-full bg-paper2 text-inksoft">Conforto {fmtMoeda(custo.faixa.conforto, 'USD')}</span>
                  </div>
                </div>
              )}
            </div>

            {/* 8 dimensões */}
            <div className="lg:col-span-2 rounded-2xl border border-line bg-card p-5 grid sm:grid-cols-2 gap-x-6 gap-y-4">
              {DIM.map(([k, label, icon]) => (
                <Barra key={k} nota={score.dimensoes[k].nota} label={label} icon={icon} texto={score.dimensoes[k].texto} />
              ))}
            </div>
          </div>
        )}
      </section>

      {/* ============ CUSTO HONESTO ============ */}
      {vitrine && (
        <section aria-labelledby="vitrine-h">
          <h2 id="vitrine-h" className="font-display text-2xl text-ink">Custo de vitrine vs. custo real</h2>
          <p className="mt-1 text-inksoft text-sm max-w-2xl">
            O preço que as OTAs anunciam é só voo e hotel. A gente soma o resto — pra você não tomar susto na viagem.
          </p>
          <div className="mt-4 grid lg:grid-cols-2 gap-4 items-start">
            <CustoVitrineVsReal resumo={vitrine} contexto="Da rota avaliada acima — cada item que a vitrine não te conta:" />
            <ServicosDaViagem
              totalUSD={custo && custo.total}
              taxaBRL={rates && rates.BRL}
              destino={calc && calc.trechos && calc.trechos[0] && calc.trechos[0].nome}
            />
          </div>
          <div className="mt-4">
            <ModoGrupo custo={custo} />
          </div>
        </section>
      )}

      {/* ============ CENTRAL DE OPORTUNIDADES ============ */}
      <section aria-labelledby="ops-h">
        <h2 id="ops-h" className="font-display text-2xl text-ink">4 · Central de oportunidades</h2>
        <p className="mt-1 text-inksoft text-sm max-w-2xl">
          Ganhos concretos que a gente encontrou varrendo sua rota — onde economizar, o que corrigir antes de viajar.
        </p>
        {ops.length === 0 ? (
          <div className="mt-4 rounded-2xl border border-dashed border-line bg-card p-8 text-center text-inksoft text-sm">
            Tudo certo por aqui — nenhum furo de visto, estouro de orçamento ou conflito de estação na sua rota. <Icon emoji="👏" />
          </div>
        ) : (
          <ul className="mt-4 space-y-3">
            {ops.map((o, i) => (
              <li key={i} className="rounded-2xl border border-line bg-card p-4 flex gap-3 items-start">
                <span className={`shrink-0 text-[11px] font-bold px-2 py-0.5 rounded-full border ${PRIO[o.prioridade].cls}`}>{PRIO[o.prioridade].label}</span>
                <div className="min-w-0">
                  <p className="font-semibold text-ink">{o.titulo}</p>
                  <p className="text-sm text-inksoft mt-0.5">{o.descricao}</p>
                  <p className="text-xs text-pine font-semibold mt-1"><Icon emoji="→" /> {o.comoAplicar}{o.economia ? ` · economia ~${fmtMoeda(o.economia, 'USD')}` : ''}</p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <p className="text-[11px] text-inksoft border-t border-line pt-4">
        Notas e índices são <strong>estimativas</strong> de referência (segurança, gastronomia, custo) para apoiar a decisão — confira sempre na fonte oficial. O Score e as recomendações são calculados no seu navegador, a partir do seu perfil e da sua rota.
      </p>
    </div>
  );
}
