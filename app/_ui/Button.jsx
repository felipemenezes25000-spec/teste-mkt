// Botão do Design System. Variants e tamanhos padronizados, com estado loading/disabled.
const SIZES = { sm: 'text-xs px-3 py-1.5', md: 'text-sm px-4 py-2', lg: 'text-base px-5 py-2.5' };
const VARIANTS = {
  primary: 'bg-pine text-white hover:bg-pinedk shadow-sm',
  secondary: 'border border-line bg-card text-inksoft hover:text-pine',
  ghost: 'text-inksoft hover:text-pine',
  danger: 'border border-clay/40 bg-white text-clay hover:bg-clay/5',
  accent: 'bg-ochre text-ink shadow-md hover:brightness-95',
};

export function Button({ variant = 'primary', size = 'md', loading = false, className = '', children, ...props }) {
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition focusring disabled:opacity-50 disabled:cursor-not-allowed ${SIZES[size]} ${VARIANTS[variant]} ${className}`}
      aria-busy={loading || undefined}
      {...props}
    >
      {loading && <span className="inline-block w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin opacity-70" aria-hidden />}
      {children}
    </button>
  );
}
