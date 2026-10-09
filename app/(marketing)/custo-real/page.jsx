import { CustoRealClient } from './CustoRealClient.jsx';
import { DESTINOS } from '../../_lib/destinos.js';
import { T } from '../../_components/T.jsx';

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
      <section className="rounded-2xl border border-line bg-card p-6 sm:p-10 shadow-e1">
        <span className="inline-block font-mono text-[11px] uppercase tracking-[0.14em] text-oncoral bg-coral px-3 py-1 rounded-full">
          <T k="custoReal.heroSelo" fallback="Vitrine × custo real" />
        </span>
        <h1 className="mt-4 font-display text-4xl sm:text-6xl leading-[1.03] text-ink">
          <T k="custoReal.heroH1" fallback="O preço da vitrine termina na compra." />
          <br />
          <T k="custoReal.heroH1b" fallback="O custo real aparece durante a viagem." />
        </h1>
        <p className="mt-4 text-lg text-inksoft max-w-3xl">
          <T k="custoReal.heroP" fallback="Calcule voo, hospedagem, comida, transporte, seguro, eSIM, visto, passeios e contingência. Em 3 cenários: mochila, médio e conforto. Sem surpresa no balcão." />
        </p>
      </section>

      <CustoRealClient destinos={destinosLeves} />
    </main>
  );
}
