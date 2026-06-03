import { useState, useEffect, useMemo, useRef } from 'react';
import { PAISES_REF, PASSAPORTES, MOEDAS, vistoDe } from './data.js';
import { uid, num, clamp, dur, fmtMoeda, converter } from './utils.js';
import { calcular } from './calc.js';
import { otimizarRota, buscarOportunidades, buscarCambio } from './services.js';
import { carregarPlano, salvarPlano, normalizarPlano, planoExemplo, exportarPlano, novoTrechoDeRef } from './storage.js';
import { Toasts, Tripe } from './components.jsx';
import TrechoCard from './TrechoCard.jsx';
import ConfigIA from './ConfigIA.jsx';
import RouteMap from './RouteMap.jsx';
import { EmptyState } from '../_ui/EmptyState.jsx';
import { Button } from '../_ui/Button.jsx';
import { Tabs } from '../_ui/Tabs.jsx';
import Onboarding from './Onboarding.jsx';
import CustosView from './CustosView.jsx';
import { supabaseConfigurado, usuarioAtual, carregarViagemNuvem, salvarViagemNuvem, entrarComEmail, sair } from './supabase.js';

// Quando o backend (Render) tem a chave de IA, a IA funciona sem chave do usuário.
const AI_SERVIDOR = process.env.NEXT_PUBLIC_AI_SERVER === '1';

function AdicionarPais({ onAdd }) {
  const [code, setCode] = useState('');
  return (
    <div className="rise rounded-2xl border border-dashed border-pine/40 bg-pine/5 p-4 flex flex-col sm:flex-row sm:items-center gap-3">
      <div className="text-sm text-pine font-semibold shrink-0">➕ Adicionar país</div>
      <select value={code} onChange={(e) => setCode(e.target.value)} aria-label="Escolher país para adicionar"
        className="flex-1 px-3 py-2 rounded-lg border border-line bg-white text-ink focusring">
        <option value="">Escolha um país (já vem pré-preenchido)…</option>
        {PAISES_REF.map(p => <option key={p.code} value={p.code}>{p.nome} — {p.regiao}</option>)}
        <option value="__custom">+ Outro país (manual)</option>
      </select>
      <button onClick={() => { if (!code) return; onAdd(code); setCode(''); }} disabled={!code}
        className="px-4 py-2 rounded-lg bg-pine text-white font-semibold hover:bg-pinedk disabled:opacity-50 focusring shrink-0">Adicionar à rota</button>
    </div>
  );
}

