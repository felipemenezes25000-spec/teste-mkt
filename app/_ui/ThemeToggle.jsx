'use client';
import { useEffect, useState } from 'react';

// Alterna claro/escuro. O tema é aplicado via data-theme no <html> (ver tokens.css)
// e persistido. O 1º paint já vem certo pelo script inline em layout.jsx (anti-flash);
// aqui só sincronizamos o estado do ícone e tratamos o clique.
export const THEME_KEY = 'mundosemfim.theme';

export function ThemeToggle({ className = '' }) {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    setDark(document.documentElement.getAttribute('data-theme') === 'dark');
  }, []);

  function toggle() {
    const next = !dark;
    setDark(next);
    const el = document.documentElement;
    if (next) el.setAttribute('data-theme', 'dark');
    else el.removeAttribute('data-theme');
    try { localStorage.setItem(THEME_KEY, next ? 'dark' : 'light'); } catch (e) {}
  }

  return (
    <button
      type="button" onClick={toggle} aria-pressed={dark}
      aria-label={dark ? 'Mudar para tema claro' : 'Mudar para tema escuro'}
      title={dark ? 'Tema claro' : 'Tema escuro'}
      className={`inline-flex items-center justify-center w-9 h-9 rounded-lg border border-line bg-card text-inksoft hover:text-pine focusring transition ${className}`}
    >
      <span aria-hidden className="text-base leading-none">{dark ? '☀' : '☾'}</span>
    </button>
  );
}
