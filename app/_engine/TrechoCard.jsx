import { useState, useEffect } from 'react';
import { PASSAPORTES, REVISADO_EM } from './data.js';
import { fmtMoeda, fmtData, simbolo, num, clamp, toISO, linksVoo, linkMapaTexto, distanciaKm, estimarPrecoVoo } from './utils.js';
import { buscarLugar } from './services.js';
import { MoedaPicker } from '../_components/MoedaPicker.jsx';
import { ESTACAO_UI, VISTO_UI, NumberInput, MesesPicker, StatusChip } from './components.jsx';
import { Icon } from '../_ui/Icon.jsx';

/* Card de um trecho. v4: foto do local (Wikipedia), busca de voo do trecho (origem→destino),
   e painel de cidades (com Google Maps + fotos) e comidas típicas.
   Valores são digitados na MOEDA do trecho; o resumo aparece na moeda base. */
export default function TrechoCard(props) {
  const { t, index, total, base, passaporte, origemCidade, origemIata, origemCoords,
          onPatch, onRemove, onMove, onBuscarOpp, oppBusy, rationale,
          ehQuebra, dataQuebra, dragHandlers, dragging, dropTarget } = props;
  const [ajustes, setAjustes] = useState(false);
  const [oppAberto, setOppAberto] = useState(!!t.oportunidades);
  const [lugaresAberto, setLugaresAberto] = useState(false);
  const [hero, setHero] = useState(undefined);        // undefined=carregando, null=sem foto, obj=ok
  const [cidadeImgs, setCidadeImgs] = useState({});   // nome -> url

  const est = ESTACAO_UI[t.estacao.nivel];
  const vis = VISTO_UI[t.visto.nivel];
  const sym = simbolo(t.moeda);
  const estTxt = t.estacao.nivel === 'ruim' ? 'text-danger'
    : t.estacao.nivel === 'bom' ? 'text-success'
    : t.estacao.nivel === 'parcial' ? 'text-warn' : 'text-inksoft';

  const voos = linksVoo({ origemCidade, origemIata, destinoCidade: t.cidadePrincipal || t.nome, destinoIata: t.iata, dataISO: toISO(t.chegada) });
  const estVoo = origemCoords && Array.isArray(t.coords) ? estimarPrecoVoo(distanciaKm(origemCoords, t.coords)) : null;

  // Foto-herói do local (lazy + cacheada no serviço).
  useEffect(() => {
    let vivo = true;
    setHero(undefined);
    buscarLugar(t.fotoQuery || t.nome).then(r => { if (vivo) setHero(r && r.img ? r : null); });
    return () => { vivo = false; };
  }, [t.fotoQuery, t.nome]);

  // Ao abrir o painel de lugares, busca fotos das cidades (cacheadas).
  useEffect(() => {
    if (!lugaresAberto) return;
    let vivo = true;
    (t.cidades || []).forEach(c => {
      if (cidadeImgs[c] !== undefined) return;
      buscarLugar(c).then(r => { if (vivo) setCidadeImgs(prev => ({ ...prev, [c]: (r && r.img) || null })); });
    });
    return () => { vivo = false; };
    // eslint-disable-next-line
  }, [lugaresAberto]);

  return (
    <div {...dragHandlers} role="listitem" aria-label={`Trecho ${index + 1}: ${t.nome}`}
      className={`rise rounded-2xl border bg-card shadow-[0_14px_36px_-26px_rgba(34,45,43,0.5)] transition
        ${dragging ? 'dragging' : ''} ${dropTarget ? 'drop-target' : 'border-line'} ${ehQuebra ? 'alert-pulse' : ''}`}>
      <div className="p-4 sm:p-5">
        <div className="flex items-start gap-3">
          <div className="flex flex-col items-center gap-1.5 pt-1">
            <div className="stamp w-11 h-11 rounded-full grid place-items-center font-display text-lg bg-card select-none" aria-hidden>{index + 1}</div>
            <div className="flex flex-col">
              <button onClick={() => onMove(index, index - 1)} disabled={index === 0} aria-label={`Subir ${t.nome}`} title="Subir"
                className="w-9 h-9 grid place-items-center text-sm leading-none rounded-t-md border border-line bg-input text-inksoft disabled:opacity-30 hover:text-pine hover:bg-pine/5 focusring touch-manipulation">▲</button>
              <button onClick={() => onMove(index, index + 1)} disabled={index === total - 1} aria-label={`Descer ${t.nome}`} title="Descer"
                className="w-9 h-9 grid place-items-center text-sm leading-none rounded-b-md border border-t-0 border-line bg-input text-inksoft disabled:opacity-30 hover:text-pine hover:bg-pine/5 focusring touch-manipulation">▼</button>
            </div>
          </div>

          <div className="flex-1 min-w-0">
            {/* Foto-herói do local */}
            {hero === undefined && <div className="h-28 rounded-xl skel mb-3" aria-hidden />}
            {hero && (
              <div className="relative h-28 sm:h-32 rounded-xl overflow-hidden mb-3 border border-line">
                <img src={hero.img} alt={`Foto de ${t.nome}`} loading="lazy" className="w-full h-full object-cover" />
                {hero.url && <a href={hero.url} target="_blank" rel="noopener noreferrer"
                  className="absolute bottom-1 right-1 text-[10px] bg-ink/55 text-white px-1.5 py-0.5 rounded">Wikipédia <Icon emoji="↗" /></a>}
              </div>
            )}

            <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <input value={t.nome} onChange={(e) => onPatch({ nome: e.target.value })} aria-label="Nome do país"
                className="font-display text-xl text-ink bg-transparent border-b border-transparent hover:border-line focus:border-pine outline-none min-w-0 max-w-full focusring rounded" />
              <span className="text-[11px] uppercase tracking-wider text-inksoft bg-paper2 border border-line rounded-full px-2 py-0.5">{t.regiao || 'região?'}</span>
              <span className="text-[11px] text-inksoft flex items-center gap-1">moeda
                <MoedaPicker value={t.moeda} onChange={(code) => onPatch({ moeda: code })} label={`Moeda dos custos em ${t.nome}`} />
              </span>
              <span className="text-sm text-inksoft tnum">Chega <b className="text-ink">{fmtData(t.chegada)}</b> · sai {fmtData(t.saida)}</span>
            </div>

            <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <label className="text-xs text-inksoft">Dias
                <NumberInput value={t.dias} min={0} max={3650} onChange={(v) => onPatch({ dias: v })} suffix="d" className="mt-1" ariaLabel={`Dias em ${t.nome}`} />
              </label>
              <label className="text-xs text-inksoft">Custo/dia
                <NumberInput value={t.custoDia} min={0} max={1e9} onChange={(v) => onPatch({ custoDia: v })} suffix={sym} className="mt-1" ariaLabel={`Custo por dia em ${t.nome}`} />
              </label>
              <label className="text-xs text-inksoft">Economia/dia
                <NumberInput value={t.economiaDia} min={0} max={num(t.custoDia)} onChange={(v) => onPatch({ economiaDia: v })} suffix={sym} className="mt-1" ariaLabel={`Economia por dia em ${t.nome}`} />
              </label>
              <label className="text-xs text-inksoft"><Icon emoji="✈" /> Transporte até aqui
                <NumberInput value={t.transporte} min={0} max={1e9} onChange={(v) => onPatch({ transporte: v })} suffix={sym} className="mt-1" ariaLabel={`Custo de transporte para chegar em ${t.nome}`} />
              </label>
            </div>

            <div className="mt-2 text-xs text-inksoft tnum flex flex-wrap gap-x-3 gap-y-0.5">
              <span>Em terra <b className="text-ink">{fmtMoeda(t.custoTerra, base)}</b></span>
              <span><Icon emoji="✈" /> <b className="text-ink">{fmtMoeda(t.custoTransporte, base)}</b></span>
              <span>Trecho <b className="text-ink">{fmtMoeda(t.custoTrecho, base)}</b></span>
              <span>Acumulado <b className="text-ink">{fmtMoeda(t.acumulado, base)}</b></span>
              {t.moeda !== base && <span className="opacity-70">(custos em {t.moeda} <Icon emoji="→" /> {base})</span>}
            </div>

            {t.economiaLabel && (
              <div className="mt-2 text-xs text-success"><Icon emoji="✓" /> Economia aplicada: <b>{t.economiaLabel}</b> (−{sym} {num(t.economiaDia)}/dia) · <button className="underline hover:no-underline focusring" onClick={() => onPatch({ economiaDia: 0, economiaLabel: '' })}>remover</button></div>
            )}

            <div className="mt-3 flex flex-wrap items-center gap-2">
              <StatusChip ui={est.chip}><span className={`w-1.5 h-1.5 rounded-full ${est.dot}`} aria-hidden></span>{est.label}</StatusChip>
              <StatusChip ui={vis.chip}><Icon emoji="🛂" /> {t.visto.nivel === 'over' ? `Fura +${t.visto.excesso}d` : (t.visto.nivel === 'ok' ? `${t.dias}/${t.vistoDias}d` : 'sem limite')} <span className="opacity-60">· {t.vistoTipo}</span></StatusChip>
              {ehQuebra && <StatusChip ui="bg-danger-bg text-danger border-danger-bd"><Icon emoji="💸" /> A grana acaba aqui ({fmtData(dataQuebra)})</StatusChip>}
            </div>

            <div className="mt-2 space-y-0.5 text-xs">
              <p className={estTxt}><Icon emoji="🌤️" /> {t.estacao.texto}</p>
              {t.visto.nivel === 'over' && <p className="text-danger"><Icon emoji="🛂" /> {t.visto.texto}</p>}
              {(t.vistoComprovanteSaida || t.vistoExtensao) && (
                <p className="text-inksoft"><Icon emoji="🛂" /> {[
                  t.vistoExtensao ? `extensão possível${t.vistoExtensaoNota ? ` (${t.vistoExtensaoNota})` : ''}` : '',
                  t.vistoComprovanteSaida ? 'leve comprovante de saída' : '',
                ].filter(Boolean).join(' · ')}</p>
              )}
            </div>

            {rationale && (
              <div className="mt-2 text-xs bg-warn-bg border border-warn-bd text-warn rounded-lg px-3 py-2">
                <b>Por que aqui (IA):</b> {rationale}
              </div>
            )}

            {/* Ações */}
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <a href={voos.google} target="_blank" rel="noopener noreferrer"
                className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-ochre/15 border border-ochre/40 text-warn hover:bg-ochre/25 focusring"
                title={`Buscar voo ${origemCidade || ''}${t.cidadePrincipal || t.nome} em ${fmtData(t.chegada)}`}>
                <Icon emoji="✈" /> Buscar voo até aqui
              </a>
              {voos.skyscanner && <a href={voos.skyscanner} target="_blank" rel="noopener noreferrer" className="text-[11px] text-pine hover:underline focusring">Skyscanner <Icon emoji="↗" /></a>}
              {estVoo && <span className="text-[11px] text-inksoft tnum" title={`Estimativa grosseira por distância (${estVoo.km} km) — não é preço real`}><Icon emoji="✈" /> ~US$ {estVoo.min}–{estVoo.max}</span>}
              <button onClick={() => setLugaresAberto(a => !a)} aria-expanded={lugaresAberto}
                className="text-xs px-3 py-1.5 rounded-lg border border-line bg-input text-inksoft hover:text-pine focusring"><Icon emoji="📍" /> Cidades & comida</button>
              <button onClick={() => { setOppAberto(true); onBuscarOpp(); }} disabled={oppBusy}
                className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-pine/30 bg-pine/5 text-pine hover:bg-pine/10 disabled:opacity-50 focusring">
                {oppBusy ? 'Buscando…' : (t.oportunidades ? 'Oportunidades (IA)' : 'Oportunidades (IA)')}
              </button>
              <button onClick={() => setAjustes(a => !a)} aria-expanded={ajustes}
                className="text-xs px-3 py-1.5 rounded-lg border border-line bg-input text-inksoft hover:text-pine focusring">{ajustes ? 'Fechar ajustes' : 'Visto & estação'}</button>
              <button onClick={onRemove} aria-label={`Remover ${t.nome}`}
                className="text-xs px-3 py-1.5 rounded-lg border border-line bg-input text-inksoft hover:text-clay hover:border-clay/40 focusring ml-auto">Remover</button>
            </div>

            {/* Cidades & comida */}
            {lugaresAberto && (
              <div className="mt-3 rounded-xl border border-line bg-paper2/60 p-3 space-y-3">
                <div>
                  <div className="text-xs font-semibold text-ink mb-1.5"><Icon emoji="📍" /> Cidades & pontos (toque pra abrir no Google Maps)</div>
                  {(t.cidades || []).length === 0 ? <p className="text-xs text-inksoft">Sem cidades cadastradas — adicione no país de referência.</p> : (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {t.cidades.map(c => (
                        <div key={c} className="rounded-lg overflow-hidden border border-line bg-card">
                          <a href={linkMapaTexto(`${c}, ${t.nome}`)} target="_blank" rel="noopener noreferrer"
                            className="group block hover:opacity-95 focusring">
                            <div className="h-16 bg-paper2 overflow-hidden">
                              {cidadeImgs[c] === undefined && <div className="w-full h-full skel" />}
                              {cidadeImgs[c] && <img src={cidadeImgs[c]} alt={c} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition" />}
                            </div>
                            <div className="px-2 py-1 text-[11px] text-ink flex items-center justify-between">{c} <span className="text-pine"><Icon emoji="↗" /></span></div>
                          </a>
                          <div className="flex items-center gap-1 px-2 py-1 border-t border-line">
                            <span className="text-[10px] text-inksoft shrink-0">~{sym}/dia</span>
                            <input type="number" min={0} inputMode="decimal"
                              value={(t.cidadesCusto && t.cidadesCusto[c] != null) ? t.cidadesCusto[c] : ''}
                              placeholder={String(num(t.custoDia))}
                              onChange={(e) => onPatch({ cidadesCusto: { ...(t.cidadesCusto || {}), [c]: num(e.target.value) } })}
                              aria-label={`Custo por dia estimado em ${c}`}
                              className="w-full min-w-0 bg-input text-ink text-[11px] tnum rounded px-1 py-0.5 border border-line focusring" />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div>
                  <div className="text-xs font-semibold text-ink mb-1.5"><Icon emoji="🍽️" /> Comida típica</div>
                  <div className="flex flex-wrap gap-1.5">
                    {(t.comidas || []).map(f => <span key={f} className="text-xs bg-input border border-line rounded-full px-2.5 py-1 text-ink">{f}</span>)}
                    {(t.comidas || []).length === 0 && <span className="text-xs text-inksoft">Sem pratos cadastrados.</span>}
                  </div>
                </div>
                <p className="text-[11px] text-inksoft">Fotos: Wikipédia/Wikimedia. Cidades, pratos e <b>custos por cidade</b> são estimativas editáveis (referência — o custo/dia do país é o que entra na conta).</p>
              </div>
            )}

            {oppAberto && (oppBusy || t.oportunidades) && (
              <div className="mt-3 rounded-xl border border-line bg-paper2/60 p-3">
                {oppBusy && !t.oportunidades && (<div className="space-y-2" aria-label="Carregando">{[0,1,2].map(i => <div key={i} className="h-12 rounded-lg skel" />)}</div>)}
                {t.oportunidades && t.oportunidades.length === 0 && <p className="text-xs text-inksoft">Nenhuma sugestão retornada. Tente de novo.</p>}
                {t.oportunidades && t.oportunidades.length > 0 && (
                  <div className="grid sm:grid-cols-2 gap-2">
                    {t.oportunidades.map((o, i) => (
                      <div key={i} className="rounded-lg bg-card border border-line p-3">
                        <div className="flex items-center justify-between gap-2">
                          <h4 className="font-semibold text-sm text-ink">{o.tipo}</h4>
                          <span className="text-xs font-bold text-success whitespace-nowrap">−{sym} {o.economiaDiaEstimada}/dia</span>
                        </div>
                        <p className="mt-1 text-xs text-inksoft">{o.descricao}</p>
                        {o.comoComecar && <p className="mt-1 text-xs text-inksoft"><b>Começa assim:</b> {o.comoComecar}</p>}
                        <button onClick={() => onPatch({ economiaDia: clamp(o.economiaDiaEstimada, 0, num(t.custoDia)), economiaLabel: o.tipo })}
                          className="mt-2 text-xs font-semibold text-pine hover:underline focusring">Aplicar economia <Icon emoji="→" /></button>
                      </div>
                    ))}
                  </div>
                )}
                <p className="mt-2 text-[11px] text-inksoft">Estimativas geradas por IA — a disponibilidade varia por cidade e temporada.</p>
              </div>
            )}

            {ajustes && (
              <div className="mt-3 rounded-xl border border-line bg-input p-3 space-y-3">
                <div className="grid sm:grid-cols-3 gap-2.5">
                  <label className="text-xs text-inksoft">Tipo de visto
                    <select value={t.vistoTipo} onChange={(e) => onPatch({ vistoTipo: e.target.value })} className="mt-1 w-full px-2.5 py-1.5 rounded-lg border border-line bg-input text-ink focusring">
                      <option value="isento">isento</option>
                      <option value="e-visa">e-visa</option>
                      <option value="on-arrival">on-arrival</option>
                      <option value="visto">visto consular</option>
                      <option value="eta">ETA / autorização eletrônica</option>
                      <option value="consultar">consultar (sem regra verificada)</option>
                      <option value="outro">outro</option>
                    </select>
                  </label>
                  <label className="text-xs text-inksoft">Dias permitidos
                    <NumberInput value={t.vistoDias} min={0} max={3650} onChange={(v) => onPatch({ vistoDias: v })} suffix="d" className="mt-1" ariaLabel="Dias de visto permitidos" />
                  </label>
                  <label className="text-xs text-inksoft">Região (p/ otimizador)
                    <input value={t.regiao} onChange={(e) => onPatch({ regiao: e.target.value })} className="mt-1 w-full px-2.5 py-1.5 rounded-lg border border-line bg-input text-ink focusring" />
                  </label>
                </div>
                <div className="grid sm:grid-cols-2 gap-2.5">
                  <label className="flex items-start gap-2 text-xs text-inksoft">
                    <input type="checkbox" checked={!!t.vistoComprovanteSaida} onChange={(e) => onPatch({ vistoComprovanteSaida: e.target.checked })} className="mt-0.5 focusring" />
                    <span>Exige <b className="text-ink">comprovante de saída</b> (passagem de volta/onward)</span>
                  </label>
                  <label className="flex items-start gap-2 text-xs text-inksoft">
                    <input type="checkbox" checked={!!t.vistoExtensao} onChange={(e) => onPatch({ vistoExtensao: e.target.checked })} className="mt-0.5 focusring" />
                    <span><b className="text-ink">Extensão</b> de visto possível</span>
                  </label>
                </div>
                {t.vistoExtensao && (
                  <label className="block text-xs text-inksoft">Como estender (estimativa editável)
                    <input value={t.vistoExtensaoNota || ''} onChange={(e) => onPatch({ vistoExtensaoNota: e.target.value })} placeholder="ex.: +30 dias na imigração, ~US$ 60"
                      className="mt-1 w-full px-2.5 py-1.5 rounded-lg border border-line bg-input text-ink focusring" />
                  </label>
                )}
                <label className="block text-xs text-inksoft"><Icon emoji="✈" /> Observação do transporte (voo/ônibus)
                  <input value={t.transporteNota} onChange={(e) => onPatch({ transporteNota: e.target.value })} placeholder="ex.: voo Bangkok Hanói"
                    className="mt-1 w-full px-2.5 py-1.5 rounded-lg border border-line bg-input text-ink focusring" />
                </label>
                <div>
                  <div className="text-xs text-inksoft mb-1">Melhores meses (clima) — clique pra alternar</div>
                  <MesesPicker value={t.melhoresMeses} onChange={(v) => onPatch({ melhoresMeses: v })} />
                </div>
                <p className="text-[11px] text-inksoft bg-paper2 rounded-lg px-2.5 py-1.5 border border-line">
                  <Icon emoji="⚠" /> {t.vistoNota || 'Regra de visto.'} <b>Referência p/ passaporte {PASSAPORTES[passaporte]}, revisada em {REVISADO_EM} — confirme na fonte oficial (depende do ponto de entrada e pode mudar).</b>
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
