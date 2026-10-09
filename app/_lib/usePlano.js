'use client';
import { useEffect, useState } from 'react';
import { tokenAtual } from '../_engine/supabase.js';

// Plano efetivo = override de DEMO (preview na /conta) > plano do servidor > free.
// O override é só pra você VER o premium sem pagar; a trava real é server-side.
const DEMO_KEY = 'mundosemfim.plano.demo';

// O preview de planos só existe em desenvolvimento ou quando explicitamente ligado
// (NEXT_PUBLIC_DEMO_PLANOS=1, ex.: ambiente de demonstração). Em produção ele NÃO
// pode liberar recursos pagos: antes qualquer visitante virava Premium gravando uma
// chave no localStorage (bypass de entitlement — OMEGA V4 §34/§44).
export const DEMO_HABILITADO =
  process.env.NODE_ENV !== 'production' || process.env.NEXT_PUBLIC_DEMO_PLANOS === '1';
const EVT = 'msf:plano';

export function lerDemoPlano() {
  if (!DEMO_HABILITADO) return '';
  try { return localStorage.getItem(DEMO_KEY) || ''; } catch { return ''; }
}
export function setDemoPlano(p) {
  if (!DEMO_HABILITADO) return;
  try { if (p) localStorage.setItem(DEMO_KEY, p); else localStorage.removeItem(DEMO_KEY); } catch {}
  try { window.dispatchEvent(new CustomEvent(EVT)); } catch {}
}

export function usePlano() {
  const [serverPlano, setServerPlano] = useState(null); // null = carregando
  const [demo, setDemo] = useState('');

  useEffect(() => {
    setDemo(lerDemoPlano());
    const h = () => setDemo(lerDemoPlano());
    window.addEventListener(EVT, h);

    const ctrl = new AbortController();
    (async () => {
      let token = null;
      try { token = await tokenAtual(); } catch {}
      try {
        const r = await fetch('/api/me/plan', {
          ...(token ? { headers: { authorization: `Bearer ${token}` } } : {}),
          signal: ctrl.signal,
        });
        const d = r.ok ? await r.json() : null;
        setServerPlano((d && d.plano) || 'free');
      } catch (e) {
        if (e.name !== 'AbortError') setServerPlano('free');
      }
    })();

    return () => { ctrl.abort(); window.removeEventListener(EVT, h); };
  }, []);

  const plano = demo || serverPlano || 'free';
  return { plano, carregando: serverPlano === null && !demo, demo, serverPlano: serverPlano || 'free' };
}
