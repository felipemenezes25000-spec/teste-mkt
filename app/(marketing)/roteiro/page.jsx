import Link from 'next/link';

export const metadata = {
  title: 'Roteiro com IA — Mundo Sem Fim',
  description: 'Gere um roteiro de viagem dia a dia com IA: ordem dos passeios, custo, plano B de chuva e opções grátis ou premium.',
};

export default function RoteiroPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 sm:px-6 py-20 text-center">
      <div className="text-5xl mb-3" aria-hidden>✨</div>
      <h1 className="font-display text-3xl sm:text-4xl text-ink">Roteiro inteligente com IA</h1>
      <p className="mt-3 text-inksoft max-w-xl mx-auto">
        Diga destino, dias e orçamento — a IA monta seu roteiro dia a dia, com deslocamento, custo estimado,
        plano B de chuva e opções grátis ou premium. Em montagem nesta entrega.
      </p>
      <div className="mt-6 flex justify-center gap-3">
        <Link href="/explorar" className="inline-flex items-center justify-center gap-2 rounded-xl bg-pine text-white font-semibold px-5 py-3 hover:bg-pinedk transition focusring">Escolher um destino</Link>
      </div>
    </main>
  );
}
