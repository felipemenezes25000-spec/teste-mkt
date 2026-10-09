'use client';
import { useIdioma } from '../_lib/i18n.js';
import { Icon } from '../_ui/Icon.jsx';

export function OQueNinguemConta({ dicas = [] }) {
  const { idioma, t } = useIdioma();
  return (
    <section aria-labelledby="oque-ninguem-conta-titulo">
      <h2 id="oque-ninguem-conta-titulo" className="font-display text-2xl text-ink mb-3"><Icon emoji="🤫" /> {t('destino.oqueTitulo')}</h2>
      <p className="text-sm text-inksoft mb-2 max-w-2xl">{t('destino.oqueP')}</p>
      {idioma !== 'pt' && (
        <p className="text-[11px] text-inksoft mb-4 max-w-2xl italic"><Icon emoji="📝" /> {t('destino.oqueNotaIdioma')}</p>
      )}
      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {dicas.map((d, i) => (
          <li key={i} className="rounded-2xl border border-line bg-card p-4 flex gap-3">
            <span aria-hidden className="text-xl shrink-0"><Icon emoji={d.icon} /></span>
            <p className="text-sm text-ink leading-snug">{d.txt}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
