import { Suspense } from 'react';
import { RoteiroClient } from './RoteiroClient.jsx';
import { FormSkeleton } from '../../_components/Skeleton.jsx';

export const metadata = {
  title: 'Roteiro com IA — Mundo Sem Fim',
  description: 'Gere um roteiro de viagem dia a dia com IA: ordem dos passeios, custo, plano B de chuva, opções grátis, checklist e documentos.',
};

export default function RoteiroPage() {
  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="font-display text-3xl sm:text-4xl text-ink">✨ Roteiro com IA</h1>
      <p className="mt-1 text-inksoft max-w-2xl">
        Diga o destino e suas preferências — a IA monta um roteiro dia a dia com custo estimado, plano B de chuva,
        opções grátis, checklist e documentos.
      </p>
      <Suspense fallback={<FormSkeleton rows={5} />}>
        <RoteiroClient />
      </Suspense>
    </main>
  );
}
