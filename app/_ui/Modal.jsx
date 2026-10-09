'use client';
import { useEffect, useRef } from 'react';
import { Icon } from './Icon.jsx';

export function Modal({ title, onClose, children, footer }) {
  const ref = useRef(null);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    const el = ref.current;
    const anterior = document.activeElement;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const sel = 'a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])';
    const focaveis = () => Array.from(el.querySelectorAll(sel)).filter(n => n.offsetParent !== null);
    const t = setTimeout(() => { const f = focaveis(); (f[0] || el).focus(); }, 20);

    function onKey(e) {
      if (e.key === 'Escape') { onCloseRef.current(); return; }
      if (e.key !== 'Tab') return;
      const f = focaveis(); if (!f.length) return;
      const first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
    document.addEventListener('keydown', onKey);
    return () => { document.removeEventListener('keydown', onKey); clearTimeout(t); document.body.style.overflow = prevOverflow; if (anterior && anterior.focus) anterior.focus(); };
  }, []);

  return (
    <div className="fixed inset-0 z-40 bg-ink/40 backdrop-blur-sm grid place-items-center p-4" onClick={onClose}>
      <div ref={ref} role="dialog" aria-modal="true" aria-label={title}
        className="rise w-[min(96vw,580px)] max-h-[90vh] overflow-auto rounded-2xl bg-card border border-line shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="p-5 border-b border-line flex items-center justify-between sticky top-0 bg-card z-10">
          <h3 className="font-display text-2xl text-ink">{title}</h3>
          <button onClick={onClose} aria-label="Fechar" className="text-inksoft hover:text-ink focusring text-xl leading-none"><Icon emoji="✕" /></button>
        </div>
        <div className="p-5 space-y-4">{children}</div>
        {footer && <div className="p-5 border-t border-line flex justify-end gap-2 sticky bottom-0 bg-card">{footer}</div>}
      </div>
    </div>
  );
}
