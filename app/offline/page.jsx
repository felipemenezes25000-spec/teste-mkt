import Link from 'next/link';
import { Icon } from '../_ui/Icon.jsx';
import { MarcaIcone } from '../_ui/Marca.jsx';

export const metadata = { title: 'Offline · Mundo Sem Fim' };

// Shell exibido pelo service worker quando a navegação falha sem rede. Viagens,
// roteiro, reservas e documentos ficam no aparelho — continuam acessíveis offline.
export default function Offline() {
  return (
    <main className="min-h-screen grid place-items-center bg-paper px-6 py-16 text-center">
      <div className="max-w-md">
        <MarcaIcone size={56} className="mx-auto" />
        <h1 className="mt-6 font-display text-3xl tracking-tighter text-ink">Você está offline</h1>
        <p className="mt-2 text-inksoft">
          Sem conexão agora. Suas viagens, o roteiro, as reservas e os documentos continuam neste aparelho.
          Mapas, clima e câmbio voltam quando a internet voltar.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link href="/viagens" className="inline-flex items-center justify-center gap-2 rounded-full bg-coral text-oncoral font-cond font-extrabold uppercase tracking-[.05em] px-5 h-12 hover:brightness-95 transition focusring">
            <Icon name="suitcase" size={18} /> Minhas viagens
          </Link>
          <Link href="/planejar" className="inline-flex items-center justify-center gap-2 rounded-lg border border-line text-ink font-semibold px-5 h-12 focusring">
            <Icon name="route" size={18} /> Planejador
          </Link>
        </div>
      </div>
    </main>
  );
}
