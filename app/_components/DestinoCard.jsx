import Link from 'next/link';

// Card de destino reutilizado na home e no /explorar. img pode ser null (cai num
// gradiente). Server-safe (sem hooks/estado).
export function DestinoCard({ d, img }) {
  return (
    <Link
      href={`/destino/${d.slug}`}
      className="group rounded-2xl border border-line bg-card overflow-hidden hover:shadow-[var(--e-1)] hover:-translate-y-0.5 transition focusring"
    >
      <div className="relative h-40 bg-paper2 overflow-hidden">
        {img ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={img} alt={d.nome} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
        ) : (
          <div className="w-full h-full grid place-items-center bg-gradient-to-br from-pine/15 to-ochre/15 text-4xl" aria-hidden>🗺️</div>
        )}
        <span className="absolute top-2 left-2 text-[11px] font-semibold bg-ink/55 text-white px-2 py-0.5 rounded-full">{d.regiao}</span>
      </div>
      <div className="p-3.5">
        <div className="flex items-center justify-between gap-2">
          <h3 className="font-display text-lg text-ink truncate">{d.nome}</h3>
          <span className="text-xs text-inksoft tnum shrink-0">~US$ {d.custoDia}/dia</span>
        </div>
        <p className="mt-0.5 text-xs text-inksoft line-clamp-1">{d.estacao}</p>
        <span className="mt-2 inline-block text-sm font-semibold text-pine">Ver destino →</span>
      </div>
    </Link>
  );
}
