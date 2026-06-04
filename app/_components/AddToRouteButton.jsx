'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { carregarPlano, salvarPlano, novoTrechoDeRef } from '../_engine/storage.js';
import { refDe } from '../_engine/data.js';

// Adiciona o país ao plano salvo (localStorage do planner) e leva pra /planejar.
// Reusa exatamente o modelo do motor (novoTrechoDeRef) — o trecho já chega
// pré-preenchido com custo, estação e visto. Idempotente por code.
export function AddToRouteButton({ code, nome, className = '', children }) {
  const router = useRouter();
  const [feito, setFeito] = useState(false);

  function add() {
    try {
      const plan = carregarPlano();
      if (code && !plan.legs.some((l) => l.code === code)) {
        const ref = refDe(code);
        if (ref) {
          plan.legs.push(novoTrechoDeRef(ref, plan.settings.passaporte));
          salvarPlano(plan);
        }
      }
    } catch {}
    setFeito(true);
    router.push('/planejar');
  }

  return (
    <button type="button" onClick={add} disabled={feito} className={className}>
      {children}
    </button>
  );
}
