import Link from 'next/link';
import { destinosDestaque, DESTINOS } from '../_lib/destinos.js';
import { imagemWiki, resumoWiki } from '../_lib/wiki.js';
import { wikiThumb } from '../_lib/wikiThumb.js';
import { DestinoCard } from '../_components/DestinoCard.jsx';
import { JsonLd } from '../_components/JsonLd.jsx';
import { jsonLdOrganization, jsonLdWebSite, jsonLdReviews, siteUrl } from '../_lib/seo.js';
import { ProvaSocial } from '../_components/ProvaSocial.jsx';
import { HeroSimulador } from '../_components/HeroSimulador.jsx';
import { DEPOIMENTOS } from '../_lib/depoimentos.js';
import {
  HomeSecaoProblema,
  HomeSecaoComoDecide,
  HomeSecaoCustoReal,
  HomeSecaoOtas,
  HomeSecaoFaq,
  HomeSecaoCtaFinal,
} from '../_components/HomeSections.jsx';
import { T } from '../_components/T.jsx';

// Landing premium (Server Component). Busca a imagem-herói e as dos destaques na
// Wikipédia (cacheadas 1 dia); se a rede falhar, cai num gradiente — nunca quebra.
export const revalidate = 86400;

export const metadata = {
  title: 'Mundo Sem Fim — o copiloto que decide a viagem com você',
  description:
    `Não listamos 200 hotéis. Dizemos pra onde ir pelo seu perfil, quanto a viagem custa de verdade (não só voo+hotel) e montamos o roteiro que recalcula. ${DESTINOS.length} países. Comece grátis.`,
  alternates: { canonical: '/' },
};

const CTA_PRIMARY =
  'inline-flex items-center justify-center gap-2 rounded-xl bg-coral text-oncoral font-semibold px-5 py-3 shadow-lg hover:brightness-95 transition focusring';
const CTA_LIGHT =
  'inline-flex items-center justify-center gap-2 rounded-xl bg-ink/35 backdrop-blur border border-white/60 text-white font-semibold px-5 py-3 hover:bg-ink/50 transition focusring';
const CTA_GHOST =
  'inline-flex items-center justify-center gap-2 rounded-xl border border-line bg-card text-ink font-semibold px-5 py-3 hover:text-pine transition focusring';

// Pilares e Passos viram chaves de i18n — renderizados via <T />. Mantemos
// `icon` e `href` no array pra topologia, mas título/texto/CTA via t().
const PILARES = [
  { icon: '🧠', tit: 'pilares.decideTit', txt: 'pilares.decideTxt', href: '/decisao', cta: 'pilares.decideCTA' },
  { icon: '🧾', tit: 'pilares.custoTit', txt: 'pilares.custoTxt', href: '/custo-real', cta: 'pilares.custoCTA' },
  { icon: '🗺️', tit: 'pilares.roteiroTit', txt: 'pilares.roteiroTxt', href: '/planejar', cta: 'pilares.roteiroCTA' },
  { icon: '🌍', tit: `${DESTINOS.length}+ ${'__paises__'}`, txt: 'pilares.paisesTxt', href: '/explorar', cta: 'pilares.paisesCTA' },
];

const PASSOS = [
  { n: '1', tit: 'passos.p1Tit', txt: 'passos.p1Txt' },
  { n: '2', tit: 'passos.p2Tit', txt: 'passos.p2Txt' },
  { n: '3', tit: 'passos.p3Tit', txt: 'passos.p3Txt' },
];

