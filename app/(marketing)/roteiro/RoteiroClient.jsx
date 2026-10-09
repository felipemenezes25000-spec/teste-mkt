'use client';
import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { DESTINOS, destinoPorSlug } from '../../_lib/destinos.js';
import { carregarPlano } from '../../_engine/storage.js';
import { gerarRoteiro } from '../../_engine/services.js';
import { MOEDAS } from '../../_engine/data.js';
import { useLibera } from '../../_components/Gate.jsx';
import { CustoVitrineVsReal } from '../../_components/CustoVitrineVsReal.jsx';
import { calcExemploDestino, resumoVitrineVsReal } from '../../_engine/custoTotal.js';
import { linkPorCategoria } from '../../_lib/links.js';
import { track } from '../../_lib/analytics.js';
import { Icon } from '../../_ui/Icon.jsx';

const RITMOS = [{ id: 'tranquilo', label: 'Tranquilo' }, { id: 'equilibrado', label: 'Equilibrado' }, { id: 'intenso', label: 'Intenso' }];
const CONFORTOS = [{ id: 'mochila', label: 'Mochila' }, { id: 'médio', label: 'Médio' }, { id: 'conforto', label: 'Conforto' }];
const INTERESSES = ['Cultura', 'Natureza', 'Gastronomia', 'Praia', 'História', 'Aventura', 'Vida noturna', 'Compras'];
const RESTRICOES = ['Nenhuma', 'Vegetariano', 'Vegano', 'Sem glúten', 'Halal', 'Kosher'];
const CAT_ICON = { cultura: '🏛️', natureza: '🌿', gastronomia: '🍽️', praia: '🏖️', compras: '🛍️', 'vida noturna': '🌙', aventura: '⛰️', descanso: '😌', história: '🏺' };

