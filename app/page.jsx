'use client';
import dynamic from 'next/dynamic';

// App é client-only (usa localStorage, fetch, drag-and-drop). ssr:false evita
// erros de SSR/hydration e trata o app como SPA — adequado pro MVP interativo.
const App = dynamic(() => import('./_engine/App.jsx'), {
  ssr: false,
  loading: () => <div className="min-h-screen grid place-items-center text-inksoft">Carregando…</div>,
});

export default function Page() {
  return <App />;
}
