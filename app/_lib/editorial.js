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
  CO: {
    texto: 'A Colômbia mudou de cara nos últimos 10 anos e hoje é uma das viagens mais interessantes da América do Sul: Cartagena pra romance, Medellín pra mudança cultural, Bogotá pra altitude+cultura, Eixo Cafeteiro pra natureza. Custo bom, voo razoável de SP/RJ.',
    combina: ['casal querendo destino sul-americano fora do óbvio', '10-12 dias misturando cidade+praia+natureza', 'interesse em café e cultura caribenha', 'segunda viagem internacional após PT/AR'],
    naoCombina: ['roteiro de 5 dias multi-cidade', 'quem se incomoda com altitude em Bogotá', 'busca por luxo silencioso'],
    oportunidade: 'Dezembro-março ou julho-agosto: clima seco nas duas estações principais, e Cartagena fora do pico de outubro.',
  },
  NL: {
    texto: 'A Holanda é o destino de "Europa fácil + pegada cultural alternativa" — Amsterdam é caminhável, ciclável, com museus do nível de Londres/Paris mas em dois dias. Vale com pouca duração (4-5 dias) ou como parte de um roteiro multi-cidade na Europa.',
    combina: ['roteiro de 4-5 dias intensos em Amsterdam', 'interesse em arte (Van Gogh, Rijksmuseum)', 'parte de roteiro Europa multi-cidade', 'primeira viagem que quer cidade caminhável'],
    naoCombina: ['10+ dias só em Amsterdam (não rende)', 'orçamento muito apertado', 'busca por praia/natureza'],
    oportunidade: 'Abril-maio (tulipas) ou setembro-outubro: clima bom e Amsterdam menos lotada que no verão.',
  },
  DE: {
    texto: 'A Alemanha é "Europa eficiente": trens funcionam, cidades organizadas, custo médio razoável pra Europa. Mas é destino que precisa de roteiro pensado — Berlim é única, mas o resto (Munique, Hamburgo, Rota Romântica) só faz sentido com 12+ dias. O brasileiro tipicamente passa rápido demais em cada cidade.',
    combina: ['roteiro 10-14 dias misturando Berlim + Sul (Baviera)', 'interesse em história séc. XX', 'família com adolescente', 'viagem de carro/trem fora dos circuitos óbvios'],
    naoCombina: ['5 dias só em Berlim', 'busca por praia ou comida latina', 'primeira Europa sem inglês'],
    oportunidade: 'Maio-junho ou setembro: clima bom, Christmas markets ainda longe, preços fora do pico.',
  },
  GB: {
    texto: 'Londres é a viagem mais "Manhattan da Europa" — internacional, museus de classe mundial, teatro, gastronomia transformada. Mas é cara pra brasileiros (libra+hospedagem), e fora de Londres a Inglaterra rende menos do que vale o trabalho de mover. Escócia é o segredo subestimado.',
    combina: ['7 dias intensos em Londres', 'interesse forte em museus, teatro, gastronomia internacional', 'primeira Europa que quer cidade grande', 'roteiro Londres+Escócia 10-12 dias'],
    naoCombina: ['orçamento muito apertado', 'busca por sol', 'viagem que tenta cobrir toda Inglaterra+Escócia em 7 dias'],
    oportunidade: 'Maio-setembro: dias longos, Londres com energia máxima e Escócia possível sem chuva contínua.',
  },
  ID: {
    texto: 'A Indonésia é principalmente Bali pra brasileiros, e Bali é dois destinos diferentes: a versão "Eat Pray Love" (Ubud, retiro, natureza) e a versão "festa em Canggu/Seminyak". Custo é bom no chão, mas o voo+conexão é o que pesa. Vale muito com 12+ dias.',
    combina: ['14-21 dias diluindo voo', 'interesse em yoga/retiro/spa', 'casal sem pressa', 'mochileiro com ritmo lento'],
    naoCombina: ['viagem de 7 dias', 'medo de barriga viajante', 'orçamento que ignora voo'],
    oportunidade: 'Maio-setembro: estação seca em Bali, sem monção e com clima ideal pra praia/cachoeiras.',
  },
  VN: {
    texto: 'O Vietnã é provavelmente o melhor custo-benefício do Sudeste Asiático que brasileiros mochilam. Distâncias bem pensadas (Hanoi → Hoi An → HCMC), comida memorável, custo absurdamente baixo no dia a dia. O contra é o voo: longo, sem direto do Brasil.',
    combina: ['mochilão de 14+ dias', 'interesse forte em comida de rua', 'roteiro norte-sul de trem/ônibus', 'orçamento controlado mas com algumas experiências'],
    naoCombina: ['viagem de menos de 10 dias', 'viagem com criança pequena', 'medo de tráfego caótico nas cidades'],
    oportunidade: 'Outubro-março no sul (HCMC), maio-setembro no norte (Hanoi): país tem clima oposto entre regiões.',
  },
  MA: {
    texto: 'Marrocos é a viagem do "exótico próximo" — cidade imperial (Marrakech, Fes), deserto do Saara, cultura completamente diferente, mas com infraestrutura turística funcional. Vale como 8-10 dias que mistura medina + deserto + costa atlântica. Pode chocar pelo assédio comercial.',
    combina: ['8-12 dias misturando cidades+deserto', 'interesse em cultura árabe-berbere', 'casal que aceita ritmo intenso', 'quem quer experiência exótica sem ir muito longe'],
    naoCombina: ['medo de barganha agressiva', 'viagem com criança pequena', 'ramadã (horários e movimento diferentes)'],
    oportunidade: 'Março-maio ou outubro-novembro: clima ideal no deserto e nas cidades, sem o calor extremo do verão.',
  },
  KR: {
    texto: 'A Coreia do Sul é o destino que cresceu muito nos últimos anos pra brasileiros — Seul é uma das cidades mais modernas do mundo, comida forte e diferente, K-pop/K-drama puxam interesse. O custo é mais alto que esperado (similar a Japão), e voo é longo. Vale com 10+ dias.',
    combina: ['interesse forte em cultura coreana (k-pop, k-drama, comida)', '10-14 dias misturando Seul+Busan+Jeju', 'roteiro cultural urbano', 'primeira viagem na Ásia'],
    naoCombina: ['viagem curta (6-7 dias não rendem)', 'busca por preço baixo', 'medo de idioma muito diferente'],
    oportunidade: 'Final de outubro (outono colorido) ou abril (sakura coreana): clima ideal e paisagem virando atração à parte.',
  },
  CA: {
    texto: 'O Canadá é a viagem de "natureza com estrutura ocidental": Rocky Mountains, Toronto/Vancouver, urso/alce/baleia, esqui no inverno. Custo é alto (dólar canadense pesa) mas a experiência é singular. Vale especialmente pra quem quer natureza extrema sem perrengue logístico.',
    combina: ['natureza extrema com infraestrutura', 'roteiro 10-14 dias Costa Oeste (Vancouver+Rockies)', 'casal aventureiro mid-range', 'primeira viagem internacional com inglês básico'],
    naoCombina: ['orçamento muito apertado', 'viagem só de cidade', 'busca por cultura latina/exótica'],
    oportunidade: 'Junho-setembro pras Rockies (alpinismo, lagos azuis sem neve) ou janeiro-março pra esqui em Whistler/Banff.',
  },
  IE: {
    texto: 'A Irlanda é o destino subestimado da Europa: pubs autênticos, costas dramáticas, cultura literária forte, gente conversadora. Dublin sozinha não rende — o segredo é alugar carro e fazer Wild Atlantic Way. Custo médio, mas hospedagem fora de Dublin é bem mais barata.',
    combina: ['roteiro 8-10 dias com carro fora de Dublin', 'interesse em pub/cultura/literatura', 'casal que aprecia natureza dramática', 'primeira Europa fora dos circuitos óbvios'],
    naoCombina: ['viagem só urbana em Dublin', 'medo de dirigir na esquerda', 'quem precisa de sol constante'],
    oportunidade: 'Maio-setembro: clima possível, dias longos e Wild Atlantic Way operando. Outubro também rende, com menos turismo.',
  },
  CZ: {
    texto: 'Praga é a viagem de "Europa Central acessível": castelo, cervejaria, arquitetura intacta, custo bem menor que Europa Ocidental. Funciona muito bem como 4-5 dias intensos ou como parte de um roteiro Europa Central (com Budapeste e Viena). Lotada no verão, vale ir fora do pico.',
    combina: ['4-5 dias intensos em Praga', 'roteiro Europa Central 12-14 dias', 'interesse em arquitetura e cerveja', 'orçamento que aperta na Europa Ocidental'],
    naoCombina: ['10+ dias só em Praga', 'busca por praia', 'julho-agosto (lotado e mais caro)'],
    oportunidade: 'Abril-maio ou setembro-outubro: Praga sem multidão, clima bom e preços bem mais civilizados.',
  },
  HR: {
    texto: 'A Croácia é "Grécia atualizada": costa dálmata, cidades medievais (Dubrovnik, Split), ilhas e parques nacionais (Plitvice). Era barato; agora subiu de preço (especialmente Dubrovnik). Mas ainda rende muito mais que Grécia em variedade de paisagem. Vale roteiro de carro/balsa norte-sul.',
    combina: ['10-12 dias misturando Plitvice+Split+Dubrovnik+ilha', 'casal aventureiro', 'primeira viagem na ex-Iugoslávia', 'interesse em natureza+cidade+mar'],
    naoCombina: ['5 dias só em Dubrovnik', 'orçamento muito apertado no verão', 'busca por cultura tradicional muito viva'],
    oportunidade: 'Junho ou setembro: mar morno, cidades sem hordas de cruzeiros e preços bem mais razoáveis que julho-agosto.',
  },
  BO: {
    texto: 'A Bolívia é provavelmente o destino mais barato da América do Sul para brasileiros, e o de paisagem mais alienígena: Salar de Uyuni, Lagoa Colorada, La Paz/Lago Titicaca. Custo absurdamente baixo, mas logística e altitude pesam. Vale como 8-10 dias com tour organizado para o Salar.',
    combina: ['orçamento muito controlado', 'paisagens únicas (Salar)', '8-10 dias com tour organizado', 'mochileiro com disposição'],
    naoCombina: ['sensibilidade à altitude', 'busca por cidade grande/sofisticada', 'viagem com criança pequena'],
    oportunidade: 'Abril-maio para Salar com pouca água (chão de sal) ou janeiro-março para Salar com espelho d\'água — escolha visual.',
  },
  PA: {
    texto: 'O Panamá é a viagem "stopover" que vale como destino: 7-10 dias entre Cidade do Panamá (canal, skyline tropical), Bocas del Toro (Caribe selvagem) e San Blas (paraíso indígena). Custo médio. Funciona bem como primeiro contato com Centro-América sem complicação.',
    combina: ['7-10 dias misturando cidade+Caribe', 'primeira viagem em Centro-América', 'casal querendo experiência tropical autêntica', 'interesse pelo Canal e Causeway'],
    naoCombina: ['viagem só de praia (existem melhores no Caribe)', 'busca por cultura prehispânica forte', 'orçamento muito apertado em San Blas'],
    oportunidade: 'Dezembro-abril: estação seca, com San Blas e Bocas no auge. Maio-novembro tem chuva intensa.',
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

// Alertas humanos curados por país (extraídos da voz do veredito de cada um).
// Use uma frase: o ponto de atenção real para brasileiros, sem template genérico.
const ALERTAS_HUMANOS = {
  PT: 'Fácil e segura, mas hospedagem em euro costuma pesar mais que o previsto.',
  TH: 'Barata no dia a dia, mas o voo saindo do Brasil pode engolir o orçamento.',
  PE: 'Ótimo valor, com atenção para altitude e deslocamentos internos.',
  AR: 'Custo bom no peso, mas câmbio paralelo e instabilidade mexem com hospedagem.',
  CL: 'Estrutura europeia em Sul-América, mas Patagônia e Atacama puxam o orçamento.',
  UY: 'Vizinho próximo e seguro, mas Punta no verão paga preço Caribe.',
  ES: 'Equilíbrio raro de cidade+praia+comida, mas alta temporada em agosto é caos.',
  IT: 'Comida e história compensam, mas vitrine cobra mais que custo real prometido.',
  FR: 'Paris é experiência única, mas hospedagem na cidade é o que mais aperta.',
  US: 'Câmbio dólar pesa em tudo, mas voos diretos e estrutura compensam para roteiros longos.',
  MX: 'Praia tropical com infra forte, mas Cancún no fim do ano paga preço Caribe e a cultura real fica em CDMX/Oaxaca.',
  JP: 'Dia a dia mais barato do que parece, mas o voo + hospedagem em Tóquio só fazem sentido com 12+ dias.',
  GR: 'Mar e comida fáceis, mas Santorini cobra preço de Mediterrâneo de luxo.',
  TR: 'Lira fraca rende muito, mas precisa de 10+ dias pra justificar a distância de Capadócia.',
  EG: 'Pirâmides e Nilo entregam o clichê justificado, mas calor e assédio pedem guia local pra não cansar.',
  AE: 'Stopover de luxo funciona, mas cultura é vitrine — 10 dias só em Dubai geralmente não rende.',
  CO: 'Custo bom e variedade rara na América do Sul, mas altitude em Bogotá e logística entre regiões pedem planejamento.',
  NL: 'Amsterdam rende em 4-5 dias intensos, mas estender muito tempo só na cidade aperta o orçamento sem dar retorno.',
  DE: 'Cidades organizadas e trem que funciona, mas 5 dias em Berlim não cobre a Alemanha — pense roteiro 12+ dias.',
  GB: 'Londres é Manhattan europeu, mas a libra + hospedagem cara fazem 5 dias parecerem 3.',
  ID: 'Bali rende com 14+ dias diluindo voo, mas viagem de 7 dias geralmente não compensa a distância.',
  VN: 'Custo absurdamente baixo no chão, mas o voo longo e sem direto do Brasil pede mochilão de 14+ dias.',
  MA: 'Exótico próximo e infra turística boa, mas assédio comercial e ramadã podem chocar — vale guia/agência.',
  KR: 'Cultura coreana puxa interesse, mas custo é alto e voo longo — 10+ dias mínimo pra render.',
  CA: 'Natureza extrema com estrutura ocidental, mas dólar canadense pesa em tudo — orçamento curto não rende.',
  IE: 'Pubs e Wild Atlantic Way em 8-10 dias com carro, mas Dublin sozinha frustra e clima é instável.',
  CZ: 'Praga rende em 4-5 dias intensos, mas no verão fica lotada — fora do pico é onde compensa.',
  HR: 'Costa dálmata varia muito de preço — Dubrovnik subiu demais, Plitvice e ilhas ainda têm bom retorno.',
  BO: 'Salar e altitude são únicos, mas logística pesada pede tour organizado — não é destino pra improvisar.',
  PA: 'Stopover que vale como destino, mas só de praia tem opções melhores no Caribe.',
};

export function alertaHumanoDestino(destino) {
  const curado = ALERTAS_HUMANOS[destino?.code];
  if (curado) return curado;
  const custoDia = num(destino && destino.custoDia);
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
