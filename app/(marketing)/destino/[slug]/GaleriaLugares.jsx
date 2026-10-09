'use client';
import { useState } from 'react';
import { PontoModal } from './PontoModal.jsx';
import { Foto } from '../../../_ui/Foto.jsx';

// Grade de lugares (pontos turísticos OU cidades). Cada card é um BOTÃO que abre o
// modal com foto grande + história (Wikipédia) + botão do Google Maps — substituindo
// os antigos <a> que abriam o Maps direto. `layout` muda só tamanho/colunas do card.
export function GaleriaLugares({ lugares, layout = 'ponto' }) {
  const [sel, setSel] = useState(null);
  const alturaImg = layout === 'cidade' ? 'h-36 sm:h-40' : 'h-52 sm:h-60';
  const cols = layout === 'cidade' ? 'grid-cols-2 sm:grid-cols-4' : 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4';

  return (
    <>
      <div className={`grid ${cols} gap-4`}>
        {lugares.map((l, i) => (
          <button
            key={`${l.nome}-${i}`}
            type="button"
            onClick={() => setSel(l)}
            aria-label={`Ver história de ${l.nome}`}
            className="group text-left rounded-2xl bg-white p-2 shadow-[0_0_0_1px_#E3E3DD,0_14px_28px_-18px_rgba(0,0,0,.45)] hover:-translate-y-1 hover:rotate-[-1deg] transition duration-300 focusring"
          >
            <div className={`relative ${alturaImg} rounded-[10px] overflow-hidden`}>
              <Foto
                src={l.img} srcSet={l.srcSet} sizes="(min-width: 1024px) 260px, 50vw" alt={l.nome} credito={l.credito} ilustrativa={l.ilustrativa} ilustrativaDe={l.ilustrativaDe}
                className="absolute inset-0" imgClassName="group-hover:scale-[1.04] transition duration-700" largura={500} altura={300}
                mostrarCredito={false}
              />
              <span className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-ink/85 to-transparent pointer-events-none" aria-hidden />
              <span className="absolute left-2.5 right-2.5 bottom-2 text-white">
                {l.fora && (
                  <span className="inline-block mb-1 px-2 py-0.5 rounded-full bg-coral text-ink font-cond font-black italic text-[11px] tracking-[.06em] uppercase" title="Fora da rota turística clássica">fora da rota</span>
                )}
                <span className="block font-cond font-black italic text-[19px] leading-[.95] uppercase line-clamp-2">{l.nome}</span>
                {l.sub && <span className="block mt-0.5 font-cond font-bold text-[12px] tracking-[.06em] opacity-90 line-clamp-1">{l.sub}</span>}
              </span>
            </div>
          </button>
        ))}
      </div>
      {sel && <PontoModal ponto={sel} onClose={() => setSel(null)} />}
    </>
  );
}
