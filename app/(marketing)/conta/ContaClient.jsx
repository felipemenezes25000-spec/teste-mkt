'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePlano, setDemoPlano, DEMO_HABILITADO } from '../../_lib/usePlano.js';
import { nomePlano } from '../../_lib/planos.js';
import { Icon } from '../../_ui/Icon.jsx';

export function ContaClient() {
  const { plano, serverPlano, demo } = usePlano();
  const [ok, setOk] = useState(false);

  useEffect(() => {
    try { setOk(new URLSearchParams(window.location.search).get('ok') === '1'); } catch {}
  }, []);

  const PREVIEWS = ['', 'free', 'premium', 'pro'];

  return (
    <div className="mt-6 space-y-5">
      {ok && (
        <div className="rounded-xl border border-success-bd bg-success-bg text-success px-4 py-3 text-sm">
          <Icon emoji="✓" /> Assinatura confirmada! Obrigado — seu plano será atualizado em instantes.
        </div>
      )}

      <div className="rounded-2xl border border-line bg-card p-5">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div>
            <div className="text-xs uppercase tracking-wide text-inksoft">Plano atual</div>
            <div className="font-display text-2xl text-ink">
              {nomePlano(plano)}
              {demo && <span className="ml-2 text-xs text-ochre align-middle">(preview)</span>}
            </div>
          </div>
          <Link href="/planos" className="rounded-xl bg-pine text-onpine font-semibold px-4 py-2 hover:bg-pinedk focusring">Mudar de plano</Link>
        </div>
        <p className="mt-2 text-sm text-inksoft">
          Sua assinatura é gerida com segurança pelo Stripe.{' '}
          {serverPlano === 'free' ? 'Você está no plano grátis.' : `Plano ${nomePlano(serverPlano)} ativo.`}
        </p>
      </div>

      {DEMO_HABILITADO && <div className="rounded-2xl border border-dashed border-line bg-paper2/40 p-5">
        <div className="text-sm font-semibold text-ink"><Icon emoji="👀" /> Pré-visualizar planos (demo)</div>
        <p className="text-xs text-inksoft mt-1">Veja como ficam os recursos premium sem pagar — não altera sua assinatura real.</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {PREVIEWS.map((p) => {
            const ativo = p ? demo === p : !demo;
            return (
              <button key={p || 'real'} onClick={() => setDemoPlano(p)}
                className={`text-xs font-semibold px-3 py-1.5 rounded-lg border focusring ${ativo ? 'bg-pine text-onpine border-pine' : 'border-line bg-card text-inksoft hover:text-pine'}`}>
                {p ? `Preview ${nomePlano(p)}` : 'Usar plano real'}
              </button>
            );
          })}
        </div>
      </div>}
    </div>
  );
}
