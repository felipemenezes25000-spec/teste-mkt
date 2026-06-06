'use client';
import { useMemo, useState } from 'react';
import { useCambioBRL } from '../_lib/cambioClient.js';
import { useIdioma } from '../_lib/i18n.js';

// "O que fazer e quanto custa" — lista de atrações/museus/passeios com preço de
// ingresso ou tour. Filtro por categoria. Preço em USD convertido pra BRL ao vivo.
// Ordenado por categoria → preço. Renderiza nada se o país não tem dados ainda.
//
// `itens` vem como PROP do Server Component (página de destino) — assim a tabela
// completa de 2.765 itens fica no bundle do servidor, e só a fatia do país (~14
// itens) é serializada no HTML. Sem isso, o import inflava o JS do client em 100kB+.

const CAT_ICON = {
  museu: '🏛️', passeio: '🚶', atracao: '🎡', parque: '🌳',
  experiencia: '✨', religioso: '⛪', natureza: '🏞️', historico: '🏺',
};
const CAT_KEY = {
  museu: 'catMuseu', passeio: 'catPasseio', atracao: 'catAtracao', parque: 'catParque',
  experiencia: 'catExperiencia', religioso: 'catReligioso', natureza: 'catNatureza', historico: 'catHistorico',
};

function fmtPreco(usd, brl, t) {
  if (!usd || usd <= 0) return { label: t('destino.precoGratis'), free: true };
  const r = Math.round(usd * brl);
  return { label: `R$ ${r.toLocaleString('pt-BR')}`, sub: `US$ ${Math.round(usd)}`, free: false };
}

export function OQueFazer({ itens = [] }) {
  const cambio = useCambioBRL();
  const { t } = useIdioma();
  const [filtro, setFiltro] = useState('todos');

  // Categorias presentes (na ordem canônica), só as que têm item.
  const categorias = useMemo(() => {
    const ordem = ['museu', 'passeio', 'atracao', 'parque', 'experiencia', 'religioso', 'natureza', 'historico'];
    const presentes = new Set(itens.map((i) => i.categoria));
    return ordem.filter((c) => presentes.has(c));
  }, [itens]);

  const visiveis = useMemo(() => {
    const arr = filtro === 'todos' ? itens : itens.filter((i) => i.categoria === filtro);
    // ordena por preço crescente (grátis primeiro), depois nome
    return [...arr].sort((a, b) => (a.precoUSD || 0) - (b.precoUSD || 0));
  }, [itens, filtro]);

  if (!itens.length) return null;

  return (
    <section aria-labelledby="oque-fazer-titulo">
      <h2 id="oque-fazer-titulo" className="font-display text-2xl text-ink mb-1">🎟️ {t('destino.fazerTitulo')}</h2>
      <p className="text-sm text-inksoft mb-4 max-w-2xl">{t('destino.fazerSub')}</p>

      {/* Filtro de categoria */}
      <div className="flex flex-wrap gap-1.5 mb-4">
        <button
          type="button" onClick={() => setFiltro('todos')} aria-pressed={filtro === 'todos'}
          className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition focusring ${filtro === 'todos' ? 'bg-pine text-white border-pine' : 'bg-card text-inksoft border-line hover:border-pine/50'}`}
        >
          {t('destino.fazerTodos')} ({itens.length})
        </button>
        {categorias.map((c) => {
          const n = itens.filter((i) => i.categoria === c).length;
          return (
            <button
              key={c} type="button" onClick={() => setFiltro(c)} aria-pressed={filtro === c}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition focusring ${filtro === c ? 'bg-pine text-white border-pine' : 'bg-card text-inksoft border-line hover:border-pine/50'}`}
            >
              {CAT_ICON[c]} {t(`destino.${CAT_KEY[c]}`)} ({n})
            </button>
          );
        })}
      </div>

      <div className="rounded-3xl border border-line bg-card overflow-hidden shadow-[var(--e-1)]">
        <ul className="divide-y divide-line">
          {visiveis.map((it, i) => {
            const p = fmtPreco(it.precoUSD, cambio.brl, t);
            const tipoLabel = it.precoTipo === 'tour' ? t('destino.precoTour') : it.precoTipo === 'ingresso' ? t('destino.precoIngresso') : it.precoTipo === 'estimado' ? t('destino.precoEstimado') : '';
            return (
              <li key={`${it.nome}-${i}`} className="flex items-center gap-3 px-4 sm:px-5 py-3">
                <span aria-hidden className="text-lg shrink-0">{CAT_ICON[it.categoria] || '🎫'}</span>
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-semibold text-ink leading-snug">{it.nome}</div>
                  <div className="text-[11px] text-inksoft flex flex-wrap gap-x-2">
                    {it.cidade && <span>📍 {it.cidade}</span>}
                    {it.duracao && <span>⏱️ {it.duracao}</span>}
                  </div>
                </div>
                <div className="text-right shrink-0">
                  {p.free ? (
                    <span className="inline-block text-xs font-bold uppercase tracking-wide bg-success-bg text-success border border-success-bd rounded-full px-2 py-0.5">{p.label}</span>
                  ) : (
                    <>
                      <div className="font-semibold text-ink tnum">{p.label}</div>
                      <div className="text-[11px] text-inksoft tnum">{p.sub}{tipoLabel ? ` · ${tipoLabel}` : ''}</div>
                    </>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      </div>
      <p className="mt-2 text-[11px] text-inksoft">{t('destino.fazerNota')}</p>
    </section>
  );
}
