'use client';
import { useState, useRef, useEffect } from 'react';
import { MOEDAS } from '../_engine/data.js';

// Seletor de moeda LEVE: mostra só um botão com o código; as ~130 opções só entram
// no DOM quando o dropdown abre (com busca). Antes era um <select> com 126 <option>
// por TRECHO — poluía o DOM em rotas longas. Aqui o custo é O(trechos), não O(trechos×moedas).
export function MoedaPicker({ value, onChange, label, className = '' }) {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState('');
  const ref = useRef(null);

  useEffect(() => {
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  const results = open
    ? MOEDAS.filter((m) => !q || (`${m.code} ${m.nome}`).toLowerCase().includes(q.toLowerCase())).slice(0, 40)
    : [];

  const pick = (code) => { onChange(code); setOpen(false); setQ(''); };

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
            autoFocus value={q} onChange={(e) => setQ(e.target.value)} placeholder="Buscar moeda…" aria-label="Buscar moeda"
            className="w-full px-2 py-1 mb-1 rounded border border-line bg-input text-ink text-sm focusring"
          />
          <ul role="listbox" className="max-h-56 overflow-auto">
            {results.map((m) => (
              <li key={m.code}>
                <button
                  type="button" onClick={() => pick(m.code)} role="option" aria-selected={m.code === value}
                  className={`w-full text-left px-2 py-1 rounded text-sm hover:bg-paper2 focusring ${m.code === value ? 'text-pine font-semibold' : 'text-ink'}`}
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
