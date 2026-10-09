'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { lerFavoritos, FAV_EVENT } from '../../_lib/favoritos.js';
import { destinoPorCode, destinoPorSlug, DESTINOS } from '../../_lib/destinos.js';
import { Autocomplete } from '../../_components/Autocomplete.jsx';
import { vistoDe, MESES_PT } from '../../_engine/data.js';
import { custoEstadia } from '../../_lib/custos.js';
import { carregarPerfil, perfilDoPreset, PERFIL_EVENT, topInteresses } from '../../_engine/perfil.js';
import { recomendarDestinos, dimensoesDoDestino } from '../../_engine/decisao.js';
import { Gate } from '../../_components/Gate.jsx';
import { EmptyState } from '../../_ui/EmptyState.jsx';
import { Skeleton } from '../../_components/Skeleton.jsx';
import { mundoScoreDestino, alertaHumanoDestino } from '../../_lib/editorial.js';
import { Icon } from '../../_ui/Icon.jsx';

const meses = (arr = []) => (arr.length ? arr.map((m) => MESES_PT[m - 1]).join(', ') : '—');

const PESOS_PADRAO = { custo: 3, seguranca: 2, gastronomia: 1, score: 2 };

export function CompararClient() {
  const [codes, setCodes] = useState(null);
  const [extras, setExtras] = useState([]); // vindos da URL (?d=slug,slug) ou adicionados aqui
  const [removidos, setRemovidos] = useState([]);
  const [pesos, setPesos] = useState(PESOS_PADRAO);
  const [perfil, setPerfil] = useState(null);

  useEffect(() => {
    const d = new URLSearchParams(window.location.search).get('d');
    if (d) setExtras(d.split(',').map(destinoPorSlug).filter(Boolean).map((x) => x.code).slice(0, 4)); // eslint-disable-line react-hooks/set-state-in-effect
    const sync = () => setCodes(lerFavoritos());
    sync();
    window.addEventListener(FAV_EVENT, sync);

    const syncPerfil = () => setPerfil(carregarPerfil() || perfilDoPreset('equilibrado'));
    syncPerfil();
    window.addEventListener(PERFIL_EVENT, syncPerfil);

    return () => {
      window.removeEventListener(FAV_EVENT, sync);
      window.removeEventListener(PERFIL_EVENT, syncPerfil);
    };
  }, []);

  const todos = [...new Set([...extras, ...(codes || [])])].filter((c) => !removidos.includes(c)).slice(0, 4);
  const destinos = todos.map(destinoPorCode).filter(Boolean);
  const adicionar = (d) => { if (!d) return; setRemovidos((r) => r.filter((c) => c !== d.code)); setExtras((e) => [d.code, ...e.filter((c) => c !== d.code)].slice(0, 4)); };
  const remover = (code) => setRemovidos((r) => [...r, code]);
  const seletor = (
    <div className="flex flex-wrap items-end gap-3">
      <div className="w-full sm:w-80">
        <Autocomplete items={DESTINOS.filter((d) => !todos.includes(d.code))} value={null} onChange={adicionar} toText={(d) => d.nome} toKey={(d) => d.code} toRight={(d) => d.regiao}
          label={destinos.length >= 4 ? 'Máximo de 4 destinos' : 'Adicionar destino à comparação'} placeholder="Buscar país…" />
      </div>
      <div className="flex flex-wrap gap-1.5">
        {destinos.map((d) => (
          <span key={d.code} className="inline-flex items-center gap-1.5 h-9 pl-3 pr-1 rounded-lg border border-line bg-card text-sm text-ink">
            {d.nome}
            <button type="button" onClick={() => remover(d.code)} aria-label={`Remover ${d.nome} da comparação`} className="w-7 h-7 grid place-items-center rounded-md text-inksoft hover:text-danger focusring"><Icon name="x" size={14} /></button>
          </span>
        ))}
      </div>
    </div>
  );

  if (codes === null) return (
    <div className="mt-6 space-y-3" role="status" aria-label="Carregando" aria-busy="true">
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-64 w-full" />
    </div>
  );

  if (destinos.length < 2) {
    return (
      <div className="mt-6 space-y-5">
        {seletor}
        <EmptyState
          icon="⚖️"
          title={destinos.length ? 'Escolha mais um destino para comparar.' : 'Escolha 2 a 4 destinos para comparar.'}
          subtitle="Busque acima ou salve destinos com o coração — eles aparecem lado a lado: custo, segurança, visto e melhor época, com o vencedor de cada critério."
          actions={[{ href: '/explorar', label: 'Explorar o mapa', primary: true }, { href: '/salvos', label: 'Ver salvos' }]}
        />
      </div>
    );
  }

  const ranking = perfil ? recomendarDestinos(destinos, perfil) : [];
  const meusInteresses = perfil ? topInteresses(perfil, 3).map((t) => t.label).join(', ') : '';

  // CRITÉRIOS — cada um sabe extrair um número/texto, definir o sentido (alto
  // ou baixo é melhor) e renderizar a célula. O vencedor é destacado.
  const criterios = [
    { k: 'Mundo Score', kind: 'num', sentido: 'alto', get: (d) => mundoScoreDestino(d).total, fmt: (v) => `${v}/100` },
    { k: 'Custo médio/dia', kind: 'num', sentido: 'baixo', get: (d) => d.custoDia, fmt: (v) => `US$ ${v}` },
    { k: 'Custo 7 dias', kind: 'num', sentido: 'baixo', get: (d) => custoEstadia(d.custoDia, 7, 'medio').total, fmt: (v) => `US$ ${Math.round(v).toLocaleString('pt-BR')}` },
    { k: 'Segurança', kind: 'num', sentido: 'alto', get: (d) => dimensoesDoDestino(d).seguranca, fmt: (v) => `${v}/100` },
    { k: 'Gastronomia', kind: 'num', sentido: 'alto', get: (d) => dimensoesDoDestino(d).gastronomia, fmt: (v) => `${v}/100` },
    { k: 'Cansaço logístico', kind: 'num', sentido: 'alto', get: (d) => mundoScoreDestino(d).subnotas.cansacoLogistico, fmt: (v) => `${v}/100 (alto = menos cansaço)` },
    { k: 'Risco de arrependimento', kind: 'risco', sentido: 'baixo', get: (d) => mundoScoreDestino(d).chanceArrependimento, fmt: (v) => v },
    { k: 'Melhor época', kind: 'texto', get: (d) => meses(d.melhoresMeses) },
    { k: 'Visto (BR)', kind: 'texto', get: (d) => { const v = vistoDe(d.code, 'BR'); return v ? `${v.tipo}${v.dias ? ` · ${v.dias}d` : ''}` : '—'; } },
    { k: 'Região', kind: 'texto', get: (d) => d.regiao },
  ];

  // Vencedor por critério: max ou min dos valores. Em empate, todos marcados.
  const vencedores = criterios.map((c) => {
    if (c.kind === 'texto') return new Set();
    const valores = destinos.map((d) => {
      const v = c.get(d);
      if (c.kind === 'risco') return v === 'baixa' ? 3 : v === 'média' ? 2 : 1;
      return Number(v) || 0;
    });
    const alvo = c.sentido === 'alto' ? Math.max(...valores) : Math.min(...valores);
    const set = new Set();
    valores.forEach((v, i) => { if (v === alvo) set.add(destinos[i].code); });
    return set;
  });

  // Resumo prescritivo: vencedor geral por contagem ponderada de critérios fortes.
  const placar = destinos.map((d) => ({
    code: d.code, nome: d.nome, slug: d.slug,
    vitorias: vencedores.reduce((acc, set) => acc + (set.has(d.code) ? 1 : 0), 0),
    score: mundoScoreDestino(d).total,
    alerta: alertaHumanoDestino(d),
  }));
  // Veredito com PESOS do usuário (V4 §75 "pesos ajustáveis"): normaliza cada
  // dimensão entre os destinos comparados (0–1) e soma ponderado.
  const norm = (vals, alto) => { const mn = Math.min(...vals), mx = Math.max(...vals); return vals.map((v) => (mx === mn ? 1 : alto ? (v - mn) / (mx - mn) : (mx - v) / (mx - mn))); };
  const dims = {
    custo: norm(destinos.map((d) => d.custoDia), false),
    seguranca: norm(destinos.map((d) => dimensoesDoDestino(d).seguranca), true),
    gastronomia: norm(destinos.map((d) => dimensoesDoDestino(d).gastronomia), true),
    score: norm(destinos.map((d) => mundoScoreDestino(d).total), true),
  };
  const somaPesos = Object.values(pesos).reduce((a, b) => a + b, 0) || 1;
  placar.forEach((p, i) => { p.ponderado = Math.round((Object.keys(dims).reduce((acc, k) => acc + dims[k][i] * pesos[k], 0) / somaPesos) * 100); });
  const vencedor = [...placar].sort((a, b) => b.ponderado - a.ponderado || b.score - a.score)[0];

  return (
    <div className="mt-6 space-y-5">
      {seletor}
      <fieldset className="rounded-2xl border border-line bg-card p-4">
        <legend className="eyebrow px-1">O que pesa mais pra você</legend>
        <div className="mt-1 grid gap-3 sm:grid-cols-4">
          {[['custo', 'Custo baixo'], ['seguranca', 'Segurança'], ['gastronomia', 'Gastronomia'], ['score', 'Mundo Score']].map(([k, l]) => (
            <label key={k} className="text-xs text-inksoft">
              <span className="flex justify-between"><span>{l}</span><span className="font-mono text-ink">{pesos[k]}</span></span>
              <input type="range" min="0" max="5" step="1" value={pesos[k]} onChange={(e) => setPesos({ ...pesos, [k]: Number(e.target.value) })} className="w-full accent-[rgb(var(--c-pine))]" />
            </label>
          ))}
        </div>
        <p className="mt-2 text-xs text-inksoft">Pelos seus pesos, o melhor é <strong className="text-ink">{vencedor.nome}</strong> ({vencedor.ponderado}/100). Mude os pesos e o veredito recalcula — comissão de parceiro não entra na conta.</p>
      </fieldset>
      {/* MATRIZ — cada linha um critério, cada coluna um destino, vencedor destacado */}
      <div className="overflow-x-auto rounded-3xl border border-line bg-card shadow-[var(--e-1)]">
        <table className="w-full border-collapse min-w-[640px]">
          <thead>
            <tr className="border-b border-line">
              <th className="text-left p-3 text-xs uppercase tracking-wide text-inksoft w-40 sticky left-0 bg-card">Critério</th>
              {destinos.map((d) => (
                <th key={d.code} className="p-3 text-left">
                  <Link href={`/destino/${d.slug}`} className="font-display text-lg text-ink hover:text-pine focusring block">{d.nome}</Link>
                  <span className="text-[11px] text-inksoft">{d.regiao}</span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {criterios.map((c, idx) => {
              const venc = vencedores[idx];
              return (
                <tr key={c.k} className="border-b border-line last:border-0">
                  <td className="p-3 text-xs font-semibold text-inksoft whitespace-nowrap align-top sticky left-0 bg-card">{c.k}</td>
                  {destinos.map((d) => {
                    const valor = c.get(d);
                    const isVenc = venc.has(d.code);
                    return (
                      <td key={d.code} className={`p-3 text-sm align-top ${isVenc ? 'bg-success-bg' : ''}`}>
                        <div className={`${isVenc ? 'text-success font-semibold' : 'text-ink'} flex items-center gap-1.5`}>
                          {isVenc && <span aria-label="Vencedor neste critério" title="Vencedor" className="text-[10px] font-mono uppercase bg-success text-success-bg px-1.5 py-0.5 rounded">melhor</span>}
                          <span>{c.fmt ? c.fmt(valor) : valor}</span>
                        </div>
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* RESUMO PRESCRITIVO — não esconde a recomendação: a gente fala. */}
      <div className="rounded-3xl border border-pine/30 bg-pine/[0.05] p-5 sm:p-6">
        <div className="flex flex-wrap items-baseline gap-2">
          <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-pine">Veredito</span>
          <span className="text-xs text-inksoft">{vencedor.vitorias} de {criterios.filter((c) => c.kind !== 'texto').length} critérios objetivos</span>
        </div>
        <h3 className="mt-2 font-display text-2xl text-ink">
          Entre estes, <Link href={`/destino/${vencedor.slug}`} className="text-pine underline decoration-pine/30 hover:decoration-pine">{vencedor.nome}</Link> tende a render mais.
        </h3>
        <p className="mt-2 text-sm text-inksoft">{vencedor.alerta}</p>
        <div className="mt-4 grid sm:grid-cols-3 gap-2">
          {placar.map((p) => (
            <div key={p.code} className={`rounded-2xl border p-3 ${p.code === vencedor.code ? 'border-pine bg-card' : 'border-line bg-card/60'}`}>
              <div className="flex items-baseline justify-between gap-2">
                <span className="font-display text-base text-ink">{p.nome}</span>
                <span className="text-[10px] text-inksoft tnum">{p.vitorias} v · score {p.score}</span>
              </div>
              <p className="mt-1 text-[11px] text-inksoft leading-snug">{p.alerta}</p>
            </div>
          ))}
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <Link href={`/roteiro?destino=${vencedor.slug}`} className="inline-flex rounded-xl bg-pine text-onpine font-semibold px-4 py-2 text-sm hover:bg-pinedk focusring">
            Montar roteiro de {vencedor.nome} <Icon emoji="→" />
          </Link>
          <Link href="/custo-real" className="inline-flex rounded-xl border border-line bg-card text-ink font-semibold px-4 py-2 text-sm hover:text-pine focusring">
            Ver custo real
          </Link>
          <Link href="/decisao" className="inline-flex rounded-xl border border-line bg-card text-inksoft font-semibold px-4 py-2 text-sm hover:text-pine focusring">
            Recomeçar a decisão
          </Link>
        </div>
      </div>

      {/* Comparação PELO SEU PERFIL — gated Premium (a tabela acima é grátis). */}
      <Gate feature="comparar-avancado" titulo="Qual combina mais com VOCÊ" descricao="A comparação acima é factual. O ranking pelo seu perfil de viajante é Premium.">
        <div className="rounded-2xl border border-line bg-card p-5">
          <div className="flex items-baseline justify-between gap-2 flex-wrap">
            <h3 className="font-display text-xl text-ink"><Icon emoji="🧠" /> Qual combina mais com você</h3>
            {meusInteresses && <span className="text-xs text-inksoft">seu perfil prioriza: {meusInteresses}</span>}
          </div>
          <ol className="mt-3 space-y-2">
            {ranking.map((d) => (
              <li key={d.id} className="flex items-center gap-3 rounded-xl bg-paper2 p-3">
                <span className="shrink-0 w-7 h-7 grid place-items-center rounded-full bg-pine text-onpine text-xs font-bold">{d.posicao}º</span>
                <span className="shrink-0 w-11 h-7 grid place-items-center rounded-full bg-pine/10 text-pine text-xs font-bold tnum">{d.pontos}</span>
                <div className="min-w-0">
                  <Link href={`/destino/${d.slug}`} className="font-semibold text-ink hover:text-pine focusring">{d.nome}</Link>
                  <p className="text-xs text-inksoft leading-snug">{d.porque}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </Gate>
    </div>
  );
}
