'use client';
import { useState } from 'react';
import { PontoModal } from './PontoModal.jsx';
import { wikiThumb } from '../../../_lib/wikiThumb.js';

// Grade de lugares (pontos turísticos OU cidades). Cada card é um BOTÃO que abre o
// modal com foto grande + história (Wikipédia) + botão do Google Maps — substituindo
// os antigos <a> que abriam o Maps direto. `layout` muda só tamanho/colunas do card.
export function GaleriaLugares({ lugares, layout = 'ponto' }) {
  const [sel, setSel] = useState(null);
  const alturaImg = layout === 'cidade' ? 'h-24' : 'h-28 sm:h-32';
  const cols = layout === 'cidade' ? 'grid-cols-2 sm:grid-cols-4' : 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4';

  return (
    <>
      <div className={`grid ${cols} gap-3`}>
        {lugares.map((l, i) => (
          <button
            key={`${l.nome}-${i}`}
            type="button"
            onClick={() => setSel(l)}
            aria-label={`Ver história de ${l.nome}`}
            className="group text-left rounded-xl overflow-hidden border border-line bg-card hover:border-pine/50 hover:shadow-[var(--e-1)] transition focusring"
          >
            <div
              className={`${alturaImg} bg-paper2 overflow-hidden bg-cover bg-center`}
              style={l.img ? { backgroundImage: `url("${wikiThumb(l.img, 32)}")` } : undefined}
            >
              {l.img ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={l.img} alt={l.nome} loading="lazy" decoding="async" width="640" height="384" className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
              ) : (
                <div className="w-full h-full grid place-items-center bg-gradient-to-br from-pine/15 to-ochre/15 text-2xl" aria-hidden>📍</div>
              )}
            </div>
            <div className="p-2.5 flex items-center justify-between gap-1">
              <span className="min-w-0">
                <span className="flex items-center gap-1.5">
                  <span className="block text-sm font-semibold text-ink line-clamp-1">{l.nome}</span>
                  {l.fora && (
                    <span className="shrink-0 text-[9px] font-bold uppercase tracking-wider bg-coral/15 text-coral border border-coral/30 rounded-full px-1.5 py-0.5" title="Fora da rota turística clássica">
                      fora da rota
                    </span>
                  )}
                </span>
                {l.sub && <span className="block text-[11px] text-inksoft line-clamp-1 mt-0.5">{l.sub}</span>}
              </span>
              <span className="text-pine shrink-0" aria-hidden>↗</span>
            </div>
          </button>
        ))}
      </div>
      {sel && <PontoModal ponto={sel} onClose={() => setSel(null)} />}
    </>
  );
}
