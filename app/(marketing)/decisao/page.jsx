import { DESTINOS } from '../../_lib/destinos.js';
import { fotoCapa } from '../../_lib/wiki.js';
import { resolverImagens } from '../../_lib/media.js';
import { arquivoWikimedia } from '../../_lib/wikiThumb.js';
import { DecisaoClient } from './DecisaoClient.jsx';

// Imagens buscadas no servidor (cacheadas). O ranking e o score rodam no client,
// porque dependem do perfil e da rota salvos no navegador do usuário.
export const revalidate = 86400;

export const metadata = {
  title: 'Decisão de viagem — pra onde ir e o que ajustar | Mundo Sem Fim',
  description:
    'O motor de decisão que escolhe por você: destinos ranqueados pelo seu perfil, score da sua viagem em 8 dimensões, custo total realista e oportunidades de economia.',
};

export default async function DecisaoPage() {
  const brutas = await Promise.all(DESTINOS.map((d) => fotoCapa(d)));
  // URL em largura segura (≤ original) + crédito, via serviço de mídia
  const assets = await resolverImagens(brutas.filter(Boolean), { largura: 500 });
  const imgs = brutas.map((u) => { const a = u ? assets.get(arquivoWikimedia(u) || '') : null; return a ? a.url : u; });
  const destinos = DESTINOS.map((d, i) => ({
    code: d.code, nome: d.nome, slug: d.slug, regiao: d.regiao,
    custoDia: d.custoDia, estacao: d.estacao, img: imgs[i],
  }));

  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      <section className="rounded-2xl border border-line bg-card p-6 sm:p-10 shadow-e1">
        <span className="eyebrow">Camada de decisão antes da reserva</span>
        <h1 className="mt-4 font-display text-4xl sm:text-6xl tracking-tightest leading-[.98] text-ink">Descubra a viagem que realmente combina com você.</h1>
        <p className="mt-4 text-lg text-inksoft max-w-3xl">
          Coloque dias, orçamento e tolerância a perrengue. O Mundo Sem Fim cruza custo real, clima, segurança e ritmo para dizer onde vale ir — e onde é melhor não gastar agora.
        </p>
      </section>
      <DecisaoClient destinos={destinos} />
    </main>
  );
}
