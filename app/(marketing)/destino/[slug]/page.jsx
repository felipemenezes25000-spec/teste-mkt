import Link from 'next/link';
import { notFound } from 'next/navigation';
import { DESTINOS, destinoPorSlug } from '../../../_lib/destinos.js';
import { resumoWiki, imagemWiki, imagensDe, creditoImagem, imagemCommons, imagemOpenverse, escolherSobre } from '../../../_lib/wiki.js';
import { atracoesDe } from '../../../_lib/places.js';
import { MESES_PT } from '../../../_engine/data.js';
import { FavoriteButton } from '../../../_components/FavoriteButton.jsx';
import { AddToRouteButton } from '../../../_components/AddToRouteButton.jsx';
import { linksDestino } from '../../../_lib/links.js';
import { flagUrl } from '../../../_lib/flags.js';
import { CustoTiers } from '../../../_components/CustoTiers.jsx';
import { CustoVitrineVsReal } from '../../../_components/CustoVitrineVsReal.jsx';
import { calcExemploDestino, resumoVitrineVsReal } from '../../../_engine/custoTotal.js';
import { dicasDe, SECOES_DICAS } from '../../../_engine/dicas.js';
import { atracoesDoPais } from '../../../_engine/atracoes.js';
import { ATRACOES_IMG } from '../../../_engine/atracoesImgOverride.js';
import { comidasDoPais, COMIDA_ICON } from '../../../_engine/comidas.js';
import { cidadeWiki } from '../../../_lib/cidadeWiki.js';
import { GaleriaLugares } from './GaleriaLugares.jsx';
import { wikiThumb } from '../../../_lib/wikiThumb.js';
import { JsonLd } from '../../../_components/JsonLd.jsx';
import { jsonLdDestino, jsonLdBreadcrumb, jsonLdFaq, siteUrl } from '../../../_lib/seo.js';
import { ShareButtons } from '../../../_components/ShareButtons.jsx';
import { VerdictCard } from '../../../_components/VerdictCard.jsx';
import { TravelFitScore } from '../../../_components/TravelFitScore.jsx';
import { ValeIrAgora } from '../../../_components/ValeIrAgora.jsx';
import { OQueNinguemConta } from '../../../_components/OQueNinguemConta.jsx';
import { dicasOQueNinguemConta } from '../../../_lib/oqueNinguemConta.js';
import { MapaPais } from '../../../_components/mapa/MapaPais.jsx';
import { pontosDoPais } from '../../../_lib/geo.js';
import { T } from '../../../_components/T.jsx';
import { ComoSeLocomove } from '../../../_components/ComoSeLocomove.jsx';
import { PasseiosIngressos } from '../../../_components/PasseiosIngressos.jsx';
import { OQueFazer } from '../../../_components/OQueFazer.jsx';
import { atracoesPrecosDoPais } from '../../../_engine/atracoesPrecos.js';
import { atracoesPagasDoPais } from '../../../_engine/precosAtracoes.js';
import { dadosV2DoPais } from '../../../_engine/precos.js';
import { precosDoPais } from '../../../_engine/precosTransporte.js';
import { Icon } from '../../../_ui/Icon.jsx';
import { Foto } from '../../../_ui/Foto.jsx';
import { QuandoVisivel } from '../../../_ui/QuandoVisivel.jsx';
import { SourceTrust } from '../../../_ui/SourceTrust.jsx';
import { resolverImagens, resolverImagem } from '../../../_lib/media.js';
import { arquivoWikimedia } from '../../../_lib/wikiThumb.js';
import { coordTexto } from '../../../_lib/brand.jsx';
import { vistoDe } from '../../../_engine/data.js';

export const revalidate = 86400;
// Pré-renderiza os destaques no build; o restante (catálogo mundial) renderiza
// sob demanda (ISR) e fica cacheado — build rápido mesmo com 150+ países.
export const dynamicParams = true;

// Todos os 205 destinos são pré-gerados no build (SEO e velocidade da 1ª visita);
// ISR (1 dia) mantém fotos e textos atualizados. Fetches externos são cacheados.
export function generateStaticParams() {
  return DESTINOS.map((d) => ({ slug: d.slug }));
}

