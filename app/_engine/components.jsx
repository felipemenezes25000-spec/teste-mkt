import { MESES_PT, MESES_PT_LONGO } from './data.js';
import { fmtMoeda, fmtData, clamp, num } from './utils.js';
import { Badge } from '../_ui/Badge.jsx';
import { rotuloSalvamento } from './saveStatus.js';
import { Icon } from '../_ui/Icon.jsx';
import { Placar } from '../_ui/Placar.jsx';

// Cores por nível (strings completas pro Tailwind detectar no build).
export const ESTACAO_UI = {
  bom:     { dot:'bg-sage',     chip:'bg-success-bg text-success border-success-bd', label:'Boa época' },
  parcial: { dot:'bg-amberx',   chip:'bg-warn-bg text-warn border-warn-bd', label:'Época parcial' },
  ruim:    { dot:'bg-clay',     chip:'bg-danger-bg text-danger border-danger-bd', label:'Fora de época' },
  na:      { dot:'bg-inksoft/50',chip:'bg-paper2 text-inksoft border-line', label:'Sem dado' },
};
export const VISTO_UI = {
  ok:   { chip:'bg-success-bg text-success border-success-bd' },
  over: { chip:'bg-danger-bg text-danger border-danger-bd' },
  na:   { chip:'bg-paper2 text-inksoft border-line' },
};
export const NIVEL_FOLEGO = {
  verde:    { barra:'bg-sage',  texto:'text-success', tag:'Folgado',  bgtile:'bg-success-bg border-success-bd' },
  amarelo:  { barra:'bg-amberx',texto:'text-warn', tag:'Apertado', bgtile:'bg-warn-bg border-warn-bd' },
  vermelho: { barra:'bg-clay',  texto:'text-danger', tag:'Não fecha', bgtile:'bg-danger-bg border-danger-bd' },
};

export function Toasts({ items, onClose }) {
  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 w-[min(92vw,360px)]" aria-live="polite">
      {items.map(t => (
        <div key={t.id} role={t.tipo === 'erro' ? 'alert' : 'status'}
          className={`rise rounded-xl border px-4 py-3 shadow-lg text-sm flex items-start gap-2 ${t.tipo === 'erro' ? 'bg-danger-bg border-danger-bd text-danger' : 'bg-success-bg border-success-bd text-success'}`}>
          <span className="font-bold" aria-hidden><Icon emoji={t.tipo === 'erro' ? '⚠' : '✓'} /></span>
          <span className="flex-1">{t.msg}</span>
          <button onClick={() => onClose(t.id)} className="text-inksoft hover:text-ink focusring" aria-label="Fechar aviso"><Icon emoji="✕" /></button>
        </div>
      ))}
    </div>
  );
}

// Indicador de "salvo" no cabeçalho: reforça que nada se perde. Distingue salvo no
// navegador (deslogado) de salvo na nuvem (logado), e expõe falha de sincronização de
// forma honesta — sem assustar, porque o dado local segue intacto. A lógica de texto/cor
// fica na função pura rotuloSalvamento (testada); aqui só desenha.
export function SaveStatus({ estado = 'saved', naNuvem = false, onRetry }) {
  const r = rotuloSalvamento(naNuvem, estado);
  const podeTentar = estado === 'error' && naNuvem && typeof onRetry === 'function';
  const dica = estado === 'error'
    ? (naNuvem
        ? 'Seus dados seguem salvos neste navegador. Toque para tentar sincronizar de novo.'
        : 'Não consegui salvar neste navegador (aba anônima ou armazenamento cheio?).')
    : r.texto;

  const conteudo = (
    <Badge tone={r.tone} className={podeTentar ? 'cursor-pointer hover:brightness-95' : ''}>
      {r.spinner
        ? <span className="inline-block w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" aria-hidden />
        : <span aria-hidden><Icon emoji={r.icone} /></span>}
      <span className="sm:hidden">{r.textoCurto}</span>
      <span className="hidden sm:inline">{r.texto}</span>
    </Badge>
  );

  if (podeTentar) {
    return (
      <span role="status" aria-live="polite" className="inline-flex">
        <button type="button" onClick={onRetry} title={dica}
          aria-label={`${r.texto}. Tentar sincronizar de novo.`} className="focusring rounded-full">
          {conteudo}
        </button>
      </span>
    );
  }
  return (
    <span role="status" aria-live="polite" title={dica} aria-label={r.texto} className="inline-flex">
      {conteudo}
    </span>
  );
}

