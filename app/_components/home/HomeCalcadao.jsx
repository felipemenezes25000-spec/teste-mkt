'use client';
import { useMemo, useState } from 'react';
import Link from 'next/link';
import { MESES, noMes, pad } from '../../_lib/figurinhaMes.js';
import { track } from '../../_lib/analytics.js';
import { Poema } from '../../_ui/Poema.jsx';
import { Placar } from '../../_ui/Placar.jsx';
import { Figurinha } from '../../_ui/Figurinha.jsx';
import { Azulejo, CORES_AZULEJO, FaixaAzulejos } from '../../_ui/Azulejo.jsx';

// Home CALÇADÃO (parte viva): a frase-simulador, o leque de figurinhas, o placar de
// "partidas na hora certa" e a fileira do álbum compartilham o MESMO mês — mudar o
// mês gira o placar e troca as figurinhas. Dados vêm prontos do servidor.
const DIAS = [7, 10, 14, 21, 30, 45, 60, 90];
const PESSOAS = [1, 2, 3, 4];
const ORCAMENTOS = [5, 8, 12, 20, 30, 50, 80];
// ordem de preferência das figurinhas do leque (fotos escolhidas a dedo primeiro)
const VITRINE = ['JP', 'PE', 'PT', 'TR', 'VN', 'TH', 'ID', 'MX', 'AR', 'CL', 'ES', 'NO', 'BA', 'BO', 'MA', 'GE', 'NP', 'IT', 'GR', 'ZA', 'AU', 'IS', 'KH', 'IN'];
const VISTO_PLACAR = { isento: 'ISENTO', 'e-visa': 'E-VISA', eta: 'ETA', 'on-arrival': 'NA CHEGADA', visto: 'PRÉVIO', consultar: 'CONSULTAR' };
const POS_LEQUE = [
  { left: 0, top: 130, rot: -8, z: 1 },
  { left: 168, top: 44, rot: 1, z: 2 },
  { left: 336, top: 150, rot: 9, z: 3 },
];

// Lacuna da frase: o texto visível tem a largura exata da opção escolhida; o <select>
// nativo (transparente, por cima) cuida do teclado, leitor de tela e celular.
function Campo({ rotulo, valor, onChange, opcoes }) {
  const atual = opcoes.find(([v]) => String(v) === String(valor));
  return (
    <span className="relative inline-block rounded-[2px] focus-within:outline focus-within:outline-[3px] focus-within:outline-offset-2 focus-within:outline-cobalto [&:hover>span]:bg-coral [&:focus-within>span]:bg-coral">
      <span className="ms-campo inline-block" aria-hidden="true">{atual ? atual[1] : valor}</span>
      <select className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" value={valor} onChange={(e) => onChange(e.target.value)} aria-label={rotulo}>
        {opcoes.map(([v, t]) => <option key={v} value={v}>{t}</option>)}
      </select>
    </span>
  );
}

