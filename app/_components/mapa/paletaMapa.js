// Identidade cartográfica (V5 F3; paleta clara CALÇADÃO) sobre os estilos vetoriais do
// OpenFreeMap: só recolore camadas (fundo, água, terra, vias, rótulos, limites).
// Tiles, fontes, sprites e a atribuição OpenStreetMap continuam os originais.
export const PALETA = {
  light: {
    fundo: '#F3F3F0', agua: '#D3E0F6', aguaLinha: '#B7CAEE', verde: '#E1EDDD', urbano: '#ECECE7', predio: '#E3E3DD',
    gelo: '#FFFFFF', via: '#FFFFFF', viaBorda: '#DADAD3', viaPrincipal: '#FFEFB8', texto: '#55554F', textoAgua: '#3550C4', halo: '#F3F3F0', limite: '#8E8E86',
  },
  dark: {
    fundo: '#070B14', agua: '#0D1A35', aguaLinha: '#16264A', verde: '#0B1620', urbano: '#0D1421', predio: '#111A2A',
    gelo: '#1A2336', via: '#1A2540', viaBorda: '#0A101D', viaPrincipal: '#22304F', texto: '#98A3B8', textoAgua: '#7D8FFF', halo: '#070B14', limite: '#3A4A6B',
  },
};

const tem = (id, ...p) => p.some((x) => id.includes(x));

/** Recolore um estilo MapLibre (objeto JSON) com a paleta do tema. Puro. */
export function aplicarPaleta(estilo, tema = 'light') {
  const c = PALETA[tema] || PALETA.light;
  const layers = (estilo.layers || []).map((l) => {
    const id = l.id || '';
    const paint = { ...(l.paint || {}) };
    if (l.type === 'background') paint['background-color'] = c.fundo;
    else if (l.type === 'fill') {
      if (tem(id, 'water')) paint['fill-color'] = c.agua;
      else if (tem(id, 'park', 'wood', 'grass')) paint['fill-color'] = c.verde;
      else if (tem(id, 'ice', 'glacier')) paint['fill-color'] = c.gelo;
      else if (tem(id, 'building')) paint['fill-color'] = c.predio;
      else if (tem(id, 'residential', 'landuse', 'aeroway', 'pier', 'road_area')) paint['fill-color'] = c.urbano;
    } else if (l.type === 'line') {
      if (tem(id, 'waterway')) paint['line-color'] = c.aguaLinha;
      else if (tem(id, 'boundary', 'admin')) paint['line-color'] = c.limite;
      else if (tem(id, 'casing')) paint['line-color'] = c.viaBorda;
      else if (tem(id, 'motorway', 'major', 'trunk', 'primary')) paint['line-color'] = c.viaPrincipal;
      else if (tem(id, 'highway', 'road', 'path', 'minor', 'aeroway', 'rail', 'tunnel', 'bridge')) paint['line-color'] = c.via;
    } else if (l.type === 'symbol' && l.layout && l.layout['text-field'] !== undefined) {
      paint['text-color'] = tem(id, 'water') ? c.textoAgua : c.texto;
      paint['text-halo-color'] = c.halo;
    }
    return { ...l, paint };
  });
  return { ...estilo, layers };
}

const cache = {};
/** Baixa o estilo base uma vez e devolve a versão MERIDIANO (ou a URL, se falhar). */
export async function estiloMeridiano(url, tema) {
  try {
    if (!cache[url]) cache[url] = fetch(url).then((r) => { if (!r.ok) throw new Error(String(r.status)); return r.json(); });
    return aplicarPaleta(await cache[url], tema);
  } catch {
    delete cache[url];
    return url; // estilo original: o mapa continua funcionando
  }
}