export async function generateMetadata(props) {
  const params = await props.params;
  const d = destinoPorSlug(params.slug);
  if (!d) return {};
  const titulo = `${d.nome} — guia de viagem | Mundo Sem Fim`;
  const desc = `Veredito humano, Mundo Score, melhor época, custo real, pontos turísticos e comida típica de ${d.nome}.`;
  return {
    title: titulo,
    description: desc,
    alternates: { canonical: `/destino/${d.slug}` },
    openGraph: { title: titulo, description: desc, url: `/destino/${d.slug}` },
    twitter: { title: titulo, description: desc },
  };
}

function mapsUrl(q) {
  return 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(q);
}

// Último recurso ABSOLUTO de foto (arquivo do Commons que sempre existe) — só usado
// se nem o país tiver foto, garantindo que NENHUM card renderize sem imagem.
const FOTO_ULTIMO = 'https://commons.wikimedia.org/wiki/Special:FilePath/Sunset_across_Machu_Picchu.jpg';

// Crédito-lite p/ imagem hospedada no Wikimedia (link da página do arquivo, onde
// aparecem autor + licença). Para fotos do Openverse o crédito vem pronto da API.
function creditoCommonsLite(u) {
  if (!u) return null;
  try {
    const p = new URL(u).pathname.split('/');
    const file = decodeURIComponent(u.includes('/thumb/') ? p[p.length - 2] : p[p.length - 1]);
    const link = /upload\.wikimedia|Special:FilePath/.test(u) ? 'https://commons.wikimedia.org/wiki/File:' + encodeURIComponent(file) : u;
    return { fonte: 'Wikimedia Commons', autor: null, licenca: null, link };
  } catch {
    return { fonte: 'Wikimedia Commons', autor: null, licenca: null, link: u };
  }
}

// MapaDestino agora é Client Component (lê useIdioma → MapTiler troca labels).
// Importado de _components/MapaDestino.jsx.

