'use client';
import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { supabase } from '../_engine/supabase.js';
import { decodificarPublico } from '../_lib/plataforma/proposta.js';
import { varsDaMarca } from '../_lib/plataforma/marca.js';
import { fmtMinor } from '../_lib/plataforma/produtos.js';
import { destinoPorCode } from '../_lib/destinos.js';
import { useIdioma } from '../_lib/i18n.js';
import { Icon } from '../_ui/Icon.jsx';

const fmtData = (iso, loc) => (iso ? new Date(iso + 'T12:00:00Z').toLocaleDateString(loc, { day: '2-digit', month: 'short', year: 'numeric' }) : '—');

export function PropostaClient() {
  const { t, locale } = useIdioma();
  const params = useSearchParams();
  const token = params.get('t');
  const [p, setP] = useState(undefined);
  const [origem, setOrigem] = useState(null); // 'conta' | 'link'
  const [resposta, setResposta] = useState(null);

  useEffect(() => {
    let vivo = true;
    (async () => {
      if (token && /^[0-9a-f-]{36}$/i.test(token) && supabase) {
        const { data } = await supabase.rpc('proposta_publica', { p_token: token });
        if (!vivo) return;
        if (data) {
          setOrigem('conta');
          setP({
            titulo: data.titulo, cliente: data.cliente, destino: data.destino, inicio: data.inicio, fim: data.fim, pessoas: data.pessoas,
            moeda: data.moeda, precoMinor: data.preco_minor, validaAte: data.valida_ate, status: data.status, itens: data.itens || [],
            marca: data.agencia ? { ...(data.agencia.marca || {}), nomeExibido: (data.agencia.marca && data.agencia.marca.nomeExibido) || data.agencia.nome } : null,
          });
          return;
        }
        setP(null);
        return;
      }
      lerHash();
    })();
    // o link direto mora no fragmento (#): trocar de link na mesma aba não recarrega a página
    function lerHash() {
      if (!vivo || token) return;
      const d = decodificarPublico(window.location.hash.slice(1));
      setOrigem(d ? 'link' : null);
      setP(d);
    }
    window.addEventListener('hashchange', lerHash);
    return () => { vivo = false; window.removeEventListener('hashchange', lerHash); };
  }, [token]);

  const tema = useMemo(() => varsDaMarca(p && p.marca ? p.marca : {}), [p]);

  async function responder(aceita) {
    if (origem !== 'conta') return;
    const { data } = await supabase.rpc('responder_proposta', { p_token: token, p_aceita: aceita });
    setResposta(data || 'indisponivel');
  }

  if (p === undefined) return <main className="min-h-screen grid place-items-center text-inksoft text-sm">{t('plat.carregando')}</main>;
  if (!p) return (
    <main className="min-h-screen grid place-items-center px-4">
      <div className="max-w-md text-center">
        <Icon name="alert" size={28} className="mx-auto text-inksoft" />
        <h1 className="mt-3 font-display text-2xl text-ink">{t('plat.propInvalida')}</h1>
        <p className="mt-2 text-sm text-inksoft">{t('plat.propInvalidaP')}</p>
      </div>
    </main>
  );

  const m = tema.marca;
  const dest = p.destino ? destinoPorCode(p.destino) : null;
  const dias = [...new Set(p.itens.map((i) => i.dia))].sort((a, b) => a - b);
  const expirada = p.validaAte && p.validaAte < new Date().toISOString().slice(0, 10);
  const status = resposta || p.status;
  return (
    <div className="min-h-screen bg-paper" style={tema.style}>
      <header className="px-4 sm:px-8 py-4 flex items-center gap-3" style={{ background: 'rgb(var(--c-marca))', color: 'rgb(var(--c-on-marca))' }}>
        {m.logoUrl && <img src={m.logoUrl} alt="" className="h-8 w-auto" referrerPolicy="no-referrer" />}
        <span className="font-display text-xl">{m.nomeExibido}</span>
      </header>
      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
        <p className="eyebrow">{t('plat.propPara')} {p.cliente}</p>
        <h1 className="mt-2 font-display text-4xl sm:text-5xl tracking-tightest leading-[1] text-ink">{p.titulo}</h1>
        <p className="mt-3 text-inksoft">{[dest ? dest.nome : p.destinoNome, p.inicio ? `${fmtData(p.inicio, locale)} → ${fmtData(p.fim, locale)}` : '', `${p.pessoas} ${p.pessoas > 1 ? t('viag.pessoasPl') : t('viag.pessoa')}`].filter(Boolean).join(' · ')}</p>

        <section className="mt-8 rounded-2xl border border-line bg-card p-5 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs text-inksoft">{t('plat.investimento')}</p>
            <p className="font-display text-4xl text-pine">{fmtMinor(p.precoMinor, p.moeda, locale)}</p>
            <p className="text-xs text-inksoft">{t('plat.totalGrupo')}{p.validaAte ? ` · ${t('plat.validaAte')} ${fmtData(p.validaAte, locale)}` : ''}</p>
          </div>
          {origem === 'conta' && status === 'enviada' && !expirada && (
            <div className="flex gap-2">
              <button type="button" onClick={() => responder(true)} className="h-11 px-5 rounded-full bg-ink text-white font-cond font-extrabold uppercase tracking-[.05em] focusring">{t('plat.aceitar')}</button>
              <button type="button" onClick={() => responder(false)} className="h-11 px-4 rounded-lg border border-line text-ink focusring">{t('plat.recusar')}</button>
            </div>
          )}
          {origem === 'conta' && status !== 'enviada' && <p role="status" className="font-semibold text-ink">{t(`plat.ps_${status}`)}</p>}
          {expirada && status === 'enviada' && <p className="text-sm text-warn">{t('plat.ps_expirada')}</p>}
        </section>
        {origem === 'link' && <p className="mt-3 text-xs text-inksoft">{t('plat.linkSemAceite')}</p>}

        <section className="mt-8 space-y-3" aria-label={t('plat.itens')}>
          {dias.map((d) => (
            <div key={d} className="rounded-2xl border border-line bg-card p-4">
              <p className="font-mono text-xs text-inksoft">{t('ws.dia')} {String(d).padStart(2, '0')}</p>
              <ul className="mt-2 space-y-2">
                {p.itens.filter((i) => i.dia === d).map((i, k) => (
                  <li key={k} className="text-sm"><span className="text-ink font-medium">{i.titulo}</span> <span className="text-inksoft">· {t(`plat.ti_${i.tipo}`)}</span>{i.descricao && <span className="block text-inksoft">{i.descricao}</span>}</li>
                ))}
              </ul>
            </div>
          ))}
        </section>
        {m.rodape && <p className="mt-10 text-xs text-inksoft">{m.rodape}</p>}
        <p className="mt-4 text-[11px] text-inksoft">{t('plat.feitoCom')}</p>
      </main>
    </div>
  );
}
