'use client';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ThemeToggle } from '../_ui/ThemeToggle.jsx';
import { GlobalSearch } from './GlobalSearch.jsx';
import { BuscaCompacta } from './BuscaCompacta.jsx';
import { MobileMenu } from './MobileMenu.jsx';
import { IdiomaSwitcher } from './IdiomaSwitcher.jsx';
import { useIdioma } from '../_lib/i18n.js';
import { Icon } from '../_ui/Icon.jsx';
import { Marca } from '../_ui/Marca.jsx';

// Navegação global MERIDIANO. Arquitetura (OMEGA V4 §9/§30): quatro destinos
// principais que seguem a jornada — Explorar → Decidir → Planejar → Viagens —,
// ferramentas agrupadas num menu e ações pessoais à direita.
const PRIMARIOS = [
  { href: '/explorar', i18nKey: 'nav.descobrir', fallback: 'Explorar', icon: 'globe' },
  { href: '/decisao', i18nKey: 'nav.decidir', fallback: 'Decidir', icon: 'target' },
  { href: '/planejar', i18nKey: 'nav.planejar', fallback: 'Planejar', icon: 'route' },
  { href: '/viagens', i18nKey: 'nav.viagens', fallback: 'Viagens', icon: 'suitcase' },
];
const FERRAMENTAS = [
  { href: '/comparar', i18nKey: 'nav.comparar', fallback: 'Comparar destinos', icon: 'scale', desc: 'Matriz lado a lado com pesos' },
  { href: '/custo-real', i18nKey: 'nav.custoReal', fallback: 'Custo real', icon: 'receipt', desc: 'Quanto a viagem custa de verdade' },
  { href: '/voos', i18nKey: 'nav.voos', fallback: 'Voos', icon: 'plane', desc: 'Score do voo e janela de compra' },
  { href: '/roteiro', i18nKey: 'nav.roteiro', fallback: 'Roteiro com IA', icon: 'spark', desc: 'Dia a dia gerado e explicado' },
  { href: '/planos', i18nKey: 'nav.precos', fallback: 'Planos', icon: 'star', desc: 'Grátis, Premium e Pro' },
];
const ativo = (path, href) => path === href || path.startsWith(href + '/');

