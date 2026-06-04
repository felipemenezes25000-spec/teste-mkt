import Link from 'next/link';
import { notFound } from 'next/navigation';
import { DESTINOS, destinoPorSlug } from '../../../_lib/destinos.js';
import { resumoWiki, imagemWiki, creditoImagem } from '../../../_lib/wiki.js';
import { atracoesDe } from '../../../_lib/places.js';
import { MESES_PT } from '../../../_engine/data.js';
import { FavoriteButton } from '../../../_components/FavoriteButton.jsx';
import { AddToRouteButton } from '../../../_components/AddToRouteButton.jsx';
import { linksDestino } from '../../../_lib/links.js';
import { CustoTiers } from '../../../_components/CustoTiers.jsx';
import { CustoVitrineVsReal } from '../../../_components/CustoVitrineVsReal.jsx';
import { calcExemploDestino, resumoVitrineVsReal } from '../../../_engine/custoTotal.js';
import { dicasDe, SECOES_DICAS } from '../../../_engine/dicas.js';

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
  return {
    title: `${d.nome} — guia de viagem | Mundo Sem Fim`,
    description: `Melhor época, custo médio, pontos turísticos e comida típica de ${d.nome}.`,
  };
}

function mapsUrl(q) {
  return 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(q);
}

export default async function DestinoPage({ params }) {
  const d = destinoPorSlug(params.slug);
  if (!d) notFound();

  const [wiki, atracoes, ...cidadeImgs] = await Promise.all([
    resumoWiki(d.fotoQuery || d.nome),
    atracoesDe(d.wikidataId, { limite: 8 }),
    ...(d.cidades || []).slice(0, 4).map((c) => imagemWiki(c)),
  ]);
  const credito = wiki?.img ? await creditoImagem(wiki.img) : null;

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
      {/* HERO */}
      <section className="relative h-[42vh] min-h-[260px] max-h-[440px] overflow-hidden bg-paper2">
        {wiki?.img ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={wiki.img} alt={d.nome} className="w-full h-full object-cover" />
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

        {/* PONTOS TURÍSTICOS (Wikidata) */}
        {atracoes.length > 0 && (
          <section>
            <h2 className="font-display text-2xl text-ink mb-3">Pontos turísticos</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {atracoes.map((a) => (
                <a
                  key={a.nome} href={mapsUrl(`${a.nome}, ${d.nome}`)} target="_blank" rel="noopener noreferrer"
                  className="group rounded-xl overflow-hidden border border-line bg-card hover:border-pine/50 hover:shadow-[var(--e-1)] transition focusring"
                >
                  <div className="h-28 bg-paper2 overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={a.img} alt={a.nome} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                  </div>
                  <div className="p-2.5">
                    <div className="text-sm font-semibold text-ink line-clamp-1">{a.nome}</div>
                    {a.descricao && <div className="text-[11px] text-inksoft line-clamp-2 mt-0.5">{a.descricao}</div>}
                  </div>
                </a>
              ))}
            </div>
            <p className="mt-2 text-[11px] text-inksoft">Fonte: Wikidata/Wikimedia. Toque para abrir no Google Maps.</p>
          </section>
        )}

        {/* CIDADES */}
        {(d.cidades || []).length > 0 && (
          <section>
            <h2 className="font-display text-2xl text-ink mb-3">Cidades & bases</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {d.cidades.slice(0, 4).map((c, i) => (
                <a key={c} href={mapsUrl(`${c}, ${d.nome}`)} target="_blank" rel="noopener noreferrer" className="group rounded-xl overflow-hidden border border-line bg-card hover:border-pine/50 focusring">
                  <div className="h-24 bg-paper2 overflow-hidden">
                    {cidadeImgs[i] ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={cidadeImgs[i]} alt={c} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition" />
                    ) : (
                      <div className="w-full h-full grid place-items-center text-2xl" aria-hidden>📍</div>
                    )}
                  </div>
                  <div className="px-2.5 py-1.5 text-sm text-ink flex items-center justify-between">{c} <span className="text-pine">↗</span></div>
                </a>
              ))}
            </div>
          </section>
        )}

        {/* COMIDA */}
        {(d.comidas || []).length > 0 && (
          <section>
            <h2 className="font-display text-2xl text-ink mb-2">🍽️ Comida típica</h2>
            <div className="flex flex-wrap gap-2">
              {d.comidas.map((f) => <span key={f} className="text-sm bg-card border border-line rounded-full px-3 py-1.5 text-ink">{f}</span>)}
            </div>
          </section>
        )}

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

        <p className="text-xs text-inksoft border-t border-line pt-4">
          Custos e melhor época são estimativas (perfil econômico) — confira na fonte oficial. Conteúdo e fotos: Wikipédia/Wikidata/Wikimedia Commons, com autoria e licença na origem.
        </p>
      </div>
    </main>
  );
}
