'use client';
import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { DESTINOS, destinoPorSlug } from '../../_lib/destinos.js';
import { carregarPlano } from '../../_engine/storage.js';
import { gerarRoteiro } from '../../_engine/services.js';
import { MOEDAS } from '../../_engine/data.js';

const RITMOS = [{ id: 'tranquilo', label: 'Tranquilo' }, { id: 'equilibrado', label: 'Equilibrado' }, { id: 'intenso', label: 'Intenso' }];
const CONFORTOS = [{ id: 'mochila', label: 'Mochila' }, { id: 'médio', label: 'Médio' }, { id: 'conforto', label: 'Conforto' }];
const INTERESSES = ['Cultura', 'Natureza', 'Gastronomia', 'Praia', 'História', 'Aventura', 'Vida noturna', 'Compras'];
const RESTRICOES = ['Nenhuma', 'Vegetariano', 'Vegano', 'Sem glúten', 'Halal', 'Kosher'];
const CAT_ICON = { cultura: '🏛️', natureza: '🌿', gastronomia: '🍽️', praia: '🏖️', compras: '🛍️', 'vida noturna': '🌙', aventura: '⛰️', descanso: '😌', história: '🏺' };

export function RoteiroClient() {
  const sp = useSearchParams();
  const dInicial = sp.get('destino') ? destinoPorSlug(sp.get('destino')) : null;

  const [code, setCode] = useState(dInicial?.code || DESTINOS[0].code);
  const [dias, setDias] = useState(4);
  const [orcamento, setOrcamento] = useState(800);
  const [moeda, setMoeda] = useState(dInicial?.moeda || 'USD');
  const [ritmo, setRitmo] = useState('equilibrado');
  const [conforto, setConforto] = useState('médio');
  const [interesses, setInteresses] = useState([]);
  const [restricao, setRestricao] = useState('Nenhuma');

  const [busy, setBusy] = useState(false);
  const [erro, setErro] = useState('');
  const [roteiro, setRoteiro] = useState(null);

  const destino = DESTINOS.find((d) => d.code === code) || DESTINOS[0];

  const toggleInteresse = (i) => setInteresses((s) => (s.includes(i) ? s.filter((x) => x !== i) : [...s, i]));

  async function gerar() {
    setBusy(true); setErro(''); setRoteiro(null);
    try {
      let ai = {};
      try { ai = carregarPlano().settings.ai; } catch {}
      const out = await gerarRoteiro(
        { destino: destino.nome, dias, orcamento, moeda, ritmo, interesses, restricao: restricao === 'Nenhuma' ? '' : restricao, conforto },
        ai,
      );
      setRoteiro(out);
    } catch (e) {
      setErro(e.message || 'Falha ao gerar o roteiro.');
    } finally {
      setBusy(false);
    }
  }

  const field = 'w-full px-3 py-2 rounded-lg border border-line bg-input text-ink focusring text-sm';

  return (
    <div className="mt-6">
      <div className="rounded-2xl border border-line bg-card p-5 space-y-4">
        <div className="grid sm:grid-cols-2 gap-3">
          <label className="text-xs text-inksoft font-medium">Destino
            <select value={code} onChange={(e) => { const c = e.target.value; setCode(c); const dd = DESTINOS.find((x) => x.code === c); if (dd) setMoeda(dd.moeda); }} className={`${field} mt-1`}>
              {DESTINOS.map((d) => <option key={d.code} value={d.code}>{d.nome}</option>)}
            </select>
          </label>
          <div className="grid grid-cols-2 gap-3">
            <label className="text-xs text-inksoft font-medium">Dias
              <input type="number" min={1} max={10} value={dias} onChange={(e) => setDias(Math.max(1, Math.min(10, Number(e.target.value) || 1)))} className={`${field} mt-1 tnum`} />
            </label>
            <label className="text-xs text-inksoft font-medium">Orçamento
              <div className="flex gap-1 mt-1">
                <input type="number" min={0} value={orcamento} onChange={(e) => setOrcamento(Math.max(0, Number(e.target.value) || 0))} className={`${field} tnum`} />
                <select value={moeda} onChange={(e) => setMoeda(e.target.value)} aria-label="Moeda" className="px-2 rounded-lg border border-line bg-input text-ink focusring text-xs">
                  {MOEDAS.map((m) => <option key={m.code} value={m.code}>{m.code}</option>)}
                </select>
              </div>
            </label>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-3">
          <div>
            <div className="text-xs text-inksoft font-medium mb-1">Ritmo</div>
            <Segmented options={RITMOS} value={ritmo} onChange={setRitmo} />
          </div>
          <div>
            <div className="text-xs text-inksoft font-medium mb-1">Conforto</div>
            <Segmented options={CONFORTOS} value={conforto} onChange={setConforto} />
          </div>
        </div>

        <div>
          <div className="text-xs text-inksoft font-medium mb-1">Interesses</div>
          <div className="flex flex-wrap gap-1.5">
            {INTERESSES.map((i) => {
              const on = interesses.includes(i);
              return (
                <button key={i} type="button" onClick={() => toggleInteresse(i)} aria-pressed={on}
                  className={`px-3 py-1.5 rounded-full text-xs border transition focusring ${on ? 'bg-pine text-white border-pine' : 'bg-card text-inksoft border-line hover:border-pine/50'}`}>{i}</button>
              );
            })}
          </div>
        </div>

        <div className="flex flex-wrap items-end gap-3">
          <label className="text-xs text-inksoft font-medium">Restrição alimentar
            <select value={restricao} onChange={(e) => setRestricao(e.target.value)} className={`${field} mt-1`} style={{ width: 'auto' }}>
              {RESTRICOES.map((r) => <option key={r} value={r}>{r}</option>)}
            </select>
          </label>
          <button onClick={gerar} disabled={busy}
            className="ml-auto inline-flex items-center justify-center gap-2 rounded-xl bg-ochre text-onochre font-semibold px-5 py-2.5 shadow-md hover:brightness-95 disabled:opacity-60 focusring">
            {busy ? <><span className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" aria-hidden /> Montando…</> : '✨ Gerar roteiro'}
          </button>
        </div>
      </div>

      {erro && (
        <div className="mt-4 rounded-xl border border-danger-bd bg-danger-bg text-danger px-4 py-3 text-sm">
          {erro}{' '}
          <Link href="/planejar" className="underline font-semibold">Entrar ou configurar a IA →</Link>
        </div>
      )}

      {busy && <div className="mt-6 space-y-3" aria-hidden>{[0, 1, 2].map((i) => <div key={i} className="h-24 rounded-2xl skel" />)}</div>}

      {roteiro && !busy && <RoteiroView roteiro={roteiro} destino={destino} onRegerar={gerar} />}
    </div>
  );
}

function Segmented({ options, value, onChange }) {
  return (
    <div className="inline-flex rounded-lg border border-line bg-paper2/60 p-0.5">
      {options.map((o) => (
        <button key={o.id} type="button" onClick={() => onChange(o.id)} aria-pressed={value === o.id}
          className={`px-3 py-1.5 rounded-md text-xs font-semibold transition focusring ${value === o.id ? 'bg-card text-pine shadow-sm' : 'text-inksoft hover:text-ink'}`}>{o.label}</button>
      ))}
    </div>
  );
}

function RoteiroView({ roteiro, destino, onRegerar }) {
  return (
    <div className="mt-6">
      <div className="rounded-2xl border border-line bg-gradient-to-br from-pine/5 to-ochre/5 p-5">
        <div className="flex flex-wrap items-start gap-3">
          <div className="mr-auto">
            <h2 className="font-display text-2xl text-ink">{destino.nome} · {roteiro.dias.length} dia(s)</h2>
            {roteiro.resumo && <p className="mt-1 text-sm text-inksoft max-w-2xl">{roteiro.resumo}</p>}
          </div>
          {roteiro.custoEstimado && <span className="inline-flex items-center gap-1 rounded-full bg-card border border-line px-3 py-1.5 text-sm font-semibold text-ink shrink-0">💰 {roteiro.custoEstimado}</span>}
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          <button onClick={onRegerar} className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-line bg-card text-inksoft hover:text-pine focusring">↻ Gerar de novo</button>
          <button onClick={() => window.print()} className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-line bg-card text-inksoft hover:text-pine focusring">⬇ Exportar PDF</button>
        </div>
      </div>

      <div className="mt-4 space-y-4">
        {roteiro.dias.map((d) => <DiaCard key={d.dia} d={d} />)}
      </div>

      <div className="mt-4 grid sm:grid-cols-2 gap-3">
        <Lista titulo="✅ Checklist" itens={roteiro.checklist} />
        <Lista titulo="🛂 Documentos & vacinas" itens={roteiro.documentos} />
        <Lista titulo="🛟 Segurança" itens={roteiro.seguranca} />
        <Lista titulo="💸 Como economizar" itens={roteiro.economia} />
      </div>

      <p className="mt-4 text-xs text-inksoft">Roteiro gerado por IA — estimativas e sugestões. Confira horários, preços e regras na fonte oficial antes de ir.</p>
    </div>
  );
}

function DiaCard({ d }) {
  return (
    <div className="rounded-2xl border border-line bg-card overflow-hidden">
      <div className="px-4 py-2.5 bg-paper2/60 border-b border-line">
        <h3 className="font-display text-lg text-ink">Dia {d.dia} · <span className="text-pine">{d.titulo}</span></h3>
      </div>
      <ol className="divide-y divide-line">
        {d.itens.map((it, i) => <ItemRow key={i} it={it} />)}
      </ol>
    </div>
  );
}

function ItemRow({ it }) {
  const icon = CAT_ICON[(it.categoria || '').toLowerCase()] || '📍';
  const maps = it.local ? 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(it.local) : null;
  return (
    <li className="p-4 flex gap-3">
      <div className="flex flex-col items-center shrink-0 w-14">
        <span className="text-xs font-bold text-pine tnum">{it.hora || '—'}</span>
        <span className="text-lg mt-1" aria-hidden>{icon}</span>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-baseline gap-x-2">
          <span className="font-semibold text-ink">{it.atividade}</span>
          {it.duracao && <span className="text-xs text-inksoft">· {it.duracao}</span>}
          {it.custo && <span className="text-xs font-semibold text-pine">· {it.custo}</span>}
        </div>
        {it.local && (
          <div className="text-sm text-inksoft">
            {maps ? <a href={maps} target="_blank" rel="noopener noreferrer" className="hover:text-pine hover:underline focusring">📍 {it.local} ↗</a> : <>📍 {it.local}</>}
          </div>
        )}
        {it.dica && <div className="text-xs text-inksoft mt-1">💡 {it.dica}</div>}
        {(it.gratis || it.planoB) && (
          <div className="mt-1.5 flex flex-wrap gap-1.5">
            {it.gratis && <span className="text-[11px] bg-success-bg text-success border border-success-bd rounded-full px-2 py-0.5">🆓 {it.gratis}</span>}
            {it.planoB && <span className="text-[11px] bg-warn-bg text-warn border border-warn-bd rounded-full px-2 py-0.5">🌧️ {it.planoB}</span>}
          </div>
        )}
      </div>
    </li>
  );
}

function Lista({ titulo, itens }) {
  if (!itens || itens.length === 0) return null;
  return (
    <div className="rounded-2xl border border-line bg-card p-4">
      <h3 className="font-display text-lg text-ink mb-2">{titulo}</h3>
      <ul className="space-y-1.5 text-sm text-inksoft">
        {itens.map((it, i) => <li key={i} className="flex gap-2"><span className="text-pine shrink-0" aria-hidden>•</span>{it}</li>)}
      </ul>
    </div>
  );
}
