import { DESTINOS } from '../../_lib/destinos.js';
import { imagemWiki } from '../../_lib/wiki.js';
import { ExplorarClient } from './ExplorarClient.jsx';

// Busca as imagens no servidor (cacheadas) e entrega a grade + filtros pro client.
export const revalidate = 86400;

export const metadata = {
  title: 'Explorar destinos — Mundo Sem Fim',
  description: 'Navegue por destinos do mundo todo: melhor época, custo médio e o que fazer. Filtre por região, estilo e orçamento.',
};

export default async function ExplorarPage() {
  const imgs = await Promise.all(DESTINOS.map((d) => imagemWiki(d.fotoQuery || d.nome)));
  const destinos = DESTINOS.map((d, i) => ({ ...d, img: imgs[i] }));
  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="font-display text-3xl sm:text-4xl text-ink">Explorar destinos</h1>
      <p className="mt-1 text-inksoft max-w-2xl">
        {DESTINOS.length} destinos com melhor época, custo médio e o que fazer — escolha pela região, pelo bolso ou pelo clima.
      </p>
      <ExplorarClient destinos={destinos} />
    </main>
  );
}
