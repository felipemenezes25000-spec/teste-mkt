// Botão do Design System. Variants e tamanhos padronizados, com estado loading/disabled.
const SIZES = { sm: 'text-xs px-3 h-8', md: 'text-sm px-4 h-10', lg: 'text-base px-5 h-12' };
const VARIANTS = {
  primary: 'bg-pine text-onpine hover:bg-pinedk',
  secondary: 'border border-line bg-card text-ink hover:border-pine/50',
  ghost: 'text-inksoft hover:text-ink',
  danger: 'border border-danger-bd bg-danger-bg text-danger hover:brightness-95',
  accent: 'bg-coral text-oncoral hover:brightness-95',
};

export function Button({ variant = 'primary', size = 'md', loading = false, className = '', children, ...props }) {
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition focusring disabled:opacity-50 disabled:cursor-not-allowed ${SIZES[size]} ${VARIANTS[variant]} ${className}`}
      aria-busy={loading || undefined}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading && <span className="inline-block w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" aria-hidden />}
      {children}
    </button>
  );
}
