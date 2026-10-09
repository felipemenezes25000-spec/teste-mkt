'use client';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { GlobalSearch } from './GlobalSearch.jsx';
import { BuscaCompacta } from './BuscaCompacta.jsx';
import { MobileMenu } from './MobileMenu.jsx';
import { IdiomaSwitcher } from './IdiomaSwitcher.jsx';
import { useIdioma } from '../_lib/i18n.js';
import { Icon } from '../_ui/Icon.jsx';
import { Marca } from '../_ui/Marca.jsx';

// Navegação global CALÇADÃO. Arquitetura (OMEGA V4 §9/§30): quatro destinos
// principais que seguem a jornada — Explorar → Decidir → Planejar → Viagens —,
// ferramentas agrupadas num menu e ações pessoais à direita.
const PRIMARIOS = [
  { href: '/explorar', i18nKey: 'nav.descobrir', fallback: 'Explorar', icon: 'globe' },
  { href: '/decisao', i18nKey: 'nav.decidir', fallback: 'Decidir', icon: 'target' },
  { href: '/planejar', i18nKey: 'nav.planejar', fallback: 'Planejar', icon: 'route' },
  { href: '/viagens', i18nKey: 'nav2.viagens', fallback: 'Viagens', icon: 'suitcase' },
];
const FERRAMENTAS = [
  { href: '/comparar', i18nKey: 'nav2.l_comparar', fallback: 'Comparar destinos', icon: 'scale', descKey: 'nav2.d_comparar' },
  { href: '/custo-real', i18nKey: 'nav2.l_custo', fallback: 'Custo real', icon: 'receipt', descKey: 'nav2.d_custo' },
  { href: '/voos', i18nKey: 'nav2.l_voos', fallback: 'Voos', icon: 'plane', descKey: 'nav2.d_voos' },
  { href: '/roteiro', i18nKey: 'nav2.l_roteiro', fallback: 'Roteiro com IA', icon: 'spark', descKey: 'nav2.d_roteiro' },
  { href: '/marketplace', i18nKey: 'plat.l_mk', fallback: 'Marketplace', icon: 'compass', descKey: 'plat.d_mk' },
  { href: '/agencias', i18nKey: 'plat.l_ag', fallback: 'Para agências', icon: 'flag', descKey: 'plat.d_ag' },
  { href: '/desenvolvedores', i18nKey: 'plat.l_dev', fallback: 'API pública', icon: 'key', descKey: 'plat.d_dev' },
  { href: '/planos', i18nKey: 'nav2.l_planos', fallback: 'Planos', icon: 'star', descKey: 'nav2.d_planos' },
];
const ativo = (path, href) => path === href || path.startsWith(href + '/');

