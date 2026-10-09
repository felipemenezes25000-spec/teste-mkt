'use client';
import { useMemo, useState } from 'react';
import { useCambioBRL } from '../_lib/cambioClient.js';
import { useIdioma } from '../_lib/i18n.js';
import { Icon } from '../_ui/Icon.jsx';

// Bloco "Passeios & ingressos" — lista de atrações REAIS do país com preço de
// entrada/ingresso em USD convertido pra BRL ao vivo. Vem de pesquisa
// multiagente (precosAtracoes.js): museus, parques, tours, shows, aventuras,
// sítios arqueológicos, mercados etc.
//
// `itens` vem como PROP do Server Component (página de destino) — mesmo padrão
// do OQueFazer: o catálogo de ~650KB fica no bundle do servidor e só a fatia
// do país é serializada no HTML.
//
// Filtros por categoria (chips) + ordenação por preço. Renderiza max 30 itens
// por default e expande on click. Cada item link pra Google Maps.

const CAT_ICON = {
  museu: '🏛️', parque: '🌲', tour: '🎫', show: '🎭',
  aventura: '🪂', sitio: '🗿', religiao: '⛪', agua: '🌊',
  mercado: '🛍️', outro: '📍',
};

const LABELS = {
  pt: {
    titulo: 'Passeios & ingressos', sub: 'Preços reais de entrada. Toque pra abrir no mapa.',
    todos: 'Todos', verMais: 'Ver mais', verMenos: 'Ver menos', gratuito: 'grátis',
    ordPreco: 'Por preço', ordCat: 'Por categoria',
    nota: 'Preços médios (2025-2026) — confirme no local oficial. Conversão pelo câmbio atual.',
    cats: { museu: 'Museus', parque: 'Parques', tour: 'Tours', show: 'Shows', aventura: 'Aventura', sitio: 'Sítios', religiao: 'Religiosos', agua: 'Água', mercado: 'Mercados', outro: 'Outros' },
  },
  en: {
    titulo: 'Tours & tickets', sub: 'Real entry prices. Tap to open on the map.',
    todos: 'All', verMais: 'Show more', verMenos: 'Show less', gratuito: 'free',
    ordPreco: 'By price', ordCat: 'By category',
    nota: 'Average prices (2025-2026) — confirm at the official source. Converted at current exchange rate.',
    cats: { museu: 'Museums', parque: 'Parks', tour: 'Tours', show: 'Shows', aventura: 'Adventure', sitio: 'Sites', religiao: 'Religious', agua: 'Water', mercado: 'Markets', outro: 'Other' },
  },
  es: {
    titulo: 'Tours y entradas', sub: 'Precios reales de entrada. Toca para abrir en el mapa.',
    todos: 'Todos', verMais: 'Ver más', verMenos: 'Ver menos', gratuito: 'gratis',
    ordPreco: 'Por precio', ordCat: 'Por categoría',
    nota: 'Precios medios (2025-2026) — confirma en la fuente oficial. Convertido al cambio actual.',
    cats: { museu: 'Museos', parque: 'Parques', tour: 'Tours', show: 'Shows', aventura: 'Aventura', sitio: 'Sitios', religiao: 'Religiosos', agua: 'Agua', mercado: 'Mercados', outro: 'Otros' },
  },
  ja: {
    titulo: 'ツアーとチケット', sub: '実際の入場料。タップで地図を開く。',
    todos: 'すべて', verMais: 'もっと見る', verMenos: '閉じる', gratuito: '無料',
    ordPreco: '価格順', ordCat: 'カテゴリ別',
    nota: '平均価格 (2025-2026) — 公式で確認を。現在の為替で換算。',
    cats: { museu: '博物館', parque: '公園', tour: 'ツアー', show: 'ショー', aventura: 'アドベンチャー', sitio: '遺跡', religiao: '宗教', agua: '水辺', mercado: '市場', outro: 'その他' },
  },
};

function mapsUrl(query) {
  return 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(query);
}

function fmt(usd, brl, L) {
  if (usd === null || usd === undefined) return { rStr: L.gratuito, uStr: '' };
  const r = Math.round(usd * brl * 100) / 100;
  const rStr = r >= 100 ? `R$ ${Math.round(r).toLocaleString('pt-BR')}` : `R$ ${r.toFixed(2).replace('.', ',')}`;
  const uStr = usd >= 100 ? `US$ ${Math.round(usd)}` : `US$ ${usd.toFixed(2)}`;
  return { rStr, uStr };
}

