'use client';
import { useState, useMemo, useRef, useEffect, useId } from 'react';
import { useRouter } from 'next/navigation';
import { DESTINOS } from '../_lib/destinos.js';
import { flagUrl } from '../_lib/flags.js';

export function GlobalSearch() {
  const [q, setQ] = useState('');
  const [open, setOpen] = useState(false);
  const [ativo, setAtivo] = useState(0);
  const router = useRouter();
  const ref = useRef(null);
  const listId = useId();

  const results = useMemo(() => {
    const t = q.trim().toLowerCase();
    if (!t) return [];
    return DESTINOS
      .filter((d) => (`${d.nome} ${d.regiao} ${(d.cidades || []).join(' ')}`).toLowerCase().includes(t))
      .slice(0, 8);
  }, [q]);

  useEffect(() => {
    const onDoc = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, []);

  useEffect(() => { setAtivo(0); }, [q]);

  function go(d) {
    if (!d) return;
    setQ(''); setOpen(false);
    router.push(`/destino/${d.slug}`);
  }

  function onKey(e) {
    if (e.key === 'ArrowDown') { e.preventDefault(); setAtivo((a) => Math.min(a + 1, results.length - 1)); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setAtivo((a) => Math.max(a - 1, 0)); }
    else if (e.key === 'Enter') { go(results[ativo]); }
    else if (e.key === 'Escape') { setOpen(false); }
  }

  return (
    <div ref={ref} className="relative">
      <input
        value={q}
        onChange={(e) => { setQ(e.target.value); setOpen(true); }}
        onFocus={() => setOpen(true)}
        onKeyDown={onKey}
        placeholder="🔍 Buscar país…"
        aria-label="Buscar destino"
        role="combobox" aria-expanded={open && results.length > 0} aria-autocomplete="list"
        aria-controls={listId}
        aria-activedescendant={open && results.length > 0 ? `${listId}-${ativo}` : undefined}
        className="w-28 sm:w-44 px-3 py-1.5 rounded-lg border border-line bg-input text-ink text-sm focusring"
      />
      {open && results.length > 0 && (
        <ul id={listId} className="absolute z-50 mt-1 left-0 w-64 max-h-80 overflow-auto rounded-xl border border-line bg-card shadow-[var(--e-2)] py-1" role="listbox">
          {results.map((d, i) => (
            <li key={d.code} id={`${listId}-${i}`} role="option" aria-selected={i === ativo}>
              <button
                onMouseEnter={() => setAtivo(i)}
                onClick={() => go(d)}
                className={`w-full text-left px-3 py-2 flex items-center justify-between gap-2 focusring ${i === ativo ? 'bg-paper2' : 'hover:bg-paper2'}`}
              >
                <span className="text-ink text-sm font-medium truncate flex items-center gap-2 min-w-0">
                  {flagUrl(d.code) && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={flagUrl(d.code)} alt="" width="18" height="13" loading="lazy" className="rounded-[1px] ring-1 ring-line shrink-0" />
                  )}
                  <span className="truncate">{d.nome}</span>
                </span>
                <span className="text-[11px] text-inksoft shrink-0">{d.regiao}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