export function HomeCalcadao({ bases, midia, mesInicial, cambio }) {
  const [mes, setMes] = useState(mesInicial);
  const [dias, setDias] = useState(14);
  const [pessoas, setPessoas] = useState(2);
  const [orc, setOrc] = useState(12);

  const figs = useMemo(() => bases.map((b) => noMes(b, mes)), [bases, mes]);
  // teto de custo em solo por pessoa/dia (US$) que cabe no orçamento informado
  const teto = (orc * 1000) / cambio / dias / pessoas;
  const bons = useMemo(() => figs.filter((f) => f.bom && f.code !== 'BR').sort((a, b) => a.custoDia - b.custoDia), [figs]);
  const cabem = bons.filter((f) => f.custoDia <= teto);

  const leque = useMemo(() => {
    const ok = (c) => { const f = figs.find((x) => x.code === c); return f && f.bom && midia[c] && midia[c].capa; };
    const pref = VITRINE.filter(ok);
    const resto = figs.filter((f) => f.bom && midia[f.code] && midia[f.code].capa && !pref.includes(f.code)).map((f) => f.code);
    return [...pref, ...resto].slice(0, 3).map((c) => figs.find((x) => x.code === c));
  }, [figs, midia]);

  const fileira = useMemo(() => {
    const com = figs.filter((f) => midia[f.code] && midia[f.code].capa);
    const ordem = (f) => (f.bom ? 0 : f.alerta ? 2 : 1) * 1000 + (VITRINE.includes(f.code) ? VITRINE.indexOf(f.code) : 500);
    return [...com].sort((a, b) => ordem(a) - ordem(b)).slice(0, 12);
  }, [figs, midia]);

  const mudarMes = (m) => { setMes(((m % 12) + 12) % 12); track('home_mes', { mes: m }); };

  return (
    <>
      {/* HERO: poema concreto + frase-simulador + leque de figurinhas sobre azulejos */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pt-8 pb-14 lg:pt-10 lg:pb-16 grid gap-6 lg:gap-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] items-center">
        <div>
          <Poema
            className="text-[46px] sm:text-[72px] xl:text-[96px] text-ink"
            linhas={[[['mundo'], ['mundo']], [['mundo'], ['mundo']], [['mundo', ''], ['sem', 'text-cobalto'], ['fim', '']]]}
          />
          <p className="mt-6 max-w-[560px] text-lg sm:text-xl leading-[1.55] text-[#33332F]">
            O mundo não acaba. A época certa também não: ela só muda de lugar. A gente mostra onde ela está agora, quanto custa e se o seu passaporte entra.
          </p>
          <p className="ms-frase mt-6 max-w-[660px] text-[22px] sm:text-[27px] xl:text-[31px] text-ink">
            Em <Campo rotulo="Mês da viagem" valor={mes} onChange={(v) => mudarMes(+v)} opcoes={MESES.map((m, i) => [i, m])} />,
            {' '}por <Campo rotulo="Dias de viagem" valor={dias} onChange={(v) => setDias(+v)} opcoes={DIAS.map((d) => [d, `${d} dias`])} />,
            {' '}em <Campo rotulo="Pessoas" valor={pessoas} onChange={(v) => setPessoas(+v)} opcoes={PESSOAS.map((p) => [p, String(p)])} />,
            {' '}com <Campo rotulo="Orçamento total" valor={orc} onChange={(v) => setOrc(+v)} opcoes={ORCAMENTOS.map((o) => [o, `R$ ${o} mil`])} />,
            {' '}<Placar texto={String(cabem.length)} w={28} h={40} cor="#1C3FD1" passo={60} rotulo={`${cabem.length}`} className="max-sm:[&_.ms-placa]:![--w:22px] max-sm:[&_.ms-placa]:![--h:32px]" />
            {' '}lugares estão na hora certa.
          </p>
          <p className="mt-3 text-sm text-inksoft max-w-[620px]">
            Conta: época boa no mês, segurança ≥ 4/10 e custo em solo (hospedagem, comida, transporte local) que cabe no orçamento — referência jun/2026, câmbio de referência US$ 1 = R$ {cambio.toFixed(2).replace('.', ',')}. Passagem aérea à parte.
          </p>
          <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-4">
            <Link href={`/explorar?mes=${mes + 1}`} className="ms-btn ms-btn-album" onClick={() => track('home_pacotinho', { mes })}>Abrir pacotinho de {MESES[mes]}</Link>
            <Link href="/explorar" className="font-cond font-extrabold text-[19px] uppercase tracking-[.05em] text-ink border-b-[3px] border-ink hover:border-coral focusring">Ver o álbum do mundo →</Link>
          </div>
        </div>

        <div className="relative min-w-0 h-[560px] max-xl:h-[450px] max-lg:h-[310px] max-lg:mt-4 overflow-hidden xl:overflow-visible max-lg:-mx-4 max-lg:px-4" aria-label={`Três países na hora certa em ${MESES[mes]}`}>
          <div className="relative w-[550px] h-[560px] origin-top-left max-xl:scale-[.78] max-lg:scale-[.62] max-[400px]:scale-[.56]">
            <div className="absolute right-[-24px] top-2 grid grid-cols-3 gap-1.5" aria-hidden="true">
              {Array.from({ length: 9 }, (_, i) => (
                <Azulejo key={i} motivo={i} cor={CORES_AZULEJO[(i * 2 + 1) % 4]} fundo={i % 3 === 1 ? '#111111' : '#FFFFFF'} tam={112} rot={(i % 4) * 90} />
              ))}
            </div>
            {leque.map((f, i) => (
              <Figurinha key={`${f.code}-${mes}`} f={f} mes={mes} midia={midia[f.code]} largura={214} altura={310} prioridade={i === 1}
                style={{ position: 'absolute', left: POS_LEQUE[i].left, top: POS_LEQUE[i].top, transform: `rotate(${POS_LEQUE[i].rot}deg)`, zIndex: POS_LEQUE[i].z }} />
            ))}
          </div>
        </div>
      </section>

      <FaixaAzulejos n={40} tam={64} semente={2} />

      {/* PLACAR: partidas na hora certa (gira quando o mês muda) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pt-16 sm:pt-20">
        <div className="flex flex-wrap items-end justify-between gap-5 mb-7">
          <div>
            <span className="ms-rotulo">Placar · gira quando o mês muda</span>
            <h2 className="ms-titulo text-[40px] sm:text-[60px] text-ink">partidas na hora certa</h2>
          </div>
          <div className="flex items-center gap-3">
            <span className="font-cond font-extrabold text-xl uppercase tracking-[.06em]">{MESES[mes]}</span>
            <button type="button" className="w-12 h-12 rounded-full border-2 border-ink bg-white font-cond font-extrabold text-2xl hover:bg-coral focusring" onClick={() => mudarMes(mes - 1)} aria-label="Mês anterior">‹</button>
            <button type="button" className="w-12 h-12 rounded-full border-2 border-ink bg-white font-cond font-extrabold text-2xl hover:bg-coral focusring" onClick={() => mudarMes(mes + 1)} aria-label="Próximo mês">›</button>
          </div>
        </div>
        <div className="rounded-[28px] border border-line bg-paper2 px-3.5 sm:px-7 pt-6 pb-4 overflow-x-auto">
          <table className="min-w-[1120px] w-full border-separate border-spacing-0">
            <caption className="sr-only">Os 8 destinos mais baratos na hora certa em {MESES[mes]}, com melhor época, visto para brasileiros, custo diário e situação para o seu orçamento</caption>
            <thead>
              <tr className="ms-rotulo text-left">
                <th scope="col" className="w-[44px] pb-3 font-bold"><span className="sr-only">Bandeira</span></th>
                <th scope="col" className="pb-3 font-bold">Destino</th>
                <th scope="col" className="pb-3 font-bold">Melhor época</th>
                <th scope="col" className="pb-3 font-bold">Visto BR</th>
                <th scope="col" className="pb-3 font-bold">US$/dia</th>
                <th scope="col" className="pb-3 font-bold">Situação</th>
              </tr>
            </thead>
            <tbody>
              {bons.slice(0, 8).map((f, r) => {
                const previo = f.visto.tipo === 'visto';
                const cabe = f.custoDia <= teto;
                const sit = previo ? 'VISTO' : cabe ? 'EMBARQUE' : 'ACIMA';
                const corSit = previo ? '#9A5B00' : cabe ? '#00804D' : '#C8281C';
                const base = 150 + r * 60;
                return (
                  <tr key={f.code} className="group">
                    <td className="py-[7px] border-t border-[#E7E7E1]">
                      <img src={`/bandeiras/${f.code}.png`} alt="" width={30} height={20} className="w-[30px] h-5 object-cover rounded-[2px] shadow-[0_0_0_1px_rgba(0,0,0,.12)]" />
                    </td>
                    <td className="py-[7px] border-t border-[#E7E7E1]">
                      <Link href={`/destino/${f.slug}`} className="focusring rounded" aria-label={`${f.nome}: ${sit.toLowerCase()}`}>
                        <Placar texto={pad(f.nome.toUpperCase(), 12)} w={19} h={28} atraso={base} passo={16} rotulo={f.nome} />
                      </Link>
                    </td>
                    <td className="py-[7px] border-t border-[#E7E7E1]"><Placar texto={pad(f.faixa, 15)} w={19} h={28} cor="#1C3FD1" atraso={base + 40} passo={16} rotulo={f.faixa} /></td>
                    <td className="py-[7px] border-t border-[#E7E7E1]"><Placar texto={pad(VISTO_PLACAR[f.visto.tipo] || f.visto.tipo.toUpperCase(), 10)} w={19} h={28} atraso={base + 80} passo={16} rotulo={f.visto.curto} /></td>
                    <td className="py-[7px] border-t border-[#E7E7E1]"><Placar texto={pad(String(f.custoDia), 3)} w={19} h={28} atraso={base + 120} passo={16} rotulo={`US$ ${f.custoDia} por dia`} /></td>
                    <td className="py-[7px] border-t border-[#E7E7E1]"><Placar texto={pad(sit, 8)} w={19} h={28} cor={corSit} atraso={base + 160} passo={16} rotulo={sit.toLowerCase()} /></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-sm text-inksoft">EMBARQUE = cabe no orçamento da frase acima · ACIMA = custo em solo passa do orçamento · VISTO = exige visto prévio para brasileiros. Confira o visto na fonte oficial.</p>
      </section>

      {/* FILEIRA DO ÁLBUM */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pt-16 sm:pt-20">
        <div className="flex flex-wrap items-end justify-between gap-5 mb-6">
          <div>
            <span className="ms-rotulo">{bases.length} países · {bons.length} brilhantes em {MESES[mes]}</span>
            <h2 className="ms-titulo text-[40px] sm:text-[60px] text-ink">o álbum do mundo</h2>
          </div>
          <Link href={`/explorar?mes=${mes + 1}`} className="ms-btn ms-btn-tinta">Abrir o álbum</Link>
        </div>
        <div className="flex gap-[22px] overflow-x-auto px-1 pt-2.5 pb-7 snap-x snap-mandatory [mask-image:linear-gradient(90deg,#000_88%,transparent)]">
          {fileira.map((f) => (
            <div key={f.code} className="snap-start flex-none">
              <Figurinha f={f} mes={mes} midia={midia[f.code]} largura={206} altura={298} />
            </div>
          ))}
        </div>
      </section>
    </>
  );
}

/** Vitrine × custo real: mesmo cálculo da calculadora /custo-real (simularCustoReal),
 *  feito no servidor e convertido pelo câmbio de referência informado. */
export function HomeVitrine({ exemplo, cambio }) {
  const brl = (usd) => `R$ ${Math.round(usd * cambio).toLocaleString('pt-BR')}`;
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 pt-16 sm:pt-20">
      <div className="mb-7">
        <span className="ms-rotulo">{exemplo.nome} · {exemplo.dias} dias · {exemplo.pessoas} pessoas · saindo de São Paulo</span>
        <h2 className="ms-titulo text-[40px] sm:text-[60px] text-ink">a vitrine termina na compra</h2>
      </div>
      <div className="grid gap-7 lg:grid-cols-2">
        <div className="rounded-[28px] bg-paper2 p-5 sm:p-8 flex flex-col gap-3.5">
          <span className="ms-rotulo">Preço de vitrine · voo + hotel</span>
          <span className="line-through decoration-[4px] decoration-risco self-start">
            <Placar texto={brl(exemplo.vitrine)} w={40} h={58} cor="#55554F" atraso={200} passo={50} className="max-sm:[&_.ms-placa]:![--w:22px] max-sm:[&_.ms-placa]:![--h:32px]" />
          </span>
          <span className="text-[17px] text-inksoft">O que as agências mostram.</span>
        </div>
        <div className="rounded-[28px] bg-coral p-5 sm:p-8 flex flex-col gap-3.5">
          <span className="ms-rotulo !text-ink">Custo real da viagem</span>
          <Placar texto={brl(exemplo.total)} w={46} h={66} atraso={600} passo={60} className="max-sm:[&_.ms-placa]:![--w:22px] max-sm:[&_.ms-placa]:![--h:32px]" />
          <span className="text-[17px] text-ink">+ comida, seguro, eSIM, passeios e imprevistos, somados item a item: + {brl(exemplo.escondido)} que normalmente aparecem tarde demais.</span>
          <Link href="/custo-real" className="ms-btn ms-btn-tinta self-start mt-1">Calcular o meu</Link>
        </div>
      </div>
      <p className="mt-3 text-sm text-inksoft">Estimativa com referência jun/2026 e câmbio de referência US$ 1 = R$ {cambio.toFixed(2).replace('.', ',')}; a calculadora usa o câmbio do dia.</p>
    </section>
  );
}
