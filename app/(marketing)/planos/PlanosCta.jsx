'use client';
import { useState } from 'react';
import Link from 'next/link';
import { tokenAtual, usuarioAtual } from '../../_engine/supabase.js';

// Botão de assinar: chama /api/stripe/checkout e redireciona pro Stripe. Se o
// checkout ainda não estiver configurado (503), explica em vez de quebrar.
export function PlanosCta({ plano, label, destaque, freeHref }) {
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState('');

  if (freeHref) {
    return (
      <Link href={freeHref} className="w-full inline-flex items-center justify-center rounded-xl px-4 py-2.5 font-semibold transition focusring border border-line bg-card text-ink hover:text-pine">
        {label}
      </Link>
    );
  }

  async function assinar() {
    setBusy(true); setMsg('');
    try {
      let token = null, user = null;
      try { token = await tokenAtual(); user = await usuarioAtual(); } catch {}
      const r = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'content-type': 'application/json', ...(token ? { authorization: `Bearer ${token}` } : {}) },
        body: JSON.stringify({ plano, userId: user && user.id, email: user && user.email }),
      });
      if (r.status === 503) { setMsg('Checkout em configuração — disponível assim que as chaves do Stripe forem ligadas.'); setBusy(false); return; }
      const d = await r.json().catch(() => ({}));
      if (d.url) { window.location.href = d.url; return; }
      setMsg(d.error || 'Não foi possível iniciar o checkout.');
    } catch {
      setMsg('Falha ao iniciar o checkout.');
    }
    setBusy(false);
  }

  return (
    <div>
      <button onClick={assinar} disabled={busy}
        className={`w-full inline-flex items-center justify-center rounded-xl px-4 py-2.5 font-semibold transition focusring disabled:opacity-60 ${destaque ? 'bg-pine text-white hover:bg-pinedk' : 'border border-line bg-card text-ink hover:text-pine'}`}>
        {busy ? 'Abrindo…' : label}
      </button>
      {msg && <p className="mt-2 text-xs text-inksoft text-center">{msg}</p>}
    </div>
  );
}
