import Link from 'next/link';
import { Icon } from './Icon.jsx';

// Estado vazio padrão do design system. Componente único (antes havia um duplicado
// em _components/EmptyState.jsx) — superset que cobre os dois usos do app:
//   • simples:  title + subtitle + `action` (qualquer nó, ex.: botão com onClick)
//   • rico:     icon + title + subtitle + `actions` [{href,label,primary}] + children (bloco extra)
export function EmptyState({ icon = '🗺️', title, subtitle, actions = [], action, dashed = true, children }) {
  return (
    <div className={`rounded-2xl border ${dashed ? 'border-dashed' : ''} border-line bg-card p-8 sm:p-10 text-center`}>
      {icon && <div className="text-4xl mb-2" aria-hidden="true"><Icon emoji={icon} /></div>}
      {title && <p className="text-ink font-semibold text-lg">{title}</p>}
      {subtitle && <p className="text-inksoft text-sm mt-1 max-w-md mx-auto">{subtitle}</p>}
      {actions.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2 justify-center">
          {actions.map((a) => (
            <Link
              key={a.href + a.label}
              href={a.href}
              className={a.primary
                ? 'inline-flex items-center justify-center gap-1.5 rounded-xl bg-pine text-onpine font-semibold px-5 py-2.5 hover:bg-pinedk transition focusring'
                : 'inline-flex items-center justify-center gap-1.5 rounded-xl border border-line bg-card text-ink font-semibold px-5 py-2.5 hover:text-pine focusring'}
            >
              {a.label}
            </Link>
          ))}
        </div>
      )}
      {action && <div className="mt-4 flex justify-center gap-2">{action}</div>}
      {children && <div className="mt-6 text-left">{children}</div>}
    </div>
  );
}
