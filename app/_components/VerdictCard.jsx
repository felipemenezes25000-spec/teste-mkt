import { vereditoDestino } from '../_lib/editorial.js';

export function VerdictCard({ destino }) {
  const veredito = vereditoDestino(destino);
  return (
    <section className="rounded-3xl border border-line bg-gradient-to-br from-card to-paper2/70 p-5 sm:p-6 shadow-[var(--e-1)]">
      <div className="flex flex-col lg:flex-row gap-5">
        <div className="lg:w-[42%]">
          <p className="text-xs uppercase tracking-[0.18em] text-pine font-bold">Veredito humano</p>
          <h2 className="mt-1 font-display text-2xl sm:text-3xl text-ink">{veredito.titulo}</h2>
          <p className="mt-3 text-inksoft leading-relaxed">{veredito.texto}</p>
          <div className="mt-4 rounded-2xl border border-ochre/35 bg-ochre/10 p-3">
            <p className="text-xs uppercase tracking-wide text-warn font-bold">Cilada ou oportunidade?</p>
            <p className="mt-1 text-sm text-ink">{veredito.oportunidade}</p>
          </div>
        </div>
        <div className="grid sm:grid-cols-2 gap-3 flex-1">
          <div className="rounded-2xl border border-success-bd bg-success-bg p-4">
            <h3 className="font-display text-lg text-success">Eu iria se...</h3>
            <ul className="mt-2 space-y-2 text-sm text-ink">
              {veredito.combina.map((item) => (
                <li key={item} className="flex gap-2"><span className="text-success shrink-0" aria-hidden>✓</span>{item}</li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl border border-warn-bd bg-warn-bg p-4">
            <h3 className="font-display text-lg text-warn">Eu evitaria se...</h3>
            <ul className="mt-2 space-y-2 text-sm text-ink">
              {veredito.naoCombina.map((item) => (
                <li key={item} className="flex gap-2"><span className="text-warn shrink-0" aria-hidden>!</span>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
