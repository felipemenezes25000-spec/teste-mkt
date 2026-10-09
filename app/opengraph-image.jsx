import { ImageResponse } from 'next/og';
import { BRAND, MarcaOg, fontesOg, FaixaOg } from './_lib/brand.jsx';

// Card social da marca (1200×630) — identidade CALÇADÃO. Reusado pelo Twitter/X.
export const runtime = 'nodejs';
export const alt = 'Mundo Sem Fim — o álbum do mundo inteiro, na hora certa';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function OgImage() {
  const fonts = await fontesOg();
  return new ImageResponse(
    (
      <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', background: BRAND.BRANCO, color: BRAND.INK, fontFamily: 'Display, sans-serif' }}>
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', flex: 1, padding: '56px 72px 40px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
            <MarcaOg size={64} />
            <div style={{ fontSize: 40, fontWeight: 800, letterSpacing: -1.2 }}>mundo sem fim</div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', fontSize: 120, fontWeight: 800, lineHeight: 0.86, letterSpacing: -6 }}>
            <div style={{ display: 'flex', color: '#D8D8D2' }}>mundo mundo</div>
            <div style={{ display: 'flex' }}>mundo <span style={{ color: BRAND.COBALTO, marginLeft: 28 }}>sem fim</span></div>
          </div>
          <div style={{ display: 'flex', gap: 22, fontFamily: 'Cond, sans-serif', fontSize: 28, letterSpacing: 3 }}>
            <div style={{ display: 'flex' }}>DECIDIR</div><div style={{ display: 'flex', color: BRAND.AMARELO }}>●</div>
            <div style={{ display: 'flex' }}>PLANEJAR</div><div style={{ display: 'flex', color: BRAND.AMARELO }}>●</div>
            <div style={{ display: 'flex' }}>VIAJAR</div>
          </div>
        </div>
        <FaixaOg n={20} tam={60} semente={3} />
      </div>
    ),
    { ...size, ...(fonts ? { fonts } : {}) }
  );
}
