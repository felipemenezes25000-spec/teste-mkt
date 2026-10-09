'use client';
import { FRESHNESS_INFO } from '../_domain/evidence.js';
import { useIdioma } from '../_lib/i18n.js';

// Selo de frescor/proveniência (OMEGA V4 §22/§33): todo número crítico diz se é
// AO VIVO, RECENTE, ESTIMATIVA, HISTÓRICO, NÃO VERIFICADO ou INDISPONÍVEL — com
// cor + TEXTO (nunca só cor) e a fonte/data no title. Traduzido (pt/en/es/ja).
const ESTILO = {
  LIVE: 'bg-success-bg text-success border-success-bd',
  RECENT: 'bg-success-bg text-success border-success-bd',
  ESTIMATE: 'bg-pine/10 text-pine border-pine/25',
  HISTORICAL: 'bg-warn-bg text-warn border-warn-bd',
  UNVERIFIED: 'bg-danger-bg text-danger border-danger-bd',
  UNAVAILABLE: 'bg-paper2 text-inksoft border-line',
};
const PONTO = {
  LIVE: 'bg-success animate-pulse', RECENT: 'bg-success', ESTIMATE: 'bg-pine',
  HISTORICAL: 'bg-warn', UNVERIFIED: 'bg-danger', UNAVAILABLE: 'bg-inksoft',
};

export function SourceTrust({ freshness = 'UNVERIFIED', fonte, data, className = '', compacto = false }) {
  const { t } = useIdioma();
  const k = FRESHNESS_INFO[freshness] ? freshness : 'UNVERIFIED';
  const info = { rotulo: t(`selo.${k}`), explica: t(`selo.${k}_x`) };
  const titulo = [info.explica, fonte && `Fonte: ${fonte}`, data && `Data: ${data}`].filter(Boolean).join(' · ');
  return (
    <span title={titulo} className={`inline-flex items-center gap-1.5 rounded-md border px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-wider leading-none ${ESTILO[freshness] || ESTILO.UNVERIFIED} ${className}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${PONTO[freshness] || PONTO.UNVERIFIED}`} aria-hidden />
      {info.rotulo}{!compacto && data ? <span className="normal-case tracking-normal">· {data}</span> : null}
      <span className="sr-only">{titulo}</span>
    </span>
  );
}
