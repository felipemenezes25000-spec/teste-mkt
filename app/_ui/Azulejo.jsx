// Azulejos da marca (homenagem aos painéis de Athos Bulcão): 6 motivos geométricos
// em 5 cores. Puro SVG, sem estado — server e client.
export const CORES_AZULEJO = ['#1C3FD1', '#FFC400', '#00995C', '#FF5A7A', '#111111'];

function Motivo({ i, c, f }) {
  switch (i % 6) {
    case 0: return <><rect width="96" height="96" fill={f} /><path d="M0 96 A48 48 0 0 1 96 96Z" fill={c} /></>;
    case 1: return <><rect width="96" height="96" fill={f} /><path d="M0 0 H96 A96 96 0 0 1 0 96Z" fill={c} /></>;
    case 2: return <><rect width="96" height="96" fill={f} /><path d="M0 0 L96 96 H0Z" fill={c} /></>;
    case 3: return <><rect width="96" height="96" fill={f} /><path d="M0 0 A48 48 0 0 1 48 48 A48 48 0 0 1 0 96Z M96 0 A48 48 0 0 0 48 48 A48 48 0 0 0 96 96Z" fill={c} /></>;
    case 4: return <><rect width="96" height="96" fill={f} /><rect y="32" width="96" height="32" fill={c} /><circle cx="48" cy="48" r="10" fill={f} /></>;
    default: return <><rect width="96" height="96" fill={f} /><circle cx="48" cy="48" r="30" fill={c} /><circle cx="48" cy="48" r="12" fill={f} /></>;
  }
}

export function Azulejo({ motivo = 0, cor = CORES_AZULEJO[0], fundo = '#FFFFFF', tam = 48, rot = 0, className = '', style }) {
  return (
    <svg className={`ms-azulejo ${className}`} width={tam} height={tam} viewBox="0 0 96 96" aria-hidden="true"
      style={{ transform: rot ? `rotate(${rot}deg)` : undefined, ...style }}>
      <Motivo i={motivo} c={cor} f={fundo} />
    </svg>
  );
}

/** Faixa de azulejos (n peças) com variação determinística a partir da semente. */
export function FaixaAzulejos({ n = 12, tam = 48, semente = 0, className = '' }) {
  return (
    <div className={`flex overflow-hidden ${className}`} aria-hidden="true">
      {Array.from({ length: n }, (_, i) => {
        const k = i + semente;
        const cor = CORES_AZULEJO[(k * 3) % 5];
        const fundo = (k % 4 === 3) ? '#111111' : '#FFFFFF';
        return <Azulejo key={i} motivo={(k * 5) % 6} cor={cor === fundo ? CORES_AZULEJO[1] : cor} fundo={fundo} tam={tam} rot={((k * 7) % 4) * 90} />;
      })}
    </div>
  );
}
