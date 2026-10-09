'use client';
import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useViagens } from '../../../../_lib/viagens/useViagens.js';
import { itensDoDia, atualizarItem } from '../../../../_lib/viagens/store.js';
import { simular, distanciaKm, hm, mh } from '../../../../_domain/rotas.js';
import { utcParaLocal } from '../../../../_domain/time.js';
import { rotaDoDia } from '../../../../_lib/roteamento.js';
import { previsao, descreverTempo } from '../../../../_lib/clima.js';
import { Icon } from '../../../../_ui/Icon.jsx';
import { SourceTrust } from '../../../../_ui/SourceTrust.jsx';
import { useIdioma } from '../../../../_lib/i18n.js';

// MODO VIAGEM (OMEGA V4 §20 / §75 "Viagem / Hoje"): responde em segundos — onde
// estou, qual a próxima atividade, quando sair, qual rota, onde está o ingresso,
// o que pode dar errado, quanto posso gastar. Funciona offline (dados no aparelho;
// página cacheada pelo service worker). Localização só com consentimento explícito.
const AR_LIVRE = /parque|jardim|praia|trilha|monte|mirante|bambu|floresta|lago|cachoeira|vulc|ilha|caminhada|natureza|torii|santu|vale|baía|costa/i;

export function HojeClient({ id }) {
  const { t, tf, locale } = useIdioma();
  const { estado, aplicar, carregando } = useViagens();
  const v = estado && estado.viagens.find((x) => x.id === id);
  const [agora, setAgora] = useState(null);
  const [online, setOnline] = useState(true);
  const [pos, setPos] = useState({ estado: 'idle' }); // idle | pedindo | ok | negado | erro
  const [rota, setRota] = useState(null);
  const [clima, setClima] = useState(null);
  const [diaSel, setDiaSel] = useState(null);
  const [planoB, setPlanoB] = useState(null);

  useEffect(() => {
    const tick = () => setAgora(new Date());
    tick();
    const t = setInterval(tick, 30000);
    const on = () => setOnline(navigator.onLine);
    on();
    window.addEventListener('online', on); window.addEventListener('offline', on);
    return () => { clearInterval(t); window.removeEventListener('online', on); window.removeEventListener('offline', on); };
  }, []);

  const tz = v ? v.timeZone || 'UTC' : 'UTC';
  const localAgora = agora ? utcParaLocal(agora.toISOString(), tz) : null; // "YYYY-MM-DDTHH:mm" no destino
  const hojeLocal = localAgora ? localAgora.slice(0, 10) : null;
  const emViagem = v && hojeLocal && hojeLocal >= v.inicio && hojeLocal <= v.fim;
  const dia = diaSel || (v ? (emViagem ? hojeLocal : v.dias[0]) : null);
  const itens = v && dia ? itensDoDia(v, dia) : [];
  const paradas = itens.map((i) => ({ id: i.id, nome: i.titulo, lat: i.lat ?? undefined, lng: i.lng ?? undefined, duracaoMin: i.duracaoMin, abre: i.abre || undefined, fecha: i.fecha || undefined, fixoInicio: i.fixoInicio || undefined }));
  const sim = simular(paradas, { inicio: '09:00', fim: '21:00' });
  const minAgora = localAgora && emViagem ? hm(localAgora.slice(11, 16)) : null;
  const idxProx = minAgora == null ? 0 : sim.passos.findIndex((p) => hm(p.fim) > minAgora);
  const prox = idxProx >= 0 ? sim.passos[idxProx] : null;
  const proxItem = prox ? itens.find((i) => i.id === prox.id) : null;

  // clima do dia (precisa de rede; offline mostra aviso)
  useEffect(() => {
    if (!v || !online) return undefined;
    let vivo = true;
    const ref = itens.find((i) => Number.isFinite(i.lat));
    if (!ref) return undefined;
    previsao(ref.lat, ref.lng, 16).then((c) => { if (vivo) setClima(c); });
    return () => { vivo = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [v && v.id, dia, online]);

  // rota até a próxima atividade a partir da posição consentida
  useEffect(() => {
    if (pos.estado !== 'ok' || !proxItem || !Number.isFinite(proxItem.lat) || !online) return undefined;
    let vivo = true;
    const km = distanciaKm(pos, proxItem);
    rotaDoDia([{ id: 'eu', nome: 'Você', lat: pos.lat, lng: pos.lng }, { id: proxItem.id, nome: proxItem.titulo, lat: proxItem.lat, lng: proxItem.lng }], km <= 2 ? 'WALK' : 'DRIVE')
      .then((r) => { if (vivo) setRota(r); });
    return () => { vivo = false; };
  }, [pos, proxItem, online]);

  function pedirLocalizacao() {
    if (!('geolocation' in navigator)) { setPos({ estado: 'erro' }); return; }
    setPos({ estado: 'pedindo' });
    navigator.geolocation.getCurrentPosition(
      (p) => setPos({ estado: 'ok', lat: p.coords.latitude, lng: p.coords.longitude, precisao: Math.round(p.coords.accuracy) }),
      (e) => setPos({ estado: e.code === 1 ? 'negado' : 'erro' }),
      { enableHighAccuracy: true, timeout: 12000, maximumAge: 60000 },
    );
  }

  const climaDia = clima && clima.dias && clima.dias.find((d) => d.data === dia);
  const chuvaForte = climaDia && (climaDia.chuva ?? 0) >= 60;
  const arLivreHoje = itens.filter((i) => AR_LIVRE.test(i.titulo));

  // Plano B: com chuva provável, sugere TROCAR atividades ao ar livre com um dia
  // seco da viagem (change set revisável; nada aplicado em silêncio).
  const sugestaoPlanoB = useMemo(() => {
    if (!v || !chuvaForte || !arLivreHoje.length || !clima) return null;
    const secos = clima.dias.filter((d) => d.data !== dia && v.dias.includes(d.data) && (d.chuva ?? 100) < 40).map((d) => d.data);
    if (!secos.length) return { semAlternativa: true };
    return { mover: arLivreHoje.map((i) => ({ item: i, para: secos[0] })) };
  }, [v, chuvaForte, arLivreHoje, clima, dia]);

  function aplicarPlanoB() {
    if (!sugestaoPlanoB || !sugestaoPlanoB.mover) return;
    aplicar((s) => sugestaoPlanoB.mover.reduce((acc, m) => atualizarItem(acc, v.id, m.item.id, { dia: m.para }), s));
    setPlanoB('aplicado');
  }

  if (carregando || !agora) return <main className="max-w-lg mx-auto px-4 py-10"><div className="h-72 rounded-2xl skel" /></main>;
  if (!v) return <main className="max-w-lg mx-auto px-4 py-16 text-center"><h1 className="font-display text-2xl text-ink">{t('hoje.naoEncontrada')}</h1><Link href="/viagens" className="mt-4 inline-block text-pine underline">{t('ws.voltar')}</Link></main>;

  const gastoHoje = v.despesas.filter((d) => d.data === hojeLocal).reduce((s, d) => s + (d.moeda === v.moeda ? d.valor : d.taxa ? d.valor * d.taxa : 0), 0);
  const porDia = v.orcamento ? v.orcamento / v.dias.length : 0;
  const reservasHoje = v.reservas.filter((r) => (r.inicioLocal || '').slice(0, 10) === dia);
  const sairAs = prox && prox.trecho && prox.trecho.durationSeconds != null ? mh(hm(prox.inicio) - Math.round(prox.trecho.durationSeconds / 60) - 10) : null;
  const diasParaIr = Math.ceil((Date.parse(v.inicio) - Date.parse(hojeLocal)) / 86400000);

  return (
    <main data-theme="dark" className="min-h-[calc(100vh-4rem)] bg-paper text-ink">
      <div className="max-w-lg mx-auto px-4 pt-6 pb-16 space-y-4">
        <div className="flex items-center justify-between">
          <Link href={`/viagens/${v.id}`} className="inline-flex items-center gap-1.5 text-sm text-inksoft hover:text-ink focusring rounded"><Icon name="arrow-left" size={15} /> {v.titulo}</Link>
          <span className={`inline-flex items-center gap-1.5 font-mono text-[11px] px-2 py-1 rounded ${online ? 'bg-success-bg text-success' : 'bg-warn-bg text-warn'}`}>
            <Icon name={online ? 'wifi' : 'wifi-off'} size={13} />{online ? t('hoje.online') : t('hoje.offline')}
          </span>
        </div>

        <div>
          <div className="eyebrow">{emViagem ? tf('v2.hojeEm', { d: v.destinoNome }) : tf('hoje.previa', { n: diasParaIr > 0 ? diasParaIr : '—' })}</div>
          <div className="mt-1 flex items-baseline gap-3">
            <span className="font-display text-5xl tracking-tighter">{localAgora.slice(11, 16)}</span>
            <span className="text-sm text-inksoft">{t('hoje.horaLocal')} ({tz})</span>
          </div>
          {!emViagem && (
            <select value={dia} onChange={(e) => setDiaSel(e.target.value)} aria-label={t('hoje.diaPrev')} className="mt-2 h-10 px-3 rounded-lg border border-line bg-input text-ink text-sm focusring">
              {v.dias.map((d, i) => <option key={d} value={d}>Dia {i + 1} · {d}</option>)}
            </select>
          )}
        </div>

        {/* PRÓXIMA ATIVIDADE */}
        <section className="rounded-2xl border border-line bg-card p-5" aria-labelledby="prox-h">
          <div className="flex items-center gap-2"><span className="signal-dot" /><h2 id="prox-h" className="eyebrow !text-ink">{t('hoje.proximo')}</h2></div>
          {prox ? (
            <>
              <div className="mt-3 font-display text-3xl leading-tight">{prox.nome}</div>
              <div className="mt-1 font-mono text-sm text-inksoft">{prox.inicio}–{prox.fim}{proxItem && proxItem.fixoInicio ? ` · ${t('v2.horarioReservado')}` : ''}</div>
              {sairAs && <div className="mt-4 rounded-xl bg-coral text-oncoral px-4 py-3 font-semibold flex items-center gap-2"><Icon name="clock" size={18} /> {tf('v2.saia', { h: sairAs })} <span className="font-normal text-sm">{t('hoje.folga')}</span></div>}
              <div className="mt-4 grid grid-cols-2 gap-2">
                {proxItem && Number.isFinite(proxItem.lat) ? (
                  <a href={`https://www.google.com/maps/dir/?api=1&destination=${proxItem.lat},${proxItem.lng}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 h-12 rounded-lg bg-pine text-onpine font-semibold focusring"><Icon name="route" size={18} /> {t('hoje.navegar')}</a>
                ) : <span className="inline-flex items-center justify-center h-12 rounded-lg border border-line text-xs text-inksoft px-2 text-center">{t('hoje.semNav')}</span>}
                <button type="button" onClick={pedirLocalizacao} className="inline-flex items-center justify-center gap-2 h-12 rounded-lg border border-line font-medium focusring" aria-describedby="loc-ajuda"><Icon name="pin" size={18} /> {t('hoje.ondeEstou')}</button>
              </div>
              <p id="loc-ajuda" className="mt-2 text-[11px] text-inksoft">{t('hoje.locAviso')}</p>
              {pos.estado === 'pedindo' && <p className="mt-2 text-sm text-inksoft" role="status">{t('hoje.pedindo')}</p>}
              {pos.estado === 'negado' && <p className="mt-2 text-sm text-warn" role="status">{t('hoje.negado')}</p>}
              {pos.estado === 'erro' && <p className="mt-2 text-sm text-warn" role="status">{t('hoje.erroGps')}</p>}
              {pos.estado === 'ok' && proxItem && Number.isFinite(proxItem.lat) && (
                <div className="mt-3 rounded-xl border border-line p-3 text-sm" role="status">
                  {tf('v2.voceEsta', { km: distanciaKm(pos, proxItem).toFixed(1), m: pos.precisao })}
                  {rota && rota.trechos[0] && rota.trechos[0].durationSeconds != null && <> <span className="font-mono">{tf('v2.trajeto', { min: Math.round(rota.trechos[0].durationSeconds / 60) })}</span> <SourceTrust freshness={rota.trechos[0].freshness} fonte={rota.trechos[0].provider} compacto /></>}
                </div>
              )}
            </>
          ) : itens.length ? (
            <p className="mt-3 text-inksoft">{t('hoje.concluido')}</p>
          ) : (
            <p className="mt-3 text-inksoft">{t('hoje.nada')} <Link href={`/viagens/${v.id}#roteiro`} className="text-pine underline">{t('hoje.montar')}</Link></p>
          )}
        </section>

        {/* CLIMA + PLANO B */}
        <section className="rounded-2xl border border-line bg-card p-5" aria-labelledby="clima-h">
          <h2 id="clima-h" className="eyebrow !text-ink">{t('hoje.tempoRiscos')}</h2>
          {!online ? <p className="mt-2 text-sm text-inksoft">{t('hoje.semNet')}</p>
            : climaDia ? (
              <div className="mt-3 flex items-center gap-3">
                <Icon name={descreverTempo(climaDia.codigo)[1]} size={30} className="text-pine" />
                <div>
                  <div className="font-medium">{descreverTempo(climaDia.codigo)[0]} · {Math.round(climaDia.min)}–{Math.round(climaDia.max)}°C</div>
                  <div className="text-sm text-inksoft">{tf('v2.chance', { n: climaDia.chuva ?? '—' })} <SourceTrust freshness="LIVE" fonte="Open-Meteo" compacto /></div>
                </div>
              </div>
            ) : <p className="mt-2 text-sm text-inksoft">{itens.some((i) => Number.isFinite(i.lat)) ? t('hoje.climaAte') : t('hoje.addCoord')}</p>}
          {chuvaForte && arLivreHoje.length > 0 && (
            <div className="mt-4 rounded-xl border border-warn-bd bg-warn-bg p-4 text-warn">
              <div className="font-semibold flex items-center gap-2"><Icon name="rain" size={17} /> {t('hoje.planoB')}</div>
              {planoB === 'aplicado' ? <p className="mt-1 text-sm">{t('hoje.planoBFeito')}</p>
                : sugestaoPlanoB && sugestaoPlanoB.mover ? (
                  <>
                    <ul className="mt-2 text-sm space-y-1">{sugestaoPlanoB.mover.map((m) => <li key={m.item.id}>• {tf('v2.mover', { a: m.item.titulo, d: m.para })}</li>)}</ul>
                    <div className="mt-3 flex gap-2">
                      <button type="button" onClick={aplicarPlanoB} className="h-10 px-4 rounded-lg bg-ink text-paper text-sm font-semibold focusring">{t('hoje.aplicarTroca')}</button>
                      <button type="button" onClick={() => setPlanoB('ignorado')} className="h-10 px-4 rounded-lg border border-warn-bd text-sm focusring">{t('hoje.manter')}</button>
                    </div>
                    <p className="mt-2 text-[11px]">{t('hoje.planoBNota')}</p>
                  </>
                ) : <p className="mt-1 text-sm">{t('hoje.semSeco')}</p>}
            </div>
          )}
        </section>

        {/* INGRESSOS E RESERVAS DO DIA */}
        <section className="rounded-2xl border border-line bg-card p-5" aria-labelledby="res-h">
          <h2 id="res-h" className="eyebrow !text-ink">{t('hoje.reservasDia')}</h2>
          {reservasHoje.length === 0 ? <p className="mt-2 text-sm text-inksoft">{t('hoje.semReservaDia')}</p> : (
            <ul className="mt-3 space-y-2">
              {reservasHoje.map((r) => (
                <li key={r.id} className="rounded-xl border border-line p-3">
                  <div className="flex items-center justify-between gap-2"><span className="font-medium">{r.provider}</span><span className="font-mono text-[11px] text-inksoft">{(r.inicioLocal || '').slice(11, 16)}</span></div>
                  {r.localizador && <div className="mt-1 font-mono text-2xl tracking-wider">{r.localizador}</div>}
                  <div className="text-[11px] text-inksoft">{r.confirmedBy === 'import_manual' ? t('hoje.informadaVoce') : r.status}</div>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* DINHEIRO */}
        <section className="rounded-2xl border border-line bg-card p-5" aria-labelledby="din-h">
          <h2 id="din-h" className="eyebrow !text-ink">{t('hoje.gastar')}</h2>
          {porDia ? (
            <div className="mt-3">
              <div className="flex items-baseline justify-between"><span className="font-mono text-2xl">{(porDia - gastoHoje).toLocaleString(locale, { maximumFractionDigits: 0 })} {v.moeda}</span><span className="text-xs text-inksoft">/ {porDia.toLocaleString(locale, { maximumFractionDigits: 0 })}{t('hoje.porDia')}</span></div>
              <div className="mt-2 h-2 rounded-full bg-paper2 overflow-hidden"><div className={`h-full ${gastoHoje > porDia ? 'bg-danger' : 'bg-pine'}`} style={{ width: `${Math.min(100, (gastoHoje / porDia) * 100)}%` }} /></div>
              <Link href={`/viagens/${v.id}#despesas`} className="mt-3 inline-flex items-center gap-1.5 text-sm text-pine focusring">{t('hoje.lancar')} <Icon name="arrow-right" size={14} /></Link>
            </div>
          ) : <p className="mt-2 text-sm text-inksoft">{t('hoje.semOrc')}</p>}
        </section>

        {/* AGENDA COMPLETA */}
        {sim.passos.length > 0 && (
          <section className="rounded-2xl border border-line bg-card p-5" aria-labelledby="agenda-h">
            <h2 id="agenda-h" className="eyebrow !text-ink">{t('hoje.agenda')}</h2>
            <ol className="mt-3 space-y-2">
              {sim.passos.map((p, i) => (
                <li key={p.id} className={`flex items-center gap-3 ${i < idxProx ? 'opacity-50' : ''}`}>
                  <span className="font-mono text-xs text-inksoft w-12">{p.inicio}</span>
                  <span className={`w-2 h-2 rounded-full ${i === idxProx ? 'bg-coral' : 'bg-line'}`} />
                  <span className="text-sm">{p.nome}</span>
                </li>
              ))}
            </ol>
          </section>
        )}
      </div>
    </main>
  );
}
