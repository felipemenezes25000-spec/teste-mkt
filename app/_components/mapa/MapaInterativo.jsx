'use client';
import { useEffect, useRef, useState } from 'react';
import 'maplibre-gl/dist/maplibre-gl.css';
import { Icon } from '../../_ui/Icon.jsx';

// Mapa interativo MERIDIANO (OMEGA V4 §15/§21/§29): MapLibre GL + tiles OpenFreeMap
// (base OpenStreetMap, sem chave; atribuição automática e obrigatória). Carregado
// sob demanda (dynamic import) para não pesar nas outras páginas.
// - pontos: [{ id, nome, lng, lat, cor, rotulo }] — clique seleciona (onSelecionar)
// - linhas: [{ id, coords: [[lng,lat],…], estimada?: boolean }] — trajetos
// - Tema claro/escuro acompanha data-theme do <html>.
// - Sem WebGL / tiles fora do ar → aviso honesto; a lista ao lado continua sendo a
//   alternativa textual completa.
const ESTILO = {
  light: 'https://tiles.openfreemap.org/styles/positron',
  dark: 'https://tiles.openfreemap.org/styles/dark',
};
const temaAtual = () => (typeof document !== 'undefined' && document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light');

function geojsonPontos(pontos) {
  return {
    type: 'FeatureCollection',
    features: (pontos || []).filter((p) => Number.isFinite(p.lng) && Number.isFinite(p.lat)).map((p) => ({
      type: 'Feature', id: undefined,
      properties: { id: String(p.id), nome: p.nome, cor: p.cor || '#2742F5', rotulo: p.rotulo || '' },
      geometry: { type: 'Point', coordinates: [p.lng, p.lat] },
    })),
  };
}
function geojsonLinhas(linhas) {
  return {
    type: 'FeatureCollection',
    features: (linhas || []).filter((l) => (l.coords || []).length > 1).map((l) => ({
      type: 'Feature', properties: { id: String(l.id), estimada: !!l.estimada },
      geometry: { type: 'LineString', coordinates: l.coords },
    })),
  };
}

export function MapaInterativo({
  pontos = [], linhas = [], selecionado = null, destacado = null, onSelecionar,
  centro = [10, 20], zoom = 1.3, enquadrar = true, className = 'h-[480px]', rotulo = 'Mapa interativo',
  rotulosVisiveis = true, cluster = false, zoomMaximo = 8,
}) {
  const box = useRef(null);
  const mapa = useRef(null);
  const lib = useRef(null);
  const dados = useRef({ pontos, linhas, selecionado, destacado });
  const [estado, setEstado] = useState('carregando'); // carregando | pronto | erro
  const cb = useRef(onSelecionar);
  cb.current = onSelecionar;
  dados.current = { pontos, linhas, selecionado, destacado };

  // monta camadas (também após troca de estilo)
  function montarCamadas(m) {
    const { pontos: P, linhas: L } = dados.current;
    if (!m.getSource('msf-linhas')) m.addSource('msf-linhas', { type: 'geojson', data: geojsonLinhas(L) });
    if (!m.getSource('msf-pontos')) m.addSource('msf-pontos', { type: 'geojson', data: geojsonPontos(P), promoteId: 'id', ...(cluster ? { cluster: true, clusterRadius: 28, clusterMaxZoom: 3 } : {}) });
    const ink = temaAtual() === 'dark' ? '#070B14' : '#FFFFFF';
    if (!m.getLayer('msf-linhas')) {
      m.addLayer({ id: 'msf-linhas', type: 'line', source: 'msf-linhas', layout: { 'line-cap': 'round', 'line-join': 'round' },
        paint: { 'line-color': temaAtual() === 'dark' ? '#7D8FFF' : '#2742F5', 'line-width': 3, 'line-dasharray': ['case', ['get', 'estimada'], ['literal', [1.5, 1.5]], ['literal', [1, 0]]] } });
    }
    if (cluster && !m.getLayer('msf-cluster')) {
      m.addLayer({ id: 'msf-cluster', type: 'circle', source: 'msf-pontos', filter: ['has', 'point_count'],
        paint: { 'circle-color': temaAtual() === 'dark' ? '#7D8FFF' : '#2742F5', 'circle-radius': ['step', ['get', 'point_count'], 13, 10, 17, 30, 22], 'circle-stroke-width': 2, 'circle-stroke-color': ink } });
      m.addLayer({ id: 'msf-cluster-n', type: 'symbol', source: 'msf-pontos', filter: ['has', 'point_count'],
        layout: { 'text-field': ['get', 'point_count_abbreviated'], 'text-size': 11, 'text-font': ['Noto Sans Bold'] },
        paint: { 'text-color': temaAtual() === 'dark' ? '#070B14' : '#FFFFFF' } });
    }
    if (!m.getLayer('msf-pontos')) {
      m.addLayer({ id: 'msf-pontos', type: 'circle', source: 'msf-pontos', filter: ['!', ['has', 'point_count']],
        paint: {
          'circle-color': ['get', 'cor'],
          'circle-radius': ['interpolate', ['linear'], ['zoom'], 1, ['case', ['boolean', ['feature-state', 'sel'], false], 9, ['boolean', ['feature-state', 'hover'], false], 8, 5.5], 6, ['case', ['boolean', ['feature-state', 'sel'], false], 13, 9]],
          'circle-stroke-width': ['case', ['boolean', ['feature-state', 'sel'], false], 3.5, ['boolean', ['feature-state', 'hover'], false], 2.5, 1.5],
          'circle-stroke-color': ['case', ['boolean', ['feature-state', 'sel'], false], '#C8FA3C', ink],
        } });
    }
    if (rotulosVisiveis && !m.getLayer('msf-rotulos')) {
      m.addLayer({ id: 'msf-rotulos', type: 'symbol', source: 'msf-pontos', filter: ['!', ['has', 'point_count']], minzoom: 2.6,
        layout: { 'text-field': ['get', 'nome'], 'text-size': 12, 'text-offset': [0, 1.15], 'text-anchor': 'top', 'text-font': ['Noto Sans Regular'], 'text-optional': true },
        paint: { 'text-color': temaAtual() === 'dark' ? '#EAF0FA' : '#0A1020', 'text-halo-color': ink, 'text-halo-width': 1.4 } });
    }
    aplicarEstados(m);
  }

  function aplicarEstados(m) {
    if (!m.getSource('msf-pontos')) return;
    const { pontos: P, selecionado: S, destacado: D } = dados.current;
    for (const p of P) {
      try { m.setFeatureState({ source: 'msf-pontos', id: String(p.id) }, { sel: String(p.id) === String(S), hover: String(p.id) === String(D) }); } catch { /* feature ainda não indexada */ }
    }
  }

  // inicializa uma vez
  useEffect(() => {
    let vivo = true;
    let obs;
    let ro;
    (async () => {
      try {
        const maplibregl = (await import('maplibre-gl')).default;
        if (!vivo || !box.current) return;
        lib.current = maplibregl;
        const m = new maplibregl.Map({
          container: box.current, style: ESTILO[temaAtual()], center: centro, zoom,
          attributionControl: { compact: true }, cooperativeGestures: false, dragRotate: false, pitchWithRotate: false,
        });
        mapa.current = m;
        m.addControl(new maplibregl.NavigationControl({ showCompass: false }), 'top-right');
        m.on('error', (e) => { if (/style|tiles|Failed to fetch/i.test(String(e && e.error && e.error.message))) setEstado((s) => (s === 'pronto' ? s : 'erro')); });
        m.on('style.load', () => { montarCamadas(m); setEstado('pronto'); });
        m.on('click', 'msf-pontos', (e) => { const f = e.features && e.features[0]; if (f && cb.current) cb.current(f.properties.id); });
        m.on('click', 'msf-cluster', (e) => {
          const f = e.features && e.features[0];
          if (!f) return;
          m.getSource('msf-pontos').getClusterExpansionZoom(f.properties.cluster_id).then((z) => m.easeTo({ center: f.geometry.coordinates, zoom: z + 0.3 })).catch(() => {});
        });
        for (const l of ['msf-pontos', 'msf-cluster']) {
          m.on('mouseenter', l, () => { m.getCanvas().style.cursor = 'pointer'; });
          m.on('mouseleave', l, () => { m.getCanvas().style.cursor = ''; });
        }
        // tema
        obs = new MutationObserver(() => { const t = temaAtual(); m.setStyle(ESTILO[t]); });
        obs.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
        // o container pode mudar de tamanho depois do init (layout, aba mobile, sidebar)
        ro = new ResizeObserver(() => { try { m.resize(); } catch { /* removido */ } });
        ro.observe(box.current);
      } catch {
        if (vivo) setEstado('erro');
      }
    })();
    return () => { vivo = false; if (obs) obs.disconnect(); if (ro) ro.disconnect(); if (mapa.current) { mapa.current.remove(); mapa.current = null; } };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // dados mudaram
  useEffect(() => {
    const m = mapa.current;
    if (!m || estado !== 'pronto') return;
    const sp = m.getSource('msf-pontos');
    if (sp) sp.setData(geojsonPontos(pontos));
    const sl = m.getSource('msf-linhas');
    if (sl) sl.setData(geojsonLinhas(linhas));
    if (enquadrar && pontos.length && lib.current) {
      const b = new lib.current.LngLatBounds();
      for (const p of pontos) if (Number.isFinite(p.lng) && Number.isFinite(p.lat)) b.extend([p.lng, p.lat]);
      for (const l of linhas) for (const c of l.coords || []) b.extend(c);
      if (!b.isEmpty()) m.fitBounds(b, { padding: 56, maxZoom: pontos.length === 1 ? Math.min(zoomMaximo, 13) : zoomMaximo, duration: 600 });
    }
    m.once('idle', () => aplicarEstados(m));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pontos, linhas, estado]);

  // seleção/hover
  useEffect(() => {
    const m = mapa.current;
    if (!m || estado !== 'pronto') return;
    aplicarEstados(m);
    if (selecionado != null) {
      const p = pontos.find((x) => String(x.id) === String(selecionado));
      if (p) m.easeTo({ center: [p.lng, p.lat], zoom: Math.max(m.getZoom(), 3.2), duration: 500 });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selecionado, destacado, estado]);

  return (
    <div className={`relative rounded-2xl overflow-hidden border border-line bg-paper2 ${className}`}>
      {/* inline: o CSS do MapLibre força position:relative em .maplibregl-map */}
      <div ref={box} style={{ position: 'absolute', inset: 0 }} role="region" aria-label={rotulo} />
      {estado === 'carregando' && (
        <div className="absolute inset-0 grid place-items-center pointer-events-none">
          <span className="eyebrow flex items-center gap-2"><span className="signal-dot" />Carregando mapa…</span>
        </div>
      )}
      {estado === 'erro' && (
        <div className="absolute inset-0 grid place-items-center p-6 text-center bg-paper2">
          <div className="max-w-xs">
            <Icon name="map" size={26} className="text-inksoft" />
            <p className="mt-2 text-sm font-semibold text-ink">Mapa indisponível agora</p>
            <p className="mt-1 text-xs text-inksoft">O provedor de mapas não respondeu ou seu navegador não suporta WebGL. A lista ao lado tem todas as informações.</p>
          </div>
        </div>
      )}
    </div>
  );
}
