'use client';
import { Icon } from '../_ui/Icon.jsx';
import { useState, useMemo, useRef, useEffect, useId } from 'react';

// Combobox acessível e reutilizável: digite pra filtrar, ↑↓ navega, Enter seleciona,
// Esc/clique-fora fecham. Molde do GlobalSearch, generalizado para substituir <select>
// gigante (ex.: 167 destinos) por busca. `value` = item selecionado; `onChange(item)`
// dispara ao escolher. `toText` rotula; `toRight` (opcional) é o detalhe à direita.
export function Autocomplete({
  items = [], value, onChange,
  toText, toKey, toRight, toSearch,
  label, placeholder = 'Buscar…', icon = '🔍', className = '',
}) {
  const text = value ? toText(value) : '';
  const [q, setQ] = useState('');
  const [editing, setEditing] = useState(false);
  const [open, setOpen] = useState(false);
  const [ativo, setAtivo] = useState(0);
  const ref = useRef(null);
  const listId = useId();

  const results = useMemo(() => {
    const t = q.trim().toLowerCase();
    if (!editing || !t) return items.slice(0, 8);
    // `toSearch` permite buscar por campos além do rótulo (ex.: país, mesmo quando
    // o rótulo mostra a cidade — "jap" precisa achar Japão exibindo "Tóquio").
    const texto = (it) => (toSearch ? toSearch(it) : `${toText(it)} ${toRight ? toRight(it) : ''}`).toLowerCase();
    return items.filter((it) => texto(it).includes(t)).slice(0, 8);
  }, [q, editing, items, toText, toRight, toSearch]);

  useEffect(() => {
    const onDoc = (e) => { if (ref.current && !ref.current.contains(e.target)) { setOpen(false); setEditing(false); } };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, []);
  useEffect(() => { setAtivo(0); }, [q]);

  function pick(it) {
    if (!it) return;
    onChange && onChange(it);
    setEditing(false); setOpen(false);
  }
  function onKey(e) {
    if (e.key === 'ArrowDown') { e.preventDefault(); setOpen(true); setAtivo((a) => Math.min(a + 1, results.length - 1)); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setAtivo((a) => Math.max(a - 1, 0)); }
    else if (e.key === 'Enter') { e.preventDefault(); pick(results[ativo]); }
    else if (e.key === 'Escape') { setOpen(false); setEditing(false); }
  }

  const field = 'w-full pl-9 pr-3 py-2 rounded-lg border border-line bg-input text-ink focusring text-sm';
  return (
    <div ref={ref} className={`relative ${className}`}>
      {label && <span className="text-xs text-inksoft font-medium block mb-1">{label}</span>}
      <span className="relative block">
      <Icon emoji={icon} size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-inksoft pointer-events-none" />
      <input
        value={editing ? q : text}
        onChange={(e) => { setQ(e.target.value); setEditing(true); setOpen(true); }}
        onFocus={() => { setEditing(true); setOpen(true); setQ(''); }}
        onKeyDown={onKey}
        placeholder={placeholder}
        aria-label={label || placeholder}
        role="combobox" aria-expanded={open && results.length > 0} aria-controls={listId} aria-autocomplete="list"
        className={field}
      />
      </span>
      {open && results.length > 0 && (
        <ul id={listId} role="listbox" className="absolute z-50 mt-1 left-0 w-full max-h-72 overflow-auto rounded-xl border border-line bg-card shadow-e2 py-1">
          {results.map((it, i) => (
            <li key={toKey ? toKey(it) : toText(it)} role="option" aria-selected={i === ativo}>
              <button
                type="button"
                onMouseEnter={() => setAtivo(i)}
                onClick={() => pick(it)}
                className={`w-full text-left px-3 py-2 flex items-center justify-between gap-2 focusring ${i === ativo ? 'bg-paper2' : 'hover:bg-paper2'}`}
              >
                <span className="text-ink text-sm font-medium truncate">{toText(it)}</span>
                {toRight && <span className="text-[11px] text-inksoft shrink-0">{toRight(it)}</span>}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