export function PasseiosIngressos({ itens = [], nomePais }) {
  const lista = itens;
  const cambio = useCambioBRL();
  const { idioma } = useIdioma();
  const [catSel, setCatSel] = useState('todos');
  const [expandido, setExpandido] = useState(false);
  const [ordem, setOrdem] = useState('cat'); // 'cat' ou 'preco'
  const L = LABELS[idioma] || LABELS.pt;

  // Sempre chama hooks antes de qualquer return condicional — categorias
  // dependem da lista, mesmo quando vazia.
  const categorias = useMemo(() => {
    const set = new Set((lista || []).map((a) => a.categoria || 'outro'));
    return ['todos', ...Array.from(set)];
  }, [lista]);

  const filtrada = useMemo(() => {
    let arr = (lista || []).filter((a) => catSel === 'todos' || a.categoria === catSel);
    if (ordem === 'preco') {
      arr = [...arr].sort((a, b) => {
        const pa = a.precoUSD === null ? -1 : a.precoUSD;
        const pb = b.precoUSD === null ? -1 : b.precoUSD;
        return pa - pb;
      });
    } else {
      arr = [...arr].sort((a, b) => (a.categoria || '').localeCompare(b.categoria || ''));
    }
    return arr;
  }, [lista, catSel, ordem]);

  if (!lista || lista.length === 0) return null;

  const mostrar = expandido ? filtrada : filtrada.slice(0, 30);

  return (
    <section aria-labelledby="passeios-titulo">
      <h2 id="passeios-titulo" className="font-display text-2xl text-ink mb-1"><Icon emoji="🎟️" /> {L.titulo}</h2>
      <p className="text-sm text-inksoft mb-3 max-w-2xl">{L.sub}</p>

      <div className="flex flex-wrap items-center gap-2 mb-3">
        {categorias.map((c) => {
          const ativo = c === catSel;
          const label = c === 'todos' ? L.todos : (L.cats[c] || c);
          const icon = c === 'todos' ? '✨' : (CAT_ICON[c] || '📍');
          return (
            <button
              key={c} type="button" onClick={() => setCatSel(c)} aria-pressed={ativo}
              className={`text-xs font-semibold rounded-full px-3 py-1.5 border transition focusring ${ativo ? 'bg-pine text-onpine border-pine' : 'bg-card text-inksoft border-line hover:border-pine/50'}`}
            >
              <span className="mr-1" aria-hidden><Icon emoji={icon} /></span>{label}
            </button>
          );
        })}
        <div className="ml-auto flex gap-1">
          <button type="button" onClick={() => setOrdem('cat')} aria-pressed={ordem === 'cat'}
            className={`text-[11px] font-semibold rounded-md px-2 py-1 border transition focusring ${ordem === 'cat' ? 'bg-pine/10 text-pine border-pine/30' : 'bg-card text-inksoft border-line'}`}>
            {L.ordCat}
          </button>
          <button type="button" onClick={() => setOrdem('preco')} aria-pressed={ordem === 'preco'}
            className={`text-[11px] font-semibold rounded-md px-2 py-1 border transition focusring ${ordem === 'preco' ? 'bg-pine/10 text-pine border-pine/30' : 'bg-card text-inksoft border-line'}`}>
            {L.ordPreco}
          </button>
        </div>
      </div>

      <div className="rounded-3xl border border-line bg-card overflow-hidden shadow-[var(--e-1)]">
        <ul className="divide-y divide-line">
          {mostrar.map((a, i) => {
            const preco = fmt(a.precoUSD, cambio.brl, L);
            const href = mapsUrl(`${a.nome}, ${a.cidade}, ${nomePais || ''}`);
            return (
              <li key={`${a.nome}-${i}`} className="flex items-start gap-3 px-4 sm:px-5 py-3 hover:bg-paper2/40 transition">
                <span aria-hidden className="text-xl shrink-0 mt-0.5"><Icon emoji={CAT_ICON[a.categoria] || '📍'} /></span>
                <div className="min-w-0 flex-1">
                  <a href={href} target="_blank" rel="noopener noreferrer" className="text-sm font-semibold text-ink hover:text-pine focusring">
                    {a.nome} <span className="text-pine" aria-hidden><Icon emoji="↗" /></span>
                  </a>
                  <div className="text-[11px] text-inksoft mt-0.5">
                    <Icon emoji="📍" /> {a.cidade}
                    {a.duracao && <span> · <Icon emoji="⏱" /> {a.duracao}</span>}
                    {L.cats[a.categoria] && <span> · {L.cats[a.categoria]}</span>}
                  </div>
                  {a.obs && <div className="text-[11px] text-inksoft mt-0.5 italic">{a.obs}</div>}
                </div>
                <div className="text-right shrink-0">
                  <div className={`font-semibold tnum text-sm ${a.precoUSD === null ? 'text-success' : 'text-ink'}`}>
                    {preco.rStr}
                  </div>
                  {preco.uStr && <div className="text-[10px] text-inksoft tnum">{preco.uStr}</div>}
                </div>
              </li>
            );
          })}
        </ul>
        {filtrada.length > 30 && (
          <div className="px-4 sm:px-5 py-3 border-t border-line bg-paper2/40 text-center">
            <button type="button" onClick={() => setExpandido((v) => !v)}
              className="text-sm font-semibold text-pine hover:underline focusring">
              {expandido ? L.verMenos : `${L.verMais} (${filtrada.length - 30})`}
            </button>
          </div>
        )}
      </div>
      <p className="mt-2 text-[11px] text-inksoft">{L.nota}</p>
    </section>
  );
}
