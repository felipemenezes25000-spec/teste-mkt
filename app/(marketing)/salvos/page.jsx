import { SalvosClient } from './SalvosClient.jsx';

export const metadata = {
  title: 'Salvos — Mundo Sem Fim',
  description: 'Seus destinos favoritos, salvos pra comparar e levar pra rota.',
};

export default function SalvosPage() {
  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="font-display text-3xl sm:text-4xl text-ink">♥ Salvos</h1>
      <p className="mt-1 text-inksoft">Seus destinos favoritos — compare e leve pra rota quando quiser.</p>
      <SalvosClient />
    </main>
  );
}
