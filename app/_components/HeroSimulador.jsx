'use client';
import { useState } from 'react';
import Link from 'next/link';
import { DESTINOS, destinoPorCode } from '../_lib/destinos.js';
import { recomendarDestinos } from '../_engine/decisao.js';
import { perfilDoPreset, PERFIS_PRONTOS } from '../_engine/perfil.js';
import { MESES_PT } from '../_engine/data.js';
import { useIdioma } from '../_lib/i18n.js';

const ESTILOS = Object.entries(PERFIS_PRONTOS).map(([id, p]) => ({ id, label: p.nome }));

// Card que transforma a vitrine em PRODUTO logo no topo: em ~30s o visitante
// escolhe estilo/dias/orçamento/mês e recebe 3 destinos REAIS — reusando o mesmo
// motor de decisão da /decisao (recomendarDestinos), sem duplicar ranking.
export function HeroSimulador() {
  const [estilo, setEstilo] = useState('equilibrado');
  const [dias, setDias] = useState(14);
  const [orcamento, setOrcamento] = useState('');
  const [mes, setMes] = useState(0); // 0 = qualquer mês
  const [res, setRes] = useState(null);
  const { t } = useIdioma();

  function simular(e) {
    e.preventDefault();
    const perfil = perfilDoPreset(estilo);
    const nd = Math.max(1, Number(dias) || 14);
    const orc = Number(orcamento) || 0;
    let lista = recomendarDestinos(DESTINOS, perfil);
    // Se escolheu um mês, prioriza quem está na melhor época (sort estável mantém o
    // ranking do perfil como desempate). Não exclui ninguém — só reordena.
    if (mes > 0) lista = [...lista].sort((a, b) => naBoaEpoca(b.id, mes) - naBoaEpoca(a.id, mes));
    setRes(lista.slice(0, 3).map((r) => {
      const custoTerra = Math.round((r.custoDia || 30) * nd);
      return {
        code: r.id, nome: r.nome, slug: r.slug, regiao: r.regiao, porque: r.porque,
        custoTerra,
        cabe: orc > 0 ? custoTerra <= orc : null,
        boaEpoca: mes > 0 ? !!naBoaEpoca(r.id, mes) : null,
      };
    }));
  }

  const field = 'mt-1 w-full px-3 py-2 rounded-lg border border-line bg-input text-ink focusring text-sm';
  const nd = Number(dias) || 14;

  return (
    <section className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 -mt-6 sm:-mt-12">
      <div className="rounded-3xl border border-line bg-card shadow-[var(--e-2)] p-5 sm:p-7">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-oncoral bg-coral px-2.5 py-1 rounded-full">{t('simulador.badge30s')}</span>
          <h2 className="font-display text-xl sm:text-2xl text-ink">{t('simulador.titulo')}</h2>
        </div>

        <form onSubmit={simular} className="mt-4 grid grid-cols-2 lg:grid-cols-5 gap-3 items-end">
          <label className="text-xs text-inksoft font-medium col-span-2 lg:col-span-1">{t('simulador.estilo')}
            <select value={estilo} onChange={(e) => setEstilo(e.target.value)} className={field}>
              {ESTILOS.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
            </select>
          </label>
          <label className="text-xs text-inksoft font-medium">{t('simulador.dias')}
            <input type="number" min="1" max="120" value={dias} onChange={(e) => setDias(e.target.value)} className={`${field} tnum`} />
          </label>
          <label className="text-xs text-inksoft font-medium">{t('simulador.orcamento')}
            <input type="number" min="0" step="100" placeholder={t('simulador.placeholderOpcional')} value={orcamento} onChange={(e) => setOrcamento(e.target.value)} className={`${field} tnum`} />
          </label>
          <label className="text-xs text-inksoft font-medium">{t('simulador.mes')}
            <select value={mes} onChange={(e) => setMes(Number(e.target.value))} className={field}>
              <option value={0}>{t('simulador.qualquer')}</option>
              {MESES_PT.map((m, i) => <option key={m} value={i + 1}>{m}</option>)}
            </select>
          </label>
          <button type="submit" className="col-span-2 lg:col-span-1 inline-flex items-center justify-center gap-2 rounded-xl bg-coral text-oncoral font-semibold px-4 py-2.5 hover:brightness-95 transition focusring">
            {t('simulador.cta')}
          </button>
        </form>

        {res ? (
          <div className="mt-5">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {res.map((d, i) => (
                <div key={d.code} className="rounded-2xl border border-line bg-paper2/60 p-4 flex flex-col">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[11px] font-bold bg-pine text-white w-6 h-6 grid place-items-center rounded-full">{i + 1}º</span>
                    <span className="text-[11px] text-inksoft">{d.regiao}</span>
                  </div>
                  <h3 className="mt-2 font-display text-lg text-ink">{d.nome}</h3>
                  <p className="text-xs text-inksoft mt-0.5 line-clamp-2 grow">{d.porque}</p>
                  <div className="mt-2 flex flex-wrap items-baseline gap-x-1.5">
                    <span className="text-sm font-semibold text-ink tnum">~US$ {d.custoTerra.toLocaleString('pt-BR')}</span>
                    <span className="text-[11px] text-inksoft">{nd} {t('simulador.dias').toLowerCase()} · {t('simulador.emTerra')}</span>
                  </div>
                  <div className="mt-1.5 flex flex-wrap gap-1">
                    {d.cabe === true && <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-solar text-onsolar">{t('simulador.cabeOrcamento')}</span>}
                    {d.cabe === false && <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-danger-bg text-danger border border-danger-bd">{t('simulador.acimaOrcamento')}</span>}
                    {d.boaEpoca === true && <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-success-bg text-success border border-success-bd">{t('simulador.boaEpoca')}</span>}
                  </div>
                  <div className="mt-3 flex gap-3">
                    <Link href={`/destino/${d.slug}`} className="text-xs font-semibold text-pine hover:underline focusring">{t('simulador.verDestino')}</Link>
                    <Link href={`/roteiro?destino=${d.slug}`} className="text-xs font-semibold text-inksoft hover:text-pine focusring">{t('simulador.montarRoteiro')}</Link>
                  </div>
                </div>
              ))}
            </div>
            <p className="mt-3 text-[11px] text-inksoft">
              <Link href="/decisao" className="text-pine font-semibold hover:underline focusring">{t('simulador.decisaoCompleta')}</Link>
            </p>
          </div>
        ) : (
          <p className="mt-3 text-xs text-inksoft">{t('simulador.rodape')}</p>
        )}
      </div>
    </section>
  );
}

function naBoaEpoca(code, mes) {
  const d = destinoPorCode(code);
  return d && (d.melhoresMeses || []).includes(mes) ? 1 : 0;
}
