'use client';
import { useState } from 'react';
import { tokenAtual } from '../_engine/supabase.js';
import { track } from '../_lib/analytics.js';
import { useIdioma } from '../_lib/i18n.js';

// Checkout nativo de produtos PRÓPRIOS (Trip Pass, roteiro de criador,
// consultoria). O preço é resolvido no servidor; aqui só mandamos o que comprar.
export function BotaoCheckout({ produto, id = null, rotulo, className = '' }) {
  const { t } = useIdioma();
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState('');

  async function comprar() {
    track('checkout_click', { produto });
    setBusy(true); setMsg('');
    try {
      let token = null;
      try { token = await tokenAtual(); } catch {}
      if (!token) { setMsg(t('plat.loginPagar')); setBusy(false); return; }
      const r = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'content-type': 'application/json', authorization: `Bearer ${token}` },
        body: JSON.stringify({ produto, id }),
      });
      if (r.status === 503) { setMsg(t('plat.checkoutOff')); setBusy(false); return; }
      const d = await r.json().catch(() => ({}));
      if (d.url) { window.location.href = d.url; return; }
      setMsg(d.error || t('plat.checkoutFalhou'));
    } catch {
      setMsg(t('plat.checkoutFalhou'));
    }
    setBusy(false);
  }

  return (
    <div>
      <button type="button" onClick={comprar} disabled={busy}
        className={`w-full inline-flex items-center justify-center gap-2 h-11 rounded-lg bg-coral text-oncoral font-semibold hover:brightness-95 disabled:opacity-60 focusring ${className}`}>
        {busy ? t('plat.abrindo') : rotulo}
      </button>
      {msg && <p role="status" className="mt-2 text-xs text-inksoft text-center">{msg}</p>}
    </div>
  );
}
