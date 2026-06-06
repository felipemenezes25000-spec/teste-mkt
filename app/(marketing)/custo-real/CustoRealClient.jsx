'use client';
import { useMemo, useState } from 'react';
import Link from 'next/link';
import { distanciaKm, estimarPrecoVoo } from '../../_engine/utils.js';
import { custoTotalRealista, PREMISSAS_PADRAO } from '../../_engine/custoTotal.js';
import { useCambioBRL, CambioBadge, BRL_FALLBACK } from '../../_lib/cambioClient.js';
import { track } from '../../_lib/analytics.js';
import { useIdioma } from '../../_lib/i18n.js';

// Calculadora prescritiva: o usuário escolhe destino + dias + perfil + mês +
// pessoas; mostramos vitrine (voo+hotel) vs custo real completo, breakdown por
// categoria, alerta dos custos escondidos e os 3 cenários (mochila/médio/conforto).
//
// Tudo client-side com o engine puro `custoTotalRealista`. Câmbio fixo (R$ 5,40)
// configurável; quando o usuário tem rota salva, a UI sugere /planejar pro câmbio
// ao vivo do plano. Mantemos defaults realistas para que a primeira renderização
// já entregue um número honesto sem clique do usuário.

const ORIGENS = [
  { iata: 'GRU', cidade: 'São Paulo', coords: [-46.47, -23.43] },
  { iata: 'GIG', cidade: 'Rio de Janeiro', coords: [-43.25, -22.81] },
  { iata: 'BSB', cidade: 'Brasília', coords: [-47.92, -15.87] },
  { iata: 'POA', cidade: 'Porto Alegre', coords: [-51.18, -29.99] },
  { iata: 'CNF', cidade: 'Belo Horizonte', coords: [-43.97, -19.63] },
  { iata: 'REC', cidade: 'Recife', coords: [-34.92, -8.13] },
  { iata: 'SSA', cidade: 'Salvador', coords: [-38.32, -12.91] },
  { iata: 'FOR', cidade: 'Fortaleza', coords: [-38.53, -3.78] },
  { iata: 'CWB', cidade: 'Curitiba', coords: [-49.17, -25.53] },
];

const PERFIS = [
  { id: 'mochila', label: 'Mochilão', mult: 0.7, desc: 'hostel, comida de rua, ônibus' },
  { id: 'medio', label: 'Equilibrado', mult: 1.0, desc: 'pousada, restaurante local, ônibus + esporádico Uber' },
  { id: 'conforto', label: 'Conforto', mult: 1.9, desc: 'hotel 3-4★, restaurante turístico, transfer' },
];

const MESES = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'];

function fmtBRL(v) {
  return 'R$ ' + Math.round(v).toLocaleString('pt-BR');
}
function fmtUSD(v) {
  return 'US$ ' + Math.round(v).toLocaleString('pt-BR');
}

