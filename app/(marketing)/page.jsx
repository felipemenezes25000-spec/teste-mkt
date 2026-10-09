import Link from 'next/link';
import { destinosDestaque, DESTINOS } from '../_lib/destinos.js';
import { fotoCapa, resumoWiki } from '../_lib/wiki.js';
import { resolverImagens, resolverImagem } from '../_lib/media.js';
import { arquivoWikimedia, wikiThumb } from '../_lib/wikiThumb.js';
import { DestinoCard } from '../_components/DestinoCard.jsx';
import { JsonLd } from '../_components/JsonLd.jsx';
import { jsonLdOrganization, jsonLdWebSite, jsonLdReviews, siteUrl } from '../_lib/seo.js';
import { ProvaSocial } from '../_components/ProvaSocial.jsx';
import { HeroSimulador } from '../_components/HeroSimulador.jsx';
import { DEPOIMENTOS } from '../_lib/depoimentos.js';
import { HomeSecaoComoDecide, HomeSecaoCustoReal, HomeSecaoFaq, HomeSecaoCtaFinal } from '../_components/HomeSections.jsx';
import { Icon } from '../_ui/Icon.jsx';
import { Foto } from '../_ui/Foto.jsx';
import { SourceTrust } from '../_ui/SourceTrust.jsx';

// Home MERIDIANO (Server Component). Primeiro valor antes de cadastro: o simulador
// está DENTRO do hero (OMEGA V4 §30). Foto do hero e dos destaques resolvidas pelo
// serviço de mídia (URL segura + autor/licença). Rede falhou → fallback honesto.
export const revalidate = 86400;

export const metadata = {
  title: 'Mundo Sem Fim — o mundo inteiro, explicado para você',
  description:
    `Descubra pra onde ir pelo seu perfil, veja o custo real da viagem inteira com fonte e data, monte a rota que respeita estação, visto e orçamento. ${DESTINOS.length} países. Grátis pra começar.`,
  alternates: { canonical: '/' },
};

// Local do hero: foto + coordenada exibida (assinatura MERIDIANO).
const HERO = { titulo: 'Lofoten', rotulo: 'LOFOTEN · NORUEGA', coord: '68.15° N · 13.98° E' };

const JORNADA = [
  { n: '01', icon: 'globe', tit: 'Explorar', txt: `${DESTINOS.length} países num mapa vivo, com custo de referência, melhor época e visto para quem tem passaporte brasileiro.`, href: '/explorar', cta: 'Abrir o mapa' },
  { n: '02', icon: 'target', tit: 'Decidir', txt: 'Top 3 pelo seu perfil, com nota explicada, riscos e o porquê de cada escolha. A comissão nunca entra no ranking.', href: '/decisao', cta: 'Decidir agora' },
  { n: '03', icon: 'route', tit: 'Planejar', txt: 'A ordem dos países e dos dias que respeita estação, visto e orçamento — e recalcula quando você muda algo.', href: '/planejar', cta: 'Montar a rota' },
  { n: '04', icon: 'suitcase', tit: 'Viajar', txt: 'Reservas, documentos, despesas e o próximo passo do dia num só lugar, inclusive offline.', href: '/viagens', cta: 'Minhas viagens' },
];

const CTA_LIMA = 'inline-flex items-center justify-center gap-2 rounded-lg bg-coral text-oncoral font-semibold px-5 h-12 hover:brightness-95 transition focusring';
const CTA_LINHA = 'inline-flex items-center justify-center gap-2 rounded-lg border border-white/25 text-white font-semibold px-5 h-12 hover:bg-white/10 transition focusring';

