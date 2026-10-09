import Link from 'next/link';
import { roteirosEquipe } from '../../_lib/plataforma/roteirosEquipe.js';
import { destinoPorCode } from '../../_lib/destinos.js';
import { fotoCapa } from '../../_lib/wiki.js';
import { wikiThumb, arquivoWikimedia } from '../../_lib/wikiThumb.js';
import { resolverImagens } from '../../_lib/media.js';
import { Foto } from '../../_ui/Foto.jsx';
import { Icon } from '../../_ui/Icon.jsx';
import { T } from '../../_components/T.jsx';
import { MarketplaceClient } from './MarketplaceClient.jsx';

export const revalidate = 86400;

export const metadata = {
  title: 'Marketplace de roteiros e consultores — Mundo Sem Fim',
  description: 'Roteiros prontos para adaptar à sua viagem e consultores de viagem independentes. Roteiros da equipe são gratuitos; criadores definem o próprio preço.',
  alternates: { canonical: '/marketplace' },
};

export default async function MarketplacePage() {
  const roteiros = roteirosEquipe();
  const fotos = await Promise.all(roteiros.map((r) => fotoCapa(destinoPorCode(r.destinoCode))));
  // mesma resolução da home: URL estável do Commons na largura certa (evita redirect lento)
  const assets = await resolverImagens(fotos.filter(Boolean), { largura: 500 });
  const src = (u) => { const a = u ? assets.get(arquivoWikimedia(u) || '') : null; return a ? a.url : u ? wikiThumb(u, 500) : null; };
  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-10 pb-12">
      <header className="mb-8 max-w-3xl">
        <div className="eyebrow mb-3"><T k="plat.mkEy" fallback="Marketplace" /></div>
        <h1 className="font-display text-4xl sm:text-6xl tracking-tightest leading-[.98] text-ink"><T k="plat.mkH" fallback="Roteiros prontos e gente que entende do destino." /></h1>
        <p className="mt-4 text-lg text-inksoft"><T k="plat.mkP" fallback="Adapte um roteiro às suas datas em um clique — ele vira uma viagem no seu workspace, com mapa, rotas e orçamento. Precisa de alguém? Peça uma consultoria a um especialista." /></p>
      </header>

      <section aria-labelledby="equipe-h">
        <div className="flex items-end justify-between gap-3 mb-4">
          <div>
            <h2 id="equipe-h" className="font-display text-2xl text-ink"><T k="plat.equipeH" fallback="Roteiros da equipe" /></h2>
            <p className="text-sm text-inksoft"><T k="plat.equipeP" fallback="Gratuitos. Montados do nosso catálogo: só lugares com coordenada verificada, agrupados por cidade." /></p>
          </div>
        </div>
        <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {roteiros.map((r, i) => (
            <li key={r.slug}>
              <Link href={`/marketplace/r/${r.slug}`} className="group block rounded-2xl border border-line bg-card overflow-hidden hover:border-pine/50 hover:shadow-e1 transition focusring">
                <div className="relative aspect-[16/9] bg-paper2">
                  <Foto src={src(fotos[i])} alt="" mostrarCredito={false} className="absolute inset-0" imgClassName="group-hover:scale-[1.03] transition duration-700" largura={500} altura={281} />
                  <span className="absolute left-3 top-3 rounded-md bg-card/95 px-2 py-1 font-mono text-[11px] text-ink">{r.totalDias} <T k="plat.dias" fallback="dias" /></span>
                  <span className="absolute right-3 top-3 rounded-md bg-coral px-2 py-1 font-mono text-[11px] text-oncoral"><T k="plat.gratis" fallback="Grátis" /></span>
                </div>
                <div className="p-4">
                  <h3 className="font-display text-lg text-ink group-hover:text-pine">{r.titulo}</h3>
                  <p className="mt-1 text-sm text-inksoft line-clamp-2">{r.cidades.join(' · ')}</p>
                  <p className="mt-3 text-xs text-inksoft flex items-center gap-1.5"><Icon name="users" size={13} /> <T k="plat.equipe" fallback="Equipe Mundo Sem Fim" /></p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <MarketplaceClient />
    </main>
  );
}
