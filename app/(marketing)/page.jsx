import Link from 'next/link';
import { destinosDestaque } from '../_lib/destinos.js';
import { imagemWiki } from '../_lib/wiki.js';
import { DestinoCard } from '../_components/DestinoCard.jsx';

// Landing premium (Server Component). Busca imagens-herói da Wikipédia no servidor
// (cacheadas por 1 dia); se a rede falhar, cai num gradiente — nunca quebra.
export const revalidate = 86400;

export const metadata = {
  title: 'Mundo Sem Fim — Planeje a viagem da sua vida',
  description:
    'Explore destinos do mundo todo, monte roteiros com IA, veja custos reais e cruze estação, visto e fôlego de grana. Comece grátis.',
};

const CTA_PRIMARY =
  'inline-flex items-center justify-center gap-2 rounded-xl bg-pine text-white font-semibold px-5 py-3 shadow-md hover:bg-pinedk transition focusring';
const CTA_GHOST =
  'inline-flex items-center justify-center gap-2 rounded-xl border border-line bg-card text-ink font-semibold px-5 py-3 hover:text-pine transition focusring';

const VALORES = [
  { icon: '✨', titulo: 'Roteiro com IA', txt: 'Diga destino, dias e orçamento — a IA monta o dia a dia, com plano B de chuva e opções grátis ou premium.' },
  { icon: '💰', titulo: 'Custos reais', txt: 'Mínimo, médio e confortável por dia, cidade e país. Você sabe quanto custa antes de ir.' },
  { icon: '🧭', titulo: 'Estação × Visto × Fôlego', txt: 'A ordem dos países importa: chegue na boa estação, sem furar visto, sem a grana acabar no meio.' },
  { icon: '🌍', titulo: 'Cobertura global', txt: 'Pontos turísticos, gastronomia e dicas do mundo todo, com fontes públicas e crédito de imagem.' },
];

export default async function Home() {
  const destaques = destinosDestaque();
  const imgs = await Promise.all(destaques.map((d) => imagemWiki(d.fotoQuery || d.nome)));

  return (
    <main>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-12 pb-10 sm:pt-20 sm:pb-14">
          <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-pine bg-pine/5 border border-pine/15 rounded-full px-3 py-1">
            Plataforma de viagens
          </span>
          <h1 className="mt-4 font-display text-4xl sm:text-6xl leading-[1.04] text-ink max-w-3xl">
            Planeje a viagem da sua vida <span className="text-pine">na ordem que não te quebra.</span>
          </h1>
          <p className="mt-4 text-lg text-inksoft max-w-2xl">
            Explore destinos do mundo todo, monte roteiros com IA, veja custos reais e cruze estação, visto e fôlego de grana — tudo num lugar só.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link href="/explorar" className={CTA_PRIMARY}>🧭 Explorar destinos</Link>
            <Link href="/planejar" className={CTA_GHOST}>🗺️ Planejar minha rota</Link>
          </div>
          <div className="mt-5 flex flex-wrap gap-x-5 gap-y-1 text-xs text-inksoft">
            <span>✓ Grátis pra começar</span>
            <span>✓ Sem cartão</span>
            <span>✓ Dados de fontes públicas</span>
          </div>
        </div>
      </section>

      {/* DESTAQUES */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex items-end justify-between gap-3 mb-4">
          <h2 className="font-display text-2xl sm:text-3xl text-ink">Destinos em destaque</h2>
          <Link href="/explorar" className="text-sm font-semibold text-pine hover:underline focusring whitespace-nowrap">Ver todos →</Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {destaques.map((d, i) => <DestinoCard key={d.code} d={d} img={imgs[i]} />)}
        </div>
      </section>

      {/* VALORES */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {VALORES.map((v) => (
            <div key={v.titulo} className="rounded-2xl border border-line bg-card p-5">
              <div className="text-2xl" aria-hidden>{v.icon}</div>
              <h3 className="mt-2 font-display text-lg text-ink">{v.titulo}</h3>
              <p className="mt-1 text-sm text-inksoft">{v.txt}</p>
            </div>
          ))}
        </div>
      </section>

      {/* PLANOS (teaser) */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        <div className="rounded-3xl border border-line bg-gradient-to-br from-pine/5 to-ochre/5 p-8 sm:p-10 text-center">
          <h2 className="font-display text-2xl sm:text-3xl text-ink max-w-2xl mx-auto">
            Comece grátis. Vire premium quando a viagem ficar séria.
          </h2>
          <p className="mt-2 text-inksoft max-w-xl mx-auto">
            Roteiros ilimitados com IA, custos detalhados, comparação de destinos, alertas de preço e exportação em PDF.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link href="/planos" className={CTA_PRIMARY}>⭐ Ver planos</Link>
            <Link href="/roteiro" className={CTA_GHOST}>✨ Gerar um roteiro</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
