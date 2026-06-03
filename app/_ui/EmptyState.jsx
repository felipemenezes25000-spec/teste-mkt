// Estado vazio padronizado, com CTA opcional.
export function EmptyState({ icon = '🗺️', title, children, action }) {
  return (
    <div className="rounded-2xl border border-dashed border-line bg-card p-10 text-center">
      <div className="text-4xl mb-2" aria-hidden>{icon}</div>
      <p className="text-ink font-semibold">{title}</p>
      {children && <p className="text-inksoft text-sm mt-1 max-w-md mx-auto">{children}</p>}
      {action && <div className="mt-4 flex justify-center gap-2">{action}</div>}
    </div>
  );
}
