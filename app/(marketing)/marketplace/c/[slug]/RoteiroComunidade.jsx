'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '../../../../_engine/supabase.js';
import { useIdioma } from '../../../../_lib/i18n.js';
import { destinoPorCode } from '../../../../_lib/destinos.js';
import { fmtMinor } from '../../../../_lib/plataforma/produtos.js';
import { BotaoCheckout } from '../../../../_components/BotaoCheckout.jsx';
import { Icon } from '../../../../_ui/Icon.jsx';
import { AdaptarRoteiro } from '../../AdaptarRoteiro.jsx';

// Roteiro publicado por um criador. O CONTEÚDO só chega se for grátis, se você
// for o autor ou se já comprou — a regra está no banco (RLS), não aqui.
export function RoteiroComunidade({ slug }) {
  const { t, locale } = useIdioma();
  const [r, setR] = useState(undefined);
  const [conteudo, setConteudo] = useState(null);

  useEffect(() => {
    let vivo = true;
    (async () => {
      if (!supabase) { if (vivo) setR(null); return; }
      const { data } = await supabase.from('creator_itineraries').select('id,slug,titulo,destino_code,dias,resumo,preco_minor,moeda,creator_profiles(nome_publico,verificado,bio)').eq('slug', slug).maybeSingle();
      if (!vivo) return;
      setR(data || null);
      if (data) {
        const c = await supabase.from('creator_itinerary_content').select('dias').eq('itinerary_id', data.id).maybeSingle();
        if (vivo) setConteudo(c.data ? c.data.dias : null);
      }
    })();
    return () => { vivo = false; };
  }, [slug]);

  if (r === undefined) return <p className="text-sm text-inksoft">{t('plat.carregando')}</p>;
  if (!r) return (
    <div className="rounded-2xl border border-dashed border-line bg-card p-8 text-center">
      <p className="font-semibold text-ink">{t('plat.naoEncontrado')}</p>
      <Link href="/marketplace" className="mt-3 inline-block text-pine hover:underline focusring rounded">{t('plat.mkEy')}</Link>
    </div>
  );
  const d = destinoPorCode(r.destino_code);
  return (
    <>
      <Link href="/marketplace" className="text-sm text-inksoft hover:text-ink inline-flex items-center gap-1 focusring rounded"><Icon name="arrow-left" size={14} /> {t('plat.mkEy')}</Link>
      <header className="mt-4 mb-8 max-w-3xl">
        <div className="eyebrow mb-3">{t('plat.por')} {r.creator_profiles ? r.creator_profiles.nome_publico : '—'}{r.creator_profiles && r.creator_profiles.verificado ? ` · ${t('plat.verificado')}` : ''}</div>
        <h1 className="font-display text-4xl sm:text-5xl tracking-tightest leading-[1] text-ink">{r.titulo}</h1>
        <p className="mt-3 text-lg text-inksoft">{r.resumo}</p>
        <p className="mt-2 text-sm text-inksoft">{d ? d.nome : r.destino_code} · {r.dias} {t('plat.dias')} · <span className="font-mono text-ink">{r.preco_minor ? fmtMinor(r.preco_minor, r.moeda, locale) : t('plat.gratis')}</span></p>
      </header>
      <div className="grid lg:grid-cols-[1fr_380px] gap-6 items-start">
        <div>
          {conteudo ? (
            <ol className="space-y-3">
              {conteudo.map((dia) => (
                <li key={dia.dia} className="rounded-2xl border border-line bg-card p-4">
                  <span className="font-mono text-xs text-inksoft">{t('ws.dia')} {String(dia.dia).padStart(2, '0')}</span>
                  <ul className="mt-2 space-y-1.5">{(dia.itens || []).map((it, i) => <li key={i} className="text-sm text-ink flex items-center gap-2"><Icon name="pin" size={14} /> {it.titulo}</li>)}</ul>
                </li>
              ))}
            </ol>
          ) : (
            <div className="rounded-2xl border border-line bg-paper2/60 p-6 text-sm text-inksoft flex gap-2"><Icon name="lock" size={17} /> {t('plat.conteudoPago')}</div>
          )}
        </div>
        <aside className="lg:sticky lg:top-24 space-y-4">
          {conteudo ? (
            <AdaptarRoteiro roteiro={{ titulo: r.titulo, destinoCode: r.destino_code, destinoNome: d ? d.nome : r.destino_code, dias: conteudo }} centro={d ? d.coords : null} />
          ) : (
            <div className="rounded-2xl border border-line bg-card p-5 space-y-3">
              <p className="font-display text-2xl text-ink">{fmtMinor(r.preco_minor, r.moeda, locale)}</p>
              <p className="text-sm text-inksoft">{t('plat.compraInfo')}</p>
              <BotaoCheckout produto="roteiro" id={r.id} rotulo={t('plat.comprarRoteiro')} />
            </div>
          )}
        </aside>
      </div>
    </>
  );
}
