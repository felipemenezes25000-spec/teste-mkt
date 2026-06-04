'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ThemeToggle } from '../_ui/ThemeToggle.jsx';

// Navegação global das telas de produto (marketing/explorar/destino/roteiro/voos/
// planos). O planner (/planejar) tem o próprio cabeçalho com as ações da viagem.
const LINKS = [
  { href: '/explorar', label: 'Explorar', icon: '🧭' },
  { href: '/planejar', label: 'Planejar', icon: '🗺️' },
  { href: '/roteiro', label: 'Roteiro IA', icon: '✨' },
  { href: '/voos', label: 'Voos', icon: '✈' },
  { href: '/planos', label: 'Planos', icon: '⭐' },
];

export default function AppNav() {
  const path = usePathname() || '/';
  return (
    <header className="sticky top-0 z-40 backdrop-blur bg-paper/80 border-b border-line">
      <nav className="max-w-6xl mx-auto px-3 sm:px-6 h-14 flex items-center gap-2">
        <Link href="/" aria-label="Mundo Sem Fim — início" className="flex items-center gap-2 mr-1 shrink-0 focusring rounded-lg">
          <span className="w-9 h-9 rounded-xl bg-pine text-white grid place-items-center font-display text-lg shadow-md" aria-hidden>∞</span>
          <span className="font-display text-lg text-ink leading-none hidden md:block">Mundo Sem Fim</span>
        </Link>
        <div className="flex items-center gap-0.5 overflow-x-auto no-scrollbar ml-auto">
          {LINKS.map((l) => {
            const active = path === l.href || path.startsWith(l.href + '/');
            return (
              <Link
                key={l.href} href={l.href} aria-current={active ? 'page' : undefined}
                className={`px-3 py-1.5 rounded-lg text-sm font-semibold whitespace-nowrap transition focusring ${active ? 'bg-card text-pine shadow-sm' : 'text-inksoft hover:text-ink'}`}
              >
                <span aria-hidden className="mr-1">{l.icon}</span>{l.label}
              </Link>
            );
          })}
        </div>
        <ThemeToggle className="shrink-0 ml-1" />
      </nav>
    </header>
  );
}
