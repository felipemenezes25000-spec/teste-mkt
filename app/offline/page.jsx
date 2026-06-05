import Link from 'next/link';

export const metadata = { title: 'Offline · Mundo Sem Fim' };

// Shell exibido pelo service worker quando a navegação falha sem rede. O plano salvo
// e o checklist ficam no localStorage do aparelho — continuam acessíveis offline.
export default function Offline() {
  return (
    <main className="min-h-screen grid place-items-center bg-paper px-6 py-16 text-center">
      <div className="max-w-md">
        <span className="w-14 h-14 rounded-2xl bg-pine text-white grid place-items-center font-display text-3xl shadow-md mx-auto" aria-hidden>∞</span>
        <h1 className="mt-6 font-display text-2xl text-ink">Você está offline</h1>
        <p className="mt-2 text-inksoft">
          Sem conexão agora. Sua rota salva e o checklist continuam no seu aparelho —
          abra o planejador pra seguir consultando.
        </p>
        <Link href="/planejar" className="inline-flex mt-6 items-center justify-center gap-2 rounded-xl bg-pine text-white font-semibold px-5 py-3 hover:bg-pinedk transition focusring">
          🗺️ Abrir o planejador
        </Link>
      </div>
    </main>
  );
}
