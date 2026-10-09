'use client';
import { useEffect, useMemo, useState } from 'react';
import { MESES, M3, noMes } from '../../_lib/figurinhaMes.js';
import { track } from '../../_lib/analytics.js';
import { Figurinha } from '../../_ui/Figurinha.jsx';
import { Placar } from '../../_ui/Placar.jsx';
import { Icon } from '../../_ui/Icon.jsx';
import { ExplorarClient } from './ExplorarClient.jsx';

// ÁLBUM DO MUNDO (Explorar): os 205 países como figurinhas. Brilhante = hora certa
// no mês escolhido (época boa + segurança ≥ 4). Filtros por região, mês e "só
// brilhantes"; pacotinho sorteia 5 figurinhas boas do mês. O mapa continua como
// visão alternativa (?vista=mapa). Estado em URL: ?mes=1..12&regiao=…&vista=…
const REGIOES = ['América do Sul', 'América Central e Norte', 'Europa', 'África', 'Cáucaso e Oriente Médio', 'Leste Asiático', 'Sudeste Asiático', 'Sul da Ásia', 'Ásia Central', 'Oceania'];
const CURTO = { 'América do Sul': 'Am. do Sul', 'América Central e Norte': 'Am. Central e Norte', 'Cáucaso e Oriente Médio': 'Oriente Médio' };
const POS_PACOTE = [[0, 60, -14], [110, 20, -6], [220, 0, 0], [330, 20, 6], [440, 60, 14]];
const chip = 'whitespace-nowrap flex-none min-h-[42px] px-4 rounded-full border-2 border-ink font-cond font-extrabold text-[15px] uppercase tracking-[.06em] focusring transition-colors';

