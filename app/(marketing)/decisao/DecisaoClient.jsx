'use client';
import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { STORAGE_KEY } from '../../_engine/data.js';
import { carregarPlano } from '../../_engine/storage.js';
import { calcular } from '../../_engine/calc.js';
import { scoreViagem } from '../../_engine/score.js';
import { custoTotalRealista, resumoVitrineVsReal } from '../../_engine/custoTotal.js';
import { escanearOportunidades } from '../../_engine/oportunidades.js';
import { CustoVitrineVsReal } from '../../_components/CustoVitrineVsReal.jsx';
import { ServicosDaViagem } from '../../_components/ServicosDaViagem.jsx';
import { recomendarDestinos } from '../../_engine/decisao.js';
import { carregarPerfil, salvarPerfil, perfilDoPreset, pesosScore, topInteresses, PERFIS_PRONTOS, INTERESSE_LABEL, PERFIL_EVENT } from '../../_engine/perfil.js';
import { fmtMoeda } from '../../_engine/utils.js';
import { FavoriteButton } from '../../_components/FavoriteButton.jsx';

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
        <span className="text-ink"><span aria-hidden className="mr-1">{icon}</span>{label}</span>
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
  }

  const imgPorCode = useMemo(() => {
    const m = {};
    for (const d of destinos) m[d.code] = d.img;
    return m;
  }, [destinos]);

  const ranked = useMemo(() => (perfil ? recomendarDestinos(destinos, perfil).slice(0, 8) : []), [destinos, perfil]);
  const score = useMemo(() => (perfil && calc ? scoreViagem(calc, { pesos: pesosScore(perfil) }) : null), [perfil, calc]);
  const ops = useMemo(() => (calc ? escanearOportunidades(calc) : []), [calc]);
  const custo = useMemo(() => (calc ? custoTotalRealista(calc) : null), [calc]);
  const vitrine = useMemo(() => (calc ? resumoVitrineVsReal(calc) : null), [calc]);
  const top = perfil ? topInteresses(perfil, 3) : [];

  if (!perfil) return <div className="mt-8 text-inksoft text-sm">Carregando seu perfil…</div>;

  return (
    <div className="mt-6 space-y-12">
      {/* ============ PERFIL ============ */}
      <section aria-labelledby="perfil-h">
        <h2 id="perfil-h" className="font-display text-2xl text-ink">1 · Seu perfil de viajante</h2>
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
                className={`px-3.5 py-2 rounded-xl text-sm font-semibold border transition focusring ${ativo ? 'bg-pine text-white border-pine shadow-sm' : 'bg-card text-ink border-line hover:border-pine/40'}`}
              >
                <span aria-hidden className="mr-1">{p.emoji}</span>{p.nome}
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
                  <span className="text-[11px] font-bold bg-pine text-white px-2 h-6 grid place-items-center rounded-full tnum">{d.pontos}</span>
                </div>
                <Link href={`/destino/${d.slug}`} className="block rounded-2xl border border-line bg-card overflow-hidden hover:shadow-[var(--e-1)] hover:-translate-y-0.5 transition focusring">
                  <div className="relative h-36 bg-paper2 overflow-hidden">
                    {img ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={img} alt={d.nome} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                    ) : (
                      <div className="w-full h-full grid place-items-center bg-gradient-to-br from-pine/15 to-ochre/15 text-3xl" aria-hidden>🗺️</div>
                    )}
                  </div>
                  <div className="p-3.5">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="font-display text-lg text-ink truncate">{d.nome}</h3>
                      <span className="text-xs text-inksoft tnum shrink-0">~US$ {d.custoDia}/dia</span>
                    </div>
                    <p className="mt-1 text-xs text-inksoft leading-snug line-clamp-2">{d.porque}</p>
                    <div className="mt-2 flex flex-wrap gap-1">
                      {fortes.map(([k, label, icon]) => (
                        <span key={k} className="text-[10px] font-semibold px-1.5 py-0.5 rounded-md bg-sage/15 text-pine">{icon} {label}</span>
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
            {temPlanoSalvo ? 'Abrir no planejador →' : 'Montar minha rota →'}
          </Link>
        </div>

        {score && (
          <div className="mt-4 grid lg:grid-cols-3 gap-4">
            {/* Nota geral + custo total */}
            <div className="rounded-2xl border border-line bg-card p-5 flex flex-col">
              <div className="flex items-center gap-4">
                <div className="shrink-0 w-20 h-20 rounded-2xl bg-pine text-white grid place-items-center">
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
            Tudo certo por aqui — nenhum furo de visto, estouro de orçamento ou conflito de estação na sua rota. 👏
          </div>
        ) : (
          <ul className="mt-4 space-y-3">
            {ops.map((o, i) => (
              <li key={i} className="rounded-2xl border border-line bg-card p-4 flex gap-3 items-start">
                <span className={`shrink-0 text-[11px] font-bold px-2 py-0.5 rounded-full border ${PRIO[o.prioridade].cls}`}>{PRIO[o.prioridade].label}</span>
                <div className="min-w-0">
                  <p className="font-semibold text-ink">{o.titulo}</p>
                  <p className="text-sm text-inksoft mt-0.5">{o.descricao}</p>
                  <p className="text-xs text-pine font-semibold mt-1">→ {o.comoAplicar}{o.economia ? ` · economia ~${fmtMoeda(o.economia, 'USD')}` : ''}</p>
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