function MenuFerramentas({ itens, path, rotulo }) {
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
        className={`inline-flex items-center gap-1.5 py-1.5 border-b-[3px] font-cond font-bold text-[17px] uppercase tracking-[.06em] transition focusring ${algumAtivo || aberto ? 'border-coral text-ink' : 'border-transparent text-ink hover:border-coral'}`}
      >
        {rotulo} <Icon name="chevron-down" size={14} className={`transition ${aberto ? 'rotate-180' : ''}`} />
      </button>
      {aberto && (
        <div id="menu-ferramentas" className="absolute right-0 mt-3 w-80 rounded-2xl border border-line bg-card shadow-e2 p-2 rise">
          {itens.map((l) => (
            <Link key={l.href} href={l.href} aria-current={ativo(path, l.href) ? 'page' : undefined}
              className={`flex items-start gap-3 rounded-xl px-3 py-2.5 focusring ${ativo(path, l.href) ? 'bg-paper2' : 'hover:bg-paper2'}`}>
              <span className={`mt-0.5 w-9 h-9 rounded-lg grid place-items-center shrink-0 ${ativo(path, l.href) ? 'bg-coral text-ink' : 'bg-paper2 text-ink'}`}><Icon name={l.icon} size={18} /></span>
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
    const d = l.descKey ? t(l.descKey) : '';
    return { ...l, label: v && v !== l.i18nKey ? v : l.fallback, desc: d && d !== l.descKey ? d : l.desc };
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
        const [{ carregarPlano, ehPlanoExemplo }, { calcular }, { escanearOportunidades }] = await Promise.all([
          import('../_engine/storage.js'),
          import('../_engine/calc.js'),
          import('../_engine/oportunidades.js'),
        ]);
        const plano = carregarPlano();
        if (ehPlanoExemplo(plano)) return; // rota de exemplo não gera alerta para ninguém
        const ops = escanearOportunidades(calcular(plano));
        if (vivo) setAlerta(ops.filter((o) => o.prioridade === 'P0').length);
      } catch { /* sem alerta */ }
    })();
    return () => { vivo = false; };
  }, [path]);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-line">
      <nav className="max-w-7xl mx-auto px-3 sm:px-6 h-[72px] flex items-center gap-2 sm:gap-3" aria-label="Principal">
        <Link href="/" aria-label="Mundo Sem Fim — início" className="shrink-0 focusring rounded-lg mr-3">
          <Marca size={38} wordmarkClassName="hidden min-[400px]:inline" />
        </Link>

        <div className="hidden lg:flex items-center gap-6 ml-4">
          {primarios.map((l) => {
            const a = ativo(path, l.href);
            return (
              <Link key={l.href} href={l.href} aria-current={a ? 'page' : undefined}
                className={`inline-flex items-center gap-2 py-1.5 border-b-[3px] font-cond font-bold text-[17px] uppercase tracking-[.06em] transition focusring ${a ? 'border-coral text-ink' : 'border-transparent text-ink hover:border-coral'}`}>
                {l.label}
              </Link>
            );
          })}
          <MenuFerramentas itens={ferramentas} path={path} rotulo={t('nav2.ferramentas')} />
        </div>

        <div className="hidden 2xl:block ml-auto"><GlobalSearch /></div>

        <div className="flex items-center gap-1 ml-auto 2xl:ml-2 shrink-0">
          <div className="2xl:hidden"><BuscaCompacta /></div>
          {alerta > 0 && (
            <Link href="/decisao" aria-label={`${alerta} alerta(s) na sua rota`}
              title="Sua rota tem alertas (visto/orçamento) que podem estragar a viagem"
              className="inline-flex items-center gap-1.5 rounded-full bg-danger-bg text-danger border border-danger-bd px-3 h-10 text-sm font-bold focusring">
              <Icon name="alert" size={15} /> {alerta}
            </Link>
          )}
          <Link href="/salvos" aria-label={t('nav2.salvos')} aria-current={ativo(path, '/salvos') ? 'page' : undefined}
            className={`hidden sm:grid w-10 h-10 place-items-center rounded-full focusring ${ativo(path, '/salvos') ? 'bg-coral text-ink' : 'text-ink hover:bg-paper2'}`}>
            <Icon name="heart" size={19} />
          </Link>
          <IdiomaSwitcher />
          <Link href="/conta" aria-current={ativo(path, '/conta') ? 'page' : undefined}
            className="hidden sm:inline-flex ms-btn ms-btn-linha ms-btn-sm ml-1 focusring">
            {t('nav.entrar') && t('nav.entrar') !== 'nav.entrar' ? t('nav.entrar') : 'Entrar'}
          </Link>
          <button type="button" onClick={() => setMenuOpen(true)} aria-label={t('nav2.abrirMenu')} aria-haspopup="dialog"
            aria-expanded={menuOpen} aria-controls="mobile-menu"
            className="lg:hidden w-11 h-11 grid place-items-center rounded-full text-ink hover:bg-paper2 focusring">
            <Icon name="menu" size={22} />
          </button>
        </div>
      </nav>
      {menuOpen && (
        <MobileMenu
          links={[...primarios, ...ferramentas, { href: '/salvos', label: t('nav2.salvos'), icon: 'heart' }, { href: '/conta', label: t('nav2.conta'), icon: 'user' }]}
          path={path} onClose={() => setMenuOpen(false)}
        />
      )}
    </header>
  );
}