export default function App() {
  const [plan, setPlan] = useState(carregarPlano);
  const [toasts, setToasts] = useState([]);
  const [showConfig, setShowConfig] = useState(false);
  const [otimizando, setOtimizando] = useState(false);
  const [oppBusy, setOppBusy] = useState({});
  const [rationales, setRationales] = useState({});
  const [optResumo, setOptResumo] = useState('');
  const [drag, setDrag] = useState({ from: null, over: null });
  const [cambioBusy, setCambioBusy] = useState(false);
  const importRef = useRef(null);
  const _tid = useRef(0);
  const _fxDone = useRef(false);
  const [user, setUser] = useState(null);       // Supabase (null se não logado/não configurado)
  const [tripId, setTripId] = useState(null);
  const _cloudInit = useRef(false);
  const [aba, setAba] = useState('rota');        // navegação multi-tela: rota | mapa | custos
  const [ajuda, setAjuda] = useState(0);         // reabre o onboarding ao incrementar

  const calc = useMemo(() => calcular(plan), [plan]);
  const base = plan.settings.moedaBase;
  const moedasEmUso = useMemo(() => {
    const s = new Set([base]); plan.legs.forEach(l => s.add(l.moeda || 'USD')); return [...s];
  }, [plan.legs, base]);

  useEffect(() => { salvarPlano(plan); }, [plan]);

  function toast(msg, tipo = 'ok') {
    const id = ++_tid.current;
    setToasts(t => [...t, { id, msg, tipo }]);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), tipo === 'erro' ? 8000 : 4500);
  }

  // Atualiza o câmbio. silencioso=true não mostra toast (usado no auto-update do load).
  async function atualizarCambio(silencioso) {
    setCambioBusy(true);
    try {
      const fx = await buscarCambio();
      setPlan(p => ({ ...p, settings: { ...p.settings, fx } }));
      if (!silencioso) toast('Câmbio atualizado.');
    } catch (e) {
      if (!silencioso) toast(e.message, 'erro');
    } finally { setCambioBusy(false); }
  }

  // Auto-atualiza o câmbio no load se estiver velho (> 12h) — não trava a UI.
  useEffect(() => {
    if (_fxDone.current) return;
    _fxDone.current = true;
    const at = plan.settings.fx && plan.settings.fx.atualizadoEm;
    if (!at || (Date.now() - at) > 12 * 3600 * 1000) atualizarCambio(true);
  }, []);

  // Sincronização com Supabase — SÓ ativa se NEXT_PUBLIC_SUPABASE_* estiverem
  // configurados. Sem isso, tudo segue em modo local (localStorage), sem mudança.
  useEffect(() => {
    if (!supabaseConfigurado || _cloudInit.current) return;
    _cloudInit.current = true;
    usuarioAtual().then(async (u) => {
      setUser(u || null);
      if (!u) return;
      try {
        const nuvem = await carregarViagemNuvem(u.id);
        if (nuvem) {
          setTripId(nuvem.trip.id);
          if (nuvem.legs.length) {
            setPlan(normalizarPlano({
              settings: { moedaBase: nuvem.trip.moeda_base, orcamento: nuvem.trip.orcamento, dataInicio: nuvem.trip.data_inicio, passaporte: nuvem.trip.passaporte, fx: nuvem.trip.fx, ai: { ...(nuvem.trip.ai || {}), apiKey: '' } },
              legs: nuvem.legs,
            }));
          }
        }
      } catch (e) { /* falha de rede → mantém o plano local */ }
    });
  }, []);

  // Salva na nuvem (debounce) quando há usuário logado.
  useEffect(() => {
    if (!supabaseConfigurado || !user) return;
    const t = setTimeout(() => {
      salvarViagemNuvem(user.id, tripId, plan).then((id) => { if (id && id !== tripId) setTripId(id); }).catch(() => {});
    }, 1500);
    return () => clearTimeout(t);
  }, [plan, user]);

  async function entrar() {
    const email = prompt('Seu e-mail (enviaremos um link mágico de acesso):');
    if (!email) return;
    try { await entrarComEmail(email.trim()); toast('Link de acesso enviado pro seu e-mail. Confira a caixa de entrada.'); }
    catch (e) { toast('Erro ao entrar: ' + e.message, 'erro'); }
  }
  async function deslogar() { await sair(); setUser(null); setTripId(null); toast('Você saiu.'); }

  // ---- mutações ----
  const setSettings = (patch) => setPlan(p => ({ ...p, settings: { ...p.settings, ...patch } }));
  const setRate = (code, val) => setPlan(p => ({ ...p, settings: { ...p.settings, fx: { ...p.settings.fx, rates: { ...p.settings.fx.rates, [code]: val } } } }));
  // Ao trocar a moeda base, converte o orçamento junto (os custos dos trechos ficam
  // nas próprias moedas; só o orçamento é guardado "na base").
  const trocarBase = (nova) => setPlan(p => {
    const orc = converter(num(p.settings.orcamento), p.settings.moedaBase, nova, p.settings.fx.rates);
    return { ...p, settings: { ...p.settings, moedaBase: nova, orcamento: Math.round(orc) } };
  });
  const patchLeg = (id, patch) => setPlan(p => ({ ...p, legs: p.legs.map(l => l.id === id ? { ...l, ...patch } : l) }));
  const removeLeg = (id) => setPlan(p => ({ ...p, legs: p.legs.filter(l => l.id !== id) }));

  const addPais = (code) => {
    if (code === '__custom') {
      const novo = { id: uid(), code: '', nome: 'Novo país', regiao: '', dias: 14, custoDia: 30, moeda: base, economiaDia: 0, economiaLabel: '', transporte: 0, transporteNota: '', melhoresMeses: [], estacaoLabel: '', vistoTipo: 'isento', vistoDias: 90, vistoNota: 'Preencha a regra real do seu passaporte.', oportunidades: null };
      setPlan(p => ({ ...p, legs: [...p.legs, novo] }));
    } else {
      const ref = PAISES_REF.find(r => r.code === code);
      if (ref) setPlan(p => ({ ...p, legs: [...p.legs, novoTrechoDeRef(ref, p.settings.passaporte)] }));
    }
  };

  // Troca o passaporte e reaplica as regras de visto nos trechos com país conhecido.
  const trocarPassaporte = (p) => {
    const temCodigos = plan.legs.some(l => l.code);
    if (temCodigos && !confirm(`Aplicar as regras de visto do passaporte "${PASSAPORTES[p]}" a todos os trechos? Isso sobrescreve ajustes manuais de visto (custo, dias e clima ficam intactos).`)) return;
    setPlan(prev => ({
      ...prev,
      settings: { ...prev.settings, passaporte: p },
      legs: prev.legs.map(l => {
        if (!l.code) return l;
        const v = vistoDe(l.code, p);
        return { ...l, vistoTipo: v.tipo, vistoDias: v.dias, vistoNota: v.nota };
      }),
    }));
    toast(`Vistos atualizados para passaporte ${PASSAPORTES[p]}.`);
  };

  const moveLeg = (from, to) => {
    if (to < 0 || to >= plan.legs.length || from === to) return;
    setPlan(p => { const legs = [...p.legs]; const [it] = legs.splice(from, 1); legs.splice(to, 0, it); return { ...p, legs }; });
  };

  async function handleOtimizar() {
    if (plan.legs.length < 2) { toast('Adicione pelo menos 2 países pra otimizar.', 'erro'); return; }
    if (!plan.settings.ai.apiKey && !AI_SERVIDOR) { toast('Cole sua chave em "IA / Config" — ou configure a chave no servidor (Render).', 'erro'); setShowConfig(true); return; }
    setOtimizando(true);
    try {
      const { order, rationales: rats, resumo } = await otimizarRota(plan, calc);
      setPlan(p => ({ ...p, legs: order.map(id => p.legs.find(l => l.id === id)).filter(Boolean) }));
      setRationales(rats); setOptResumo(resumo);
      toast('Rota reordenada pela IA. Veja as justificativas em cada trecho.');
    } catch (e) { toast('Otimizador: ' + e.message, 'erro'); }
    finally { setOtimizando(false); }
  }

  async function handleOpp(leg) {
    if (!plan.settings.ai.apiKey && !AI_SERVIDOR) { toast('Cole sua chave em "IA / Config" — ou configure a chave no servidor (Render).', 'erro'); setShowConfig(true); return; }
    setOppBusy(b => ({ ...b, [leg.id]: true }));
    try {
      const ops = await buscarOportunidades(plan.settings.ai, leg, leg.moeda || base);
      patchLeg(leg.id, { oportunidades: ops });
      if (ops.length === 0) toast('A IA não retornou oportunidades. Tente de novo.', 'erro');
    } catch (e) { toast('Oportunidades: ' + e.message, 'erro'); }
    finally { setOppBusy(b => ({ ...b, [leg.id]: false })); }
  }

  function handleImport(e) {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(reader.result);
        if (!parsed || !Array.isArray(parsed.legs)) throw new Error('Arquivo sem lista de trechos.');
        setPlan(normalizarPlano(parsed)); setRationales({}); setOptResumo('');
        toast('Plano importado com sucesso.');
      } catch (err) { toast('Falha ao importar: ' + err.message, 'erro'); }
      e.target.value = '';
    };
    reader.readAsText(file);
  }

  function carregarExemplo() { if (confirm('Substituir a rota atual pelo exemplo de demonstração?')) { setPlan(normalizarPlano(planoExemplo())); setRationales({}); setOptResumo(''); } }
  function limparTudo() { if (confirm('Apagar todos os trechos e começar do zero?')) { setPlan(p => ({ ...p, legs: [] })); setRationales({}); setOptResumo(''); } }

  const dragHandlersFor = (index) => ({
    draggable: true,
    onDragStart: (e) => { setDrag({ from: index, over: index }); e.dataTransfer.effectAllowed = 'move'; },
    onDragOver: (e) => { e.preventDefault(); if (drag.over !== index) setDrag(d => ({ ...d, over: index })); },
    onDrop: (e) => { e.preventDefault(); if (drag.from !== null) moveLeg(drag.from, index); setDrag({ from: null, over: null }); },
    onDragEnd: () => setDrag({ from: null, over: null }),
  });

  return (
    <div className="min-h-screen">
      <Toasts items={toasts} onClose={(id) => setToasts(t => t.filter(x => x.id !== id))} />
      <Onboarding forcado={ajuda} />
      {showConfig && (
        <ConfigIA ai={plan.settings.ai} onClose={() => setShowConfig(false)}
          onSaveAi={(ai) => { setSettings({ ai }); toast('Configurações de IA salvas.'); }}
          fx={plan.settings.fx} moedasEmUso={moedasEmUso} onAtualizarCambio={() => atualizarCambio(false)} cambioBusy={cambioBusy} onSetRate={setRate} />
      )}

      <header className="sticky top-0 z-30 backdrop-blur bg-paper/80 border-b border-line">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex flex-wrap items-center gap-x-4 gap-y-2">
          <div className="flex items-center gap-2.5 mr-auto">
            <div className="w-9 h-9 rounded-xl bg-pine text-white grid place-items-center font-display text-lg shadow-md" aria-hidden>∞</div>
            <div className="leading-tight">
              <div className="font-display text-xl text-ink">Mundo Sem Fim</div>
              <div className="text-[11px] text-inksoft -mt-0.5">Estação × Visto × Fôlego, na ordem certa</div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <label className="text-xs text-inksoft flex items-center gap-1.5 bg-card border border-line rounded-lg px-2 py-1">
              Início
              <input type="date" value={plan.settings.dataInicio} onChange={(e) => setSettings({ dataInicio: e.target.value })} aria-label="Data de início da viagem" className="bg-transparent text-ink focusring tnum" />
            </label>
            <label className="text-xs text-inksoft flex items-center gap-1.5 bg-card border border-line rounded-lg px-2 py-1">
              Orçamento
              <input type="number" min="0" value={plan.settings.orcamento} onChange={(e) => setSettings({ orcamento: clamp(num(e.target.value), 0, 1e12) })} aria-label="Orçamento total disponível" className="w-24 bg-transparent text-ink tnum focusring" />
            </label>
            <label className="text-xs text-inksoft flex items-center gap-1.5 bg-card border border-line rounded-lg px-2 py-1" title="Moeda em que totais, orçamento e fôlego são exibidos.">
              Moeda base
              <select value={base} onChange={(e) => trocarBase(e.target.value)} aria-label="Moeda base de exibição" className="bg-transparent text-ink focusring">
                {MOEDAS.map(m => <option key={m.code} value={m.code}>{m.code}</option>)}
              </select>
            </label>
            <label className="text-xs text-inksoft flex items-center gap-1.5 bg-card border border-line rounded-lg px-2 py-1" title="Regras de visto mudam conforme o seu passaporte.">
              Passaporte
              <select value={plan.settings.passaporte} onChange={(e) => trocarPassaporte(e.target.value)} aria-label="Seu passaporte (define as regras de visto)" className="bg-transparent text-ink focusring">
                {Object.entries(PASSAPORTES).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
              </select>
            </label>
          </div>

          <div className="flex items-center gap-1.5">
            {supabaseConfigurado && (user
              ? <Button variant="secondary" size="sm" onClick={deslogar} title={user.email}>Sair</Button>
              : <Button variant="secondary" size="sm" onClick={entrar}>Entrar</Button>)}
            <Button variant="ghost" size="sm" onClick={() => setAjuda(a => a + 1)} aria-label="Ajuda / como funciona">Ajuda</Button>
            <Button size="sm" onClick={() => setShowConfig(true)}>IA / Config</Button>
            <Button variant="secondary" size="sm" onClick={() => exportarPlano(plan)}>Exportar</Button>
            <Button variant="secondary" size="sm" onClick={() => importRef.current && importRef.current.click()}>Importar</Button>
            <input ref={importRef} type="file" accept="application/json,.json" onChange={handleImport} className="hidden" aria-hidden tabIndex={-1} />
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        <div className="rise">
          <h1 className="font-display text-3xl sm:text-[40px] leading-[1.05] text-ink max-w-3xl">
            Monte sua volta ao mundo <span className="text-pine">na ordem que não te quebra.</span>
          </h1>
          <p className="mt-2 text-inksoft max-w-2xl">
            Errar a ordem dos países custa caro: você chega na monção, fura o visto ou a grana acaba no meio do caminho.
            Arraste os trechos e veja, em tempo real, o cruzamento de <b className="text-ink">estação</b>, <b className="text-ink">visto</b> e <b className="text-ink">fôlego de dinheiro</b>.
          </p>
        </div>

        <Tripe calc={calc} />

        {plan.legs.length > 0 && (
          <Tabs value={aba} onChange={setAba}
            tabs={[{ id: 'rota', icon: '🧭', label: 'Rota' }, { id: 'mapa', icon: '🗺️', label: 'Mapa' }, { id: 'custos', icon: '💰', label: 'Custos' }]} />
        )}

        {optResumo && (
          <div className="rise rounded-xl border border-[#e7d3a3] bg-[#F7EDD6] text-[#8a5e12] px-4 py-3 text-sm flex items-start gap-2">
            <span aria-hidden>🧭</span><div className="flex-1"><b>Otimizador:</b> {optResumo}</div>
            <button onClick={() => setOptResumo('')} aria-label="Fechar resumo" className="opacity-60 hover:opacity-100 focusring">✕</button>
          </div>
        )}

        {plan.legs.length > 0 && aba === 'mapa' && (
          <RouteMap trechos={calc.trechos} onSelect={(id) => { setAba('rota'); setTimeout(() => { const el = document.getElementById('leg-' + id); if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' }); }, 80); }} />
        )}

        {plan.legs.length > 0 && aba === 'custos' && <CustosView calc={calc} />}

        {(plan.legs.length === 0 || aba === 'rota') && (
          <section aria-label="Construtor de rota">
            <div className="flex flex-wrap items-center gap-3 mb-3">
              <h2 className="font-display text-2xl text-ink mr-auto">Sua rota <span className="text-inksoft text-base font-sans">· {plan.legs.length} trecho(s) · {dur(calc.diasTotais)}</span></h2>
              <label className="text-xs text-inksoft flex items-center gap-1 bg-card border border-line rounded-lg px-2 py-1" title="Origem do 1º voo (busca de passagem).">
                ✈ Saindo de
                <input value={plan.settings.origemCidade} onChange={(e) => setSettings({ origemCidade: e.target.value })} aria-label="Cidade de origem" className="w-20 bg-transparent text-ink focusring" />
                <input value={plan.settings.origemIata} onChange={(e) => setSettings({ origemIata: e.target.value.toUpperCase().slice(0, 3) })} aria-label="Aeroporto de origem (código IATA)" placeholder="IATA" className="w-12 bg-transparent text-ink focusring uppercase" />
              </label>
              <Button variant="accent" onClick={handleOtimizar} loading={otimizando}>{otimizando ? 'Otimizando rota…' : '🧭 Otimizar rota (IA)'}</Button>
              <div className="flex items-center gap-1.5">
                <Button variant="secondary" size="sm" onClick={carregarExemplo}>Exemplo</Button>
                <Button variant="ghost" size="sm" onClick={limparTudo}>Limpar</Button>
              </div>
            </div>

            {plan.legs.length === 0 ? (
              <EmptyState title="Sua rota está vazia." action={<Button variant="secondary" onClick={carregarExemplo}>Carregar exemplo</Button>}>
                Adicione países abaixo (já vêm com custo, estação e visto estimados) ou carregue o exemplo de demonstração.
              </EmptyState>
            ) : (
              <div role="list">
                {calc.trechos.map((t, i) => (
                  <div key={t.id} id={'leg-' + t.id}>
                    <TrechoCard
                      t={t} index={i} total={calc.trechos.length} base={base} passaporte={plan.settings.passaporte}
                      origemCidade={i === 0 ? plan.settings.origemCidade : (calc.trechos[i - 1].cidadePrincipal || '')}
                      origemIata={i === 0 ? plan.settings.origemIata : (calc.trechos[i - 1].iata || '')}
                      onPatch={(patch) => patchLeg(t.id, patch)} onRemove={() => removeLeg(t.id)} onMove={moveLeg}
                      onBuscarOpp={() => handleOpp(t)} oppBusy={!!oppBusy[t.id]} rationale={rationales[t.id]}
                      ehQuebra={!calc.folego.cobreTudo && calc.folego.trechoQuebraId === t.id} dataQuebra={calc.folego.dataQuebra}
                      dragHandlers={dragHandlersFor(i)} dragging={drag.from === i}
                      dropTarget={drag.from !== null && drag.over === i && drag.from !== i}
                    />
                    {i < calc.trechos.length - 1 && (
                      <div className="route-line py-1.5" aria-hidden>
                        {calc.trechos[i + 1].custoTransporte > 0 && (
                          <span className="ml-3 inline-flex items-center gap-1 text-[11px] text-inksoft bg-paper2 border border-line rounded-full px-2 py-0.5 tnum">
                            ✈ {fmtMoeda(calc.trechos[i + 1].custoTransporte, base)}
                            {calc.trechos[i + 1].transporteNota ? ` · ${calc.trechos[i + 1].transporteNota}` : ''}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            <div className="mt-4"><AdicionarPais onAdd={addPais} /></div>
          </section>
        )}

        <footer className="pt-4 pb-10 text-xs text-inksoft space-y-2 border-t border-line">
          <p>
            <b>Importante:</b> as regras de visto são uma <b>referência para o passaporte {PASSAPORTES[plan.settings.passaporte]}, revisada em junho de 2026</b>.
            Custos diários e melhores meses são estimativas (perfil mochileiro). Tudo <b>varia por ponto de entrada e mudanças de política — confira sempre na fonte oficial</b> (consulado/embaixada e imigração do país). Todos os valores são editáveis.
          </p>
          <p>Cada trecho usa a moeda que você escolher; os totais aparecem na moeda base ({base}) usando câmbio aproximado (atualizável e editável em IA / Config — não use como cotação exata). O custo de voo/transporte entre países entra no total e no fôlego. Os dados ficam salvos só neste navegador — exporte o JSON para backup. As features de IA usam a sua chave e rodam direto do navegador.</p>
        </footer>
      </main>
    </div>
  );
}
