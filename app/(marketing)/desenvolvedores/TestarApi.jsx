'use client';
import { useState } from 'react';
import { useIdioma } from '../../_lib/i18n.js';
import { Icon } from '../../_ui/Icon.jsx';

const EXEMPLOS = [
  '/api/v1/destinos?month=11&max_cost=60&limit=3',
  '/api/v1/destinos/JP',
  '/api/v1/custo?code=PT&days=10&style=medio&travelers=2',
  '/api/v1/visto?code=JP&passport=BR',
];

// Chamada real à API (mesma origem) para ver a resposta e os cabeçalhos de limite.
export function TestarApi() {
  const { t } = useIdioma();
  const [url, setUrl] = useState(EXEMPLOS[0]);
  const [res, setRes] = useState(null);
  const [busy, setBusy] = useState(false);

  async function chamar(e) {
    e.preventDefault();
    if (!url.startsWith('/api/v1/')) return;
    setBusy(true);
    try {
      const r = await fetch(url);
      const corpo = await r.json().catch(() => null);
      setRes({ status: r.status, limite: r.headers.get('x-ratelimit-limit'), resta: r.headers.get('x-ratelimit-remaining'), corpo });
    } catch {
      setRes({ status: 0, corpo: { error: 'network' } });
    }
    setBusy(false);
  }

  return (
    <form onSubmit={chamar} className="rounded-2xl border border-line bg-card p-4 space-y-3" aria-label={t('plat.testar')}>
      <h2 className="eyebrow">{t('plat.testar')}</h2>
      <label className="block text-xs font-medium text-inksoft">URL
        <input value={url} onChange={(e) => setUrl(e.target.value)} className="mt-1 w-full h-10 px-3 rounded-lg border border-line bg-input text-ink text-sm font-mono focusring" />
      </label>
      <div className="flex flex-wrap gap-1.5">
        {EXEMPLOS.map((x) => <button key={x} type="button" onClick={() => setUrl(x)} className="text-[11px] font-mono px-2 py-1 rounded-md border border-line text-inksoft hover:text-ink focusring">{x.replace('/api/v1', '').split('?')[0]}</button>)}
      </div>
      <button type="submit" disabled={busy} className="inline-flex items-center gap-2 h-10 px-4 rounded-lg bg-pine text-onpine text-sm font-semibold disabled:opacity-60 focusring"><Icon name="arrow-right" size={16} /> {t('plat.executar')}</button>
      {res && (
        <div>
          <p className="font-mono text-xs text-inksoft">HTTP {res.status}{res.limite ? ` · ${res.resta}/${res.limite} ${t('plat.restantes')}` : ''}</p>
          <pre className="mt-2 max-h-80 overflow-auto rounded-lg bg-paper2 p-3 text-[11px] leading-relaxed text-ink" tabIndex={0}>{JSON.stringify(res.corpo, null, 2)}</pre>
        </div>
      )}
    </form>
  );
}
