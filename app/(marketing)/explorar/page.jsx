import { Suspense } from 'react';
import { DESTINOS } from '../../_lib/destinos.js';
import { fotoCapa } from '../../_lib/wiki.js';
import { ExplorarClient } from './ExplorarClient.jsx';
import { T } from '../../_components/T.jsx';

// World Explorer: imagens resolvidas no servidor (cacheadas 1 dia); mapa, filtros,
// camadas e lista no client.
export const revalidate = 86400;

export const metadata = {
  title: 'Explorar o mundo — Mundo Sem Fim',
  description: 'Mapa interativo com 205 países: custo de referência por dia, melhor época por mês e visto para passaporte brasileiro. Filtre, compare e salve.',
  alternates: { canonical: '/explorar' },
};

export default async function ExplorarPage() {
  const imgs = await Promise.all(DESTINOS.map((d) => fotoCapa(d)));
  const destinos = DESTINOS.map((d, i) => ({ ...d, img: imgs[i] }));
  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-10 pb-8">
      <header className="mb-8 max-w-3xl">
        <div className="eyebrow mb-3"><T k="exp.eyebrow" fallback="World Explorer · {n} países" vars={{ n: DESTINOS.length }} /></div>
        <h1 className="font-display text-4xl sm:text-6xl tracking-tightest leading-[.98] text-ink">
          <T k="exp.h1a" fallback="Explore o mundo pelo que importa" /> <span className="text-pine"><T k="exp.h1b" fallback="pra você." /></span>
        </h1>
        <p className="mt-4 text-lg text-inksoft">
          <T k="exp.sub" fallback="Troque a camada do mapa para ver custo por dia, quem está na melhor época no mês da sua viagem ou o tipo de visto para brasileiros. Clique num ponto ou na lista — os dois andam juntos." />
        </p>
      </header>
      <Suspense fallback={null}>
        <ExplorarClient destinos={destinos} />
      </Suspense>
    </main>
  );
}
