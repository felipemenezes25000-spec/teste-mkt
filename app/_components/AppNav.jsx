'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ThemeToggle } from '../_ui/ThemeToggle.jsx';
import { GlobalSearch } from './GlobalSearch.jsx';
import { MobileMenu } from './MobileMenu.jsx';

// Navegação global das telas de produto (marketing/explorar/destino/roteiro/voos/
// planos). O planner (/planejar) tem o próprio cabeçalho com as ações da viagem.
const LINKS = [
  { href: '/explorar', label: 'Descobrir' },
  { href: '/decisao', label: 'Decidir' },
  { href: '/comparar', label: 'Comparar' },
  { href: '/custo-real', label: 'Custo real' },
  { href: '/roteiro', label: 'Roteiro' },
  { href: '/planos', label: 'Preços' },
];

const SECONDARY_LINKS = [
  { href: '/planejar', label: 'Planejar' },
  { href: '/voos', label: 'Voos' },
  { href: '/salvos', label: 'Salvos' },
  { href: '/conta', label: 'Entrar' },
];

export default function AppNav() {
  const path = usePathname() || '/';
  const [alerta, setAlerta] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);

  // Fecha o menu mobile ao navegar (inclui a busca global, que faz router.push).
  useEffect(() => { setMenuOpen(false); }, [path]);

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
        <div className="hidden lg:block shrink-0"><GlobalSearch /></div>
        {/* Links completos só no desktop (lg+); no mobile viram o menu hambúrguer. */}
        <div className="hidden lg:flex items-center gap-0.5 ml-auto">
          {LINKS.map((l) => {
            const active = path === l.href || path.startsWith(l.href + '/');
            return (
              <Link
                key={l.href} href={l.href} aria-current={active ? 'page' : undefined}
                className={`px-3 py-1.5 rounded-lg text-sm font-semibold whitespace-nowrap transition focusring ${active ? 'bg-card text-pine shadow-sm' : 'text-inksoft hover:text-ink'}`}
              >
                {l.label}
              </Link>
            );
          })}
          <span className="mx-1 h-5 w-px bg-line" aria-hidden />
          {SECONDARY_LINKS.map((l) => {
            const active = path === l.href || path.startsWith(l.href + '/');
            return (
              <Link
                key={l.href} href={l.href} aria-current={active ? 'page' : undefined}
                className={`px-2.5 py-1.5 rounded-lg text-sm font-semibold whitespace-nowrap transition focusring ${active ? 'bg-card text-pine shadow-sm' : 'text-inksoft hover:text-ink'}`}
              >
                {l.label}
              </Link>
            );
          })}
        </div>
        {/* Controles à direita. ml-auto empurra o grupo no mobile (links escondidos). */}
        <div className="flex items-center gap-1 ml-auto lg:ml-1 shrink-0">
          {alerta > 0 && (
            <Link
              href="/decisao" aria-label={`${alerta} alerta(s) na sua rota`}
              title="Sua rota tem alertas (visto/orçamento) que podem estragar a viagem"
              className="inline-flex items-center gap-1 rounded-lg bg-danger-bg text-danger border border-danger-bd px-2 py-1 text-xs font-bold focusring"
            >
              ⚠ {alerta}
            </Link>
          )}
          <ThemeToggle />
          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            aria-label="Abrir menu"
            aria-haspopup="dialog"
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            className="lg:hidden w-11 h-11 grid place-items-center rounded-lg text-ink hover:bg-paper2 focusring text-xl leading-none"
          >
            ☰
          </button>
        </div>
      </nav>
      {menuOpen && <MobileMenu links={[...LINKS, ...SECONDARY_LINKS]} path={path} onClose={() => setMenuOpen(false)} />}
    </header>
  );
}
