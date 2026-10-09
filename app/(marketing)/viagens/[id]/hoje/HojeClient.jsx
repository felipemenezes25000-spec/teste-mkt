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
import { Placar } from '../../../../_ui/Placar.jsx';
import { FaixaAzulejos } from '../../../../_ui/Azulejo.jsx';

// MODO VIAGEM CALÇADÃO (OMEGA V4 §20 / §75 "Viagem / Hoje"): relógio em placar,
// próximo passo como figurinha (foto/vídeo HD do lugar quando o nome bate com a
// curadoria da Commons; senão, cartão de azulejos — nunca foto de outro lugar).
// responde em segundos — onde
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
  const [midia, setMidia] = useState(null);

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

  // mídia HD do país (fotos das atrações + vídeos curados) para ilustrar o próximo passo
  useEffect(() => {
    if (!v || !v.destinoCode || !online) return undefined;
    let vivo = true;
    fetch(`/api/fotos?codes=${v.destinoCode}&lugares=1`).then((r) => (r.ok ? r.json() : null)).then((j) => { if (vivo && j) setMidia(j[v.destinoCode] || null); }).catch(() => {});
    return () => { vivo = false; };
  }, [v && v.destinoCode, online]); // eslint-disable-line react-hooks/exhaustive-deps

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

  const norm = (x) => String(x || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9 ]/g, ' ').replace(/\s+/g, ' ').trim();
  const nomeProx = prox ? norm(prox.nome) : '';
  const fotoProx = midia && midia.lugares && nomeProx ? Object.entries(midia.lugares).find(([k]) => { const n = norm(k); return n === nomeProx || n.includes(nomeProx) || nomeProx.includes(n); }) : null;
  const videoProx = midia && midia.videos && nomeProx ? midia.videos.find((x) => { const n = norm(x.lugar.split(',')[0]); return n.length > 3 && (nomeProx.includes(n) || n.includes(nomeProx)); }) : null;
  const credProx = videoProx ? videoProx.credito : fotoProx ? fotoProx[1].credito : null;
  const [hh, mm] = localAgora.slice(11, 16).split(':');
  const bloco = 'rounded-[24px] bg-paper2 p-5';

  return (
    <main className="min-h-[calc(100vh-4.5rem)] bg-white text-ink">
      <div className="max-w-[460px] mx-auto px-4 pt-5 pb-16 space-y-4">
        <div className="flex items-center justify-between gap-3">
          <Link href={`/viagens/${v.id}`} className="inline-flex items-center gap-2 min-h-[44px] text-[15px] font-semibold text-ink focusring rounded"><Icon name="arrow-left" size={17} /> {v.titulo}</Link>
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full font-cond font-extrabold text-[13px] tracking-[.08em] uppercase ${online ? 'bg-success-bg text-success' : 'bg-warn-bg text-warn'}`}>
            <i className={`w-2 h-2 rounded-full ${online ? 'bg-success' : 'bg-warn'}`} aria-hidden="true" />{online ? t('hoje.online') : t('hoje.offline')}
          </span>
        </div>

        <div>
          <span className="ms-rotulo">{emViagem ? tf('v2.hojeEm', { d: v.destinoNome }) : tf('hoje.previa', { n: diasParaIr > 0 ? diasParaIr : '—' })}</span>
          <div className="mt-2 flex items-center gap-1.5" role="img" aria-label={`${t('hoje.horaLocal')}: ${hh}:${mm}`}>
            <Placar texto={hh} w={52} h={74} passo={80} rotulo={`${hh}`} />
            <span className="font-display font-black text-[40px] text-amarelodk" aria-hidden="true">:</span>
            <Placar texto={mm} w={52} h={74} atraso={160} passo={80} rotulo={`${mm}`} />
          </div>
          <span className="ms-rotulo mt-1.5 block">{t('hoje.horaLocal')} · {tz}</span>
          {!emViagem && (
            <select value={dia} onChange={(e) => setDiaSel(e.target.value)} aria-label={t('hoje.diaPrev')} className="mt-3 h-11 px-4 rounded-full border-2 border-ink bg-white text-ink font-cond font-bold text-[16px] uppercase tracking-[.04em] focusring">
              {v.dias.map((d, i) => <option key={d} value={d}>Dia {i + 1} · {d}</option>)}
            </select>
          )}
        </div>

        {/* PRÓXIMA ATIVIDADE — figurinha */}
        <section aria-labelledby="prox-h">
          {prox ? (
            <>
              <div className="rounded-[22px] bg-white p-2 shadow-[0_0_0_1px_#E3E3DD,0_20px_40px_-24px_rgba(0,0,0,.5)]">
                <div className="relative h-[400px] rounded-[14px] overflow-hidden bg-ink">
                  {videoProx ? (
                    <video className="absolute inset-0 w-full h-full object-cover" src={videoProx.src} poster={videoProx.poster} muted loop autoPlay playsInline preload="metadata" crossOrigin="anonymous" aria-label={`Vídeo: ${videoProx.lugar}`} />
                  ) : fotoProx ? (
                    <img className="absolute inset-0 w-full h-full object-cover" src={fotoProx[1].img} srcSet={fotoProx[1].srcSet} sizes="440px" alt={prox.nome} crossOrigin="anonymous" />
                  ) : (
                    <div className="absolute inset-x-0 top-0" aria-hidden="true">
                      <FaixaAzulejos n={8} tam={56} semente={(prox.nome || '').length} />
                      <FaixaAzulejos n={8} tam={56} semente={(prox.nome || '').length + 3} />
                      <FaixaAzulejos n={8} tam={56} semente={(prox.nome || '').length + 7} />
                    </div>
                  )}
                  <h2 id="prox-h" className="absolute top-2.5 left-2.5 z-10 px-2 py-1 rounded-md bg-ink text-white font-cond font-extrabold text-[13px] tracking-[.06em] uppercase">{t('hoje.proximo')}</h2>
                  {v.destinoCode && (
                    <img src={`/bandeiras/${v.destinoCode}.png`} alt="" className="absolute top-2.5 right-2.5 z-10 h-6 w-auto rounded-[3px] shadow-[0_0_0_2px_#fff,0_2px_6px_rgba(0,0,0,.3)]" />
                  )}
                  <div className="absolute inset-x-0 bottom-0 z-10 px-4 pb-4 pt-16 bg-gradient-to-t from-ink via-ink/70 to-transparent text-white">
                    <span className="inline-block px-2.5 py-1 rounded-full bg-coral text-ink font-cond font-black italic text-[13px] tracking-[.06em]">{prox.inicio}–{prox.fim}{proxItem && proxItem.fixoInicio ? ` · ${t('v2.horarioReservado')}` : ''}</span>
                    <div className="mt-2 font-cond font-black italic text-[34px] leading-[.92] uppercase">{prox.nome}</div>
                    {credProx && <div className="mt-1.5 text-[11px] text-white/80">{videoProx ? 'Vídeo' : 'Foto'}: {credProx.autor} · {credProx.licenca} · <a href={credProx.link} target="_blank" rel="noopener noreferrer" className="underline">Wikimedia Commons</a></div>}
                  </div>
                </div>
              </div>
              {sairAs && <div className="mt-3 rounded-[18px] bg-ink text-white px-4 py-3 font-cond font-extrabold text-xl uppercase tracking-[.04em] flex flex-wrap items-center gap-2"><Icon name="clock" size={20} /> {tf('v2.saia', { h: sairAs })} <span className="font-sans font-normal normal-case tracking-normal text-sm text-white/80">{t('hoje.folga')}</span></div>}
              <div className="mt-3 grid grid-cols-2 gap-2.5">
                {proxItem && Number.isFinite(proxItem.lat) ? (
                  <a href={`https://www.google.com/maps/dir/?api=1&destination=${proxItem.lat},${proxItem.lng}`} target="_blank" rel="noopener noreferrer" className="ms-btn ms-btn-tinta !min-h-[52px] !text-[18px] !px-3"><Icon name="route" size={19} /> {t('hoje.navegar')}</a>
                ) : <span className="inline-flex items-center justify-center min-h-[52px] rounded-full border-2 border-line text-xs text-inksoft px-3 text-center">{t('hoje.semNav')}</span>}
                <button type="button" onClick={pedirLocalizacao} className="ms-btn ms-btn-linha !min-h-[52px] !text-[18px] !px-3" aria-describedby="loc-ajuda"><Icon name="pin" size={19} /> {t('hoje.ondeEstou')}</button>
              </div>
              <p id="loc-ajuda" className="mt-2 px-0.5 text-[12.5px] leading-[18px] text-inksoft">{t('hoje.locAviso')}</p>
              {pos.estado === 'pedindo' && <p className="mt-2 text-sm text-inksoft" role="status">{t('hoje.pedindo')}</p>}
              {pos.estado === 'negado' && <p className="mt-2 text-sm text-warn" role="status">{t('hoje.negado')}</p>}
              {pos.estado === 'erro' && <p className="mt-2 text-sm text-warn" role="status">{t('hoje.erroGps')}</p>}
              {pos.estado === 'ok' && proxItem && Number.isFinite(proxItem.lat) && (
                <div className="mt-3 rounded-[18px] bg-paper2 p-3.5 text-sm" role="status">
                  {tf('v2.voceEsta', { km: distanciaKm(pos, proxItem).toFixed(1), m: pos.precisao })}
                  {rota && rota.trechos[0] && rota.trechos[0].durationSeconds != null && <> <span className="font-mono">{tf('v2.trajeto', { min: Math.round(rota.trechos[0].durationSeconds / 60) })}</span> <SourceTrust freshness={rota.trechos[0].freshness} fonte={rota.fonte} compacto /></>}
                </div>
              )}
            </>
          ) : (
            <div className={bloco}>
              <h2 id="prox-h" className="ms-rotulo">{t('hoje.proximo')}</h2>
              {itens.length ? <p className="mt-2 text-ink">{t('hoje.concluido')}</p>
                : <p className="mt-2 text-ink">{t('hoje.nada')} <Link href={`/viagens/${v.id}#roteiro`} className="font-semibold underline decoration-coral decoration-[3px] underline-offset-4">{t('hoje.montar')}</Link></p>}
            </div>
          )}
        </section>

        {/* DINHEIRO */}
        <section className="rounded-[24px] bg-coral p-5" aria-labelledby="din-h">
          <h2 id="din-h" className="ms-rotulo !text-ink">{t('hoje.gastar')}</h2>
          {porDia ? (
            <div className="mt-2.5">
              <Placar texto={`${Math.round(porDia - gastoHoje).toLocaleString(locale)} ${v.moeda}`} w={26} h={38} atraso={300} passo={40} />
              <div className="mt-2 text-sm">/ {porDia.toLocaleString(locale, { maximumFractionDigits: 0 })} {v.moeda} {t('hoje.porDia')}</div>
              <div className="mt-2.5 h-2.5 rounded-full bg-white/70 overflow-hidden"><div className={`h-full rounded-full ${gastoHoje > porDia ? 'bg-danger' : 'bg-ink'}`} style={{ width: `${Math.min(100, (gastoHoje / porDia) * 100)}%` }} /></div>
              <Link href={`/viagens/${v.id}#despesas`} className="mt-3 inline-flex items-center gap-1.5 font-cond font-extrabold uppercase tracking-[.05em] border-b-[3px] border-ink focusring">{t('hoje.lancar')} <Icon name="arrow-right" size={15} /></Link>
            </div>
          ) : <p className="mt-2 text-sm">{t('hoje.semOrc')}</p>}
        </section>

        {/* AGENDA COMPLETA */}
        {sim.passos.length > 0 && (
          <section className={bloco} aria-labelledby="agenda-h">
            <h2 id="agenda-h" className="ms-rotulo">{t('hoje.agenda')}</h2>
            <ol className="mt-2">
              {sim.passos.map((p, i) => (
                <li key={p.id} className={`grid grid-cols-[auto_1fr] items-center gap-3 py-2.5 ${i ? 'border-t border-line' : ''} ${i < idxProx ? 'opacity-50' : ''}`}>
                  <Placar texto={p.inicio} w={18} h={26} cor={i === idxProx ? '#111111' : '#8E8E86'} atraso={i * 120} passo={30} />
                  <span className={`font-cond font-extrabold text-[19px] uppercase leading-tight ${i === idxProx ? 'text-ink' : 'text-inksoft'}`}>{p.nome}</span>
                </li>
              ))}
            </ol>
          </section>
        )}

        {/* CLIMA + PLANO B */}
        <section className={bloco} aria-labelledby="clima-h">
          <h2 id="clima-h" className="ms-rotulo">{t('hoje.tempoRiscos')}</h2>
          {!online ? <p className="mt-2 text-sm text-inksoft">{t('hoje.semNet')}</p>
            : climaDia ? (
              <div className="mt-3 flex items-center gap-3">
                <Icon name={descreverTempo(climaDia.codigo)[1]} size={32} className="text-ink" />
                <div>
                  <div className="font-display font-bold text-lg">{descreverTempo(climaDia.codigo)[0]} · {Math.round(climaDia.min)}–{Math.round(climaDia.max)}°C</div>
                  <div className="text-sm text-inksoft">{tf('v2.chance', { n: climaDia.chuva ?? '—' })} <SourceTrust freshness="LIVE" fonte="Open-Meteo" compacto /></div>
                </div>
              </div>
            ) : <p className="mt-2 text-sm text-inksoft">{itens.some((i) => Number.isFinite(i.lat)) ? t('hoje.climaAte') : t('hoje.addCoord')}</p>}
          {chuvaForte && arLivreHoje.length > 0 && (
            <div className="mt-4 rounded-[18px] border border-warn-bd bg-warn-bg p-4 text-warn">
              <div className="font-semibold flex items-center gap-2"><Icon name="rain" size={17} /> {t('hoje.planoB')}</div>
              {planoB === 'aplicado' ? <p className="mt-1 text-sm">{t('hoje.planoBFeito')}</p>
                : sugestaoPlanoB && sugestaoPlanoB.mover ? (
                  <>
                    <ul className="mt-2 text-sm space-y-1">{sugestaoPlanoB.mover.map((m) => <li key={m.item.id}>• {tf('v2.mover', { a: m.item.titulo, d: m.para })}</li>)}</ul>
                    <div className="mt-3 flex gap-2">
                      <button type="button" onClick={aplicarPlanoB} className="ms-btn ms-btn-tinta ms-btn-sm">{t('hoje.aplicarTroca')}</button>
                      <button type="button" onClick={() => setPlanoB('ignorado')} className="ms-btn ms-btn-linha ms-btn-sm">{t('hoje.manter')}</button>
                    </div>
                    <p className="mt-2 text-[11px]">{t('hoje.planoBNota')}</p>
                  </>
                ) : <p className="mt-1 text-sm">{t('hoje.semSeco')}</p>}
            </div>
          )}
        </section>

        {/* INGRESSOS E RESERVAS DO DIA */}
        <section className={bloco} aria-labelledby="res-h">
          <h2 id="res-h" className="ms-rotulo">{t('hoje.reservasDia')}</h2>
          {reservasHoje.length === 0 ? <p className="mt-2 text-sm text-inksoft">{t('hoje.semReservaDia')}</p> : (
            <ul className="mt-3 space-y-2">
              {reservasHoje.map((r) => (
                <li key={r.id} className="rounded-[18px] bg-white p-3.5">
                  <div className="flex items-center justify-between gap-2"><span className="font-semibold">{r.provider}</span><span className="font-mono text-sm text-inksoft">{(r.inicioLocal || '').slice(11, 16)}</span></div>
                  {r.localizador && <div className="mt-1 font-cond font-extrabold text-3xl tracking-[.12em]">{r.localizador}</div>}
                  <div className="text-[12px] text-inksoft">{r.confirmedBy === 'import_manual' ? t('hoje.informadaVoce') : r.status}</div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </main>
  );
}
