'use client';
import { useEffect, useRef, useState } from 'react';

// Placar claro: cada caractere é uma plaquinha que gira por letras até parar no alvo
// (CSS steps em globals.css). Determinístico (SSR = cliente). Quando `texto` muda, a
// classe alterna entre ms-rolaA/ms-rolaB para a animação rodar de novo.
// Acessível: o texto real vai no aria-label; as plaquinhas são decorativas.
const AB = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

export function Placar({ texto, w = 22, h = 32, cor, atraso = 0, passo = 40, className = '', rotulo }) {
  const s = String(texto ?? '');
  const [ver, setVer] = useState(0);
  const anterior = useRef(s);
  useEffect(() => {
    if (anterior.current !== s) { anterior.current = s; setVer((v) => v + 1); }
  }, [s]);
  const classe = ver % 2 ? 'ms-rolaB' : 'ms-rolaA';
  return (
    <span className={`ms-placas ${className}`} role="img" aria-label={rotulo || s}>
      {Array.from(s).map((c, i) => {
        const k = c === ' ' ? 0 : 3 + ((i * 7 + atraso) % 6);
        const estilo = { '--k': k, '--k1': k + 1, '--dur': `${k * 55}ms`, '--atraso': `${atraso + i * passo}ms` };
        if (cor) estilo['--cor'] = cor;
        return (
          <span key={i} className="ms-placa" style={{ '--w': `${w}px`, '--h': `${h}px` }} aria-hidden="true">
            <span className={`ms-fita${k ? ' ' + classe : ''}`} style={estilo}>
              {Array.from({ length: k }, (_, j) => <span key={j}>{AB[(i * 13 + j * 7 + ver * 3) % AB.length]}</span>)}
              <span>{c === ' ' ? '' : c}</span>
            </span>
          </span>
        );
      })}
    </span>
  );
}

