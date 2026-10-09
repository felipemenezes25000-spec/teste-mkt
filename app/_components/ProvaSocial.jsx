'use client';
import { DEPOIMENTOS } from '../_lib/depoimentos.js';
import { useIdioma } from '../_lib/i18n.js';
import { Icon } from '../_ui/Icon.jsx';

// Prova social HONESTA: sinais de confiança VERIFICÁVEIS (sempre visíveis) + uma grade
// de depoimentos que só aparece quando _lib/depoimentos.js tiver entradas REAIS (não
// placeholder). Nada fabricado. O JSON-LD de Review/AggregateRating fica gated no
// page.jsx (só sai com depoimentos reais).

function Depoimentos() {
  const reais = DEPOIMENTOS.filter((d) => d && !d.placeholder && d.texto);
  if (!reais.length) return null;
  return (
    <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {reais.map((d, i) => (
        <figure key={d.autor || d.texto} className="rounded-2xl border border-line bg-card p-5">
          {d.nota ? (
            <div className="text-amberx text-sm flex gap-0.5" role="img" aria-label={`Nota ${d.nota} de 5`}>{Array.from({ length: Math.round(d.nota) }, (_, k) => <Icon key={k} name="star" size={14} />)}</div>
          ) : null}
          <blockquote className="mt-2 text-ink leading-relaxed">“{d.texto}”</blockquote>
          <figcaption className="mt-3 text-sm text-inksoft font-semibold">
            {d.autor}{d.local ? <span className="font-normal"> · {d.local}</span> : null}
          </figcaption>
        </figure>
      ))}
    </div>
  );
}

// `totalPaises` vem do servidor: o catálogo (≈63 KB gz) não vai para o navegador só por um número.
export function ProvaSocial({ totalPaises = 205 }) {
  const { t } = useIdioma();
  const PILARES = [
    { icon: '🤝', titulo: t('prova.neutroTit'), txt: t('prova.neutroTxt') },
    { icon: '🧾', titulo: t('prova.custoTit'), txt: t('prova.custoTxt') },
    { icon: '🌍', titulo: t('prova.mundoTit'), txt: `${totalPaises} ${t('prova.mundoTxt')}` },
  ];
  const STATS = [
    { n: String(totalPaises), l: t('prova.statPaises') },
    { n: '2.000+', l: t('prova.statPontos') },
    { n: '100+', l: t('prova.statMoedas') },
    { n: t('prova.statGratis'), l: t('prova.statGratisL') },
  ];
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 pt-16 sm:pt-20">
      <h2 className="ms-titulo text-[36px] sm:text-[48px] text-ink max-w-3xl">
        {t('prova.titulo')}
      </h2>
      <p className="mt-3 text-inksoft max-w-xl">
        {t('prova.sub')}
      </p>

      <div className="mt-7 grid grid-cols-1 sm:grid-cols-3 gap-4">
        {PILARES.map((p) => (
          <div key={p.titulo} className="rounded-[24px] bg-paper2 p-6">
            <div className="text-3xl" aria-hidden><Icon emoji={p.icon} /></div>
            <h3 className="mt-3 font-display font-bold text-xl text-ink">{p.titulo}</h3>
            <p className="mt-1 text-sm text-inksoft">{p.txt}</p>
          </div>
        ))}
      </div>

      <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-4 rounded-[24px] border border-line px-6 py-6">
        {STATS.map((s) => (
          <div key={s.l}>
            <div className="font-display font-extrabold text-4xl text-ink tracking-[-.03em]">{s.n}</div>
            <div className="text-xs text-inksoft">{s.l}</div>
          </div>
        ))}
      </div>

      <Depoimentos />
    </section>
  );
}
