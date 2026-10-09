'use client';
import { useEffect, useRef, useState } from 'react';
import { IDIOMAS, useIdioma } from '../_lib/i18n.js';
import { track } from '../_lib/analytics.js';
import { Icon } from '../_ui/Icon.jsx';

// Dropdown compacto de troca de idioma. Botão = bandeira + código (PT/EN/ES/JA).
// Click → lista com 4 idiomas; Enter/Espaço/Esc/clique-fora fecham; aria-expanded.
// Persistência em localStorage + cookie via useIdioma — efeito global na aba.
export function IdiomaSwitcher() {
  const { idioma, definir } = useIdioma();
  const [aberto, setAberto] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!aberto) return;
    function onDoc(e) { if (ref.current && !ref.current.contains(e.target)) setAberto(false); }
    function onKey(e) { if (e.key === 'Escape') setAberto(false); }
    document.addEventListener('mousedown', onDoc);
    document.addEventListener('keydown', onKey);
    return () => { document.removeEventListener('mousedown', onDoc); document.removeEventListener('keydown', onKey); };
  }, [aberto]);

  const atual = IDIOMAS.find((i) => i.code === idioma) || IDIOMAS[0];

  function escolher(code) {
    definir(code);
    setAberto(false);
    track('idioma_mudado', { de: idioma, para: code });
  }

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setAberto((v) => !v)}
        aria-label={`Idioma atual: ${atual.nome}. Trocar idioma.`}
        aria-haspopup="listbox"
        aria-expanded={aberto}
        className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-sm font-semibold text-inksoft hover:text-ink hover:bg-paper2 focusring transition"
      >
        <span aria-hidden className="text-base leading-none">{atual.bandeira}</span>
        <span className="uppercase text-[11px] tracking-wider">{atual.code}</span>
        <span aria-hidden className={`text-[10px] transition ${aberto ? 'rotate-180' : ''}`}>▾</span>
      </button>

      {aberto && (
        <ul
          role="listbox"
          aria-label="Escolha o idioma"
          className="absolute right-0 top-full mt-1 z-50 min-w-[10rem] rounded-xl border border-line bg-card shadow-e2 py-1"
        >
          {IDIOMAS.map((i) => (
            <li key={i.code}>
              <button
                type="button"
                role="option"
                aria-selected={i.code === idioma}
                onClick={() => escolher(i.code)}
                className={`w-full text-left flex items-center gap-2 px-3 py-2 text-sm focusring transition ${i.code === idioma ? 'bg-pine/10 text-pine font-semibold' : 'text-ink hover:bg-paper2'}`}
              >
                <span aria-hidden className="text-base">{i.bandeira}</span>
                <span className="flex-1">{i.nome}</span>
                {i.code === idioma && <span aria-hidden className="text-pine"><Icon emoji="✓" /></span>}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
