import { dimensoesDoDestino } from '../_engine/decisao.js';
import { clamp, num } from '../_engine/utils.js';

const round = (value) => Math.round(clamp(value, 0, 100));
const uniq = (items) => [...new Set((items || []).filter(Boolean))];

const VEREDITOS = {
  PT: {
    texto: 'Portugal é uma das escolhas mais seguras para uma primeira Europa: fácil de andar, boa comida, idioma familiar e muita coisa bonita concentrada. O problema é que o euro pesa mais do que parece, principalmente em hospedagem.',
    combina: ['primeira Europa', 'casal', 'boa comida', 'viagem de 7 a 12 dias'],
    naoCombina: ['praia barata', 'orçamento muito apertado', 'custo estilo Sudeste Asiático'],
    oportunidade: 'Vá em maio ou setembro para fugir do pico e ainda pegar clima bom.',
  },
  TH: {
    texto: 'A Tailândia é barata no dia a dia e muito forte em praia, comida e experiências. O ponto que muda tudo para brasileiros é o voo: longe, caro e cansativo se a viagem for curta.',
    combina: ['12+ dias', 'praia', 'gastronomia', 'mochilão com conforto'],
    naoCombina: ['viagem curta', 'medo de conexão longa', 'orçamento que ignora passagem'],
    oportunidade: 'Faz sentido quando você dilui o voo em mais dias e evita a monção.',
  },
  PE: {
    texto: 'O Peru é um dos melhores custo-benefício para brasileiros que querem cultura, natureza e viagem internacional sem atravessar o mundo. O alerta principal é altitude e logística interna.',
    combina: ['7 a 10 dias', 'cultura forte', 'natureza', 'orçamento controlado'],
    naoCombina: ['sensibilidade à altitude', 'viagem sem planejamento', 'ritmo muito corrido'],
    oportunidade: 'Maio costuma unir clima seco, custo honesto e uma logística ainda razoável.',
  },
};

export function custoEstimadoDias(destino, dias = [7, 10, 15]) {
  const custoDia = Math.max(0, Math.round(num(destino && destino.custoDia)));
  return dias.map((quantidadeDias) => ({
    dias: quantidadeDias,
    total: Math.round(custoDia * quantidadeDias),
  }));
}

export function mundoScoreDestino(destino) {
  const dimensoes = dimensoesDoDestino(destino || {});
  const custoReal = dimensoes.custoBeneficio;
  const seguranca = dimensoes.seguranca;
  const experiencia = round((dimensoes.experienciaLocal * 0.55) + (dimensoes.gastronomia * 0.25) + (dimensoes.tempoLivre * 0.2));
  const facilidade = round((seguranca * 0.55) + (dimensoes.risco * 0.25) + (dimensoes.conforto * 0.2));
  const cansacoLogistico = round(100 - Math.max(0, num(destino && destino.custoDia) - 38) * 0.8);
  const total = round((custoReal * 0.28) + (seguranca * 0.2) + (experiencia * 0.24) + (facilidade * 0.18) + (cansacoLogistico * 0.1));
  const chanceArrependimento = total >= 78 ? 'baixa' : total >= 62 ? 'média' : 'alta';

  return {
    total,
    chanceArrependimento,
    subnotas: {
      custoReal,
      seguranca,
      experiencia,
      facilidade,
      cansacoLogistico,
    },
  };
}

export function fitTagsDestino(destino) {
  const custoDia = num(destino && destino.custoDia);
  const regiao = destino && destino.regiao;
  const tags = [];
  if (custoDia <= 35) tags.push('barato de verdade');
  if (custoDia > 70) tags.push('lindo, mas caro');
  if (regiao === 'Europa') tags.push('Europa com contexto');
  if (regiao === 'América do Sul') tags.push('perto do Brasil');
  if (regiao === 'Ásia') tags.push('vale mais com 12+ dias');
  if ((destino && destino.melhoresMeses && destino.melhoresMeses.length) || destino?.estacao) tags.push('clima importa');
  tags.push('custo real');
  return uniq(tags).slice(0, 4);
}

export function alertaHumanoDestino(destino) {
  const custoDia = num(destino && destino.custoDia);
  if (destino?.code === 'TH') return 'Barata no dia a dia, mas o voo saindo do Brasil pode engolir o orçamento.';
  if (destino?.code === 'PT') return 'Fácil e segura, mas hospedagem em euro costuma pesar mais que o previsto.';
  if (destino?.code === 'PE') return 'Ótimo valor, com atenção para altitude e deslocamentos internos.';
  if (custoDia >= 80) return 'Destino de desejo: planeje antes para não cair no “voo barato, viagem cara”.';
  if (custoDia <= 30) return 'Boa oportunidade para viajar com orçamento controlado sem cortar tudo.';
  return 'Vale olhar custo, mês e ritmo antes de comprar passagem.';
}

