import { DEPOIMENTOS } from '../_lib/depoimentos.js';
import { DESTINOS } from '../_lib/destinos.js';

// Prova social HONESTA: sinais de confiança VERIFICÁVEIS (sempre visíveis) + uma grade
// de depoimentos que só aparece quando _lib/depoimentos.js tiver entradas REAIS (não
// placeholder). Nada fabricado. O JSON-LD de Review/AggregateRating fica gated no
// page.jsx (só sai com depoimentos reais).

const PILARES = [
  { icon: '🤝', titulo: 'Conselho neutro', txt: 'Não vendemos a reserva — então não temos motivo pra te empurrar a opção errada. A recomendação é pelo SEU perfil.' },
  { icon: '🧾', titulo: 'Custo real, não vitrine', txt: 'Somamos o que a OTA esconde: seguro, eSIM, visto e contingência. Você sabe o número de verdade antes de ir.' },
  { icon: '🌍', titulo: 'O mundo todo, com fonte', txt: `${DESTINOS.length} países e 2.000+ pontos turísticos, com dados e fotos de Wikipédia/Wikidata — autoria e licença na origem, não achismo de blog.` },
];

const STATS = [
  { n: String(DESTINOS.length), l: 'países' },
  { n: '2.000+', l: 'pontos turísticos' },
  { n: '100+', l: 'moedas' },
  { n: 'Grátis', l: 'pra começar, sem cartão' },
];

function Depoimentos() {
  const reais = DEPOIMENTOS.filter((d) => d && !d.placeholder && d.texto);
  if (!reais.length) return null;
  return (
    <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {reais.map((d, i) => (
        <figure key={i} className="rounded-2xl border border-line bg-card p-5">
          {d.nota ? (
            <div className="text-amberx text-sm" aria-label={`Nota ${d.nota} de 5`}>{'★'.repeat(Math.round(d.nota))}</div>
          ) : null}
          <blockquote className="mt-2 text-ink leading-relaxed">“{d.texto}”</blockquote>
          <figcaption className="mt-3 text-sm text-inksoft font-semibold">
            {d.autor}{d.local ? <span className="font-normal"> · {d.local}</span> : null}
          </figcaption>
        </figure>
      ))}
    </div>
  );
}

export function ProvaSocial() {
  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
      <h2 className="font-display text-2xl sm:text-3xl text-ink text-center max-w-2xl mx-auto">
        Por que confiar na gente
      </h2>
      <p className="mt-2 text-center text-inksoft max-w-xl mx-auto text-sm">
        Sem conflito de interesse, com dados rastreáveis — o básico que um copiloto de viagem devia ter.
      </p>

      <div className="mt-7 grid grid-cols-1 sm:grid-cols-3 gap-4">
        {PILARES.map((p) => (
          <div key={p.titulo} className="rounded-2xl border border-line bg-card p-5">
            <div className="text-3xl" aria-hidden>{p.icon}</div>
            <h3 className="mt-2 font-display text-lg text-ink">{p.titulo}</h3>
            <p className="mt-1 text-sm text-inksoft">{p.txt}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 flex flex-wrap justify-center gap-x-8 gap-y-3 rounded-2xl border border-line bg-paper2 px-6 py-5">
        {STATS.map((s) => (
          <div key={s.l} className="text-center">
            <div className="font-display text-2xl text-pine">{s.n}</div>
            <div className="text-xs text-inksoft">{s.l}</div>
          </div>
        ))}
      </div>

      <Depoimentos />
    </section>
  );
}
