import { CustoRealClient } from './CustoRealClient.jsx';
import { DESTINOS } from '../../_lib/destinos.js';

export const revalidate = 86400;

export const metadata = {
  title: 'Custo real da viagem — calculadora honesta | Mundo Sem Fim',
  description:
    'O preço de vitrine é só voo + hotel. O custo real inclui seguro, eSIM, visto, passeios, transporte local e contingência. Calcule por destino, mês, perfil e dias.',
  alternates: { canonical: '/custo-real' },
};

export default function CustoRealPage() {
  const destinosLeves = DESTINOS.map((d) => ({
    code: d.code,
    nome: d.nome,
    slug: d.slug,
    regiao: d.regiao,
    custoDia: d.custoDia,
    moeda: d.moeda,
    coords: d.coords,
    vistoTipo: d.vistoTipo,
    melhoresMeses: d.melhoresMeses,
  }));

  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      <section className="rounded-[2rem] border border-line bg-card p-6 sm:p-10 shadow-[var(--e-1)]">
        <span className="inline-block text-xs font-bold uppercase tracking-[0.18em] text-coral bg-coral/10 px-3 py-1 rounded-full">
          Vitrine × custo real
        </span>
        <h1 className="mt-4 font-display text-4xl sm:text-6xl leading-[1.03] text-ink">
          O preço da vitrine termina na compra.
          <br />
          O custo real aparece durante a viagem.
        </h1>
        <p className="mt-4 text-lg text-inksoft max-w-3xl">
          Calcule voo, hospedagem, comida, transporte, seguro, eSIM, visto, passeios e contingência. Em 3 cenários: mochila, médio e
          conforto. Sem surpresa no balcão.
        </p>
      </section>

      <CustoRealClient destinos={destinosLeves} />
    </main>
  );
}
