'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

// Adiciona o país ao plano salvo (localStorage do planner) e leva pra /planejar.
// Reusa exatamente o modelo do motor (novoTrechoDeRef) — o trecho já chega
// pré-preenchido com custo, estação e visto. Idempotente por code.
export function AddToRouteButton({ code, nome, className = '', children }) {
  const router = useRouter();
  const [feito, setFeito] = useState(false);

  async function add() {
    try {
      // motor do planner e catálogo só no clique (fora do bundle da página de destino)
      const [{ carregarPlano, salvarPlano, novoTrechoDeRef }, { refDe }] = await Promise.all([import('../_engine/storage.js'), import('../_engine/data.js')]);
      const plan = carregarPlano();
      if (code && !plan.legs.some((l) => l.code === code)) {
        const ref = refDe(code);
        if (ref) {
          plan.legs.push(novoTrechoDeRef(ref, plan.settings.passaporte));
          salvarPlano(plan);
        }
      }
      setFeito(true);
      router.push('/planejar');
    } catch (e) {
      console.warn('[AddToRoute]', e && e.message);
      router.push('/planejar');
    }
  }

  return (
    <button type="button" onClick={add} disabled={feito} className={className}>
      {children}
    </button>
  );
}
