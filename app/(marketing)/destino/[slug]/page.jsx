import Link from 'next/link';
import { notFound } from 'next/navigation';
import { DESTINOS, destinoPorSlug } from '../../../_lib/destinos.js';
import { resumoWiki, imagemWiki, imagensDe, creditoImagem } from '../../../_lib/wiki.js';
import { atracoesDe } from '../../../_lib/places.js';
import { MESES_PT } from '../../../_engine/data.js';
import { FavoriteButton } from '../../../_components/FavoriteButton.jsx';
import { AddToRouteButton } from '../../../_components/AddToRouteButton.jsx';
import { linksDestino } from '../../../_lib/links.js';
import { CustoTiers } from '../../../_components/CustoTiers.jsx';
import { CustoVitrineVsReal } from '../../../_components/CustoVitrineVsReal.jsx';
import { calcExemploDestino, resumoVitrineVsReal } from '../../../_engine/custoTotal.js';
import { dicasDe, SECOES_DICAS } from '../../../_engine/dicas.js';
import { atracoesDoPais } from '../../../_engine/atracoes.js';
import { comidasDoPais, COMIDA_ICON } from '../../../_engine/comidas.js';
import { cidadeWiki } from '../../../_lib/cidadeWiki.js';
import { GaleriaLugares } from './GaleriaLugares.jsx';
import { wikiThumb } from '../../../_lib/wikiThumb.js';
import { JsonLd } from '../../../_components/JsonLd.jsx';
import { jsonLdDestino, jsonLdBreadcrumb, siteUrl } from '../../../_lib/seo.js';
import { ShareButtons } from '../../../_components/ShareButtons.jsx';

export const revalidate = 86400;
// Pré-renderiza os destaques no build; o restante (catálogo mundial) renderiza
// sob demanda (ISR) e fica cacheado — build rápido mesmo com 150+ países.
export const dynamicParams = true;

export function generateStaticParams() {
  const destaques = DESTINOS.filter((d) => d.destaque);
  return (destaques.length ? destaques : DESTINOS.slice(0, 12)).map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({ params }) {
  const d = destinoPorSlug(params.slug);
  if (!d) return {};
  const titulo = `${d.nome} — guia de viagem | Mundo Sem Fim`;
  const desc = `Melhor época, custo médio, pontos turísticos e comida típica de ${d.nome}.`;
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

// Mapa real (OpenStreetMap embed, sem chave/custo) centrado no país, com marcador.
function MapaDestino({ coords, nome }) {
  if (!Array.isArray(coords) || coords.length !== 2) return null;
  const [lng, lat] = coords;
  const dx = 6, dy = 4; // span do bbox em graus (cidade/região)
  const bbox = `${lng - dx}%2C${lat - dy}%2C${lng + dx}%2C${lat + dy}`;
  const src = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat}%2C${lng}`;
  return (
    <section>
      <h2 className="font-display text-2xl text-ink mb-3">🗺️ Onde fica {nome}</h2>
      <div className="rounded-2xl overflow-hidden border border-line bg-paper2">
        <iframe src={src} title={`Mapa de ${nome}`} loading="lazy" className="w-full h-72 sm:h-80 border-0" />
      </div>
      <a href={`https://www.openstreetmap.org/?mlat=${lat}&mlon=${lng}#map=6/${lat}/${lng}`} target="_blank" rel="noopener noreferrer" className="inline-block mt-1 text-xs text-pine hover:underline focusring">Abrir mapa maior ↗</a>
    </section>
  );
}

