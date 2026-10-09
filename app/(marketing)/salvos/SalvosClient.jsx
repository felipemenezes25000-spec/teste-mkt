'use client';
import { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import { lerFavoritos, FAV_EVENT } from '../../_lib/favoritos.js';
import { destinoPorCode, DESTINOS } from '../../_lib/destinos.js';
import { DestinoCard } from '../../_components/DestinoCard.jsx';
import { EmptyState } from '../../_ui/EmptyState.jsx';
import { CardsSkeleton } from '../../_components/Skeleton.jsx';
import { alertaHumanoDestino, mundoScoreDestino } from '../../_lib/editorial.js';
import { Icon } from '../../_ui/Icon.jsx';

export function SalvosClient() {
  const [codes, setCodes] = useState(null); // null = ainda lendo localStorage
  const [imgs, setImgs] = useState({});

  useEffect(() => {
    const sync = () => setCodes(lerFavoritos());
    sync();
    window.addEventListener(FAV_EVENT, sync);
    return () => window.removeEventListener(FAV_EVENT, sync);
  }, []);

  const destinos = (codes || []).map(destinoPorCode).filter(Boolean);
  const vazio = codes !== null && destinos.length === 0;
  // 5 recomendados (destaques) pra preencher o estado vazio com algo útil.
  const recomendados = useMemo(() => {
    const dest = DESTINOS.filter((d) => d.destaque);
    return (dest.length ? dest : DESTINOS).slice(0, 5);
  }, []);
  const aMostrar = vazio ? recomendados : destinos;

  // Fotos resolvidas no servidor (/api/fotos): URL em largura segura + crédito.
  useEffect(() => {
    let vivo = true;
    const faltam = aMostrar.filter((d) => imgs[d.code] === undefined).map((d) => d.code);
    if (!faltam.length) return undefined;
    fetch(`/api/fotos?codes=${faltam.join(',')}`).then((r) => (r.ok ? r.json() : {})).then((j) => {
      if (vivo) setImgs((p) => ({ ...p, ...Object.fromEntries(faltam.map((c) => [c, j[c] || { img: null }])) }));
    }).catch(() => {});
    return () => { vivo = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [codes]);

  if (codes === null) return <div className="mt-6"><CardsSkeleton n={4} /></div>;

  if (vazio) {
    return (
      <div className="mt-6">
        <EmptyState
          icon="∞"
          title="Você ainda não salvou destinos."
          subtitle="Comece por destinos que costumam valer muito para brasileiros — depois a gente compara custo, score e alerta lado a lado."
          actions={[{ href: '/decisao', label: 'Descobrir o que combina', primary: true }, { href: '/explorar', label: 'Explorar curadoria' }]}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {recomendados.map((d) => <DestinoCard key={d.code} d={d} img={imgs[d.code]?.img} credito={imgs[d.code]?.credito} />)}
          </div>
        </EmptyState>
      </div>
    );
  }

  return (
    <div className="mt-6">
      <div className="flex items-center justify-between gap-3 mb-4">
        <p className="text-sm text-inksoft" aria-live="polite">{destinos.length} destino(s) salvo(s)</p>
        {destinos.length >= 2 && <Link href="/comparar" className="text-sm font-semibold text-pine hover:underline focusring"><Icon emoji="⚖️" /> Comparar <Icon emoji="→" /></Link>}
      </div>

      <div className="rounded-2xl border border-line bg-card overflow-hidden shadow-e1 mb-6">
        <div className="px-4 py-3 border-b border-line bg-paper2/70">
          <h2 className="font-display text-xl text-ink">Comparação rápida</h2>
          <p className="text-xs text-inksoft">O que vale, o que pesa e onde você pode se arrepender.</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-sm">
            <thead className="text-left text-xs uppercase tracking-wide text-inksoft">
              <tr className="border-b border-line">
                <th className="px-4 py-3">Destino</th>
                <th className="px-4 py-3">Score</th>
                <th className="px-4 py-3">Custo</th>
                <th className="px-4 py-3">Melhor leitura</th>
                <th className="px-4 py-3">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {destinos.map((d) => {
                const score = mundoScoreDestino(d);
                return (
                  <tr key={d.code} className="align-top">
                    <td className="px-4 py-3">
                      <div className="font-display text-lg text-ink">{d.nome}</div>
                      <div className="text-xs text-inksoft">{d.regiao}</div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-pine text-onpine font-display text-xl tnum">{score.total}</span>
                      <div className="text-[11px] text-inksoft mt-1">arrependimento {score.chanceArrependimento}</div>
                    </td>
                    <td className="px-4 py-3 tnum">
                      <div className="font-semibold text-ink">US$ {d.custoDia}/dia</div>
                      <div className="text-xs text-inksoft">7 dias ~US$ {Math.round(d.custoDia * 7)}</div>
                    </td>
                    <td className="px-4 py-3 text-inksoft max-w-sm">{alertaHumanoDestino(d)}</td>
                    <td className="px-4 py-3">
                      <Link href={`/destino/${d.slug}`} className="text-pine font-semibold hover:underline focusring">Ver se combina <Icon emoji="→" /></Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mb-5 flex flex-wrap gap-2">
        <Link href="/decisao" className="inline-flex rounded-xl bg-pine text-onpine font-semibold px-4 py-2.5 hover:bg-pinedk focusring">Decidir entre estes</Link>
        <Link href="/planejar" className="inline-flex rounded-xl border border-line bg-card text-ink font-semibold px-4 py-2.5 hover:text-pine focusring">Criar rota com estes</Link>
        <Link href="/comparar" className="inline-flex rounded-xl border border-line bg-card text-ink font-semibold px-4 py-2.5 hover:text-pine focusring">Comparar custo real</Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {destinos.map((d) => <DestinoCard key={d.code} d={d} img={imgs[d.code]?.img} credito={imgs[d.code]?.credito} />)}
      </div>
      <p className="mt-6 text-xs text-inksoft border-t border-line pt-4">
        <Icon emoji="💾" /> Seus salvos ficam neste navegador. Sua rota no{' '}
        <Link href="/planejar" className="text-pine hover:underline focusring font-semibold">Planejador</Link>{' '}
        sincroniza na nuvem quando você entra na conta — aí você abre de qualquer aparelho.
      </p>
    </div>
  );
}
