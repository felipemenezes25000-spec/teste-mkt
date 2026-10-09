'use client';
import Link from 'next/link';
import { usePlano } from '../_lib/usePlano.js';
import { planoLibera, FEATURES, nomePlano } from '../_lib/planos.js';
import { Icon } from '../_ui/Icon.jsx';

// Envolve conteúdo premium. Se o plano libera a feature, mostra os filhos; senão,
// um cartão de upsell. A trava REAL de cada ação fica no servidor — isto é UX.
export function Gate({ feature, children, titulo = 'Recurso premium', descricao }) {
  const { plano, carregando } = usePlano();
  if (carregando) return null;
  if (planoLibera(plano, feature)) return children;
  const need = FEATURES[feature] || 'premium';
  return (
    <div className="rounded-2xl border border-dashed border-ochre/50 bg-ochre/5 p-6 text-center">
      <div className="text-3xl mb-1" aria-hidden><Icon emoji="🔒" /></div>
      <h3 className="font-display text-lg text-ink">{titulo}</h3>
      <p className="text-sm text-inksoft mt-1 max-w-md mx-auto">{descricao || `Disponível no plano ${nomePlano(need)}.`}</p>
      <Link href="/planos" className="inline-flex mt-3 rounded-xl bg-pine text-onpine font-semibold px-4 py-2 hover:bg-pinedk focusring"><Icon emoji="⭐" /> Ver planos</Link>
    </div>
  );
}

// Hook utilitário pra gatear ações pontuais (ex.: um botão) sem cartão.
export function useLibera(feature) {
  const { plano, carregando } = usePlano();
  return { libera: planoLibera(plano, feature), carregando, plano };
}
