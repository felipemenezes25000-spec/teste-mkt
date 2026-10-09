import { ImageResponse } from 'next/og';
import { MarcaOg } from './brand.jsx';

// Ícone do PWA gerado em runtime (next/og). A marca ocupa o quadro inteiro sem
// cantos arredondados → segura como `maskable` (o sistema aplica a máscara).
export function iconResponse(size) {
  return new ImageResponse(
    (
      <div style={{ width: '100%', height: '100%', display: 'flex' }}>
        <MarcaOg size={size} raio={0} />
      </div>
    ),
    { width: size, height: size }
  );
}
