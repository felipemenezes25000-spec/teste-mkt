'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ThemeToggle } from '../_ui/ThemeToggle.jsx';

// Navegação global das telas de produto (marketing/explorar/destino/roteiro/voos/
// planos). O planner (/planejar) tem o próprio cabeçalho com as ações da viagem.
const LINKS = [
  { href: '/explorar', label: 'Explorar', icon: '🧭' },
  { href: '/decisao', label: 'Decisão', icon: '🧠' },
  { href: '/planejar', label: 'Planejar', icon: '🗺️' },
  { href: '/roteiro', label: 'Roteiro IA', icon: '✨' },
  { href: '/voos', label: 'Voos', icon: '✈' },
  { href: '/salvos', label: 'Salvos', icon: '♥' },
  { href: '/planos', label: 'Planos', icon: '⭐' },
];

export default function AppNav() {
  const path = usePathname() || '/';
  const [alerta, setAlerta] = useState(0);

  // Alerta "que salva a viagem": conta problemas P0 (furo de visto / orçamento
  // estoura) da rota SALVA do usuário. Motor carregado sob demanda (não infla o
  // bundle das páginas leves). Silencioso se não houver plano salvo.
  useEffect(() => {
    let vivo = true;
    (async () => {
      try {
        if (!localStorage.getItem('mundosemfim.plan.v3')) return; // só o plano do usuário
        const [{ carregarPlano }, { calcular }, { escanearOportunidades }] = await Promise.all([
          import('../_engine/storage.js'),
          import('../_engine/calc.js'),
          import('../_engine/oportunidades.js'),
        ]);
        const ops = escanearOportunidades(calcular(carregarPlano()));
        const urgentes = ops.filter((o) => o.prioridade === 'P0').length;
        if (vivo) setAlerta(urgentes);
      } catch { /* sem alerta */ }
    })();
    return () => { vivo = false; };
  }, [path]);

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
        {alerta > 0 && (
          <Link
            href="/decisao" aria-label={`${alerta} alerta(s) na sua rota`}
            title="Sua rota tem alertas (visto/orçamento) que podem estragar a viagem"
            className="shrink-0 ml-1 inline-flex items-center gap-1 rounded-lg bg-danger-bg text-danger border border-danger-bd px-2 py-1 text-xs font-bold focusring"
          >
            ⚠ {alerta}
          </Link>
        )}
        <ThemeToggle className="shrink-0 ml-1" />
      </nav>
    </header>
  );
}
