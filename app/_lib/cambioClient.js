'use client';
import { useEffect, useState } from 'react';
import { buscarCambio } from '../_engine/services.js';

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
  const [estado, setEstado] = useState(() => {
    if (typeof window === 'undefined') return { brl: BRL_FALLBACK, status: 'fallback', atualizadoEm: null };
    const c = lerCache();
    if (c) return { brl: c.brl, status: 'cache', atualizadoEm: c.atualizadoEm };
    return { brl: BRL_FALLBACK, status: 'fallback', atualizadoEm: null };
  });

  useEffect(() => {
    let vivo = true;
    const c = lerCache();
    if (c && Date.now() - c.atualizadoEm < REFRESH_AGE_MS) return; // cache fresco
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

// Componente pequeno de exibição reutilizável; um "selo" do câmbio com tooltip.
export function CambioBadge({ estado, compact = false }) {
  const ui = {
    live: { dot: '🟢', label: 'ao vivo', cls: 'text-success' },
    cache: { dot: '🟡', label: 'cache', cls: 'text-inksoft' },
    busy: { dot: '⏳', label: 'atualizando…', cls: 'text-inksoft' },
    fallback: { dot: '⚪', label: 'referência (sem internet)', cls: 'text-warn' },
  }[estado.status] || { dot: '⚪', label: '—', cls: 'text-inksoft' };
  if (compact) {
    return (
      <span className={`inline-flex items-center gap-1 text-[11px] ${ui.cls}`} title={estado.atualizadoEm ? `Atualizado ${fmtDataCambio(estado.atualizadoEm)}` : undefined}>
        <span aria-hidden>{ui.dot}</span>
        <span className="tnum">R$ {estado.brl.toFixed(2)}/USD</span>
      </span>
    );
  }
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs ${ui.cls}`}>
      <span aria-hidden>{ui.dot}</span>
      <strong className="text-ink tnum">R$ {estado.brl.toFixed(2)} = US$ 1</strong>
      <span className="opacity-80">{ui.label}{estado.atualizadoEm && estado.status === 'cache' ? ` (${fmtDataCambio(estado.atualizadoEm)})` : ''}</span>
    </span>
  );
}
