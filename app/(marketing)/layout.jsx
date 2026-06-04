import AppNav from '../_components/AppNav.jsx';

// Shell das telas de produto: nav global + rodapé. O planner (/planejar) fica
// FORA deste grupo de rotas e mantém o próprio cabeçalho de viagem.
export default function MarketingLayout({ children }) {
  return (
    <>
      <AppNav />
      <div className="min-h-[calc(100vh-3.5rem)]">{children}</div>
      <footer className="border-t border-line mt-6">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 text-xs text-inksoft flex flex-col sm:flex-row gap-3 sm:items-center">
          <div className="flex items-center gap-2 mr-auto">
            <span className="w-7 h-7 rounded-lg bg-pine text-white grid place-items-center font-display" aria-hidden>∞</span>
            <span className="text-ink font-semibold">Mundo Sem Fim</span>
          </div>
          <p className="max-w-xl">
            Estimativas de custo, clima e visto são referências de fontes públicas — confira sempre na fonte oficial.
            Imagens via Wikipédia/Wikimedia, com crédito na origem.
          </p>
        </div>
      </footer>
    </>
  );
}
