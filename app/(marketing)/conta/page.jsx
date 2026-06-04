import { ContaClient } from './ContaClient.jsx';

export const metadata = {
  title: 'Conta — Mundo Sem Fim',
  description: 'Seu plano, assinatura e preferências.',
};

export default function ContaPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="font-display text-3xl sm:text-4xl text-ink">Sua conta</h1>
      <p className="mt-1 text-inksoft">Plano, assinatura e preferências.</p>
      <ContaClient />
    </main>
  );
}