export default async function Home() {
  const destaques = destinosDestaque().slice(0, 7);
  const reviewsLd = jsonLdReviews(DEPOIMENTOS, siteUrl());
  const [heroWiki, ...imgs] = await Promise.all([
    resumoWiki(HERO.titulo),
    ...destaques.map((d) => fotoCapa(d)),
  ]);
  const [heroAsset, assets] = await Promise.all([
    heroWiki?.img ? resolverImagem(heroWiki.img, { largura: 1920 }) : null,
    resolverImagens(imgs.filter(Boolean), { largura: 960 }),
  ]);
  const heroSrc = heroAsset ? heroAsset.url : heroWiki?.img ? wikiThumb(heroWiki.img, 1280) : null;
  const heroCredito = heroAsset ? { fonte: 'Wikimedia Commons', autor: heroAsset.photographer, licenca: heroAsset.license, link: heroAsset.pageUrl } : null;
  const fotoDe = (u) => {
    const a = u ? assets.get(arquivoWikimedia(u) || '') : null;
    return a ? { img: a.url, credito: { fonte: 'Wikimedia Commons', autor: a.photographer, licenca: a.license, link: a.pageUrl } } : { img: u, credito: null };
  };
  const [principal, ...resto] = destaques.map((d, i) => ({ d, ...fotoDe(imgs[i]) }));

  return (
    <main>
      <JsonLd data={jsonLdOrganization(siteUrl())} />
      <JsonLd data={jsonLdWebSite(siteUrl())} />
      {reviewsLd && <JsonLd data={reviewsLd} />}

      {/* HERO — sempre escuro (data-theme local), foto real com crédito, simulador embutido */}
      <section data-theme="dark" className="relative overflow-hidden bg-paper text-ink -mt-px">
        <Foto src={heroSrc} alt="Montanhas e vilarejo de pescadores em Lofoten, Noruega" credito={heroCredito} prioridade className="absolute inset-0 !bg-paper" imgClassName="opacity-95" largura={1920} altura={1080} />
        <div className="absolute inset-0 bg-gradient-to-r from-paper via-paper/75 to-paper/5 pointer-events-none" aria-hidden />
        <div className="absolute inset-0 bg-gradient-to-t from-paper via-paper/10 to-paper/50 pointer-events-none" aria-hidden />
        <div className="absolute inset-0 pointer-events-none opacity-60" aria-hidden
          style={{ backgroundImage: 'linear-gradient(rgb(var(--grid-ink) / .07) 1px, transparent 1px), linear-gradient(90deg, rgb(var(--grid-ink) / .07) 1px, transparent 1px)', backgroundSize: '96px 96px' }} />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 pt-14 pb-16 sm:pt-20 lg:pt-24 lg:pb-24 grid gap-10 lg:gap-14 lg:grid-cols-[1.05fr_1fr] items-end">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <span className="signal-dot" aria-hidden />
              <span className="eyebrow !text-ink/80">{DESTINOS.length} países · decisões com fonte e data</span>
            </div>
            <h1 className="mt-6 font-display text-[3.1rem] leading-[.95] sm:text-7xl xl:text-[5.6rem] tracking-tightest text-ink">
              O mundo inteiro,<br /><span className="text-coral">explicado para você.</span>
            </h1>
            <p className="mt-6 text-lg text-inksoft max-w-xl leading-relaxed">
              Pra onde ir pelo seu perfil, quanto a viagem custa de verdade — com fonte e data em cada número —
              e a rota que respeita estação, visto e orçamento. Do sonho ao retorno.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/decisao" className={CTA_LIMA}><Icon name="target" size={18} /> Decidir minha viagem</Link>
              <Link href="/explorar" className={CTA_LINHA}><Icon name="globe" size={18} /> Explorar o mapa</Link>
            </div>
            <div className="mt-8 flex flex-wrap items-center gap-2 text-xs text-inksoft">
              <span className="mr-1">Cada dado diz o que é:</span>
              <SourceTrust freshness="LIVE" compacto /><SourceTrust freshness="ESTIMATE" compacto /><SourceTrust freshness="HISTORICAL" compacto />
            </div>
            <div className="mt-10 coord text-inksoft">{HERO.rotulo} — {HERO.coord}</div>
          </div>
          <HeroSimulador />
        </div>
      </section>

      {/* JORNADA — quatro passos, uma plataforma */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-20">
        <div className="max-w-2xl">
          <div className="eyebrow mb-3">Do sonho ao retorno</div>
          <h2 className="font-display text-4xl sm:text-5xl tracking-tighter text-ink">Uma viagem inteira, sem abrir dez apps.</h2>
        </div>
        <ol className="mt-10 grid gap-px bg-line border border-line rounded-2xl overflow-hidden sm:grid-cols-2 lg:grid-cols-4">
          {JORNADA.map((p) => (
            <li key={p.n} className="bg-card">
              <Link href={p.href} className="group h-full flex flex-col p-6 hover:bg-paper2/60 transition focusring">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs text-inksoft">{p.n}</span>
                  <span className="w-10 h-10 rounded-lg bg-pine/10 text-pine grid place-items-center"><Icon name={p.icon} size={20} /></span>
                </div>
                <h3 className="mt-8 font-display text-2xl text-ink">{p.tit}</h3>
                <p className="mt-2 text-sm text-inksoft leading-relaxed flex-1">{p.txt}</p>
                <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-pine">{p.cta} <Icon name="arrow-right" size={15} className="group-hover:translate-x-0.5 transition" /></span>
              </Link>
            </li>
          ))}
        </ol>
      </section>

      {/* DESTAQUES — grade editorial assimétrica */}
      {principal && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-20">
          <div className="flex flex-wrap items-end justify-between gap-3 mb-8">
            <div>
              <div className="eyebrow mb-3">Para começar</div>
              <h2 className="font-display text-4xl sm:text-5xl tracking-tighter text-ink">Destinos em destaque</h2>
            </div>
            <Link href="/explorar" className="inline-flex items-center gap-1.5 text-sm font-semibold text-pine hover:underline focusring">Ver os {DESTINOS.length} países <Icon name="arrow-right" size={15} /></Link>
          </div>
          <div className="grid gap-4 lg:grid-cols-3">
            <Link href={`/destino/${principal.d.slug}`} className="group relative block min-h-[420px] lg:row-span-2 rounded-2xl overflow-hidden border border-line focusring">
              <Foto src={principal.img} alt={principal.d.nome} credito={principal.credito} className="absolute inset-0" imgClassName="group-hover:scale-[1.02] transition duration-700" largura={960} altura={1200} />
              <div className="absolute inset-0 photo-scrim pointer-events-none" aria-hidden />
              <div className="absolute inset-x-0 bottom-0 p-6 text-white">
                <div className="font-mono text-[11px] tracking-widest text-coral">{principal.d.regiao.toUpperCase()}</div>
                <div className="mt-1 font-display text-5xl tracking-tighter">{principal.d.nome}</div>
                <p className="mt-2 text-sm text-white/80 max-w-md line-clamp-2">{principal.d.estacao}</p>
                <div className="mt-4 flex items-center gap-3 font-mono text-xs text-white/80">
                  <span>US$ {principal.d.custoDia}/dia</span><span aria-hidden>·</span><span>referência jun/2026</span>
                </div>
              </div>
            </Link>
            {resto.slice(0, 4).map((x) => <DestinoCard key={x.d.code} d={x.d} img={x.img} credito={x.credito} />)}
          </div>
        </section>
      )}

      <HomeSecaoComoDecide />
      <HomeSecaoCustoReal />

      {/* CONFIANÇA — o diferencial: cada número diz o que é */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-20">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr] items-start">
          <div>
            <div className="eyebrow mb-3">Sem integração fingida</div>
            <h2 className="font-display text-4xl sm:text-5xl tracking-tighter text-ink">Cada número diz de onde veio — e quando.</h2>
            <p className="mt-5 text-inksoft leading-relaxed max-w-lg">
              Preço de referência não é cotação. Câmbio do dia não é taxa do cartão. Regra de visto muda. Por isso todo dado
              crítico no Mundo Sem Fim carrega um selo, a fonte e a data — e nada é chamado de “ao vivo” sem ter sido consultado agora.
            </p>
            <Link href="/fontes" className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-pine hover:underline focusring">Ver fontes e metodologia <Icon name="arrow-right" size={15} /></Link>
          </div>
          <dl className="grid gap-px bg-line border border-line rounded-2xl overflow-hidden sm:grid-cols-2">
            {[
              ['LIVE', 'Previsão do tempo', 'Consultada na fonte agora, com horário — e envelhece: depois de minutos vira “recente”.'],
              ['ESTIMATE', 'Custo da sua viagem', 'Calculado pelo nosso modelo a partir dos seus dias, estilo e pessoas.'],
              ['HISTORICAL', 'Preço de ingresso', 'Pesquisa de referência (jun/2026). Pode ter mudado — conferir antes de comprar.'],
              ['UNVERIFIED', 'Regra sem fonte', 'Quando não temos fonte confiável, dizemos — e mandamos você ao órgão oficial.'],
            ].map(([f, t, d]) => (
              <div key={f} className="bg-card p-6">
                <SourceTrust freshness={f} compacto />
                <dt className="mt-4 font-display text-xl text-ink">{t}</dt>
                <dd className="mt-1.5 text-sm text-inksoft leading-relaxed">{d}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <ProvaSocial />
      <HomeSecaoFaq />
      <HomeSecaoCtaFinal />
    </main>
  );
}
