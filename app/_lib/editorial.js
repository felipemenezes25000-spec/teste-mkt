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
  AR: {
    texto: 'A Argentina é um dos melhores destinos custo-benefício saindo do Brasil: chegada barata, comida memorável, vinho a preço de mercado e um senso de cidade que poucos países da região têm. O ponto que pesa é a instabilidade cambial — o real-peso vira o tempo todo e influencia hospedagem e câmbio na rua.',
    combina: ['casal pela primeira vez na Patagônia', 'foodie querendo bife e vinho', 'cidade grande caminhável', 'orçamento médio com luxo seletivo'],
    naoCombina: ['praia', 'quem evita lidar com câmbio paralelo', 'roteiro engessado por reserva antecipada'],
    oportunidade: 'Março-maio em Buenos Aires e novembro na Patagônia: clima bom e dólar paralelo costuma render mais que o oficial.',
  },
  CL: {
    texto: 'O Chile é o destino sul-americano mais parecido com a Europa em estrutura: aeroportos, transporte e segurança funcionam bem. Vale tanto pra primeira viagem internacional quanto pra quem quer Patagônia/Atacama sem perrengue logístico. O contra é que sai mais caro que vizinhos, principalmente fora de Santiago.',
    combina: ['primeira viagem internacional', 'casal sem perrengue', 'natureza extrema com conforto', 'viagem de 7-10 dias'],
    naoCombina: ['orçamento muito apertado', 'quem quer praia tropical', 'quem evita altitude'],
    oportunidade: 'Outubro-novembro junta clima bom em Santiago, Atacama ainda razoável e Patagônia abrindo a temporada — antes do pico de dezembro.',
  },
  UY: {
    texto: 'O Uruguai é a viagem internacional mais fácil que existe para brasileiros: voo curto, idioma simples, segurança alta e clima parecido. É um ótimo destino pra "primeira saída do Brasil" e pra casal que quer um final de semana sem stress. O preço fica mais alto que parece — câmbio e hospedagem em Punta no verão são caros.',
    combina: ['primeira viagem internacional', 'casal final de semana', 'fim de ano alternativo a praia brasileira', 'wine country sem ir longe'],
    naoCombina: ['viagem longa', 'busca por exuberância natural', 'orçamento muito apertado em janeiro'],
    oportunidade: 'Março-abril em Montevideo e Colonia: temporada baixa, preços razoáveis e clima ainda quente.',
  },
  ES: {
    texto: 'A Espanha equilibra cidade, praia, gastronomia e estrutura como poucos países da Europa. Para brasileiros é uma escolha óbvia: idioma próximo, conexão direta de SP e GRU, custo médio entre Portugal e França. O cuidado é não tentar fazer Madri+Barcelona+Andaluzia em 7 dias — vira corrida cansativa.',
    combina: ['primeira Europa que quer cidade e praia', 'gastronomia', 'casal 10-14 dias', 'língua próxima'],
    naoCombina: ['roteiro de 5 dias multi-cidade', 'praia barata estilo Nordeste', 'verão em agosto (lotado e caro)'],
    oportunidade: 'Maio-junho ou setembro-outubro: clima ideal, preços fora do pico e atrações sem multidão.',
  },
  IT: {
    texto: 'A Itália é a viagem dos clichês justificados: comida, arte e cidade-arte funcionam quase em qualquer mês. Mas é cara, e o "destino bonito barato" só existe fora dos circuitos óbvios (Sul da Itália, Puglia, Sicília fora do verão). Roma+Florença+Veneza em 8 dias é o erro mais comum.',
    combina: ['casal foodie', 'primeira Europa com história forte', 'viagem de 10-14 dias', 'roteiro de uma região (não três)'],
    naoCombina: ['orçamento apertado em junho-agosto', 'mochileiro tentando fazer norte+sul rápido', 'quem prioriza praia barata'],
    oportunidade: 'Setembro-outubro no sul (Puglia, Nápoles, Sicília): comida no auge, preços civilizados e clima ainda bom.',
  },
  FR: {
    texto: 'A França é o destino de "Europa premium" típico: Paris é experiência única, mas o resto do país (Provence, Bordeaux, Normandia) costuma render mais por euro gasto. O choque para brasileiros é hospedagem em Paris — fica caro e pequeno. Vale muito se você dilui Paris com outra região.',
    combina: ['casal que quer uma cidade icônica', 'foodie + vinho', 'viagem 8-12 dias dividindo Paris + região', 'quem aprecia museu e arte'],
    naoCombina: ['orçamento apertado só em Paris', 'mochilão rápido', 'quem quer só natureza'],
    oportunidade: 'Maio-junho ou setembro: tempo bom, dias longos e Paris menos sufocada que em julho-agosto.',
  },
  US: {
    texto: 'A viagem internacional que mais "decepciona barato e impressiona caro" para brasileiros. Os EUA são uma escolha óbvia para Disney/NY/LA, mas o dólar e a estrutura cara em hospedagem e comida engolem o orçamento — exceto em road trip com motel.',
    combina: ['família com criança', 'primeira viagem internacional sem barreira linguística', 'roteiro Costa Oeste em road trip', 'quem quer mistura cidade+natureza'],
    naoCombina: ['orçamento muito apertado em NY/CA', 'viagem curta de cidade só', 'quem quer experiência exótica'],
    oportunidade: 'Setembro-novembro na Costa Oeste: clima ainda bom, preços fora do pico de verão e parques nacionais ainda abertos.',
  },
  MX: {
    texto: 'O México é provavelmente o melhor destino de praia que brasileiros subestimam. Cancún/Tulum/Riviera Maya tem custo competitivo, infraestrutura forte e clima estável. O cuidado é não confundir Cancún com México — a cultura real está em CDMX, Oaxaca, Yucatán interior.',
    combina: ['praia tropical com infra', 'gastronomia barata e forte', 'roteiro 7-12 dias cultura+praia', 'casal mid-range'],
    naoCombina: ['alta temporada de dezembro/janeiro (caro e cheio)', 'busca por luxo silencioso', 'quem não tolera calor'],
    oportunidade: 'Maio ou outubro na Riviera Maya: pré ou pós-furacão, preços melhores e praia ainda ótima.',
  },
  JP: {
    texto: 'O Japão é o destino que mais dilui o investimento da viagem se você for 12+ dias. Voo caro, mas dia a dia é mais barato do que parece — comida na rua é boa e barata, transporte funciona. O choque é hospedagem em Tóquio: quartos pequenos e caros. Roteiros de 7 dias quase sempre frustram.',
    combina: ['14+ dias', 'interesse em comida e cultura', 'primeira viagem fora do Ocidente', 'quem aprecia ordem e detalhe'],
    naoCombina: ['viagem de 6-8 dias (não rende)', 'medo de idioma totalmente diferente', 'orçamento que ignora voo'],
    oportunidade: 'Final de outubro (folhas) ou abril (sakura, mas mais caro): clima ideal e a paisagem virando outro destino.',
  },
  GR: {
    texto: 'A Grécia é a viagem de "Europa sem stress europeu": clima quente, mar bom, comida simples e gente fácil. O detalhe é que Atenas funciona com 2 dias, e o resto é ilha — escolher 1 ou 2 ilhas pra não virar maratona de ferry. Santorini é caríssima e cheia; outras ilhas rendem muito mais.',
    combina: ['casal lua-de-mel', 'primeira Europa que quer praia+história', 'viagem 10-12 dias', 'alguém que aprecia ritmo lento'],
    naoCombina: ['roteiro de 5 dias pulando 4 ilhas', 'julho/agosto (lotado e caro)', 'orçamento apertado em Santorini'],
    oportunidade: 'Maio-junho ou setembro: ilhas abrindo ou fechando temporada, mar morno e preços muito mais civilizados.',
  },
  TR: {
    texto: 'A Turquia é provavelmente o destino com maior diferença entre custo e impacto cultural pra brasileiros. Istambul sozinha vale a viagem, e Capadócia é a foto que o app vende. Lira está fraca, então o real rende. O contra é distância — vale com 10+ dias.',
    combina: ['10-14 dias misturando cidade+natureza', 'primeiro contato com cultura muçulmana', 'casal querendo experiência forte', 'orçamento médio'],
    naoCombina: ['viagem de 6 dias só em Istambul', 'medo de barganha na compra', 'ramadã (movimento e horários diferentes)'],
    oportunidade: 'Abril-maio ou setembro-outubro: clima bom em Istambul, balões em Capadócia funcionando e preço fora do pico.',
  },
  EG: {
    texto: 'O Egito é a "experiência arqueológica intensa" que poucos países entregam. Pirâmides + Vale dos Reis + cruzeiro no Nilo é roteiro clássico que ainda funciona. O contra é que pode cansar — calor, assédio comercial e logística podem ficar pesados. Vale guia local.',
    combina: ['8-12 dias com cruzeiro', 'interesse forte em história antiga', 'quem aceita guia/pacote organizado', 'quem tem disposição pro calor'],
    naoCombina: ['medo de assédio comercial intenso', 'julho-agosto (calor extremo)', 'roteiro flexível mochilão sem agência'],
    oportunidade: 'Outubro-março: clima muito mais civilizado e cruzeiro do Nilo confortável (acima de 25 graus em vez de 45).',
  },
  AE: {
    texto: 'Os Emirados Árabes são "Dubai" pra maioria — uma cidade que funciona como vitrine de tudo: shopping, deserto, praia, arranha-céus. Vale como escala num roteiro maior pra Ásia ou como 4-5 dias isolados. Como destino único de 10 dias, geralmente não rende — é raso de cultura.',
    combina: ['escala estendida (stopover Emirates)', 'primeira viagem no Oriente Médio sem barreira de idioma', 'família querendo segurança e estrutura', 'luxo bom pelo preço'],
    naoCombina: ['busca por autenticidade cultural', '10+ dias só em Dubai', 'verão (calor insuportável)'],
    oportunidade: 'Novembro-março: deserto frio, praia ótima e festivais funcionando. Stopover de 3-4 dias rende muito mais que viagem-destino única.',
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
