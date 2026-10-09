// Marca MERIDIANO para imagens geradas (next/og / satori): ícone do PWA e cards
// sociais. Desenhada com divs (sem fonte/glifo) → nunca vira "tofu".
export const BRAND = {
  INK: '#0A1020', PAPER: '#F3F5F8', CARD: '#FFFFFF', INKSOFT: '#4B5567', LINE: '#D9DFE8',
  MERIDIANO: '#2742F5', LIMA: '#C8FA3C', AMBAR: '#FFB224', INFRA: '#D12C1F', NOITE: '#070B14', GELO: '#EAF0FA',
};

// Globo (círculo + meridiano) com o ponto LIMA da "próxima parada".
export function MarcaOg({ size = 78, fundo = BRAND.INK, raio }) {
  const g = Math.round(size * 0.54);
  const t = Math.max(2, Math.round(size * 0.05));
  const dot = Math.round(size * 0.22);
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: size, height: size, borderRadius: raio ?? Math.round(size * 0.22), background: fundo, position: 'relative' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: g, height: g, borderRadius: 999, border: `${t}px solid ${BRAND.GELO}`, marginTop: Math.round(size * 0.04), marginLeft: -Math.round(size * 0.03) }}>
        <div style={{ width: Math.round(g * 0.42), height: g, borderRadius: 999, border: `${t}px solid ${BRAND.GELO}` }} />
      </div>
      <div style={{ position: 'absolute', top: Math.round(size * 0.18), right: Math.round(size * 0.18), width: dot, height: dot, borderRadius: 999, background: BRAND.LIMA, border: `${t}px solid ${fundo}` }} />
    </div>
  );
}

// Fontes para satori (TTF via Google Fonts; UA antigo força TTF). Cache por
// instância; falha → null e o ImageResponse usa a fonte padrão.
let _fontes;
async function ttf(familia, peso) {
  const css = await fetch(`https://fonts.googleapis.com/css2?family=${familia}:wght@${peso}`, {
    headers: { 'User-Agent': 'Mozilla/4.0 (compatible; MSIE 6.0)' },
    signal: AbortSignal.timeout(6000),
  }).then((r) => r.text());
  const url = (css.match(/url\((https:[^)]+\.ttf)\)/) || [])[1];
  if (!url) throw new Error('sem ttf');
  return fetch(url, { signal: AbortSignal.timeout(6000) }).then((r) => r.arrayBuffer());
}
export function fontesOg() {
  if (!_fontes) {
    _fontes = Promise.all([ttf('Bricolage+Grotesque', 800), ttf('Geist+Mono', 500)])
      .then(([d, m]) => [
        { name: 'Display', data: d, weight: 800, style: 'normal' },
        { name: 'Mono', data: m, weight: 500, style: 'normal' },
      ])
      .catch(() => null);
  }
  return _fontes;
}

/** Coordenada legível: [lng, lat] → "35.68° N · 139.69° E" */
export function coordTexto(coords) {
  if (!Array.isArray(coords) || coords.length < 2) return '';
  const [lng, lat] = coords;
  const f = (v, p, n) => `${Math.abs(v).toFixed(2)}° ${v >= 0 ? p : n}`;
  return `${f(lat, 'N', 'S')} · ${f(lng, 'E', 'W')}`;
}

// Fundo graticule para os cards sociais
export function GradeOg() {
  const linhas = [];
  for (let x = 0; x <= 1200; x += 100) linhas.push(<div key={'v' + x} style={{ position: 'absolute', left: x, top: 0, width: 1, height: 630, background: 'rgba(200,214,255,.07)' }} />);
  for (let y = 0; y <= 630; y += 100) linhas.push(<div key={'h' + y} style={{ position: 'absolute', top: y, left: 0, height: 1, width: 1200, background: 'rgba(200,214,255,.07)' }} />);
  return <div style={{ position: 'absolute', inset: 0, display: 'flex' }}>{linhas}</div>;
}
