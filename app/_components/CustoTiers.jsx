import { custoPorDia, TIERS_LABEL } from '../_lib/custos.js';

// Mostra os 3 níveis de custo/dia (mochila/médio/conforto) com quebra por categoria
// e o total pra X dias. Server-safe (puro).
export function CustoTiers({ custoDia, dias = 7 }) {
  const niveis = custoPorDia(custoDia);
  const ordem = ['mochila', 'medio', 'conforto'];
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
      {ordem.map((tier) => {
        const n = niveis[tier];
        return (
          <div key={tier} className={`rounded-2xl border bg-card p-4 ${tier === 'medio' ? 'border-pine ring-1 ring-pine/15' : 'border-line'}`}>
            <div className="flex items-baseline justify-between">
              <span className="font-display text-lg text-ink">{TIERS_LABEL[tier]}</span>
              <span className="text-xs text-inksoft">por dia</span>
            </div>
            <div className="font-display text-3xl text-ink mt-0.5 tnum">US$ {n.total}</div>
            <div className="text-xs text-inksoft tnum">~US$ {(n.total * dias).toLocaleString('pt-BR')} em {dias} dias</div>
            <ul className="mt-3 space-y-1.5 text-xs text-inksoft">
              {n.categorias.map((c) => (
                <li key={c.id} className="flex items-center justify-between gap-2">
                  <span>{c.icon} {c.label}</span>
                  <span className="tnum text-ink">US$ {c.valor}</span>
                </li>
              ))}
            </ul>
          </div>
        );
      })}
    </div>
  );
}
