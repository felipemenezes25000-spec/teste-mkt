import { useState, useEffect, useMemo, useRef } from 'react';
import { PAISES_REF, PASSAPORTES, MOEDAS, vistoDe } from './data.js';
import { uid, num, clamp, dur, fmtMoeda, converter } from './utils.js';
import { calcular } from './calc.js';
import { otimizarRota, buscarOportunidades, buscarCambio } from './services.js';
import { otimizarOrdemLocal } from './otimizar.js';
import { baixarICS, linkMapaRota } from './exportar.js';
import { carregarPlano, salvarPlano, normalizarPlano, planoExemplo, exportarPlano, novoTrechoDeRef } from './storage.js';
import { Toasts, Tripe, SaveStatus, PlacarRota, FitaDoAno } from './components.jsx';
import TrechoCard from './TrechoCard.jsx';
import ConfigIA from './ConfigIA.jsx';
import RouteMap from './RouteMap.jsx';
import { EmptyState } from '../_ui/EmptyState.jsx';
import { Button } from '../_ui/Button.jsx';
import { Tabs } from '../_ui/Tabs.jsx';
import Onboarding from './Onboarding.jsx';
import CustosView from './CustosView.jsx';
import { supabaseConfigurado, usuarioAtual, carregarViagemNuvem, salvarViagemNuvem, entrarComEmail, sair } from './supabase.js';
import { identify, track } from '../_lib/analytics.js';
import LoginModal from './LoginModal.jsx';
import { useConfirm } from './useConfirm.jsx';
import AppNav from '../_components/AppNav.jsx';
import BudgetPanel from './BudgetPanel.jsx';
import { aplicarCortes } from './budget.js';
import { encodePlan, decodePlan } from './share.js';
import CenariosView from './CenariosView.jsx';
import { carregarCenarios, salvarCenarios, snapshotCenario } from './cenarios.js';
import ChecklistView from './ChecklistView.jsx';
import { carregarCheck, salvarCheck } from './checklist.js';
import { Icon } from '../_ui/Icon.jsx';

// Quando o backend (Render) tem a chave de IA, a IA funciona sem chave do usuário.
const AI_SERVIDOR = process.env.NEXT_PUBLIC_AI_SERVER === '1';

