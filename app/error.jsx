'use client';
import Link from 'next/link';
import { useEffect } from 'react';

// Error boundary global (App Router): qualquer erro de runtime nas rotas cai aqui
// em vez da tela crua do Next. Com a cara do produto, igual ao not-found.jsx.
// `reset()` re-renderiza a rota — resolve erros transientes (rede, race de dados).
export default function Error({ error, reset }) {
  useEffect(() => {
    // Loga no console do navegador pra diagnóstico; nada de serviço externo.
    console.error('[mundo-sem-fim]', error);
  }, [error]);

  return (
    <main className="min-h-screen grid place-items-center bg-paper px-6 py-16 text-center">
      <div className="max-w-md">
        <span className="w-14 h-14 rounded-2xl bg-pine text-white grid place-items-center font-display text-3xl shadow-md mx-auto" aria-hidden>∞</span>
        <h1 className="mt-6 font-display text-2xl text-ink">Algo saiu da rota.</h1>
        <p className="mt-2 text-inksoft">
          Deu um erro inesperado ao montar esta página. Geralmente é passageiro —
          tente de novo; se insistir, volte ao início.
        </p>
        <div className="mt-7 flex flex-col sm:flex-row gap-3 justify-center">
          <button
            type="button"
            onClick={() => reset()}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-pine text-white font-semibold px-5 py-3 hover:bg-pinedk transition focusring"
          >
            <span aria-hidden>🔄</span>Tentar de novo
          </button>
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-line bg-card text-ink font-semibold px-5 py-3 hover:text-pine transition focusring"
          >
            <span aria-hidden>🏠</span>Voltar ao início
          </Link>
        </div>
      </div>
    </main>
  );
}