export function AlbumExplorar({ bases, midia, mesInicial, destinos }) {
  const [vista, setVista] = useState('album');
  const [mes, setMes] = useState(mesInicial);
  const [regiao, setRegiao] = useState('');
  const [soBrilhantes, setSoBrilhantes] = useState(false);
  const [busca, setBusca] = useState('');
  const [vez, setVez] = useState(0);

  // estado inicial pela URL (links da home e compartilháveis)
  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    const m = Number(p.get('mes'));
    /* eslint-disable react-hooks/set-state-in-effect */
    if (m >= 1 && m <= 12) setMes(m - 1);
    if (p.get('vista') === 'mapa' || p.get('camada') || p.get('sel')) setVista('mapa');
    if (REGIOES.includes(p.get('regiao') || '')) setRegiao(p.get('regiao'));
    if (p.get('q')) setBusca(p.get('q'));
    /* eslint-enable react-hooks/set-state-in-effect */
  }, []);
  useEffect(() => {
    if (vista === 'mapa') return; // o mapa cuida da própria URL
    const p = new URLSearchParams();
    p.set('mes', String(mes + 1));
    if (regiao) p.set('regiao', regiao);
    if (busca.trim()) p.set('q', busca.trim());
    window.history.replaceState(null, '', `?${p.toString()}`);
  }, [mes, regiao, busca, vista]);

  const figs = useMemo(() => bases.map((b) => noMes(b, mes)), [bases, mes]);
  const brilhantes = figs.filter((f) => f.bom).length;
  const lista = useMemo(() => {
    const termo = busca.trim().toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
    const l = figs.filter((f) => (!regiao || f.regiao === regiao) && (!soBrilhantes || f.bom)
      && (!termo || f.nome.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').includes(termo)));
    const foto = (f) => (midia[f.code] && midia[f.code].capa ? 1 : 0);
    return l.sort((a, b) => (b.bom - a.bom) || (foto(b) - foto(a)) || (b.seguranca - a.seguranca) || a.nome.localeCompare(b.nome, 'pt-BR'));
  }, [figs, regiao, soBrilhantes, busca, midia]);

  const pacote = useMemo(() => {
    const bons = figs.filter((f) => f.bom && f.code !== 'BR' && f.seguranca >= 6 && midia[f.code] && midia[f.code].capa);
    const escolha = [];
    for (let i = 0; i < 5 && bons.length; i++) escolha.push(bons.splice((i * 37 + vez * 11 + mes * 7) % bons.length, 1)[0]);
    return escolha;
  }, [figs, midia, vez, mes]);

  const abrirPacote = () => { setVez((v) => v + 1); track('album_pacotinho', { mes }); };

  return (
    <>
      {/* CAPA DO ÁLBUM */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pt-8 pb-8 grid gap-8 lg:gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] items-center">
        <div>
          <span className="ms-rotulo">{bases.length} países · bandeira oficial em todos · foto real onde houver</span>
          <h1 className="ms-titulo mt-2.5 text-[64px] sm:text-[88px] xl:text-[112px] leading-[.84] tracking-[-.055em] text-ink">o álbum<br />do <span className="text-cobalto">mundo</span></h1>
          <div className="mt-6 flex flex-col gap-2.5 max-w-[480px]">
            <span className="font-display font-extrabold text-[26px] tracking-[-.02em] flex items-center gap-2 flex-wrap">
              <Placar texto={String(brilhantes)} w={24} h={34} cor="#1C3FD1" passo={50} /> brilhantes em {MESES[mes]}
            </span>
            <div className="h-3.5 rounded-full bg-paper2 shadow-[inset_0_0_0_1px_rgb(var(--c-line))] overflow-hidden" role="progressbar" aria-valuemin={0} aria-valuemax={bases.length} aria-valuenow={brilhantes} aria-label="Países na hora certa">
              <i className="block h-full rounded-full bg-coral transition-[width] duration-700" style={{ width: `${(brilhantes / bases.length) * 100}%` }} />
            </div>
            <span className="text-base text-inksoft">Brilhante é país na época certa no mês escolhido, com segurança 4/10 ou mais. Vire qualquer figurinha para ver custo, visto e melhores meses.</span>
          </div>
          <div className="mt-6 flex flex-wrap gap-3.5">
            <button type="button" className="ms-btn ms-btn-album" onClick={abrirPacote}>Abrir pacotinho</button>
            <button type="button" className="ms-btn ms-btn-linha" onClick={() => setVista(vista === 'mapa' ? 'album' : 'mapa')}>
              <Icon name={vista === 'mapa' ? 'grid' : 'map'} size={18} /> {vista === 'mapa' ? 'Ver o álbum' : 'Ver no mapa'}
            </button>
          </div>
        </div>
        <div className="relative min-w-0 h-[330px] max-xl:h-[270px] max-lg:h-[200px] overflow-hidden xl:overflow-visible" aria-live="polite" aria-label={`Pacotinho de ${MESES[mes]}`}>
          <div className="relative w-[620px] h-[330px] origin-top-left max-xl:scale-[.78] max-lg:scale-[.54]">
            {pacote.map((f, i) => (
              <Figurinha key={`${f.code}-${vez}`} f={f} mes={mes} midia={midia[f.code]} largura={176} altura={256}
                style={{ position: 'absolute', left: POS_PACOTE[i][0], top: POS_PACOTE[i][1], transform: `rotate(${POS_PACOTE[i][2]}deg)`, zIndex: i < 2 ? i + 1 : 7 - i, animation: `ms-voa .9s cubic-bezier(.22,1,.36,1) ${i * 110}ms both` }} />
            ))}
          </div>
        </div>
      </section>

      {/* FILTROS (fixos ao rolar) */}
      <div className="sticky top-[72px] z-30 bg-white/95 backdrop-blur border-y border-line">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex flex-col gap-2.5">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-0.5" role="group" aria-label="Visão">
            {[['album', 'Álbum'], ['mapa', 'Mapa']].map(([id, t]) => (
              <button key={id} type="button" aria-pressed={vista === id} onClick={() => setVista(id)}
                className={`${chip} ${vista === id ? 'bg-ink text-white' : 'bg-white text-ink hover:bg-paper2'}`}>{t}</button>
            ))}
            <span className="w-px h-7 bg-line mx-1 flex-none" aria-hidden="true" />
            {vista === 'album' && (
              <label className="relative flex-none">
                <span className="sr-only">Buscar país</span>
                <Icon name="search" size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-inksoft pointer-events-none" />
                <input value={busca} onChange={(e) => setBusca(e.target.value)} placeholder="Buscar país" className="h-[42px] w-44 sm:w-56 pl-10 pr-3 rounded-full border-2 border-line bg-white text-[15px] focusring focus:border-ink" />
              </label>
            )}
          </div>
          {vista === 'album' && (
            <>
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-0.5" role="group" aria-label="Região">
                <button type="button" aria-pressed={!regiao} onClick={() => setRegiao('')} className={`${chip} ${!regiao ? 'bg-ink text-white' : 'bg-white text-ink hover:bg-paper2'}`}>Todos {bases.length}</button>
                {REGIOES.map((r) => (
                  <button key={r} type="button" aria-pressed={regiao === r} onClick={() => setRegiao(regiao === r ? '' : r)}
                    className={`${chip} ${regiao === r ? 'bg-ink text-white' : 'bg-white text-ink hover:bg-paper2'}`}>{CURTO[r] || r}</button>
                ))}
                <button type="button" aria-pressed={soBrilhantes} onClick={() => setSoBrilhantes((v) => !v)}
                  className={`${chip} ${soBrilhantes ? 'bg-coral text-ink' : 'bg-white text-ink hover:bg-paper2'}`}>Só brilhantes</button>
              </div>
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-0.5" role="group" aria-label="Mês">
                {M3.map((m, i) => (
                  <button key={m} type="button" aria-pressed={i === mes} aria-label={MESES[i]} onClick={() => setMes(i)}
                    className={`${chip} !px-2.5 min-w-[54px] ${i === mes ? 'bg-coral text-ink' : 'bg-white text-ink hover:bg-paper2'}`}>{m}</button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {vista === 'album' ? (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 pt-7 pb-6" aria-label="Figurinhas">
          <p className="ms-rotulo mb-5" aria-live="polite">{lista.length} {lista.length === 1 ? 'figurinha' : 'figurinhas'}{regiao ? ` · ${regiao}` : ''}{soBrilhantes ? ' · só brilhantes' : ''} · {MESES[mes]}</p>
          {lista.length === 0 ? (
            <div className="rounded-[24px] bg-paper2 p-10 text-center">
              <p className="font-display font-bold text-2xl">Nenhuma figurinha com esse filtro.</p>
              <button type="button" className="ms-btn ms-btn-linha mt-5" onClick={() => { setRegiao(''); setSoBrilhantes(false); setBusca(''); }}>Limpar filtros</button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-[repeat(auto-fill,minmax(168px,1fr))] gap-x-3 gap-y-4 sm:gap-x-[18px] sm:gap-y-6 justify-items-center">
              {lista.map((f) => (
                <Figurinha key={f.code} f={f} mes={mes} midia={midia[f.code]} largura="100%" altura={244} className="max-w-[200px]" />
              ))}
            </div>
          )}
          <p className="mt-8 text-sm text-inksoft">Fotos e bandeiras: Wikimedia Commons, com autor e licença no verso de cada figurinha. Custo, época e visto: base de referência jun/2026 — confira o visto na fonte oficial.</p>
        </section>
      ) : (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-7">
          <ExplorarClient destinos={destinos} />
        </div>
      )}
    </>
  );
}