export function vereditoDestino(destino) {
  const curado = VEREDITOS[destino?.code];
  if (curado) {
    return {
      titulo: `Veredito sobre ${destino.nome}`,
      ...curado,
    };
  }

  const barato = num(destino && destino.custoDia) <= 35;
  const caro = num(destino && destino.custoDia) >= 70;
  const regiao = destino && destino.regiao;

  return {
    titulo: `Veredito sobre ${destino?.nome || 'este destino'}`,
    texto: caro
      ? `${destino.nome} tem apelo forte, mas não deve ser vendido como viagem barata. O custo diário e os extras pedem planejamento antes de qualquer passagem.`
      : barato
        ? `${destino.nome} tende a render bem no orçamento, principalmente se você prioriza experiência local e aceita uma viagem menos engessada.`
        : `${destino.nome} pode ser uma boa escolha se o mês, o ritmo e o orçamento fecharem juntos. O valor está menos no preço isolado e mais no encaixe da viagem.`,
    combina: uniq([
      barato && 'orçamento controlado',
      regiao === 'Europa' && 'primeira viagem com estrutura',
      regiao === 'América do Sul' && 'viagem mais curta saindo do Brasil',
      regiao === 'Ásia' && 'viagem longa para diluir o voo',
      'quem quer decidir com clareza',
    ]),
    naoCombina: uniq([
      caro && 'orçamento apertado',
      regiao === 'Ásia' && 'poucos dias disponíveis',
      'quem quer comprar passagem sem olhar custo real',
      'quem não quer ajustar roteiro ao clima',
    ]).slice(0, 3),
    oportunidade: alertaHumanoDestino(destino),
  };
}

function porCodes(destinos, codes) {
  const mapa = new Map((destinos || []).map((destino) => [destino.code, destino]));
  return codes.map((code) => mapa.get(code)).filter(Boolean);
}

function limitarUnicos(destinos, limite = 8) {
  const vistos = new Set();
  const saida = [];
  for (const destino of destinos || []) {
    if (!destino || vistos.has(destino.code)) continue;
    vistos.add(destino.code);
    saida.push(destino);
    if (saida.length >= limite) break;
  }
  return saida;
}

export function colecoesEditorial(destinos = []) {
  const baratos = destinos.filter((destino) => num(destino.custoDia) <= 35).sort((a, b) => num(a.custoDia) - num(b.custoDia));
  const europa = destinos.filter((destino) => destino.regiao === 'Europa').sort((a, b) => num(a.custoDia) - num(b.custoDia));
  const asia = destinos.filter((destino) => destino.regiao === 'Ásia').sort((a, b) => mundoScoreDestino(b).total - mundoScoreDestino(a).total);
  const caros = destinos.filter((destino) => num(destino.custoDia) >= 70).sort((a, b) => num(b.custoDia) - num(a.custoDia));

  return [
    {
      id: 'agora',
      titulo: 'Melhores destinos para começar agora',
      subtitulo: 'Boa mistura de desejo, custo real e facilidade para sair do papel.',
      destinos: limitarUnicos([...porCodes(destinos, ['PE', 'PT', 'TH', 'MX', 'CO', 'AR']), ...destinos.filter((destino) => destino.destaque)], 8),
    },
    {
      id: 'baratos-brasil',
      titulo: 'Baratos saindo do Brasil',
      subtitulo: 'Viagens em que o orçamento tende a respirar antes de você reservar.',
      destinos: limitarUnicos([...porCodes(destinos, ['PE', 'BO', 'CO', 'AR', 'UY']), ...baratos], 8),
    },
    {
      id: 'primeira-viagem',
      titulo: 'Primeira viagem internacional sem susto',
      subtitulo: 'Menos choque cultural, boa estrutura e menor chance de arrependimento.',
      destinos: limitarUnicos([...porCodes(destinos, ['PT', 'CL', 'UY', 'ES', 'AR', 'MX']), ...destinos], 8),
    },
    {
      id: 'europa-sem-falir',
      titulo: 'Europa sem fingir que o euro não existe',
      subtitulo: 'Europa com alerta de custo, não fantasia de vitrine.',
      destinos: limitarUnicos(europa, 8),
    },
    {
      id: 'asia-vale-voo',
      titulo: 'Ásia que vale o voo',
      subtitulo: 'Boa escolha quando você tem dias suficientes para diluir distância e cansaço.',
      destinos: limitarUnicos([...porCodes(destinos, ['TH', 'VN', 'ID', 'NP', 'JP']), ...asia], 8),
    },
    {
      id: 'lindos-caros',
      titulo: 'Destinos lindos, mas caros de verdade',
      subtitulo: 'Ótimos sonhos — desde que você veja o custo real antes.',
      destinos: limitarUnicos(caros, 8),
    },
  ].filter((colecao) => colecao.destinos.length > 0);
}
