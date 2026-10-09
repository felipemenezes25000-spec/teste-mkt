'use client';
import { useEffect, useState } from 'react';
import { ehFavorito, alternarFavorito, FAV_EVENT } from '../_lib/favoritos.js';
import { track } from '../_lib/analytics.js';

// Coração de favoritar. Sincroniza entre instâncias via evento custom. Fica FORA
// do <Link> do card (HTML válido) e cancela a navegação no clique.
export function FavoriteButton({ code, nome, className = '' }) {
  const [fav, setFav] = useState(false);

  useEffect(() => {
    setFav(ehFavorito(code));
    const h = () => setFav(ehFavorito(code));
    window.addEventListener(FAV_EVENT, h);
    return () => window.removeEventListener(FAV_EVENT, h);
  }, [code]);

  function onClick(e) {
    e.preventDefault();
    e.stopPropagation();
    const agora = alternarFavorito(code);
    setFav(agora);
    // Favoritar é um sinal forte de preferência → nutre o super-perfil do viajante.
    // o motor de perfil (e o catálogo) só carrega quando alguém favorita — fora do bundle inicial
    if (agora) { import('../_engine/perfil.js').then((m) => m.aprenderComFavorito(code)).catch(() => {}); track('favorito_add', { code }); }
  }

  return (
    <button
      type="button" onClick={onClick} aria-pressed={fav}
      aria-label={fav ? `Remover ${nome} dos favoritos` : `Salvar ${nome} nos favoritos`}
      title={fav ? 'Remover dos favoritos' : 'Salvar nos favoritos'}
      className={`inline-flex items-center justify-center w-8 h-8 rounded-full backdrop-blur bg-card/85 border border-line text-base shadow-sm hover:scale-110 transition focusring ${className}`}
    >
      <span aria-hidden className={fav ? 'text-clay' : 'text-inksoft'}><svg width="16" height="16" viewBox="0 0 24 24" fill={fav ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.9" strokeLinejoin="round"><path d="M12 20s-7.5-4.6-7.5-10.2A4.3 4.3 0 0 1 12 7.2a4.3 4.3 0 0 1 7.5 2.6C19.5 15.4 12 20 12 20Z" /></svg></span>
    </button>
  );
}
