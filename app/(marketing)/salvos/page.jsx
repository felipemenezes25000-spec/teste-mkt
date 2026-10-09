import { SalvosClient } from './SalvosClient.jsx';

export const metadata = {
  title: 'Salvos — Mundo Sem Fim',
  description: 'Seus destinos favoritos, salvos pra comparar e levar pra rota.',
};

export default function SalvosPage() {
  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      <section className="rounded-2xl border border-line bg-card p-6 sm:p-10 shadow-e1">
        <span className="inline-flex rounded-full bg-pine/10 text-pine px-3 py-1 font-mono text-[11px] uppercase tracking-[0.14em]">Mesa de decisão</span>
        <h1 className="mt-4 font-display text-4xl sm:text-5xl text-ink">Salvos não são lembrança. São comparação.</h1>
        <p className="mt-3 text-lg text-inksoft max-w-2xl">Guarde destinos e veja lado a lado score, custo, melhor mês e o alerta que pode salvar sua viagem.</p>
      </section>
      <SalvosClient />
    </main>
  );
}
