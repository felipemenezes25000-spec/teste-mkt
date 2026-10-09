'use client';
import { useEffect, useRef, useState } from 'react';

// "Figurinha viva" do destino: vídeo curado da Commons (sem som, em loop) ou a foto
// HD, numa moldura branca de figurinha. Sem mídia, a bandeira oficial vira a arte.
// O vídeo só toca se o usuário não pediu menos movimento; o crédito (autor, licença,
// link da Commons) fica sempre a um toque.
export function FiguraViva({ capa, video, nome, code }) {
  const [verCredito, setVerCredito] = useState(false);
  const [semVideo, setSemVideo] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) setSemVideo(true); // eslint-disable-line react-hooks/set-state-in-effect
  }, []);
  useEffect(() => { if (ref.current && !semVideo) ref.current.play().catch(() => {}); }, [semVideo]);
  const usarVideo = video && !semVideo;
  const cred = usarVideo ? video.credito : capa ? capa.credito : null;
  const lugar = usarVideo ? video.lugar : capa ? capa.lugar : null;

  return (
    <figure className="relative lg:mt-10 lg:rotate-[2deg]">
      <div className="rounded-[22px] bg-white p-2.5 shadow-[0_0_0_1px_#E3E3DD,0_30px_60px_-30px_rgba(0,0,0,.55)]">
        <div className="relative aspect-[4/5] max-h-[620px] w-full rounded-[14px] overflow-hidden bg-paper2">
          {usarVideo ? (
            <video ref={ref} className="absolute inset-0 w-full h-full object-cover" src={video.src} poster={video.poster} muted loop autoPlay playsInline
              preload="metadata" crossOrigin="anonymous" onError={() => setSemVideo(true)} aria-label={`Vídeo: ${video.lugar}, ${nome}`} />
          ) : capa ? (
            <img className="absolute inset-0 w-full h-full object-cover" src={capa.src} srcSet={capa.srcSet} sizes="(min-width: 1024px) 560px, 100vw"
              alt={`${capa.lugar || nome}, ${nome}`} fetchPriority="high" decoding="async" crossOrigin="anonymous" />
          ) : (
            <div className="absolute inset-0 grid place-items-center">
              <img src={`/bandeiras/${code}.png`} alt={`Bandeira de ${nome}`} className="w-[72%] h-auto rounded-[4px] shadow-[0_0_0_1px_rgba(0,0,0,.08),0_16px_34px_-14px_rgba(0,0,0,.45)]" />
            </div>
          )}
          <span className="absolute left-3 bottom-3 z-10 px-3 py-1.5 rounded-full bg-coral text-ink font-cond font-black italic text-[13px] tracking-[.06em] uppercase">
            {usarVideo ? 'Figurinha viva' : capa ? 'Foto HD' : 'Bandeira oficial'}{lugar ? ` · ${lugar}` : ''}
          </span>
          {cred && (
            <button type="button" onClick={() => setVerCredito((v) => !v)} aria-expanded={verCredito} aria-label={verCredito ? 'Ocultar crédito' : 'Ver crédito da mídia'}
              className="absolute right-3 top-3 z-10 w-8 h-8 grid place-items-center rounded-full bg-ink/75 text-white text-xs font-bold hover:bg-ink focusring">©</button>
          )}
          {cred && verCredito && (
            <figcaption className="absolute right-3 top-14 z-10 max-w-[18rem] rounded-xl bg-ink/90 text-white px-3 py-2 text-xs leading-snug">
              {usarVideo ? 'Vídeo' : 'Foto'}: {cred.autor} · {cred.licenca} · <a href={cred.link} target="_blank" rel="noopener noreferrer" className="underline">Wikimedia Commons</a>
            </figcaption>
          )}
        </div>
      </div>
    </figure>
  );
}
