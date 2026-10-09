'use client';
import { useState } from 'react';
import { dividirCusto } from '../_engine/split.js';
import { fmtMoeda } from '../_engine/utils.js';
import { Gate } from './Gate.jsx';
import { Icon } from '../_ui/Icon.jsx';

// Rateio do custo total ANTES da viagem (diferencial vs Splitwise, que só divide
// depois). Gated em 'colaboracao' (Pro). Recebe o custoTotalRealista(calc).
export function ModoGrupo({ custo }) {
  const [n, setN] = useState(2);
  if (!custo || !custo.total) return null;
  const r = dividirCusto(custo.total, n, custo.categorias);

  return (
    <Gate
      feature="colaboracao"
      titulo="Modo grupo — rateio antes da viagem"
      descricao="Divida o custo entre os viajantes ANTES de ir (não depois, como o Splitwise). Recurso Pro."
    >
      <div className="rounded-2xl border border-line bg-card p-5">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <h3 className="font-display text-lg text-ink"><Icon emoji="👥" /> Modo grupo</h3>
          <label className="text-sm text-inksoft flex items-center gap-2">
            Viajantes
            <input
              type="number" min={1} max={20} value={n}
              onChange={(e) => setN(Math.max(1, Math.min(20, Number(e.target.value) || 1)))}
              className="w-16 px-2 py-1 rounded-lg border border-line bg-input text-ink tnum focusring"
            />
          </label>
        </div>
        <div className="mt-3 rounded-xl bg-pine/10 border border-pine/20 p-3 text-center">
          <p className="text-xs text-pine font-semibold">Cada um paga</p>
          <p className="font-display text-3xl text-ink tnum">{fmtMoeda(r.porPessoa, 'USD')}</p>
          <p className="text-[11px] text-inksoft">de um total de {fmtMoeda(r.total, 'USD')} ÷ {r.n}</p>
        </div>
        <ul className="mt-3 grid grid-cols-2 sm:grid-cols-3 gap-1.5">
          {r.porCategoria.map((c) => (
            <li key={c.id} className="flex items-center justify-between gap-2 text-xs rounded-lg bg-paper2 px-2 py-1.5">
              <span className="text-inksoft truncate"><span aria-hidden><Icon emoji={c.icon} /></span> {String(c.label).split('(')[0].trim()}</span>
              <span className="tnum text-ink font-semibold shrink-0">{fmtMoeda(c.porPessoa, 'USD')}</span>
            </li>
          ))}
        </ul>
      </div>
    </Gate>
  );
}
