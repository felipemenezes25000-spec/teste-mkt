'use client';
import { useState, useRef, useEffect, useId } from 'react';
import { MOEDAS } from '../_engine/data.js';

export function MoedaPicker({ value, onChange, label, className = '' }) {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState('');
  const [ativo, setAtivo] = useState(0);
  const ref = useRef(null);
  const listId = useId();

  useEffect(() => {
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  useEffect(() => { setAtivo(0); }, [q]);

  const results = open
    ? MOEDAS.filter((m) => !q || (`${m.code} ${m.nome}`).toLowerCase().includes(q.toLowerCase())).slice(0, 40)
    : [];

  const pick = (code) => { onChange(code); setOpen(false); setQ(''); };

  function onKey(e) {
    if (!open) return;
    if (e.key === 'ArrowDown') { e.preventDefault(); setAtivo((a) => Math.min(a + 1, results.length - 1)); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setAtivo((a) => Math.max(a - 1, 0)); }
    else if (e.key === 'Enter') { e.preventDefault(); if (results[ativo]) pick(results[ativo].code); }
    else if (e.key === 'Escape') { setOpen(false); }
  }

  return (
    <div ref={ref} className="relative inline-block">
      <button
        type="button" onClick={() => setOpen((o) => !o)} aria-label={label} aria-haspopup="listbox" aria-expanded={open}
        className={`bg-input border border-line rounded-md px-1.5 py-0.5 text-ink focusring inline-flex items-center gap-1 ${className}`}
      >
        {value || '—'} <span aria-hidden className="text-[9px] opacity-60">▾</span>
      </button>
      {open && (
        <div className="absolute z-30 mt-1 left-0 w-52 rounded-lg border border-line bg-card shadow-lg p-1">
          <input
            autoFocus value={q} onChange={(e) => setQ(e.target.value)} onKeyDown={onKey}
            placeholder="Buscar moeda…"
            role="combobox" aria-label="Buscar moeda" aria-expanded={results.length > 0}
            aria-autocomplete="list" aria-controls={listId}
            aria-activedescendant={results.length > 0 ? `${listId}-${ativo}` : undefined}
            className="w-full px-2 py-1 mb-1 rounded border border-line bg-input text-ink text-sm focusring"
          />
          <ul id={listId} role="listbox" className="max-h-56 overflow-auto">
            {results.map((m, i) => (
              <li key={m.code} id={`${listId}-${i}`} role="option" aria-selected={m.code === value}>
                <button
                  type="button" onClick={() => pick(m.code)} onMouseEnter={() => setAtivo(i)}
                  className={`w-full text-left px-2 py-1 rounded text-sm focusring ${i === ativo ? 'bg-paper2' : 'hover:bg-paper2'} ${m.code === value ? 'text-pine font-semibold' : 'text-ink'}`}
                >
                  <span className="font-semibold">{m.code}</span> <span className="text-inksoft text-xs">{m.nome}</span>
                </button>
              </li>
            ))}
            {results.length === 0 && <li className="px-2 py-1 text-xs text-inksoft">Nenhuma moeda.</li>}
          </ul>
        </div>
      )}
    </div>
  );
}
