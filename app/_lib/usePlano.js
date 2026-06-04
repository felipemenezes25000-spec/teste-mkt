'use client';
import { useEffect, useState } from 'react';
import { tokenAtual } from '../_engine/supabase.js';

// Plano efetivo = override de DEMO (preview na /conta) > plano do servidor > free.
// O override é só pra você VER o premium sem pagar; a trava real é server-side.
const DEMO_KEY = 'mundosemfim.plano.demo';
const EVT = 'msf:plano';

export function lerDemoPlano() {
  try { return localStorage.getItem(DEMO_KEY) || ''; } catch { return ''; }
}
export function setDemoPlano(p) {
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

    (async () => {
      let token = null;
      try { token = await tokenAtual(); } catch {}
      try {
        const r = await fetch('/api/me/plan', token ? { headers: { authorization: `Bearer ${token}` } } : undefined);
        const d = r.ok ? await r.json() : null;
        setServerPlano((d && d.plano) || 'free');
      } catch {
        setServerPlano('free');
      }
    })();

    return () => window.removeEventListener(EVT, h);
  }, []);

  const plano = demo || serverPlano || 'free';
  return { plano, carregando: serverPlano === null && !demo, demo, serverPlano: serverPlano || 'free' };
}
