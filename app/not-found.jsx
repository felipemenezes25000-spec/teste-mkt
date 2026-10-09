import Link from 'next/link';
import { Icon } from './_ui/Icon.jsx';
import { MarcaIcone } from './_ui/Marca.jsx';

export const metadata = { title: 'Página não encontrada · Mundo Sem Fim' };

// 404 MERIDIANO (fora do layout de marketing → marca e atalhos inline). Ação útil,
// nunca erro genérico (OMEGA V4 §75 "404 / fallback").
const ATALHOS = [
  { href: '/', label: 'Voltar ao início', icon: 'home', primary: true },
  { href: '/explorar', label: 'Explorar o mapa', icon: 'globe' },
  { href: '/decisao', label: 'Decidir a viagem', icon: 'target' },
];

export default function NotFound() {
  return (
    <main className="min-h-screen grid place-items-center bg-paper px-6 py-16 text-center">
      <div className="max-w-lg">
        <MarcaIcone size={56} className="mx-auto" />
        <p className="mt-8 coord text-inksoft">00°00′00″ N · 00°00′00″ E — fora do mapa</p>
        <p className="mt-2 font-display text-8xl tracking-tightest text-ink leading-none">404</p>
        <h1 className="mt-4 font-display text-3xl tracking-tighter text-ink">Esse caminho não está no mapa.</h1>
        <p className="mt-3 text-inksoft">A página que você procurou não existe ou mudou de rota. Mas o mundo é grande — escolha por onde seguir.</p>
        <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
          {ATALHOS.map((a) => (
            <Link key={a.href} href={a.href}
              className={`inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg font-semibold px-5 h-12 transition focusring ${a.primary ? 'bg-coral text-oncoral hover:brightness-95' : 'border border-line bg-card text-ink hover:border-pine/50'}`}>
              <Icon name={a.icon} size={18} />{a.label}
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
