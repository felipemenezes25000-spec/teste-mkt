// Marca CALÇADÃO: quadrado de tinta com as ondas do calçadão de Copacabana e o sol
// amarelo da próxima viagem. SVG inline (sem fonte/emoji), herda tamanho; o wordmark
// "mundo sem fim" (League Spartan, minúsculas) é opcional.
export function MarcaIcone({ size = 32, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" className={className} aria-hidden="true">
      <rect width="40" height="40" rx="4" fill="#111111" />
      <path d="M0 26 C 6 18, 14 18, 20 26 S 34 34, 40 26 V40 H0Z" fill="#FFFFFF" />
      <path d="M0 14 C 6 6, 14 6, 20 14 S 34 22, 40 14 V20 C 34 28, 26 28, 20 20 S 6 12, 0 20Z" fill="#FFFFFF" />
      <circle cx="31" cy="9" r="5" fill="#FFC400" />
    </svg>
  );
}

export function Marca({ size = 32, wordmark = true, className = '', wordmarkClassName = '' }) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <MarcaIcone size={size} />
      {wordmark && (
        <span className={`font-display font-extrabold text-[1.32rem] leading-none text-ink tracking-[-.03em] ${wordmarkClassName}`}>
          mundo sem fim
        </span>
      )}
    </span>
  );
}
