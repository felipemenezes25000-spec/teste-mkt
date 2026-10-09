import Link from 'next/link';
import { Icon } from './_ui/Icon.jsx';

export const metadata = { title: 'Página não encontrada · Mundo Sem Fim' };

// 404 com a cara do produto (PT-BR, tokens de tema → dark mode automático). Mora na
// raiz, fora do (marketing) layout, então traz a marca e os atalhos inline.
const ATALHOS = [
  { href: '/', label: 'Voltar ao início', icon: '🏠', primary: true },
  { href: '/explorar', label: 'Explorar destinos', icon: '🧭' },
  { href: '/decisao', label: 'Decidir minha viagem', icon: '🧠' },
];

export default function NotFound() {
  return (
    <main className="min-h-screen grid place-items-center bg-paper px-6 py-16 text-center">
      <div className="max-w-md">
        <span className="w-14 h-14 rounded-2xl bg-pine text-onpine grid place-items-center font-display text-3xl shadow-md mx-auto" aria-hidden>∞</span>
        <p className="mt-6 font-display text-6xl text-ink leading-none">404</p>
        <h1 className="mt-3 font-display text-2xl text-ink">Esse caminho não está no mapa.</h1>
        <p className="mt-2 text-inksoft">
          A página que você procurou não existe ou trocou de rota. Mas o mundo é grande —
          bora achar pra onde ir.
        </p>
        <div className="mt-7 flex flex-col sm:flex-row gap-3 justify-center">
          {ATALHOS.map((a) => (
            <Link
              key={a.href}
              href={a.href}
              className={
                a.primary
                  ? 'inline-flex items-center justify-center gap-2 rounded-xl bg-pine text-onpine font-semibold px-5 py-3 hover:bg-pinedk transition focusring'
                  : 'inline-flex items-center justify-center gap-2 rounded-xl border border-line bg-card text-ink font-semibold px-5 py-3 hover:text-pine transition focusring'
              }
            >
              <span aria-hidden><Icon emoji={a.icon} /></span>{a.label}
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
