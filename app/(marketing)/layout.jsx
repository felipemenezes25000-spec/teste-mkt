import { MobileBottomNav } from '../_components/MobileBottomNav.jsx';
import Link from 'next/link';
import AppNav from '../_components/AppNav.jsx';
import { TourGuiado } from '../_components/TourGuiado.jsx';
import { TourReopen } from '../_components/TourReopen.jsx';
import { Marca } from '../_ui/Marca.jsx';
import { T } from '../_components/T.jsx';
import { Calcadao } from '../_ui/Calcadao.jsx';
import { FaixaAzulejos } from '../_ui/Azulejo.jsx';

// Shell das telas de produto: nav global + rodapé CALÇADÃO (azulejos + ondas). O planner (/planejar)
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
      <a href="#conteudo" className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[60] focus:rounded-full focus:bg-coral focus:text-oncoral focus:px-5 focus:py-2.5 focus:font-cond focus:font-extrabold focus:uppercase focus:tracking-wider"><T k="nav2.pular" fallback="Pular para o conteúdo" /></a>
      <AppNav />
      <TourGuiado />
      <div id="conteudo" tabIndex={-1} className="min-h-[calc(100vh-4rem)] outline-none">{children}</div>
      <footer className="mt-20 bg-white pb-[calc(4rem+env(safe-area-inset-bottom))] md:pb-0">
        <FaixaAzulejos n={40} tam={44} semente={3} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14 grid gap-10 sm:grid-cols-2 md:grid-cols-[1.4fr_repeat(4,1fr)]">
          <div className="max-w-sm">
            <Marca size={40} />
            <p className="mt-5 text-[15px] text-inksoft leading-relaxed">
              <T k="rodape.tagline" fallback="O mundo inteiro, explicado para você — do sonho ao retorno. Decisões com fonte, custo com data e nenhuma integração fingida." />
            </p>
            <p className="mt-4 eyebrow">22°58′S · 43°11′W — <T k="rodape.partida" fallback="ponto de partida" /></p>
          </div>
          {COLUNAS.map((c) => (
            <nav key={c.titulo} aria-label={c.titulo}>
              <div className="eyebrow mb-4"><T k={`rodape.${c.titulo}`} fallback={c.titulo} /></div>
              <ul className="space-y-2.5">
                {c.links.map(([href, chave, label]) => (
                  <li key={href}><Link href={href} className="text-[15px] font-medium text-ink border-b-2 border-transparent hover:border-coral focusring"><T k={`rodape.${chave}`} fallback={label} /></Link></li>
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
        <Calcadao altura={110} />
      </footer>
      <MobileBottomNav />
    </>
  );
}