export function NumberInput({ value, onChange, min = 0, max = 100000, step = 1, suffix, className = '', ariaLabel }) {
  return (
    <div className={`flex items-center rounded-lg border border-line bg-input overflow-hidden ${className}`}>
      <input type="number" inputMode="decimal" min={min} max={max} step={step} value={value} aria-label={ariaLabel}
        onChange={(e) => onChange(clamp(num(e.target.value, min), min, max))}
        className="w-full px-2.5 py-1.5 bg-transparent text-ink tnum focusring rounded-lg" />
      {suffix && <span className="px-2 text-xs text-inksoft shrink-0" aria-hidden>{suffix}</span>}
    </div>
  );
}

export function MesesPicker({ value, onChange }) {
  const set = new Set(value || []);
  return (
    <div className="flex flex-wrap gap-1" role="group" aria-label="Melhores meses para o clima">
      {MESES_PT.map((m, i) => {
        const mn = i + 1; const on = set.has(mn);
        return (
          <button key={mn} type="button" aria-pressed={on}
            aria-label={`${MESES_PT_LONGO[i]}${on ? ' (marcado como boa época)' : ''}`}
            onClick={() => { const ns = new Set(set); on ? ns.delete(mn) : ns.add(mn); onChange([...ns].sort((a, b) => a - b)); }}
            className={`px-2 py-1 rounded-md text-xs border transition focusring ${on ? 'bg-pine text-onpine border-pine' : 'bg-input text-inksoft border-line hover:border-pine/50'}`}>
            {m}
          </button>
        );
      })}
    </div>
  );
}

