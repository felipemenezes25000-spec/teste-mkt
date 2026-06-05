import { mundoScoreDestino } from '../_lib/editorial.js';

const SUBNOTAS = [
  ['custoReal', 'Custo real'],
  ['seguranca', 'Segurança'],
  ['experiencia', 'Experiência'],
  ['facilidade', 'Facilidade'],
  ['cansacoLogistico', 'Cansaço'],
];

function corNota(nota) {
  if (nota >= 78) return 'bg-success';
  if (nota >= 62) return 'bg-warn';
  return 'bg-danger';
}

export function TravelFitScore({ destino, compact = false }) {
  const score = mundoScoreDestino(destino);
  if (compact) {
    return (
      <div className="inline-flex items-center gap-2 rounded-full bg-card/95 border border-white/30 px-2.5 py-1 shadow-sm">
        <span className="text-[10px] uppercase tracking-wide text-inksoft font-bold">Mundo Score</span>
        <span className="font-display text-lg text-pine tnum leading-none">{score.total}</span>
      </div>
    );
  }

  return (
    <section className="rounded-3xl border border-line bg-card p-5 shadow-[var(--e-1)]" aria-label={`Mundo Score de ${destino.nome}`}>
      <div className="flex items-start gap-4">
        <div className="w-24 h-24 rounded-3xl bg-pine text-white grid place-items-center shrink-0 shadow-md">
          <div className="text-center">
            <div className="font-display text-4xl leading-none tnum">{score.total}</div>
            <div className="text-[10px] uppercase tracking-widest opacity-80">/100</div>
          </div>
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-pine font-bold">Mundo Score</p>
          <h3 className="font-display text-2xl text-ink mt-1">Vale a pena para você?</h3>
          <p className="mt-1 text-sm text-inksoft">
            Leitura editorial por custo real, segurança, experiência, facilidade e cansaço logístico. Chance de arrependimento: <strong className="text-ink">{score.chanceArrependimento}</strong>.
          </p>
        </div>
      </div>
      <div className="mt-5 grid sm:grid-cols-5 gap-3">
        {SUBNOTAS.map(([key, label]) => {
          const nota = score.subnotas[key];
          return (
            <div key={key} className="rounded-2xl bg-paper2/70 p-3">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs text-inksoft font-semibold">{label}</span>
                <span className="text-xs tnum text-ink font-bold">{nota}</span>
              </div>
              <div className="mt-2 h-1.5 rounded-full bg-card overflow-hidden">
                <div className={`h-full rounded-full ${corNota(nota)}`} style={{ width: `${nota}%` }} />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
