'use client';
import { useMemo, useState } from 'react';
import dynamic from 'next/dynamic';
import { Icon } from '../../_ui/Icon.jsx';

// Mapa do destino: atrações (meridiano) e cidades (âmbar) com coordenadas
// verificadas (Wikipedia/Wikidata). Lista ao lado = alternativa textual; clique
// em qualquer um seleciona nos dois. Link "Como chegar" abre o Google Maps
// (navegação externa, sem misturar dados de provedores no nosso mapa).
const MapaInterativo = dynamic(() => import('./MapaInterativo.jsx').then((m) => m.MapaInterativo), {
  ssr: false,
  loading: () => <div className="h-[420px] rounded-2xl border border-line bg-paper2 grid place-items-center"><span className="eyebrow">Carregando mapa…</span></div>,
});

export function MapaPais({ nome, atracoes = [], cidades = [], cobertura = 0, centro }) {
  const [sel, setSel] = useState(null);
  const [filtro, setFiltro] = useState('todos');
  const pontos = useMemo(() => [
    ...(filtro !== 'cidades' ? atracoes.map((p) => ({ ...p, cor: '#2742F5' })) : []),
    ...(filtro !== 'atracoes' ? cidades.map((p) => ({ ...p, cor: '#E59A00' })) : []),
  ], [atracoes, cidades, filtro]);
  const atual = pontos.find((p) => p.id === sel);

  if (!atracoes.length && !cidades.length) {
    return (
      <div className="rounded-2xl border border-line bg-card p-6 text-sm text-inksoft">
        Ainda não temos coordenadas verificadas para os lugares de {nome}. Preferimos não mostrar pinos aproximados.
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-3 mb-4">
        <div>
          <div className="eyebrow mb-2">Atlas</div>
          <h2 className="font-display text-[1.75rem] leading-tight text-ink">Onde fica cada lugar</h2>
        </div>
        <div className="inline-flex rounded-lg border border-line p-0.5 bg-paper2" role="radiogroup" aria-label="Mostrar no mapa">
          {[['todos', 'Tudo'], ['atracoes', `Atrações (${atracoes.length})`], ['cidades', `Cidades (${cidades.length})`]].map(([id, label]) => (
            <button key={id} type="button" role="radio" aria-checked={filtro === id} onClick={() => setFiltro(id)}
              className={`h-8 px-3 rounded-md text-sm font-medium focusring ${filtro === id ? 'bg-card text-ink shadow-e1' : 'text-inksoft hover:text-ink'}`}>{label}</button>
          ))}
        </div>
      </div>
      <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_280px]">
        <div className="relative">
          <MapaInterativo pontos={pontos} selecionado={sel} onSelecionar={setSel} className="h-[420px] lg:h-[480px]" rotulo={`Mapa de ${nome} com ${pontos.length} lugares`} centro={centro} zoom={4} zoomMaximo={9} />
          {atual && (
            <div className="absolute left-3 top-3 right-14 sm:right-auto sm:w-72 rounded-xl border border-line bg-card shadow-e2 p-4 rise">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <div className="eyebrow">{atual.tipo === 'cidade' ? 'Cidade' : 'Atração'}{atual.sub ? ` · ${atual.sub}` : ''}</div>
                  <div className="mt-1 font-display text-lg text-ink leading-tight">{atual.nome}</div>
                  <div className="mt-1 coord text-inksoft">{atual.lat.toFixed(4)}°, {atual.lng.toFixed(4)}°</div>
                </div>
                <button type="button" onClick={() => setSel(null)} aria-label="Fechar" className="w-8 h-8 grid place-items-center rounded-md text-inksoft hover:text-ink focusring"><Icon name="x" size={16} /></button>
              </div>
              <a href={`https://www.google.com/maps/search/?api=1&query=${atual.lat},${atual.lng}`} target="_blank" rel="noopener noreferrer"
                className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-pine hover:underline focusring">Como chegar (Google Maps) <Icon name="external" size={13} /></a>
            </div>
          )}
        </div>
        <ul className="max-h-[480px] overflow-y-auto rounded-2xl border border-line bg-card divide-y divide-line" aria-label={`Lugares de ${nome}`}>
          {pontos.map((p) => (
            <li key={p.id}>
              <button type="button" onClick={() => setSel(p.id)} aria-pressed={sel === p.id}
                className={`w-full text-left px-3.5 py-2.5 flex items-center gap-2.5 focusring ${sel === p.id ? 'bg-pine/10' : 'hover:bg-paper2'}`}>
                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: p.cor }} aria-hidden />
                <span className="min-w-0">
                  <span className="block text-sm font-medium text-ink truncate">{p.nome}</span>
                  {p.sub && <span className="block text-[11px] text-inksoft truncate">{p.sub}</span>}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>
      <p className="mt-2 text-xs text-inksoft">
        Coordenadas de Wikipedia/Wikidata ({cobertura}% dos lugares deste destino verificados). O ponto é a referência do lugar,
        não necessariamente a entrada — confirme o acesso antes de ir. Mapa © OpenStreetMap via OpenFreeMap.
      </p>
    </div>
  );
}
