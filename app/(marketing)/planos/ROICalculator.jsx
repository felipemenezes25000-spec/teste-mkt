'use client';
import { useState } from 'react';
import Link from 'next/link';
import { track } from '../../_lib/analytics.js';
import { useIdioma } from '../../_lib/i18n.js';

// Calculadora "quanto custa uma escolha ruim": o usuário marca quais erros já
// cometeu (ou pode cometer) e a UI soma. Sempre maior que 12 meses de Premium
// (R$ 19/mês = R$ 228/ano). É argumento concreto, não retórica.

const ERROS = [
  { id: 'diaria-ruim', label: '1 diária em hotel ruim que te fez trocar', valor: 320, exemplo: 'longe do metrô, vira taxa de Uber' },
  { id: 'voo-mal', label: '1 voo barato que destruiu o primeiro dia', valor: 800, exemplo: 'chega 03h40, perde 1 dia inteiro de viagem' },
  { id: 'fora-epoca', label: '1 destino fora da melhor época', valor: 1200, exemplo: 'chuva 5 dias seguidos, passeio cancelado' },
  { id: 'passeio-perdido', label: '1 passeio principal perdido (esgotado / errado de mês)', valor: 480, exemplo: 'Machu Picchu sem ingresso, balão em Capadócia fora da janela' },
  { id: 'deslocamento', label: '1 deslocamento desnecessário no roteiro', valor: 280, exemplo: 'pulou de cidade longe demais por dia' },
  { id: 'cambio', label: 'Compra de moeda no momento ruim', valor: 350, exemplo: 'fez câmbio no aeroporto sem comparar' },
  { id: 'bagagem', label: 'Bagagem despachada que não precisava', valor: 220, exemplo: 'voo low cost cobrando 4 vezes na ida e volta' },
  { id: 'seguro', label: 'Sem seguro e teve consulta médica', valor: 1500, exemplo: 'qualquer atendimento simples na Europa/EUA' },
];

const PREMIUM_MES = 19;
const PREMIUM_ANO = PREMIUM_MES * 12;

export function ROICalculator() {
  const [marcados, setMarcados] = useState({ 'diaria-ruim': true, 'voo-mal': true });
  const [meses, setMeses] = useState(12);
  const { t } = useIdioma();

  const total = ERROS.reduce((s, e) => s + (marcados[e.id] ? e.valor : 0), 0);
  const planoTotal = PREMIUM_MES * meses;
  const economia = Math.max(0, total - planoTotal);
  const roi = planoTotal > 0 ? Math.round((economia / planoTotal) * 100) : 0;

  function toggle(id) {
    setMarcados((m) => {
      const next = { ...m, [id]: !m[id] };
      const ativos = Object.entries(next).filter(([, v]) => v).map(([k]) => k);
      const totalErros = ERROS.reduce((s, e) => s + (next[e.id] ? e.valor : 0), 0);
      track('roi_calculou', { erros_marcados: ativos.length, total: totalErros });
      return next;
    });
  }

  return (
    <div className="mt-10 rounded-3xl border border-line bg-card overflow-hidden shadow-[var(--e-1)]">
      <div className="p-6 sm:p-8 border-b border-line bg-paper2/40">
        <span className="inline-block text-[11px] font-bold uppercase tracking-[0.18em] text-coral">{t('planos.roiSelo')}</span>
        <h2 className="mt-3 font-display text-3xl sm:text-4xl text-ink leading-[1.05]">
          {t('planos.roiH2')}
        </h2>
        <p className="mt-3 text-inksoft max-w-2xl">
          {t('planos.roiP')}
        </p>
      </div>

      <div className="grid lg:grid-cols-[1.1fr_1fr]">
        <ul className="p-5 sm:p-6 space-y-2">
          {ERROS.map((e) => {
            const ativo = !!marcados[e.id];
            return (
              <li key={e.id}>
                <button
                  type="button"
                  onClick={() => toggle(e.id)}
                  aria-pressed={ativo}
                  className={`w-full text-left rounded-2xl border p-3 sm:p-4 transition focusring flex items-start gap-3 ${ativo ? 'border-coral bg-coral/[0.06]' : 'border-line bg-paper2/40 hover:border-pine/40'}`}
                >
                  <span
                    aria-hidden
                    className={`shrink-0 mt-0.5 w-5 h-5 rounded-md border grid place-items-center text-xs font-bold ${ativo ? 'bg-coral border-coral text-oncoral' : 'border-line bg-card text-transparent'}`}
                  >
                    ✓
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-baseline justify-between gap-2">
                      <span className="text-sm text-ink font-medium">{e.label}</span>
                      <span className="text-sm font-semibold text-ink tnum">R$ {e.valor.toLocaleString('pt-BR')}</span>
                    </div>
                    <p className="text-[11px] text-inksoft mt-0.5 leading-snug">{e.exemplo}</p>
                  </div>
                </button>
              </li>
            );
          })}
        </ul>

        <div className="p-5 sm:p-6 bg-paper2/30 lg:border-l border-line">
          <div className="rounded-3xl bg-pine text-white p-5 shadow-[var(--e-1)]">
            <div className="text-[11px] font-bold uppercase tracking-wide opacity-85">{t('planos.custoErros')}</div>
            <div className="mt-1 font-display text-5xl tnum">R$ {total.toLocaleString('pt-BR')}</div>
            <p className="mt-2 text-xs opacity-85">{t('planos.umaViagem')}</p>
          </div>

          <div className="mt-4 rounded-2xl border border-line bg-card p-4">
            <label className="text-xs font-medium text-inksoft block">
              {t('planos.premiumPor')}
              <select value={meses} onChange={(e) => setMeses(Number(e.target.value))} className="ml-2 px-2 py-1 rounded-md border border-line bg-input text-ink focusring text-sm">
                <option value={3}>3 meses</option>
                <option value={6}>6 meses</option>
                <option value={12}>12 meses</option>
                <option value={24}>24 meses</option>
              </select>
            </label>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="font-display text-2xl text-ink tnum">R$ {planoTotal}</span>
              <span className="text-xs text-inksoft">total no período</span>
            </div>
          </div>

          {economia > 0 ? (
            <div className="mt-3 rounded-2xl border border-success-bd bg-success-bg p-4">
              <div className="text-[11px] font-bold uppercase tracking-wide text-success">{t('planos.economiaLabel')}</div>
              <div className="mt-1 font-display text-3xl text-success tnum">R$ {economia.toLocaleString('pt-BR')}</div>
              <p className="mt-1 text-[11px] text-success">ROI de {roi}% — sem contar tempo, ansiedade e arrependimento.</p>
            </div>
          ) : (
            <div className="mt-3 rounded-2xl border border-line bg-paper2 p-4 text-xs text-inksoft">
              Marque pelo menos um erro pra ver a conta.
            </div>
          )}

          <div className="mt-5 flex flex-wrap gap-2">
            <Link href="/conta" className="inline-flex rounded-xl bg-coral text-oncoral font-semibold px-4 py-2.5 hover:brightness-95 focusring">
              {t('planos.assinarPremium')}
            </Link>
            <Link href="/custo-real" className="inline-flex rounded-xl border border-line bg-card text-ink font-semibold px-4 py-2.5 hover:text-pine focusring">
              {t('planos.verCustoPrimeiro')}
            </Link>
          </div>

          <p className="mt-4 text-[11px] text-inksoft border-t border-line pt-3">
            Valores de erro são médias de mercado para viagens internacionais. Sua viagem específica pode ter delta menor ou maior — a ideia é dar tom de grandeza, não cotação.
          </p>
        </div>
      </div>
    </div>
  );
}
