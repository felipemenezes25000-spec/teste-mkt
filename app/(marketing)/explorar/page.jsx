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
      <section className="relative overflow-hidden rounded-[2rem] border border-line bg-card p-6 sm:p-10 shadow-[var(--e-1)]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgb(var(--c-ochre)/0.18),transparent_32%),radial-gradient(circle_at_12%_12%,rgb(var(--c-pine)/0.14),transparent_30%)]" aria-hidden />
        <div className="relative max-w-3xl">
          <span className="inline-flex rounded-full bg-pine/10 text-pine px-3 py-1 text-xs font-bold uppercase tracking-[0.18em]">Descobrir com curadoria</span>
          <h1 className="mt-4 font-display text-4xl sm:text-6xl leading-[1.03] text-ink">
            Não escolha no alfabeto. Escolha pelo sentido da viagem.
          </h1>
          <p className="mt-4 text-lg text-inksoft max-w-2xl">
            {DESTINOS.length} destinos organizados por intenção humana: barato saindo do Brasil, primeira viagem internacional, Europa sem falir, Ásia que vale o voo e lugares lindos que podem sair caros.
          </p>
        </div>
      </section>
      <ExplorarClient destinos={destinos} />
    </main>
  );
}
