'use client';
import { useIdioma, IDIOMAS } from '../_lib/i18n.js';
import { Icon } from '../_ui/Icon.jsx';

// Mapa do país centrado, com marcador. Reage ao idioma do usuário (useIdioma):
// quando ele troca pra ja, as labels do MapTiler ficam em japonês na hora.
//
// Modos:
//  (1) MapTiler: se NEXT_PUBLIC_MAPTILER_KEY estiver definido, usa tiles com
//      idioma controlado por `?language=` (50+ idiomas). Free tier ~100k req/mês
//      em https://cloud.maptiler.com.
//  (2) OSM (fallback sem chave): labels no idioma local da cidade (Tóquio em
//      japonês, Beirute em árabe). Sem controle do idioma, mas sem custo.
export function MapaDestino({ coords, nome }) {
  const { idioma, t } = useIdioma();
  if (!Array.isArray(coords) || coords.length !== 2) return null;
  const [lng, lat] = coords;
  const maptilerKey = process.env.NEXT_PUBLIC_MAPTILER_KEY;

  // MapTiler aceita códigos: pt, en, es, ja, fr, de, zh, ar, ru, ko, it…
  // Nosso IDIOMAS.mapTiler casa 1:1 — basta passar.
  const mapTilerLang = (IDIOMAS.find((i) => i.code === idioma) || IDIOMAS[0]).mapTiler;

  let src;
  let openLargerHref;
  if (maptilerKey) {
    src = `https://api.maptiler.com/maps/streets-v2/?key=${maptilerKey}&language=${mapTilerLang}#5/${lat}/${lng}`;
    openLargerHref = `https://www.maptiler.com/maps/#streets-v2//${mapTilerLang}/5/${lng}/${lat}`;
  } else {
    const dx = 6, dy = 4;
    const bbox = `${lng - dx}%2C${lat - dy}%2C${lng + dx}%2C${lat + dy}`;
    src = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat}%2C${lng}`;
    openLargerHref = `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lng}#map=6/${lat}/${lng}`;
  }

  return (
    <section>
      <h2 className="font-display text-2xl text-ink mb-3"><Icon emoji="🗺️" /> {t('destino.ondefica')} {nome}</h2>
      <div className="rounded-2xl overflow-hidden border border-line bg-card">
        <iframe
          // key força recriação do iframe quando idioma muda — alguns browsers
          // não reagem só ao src mudando dentro do mesmo iframe.
          key={`${mapTilerLang}-${lat}-${lng}`}
          title={`${t('destino.ondefica')} ${nome}`}
          src={src}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="w-full h-[360px] sm:h-[420px]"
        />
        <div className="px-3 py-2 text-xs text-inksoft border-t border-line flex justify-between gap-2">
          <span>{maptilerKey ? `MapTiler · ${IDIOMAS.find((i) => i.code === idioma)?.nome || idioma}` : 'OpenStreetMap'}</span>
          <a href={openLargerHref} target="_blank" rel="noopener noreferrer" className="text-pine hover:underline focusring">
            {t('map.ampliar')} <Icon emoji="↗" />
          </a>
        </div>
      </div>
    </section>
  );
}
