'use client';
import dynamic from 'next/dynamic';
import { AppSkeleton } from '../_components/Skeleton.jsx';

// O planner é client-only (localStorage, fetch, drag-and-drop). ssr:false evita
// erros de hydration e trata como SPA. Mantém o próprio cabeçalho de viagem.
const App = dynamic(() => import('../_engine/App.jsx'), {
  ssr: false,
  loading: () => <AppSkeleton />,
});

export default function PlanejarPage() {
  return <App />;
}
