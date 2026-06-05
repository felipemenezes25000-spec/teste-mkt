'use client';
import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { GlobalSearch } from './GlobalSearch.jsx';

// Drawer de navegação mobile (< lg). Mesma acessibilidade do Modal: role=dialog,
// foco inicial, FOCUS TRAP (Tab cicla dentro), Esc/backdrop fecham, restaura o foco
// e trava o scroll do body. Os links têm alvo de toque ≥48px (WCAG 2.5.5).
export function MobileMenu({ links, path, onClose }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    const anterior = document.activeElement;
    const sel = 'a[href],button:not([disabled]),input:not([disabled]),[tabindex]:not([tabindex="-1"])';
    const focaveis = () => Array.from(el.querySelectorAll(sel)).filter((n) => n.offsetParent !== null);
    const t = setTimeout(() => { const f = focaveis(); (f[0] || el).focus(); }, 20);

    function onKey(e) {
      if (e.key === 'Escape') { onClose(); return; }
      if (e.key !== 'Tab') return;
      const f = focaveis(); if (!f.length) return;
      const first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      clearTimeout(t);
      document.body.style.overflow = '';
      if (anterior && anterior.focus) anterior.focus();
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 lg:hidden bg-ink/40 backdrop-blur-sm" onClick={onClose}>
      <div
        ref={ref}
        id="mobile-menu"
        role="dialog"
        aria-modal="true"
        aria-label="Menu de navegação"
        className="absolute top-0 right-0 h-full w-[min(86vw,320px)] bg-paper border-l border-line shadow-2xl flex flex-col rise"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="h-14 px-3 flex items-center justify-between border-b border-line shrink-0">
          <span className="font-display text-lg text-ink">Menu</span>
          <button onClick={onClose} aria-label="Fechar menu" className="w-11 h-11 grid place-items-center rounded-lg text-inksoft hover:text-ink text-xl leading-none focusring">✕</button>
        </div>
        <div className="p-3 border-b border-line shrink-0"><GlobalSearch /></div>
        <nav className="p-2 overflow-y-auto flex-1">
          {links.map((l) => {
            const active = path === l.href || path.startsWith(l.href + '/');
            return (
              <Link
                key={l.href}
                href={l.href}
                onClick={onClose}
                aria-current={active ? 'page' : undefined}
                className={`flex items-center gap-3 px-4 min-h-[48px] rounded-xl text-base font-semibold transition focusring ${active ? 'bg-card text-pine' : 'text-ink hover:bg-paper2'}`}
              >
                <span aria-hidden className={`w-2 h-2 rounded-full ${active ? 'bg-pine' : 'bg-line'}`} />{l.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
