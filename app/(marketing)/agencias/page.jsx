import { T } from '../../_components/T.jsx';
import { Icon } from '../../_ui/Icon.jsx';
import { AgenciasClient } from './AgenciasClient.jsx';

export const metadata = {
  title: 'Para agências — propostas com a sua marca | Mundo Sem Fim',
  description: 'Monte propostas de viagem com custo, margem e preço final, aplique a sua marca (white-label) e envie um link para o cliente aceitar. Dados de destino com fonte e data.',
  alternates: { canonical: '/agencias' },
};

const PILARES = [
  { icon: 'receipt', k: 'b1', t: 'Custo, margem e preço', d: 'Você lança o custo de cada item; a margem gera o preço final. O cliente nunca vê custo nem margem.' },
  { icon: 'flag', k: 'b2', t: 'Sua marca, não a nossa', d: 'Nome, cor e logo da agência na proposta. Contraste ajustado automaticamente para continuar legível.' },
  { icon: 'link', k: 'b3', t: 'Link para o cliente aceitar', d: 'Link direto (sem conta) ou link curto com aceite registrado quando a agência usa a conta.' },
  { icon: 'users', k: 'b4', t: 'Equipe com papéis', d: 'Dono, administradores e agentes. Agente cria e envia; só administrador apaga e muda a marca.' },
];

export default function AgenciasPage() {
  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-10 pb-12">
      <header className="mb-8 max-w-3xl">
        <div className="eyebrow mb-3"><T k="plat.agEy" fallback="Para agências e consultores · B2B" /></div>
        <h1 className="font-display text-4xl sm:text-6xl tracking-tightest leading-[.98] text-ink"><T k="plat.agH" fallback="Propostas de viagem com a sua marca." /></h1>
        <p className="mt-4 text-lg text-inksoft"><T k="plat.agP" fallback="Monte a proposta em minutos com dados de 205 destinos, defina a margem e mande um link para o cliente aceitar. Reservas continuam nos seus fornecedores — aqui é o seu balcão de vendas." /></p>
      </header>
      <ul className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-10">
        {PILARES.map((p) => (
          <li key={p.k} className="rounded-2xl border border-line bg-card p-4">
            <Icon name={p.icon} size={20} className="text-pine" />
            <p className="mt-3 font-semibold text-ink"><T k={`plat.${p.k}`} fallback={p.t} /></p>
            <p className="mt-1 text-sm text-inksoft"><T k={`plat.${p.k}t`} fallback={p.d} /></p>
          </li>
        ))}
      </ul>
      <AgenciasClient />
    </main>
  );
}
