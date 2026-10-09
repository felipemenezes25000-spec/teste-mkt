import { ImageResponse } from 'next/og';
import { MarcaOg, BRAND } from './brand.jsx';

// Ícone do PWA gerado em runtime (next/og). Fundo tinta full-bleed → seguro como
// `maskable` (a marca fica dentro da safe zone de 80%).
export function iconResponse(size) {
  return new ImageResponse(
    (
      <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: BRAND.INK }}>
        <MarcaOg size={Math.round(size * 0.78)} raio={0} />
      </div>
    ),
    { width: size, height: size }
  );
}
