import { ImageResponse } from 'next/og';
import { destinoPorSlug } from '../../../_lib/destinos.js';
import { MESES_PT } from '../../../_engine/data.js';
import { BRAND, MarcaOg, fontesOg, FaixaOg, coordTexto } from '../../../_lib/brand.jsx';

// Card social por destino (1200×630): nome, coordenada, custo de referência e
// melhor época. Custo é REFERÊNCIA HISTÓRICA (pesquisa jun/2026) e diz isso.
export const runtime = 'nodejs';
export const alt = 'Guia de viagem — Mundo Sem Fim';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

function Fato({ rotulo, valor }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, padding: '16px 24px', borderRadius: 16, background: BRAND.PAPER }}>
      <div style={{ display: 'flex', fontFamily: 'Cond, sans-serif', fontSize: 20, letterSpacing: 3, color: BRAND.INKSOFT }}>{rotulo}</div>
      <div style={{ display: 'flex', fontFamily: 'Cond, sans-serif', fontSize: 38, color: BRAND.INK }}>{valor}</div>
    </div>
  );
}

export default async function OgDestino(props) {
  const params = await props.params;
  const d = destinoPorSlug(params.slug);
  const fonts = await fontesOg();
  const nome = d ? d.nome.toLowerCase() : 'mundo sem fim';
  const meses = d && (d.melhoresMeses || []).length ? d.melhoresMeses.map((m) => MESES_PT[m - 1]).join(' · ').toUpperCase() : '—';
  const custo = d ? `US$ ${d.custoDia}/DIA` : '—';
  return new ImageResponse(
    (
      <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', background: BRAND.BRANCO, color: BRAND.INK, fontFamily: 'Display, sans-serif' }}>
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', flex: 1, padding: '48px 72px 36px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <MarcaOg size={56} />
              <div style={{ fontSize: 34, fontWeight: 800, letterSpacing: -1 }}>mundo sem fim</div>
            </div>
            <div style={{ display: 'flex', fontFamily: 'Cond, sans-serif', fontSize: 24, letterSpacing: 2, color: BRAND.INKSOFT }}>{d ? coordTexto(d.coords) : ''}</div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', fontFamily: 'Cond, sans-serif', fontSize: 26, letterSpacing: 4, color: BRAND.INKSOFT }}>{(d ? `${d.code} · ${d.regiao}` : 'GUIA').toUpperCase()}</div>
            <div style={{ display: 'flex', fontSize: nome.length > 14 ? 104 : 140, fontWeight: 800, lineHeight: 0.92, letterSpacing: -6 }}>{nome}</div>
          </div>
          <div style={{ display: 'flex', gap: 16 }}>
            <Fato rotulo="CUSTO DE REFERÊNCIA" valor={custo} />
            <Fato rotulo="MELHOR ÉPOCA" valor={meses} />
          </div>
        </div>
        <FaixaOg n={20} tam={60} semente={d ? d.code.charCodeAt(0) : 0} />
      </div>
    ),
    { ...size, ...(fonts ? { fonts } : {}) }
  );
}
