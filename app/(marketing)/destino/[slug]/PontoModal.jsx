'use client';
import { useEffect, useState } from 'react';
import { Modal } from '../../../_ui/Modal.jsx';
import { resumoClient } from '../../../_lib/wikiClient.js';
import { wikiThumb } from '../../../_lib/wikiThumb.js';
import { Icon } from '../../../_ui/Icon.jsx';

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
  // Foto HD curada (ponto.imgGrande, já em largura padrão) vence a do resumo.
  const imgGrande = ponto.imgGrande || wikiThumb((!hist.carregando && hist.img) || ponto.img || null, 960);

  return (
    <Modal
      title={ponto.nome}
      onClose={onClose}
      footer={
        <a
          href={ponto.maps} target="_blank" rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 rounded-full bg-ink text-white font-cond font-extrabold uppercase tracking-[.05em] px-4 py-2.5 hover:bg-ink/85 transition focusring"
        >
          <Icon emoji="🗺️" /> Abrir no Google Maps <Icon emoji="↗" />
        </a>
      }
    >
      {imgGrande ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={imgGrande} alt={ponto.nome} width="960" height="540" decoding="async"
          crossOrigin={/^https:\/\/upload\.wikimedia\.org\//.test(imgGrande || '') ? 'anonymous' : undefined}
          className="w-full h-52 sm:h-64 object-cover rounded-xl bg-paper2 bg-cover bg-center"
          style={{ backgroundImage: `url("${wikiThumb(imgGrande, 32)}")` }}
        />
      ) : (
        <div className="w-full h-52 sm:h-64 grid place-items-center rounded-xl bg-paper2/60 text-4xl" aria-hidden><Icon emoji="📍" /></div>
      )}

      {ponto.credito && (
        <p className="text-[11px] text-inksoft -mt-1">
          Foto: {ponto.credito.autor ? ponto.credito.autor + ' · ' : ''}{ponto.credito.licenca ? ponto.credito.licenca + ' · ' : ''}{ponto.credito.fonte}
          {ponto.credito.link && <> · <a href={ponto.credito.link} target="_blank" rel="noopener noreferrer" className="text-pine hover:underline focusring">ver fonte <Icon emoji="↗" /></a></>}
        </p>
      )}

      {ponto.sub && (
        <p className="text-sm text-inksoft flex items-center gap-1.5"><span aria-hidden><Icon emoji="📍" /></span>{ponto.sub}</p>
      )}

      {hist.carregando ? (
        <p className="text-sm text-inksoft animate-pulse">Carregando história…</p>
      ) : hist.erro ? (
        <div className="space-y-2">
          {ponto.contextoPais ? (
            <>
              <p className="text-inksoft leading-relaxed">{ponto.contextoPais}</p>
              <p className="text-[11px] text-inksoft">
                A Wikipédia ainda não tem um verbete específico desse ponto — o trecho acima é o veredito editorial sobre o país.
                {ponto.urlPais && <> · <a href={ponto.urlPais} target="_blank" rel="noopener noreferrer" className="text-pine hover:underline focusring">Ler sobre o país <Icon emoji="↗" /></a></>}
              </p>
            </>
          ) : (
            <p className="text-sm text-inksoft">Não encontramos um resumo deste lugar na Wikipédia. Use o botão abaixo para ver no mapa.</p>
          )}
        </div>
      ) : (
        <div className="max-h-[40vh] overflow-y-auto pr-2 -mr-2 space-y-3">
          {/* Multi-parágrafo: a Action API devolve \n\n entre parágrafos.
              Renderizar como <p> separados torna a leitura digerível e
              preserva o ritmo do artigo da Wikipédia (intro + história +
              curiosidades). */}
          {hist.extrato.split(/\n\n+/).map((p, i) => (
            <p key={i} className="text-inksoft leading-relaxed text-[15px]">{p}</p>
          ))}
          <p className="text-[11px] text-inksoft pt-1">
            Fonte: Wikipédia · CC BY-SA 4.0
            {hist.url && <> · <a href={hist.url} target="_blank" rel="noopener noreferrer" className="text-pine hover:underline focusring">Ler o artigo completo <Icon emoji="↗" /></a></>}
          </p>
        </div>
      )}
    </Modal>
  );
}
