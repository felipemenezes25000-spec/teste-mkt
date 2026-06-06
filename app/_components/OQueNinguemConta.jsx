'use client';
import { useIdioma } from '../_lib/i18n.js';

// Bloco "O que ninguém te conta" — dicas honestas curadas por país que NÃO
// aparecem em blog de turismo: golpes comuns, distâncias reais, lotação por
// ponto turístico, custos escondidos por região, riscos específicos.
//
// Quando o país não está no curado, geramos 3 alertas heurísticos por região +
// custo, pra nenhum destino renderizar vazio.
//
// Conteúdo das dicas está em pt-BR (cultural-específico curado pra brasileiros).
// Em outros idiomas, mostramos uma nota e o conteúdo segue PT.

const CURADO = {
  PT: [
    { icon: '🚇', txt: 'Lisboa é caminhável, mas tem morros pesados. Hotel “bem localizado” em ladeira vira maratona de joelho.' },
    { icon: '🍽️', txt: 'Couvert (pão, manteiga, azeitona) é cobrado e não é grátis — recuse na chegada se não quiser pagar.' },
    { icon: '💳', txt: 'Caixa eletrônico do aeroporto cobra taxa pesada. Saque na cidade ou pague no cartão internacional.' },
  ],
  TH: [
    { icon: '🛺', txt: 'Tuk-tuk em Bangkok cobra 3x do taxímetro. Use Grab — é o Uber tailandês.' },
    { icon: '🐘', txt: 'Tour de elefante com banho/passeio em cima = abuso animal. Procure santuário sem montaria (Elephant Nature Park).' },
    { icon: '🏝️', txt: 'Phi Phi e Maya Bay estão saturadas. Koh Lanta e Koh Mak rendem mais por menos.' },
    { icon: '💸', txt: 'Conversão no balcão de câmbio do aeroporto é ruim. Use SuperRich na cidade.' },
  ],
  PE: [
    { icon: '🏔️', txt: 'Altitude em Cusco (3.400m) cobra um dia inteiro. Vá direto pra Vale Sagrado (2.800m) por 2 dias antes de subir.' },
    { icon: '🎫', txt: 'Ingresso pra Machu Picchu lota com 1-2 meses de antecedência na alta. Compre cedo no site oficial.' },
    { icon: '🚂', txt: 'PeruRail vs IncaRail: preço parecido, conforto parecido. Reserve com antecedência — last minute triplica.' },
    { icon: '💧', txt: 'Não beba água de torneira em lugar nenhum. Garrafa lacrada ou filtro pessoal.' },
  ],
  JP: [
    { icon: '🚄', txt: 'JR Pass não vale mais a pena pra todo mundo desde o reajuste de 2023. Conta os trechos antes.' },
    { icon: '🍣', txt: 'Sushi de esteira é decepcionante em Tóquio. Vá em Toyosu de manhã (5h-10h) pra ver atacado + comer no melhor preço.' },
    { icon: '💴', txt: 'Muitos lugares ainda só aceitam dinheiro vivo. Saque em 7-Eleven (FamilyMart também) — funcionam 24h com cartão internacional.' },
    { icon: '🏨', txt: 'Quarto de hotel em Tóquio é apertado de verdade. Não tente otimizar preço — pesquise tamanho do quarto antes.' },
  ],
  MX: [
    { icon: '🌊', txt: 'Cancún hotel zone é resort — não é México de verdade. Pra cultura, vai pra Mérida, Oaxaca ou CDMX.' },
    { icon: '🚐', txt: 'ADO (ônibus) entre Cancún → Tulum → Mérida é confortável, seguro e barato. Vans piratas, não.' },
    { icon: '🌬️', txt: 'Setembro-outubro é furacão na Riviera Maya. Voo barato porque tem risco real.' },
    { icon: '💉', txt: 'Comida de rua vale a pena, mas escolha barraca cheia. Lugar vazio é alerta de barriga.' },
  ],
  IT: [
    { icon: '🍝', txt: 'Restaurante perto de atração turística é ruim e caro. Ande 4 quadras pra qualquer direção antes de almoçar.' },
    { icon: '🚄', txt: 'Trenitalia tem categorias: o regional para em tudo e custa 1/3 do Frecciarossa. Pra trechos curtos, vale.' },
    { icon: '☕', txt: 'Café sentado custa 2-3x mais que em pé no balcão. Italiano nativo toma em pé.' },
    { icon: '🏛️', txt: 'Coliseu/Vaticano sem fila reservada = 3-4h na fila no verão. Reserva online é obrigatória.' },
  ],
  FR: [
    { icon: '🥖', txt: 'Restaurante turístico em Paris é caro e ruim. Almoço de prix fixe (formule midi) em bistrô local é o melhor custo-benefício.' },
    { icon: '🚇', txt: 'Metrô de Paris é fácil, mas escada e troca cansam. Compare hotel-perto-de-metrô com hotel caminhável.' },
    { icon: '🗼', txt: 'Topo da Torre Eiffel = fila eterna. Trocadero ou Champ de Mars de fora é melhor foto e grátis.' },
    { icon: '🍷', txt: 'Vinho de casa (vin de la maison) costuma ser bom e barato. Não precisa ler carta de vinhos.' },
  ],
  ID: [
    { icon: '🛵', txt: 'Bali sem moto é difícil. Mas trânsito mata 30+ turistas por ano — alugue só se já souber pilotar.' },
    { icon: '🏖️', txt: 'Kuta e Seminyak estão saturadas e caras. Vale Amed, Sidemen, Nusa Penida pra Bali real.' },
    { icon: '💸', txt: 'ATM cobra taxa por saque + tem limite baixo. Vale sacar valor cheio numa vez só.' },
    { icon: '🦠', txt: '"Bali belly" é real. Coma onde tem fila local, evite saladas em quiosque de praia.' },
  ],
  AR: [
    { icon: '💸', txt: 'Câmbio paralelo (dólar blue) rende quase o dobro do oficial. Western Union ou casa de câmbio na rua Florida.' },
    { icon: '🥩', txt: 'Parrilla em bairro residencial é melhor e mais barata que em Palermo. Pergunte ao taxista.' },
    { icon: '🚇', txt: 'Subte em BA é barato e funciona. Uber também — e dá pra pagar em pesos.' },
    { icon: '🍷', txt: 'Vinhos em mercado custam 1/3 do restaurante. Compre e leve pro hotel.' },
  ],
  ES: [
    { icon: '🍴', txt: 'Almoço espanhol é 14h-16h, jantar 21h-23h. Tente comer fora desse horário e só tem bar turístico aberto.' },
    { icon: '🚄', txt: 'Renfe AVE é caro com pouca antecedência, mas com 30+ dias pode sair 1/3. Reserve cedo.' },
    { icon: '☀️', txt: 'Andaluzia em agosto = 42°C. Andar de dia é tortura. Visite cedo (7h-11h) ou tarde (18h+).' },
    { icon: '🏛️', txt: 'Sagrada Família e Alhambra sem reserva = não entra. Ingresso esgota 2-3 semanas antes na alta.' },
  ],
  TR: [
    { icon: '🎈', txt: 'Balão em Capadócia: 60% dos dias na alta voa. Reserve 2 noites lá pra ter chance dupla.' },
    { icon: '🛍️', txt: 'Grand Bazaar tem preço inicial 3x. Saia da loja sem comprar — chamam de volta com 1/3.' },
    { icon: '🚊', txt: 'Istambul tem ferries baratos entre lado europeu/asiático. Tour turístico do Bósforo é a versão cara da mesma coisa.' },
    { icon: '☪️', txt: 'Em mesquita, ombro/joelho coberto. Lenço dado na entrada é grátis pra mulher.' },
  ],
  CO: [
    { icon: '🚖', txt: 'Bogotá: use Uber/Cabify, não pegue taxi na rua. Aeroporto-cidade tem app no balcão oficial.' },
    { icon: '🌬️', txt: 'Altitude em Bogotá (2.600m) cobra. Não chegue e suba pro Monserrate no mesmo dia.' },
    { icon: '☕', txt: 'Eje Cafetero é mais bonito que Medellín pra ficar. Salento como base, 3-4 dias.' },
    { icon: '💸', txt: 'Cartagena na alta (dez-jan) custa 3x o resto do país. Vai em maio.' },
  ],
  US: [
    { icon: '💰', txt: 'Preço marcado nunca é o preço final — soma imposto + gorjeta (18-22% obrigatória).' },
    { icon: '🚗', txt: 'NY e SF dispensam carro. Resto dos EUA é hostil sem.' },
    { icon: '🏥', txt: 'Qualquer atendimento médico custa US$ 500+. Seguro viagem não é luxo.' },
    { icon: '🍔', txt: 'Combo de fast food chega em US$ 12-15. Almoço normal em US$ 20-30.' },
  ],
  EG: [
    { icon: '☀️', txt: 'Outubro a março é o calor "civilizado" (25-30°C). Maio-agosto bate 45°C sem sombra.' },
    { icon: '👀', txt: 'Assédio comercial em pirâmides é constante. Guia oficial reduz, mas não zera. Combine preço antes.' },
    { icon: '💵', txt: 'Gorjeta (baksheesh) é parte do jogo. Tenha notas pequenas — banheiro, foto, ajudante, tudo cobra 5-10 EGP.' },
    { icon: '🚢', txt: 'Cruzeiro no Nilo de 4 noites (Luxor-Aswan) rende mais que de 3. Não pegue o mais barato — varia muito de qualidade.' },
  ],
  AE: [
    { icon: '☀️', txt: 'Verão (jun-set) bate 45°C com umidade. Outubro-março é a única janela civilizada.' },
    { icon: '👗', txt: 'Em shopping/metrô, ombro e joelho cobertos. Em praia pública, mesma regra fora da areia.' },
    { icon: '🍷', txt: 'Álcool só em hotel/restaurante licenciado. Fora disso, é crime — não compre na rua.' },
    { icon: '🚇', txt: 'Metrô vai pra quase tudo turístico. Cabine "Gold Class" custa o dobro pelos primeiros 5min de assento.' },
  ],
  GB: [
    { icon: '🍺', txt: 'Pub fecha 23h em quase tudo fora de Londres. Plano de "comer tarde" não funciona — jante 19h.' },
    { icon: '🚇', txt: 'Tube de Londres tem zona — quanto mais zona, mais caro. Oyster card sai melhor que comprar bilhete.' },
    { icon: '🌧️', txt: 'Não é frio sempre, é chuva imprevisível. Casaco impermeável é mais útil que blusa grossa.' },
    { icon: '🚆', txt: 'Trem de Londres pra Escócia/Bath/Oxford reserva com 4+ semanas pelo preço civilizado. Comprado no balcão = 3x.' },
  ],
  DE: [
    { icon: '💳', txt: 'Muitos restaurantes, padarias e até hotéis não aceitam cartão. Sempre carregue euros em espécie.' },
    { icon: '🚆', txt: 'Deutsche Bahn é pontual quando funciona — mas atrasa muito. Reserve voo de conexão com 3h+ de folga.' },
    { icon: '🍽️', txt: 'Restaurante fecha entre 14h-17h em quase tudo. Almoçou tarde? Jantou cedo. Não dá pra empurrar.' },
    { icon: '🛂', txt: 'Em Berlim, controle de fronteira na chegada pode demorar 1h+. Não agende compromisso colado.' },
  ],
  NL: [
    { icon: '🚲', txt: 'Bicicleta tem prioridade absoluta. Andar olhando celular = atropelamento certo.' },
    { icon: '🛏️', txt: 'Quartos de hotel em Amsterdam são minúsculos — confira metragem antes. "Confortável" no anúncio = 8m².' },
    { icon: '🌷', txt: 'Tulipas só na primavera (mar-mai). Keukenhof tem janela de 2 meses por ano.' },
    { icon: '☕', txt: 'Coffee shop ≠ café. Pra café de manhã, procure "koffiehuis" ou padaria.' },
  ],
  GR: [
    { icon: '⛴️', txt: 'Ferry entre ilhas cancela com vento. Não compre conexão no mesmo dia do voo internacional.' },
    { icon: '☀️', txt: 'Junho-agosto = inferno + lotação + preço. Maio e setembro têm clima ótimo e metade da multidão.' },
    { icon: '🍷', txt: 'Santorini tá saturada e cara. Naxos, Milos e Folegandros entregam mais por menos.' },
    { icon: '💸', txt: 'Caixa eletrônico de aeroporto cobra fee absurdo. Saque na cidade.' },
  ],
  CH: [
    { icon: '💰', txt: 'Tudo custa o dobro. Sanduíche simples 18 CHF, jantar básico 40+. Não tem "lugar barato".' },
    { icon: '🚆', txt: 'Swiss Travel Pass parece caro mas paga em 4 dias. Não pegue trem avulso, vai estourar.' },
    { icon: '🏔️', txt: 'Funicular pro Jungfraujoch custa 200+ CHF. Vista igual em Schynige Platte por 1/3.' },
    { icon: '💧', txt: 'Beba água da torneira em qualquer lugar — é melhor que mineral. Garrafa de 5 CHF é dinheiro jogado fora.' },
  ],
  AT: [
    { icon: '🍰', txt: 'Café com mesa cobra "couvert" implícito (preço por sentar). Em pé no balcão é metade.' },
    { icon: '🎼', txt: 'Concerto "Mozart de Sissi" em Viena é armadilha turística. Procure Konzerthaus ou Musikverein de verdade.' },
    { icon: '💳', txt: 'Como Alemanha, cartão raramente aceito fora de turismo. Saque cedo.' },
    { icon: '🚏', txt: 'Bilhete único do metrô serve em metrô+ônibus+bonde por 1h. Vale dia inteiro só com Tageskarte.' },
  ],
  IE: [
    { icon: '🚗', txt: 'Mão inglesa + carros pequenos. Não tente dirigir sem ter calma — Cliffs of Moher de carro são parte da viagem.' },
    { icon: '🌧️', txt: 'Pode chover 5 dias seguidos em julho. "Verão" irlandês = 17°C com vento. Aceite ou adoeça.' },
    { icon: '🍺', txt: 'Pub bom é com música ao vivo (trad session). Pergunte a local — guia turístico recomenda lugar inflado.' },
    { icon: '💷', txt: 'Norte da Irlanda usa libra (£). Sul usa euro. Cruzar a fronteira muda moeda sem aviso.' },
  ],
  CZ: [
    { icon: '🍺', txt: 'Pilsner Urquell no balcão = 60 CZK. Mesma cerveja na Praça Velha = 200 CZK. Ande 3 ruas.' },
    { icon: '💱', txt: 'Casa de câmbio de Praga é o maior golpe — "sem comissão" mente. Use ATM Euronet ou KB Bank.' },
    { icon: '🎫', txt: 'Castelo de Praga, ingresso pago já dá acesso interno. "Tour grátis" do guia da praça vende tour interno depois.' },
    { icon: '🚊', txt: 'Bonde 22 percorre os pontos turísticos por 30 CZK. Tour hop-on-hop-off cobra 500+ pelo mesmo trajeto.' },
  ],
  HR: [
    { icon: '⛴️', txt: 'Dubrovnik no verão = navio de cruzeiro + 5x preço. Manhã cedo (7-9h) é a única janela vazia.' },
    { icon: '🌊', txt: 'Praia croata é pedra, não areia. Sapato de água não é luxo, é necessidade.' },
    { icon: '🚌', txt: 'FlixBus entre cidades é mais confortável que trem e ferry combinado. 1/3 do preço de carro alugado.' },
    { icon: '🍷', txt: 'Vinho de Pelješac (Plavac Mali) é melhor que tudo de Dubrovnik. Pague metade comprando direto na vinícola.' },
  ],
  HU: [
    { icon: '🛁', txt: 'Banhos termais Széchenyi e Gellért. Vá num dia útil cedo — fim de semana vira piscinão.' },
    { icon: '💵', txt: 'Casa de câmbio costuma cobrar 8-10% de "fee escondido". Compare em 3 lugares antes.' },
    { icon: '🍴', txt: 'Restaurante com "Étterem Service" cobra 12% de serviço. Não pague gorjeta extra.' },
    { icon: '🚖', txt: 'Bolt e Főtaxi são confiáveis. Táxi na rua sem app costuma multiplicar a corrida.' },
  ],
  SE: [
    { icon: '🌃', txt: 'Verão tem sol até meia-noite (jun-jul). Inverno é o oposto: escuro às 15h. Planeje energia.' },
    { icon: '💳', txt: 'Suécia praticamente não usa dinheiro. Tudo é cartão ou Swish. Casa de câmbio é dispensa.' },
    { icon: '🍻', txt: 'Sistembolaget é o monopólio estatal de álcool — fecha cedo e domingo. Planeje antes.' },
    { icon: '🦌', txt: 'Norte sueco (Lapônia) tem aurora boreal sólida em dez-fev. Verão = mosquito agressivo.' },
  ],
  CL: [
    { icon: '⛰️', txt: 'Atacama (San Pedro) está a 2.400m. Não suba e faça geyser no mesmo dia — passe mal certeza.' },
    { icon: '🧳', txt: 'Voo doméstico tem regra de bagagem rígida. LATAM Economy só permite bolsa de mão pequena.' },
    { icon: '💸', txt: 'Santiago barato é Patronato e Bellavista. Las Condes/Vitacura é Brasília-shopping pra brasileiro.' },
    { icon: '🍷', txt: 'Vinho na vinícola sai pela metade do supermercado, e na loja oficial da Concha y Toro custa mais que aeroporto.' },
  ],
  UY: [
    { icon: '🥩', txt: 'Parrilla turística em Mercado del Puerto é cara e ruim. Vá em bairro tipo Pocitos.' },
    { icon: '💸', txt: 'Punta del Este em janeiro = preço Saint-Tropez. Março ainda tem mar e custa 1/3.' },
    { icon: '🚍', txt: 'Buquebus pra Buenos Aires é prático mas caro. Colonia Express é metade do preço.' },
    { icon: '☕', txt: 'Mate é cultura, não bebida turística. Não peça café enquanto andam de mate na rua.' },
  ],
  BO: [
    { icon: '🏔️', txt: 'La Paz a 3.640m derruba qualquer não-aclimatado. Chegue, durma, NÃO suba pra El Alto de cara.' },
    { icon: '🚐', txt: 'Salar de Uyuni: tour de 3 dias vale mais que 1 dia. Janeiro-março tem espelho d\'água; mai-out tem chão de sal.' },
    { icon: '💵', txt: 'Bolivianos não aceitam cartão fora de hotel grande. Tenha dinheiro vivo — saque é limitado.' },
    { icon: '🧗', txt: 'Death Road de bike é seguro com agência boa. NÃO economize aqui — vai de Gravity, Madness ou Barracuda.' },
  ],
  EC: [
    { icon: '🐢', txt: 'Galápagos exige voo doméstico + taxa de US$ 100 entrada + US$ 20 cartão Ingala. Some no orçamento.' },
    { icon: '🌋', txt: 'Quito está a 2.850m. Combine com Cuenca/Baños depois — escala suave de altitude.' },
    { icon: '💵', txt: 'Equador usa dólar americano direto. Notas grandes são rejeitadas em quase tudo. Quebre antes.' },
    { icon: '🌧️', txt: 'Costa tem temporada de chuva oposta da Sierra. Olhe a região, não o país, antes de marcar.' },
  ],
  CA: [
    { icon: '🚗', txt: 'Distâncias enganam. Toronto pra Niagara são 2h só. Mas pra Quebec, 8h. Não confie em km no mapa.' },
    { icon: '🧥', txt: 'Inverno canadense é -25°C com vento. Roupa de neve brasileira não serve. Compre lá ou alugue.' },
    { icon: '🦌', txt: 'Banff/Jasper na alta (jul-ago) lota. Setembro tem floresta amarela e metade dos turistas.' },
    { icon: '💵', txt: 'Preço marcado não inclui imposto (provincial+federal, ~13%) + gorjeta 15-20%. Some 30% pra estimar real.' },
  ],
  CU: [
    { icon: '💱', txt: 'Câmbio cubano mudou em 2021. Euro/CAD rende melhor que dólar. Só USD em espécie limpo é aceito.' },
    { icon: '📵', txt: 'Internet é por cartão Etecsa (5 USD/h em hotspot público). Não conte com WhatsApp constante.' },
    { icon: '🏠', txt: 'Casa particular > hotel estatal em quase tudo. Localmente reservado pelo Airbnb antes de viajar.' },
    { icon: '💊', txt: 'Leve seu próprio remédio (até paracetamol). Farmácia tem prateleira vazia em quase tudo.' },
  ],
  DO: [
    { icon: '🏖️', txt: 'Punta Cana resort all-inclusive ≠ República Dominicana. Pra cultura, vá pra Santo Domingo/Las Galeras.' },
    { icon: '🌪️', txt: 'Jun-nov é furacão. Voo barato existe por causa do risco. Seguro com cancelamento amplo é mandatório.' },
    { icon: '💵', txt: 'USD aceito em tudo turístico, troco em pesos. Notas grandes podem não ter troco.' },
    { icon: '🚖', txt: 'Não pegue taxi na rua — combinem preço antes ou use Uber. App é mais barato e seguro.' },
  ],
  PA: [
    { icon: '✈️', txt: 'Hub de Copa permite stopover sem custo extra de até 7 dias. Use isso pra viagem econômica multi-destino.' },
    { icon: '🌴', txt: 'San Blas requer guia indígena Kuna. Reserva 2 dias antes mínimo — fluxo controlado.' },
    { icon: '💰', txt: 'Cidade do Panamá é cara como Miami; pra interior (Bocas, Boquete), o preço cai à metade.' },
    { icon: '☔', txt: 'Mai-dez chove diariamente — costuma ser tarde, dia funciona. Plano de manhã + plano B tarde.' },
  ],
  CR: [
    { icon: '🦥', txt: 'Manuel Antonio lota brutalmente. Corcovado/Tortuguero rende mais — mas exige guia.' },
    { icon: '🚗', txt: 'Carro 4x4 não é luxo no interior — Monteverde pra Arenal sem 4x4 é tortura.' },
    { icon: '🌧️', txt: 'Verão (dez-abr) é seco. Inverno (mai-nov) chove de tarde quase todo dia. Adapte horário.' },
    { icon: '💵', txt: 'Tudo turístico aceita USD. Mas dão troco em colón em câmbio ruim. Tenha colón pra pequenas compras.' },
  ],
  VN: [
    { icon: '🛵', txt: 'Hanoi/HCMC têm trânsito caótico. Cruzar rua = ande devagar e firme, eles desviam. Parar = acidente.' },
    { icon: '🍜', txt: 'Pho de cadeira na calçada é seguro e melhor que restaurante turístico. Procure fila local.' },
    { icon: '🚌', txt: 'Sleeper bus norte-sul (HCMC-Hanoi) é experiência única e barata. Reserve com Vietnam Travel Bus.' },
    { icon: '💵', txt: 'Dong vietnamita pode dar 1 milhão = R$ 200. Não se assuste com nota grande. Confira zeros.' },
  ],
  MY: [
    { icon: '🌧️', txt: 'Monção do leste (nov-mar) fecha Perhentian/Tioman. Borneo continua aberto. Pesquise lado certo.' },
    { icon: '🚆', txt: 'KTM pra Singapura demora pouco mas exige troca de migração. Faça isso de manhã pra evitar fila.' },
    { icon: '🍴', txt: 'Hawker centre em Penang/KL é cultura. Banquete por 5-10 RM, mesa compartilhada — você pertence à comida.' },
    { icon: '🕌', txt: 'Em Putrajaya/mesquita, ombro/joelho coberto. Lenço dado na entrada é grátis pra mulher.' },
  ],
  SG: [
    { icon: '💵', txt: 'Cidade-Estado careza similar a Tóquio. Hostel cama 30+ SGD, hotel decente 200+. Não tem opção barata.' },
    { icon: '🚇', txt: 'MRT é impecável e o tipo de coisa que vale 1 dia inteiro só andando. Vale dia inteiro com Tourist Pass.' },
    { icon: '🍴', txt: 'Hawker centre é a única forma de comer barato. 5-8 SGD por refeição decente. Tem fila por motivo.' },
    { icon: '🚭', txt: 'Multa por chiclete, lixo, atravessar fora da faixa. Não é piada. Respeite ou pague.' },
  ],
  IN: [
    { icon: '🚖', txt: 'Use Ola ou Uber, nunca taxi de aeroporto não-oficial. Pre-paid taxi booth dentro do terminal é seguro.' },
    { icon: '💊', txt: 'Belly de Delhi é real. Água lacrada sempre, gelo NÃO, salada NÃO. Frutas você descasca, ok.' },
    { icon: '🎫', txt: 'Taj Mahal tem ingresso 5x maior pra estrangeiro. Compre online — fila do estrangeiro é menor.' },
    { icon: '🚆', txt: 'Trem indiano é experiência. AC2/AC3 reserva com 30+ dias. Tatkal (1 dia antes) é caro mas funciona.' },
  ],
  KR: [
    { icon: '📱', txt: 'WiFi pública é universal e rápida. T-money card (recarregável) serve em metrô + ônibus + 7-Eleven.' },
    { icon: '🍴', txt: 'Coreano come em grupo. Mesa pra um é raro. Restaurantes de hotpot exigem 2 pessoas.' },
    { icon: '🛍️', txt: 'Myeongdong é Times Square coreano: lotado, caro, raso. Pra compras autênticas vá pra Hongdae ou Ewha.' },
    { icon: '🌸', txt: 'Sakura coreana (cerejeira) é abril; outono colorido é final de outubro. Janelas curtas, planeje antes.' },
  ],
  PH: [
    { icon: '✈️', txt: 'Voar entre ilhas é necessário e caro. Cebu Pacific tem promo, mas bagagem despachada quase dobra.' },
    { icon: '🌪️', txt: 'Tufão (jun-nov) cancela voo doméstico sem aviso. Reserva flexível com Booking ou Agoda salva.' },
    { icon: '💵', txt: 'Peso filipino flutua. ATM tem fee de 250 PHP por saque + limite baixo. Saque maior valor.' },
    { icon: '🏝️', txt: 'El Nido/Coron são incríveis mas distantes. 14+ dias mínimo. Em menos, frustra com avião e barco.' },
  ],
  NP: [
    { icon: '🏔️', txt: 'Everest Base Camp é trekking sério, 12-16 dias. Annapurna é mais leve e funcional pra primeira.' },
    { icon: '💉', txt: 'Vacina raiva, hep A, tifoide. Veja médico 4 semanas antes mínimo. Diamox pra altitude vale levar.' },
    { icon: '🚗', txt: 'Estrada Katmandu-Pokhara são 6h reais (200km). Voo doméstico salva, mas tem risco mais alto.' },
    { icon: '⛰️', txt: 'Trekking sem guia ficou proibido em 2023. Combine no balcão da TAAN em Thamel.' },
  ],
  LK: [
    { icon: '🚆', txt: 'Trem Ella-Kandy é o passeio mais bonito do Sri Lanka. Reserve com 1 semana — lota.' },
    { icon: '🐘', txt: 'Safári Yala/Udawalawe não garante elefante. Manhã cedo (5h) tem mais chance que tarde.' },
    { icon: '🌧️', txt: 'Duas estações de monção opostas no país. Costa oeste de mai-set; costa leste de nov-mar.' },
    { icon: '💵', txt: 'Pague hospedagem em USD/EUR — rúpia desvaloriza demais entre reserva e check-in.' },
  ],
  KH: [
    { icon: '🌅', txt: 'Sunrise de Angkor Wat é lotado. Sunset de Pre Rup tem 1/10 do público e nascer do sol é igualmente bonito.' },
    { icon: '🚖', txt: 'Tuk-tuk em Siem Reap por dia é melhor que avulso. Negocie 15-20 USD pra circuito de templos.' },
    { icon: '💵', txt: 'Cambodia usa USD direto em quase tudo. Riel vem como troco abaixo de 1 dólar.' },
    { icon: '👜', txt: 'Vendedor de souvenir em templo é assédio. "No thank you" firme e ande. Não pare pra explicar.' },
  ],
  AU: [
    { icon: '💰', txt: 'Brunch básico AUD 25-35. Não tem "opção barata" como Sudeste Asiático. Calcule por cidade australiana.' },
    { icon: '🦘', txt: 'Distâncias são gigantes. Sydney-Melbourne é 9h de carro. Voo é a única opção realista.' },
    { icon: '🌊', txt: 'Praia tem correnteza brava e tubarão. Respeite bandeira e nadando entre as faixas amarelas e vermelhas.' },
    { icon: '☀️', txt: 'UV é absurdo. Protetor 50+ a cada 2h, chapéu de aba larga. Câncer de pele é o esporte nacional.' },
  ],
  NZ: [
    { icon: '🚐', txt: 'Campervan é o jeito típico de ver a Ilha Sul. Reserve estação chuvosa (jun-ago = inverno, esquia).' },
    { icon: '🚗', txt: 'Mão inglesa + estradas de montanha sinuosas. 200km podem ser 4h. Não subestime.' },
    { icon: '☀️', txt: 'Como Austrália, UV brutal. Verão (dez-fev) é quando turista vai, mas é alta temporada.' },
    { icon: '🌋', txt: 'Tongariro Crossing reserva ônibus de retorno com antecedência. Não pode estacionar carro lá.' },
  ],
  ZA: [
    { icon: '🚖', txt: 'Cape Town/Joanesburgo: NÃO ande à noite em algumas zonas. Use Uber, mesmo trajeto curto.' },
    { icon: '🦁', txt: 'Safári no Kruger pode ser self-drive (mais barato) ou guiado. Self-drive funciona com 4-5 dias.' },
    { icon: '🍷', txt: 'Stellenbosch/Franschhoek = vinícolas a 1h de Cape Town. Wine tasting 5-15 USD vs 50+ na Toscana.' },
    { icon: '💉', txt: 'Malária no Kruger no verão (out-abr). Atovaquona ou doxiciclina, médico decide. Não pule.' },
  ],
  KE: [
    { icon: '🦁', txt: 'Masai Mara julho-outubro = migração. Setembro é o pico. Reserve com 3+ meses na alta.' },
    { icon: '💉', txt: 'Febre amarela é obrigatória pra entrar. Malária preventiva (Lariam ou Malarone) por 4 semanas.' },
    { icon: '🚐', txt: 'Safári por agência local em Nairobi vs comprado do Brasil: metade do preço, mesma qualidade.' },
    { icon: '💵', txt: 'M-Pesa (carteira por celular) domina pagamento local. Turista usa USD/cartão em hotel.' },
  ],
  IL: [
    { icon: '🛂', txt: 'Carimbo de Israel impede entrada em alguns países árabes. Peça selo separado na imigração.' },
    { icon: '🍴', txt: 'Sexta-feira até sábado à noite (Shabbat) muita coisa fecha. Restaurante kosher rigoroso fecha 100%.' },
    { icon: '🚌', txt: 'Ônibus público para no Shabbat. Sherut (van compartilhada) funciona — saiba os pontos.' },
    { icon: '💵', txt: 'Shekel forte e tudo caro. Tel Aviv tem preço Europa Ocidental. Jerusalém é só um pouco mais barato.' },
  ],
  JO: [
    { icon: '💰', txt: 'Jordan Pass cobre Petra (que sozinha custa 50 JOD/dia) + visto + 40 sítios. Compre antes de viajar.' },
    { icon: '🌅', txt: 'Petra exige 2 dias inteiros. Petra by Night (segunda/quarta/quinta) é separado, vale ir.' },
    { icon: '🏜️', txt: 'Wadi Rum tem temperatura extrema dia-noite. 38°C de dia, 5°C de madrugada no inverno.' },
    { icon: '🚖', txt: 'Combine preço com taxista antes. Uber/Careem funcionam em Amã mas não no resto do país.' },
  ],
  QA: [
    { icon: '🛂', txt: 'Stopover pago da Qatar Airways permite Doha 24-96h por barato. Bom pra dividir voo longo.' },
    { icon: '☀️', txt: 'Mai-set bate 45°C — andar de dia é tortura. Tudo turístico é à noite ou shopping.' },
    { icon: '👗', txt: 'Código de vestimenta nos shoppings e museus: ombros e joelhos cobertos. Vale pra todo mundo.' },
    { icon: '🍷', txt: 'Álcool só em hotel de luxo (com permit). Fora de hotel, é proibido. Não compre, não traga.' },
  ],
  CN: [
    { icon: '🛂', txt: 'Trânsito sem visto (TWOV) por 144h em várias cidades, mas exige voo pra terceiro país. Confira regra.' },
    { icon: '📱', txt: 'WhatsApp, Google, Instagram bloqueados. VPN antes de chegar — depois não baixa.' },
    { icon: '💳', txt: 'Tudo paga em WeChat Pay/Alipay. Cartão internacional aceito só em hotel grande. Configure antes.' },
    { icon: '🚄', txt: 'Trem-bala (G-train) entre cidades é melhor que avião. Reserve 7+ dias antes em trip.com.' },
  ],
  CY: [
    { icon: '🚗', txt: 'Mão inglesa (lado norte tem mão diferente). Aluguel é barato; combustível é o que pesa.' },
    { icon: '🌊', txt: 'Praia melhor é no oeste (Akamas/Lara Bay). Ayia Napa é "balada festa" — não confunda.' },
    { icon: '🛂', txt: 'Norte (turco) vs Sul (grego) tem fronteira aberta a pé. Avise o aluguel se cruzar.' },
    { icon: '☀️', txt: 'Verão é seco e brutal (38°C). Maio e outubro são as janelas civilizadas.' },
  ],
  TZ: [
    { icon: '🦒', txt: 'Serengeti + Ngorongoro vale combinar. Operadores locais em Arusha custam metade dos brasileiros.' },
    { icon: '💉', txt: 'Febre amarela obrigatória. Malária Lariam ou Malarone — médico antes de viajar.' },
    { icon: '🌊', txt: 'Zanzibar é destino separado. Voo doméstico de Arusha (1h) ou ferry de Dar es Salaam (2h).' },
    { icon: '💵', txt: 'USD em notas novas (pós-2009). Notas antigas/sujas são recusadas em câmbio e hotel.' },
  ],
  MV: [
    { icon: '🌊', txt: 'Resort = 1 ilha = 1 hotel. Você não escolhe restaurante, escolhe pacote. Confira o que está incluso.' },
    { icon: '🏝️', txt: 'Local island (Maafushi, Thoddoo) custa 1/10 do resort, com mesma água azul. Bom pra mid-range.' },
    { icon: '✈️', txt: 'Seaplane vs speedboat: seaplane mais rápido mas só funciona com luz do dia. Reserve voo internacional cedo.' },
    { icon: '🌬️', txt: 'Monção (mai-out) tem mar agitado e mergulho ruim. Dez-abr é a janela dos sonhos — e preço.' },
  ],
  SC: [
    { icon: '🏝️', txt: 'Mahé é base; Praslin e La Digue exigem ferry. Reserve ferry e hospedagem juntos pra não ficar a pé.' },
    { icon: '💰', txt: 'Tudo caro. Resort é Europa-Caribe; casa de pousada (self-catering) salva orçamento.' },
    { icon: '🐢', txt: 'Tartarugas gigantes em Curieuse exigem tour com guia. Não nade com elas sem orientação.' },
    { icon: '🌧️', txt: 'Estação seca jun-set. Out-dez tem chuva forte e mar agitado.' },
  ],
  PL: [
    { icon: '🥟', txt: 'Pierogi de bar lokal (não restaurante turístico) tem 1/3 do preço e 3x melhor. Procure "bar mleczny".' },
    { icon: '🕯️', txt: 'Auschwitz-Birkenau exige reserva online — entra de graça só com guia, ingresso esgota 2 meses antes.' },
    { icon: '💳', txt: 'Caixa eletrônico Euronet/PlanetCash cobram fee absurdo. Use ATM de banco (PKO, mBank).' },
    { icon: '🚆', txt: 'PKP Intercity entre Cracóvia/Varsóvia/Wrocław é mais confortável que avião doméstico. Reserva mesmo dia ainda tem desconto.' },
  ],
  NO: [
    { icon: '💰', txt: 'Tudo é caro como Suíça. Cerveja em bar 100 NOK (R$ 50). Supermercado salva orçamento.' },
    { icon: '🛳️', txt: 'Hurtigruten (linha de costa) é a maneira de ver fiordes. Compre tramo individual, não cruzeiro completo.' },
    { icon: '🌅', txt: 'Sol da meia-noite mai-jul, escuro 24h dez-jan. Planeje energia/sono — não é detalhe.' },
    { icon: '🚆', txt: 'Bergen Railway é um dos passeios mais bonitos do mundo. Reserve janela à esquerda no sentido Oslo → Bergen.' },
  ],
  IS: [
    { icon: '🌋', txt: 'Aurora boreal exige paciência: 3-4 noites mínimo e céu limpo. App "Aurora Forecast" + ficar fora de Reykjavík.' },
    { icon: '🚗', txt: 'Ring Road (rota 1) precisa de 7-10 dias mínimo. Voe direto pra Reykjavík em fevereiro pra Auroras + preço fora do pico.' },
    { icon: '⛽', txt: 'Combustível pesado. Posto em região remota não tem operador — só cartão internacional com PIN.' },
    { icon: '🌧️', txt: 'O clima muda 4x por dia. Camadas técnicas (não algodão), capa de chuva, calça resistente. Aluguel local é uma opção.' },
  ],
  BE: [
    { icon: '🍫', txt: 'Pierre Marcolini é o Apple do chocolate — caro e bom. Mary, Neuhaus e Leonidas têm 1/2 do preço com qualidade similar.' },
    { icon: '🚆', txt: 'Bruxelas → Bruges → Ghent → Antuérpia: 30-50min de trem cada. Belgian Rail Pass de 4 viagens vale mais que ticket avulso.' },
    { icon: '🍺', txt: 'Cerveja trapista (Westvleteren, Rochefort, Chimay) num bar especializado. Não peça pra "experimentar várias" — cada uma tem cálice próprio.' },
    { icon: '🍟', txt: 'Frietkot (barraca de batata frita) é o jeito autêntico. NÃO é "french fries" — é belga, e cobra molho à parte.' },
  ],
  FI: [
    { icon: '🌌', txt: 'Aurora em Rovaniemi: ago-mar tem chance. Fica longe (1h de avião de Helsínquia) — vale 4+ dias pra render.' },
    { icon: '♨️', txt: 'Sauna é cultura nacional. Não é luxo — tem em metade dos AirBnBs. Em sauna pública (Löyly) costuma ser misto, sem roupa, normalíssimo.' },
    { icon: '🎅', txt: 'Vila do Papai Noel em Rovaniemi é turística e cara, mas funciona pra família com criança. Vai cedo no dia.' },
    { icon: '💰', txt: 'Helsínquia menor que Estocolmo — 3 dias chega. Mais que isso, vá pra Lapônia ou faça stopover na Estônia.' },
  ],
  DK: [
    { icon: '🚲', txt: 'Copenhagen é cidade de bicicleta. Aluguel diário pelo Donkey Republic é prático. Mas estacione respeitando — multa de 1.000 DKK.' },
    { icon: '🌭', txt: 'Pølser (hot dog) de carrinho na rua é tradição. 30 DKK e melhor que restaurante turístico.' },
    { icon: '🎢', txt: 'Tivoli abre temporadas (mai-set + Halloween + Natal). Off-season fecha.' },
    { icon: '🍴', txt: 'Smørrebrød (sanduíche aberto) em Aamanns ou Schønnemann vale ir. Restaurante 3⭐ Michelin existe (Noma), mas reserva 6 meses antes.' },
  ],
  RO: [
    { icon: '🏰', txt: 'Bran Castle é "do Drácula" só pra turista — não tem relação real com Vlad. Castelo Peles é muito mais bonito e fica perto.' },
    { icon: '🚆', txt: 'Trem CFR entre cidades costuma atrasar muito. FlixBus é mais confiável e barato.' },
    { icon: '💰', txt: 'Romênia ainda é dos países mais baratos da UE. Cluj, Brașov, Sibiu rendem mais que Bucareste.' },
    { icon: '🐺', txt: 'Carpathian Mountains tem ursos e lobos reais. Não acampe sem guia local.' },
  ],
  BG: [
    { icon: '☀️', txt: 'Sofia é raso, 2 dias chega. Plovdiv e Veliko Tarnovo entregam muito mais cultura e cobram metade.' },
    { icon: '💸', txt: 'Costa do Mar Negro (Sunny Beach) é destino russo/britânico — bagunçado e caro no verão.' },
    { icon: '🗺️', txt: 'Mosteiro de Rila + Sete Lagos de Rila exigem dia inteiro de carro/tour. Off-season tem pouca opção.' },
    { icon: '☕', txt: 'Lev búlgaro vinculado ao euro (1,95 BGN = 1 EUR). Não confunda na hora de pagar.' },
  ],
  SI: [
    { icon: '🚗', txt: 'Eslovênia inteira em 5 dias com carro. Bled + Bohinj + Ljubljana + Piran é roteiro padrão.' },
    { icon: '🏝️', txt: 'Lago Bled cedo (6-8h) tem reflexo perfeito sem turista. Tarde fica lotado.' },
    { icon: '🚆', txt: 'Vinheta (vignette) obrigatória pra autoestrada. Compre no posto antes de entrar — multa 300 €.' },
    { icon: '🍲', txt: 'Štruklji e potica são pratos típicos. Restaurante turístico no centro de Ljubljana cobra 2x do interior.' },
  ],
  SK: [
    { icon: '🏔️', txt: 'Tatras Altas (Vysoké Tatry) é alpinismo sério em altitude. Não suba sem checar clima.' },
    { icon: '🏰', txt: 'Bratislava em 1 dia chega. Faça day trip de Viena (1h de trem) em vez de dormir lá.' },
    { icon: '🍻', txt: 'Cerveja Zlatý Bažant é a Skol local — barato e tipo de coisa que turista evita à toa.' },
    { icon: '💵', txt: 'Usa euro. ATM em supermercado Tesco/Lidl tem menor fee que banco.' },
  ],
  EE: [
    { icon: '🏰', txt: 'Tallinn Old Town em 1-2 dias. KGB Museum (Hotel Viru, topo) é o tipo de coisa que ninguém vai e vale.' },
    { icon: '🚢', txt: 'Ferry pra Helsínquia (2h) é viagem prática. Cruzeiro Tallink/Silja vira destino noturno com bar e dança.' },
    { icon: '📱', txt: 'Estônia é estado digital — Wi-Fi público em quase tudo. E-residency é coisa pra empreendedor.' },
    { icon: '🍞', txt: 'Pão preto estoniano (must black bread) com manteiga é entrada padrão. Restaurante turístico cobra extra.' },
  ],
  LV: [
    { icon: '🏘️', txt: 'Riga Art Nouveau District (Alberta Iela) é o motivo de ir. Caminhe — não tem como ver de carro.' },
    { icon: '🐟', txt: 'Mercado Central de Riga tem peixe defumado lendário. Coma na hora, leve a vácuo só se voltar voando.' },
    { icon: '🌊', txt: 'Jurmala (praia) fica 30 min de Riga por trem barato. Verão funciona bem.' },
    { icon: '🍯', txt: 'Riga Black Balsam é digestivo amargo de 45%. Cuidado — duas doses derrubam.' },
  ],
  LT: [
    { icon: '🏛️', txt: 'Vilnius é mais bonita que Riga e Tallinn juntas, mas turista vai menos. Use isso a favor.' },
    { icon: '🥖', txt: 'Cepelinai (bolinho de batata recheado) é prato nacional. Pesado — divida entre dois.' },
    { icon: '🚆', txt: 'Vilnius → Riga → Tallinn de bus (Lux Express) é confortável e barato. Trem entre eles não funciona direito.' },
    { icon: '⛪', txt: 'Hill of Crosses em Šiauliai vale day trip cultural. Singular no mundo.' },
  ],
  MT: [
    { icon: '🚌', txt: 'Malta inteira de ônibus público (Tallinja) é viável. Cartão semanal cobre tudo.' },
    { icon: '💰', txt: 'Valletta, Mdina e Gozo em 4 dias. Cada dia extra vira repetição.' },
    { icon: '🍴', txt: 'Pastizzi (bolinho recheado) custa 1 € na padaria. Restaurante turístico cobra 5.' },
    { icon: '🌊', txt: 'Blue Lagoon (Comino) lotou demais. Vá cedo (8h-10h) ou ignore — Gozo tem praias melhores.' },
  ],
  TW: [
    { icon: '🥟', txt: 'Din Tai Fung em Taipei tem fila eterna. Versão local "Hang Zhou Xiao Long Bao" entrega mesmo prato sem espera.' },
    { icon: '🚄', txt: 'High Speed Rail (HSR) Taipei → Kaohsiung em 1h40. Reserva online com desconto early bird.' },
    { icon: '🍴', txt: 'Night market é a refeição típica — Shilin é turístico, Raohe e Ningxia são reais.' },
    { icon: '☔', txt: 'Tufão (jul-set) cancela voo doméstico/Yangmingshan. Seguro com cancelamento amplo é obrigatório.' },
  ],
  HK: [
    { icon: '🚇', txt: 'Octopus Card paga MTR + ônibus + ferry + 7-Eleven. Compra/recarga no aeroporto direto.' },
    { icon: '🍤', txt: 'Dim sum em Tim Ho Wan (mais barato do mundo com Michelin star). Fila funciona — peça e leve.' },
    { icon: '🌃', txt: 'Skyline de Hong Kong Island vista do Tsim Sha Tsui Promenade (Kowloon). Grátis.' },
    { icon: '⛅', txt: 'Verão (jun-set) é úmido brutal (35°C, 90% umidade). Tufão também. Out-mar é a janela.' },
  ],
  MO: [
    { icon: '🎰', txt: 'Macau é Las Vegas chinês. Casino é gratuito para entrar (com passaporte) mas você não vence — vai pela vista.' },
    { icon: '🥟', txt: 'Egg tart português é tradição local desde 1500 — Lord Stow\'s em Coloane é o original.' },
    { icon: '🚢', txt: 'Ferry de Hong Kong (1h, TurboJET) é mais prático que avião. Compra na hora costuma funcionar.' },
    { icon: '🇵🇹', txt: 'Bairro de Coloane parece Lisboa miniaturizada. Vale day trip.' },
  ],
  PR: [
    { icon: '🛂', txt: 'Porto Rico = território dos EUA. Visto americano obrigatório (ESTA não vale, é visto B1/B2 mesmo).' },
    { icon: '🌴', txt: 'Old San Juan + Vieques + El Yunque em 7 dias. Vieques só por ferry ou voo pequeno — reserva crítica.' },
    { icon: '💵', txt: 'Usa USD. Não tem câmbio "porto-riquenho" — tudo dólar americano direto.' },
    { icon: '🌪️', txt: 'Temporada de furacões jun-nov. Voo barato existe porque tem risco real.' },
  ],
  JM: [
    { icon: '🚖', txt: 'Não pegue taxi público fora da área turística. Use serviços do hotel ou Knutsford Express.' },
    { icon: '🥥', txt: 'Jerk chicken em Boston Bay (origem) ou Scotchies. Não experimente em resort all-inclusive.' },
    { icon: '🌊', txt: 'Negril tem praia mais bonita; Ocho Rios tem Dunn\'s River Falls. Não dá pra fazer ambos em 5 dias.' },
    { icon: '🚌', txt: 'Trem foi desativado — distâncias são todas de carro/van. Combinem preço antes.' },
  ],
  BS: [
    { icon: '🐷', txt: 'Pigs Beach (Exuma) é tour caro e movimentado. Off-season (mai-jun, set-out) tem menos gente.' },
    { icon: '✈️', txt: 'Voo doméstico (Bahamas Air) costuma atrasar. Mai-set tem furacão.' },
    { icon: '💰', txt: 'Resort all-inclusive em Atlantis/Paradise = orçamento Europa. Casa em Eleuthera ou Long Island é alternativa.' },
    { icon: '💵', txt: 'BSD = USD 1:1. Aceita os dois sem dificuldade.' },
  ],
  AW: [
    { icon: '🌪️', txt: 'Aruba está fora do cinturão de furacões. Voo direto de SP/Rio existe — vantagem real frente a outros caribes.' },
    { icon: '💰', txt: 'Hotel em Palm Beach é o caro. Eagle Beach tem opção mais autêntica e a praia é melhor.' },
    { icon: '🚗', txt: 'Carro alugado abre Arikok National Park. Sem carro, fica preso à praia de hotel.' },
    { icon: '🥃', txt: 'Aruba Aloe é souvenir clássico. Compre no fabricante, não em loja turística.' },
  ],
  CW: [
    { icon: '🏘️', txt: 'Willemstad (Patrimônio UNESCO) em 1 dia. Praias (Klein Curaçao, Cas Abao, Playa Kenepa) precisam carro alugado.' },
    { icon: '💰', txt: 'Mais barato que Aruba, infra similar. Voo direto existe mas menos frequente.' },
    { icon: '🥃', txt: 'Curaçao Blue (licor) é fabricado em Senior Liqueur Factory. Tour grátis com degustação.' },
    { icon: '🌊', txt: 'Snorkel/mergulho na ilha toda — Tugboat Beach e Playa Lagun são icônicos.' },
  ],
  BB: [
    { icon: '🍹', txt: 'Rum punch é cultura. Mount Gay (mais antigo do mundo) tem tour pago que vale.' },
    { icon: '🏏', txt: 'Cricket é religião. Hotel costuma ter horário pra ver jogo.' },
    { icon: '💰', txt: 'BBD vinculado ao USD (2:1). Loja aceita ambos sem confusão.' },
    { icon: '🌊', txt: 'Bathsheba (costa leste) tem mar bravo (surfe). Costa sul é a tradicional.' },
  ],
  PY: [
    { icon: '🛍️', txt: 'Ciudad del Este é zona franca — eletrônicos baratos. Mas cota brasileira de R$ 500/mês declara na alfândega.' },
    { icon: '🚌', txt: 'Asunción → Foz por ônibus é a forma mais comum. Voo doméstico é caro e raro.' },
    { icon: '🥤', txt: 'Tereré (mate gelado) é cultura. Não confunda com mate quente argentino.' },
    { icon: '💰', txt: 'Guarani é uma das moedas mais fracas do continente — preço local é dos mais baratos.' },
  ],
  GT: [
    { icon: '🏯', txt: 'Tikal precisa de 2 dias mínimo. Voo doméstico (Tropic Air) salva 8h de van.' },
    { icon: '🌋', txt: 'Subida no Acatenango (vulcão Fuego visto de lá) é trekking pesado, 2 dias. Não improvise.' },
    { icon: '☕', txt: 'Antigua + Lago Atitlán + Tikal é roteiro padrão de 10 dias. Sem isso, frustra.' },
    { icon: '🚖', txt: 'Use Uber em Cidade da Guatemala. Taxi na rua é risco real.' },
  ],
  NI: [
    { icon: '🌋', txt: 'Granada + Ometepe + León em 7-10 dias. Off-season (mai-out) chove mas preço cai à metade.' },
    { icon: '🚌', txt: 'Chicken bus (ônibus antigo americano) é experiência local autêntica. Não tem horário — chega e vai.' },
    { icon: '💵', txt: 'USD aceito em quase tudo turístico, troco em córdoba.' },
    { icon: '🏄', txt: 'Praia de San Juan del Sur é destino de surfista de orçamento. Off-pico tem onda boa sem multidão.' },
  ],
  SV: [
    { icon: '🏄', txt: 'El Tunco e El Zonte (Bitcoin Beach) são paradas de surfista. Onda funciona o ano inteiro.' },
    { icon: '🪙', txt: 'Bitcoin é moeda oficial junto com USD. Carteira Chivo aceita em muitos lugares (mas dólar funciona em tudo).' },
    { icon: '🚌', txt: 'Distâncias curtas — país pequeno. Bus regional cobre quase tudo.' },
    { icon: '🌋', txt: 'Rota das Flores (Ruta de las Flores) com vilarejos coloniais. Carro alugado vale.' },
  ],
  SA: [
    { icon: '🛂', txt: 'Visto eletrônico (eVisa) brasileiro aprovado em 48h. Ainda exigem PCR/teste em alguns casos — confira regra atual.' },
    { icon: '👗', txt: 'Abaya não é mais obrigatória pra estrangeira, mas ombro/joelho cobertos sim. Em local sagrado, hijab.' },
    { icon: '🏜️', txt: 'AlUla é o motivo de ir. Hegra (Patrimônio UNESCO) é Petra "moderna" sem multidão. Reserve hotel local cedo.' },
    { icon: '🍷', txt: 'Álcool 100% proibido. Não importe, não compre, não traga. Multa pesada.' },
  ],
  OM: [
    { icon: '🚗', txt: 'Roteiro padrão Muscat → Wahiba Sands → Wadi Shab → Nizwa de SUV (4x4 necessário fora de Muscat).' },
    { icon: '🌅', txt: 'Acampamento no deserto Wahiba Sands é experiência única. Reserve 1 noite (não mais).' },
    { icon: '🛂', txt: 'Visto eletrônico para BR sai em 24h. Aeroporto de Muscat é confortável.' },
    { icon: '💵', txt: 'Rial omanense é uma das moedas mais valorizadas (1 OMR ≈ R$ 14). Preço parece baixo mas multiplica.' },
  ],
  UZ: [
    { icon: '🕌', txt: 'Samarcanda + Bukhara + Khiva em 8-10 dias. Khiva pode ser cortado se for 7 dias.' },
    { icon: '🚄', txt: 'Trem Afrosiyob (alta velocidade) Tashkent-Samarcanda em 2h é melhor que voar.' },
    { icon: '💵', txt: 'Som uzbeque tem inflação histórica. Use USD em hotel; salve som pra refeição local.' },
    { icon: '🍴', txt: 'Plov (arroz com cordeiro) é prato nacional. Cada região tem versão própria — coma em Tashkent E Samarcanda.' },
  ],
  AM: [
    { icon: '⛪', txt: 'Mosteiros de Geghard e Tatev valem day trip. Tatev tem teleférico (Wings of Tatev) — reserve 1h.' },
    { icon: '🥃', txt: 'Brandy armênio (Ararat) é o melhor "cognac" não-cognac. Tour pago vale.' },
    { icon: '🍇', txt: 'Areni é a vinícola mais antiga do mundo (6.000 anos). Vale day trip de Yerevan.' },
    { icon: '🚌', txt: 'Marshrutka (van compartilhada) entre cidades. Sem horário fixo — sai quando lotada.' },
  ],
  AZ: [
    { icon: '🏛️', txt: 'Baku em 3 dias chega. Sheki + Gabala como interior cultural. Não estenda Baku — vira repetição.' },
    { icon: '🔥', txt: 'Templo de Atashgah e Yanardag (Montanha em Chamas) são pontos únicos.' },
    { icon: '🍷', txt: 'Manat azerbaijano vinculado ao USD. Preço razoável; gas station tem fee absurdo em cartão.' },
    { icon: '🛂', txt: 'eVisa BR em 3 dias. Não confunda com Armênia — fronteira fechada entre os dois.' },
  ],
  NA: [
    { icon: '🏜️', txt: 'Sossusvlei (Deadvlei) ao nascer do sol exige dormir em Sesriem. Não tem como fazer em day trip.' },
    { icon: '🚙', txt: '4x4 obrigatório fora das estradas principais. Aluguel inclui pneu reserva + jerry can — confirme.' },
    { icon: '🦏', txt: 'Etosha National Park = self-drive funcional. Veículo precisa ter bom espaço de chão.' },
    { icon: '💵', txt: 'Namibian Dollar (NAD) = Rand Sul-africano (ZAR). Os dois aceitos no país.' },
  ],
  BW: [
    { icon: '🛶', txt: 'Okavango Delta exige avião pequeno + barco mokoro. Pacote 4 dias mínimo. Não é destino mochileiro.' },
    { icon: '💰', txt: 'Botsuana é o "safári caro" da África. Pula = ZAR, preço alto. Conta US$ 400-800/dia em camp.' },
    { icon: '🦁', txt: 'Chobe (norte) tem maior concentração de elefantes do mundo. Day trip da Cataratas de Vitória (Zimbábue).' },
    { icon: '🛂', txt: 'Visto BR isento até 90 dias. Mas conta dinheiro pra entrada — checagem na fronteira.' },
  ],
  ZW: [
    { icon: '💧', txt: 'Cataratas de Vitória vista do lado zimbabuano é melhor que zambiano (mais perspectivas). Combine os dois.' },
    { icon: '💵', txt: 'Zimbábue usa USD direto. Notas grandes/pequenas — todas aceitas.' },
    { icon: '🛂', txt: 'Visto KAZA UNI permite Zimbábue + Zâmbia em 1 carimbo. US$ 50.' },
    { icon: '🚖', txt: 'Combine táxi antes. Sem app confiável — pergunte ao hotel.' },
  ],
  ET: [
    { icon: '⛪', txt: 'Lalibela (igrejas escavadas na rocha) é o motivo de ir. Voe direto de Addis — 1h.' },
    { icon: '💊', txt: 'Febre amarela obrigatória. Malária preventiva conforme região. Veja médico 4 semanas antes.' },
    { icon: '☕', txt: 'Café é cerimônia de 1h — não pode interromper. Aceite quando convidado.' },
    { icon: '🚖', txt: 'Use Ride ou Feres (apps locais) em Addis. Taxi de rua cobra absurdo do estrangeiro.' },
  ],
  MG: [
    { icon: '🌳', txt: 'Avenida dos Baobás (Morondava) é a foto. Mas chegar lá custa 1h de voo doméstico + 8h de estrada.' },
    { icon: '🐒', txt: 'Lêmures em Andasibe (mais perto de Antananarivo) é roteiro acessível de 3-4 dias.' },
    { icon: '💵', txt: 'Ariary tem inflação. USD/EUR em hotel; ariary pra mercado.' },
    { icon: '🛣️', txt: 'Estradas internas são ruins. 200 km podem ser 6h. Voo doméstico salva, mas é caro.' },
  ],
  RW: [
    { icon: '🦍', txt: 'Permit pra ver gorilas no Volcanoes NP custa US$ 1.500/dia. Reserve 6 meses antes na alta.' },
    { icon: '🏛️', txt: 'Memorial do Genocídio em Kigali é obrigatório pra contexto. Pesado emocionalmente.' },
    { icon: '🛣️', txt: 'Ruanda é "Suíça da África" — estradas boas, segurança alta. Carro alugado funciona.' },
    { icon: '👜', txt: 'Sacola plástica é PROIBIDA. Confiscam no aeroporto.' },
  ],
  UG: [
    { icon: '🦍', txt: 'Permit pra gorilas em Bwindi é US$ 800 — metade do Rwanda. Acesso é mais pesado, mas vale.' },
    { icon: '💊', txt: 'Malária + febre amarela obrigatórias. Atovaquona/doxiciclina conforme rota.' },
    { icon: '🚙', txt: 'Estradas internas pra Bwindi/Murchison Falls são longas (8-12h). Voo doméstico (Aerolink) salva.' },
    { icon: '💰', txt: 'Custo médio. Camp de gorila é o que pesa; resto é razoável.' },
  ],
  MM: [
    { icon: '🛂', txt: 'eVisa BR aprovado em 1-3 dias. Conferir status político atual antes de viajar — instável.' },
    { icon: '🎈', txt: 'Bagan ao nascer do sol de balão é caro (US$ 350) mas a foto define. Reservar com antecedência.' },
    { icon: '🚂', txt: 'Trem Yangon → Mandalay é experiência única — 14h de cama de tropa. Bus é mais confortável e rápido.' },
    { icon: '👔', txt: 'Em pagoda, ombro e joelho cobertos. Tirar sapato/meia — chão pode estar quente em sol.' },
  ],
  FJ: [
    { icon: '✈️', txt: 'Fiji + Nova Zelândia ou Austrália em mesmo roteiro faz sentido. Voo direto Brasil é raro.' },
    { icon: '🌊', txt: 'Ilhas externas (Yasawa, Mamanuca) por barco da Awesome Adventures. Não tente "improvisar".' },
    { icon: '🌪️', txt: 'Estação de ciclones nov-abr. Voo doméstico cancela com chuva — folga no roteiro.' },
    { icon: '🥥', txt: 'Resort all-inclusive é norma. Não-resort tem opção em Coral Coast (Korotogo, Sigatoka).' },
  ],
  MN: [
    { icon: '🐎', txt: 'Festival Naadam em julho. Reserva 1 ano antes pelos pacotes; sem isso, vai improvisado e perde o melhor.' },
    { icon: '🌅', txt: 'Deserto do Gobi exige tour de 7-10 dias com motorista. Self-drive não funciona.' },
    { icon: '❄️', txt: 'Inverno (nov-fev) é -30°C. Pra Festival do Águia Dourada, sim — mas roupa técnica obrigatória.' },
    { icon: '🛂', txt: 'eVisa BR aprovado em 1 semana. Aeroporto de Ulaanbaatar tem voo direto raro.' },
  ],
  AD: [
    { icon: '⛷️', txt: 'Ski em Grandvalira ou Vallnord. Aluguel + lift pass custa metade da França/Suíça.' },
    { icon: '🛍️', txt: 'Andorra é zona franca — eletrônicos e perfume baratos. Cota brasileira aplica.' },
    { icon: '🚗', txt: 'Acesso só por carro (de Barcelona ou Toulouse). Bus direto existe mas demora.' },
    { icon: '💵', txt: 'Usa euro. Não tem aeroporto — chega de carro.' },
  ],
  AL: [
    { icon: '🏖️', txt: 'Riviera albanesa (Saranda, Ksamil, Himarë) tem praia tipo Croácia por metade do preço. Estourou em 2023.' },
    { icon: '🚌', txt: 'Furgon (van) é o transporte real entre cidades. Sem horário, sai quando lota. Aceite.' },
    { icon: '🛂', txt: 'Visto BR isento até 90 dias. Conferir validade do passaporte (6+ meses).' },
    { icon: '🥃', txt: 'Rakia (destilado de uva) é cultura. Não recuse o oferecimento — toma-se um shot só.' },
  ],
  MK: [
    { icon: '🏞️', txt: 'Lago Ohrid é Patrimônio UNESCO. Ohrid + Skopje em 4-5 dias chega.' },
    { icon: '🚗', txt: 'Carro alugado de Tirana (Albânia) abre rota Balcãs em 10 dias.' },
    { icon: '☕', txt: 'Capital Skopje tem arquitetura "neo-clássica" do projeto Skopje 2014. Polêmica local — vale ver.' },
    { icon: '💵', txt: 'Denar macedônio só funciona dentro do país. Saque o suficiente no aeroporto, sem sobrar.' },
  ],
  ME: [
    { icon: '🛂', txt: 'Visto BR isento até 90 dias. Montenegro não é UE — controle de fronteira é separado.' },
    { icon: '🚖', txt: 'Kotor → Budva → Sveti Stefan de carro alugado é o roteiro padrão. Estradas costeiras sinuosas.' },
    { icon: '🌊', txt: 'Sveti Stefan é vista postal, mas a praia é privada (resort). Pra praia pública, vá pra Mogren ou Jaz.' },
    { icon: '⛴️', txt: 'Ferry pra Bari (Itália) é 9h de travessia noturna. Conexão prática com sul da Itália.' },
  ],
  BA: [
    { icon: '🏛️', txt: 'Sarajevo tem mistura cultural única (mesquita + igreja católica + ortodoxa + sinagoga em 200m). 3 dias chega.' },
    { icon: '🌉', txt: 'Mostar tem a ponte famosa, mas é dia turístico. Trogir e Stari Most têm mais alma.' },
    { icon: '🚌', txt: 'FlixBus dos Balcãs serve a região toda. Trens são lentos, fronteiras burocráticas.' },
    { icon: '☕', txt: 'Café bósnio (com pó turco) é cerimônia de 1h. Não é tipo americano — entenda antes de pedir.' },
  ],
  XK: [
    { icon: '🛂', txt: 'Kosovo é jovem, voo internacional via Pristina ou da Macedônia do Norte por terra. Sérvia não permite saída via Sérvia.' },
    { icon: '💵', txt: 'Usa euro sem fazer parte da UE. Notas grandes (200, 500) podem não ter troco.' },
    { icon: '🏛️', txt: 'Pristina é raso. Prizren tem cultura, Peja tem natureza (Rugova Canyon).' },
    { icon: '🚖', txt: 'Distâncias curtas — país pequeno. Taxi é barato, ride-share pouco usado.' },
  ],
  GE: [
    { icon: '🍷', txt: 'Geórgia inventou o vinho (8.000 anos). Kakheti é a região; tour de vinícola 1 dia salvo de Tbilisi.' },
    { icon: '🥖', txt: 'Khachapuri (pão com queijo) é vício. Versão Adjarian tem ovo no centro — pra dividir.' },
    { icon: '🛂', txt: 'BR isento até 1 ANO sem visto. Único país do mundo com isso. Aproveite.' },
    { icon: '🏔️', txt: 'Kazbegi (Stepantsminda) tem visual Patagônia/Alasca. Marshrutka de Tbilisi vale.' },
  ],
  IR: [
    { icon: '🛂', txt: 'Visto BR exige carta de convite + tour aprovado. Solo backpacking é difícil.' },
    { icon: '💳', txt: 'Sanções proíbem cartão internacional. Leve TODO o dinheiro em USD/EUR em espécie.' },
    { icon: '👗', txt: 'Hijab é OBRIGATÓRIO pra mulher em público desde 1979. Não é negociável.' },
    { icon: '🏛️', txt: 'Esfahan + Yazd + Shiraz + Teerã em 14 dias. Cultura é incrível, mas burocracia é pesada.' },
  ],
  LB: [
    { icon: '⚠️', txt: 'Beirute teve crise econômica brutal em 2020-2023. Confira situação política antes de viajar.' },
    { icon: '🍴', txt: 'Comida libanesa em Achrafieh/Mar Mikhael é a real. Restaurante turístico Hamra é fraco.' },
    { icon: '🚖', txt: 'Não tem Uber estável. Use Allo Taxi (combine preço antes) ou peça pra hotel.' },
    { icon: '🏔️', txt: 'Baalbek (templo romano) é incrível mas fica perto da Síria. Confira segurança.' },
  ],
  BD: [
    { icon: '🛂', txt: 'Visto BR aprovado em 1-2 semanas, exige carta de convite ou hotel reservado.' },
    { icon: '💵', txt: 'Taka bangladeshi tem inflação. Use USD em hotel; taka pra dia-a-dia.' },
    { icon: '🚖', txt: 'Trânsito de Dhaka é caos. CNG (riquixá motorizado) é mais rápido que carro.' },
    { icon: '🚢', txt: 'Sundarbans (manguezais com tigres) é o motivo de ir. Tour de 3-4 dias com agência local.' },
  ],
  PK: [
    { icon: '🛂', txt: 'eVisa BR aprovado em 1-3 dias. Confira segurança regional antes — situação muda.' },
    { icon: '🏔️', txt: 'Hunza Valley é o motivo de ir. Voe Islamabad-Gilgit, depois carro. 7-10 dias mínimo.' },
    { icon: '💉', txt: 'Vacinas tifoide + hepatite A + raiva preventiva. Diamox se for trekking de altitude.' },
    { icon: '👗', txt: 'Conservador. Mulher cobre ombro/joelho em espaço público (não obrigatório, mas evita assédio).' },
  ],
  KZ: [
    { icon: '🛂', txt: 'Visto BR isento até 30 dias. Almaty + Astana têm voo direto de Istambul, Doha.' },
    { icon: '🏔️', txt: 'Charyn Canyon (mini-Grand Canyon) é day trip de Almaty. Carro alugado vale.' },
    { icon: '❄️', txt: 'Inverno bate -25°C em Astana. Verão (jun-ago) é 30°C+. Janelas curtas.' },
    { icon: '💵', txt: 'Tenge cazaque é estável. Cartão funciona em quase tudo.' },
  ],
  KG: [
    { icon: '🐎', txt: 'Quirguistão é melhor pra trekking de cavalo e jurta (yurt) que turismo de cidade.' },
    { icon: '🛂', txt: 'BR isento até 60 dias. Bishkek tem voos via Istambul/Dubai.' },
    { icon: '🏔️', txt: 'Lago Song-Kul a 3.000m é destino de stay com nômade. 2-3 dias só nisso.' },
    { icon: '🚐', txt: 'Marshrutka entre cidades. Sem horário fixo, sai quando lota.' },
  ],
  TJ: [
    { icon: '🛂', txt: 'eVisa BR + GBAO permit pra Pamir Highway. Aprovação em 1-2 semanas.' },
    { icon: '🏔️', txt: 'Pamir Highway é uma das rotas mais espetaculares do mundo. SUV 4x4 + 10+ dias.' },
    { icon: '💵', txt: 'Somoni é fraco. USD em hotel é direto. Saque limitado fora de Dushanbe.' },
    { icon: '🥖', txt: 'Plov + non (pão) são a base. Chá verde com cada refeição.' },
  ],
  ZM: [
    { icon: '💧', txt: 'Cataratas de Vitória vista do lado zambiano. Combine com Zimbábue (visto KAZA UNI).' },
    { icon: '🚖', txt: 'Livingstone (cidade) é base. Lusaka (capital) raramente vale a pena pro turista.' },
    { icon: '🦓', txt: 'South Luangwa NP é melhor safári da Zâmbia. Acesso por voo doméstico.' },
    { icon: '💵', txt: 'Kwacha tem fee absurdo em ATM. Use USD em hotel; kwacha pra restaurante local.' },
  ],
  MZ: [
    { icon: '🏖️', txt: 'Bazaruto + Quirimbas são arquipélagos paradisíacos com hospedagem de luxo. Voo doméstico necessário.' },
    { icon: '🛂', txt: 'eVisa BR aprovado em 1 semana. Pode ser obtido na chegada também.' },
    { icon: '🚖', txt: 'Maputo tem mototaxi (chapa). Use Yellow Cab pra opção segura. Sem Uber.' },
    { icon: '💵', txt: 'Metical fraco. ZAR (Rand Sul-africano) e USD aceitos em zonas turísticas.' },
  ],
  AO: [
    { icon: '💰', txt: 'Luanda é uma das capitais mais caras do mundo (petróleo). Hotel decente cobra USD 300+/noite.' },
    { icon: '🛂', txt: 'Visto BR exige carta de convite ou agência. Aprovação em 2-3 semanas.' },
    { icon: '🚖', txt: 'Use Heetch ou Yango. Taxi de rua tem risco de assalto.' },
    { icon: '🌊', txt: 'Praias do sul (Tômbwa, Namibe) são desérticas e bonitas. Acesso por voo doméstico.' },
  ],
  CV: [
    { icon: '🏝️', txt: 'Sal e Boa Vista são all-inclusive. Santo Antão tem trekking real. Mindelo (São Vicente) tem música.' },
    { icon: '🛂', txt: 'Visto BR isento até 30 dias. Português é falado universalmente.' },
    { icon: '✈️', txt: 'TAP voa direto de Lisboa. Voo doméstico (Bestfly) liga as ilhas — reserve antes.' },
    { icon: '🎵', txt: 'Morna (gênero musical) ao vivo em Mindelo é cultura. Não pule.' },
  ],
  TN: [
    { icon: '🏛️', txt: 'Cartago + Sidi Bou Said + El Jem (anfiteatro) + deserto em 7-10 dias.' },
    { icon: '☪️', txt: 'Tunísia é muçulmana liberal — álcool em hotel, vestimenta com flexibilidade. Mais aberta que Marrocos.' },
    { icon: '🛂', txt: 'Visto BR isento até 90 dias. Aeroporto de Tunis tem voo direto via Roma/Madri.' },
    { icon: '🌊', txt: 'Djerba (ilha) tem comunidade judaica antiga. Sousse/Hammamet são resort.' },
  ],
  DZ: [
    { icon: '🛂', txt: 'Visto BR exige carta de convite + agência local. Algéria controla turismo de fora pesado.' },
    { icon: '🏜️', txt: 'Saara argelino (Tassili, Hoggar) é único. Mas requer tour com escolta — não improvise.' },
    { icon: '💵', txt: 'Câmbio paralelo dinar/EUR rende muito melhor que oficial. Pergunte ao hotel.' },
    { icon: '🚖', txt: 'Argel tem Yassir (Uber local). Use, sempre.' },
  ],
  MR: [
    { icon: '🏜️', txt: 'Trem do minério (700km no Saara) é experiência única do mundo. Pega de Nouadhibou.' },
    { icon: '🛂', txt: 'Visto na chegada para BR. Aeroporto pequeno em Nouakchott.' },
    { icon: '💵', txt: 'Ouguiya (mudou de cédula em 2018) — confira nota nova vs antiga. EUR em hotel.' },
    { icon: '🌅', txt: 'Banc d\'Arguin (UNESCO) tem aves migratórias. Tour de 1-2 dias.' },
  ],
  NG: [
    { icon: '🛂', txt: 'Visto BR é caro e demorado (USD 180+, 2-3 semanas). Aprovação não garantida.' },
    { icon: '🚖', txt: 'Bolt e Uber funcionam em Lagos. NUNCA pegue taxi na rua.' },
    { icon: '💵', txt: 'Naira tem dois câmbios (oficial e paralelo) com diferença de 30%+. USD em espécie é rei.' },
    { icon: '🎵', txt: 'Lagos é a capital do Afrobeats. Festival Felabration (outubro) é o momento.' },
  ],
  SN: [
    { icon: '🛂', txt: 'BR isento até 90 dias. Aeroporto de Dakar com voo via Madri/Bruxelas.' },
    { icon: '🏝️', txt: 'Île de Gorée (UNESCO, casa dos escravos) é parada obrigatória. Ferry de Dakar.' },
    { icon: '🎵', txt: 'Mbalax (música nacional) ao vivo em Dakar. Youssou N\'Dour é o ícone.' },
    { icon: '💵', txt: 'Franco CFA Oeste-africano (XOF) vinculado ao euro. Estável.' },
  ],
  CI: [
    { icon: '🛂', txt: 'eVisa para BR aprovado em 24-48h. Abidjan tem voo via Paris.' },
    { icon: '☕', txt: 'Costa do Marfim produz 40% do cacau mundial. Tour de cacau em Yamoussoukro vale.' },
    { icon: '🍴', txt: 'Atiéké (couscous de mandioca) é o prato. Não confunda com atieke turística.' },
    { icon: '💵', txt: 'Franco CFA (XOF). Estável, vinculado ao euro.' },
  ],
  GH: [
    { icon: '🛂', txt: 'eVisa BR aprovado em 1 semana. Accra tem voo via Lisboa.' },
    { icon: '🏛️', txt: 'Cape Coast Castle e Elmina (casas dos escravos) são parada histórica obrigatória.' },
    { icon: '💉', txt: 'Febre amarela obrigatória. Malária preventiva.' },
    { icon: '🥘', txt: 'Jollof rice é orgulho ganês. Discussão Nigéria vs Gana sobre origem é eterna.' },
  ],
  CM: [
    { icon: '🛂', txt: 'Visto BR exige carta de convite. Aprovação 2-4 semanas. Difícil.' },
    { icon: '🏔️', txt: 'Mount Cameroon (4.040m) é trekking de 2 dias. Único vulcão ativo da África Ocidental.' },
    { icon: '💉', txt: 'Febre amarela + malária + cólera. Não pule.' },
    { icon: '💵', txt: 'Franco CFA Centro-africano (XAF). Vinculado ao euro, estável.' },
  ],
  HN: [
    { icon: '🏝️', txt: 'Roatán e Utila (Caribe) têm mergulho barato e bom. Avião doméstico de San Pedro Sula.' },
    { icon: '🛂', txt: 'BR isento até 90 dias. Aeroporto principal em San Pedro Sula.' },
    { icon: '⚠️', txt: 'San Pedro Sula tem taxa alta de violência. Vá direto pra ilhas — não pernoite em SPS.' },
    { icon: '💵', txt: 'Lempira fraca. USD aceito em zonas turísticas (Roatán, Utila, Copán).' },
  ],
  SR: [
    { icon: '🛂', txt: 'BR isento até 90 dias. Voo da Holanda (KLM) ou via Guiana Francesa.' },
    { icon: '🌳', txt: 'Floresta amazônica + cultura caribenho-indo-malaia. Singular no mundo.' },
    { icon: '🇳🇱', txt: 'Idioma oficial é holandês. Sranan tongo (crioulo) é falado.' },
    { icon: '💵', txt: 'SRD (dólar surinamês) tem inflação. EUR em hotel; SRD pra dia-a-dia.' },
  ],
  GY: [
    { icon: '🛂', txt: 'BR isento até 90 dias. Acesso via Manaus → Boa Vista → Lethem (terrestre) ou voo da Suriname/Caribe.' },
    { icon: '🌊', txt: 'Kaieteur Falls (4x mais alto que Niágara, ininterrupto) é o motivo de ir. Voo de Cessna.' },
    { icon: '🌳', txt: 'Iwokrama Forest tem onça-pintada (jaguar) em densidade alta. Eco-lodge salvo.' },
    { icon: '💵', txt: 'GYD fraco. USD em hotel sempre.' },
  ],
  TL: [
    { icon: '🛂', txt: 'Visto na chegada para BR (USD 30). Voo de Bali ou Darwin (Austrália).' },
    { icon: '🤿', txt: 'Atauro Island tem mergulho com biodiversidade de top 5 do mundo. Acesso por barco de Dili.' },
    { icon: '☕', txt: 'Café típico de Timor é exportado pra Starbucks. Tour de fazenda em Maubisse vale.' },
    { icon: '💵', txt: 'USD é moeda oficial. Notas pequenas — não tem troco grande.' },
  ],
  BT: [
    { icon: '💰', txt: 'Butão cobra USD 200/dia de "Sustainable Development Fee" (mudou em 2022). Não é destino mochileiro.' },
    { icon: '🛂', txt: 'Visto BR só por agência licenciada. Pacote inclui guia obrigatório.' },
    { icon: '🏛️', txt: 'Tiger\'s Nest (Paro Taktsang) é trekking de 4-5h em altitude. Vale.' },
    { icon: '🛬', txt: 'Aeroporto de Paro é um dos mais difíceis do mundo — só pilotos certificados pousam.' },
  ],
};

