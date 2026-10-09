import { MobileBottomNav } from '../_components/MobileBottomNav.jsx';
import Link from 'next/link';
import AppNav from '../_components/AppNav.jsx';
import { TourGuiado } from '../_components/TourGuiado.jsx';
import { TourReopen } from '../_components/TourReopen.jsx';
import { Marca } from '../_ui/Marca.jsx';
import { T } from '../_components/T.jsx';

// Shell das telas de produto: nav global + rodapé MERIDIANO. O planner (/planejar)
// fica FORA deste grupo de rotas e mantém o próprio cabeçalho de viagem.
const COLUNAS = [
  { titulo: 'jornada', links: [['/explorar', 'explorar', 'Explorar o mundo'], ['/decisao', 'decidir', 'Decidir o destino'], ['/planejar', 'planejar', 'Planejar a rota'], ['/viagens', 'viagens', 'Minhas viagens']] },
  { titulo: 'ferramentas', links: [['/comparar', 'comparar', 'Comparar destinos'], ['/custo-real', 'custo', 'Custo real'], ['/voos', 'voos', 'Score de voos'], ['/roteiro', 'roteiro', 'Roteiro com IA']] },
  { titulo: 'plataforma', links: [['/marketplace', 'marketplace', 'Marketplace'], ['/agencias', 'agencias', 'Para agências'], ['/desenvolvedores', 'api', 'API pública']] },
  { titulo: 'conta', links: [['/salvos', 'salvos', 'Salvos'], ['/planos', 'planos', 'Planos'], ['/conta', 'privacidade', 'Conta e privacidade'], ['/fontes', 'fontes', 'Fontes e metodologia']] },
];

export default function MarketingLayout({ children }) {
  return (
    <>
      <a href="#conteudo" className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[60] focus:rounded-lg focus:bg-coral focus:text-oncoral focus:px-4 focus:py-2 focus:font-semibold"><T k="nav2.pular" fallback="Pular para o conteúdo" /></a>
      <AppNav />
      <TourGuiado />
      <div id="conteudo" tabIndex={-1} className="min-h-[calc(100vh-4rem)] outline-none">{children}</div>
      <footer className="mt-16 border-t border-line bg-card/60 pb-[calc(3.5rem+env(safe-area-inset-bottom))] md:pb-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 grid gap-10 sm:grid-cols-2 md:grid-cols-[1.4fr_repeat(4,1fr)]">
          <div className="max-w-sm">
            <Marca size={36} />
            <p className="mt-4 text-sm text-inksoft leading-relaxed">
              <T k="rodape.tagline" fallback="O mundo inteiro, explicado para você — do sonho ao retorno. Decisões com fonte, custo com data e nenhuma integração fingida." />
            </p>
            <p className="mt-4 coord text-inksoft">00°00′00″ N · 00°00′00″ E — <T k="rodape.partida" fallback="ponto de partida" /></p>
          </div>
          {COLUNAS.map((c) => (
            <nav key={c.titulo} aria-label={c.titulo}>
              <div className="eyebrow mb-3"><T k={`rodape.${c.titulo}`} fallback={c.titulo} /></div>
              <ul className="space-y-2">
                {c.links.map(([href, chave, label]) => (
                  <li key={href}><Link href={href} className="text-sm text-ink hover:text-pine focusring rounded"><T k={`rodape.${chave}`} fallback={label} /></Link></li>
                ))}
              </ul>
            </nav>
          ))}
        </div>
        <div className="border-t border-line">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-5 flex flex-col sm:flex-row gap-3 sm:items-center text-xs text-inksoft">
            <p className="mr-auto max-w-3xl">
              <T k="rodape.aviso" fallback="Preços de referência vêm de pesquisa histórica (jun/2026) e são rotulados como tal; câmbio, clima e rotas mostram fonte e horário. Visto e saúde: confirme sempre no órgão oficial. Fotos: Wikimedia Commons, com autor e licença." />
            </p>
            <TourReopen />
          </div>
        </div>
      </footer>
      <MobileBottomNav />
    </>
  );
}
