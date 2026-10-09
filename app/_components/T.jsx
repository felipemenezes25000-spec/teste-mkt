'use client';
import { useIdioma, interpolar } from '../_lib/i18n.js';

// Tradução in-line para Server Components (SSG/ISR): renderiza `fallback` no
// servidor e troca para o idioma do usuário após hidratar. `vars` interpola {chaves}.
// Uso: <T k="home2.verTodos" fallback="Ver os {n} países" vars={{ n: 205 }} />
export function T({ k, fallback, vars }) {
  const { t } = useIdioma();
  const v = t(k);
  return interpolar(v && v !== k ? v : (fallback || k), vars);
}
