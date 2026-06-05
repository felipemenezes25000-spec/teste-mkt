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
        <div className="skel h-7 w-44 rounded" />
        <div className="ml-auto skel h-7 w-24 rounded" />
      </div>
      <div className="max-w-6xl mx-auto px-4 py-6 space-y-4">
        <div className="grid sm:grid-cols-3 gap-3">
          {[0, 1, 2].map((i) => <div key={i} className="skel h-20 rounded-xl" />)}
        </div>
        <div className="skel h-64 rounded-2xl" />
        <div className="grid sm:grid-cols-2 gap-3">
          {[0, 1].map((i) => <div key={i} className="skel h-28 rounded-xl" />)}
        </div>
      </div>
    </div>
  );
}
