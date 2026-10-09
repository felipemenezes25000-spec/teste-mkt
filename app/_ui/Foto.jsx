'use client';
import { useEffect, useRef, useState } from 'react';
import { Icon } from './Icon.jsx';

// Foto de lugar com proveniência (OMEGA V4 §11-13 / §28):
// - crédito (autor · licença · fonte) acessível sem poluir a imagem;
// - `ilustrativa`: a foto NÃO é do lugar exato (ex.: foto do país num card de
//   atração sem foto confiável) → rótulo explícito "Foto ilustrativa";
// - falha de carregamento → fallback editorial HONESTO (sem foto falsa).
export function Foto({
  src, alt, credito, ilustrativa = false, ilustrativaDe, className = '', imgClassName = '',
  prioridade = false, largura, altura, rotuloFalha = 'Foto indisponível', mostrarCredito = true, sizes, srcSet,
}) {
  const [falhou, setFalhou] = useState(!src);
  const imgRef = useRef(null);
  // A imagem do HTML do servidor pode falhar ANTES da hidratação (CDN fora, 404):
  // aí o onError do React nunca dispara. Confere na montagem (V5 DST-11/PER-07).
  useEffect(() => {
    const i = imgRef.current;
    if (i && i.complete && i.naturalWidth === 0) setFalhou(true); // eslint-disable-line react-hooks/set-state-in-effect
  }, [src]);
  const [abrirCredito, setAbrirCredito] = useState(false);

  return (
    <figure className={`${/(^|\s)(absolute|fixed)(\s|$)/.test(className) ? '' : 'relative'} overflow-hidden bg-paper2 ${className}`}>
      {!falhou ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          ref={imgRef} src={src} srcSet={srcSet} alt={alt || ''} width={largura} height={altura} sizes={srcSet ? (sizes || '100vw') : sizes}
          loading={prioridade ? 'eager' : 'lazy'} decoding="async" fetchPriority={prioridade ? 'high' : undefined}
          onError={() => setFalhou(true)}
          className={`w-full h-full object-cover ${imgClassName}`}
        />
      ) : (
        <div className="absolute inset-0 grid place-items-center text-inksoft"
          style={{ backgroundImage: 'linear-gradient(rgb(var(--grid-ink) / .08) 1px, transparent 1px), linear-gradient(90deg, rgb(var(--grid-ink) / .08) 1px, transparent 1px)', backgroundSize: '24px 24px' }}>
          <div className="flex flex-col items-center gap-1.5 px-3 text-center">
            <Icon name="pin" size={22} />
            <span className="eyebrow">{rotuloFalha}</span>
            {alt && <span className="text-xs text-ink font-medium line-clamp-2">{alt}</span>}
          </div>
        </div>
      )}
      {!falhou && ilustrativa && (
        <span className="absolute top-2 left-2 rounded-md bg-ink/80 text-paper px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider">
          Foto ilustrativa{ilustrativaDe ? ` · ${ilustrativaDe}` : ''}
        </span>
      )}
      {!falhou && mostrarCredito && credito && (credito.autor || credito.licenca || credito.link) && (
        <figcaption className="absolute bottom-1.5 right-1.5 flex items-end justify-end">
          {abrirCredito && (
            <span className="mr-1 max-w-[16rem] rounded-md bg-ink/85 text-paper px-2 py-1 text-[10px] leading-snug">
              {credito.autor ? <>{credito.autor} · </> : null}{credito.licenca || 'licença na origem'}
              {credito.link && <> · <a href={credito.link} target="_blank" rel="noopener noreferrer" className="underline">{credito.fonte || 'Wikimedia Commons'}</a></>}
            </span>
          )}
          <button
            type="button" onClick={(e) => { e.preventDefault(); e.stopPropagation(); setAbrirCredito((v) => !v); }}
            aria-label={abrirCredito ? 'Ocultar crédito da foto' : 'Ver crédito da foto'} aria-expanded={abrirCredito}
            className="w-6 h-6 grid place-items-center rounded-md bg-ink/70 text-paper hover:bg-ink focusring text-[10px] font-mono font-bold"
          >©</button>
        </figcaption>
      )}
    </figure>
  );
}