export function CustoRealClient({ destinos }) {
  const [origemIdx, setOrigemIdx] = useState(0);
  const [destinoCode, setDestinoCode] = useState('PE');
  const [dias, setDias] = useState(8);
  const [pessoas, setPessoas] = useState(2);
  const [perfil, setPerfil] = useState('medio');
  const [mes, setMes] = useState(5); // maio = baixa temporada PE
  const [passeiosDia, setPasseiosDia] = useState(20);
  const [bagagem, setBagagem] = useState(80);
  const cambio = useCambioBRL();
  const { t } = useIdioma();

  const origem = ORIGENS[origemIdx];
  const destino = destinos.find((d) => d.code === destinoCode) || destinos[0];
  const perfilSel = PERFIS.find((p) => p.id === perfil) || PERFIS[1];

  const resultado = useMemo(() => {
    const km = destino.coords && origem.coords ? distanciaKm(origem.coords, destino.coords) : 0;
    const faixaVoo = estimarPrecoVoo(km);
    const vooUSDPP = faixaVoo ? Math.round((faixaVoo.min + faixaVoo.max) / 2) : 600;

    const ehAltaTemporada = mesEhAlto(destino, mes);
    const fatorAltaTemp = ehAltaTemporada ? 1.18 : 1.0;
    const vooUSD = vooUSDPP * pessoas * fatorAltaTemp;

    const custoTerraPP = Math.max(8, destino.custoDia || 30) * dias;
    const custoTerra = custoTerraPP * pessoas * fatorAltaTemp;

    const calc = {
      trechos: [{
        code: destino.code, nome: destino.nome, dias,
        custoEfetivoDia: destino.custoDia, vistoTipo: destino.vistoTipo || '',
      }],
      diasTotais: dias,
      custoTerraTotal: custoTerra,
      custoTransporteTotal: vooUSD,
    };
    const out = custoTotalRealista(calc);

    const passeiosUSD = Math.round(passeiosDia * dias * pessoas);
    const bagagemUSD = Math.round(bagagem * pessoas);
    const extras = [
      { id: 'passeios', label: 'Passeios e ingressos (média/dia × dias × pessoas)', icon: '🎟️', valor: passeiosUSD },
      { id: 'bagagem', label: 'Bagagem despachada', icon: '🧳', valor: bagagemUSD },
    ];
    const totalExtras = extras.reduce((s, e) => s + e.valor, 0);
    const total = out.total + totalExtras;

    const hospedagem = Math.round(custoTerra * 0.40);
    const vitrine = hospedagem + Math.round(vooUSD);
    const escondido = Math.max(0, total - vitrine);

    const categoriasCompletas = [...out.categorias, ...extras];

    return {
      vooUSD: Math.round(vooUSD),
      vitrine,
      escondido,
      total,
      porDia: Math.round(total / Math.max(1, dias)),
      porPessoa: Math.round(total / Math.max(1, pessoas)),
      categorias: categoriasCompletas,
      faixa: out.faixa,
      ehAltaTemporada,
      premissas: out.premissas,
      faixaVoo,
    };
  }, [origem, destino, dias, pessoas, perfil, mes, passeiosDia, bagagem]);

  const maiorCategoria = useMemo(() => {
    return resultado.categorias.reduce((a, b) => (a.valor > b.valor ? a : b));
  }, [resultado]);

  const totalBRL = resultado.total * cambio.brl;
  const vitrineBRL = resultado.vitrine * cambio.brl;
  const escondidoBRL = resultado.escondido * cambio.brl;

  const field = 'mt-1 w-full px-3 py-2 rounded-lg border border-line bg-input text-ink focusring text-sm';

  return (
    <div className="mt-8 grid lg:grid-cols-[1fr_1.15fr] gap-6 items-start">
      {/* INPUTS */}
      <div className="rounded-3xl border border-line bg-card p-5 sm:p-6 shadow-[var(--e-1)] no-print">
        <h2 className="font-display text-2xl text-ink">{t('custoReal.detalhe')}</h2>
        <p className="text-xs text-inksoft mt-1">{t('custoReal.detalheP')}</p>

        <div className="mt-5 grid sm:grid-cols-2 gap-3">
          <label className="text-xs font-medium text-inksoft">{t('decisao.saindoDe')}
            <select value={origemIdx} onChange={(e) => setOrigemIdx(Number(e.target.value))} className={field}>
              {ORIGENS.map((o, i) => <option key={o.iata} value={i}>{o.cidade} ({o.iata})</option>)}
            </select>
          </label>
          <label className="text-xs font-medium text-inksoft">{t('custoReal.destino')}
            <select value={destinoCode} onChange={(e) => setDestinoCode(e.target.value)} className={field}>
              {destinos.map((d) => <option key={d.code} value={d.code}>{d.nome}</option>)}
            </select>
          </label>
          <label className="text-xs font-medium text-inksoft">{t('decisao.dias')}
            <input type="number" min={1} max={60} value={dias} onChange={(e) => setDias(clamp(Number(e.target.value) || 1, 1, 60))} className={`${field} tnum`} />
          </label>
          <label className="text-xs font-medium text-inksoft">{t('custoReal.pessoas')}
            <input type="number" min={1} max={10} value={pessoas} onChange={(e) => setPessoas(clamp(Number(e.target.value) || 1, 1, 10))} className={`${field} tnum`} />
          </label>
          <label className="text-xs font-medium text-inksoft">{t('decisao.mes')}
            <select value={mes} onChange={(e) => setMes(Number(e.target.value))} className={field}>
              {MESES.map((m, i) => <option key={m} value={i + 1}>{m}</option>)}
            </select>
          </label>
          <label className="text-xs font-medium text-inksoft">{t('decisao.estilo')}
            <select value={perfil} onChange={(e) => setPerfil(e.target.value)} className={field}>
              {PERFIS.map((p) => <option key={p.id} value={p.id}>{p.label}</option>)}
            </select>
          </label>
          <label className="text-xs font-medium text-inksoft">{t('custoReal.passeios')}
            <input type="number" min={0} value={passeiosDia} onChange={(e) => setPasseiosDia(Math.max(0, Number(e.target.value) || 0))} className={`${field} tnum`} />
          </label>
          <label className="text-xs font-medium text-inksoft">{t('custoReal.bagagem')}
            <input type="number" min={0} value={bagagem} onChange={(e) => setBagagem(Math.max(0, Number(e.target.value) || 0))} className={`${field} tnum`} />
          </label>
        </div>

        <p className="mt-3 text-[11px] text-inksoft">
          <strong>{perfilSel.label}:</strong> {perfilSel.desc}.
          {resultado.ehAltaTemporada && <span className="ml-1 text-warn font-semibold">+18% alta temporada.</span>}
        </p>

        <div className="mt-5 pt-5 border-t border-line text-xs text-inksoft">
          Premissas (US$): seguro {resultado.premissas.seguroDia}/dia · eSIM {resultado.premissas.esimPais}/país · visto médio {resultado.premissas.vistoMedio} · contingência {Math.round(resultado.premissas.contingencia * 100)}%.
          <br />
          <span className="inline-flex items-center gap-1.5 mt-1">
            Câmbio: <CambioBadge estado={cambio} />
          </span>
        </div>
      </div>

      {/* RESULTADO */}
      <div className="space-y-4">
        {/* Vitrine vs Real */}
        <div className="rounded-3xl border border-line bg-card overflow-hidden shadow-[var(--e-1)]">
          <div className="grid sm:grid-cols-3">
            <div className="p-5 border-r border-line">
              <div className="text-[11px] font-bold uppercase tracking-wide text-inksoft">Preço de vitrine</div>
              <div className="text-xs text-inksoft mt-0.5">Voo + hotel</div>
              <div className="mt-2 font-display text-3xl text-ink tnum">{fmtBRL(vitrineBRL)}</div>
              <div className="text-[11px] text-inksoft tnum">{fmtUSD(resultado.vitrine)}</div>
            </div>
            <div className="p-5 border-r border-line bg-warn-bg/30">
              <div className="text-[11px] font-bold uppercase tracking-wide text-warn">Escondido</div>
              <div className="text-xs text-warn mt-0.5">+ comida + seguro + eSIM + passeios + imprevistos</div>
              <div className="mt-2 font-display text-3xl text-warn tnum">{fmtBRL(escondidoBRL)}</div>
              <div className="text-[11px] text-warn tnum">{fmtUSD(resultado.escondido)}</div>
            </div>
            <div className="p-5 bg-pine text-white">
              <div className="text-[11px] font-bold uppercase tracking-wide opacity-85">Custo real total</div>
              <div className="text-xs opacity-75 mt-0.5">A viagem inteira, {dias} dias, {pessoas} pessoa(s)</div>
              <div className="mt-2 font-display text-3xl tnum">{fmtBRL(totalBRL)}</div>
              <div className="text-[11px] opacity-80 tnum">{fmtUSD(resultado.total)}</div>
            </div>
          </div>
          <div className="px-5 py-3 border-t border-line bg-paper2/50 text-xs text-inksoft flex flex-wrap gap-x-5 gap-y-1">
            <span>📅 {fmtBRL(resultado.porDia * cambio.brl)} por dia</span>
            <span>👤 {fmtBRL(resultado.porPessoa * cambio.brl)} por pessoa</span>
            <span>✈️ voo estimado: {fmtUSD(resultado.vooUSD / Math.max(1, pessoas))}/pessoa</span>
          </div>
        </div>

        {/* Breakdown */}
        <div className="rounded-3xl border border-line bg-card p-5 shadow-[var(--e-1)]">
          <h3 className="font-display text-xl text-ink">{t('custoReal.onde')}</h3>
          <ul className="mt-3 space-y-1.5">
            {resultado.categorias.map((c) => {
              const pct = resultado.total > 0 ? (c.valor / resultado.total) * 100 : 0;
              const isMaior = c.id === maiorCategoria.id;
              return (
                <li key={c.id} className="grid grid-cols-[24px_1fr_auto] gap-2 items-center">
                  <span aria-hidden>{c.icon}</span>
                  <div className="min-w-0">
                    <div className="flex items-baseline justify-between gap-2">
                      <span className="text-sm text-ink truncate">{c.label}</span>
                      <span className="text-[11px] text-inksoft tnum">{pct.toFixed(0)}%</span>
                    </div>
                    <div className="h-1.5 mt-1 rounded-full bg-paper2 overflow-hidden" role="img" aria-label={`${c.label}: ${pct.toFixed(0)}% do total`}>
                      <div className={`h-full ${isMaior ? 'bg-coral' : 'bg-pine'}`} style={{ width: `${Math.min(100, pct)}%` }} />
                    </div>
                  </div>
                  <span className="font-semibold text-ink tnum text-sm pl-2">{fmtUSD(c.valor)}</span>
                </li>
              );
            })}
          </ul>
        </div>

        {/* 3 cenários */}
        <div className="rounded-3xl border border-line bg-card p-5 shadow-[var(--e-1)]">
          <h3 className="font-display text-xl text-ink">{t('custoReal.cenariosTitulo')}</h3>
          <p className="text-xs text-inksoft">{t('custoReal.cenariosP')}</p>
          <div className="mt-3 grid grid-cols-3 gap-3">
            {PERFIS.map((p) => {
              const v = resultado.faixa[p.id === 'medio' ? 'medio' : p.id] || resultado.faixa.medio;
              const passeios = passeiosDia * dias * pessoas;
              const bag = bagagem * pessoas;
              const total = v + passeios + bag;
              const ativo = p.id === perfil;
              return (
                <button
                  key={p.id} type="button" onClick={() => { setPerfil(p.id); track('custo_real_perfil', { perfil: p.id, destino: destinoCode, dias, pessoas }); }}
                  className={`text-left rounded-2xl p-3 border transition focusring ${ativo ? 'border-pine bg-pine/[0.06] ring-1 ring-pine/20' : 'border-line bg-paper2/40 hover:border-pine/40'}`}
                >
                  <div className="text-[11px] font-bold uppercase tracking-wide text-inksoft">{p.label}</div>
                  <div className="mt-1 font-display text-lg text-ink tnum">{fmtBRL(total * cambio.brl)}</div>
                  <div className="text-[10px] text-inksoft tnum">{fmtUSD(total)}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Alerta prescritivo */}
        <div className="rounded-3xl border border-warn-bd bg-warn-bg p-5">
          <h3 className="font-display text-lg text-warn">{t('custoReal.atencao')}</h3>
          <ul className="mt-2 space-y-1.5 text-sm text-warn">
            <li>• A maior fatia da sua viagem é <strong>{maiorCategoria.label.toLowerCase()}</strong>. É onde corte ou upgrade pesa mais.</li>
            {resultado.ehAltaTemporada && (
              <li>• Você escolheu {MESES[mes - 1]} — alta temporada em {destino.nome}. Hospedagem e voo sobem ~18%. Janelas alternativas estão na página do destino.</li>
            )}
            {resultado.escondido > resultado.vitrine * 0.3 && (
              <li>• Os custos escondidos somam <strong>{fmtBRL(escondidoBRL)}</strong> — mais de 30% do que a vitrine te mostraria. Não é detalhe.</li>
            )}
            <li>• Câmbio variando R$ 0,30 muda o total em ~{fmtBRL((resultado.total * 0.3 * pessoas) || 200)}. Compre dólar/euro com calma.</li>
          </ul>
          <div className="mt-4 flex flex-wrap gap-2">
            <Link href={`/destino/${destino.slug}`} className="inline-flex rounded-xl bg-pine text-white font-semibold px-4 py-2 text-sm hover:bg-pinedk focusring">
              Ver alertas do destino →
            </Link>
            <Link href={`/roteiro?destino=${destino.slug}`} className="inline-flex rounded-xl border border-warn bg-card text-warn font-semibold px-4 py-2 text-sm hover:bg-warn/10 focusring">
              Montar roteiro neste orçamento
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function clamp(v, min, max) { return Math.max(min, Math.min(max, v)); }

function mesEhAlto(destino, mes) {
  // Heurística: meses fora da "melhor época" do destino tendem a ser mais
  // baratos; pico é normalmente DEZ-FEV (verão BR) + JUL (férias). Como não
  // temos calendário de feriado por país, marcamos pico genérico nas janelas
  // mais lotadas globalmente e adicionamos os meses ótimos do destino.
  const otimos = new Set(destino?.melhoresMeses || []);
  const picoGlobal = new Set([12, 1, 2, 7]);
  return otimos.has(mes) || picoGlobal.has(mes);
}
