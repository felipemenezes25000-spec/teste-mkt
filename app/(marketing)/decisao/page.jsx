import { DESTINOS } from '../../_lib/destinos.js';
import { imagemWiki } from '../../_lib/wiki.js';
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
  const imgs = await Promise.all(DESTINOS.map((d) => imagemWiki(d.fotoQuery || d.nome)));
  const destinos = DESTINOS.map((d, i) => ({
    code: d.code, nome: d.nome, slug: d.slug, regiao: d.regiao,
    custoDia: d.custoDia, estacao: d.estacao, img: imgs[i],
  }));

  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      <span className="inline-block text-xs font-bold uppercase tracking-wider text-pine bg-pine/10 px-2.5 py-1 rounded-full">Camada de inteligência</span>
      <h1 className="mt-3 font-display text-3xl sm:text-4xl text-ink">Decisão de viagem</h1>
      <p className="mt-2 text-inksoft max-w-2xl">
        Os outros apps <em>listam</em> opções. Aqui a gente <strong className="text-ink">decide com você</strong>: para onde ir pelo seu perfil,
        quanto a viagem custa de verdade, e o que ajustar antes de embarcar — com o porquê de cada recomendação.
      </p>
      <DecisaoClient destinos={destinos} />
    </main>
  );
}
