import Link from 'next/link';
import { DESTINOS, destinoPorCode } from '../_lib/destinos.js';
import { JsonLd } from '../_components/JsonLd.jsx';
import { jsonLdOrganization, jsonLdWebSite, jsonLdReviews, siteUrl } from '../_lib/seo.js';
import { ProvaSocial } from '../_components/ProvaSocial.jsx';
import { DEPOIMENTOS } from '../_lib/depoimentos.js';
import { HomeSecaoComoDecide, HomeSecaoFaq, HomeSecaoCtaFinal } from '../_components/HomeSections.jsx';
import { HomeCalcadao, HomeVitrine } from '../_components/home/HomeCalcadao.jsx';
import { HeroSimulador } from '../_components/HeroSimulador.jsx';
import { todasBases, midiaLeve, CAMBIO_BRL } from '../_lib/figurinhas.js';
import { simularCustoReal } from '../_engine/custoTotal.js';
import { Icon } from '../_ui/Icon.jsx';
import { Azulejo, CORES_AZULEJO } from '../_ui/Azulejo.jsx';
import { SourceTrust } from '../_ui/SourceTrust.jsx';
import { T } from '../_components/T.jsx';

// Home CALÇADÃO (Server Component). Primeiro valor antes de cadastro: a frase do
// hero já responde "quantos lugares estão na hora certa" para o mês, os dias, as
// pessoas e o orçamento escolhidos (OMEGA V4 §30). Figurinhas e placar compartilham
// o mês. Fotos/vídeos: Wikimedia Commons com autor e licença (_lib/midia.js).
export const revalidate = 86400;

export const metadata = {
  title: 'Mundo Sem Fim — o álbum do mundo inteiro, na hora certa',
  description:
    `Descubra onde está a época certa agora, quanto a viagem custa de verdade e se o seu passaporte entra. ${DESTINOS.length} países com foto, bandeira, melhor época, visto e custo — com fonte e data.`,
  alternates: { canonical: '/' },
};

const JORNADA = [
  { n: '01', k: 'j1', tit: 'Explorar', txt: `${DESTINOS.length} países no álbum do mundo, com custo de referência, melhor época e visto para quem tem passaporte brasileiro.`, href: '/explorar', cta: 'Abrir o álbum' },
  { n: '02', k: 'j2', tit: 'Decidir', txt: 'Top 3 pelo seu perfil, com nota explicada, riscos e o porquê de cada escolha. A comissão nunca entra no ranking.', href: '/decisao', cta: 'Decidir agora' },
  { n: '03', k: 'j3', tit: 'Planejar', txt: 'A ordem dos países e dos dias que respeita estação, visto e orçamento — e recalcula quando você muda algo.', href: '/planejar', cta: 'Montar a rota' },
  { n: '04', k: 'j4', tit: 'Viajar', txt: 'Reservas, documentos, despesas e o próximo passo do dia num só lugar, inclusive offline.', href: '/viagens', cta: 'Minhas viagens' },
];

