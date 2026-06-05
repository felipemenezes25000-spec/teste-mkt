import { VoosClient } from './VoosClient.jsx';

export const metadata = {
  title: 'Voos — Mundo Sem Fim',
  description: 'Busque voos, compare preço, escalas e duração e ache a melhor opção por custo-benefício.',
};

export default function VoosPage() {
  return (
    <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      <section className="rounded-[2rem] border border-line bg-card p-6 sm:p-10 shadow-[var(--e-1)]">
        <span className="inline-flex rounded-full bg-pine/10 text-pine px-3 py-1 text-xs font-bold uppercase tracking-[0.18em]">Além do voo barato</span>
        <h1 className="mt-4 font-display text-4xl sm:text-6xl leading-[1.03] text-ink">O voo mais barato pode destruir o primeiro dia.</h1>
        <p className="mt-4 text-lg text-inksoft max-w-3xl">
          Compare preço, duração e escalas com uma leitura prática: economiza dinheiro, mas rouba energia? Vale esperar? Chega em horário humano?
        </p>
      </section>
      <VoosClient />
    </main>
  );
}
