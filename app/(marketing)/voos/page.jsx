import { VoosClient } from './VoosClient.jsx';
import { T } from '../../_components/T.jsx';

export const metadata = {
  title: 'Voos — Mundo Sem Fim',
  description: 'Busque voos, compare preço, escalas e duração e ache a melhor opção por custo-benefício.',
};

export default function VoosPage() {
  return (
    <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      <section className="rounded-2xl border border-line bg-card p-6 sm:p-10 shadow-e1">
        <span className="inline-flex rounded-full bg-pine/10 text-pine px-3 py-1 font-mono text-[11px] uppercase tracking-[0.14em]"><T k="voos.heroSelo" fallback="Além do voo barato" /></span>
        <h1 className="mt-4 font-display text-4xl sm:text-6xl leading-[1.03] text-ink"><T k="voos.heroH1" fallback="O voo mais barato pode destruir o primeiro dia." /></h1>
        <p className="mt-4 text-lg text-inksoft max-w-3xl">
          <T k="voos.heroP" fallback="Compare preço, duração e escalas com uma leitura prática: economiza dinheiro, mas rouba energia? Vale esperar? Chega em horário humano?" />
        </p>
      </section>
      <VoosClient />
    </main>
  );
}
