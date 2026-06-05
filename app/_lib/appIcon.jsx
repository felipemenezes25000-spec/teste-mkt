import { ImageResponse } from 'next/og';

// Ícone do PWA gerado em runtime (next/og) — sem asset PNG estático. Desenha a marca
// ∞ como 2 anéis (independente de glifo/fonte, igual ao opengraph-image) sobre fundo
// pine full-bleed → seguro como `maskable` (a marca fica bem dentro da safe zone).
const PINE = '#0E5A4E';

export function iconResponse(size) {
  const ring = Math.round(size * 0.2);
  const border = Math.max(3, Math.round(size * 0.05));
  const overlap = Math.round(ring * 0.34);
  return new ImageResponse(
    (
      <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: PINE }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{ width: ring, height: ring, borderRadius: 999, border: `${border}px solid #fff` }} />
          <div style={{ width: ring, height: ring, borderRadius: 999, border: `${border}px solid #fff`, marginLeft: -overlap }} />
        </div>
      </div>
    ),
    { width: size, height: size }
  );
}
