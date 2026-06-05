export function HumanAlertCard({ tone = 'warn', title, children, cta }) {
  const toneClass = {
    success: 'border-success-bd bg-success-bg text-success',
    warn: 'border-warn-bd bg-warn-bg text-warn',
    danger: 'border-danger-bd bg-danger-bg text-danger',
    neutral: 'border-line bg-card text-pine',
  }[tone] || 'border-warn-bd bg-warn-bg text-warn';

  return (
    <div className={`rounded-2xl border p-4 ${toneClass}`}>
      <p className="text-xs uppercase tracking-wide font-bold">{title}</p>
      <div className="mt-1 text-sm text-ink leading-relaxed">{children}</div>
      {cta ? <div className="mt-3">{cta}</div> : null}
    </div>
  );
}
