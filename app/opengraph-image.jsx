import { ImageResponse } from 'next/og';

// OG image DINÂMICO (1200×630) na identidade do app — sem asset estático.
// Usado pro Open Graph (WhatsApp/Facebook/LinkedIn) e, via re-export, pro Twitter/X.
// Edge runtime: o @vercel/og em edge carrega fontes via fetch/WASM (sem
// fileURLToPath), evitando o bug de path do Windows no `next start`. Funciona em
// Vercel (edge nativo) e Render (next start emula edge). Gera sob demanda.
export const runtime = 'edge';
export const alt = 'Mundo Sem Fim — monte sua volta ao mundo na ordem que não te quebra';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

const PAPER = '#F4EDDE', CARD = '#FFFDF7', INK = '#222D2B', INKSOFT = '#54605B',
  PINE = '#0E5A4E', OCHRE = '#C98A2B', CLAY = '#B6452E', LINE = '#E4D9C2';

// Fornecemos a fonte EXPLICITAMENTE: assim o satori usa a nossa e nunca aciona o
// carregador de fonte default do @vercel/og — que quebra em path com espaço
// (Windows) e em alguns ambientes. Buscamos a Hanken Grotesk (fonte do app) em TTF
// via Google Fonts (UA antigo força TTF; satori não lê woff2). Cache por instância.
// Fallback null → ImageResponse usa o default (ok em produção Linux).
let _fontePromise;
async function carregarFonte() {
  try {
    const css = await fetch('https://fonts.googleapis.com/css2?family=Hanken+Grotesk:wght@600;800', {
      headers: { 'User-Agent': 'Mozilla/4.0 (compatible; MSIE 6.0)' },
    }).then((r) => r.text());
    const urls = [...css.matchAll(/url\((https:[^)]+\.ttf)\)/g)].map((m) => m[1]);
    if (!urls.length) return null;
    const data = await fetch(urls[0]).then((r) => r.arrayBuffer());
    return [{ name: 'Hanken Grotesk', data, weight: 700, style: 'normal' }];
  } catch {
    return null;
  }
}
function getFonte() { if (!_fontePromise) _fontePromise = carregarFonte(); return _fontePromise; }

// Marca ∞ desenhada com 2 anéis (independente de glifo, sem risco de tofu).
function Marca() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 78, height: 78, borderRadius: 20, background: PINE }}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <div style={{ width: 26, height: 26, borderRadius: 999, border: '6px solid #fff' }} />
        <div style={{ width: 26, height: 26, borderRadius: 999, border: '6px solid #fff', marginLeft: -9 }} />
      </div>
    </div>
  );
}

function Pilar({ titulo, sub, cor }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10, padding: '20px 28px',
      background: CARD, border: `1px solid ${LINE}`, borderRadius: 18, minWidth: 246 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ width: 16, height: 16, borderRadius: 8, background: cor }} />
        <div style={{ fontSize: 32, fontWeight: 800, color: INK }}>{titulo}</div>
      </div>
      <div style={{ fontSize: 19, color: INKSOFT }}>{sub}</div>
    </div>
  );
}

export default async function OgImage() {
  const fonts = await getFonte();
  return new ImageResponse(
    (
      <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column',
        justifyContent: 'space-between', padding: 70, background: PAPER, color: INK,
        borderTop: `14px solid ${PINE}`, fontFamily: 'Hanken Grotesk, sans-serif' }}>
        {/* marca */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
          <Marca />
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ fontSize: 34, fontWeight: 800 }}>Mundo Sem Fim</div>
            <div style={{ fontSize: 20, color: INKSOFT }}>Estação × Visto × Fôlego, na ordem certa</div>
          </div>
        </div>

        {/* headline */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ fontSize: 72, fontWeight: 800, lineHeight: 1.05, letterSpacing: -1 }}>Monte sua volta ao mundo</div>
          <div style={{ fontSize: 72, fontWeight: 800, lineHeight: 1.05, letterSpacing: -1, color: PINE }}>na ordem que não te quebra.</div>
        </div>

        {/* três pilares */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
          <Pilar titulo="Estação" sub="clima na hora certa" cor={OCHRE} />
          <div style={{ fontSize: 38, color: INKSOFT }}>×</div>
          <Pilar titulo="Visto" sub="sem furar a janela" cor={PINE} />
          <div style={{ fontSize: 38, color: INKSOFT }}>×</div>
          <Pilar titulo="Fôlego" sub="a grana não acaba" cor={CLAY} />
        </div>
      </div>
    ),
    { ...size, ...(fonts ? { fonts } : {}) }
  );
}
