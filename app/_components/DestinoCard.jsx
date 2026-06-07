import Link from 'next/link';
import { FavoriteButton } from './FavoriteButton.jsx';
import { wikiThumb } from '../_lib/wikiThumb.js';
import { flagUrl } from '../_lib/flags.js';
import { alertaHumanoDestino, custoEstimadoDias, fitTagsDestino, mundoScoreDestino } from '../_lib/editorial.js';

// Card de destino reutilizado na home, no /explorar e nos salvos. img pode ser
// null (cai num gradiente). O coração fica fora do <Link> (HTML válido).
export function DestinoCard({ d, img }) {
  const score = mundoScoreDestino(d);
  const custos = custoEstimadoDias(d);
  const tags = fitTagsDestino(d).slice(0, 3);
  const alerta = alertaHumanoDestino(d);

  return (
    <div className="relative group">
      <FavoriteButton code={d.code} nome={d.nome} className="absolute top-2 right-2 z-10" />
      <Link
        href={`/destino/${d.slug}`}
        className="block rounded-3xl border border-line bg-card overflow-hidden hover:shadow-[var(--e-2)] hover:-translate-y-1 transition focusring"
      >
        <div className="relative h-48 bg-paper2 overflow-hidden">
          {img ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={wikiThumb(img, 640)} alt={d.nome} loading="lazy" width="640" height="256" className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
          ) : (
            <div className="w-full h-full grid place-items-center bg-gradient-to-br from-pine/15 to-ochre/15 text-pine font-display text-4xl" aria-hidden>∞</div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/20 to-transparent" aria-hidden />
          <span className="absolute top-2 left-2 text-[11px] font-semibold bg-ink/60 text-white px-2 py-0.5 rounded-full">{d.regiao}</span>
          <span className="absolute bottom-2 left-2 inline-flex items-center gap-1 rounded-full bg-card/95 text-pine border border-white/30 px-2.5 py-1 text-xs font-bold shadow-sm">
            <span className="text-[10px] uppercase tracking-wide text-inksoft">Score</span>
            <span className="tnum">{score.total}</span>
          </span>
        </div>
        <div className="p-4">
          <div className="flex items-center justify-between gap-2">
            <h3 className="font-display text-xl text-ink flex items-center gap-2 min-w-0">
              {flagUrl(d.code) && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={flagUrl(d.code)} alt="" width="24" height="18" loading="lazy" className="rounded-[2px] ring-1 ring-line shrink-0" />
              )}
              <span className="truncate">{d.nome}</span>
            </h3>
            <span className="text-xs text-pine font-bold tnum shrink-0">US$ {d.custoDia}/dia</span>
          </div>
          <p className="mt-1 text-sm text-inksoft leading-snug line-clamp-2">{alerta}</p>
          <div className="mt-3 grid grid-cols-3 gap-1.5">
            {custos.map((item) => (
              <span key={item.dias} className="rounded-lg bg-paper2 px-2 py-1 text-[11px] text-center text-inksoft">
                <strong className="text-ink tnum">{item.dias}d</strong> · US$ {item.total}
              </span>
            ))}
          </div>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {tags.map((tag) => (
              <span key={tag} className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-pine/10 text-pine">{tag}</span>
            ))}
          </div>
          <span className="mt-3 inline-block text-sm font-semibold text-pine">Ver se combina comigo →</span>
        </div>
      </Link>
    </div>
  );
}
