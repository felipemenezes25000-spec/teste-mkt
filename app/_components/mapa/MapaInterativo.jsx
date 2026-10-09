'use client';
import { useEffect, useRef, useState } from 'react';
import { Icon } from '../../_ui/Icon.jsx';
import { useIdioma } from '../../_lib/i18n.js';
import { estiloMeridiano } from './paletaMapa.js';
import { ex, ey, enquadrarPrevia } from './previa.js';

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
// Tema sempre claro (Calçadão): o mapa usa só o estilo claro.
const temaAtual = () => 'light';

function geojsonPontos(pontos) {
  return {
    type: 'FeatureCollection',
    features: (pontos || []).filter((p) => Number.isFinite(p.lng) && Number.isFinite(p.lat)).map((p) => ({
      type: 'Feature', id: undefined,
      properties: { id: String(p.id), nome: p.nome, cor: p.cor || '#1C3FD1', rotulo: p.rotulo || '' },
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
  rotulosVisiveis = true, cluster = false, zoomMaximo = 8, ativacao = 'interacao',
}) {
  const box = useRef(null);
  const mapa = useRef(null);
  const lib = useRef(null);
  const dados = useRef({ pontos, linhas, selecionado, destacado });
  const [estado, setEstado] = useState('carregando'); // carregando | pronto | erro
  // V5 F10/EXP-10: o MapLibre (≈1 MB) só carrega quando o mapa é usado. Até lá, uma
  // prévia leve em SVG com os MESMOS pontos (projeção Web Mercator). 'idle' = carrega
  // sozinho quando o navegador fica ocioso (telas em que o mapa é o conteúdo principal).
  const [ativo, setAtivo] = useState(ativacao === 'idle');
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
        paint: { 'line-color': temaAtual() === 'dark' ? '#7D8FFF' : '#1C3FD1', 'line-width': 3, 'line-dasharray': ['case', ['get', 'estimada'], ['literal', [1.5, 1.5]], ['literal', [1, 0]]] } });
    }
    if (cluster && !m.getLayer('msf-cluster')) {
      m.addLayer({ id: 'msf-cluster', type: 'circle', source: 'msf-pontos', filter: ['has', 'point_count'],
        paint: { 'circle-color': temaAtual() === 'dark' ? '#7D8FFF' : '#1C3FD1', 'circle-radius': ['step', ['get', 'point_count'], 13, 10, 17, 30, 22], 'circle-stroke-width': 2, 'circle-stroke-color': ink } });
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
        paint: { 'text-color': temaAtual() === 'dark' ? '#EAF0FA' : '#111111', 'text-halo-color': ink, 'text-halo-width': 1.4 } });
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

  // seleção vinda da lista também ativa o mapa (sincronização lista → mapa)
  useEffect(() => { if (selecionado != null && selecionado !== '' && !ativo) setAtivo(true); }, [selecionado]); // eslint-disable-line react-hooks/exhaustive-deps, react-hooks/set-state-in-effect

  // inicializa uma vez (quando ativado)
  useEffect(() => {
    if (!ativo) return undefined;
    let vivo = true;
    let obs;
    let ro;
    (async () => {
      try {
        // espera o navegador ficar ocioso: o mapa (≈1 MB) não compete com a 1ª pintura
        if (ativacao === 'idle') await new Promise((r) => ('requestIdleCallback' in window ? window.requestIdleCallback(r, { timeout: 2000 }) : setTimeout(r, 300)));
        // CSS e JS do MapLibre só descem quando o usuário ativa o mapa (nada antes da interação)
        const [maplibregl, estiloInicial] = await Promise.all([
          Promise.all([import('maplibre-gl'), import('maplibre-gl/dist/maplibre-gl.css')]).then(([m]) => m.default),
          estiloMeridiano(ESTILO[temaAtual()], temaAtual()),
        ]);
        if (!vivo || !box.current) return;
        lib.current = maplibregl;
        const m = new maplibregl.Map({
          container: box.current, style: estiloInicial, center: centro, zoom,
          attributionControl: { compact: true }, cooperativeGestures: false, dragRotate: false, pitchWithRotate: false,
        });
        mapa.current = m;
        m.addControl(new maplibregl.NavigationControl({ showCompass: false }), 'top-right');
        m.on('error', (e) => { if (/style|tiles|Failed to fetch/i.test(String(e && e.error && e.error.message))) setEstado((s) => (s === 'pronto' ? s : 'erro')); });
        m.on('style.load', () => { montarCamadas(m); setEstado('pronto'); });
        // alguns estilos citam ícones ausentes do sprite (ex.: circle-11): imagem vazia evita ruído
        m.on('styleimagemissing', (e) => { if (!m.hasImage(e.id)) m.addImage(e.id, { width: 1, height: 1, data: new Uint8Array(4) }); });
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
        obs = new MutationObserver(() => { const t = temaAtual(); estiloMeridiano(ESTILO[t], t).then((e) => { if (mapa.current) m.setStyle(e); }); });
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
  }, [ativo]);

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
      {!ativo && <PreviaMapa pontos={pontos} linhas={linhas} selecionado={selecionado} rotulo={rotulo} onAtivar={() => setAtivo(true)} />}
      {ativo && estado === 'carregando' && (
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

// ---------- prévia leve (sem WebGL, sem tiles) ----------
// Projeção equirretangular (x = lng + 180, y = 90 − lat), a mesma do contorno de
// terra Natural Earth 110m (domínio público) usado no planejador.
function PreviaMapa({ pontos, linhas, selecionado, rotulo, onAtivar }) {
  const { t } = useIdioma();
  const [terra, setTerra] = useState('');
  useEffect(() => {
    let vivo = true;
    import('../../_engine/worldGeo.js').then((m) => { if (vivo) setTerra(m.WORLD_LAND_PATH); }).catch(() => {});
    return () => { vivo = false; };
  }, []);
  const q = enquadrarPrevia(pontos);
  const r = Math.max(q.w, q.h) / 150;
  const grade = [];
  for (let lng = -180; lng <= 180; lng += 30) grade.push(<line key={`v${lng}`} x1={ex(lng)} x2={ex(lng)} y1={0} y2={180} />);
  for (let lat = -60; lat <= 60; lat += 30) grade.push(<line key={`h${lat}`} x1={0} x2={360} y1={ey(lat)} y2={ey(lat)} />);
  return (
    <div className="absolute inset-0 bg-paper2" onPointerEnter={(e) => { if (e.pointerType === 'mouse') onAtivar(); }}>
      <svg viewBox={`${q.x0} ${q.y0} ${q.w} ${q.h}`} preserveAspectRatio="xMidYMid meet" className="absolute inset-0 w-full h-full" role="img" aria-label={rotulo}>
        <g stroke="rgb(var(--c-line))" strokeWidth={r / 5}>{grade}</g>
        {terra && <path d={terra} fill="rgb(var(--c-ink) / .08)" fillRule="evenodd" stroke="rgb(var(--c-ink) / .18)" strokeWidth={r / 6} />}
        {(linhas || []).filter((l) => (l.coords || []).length > 1).map((l) => (
          <polyline key={l.id} points={l.coords.map(([a, b]) => `${ex(a)},${ey(b)}`).join(' ')} fill="none" stroke="rgb(var(--c-pine))" strokeWidth={r / 2} strokeDasharray={l.estimada ? `${r} ${r}` : undefined} />
        ))}
        {(pontos || []).filter((p) => Number.isFinite(p.lng)).map((p) => {
          const sel = String(p.id) === String(selecionado);
          return <circle key={p.id} cx={ex(p.lng)} cy={ey(p.lat)} r={sel ? r * 1.8 : r} fill={p.cor || 'rgb(var(--c-pine))'} stroke="rgb(var(--c-card))" strokeWidth={r / 3} />;
        })}
      </svg>
      <button type="button" onClick={onAtivar} className="absolute left-1/2 bottom-4 -translate-x-1/2 inline-flex items-center gap-2 h-11 px-4 rounded-full bg-card/95 border border-line shadow-e2 text-sm font-semibold text-ink whitespace-nowrap focusring">
        <Icon name="map" size={16} /> {t('exp.abrirMapa')}
      </button>
    </div>
  );
}
