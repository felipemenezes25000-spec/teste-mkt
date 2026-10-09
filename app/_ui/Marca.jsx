// Marca MERIDIANO: globo (círculo + meridiano) com o ponto LIMA da próxima parada.
// SVG inline (sem fonte/emoji), herda tamanho; o wordmark é opcional.
export function MarcaIcone({ size = 32, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" className={className} aria-hidden="true">
      <rect width="64" height="64" rx="14" fill="rgb(var(--c-ink))" />
      <circle cx="31" cy="33" r="17" fill="none" stroke="rgb(var(--c-paper))" strokeWidth="3.4" />
      <ellipse cx="31" cy="33" rx="7" ry="17" fill="none" stroke="rgb(var(--c-paper))" strokeWidth="3.4" />
      <circle cx="45.5" cy="18.5" r="6.5" fill="rgb(var(--c-coral))" stroke="rgb(var(--c-ink))" strokeWidth="3" />
    </svg>
  );
}

export function Marca({ size = 32, wordmark = true, className = '', wordmarkClassName = '' }) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <MarcaIcone size={size} />
      {wordmark && (
        <span className={`font-display text-[1.05rem] leading-none text-ink tracking-tighter ${wordmarkClassName}`}>
          Mundo<span className="text-inksoft font-medium"> Sem </span>Fim
        </span>
      )}
    </span>
  );
}
