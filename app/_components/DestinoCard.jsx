import Link from 'next/link';
import { FavoriteButton } from './FavoriteButton.jsx';
import { wikiThumb } from '../_lib/wikiThumb.js';
import { flagUrl } from '../_lib/flags.js';
import { coordTexto } from '../_lib/brand.jsx';
import { alertaHumanoDestino, custoEstimadoDias, fitTagsDestino, mundoScoreDestino } from '../_lib/editorial.js';
import { Icon } from '../_ui/Icon.jsx';
import { Foto } from '../_ui/Foto.jsx';

// Card de destino MERIDIANO (home, /explorar, salvos). Foto real com crédito/fallback,
// coordenada como assinatura, custo de REFERÊNCIA rotulado (pesquisa jun/2026).
export function DestinoCard({ d, img, credito }) {
  const score = mundoScoreDestino(d);
  const custos = custoEstimadoDias(d);
  const tags = fitTagsDestino(d).slice(0, 3);
  const alerta = alertaHumanoDestino(d);

  return (
    <div className="relative group h-full">
      <FavoriteButton code={d.code} nome={d.nome} className="absolute top-2.5 right-2.5 z-10" />
      <Link
        href={`/destino/${d.slug}`}
        className="flex flex-col h-full rounded-2xl border border-line bg-card overflow-hidden hover:border-pine/40 hover:shadow-e2 transition focusring"
      >
        <div className="relative h-48">
          <Foto src={img ? wikiThumb(img, 500) : null} alt={d.nome} credito={credito} className="absolute inset-0" imgClassName="group-hover:scale-[1.03] transition duration-700" largura={500} altura={300} />
          <div className="absolute inset-x-0 bottom-0 h-20 photo-scrim pointer-events-none" aria-hidden />
          <span className="absolute bottom-2.5 left-3 coord text-white/90">{coordTexto(d.coords)}</span>
        </div>
        <div className="p-4 flex flex-col flex-1">
          <div className="eyebrow">{d.regiao}</div>
          <div className="mt-1 flex items-center justify-between gap-2">
            <h3 className="font-display text-[1.35rem] leading-tight text-ink flex items-center gap-2 min-w-0">
              {flagUrl(d.code) && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={flagUrl(d.code)} alt="" width="22" height="16" loading="lazy" className="rounded-[2px] ring-1 ring-line shrink-0" />
              )}
              <span className="truncate">{d.nome}</span>
            </h3>
            <span className="shrink-0 inline-flex items-baseline gap-1 rounded-md bg-pine/10 text-pine px-2 py-0.5" title="Mundo Score: compatibilidade geral (0–100)">
              <span className="font-mono text-[10px] tracking-wider">SCORE</span><span className="font-mono font-medium tnum">{score.total}</span>
            </span>
          </div>
          <p className="mt-1.5 text-sm text-inksoft leading-snug line-clamp-2">{alerta}</p>
          <div className="mt-3 grid grid-cols-3 gap-1.5">
            {custos.map((item) => (
              <span key={item.dias} className="rounded-md border border-line px-2 py-1 text-[11px] text-center text-inksoft font-mono tnum">
                <strong className="text-ink font-medium">{item.dias}d</strong> ${item.total}
              </span>
            ))}
          </div>
          <p className="mt-1.5 text-[10px] text-inksoft font-mono">US$ {d.custoDia}/dia · referência jun/2026</p>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {tags.map((tag) => (
              <span key={tag} className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-paper2 text-ink">{tag}</span>
            ))}
          </div>
          <span className="mt-auto pt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-pine">Ver se combina comigo <Icon name="arrow-right" size={15} /></span>
        </div>
      </Link>
    </div>
  );
}
