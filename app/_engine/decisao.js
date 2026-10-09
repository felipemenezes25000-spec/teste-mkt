/* =============================================================================
   MOTOR DE DECISÃO
   ---------------------------------------------------------------------------
   Onde os concorrentes LISTAM opções, aqui a gente DECIDE: dado um perfil de
   viajante, ranqueia destinos/cenários e EXPLICA por que cada um faz sentido
   (ou não) pra ESTE usuário. É o "qual escolher", não o "aqui estão 200 hotéis".
   Função PURA → testável.
   ========================================================================== */
import { num, clamp } from './utils.js';
import { indiceDe } from './indices.js';
import { pesosScore } from './perfil.js';
import { normalizarPesos } from './score.js';

const round = (v) => Math.round(clamp(v, 0, 100));

export const DIM_LABEL = {
  custoBeneficio: 'custo-benefício', conforto: 'conforto', seguranca: 'segurança',
  tempoLivre: 'tempo livre', experienciaLocal: 'experiência local', gastronomia: 'gastronomia',
  risco: 'baixo risco', economia: 'economia',
};

// Constrói as 8 dimensões (0–100) de um ÚNICO destino, a partir dos índices do
// país e do custo/dia. (O Score completo precisa de datas/rota; aqui é o "e se eu
// fosse só pra cá".)
export function dimensoesDoDestino(destino) {
  const i = indiceDe(destino.code);
  const custoDia = num(destino.custoDia, 30);
  return {
    custoBeneficio: round(110 - custoDia * 1.1),       // mais barato → melhor
    conforto: round(18 + custoDia * 0.95),             // mais caro sustenta mais conforto
    seguranca: round(i.seguranca * 10),
    tempoLivre: 65,                                     // neutro p/ destino isolado
    experienciaLocal: round((i.cultura * 0.5 + i.natureza * 0.3 + i.aventura * 0.2) * 10),
    gastronomia: round(i.gastronomia * 10),
    risco: round(60 + (i.seguranca - 5) * 7),          // segurança alta → baixo risco
    economia: round(clamp(100 - custoDia * 1.0, 10, 100)),
  };
}

// Ranqueia opções [{ id, nome, dimensoes }] por pontuação ponderada e gera o
// "porque". `pesos` = pesos das dimensões (de pesosScore(perfil)).
export function ranquear(opcoes, pesos) {
  const w = normalizarPesos(pesos);
  const avaliadas = (opcoes || []).map((o) => {
    const dim = o.dimensoes || {};
    let pontos = 0;
    const contrib = {};
    for (const k of Object.keys(w)) {
      const c = (num(dim[k])) * w[k];
      contrib[k] = c;
      pontos += c;
    }
    return { ...o, pontos: round(pontos), contrib };
  });

  avaliadas.sort((a, b) => b.pontos - a.pontos);
  return avaliadas.map((o, idx) => ({
    ...o,
    posicao: idx + 1,
    porque: explicar(o, w),
    // mesmos motivos, estruturados, para a UI montar a frase no idioma da página
    motivos: motivos(o, w),
  }));
}

// Explica a recomendação: 2 dimensões onde mais pontua (peso×nota) + alerta se
// uma dimensão muito valorizada pelo perfil está fraca.
function motivos(opcao, w) {
  const dim = opcao.dimensoes || {};
  const porContrib = Object.entries(opcao.contrib || {}).sort((a, b) => b[1] - a[1]);
  const fortes = porContrib.slice(0, 2).filter(([, c]) => c > 0).map(([k]) => k);
  // Alerta: dimensão de alto peso (perfil) com nota baixa (<45).
  let alerta = null;
  const pesosOrd = Object.entries(w).sort((a, b) => b[1] - a[1]);
  for (const [k] of pesosOrd) {
    if (num(dim[k]) < 45) { alerta = k; break; }
  }
  return { fortes, alerta };
}

function explicar(opcao, w) {
  const m = motivos(opcao, w);
  const fortes = m.fortes.map((k) => DIM_LABEL[k]);
  const alerta = m.alerta ? DIM_LABEL[m.alerta] : null;

  let txt = fortes.length ? `Forte em ${fortes.join(' e ')}, alinhado ao seu perfil.` : 'Opção equilibrada.';
  if (alerta) txt += ` Atenção: ${alerta} abaixo do ideal.`;
  return txt;
}

// Conveniência: ranqueia uma lista de destinos pelo perfil do viajante.
export function recomendarDestinos(destinos, perfil) {
  const opcoes = (destinos || []).map((d) => ({
    id: d.code, nome: d.nome, slug: d.slug, regiao: d.regiao, custoDia: d.custoDia,
    dimensoes: dimensoesDoDestino(d),
  }));
  return ranquear(opcoes, pesosScore(perfil));
}
