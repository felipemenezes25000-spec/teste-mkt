import { Icon } from './Icon.jsx';
// Abas acessíveis (role=tablist/tab) com navegação por seta. tabs: [{id,label,icon}].
export function Tabs({ tabs, value, onChange, className = '' }) {
  function onKey(e, i) {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
    e.preventDefault();
    const n = tabs.length;
    const ni = e.key === 'ArrowRight' ? (i + 1) % n : (i - 1 + n) % n;
    onChange(tabs[ni].id);
    const botoes = e.currentTarget.parentElement.querySelectorAll('[role="tab"]');
    if (botoes[ni]) botoes[ni].focus();
  }
  return (
    <div role="tablist" aria-label="Seções da viagem" className={`flex flex-wrap gap-1 p-1 rounded-xl bg-paper2/70 border border-line w-fit ${className}`}>
      {tabs.map((t, i) => {
        const on = t.id === value;
        return (
          <button key={t.id} role="tab" aria-selected={on} tabIndex={on ? 0 : -1}
            onClick={() => onChange(t.id)} onKeyDown={(e) => onKey(e, i)}
            className={`px-3.5 py-1.5 rounded-lg text-sm font-semibold transition focusring ${on ? 'bg-card text-pine shadow-sm' : 'text-inksoft hover:text-ink'}`}>
            <span aria-hidden><Icon emoji={t.icon} /></span> {t.label}
          </button>
        );
      })}
    </div>
  );
}
