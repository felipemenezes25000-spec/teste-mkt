'use client';
import dynamic from 'next/dynamic';

// O planner é client-only (localStorage, fetch, drag-and-drop). ssr:false evita
// erros de hydration e trata como SPA. Mantém o próprio cabeçalho de viagem.
const App = dynamic(() => import('../_engine/App.jsx'), {
  ssr: false,
  loading: () => <div className="min-h-screen grid place-items-center text-inksoft">Carregando…</div>,
});

export default function PlanejarPage() {
  return <App />;
}