export function StatusChip({ ui, children }) {
  return <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-medium ${ui}`}>{children}</span>;
}

function PillarTile({ icone, titulo, principal, secundario, nivel, borderTop }) {
  const ui = NIVEL_FOLEGO[nivel];
  return (
    <div className={`p-6 sm:p-7 ${borderTop ? 'border-t border-line' : ''}`}>
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-inksoft">
        <span><Icon emoji={icone} /> {titulo}</span>
        <span className={`px-2 py-0.5 rounded-full border text-[11px] ${ui.bgtile} ${ui.texto}`}>{ui.tag}</span>
      </div>
      <div className={`mt-2 font-display text-2xl leading-tight ${ui.texto}`} aria-live="polite">{principal}</div>
      <p className="mt-1 text-sm text-inksoft">{secundario}</p>
    </div>
  );
}

// O "tripé": fôlego × estação × visto — o diferencial, em destaque no topo.
export function Tripe({ calc }) {
  const base = calc.base;
  const f = calc.folego;
  const fui = NIVEL_FOLEGO[f.nivel];
  const pct = clamp((calc.orcamento > 0 ? calc.custoTotal / calc.orcamento : 1) * 100, 0, 100);

  return (
    <section className="rise rounded-2xl border border-line bg-card shadow-e2 overflow-hidden" aria-label="Diagnóstico da viagem">
      <div className="grid lg:grid-cols-[1.25fr_1fr]">
        <div className="p-6 sm:p-8 border-b lg:border-b-0 lg:border-r border-line relative">
          <div className="absolute -top-6 -right-6 w-28 h-28 rounded-full bg-pine/5 blur-2xl" aria-hidden></div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-inksoft">
            <span><Icon emoji="🧭" /> Fôlego de grana</span>
            <span className={`px-2 py-0.5 rounded-full border text-[11px] ${fui.bgtile} ${fui.texto}`}>{fui.tag}</span>
          </div>

          <div className="mt-3" aria-live="polite">
            {f.cobreTudo ? (
              <div>
                <div className="font-display text-3xl sm:text-4xl leading-tight text-ink">Sua grana dura a viagem toda.</div>
                <p className={`mt-2 text-[15px] ${fui.texto}`}>
                  Sobra <b>{fmtMoeda(f.sobra, base)}</b> — dá pra esticar <b>~{f.diasExtras} dias</b> a mais no ritmo de vida atual
                  ({fmtMoeda(calc.mediaDia, base)}/dia). Fim previsto: <b>{fmtData(f.fimViagem)}</b>.
                </p>
              </div>
            ) : (
              <div>
                <div className="font-display text-3xl sm:text-4xl leading-tight text-danger">A grana acaba em {fmtData(f.dataQuebra)}.</div>
                <p className="mt-2 text-[15px] text-danger">
                  Faltam <b>{fmtMoeda(f.falta, base)}</b> pra fechar — cerca de <b>{f.diasDescobertos} dias</b> da viagem ficam descobertos.
                  {calc.orcamento <= 0 && ' Defina seu orçamento ali em cima.'}
                </p>
              </div>
            )}
          </div>

          <div className="mt-5">
            <div className="flex justify-between text-xs text-inksoft mb-1">
              <span>Custo total: <b className="text-ink tnum">{fmtMoeda(calc.custoTotal, base)}</b></span>
              <span>Orçamento: <b className="text-ink tnum">{fmtMoeda(calc.orcamento, base)}</b></span>
            </div>
            <div className="h-3.5 rounded-full bg-paper2 overflow-hidden border border-line"
              role="progressbar" aria-valuenow={Math.round(pct)} aria-valuemin={0} aria-valuemax={100} aria-label="Custo total versus orçamento">
              <div className={`h-full gauge-fill ${fui.barra}`} style={{ width: pct + '%' }}></div>
            </div>
            <div className="mt-1 text-xs text-inksoft tnum">
              {calc.diasTotais} dias • vida {fmtMoeda(calc.mediaDia, base)}/dia • <Icon emoji="✈" /> transporte {fmtMoeda(calc.custoTransporteTotal, base)} • em {base}
            </div>
          </div>
        </div>

        <div className="grid grid-rows-2">
          <PillarTile icone="🌤️" titulo="Estação climática"
            nivel={calc.conflitosEstacao > 0 ? 'vermelho' : (calc.parciaisEstacao > 0 ? 'amarelo' : 'verde')}
            principal={calc.conflitosEstacao > 0 ? `${calc.conflitosEstacao} país(es) fora de época` : (calc.parciaisEstacao > 0 ? `${calc.parciaisEstacao} em época parcial` : 'Todos em boa época')}
            secundario={calc.conflitosEstacao > 0 ? 'Reordene ou ajuste as datas pra acertar o clima.' : (calc.parciaisEstacao > 0 ? 'Dá pra otimizar pra pegar a estação cheia.' : 'Mandou bem no timing do clima.')}
          />
          <PillarTile borderTop icone="🛂" titulo="Janela de visto"
            nivel={calc.furosVisto > 0 ? 'vermelho' : 'verde'}
            principal={calc.furosVisto > 0 ? `${calc.furosVisto} trecho(s) furam o visto` : 'Nenhum trecho fura o visto'}
            secundario={calc.furosVisto > 0 ? 'Reduza os dias ou planeje extensão/saída.' : 'Dias planejados dentro dos limites.'}
          />
        </div>
      </div>
    </section>
  );
}

// ===== CALÇADÃO: placar da rota + fita do ano =====
// Placar com o diagnóstico em 4 linhas (estação, visto, fôlego, dias) — gira quando
// a ordem/dias mudam — e a fita do ano: cada país vira um trecho proporcional aos
// dias, amarelo na boa época, âmbar parcial, cinza fora de época.
const FITA_COR = { bom: 'bg-coral text-ink', parcial: 'bg-ochresoft text-ink', ruim: 'bg-[#DADAD3] text-ink', na: 'bg-paper2 text-inksoft' };

export function PlacarRota({ calc }) {
  const n = calc.trechos.length || 1;
  const bons = calc.trechos.filter((t) => t.estacao.nivel === 'bom').length;
  const parciais = calc.trechos.filter((t) => t.estacao.nivel === 'parcial').length;
  const pctEstacao = Math.round(((bons + parciais * 0.5) / n) * 100);
  const f = calc.folego;
  const valor = (x) => fmtMoeda(Math.abs(x), calc.base).replace(/ /g, ' ');
  const linhas = [
    ['ESTAÇÃO', `${pctEstacao}% NA ÉPOCA`, pctEstacao >= 80 ? '#00804D' : pctEstacao >= 50 ? '#9A5B00' : '#C8281C', `estação: ${pctEstacao}% da rota na boa época`],
    ['VISTO', calc.furosVisto ? `${calc.furosVisto} FURO${calc.furosVisto > 1 ? 'S' : ''}` : 'SEM FURO', calc.furosVisto ? '#C8281C' : '#00804D', calc.furosVisto ? `${calc.furosVisto} trecho(s) furam o visto` : 'nenhum trecho fura o visto'],
    ['FÔLEGO', f.cobreTudo ? `SOBRA ${valor(f.sobra)}` : `FALTA ${valor(f.falta)}`, f.cobreTudo ? '#111111' : '#C8281C', f.cobreTudo ? `sobra ${valor(f.sobra)}` : `faltam ${valor(f.falta)}`],
    ['DIAS', `${calc.diasTotais} DIAS · ${calc.trechos.length} PAÍSES`, '#111111', `${calc.diasTotais} dias em ${calc.trechos.length} países`],
  ];
  return (
    <section className="rise rounded-[28px] bg-paper2 p-4 sm:p-6 overflow-x-auto" aria-label="Placar da rota">
      <span className="ms-rotulo">Placar da rota · gira quando você muda a ordem</span>
      <div className="mt-3 flex flex-col gap-2.5 min-w-[560px]">
        {linhas.map(([rot, val, cor, aria], i) => (
          <div key={rot} className="grid grid-cols-[110px_1fr] items-center gap-3">
            <span className="ms-rotulo !text-ink">{rot}</span>
            <Placar texto={val.slice(0, 22).padEnd(22, ' ')} w={20} h={30} cor={cor} atraso={i * 120} passo={18} rotulo={aria} />
          </div>
        ))}
      </div>
    </section>
  );
}

export function FitaDoAno({ calc }) {
  if (!calc.trechos.length || calc.diasTotais <= 0) return null;
  const total = calc.diasTotais;
  // marcas de mês ao longo da fita
  const marcas = [];
  const ini = calc.inicio;
  for (let d = new Date(ini.getFullYear(), ini.getMonth() + 1, 1); d < calc.fimViagem; d = new Date(d.getFullYear(), d.getMonth() + 1, 1)) {
    const pos = (d - ini) / 86400000 / total;
    if (pos > 0 && pos < 1) marcas.push([pos, MESES_PT[d.getMonth()].slice(0, 3).toUpperCase()]);
  }
  return (
    <section className="rise rounded-[28px] border border-line p-4 sm:p-6" aria-label="Fita do ano">
      <div className="flex flex-wrap items-end justify-between gap-2">
        <span className="ms-rotulo">Fita do ano · {fmtData(calc.inicio)} → {fmtData(calc.fimViagem)}</span>
        <span className="flex flex-wrap gap-3 text-[12px] text-inksoft">
          <span className="inline-flex items-center gap-1.5"><i className="w-3 h-3 rounded-sm bg-coral" />boa época</span>
          <span className="inline-flex items-center gap-1.5"><i className="w-3 h-3 rounded-sm bg-ochresoft" />parcial</span>
          <span className="inline-flex items-center gap-1.5"><i className="w-3 h-3 rounded-sm bg-[#DADAD3]" />fora de época</span>
        </span>
      </div>
      <div className="mt-4 relative">
        <ol className="flex gap-1 h-[64px]">
          {calc.trechos.map((t) => (
            <li key={t.id} className={`relative min-w-[28px] rounded-lg overflow-hidden flex flex-col justify-between p-1.5 ${FITA_COR[t.estacao.nivel] || FITA_COR.na}`}
              style={{ flex: `${Math.max(1, t.dias)} 1 0` }} title={`${t.nome}: ${t.dias} dias · ${t.estacao.texto}`}>
              {t.code && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={`/bandeiras/${t.code}.png`} alt="" className="h-3.5 w-auto self-start rounded-[2px] shadow-[0_0_0_1px_rgba(0,0,0,.12)]" />
              )}
              <span className="font-cond font-extrabold text-[13px] uppercase leading-none truncate">{t.dias >= 10 ? t.nome : t.code || ''}</span>
              <span className="sr-only">{t.nome}, {t.dias} dias, {(ESTACAO_UI[t.estacao.nivel] || ESTACAO_UI.na).label}</span>
            </li>
          ))}
        </ol>
        <div className="relative h-5 mt-1" aria-hidden="true">
          {marcas.map(([pos, m]) => (
            <span key={`${m}${pos}`} className="absolute top-0 -translate-x-1/2 font-cond font-bold text-[11px] tracking-[.08em] text-inksoft" style={{ left: `${pos * 100}%` }}>{m}</span>
          ))}
        </div>
      </div>
    </section>
  );
}
