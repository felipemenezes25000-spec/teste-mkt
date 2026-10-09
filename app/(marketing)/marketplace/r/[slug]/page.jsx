import Link from 'next/link';
import { notFound } from 'next/navigation';
import { roteirosEquipe, roteiroEquipePorSlug } from '../../../../_lib/plataforma/roteirosEquipe.js';
import { destinoPorCode } from '../../../../_lib/destinos.js';
import { MESES_PT } from '../../../../_engine/data.js';
import { Icon } from '../../../../_ui/Icon.jsx';
import { SourceTrust } from '../../../../_ui/SourceTrust.jsx';
import { QuandoVisivel } from '../../../../_ui/QuandoVisivel.jsx';
import { T } from '../../../../_components/T.jsx';
import { AdaptarRoteiro } from '../../AdaptarRoteiro.jsx';
import { MapaRoteiro } from '../../MapaRoteiro.jsx';

export const dynamicParams = false;

export function generateStaticParams() {
  return roteirosEquipe().map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const r = roteiroEquipePorSlug(slug);
  if (!r) return {};
  return {
    title: `${r.titulo} — roteiro gratuito | Mundo Sem Fim`,
    description: `${r.resumo} Adapte às suas datas e leve para o seu workspace de viagem.`,
    alternates: { canonical: `/marketplace/r/${r.slug}` },
  };
}

export default async function RoteiroEquipePage({ params }) {
  const { slug } = await params;
  const r = roteiroEquipePorSlug(slug);
  if (!r) notFound();
  const d = destinoPorCode(r.destinoCode);
  const pontos = r.dias.flatMap((dia) => dia.itens.map((it) => ({ id: it.placeId, nome: it.titulo, lat: it.lat, lng: it.lng, tipo: 'atracao', rotulo: String(dia.dia) })));
  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-8 pb-12">
      <Link href="/marketplace" className="text-sm text-inksoft hover:text-ink inline-flex items-center gap-1 focusring rounded"><Icon name="arrow-left" size={14} /> <T k="plat.mkEy" fallback="Marketplace" /></Link>
      <header className="mt-4 mb-8 max-w-3xl">
        <div className="eyebrow mb-3"><T k="plat.equipe" fallback="Equipe Mundo Sem Fim" /> · <T k="plat.gratis" fallback="Grátis" /></div>
        <h1 className="font-display text-4xl sm:text-5xl tracking-tightest leading-[1] text-ink">{r.titulo}</h1>
        <p className="mt-3 text-lg text-inksoft">{r.resumo}</p>
        <p className="mt-3 text-sm text-inksoft flex flex-wrap items-center gap-x-3 gap-y-1">
          <span><T k="exp.c_epoca" fallback="Melhor época" />: {r.melhoresMeses.map((m) => MESES_PT[m - 1]).join(', ') || '—'}</span>
          <span>US$ {r.custoDia}/<T k="card.dia" fallback="dia" /> <SourceTrust freshness="HISTORICAL" compacto /></span>
          {d && <Link href={`/destino/${d.slug}`} className="text-pine hover:underline focusring rounded">{d.nome}</Link>}
        </p>
      </header>
      <div className="grid lg:grid-cols-[1fr_380px] gap-6 items-start">
        <div className="space-y-4">
          <QuandoVisivel altura="h-[420px]" rotulo="Mapa">
            <MapaRoteiro pontos={pontos} centro={d ? d.coords : undefined} rotulo={r.titulo} />
          </QuandoVisivel>
          <ol className="space-y-3">
            {r.dias.map((dia) => (
              <li key={dia.dia} className="rounded-2xl border border-line bg-card p-4">
                <div className="flex items-baseline justify-between gap-2">
                  <span className="font-mono text-xs text-inksoft"><T k="ws.dia" fallback="DIA" /> {String(dia.dia).padStart(2, '0')}</span>
                  <span className="text-sm text-ink font-medium">{dia.cidade}</span>
                </div>
                <ul className="mt-2 space-y-1.5">
                  {dia.itens.map((it) => <li key={it.placeId} className="text-sm text-ink flex items-center gap-2"><Icon name="pin" size={14} /> {it.titulo}</li>)}
                </ul>
              </li>
            ))}
          </ol>
          <p className="text-xs text-inksoft">{r.metodo}</p>
        </div>
        <aside className="lg:sticky lg:top-24">
          <AdaptarRoteiro roteiro={{ titulo: r.titulo, destinoCode: r.destinoCode, destinoNome: r.destinoNome, dias: r.dias }} centro={d ? d.coords : null} />
        </aside>
      </div>
    </main>
  );
}
