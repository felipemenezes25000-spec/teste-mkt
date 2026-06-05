import { Suspense } from 'react';
import { RoteiroClient } from './RoteiroClient.jsx';
import { FormSkeleton } from '../../_components/Skeleton.jsx';

export const metadata = {
  title: 'Roteiro com IA — Mundo Sem Fim',
  description: 'Gere um roteiro de viagem dia a dia com IA: ordem dos passeios, custo, plano B de chuva, opções grátis, checklist e documentos.',
};

export default function RoteiroPage() {
  return (
    <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      <section className="rounded-[2rem] border border-line bg-card p-6 sm:p-10 shadow-[var(--e-1)]">
        <span className="inline-flex rounded-full bg-ochre/15 text-warn px-3 py-1 text-xs font-bold uppercase tracking-[0.18em]">Roteiro vivo</span>
        <h1 className="mt-4 font-display text-4xl sm:text-6xl leading-[1.03] text-ink">Monte um roteiro que respeita energia, chuva e bolso.</h1>
        <p className="mt-4 text-lg text-inksoft max-w-3xl">
          Não é só lista de passeios. O roteiro sugere ritmo, custo estimado, alternativa grátis, plano B de chuva e alerta humano para você não transformar férias em planilha de check-in.
        </p>
      </section>
      <Suspense fallback={<FormSkeleton rows={5} />}>
        <RoteiroClient />
      </Suspense>
    </main>
  );
}
