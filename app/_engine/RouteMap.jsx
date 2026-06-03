import { fmtData, linkMapaCoord } from './utils.js';

// Projeção equirectangular simples: lng/lat -> coordenadas do viewBox 360x180.
const px = (lng) => lng + 180;
const py = (lat) => 90 - lat;

const CONTINENTES = [
  { nome:'Am. do Norte', lng:-100, lat:40 }, { nome:'Am. Central', lng:-88, lat:16 },
  { nome:'América do Sul', lng:-60, lat:-15 }, { nome:'Europa', lng:12, lat:54 },
  { nome:'África', lng:22, lat:2 }, { nome:'Ásia', lng:95, lat:45 }, { nome:'Oceania', lng:140, lat:-25 },
];

// Mapa-rota esquemático: pontos dos trechos (com coordenadas) ligados na ordem da viagem.
export default function RouteMap({ trechos, onSelect }) {
  const pts = trechos.filter(t => Array.isArray(t.coords));
  if (pts.length === 0) return null;
  const linha = pts.map(t => `${px(t.coords[0])},${py(t.coords[1])}`).join(' ');
  const semCoord = trechos.filter(t => !Array.isArray(t.coords));

  return (
    <section className="rise rounded-3xl border border-line bg-card shadow-[0_18px_50px_-30px_rgba(34,45,43,0.4)] overflow-hidden" aria-label="Mapa da rota">
      <div className="px-5 pt-4 pb-1 flex items-center justify-between gap-2">
        <h2 className="font-display text-xl text-ink">🗺️ Rota no mapa</h2>
        <span className="text-xs text-inksoft">esquema geográfico — clique num ponto pra ir ao trecho</span>
      </div>
      <div className="px-3 pb-2">
        <svg viewBox="0 0 360 180" className="w-full h-auto rounded-2xl" style={{ background: '#E9EFEA' }} role="img" aria-label="Mapa esquemático da rota">
          {/* graticule */}
          <g stroke="#0E5A4E" strokeOpacity="0.08" strokeWidth="0.5">
            {[30,60,90,120,150,210,240,270,300,330].map(x => <line key={'v'+x} x1={x} y1="0" x2={x} y2="180" />)}
            {[30,60,120,150].map(y => <line key={'h'+y} x1="0" y1={y} x2="360" y2={y} />)}
          </g>
          <line x1="0" y1="90" x2="360" y2="90" stroke="#0E5A4E" strokeOpacity="0.18" strokeWidth="0.6" />
          <line x1="180" y1="0" x2="180" y2="180" stroke="#0E5A4E" strokeOpacity="0.12" strokeWidth="0.6" />
          {CONTINENTES.map(c => (
            <text key={c.nome} x={px(c.lng)} y={py(c.lat)} fontSize="4.4" fill="#0E5A4E" fillOpacity="0.32" textAnchor="middle" fontFamily="Hanken Grotesk, sans-serif">{c.nome}</text>
          ))}

          {/* linha da rota */}
          {pts.length > 1 && <polyline points={linha} fill="none" stroke="#0E5A4E" strokeWidth="1.1" strokeDasharray="2.5 2" strokeOpacity="0.85" strokeLinejoin="round" />}

          {/* pontos numerados */}
          {pts.map((t, i) => {
            const x = px(t.coords[0]); const y = py(t.coords[1]);
            return (
              <g key={t.id} role="button" tabIndex={0}
                aria-label={`${i + 1}. ${t.nome} — chega ${fmtData(t.chegada)}. Ir ao trecho.`}
                onClick={() => onSelect && onSelect(t.id)}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onSelect && onSelect(t.id); } }}
                style={{ cursor: 'pointer' }}>
                <title>{`${i + 1}. ${t.nome} — chega ${fmtData(t.chegada)}`}</title>
                <circle cx={x} cy={y} r="4.4" fill="#C98A2B" stroke="#FFFDF7" strokeWidth="1" />
                <text x={x} y={y + 1.6} fontSize="4.2" fill="#fff" textAnchor="middle" fontWeight="700" fontFamily="Hanken Grotesk, sans-serif">{i + 1}</text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* legenda numerada */}
      <div className="px-5 pb-4 flex flex-wrap gap-x-4 gap-y-1 text-xs text-inksoft">
        {pts.map((t, i) => (
          <span key={t.id} className="inline-flex items-center gap-1.5">
            <span className="w-4 h-4 rounded-full bg-ochre text-white grid place-items-center text-[9px] font-bold">{i + 1}</span>
            <span className="text-ink">{t.nome}</span>
            {linkMapaCoord(t.coords) && <a href={linkMapaCoord(t.coords)} target="_blank" rel="noopener noreferrer" className="text-pine hover:underline">↗</a>}
          </span>
        ))}
        {semCoord.length > 0 && <span className="opacity-70">({semCoord.length} trecho(s) sem coordenadas — adicione no país de referência)</span>}
      </div>
    </section>
  );
}
