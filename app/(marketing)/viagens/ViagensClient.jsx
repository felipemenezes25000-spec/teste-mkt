'use client';
import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { DESTINOS } from '../../_lib/destinos.js';
import { Autocomplete } from '../../_components/Autocomplete.jsx';
import { useViagens } from '../../_lib/viagens/useViagens.js';
import { novaViagem, adicionarViagem, removerViagem, prontidao } from '../../_lib/viagens/store.js';
import { flagUrl } from '../../_lib/flags.js';
import { Icon } from '../../_ui/Icon.jsx';
import { useConfirm } from '../../_engine/useConfirm.jsx';
import { useIdioma } from '../../_lib/i18n.js';
import { fusoDe } from '../../_lib/viagens/fuso.js';

// "Minhas viagens" (OMEGA V4 §31 / §75 "Minhas viagens"): viagens guardadas NO
// DISPOSITIVO (funciona offline e sem conta). Criar viagem descobre o fuso real do
// destino (Open-Meteo) para horários locais corretos.
const hojeISO = () => new Date().toISOString().slice(0, 10);
const somaDias = (iso, n) => { const d = new Date(iso + 'T00:00:00Z'); d.setUTCDate(d.getUTCDate() + n); return d.toISOString().slice(0, 10); };
const fmtData = (iso, loc = 'pt-BR') => new Date(iso + 'T12:00:00Z').toLocaleDateString(loc, { day: '2-digit', month: 'short', year: 'numeric' });

