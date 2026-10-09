import { ImageResponse } from 'next/og';
import { destinoPorSlug } from '../../../_lib/destinos.js';
import { MESES_PT } from '../../../_engine/data.js';

// OG image DINÂMICO por destino (1200×630) — cada um dos 167 países ganha um card
// social próprio (nome + custo + melhor época), em vez do card genérico da marca.
// Casa com os botões de compartilhar do destino. Edge + fonte via fetch (mesmo
// motivo do opengraph-image raiz: dodge do bug de path do @vercel/og no Windows).
export const runtime = 'nodejs';
export const alt = 'Guia de viagem — Mundo Sem Fim';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

const PAPER = '#F4EDDE', CARD = '#FFFDF7', INK = '#222D2B', INKSOFT = '#54605B',
  PINE = '#0E5A4E', OCHRE = '#C98A2B', LINE = '#E4D9C2';

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
  } catch { return null; }
}
function getFonte() { if (!_fontePromise) _fontePromise = carregarFonte(); return _fontePromise; }

function Marca() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 64, height: 64, borderRadius: 18, background: PINE }}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <div style={{ width: 22, height: 22, borderRadius: 999, border: '5px solid #fff' }} />
        <div style={{ width: 22, height: 22, borderRadius: 999, border: '5px solid #fff', marginLeft: -8 }} />
      </div>
    </div>
  );
}

function Fato({ rotulo, valor, cor }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, padding: '18px 26px', background: CARD, border: `1px solid ${LINE}`, borderRadius: 16 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ width: 14, height: 14, borderRadius: 7, background: cor }} />
        <div style={{ fontSize: 22, color: INKSOFT }}>{rotulo}</div>
      </div>
      <div style={{ fontSize: 30, fontWeight: 800, color: INK }}>{valor}</div>
    </div>
  );
}

export default async function OgDestino(props) {
  const params = await props.params;
  const d = destinoPorSlug(params.slug);
  const fonts = await getFonte();
  const nome = d ? d.nome : 'Mundo Sem Fim';
  const regiao = d ? d.regiao : 'Volta ao mundo';
  const meses = d && (d.melhoresMeses || []).length ? d.melhoresMeses.map((m) => MESES_PT[m - 1]).join(' · ') : '—';
  const custo = d ? `~US$ ${d.custoDia}/dia` : 'O mundo inteiro';

  return new ImageResponse(
    (
      <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
        padding: 70, background: PAPER, color: INK, borderTop: `14px solid ${PINE}`, fontFamily: 'Hanken Grotesk, sans-serif' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <Marca />
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ fontSize: 30, fontWeight: 800 }}>Mundo Sem Fim</div>
            <div style={{ fontSize: 19, color: INKSOFT }}>{regiao}</div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ fontSize: 26, color: INKSOFT }}>Guia de viagem</div>
          <div style={{ fontSize: 92, fontWeight: 800, lineHeight: 1.02, letterSpacing: -2, color: PINE }}>{nome}</div>
        </div>

        <div style={{ display: 'flex', gap: 16 }}>
          <Fato rotulo="Custo médio" valor={custo} cor={OCHRE} />
          <Fato rotulo="Melhor época" valor={meses} cor={PINE} />
        </div>
      </div>
    ),
    { ...size, ...(fonts ? { fonts } : {}) }
  );
}
