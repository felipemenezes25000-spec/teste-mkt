import { ImageResponse } from 'next/og';
import { BRAND, MarcaOg, fontesOg, GradeOg } from './_lib/brand.jsx';

// Card social da marca (1200×630) — identidade MERIDIANO. Reusado pelo Twitter/X.
export const runtime = 'nodejs';
export const alt = 'Mundo Sem Fim — o mundo inteiro, explicado para você';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function OgImage() {
  const fonts = await fontesOg();
  return new ImageResponse(
    (
      <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
        padding: 72, background: BRAND.NOITE, color: BRAND.GELO, fontFamily: 'Display, sans-serif', position: 'relative' }}>
        <GradeOg />
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <MarcaOg size={72} />
          <div style={{ fontSize: 34, fontWeight: 800, letterSpacing: -1 }}>Mundo Sem Fim</div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ fontSize: 96, fontWeight: 800, lineHeight: 0.98, letterSpacing: -4 }}>O mundo inteiro,</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 22 }}>
            <div style={{ fontSize: 96, fontWeight: 800, lineHeight: 1.02, letterSpacing: -4, color: BRAND.LIMA }}>explicado para você.</div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 28, fontFamily: 'Mono, monospace', fontSize: 22, color: '#98A3B8', letterSpacing: 2 }}>
          <div style={{ display: 'flex' }}>DECIDIR</div><div style={{ display: 'flex', color: BRAND.LIMA }}>→</div>
          <div style={{ display: 'flex' }}>PLANEJAR</div><div style={{ display: 'flex', color: BRAND.LIMA }}>→</div>
          <div style={{ display: 'flex' }}>RESERVAR</div><div style={{ display: 'flex', color: BRAND.LIMA }}>→</div>
          <div style={{ display: 'flex' }}>VIAJAR</div>
        </div>
      </div>
    ),
    { ...size, ...(fonts ? { fonts } : {}) }
  );
}
