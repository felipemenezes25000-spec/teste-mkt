'use client';
import { useRef, useState } from 'react';
import Link from 'next/link';
import { M3, MESES } from '../_lib/figurinhaMes.js';

// Figurinha CALÇADÃO: frente = foto/vídeo real do país (ou a bandeira oficial como arte),
// número, bandeira, nome e os 12 meses (amarelo = época boa, contorno = mês escolhido);
// brilho holográfico só quando está na hora certa. Clique/Enter vira e mostra custo,
// visto, segurança e o link do destino. Inclina com o mouse (desligado em reduced-motion).
//
// f = figurinhaDe(code, mes) (_lib/figurinhas.js) · midia = { capa, video } (_lib/midia.js)
export function Figurinha({
  f, mes, midia, video = false, brilho = true, largura = 220, altura = 318, className = '', style,
  subtitulo, prioridade = false, href,
}) {
  const ref = useRef(null);
  const [virada, setVirada] = useState(false);
  const [falhou, setFalhou] = useState(false);
  if (!f) return null;
  const capa = !falhou && midia && midia.capa;
  const vid = video && !falhou && midia && midia.video;
  const soBandeira = !capa;
  const sub = subtitulo ?? (capa && capa.lugar ? capa.lugar : `US$ ${f.custoDia}/dia`);
  const cred = vid ? midia.video.credito : capa ? capa.credito : null;
  const destino = href || `/destino/${f.slug}`;

  function virar() { setVirada((v) => !v); }
  function mover(e) {
    const el = ref.current;
    if (!el || virada || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width; const y = (e.clientY - r.top) / r.height;
    el.style.transform = `rotateY(${(x - 0.5) * 16}deg) rotateX(${(0.5 - y) * 16}deg) scale(1.04)`;
    const b = el.querySelector('.ms-brilho');
    if (b) { b.style.setProperty('--gx', `${x * 100}%`); b.style.setProperty('--gy', `${y * 100}%`); b.style.animation = 'none'; b.style.opacity = '.5'; }
  }
  function sair() {
    const el = ref.current; if (!el) return;
    el.style.transform = '';
    const b = el.querySelector('.ms-brilho');
    if (b) { b.style.animation = ''; b.style.opacity = ''; }
  }

  const rotulo = `${f.nome}${f.bom ? ', na hora certa' : f.alerta ? ', alerta de viagem' : ''}`;
  return (
    <div
      ref={ref}
      className={`ms-fig ${virada ? 'virada' : ''} ${className}`}
      style={{ '--fw': typeof largura === 'number' ? `${largura}px` : largura, '--fh': typeof altura === 'number' ? `${altura}px` : altura, ...style }}
      onMouseMove={mover} onMouseLeave={sair}
    >
      <div className="ms-face" aria-hidden={virada}>
        <div className={`ms-foto ${soBandeira ? 'so-bandeira' : ''}`}>
          {vid ? (
            <video className="ms-arte" src={midia.video.src} poster={midia.video.poster} muted loop autoPlay playsInline preload="metadata"
              crossOrigin="anonymous" onError={() => setFalhou(true)} aria-label={`Vídeo: ${midia.video.lugar}`} />
          ) : capa ? (
            <img className="ms-arte" src={capa.src} srcSet={capa.srcSet} sizes={`${typeof largura === 'number' ? largura : 320}px`}
              alt={`${capa.lugar || f.nome}, ${f.nome}`} loading={prioridade ? 'eager' : 'lazy'} decoding="async" crossOrigin="anonymous"
              onError={() => setFalhou(true)} />
          ) : (
            <img className="ms-arte" src={`/bandeiras/${f.code}.png`} alt={`Bandeira de ${f.nome}`} loading="lazy" decoding="async" />
          )}
          {f.bom && brilho && <span className="ms-brilho" />}
          <span className="ms-num">{f.numero}</span>
          {!soBandeira && <img className="ms-band" src={`/bandeiras/${f.code}.png`} alt="" loading="lazy" />}
          <span className="ms-nome">
            {f.bom ? <span className="ms-tag">Hora certa</span> : f.alerta ? <span className="ms-tag alerta">Alerta de viagem</span> : null}
            <b>{f.nome}</b>
            <small>{sub}</small>
            <span className="ms-pips" aria-hidden="true">
              {M3.map((m, k) => <i key={m} className={`${f.meses.includes(k + 1) ? 'on' : ''}${k === mes ? ' agora' : ''}`} />)}
            </span>
          </span>
          {cred && <span className="ms-selo-c" title={`${vid ? 'Vídeo' : 'Foto'}: ${cred.autor} · ${cred.licenca} · Wikimedia Commons`} aria-hidden="true">©</span>}
          {/* a frente inteira é um botão (sem nada interativo dentro): vira a figurinha */}
          <button type="button" className="ms-virar" onClick={virar} tabIndex={virada ? -1 : 0} aria-pressed={virada} aria-label={`${rotulo}. Virar figurinha`} />
        </div>
      </div>
      <div className="ms-face ms-tras" aria-hidden={!virada}>
        <div className="flex items-start justify-between gap-2">
          <b>{f.nome}</b>
          <button type="button" onClick={virar} tabIndex={virada ? 0 : -1} aria-label={`Desvirar a figurinha de ${f.nome}`}
            className="shrink-0 w-9 h-9 -mt-1 -mr-1 grid place-items-center rounded-full bg-white/15 hover:bg-white/25 text-white text-lg leading-none">↺</button>
        </div>
        <dl>
          <dt>Melhor época</dt><dd>{f.faixa.toLowerCase()}</dd>
          <dt>Custo/dia</dt><dd>US$ {f.custoDia}</dd>
          <dt>Visto (BR)</dt><dd>{f.visto.curto}{f.visto.dias ? ` · ${f.visto.dias}d` : ''}</dd>
          <dt>Segurança</dt><dd>{f.seguranca}/10</dd>
          {typeof mes === 'number' && <><dt>{MESES[mes]}</dt><dd>{f.bom ? 'hora certa' : f.alerta ? 'evite' : 'espere'}</dd></>}
        </dl>
        <Link href={destino} tabIndex={virada ? 0 : -1}
          className="mt-1 inline-flex items-center justify-center min-h-[40px] rounded-full bg-coral text-ink font-cond font-extrabold uppercase tracking-[.05em] text-[15px] no-underline">
          Abrir destino
        </Link>
        <span className="ms-credito">
          {cred ? <>{vid ? 'Vídeo' : 'Foto'}: {cred.autor} · {cred.licenca} · <a href={cred.link} target="_blank" rel="noopener noreferrer" tabIndex={virada ? 0 : -1}>Wikimedia Commons</a></>
            : 'Bandeira: Wikimedia Commons · domínio público'}
          <br />Base de referência jun/2026. Confira o visto na fonte oficial.
        </span>
      </div>
    </div>
  );
}
