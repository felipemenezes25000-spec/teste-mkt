// Calçadão de Copacabana: faixas onduladas pretas sobre branco que correm devagar
// (animação CSS ms-mar; parada com prefers-reduced-motion). Puro SVG — server e client.
const LAM = 240;
const LARG = 1920 + LAM;

function curva(k) {
  const pts = [];
  for (let x = 0; x <= LARG; x += 8) {
    const t = (x / LAM) * Math.PI * 2;
    pts.push(`${x},${(-20 + k * 21 + 15 * Math.sin(t) + 5 * Math.sin(2 * t + 1.2)).toFixed(1)}`);
  }
  return pts;
}

const CACHE = {};
function poligonos(altura) {
  if (!CACHE[altura]) {
    const out = [];
    for (let k = 0; k < Math.ceil((altura + 40) / 21); k += 2) out.push(curva(k).concat(curva(k + 1).reverse()).join(' '));
    CACHE[altura] = out;
  }
  return CACHE[altura];
}

export function Calcadao({ altura = 120, className = '' }) {
  return (
    <div className={`ms-calcadao ${className}`} style={{ height: altura }} aria-hidden="true">
      <svg width={LARG} height={altura} viewBox={`0 0 ${LARG} ${altura}`}>
        {poligonos(altura).map((p, i) => <polygon key={i} points={p} fill="#111111" />)}
      </svg>
    </div>
  );
}
