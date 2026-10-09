'use client';
import { useMemo, useState } from 'react';
import { useCambioBRL, CambioBadge } from '../_lib/cambioClient.js';
import { SourceTrust } from '../_ui/SourceTrust.jsx';
import { useIdioma } from '../_lib/i18n.js';
import { Icon } from '../_ui/Icon.jsx';

// "O que fazer e quanto custa" — lista de atrações/museus/passeios com preço de
// ingresso ou tour (V1) + camada V2 por cidade: dicas de economia, passes,
// especialidade da cidade, grátis curados, e fontes.
//
// `itens` (V1) e `v2` (dadosV2DoPais) vêm como PROPS do Server Component (página
// de destino) — assim as tabelas completas (V1 ~485KB + V2 ~2.9MB) ficam no
// bundle do servidor, e só a fatia do país é serializada no HTML.

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

function fmtFaixaBRL(min, max, brl) {
  if (!brl || brl <= 0) return null;
  const a = Math.round(min * brl);
  const b = Math.round(max * brl);
  return `R$ ${a.toLocaleString('pt-BR')}–${b.toLocaleString('pt-BR')}`;
}

export function OQueFazer({ itens = [], v2 = null, cidadePrincipal }) {
  const cambio = useCambioBRL();
  const { t } = useIdioma();
  const [filtro, setFiltro] = useState('todos');

  const cidadesV2 = v2?.cidades ?? [];

  const cidadeInicial = (cidadePrincipal && cidadesV2.includes(cidadePrincipal))
    ? cidadePrincipal
    : (cidadesV2[0] ?? null);

  const [cidadeV2, setCidadeV2] = useState(cidadeInicial);

  // Lookups O(1) na fatia serializada — sem useMemo porque não há cálculo caro.
  const dadosCidade = (cidadeV2 && v2?.porCidade?.[cidadeV2]) || null;
  const dicas = dadosCidade?.dicas ?? [];
  const passes = dadosCidade?.passes ?? [];
  const especialidades = dadosCidade?.especialidades ?? [];
  const gratuitos = dadosCidade?.gratuitos ?? [];
  const fontes = dadosCidade?.fontes ?? [];
  const conf = dadosCidade?.confianca ?? null;
  const meta = v2?.meta ?? null;
  const temAlgoV2 = dicas.length || passes.length || especialidades.length || gratuitos.length;

  const categorias = useMemo(() => {
    const ordem = ['museu', 'passeio', 'atracao', 'parque', 'experiencia', 'religioso', 'natureza', 'historico'];
    const presentes = new Set(itens.map((i) => i.categoria));
    return ordem.filter((c) => presentes.has(c));
  }, [itens]);

  const visiveis = useMemo(() => {
    const arr = filtro === 'todos' ? itens : itens.filter((i) => i.categoria === filtro);
    return [...arr].sort((a, b) => (a.precoUSD || 0) - (b.precoUSD || 0));
  }, [itens, filtro]);

  if (!itens.length) return null;

  const desatualizado = meta?.diasDesdePesquisa > 365;

  return (
    <section aria-labelledby="oque-fazer-titulo">
      <h2 id="oque-fazer-titulo" className="font-display text-[1.75rem] leading-tight text-ink mb-1">{t('destino.fazerTitulo')}</h2>
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <SourceTrust freshness="HISTORICAL" fonte="Pesquisa de preços Mundo Sem Fim (USD)" data="jun/2026" />
        <CambioBadge estado={cambio} compact />
      </div>
      <p className="text-sm text-inksoft mb-4 max-w-2xl">{t('destino.fazerSub')}</p>

      <div className="flex flex-wrap gap-1.5 mb-4">
        <button
          type="button" onClick={() => setFiltro('todos')} aria-pressed={filtro === 'todos'}
          className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition focusring ${filtro === 'todos' ? 'bg-pine text-onpine border-pine' : 'bg-card text-inksoft border-line hover:border-pine/50'}`}
        >
          {t('destino.fazerTodos')} ({itens.length})
        </button>
        {categorias.map((c) => {
          const n = itens.filter((i) => i.categoria === c).length;
          return (
            <button
              key={c} type="button" onClick={() => setFiltro(c)} aria-pressed={filtro === c}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition focusring ${filtro === c ? 'bg-pine text-onpine border-pine' : 'bg-card text-inksoft border-line hover:border-pine/50'}`}
            >
              <Icon emoji={CAT_ICON[c]} /> {t(`destino.${CAT_KEY[c]}`)} ({n})
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
                <span aria-hidden className="text-lg shrink-0"><Icon emoji={CAT_ICON[it.categoria] || '🎫'} /></span>
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-semibold text-ink leading-snug">{it.nome}</div>
                  <div className="text-[11px] text-inksoft flex flex-wrap gap-x-2">
                    {it.cidade && <span><Icon emoji="📍" /> {it.cidade}</span>}
                    {it.duracao && <span><Icon emoji="⏱️" /> {it.duracao}</span>}
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

      {cidadesV2.length > 0 && temAlgoV2 ? (
        <div className="mt-6 rounded-3xl border border-line bg-card overflow-hidden shadow-[var(--e-1)]">
          <header className="px-4 sm:px-5 py-3 border-b border-line flex items-center justify-between gap-3 flex-wrap">
            <div className="min-w-0">
              <h3 className="font-display text-lg text-ink leading-tight"><Icon emoji="🏙️" /> {t('destino.fazerV2Titulo')} {cidadeV2}</h3>
              <p className="text-[11px] text-inksoft mt-0.5">{t('destino.fazerV2Sub')} {meta?.pesquisadoEm}.</p>
            </div>
            {cidadesV2.length > 1 ? (
              <div className="flex flex-wrap gap-1.5">
                {cidadesV2.map((c) => (
                  <button
                    key={c} type="button" onClick={() => setCidadeV2(c)} aria-pressed={c === cidadeV2}
                    className={`px-2.5 py-1 rounded-full text-[11px] font-semibold border transition focusring ${c === cidadeV2 ? 'bg-pine text-onpine border-pine' : 'bg-card text-inksoft border-line hover:border-pine/50'}`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            ) : null}
          </header>

          <div className="divide-y divide-line">
            {dicas.length ? (
              <div className="px-4 sm:px-5 py-3">
                <div className="text-xs font-semibold text-ink mb-1.5">{t('destino.fazerV2Dicas')}</div>
                <ul className="space-y-1 text-sm text-ink">
                  {dicas.map((d, i) => (<li key={i} className="flex gap-2"><span aria-hidden className="text-inksoft">·</span><span>{d}</span></li>))}
                </ul>
              </div>
            ) : null}

            {passes.length ? (
              <div className="px-4 sm:px-5 py-3">
                <div className="text-xs font-semibold text-ink mb-1.5">{t('destino.fazerV2Passes')}</div>
                <ul className="space-y-2">
                  {passes.map((p, i) => {
                    const brl = cambio.brl ? `R$ ${Math.round(p.precoUSD * cambio.brl).toLocaleString('pt-BR')}` : null;
                    return (
                      <li key={i} className="text-sm">
                        <div className="font-semibold text-ink">{p.nome}</div>
                        <div className="text-[11px] text-inksoft mt-0.5 flex flex-wrap gap-x-2">
                          <span className="tnum">{brl ?? `US$ ${Math.round(p.precoUSD)}`} {brl ? `(US$ ${Math.round(p.precoUSD)})` : null}</span>
                          {p.economia ? <span>• {p.economia}</span> : null}
                        </div>
                        <div className="text-[12px] text-ink mt-0.5">{t('destino.fazerV2Cobre')}: {p.cobre.join(' · ')}</div>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ) : null}

            {especialidades.length ? (
              <div className="px-4 sm:px-5 py-3">
                <div className="text-xs font-semibold text-ink mb-1.5">{t('destino.fazerV2Especial')} {cidadeV2}</div>
                <ul className="space-y-2">
                  {especialidades.map((e, i) => {
                    const faixaBRL = fmtFaixaBRL(e.precoUSD.min, e.precoUSD.max, cambio.brl);
                    return (
                      <li key={i} className="text-sm">
                        <div className="font-semibold text-ink">{e.slug.replace(/-/g, ' ').replace(/\b\w/g, (m) => m.toUpperCase())}</div>
                        <div className="text-[11px] text-inksoft mt-0.5 tnum">
                          {faixaBRL ? `${faixaBRL} ` : ''}<span>(US$ {Math.round(e.precoUSD.min)}–{Math.round(e.precoUSD.max)}){e.moedaLocal ? ` · ${e.moedaLocal}` : ''}</span>
                        </div>
                        {e.obs ? <div className="text-[12px] text-ink mt-0.5">{e.obs}</div> : null}
                      </li>
                    );
                  })}
                </ul>
              </div>
            ) : null}

            {gratuitos.length ? (
              <div className="px-4 sm:px-5 py-3">
                <div className="text-xs font-semibold text-ink mb-1.5">{t('destino.fazerV2Gratis')}</div>
                <ul className="space-y-1 text-sm text-ink">
                  {gratuitos.map((g, i) => (<li key={i} className="flex gap-2"><span aria-hidden className="text-success">·</span><span>{g}</span></li>))}
                </ul>
              </div>
            ) : null}
          </div>

          <footer className="px-4 sm:px-5 py-2.5 border-t border-line bg-bg/50 text-[11px] text-inksoft flex flex-wrap gap-x-3 gap-y-1 items-center">
            {fontes.length ? <span>{t('destino.fazerV2Fontes')}: {fontes.join(' · ')}</span> : null}
            {conf === 'baixa' ? <span className="px-1.5 py-0.5 rounded-full bg-warning-bg text-warning border border-warning-bd font-semibold">{t('destino.fazerV2Baixa')}</span> : null}
            {desatualizado ? <span className="px-1.5 py-0.5 rounded-full bg-warning-bg text-warning border border-warning-bd font-semibold">{t('destino.fazerV2Desat')}</span> : null}
            <span>{t('destino.fazerV2Aviso')}</span>
          </footer>
        </div>
      ) : null}
    </section>
  );
}
