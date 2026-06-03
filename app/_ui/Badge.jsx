// Selo de status do Design System (substitui os StatusChip ad hoc).
const TONES = {
  neutral: 'bg-paper2 text-ink border-line',
  success: 'bg-success-bg text-success border-success-bd',
  warn: 'bg-warn-bg text-warn border-warn-bd',
  danger: 'bg-danger-bg text-danger border-danger-bd',
};

export function Badge({ tone = 'neutral', className = '', children }) {
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-medium ${TONES[tone]} ${className}`}>
      {children}
    </span>
  );
}
