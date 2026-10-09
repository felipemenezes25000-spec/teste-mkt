import { Suspense } from 'react';
import { PropostaClient } from './PropostaClient.jsx';

// Visão do CLIENTE FINAL de uma proposta de agência (white-label): sem a
// navegação do Mundo Sem Fim, com a marca da agência. Fora do grupo (marketing).
export const metadata = {
  title: 'Proposta de viagem',
  robots: { index: false, follow: false },
  referrer: 'no-referrer',
};

export default function PropostaPage() {
  return (
    <Suspense fallback={null}>
      <PropostaClient />
    </Suspense>
  );
}
