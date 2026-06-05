// Blocos de carregamento (shimmer via .skel do globals.css, que respeita
// prefers-reduced-motion). Substituem o "Carregando…" cru por algo que parece o
// produto montando — não quebrado. Apresentacionais puros (server-safe).

export function Skeleton({ className = '' }) {
  return <div className={`skel rounded-lg ${className}`} aria-hidden="true" />;
}

// Grade de cards (espelha a grade de DestinoCard) — salvos/explorar/comparar.
export function CardsSkeleton({ n = 8 }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4" role="status" aria-label="Carregando destinos" aria-busy="true">
      {Array.from({ length: n }).map((_, i) => (
        <div key={i} className="rounded-2xl border border-line bg-card overflow-hidden">
          <div className="skel h-40" />
          <div className="p-3.5 space-y-2">
            <div className="skel h-5 w-2/3 rounded" />
            <div className="skel h-3 w-1/2 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}

// Formulário (label + campo) — widgets de decisão/roteiro enquanto hidratam.
export function FormSkeleton({ rows = 4, className = 'mt-6' }) {
  return (
    <div className={`rounded-2xl border border-line bg-card p-5 space-y-3 ${className}`} role="status" aria-label="Carregando" aria-busy="true">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="space-y-1.5">
          <div className="skel h-3 w-24 rounded" />
          <div className="skel h-10 w-full rounded-lg" />
        </div>
      ))}
    </div>
  );
}

// Shell do planejador (cabeçalho + tripé + mapa) enquanto o SPA client carrega.
export function AppSkeleton() {
  return (
    <div className="min-h-screen" role="status" aria-label="Carregando o planejador" aria-busy="true">
      <div className="border-b border-line bg-card px-4 py-3 flex items-center gap-3">
        <div>
          <div className="font-display text-xl text-ink">Planejador de rota</div>
          <div className="text-xs text-inksoft">Montando mapa, custo real e alertas de cansaço…</div>
        </div>
        <div className="ml-auto skel h-8 w-28 rounded-xl" />
      </div>
      <div className="max-w-6xl mx-auto px-4 py-6 space-y-4">
        <div className="grid lg:grid-cols-[0.9fr_1.3fr_0.85fr] gap-4 items-start">
          <div className="space-y-3">
            <div className="rounded-2xl border border-line bg-card p-4">
              <div className="skel h-5 w-32 rounded" />
              <div className="mt-4 space-y-2">
                {[0, 1, 2, 3].map((index) => <div key={index} className="skel h-14 rounded-xl" />)}
              </div>
            </div>
          </div>
          <div className="rounded-3xl border border-line bg-card p-4">
            <div className="skel h-[420px] rounded-2xl" />
          </div>
          <div className="space-y-3">
            <div className="rounded-2xl border border-line bg-card p-4">
              <div className="skel h-5 w-28 rounded" />
              <div className="mt-4 skel h-24 rounded-xl" />
            </div>
            <div className="rounded-2xl border border-warn-bd bg-warn-bg p-4">
              <p className="text-xs uppercase tracking-wide text-warn font-bold">Opinião da rota</p>
              <p className="mt-1 text-sm text-ink">Se tiver cidades demais para poucos dias, eu vou te avisar antes da viagem virar mala e check-in.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
