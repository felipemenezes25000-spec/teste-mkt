// Marca CALÇADÃO para imagens geradas (next/og / satori): ícone do PWA e cards
// sociais. Desenhada em SVG inline (sem fonte/glifo) → nunca vira "tofu".
export const BRAND = {
  INK: '#111111', PAPER: '#F3F3F0', CARD: '#FFFFFF', INKSOFT: '#55554F', LINE: '#E3E3DD',
  COBALTO: '#1C3FD1', AMARELO: '#FFC400', VERDE: '#00995C', ROSA: '#FF5A7A', RISCO: '#C8281C', BRANCO: '#FFFFFF',
};

// Quadrado de tinta com as ondas do calçadão e o sol amarelo.
export function MarcaOg({ size = 78, raio }) {
  const r = raio ?? 4;
  return (
    <svg width={size} height={size} viewBox="0 0 40 40">
      <rect width="40" height="40" rx={r} fill={BRAND.INK} />
      <path d="M0 26 C 6 18, 14 18, 20 26 S 34 34, 40 26 V40 H0Z" fill={BRAND.BRANCO} />
      <path d="M0 14 C 6 6, 14 6, 20 14 S 34 22, 40 14 V20 C 34 28, 26 28, 20 20 S 6 12, 0 20Z" fill={BRAND.BRANCO} />
      <circle cx="31" cy="9" r="5" fill={BRAND.AMARELO} />
    </svg>
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
    _fontes = Promise.all([ttf('League+Spartan', 800), ttf('Barlow+Condensed', 800)])
      .then(([d, c]) => [
        { name: 'Display', data: d, weight: 800, style: 'normal' },
        { name: 'Cond', data: c, weight: 800, style: 'normal' },
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

// Faixa de azulejos para os cards sociais (mesmos motivos de _ui/Azulejo.jsx)
const CORES = [BRAND.COBALTO, BRAND.AMARELO, BRAND.VERDE, BRAND.ROSA, BRAND.INK];
function motivo(i, c, f) {
  switch (i % 6) {
    case 0: return [<rect key="a" width="96" height="96" fill={f} />, <path key="b" d="M0 96 A48 48 0 0 1 96 96Z" fill={c} />];
    case 1: return [<rect key="a" width="96" height="96" fill={f} />, <path key="b" d="M0 0 H96 A96 96 0 0 1 0 96Z" fill={c} />];
    case 2: return [<rect key="a" width="96" height="96" fill={f} />, <path key="b" d="M0 0 L96 96 H0Z" fill={c} />];
    case 3: return [<rect key="a" width="96" height="96" fill={f} />, <path key="b" d="M0 0 A48 48 0 0 1 48 48 A48 48 0 0 1 0 96Z M96 0 A48 48 0 0 0 48 48 A48 48 0 0 0 96 96Z" fill={c} />];
    case 4: return [<rect key="a" width="96" height="96" fill={f} />, <rect key="b" y="32" width="96" height="32" fill={c} />, <circle key="c" cx="48" cy="48" r="10" fill={f} />];
    default: return [<rect key="a" width="96" height="96" fill={f} />, <circle key="b" cx="48" cy="48" r="30" fill={c} />, <circle key="c" cx="48" cy="48" r="12" fill={f} />];
  }
}
export function FaixaOg({ n = 20, tam = 60, semente = 0 }) {
  return (
    <div style={{ display: 'flex', width: '100%' }}>
      {Array.from({ length: n }, (_, i) => {
        const k = i + semente; const fundo = k % 4 === 3 ? BRAND.INK : BRAND.BRANCO; let cor = CORES[(k * 3) % 5]; if (cor === fundo) cor = BRAND.AMARELO;
        return <svg key={i} width={tam} height={tam} viewBox="0 0 96 96" style={{ transform: `rotate(${((k * 7) % 4) * 90}deg)` }}>{motivo((k * 5) % 6, cor, fundo)}</svg>;
      })}
    </div>
  );
}
