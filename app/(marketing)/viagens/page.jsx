import { T } from '../../_components/T.jsx';
import { ViagensClient } from './ViagensClient.jsx';

// Minhas viagens — dados do usuário ficam no dispositivo; página não indexável.
export const metadata = {
  title: 'Minhas viagens — Mundo Sem Fim',
  description: 'Roteiro dia a dia, reservas, documentos, despesas e Modo Viagem num só lugar.',
  robots: { index: false, follow: false },
};

export default function ViagensPage() {
  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-10 pb-12">
      <header className="mb-8 max-w-3xl">
        <div className="eyebrow mb-3">Trip workspace</div>
        <h1 className="font-display text-4xl sm:text-6xl tracking-tightest leading-[.98] text-ink"><T k="v2.h1" fallback="Minhas viagens" /></h1>
        <p className="mt-4 text-lg text-inksoft"><T k="v2.sub" fallback="Tudo da viagem num só lugar: roteiro com mapa e rotas, reservas, documentos, gastos e o próximo passo de cada dia." /></p>
      </header>
      <ViagensClient />
    </main>
  );
}
