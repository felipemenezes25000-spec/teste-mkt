// Selo de status do Design System (substitui os StatusChip ad hoc).
const TONES = {
  neutral: 'bg-paper2 text-ink border-line',
  success: 'bg-[#E7F1EA] text-[#1f6b48] border-[#bfe0cd]',
  warn: 'bg-[#F7EDD6] text-[#8a5e12] border-[#e7d3a3]',
  danger: 'bg-[#F6E2DB] text-[#9a3b27] border-[#e7c1b6]',
};

export function Badge({ tone = 'neutral', className = '', children }) {
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-medium ${TONES[tone]} ${className}`}>
      {children}
    </span>
  );
}
