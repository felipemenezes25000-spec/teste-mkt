// Botão do Design System CALÇADÃO: pílula em Barlow Condensed caixa-alta.
// primary = tinta (preto) · accent = amarelo-álbum com degrau · secondary = contorno.
const SIZES = { sm: 'text-[15px] px-4 h-10', md: 'text-[17px] px-5 h-12', lg: 'text-[19px] px-6 h-[54px]' };
const VARIANTS = {
  primary: 'bg-ink text-white hover:bg-ink/85',
  secondary: 'border-2 border-ink bg-card text-ink hover:bg-paper2',
  ghost: 'text-inksoft hover:text-ink',
  danger: 'border-2 border-danger-bd bg-danger-bg text-danger hover:brightness-95',
  accent: 'bg-coral text-oncoral shadow-[0_4px_0_rgb(var(--c-amarelo-dk))] hover:brightness-105 active:translate-y-[3px] active:shadow-[0_1px_0_rgb(var(--c-amarelo-dk))]',
};

export function Button({ variant = 'primary', size = 'md', loading = false, className = '', children, ...props }) {
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 rounded-full font-cond font-extrabold uppercase tracking-[.05em] transition focusring disabled:opacity-50 disabled:cursor-not-allowed ${SIZES[size]} ${VARIANTS[variant]} ${className}`}
      aria-busy={loading || undefined}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading && <span className="inline-block w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" aria-hidden />}
      {children}
    </button>
  );
}
