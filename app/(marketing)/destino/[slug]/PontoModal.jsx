'use client';
import { useEffect, useState } from 'react';
import { Modal } from '../../../_ui/Modal.jsx';
import { resumoClient } from '../../../_lib/wikiClient.js';
import { wikiThumb } from '../../../_lib/wikiThumb.js';

// Modal de um ponto turístico / cidade: foto grande, nome, cidade/região, história
// (resumo da Wikipédia pt buscado no browser, com cache+fallback) e o botão "Abrir no
// Google Maps" com o MESMO link que o card usava antes. Reaproveita o <Modal> do
// design system (Esc, clique fora, focus-trap, restaura foco — já prontos).
export function PontoModal({ ponto, onClose }) {
  const [hist, setHist] = useState({ carregando: true });

  useEffect(() => {
    let vivo = true;
    setHist({ carregando: true });
    resumoClient(ponto.wiki).then((r) => { if (vivo) setHist({ carregando: false, ...r }); });
    return () => { vivo = false; };
  }, [ponto.wiki]);

  // No modal, prefere a imagem que o próprio resumo traz; senão a do card. Sempre como
  // thumb de 960px (evita baixar o original de vários MB).
  const imgGrande = wikiThumb((!hist.carregando && hist.img) || ponto.img || null, 960);

  return (
    <Modal
      title={ponto.nome}
      onClose={onClose}
      footer={
        <a
          href={ponto.maps} target="_blank" rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-pine text-white font-semibold px-4 py-2.5 hover:bg-pinedk transition focusring"
        >
          🗺️ Abrir no Google Maps ↗
        </a>
      }
    >
      {imgGrande ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={imgGrande} alt={ponto.nome} width="960" height="540" decoding="async"
          className="w-full h-52 sm:h-64 object-cover rounded-xl bg-paper2 bg-cover bg-center"
          style={{ backgroundImage: `url("${wikiThumb(imgGrande, 32)}")` }}
        />
      ) : (
        <div className="w-full h-52 sm:h-64 grid place-items-center rounded-xl bg-gradient-to-br from-pine/15 to-ochre/15 text-4xl" aria-hidden>📍</div>
      )}

      {ponto.credito && (
        <p className="text-[11px] text-inksoft -mt-1">
          Foto: {ponto.credito.autor ? ponto.credito.autor + ' · ' : ''}{ponto.credito.licenca ? ponto.credito.licenca + ' · ' : ''}{ponto.credito.fonte}
          {ponto.credito.link && <> · <a href={ponto.credito.link} target="_blank" rel="noopener noreferrer" className="text-pine hover:underline focusring">ver fonte ↗</a></>}
        </p>
      )}

      {ponto.sub && (
        <p className="text-sm text-inksoft flex items-center gap-1.5"><span aria-hidden>📍</span>{ponto.sub}</p>
      )}

      {hist.carregando ? (
        <p className="text-sm text-inksoft animate-pulse">Carregando história…</p>
      ) : hist.erro ? (
        <p className="text-sm text-inksoft">Não encontramos um resumo deste lugar na Wikipédia. Use o botão abaixo para ver no mapa.</p>
      ) : (
        <>
          <p className="text-inksoft leading-relaxed whitespace-pre-line">{hist.extrato}</p>
          <p className="text-[11px] text-inksoft">
            Fonte: Wikipédia · CC BY-SA 4.0
            {hist.url && <> · <a href={hist.url} target="_blank" rel="noopener noreferrer" className="text-pine hover:underline focusring">Ler na Wikipédia ↗</a></>}
          </p>
        </>
      )}
    </Modal>
  );
}