export default async function Home() {
  const destaques = destinosDestaque();
  const reviewsLd = jsonLdReviews(DEPOIMENTOS, siteUrl());
  const [hero, ...imgs] = await Promise.all([
    resumoWiki('Machu Picchu'),
    ...destaques.map((d) => imagemWiki(d.fotoQuery || d.nome)),
  ]);

  return (
    <main>
      <JsonLd data={jsonLdOrganization(siteUrl())} />
      <JsonLd data={jsonLdWebSite(siteUrl())} />
      {reviewsLd && <JsonLd data={reviewsLd} />}
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          {hero?.img ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={wikiThumb(hero.img, 1600)} alt="" width="1600" height="900" fetchPriority="high" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-pine to-pinedk" aria-hidden />
          )}
          {/* Scrim vertical + scrim horizontal na coluna esquerda → garante ≥4,5:1
              pro texto branco independentemente do pixel da foto (WCAG 1.4.3). */}
          <div className="absolute inset-0 bg-gradient-to-t from-ink/95 via-ink/75 to-ink/45" />
          <div className="absolute inset-0 bg-gradient-to-r from-ink/75 via-ink/35 to-transparent" />
        </div>

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 pt-16 pb-14 sm:pt-28 sm:pb-20">
          <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-white/90 bg-white/10 border border-white/20 rounded-full px-3 py-1">
            {DESTINOS.length} países · decisão inteligente
          </span>
          <h1 className="mt-4 font-display text-4xl sm:text-6xl leading-[1.05] text-white max-w-3xl drop-shadow">
            Decida a viagem da sua vida — <span className="text-amberx">com um copiloto que pensa por você.</span>
          </h1>
          <p className="mt-4 text-lg text-white/90 max-w-2xl">
            As OTAs te empurram opções. A gente diz <strong className="text-white">pra onde ir</strong> pelo seu perfil,
            <strong className="text-white"> quanto custa de verdade</strong> (não só voo + hotel) e monta o
            <strong className="text-white"> roteiro que recalcula</strong>. Comece grátis.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link href="/decisao" className={CTA_PRIMARY}>🧠 Decidir minha viagem</Link>
            <Link href="/explorar" className={CTA_LIGHT}>🧭 Explorar {DESTINOS.length} destinos</Link>
          </div>
          <div className="mt-5 flex flex-wrap gap-x-5 gap-y-1 text-[13px] text-white/95">
            <span>✓ Grátis pra começar</span>
            <span>✓ Sem cartão</span>
            <span>✓ Conselho neutro (não vendemos a reserva)</span>
          </div>
        </div>
      </section>

      {/* SIMULADOR — transforma a vitrine em produto logo no topo (reusa o motor da /decisao) */}
      <HeroSimulador />

      {/* PROBLEMA REAL — espelho do leitor: você reconhece a cena, então confia no diagnóstico */}
      <HomeSecaoProblema />

      {/* PILARES (o fosso) */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
        <h2 className="font-display text-2xl sm:text-3xl text-ink text-center max-w-2xl mx-auto">
          <T k="pilares.titulo" fallback="O que nenhum app de viagem faz — e a gente faz" />
        </h2>
        <p className="mt-2 text-center text-inksoft max-w-xl mx-auto text-sm">
          <T k="pilares.sub" fallback="Eles competem em te vender a reserva mais barata. A gente é a camada de decisão neutra acima disso." />
        </p>
        <div className="mt-7 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {PILARES.map((p, i) => (
            <Link key={p.tit} href={p.href} className="group rounded-2xl border border-line bg-card p-5 hover:border-pine/40 hover:shadow-[var(--e-1)] hover:-translate-y-0.5 transition focusring">
              <div className="text-3xl" aria-hidden>{p.icon}</div>
              <h3 className="mt-2 font-display text-lg text-ink">
                {i === 3 ? `${DESTINOS.length}+ ` : ''}
                <T k={p.tit} fallback={p.tit.split('.').pop()} />
              </h3>
              <p className="mt-1 text-sm text-inksoft"><T k={p.txt} fallback="" /></p>
              <span className="mt-3 inline-block text-sm font-semibold text-pine group-hover:underline">
                <T k={p.cta} fallback="" /> →
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* COMO DECIDE — os 8 fatores que mudam a resposta */}
      <HomeSecaoComoDecide />

      {/* CUSTO REAL — preview com exemplo Peru */}
      <HomeSecaoCustoReal />

      {/* OTAs — onde a gente entra no mapa de ferramentas */}
      <HomeSecaoOtas />

      {/* DESTAQUES */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex items-end justify-between gap-3 mb-4">
          <h2 className="font-display text-2xl sm:text-3xl text-ink">Destinos em destaque</h2>
          <Link href="/explorar" className="text-sm font-semibold text-pine hover:underline focusring whitespace-nowrap">Ver os {DESTINOS.length} →</Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {destaques.map((d, i) => <DestinoCard key={d.code} d={d} img={imgs[i]} />)}
        </div>
      </section>

      {/* COMO FUNCIONA */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        <h2 className="font-display text-2xl sm:text-3xl text-ink text-center"><T k="passos.titulo" fallback="Como funciona" /></h2>
        <div className="mt-7 grid grid-cols-1 sm:grid-cols-3 gap-4">
          {PASSOS.map((p) => (
            <div key={p.n} className="relative rounded-2xl border border-line bg-card p-6">
              <span className="absolute -top-3 left-6 w-9 h-9 grid place-items-center rounded-xl bg-pine text-white font-display text-lg shadow-md">{p.n}</span>
              <h3 className="mt-3 font-display text-xl text-ink"><T k={p.tit} fallback={p.tit.split('.').pop()} /></h3>
              <p className="mt-1 text-sm text-inksoft"><T k={p.txt} fallback="" /></p>
            </div>
          ))}
        </div>
      </section>

      {/* PROVA SOCIAL (honesta: sinais verificáveis + depoimentos reais quando houver) */}
      <ProvaSocial />

      {/* FAQ — perguntas que todo viajante faz; reduz fricção antes do CTA final */}
      <HomeSecaoFaq />

      {/* PLANOS (teaser) */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        <div className="rounded-3xl border border-line bg-gradient-to-br from-pine/8 to-ochre/8 p-8 sm:p-12 text-center">
          <h2 className="font-display text-2xl sm:text-3xl text-ink max-w-2xl mx-auto">
            A assinatura se paga no primeiro corte de orçamento que a gente sugere.
          </h2>
          <p className="mt-3 text-inksoft max-w-xl mx-auto">
            Premium custa menos que uma diária de hostel: roteiros ilimitados com IA, comparação pelo seu perfil,
            custo total detalhado, alertas que salvam a viagem e exportação em PDF.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link href="/decisao" className={CTA_PRIMARY}>🧠 Começar a decidir (grátis)</Link>
            <Link href="/planos" className={CTA_GHOST}>⭐ Ver planos</Link>
          </div>
        </div>
      </section>

      {/* CTA FINAL — fechamento prescritivo, foco em uma única ação */}
      <HomeSecaoCtaFinal />
    </main>
  );
}
