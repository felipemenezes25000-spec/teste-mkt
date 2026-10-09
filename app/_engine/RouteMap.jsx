'use client';
import dynamic from 'next/dynamic';
import { fmtData } from './utils.js';
import { Icon } from '../_ui/Icon.jsx';

// Mapa da rota multi-país (planner): MapaInterativo com os países na ORDEM da viagem
// ligados por linha tracejada (ligação aérea/terrestre aproximada, não trajeto real).
// Lista numerada ao lado = alternativa textual. Clique → vai ao trecho.
const MapaInterativo = dynamic(() => import('../_components/mapa/MapaInterativo.jsx').then((m) => m.MapaInterativo), {
  ssr: false, loading: () => <div className="h-[420px] rounded-2xl border border-line bg-paper2" />,
});

export default function RouteMap({ trechos, onSelect }) {
  const pts = trechos.filter((t) => Array.isArray(t.coords));
  if (pts.length === 0) return null;
  const semCoord = trechos.filter((t) => !Array.isArray(t.coords));
  const pontos = pts.map((t, i) => ({ id: t.id, nome: `${i + 1}. ${t.nome}`, lng: t.coords[0], lat: t.coords[1], cor: '#2742F5' }));
  const linhas = pts.length > 1 ? [{ id: 'rota', coords: pts.map((t) => t.coords), estimada: true }] : [];
  return (
    <section className="rise rounded-2xl border border-line bg-card overflow-hidden" aria-label="Mapa da rota">
      <div className="px-5 pt-4 pb-2 flex items-center justify-between gap-2">
        <h2 className="font-display text-xl text-ink flex items-center gap-2"><Icon name="map" size={18} className="text-pine" /> Rota no mapa</h2>
        <span className="text-xs text-inksoft">clique num ponto para ir ao trecho</span>
      </div>
      <div className="px-3 pb-3 grid gap-3 lg:grid-cols-[minmax(0,1fr)_260px]">
        <MapaInterativo pontos={pontos} linhas={linhas} onSelecionar={onSelect} className="h-[380px] lg:h-[460px]" rotulo="Mapa da rota com os países na ordem da viagem" zoomMaximo={5} />
        <ol className="rounded-xl border border-line divide-y divide-line max-h-[460px] overflow-y-auto">
          {pts.map((t, i) => (
            <li key={t.id}>
              <button type="button" onClick={() => onSelect && onSelect(t.id)} className="w-full text-left px-3 py-2.5 flex items-center gap-3 hover:bg-paper2 focusring">
                <span className="w-6 h-6 rounded-md bg-pine text-onpine grid place-items-center font-mono text-[11px] shrink-0">{i + 1}</span>
                <span className="min-w-0">
                  <span className="block text-sm font-medium text-ink truncate">{t.nome}</span>
                  <span className="block font-mono text-[11px] text-inksoft">{t.chegada ? fmtData(t.chegada) : ''} · {t.dias}d</span>
                </span>
              </button>
            </li>
          ))}
        </ol>
      </div>
      <p className="px-5 pb-4 text-[11px] text-inksoft">Linhas tracejadas ligam os países na ordem da viagem — não são o trajeto real do voo ou da estrada.{semCoord.length ? ` ${semCoord.length} trecho(s) sem coordenada não aparecem no mapa.` : ''}</p>
    </section>
  );
}
