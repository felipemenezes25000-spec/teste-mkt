'use client';
import { useEffect, useRef, useState } from 'react';

// Monta os filhos só quando o bloco chega perto da tela (IntersectionObserver).
// Usado para o mapa (JS + tiles pesados) não competir com o LCP da página.
export function QuandoVisivel({ children, margem = '300px', altura = 'h-[420px]', rotulo = 'Carregando…' }) {
  const ref = useRef(null);
  const [visivel, setVisivel] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    if (!('IntersectionObserver' in window)) { setVisivel(true); return undefined; } // eslint-disable-line react-hooks/set-state-in-effect
    const io = new IntersectionObserver((es) => { if (es.some((e) => e.isIntersecting)) { setVisivel(true); io.disconnect(); } }, { rootMargin: margem });
    io.observe(el);
    return () => io.disconnect();
  }, [margem]);
  return (
    <div ref={ref}>
      {visivel ? children : <div className={`${altura} rounded-2xl border border-line bg-paper2 grid place-items-center`}><span className="eyebrow">{rotulo}</span></div>}
    </div>
  );
}
