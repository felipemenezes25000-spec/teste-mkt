import { useMemo } from 'react';
import { gerarChecklist } from './checklist.js';
import { Icon } from '../_ui/Icon.jsx';

// Checklist de preparativos: itens derivados da rota + universais, com progresso.
// `done` é um mapa { [id]: true } persistido no App. Itens novos entram desmarcados.
export default function ChecklistView({ plan, done, onToggle }) {
  const grupos = useMemo(() => gerarChecklist(plan), [plan]);
  const todos = grupos.flatMap((g) => g.itens);
  const feitos = todos.filter((i) => done[i.id]).length;
  const pct = todos.length ? Math.round((feitos / todos.length) * 100) : 0;

  return (
    <section className="rise rounded-2xl border border-line bg-card p-4 sm:p-5" aria-label="Checklist de preparativos">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <h2 className="font-display text-2xl text-ink"><Icon emoji="📋" /> Checklist de preparativos</h2>
        <span className="text-sm text-inksoft tnum">{feitos}/{todos.length} prontos</span>
      </div>
      <div className="mt-2 h-2.5 rounded-full bg-paper2 overflow-hidden border border-line"
        role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100} aria-label="Progresso do checklist">
        <div className="h-full bg-pine gauge-fill" style={{ width: pct + '%' }} />
      </div>

      <div className="mt-4 space-y-4">
        {grupos.map((g) => (
          <div key={g.titulo}>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-inksoft mb-1.5">{g.titulo}</h3>
            <ul className="space-y-1">
              {g.itens.map((it) => (
                <li key={it.id}>
                  <label className="flex items-start gap-2.5 text-sm text-ink cursor-pointer rounded-lg hover:bg-paper2/50 px-2 py-1.5">
                    <input type="checkbox" checked={!!done[it.id]} onChange={() => onToggle(it.id)} className="mt-0.5 focusring" />
                    <span className={done[it.id] ? 'line-through text-inksoft' : ''}>{it.texto}</span>
                  </label>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <p className="mt-3 text-[11px] text-inksoft">Os itens de visto/entrada vêm da sua rota. <b className="text-ink">Vacinas e regras de fronteira mudam — confirme sempre na embaixada/consulado e nos órgãos de saúde oficiais.</b></p>
    </section>
  );
}
