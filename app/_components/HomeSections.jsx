'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { track } from '../_lib/analytics.js';
import { useIdioma } from '../_lib/i18n.js';
import { HOME_PROBLEMAS, HOME_FATORES, HOME_COMPARACAO, HOME_FAQ } from '../_lib/homeContent.js';
import { Icon } from '../_ui/Icon.jsx';

// Seções editoriais da Home: cada uma reage ao idioma via useIdioma() + arrays
// em homeContent.js. Sem chave duplicada: fallback automático pra pt quando
// a tradução faltar.

function lista(dict, idioma) { return dict[idioma] || dict.pt; }

export function HomeSecaoProblema() {
  const { idioma, t } = useIdioma();
  const itens = lista(HOME_PROBLEMAS, idioma);
  return (
    <section className="bg-paper2/40 border-y border-line">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <div className="max-w-3xl">
          <span className="inline-block text-[11px] font-bold uppercase tracking-[0.18em] text-clay">{t('home.problemaSelo')}</span>
          <h2 className="mt-3 font-display text-3xl sm:text-4xl text-ink leading-[1.08]">{t('home.problemaH2')}</h2>
          <p className="mt-3 text-inksoft">{t('home.problemaP')}</p>
        </div>
        <ul className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {itens.map((p) => (
            <li key={p.txt} className="rounded-2xl border border-line bg-card p-4 flex gap-3">
              <span aria-hidden className="text-xl shrink-0"><Icon emoji={p.icon} /></span>
              <p className="text-sm text-ink leading-snug">{p.txt}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export function HomeSecaoComoDecide() {
  const { idioma, t } = useIdioma();
  const itens = lista(HOME_FATORES, idioma);
  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-14">
      <div className="text-center max-w-2xl mx-auto">
        <span className="inline-block text-[11px] font-bold uppercase tracking-[0.18em] text-pine">{t('home.comoDecidoSelo')}</span>
        <h2 className="mt-3 font-display text-3xl sm:text-4xl text-ink leading-[1.08]">{t('home.comoDecidoH2')}</h2>
        <p className="mt-3 text-inksoft">{t('home.comoDecidoP')}</p>
      </div>
      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {itens.map((f) => (
          <div key={f.titulo} className="rounded-2xl border border-line bg-card p-4">
            <h3 className="font-display text-lg text-ink">{f.titulo}</h3>
            <p className="mt-1 text-sm text-inksoft leading-snug">{f.txt}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export function HomeSecaoCustoReal() {
  const { t } = useIdioma();
  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-14">
      <div className="rounded-3xl border border-line bg-card p-6 sm:p-10 shadow-[var(--e-1)]">
        <div className="grid lg:grid-cols-[1.05fr_1fr] gap-8 items-start">
          <div>
            <span className="inline-block text-[11px] font-bold uppercase tracking-[0.18em] text-pine">{t('home.custoRealSelo')}</span>
            <h2 className="mt-3 font-display text-3xl sm:text-4xl text-ink leading-[1.08]">{t('home.custoRealH2')}</h2>
            <p className="mt-3 text-inksoft">{t('home.custoRealP')}</p>
            <Link href="/custo-real" className="mt-5 inline-flex items-center gap-2 rounded-xl bg-coral text-oncoral font-semibold px-4 py-2.5 hover:brightness-95 focusring">
              {t('home.custoRealCTA')} <Icon emoji="→" />
            </Link>
          </div>
          <div className="grid gap-3">
            <div className="rounded-2xl border border-line bg-paper2/60 p-4">
              <div className="text-[11px] font-bold uppercase tracking-wide text-inksoft">{t('home.vitrineLabel')}</div>
              <div className="mt-1 text-xs text-inksoft">{t('home.vitrineSub')}</div>
              <div className="mt-2 font-display text-3xl text-ink tnum">R$ 4.900</div>
            </div>
            <div className="rounded-2xl border border-warn-bd bg-warn-bg p-4">
              <div className="text-[11px] font-bold uppercase tracking-wide text-warn">{t('home.escondidoLabel')}</div>
              <div className="mt-1 text-xs text-warn">{t('home.escondidoSub')}</div>
              <div className="mt-2 font-display text-3xl text-warn tnum">R$ 7.280</div>
            </div>
            <div className="rounded-2xl border border-danger-bd bg-danger-bg p-4">
              <div className="text-[11px] font-bold uppercase tracking-wide text-danger">{t('home.diferencaLabel')}</div>
              <div className="mt-1 text-xs text-danger">{t('home.diferencaSub')}</div>
              <div className="mt-2 font-display text-3xl text-danger tnum">+ R$ 2.380</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function HomeSecaoOtas() {
  const { idioma, t } = useIdioma();
  const itens = lista(HOME_COMPARACAO, idioma);
  return (
    <section className="bg-paper2/40 border-y border-line">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-14">
        <div className="text-center max-w-2xl mx-auto">
          <span className="inline-block text-[11px] font-bold uppercase tracking-[0.18em] text-pine">{t('home.otasSelo')}</span>
          <h2 className="mt-3 font-display text-3xl sm:text-4xl text-ink leading-[1.08]">{t('home.otasH2')}</h2>
          <p className="mt-3 text-inksoft">{t('home.otasP')}</p>
        </div>
        <div className="mt-8 overflow-x-auto rounded-3xl border border-line bg-card shadow-[var(--e-1)]">
          <table className="w-full min-w-[640px] text-sm">
            <thead>
              <tr className="border-b border-line text-left text-xs uppercase tracking-wide text-inksoft">
                <th className="px-4 py-3">{t('home.otasFerramenta')}</th>
                <th className="px-4 py-3">{t('home.otasFaz')}</th>
                <th className="px-4 py-3">{t('home.otasPara')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {itens.map((c) => (
                <tr key={c.rotulo} className={c.destaque ? 'bg-pine/[0.06]' : ''}>
                  <td className="px-4 py-3">
                    <span className={`font-display text-lg ${c.destaque ? 'text-pine' : 'text-ink'}`}>{c.rotulo}</span>
                    {c.destaque && (
                      <span className="ml-2 align-middle text-[10px] font-bold uppercase tracking-wide bg-pine text-onpine rounded-full px-2 py-0.5">
                        {t('home.otasChip')}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-ink">{c.papel}</td>
                  <td className="px-4 py-3 text-inksoft">{c.frase}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

export function HomeSecaoFaq() {
  const [aberto, setAberto] = useState(0);
  const { idioma, t } = useIdioma();
  const itens = lista(HOME_FAQ, idioma);
  return (
    <section className="max-w-3xl mx-auto px-4 sm:px-6 py-12 sm:py-14">
      <div className="text-center">
        <span className="inline-block text-[11px] font-bold uppercase tracking-[0.18em] text-pine">{t('home.faqSelo')}</span>
        <h2 className="mt-3 font-display text-3xl sm:text-4xl text-ink leading-[1.08]">{t('home.faqH2')}</h2>
      </div>
      <ul className="mt-8 space-y-2">
        {itens.map((item, i) => {
          const isOpen = aberto === i;
          return (
            <li key={item.q} className="rounded-2xl border border-line bg-card overflow-hidden">
              <button
                type="button"
                onClick={() => setAberto(isOpen ? -1 : i)}
                aria-expanded={isOpen}
                aria-controls={`faq-${i}`}
                className="w-full px-4 sm:px-5 py-4 flex items-center justify-between gap-3 text-left focusring"
              >
                <span className="font-display text-lg text-ink">{item.q}</span>
                <span aria-hidden className={`shrink-0 w-7 h-7 grid place-items-center rounded-full border border-line text-ink transition ${isOpen ? 'rotate-45' : ''}`}>+</span>
              </button>
              {isOpen && (
                <div id={`faq-${i}`} className="px-4 sm:px-5 pb-4 -mt-1 text-sm text-inksoft leading-relaxed">{item.a}</div>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}

// A/B test do CTA final. Variante é sticky por usuário (localStorage) — não
// muda entre visitas. SSR seguro: renderiza A no servidor + remonta a variante
// real no client após hydrate.

const AB_KEY = 'mundosemfim.ab.cta-home.v1';

function lerVariante() {
  try {
    const salvo = localStorage.getItem(AB_KEY);
    if (salvo === 'A' || salvo === 'B') return salvo;
  } catch {}
  const escolhida = Math.random() < 0.5 ? 'A' : 'B';
  try { localStorage.setItem(AB_KEY, escolhida); } catch {}
  return escolhida;
}

export function HomeSecaoCtaFinal() {
  const [variante, setVariante] = useState('A');
  const [hidratado, setHidratado] = useState(false);
  const { t } = useIdioma();

  useEffect(() => {
    setVariante(lerVariante());
    setHidratado(true);
  }, []);

  useEffect(() => {
    let marc50 = false, marc90 = false;
    try {
      marc50 = sessionStorage.getItem('ms_scroll_50') === '1';
      marc90 = sessionStorage.getItem('ms_scroll_90') === '1';
    } catch {}
    if (marc50 && marc90) return;

    const onScroll = () => {
      const h = document.documentElement;
      const total = h.scrollHeight - window.innerHeight;
      if (total <= 0) return;
      const pct = window.scrollY / total;
      if (!marc50 && pct >= 0.5) {
        marc50 = true;
        try { sessionStorage.setItem('ms_scroll_50', '1'); } catch {}
        track('home_scroll_50', {});
      }
      if (!marc90 && pct >= 0.9) {
        marc90 = true;
        try { sessionStorage.setItem('ms_scroll_90', '1'); } catch {}
        track('home_scroll_90', {});
      }
      if (marc50 && marc90) window.removeEventListener('scroll', onScroll);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const labelA = `${t('home.ctaFinalCalcular')}`;
  const labelB = `${t('home.ctaFinalDescobrir')}`;
  const cta = { id: variante, label: variante === 'B' ? labelB : labelA };

  function onClick() {
    track('cta_home_final_click', { variante: cta.id });
  }

  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
      <div data-theme="dark" className="relative overflow-hidden rounded-2xl bg-paper text-ink border border-line p-8 sm:p-14 text-center shadow-e2">
        <div className="absolute inset-0 pointer-events-none" aria-hidden style={{ backgroundImage: 'linear-gradient(rgb(var(--grid-ink) / .08) 1px, transparent 1px), linear-gradient(90deg, rgb(var(--grid-ink) / .08) 1px, transparent 1px)', backgroundSize: '48px 48px' }} />
        <h2 className="relative font-display text-3xl sm:text-5xl tracking-tighter leading-[1.02] max-w-3xl mx-auto">{t('home.ctaFinalH2')}</h2>
        <p className="relative mt-4 text-inksoft max-w-2xl mx-auto">{t('home.ctaFinalP')}</p>
        <div className="relative mt-7 flex flex-wrap gap-3 justify-center">
          <Link
            href="/decisao"
            onClick={onClick}
            data-ab-variante={cta.id}
            className="inline-flex items-center gap-2 rounded-lg bg-coral text-oncoral font-semibold px-5 h-12 hover:brightness-95 focusring"
          >
            {cta.label}
          </Link>
          <Link href="/custo-real" className="inline-flex items-center gap-2 rounded-lg border border-line text-ink font-semibold px-5 h-12 hover:bg-paper2 focusring">
            <Icon name="receipt" size={17} /> {t('home.ctaFinalCusto')}
          </Link>
        </div>
        <p className="relative mt-5 text-xs text-inksoft">{t('home.ctaFinalRodape')}</p>
        {hidratado && (
          <span className="sr-only" data-ab-test="cta-home-final" data-ab-variante={cta.id}>
            Variante {cta.id} ativa
          </span>
        )}
      </div>
    </section>
  );
}
