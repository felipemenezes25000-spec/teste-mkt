import { MESES_PT, MESES_PT_LONGO } from './data.js';
import { fmtMoeda, fmtData, clamp, num } from './utils.js';

// Cores por nível (strings completas pro Tailwind detectar no build).
export const ESTACAO_UI = {
  bom:     { dot:'bg-sage',     chip:'bg-[#E7F1EA] text-[#1f6b48] border-[#bfe0cd]', label:'Boa época' },
  parcial: { dot:'bg-amberx',   chip:'bg-[#F7EDD6] text-[#8a5e12] border-[#e7d3a3]', label:'Época parcial' },
  ruim:    { dot:'bg-clay',     chip:'bg-[#F6E2DB] text-[#9a3b27] border-[#e7c1b6]', label:'Fora de época' },
  na:      { dot:'bg-stone-400',chip:'bg-stone-100 text-stone-500 border-stone-200', label:'Sem dado' },
};
export const VISTO_UI = {
  ok:   { chip:'bg-[#E7F1EA] text-[#1f6b48] border-[#bfe0cd]' },
  over: { chip:'bg-[#F6E2DB] text-[#9a3b27] border-[#e7c1b6]' },
  na:   { chip:'bg-stone-100 text-stone-500 border-stone-200' },
};
export const NIVEL_FOLEGO = {
  verde:    { barra:'bg-sage',  texto:'text-[#1f6b48]', tag:'Folgado',  bgtile:'bg-[#E7F1EA] border-[#bfe0cd]' },
  amarelo:  { barra:'bg-amberx',texto:'text-[#8a5e12]', tag:'Apertado', bgtile:'bg-[#F7EDD6] border-[#e7d3a3]' },
  vermelho: { barra:'bg-clay',  texto:'text-[#9a3b27]', tag:'Não fecha', bgtile:'bg-[#F6E2DB] border-[#e7c1b6]' },
};

export function Toasts({ items, onClose }) {
  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 w-[min(92vw,360px)]" aria-live="polite">
      {items.map(t => (
        <div key={t.id} role={t.tipo === 'erro' ? 'alert' : 'status'}
          className={`rise rounded-xl border px-4 py-3 shadow-lg text-sm flex items-start gap-2 ${t.tipo === 'erro' ? 'bg-[#F6E2DB] border-[#e7c1b6] text-[#9a3b27]' : 'bg-[#E7F1EA] border-[#bfe0cd] text-[#1f6b48]'}`}>
          <span className="font-bold" aria-hidden>{t.tipo === 'erro' ? '⚠' : '✓'}</span>
          <span className="flex-1">{t.msg}</span>
          <button onClick={() => onClose(t.id)} className="opacity-60 hover:opacity-100 focusring" aria-label="Fechar aviso">✕</button>
        </div>
      ))}
    </div>
  );
}

export function NumberInput({ value, onChange, min = 0, max = 100000, step = 1, suffix, className = '', ariaLabel }) {
  return (
    <div className={`flex items-center rounded-lg border border-line bg-white overflow-hidden ${className}`}>
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
            className={`px-2 py-1 rounded-md text-xs border transition focusring ${on ? 'bg-pine text-white border-pine' : 'bg-white text-inksoft border-line hover:border-pine/50'}`}>
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
        <span>{icone} {titulo}</span>
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
    <section className="rise rounded-3xl border border-line bg-card shadow-[0_24px_60px_-30px_rgba(34,45,43,0.45)] overflow-hidden" aria-label="Diagnóstico da viagem">
      <div className="grid lg:grid-cols-[1.25fr_1fr]">
        <div className="p-6 sm:p-8 border-b lg:border-b-0 lg:border-r border-line relative">
          <div className="absolute -top-6 -right-6 w-28 h-28 rounded-full bg-pine/5 blur-2xl" aria-hidden></div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-inksoft">
            <span>🧭 Fôlego de grana</span>
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
                <div className="font-display text-3xl sm:text-4xl leading-tight text-[#9a3b27]">A grana acaba em {fmtData(f.dataQuebra)}.</div>
                <p className="mt-2 text-[15px] text-[#9a3b27]">
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
              {calc.diasTotais} dias • vida {fmtMoeda(calc.mediaDia, base)}/dia • ✈ transporte {fmtMoeda(calc.custoTransporteTotal, base)} • em {base}
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