export default async function DestinoPage(props) {
  const params = await props.params;
  const d = destinoPorSlug(params.slug);
  if (!d) notFound();
  const base = siteUrl();

  const pontos = atracoesDoPais(d.code);
  const cidadesLista = (d.cidades || []).slice(0, 4);

  // FOTO GARANTIDA — nenhum card pode ficar sem imagem (independente do meio):
  // verbete → busca direta no Commons → PISO = foto do país (sempre existe).
  const wiki = await resumoWiki(d.fotoQuery || d.nome);
  // "Sobre {país}" SEMPRE vem do PAÍS — fotoQuery é cidade/landmark (escolhida p/ a foto),
  // e usá-la como descrição fazia "Sobre Alemanha" mostrar o Portão de Brandemburgo.
  // Sem fotoQuery (curados), `wiki` já é o país → reusa sem 2º fetch.
  const sobrePais = (!d.fotoQuery || d.fotoQuery === d.nome) ? wiki : await resumoWiki(d.nome);
  const sobre = escolherSobre({ pais: sobrePais, ponto: wiki });
  const heroImg = wiki?.img || (await imagensDe(d.fotoQuery || d.nome, { n: 1 }))[0] || (await imagemCommons(d.fotoQuery || d.nome)) || null;
  const credito = heroImg ? await creditoImagem(heroImg) : null;
  // Piso: várias fotos do país (cicladas) — o raro item sem foto própria cai aqui sem
  // repetir sempre a mesma imagem. FOTO_ULTIMO garante não-nulo mesmo no pior caso.
  // Piso do país: fotos do LANDMARK curado (d.fotoQuery) via media-list, que JÁ é filtrada por RUIM (sem
  // bandeira/brasão/mapa). Auditoria jun/2026: a fonte antiga imagensDe(d.nome) puxava o artigo do PAÍS
  // (mapas/pinturas/brasões coloniais) -> ~1.180 cards errados. NÃO prependemos heroImg aqui porque ele vem do
  // summary (pode ser mapa/brasão de lead); ele fica só como último recurso no piso() abaixo (quando a media-list
  // vier vazia). Prova: ~88%->~98% dos cards de pool viraram foto real.
  const poolPais = [...new Set((await imagensDe(d.fotoQuery || d.nome, { n: 6 })).filter(Boolean))];
  const piso = (i) => (poolPais.length ? poolPais[i % poolPais.length] : (heroImg || FOTO_ULTIMO));

  // Cadeia COM GARANTIA + CRÉDITO de cada item. Ordem: verbete curado → Openverse
  // (Flickr-CC/museus/Commons, traz autor+licença+link) → Commons direto → piso do país
  // ciclado. Devolve { src, credito } — nunca nulo (piso/FOTO_ULTIMO garantem).
  const fotoGarantida = async (titulo, busca, i) => {
    const w = await imagemWiki(titulo);
    if (w) return { src: w, credito: creditoCommonsLite(w) };
    const ov = await imagemOpenverse(busca);
    if (ov) return { src: ov.url, credito: { fonte: ov.fonte, autor: ov.autor, licenca: ov.licenca, link: ov.link } };
    const c = await imagemCommons(busca);
    if (c) return { src: c, credito: creditoCommonsLite(c) };
    const p = piso(i);
    // PISO = foto do país, NÃO do lugar: rotulada como ilustrativa (V4 §11 — nunca
    // apresentar a foto de outro lugar como se fosse este).
    return { src: p, credito: creditoCommonsLite(p), ilustrativa: true };
  };
  // Overrides que reaproveitam a MESMA foto para várias atrações do país são
  // fotos-landmark de piso (ex.: Burj Khalifa em "Louvre Abu Dhabi") → ilustrativas.
  const usoOverride = {};
  for (const a of pontos) { const u = ATRACOES_IMG[`${d.code}:${a.nome}`]; if (u) usoOverride[u] = (usoOverride[u] || 0) + 1; }
  const [atracoes, pontosInfo, cidadeInfo] = await Promise.all([
    atracoesDe(d.wikidataId, { limite: 8 }),
    Promise.all(pontos.map((a, i) => {
      // Override de IMAGEM DIRETA (auditoria jun/2026): atrações sem título wiki bom recebem aqui uma URL de
      // foto real conferida por agente (Commons específica ou foto-landmark do país). Vem ANTES da cascata.
      const direta = ATRACOES_IMG[`${d.code}:${a.nome}`];
      return direta
        ? Promise.resolve({ src: direta, credito: creditoCommonsLite(direta), ilustrativa: usoOverride[direta] > 1 })
        : fotoGarantida(a.wiki || a.nome, `${a.nome} ${a.cidade || ''} ${d.nome}`, i);
    })),
    Promise.all(cidadesLista.map((c, i) => fotoGarantida(cidadeWiki(d.code, c), `${c} ${d.nome}`, i))),
  ]);

  // Mídia: resolve TODAS as fotos do Commons de uma vez → URL em largura padrão que
  // existe (sem 400/429), autor e licença reais (V4 §12-13).
  const commons = [...pontosInfo, ...cidadeInfo].map((x) => x && x.src).filter((u) => u && arquivoWikimedia(u));
  const [assets, heroAsset] = await Promise.all([
    resolverImagens(commons, { largura: 500 }),
    heroImg ? resolverImagem(heroImg, { largura: 1280 }) : null,
  ]);
  const comAsset = (info) => {
    if (!info || !info.src) return info;
    const a = assets.get(arquivoWikimedia(info.src) || '');
    if (!a) return info;
    return { ...info, src: a.url, credito: { fonte: 'Wikimedia Commons', autor: a.photographer, licenca: a.license, link: a.pageUrl } };
  };
  for (let i = 0; i < pontosInfo.length; i++) pontosInfo[i] = comAsset(pontosInfo[i]);
  for (let i = 0; i < cidadeInfo.length; i++) cidadeInfo[i] = comAsset(cidadeInfo[i]);
  const heroSrc = heroAsset ? heroAsset.url : heroImg ? wikiThumb(heroImg, 1280) : null;
  const heroCredito = heroAsset
    ? { fonte: 'Wikimedia Commons', autor: heroAsset.photographer, licenca: heroAsset.license, link: heroAsset.pageUrl }
    : credito ? { fonte: 'Wikimedia', autor: credito.autor, licenca: credito.licenca, link: credito.fileUrl } : null;

  // Galeria de pontos turísticos: prioriza a lista CURADA (foto buscada por atração),
  // com fallback pro Wikidata. Garante cobertura em todos os 205 países.
  // `contextoPais` é o trunfo: quando a Wikipédia falhar pra um ponto obscuro
  // (Tuvalu, Comores), o modal mostra o sobre do PAÍS — nunca deixa o usuário
  // com a mensagem fria "Não encontramos um resumo".
  const contextoPais = sobrePais?.extrato || sobre?.extrato || null;
  const urlPais = sobrePais?.url || sobre?.url || null;
  const galeria = pontos.length
    ? pontos.map((a, i) => ({ nome: a.nome, sub: a.cidade, img: pontosInfo[i].src, credito: pontosInfo[i].credito, ilustrativa: !!pontosInfo[i].ilustrativa, ilustrativaDe: pontosInfo[i].ilustrativa ? d.nome : null, wiki: a.wiki || a.nome, maps: mapsUrl(`${a.nome}, ${d.nome}`), contextoPais, urlPais, fora: !!a.fora }))
    : (atracoes || []).map((a) => ({ nome: a.nome, sub: a.descricao, img: wikiThumb(a.img, 480), credito: creditoCommonsLite(a.img), wiki: a.nome, maps: mapsUrl(`${a.nome}, ${d.nome}`), contextoPais, urlPais, fora: false }));

  // Cidades & bases: mesma estrutura da galeria pra abrir o mesmo modal (decisão do
  // usuário: cidades também abrem história). wiki via override (foto + história certas).
  const cidadesData = cidadesLista.map((c, i) => ({
    nome: c,
    sub: d.nome,
    img: cidadeInfo[i].src,
    credito: cidadeInfo[i].credito,
    ilustrativa: !!cidadeInfo[i].ilustrativa,
    ilustrativaDe: cidadeInfo[i].ilustrativa ? d.nome : null,
    wiki: cidadeWiki(d.code, c),
    maps: mapsUrl(`${c}, ${d.nome}`),
    contextoPais,
    urlPais,
  }));

  // Comidas: lista curada (com tipo: salgado/doce/bebida) ou fallback dos dados base.
  const comidas = comidasDoPais(d.code).length
    ? comidasDoPais(d.code)
    : (d.comidas || []).map((f) => ({ nome: f, tipo: 'salgado' }));

  const meses = (d.melhoresMeses || []).map((m) => MESES_PT[m - 1]).join(' · ') || '—';
  const faqLd = jsonLdFaq([
    { pergunta: `Qual a melhor época para visitar ${d.nome}?`, resposta: `${meses !== '—' ? `Melhores meses: ${meses}. ` : ''}${d.estacao || ''}`.trim() },
    { pergunta: `Quanto custa viajar para ${d.nome}?`, resposta: `Custo médio de referência: ~US$ ${d.custoDia}/dia (perfil econômico, em terra). O custo real da viagem (com voo, seguro e visto) aparece na página.` },
  ]);
  const visto = vistoDe(d.code, 'BR');
  const VISTO_TXT = { isento: 'Isento', 'e-visa': 'e-Visa', 'on-arrival': 'Na chegada', visto: 'Visto consular', eta: 'ETA eletrônica', consultar: 'Consultar' };
  const ficha = [
    { k: 'Melhor época', v: meses, fr: 'HISTORICAL', fonte: 'Pesquisa climática Mundo Sem Fim', data: 'jun/2026' },
    { k: 'Custo de referência', v: `US$ ${d.custoDia}/dia`, fr: 'HISTORICAL', fonte: 'Pesquisa de custos Mundo Sem Fim (perfil econômico)', data: 'jun/2026' },
    { k: 'Visto · passaporte BR', v: `${VISTO_TXT[visto.tipo] || visto.tipo}${visto.dias ? ` · até ${visto.dias} dias` : ''}`, fr: visto.tipo === 'consultar' ? 'UNVERIFIED' : 'HISTORICAL', fonte: 'Regras consulares compiladas — confirme no Itamaraty/consulado', data: 'jun/2026', nota: visto.nota },
    { k: 'Moeda', v: d.moeda, fr: 'HISTORICAL', fonte: 'ISO 4217' },
    { k: 'Cidade de entrada', v: `${d.cidadePrincipal || '—'}${d.iata ? ` · ${d.iata}` : ''}`, fr: 'HISTORICAL', fonte: 'Catálogo Mundo Sem Fim' },
  ];
  const SECOES = [
    ['visao', 'Visão geral'], ['custos', 'Custos'], ['lugares', 'Lugares'], ['fazer', 'O que fazer'],
    ['logistica', 'Logística'], ['antes', 'Antes de ir'], ['reservar', 'Reservar'],
  ];

  const btnLima = 'inline-flex items-center justify-center gap-2 rounded-lg bg-coral text-oncoral font-semibold px-4 h-11 hover:brightness-95 transition focusring shrink-0';
  const btnClaro = 'inline-flex items-center justify-center gap-2 rounded-lg border border-white/30 bg-white/10 backdrop-blur text-white font-semibold px-4 h-11 hover:bg-white/20 transition focusring shrink-0';
  const btnGhost = 'inline-flex items-center justify-center gap-2 rounded-lg border border-line bg-card text-ink font-semibold px-4 h-11 hover:border-pine/50 transition focusring shrink-0';
  const H2 = 'font-display text-[1.75rem] leading-tight text-ink';

  return (
    <main>
      <JsonLd data={jsonLdDestino(d, base)} />
      <JsonLd
        data={jsonLdBreadcrumb([
          { nome: 'Início', url: base },
          { nome: 'Explorar', url: `${base}/explorar` },
          { nome: d.nome, url: `${base}/destino/${d.slug}` },
        ])}
      />
      {faqLd && <JsonLd data={faqLd} />}

      {/* HERO editorial — foto real com crédito, coordenada e ações */}
      <section className="relative h-[62vh] min-h-[420px] max-h-[640px] overflow-hidden bg-ink">
        <Foto src={heroSrc} srcSet={heroAsset ? heroAsset.srcSet : undefined} sizes="100vw" alt={`${d.nome} — ${d.fotoQuery || d.nome}`} credito={heroCredito} prioridade className="absolute inset-0" largura={1280} altura={720} rotuloFalha="Sem foto verificada" />
        <div className="absolute inset-0 photo-scrim pointer-events-none" aria-hidden />
        <div className="absolute inset-0 bg-gradient-to-r from-ink/70 via-ink/20 to-transparent pointer-events-none" aria-hidden />
        <FavoriteButton code={d.code} nome={d.nome} className="absolute top-4 right-4 z-20 w-10 h-10" />
        <div className="absolute inset-x-0 bottom-0">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-8 sm:pb-10">
            <nav aria-label="Trilha" className="flex items-center gap-2 text-white/80 text-sm">
              <Link href="/explorar" className="hover:text-white focusring rounded">Explorar</Link>
              <Icon name="chevron" size={14} />
              <span className="text-white/90">{d.regiao}</span>
            </nav>
            <div className="mt-3 coord text-coral">{coordTexto(d.coords)}</div>
            <h1 className="mt-1 font-display text-5xl sm:text-7xl text-white tracking-tightest flex items-center gap-4">
              {flagUrl(d.code) && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={flagUrl(d.code)} alt="" width="52" height="38" loading="lazy" className="rounded-[3px] ring-1 ring-white/40 shrink-0 hidden sm:block" />
              )}
              <span>{d.nome}</span>
            </h1>
            <p className="mt-3 max-w-2xl text-white/85 text-base sm:text-lg leading-snug">{d.estacao}</p>
            <div className="mt-5 flex flex-wrap items-center gap-2.5">
              <AddToRouteButton code={d.code} nome={d.nome} className={btnLima}><Icon name="plus" size={18} /> Adicionar à rota</AddToRouteButton>
              <Link href={`/roteiro?destino=${d.slug}`} className={btnClaro}><Icon name="spark" size={17} /> Gerar roteiro</Link>
              <TravelFitScore destino={d} compact />
            </div>
          </div>
        </div>
      </section>

      {/* Navegação por seções (sticky) */}
      <nav aria-label="Seções do destino" className="sticky top-16 z-30 bg-paper/90 backdrop-blur border-b border-line">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex gap-1 overflow-x-auto no-scrollbar">
          {SECOES.map(([id, label]) => (
            <a key={id} href={`#${id}`} className="shrink-0 px-3 py-3 text-sm font-medium text-inksoft hover:text-ink border-b-2 border-transparent hover:border-pine focusring">{label}</a>
          ))}
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 grid gap-10 lg:grid-cols-[minmax(0,1fr)_340px]">
        <div className="space-y-14 min-w-0">
          <section id="visao" className="scroll-mt-32 space-y-6">
            <VerdictCard destino={d} />
            <ValeIrAgora destino={d} />
            <TravelFitScore destino={d} />
            {sobre && (
              <div>
                <div className="eyebrow mb-2">{sobre.doPais ? 'Contexto' : 'Ponto de referência'}</div>
                <h2 className={H2}>{sobre.doPais ? `Sobre ${d.nome}` : `Sobre ${sobre.titulo}`}</h2>
                <p className="mt-3 text-inksoft leading-relaxed max-w-3xl">{sobre.extrato}</p>
                {sobre.url && <a href={sobre.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 mt-2 text-sm text-pine hover:underline focusring">Ler na Wikipédia <Icon name="external" size={14} /></a>}
              </div>
            )}
          </section>

          <section id="custos" className="scroll-mt-32 space-y-6">
            <div className="flex flex-wrap items-end justify-between gap-2">
              <div>
                <div className="eyebrow mb-2">Dinheiro</div>
                <h2 className={H2}>Quanto custa por dia</h2>
              </div>
              <SourceTrust freshness="HISTORICAL" fonte="Pesquisa de custos Mundo Sem Fim" data="jun/2026" />
            </div>
            <CustoTiers custoDia={d.custoDia} dias={7} />
            <CustoVitrineVsReal
              resumo={resumoVitrineVsReal(calcExemploDestino(d, 7))}
              contexto={`Exemplo de 7 dias em ${d.nome} (com voo do Brasil) — o custo real além do que as OTAs mostram:`}
            />
          </section>

          {galeria.length > 0 && (
            <section id="lugares" className="scroll-mt-32">
              <div className="flex flex-wrap items-end justify-between gap-2 mb-4">
                <div>
                  <div className="eyebrow mb-2">Galeria</div>
                  <h2 className={H2}><T k="destino.pontosTuristicos" fallback="Pontos turísticos" /></h2>
                </div>
                <span className="font-mono text-xs text-inksoft">{galeria.length} <T k="destino.lugares" fallback="lugares" /></span>
              </div>
              <GaleriaLugares lugares={galeria} layout="ponto" />
              <p className="mt-3 text-xs text-inksoft">Fotos com licença livre (Wikimedia Commons e outras), autor e licença no detalhe. Quando não há foto confiável do lugar exato, mostramos uma foto do país marcada como <strong className="text-ink">ilustrativa</strong>.</p>
              {cidadesData.length > 0 && (
                <div className="mt-10">
                  <h3 className="font-display text-xl text-ink mb-3"><T k="destino.cidadesBases" fallback="Cidades & bases" /></h3>
                  <GaleriaLugares lugares={cidadesData} layout="cidade" />
                </div>
              )}
            </section>
          )}

          <section id="fazer" className="scroll-mt-32 space-y-8">
            <OQueFazer itens={atracoesPrecosDoPais(d.code)} v2={dadosV2DoPais(d.code)} cidadePrincipal={d.cidadePrincipal} />
            <PasseiosIngressos itens={atracoesPagasDoPais(d.code)} nomePais={d.nome} />
            {comidas.length > 0 && (
              <div>
                <div className="flex items-end justify-between gap-2 mb-3">
                  <h2 className={H2}>Comidas obrigatórias</h2>
                  <span className="font-mono text-xs text-inksoft">{comidas.length} pra provar</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {comidas.map((c, i) => (
                    <span key={i} className={`inline-flex items-center gap-1.5 text-sm rounded-md px-3 py-1.5 border ${c.tipo === 'doce' ? 'bg-ochre/10 border-ochre/30' : c.tipo === 'bebida' ? 'bg-pine/8 border-pine/25' : 'bg-card border-line'} text-ink`}>
                      <Icon emoji={COMIDA_ICON[c.tipo] || '🍽️'} size={15} className="text-inksoft" />{c.nome}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </section>

          <section id="logistica" className="scroll-mt-32 space-y-8">
            <ComoSeLocomove precos={precosDoPais(d.code)} />
            <QuandoVisivel altura="h-[480px]" rotulo="Mapa"><MapaPais nome={d.nome} centro={d.coords} {...pontosDoPais(d)} /></QuandoVisivel>
          </section>

          <section id="antes" className="scroll-mt-32 space-y-6">
            <OQueNinguemConta dicas={dicasOQueNinguemConta(d)} />
            {(() => {
              const dicas = dicasDe(d.code);
              const secoes = SECOES_DICAS.filter((x) => (dicas[x.id] || []).length > 0);
              if (secoes.length === 0) return null;
              return (
                <div>
                  <h2 className={`${H2} mb-4`}>Antes de ir</h2>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {secoes.map((x) => (
                      <div key={x.id} className="rounded-xl border border-line bg-card p-4">
                        <h3 className="font-semibold text-ink flex items-center gap-2"><Icon emoji={x.icon} size={17} className="text-pine" /> {x.label}</h3>
                        <ul className="mt-2 space-y-1.5 text-sm text-inksoft">
                          {dicas[x.id].map((t, i) => <li key={i} className="flex gap-2"><span className="text-pine shrink-0" aria-hidden>—</span>{t}</li>)}
                        </ul>
                      </div>
                    ))}
                  </div>
                  <p className="mt-2 text-xs text-inksoft">Dicas de referência por região — confira visto, vacinas e alertas atuais na fonte oficial (Itamaraty, embaixada, Anvisa).</p>
                </div>
              );
            })()}
          </section>

          <section id="reservar" className="scroll-mt-32">
            <div className="eyebrow mb-2">Parceiros · você sai do Mundo Sem Fim</div>
            <h2 className={`${H2} mb-4`}>Onde ficar & reservar</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {linksDestino(d.cidadePrincipal || d.nome, d.nome).map((l) => (
                <a key={l.id} href={l.url} target="_blank" rel="noopener noreferrer sponsored"
                  className="rounded-xl border border-line bg-card p-3.5 hover:border-pine/50 hover:shadow-e1 transition focusring flex items-center gap-3">
                  <span className="w-9 h-9 rounded-md bg-paper2 text-pine grid place-items-center shrink-0"><Icon emoji={l.icon} size={18} /></span>
                  <span className="min-w-0">
                    <span className="flex items-center gap-1 text-sm font-semibold text-ink">{l.label} <Icon name="external" size={13} className="text-inksoft" /></span>
                    <span className="block text-[11px] text-inksoft truncate">{l.desc}</span>
                  </span>
                </a>
              ))}
            </div>
            <p className="mt-2 text-xs text-inksoft">Modo <span className="font-mono">DEEPLINK</span>: os links abrem a busca no parceiro; preço, disponibilidade, pagamento e suporte são do parceiro. Podemos receber comissão — ela nunca muda a recomendação.</p>
          </section>

          <section className="rounded-2xl border border-line bg-card p-5">
            <ShareButtons
              url={`${base}/destino/${d.slug}`}
              titulo={`${d.nome} — guia de viagem`}
              texto={`Olha ${d.nome} no Mundo Sem Fim: melhor época, custo real e o que fazer.`}
            />
          </section>
        </div>

        {/* FICHA TÉCNICA — cada dado com fonte e frescor */}
        <aside className="lg:sticky lg:top-32 self-start space-y-4">
          <div className="rounded-2xl border border-line bg-card overflow-hidden">
            <div className="px-5 pt-5 pb-3 flex items-center justify-between">
              <span className="eyebrow">Ficha técnica</span>
              <span className="font-mono text-[11px] text-inksoft">{d.code}</span>
            </div>
            <dl className="divide-y divide-line">
              {ficha.map((f) => (
                <div key={f.k} className="px-5 py-3">
                  <dt className="text-xs text-inksoft flex items-center justify-between gap-2">{f.k}<SourceTrust freshness={f.fr} fonte={f.fonte} data={f.data} compacto /></dt>
                  <dd className="mt-1 text-[15px] font-medium text-ink">{f.v}</dd>
                  {f.nota && <dd className="mt-1 text-xs text-inksoft leading-snug">{f.nota}</dd>}
                </div>
              ))}
            </dl>
            <div className="p-4 border-t border-line bg-paper2/50 flex flex-col gap-2">
              <AddToRouteButton code={d.code} nome={d.nome} className={btnLima}><Icon name="plus" size={18} /> Adicionar à rota</AddToRouteButton>
              <Link href={`/comparar?d=${d.slug}`} className={btnGhost}><Icon name="scale" size={17} /> Comparar com outro destino</Link>
            </div>
          </div>
          <p className="text-[11px] text-inksoft leading-relaxed px-1">
            <strong className="text-ink">Histórico</strong> = pesquisa de referência (jun/2026), não cotação. Antes de comprar, confira preço,
            visto e saúde na fonte oficial.
          </p>
        </aside>
      </div>
    </main>
  );
}
