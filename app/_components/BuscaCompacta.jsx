'use client';
import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { GlobalSearch } from './GlobalSearch.jsx';
import { Icon } from '../_ui/Icon.jsx';
import { useIdioma } from '../_lib/i18n.js';

// Busca compacta para cabeçalhos estreitos: botão que abre um painel com a busca
// global. Esc/clique fora fecham; foco vai para o campo ao abrir.
export function BuscaCompacta() {
  const [aberto, setAberto] = useState(false);
  const ref = useRef(null);
  const path = usePathname();
  const { t } = useIdioma();
  useEffect(() => { setAberto(false); }, [path]);
  useEffect(() => {
    if (!aberto) return undefined;
    const t = setTimeout(() => { const i = ref.current && ref.current.querySelector('input'); if (i) i.focus(); }, 20);
    const fora = (e) => { if (ref.current && !ref.current.contains(e.target)) setAberto(false); };
    const esc = (e) => { if (e.key === 'Escape') setAberto(false); };
    document.addEventListener('mousedown', fora);
    document.addEventListener('keydown', esc);
    return () => { clearTimeout(t); document.removeEventListener('mousedown', fora); document.removeEventListener('keydown', esc); };
  }, [aberto]);
  return (
    <div ref={ref} className="relative">
      <button type="button" onClick={() => setAberto((v) => !v)} aria-expanded={aberto} aria-label={t('nav2.buscar')}
        className={`w-9 h-9 grid place-items-center rounded-lg focusring ${aberto ? 'bg-card text-ink shadow-e1' : 'text-inksoft hover:text-ink'}`}>
        <Icon name="search" size={18} />
      </button>
      {aberto && (
        <div className="absolute right-0 mt-2 w-[min(86vw,320px)] rounded-xl border border-line bg-card shadow-e2 p-2 rise z-50">
          <GlobalSearch />
        </div>
      )}
    </div>
  );
}
