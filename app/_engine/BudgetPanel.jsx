import { useMemo } from 'react';
import { fmtMoeda } from './utils.js';
import { sugerirOrcamento } from './budget.js';
import { Button } from '../_ui/Button.jsx';

// MODO ORÇAMENTO (prescritivo): mostra ONDE cortar dias pra caber no teto e aplica
// os cortes num clique. Toda a lógica vem do motor puro `sugerirOrcamento(calc)`
// (testado). Componente novo e autossuficiente — usa só tokens do Design System,
// então herda o dark mode automaticamente.
const MOTIVO = {
  visto: { tag: 'fura o visto', cls: 'text-danger' },
  estacao: { tag: 'fora de época', cls: 'text-warn' },
  custo: { tag: 'alto custo/dia', cls: 'text-inksoft' },
};

export default function BudgetPanel({ calc, onAplicarCortes }) {
  const cur = calc.base;
  const r = useMemo(() => sugerirOrcamento(calc), [calc]);

  if (r.status === 'sem-orcamento') {
    return (
      <div className="mt-4 rounded-xl border border-line bg-paper2/50 p-3 text-sm text-inksoft">
        Defina um <b className="text-ink">orçamento</b> no topo pra ver onde cortar e fechar a conta.
      </div>
    );
  }

  if (r.status === 'cabe') {
    return (
      <div className="mt-4 rounded-xl border border-success-bd bg-success-bg p-3 text-sm text-success">
        ✓ Sua viagem <b>cabe no teto</b> — sobra {fmtMoeda(r.folga, cur)}. Nada a cortar; dá até pra esticar dias.
      </div>
    );
  }

  const aplicar = () => onAplicarCortes && onAplicarCortes(r.cortes);

  return (
    <div className="mt-4 rounded-2xl border border-line bg-paper2/40 p-4">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <h3 className="font-display text-xl text-ink">🎯 Onde cortar pra fechar a conta</h3>
        <span className="text-xs text-inksoft">estoura em <b className="text-danger tnum">{fmtMoeda(r.excesso, cur)}</b></span>
      </div>
      <p className="mt-1 text-sm text-inksoft">
        Cortes começando por onde <b className="text-ink">já dói</b> — quem fura visto ou está fora de época primeiro:
      </p>

      <ul className="mt-3 space-y-1.5">
        {r.cortes.map((c) => {
          const m = MOTIVO[c.motivo] || MOTIVO.custo;
          return (
            <li key={c.id} className="flex items-center justify-between gap-3 rounded-lg border border-line bg-card px-3 py-2 text-sm">
              <span className="text-ink">
                Corte <b className="tnum">{c.dias}d</b> de <b>{c.nome}</b>
                <span className={`ml-1 text-xs ${m.cls}`}>· {m.tag}</span>
              </span>
              <span className="whitespace-nowrap text-xs text-success tnum">−{fmtMoeda(c.economia, cur)}</span>
            </li>
          );
        })}
      </ul>

      {r.status === 'ok' ? (
        <div className="mt-3 flex items-center justify-between gap-3 flex-wrap">
          <span className="text-sm text-inksoft">
            Fecha em <b className="text-ink tnum">{fmtMoeda(r.novoTotal, cur)}</b> · −{r.diasCortados} dias no total
          </span>
          <Button variant="accent" size="sm" onClick={aplicar}>Aplicar cortes →</Button>
        </div>
      ) : (
        <div className="mt-3 rounded-xl border border-danger-bd bg-danger-bg p-3 text-sm text-danger">
          Mesmo cortando todo mundo ao mínimo, ainda faltam <b className="tnum">{fmtMoeda(r.faltam, cur)}</b>.
          Remova um país, suba o teto ou aumente a economia/dia.
          <div className="mt-2"><Button variant="secondary" size="sm" onClick={aplicar}>Aplicar o que dá</Button></div>
        </div>
      )}

      <p className="mt-2 text-[11px] text-inksoft">Respeita um piso de 5 dias/país e nunca remove um país — é só aplicar (e ajustar depois, se quiser).</p>
    </div>
  );
}
