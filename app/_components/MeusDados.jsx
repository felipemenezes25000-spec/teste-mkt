'use client';
import { useState } from 'react';
import { dadosLocais, apagarDadosLocais, pacoteExportacao } from '../_lib/meusDados.js';
import { supabase, supabaseConfigurado, tokenAtual } from '../_engine/supabase.js';
import { useConfirm } from '../_engine/useConfirm.jsx';
import { Icon } from '../_ui/Icon.jsx';
import { useIdioma } from '../_lib/i18n.js';

// Privacidade e LGPD (art. 18): acesso/portabilidade (exportar), eliminação local e
// exclusão da conta. Tudo executa de verdade — nada de botão decorativo.
export function MeusDados() {
  const { t, tf } = useIdioma();
  const [msg, setMsg] = useState(null);
  const { confirm, confirmElement } = useConfirm();

  async function exportar() {
    setMsg({ tom: 'info', txt: t('dados.preparando') });
    let conta = null;
    try {
      const token = await tokenAtual();
      if (token) {
        const r = await fetch('/api/me/export', { headers: { authorization: `Bearer ${token}` } });
        conta = r.ok ? (await r.json()).conta : { erro: `HTTP ${r.status}` };
      }
    } catch (e) { conta = { erro: String(e.message || e) }; }
    const blob = new Blob([JSON.stringify(pacoteExportacao({ local: dadosLocais(), conta }), null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `mundo-sem-fim-meus-dados-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 2000);
    setMsg({ tom: 'ok', txt: conta ? t('dados.okConta') : t('dados.okLocal') });
  }

  async function apagarLocal() {
    if (!(await confirm({ title: t('v2.apagarT'), message: t('v2.apagarM'), confirmLabel: t('v2.apagarC') }))) return;
    const n = apagarDadosLocais();
    setMsg({ tom: 'ok', txt: tf('dados.apagados', { n }) });
  }

  async function excluirConta() {
    if (!(await confirm({ title: t('v2.excluirT'), message: t('v2.excluirM'), confirmLabel: t('v2.excluirC') }))) return;
    const { error } = await supabase.rpc('excluir_minha_conta');
    if (error) { setMsg({ tom: 'erro', txt: tf('v2.excluirErro', { e: error.message }) }); return; }
    await supabase.auth.signOut();
    setMsg({ tom: 'ok', txt: t('dados.excluida') });
  }

  return (
    <section className="rounded-2xl border border-line bg-card p-5" aria-labelledby="dados-h">
      {confirmElement}
      <div className="eyebrow">{t('dados.ey')}</div>
      <h2 id="dados-h" className="mt-1 font-display text-2xl text-ink">{t('dados.h')}</h2>
      <p className="mt-1 text-sm text-inksoft">{t('dados.p')}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        <button type="button" onClick={exportar} className="inline-flex items-center gap-2 h-10 px-4 rounded-full bg-ink text-white text-[15px] font-cond font-extrabold uppercase tracking-[.05em] focusring"><Icon name="download" size={16} /> {t('dados.exportar')}</button>
        <button type="button" onClick={apagarLocal} className="inline-flex items-center gap-2 h-10 px-4 rounded-lg border border-line text-sm text-ink hover:border-danger-bd focusring"><Icon name="trash" size={16} /> {t('dados.apagar')}</button>
        {supabaseConfigurado && <button type="button" onClick={excluirConta} className="inline-flex items-center gap-2 h-10 px-4 rounded-lg border border-danger-bd bg-danger-bg text-danger text-sm font-semibold focusring"><Icon name="x-circle" size={16} /> {t('dados.excluir')}</button>}
      </div>
      {msg && <p role="status" className={`mt-3 text-sm ${msg.tom === 'erro' ? 'text-danger' : msg.tom === 'ok' ? 'text-success' : 'text-inksoft'}`}>{msg.txt}</p>}
    </section>
  );
}
