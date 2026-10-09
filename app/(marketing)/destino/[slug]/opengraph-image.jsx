import { ImageResponse } from 'next/og';
import { destinoPorSlug } from '../../../_lib/destinos.js';
import { MESES_PT } from '../../../_engine/data.js';
import { BRAND, MarcaOg, fontesOg, GradeOg, coordTexto } from '../../../_lib/brand.jsx';

// Card social por destino (1200×630): nome, coordenada, custo de referência e
// melhor época. Custo é REFERÊNCIA HISTÓRICA (pesquisa jun/2026) e diz isso.
export const runtime = 'nodejs';
export const alt = 'Guia de viagem — Mundo Sem Fim';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

function Fato({ rotulo, valor }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, padding: '18px 26px', border: '1px solid rgba(200,214,255,.18)', borderRadius: 10, background: 'rgba(15,22,38,.85)' }}>
      <div style={{ display: 'flex', fontFamily: 'Mono, monospace', fontSize: 18, letterSpacing: 2, color: '#98A3B8' }}>{rotulo}</div>
      <div style={{ display: 'flex', fontSize: 34, fontWeight: 800, color: BRAND.GELO }}>{valor}</div>
    </div>
  );
}

export default async function OgDestino(props) {
  const params = await props.params;
  const d = destinoPorSlug(params.slug);
  const fonts = await fontesOg();
  const nome = d ? d.nome : 'Mundo Sem Fim';
  const meses = d && (d.melhoresMeses || []).length ? d.melhoresMeses.map((m) => MESES_PT[m - 1]).join(' · ') : '—';
  const custo = d ? `~US$ ${d.custoDia}/dia` : '—';
  return new ImageResponse(
    (
      <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
        padding: 72, background: BRAND.NOITE, color: BRAND.GELO, fontFamily: 'Display, sans-serif', position: 'relative' }}>
        <GradeOg />
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <MarcaOg size={60} />
            <div style={{ fontSize: 28, fontWeight: 800 }}>Mundo Sem Fim</div>
          </div>
          <div style={{ display: 'flex', fontFamily: 'Mono, monospace', fontSize: 22, color: BRAND.LIMA, letterSpacing: 2 }}>{d ? coordTexto(d.coords) : ''}</div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', fontFamily: 'Mono, monospace', fontSize: 22, letterSpacing: 4, color: '#98A3B8' }}>{(d ? d.regiao : 'GUIA').toUpperCase()}</div>
          <div style={{ display: 'flex', fontSize: 120, fontWeight: 800, lineHeight: 1, letterSpacing: -5 }}>{nome}</div>
        </div>
        <div style={{ display: 'flex', gap: 16 }}>
          <Fato rotulo="CUSTO DE REFERÊNCIA" valor={custo} />
          <Fato rotulo="MELHOR ÉPOCA" valor={meses} />
        </div>
      </div>
    ),
    { ...size, ...(fonts ? { fonts } : {}) }
  );
}
