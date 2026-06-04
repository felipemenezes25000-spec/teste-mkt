import { VoosClient } from './VoosClient.jsx';

export const metadata = {
  title: 'Voos — Mundo Sem Fim',
  description: 'Busque voos, compare preço, escalas e duração e ache a melhor opção por custo-benefício.',
};

export default function VoosPage() {
  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="font-display text-3xl sm:text-4xl text-ink">✈ Busca de voos</h1>
      <p className="mt-1 text-inksoft max-w-2xl">
        Compare preço, escalas e duração e ache a melhor opção por custo-benefício. Estimativas por distância (provider
        mock) com arquitetura pronta pra preço real via API.
      </p>
      <VoosClient />
    </main>
  );
}
