import { DESTINOS } from '../../_lib/destinos.js';
import { fotoCapa } from '../../_lib/wiki.js';
import { resolverImagens } from '../../_lib/media.js';
import { arquivoWikimedia } from '../../_lib/wikiThumb.js';
import { DecisaoClient } from './DecisaoClient.jsx';
import { capaPais } from '../../_lib/midia.js';
import { FaixaAzulejos } from '../../_ui/Azulejo.jsx';

// Imagens buscadas no servidor (cacheadas). O ranking e o score rodam no client,
// porque dependem do perfil e da rota salvos no navegador do usuário.
export const revalidate = 86400;

export const metadata = {
  title: 'Decisão de viagem — pra onde ir e o que ajustar | Mundo Sem Fim',
  description:
    'O motor de decisão que escolhe por você: destinos ranqueados pelo seu perfil, score da sua viagem em 8 dimensões, custo total realista e oportunidades de economia.',
};

export default async function DecisaoPage() {
  // Capa HD curada (Commons, sem rede); só os países sem ela passam pela busca antiga.
  const hd = DESTINOS.map((d) => capaPais(d.code, 500));
  const faltam = DESTINOS.filter((d, i) => !hd[i]);
  const brutas = await Promise.all(faltam.map((d) => fotoCapa(d)));
  const assets = await resolverImagens(brutas.filter(Boolean), { largura: 500 });
  const antigas = new Map(faltam.map((d, i) => { const u = brutas[i]; const a = u ? assets.get(arquivoWikimedia(u) || '') : null; return [d.code, a ? a.url : u]; }));
  const destinos = DESTINOS.map((d, i) => ({
    code: d.code, nome: d.nome, slug: d.slug, regiao: d.regiao,
    custoDia: d.custoDia, estacao: d.estacao, img: hd[i] ? hd[i].src : antigas.get(d.code) || null,
  }));

  return (
    <main>
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pt-10 pb-8">
        <span className="ms-rotulo">Camada de decisão antes da reserva</span>
        <h1 className="ms-titulo mt-3 text-[48px] sm:text-[80px] leading-[.88] tracking-[-.05em] text-ink max-w-4xl">descubra a viagem que <span className="text-cobalto">combina com você</span></h1>
        <p className="mt-5 text-lg text-[#33332F] max-w-3xl">
          Coloque dias, orçamento e tolerância a perrengue. O Mundo Sem Fim cruza custo real, clima, segurança e ritmo para dizer onde vale ir — e onde é melhor não gastar agora.
        </p>
      </section>
      <FaixaAzulejos n={40} tam={48} semente={5} />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <DecisaoClient destinos={destinos} />
      </div>
    </main>
  );
}