const FALLBACK_REGIAO = {
  'Europa': [
    { icon: '🚄', txt: 'Trem é melhor que voo doméstico em quase tudo dentro da Europa. Reserve com 30+ dias pra preço civilizado.' },
    { icon: '💳', txt: 'ATM no aeroporto cobra taxa pesada. Saque na cidade, no banco maior.' },
    { icon: '🍴', txt: 'Couvert (pão, água, mesa) pode ser cobrado. Confirme na chegada.' },
  ],
  'Ásia': [
    { icon: '🛺', txt: 'Tuk-tuk e taxi pedindo preço sem taxímetro = você está pagando 3-5x. Use Grab/Gojek.' },
    { icon: '🥢', txt: 'Comida de rua é ótima onde tem fila local. Lugar vazio é alerta de barriga.' },
    { icon: '💵', txt: 'Saque em mercado/conveniência costuma render melhor que troca em loja de câmbio.' },
  ],
  'África': [
    { icon: '💉', txt: 'Vacinas e medicamentos preventivos não são opcionais. Procure infectologista 4-6 semanas antes.' },
    { icon: '🚙', txt: 'Distâncias internas enganam: 300km podem ser 8h de carro. Não confie em mapa só pelo km.' },
    { icon: '💵', txt: 'Em muitos países, USD em espécie é mais aceito que cartão. Leve notas pequenas e limpas.' },
  ],
  'América do Sul': [
    { icon: '🌎', txt: 'Câmbio de uma fronteira pra outra muda muito. Verifique o melhor lugar antes de cruzar.' },
    { icon: '🚌', txt: 'Ônibus leito (cama/semi-cama) é confortável e econômico em longas distâncias.' },
    { icon: '🏔️', txt: 'Altitude em Andes cobra no primeiro dia. Não suba e faça trilha no mesmo dia.' },
  ],
  'América Central': [
    { icon: '🌬️', txt: 'Estação de furacão (jun-nov no Caribe) tem voo barato porque tem risco real. Seguro com cobertura ampla.' },
    { icon: '💵', txt: 'USD é amplamente aceito; troco em moeda local. Notas grandes podem não ter troco.' },
    { icon: '🚐', txt: 'Vans turísticas (shuttle) entre cidades são mais seguras e baratas que carro alugado.' },
  ],
  'América do Norte': [
    { icon: '💰', txt: 'Preço marcado não inclui imposto nem gorjeta (15-22%). Some 25% pra estimar real.' },
    { icon: '🚗', txt: 'Fora das grandes cidades, sem carro você não anda. Conta o aluguel no orçamento.' },
    { icon: '🏥', txt: 'Seguro saúde com cobertura ampla é mandatório. Atendimento simples = US$ 500+.' },
  ],
  'Oceania': [
    { icon: '🚐', txt: 'Distâncias enganam: 500km podem ser road trip de 2 dias. Combustível pesa.' },
    { icon: '🌊', txt: 'Praia paradisíaca pode ter correnteza e tubarão. Respeite bandeira e instrução.' },
    { icon: '💵', txt: 'AUD/NZD são caros — almoço simples em AUD 20-25 (R$ 70+).' },
  ],
  'Oriente Médio': [
    { icon: '☪️', txt: 'Ramadã muda horário comercial. Restaurantes fecham de dia em vários países.' },
    { icon: '👗', txt: 'Roupa cobrindo ombro/joelho não é só em mesquita. Espaços públicos pedem código.' },
    { icon: '🛍️', txt: 'Bazar tem preço inicial inflado. Saia sem comprar — chamam de volta com 1/3.' },
  ],
};

export function dicasOQueNinguemConta(destino) {
  const curado = CURADO[destino?.code];
  if (curado && curado.length) return curado;
  const fallback = FALLBACK_REGIAO[destino?.regiao] || FALLBACK_REGIAO['Europa'];
  return fallback;
}

export function OQueNinguemConta({ destino }) {
  const { idioma, t } = useIdioma();
  const dicas = dicasOQueNinguemConta(destino);
  return (
    <section aria-labelledby="oque-ninguem-conta-titulo">
      <h2 id="oque-ninguem-conta-titulo" className="font-display text-2xl text-ink mb-3">🤫 {t('destino.oqueTitulo')}</h2>
      <p className="text-sm text-inksoft mb-2 max-w-2xl">{t('destino.oqueP')}</p>
      {idioma !== 'pt' && (
        <p className="text-[11px] text-inksoft mb-4 max-w-2xl italic">📝 {t('destino.oqueNotaIdioma')}</p>
      )}
      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {dicas.map((d, i) => (
          <li key={i} className="rounded-2xl border border-line bg-card p-4 flex gap-3">
            <span aria-hidden className="text-xl shrink-0">{d.icon}</span>
            <p className="text-sm text-ink leading-snug">{d.txt}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