export default async function DestinoPage({ params }) {
  const d = destinoPorSlug(params.slug);
  if (!d) notFound();
  const base = siteUrl();

  const pontos = atracoesDoPais(d.code);
  const cidadesLista = (d.cidades || []).slice(0, 4);
  const [wiki, atracoes, pontosImgs, cidadeImgs] = await Promise.all([
    resumoWiki(d.fotoQuery || d.nome),
    atracoesDe(d.wikidataId, { limite: 8 }),
    Promise.all(pontos.map((a) => imagemWiki(a.wiki || a.nome))),
    Promise.all(cidadesLista.map((c) => imagemWiki(cidadeWiki(d.code, c)))),
  ]);
  // Herói: thumbnail do resumo OU 1ª foto da media-list (mata o placeholder).
  const heroImg = wiki?.img || (await imagensDe(d.fotoQuery || d.nome, { n: 1 }))[0] || null;
  const credito = heroImg ? await creditoImagem(heroImg) : null;

  // Galeria de pontos turísticos: prioriza a lista CURADA (foto buscada por atração),
  // com fallback pro Wikidata. Garante cobertura em todos os 167 países.
  const galeria = pontos.length
    ? pontos.map((a, i) => ({ nome: a.nome, sub: a.cidade, img: wikiThumb(pontosImgs[i], 480), wiki: a.wiki || a.nome, maps: mapsUrl(`${a.nome}, ${d.nome}`) }))
    : (atracoes || []).map((a) => ({ nome: a.nome, sub: a.descricao, img: wikiThumb(a.img, 480), wiki: a.nome, maps: mapsUrl(`${a.nome}, ${d.nome}`) }));

  // Cidades & bases: mesma estrutura da galeria pra abrir o mesmo modal (decisão do
  // usuário: cidades também abrem história). wiki via override (foto + história certas).
  const cidadesData = cidadesLista.map((c, i) => ({
    nome: c,
    sub: d.nome,
    img: wikiThumb(cidadeImgs[i], 480),
    wiki: cidadeWiki(d.code, c),
    maps: mapsUrl(`${c}, ${d.nome}`),
  }));

  // Comidas: lista curada (com tipo: salgado/doce/bebida) ou fallback dos dados base.
  const comidas = comidasDoPais(d.code).length
    ? comidasDoPais(d.code)
    : (d.comidas || []).map((f) => ({ nome: f, tipo: 'salgado' }));

  const meses = (d.melhoresMeses || []).map((m) => MESES_PT[m - 1]).join(' · ') || '—';
  const fatos = [
    { k: 'Região', v: d.regiao },
    { k: 'Moeda local', v: d.moeda },
    { k: 'Custo médio', v: `~US$ ${d.custoDia}/dia` },
    { k: 'Melhor época', v: meses },
  ];

  const btnPrimary = 'inline-flex items-center justify-center gap-2 rounded-xl bg-pine text-white font-semibold px-4 py-2.5 hover:bg-pinedk transition focusring shrink-0';
  const btnGhost = 'inline-flex items-center justify-center gap-2 rounded-xl border border-line bg-card text-ink font-semibold px-4 py-2.5 hover:text-pine transition focusring shrink-0';

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
      {/* HERO */}
      <section className="relative h-[42vh] min-h-[260px] max-h-[440px] overflow-hidden bg-paper2">
        {heroImg ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={wikiThumb(heroImg, 1280)} alt={d.nome} width="1280" height="538" fetchPriority="high"
            className="w-full h-full object-cover bg-cover bg-center"
            style={{ backgroundImage: `url("${wikiThumb(heroImg, 32)}")` }}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-pine/20 to-ochre/20" aria-hidden />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/10 to-transparent" />
        <FavoriteButton code={d.code} nome={d.nome} className="absolute top-3 right-3 z-20 w-10 h-10 text-lg" />
        <div className="absolute bottom-0 left-0 right-0">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 pb-5">
            <Link href="/explorar" className="text-white/85 hover:text-white text-sm focusring">← Explorar</Link>
            <h1 className="font-display text-4xl sm:text-5xl text-white drop-shadow mt-1">{d.nome}</h1>
            <p className="text-white/85 text-sm">{d.estacao}</p>
          </div>
        </div>
        {(credito?.fileUrl || wiki?.url) && (
          <a
            href={credito?.fileUrl || wiki.url} target="_blank" rel="noopener noreferrer"
            className="absolute top-3 left-3 z-20 text-[11px] bg-ink/55 text-white px-2 py-0.5 rounded focusring max-w-[70%] truncate"
            title="Fonte e licença da imagem"
          >
            Foto: {credito?.autor ? credito.autor : 'Wikimedia'}{credito?.licenca ? ` · ${credito.licenca}` : ''} ↗
          </a>
        )}
      </section>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        {/* FATOS */}
        <section className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {fatos.map((f) => (
            <div key={f.k} className="rounded-xl border border-line bg-card p-3">
              <div className="text-[11px] uppercase tracking-wide text-inksoft">{f.k}</div>
              <div className="font-display text-lg text-ink mt-0.5">{f.v}</div>
            </div>
          ))}
        </section>

        {/* CUSTOS por nível */}
        <section>
          <div className="flex items-baseline justify-between gap-2 mb-3">
            <h2 className="font-display text-2xl text-ink">💰 Quanto custa por dia</h2>
            <span className="text-xs text-inksoft">estimativa · do mochilão ao conforto</span>
          </div>
          <CustoTiers custoDia={d.custoDia} dias={7} />
        </section>

        {/* CUSTO HONESTO — vitrine vs real (exemplo de 7 dias) */}
        <section>
          <CustoVitrineVsReal
            resumo={resumoVitrineVsReal(calcExemploDestino(d, 7))}
            contexto={`Exemplo de 7 dias em ${d.nome} (com voo do Brasil) — o custo real além do que as OTAs mostram:`}
          />
        </section>

        {/* SOBRE */}
        {wiki?.extrato && (
          <section>
            <h2 className="font-display text-2xl text-ink mb-2">Sobre {d.nome}</h2>
            <p className="text-inksoft leading-relaxed">{wiki.extrato}</p>
            {wiki.url && <a href={wiki.url} target="_blank" rel="noopener noreferrer" className="inline-block mt-1 text-sm text-pine hover:underline focusring">Ler na Wikipédia ↗</a>}
          </section>
        )}

        {/* PONTOS TURÍSTICOS — galeria curada (uma foto por atração, todos os 167) */}
        {galeria.length > 0 && (
          <section>
            <div className="flex items-baseline justify-between gap-2 mb-3">
              <h2 className="font-display text-2xl text-ink">📸 Pontos turísticos</h2>
              <span className="text-xs text-inksoft">{galeria.length} lugares</span>
            </div>
            <GaleriaLugares lugares={galeria} layout="ponto" />
            <p className="mt-2 text-[11px] text-inksoft">Fotos: Wikipédia/Wikimedia Commons. Toque na foto para ver a história e abrir no mapa.</p>
          </section>
        )}

        {/* CIDADES */}
        {cidadesData.length > 0 && (
          <section>
            <h2 className="font-display text-2xl text-ink mb-3">Cidades & bases</h2>
            <GaleriaLugares lugares={cidadesData} layout="cidade" />
          </section>
        )}

        {/* COMIDA — comidas obrigatórias com tipo (salgado/doce/bebida/lanche) */}
        {comidas.length > 0 && (
          <section>
            <div className="flex items-baseline justify-between gap-2 mb-2">
              <h2 className="font-display text-2xl text-ink">🍽️ Comidas obrigatórias</h2>
              <span className="text-xs text-inksoft">{comidas.length} pra provar</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {comidas.map((c, i) => (
                <span
                  key={i}
                  className={`text-sm rounded-full px-3 py-1.5 border ${c.tipo === 'doce' ? 'bg-clay/10 border-clay/30' : c.tipo === 'bebida' ? 'bg-pine/8 border-pine/25' : 'bg-card border-line'} text-ink`}
                >
                  <span aria-hidden className="mr-1">{COMIDA_ICON[c.tipo] || '🍽️'}</span>{c.nome}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* ONDE FICA — mapa real */}
        <MapaDestino coords={d.coords} nome={d.nome} />

        {/* ANTES DE IR — dicas práticas (segurança/golpes/saúde/transporte/chip) */}
        {(() => {
          const dicas = dicasDe(d.code);
          const secoes = SECOES_DICAS.filter((s) => (dicas[s.id] || []).length > 0);
          if (secoes.length === 0) return null;
          return (
            <section>
              <h2 className="font-display text-2xl text-ink mb-3">✈️ Antes de ir</h2>
              <div className="grid sm:grid-cols-2 gap-3">
                {secoes.map((s) => (
                  <div key={s.id} className="rounded-2xl border border-line bg-card p-4">
                    <h3 className="font-semibold text-ink flex items-center gap-2"><span aria-hidden>{s.icon}</span> {s.label}</h3>
                    <ul className="mt-2 space-y-1.5 text-sm text-inksoft">
                      {dicas[s.id].map((t, i) => <li key={i} className="flex gap-2"><span className="text-pine shrink-0" aria-hidden>•</span>{t}</li>)}
                    </ul>
                  </div>
                ))}
              </div>
              <p className="mt-2 text-[11px] text-inksoft">Dicas de referência por região — confira visto, vacinas e alertas atuais na fonte oficial (Itamaraty/embaixada/Anvisa).</p>
            </section>
          );
        })()}

        {/* RESERVAR (deep-links reais) */}
        <section>
          <h2 className="font-display text-2xl text-ink mb-3">🏨 Onde ficar & reservar</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {linksDestino(d.cidadePrincipal || d.nome, d.nome).map((l) => (
              <a key={l.id} href={l.url} target="_blank" rel="noopener noreferrer"
                className="rounded-xl border border-line bg-card p-3 hover:border-pine/50 hover:shadow-[var(--e-1)] transition focusring flex items-center gap-2.5">
                <span className="text-xl shrink-0" aria-hidden>{l.icon}</span>
                <span className="min-w-0">
                  <span className="block text-sm font-semibold text-ink">{l.label} ↗</span>
                  <span className="block text-[11px] text-inksoft truncate">{l.desc}</span>
                </span>
              </a>
            ))}
          </div>
          <p className="mt-2 text-[11px] text-inksoft">Links abrem a busca no parceiro. Preços e disponibilidade no site de cada um.</p>
        </section>

        {/* CTA */}
        <section className="rounded-2xl border border-line bg-gradient-to-br from-pine/5 to-ochre/5 p-6 flex flex-col sm:flex-row sm:items-center gap-3">
          <div className="mr-auto">
            <h3 className="font-display text-xl text-ink">Pronto pra colocar {d.nome} na rota?</h3>
            <p className="text-sm text-inksoft">Adicione à sua rota (já vem com custo, estação e visto) ou gere um roteiro dia a dia com IA.</p>
          </div>
          <AddToRouteButton code={d.code} nome={d.nome} className={btnPrimary}>🗺️ Adicionar à rota</AddToRouteButton>
          <Link href={`/roteiro?destino=${d.slug}`} className={btnGhost}>✨ Gerar roteiro</Link>
        </section>

        {/* COMPARTILHAR — cada destino é público e tem OG próprio (card bonito no link) */}
        <section className="rounded-2xl border border-line bg-card p-5">
          <ShareButtons
            url={`${base}/destino/${d.slug}`}
            titulo={`${d.nome} — guia de viagem`}
            texto={`Olha ${d.nome} no Mundo Sem Fim: melhor época, custo real e o que fazer.`}
          />
        </section>

        <p className="text-xs text-inksoft border-t border-line pt-4">
          Custos e melhor época são estimativas (perfil econômico) — confira na fonte oficial. Conteúdo e fotos: Wikipédia/Wikidata/Wikimedia Commons, com autoria e licença na origem.
        </p>
      </div>
    </main>
  );
}
