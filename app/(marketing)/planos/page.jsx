import { PlanosCta } from './PlanosCta.jsx';

export const metadata = {
  title: 'Planos — Mundo Sem Fim',
  description: 'Free, Premium e Pro. Comece grátis e desbloqueie roteiros com IA, custos detalhados, comparação e mais.',
};

const PLANOS = [
  {
    id: 'free', nome: 'Grátis', preco: 'R$ 0', periodo: 'pra sempre', destaque: false,
    bullets: ['Explorar destinos', 'Planejar rota (estação × visto × fôlego)', '3 favoritos', 'Câmbio ao vivo'],
    cta: 'Começar grátis', href: '/planejar',
  },
  {
    id: 'premium', nome: 'Premium', preco: 'R$ 19', periodo: '/mês', destaque: true,
    bullets: ['Tudo do Grátis', 'Roteiros ilimitados com IA', 'Custos detalhados (mín / médio / conforto)', 'Comparar destinos', 'Alertas de preço de voo', 'Exportar PDF'],
    cta: 'Assinar Premium', href: '/conta',
  },
  {
    id: 'pro', nome: 'Pro', preco: 'R$ 39', periodo: '/mês', destaque: false,
    bullets: ['Tudo do Premium', 'Planejamento multi-país avançado', 'Colaboração na viagem', 'Orçamento prescritivo', 'Suporte prioritário'],
    cta: 'Assinar Pro', href: '/conta',
  },
];

export default function PlanosPage() {
  return (
    <main className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
      <div className="text-center max-w-2xl mx-auto">
        <h1 className="font-display text-3xl sm:text-4xl text-ink">Escolha seu plano</h1>
        <p className="mt-2 text-inksoft">Comece grátis. Vire premium quando a viagem ficar séria. Cancele quando quiser.</p>
      </div>
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 items-stretch">
        {PLANOS.map((p) => (
          <div key={p.id} className={`rounded-2xl border bg-card p-6 flex flex-col ${p.destaque ? 'border-pine shadow-[var(--e-1)] ring-1 ring-pine/20' : 'border-line'}`}>
            {p.destaque && <span className="self-start text-[11px] font-bold uppercase tracking-wide bg-pine text-white rounded-full px-2.5 py-0.5 mb-2">Mais popular</span>}
            <h2 className="font-display text-2xl text-ink">{p.nome}</h2>
            <div className="mt-1 flex items-end gap-1">
              <span className="font-display text-4xl text-ink">{p.preco}</span>
              <span className="text-inksoft text-sm mb-1">{p.periodo}</span>
            </div>
            <ul className="mt-4 space-y-2 text-sm text-inksoft flex-1">
              {p.bullets.map((b) => <li key={b} className="flex gap-2"><span className="text-pine shrink-0" aria-hidden>✓</span>{b}</li>)}
            </ul>
            <div className="mt-6">
              <PlanosCta plano={p.id} label={p.cta} destaque={p.destaque} freeHref={p.id === 'free' ? p.href : undefined} />
            </div>
          </div>
        ))}
      </div>
      <p className="mt-6 text-center text-xs text-inksoft">
        Pagamento processado com segurança (Stripe). Os preços e o checkout são ilustrativos nesta prévia — a cobrança real é ligada na fase de monetização.
      </p>
    </main>
  );
}
