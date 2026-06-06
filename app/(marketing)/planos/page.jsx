import { PlanosCta } from './PlanosCta.jsx';
import { JsonLd } from '../../_components/JsonLd.jsx';
import { jsonLdProduto, siteUrl } from '../../_lib/seo.js';
import { ROICalculator } from './ROICalculator.jsx';
import { T } from '../../_components/T.jsx';

export const metadata = {
  title: 'Planos — Mundo Sem Fim',
  description: 'Free, Premium e Pro. Teste versões da viagem, veja custo real e decida antes de comprar passagem.',
  alternates: { canonical: '/planos' },
};

const PLANOS = [
  {
    id: 'free', nome: 'Grátis', preco: 'R$ 0', periodo: 'pra sempre', destaque: false,
    frase: 'Para começar a decidir sem cartão.',
    bullets: ['Descobrir destinos por curadoria', 'Planejar rota com estação × visto × fôlego', '3 favoritos para comparar', 'Câmbio ao vivo'],
    cta: 'Começar grátis', href: '/planejar',
  },
  {
    id: 'premium', nome: 'Premium', preco: 'R$ 19', periodo: '/mês', destaque: true,
    frase: 'Para quem vai comprar passagem e quer decidir com segurança.',
    bullets: ['Tudo do Grátis', 'Teste quantas versões quiser antes de comprar passagem', 'Veja o custo real antes do “voo barato, viagem cara”', 'Escolha com clareza entre 2 ou 3 viagens possíveis', 'Alertas de preço de voo', 'Exportar PDF'],
    cta: 'Assinar Premium', href: '/conta',
  },
  {
    id: 'pro', nome: 'Pro', preco: 'R$ 39', periodo: '/mês', destaque: false,
    frase: 'Para viagens longas, casal, grupo, multi-país ou roteiros complexos.',
    bullets: ['Tudo do Premium', 'Rota multi-país com menos cansaço', 'Colaboração na viagem', 'Orçamento prescritivo', 'Suporte prioritário'],
    cta: 'Assinar Pro', href: '/conta',
  },
];

export default function PlanosPage() {
  const ofertas = PLANOS.filter((p) => p.id !== 'free').map((p) => ({ nome: p.nome, preco: p.preco.replace(/[^\d]/g, '') + '.00' }));
  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
      <JsonLd data={jsonLdProduto(ofertas, siteUrl())} />
      <div className="text-center max-w-3xl mx-auto">
        <span className="inline-flex rounded-full bg-pine/10 text-pine px-3 py-1 text-xs font-bold uppercase tracking-[0.18em]"><T k="planos.heroSelo" fallback="Economia antes da passagem" /></span>
        <h1 className="mt-4 font-display text-4xl sm:text-6xl leading-[1.03] text-ink"><T k="planos.heroH1" fallback="Pague menos para errar menos." /></h1>
        <p className="mt-4 text-lg text-inksoft"><T k="planos.heroP" fallback="O Premium se paga quando evita uma passagem mal comprada, um roteiro corrido demais ou uma viagem barata que fica cara no detalhe." /></p>
      </div>
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 items-stretch">
        {PLANOS.map((p) => (
          <div key={p.id} className={`rounded-3xl border bg-card p-6 flex flex-col ${p.destaque ? 'border-pine shadow-[var(--e-2)] ring-1 ring-pine/20 scale-[1.01]' : 'border-line'}`}>
            {p.destaque && <span className="self-start text-[11px] font-bold uppercase tracking-wide bg-pine text-white rounded-full px-2.5 py-0.5 mb-2">Mais popular</span>}
            <h2 className="font-display text-2xl text-ink">{p.nome}</h2>
            <p className="mt-1 text-sm text-inksoft min-h-[40px]">{p.frase}</p>
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
      <ROICalculator />

      <div className="mt-8 grid sm:grid-cols-3 gap-3 text-sm">
        {[
          ['Conselho neutro', 'A recomendação não depende de comissão de reserva.'],
          ['Custo real', 'Seguro, chip, visto e contingência entram antes da decisão.'],
          ['Cancele quando quiser', 'Pagamento seguro via Stripe e sem fidelidade.'],
        ].map(([titulo, texto]) => (
          <div key={titulo} className="rounded-2xl border border-line bg-paper2/70 p-4">
            <h3 className="font-display text-lg text-ink">{titulo}</h3>
            <p className="mt-1 text-inksoft">{texto}</p>
          </div>
        ))}
      </div>
    </main>
  );
}
