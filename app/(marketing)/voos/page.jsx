import Link from 'next/link';

export const metadata = {
  title: 'Voos — Mundo Sem Fim',
  description: 'Busque voos, compare preços e escalas, e receba alertas — com a melhor janela por custo-benefício.',
};

export default function VoosPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 sm:px-6 py-20 text-center">
      <div className="text-5xl mb-3" aria-hidden>✈</div>
      <h1 className="font-display text-3xl sm:text-4xl text-ink">Busca de voos</h1>
      <p className="mt-3 text-inksoft max-w-xl mx-auto">
        Compare preços, escalas e duração e descubra a melhor data por custo-benefício. A busca de voos chega nesta entrega
        (com arquitetura pronta para preços reais via API).
      </p>
      <div className="mt-6 flex justify-center gap-3">
        <Link href="/planejar" className="inline-flex items-center justify-center gap-2 rounded-xl bg-pine text-white font-semibold px-5 py-3 hover:bg-pinedk transition focusring">Montar minha rota</Link>
      </div>
    </main>
  );
}
