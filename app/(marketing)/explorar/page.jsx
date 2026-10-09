import { DESTINOS } from '../../_lib/destinos.js';
import { todasBases, midiaLeve } from '../../_lib/figurinhas.js';
import { capaPais } from '../../_lib/midia.js';
import { AlbumExplorar } from './AlbumExplorar.jsx';

// Explorar = ÁLBUM DO MUNDO (205 figurinhas) com o mapa como visão alternativa.
// Capas HD da Wikimedia Commons vêm prontas de _data/midia.js (sem rede no build).
export const revalidate = 86400;

export const metadata = {
  title: 'O álbum do mundo — Mundo Sem Fim',
  description: '205 países como figurinhas: bandeira oficial, foto real, melhores meses, custo de referência por dia e visto para brasileiros. Veja quem está na hora certa no seu mês — ou explore no mapa.',
  alternates: { canonical: '/explorar' },
};

export default function ExplorarPage() {
  const bases = todasBases();
  const midia = midiaLeve(bases.map((b) => b.code), { largura: 500, video: false });
  // o mapa usa as mesmas capas (miniatura padrão de 500 px, com crédito)
  const destinos = DESTINOS.map((d) => { const c = capaPais(d.code, 500); return { ...d, img: c ? c.src : null, credito: c ? c.credito : null }; });
  return (
    <main>
      <AlbumExplorar bases={bases} midia={midia} mesInicial={new Date().getMonth()} destinos={destinos} />
    </main>
  );
}
