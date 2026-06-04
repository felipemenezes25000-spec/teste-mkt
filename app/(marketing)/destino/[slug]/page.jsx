import Link from 'next/link';
import { notFound } from 'next/navigation';
import { DESTINOS, destinoPorSlug } from '../../../_lib/destinos.js';
import { resumoWiki, imagemWiki } from '../../../_lib/wiki.js';
import { MESES_PT } from '../../../_engine/data.js';

export const revalidate = 86400;

export function generateStaticParams() {
  return DESTINOS.map((d) => ({ slug: d.slug }));
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

  const [wiki, ...cidadeImgs] = await Promise.all([
    resumoWiki(d.fotoQuery || d.nome),
    ...(d.cidades || []).slice(0, 4).map((c) => imagemWiki(c)),
  ]);

  const meses = (d.melhoresMeses || []).map((m) => MESES_PT[m - 1]).join(' · ') || '—';
  const fatos = [
    { k: 'Região', v: d.regiao },
    { k: 'Moeda local', v: d.moeda },
    { k: 'Custo médio', v: `~US$ ${d.custoDia}/dia` },
    { k: 'Melhor época', v: meses },
  ];

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
        <div className="absolute bottom-0 left-0 right-0">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 pb-5">
            <Link href="/explorar" className="text-white/85 hover:text-white text-sm focusring">← Explorar</Link>
            <h1 className="font-display text-4xl sm:text-5xl text-white drop-shadow mt-1">{d.nome}</h1>
            <p className="text-white/85 text-sm">{d.estacao}</p>
          </div>
        </div>
        {wiki?.url && (
          <a href={wiki.url} target="_blank" rel="noopener noreferrer" className="absolute top-3 right-3 text-[11px] bg-ink/55 text-white px-2 py-0.5 rounded focusring">Foto: Wikipédia ↗</a>
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

        {/* SOBRE */}
        {wiki?.extrato && (
          <section>
            <h2 className="font-display text-2xl text-ink mb-2">Sobre {d.nome}</h2>
            <p className="text-inksoft leading-relaxed">{wiki.extrato}</p>
            {wiki.url && <a href={wiki.url} target="_blank" rel="noopener noreferrer" className="inline-block mt-1 text-sm text-pine hover:underline focusring">Ler na Wikipédia ↗</a>}
          </section>
        )}

        {/* CIDADES */}
        {(d.cidades || []).length > 0 && (
          <section>
            <h2 className="font-display text-2xl text-ink mb-3">Cidades & lugares</h2>
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

        {/* CTA */}
        <section className="rounded-2xl border border-line bg-gradient-to-br from-pine/5 to-ochre/5 p-6 flex flex-col sm:flex-row sm:items-center gap-3">
          <div className="mr-auto">
            <h3 className="font-display text-xl text-ink">Pronto pra colocar {d.nome} na rota?</h3>
            <p className="text-sm text-inksoft">Monte a ordem dos países ou gere um roteiro dia a dia com IA.</p>
          </div>
          <Link href="/planejar" className="inline-flex items-center justify-center gap-2 rounded-xl bg-pine text-white font-semibold px-4 py-2.5 hover:bg-pinedk transition focusring shrink-0">🗺️ Planejar rota</Link>
          <Link href="/roteiro" className="inline-flex items-center justify-center gap-2 rounded-xl border border-line bg-card text-ink font-semibold px-4 py-2.5 hover:text-pine transition focusring shrink-0">✨ Gerar roteiro</Link>
        </section>

        <p className="text-xs text-inksoft border-t border-line pt-4">
          Custos e melhor época são estimativas (perfil econômico) — confira na fonte oficial. Texto e fotos: Wikipédia/Wikimedia, com link para a origem.
        </p>
      </div>
    </main>
  );
}