export default function Home() {
  const reviewsLd = jsonLdReviews(DEPOIMENTOS, siteUrl());
  const bases = todasBases();
  const midia = midiaLeve(bases.map((b) => b.code), { largura: 500, video: false });
  const mesInicial = new Date().getMonth();
  // mesmo cenário padrão da calculadora /custo-real: Peru, 8 dias, casal, maio, GRU
  const peru = destinoPorCode('PE');
  const sim = simularCustoReal({ destino: peru, dias: 8, pessoas: 2, mes: 5 });
  const exemplo = { nome: peru.nome, dias: 8, pessoas: 2, vitrine: sim.vitrine, total: sim.total, escondido: sim.escondido };

  return (
    <main>
      <JsonLd data={jsonLdOrganization(siteUrl())} />
      <JsonLd data={jsonLdWebSite(siteUrl())} />
      {reviewsLd && <JsonLd data={reviewsLd} />}

      <HomeCalcadao bases={bases} midia={midia} mesInicial={mesInicial} cambio={CAMBIO_BRL} />
      {/* SIMULADOR COMPLETO — Top 3 com custo em terra, passagem e total na sua moeda */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pt-16 sm:pt-20 grid gap-8 lg:gap-12 lg:grid-cols-[minmax(0,.9fr)_minmax(0,1.1fr)] items-start">
        <div className="lg:sticky lg:top-28">
          <span className="ms-rotulo">Simulador · sem cadastro</span>
          <h2 className="ms-titulo text-[40px] sm:text-[60px] text-ink">os 3 que cabem <span className="text-cobalto">no seu bolso</span></h2>
          <p className="mt-4 text-lg text-[#33332F] max-w-md leading-relaxed">Diga de onde sai, quantos vão, quantos dias e quanto quer gastar. A gente separa o custo em terra, a passagem e o total provável — na sua moeda, com o câmbio do dia e a fonte.</p>
          <div className="mt-6 flex flex-wrap items-center gap-2 text-sm text-inksoft">
            <span className="mr-1"><T k="home2.cadaDado" fallback="Cada dado diz o que é:" /></span>
            <SourceTrust freshness="LIVE" compacto /><SourceTrust freshness="ESTIMATE" compacto /><SourceTrust freshness="HISTORICAL" compacto />
          </div>
        </div>
        <HeroSimulador />
      </section>

      <HomeVitrine exemplo={exemplo} cambio={CAMBIO_BRL} />

      {/* JORNADA — quatro passos, cada um com seu azulejo */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pt-16 sm:pt-20">
        <span className="ms-rotulo"><T k="home2.jornadaEy" fallback="Do sonho ao retorno" /></span>
        <h2 className="ms-titulo text-[40px] sm:text-[60px] text-ink max-w-3xl"><T k="home2.jornadaH" fallback="Uma viagem inteira, sem abrir dez apps." /></h2>
        <ol className="mt-9 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {JORNADA.map((p, i) => (
            <li key={p.n}>
              <Link href={p.href} className="group h-full flex flex-col rounded-[24px] bg-paper2 p-6 hover:bg-coral transition-colors focusring">
                <div className="flex items-center justify-between">
                  <span className="font-cond font-extrabold text-lg tracking-[.08em]">{p.n}</span>
                  <Azulejo motivo={i + 1} cor={CORES_AZULEJO[i]} fundo={i === 3 ? '#FFFFFF' : '#FFFFFF'} tam={44} rot={i * 90} />
                </div>
                <h3 className="mt-8 font-display font-extrabold text-3xl tracking-[-.03em] text-ink"><T k={`home2.${p.k}`} fallback={p.tit} /></h3>
                <p className="mt-2 text-[15px] text-ink/75 leading-relaxed flex-1">{p.k === 'j1' ? `${DESTINOS.length} ` : ''}<T k={`home2.${p.k}t`} fallback={p.k === 'j1' ? p.txt.replace(/^\d+ /, '') : p.txt} /></p>
                <span className="mt-5 inline-flex items-center gap-1.5 font-cond font-extrabold uppercase tracking-[.05em] text-ink"><T k={`home2.${p.k}c`} fallback={p.cta} /> <Icon name="arrow-right" size={16} className="group-hover:translate-x-1 transition" /></span>
              </Link>
            </li>
          ))}
        </ol>
      </section>

      <HomeSecaoComoDecide />

      {/* CONFIANÇA — cada número diz o que é */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pt-16 sm:pt-20">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr] items-start">
          <div>
            <span className="ms-rotulo"><T k="home2.confEy" fallback="Sem integração fingida" /></span>
            <h2 className="ms-titulo text-[40px] sm:text-[56px] text-ink"><T k="home2.confH" fallback="Cada número diz de onde veio — e quando." /></h2>
            <p className="mt-5 text-lg text-ink/75 leading-relaxed max-w-lg">
              <T k="home2.confP" fallback="Preço de referência não é cotação. Câmbio do dia não é taxa do cartão. Regra de visto muda. Por isso todo dado crítico no Mundo Sem Fim carrega um selo, a fonte e a data — e nada é chamado de “ao vivo” sem ter sido consultado agora." />
            </p>
            <Link href="/fontes" className="mt-6 inline-flex items-center gap-1.5 font-cond font-extrabold text-lg uppercase tracking-[.05em] text-ink border-b-[3px] border-ink hover:border-coral focusring"><T k="home2.confLink" fallback="Ver fontes e metodologia" /> <Icon name="arrow-right" size={16} /></Link>
          </div>
          <dl className="grid gap-4 sm:grid-cols-2">
            {[
              ['LIVE', 'c1', 'Previsão do tempo', 'Consultada na fonte agora, com horário — e envelhece: depois de minutos vira “recente”.'],
              ['ESTIMATE', 'c2', 'Custo da sua viagem', 'Calculado pelo nosso modelo a partir dos seus dias, estilo e pessoas.'],
              ['HISTORICAL', 'c3', 'Preço de ingresso', 'Pesquisa de referência (jun/2026). Pode ter mudado — conferir antes de comprar.'],
              ['UNVERIFIED', 'c4', 'Regra sem fonte', 'Quando não temos fonte confiável, dizemos — e mandamos você ao órgão oficial.'],
            ].map(([f, ck, t, d]) => (
              <div key={f} className="rounded-[24px] border border-line p-6">
                <dt>
                  <SourceTrust freshness={f} compacto />
                  <span className="mt-4 block font-display font-bold text-xl text-ink"><T k={`home2.${ck}`} fallback={t} /></span>
                </dt>
                <dd className="mt-1.5 text-[15px] text-inksoft leading-relaxed"><T k={`home2.${ck}t`} fallback={d} /></dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <ProvaSocial totalPaises={DESTINOS.length} />
      <HomeSecaoFaq />
      <HomeSecaoCtaFinal />
    </main>
  );
}
