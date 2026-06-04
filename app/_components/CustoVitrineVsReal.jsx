import { fmtMoeda } from '../_engine/utils.js';

// Bloco "Custo de vitrine vs Custo real" — o gancho de conversão (gap nº 1 do
// mercado). Recebe o `resumo` de resumoVitrineVsReal(calc). Apresentacional puro:
// sem estado, server-safe, dark-aware. Não renderiza se não houver dado.
export function CustoVitrineVsReal({ resumo, contexto }) {
  if (!resumo || !resumo.real) return null;
  const { vitrine, real, escondido, categorias = [] } = resumo;
  const pct = real > 0 ? Math.round((escondido / real) * 100) : 0;

  return (
    <section className="rounded-2xl border border-line bg-card p-5" aria-label="Custo de vitrine versus custo real">
      <div className="flex items-center gap-2">
        <span aria-hidden className="text-xl">🧾</span>
        <h3 className="font-display text-lg text-ink">O que a vitrine esconde</h3>
      </div>
      <p className="mt-1 text-sm text-inksoft">
        {contexto || 'O preço que as OTAs anunciam é só a ponta. Veja o custo real da viagem inteira.'}
      </p>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <div className="rounded-xl bg-paper2 p-3">
          <p className="text-xs text-inksoft">Preço de vitrine <span className="opacity-70">(voo + hotel)</span></p>
          <p className="font-display text-2xl text-inksoft tnum line-through decoration-danger/40">{fmtMoeda(vitrine, 'USD')}</p>
        </div>
        <div className="rounded-xl bg-pine/10 border border-pine/20 p-3">
          <p className="text-xs text-pine font-semibold">Custo real da viagem</p>
          <p className="font-display text-2xl text-ink tnum">{fmtMoeda(real, 'USD')}</p>
        </div>
      </div>

      <p className="mt-3 text-sm">
        <span className="font-bold text-danger">+{fmtMoeda(escondido, 'USD')}</span>{' '}
        <span className="text-inksoft">({pct}%) que ninguém te conta — e que a gente soma item a item:</span>
      </p>

      <ul className="mt-2 grid grid-cols-2 sm:grid-cols-3 gap-1.5">
        {categorias.map((c) => (
          <li key={c.id} className="flex items-center justify-between gap-2 text-xs rounded-lg bg-paper2 px-2 py-1.5">
            <span className="text-inksoft truncate"><span aria-hidden>{c.icon}</span> {String(c.label).split('(')[0].trim()}</span>
            <span className="tnum text-ink font-semibold shrink-0">{fmtMoeda(c.valor, 'USD')}</span>
          </li>
        ))}
      </ul>

      <p className="mt-3 text-[11px] text-inksoft">
        Estimativa transparente — sem taxa escondida, porque a gente não vende a reserva. Confira valores na fonte oficial.
      </p>
    </section>
  );
}
