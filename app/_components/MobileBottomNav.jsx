'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Icon } from '../_ui/Icon.jsx';
import { useIdioma } from '../_lib/i18n.js';
import { carregar, CHAVE } from '../_lib/viagens/store.js';

// Navegação inferior do celular (V5 F7): adaptativa ao momento da viagem. Quando há
// viagem em andamento (ou começando em até 3 dias), o atalho "Hoje" aparece e leva
// direto ao Modo Viagem. Respeita a safe area do iPhone e alvos de toque ≥ 44 px.
const hojeISO = () => new Date().toISOString().slice(0, 10);
const somaDias = (iso, n) => { const d = new Date(iso + 'T00:00:00Z'); d.setUTCDate(d.getUTCDate() + n); return d.toISOString().slice(0, 10); };

/** Viagem "do momento": em curso, senão a próxima que começa em até 3 dias. */
export function viagemDoMomento(viagens, hoje = hojeISO()) {
  const lista = viagens || [];
  const emCurso = lista.find((v) => v.inicio <= hoje && v.fim >= hoje);
  if (emCurso) return emCurso;
  const limite = somaDias(hoje, 3);
  return [...lista].filter((v) => v.inicio > hoje && v.inicio <= limite).sort((a, b) => a.inicio.localeCompare(b.inicio))[0] || null;
}

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
    <nav className="fixed bottom-0 inset-x-0 z-40 bg-card/95 backdrop-blur border-t border-line md:hidden no-print pb-[env(safe-area-inset-bottom)]" aria-label={t('nav2.mobile')}>
      <ul className="flex items-stretch justify-around max-w-lg mx-auto px-1">
        {itens.map((item) => {
          const ativo = item.ativoSe ? item.ativoSe.test(path) : path.startsWith(item.href);
          return (
            <li key={item.href} className="flex-1">
              <Link href={item.href} aria-current={ativo ? 'page' : undefined}
                className={`flex flex-col items-center justify-center gap-0.5 min-h-[56px] px-1 focusring rounded-lg transition-colors ${ativo ? 'text-pine' : 'text-inksoft hover:text-ink'}`}>
                <span className={`grid place-items-center w-9 h-7 rounded-full ${item.destaque ? 'bg-coral text-oncoral' : ''}`}><Icon name={item.icon} size={20} strokeWidth={ativo ? 2.2 : 1.75} /></span>
                <span className="text-[11px] font-semibold leading-none">{item.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