function AdicionarPais({ onAdd }) {
  const [q, setQ] = useState('');
  const [open, setOpen] = useState(false);
  const [ativo, setAtivo] = useState(0);
  const ref = useRef(null);

  const results = useMemo(() => {
    const t = q.trim().toLowerCase();
    if (!t) return [];
    return PAISES_REF.filter(p => (`${p.nome} ${p.regiao}`).toLowerCase().includes(t)).slice(0, 8);
  }, [q]);

  useEffect(() => { setAtivo(0); }, [q]);
  useEffect(() => {
    const onDoc = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, []);

  const add = (code) => { onAdd(code); setQ(''); setOpen(false); };
  const onKey = (e) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setAtivo(a => Math.min(a + 1, results.length - 1)); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setAtivo(a => Math.max(a - 1, 0)); }
    else if (e.key === 'Enter') { if (results[ativo]) add(results[ativo].code); }
    else if (e.key === 'Escape') setOpen(false);
  };

  return (
    <div ref={ref} className="rise rounded-2xl border border-dashed border-pine/40 bg-pine/5 p-4">
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <div className="text-sm text-pine font-semibold shrink-0"><Icon emoji="➕" /> Adicionar país</div>
        <div className="relative flex-1">
          <input
            value={q} onChange={(e) => { setQ(e.target.value); setOpen(true); }} onFocus={() => setOpen(true)} onKeyDown={onKey}
            placeholder="Buscar entre os 205 países…" aria-label="Buscar país para adicionar"
            role="combobox" aria-controls="add-pais-lista" aria-expanded={open && results.length > 0} aria-autocomplete="list"
            className="w-full px-3 py-2 rounded-lg border border-line bg-input text-ink focusring"
          />
          {open && results.length > 0 && (
            <ul className="absolute z-30 mt-1 w-full max-h-72 overflow-auto rounded-xl border border-line bg-card shadow-e2 py-1" role="listbox" id="add-pais-lista">
              {results.map((p, i) => (
                <li key={p.code} role="option" aria-selected={i === ativo}>
                  <button onMouseEnter={() => setAtivo(i)} onClick={() => add(p.code)}
                    className={`w-full text-left px-3 py-2 flex items-center justify-between gap-2 focusring ${i === ativo ? 'bg-paper2' : 'hover:bg-paper2'}`}>
                    <span className="text-ink text-sm font-medium truncate">{p.nome}</span>
                    <span className="text-[11px] text-inksoft shrink-0 tnum">~US$ {p.custoDia}/dia · {p.regiao}</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
        <button onClick={() => add('__custom')}
          className="px-4 py-2 rounded-lg border border-line bg-card text-ink font-semibold hover:text-pine focusring shrink-0 text-sm">+ Manual</button>
      </div>
      <p className="mt-2 text-[11px] text-inksoft">Digite e tecle Enter (ou clique). Adicione quantos quiser — cada um já vem pré-preenchido com custo, estação e visto.</p>
    </div>
  );
}

// Parâmetros globais da viagem, separados das ações do cabeçalho (reduz a densidade
// do topo). Recolhível e persistido; quando fechado mostra um resumo de uma linha.
function ParametrosViagem({ settings, base, onSet, onBase, onPassaporte }) {
  const [aberto, setAberto] = useState(() => {
    try { return localStorage.getItem('mundosemfim.params.collapsed') !== '1'; } catch (e) { return true; }
  });
  function toggle() {
    setAberto(a => {
      const nv = !a;
      try { localStorage.setItem('mundosemfim.params.collapsed', nv ? '0' : '1'); } catch (e) {}
      return nv;
    });
  }
  const campo = 'mt-1 w-full px-2.5 py-1.5 rounded-lg border border-line bg-input text-ink focusring';
  return (
    <section className="rise rounded-2xl border border-line bg-card overflow-hidden" aria-label="Parâmetros da viagem">
      <button type="button" onClick={toggle} aria-expanded={aberto}
        className="w-full flex items-center gap-3 px-4 py-3 text-left focusring">
        <span className="font-display text-lg text-ink whitespace-nowrap"><Icon emoji="⚙" /> Parâmetros da viagem</span>
        {!aberto && (
          <span className="text-xs text-inksoft truncate">
            Início {settings.dataInicio} · Orçamento {fmtMoeda(num(settings.orcamento), base)} · Base {base} · {PASSAPORTES[settings.passaporte]}
          </span>
        )}
        <span className="ml-auto text-inksoft text-sm shrink-0" aria-hidden>{aberto ? '▲ recolher' : '▼ editar'}</span>
      </button>
      {aberto && (
        <div className="px-4 pb-4 pt-3 border-t border-line grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <label className="block text-xs text-inksoft font-medium">Início (1º trecho)
            <input type="date" value={settings.dataInicio} onChange={(e) => onSet({ dataInicio: e.target.value })}
              aria-label="Data de início da viagem" className={`${campo} tnum`} />
          </label>
          <label className="block text-xs text-inksoft font-medium">Orçamento total
            <input type="number" min="0" value={settings.orcamento} onChange={(e) => onSet({ orcamento: clamp(num(e.target.value), 0, 1e12) })}
              aria-label="Orçamento total disponível" className={`${campo} tnum`} />
          </label>
          <label className="block text-xs text-inksoft font-medium" title="Moeda em que totais, orçamento e fôlego são exibidos.">Moeda base
            <select value={base} onChange={(e) => onBase(e.target.value)} aria-label="Moeda base de exibição" className={campo}>
              {MOEDAS.map(m => <option key={m.code} value={m.code}>{m.code} — {m.nome}</option>)}
            </select>
          </label>
          <label className="block text-xs text-inksoft font-medium" title="Regras de visto mudam conforme o seu passaporte.">Passaporte
            <select value={settings.passaporte} onChange={(e) => onPassaporte(e.target.value)} aria-label="Seu passaporte (define as regras de visto)" className={campo}>
              {Object.entries(PASSAPORTES).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
            </select>
          </label>
        </div>
      )}
    </section>
  );
}

export default function App() {
  const [plan, setPlan] = useState(carregarPlano);
  const [toasts, setToasts] = useState([]);
  const [saveState, setSaveState] = useState('saved'); // 'saving' | 'saved' | 'error' — alimenta o indicador "Salvo"
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
  const _firstLocal = useRef(true);  // ignora o 1º salvamento (montagem) no indicador "Salvo"
  const [user, setUser] = useState(null);       // Supabase (null se não logado/não configurado)
  const [tripId, setTripId] = useState(null);
  const _cloudInit = useRef(false);
  const [aba, setAba] = useState('rota');        // navegação multi-tela: rota | mapa | custos
  const [ajuda, setAjuda] = useState(0);         // reabre o onboarding ao incrementar
  const [showLogin, setShowLogin] = useState(false);
  const [loginIA, setLoginIA] = useState(false);  // login aberto por ação de IA → mostra o atalho "usar minha própria chave"
  const { confirm, confirmElement } = useConfirm();
  const [cenarios, setCenarios] = useState(carregarCenarios);  // "Rota A vs B" — snapshots comparáveis
  const [check, setCheck] = useState(carregarCheck);            // checklist de preparativos (mapa {id:true})

  const calc = useMemo(() => calcular(plan), [plan]);
  const base = plan.settings.moedaBase;
  const moedasEmUso = useMemo(() => {
    const s = new Set([base]); plan.legs.forEach(l => s.add(l.moeda || 'USD')); return [...s];
  }, [plan.legs, base]);

  // Há nuvem ativa? Decide quem "manda" no indicador de salvo (local x sincronização).
  const naNuvem = supabaseConfigurado && !!user;

  // Persistência local: instantânea e à prova de falha. Dirige o indicador "Salvo"
  // quando NÃO há nuvem (logado, quem comanda o status é o efeito de sync abaixo).
  // Ignora o 1º disparo (montagem) pra não piscar "Salvando" sem o usuário ter mexido.
  useEffect(() => {
    const ok = salvarPlano(plan);
    if (_firstLocal.current) { _firstLocal.current = false; return; }
    if (naNuvem) return;
    if (!ok) { setSaveState('error'); return; }
    setSaveState('saving');
    const t = setTimeout(() => setSaveState('saved'), 500);
    return () => clearTimeout(t);
  }, [plan, naNuvem]);
  useEffect(() => { salvarCenarios(cenarios); }, [cenarios]);
  useEffect(() => { salvarCheck(check); }, [check]);

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
      // Identify no analytics (PostHog/GTM) sem PII: id + criado_em + provedor.
      // E-mail/nome NÃO vão pro tracking (LGPD-friendly).
      try {
        identify(u.id, {
          criado_em: u.created_at || null,
          provedor: u.app_metadata?.provider || 'email',
        });
        track('login_ok', { provedor: u.app_metadata?.provider || 'email' });
      } catch {}
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

  // Salva na nuvem (debounce) quando há usuário logado — e reflete o status no indicador.
  useEffect(() => {
    if (!supabaseConfigurado || !user) return;
    setSaveState('saving');
    const t = setTimeout(() => {
      salvarViagemNuvem(user.id, tripId, plan)
        .then((id) => { if (id && id !== tripId) setTripId(id); setSaveState('saved'); })
        .catch(() => setSaveState('error'));
    }, 1500);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [plan, user, tripId]);

  // Abre uma rota vinda de um link compartilhado (#r=...). Roda uma vez no load e
  // limpa o hash depois (um refresh não recarrega o link). O codec nunca traz chave de IA.
  const _linkLido = useRef(false);
  useEffect(() => {
    if (_linkLido.current) return;
    _linkLido.current = true;
    const m = (window.location.hash || '').match(/[#&]r=([^&]+)/);
    if (!m) return;
    try {
      setPlan(decodePlan(decodeURIComponent(m[1])));
      setRationales({}); setOptResumo('');
      toast('Rota aberta de um link compartilhado.');
    } catch (e) {
      toast('Link de rota inválido: ' + e.message, 'erro');
    } finally {
      try { history.replaceState(null, '', window.location.pathname + window.location.search); } catch (e) {}
    }
  }, []);

  function entrar() { setLoginIA(false); setShowLogin(true); }
  async function deslogar() { await sair(); setUser(null); setTripId(null); toast('Você saiu.'); }

  // "Tentar de novo" do indicador quando a sincronização com a nuvem falha.
  function tentarSincronizar() {
    if (!supabaseConfigurado || !user) return;
    setSaveState('saving');
    salvarViagemNuvem(user.id, tripId, plan)
      .then((id) => { if (id && id !== tripId) setTripId(id); setSaveState('saved'); })
      .catch(() => setSaveState('error'));
  }

  // IA disponível? Regra: (usuário tem chave própria) OU (modo servidor ligado E logado).
  // A trava de verdade está no /api/ai (servidor); aqui é só UX — leva pro caminho certo.
  const aiServidorOk = AI_SERVIDOR && supabaseConfigurado;
  function exigirIA() {
    if (plan.settings.ai.apiKey) return true;
    if (aiServidorOk && user) return true;
    if (aiServidorOk && !user) {
      setLoginIA(true);
      setShowLogin(true);
    } else {
      toast('Cole sua chave em "IA / Config" pra usar a IA.', 'erro');
      setShowConfig(true);
    }
    return false;
  }

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
      const novo = { id: uid(), code: '', nome: 'Novo país', regiao: '', dias: 14, custoDia: 30, moeda: base, economiaDia: 0, economiaLabel: '', transporte: 0, transporteNota: '', melhoresMeses: [], estacaoLabel: '', vistoTipo: 'isento', vistoDias: 90, vistoNota: 'Preencha a regra real do seu passaporte.', vistoExtensao: false, vistoExtensaoNota: '', vistoComprovanteSaida: true, cidades: [], comidas: [], cidadesCusto: {}, oportunidades: null };
      setPlan(p => ({ ...p, legs: [...p.legs, novo] }));
    } else {
      const ref = PAISES_REF.find(r => r.code === code);
      if (ref) setPlan(p => ({ ...p, legs: [...p.legs, novoTrechoDeRef(ref, p.settings.passaporte)] }));
    }
  };

  // Troca o passaporte e reaplica as regras de visto nos trechos com país conhecido.
  const trocarPassaporte = async (p) => {
    const temCodigos = plan.legs.some(l => l.code);
    if (temCodigos && !(await confirm({
      title: 'Aplicar regras de visto?',
      message: `Aplicar as regras de visto do passaporte "${PASSAPORTES[p]}" a todos os trechos? Isso sobrescreve ajustes manuais de visto (custo, dias e clima ficam intactos).`,
      confirmLabel: 'Aplicar', variant: 'primary',
    }))) return;
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

  // Otimizador GRÁTIS (determinístico, sem IA): reordena por estação + geografia.
  function handleOtimizarGratis() {
    if (plan.legs.length < 2) { toast('Adicione pelo menos 2 países pra otimizar.', 'erro'); return; }
    const { order, resumo, melhorou } = otimizarOrdemLocal(plan);
    if (!melhorou) { toast('A ordem atual já está bem otimizada. '); return; }
    setPlan(p => ({ ...p, legs: order.map(id => p.legs.find(l => l.id === id)).filter(Boolean) }));
    setRationales({}); setOptResumo(resumo);
    toast('Rota reordenada pela melhor época e menor zigue-zague — grátis, na hora.');
  }

  async function handleOtimizar() {
    if (plan.legs.length < 2) { toast('Adicione pelo menos 2 países pra otimizar.', 'erro'); return; }
    if (!exigirIA()) return;
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
    if (!exigirIA()) return;
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

  async function carregarExemplo() {
    if (await confirm({ title: 'Carregar exemplo?', message: 'Substituir a rota atual pelo exemplo de demonstração?', confirmLabel: 'Substituir', variant: 'primary' })) {
      setPlan(normalizarPlano(planoExemplo())); setRationales({}); setOptResumo('');
    }
  }
  async function limparTudo() {
    if (await confirm({ title: 'Limpar tudo?', message: 'Apagar todos os trechos e começar do zero? Isso não dá pra desfazer.', confirmLabel: 'Apagar tudo' })) {
      setPlan(p => ({ ...p, legs: [] })); setRationales({}); setOptResumo('');
    }
  }

  // Aplica os cortes sugeridos pelo modo orçamento (motor puro, imutável).
  function handleAplicarCortes(cortes) {
    if (!cortes || cortes.length === 0) return;
    setPlan(p => aplicarCortes(p, cortes));
    const totalDias = cortes.reduce((s, c) => s + (c.dias || 0), 0);
    toast(`Cortes aplicados: −${totalDias} dia(s) no total. Ajuste fino quando quiser.`);
  }

  // Gera o link compartilhável (rota no hash, sem chave de IA) e copia.
  async function compartilhar() {
    try {
      const url = `${window.location.origin}${window.location.pathname}#r=${encodePlan(plan)}`;
      await navigator.clipboard.writeText(url);
      toast('Link da rota copiado! É só colar onde quiser.');
    } catch (e) {
      toast('Não consegui copiar o link. Use o Exportar JSON como alternativa.', 'erro');
    }
  }

  // ---- Cenários (Rota A vs B) ----
  function salvarCenario(nome) {
    setCenarios(cs => [...cs, snapshotCenario(plan, nome)]);
    toast(`Cenário "${nome}" salvo.`);
  }
  async function carregarCenario(c) {
    if (plan.legs.length && !(await confirm({ title: 'Carregar cenário?', message: `Substituir a rota atual por "${c.nome}"? Se quiser manter a atual, salve-a como cenário antes.`, confirmLabel: 'Carregar', variant: 'primary' }))) return;
    setPlan(normalizarPlano(c.plan)); setRationales({}); setOptResumo('');
    toast(`Cenário "${c.nome}" carregado.`);
  }
  function removerCenario(id) {
    setCenarios(cs => cs.filter(x => x.id !== id));
    toast('Cenário removido.');
  }
  const toggleCheck = (id) => setCheck(c => ({ ...c, [id]: !c[id] }));

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
      {confirmElement}
      {showLogin && (
        <LoginModal
          onClose={() => setShowLogin(false)}
          onSubmit={async (email) => { await entrarComEmail(email); track('login_solicitado', { metodo: 'magic_link' }); }}
          aoUsarChave={loginIA ? () => { setShowLogin(false); setShowConfig(true); } : undefined}
        />
      )}
      {showConfig && (
        <ConfigIA ai={plan.settings.ai} onClose={() => setShowConfig(false)}
          onSaveAi={(ai) => { setSettings({ ai }); toast('Configurações de IA salvas.'); }}
          fx={plan.settings.fx} moedasEmUso={moedasEmUso} onAtualizarCambio={() => atualizarCambio(false)} cambioBusy={cambioBusy} onSetRate={setRate} />
      )}

      <AppNav />
      <div className="border-b border-line bg-paper2/70">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2.5 flex flex-wrap items-center gap-x-3 gap-y-2">
          <span className="eyebrow mr-auto">Planejador de rota</span>
          <div className="flex flex-wrap items-center justify-end gap-1.5">
            <SaveStatus estado={saveState} naNuvem={naNuvem} onRetry={tentarSincronizar} />
            {supabaseConfigurado && (user
              ? <Button variant="secondary" size="sm" onClick={deslogar} title={user.email}>Sair</Button>
              : <Button variant="secondary" size="sm" onClick={entrar}>Entrar</Button>)}
            <Button variant="ghost" size="sm" onClick={() => setAjuda(a => a + 1)} aria-label="Ajuda / como funciona">Ajuda</Button>
            <Button size="sm" onClick={() => setShowConfig(true)}>IA / Config</Button>
            <details className="relative">
              <summary aria-label="Mais ações: compartilhar, exportar, importar" title="Mais ações"
                className="list-none cursor-pointer inline-flex items-center justify-center w-10 h-10 rounded-full border-2 border-ink bg-card text-ink hover:bg-paper2 focusring [&::-webkit-details-marker]:hidden">
                <span aria-hidden className="text-lg leading-none">⋯</span>
              </summary>
              <div className="absolute right-0 mt-2 w-60 rounded-2xl border border-line bg-card shadow-e2 p-1.5 z-40 flex flex-col">
                <button onClick={compartilhar} className="text-left text-sm px-3 py-2.5 rounded-xl text-ink hover:bg-paper2 focusring"><Icon emoji="🔗" /> Compartilhar (copiar link)</button>
                <button onClick={() => { if (baixarICS(calc)) toast('Calendário .ics baixado — importe no Google/Apple Calendar.'); }} className="text-left text-sm px-3 py-2.5 rounded-xl text-ink hover:bg-paper2 focusring"><Icon emoji="📅" /> Exportar calendário (.ics)</button>
                <button onClick={() => { const u = linkMapaRota(plan); if (u) window.open(u, '_blank', 'noopener'); else toast('Adicione 2+ trechos pra ver a rota no Maps.', 'erro'); }} className="text-left text-sm px-3 py-2.5 rounded-xl text-ink hover:bg-paper2 focusring"><Icon emoji="🗺️" /> Ver rota no Google Maps</button>
                <button onClick={() => exportarPlano(plan)} className="text-left text-sm px-3 py-2.5 rounded-xl text-ink hover:bg-paper2 focusring"><Icon emoji="⬇" /> Exportar JSON</button>
                <button onClick={() => importRef.current && importRef.current.click()} className="text-left text-sm px-3 py-2.5 rounded-xl text-ink hover:bg-paper2 focusring"><Icon emoji="⬆" /> Importar JSON</button>
              </div>
            </details>
            <input ref={importRef} type="file" accept="application/json,.json" onChange={handleImport} className="hidden" aria-hidden tabIndex={-1} />
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        <div className="rise">
          <h1 className="ms-titulo text-[44px] sm:text-[72px] leading-[.9] tracking-[-.05em] text-ink max-w-4xl">
            a volta ao mundo <span className="text-cobalto">na ordem que não te quebra</span>
          </h1>
          <p className="mt-4 text-lg text-[#33332F] max-w-2xl">
            Errar a ordem dos países custa caro: você chega na monção, fura o visto ou a grana acaba no meio do caminho.
            Arraste os trechos e veja, em tempo real, o cruzamento de <b className="text-ink">estação</b>, <b className="text-ink">visto</b> e <b className="text-ink">fôlego de dinheiro</b>.
          </p>
        </div>

        <Onboarding forcado={ajuda} />

        <ParametrosViagem settings={plan.settings} base={base} onSet={setSettings} onBase={trocarBase} onPassaporte={trocarPassaporte} />

        {plan.legs.length > 0 && <PlacarRota calc={calc} />}
        {plan.legs.length > 0 && <FitaDoAno calc={calc} />}
        <Tripe calc={calc} />

        {plan.legs.length > 0 && (
          <Tabs value={aba} onChange={setAba}
            tabs={[{ id: 'rota', icon: '🧭', label: 'Rota' }, { id: 'mapa', icon: '🗺️', label: 'Mapa' }, { id: 'custos', icon: '💰', label: 'Custos' }, { id: 'cenarios', icon: '⚖️', label: 'Cenários' }, { id: 'checklist', icon: '📋', label: 'Checklist' }]} />
        )}

        {optResumo && (
          <div className="rise rounded-xl border border-warn-bd bg-warn-bg text-warn px-4 py-3 text-sm flex items-start gap-2">
            <span aria-hidden><Icon emoji="🧭" /></span><div className="flex-1"><b>Otimizador:</b> {optResumo}</div>
            <button onClick={() => setOptResumo('')} aria-label="Fechar resumo" className="text-inksoft hover:text-ink focusring"><Icon emoji="✕" /></button>
          </div>
        )}

        {plan.legs.length > 0 && aba === 'mapa' && (
          <RouteMap trechos={calc.trechos} onSelect={(id) => { setAba('rota'); setTimeout(() => { const el = document.getElementById('leg-' + id); if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' }); }, 80); }} />
        )}

        {plan.legs.length > 0 && aba === 'custos' && (
          <div>
            <CustosView calc={calc} />
            <BudgetPanel calc={calc} onAplicarCortes={handleAplicarCortes} />
          </div>
        )}

        {plan.legs.length > 0 && aba === 'cenarios' && (
          <CenariosView plan={plan} cenarios={cenarios} onSalvar={salvarCenario} onCarregar={carregarCenario} onRemover={removerCenario} />
        )}

        {plan.legs.length > 0 && aba === 'checklist' && (
          <ChecklistView plan={plan} done={check} onToggle={toggleCheck} />
        )}

        {(plan.legs.length === 0 || aba === 'rota') && (
          <section aria-label="Construtor de rota">
            <div className="flex flex-wrap items-center gap-3 mb-3">
              <h2 className="font-display text-2xl text-ink mr-auto">Sua rota <span className="text-inksoft text-base font-sans">· {plan.legs.length} trecho(s) · {dur(calc.diasTotais)}</span></h2>
              <label className="text-xs text-inksoft flex items-center gap-1 bg-card border border-line rounded-lg px-2 py-1" title="Origem do 1º voo (busca de passagem).">
                <Icon emoji="✈" /> Saindo de
                <input value={plan.settings.origemCidade} onChange={(e) => setSettings({ origemCidade: e.target.value })} aria-label="Cidade de origem" className="w-20 bg-transparent text-ink focusring" />
                <input value={plan.settings.origemIata} onChange={(e) => setSettings({ origemIata: e.target.value.toUpperCase().slice(0, 3) })} aria-label="Aeroporto de origem (código IATA)" placeholder="IATA" className="w-12 bg-transparent text-ink focusring uppercase" />
              </label>
              <Button variant="accent" onClick={handleOtimizarGratis}><Icon emoji="✨" /> Otimizar ordem (grátis)</Button>
              <Button variant="secondary" size="sm" onClick={handleOtimizar} loading={otimizando} title="Reordena e explica o porquê de cada país (usa IA)">{otimizando ? 'IA…' : '+ justificativas (IA)'}</Button>
              <div className="flex items-center gap-1.5">
                <Button variant="secondary" size="sm" onClick={carregarExemplo}>Exemplo</Button>
                <Button variant="ghost" size="sm" onClick={limparTudo}>Limpar</Button>
              </div>
            </div>

            {plan.legs.length === 0 ? (
              <EmptyState
                title="Sua rota está vazia."
                subtitle="Adicione países abaixo (já vêm com custo, estação e visto estimados) ou carregue o exemplo de demonstração."
                action={<Button variant="secondary" onClick={carregarExemplo}>Carregar exemplo</Button>}
              />
            ) : (
              <div role="list">
                {calc.trechos.map((t, i) => (
                  <div key={t.id} id={'leg-' + t.id}>
                    <TrechoCard
                      t={t} index={i} total={calc.trechos.length} base={base} passaporte={plan.settings.passaporte}
                      origemCidade={i === 0 ? plan.settings.origemCidade : (calc.trechos[i - 1].cidadePrincipal || '')}
                      origemIata={i === 0 ? plan.settings.origemIata : (calc.trechos[i - 1].iata || '')}
                      origemCoords={i === 0 ? null : (calc.trechos[i - 1].coords || null)}
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
                            <Icon emoji="✈" /> {fmtMoeda(calc.trechos[i + 1].custoTransporte, base)}
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
          <p>Cada trecho usa a moeda que você escolher; os totais aparecem na moeda base ({base}) usando câmbio aproximado (atualizável e editável em IA / Config — não use como cotação exata). O custo de voo/transporte entre países entra no total e no fôlego. Os dados ficam salvos neste navegador (e na nuvem, se você entrar) — exporte o JSON para backup. As features de IA usam a sua chave, rodando direto do navegador, ou — se você fizer login — a chave do servidor.</p>
        </footer>
      </main>
    </div>
  );
}
