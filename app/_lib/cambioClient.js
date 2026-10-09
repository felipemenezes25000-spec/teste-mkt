'use client';
import { useEffect, useState } from 'react';
import { buscarCambio } from '../_engine/services.js';
import { SourceTrust } from '../_ui/SourceTrust.jsx';

// Câmbio ao vivo, reusável em qualquer client component. Estratégia:
//   1. SSR/primeiro render → fallback estático (5,40) pra não ter mismatch.
//   2. useEffect hidrata: lê cache localStorage; se < 2h, confia.
//   3. Senão, dispara buscarCambio() (API open.er-api.com) com cache TTL 12h.
//   4. Falha de rede → continua no cache se houver, ou fallback.
// Estados expostos: 'fallback' | 'cache' | 'live' | 'busy'.
//
// O hook é desenhado pra ser barato: a chamada de API só roda uma vez por sessão
// (cache de 2h dispensa refetch dentro do mesmo dia de uso).

export const BRL_FALLBACK = 5.4;
const CACHE_KEY = 'mundosemfim.cambio.cache.v1';
const CACHE_TTL_MS = 12 * 3600 * 1000;
const REFRESH_AGE_MS = 2 * 3600 * 1000;

function lerCache() {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const c = JSON.parse(raw);
    if (!c || !c.brl || !c.atualizadoEm) return null;
    if (Date.now() - c.atualizadoEm > CACHE_TTL_MS) return null;
    return c;
  } catch { return null; }
}
function gravarCache(brl, atualizadoEm) {
  try { localStorage.setItem(CACHE_KEY, JSON.stringify({ brl, atualizadoEm })); } catch {}
}

export function useCambioBRL() {
  // CRÍTICO p/ SSR: o initializer DEVE devolver o mesmo valor no server e na
  // primeira renderização do client (hydration). Por isso sempre começa no
  // FALLBACK — ler o cache aqui faria server (5,40) ≠ client (5,07 do cache) e
  // dispararia hydration mismatch em QUALQUER preço SSR'd (OQueFazer/ComoSeLocomove).
  // O cache e a API entram no useEffect (pós-hydrate), aí o preço atualiza suave.
  const [estado, setEstado] = useState({ brl: BRL_FALLBACK, status: 'fallback', atualizadoEm: null });

  useEffect(() => {
    let vivo = true;
    const c = lerCache();
    if (c) {
      // adota o cache imediatamente após o mount (não no SSR)
      setEstado({ brl: c.brl, status: 'cache', atualizadoEm: c.atualizadoEm });
      if (Date.now() - c.atualizadoEm < REFRESH_AGE_MS) return; // cache fresco → não refetch
    }
    setEstado((s) => ({ ...s, status: 'busy' }));
    buscarCambio().then((fx) => {
      if (!vivo) return;
      const brl = fx?.rates?.BRL;
      if (brl && brl > 0) {
        const at = fx.atualizadoEm || Date.now();
        gravarCache(brl, at);
        setEstado({ brl, status: 'live', atualizadoEm: at });
      } else {
        setEstado((s) => ({ ...s, status: s.brl === BRL_FALLBACK ? 'fallback' : 'cache' }));
      }
    }).catch(() => {
      if (!vivo) return;
      setEstado((s) => ({ ...s, status: s.brl === BRL_FALLBACK ? 'fallback' : 'cache' }));
    });
    return () => { vivo = false; };
  }, []);

  return estado;
}

export function fmtDataCambio(ts) {
  if (!ts) return '';
  try {
    const d = new Date(ts);
    return d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }) + ' ' + d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  } catch { return ''; }
}

// Selo do câmbio com frescor HONESTO (OMEGA V4 §22): a fonte publica uma taxa de
// referência DIÁRIA → 'RECENTE' (com data), nunca "ao vivo". Sem rede → valor fixo
// de referência marcado como ESTIMATIVA. Taxa do cartão/IOF/spread NÃO incluídos.
export function freshnessCambio(estado) {
  if (estado.status === 'fallback') return 'ESTIMATE';
  if (!estado.atualizadoEm) return 'UNVERIFIED';
  return Date.now() - estado.atualizadoEm > 48 * 3600 * 1000 ? 'HISTORICAL' : 'RECENT';
}

export function CambioBadge({ estado, compact = false }) {
  const fr = estado.status === 'busy' && !estado.atualizadoEm ? 'UNVERIFIED' : freshnessCambio(estado);
  const data = estado.atualizadoEm ? fmtDataCambio(estado.atualizadoEm) : estado.status === 'fallback' ? 'valor fixo' : '';
  if (compact) {
    return (
      <span className="inline-flex items-center gap-1.5 text-[11px] text-inksoft" title={`Câmbio de referência (open.er-api.com)${data ? ` · ${data}` : ''} — sem spread do cartão nem IOF`}>
        <span className="font-mono text-ink tnum">R$ {estado.brl.toFixed(2)}/US$</span>
        <SourceTrust freshness={fr} fonte="open.er-api.com (taxa de referência diária)" data={data} compacto />
      </span>
    );
  }
  return (
    <span className="inline-flex flex-wrap items-center gap-2 text-xs text-inksoft">
      <strong className="font-mono font-medium text-ink tnum">US$ 1 = R$ {estado.brl.toFixed(2)}</strong>
      <SourceTrust freshness={fr} fonte="open.er-api.com (taxa de referência diária)" data={data} />
      <span>sem spread do cartão/IOF</span>
    </span>
  );
}
