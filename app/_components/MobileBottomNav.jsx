'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Icon } from '../_ui/Icon.jsx';
import { useIdioma } from '../_lib/i18n.js';
import { carregar, CHAVE } from '../_lib/viagens/store.js';
import { viagemDoMomento } from '../_lib/viagens/momento.js';

// Navegação inferior do celular (V5 F7): adaptativa ao momento da viagem. Quando há
// viagem em andamento (ou começando em até 3 dias), o atalho "Hoje" aparece e leva
// direto ao Modo Viagem. Respeita a safe area do iPhone e alvos de toque ≥ 44 px.
export function MobileBottomNav() {
  const path = usePathname() || '/';
  const { t } = useIdioma();
  const [atual, setAtual] = useState(null);

  useEffect(() => {
    const ler = () => setAtual(viagemDoMomento(carregar().viagens));
    ler();
    const onStorage = (e) => { if (e.key === CHAVE) ler(); };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, [path]);

  const itens = [
    { href: '/explorar', label: t('nav.descobrir'), icon: 'globe' },
    { href: '/decisao', label: t('nav.decidir'), icon: 'target' },
    atual
      ? { href: `/viagens/${atual.id}/hoje`, label: t('hoje.hoje'), icon: 'compass', destaque: true, ativoSe: /\/hoje$/ }
      : null,
    { href: '/viagens', label: t('nav2.viagens'), icon: 'suitcase', ativoSe: /^\/viagens(?!.*\/hoje$)/ },
    { href: '/salvos', label: t('nav2.salvos'), icon: 'heart' },
  ].filter(Boolean);

  return (
    <nav className="fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur border-t border-line md:hidden no-print pb-[env(safe-area-inset-bottom)]" aria-label={t('nav2.mobile')}>
      <ul className="flex items-stretch justify-around max-w-lg mx-auto px-1">
        {itens.map((item) => {
          const ativo = item.ativoSe ? item.ativoSe.test(path) : path.startsWith(item.href);
          return (
            <li key={item.href} className="flex-1">
              <Link href={item.href} aria-current={ativo ? 'page' : undefined}
                className={`flex flex-col items-center justify-center gap-1 min-h-[60px] px-1 focusring rounded-lg transition-colors ${ativo ? 'text-ink' : 'text-inksoft hover:text-ink'}`}>
                <span className={`grid place-items-center w-9 h-7 rounded-full ${item.destaque ? 'bg-coral text-oncoral' : ''}`}><Icon name={item.icon} size={21} strokeWidth={ativo ? 2.2 : 1.75} /></span>
                <span className="font-cond font-extrabold text-[12.5px] uppercase tracking-[.06em] leading-none">{item.label}</span>
                <span className={`h-1 w-7 rounded-full ${ativo ? 'bg-coral' : 'bg-transparent'}`} aria-hidden="true" />
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
