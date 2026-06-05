'use client';
import { useState } from 'react';
import Link from 'next/link';
import { DESTINOS } from '../../_lib/destinos.js';
import { buscarVoos, ORIGENS } from '../../_lib/flights.js';
import { linksVoo, toISO } from '../../_engine/utils.js';
import { useLibera } from '../../_components/Gate.jsx';
import { curvaPreco, vereditoCompra } from '../../_engine/previsaoVoo.js';
import { Autocomplete } from '../../_components/Autocomplete.jsx';

function dataPadrao() {
  const d = new Date();
  d.setDate(d.getDate() + 30);
  return toISO(d);
}

export function VoosClient() {
  const [origem, setOrigem] = useState(ORIGENS[0]);
  const [destino, setDestino] = useState(DESTINOS[0]);
  const [data, setData] = useState(dataPadrao);
  const [busy, setBusy] = useState(false);
  const [res, setRes] = useState(null);
  const [alerta, setAlerta] = useState('');

  const { libera: liberaAlerta } = useLibera('alertas-preco');

  async function buscar() {
    setBusy(true); setRes(null); setAlerta('');
    try {
      const out = await buscarVoos({
        origemCidade: origem.cidade, origemIata: origem.iata, origemCoords: origem.coords,
        destinoCidade: destino.cidadePrincipal || destino.nome, destinoIata: destino.iata, destinoCoords: destino.coords,
        dataISO: data,
      });
      setRes(out);
    } finally {
      setBusy(false);
    }
  }

  function criarAlerta() {
    try {
      const key = 'mundosemfim.alertas.v1';
      const lista = JSON.parse(localStorage.getItem(key) || '[]');
      lista.push({ origem: origem.iata, destino: destino.iata, data });
      localStorage.setItem(key, JSON.stringify(lista));
      setAlerta(`Alerta criado para ${origem.iata} → ${destino.iata}. Te avisamos quando o preço cair.`);
    } catch {
      setAlerta('Não consegui salvar o alerta.');
    }
  }

  const voos = linksVoo({ origemCidade: origem.cidade, origemIata: origem.iata, destinoCidade: destino.cidadePrincipal || destino.nome, destinoIata: destino.iata, dataISO: data });
  const field = 'w-full px-3 py-2 rounded-lg border border-line bg-input text-ink focusring text-sm';

  return (
    <div className="mt-6">
      <div className="rounded-2xl border border-line bg-card p-5 grid sm:grid-cols-4 gap-3 items-end">
        <Autocomplete
          label="Origem" items={ORIGENS} value={origem} onChange={setOrigem}
          toText={(o) => `${o.cidade} (${o.iata})`} toSearch={(o) => `${o.cidade} ${o.iata}`}
          toKey={(o) => o.iata} toRight={(o) => o.iata}
          icon="🛫" placeholder="cidade de partida"
        />
        <Autocomplete
          label="Destino" items={DESTINOS} value={destino} onChange={setDestino}
          toText={(d) => `${d.cidadePrincipal || d.nome} (${d.iata})`}
          toSearch={(d) => `${d.nome} ${d.cidadePrincipal || ''} ${d.regiao} ${d.iata}`}
          toKey={(d) => d.code} toRight={(d) => d.regiao}
          icon="🛬" placeholder="busque um país"
        />
        <label className="text-xs text-inksoft font-medium block">Data
          <input type="date" value={data} onChange={(e) => setData(e.target.value)} className={`${field} mt-1 tnum`} />
        </label>
        <button onClick={buscar} disabled={busy} className="inline-flex items-center justify-center gap-2 rounded-xl bg-pine text-white font-semibold px-4 py-2.5 hover:bg-pinedk disabled:opacity-60 focusring">
          {busy ? 'Buscando…' : '✈ Buscar'}
        </button>
      </div>

      {res && (
        <div className="mt-5">
          <div className="mb-3 rounded-lg border border-ochre/40 bg-ochre/10 text-warn px-3 py-2 text-xs font-medium">
            ⚠ Valores, horários e companhias são <b>ilustrativos</b> (estimativa por distância), não preços reais. Confirme nos links “Reservar de verdade” abaixo.
          </div>
          <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
            <p className="text-sm text-inksoft">
              {origem.iata} → {destino.iata}{res.km ? ` · ${res.km.toLocaleString('pt-BR')} km` : ''} · faixa estimada US$ {res.faixa.min}–{res.faixa.max}
            </p>
            {liberaAlerta ? (
              <button onClick={criarAlerta} className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-line bg-card text-inksoft hover:text-pine focusring">🔔 Criar alerta de preço</button>
            ) : (
              <Link href="/planos" className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-ochre/40 bg-ochre/5 text-ochre focusring">🔒 Alerta de preço (Premium)</Link>
            )}
          </div>
          {alerta && <div className="mb-3 rounded-lg border border-success-bd bg-success-bg text-success px-3 py-2 text-sm">{alerta}</div>}

          <div className="space-y-2">
            {res.resultados.map((f) => (
              <div key={f.id} className={`rounded-xl border bg-card p-4 flex flex-wrap items-center gap-x-4 gap-y-1 ${f.melhorCustoBeneficio ? 'border-pine ring-1 ring-pine/20' : 'border-line'}`}>
                <div className="w-32">
                  <div className="font-semibold text-ink">{f.companhia}</div>
                  {f.melhorCustoBeneficio && <span className="text-[11px] font-bold text-pine">★ Melhor custo-benefício</span>}
                </div>
                <div className="text-sm text-ink tnum">{f.partida} → {f.chegada}</div>
                <div className="text-xs text-inksoft">{f.duracao}</div>
                <div className="text-xs text-inksoft">{f.escalas === 0 ? 'Direto' : `${f.escalas} escala${f.escalas > 1 ? 's' : ''}`}</div>
                <div className="ml-auto font-display text-xl text-ink tnum">US$ {f.preco}</div>
              </div>
            ))}
          </div>

          <PrevisaoVoo rota={`${origem.iata}-${destino.iata}-${data}`} faixa={res.faixa} precoAtual={res.resultados[0] && res.resultados[0].preco} />

          <div className="mt-4 flex flex-wrap gap-2 items-center">
            <span className="text-xs text-inksoft">Reservar de verdade:</span>
            <a href={voos.google} target="_blank" rel="noopener noreferrer" className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-line bg-card text-pine hover:bg-paper2 focusring">Google Flights ↗</a>
            {voos.skyscanner && <a href={voos.skyscanner} target="_blank" rel="noopener noreferrer" className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-line bg-card text-pine hover:bg-paper2 focusring">Skyscanner ↗</a>}
            {voos.kayak && <a href={voos.kayak} target="_blank" rel="noopener noreferrer" className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-line bg-card text-pine hover:bg-paper2 focusring">Kayak ↗</a>}
          </div>

          <p className="mt-3 text-xs text-inksoft">
            Preços e horários são estimativas por distância — confira o valor real nos links acima.
            Em breve, com preços em tempo real.
          </p>
        </div>
      )}
    </div>
  );
}

const VEREDITO_UI = {
  comprar: { label: 'Compre agora', cls: 'bg-success-bg text-success border-success-bd', icon: '✅' },
  esperar: { label: 'Vale esperar', cls: 'bg-warn-bg text-warn border-warn-bd', icon: '⏳' },
  estavel: { label: 'Preço estável', cls: 'bg-card text-inksoft border-line', icon: '➡️' },
};

// Veredito "comprar/esperar" + mini-gráfico da curva de 30 dias (anti-Hopper).
function PrevisaoVoo({ rota, faixa, precoAtual }) {
  const curva = curvaPreco(rota, faixa, 30);
  const veredito = vereditoCompra(curva, precoAtual);
  if (!veredito) return null;
  const ui = VEREDITO_UI[veredito.acao] || VEREDITO_UI.estavel;
  const maxP = Math.max(...curva.map((p) => p.preco));
  const minP = Math.min(...curva.map((p) => p.preco));
  return (
    <div className="mt-4 rounded-2xl border border-line bg-card p-4">
      <div className="flex flex-wrap items-center gap-2">
        <span className={`inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full border ${ui.cls}`}>{ui.icon} {ui.label}</span>
        <span className="text-sm text-ink">{veredito.texto}</span>
        {veredito.acao === 'esperar' && veredito.economia > 0 && (
          <span className="text-xs font-semibold text-pine">economia ~US$ {veredito.economia}</span>
        )}
      </div>
      <div className="mt-3 flex items-end gap-0.5 h-16" aria-hidden>
        {curva.map((p) => {
          const h = maxP > minP ? 15 + ((p.preco - minP) / (maxP - minP)) * 85 : 50;
          const ehMin = p.dia === veredito.melhorDia;
          return <div key={p.dia} title={`Dia ${p.dia + 1}: US$ ${p.preco}`} className={`flex-1 rounded-t ${ehMin ? 'bg-pine' : 'bg-pine/25'}`} style={{ height: `${h}%` }} />;
        })}
      </div>
      <p className="mt-1.5 text-[11px] text-inksoft">
        Previsão sobre a faixa estimada, determinística por rota. A barra escura é o dia mais barato previsto. (Em breve, sobre preços em tempo real.)
      </p>
    </div>
  );
}
