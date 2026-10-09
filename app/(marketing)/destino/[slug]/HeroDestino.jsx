import Link from 'next/link';
import { Placar } from '../../../_ui/Placar.jsx';
import { Azulejo, CORES_AZULEJO } from '../../../_ui/Azulejo.jsx';
import { Icon } from '../../../_ui/Icon.jsx';
import { MESES, M3, pad } from '../../../_lib/figurinhaMes.js';
import { FiguraViva } from './FiguraViva.jsx';

// Topo do destino CALÇADÃO: número da figurinha + bandeira, nome gigante, placar
// (situação no mês, custo, visto, segurança), ações e a "figurinha viva" (vídeo
// curado ou foto HD da Commons, com crédito). Abaixo, os 12 meses em azulejos.
const VISTO_PLACAR = { isento: 'ISENTO', 'e-visa': 'E-VISA', eta: 'ETA', 'on-arrival': 'NA CHEGADA', visto: 'PRÉVIO', consultar: 'CONSULTAR' };

export function HeroDestino({ f, mes, d, coord, capa, video, acoes }) {
  const sit = f.alerta ? 'ALERTA' : f.bom ? 'HORA CERTA' : 'ESPERE';
  const corSit = f.alerta ? '#C8281C' : f.bom ? '#00804D' : '#9A5B00';
  const visto = `${VISTO_PLACAR[f.visto.tipo] || f.visto.tipo.toUpperCase()}${f.visto.dias ? ` ${f.visto.dias}D` : ''}`;
  const nome = d.nome.toLowerCase();
  const tamNome = nome.length > 16 ? 'text-[44px] sm:text-[64px] xl:text-[80px]' : nome.length > 10 ? 'text-[52px] sm:text-[84px] xl:text-[104px]' : 'text-[64px] sm:text-[104px] xl:text-[132px]';
  const linhas = [
    [MESES[mes].toUpperCase(), sit, corSit, `${MESES[mes]}: ${f.alerta ? 'alerta de viagem' : f.bom ? 'hora certa' : 'fora da melhor época'}`],
    ['CUSTO/DIA', `US$ ${f.custoDia}`, '#111111', `custo de referência US$ ${f.custoDia} por dia`],
    ['VISTO BR', visto, f.visto.tipo === 'visto' ? '#9A5B00' : '#111111', `visto para brasileiros: ${f.visto.curto}${f.visto.dias ? `, ${f.visto.dias} dias` : ''}`],
    ['SEGURANÇA', `${f.seguranca}/10`, f.seguranca <= 3 ? '#C8281C' : '#111111', `índice de segurança ${f.seguranca} de 10`],
  ];
  return (
    <>
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 pb-10 grid gap-10 lg:grid-cols-[minmax(0,1.08fr)_minmax(0,1fr)] items-start">
        <div className="min-w-0">
          <nav aria-label="Trilha" className="flex items-center gap-2 text-sm text-inksoft">
            <Link href="/explorar" className="hover:text-ink focusring rounded font-medium">Álbum do mundo</Link>
            <Icon name="chevron" size={14} />
            <span>{d.regiao}</span>
          </nav>
          <div className="mt-5 flex items-center gap-3">
            <span className="px-2.5 py-1 rounded-md bg-ink text-white font-cond font-extrabold text-[15px] tracking-[.06em]">{f.numero}</span>
            <img src={`/bandeiras/${d.code}.png`} alt={`Bandeira de ${d.nome}`} width={48} height={32} className="h-8 w-auto rounded-[3px] shadow-[0_0_0_1px_rgba(0,0,0,.12),0_4px_10px_-4px_rgba(0,0,0,.35)]" />
            <span className="ms-rotulo">{coord}</span>
          </div>
          <h1 className={`ms-titulo mt-3 ${tamNome} leading-[.84] tracking-[-.055em] text-ink break-words`}>{nome}</h1>
          {d.estacao && <p className="mt-5 text-lg text-[#33332F] max-w-xl leading-relaxed">{d.estacao}</p>}

          <div className="mt-6 rounded-[24px] bg-paper2 p-4 sm:p-5 flex flex-col gap-2.5 overflow-x-auto">
            {linhas.map(([rot, val, cor, aria], i) => (
              <div key={rot} className="grid grid-cols-[112px_1fr] sm:grid-cols-[140px_1fr] items-center gap-3">
                <span className="ms-rotulo !text-ink">{rot}</span>
                <Placar texto={pad(val, 13)} w={22} h={32} cor={cor} atraso={i * 140} passo={22} rotulo={aria}
                  className="max-sm:[&_.ms-placa]:![--w:15px] max-sm:[&_.ms-placa]:![--h:24px]" />
              </div>
            ))}
          </div>
          <div className="mt-6 flex flex-wrap items-center gap-3">{acoes}</div>
        </div>

        <FiguraViva capa={capa} video={video} nome={d.nome} code={d.code} />
      </section>

      {/* 12 meses em azulejos: amarelo = época boa; contorno = mês atual */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-10" aria-labelledby="meses-h">
        <div className="flex flex-wrap items-end justify-between gap-3 mb-4">
          <div>
            <span className="ms-rotulo">Melhor época · {f.faixa.toLowerCase()}</span>
            <h2 id="meses-h" className="ms-titulo text-[32px] sm:text-[44px] text-ink">o ano em {d.nome}</h2>
          </div>
          <span className="text-sm text-inksoft">Referência climática jun/2026 · segurança entra na conta da “hora certa”</span>
        </div>
        <ol className="grid grid-cols-6 sm:grid-cols-12 gap-1.5">
          {M3.map((m, i) => {
            const bom = f.meses.includes(i + 1);
            const agora = i === mes;
            return (
              <li key={m} className={`relative rounded-xl overflow-hidden ${agora ? 'ring-[3px] ring-ink ring-offset-2' : ''}`} aria-label={`${MESES[i]}: ${bom ? 'época boa' : 'fora da melhor época'}${agora ? ' (agora)' : ''}`}>
                <Azulejo motivo={i} cor={bom ? CORES_AZULEJO[[1, 0, 2, 3][i % 4]] : '#DADAD3'} fundo={bom ? (i % 3 === 1 ? '#111111' : '#FFFFFF') : '#F3F3F0'} tam={96} rot={(i % 4) * 90} className="w-full h-auto" />
                <span className={`absolute left-1.5 bottom-1.5 px-1.5 py-0.5 rounded-md font-cond font-extrabold text-[13px] tracking-[.06em] ${bom ? 'bg-coral text-ink' : 'bg-white text-inksoft'}`}>{m}</span>
                {agora && <span className="absolute right-1.5 top-1.5 px-1.5 py-0.5 rounded-md bg-ink text-white font-cond font-extrabold text-[11px] tracking-[.08em]">AGORA</span>}
              </li>
            );
          })}
        </ol>
      </section>
    </>
  );
}
