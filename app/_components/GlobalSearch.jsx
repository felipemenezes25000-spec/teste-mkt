'use client';
import { useState, useMemo, useRef, useEffect, useId } from 'react';
import { useRouter } from 'next/navigation';
import { flagUrl } from '../_lib/flags.js';
import { Icon } from '../_ui/Icon.jsx';

export function GlobalSearch() {
  const [q, setQ] = useState('');
  const [open, setOpen] = useState(false);
  const [ativo, setAtivo] = useState(0);
  const router = useRouter();
  const ref = useRef(null);
  const listId = useId();

  // catálogo carregado SOB DEMANDA (foco/digitação): fora do bundle inicial de todas as páginas
  const [destinos, setDestinos] = useState(null);
  const carregar = () => {
    if (destinos) return;
    import('../_lib/destinos.js').then((m) => setDestinos(m.DESTINOS.map((d) => ({ code: d.code, nome: d.nome, slug: d.slug, regiao: d.regiao, cidades: d.cidades || [] }))));
  };
  const results = useMemo(() => {
    const t = q.trim().toLowerCase();
    if (!t || !destinos) return [];
    return destinos
      .filter((d) => (`${d.nome} ${d.regiao} ${(d.cidades || []).join(' ')}`).toLowerCase().includes(t))
      .slice(0, 8);
  }, [q, destinos]);

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
      <Icon name="search" size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-inksoft pointer-events-none" />
      <input
        value={q}
        onChange={(e) => { setQ(e.target.value); setOpen(true); carregar(); }}
        onFocus={() => { setOpen(true); carregar(); }}
        onPointerEnter={carregar}
        onKeyDown={onKey}
        placeholder="Buscar país ou cidade…"
        aria-label="Buscar destino"
        role="combobox" aria-expanded={open && results.length > 0} aria-autocomplete="list"
        aria-controls={listId}
        aria-activedescendant={open && results.length > 0 ? `${listId}-${ativo}` : undefined}
        className="w-full 2xl:w-64 h-9 pl-9 pr-3 rounded-lg border border-line bg-input text-ink text-sm placeholder:text-inksoft focusring"
      />
      {open && results.length > 0 && (
        <ul id={listId} className="absolute z-50 mt-1 left-0 w-full min-w-[16rem] max-h-80 overflow-auto rounded-xl border border-line bg-card shadow-e2 py-1" role="listbox">
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
