import { CompararClient } from './CompararClient.jsx';
import { T } from '../../_components/T.jsx';

export const metadata = {
  title: 'Comparar destinos — Mundo Sem Fim',
  description: 'Coloque seus destinos favoritos lado a lado: custo, melhor época e visto.',
};

export default function CompararPage() {
  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="font-display text-3xl sm:text-4xl text-ink">⚖️ <T k="comparar.heroH1" fallback="Comparar destinos" /></h1>
      <p className="mt-1 text-inksoft"><T k="comparar.heroP" fallback="Seus favoritos lado a lado: custo, melhor época e regra de visto." /></p>
      <CompararClient />
    </main>
  );
}