function MenuFerramentas({ itens, path }) {
  const [aberto, setAberto] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    if (!aberto) return;
    const fora = (e) => { if (ref.current && !ref.current.contains(e.target)) setAberto(false); };
    const esc = (e) => { if (e.key === 'Escape') setAberto(false); };
    document.addEventListener('mousedown', fora);
    document.addEventListener('keydown', esc);
    return () => { document.removeEventListener('mousedown', fora); document.removeEventListener('keydown', esc); };
  }, [aberto]);
  useEffect(() => { setAberto(false); }, [path]);
  const algumAtivo = itens.some((l) => ativo(path, l.href));
  return (
    <div ref={ref} className="relative">
      <button
        type="button" onClick={() => setAberto((v) => !v)} aria-expanded={aberto} aria-controls="menu-ferramentas"
        className={`inline-flex items-center gap-1.5 px-3 h-9 rounded-lg text-sm font-medium transition focusring ${algumAtivo ? 'text-ink bg-card shadow-e1' : 'text-inksoft hover:text-ink'}`}
      >
        Ferramentas <Icon name="chevron-down" size={14} className={`transition ${aberto ? 'rotate-180' : ''}`} />
      </button>
      {aberto && (
        <div id="menu-ferramentas" className="absolute right-0 mt-2 w-80 rounded-xl border border-line bg-card shadow-e2 p-1.5 rise">
          {itens.map((l) => (
            <Link key={l.href} href={l.href} aria-current={ativo(path, l.href) ? 'page' : undefined}
              className={`flex items-start gap-3 rounded-lg px-3 py-2.5 focusring ${ativo(path, l.href) ? 'bg-paper2' : 'hover:bg-paper2'}`}>
              <span className="mt-0.5 w-8 h-8 rounded-md bg-pine/10 text-pine grid place-items-center shrink-0"><Icon name={l.icon} size={17} /></span>
              <span className="min-w-0">
                <span className="block text-sm font-semibold text-ink">{l.label}</span>
                <span className="block text-xs text-inksoft">{l.desc}</span>
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default function AppNav() {
  const path = usePathname() || '/';
  const [alerta, setAlerta] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const { t } = useIdioma();
  const trad = (l) => {
    const v = t(l.i18nKey);
    return { ...l, label: v && v !== l.i18nKey ? v : l.fallback };
  };
  const primarios = PRIMARIOS.map(trad);
  const ferramentas = FERRAMENTAS.map(trad);

  useEffect(() => { setMenuOpen(false); }, [path]);

  // Alerta que salva a viagem: P0 (furo de visto / orçamento estoura) do plano salvo.
  useEffect(() => {
    let vivo = true;
    (async () => {
      try {
        if (!localStorage.getItem('mundosemfim.plan.v3')) return;
        const [{ carregarPlano }, { calcular }, { escanearOportunidades }] = await Promise.all([
          import('../_engine/storage.js'),
          import('../_engine/calc.js'),
          import('../_engine/oportunidades.js'),
        ]);
        const ops = escanearOportunidades(calcular(carregarPlano()));
        if (vivo) setAlerta(ops.filter((o) => o.prioridade === 'P0').length);
      } catch { /* sem alerta */ }
    })();
    return () => { vivo = false; };
  }, [path]);

  return (
    <header className="sticky top-0 z-40 bg-paper/85 backdrop-blur-md border-b border-line">
      <nav className="max-w-7xl mx-auto px-3 sm:px-6 h-16 flex items-center gap-2 sm:gap-3" aria-label="Principal">
        <Link href="/" aria-label="Mundo Sem Fim — início" className="shrink-0 focusring rounded-lg mr-2">
          <Marca size={34} wordmarkClassName="hidden min-[400px]:inline" />
        </Link>

        <div className="hidden lg:flex items-center gap-1">
          {primarios.map((l) => {
            const a = ativo(path, l.href);
            return (
              <Link key={l.href} href={l.href} aria-current={a ? 'page' : undefined}
                className={`relative inline-flex items-center gap-2 px-3 h-9 rounded-lg text-sm font-medium transition focusring ${a ? 'text-ink bg-card shadow-e1' : 'text-inksoft hover:text-ink'}`}>
                <Icon name={l.icon} size={16} className={`hidden xl:inline-block ${a ? 'text-pine' : ''}`} />
                {l.label}
                {a && <span className="absolute -bottom-[13px] left-3 right-3 h-[2px] bg-pine rounded-full" aria-hidden />}
              </Link>
            );
          })}
          <MenuFerramentas itens={ferramentas} path={path} />
        </div>

        <div className="hidden 2xl:block ml-auto"><GlobalSearch /></div>

        <div className="flex items-center gap-1 ml-auto 2xl:ml-2 shrink-0">
          <div className="2xl:hidden"><BuscaCompacta /></div>
          {alerta > 0 && (
            <Link href="/decisao" aria-label={`${alerta} alerta(s) na sua rota`}
              title="Sua rota tem alertas (visto/orçamento) que podem estragar a viagem"
              className="inline-flex items-center gap-1.5 rounded-lg bg-danger-bg text-danger border border-danger-bd px-2.5 h-9 text-xs font-bold focusring">
              <Icon name="alert" size={15} /> {alerta}
            </Link>
          )}
          <Link href="/salvos" aria-label="Salvos" aria-current={ativo(path, '/salvos') ? 'page' : undefined}
            className={`hidden sm:grid w-9 h-9 place-items-center rounded-lg focusring ${ativo(path, '/salvos') ? 'text-pine bg-card' : 'text-inksoft hover:text-ink'}`}>
            <Icon name="heart" size={18} />
          </Link>
          <IdiomaSwitcher />
          <ThemeToggle />
          <Link href="/conta" aria-current={ativo(path, '/conta') ? 'page' : undefined}
            className="hidden sm:inline-flex items-center gap-2 h-9 px-3 rounded-lg border border-line bg-card text-sm font-medium text-ink hover:border-pine/50 focusring">
            <Icon name="user" size={16} /> {t('nav.entrar') && t('nav.entrar') !== 'nav.entrar' ? t('nav.entrar') : 'Entrar'}
          </Link>
          <button type="button" onClick={() => setMenuOpen(true)} aria-label="Abrir menu" aria-haspopup="dialog"
            aria-expanded={menuOpen} aria-controls="mobile-menu"
            className="lg:hidden w-11 h-11 grid place-items-center rounded-lg text-ink hover:bg-paper2 focusring">
            <Icon name="menu" size={22} />
          </button>
        </div>
      </nav>
      {menuOpen && (
        <MobileMenu
          links={[...primarios, ...ferramentas, { href: '/salvos', label: 'Salvos', icon: 'heart' }, { href: '/conta', label: 'Conta', icon: 'user' }]}
          path={path} onClose={() => setMenuOpen(false)}
        />
      )}
    </header>
  );
}
