import Link from 'next/link';
import AppNav from '../_components/AppNav.jsx';
import { TourGuiado } from '../_components/TourGuiado.jsx';
import { TourReopen } from '../_components/TourReopen.jsx';
import { Marca } from '../_ui/Marca.jsx';

// Shell das telas de produto: nav global + rodapé MERIDIANO. O planner (/planejar)
// fica FORA deste grupo de rotas e mantém o próprio cabeçalho de viagem.
const COLUNAS = [
  { titulo: 'Jornada', links: [['/explorar', 'Explorar o mundo'], ['/decisao', 'Decidir o destino'], ['/planejar', 'Planejar a rota'], ['/viagens', 'Minhas viagens']] },
  { titulo: 'Ferramentas', links: [['/comparar', 'Comparar destinos'], ['/custo-real', 'Custo real'], ['/voos', 'Score de voos'], ['/roteiro', 'Roteiro com IA']] },
  { titulo: 'Conta', links: [['/salvos', 'Salvos'], ['/planos', 'Planos'], ['/conta', 'Conta e privacidade'], ['/fontes', 'Fontes e metodologia']] },
];

export default function MarketingLayout({ children }) {
  return (
    <>
      <AppNav />
      <TourGuiado />
      <div className="min-h-[calc(100vh-4rem)]">{children}</div>
      <footer className="mt-16 border-t border-line bg-card/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 grid gap-10 md:grid-cols-[1.4fr_repeat(3,1fr)]">
          <div className="max-w-sm">
            <Marca size={36} />
            <p className="mt-4 text-sm text-inksoft leading-relaxed">
              O mundo inteiro, explicado para você — do sonho ao retorno. Decisões com fonte, custo com data e
              nenhuma integração fingida.
            </p>
            <p className="mt-4 coord text-inksoft">00°00′00″ N · 00°00′00″ E — ponto de partida</p>
          </div>
          {COLUNAS.map((c) => (
            <nav key={c.titulo} aria-label={c.titulo}>
              <div className="eyebrow mb-3">{c.titulo}</div>
              <ul className="space-y-2">
                {c.links.map(([href, label]) => (
                  <li key={href}><Link href={href} className="text-sm text-ink hover:text-pine focusring rounded">{label}</Link></li>
                ))}
              </ul>
            </nav>
          ))}
        </div>
        <div className="border-t border-line">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-5 flex flex-col sm:flex-row gap-3 sm:items-center text-xs text-inksoft">
            <p className="mr-auto max-w-3xl">
              Preços de referência vêm de pesquisa histórica (jun/2026) e são rotulados como tal; câmbio, clima e rotas
              mostram fonte e horário. Visto e saúde: confirme sempre no órgão oficial. Fotos: Wikimedia Commons, com autor e licença.
            </p>
            <TourReopen />
          </div>
        </div>
      </footer>
    </>
  );
}