export function ViagensClient() {
  const { t, tf, locale } = useIdioma();
  const { estado, aplicar, carregando } = useViagens();
  const router = useRouter();
  const { confirm: confirmar, confirmElement: dialogo } = useConfirm();
  const [abrir, setAbrir] = useState(false);
  const [destino, setDestino] = useState(null);
  const [form, setForm] = useState(() => ({ titulo: '', inicio: somaDias(hojeISO(), 30), fim: somaDias(hojeISO(), 43), pessoas: 2, orcamento: '', moeda: 'BRL' }));
  const [erro, setErro] = useState('');
  const [salvando, setSalvando] = useState(false);
  const viagens = estado ? estado.viagens : [];
  const ordenadas = useMemo(() => [...viagens].sort((a, b) => a.inicio.localeCompare(b.inicio)), [viagens]);

  // vindo do simulador da Home (/viagens?destino=JP): abre o formulário com o destino escolhido
  useEffect(() => {
    try {
      const c = new URLSearchParams(window.location.search).get('destino');
      const d = c ? DESTINOS.find((x) => x.code === c.toUpperCase()) : null;
      if (d) { setDestino(d); setAbrir(true); } // eslint-disable-line react-hooks/set-state-in-effect
    } catch { /* sem parâmetro */ }
  }, []);

  function exemploJapao() {
    const jp = DESTINOS.find((d) => d.code === 'JP');
    setDestino(jp);
    setForm({ titulo: t('v2.exTitulo'), inicio: somaDias(hojeISO(), 45), fim: somaDias(hojeISO(), 58), pessoas: 2, orcamento: '18000', moeda: 'BRL' });
    setAbrir(true);
  }

  async function criar(e) {
    e.preventDefault();
    setErro('');
    if (!destino) { setErro(t('viag.escolha')); return; }
    setSalvando(true);
    const tz = await fusoDe(destino.coords);
    let id = null;
    const r = aplicar((s) => {
      const v = novaViagem({ ...form, titulo: form.titulo || `${destino.nome}`, destinoCode: destino.code, destinoNome: destino.nome, timeZone: tz });
      id = v.id;
      return adicionarViagem(s, v);
    });
    setSalvando(false);
    if (r.erro) { setErro(r.erro); return; }
    router.push(`/viagens/${id}`);
  }

  async function excluir(v) {
    if (await confirmar({ title: tf('viag.excluirT', { t: v.titulo }), message: t('viag.excluirM'), confirmLabel: t('viag.excluirC') })) {
      aplicar((s) => removerViagem(s, v.id));
    }
  }

  const field = 'mt-1.5 w-full h-11 px-3 rounded-lg border border-line bg-input text-ink focusring text-sm';

  return (
    <div className="space-y-8">
      {dialogo}
      <div className="flex flex-wrap items-center gap-3">
        <button type="button" onClick={() => setAbrir((v) => !v)} aria-expanded={abrir}
          className="inline-flex items-center gap-2 h-11 px-5 rounded-lg bg-coral text-oncoral font-semibold hover:brightness-95 focusring">
          <Icon name="plus" size={18} /> {t('viag.nova')}
        </button>
        <button type="button" onClick={exemploJapao} className="inline-flex items-center gap-2 h-11 px-4 rounded-lg border border-line bg-card text-ink font-medium hover:border-pine/50 focusring">
          <Icon name="spark" size={17} /> {t('viag.exemplo')}
        </button>
        <span className="text-xs text-inksoft flex items-center gap-1.5"><Icon name="phone" size={14} /> {t('viag.local')}</span>
      </div>

      {abrir && (
        <form onSubmit={criar} className="rounded-2xl border border-line bg-card p-5 sm:p-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-6 rise" aria-label={t('viag.criar')}>
          <div className="sm:col-span-2 lg:col-span-2">
            <span className="text-xs font-medium text-inksoft">{t('viag.destino')}</span>
            <Autocomplete items={DESTINOS} value={destino} onChange={setDestino} toText={(d) => d.nome} toKey={(d) => d.code} toRight={(d) => d.regiao}
              placeholder={t('viag.paisDestino')} className="mt-1.5" />
          </div>
          <label className="text-xs font-medium text-inksoft sm:col-span-2 lg:col-span-2">{t('viag.nome')}
            <input value={form.titulo} onChange={(e) => setForm({ ...form, titulo: e.target.value })} placeholder={destino ? destino.nome : t('v2.exNome')} className={field} maxLength={120} />
          </label>
          <label className="text-xs font-medium text-inksoft">{t('viag.ida')}
            <input type="date" required value={form.inicio} onChange={(e) => setForm({ ...form, inicio: e.target.value })} className={field} />
          </label>
          <label className="text-xs font-medium text-inksoft">{t('viag.volta')}
            <input type="date" required min={form.inicio} value={form.fim} onChange={(e) => setForm({ ...form, fim: e.target.value })} className={field} />
          </label>
          <label className="text-xs font-medium text-inksoft">{t('viag.pessoas')}
            <input type="number" min="1" max="20" value={form.pessoas} onChange={(e) => setForm({ ...form, pessoas: e.target.value })} className={`${field} tnum`} />
          </label>
          <label className="text-xs font-medium text-inksoft">{t('viag.orcamento')}
            <input type="number" min="0" step="100" value={form.orcamento} onChange={(e) => setForm({ ...form, orcamento: e.target.value })} placeholder={t('viag.opcional')} className={`${field} tnum`} />
          </label>
          <label className="text-xs font-medium text-inksoft">{t('viag.moeda')}
            <select value={form.moeda} onChange={(e) => setForm({ ...form, moeda: e.target.value })} className={field}>
              {['BRL', 'USD', 'EUR'].map((m) => <option key={m}>{m}</option>)}
            </select>
          </label>
          <div className="sm:col-span-2 lg:col-span-3 flex items-end gap-3">
            <button type="submit" disabled={salvando} className="inline-flex items-center gap-2 h-11 px-5 rounded-lg bg-pine text-onpine font-semibold hover:bg-pinedk disabled:opacity-60 focusring">
              {salvando ? t('viag.criando') : t('viag.criar')} <Icon name="arrow-right" size={17} />
            </button>
            {erro && <p role="alert" className="text-sm text-danger">{erro}</p>}
          </div>
        </form>
      )}

      {carregando ? (
        <div className="grid sm:grid-cols-2 gap-4">{[0, 1].map((i) => <div key={i} className="h-40 rounded-2xl skel" />)}</div>
      ) : ordenadas.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-line bg-card p-10 text-center">
          <Icon name="suitcase" size={30} className="text-pine" />
          <h2 className="mt-3 font-display text-2xl text-ink">{t('viag.nenhuma')}</h2>
          <p className="mt-2 text-sm text-inksoft max-w-md mx-auto">{t('viag.nenhumaTxt')}</p>
          <div className="mt-5 flex flex-wrap justify-center gap-3">
            <button type="button" onClick={() => setAbrir(true)} className="inline-flex items-center gap-2 h-11 px-5 rounded-lg bg-coral text-oncoral font-semibold focusring"><Icon name="plus" size={18} /> {t('viag.primeira')}</button>
            <Link href="/decisao" className="inline-flex items-center gap-2 h-11 px-4 rounded-lg border border-line text-ink font-medium focusring"><Icon name="target" size={17} /> {t('viag.naoSei')}</Link>
          </div>
        </div>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {ordenadas.map((v) => {
            const p = prontidao(v);
            const faltam = Math.ceil((Date.parse(v.inicio) - Date.parse(hojeISO())) / 86400000);
            const emCurso = hojeISO() >= v.inicio && hojeISO() <= v.fim;
            return (
              <li key={v.id} className="rounded-2xl border border-line bg-card overflow-hidden flex flex-col">
                <Link href={`/viagens/${v.id}`} className="block p-5 hover:bg-paper2/50 focusring flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="eyebrow flex items-center gap-2">
                      {flagUrl(v.destinoCode) && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={flagUrl(v.destinoCode)} alt="" width="18" height="13" className="rounded-[2px] ring-1 ring-line" />
                      )}
                      {v.destinoNome}
                    </span>
                    <span className={`font-mono text-[11px] px-2 py-0.5 rounded ${emCurso ? 'bg-coral text-oncoral' : 'bg-paper2 text-inksoft'}`}>
                      {emCurso ? t('viag.emViagem') : faltam > 0 ? tf('viag.emDias', { n: faltam }) : t('viag.concluida')}
                    </span>
                  </div>
                  <h3 className="mt-2 font-display text-2xl text-ink leading-tight">{v.titulo}</h3>
                  <p className="mt-1 text-sm text-inksoft">{fmtData(v.inicio, locale)} → {fmtData(v.fim, locale)} · {tf('v2.resumoViagem', { d: v.dias.length, p: `${v.pessoas} ${v.pessoas > 1 ? t('viag.pessoasPl') : t('viag.pessoa')}` })}</p>
                  <div className="mt-4">
                    <div className="flex items-center justify-between text-xs text-inksoft"><span>{t('viag.prontidao')}</span><span className="font-mono text-ink">{p.nota}%</span></div>
                    <div className="mt-1.5 h-1.5 rounded-full bg-paper2 overflow-hidden"><div className="h-full bg-pine gauge-fill" style={{ width: `${p.nota}%` }} /></div>
                    {p.faltando[0] && <p className="mt-2 text-xs text-inksoft">{t('v2.proximo')}: <span className="text-ink">{t(`v2.ck.${p.faltando[0].cod}`)}</span></p>}
                  </div>
                </Link>
                <div className="flex border-t border-line">
                  <Link href={`/viagens/${v.id}/hoje`} className="flex-1 inline-flex items-center justify-center gap-1.5 h-11 text-sm font-medium text-ink hover:bg-paper2 focusring"><Icon name="compass" size={16} /> {t('viag.modo')}</Link>
                  <button type="button" onClick={() => excluir(v)} className="inline-flex items-center justify-center gap-1.5 h-11 px-4 text-sm text-inksoft hover:text-danger border-l border-line focusring" aria-label={`Excluir ${v.titulo}`}><Icon name="trash" size={16} /></button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