// Roteiros temáticos = presets que pré-preenchem o form (interesses + conforto + ritmo).
const TEMAS = [
  { id: 'gastronomico', label: 'Gastronômico', interesses: ['Gastronomia', 'Cultura'], conforto: 'médio', ritmo: 'equilibrado' },
  { id: 'romantico', label: 'Romântico', interesses: ['Gastronomia', 'Praia', 'Cultura'], conforto: 'conforto', ritmo: 'tranquilo' },
  { id: 'familia', label: 'Família', interesses: ['Natureza', 'Cultura', 'Praia'], conforto: 'médio', ritmo: 'tranquilo' },
  { id: 'mochileiro', label: 'Mochileiro', interesses: ['Natureza', 'Aventura', 'Cultura'], conforto: 'mochila', ritmo: 'intenso' },
  { id: 'luxo', label: 'Luxo', interesses: ['Gastronomia', 'Cultura'], conforto: 'conforto', ritmo: 'tranquilo' },
  { id: 'cultural', label: 'Cultural', interesses: ['Cultura', 'História', 'Gastronomia'], conforto: 'médio', ritmo: 'equilibrado' },
  { id: 'aventura', label: 'Aventura', interesses: ['Natureza', 'Aventura'], conforto: 'mochila', ritmo: 'intenso' },
  { id: 'praia', label: 'Praia & relax', interesses: ['Praia', 'Natureza'], conforto: 'médio', ritmo: 'tranquilo' },
];

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
  const [companhia, setCompanhia] = useState('casal');
  const [transporte, setTransporte] = useState('transporte público');
  const [inicioDia, setInicioDia] = useState('10:00');
  const [planoChuva, setPlanoChuva] = useState(true);

  const [busy, setBusy] = useState(false);
  const [erro, setErro] = useState('');
  const [roteiro, setRoteiro] = useState(null);

  const destino = DESTINOS.find((d) => d.code === code) || DESTINOS[0];
  const [tema, setTema] = useState('');

  const toggleInteresse = (i) => setInteresses((s) => (s.includes(i) ? s.filter((x) => x !== i) : [...s, i]));
  function aplicarTema(t) {
    setTema(t.id);
    setInteresses(t.interesses);
    setConforto(t.conforto);
    setRitmo(t.ritmo);
  }

  async function gerar() {
    setBusy(true); setErro(''); setRoteiro(null);
    track('roteiro_solicitado', { destino: destino.nome, dias, ritmo, conforto });
    try {
      let ai = {};
      try { ai = carregarPlano().settings.ai; } catch {}
      const out = await gerarRoteiro(
        { destino: destino.nome, dias, orcamento, moeda, ritmo, interesses, restricao: restricao === 'Nenhuma' ? '' : restricao, conforto, companhia, transporte, inicioDia, planoChuva },
        ai,
      );
      setRoteiro(out);
      track('roteiro_gerado', { destino: destino.nome, dias });
    } catch (e) {
      setErro(e.message || 'Falha ao gerar o roteiro.');
    } finally {
      setBusy(false);
    }
  }

  const field = 'w-full px-3 py-2 rounded-lg border border-line bg-input text-ink focusring text-sm';

  return (
    <div className="mt-6">
      <div className="grid lg:grid-cols-[1fr_0.85fr] gap-5 items-start">
      <div className="rounded-3xl border border-line bg-card p-5 space-y-4 no-print shadow-[var(--e-1)]">
        <div>
          <div className="text-xs text-inksoft font-medium mb-1">Tipo de roteiro <span className="opacity-70">(pré-preenche o resto)</span></div>
          <div className="flex flex-wrap gap-1.5">
            {TEMAS.map((t) => (
              <button key={t.id} type="button" onClick={() => aplicarTema(t)} aria-pressed={tema === t.id}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition focusring ${tema === t.id ? 'bg-pine text-onpine border-pine' : 'bg-card text-inksoft border-line hover:border-pine/50'}`}>{t.label}</button>
            ))}
          </div>
        </div>

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

        <div className="grid sm:grid-cols-2 gap-3">
          <label className="text-xs text-inksoft font-medium">Companhia
            <select value={companhia} onChange={(e) => setCompanhia(e.target.value)} className={`${field} mt-1`}>
              <option value="solo">Solo</option>
              <option value="casal">Casal</option>
              <option value="amigos">Amigos</option>
              <option value="família">Família</option>
            </select>
          </label>
          <label className="text-xs text-inksoft font-medium">Transporte preferido
            <select value={transporte} onChange={(e) => setTransporte(e.target.value)} className={`${field} mt-1`}>
              <option value="transporte público">Transporte público</option>
              <option value="app/táxi quando fizer sentido">App/táxi quando fizer sentido</option>
              <option value="carro alugado">Carro alugado</option>
              <option value="a pé sempre que possível">A pé sempre que possível</option>
            </select>
          </label>
          <label className="text-xs text-inksoft font-medium">Começar o dia por volta de
            <input type="time" value={inicioDia} onChange={(e) => setInicioDia(e.target.value)} className={`${field} mt-1 tnum`} />
          </label>
          <label className="text-xs text-inksoft font-medium">Plano B de chuva
            <button type="button" onClick={() => setPlanoChuva((v) => !v)} aria-pressed={planoChuva}
              className={`mt-1 w-full px-3 py-2 rounded-lg border text-left text-sm font-semibold focusring ${planoChuva ? 'border-pine bg-pine/10 text-pine' : 'border-line bg-input text-inksoft'}`}>
              {planoChuva ? 'Sim, incluir alternativas cobertas' : 'Não precisa'}
            </button>
          </label>
        </div>

        <div>
          <div className="text-xs text-inksoft font-medium mb-1">Interesses</div>
          <div className="flex flex-wrap gap-1.5">
            {INTERESSES.map((i) => {
              const on = interesses.includes(i);
              return (
                <button key={i} type="button" onClick={() => toggleInteresse(i)} aria-pressed={on}
                  className={`px-3 py-1.5 rounded-full text-xs border transition focusring ${on ? 'bg-pine text-onpine border-pine' : 'bg-card text-inksoft border-line hover:border-pine/50'}`}>{i}</button>
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
            {busy ? <><span className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" aria-hidden /> Montando…</> : 'Gerar roteiro'}
          </button>
        </div>
      </div>

      <aside className="rounded-3xl border border-line bg-gradient-to-br from-pine/8 to-ochre/10 p-5 sticky top-20">
        <p className="text-xs uppercase tracking-[0.18em] text-pine font-bold">Prévia do que sai</p>
        <h2 className="mt-1 font-display text-2xl text-ink">Dia 1 · chegada sem correria</h2>
        <div className="mt-4 space-y-3 text-sm">
          {[
            ['Manhã', 'Chegada, check-in e primeira caminhada leve perto da hospedagem.'],
            ['Tarde', 'Um bairro bonito, sem atravessar a cidade no primeiro dia.'],
            ['Noite', 'Jantar local com custo controlado e volta simples.'],
          ].map(([periodo, texto]) => (
            <div key={periodo} className="rounded-2xl bg-card border border-line p-3">
              <p className="text-xs uppercase tracking-wide text-pine font-bold">{periodo}</p>
              <p className="mt-1 text-inksoft">{texto}</p>
            </div>
          ))}
        </div>
        <div className="mt-4 rounded-2xl border border-warn-bd bg-warn-bg p-3">
          <p className="text-xs uppercase tracking-wide text-warn font-bold">Opinião do roteiro</p>
          <p className="mt-1 text-sm text-ink">Não coloque atração cara no primeiro dia. Você compra lembrança melhor quando não está destruído.</p>
        </div>
      </aside>
      </div>

      {erro && (
        <div className="mt-4 rounded-xl border border-danger-bd bg-danger-bg text-danger px-4 py-3 text-sm">
          {erro}{' '}
          <Link href="/planejar" className="underline font-semibold">Entrar ou configurar a IA <Icon emoji="→" /></Link>
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
  const { libera: liberaPdf } = useLibera('roteiro-pdf');
  return (
    <div className="mt-6">
      <div className="rounded-2xl border border-line bg-gradient-to-br from-pine/5 to-ochre/5 p-5">
        <div className="flex flex-wrap items-start gap-3">
          <div className="mr-auto">
            <h2 className="font-display text-2xl text-ink">{destino.nome} · {roteiro.dias.length} dia(s)</h2>
            {roteiro.resumo && <p className="mt-1 text-sm text-inksoft max-w-2xl">{roteiro.resumo}</p>}
          </div>
          {roteiro.custoEstimado && <span className="inline-flex items-center gap-1 rounded-full bg-card border border-line px-3 py-1.5 text-sm font-semibold text-ink shrink-0"><Icon emoji="💰" /> {roteiro.custoEstimado}</span>}
        </div>
        <div className="mt-3 flex flex-wrap gap-2 no-print">
          <button onClick={onRegerar} className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-line bg-card text-inksoft hover:text-pine focusring"><Icon emoji="↻" /> Gerar de novo</button>
          {liberaPdf ? (
            <button onClick={() => window.print()} className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-line bg-card text-inksoft hover:text-pine focusring"><Icon emoji="⬇" /> Exportar PDF</button>
          ) : (
            <Link href="/planos" title="Exportar PDF é um recurso premium" className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-ochre/40 bg-ochre/5 text-ochre hover:brightness-95 focusring"><Icon emoji="🔒" /> Exportar PDF (Premium)</Link>
          )}
        </div>
      </div>

      <div className="mt-4">
        <CustoVitrineVsReal
          resumo={resumoVitrineVsReal(calcExemploDestino(destino, roteiro.dias.length))}
          contexto={`${roteiro.dias.length} dia(s) em ${destino.nome} — o custo real, além do voo e hotel que as OTAs anunciam:`}
        />
      </div>

      <div className="mt-4 space-y-4">
        {roteiro.dias.map((d) => <DiaCard key={d.dia} d={d} destino={destino} />)}
      </div>

      <div className="mt-4 grid sm:grid-cols-2 gap-3">
        <Lista titulo="Checklist" itens={roteiro.checklist} />
        <Lista titulo="Documentos & vacinas" itens={roteiro.documentos} />
        <Lista titulo="Segurança" itens={roteiro.seguranca} />
        <Lista titulo="Como economizar" itens={roteiro.economia} />
      </div>

      <p className="mt-4 text-xs text-inksoft">Roteiro gerado por IA — estimativas e sugestões. Confira horários, preços e regras na fonte oficial antes de ir.</p>
    </div>
  );
}

// Energia do dia: heurística simples. Conta itens, soma duração estimada e
// presença de plano B (chuva = preserva). Devolve {nivel, cor, txt, custoDia}.
function leituraDoDia(d) {
  const itens = d.itens || [];
  const minutosTotais = itens.reduce((s, it) => {
    const m = String(it.duracao || '').match(/(\d+)/);
    return s + (m ? Number(m[1]) : 60); // se não disser, conta 60min por padrão
  }, 0);
  const custoDia = itens.reduce((s, it) => {
    const m = String(it.custo || '').replace(/\./g, '').match(/(\d+)/);
    return s + (m ? Number(m[1]) : 0);
  }, 0);

  let nivel = 'media';
  if (itens.length >= 6 || minutosTotais >= 600) nivel = 'alta';
  else if (itens.length <= 3 && minutosTotais <= 300) nivel = 'baixa';

  const UI = {
    baixa: { cor: 'bg-success', txt: 'Energia baixa — dia leve, bom pra chegada/saída' },
    media: { cor: 'bg-warn', txt: 'Energia média — ritmo equilibrado' },
    alta: { cor: 'bg-danger', txt: 'Energia alta — preserve jantar leve' },
  }[nivel];

  // alerta de excesso de deslocamento: se >5 atividades com local diferente.
  const locaisUnicos = new Set(itens.map((it) => it.local).filter(Boolean));
  const alertaDeslocamento = locaisUnicos.size >= 5;

  return { nivel, ui: UI, minutosTotais, custoDia, itens: itens.length, alertaDeslocamento };
}

function DiaCard({ d, destino }) {
  const leitura = leituraDoDia(d);
  return (
    <div className="rounded-2xl border border-line bg-card overflow-hidden">
      <div className="px-4 py-3 bg-paper2/60 border-b border-line">
        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <h3 className="font-display text-lg text-ink">Dia {d.dia} · <span className="text-pine">{d.titulo}</span></h3>
          <span className="text-[11px] text-inksoft">{leitura.itens} atividades · {Math.round(leitura.minutosTotais / 60)}h estimadas</span>
        </div>
        <div className="mt-2 grid grid-cols-[auto_1fr_auto] gap-3 items-center">
          <span className="text-[10px] uppercase tracking-wider font-bold text-inksoft">Energia</span>
          <div className="h-2 rounded-full bg-paper2 overflow-hidden" role="img" aria-label={leitura.ui.txt}>
            <div className={`h-full ${leitura.ui.cor}`} style={{ width: leitura.nivel === 'baixa' ? '33%' : leitura.nivel === 'media' ? '66%' : '100%' }} />
          </div>
          {leitura.custoDia > 0 && (
            <span className="text-xs font-semibold text-ink tnum whitespace-nowrap">~{leitura.custoDia} (custo do dia)</span>
          )}
        </div>
        <p className="mt-1.5 text-[11px] text-inksoft">{leitura.ui.txt}.{leitura.alertaDeslocamento ? 'Excesso de deslocamento — agrupe atividades por região.' : ''}</p>
      </div>
      <ol className="divide-y divide-line">
        {d.itens.map((it) => <ItemRow key={`${it.hora}-${it.atividade}`} it={it} destino={destino} />)}
      </ol>
    </div>
  );
}

function ItemRow({ it, destino }) {
  const icon = CAT_ICON[(it.categoria || '').toLowerCase()] || '📍';
  const maps = it.local ? 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(it.local) : null;
  // CTA de reserva (last-click) conforme a categoria do item — só hospedagem/passeio/transporte.
  const cidade = it.local || (destino && (destino.cidadePrincipal || destino.nome));
  const cta = linkPorCategoria(it.categoria, cidade, destino && destino.nome);
  return (
    <li className="p-4 flex gap-3">
      <div className="flex flex-col items-center shrink-0 w-14">
        <span className="text-xs font-bold text-pine tnum">{it.hora || '—'}</span>
        <span className="text-lg mt-1" aria-hidden><Icon emoji={icon} /></span>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-baseline gap-x-2">
          <span className="font-semibold text-ink">{it.atividade}</span>
          {it.duracao && <span className="text-xs text-inksoft">· {it.duracao}</span>}
          {it.custo && <span className="text-xs font-semibold text-pine">· {it.custo}</span>}
        </div>
        {it.local && (
          <div className="text-sm text-inksoft">
            {maps ? <a href={maps} target="_blank" rel="noopener noreferrer" className="hover:text-pine hover:underline focusring"><Icon emoji="📍" /> {it.local} <Icon emoji="↗" /></a> : <><Icon emoji="📍" /> {it.local}</>}
          </div>
        )}
        {it.dica && <div className="text-xs text-inksoft mt-1"><Icon emoji="💡" /> {it.dica}</div>}
        {(it.gratis || it.planoB) && (
          <div className="mt-1.5 flex flex-wrap gap-1.5">
            {it.gratis && <span className="text-[11px] bg-success-bg text-success border border-success-bd rounded-full px-2 py-0.5"><Icon emoji="🆓" /> {it.gratis}</span>}
            {it.planoB && <span className="text-[11px] bg-warn-bg text-warn border border-warn-bd rounded-full px-2 py-0.5"><Icon emoji="🌧️" /> {it.planoB}</span>}
          </div>
        )}
        {cta && (
          <a
            href={cta.url} target="_blank" rel="noopener noreferrer sponsored"
            onClick={() => track('reservar_click', { categoria: it.categoria || '', parceiro: cta.parceiro, destino: destino && destino.nome })}
            className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-pine bg-pine/10 hover:bg-pine/15 rounded-lg px-2.5 py-1 focusring no-print"
          >
            <Icon emoji={cta.icon} /> {cta.label} <Icon emoji="↗" />
          </a>
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
        {itens.map((it) => <li key={it} className="flex gap-2"><span className="text-pine shrink-0" aria-hidden>•</span>{it}</li>)}
      </ul>
    </div>
  );
}
