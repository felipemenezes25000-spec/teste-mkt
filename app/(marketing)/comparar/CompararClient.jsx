'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { lerFavoritos, FAV_EVENT } from '../../_lib/favoritos.js';
import { destinoPorCode } from '../../_lib/destinos.js';
import { vistoDe, MESES_PT } from '../../_engine/data.js';
import { custoEstadia } from '../../_lib/custos.js';
import { carregarPerfil, perfilDoPreset, PERFIL_EVENT, topInteresses } from '../../_engine/perfil.js';
import { recomendarDestinos } from '../../_engine/decisao.js';
import { Gate } from '../../_components/Gate.jsx';
import { EmptyState } from '../../_components/EmptyState.jsx';
import { Skeleton } from '../../_components/Skeleton.jsx';

const meses = (arr = []) => (arr.length ? arr.map((m) => MESES_PT[m - 1]).join(', ') : '—');

export function CompararClient() {
  const [codes, setCodes] = useState(null);
  const [perfil, setPerfil] = useState(null);

  useEffect(() => {
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

  const destinos = (codes || []).map(destinoPorCode).filter(Boolean);

  if (codes === null) return (
    <div className="mt-6 space-y-3" role="status" aria-label="Carregando" aria-busy="true">
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-64 w-full" />
    </div>
  );

  if (destinos.length < 2) {
    return (
      <div className="mt-6">
        <EmptyState
          icon="⚖️"
          title="Salve pelo menos 2 destinos pra comparar."
          subtitle="Toque no coração nos destinos que te interessam — aqui eles aparecem lado a lado (custo, visto, melhor época)."
          actions={[{ href: '/explorar', label: 'Explorar destinos', primary: true }, { href: '/salvos', label: 'Ver salvos' }]}
        />
      </div>
    );
  }

  const linhas = [
    { k: 'Região', f: (d) => d.regiao },
    { k: 'Moeda local', f: (d) => d.moeda },
    { k: 'Custo médio/dia', f: (d) => `~US$ ${d.custoDia}` },
    { k: 'Custo médio (7 dias)', f: (d) => `~US$ ${custoEstadia(d.custoDia, 7, 'medio').total.toLocaleString('pt-BR')}` },
    { k: 'Melhor época', f: (d) => meses(d.melhoresMeses) },
    { k: 'Visto (passaporte BR)', f: (d) => { const v = vistoDe(d.code, 'BR'); return `${v.tipo} · ${v.dias}d`; } },
    { k: 'Bases sugeridas', f: (d) => (d.cidades || []).slice(0, 3).join(', ') || '—' },
  ];

  const ranking = perfil ? recomendarDestinos(destinos, perfil) : [];
  const meusInteresses = perfil ? topInteresses(perfil, 3).map((t) => t.label).join(', ') : '';

  return (
    <div className="mt-6 space-y-5">
      <div className="overflow-x-auto rounded-2xl border border-line">
        <table className="w-full border-collapse min-w-[520px] bg-card">
          <thead>
            <tr className="border-b border-line">
              <th className="text-left p-3 text-xs uppercase tracking-wide text-inksoft w-36"> </th>
              {destinos.map((d) => (
                <th key={d.code} className="p-3 text-left">
                  <Link href={`/destino/${d.slug}`} className="font-display text-lg text-ink hover:text-pine focusring">{d.nome}</Link>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {linhas.map((l) => (
              <tr key={l.k} className="border-b border-line last:border-0">
                <td className="p-3 text-xs font-semibold text-inksoft whitespace-nowrap">{l.k}</td>
                {destinos.map((d) => <td key={d.code} className="p-3 text-sm text-ink align-top">{l.f(d)}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Comparação PELO SEU PERFIL — gated Premium (a tabela acima é grátis). */}
      <Gate feature="comparar-avancado" titulo="Qual combina mais com VOCÊ" descricao="A comparação acima é factual. O ranking pelo seu perfil de viajante é Premium.">
        <div className="rounded-2xl border border-line bg-card p-5">
          <div className="flex items-baseline justify-between gap-2 flex-wrap">
            <h3 className="font-display text-xl text-ink">🧠 Qual combina mais com você</h3>
            {meusInteresses && <span className="text-xs text-inksoft">seu perfil prioriza: {meusInteresses}</span>}
          </div>
          <ol className="mt-3 space-y-2">
            {ranking.map((d) => (
              <li key={d.id} className="flex items-center gap-3 rounded-xl bg-paper2 p-3">
                <span className="shrink-0 w-7 h-7 grid place-items-center rounded-full bg-pine text-white text-xs font-bold">{d.posicao}º</span>
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
