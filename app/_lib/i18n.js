'use client';
import { useEffect, useState } from 'react';

// Internacionalização leve, sem framework. Suporta 4 idiomas hoje (pt, en, es, ja).
// Adicionar mais é só estender IDIOMAS + adicionar chave em STRINGS.
//
// Estratégia:
//   • SSR sempre renderiza pt-BR (default Brasil). Sem mismatch de hidratação.
//   • Client hidrata: lê localStorage; se não há, detecta navigator.language.
//   • Cookie `msf.lang` espelha localStorage para que o servidor possa, no futuro,
//     ler o idioma e renderizar variantes específicas (Next App Router).
//   • Mapa do destino usa o mesmo idioma via prop `idioma` no MapTiler.
//
// MVP: traduz só as strings de mais alta visibilidade (nav, hero, FAQ, CTAs).
// O restante segue pt-BR — quando o usuário troca pra outro idioma, ele vê uma
// mistura. Isso é honesto: melhor mostrar pt + EN-no-mapa do que esconder a
// feature até a tradução completa estar pronta.

export const IDIOMAS = [
  { code: 'pt', nome: 'Português', bandeira: '🇧🇷', mapTiler: 'pt' },
  { code: 'en', nome: 'English', bandeira: '🇺🇸', mapTiler: 'en' },
  { code: 'es', nome: 'Español', bandeira: '🇪🇸', mapTiler: 'es' },
  { code: 'ja', nome: '日本語', bandeira: '🇯🇵', mapTiler: 'ja' },
];

export const IDIOMA_PADRAO = 'pt';
const STORAGE_KEY = 'msf.lang.v1';

// Strings traduzidas. Chaves agrupadas por contexto.
// Para adicionar string nova: chave em pt, depois em en/es/ja. Se falta, cai pra pt.
export const STRINGS = {
  pt: {
    nav: {
      descobrir: 'Descobrir', decidir: 'Decidir', comparar: 'Comparar',
      custoReal: 'Custo real', planejar: 'Planejar', roteiro: 'Roteiro',
      voos: 'Voos', salvos: 'Salvos', precos: 'Preços', entrar: 'Entrar', menu: 'Menu',
    },
    home: {
      heroCTA: 'Decidir minha viagem', heroSubCTA: 'Explorar destinos',
      ctaFinalCalcular: 'Calcular minha viagem', ctaFinalDescobrir: 'Descobrir 3 viagens possíveis',
      gratisComecar: 'Grátis pra começar', semCartao: 'Sem cartão', conselhoNeutro: 'Conselho neutro',
      heroH1a: 'Decida a viagem da sua vida', heroH1b: 'com um copiloto que pensa por você.',
      heroSub: 'As OTAs te empurram opções. A gente diz pra onde ir pelo seu perfil, quanto custa de verdade (não só voo + hotel) e monta o roteiro que recalcula. Comece grátis.',
      heroDecidir: 'Decidir minha viagem', heroExplorar: 'Explorar destinos',
      problemaSelo: 'O problema', problemaH2: 'O problema não é falta de opção. É excesso de opção sem contexto.',
      problemaP: 'A maioria das viagens não dá errado no destino. Dá errado na decisão — antes de comprar a passagem.',
      comoDecidoSelo: 'O motor', comoDecidoH2: 'Como o Mundo Sem Fim decide o que combina com você',
      comoDecidoP: 'Oito fatores que mudam a resposta. Trocou o mês? Trocou o orçamento? O ranking refaz na hora.',
      custoRealSelo: 'Custo real', custoRealH2: 'O preço de vitrine termina na compra. O custo real aparece durante a viagem.',
      custoRealP: 'Exemplo real: 8 dias para o Peru, casal, perfil equilibrado.',
      custoRealCTA: 'Abrir a calculadora',
      vitrineLabel: 'Preço de vitrine', vitrineSub: 'Voo + hotel',
      escondidoLabel: 'Custo real', escondidoSub: '+ comida + transporte + seguro + eSIM + passeios + imprevistos',
      diferencaLabel: 'Diferença', diferencaSub: 'Que normalmente aparece tarde demais',
      otasSelo: 'Onde a gente entra', otasH2: 'Não somos uma OTA. Somos a camada de decisão antes dela.',
      otasP: 'Cada ferramenta resolve uma parte. Falta quem te diga se vale a viagem inteira.',
      otasFerramenta: 'Ferramenta', otasFaz: 'O que ela faz', otasPara: 'Onde para', otasChip: 'decisão',
      faqSelo: 'FAQ', faqH2: 'Perguntas que todo viajante faz',
      ctaFinalH2: 'Antes de comprar a passagem, veja se essa viagem fecha a conta.',
      ctaFinalP: 'Em 30 segundos: 3 destinos que combinam com seu perfil, mês e orçamento — com o custo real da viagem inteira, não só do voo.',
      ctaFinalCusto: 'Abrir custo real', ctaFinalRodape: 'Grátis para começar · sem cartão · conselho neutro (não vendemos a reserva).',
    },
    destino: {
      pontosTuristicos: 'Pontos turísticos', cidadesBases: 'Cidades & bases', ondefica: 'Onde fica',
      verHistoria: 'Ver história de', lerArtigo: 'Ler o artigo completo',
      lerSobrePais: 'Ler sobre o país', abrirMapa: 'Abrir no Google Maps',
      fonteWiki: 'Fonte: Wikipédia', carregandoHistoria: 'Carregando história…',
      lugares: 'lugares', foraDaRota: 'fora da rota', fotoCredito: 'Foto',
      // "O que fazer e quanto custa"
      fazerTitulo: 'O que fazer e quanto custa', fazerSub: 'Atrações, museus e passeios com preço de ingresso ou tour. Filtre pelo que te interessa.',
      fazerTodos: 'Tudo', catMuseu: 'Museus', catPasseio: 'Passeios', catAtracao: 'Atrações', catParque: 'Parques', catExperiencia: 'Experiências', catReligioso: 'Religioso', catNatureza: 'Natureza', catHistorico: 'Histórico',
      precoGratis: 'Grátis', precoIngresso: 'ingresso', precoTour: 'tour', precoEstimado: 'estimado',
      fazerNota: 'Preços de referência (2025-2026) — confirme no local. Conversão pelo câmbio atual.', fazerVazio: 'Ainda não temos preços de atrações deste país.',
      verseFonte: 'ver fonte', semResumo: 'Não encontramos um resumo deste lugar na Wikipédia. Use o botão abaixo para ver no mapa.',
      contextoNota: 'A Wikipédia ainda não tem um verbete específico desse ponto — o trecho acima é o veredito editorial sobre o país.',
      // Vale ir agora
      valeTitulo: 'Vale ir agora?',
      valeBomMomento: 'Bom momento', valeAlerta: 'Só vale com orçamento maior',
      valeEspere: 'Espere o próximo ciclo', valeEvite: 'Evite este mês',
      valeCondicional: 'Bom pra quem prioriza o destino, não o preço',
      valeBomBarato: 'Janela aberta para orçamento controlado',
      valeNeutro: 'Decisão depende do seu perfil',
      // O que ninguém te conta
      oqueTitulo: 'O que ninguém te conta',
      oqueP: 'Coisas que blog romantizado, vídeo curto e influencer não falam. Curado por país; honesto até quando incomoda.',
      oqueNotaIdioma: 'Dicas curadas em português brasileiro. Tradução automática em breve.',
      // V2 — bloco "Específico de [cidade]"
      fazerV2Titulo: 'Específico de', fazerV2Sub: 'Dicas, passes, especialidades e grátis curados — pesquisado em',
      fazerV2Dicas: '💡 Dicas de economia', fazerV2Passes: '🎟️ Vale o passe?', fazerV2Cobre: 'Cobre',
      fazerV2Especial: '⭐ Especialidade de', fazerV2Gratis: '🆓 Grátis ou doação', fazerV2Fontes: 'Fontes',
      fazerV2Baixa: 'estimativa baixa confiança', fazerV2Desat: 'pesquisada há mais de 1 ano',
      fazerV2Aviso: '⚠️ Preços mudam. Confira no site oficial antes de ir.',
    },
    map: { ampliar: 'Ver mapa maior' },
    geral: {
      voltar: 'Voltar', salvar: 'Salvar', comparar: 'Comparar', fechar: 'Fechar',
      ver: 'Ver', proximo: 'Próximo', anterior: 'Anterior',
    },
    decisao: {
      heroSelo: 'Camada de decisão antes da reserva',
      heroH1: 'Descubra a viagem que realmente combina com você.',
      heroP: 'Coloque dias, orçamento e tolerância a perrengue. O Mundo Sem Fim cruza custo real, clima, segurança e ritmo para dizer onde vale ir — e onde é melhor não gastar agora.',
      wizardSelo: 'Wizard de decisão', wizardH2: 'Onde vale ir com o seu dinheiro, seu mês e sua energia?',
      wizardP: 'Tudo recalcula no momento em que você muda. Sem botão de "gerar".',
      saindoDe: 'Saindo de', mes: 'Mês', mesQualquer: 'Qualquer mês', dias: 'Dias disponíveis',
      orcamento: 'Orçamento total', estilo: 'Estilo', companhia: 'Companhia',
      tolerancia: 'Tolerância a perrengue',
      tolBaixo: 'Baixa — quero conforto', tolMedio: 'Média — equilibrado', tolAlto: 'Alta — economizo no chão',
      resultadoInst: 'Resultado instantâneo',
    },
    simulador: {
      badge30s: '30 segundos', titulo: 'Descubra a viagem que combina com você',
      estilo: 'Estilo', dias: 'Dias', orcamento: 'Orçamento US$', mes: 'Mês', qualquer: 'Qualquer',
      placeholderOpcional: 'opcional', cta: 'Descobrir destino',
      cabeOrcamento: '✓ cabe no orçamento', acimaOrcamento: 'acima do orçamento', boaEpoca: 'boa época',
      emTerra: 'em terra', verDestino: 'Ver destino →', montarRoteiro: 'Montar roteiro',
      rodape: 'Escolha seu estilo e veja 3 destinos que combinam — com custo estimado e o porquê de cada um.',
      decisaoCompleta: 'Pra decisão completa — score, custo real com voo e oportunidades — abra a Decisão →',
    },
    pilares: {
      titulo: 'O que nenhum app de viagem faz — e a gente faz',
      sub: 'Eles competem em te vender a reserva mais barata. A gente é a camada de decisão neutra acima disso.',
      decideTit: 'Decide com você', decideTxt: 'Não te empurra 200 opções. Diz qual destino faz sentido pro SEU perfil, mês e bolso — com nota e o porquê de cada um.', decideCTA: 'Ver a decisão',
      custoTit: 'Custo honesto', custoTxt: 'O preço de vitrine é só voo + hotel. Mostramos o custo REAL da viagem inteira, item a item — sem surpresa no balcão.', custoCTA: 'Ver o custo real',
      roteiroTit: 'Roteiro vivo', roteiroTxt: 'Estação × visto × fôlego: a ordem dos países muda tudo. O plano recalcula clima, visto e grana quando você mexe.', roteiroCTA: 'Abrir o planejador',
      paisesTit: 'países', paisesTxt: 'O mundo inteiro com custo, melhor época, visto, segurança e o que comer — não só os óbvios da prateleira.', paisesCTA: 'Explorar destinos',
    },
    passos: {
      titulo: 'Como funciona',
      p1Tit: 'Descubra', p1Txt: 'Conte seu estilo. A gente ranqueia os destinos pelo que combina com você — com score e custo real.',
      p2Tit: 'Decida', p2Txt: 'Compare lado a lado por custo-benefício, segurança, clima e visto. Sem achismo de blog.',
      p3Tit: 'Planeje & vá', p3Txt: 'Monte a rota na ordem certa, gere o roteiro dia a dia com IA, e reserve com um clique. Tudo num lugar.',
    },
    prova: {
      titulo: 'Por que confiar na gente',
      sub: 'Sem conflito de interesse, com dados rastreáveis — o básico que um copiloto de viagem devia ter.',
      neutroTit: 'Conselho neutro', neutroTxt: 'Não vendemos a reserva — então não temos motivo pra te empurrar a opção errada. A recomendação é pelo SEU perfil.',
      custoTit: 'Custo real, não vitrine', custoTxt: 'Somamos o que a OTA esconde: seguro, eSIM, visto e contingência. Você sabe o número de verdade antes de ir.',
      mundoTit: 'O mundo todo, com fonte', mundoTxt: 'países e 2.000+ pontos turísticos, com dados e fotos de Wikipédia/Wikidata — autoria e licença na origem, não achismo de blog.',
      statPaises: 'países', statPontos: 'pontos turísticos', statMoedas: 'moedas', statGratis: 'Grátis', statGratisL: 'pra começar, sem cartão',
    },
    custoReal: {
      heroSelo: 'Vitrine × custo real',
      heroH1: 'O preço da vitrine termina na compra.',
      heroH1b: 'O custo real aparece durante a viagem.',
      heroP: 'Calcule voo, hospedagem, comida, transporte, seguro, eSIM, visto, passeios e contingência. Em 3 cenários: mochila, médio e conforto. Sem surpresa no balcão.',
      detalhe: 'Sua viagem em detalhe',
      detalheP: 'Tudo recalcula no momento em que você muda. Sem botão.',
      onde: 'Onde o dinheiro vai',
      cenariosTitulo: '3 cenários — escolha o seu',
      cenariosP: 'Mantemos voo, seguro e taxas iguais. Muda só a vida diária (hospedagem + comida + transporte local).',
      atencao: 'Atenção',
      cambio: 'Câmbio',
      destino: 'Destino', pessoas: 'Pessoas', passeios: 'Passeios US$/dia', bagagem: 'Bagagem US$/pessoa',
      precoVitrine: 'Preço de vitrine', escondido: 'Escondido', custoTotal: 'Custo real total',
      porDia: 'por dia', porPessoa: 'por pessoa', vooEstimado: 'voo estimado',
      verAlertasDestino: 'Ver alertas do destino', montarRoteiroOrcamento: 'Montar roteiro neste orçamento',
    },
    voos: {
      heroSelo: 'Além do voo barato',
      heroH1: 'O voo mais barato pode destruir o primeiro dia.',
      heroP: 'Compare preço, duração e escalas com uma leitura prática: economiza dinheiro, mas rouba energia? Vale esperar? Chega em horário humano?',
      buscar: 'Buscar voos', buscando: 'Buscando…',
      origem: 'Origem', destino: 'Destino', data: 'Data',
    },
    comparar: {
      heroSelo: 'Comparar destinos',
      heroH1: 'Comparar destinos',
      heroP: 'Seus favoritos lado a lado: custo, melhor época e regra de visto.',
      criterio: 'Critério', melhor: 'melhor',
      veredito: 'Veredito',
    },
    planos: {
      heroSelo: 'Economia antes da passagem',
      heroH1: 'Pague menos para errar menos.',
      heroP: 'O Premium se paga quando evita uma passagem mal comprada, um roteiro corrido demais ou uma viagem "barata" que fica cara no detalhe.',
      maisPopular: 'Mais popular',
      roiSelo: 'Argumento concreto',
      roiH2: 'Quanto custa uma escolha ruim?',
      roiP: 'Marque os erros que você já cometeu (ou pode cometer). A conta normalmente passa de um ano de Premium na primeira viagem.',
      custoErros: 'Custo dos erros marcados', umaViagem: 'numa única viagem mal decidida',
      assinarPremium: 'Assinar Premium', verCustoPrimeiro: 'Ver custo real primeiro',
      economiaLabel: 'Você economiza pelo menos',
      premiumPor: 'Premium por',
    },
    roteiro: {
      heroSelo: 'Roteiro vivo',
      heroH1: 'Monte um roteiro que você consegue viver.',
      tipoRoteiro: 'Tipo de roteiro',
      gerar: 'Gerar roteiro', gerando: 'Gerando…',
    },
  },
  en: {
    nav: {
      descobrir: 'Discover', decidir: 'Decide', comparar: 'Compare',
      custoReal: 'Real cost', planejar: 'Plan', roteiro: 'Itinerary',
      voos: 'Flights', salvos: 'Saved', precos: 'Pricing', entrar: 'Sign in', menu: 'Menu',
    },
    home: {
      heroCTA: 'Decide my trip', heroSubCTA: 'Explore destinations',
      ctaFinalCalcular: 'Calculate my trip', ctaFinalDescobrir: 'Discover 3 possible trips',
      gratisComecar: 'Free to start', semCartao: 'No card', conselhoNeutro: 'Neutral advice',
      heroH1a: 'Decide the trip of your life', heroH1b: 'with a copilot that thinks for you.',
      heroSub: 'OTAs push options at you. We tell you where to go for your profile, what it really costs (not just flight + hotel), and build an itinerary that recalculates. Start free.',
      heroDecidir: 'Decide my trip', heroExplorar: 'Explore destinations',
      problemaSelo: 'The problem', problemaH2: 'The problem isn\'t lack of options. It\'s excess of options without context.',
      problemaP: 'Most trips don\'t go wrong at the destination. They go wrong at the decision — before buying the ticket.',
      comoDecidoSelo: 'The engine', comoDecidoH2: 'How Mundo Sem Fim picks what fits you',
      comoDecidoP: 'Eight factors that change the answer. Switched month? Switched budget? The ranking redoes on the spot.',
      custoRealSelo: 'Real cost', custoRealH2: 'Sticker price ends at checkout. Real cost shows up during the trip.',
      custoRealP: 'Real example: 8 days in Peru, couple, balanced profile.',
      custoRealCTA: 'Open the calculator',
      vitrineLabel: 'Sticker price', vitrineSub: 'Flight + hotel',
      escondidoLabel: 'Real cost', escondidoSub: '+ food + transport + insurance + eSIM + tours + contingency',
      diferencaLabel: 'Difference', diferencaSub: 'That usually appears too late',
      otasSelo: 'Where we fit', otasH2: 'We\'re not an OTA. We\'re the decision layer before it.',
      otasP: 'Each tool solves one part. Nobody tells you if the whole trip is worth it.',
      otasFerramenta: 'Tool', otasFaz: 'What it does', otasPara: 'Where it stops', otasChip: 'decision',
      faqSelo: 'FAQ', faqH2: 'Questions every traveler asks',
      ctaFinalH2: 'Before buying the ticket, see if this trip adds up.',
      ctaFinalP: 'In 30 seconds: 3 destinations that match your profile, month and budget — with the real cost of the whole trip, not just the flight.',
      ctaFinalCusto: 'Open real cost', ctaFinalRodape: 'Free to start · no card · neutral advice (we don\'t sell the booking).',
    },
    destino: {
      pontosTuristicos: 'Sights', cidadesBases: 'Cities & bases', ondefica: 'Where it is',
      verHistoria: 'See history of', lerArtigo: 'Read full article',
      lerSobrePais: 'Read about the country', abrirMapa: 'Open in Google Maps',
      fonteWiki: 'Source: Wikipedia', carregandoHistoria: 'Loading history…',
      lugares: 'places', foraDaRota: 'off the beaten path', fotoCredito: 'Photo',
      fazerTitulo: 'What to do and what it costs', fazerSub: 'Attractions, museums and tours with ticket or tour price. Filter by what interests you.',
      fazerTodos: 'All', catMuseu: 'Museums', catPasseio: 'Tours', catAtracao: 'Attractions', catParque: 'Parks', catExperiencia: 'Experiences', catReligioso: 'Religious', catNatureza: 'Nature', catHistorico: 'Historic',
      precoGratis: 'Free', precoIngresso: 'ticket', precoTour: 'tour', precoEstimado: 'estimated',
      fazerNota: 'Reference prices (2025-2026) — confirm locally. Converted at current exchange rate.', fazerVazio: 'We don\'t have attraction prices for this country yet.',
      verseFonte: 'view source', semResumo: 'We couldn\'t find a summary for this place on Wikipedia. Use the button below to view it on the map.',
      contextoNota: 'Wikipedia doesn\'t yet have a specific entry for this place — the excerpt above is the editorial take on the country.',
      valeTitulo: 'Is it worth going now?',
      valeBomMomento: 'Good moment', valeAlerta: 'Only with bigger budget',
      valeEspere: 'Wait for the next cycle', valeEvite: 'Avoid this month',
      valeCondicional: 'Good for those who prioritize destination, not price',
      valeBomBarato: 'Open window for controlled budget',
      valeNeutro: 'Decision depends on your profile',
      oqueTitulo: 'What nobody tells you',
      oqueP: 'Things romanticized blogs, short videos and influencers don\'t mention. Curated by country; honest even when uncomfortable.',
      oqueNotaIdioma: 'Tips curated in Brazilian Portuguese. Auto-translation coming soon.',
      // V2 — block "Specific to [city]"
      fazerV2Titulo: 'Specific to', fazerV2Sub: 'Tips, passes, specialties and curated freebies — researched in',
      fazerV2Dicas: '💡 Money-saving tips', fazerV2Passes: '🎟️ Worth the pass?', fazerV2Cobre: 'Covers',
      fazerV2Especial: '⭐ Specialty of', fazerV2Gratis: '🆓 Free or donation', fazerV2Fontes: 'Sources',
      fazerV2Baixa: 'low confidence estimate', fazerV2Desat: 'researched over 1 year ago',
      fazerV2Aviso: '⚠️ Prices change. Check the official site before going.',
    },
    map: { ampliar: 'View larger map' },
    geral: {
      voltar: 'Back', salvar: 'Save', comparar: 'Compare', fechar: 'Close',
      ver: 'View', proximo: 'Next', anterior: 'Previous',
    },
    decisao: {
      heroSelo: 'Decision layer before booking',
      heroH1: 'Discover the trip that really fits you.',
      heroP: 'Set days, budget and roughness tolerance. We cross real cost, weather, safety and pace to tell you where it\'s worth going — and where it\'s better not to spend now.',
      wizardSelo: 'Decision wizard', wizardH2: 'Where is it worth going with your money, your month and your energy?',
      wizardP: 'Everything recalculates the moment you change. No "generate" button.',
      saindoDe: 'Leaving from', mes: 'Month', mesQualquer: 'Any month', dias: 'Days available',
      orcamento: 'Total budget', estilo: 'Style', companhia: 'Company',
      tolerancia: 'Roughness tolerance',
      tolBaixo: 'Low — I want comfort', tolMedio: 'Medium — balanced', tolAlto: 'High — save on the ground',
      resultadoInst: 'Instant result',
    },
    simulador: {
      badge30s: '30 seconds', titulo: 'Discover the trip that fits you',
      estilo: 'Style', dias: 'Days', orcamento: 'Budget US$', mes: 'Month', qualquer: 'Any',
      placeholderOpcional: 'optional', cta: 'Discover destination',
      cabeOrcamento: '✓ fits budget', acimaOrcamento: 'over budget', boaEpoca: 'good season',
      emTerra: 'on the ground', verDestino: 'See destination →', montarRoteiro: 'Build itinerary',
      rodape: 'Pick your style and see 3 destinations that fit — with estimated cost and why each one.',
      decisaoCompleta: 'For full decision — score, real cost with flight and opportunities — open Decide →',
    },
    pilares: {
      titulo: 'What no travel app does — and we do',
      sub: 'They compete to sell you the cheapest booking. We are the neutral decision layer above that.',
      decideTit: 'Decides with you', decideTxt: 'Doesn\'t push 200 options at you. Says which destination fits YOUR profile, month and wallet — with score and why each one.', decideCTA: 'See the decision',
      custoTit: 'Honest cost', custoTxt: 'Sticker price is just flight + hotel. We show the REAL cost of the whole trip, item by item — no surprises at the counter.', custoCTA: 'See real cost',
      roteiroTit: 'Living itinerary', roteiroTxt: 'Season × visa × budget: the order of countries changes everything. The plan recalculates climate, visa and money when you change it.', roteiroCTA: 'Open the planner',
      paisesTit: 'countries', paisesTxt: 'The entire world with cost, best season, visa, safety and what to eat — not just the obvious off the shelf.', paisesCTA: 'Explore destinations',
    },
    passos: {
      titulo: 'How it works',
      p1Tit: 'Discover', p1Txt: 'Tell us your style. We rank destinations by what fits you — with score and real cost.',
      p2Tit: 'Decide', p2Txt: 'Compare side by side by value, safety, weather and visa. No blog guessing.',
      p3Tit: 'Plan & go', p3Txt: 'Build the route in the right order, generate the day-by-day itinerary with AI, and book in one click. All in one place.',
    },
    prova: {
      titulo: 'Why trust us',
      sub: 'No conflict of interest, with traceable data — the basics a travel copilot should have.',
      neutroTit: 'Neutral advice', neutroTxt: 'We don\'t sell the booking — so we have no reason to push the wrong option. The recommendation is for YOUR profile.',
      custoTit: 'Real cost, not sticker', custoTxt: 'We add what the OTA hides: insurance, eSIM, visa and contingency. You know the real number before going.',
      mundoTit: 'The whole world, sourced', mundoTxt: 'countries and 2,000+ sights, with data and photos from Wikipedia/Wikidata — authorship and license at the source, not blog guessing.',
      statPaises: 'countries', statPontos: 'sights', statMoedas: 'currencies', statGratis: 'Free', statGratisL: 'to start, no card',
    },
    custoReal: {
      heroSelo: 'Sticker × real cost',
      heroH1: 'The sticker price ends at checkout.',
      heroH1b: 'The real cost shows up during the trip.',
      heroP: 'Calculate flight, lodging, food, transport, insurance, eSIM, visa, tours and contingency. In 3 scenarios: backpack, medium and comfort. No surprises at the counter.',
      detalhe: 'Your trip in detail',
      detalheP: 'Everything recalculates the moment you change. No button.',
      onde: 'Where the money goes',
      cenariosTitulo: '3 scenarios — pick yours',
      cenariosP: 'We keep flight, insurance and taxes the same. Only the daily life changes (lodging + food + local transport).',
      atencao: 'Heads up',
      cambio: 'Exchange',
      destino: 'Destination', pessoas: 'People', passeios: 'Tours US$/day', bagagem: 'Baggage US$/person',
      precoVitrine: 'Sticker price', escondido: 'Hidden', custoTotal: 'Total real cost',
      porDia: 'per day', porPessoa: 'per person', vooEstimado: 'estimated flight',
      verAlertasDestino: 'See destination alerts', montarRoteiroOrcamento: 'Build itinerary on this budget',
    },
    voos: {
      heroSelo: 'Beyond the cheap flight',
      heroH1: 'The cheapest flight can destroy your first day.',
      heroP: 'Compare price, duration and stops with a practical read: saves money but steals energy? Worth waiting? Lands at a human hour?',
      buscar: 'Search flights', buscando: 'Searching…',
      origem: 'Origin', destino: 'Destination', data: 'Date',
    },
    comparar: {
      heroSelo: 'Compare destinations',
      heroH1: 'Compare destinations',
      heroP: 'Your favorites side by side: cost, best season and visa rules.',
      criterio: 'Criterion', melhor: 'best',
      veredito: 'Verdict',
    },
    planos: {
      heroSelo: 'Savings before the ticket',
      heroH1: 'Pay less to make fewer mistakes.',
      heroP: 'Premium pays for itself when it prevents a bad ticket, a rushed itinerary or a "cheap" trip that turns expensive in the details.',
      maisPopular: 'Most popular',
      roiSelo: 'Concrete argument',
      roiH2: 'How much does a bad choice cost?',
      roiP: 'Check the mistakes you\'ve made (or might make). The bill usually beats a year of Premium on the first trip.',
      custoErros: 'Cost of checked mistakes', umaViagem: 'on a single poorly-decided trip',
      assinarPremium: 'Subscribe to Premium', verCustoPrimeiro: 'See real cost first',
      economiaLabel: 'You save at least',
      premiumPor: 'Premium for',
    },
    roteiro: {
      heroSelo: 'Living itinerary',
      heroH1: 'Build an itinerary you can actually live.',
      tipoRoteiro: 'Itinerary type',
      gerar: 'Generate itinerary', gerando: 'Generating…',
    },
  },
  es: {
    nav: {
      descobrir: 'Descubrir', decidir: 'Decidir', comparar: 'Comparar',
      custoReal: 'Coste real', planejar: 'Planificar', roteiro: 'Itinerario',
      voos: 'Vuelos', salvos: 'Guardados', precos: 'Precios', entrar: 'Entrar', menu: 'Menú',
    },
    home: {
      heroCTA: 'Decidir mi viaje', heroSubCTA: 'Explorar destinos',
      ctaFinalCalcular: 'Calcular mi viaje', ctaFinalDescobrir: 'Descubrir 3 viajes posibles',
      gratisComecar: 'Gratis para empezar', semCartao: 'Sin tarjeta', conselhoNeutro: 'Consejo neutral',
      heroH1a: 'Decide el viaje de tu vida', heroH1b: 'con un copiloto que piensa por ti.',
      heroSub: 'Las OTAs te empujan opciones. Nosotros te decimos a dónde ir según tu perfil, cuánto cuesta de verdad (no solo vuelo + hotel) y armamos el itinerario que recalcula. Empieza gratis.',
      heroDecidir: 'Decidir mi viaje', heroExplorar: 'Explorar destinos',
      problemaSelo: 'El problema', problemaH2: 'El problema no es falta de opciones. Es exceso de opciones sin contexto.',
      problemaP: 'La mayoría de los viajes no salen mal en el destino. Salen mal en la decisión — antes de comprar el pasaje.',
      comoDecidoSelo: 'El motor', comoDecidoH2: 'Cómo Mundo Sem Fim decide qué te conviene',
      comoDecidoP: 'Ocho factores que cambian la respuesta. ¿Cambiaste de mes? ¿De presupuesto? El ranking se rehace al momento.',
      custoRealSelo: 'Coste real', custoRealH2: 'El precio de vitrina termina en la compra. El coste real aparece durante el viaje.',
      custoRealP: 'Ejemplo real: 8 días en Perú, pareja, perfil equilibrado.',
      custoRealCTA: 'Abrir la calculadora',
      vitrineLabel: 'Precio de vitrina', vitrineSub: 'Vuelo + hotel',
      escondidoLabel: 'Coste real', escondidoSub: '+ comida + transporte + seguro + eSIM + tours + imprevistos',
      diferencaLabel: 'Diferencia', diferencaSub: 'Que normalmente aparece demasiado tarde',
      otasSelo: 'Dónde entramos', otasH2: 'No somos una OTA. Somos la capa de decisión antes de ella.',
      otasP: 'Cada herramienta resuelve una parte. Falta quien te diga si vale el viaje entero.',
      otasFerramenta: 'Herramienta', otasFaz: 'Qué hace', otasPara: 'Dónde para', otasChip: 'decisión',
      faqSelo: 'FAQ', faqH2: 'Preguntas que todo viajero hace',
      ctaFinalH2: 'Antes de comprar el pasaje, mira si este viaje cierra la cuenta.',
      ctaFinalP: 'En 30 segundos: 3 destinos que coinciden con tu perfil, mes y presupuesto — con el coste real del viaje entero, no solo del vuelo.',
      ctaFinalCusto: 'Abrir coste real', ctaFinalRodape: 'Gratis para empezar · sin tarjeta · consejo neutral (no vendemos la reserva).',
    },
    destino: {
      pontosTuristicos: 'Lugares turísticos', cidadesBases: 'Ciudades & bases', ondefica: 'Dónde está',
      verHistoria: 'Ver historia de', lerArtigo: 'Leer artículo completo',
      lerSobrePais: 'Leer sobre el país', abrirMapa: 'Abrir en Google Maps',
      fonteWiki: 'Fuente: Wikipedia', carregandoHistoria: 'Cargando historia…',
      lugares: 'lugares', foraDaRota: 'fuera de ruta', fotoCredito: 'Foto',
      fazerTitulo: 'Qué hacer y cuánto cuesta', fazerSub: 'Atracciones, museos y tours con precio de entrada o tour. Filtra por lo que te interese.',
      fazerTodos: 'Todo', catMuseu: 'Museos', catPasseio: 'Tours', catAtracao: 'Atracciones', catParque: 'Parques', catExperiencia: 'Experiencias', catReligioso: 'Religioso', catNatureza: 'Naturaleza', catHistorico: 'Histórico',
      precoGratis: 'Gratis', precoIngresso: 'entrada', precoTour: 'tour', precoEstimado: 'estimado',
      fazerNota: 'Precios de referencia (2025-2026) — confirma en el lugar. Convertido al cambio actual.', fazerVazio: 'Aún no tenemos precios de atracciones de este país.',
      verseFonte: 'ver fuente', semResumo: 'No encontramos un resumen de este lugar en Wikipedia. Usa el botón abajo para verlo en el mapa.',
      contextoNota: 'Wikipedia aún no tiene una entrada específica para este lugar — el extracto de arriba es el veredicto editorial sobre el país.',
      valeTitulo: '¿Vale la pena ir ahora?',
      valeBomMomento: 'Buen momento', valeAlerta: 'Solo con mayor presupuesto',
      valeEspere: 'Espera el próximo ciclo', valeEvite: 'Evita este mes',
      valeCondicional: 'Bueno para quien prioriza el destino, no el precio',
      valeBomBarato: 'Ventana abierta para presupuesto controlado',
      valeNeutro: 'La decisión depende de tu perfil',
      oqueTitulo: 'Lo que nadie te cuenta',
      oqueP: 'Cosas que los blogs romanticos, videos cortos y influencers no dicen. Curado por país; honesto hasta cuando incomoda.',
      oqueNotaIdioma: 'Tips curados en portugués brasileño. Traducción automática próximamente.',
      // V2 — bloque "Específico de [ciudad]"
      fazerV2Titulo: 'Específico de', fazerV2Sub: 'Tips, passes, especialidades y gratis curados — investigado en',
      fazerV2Dicas: '💡 Tips de ahorro', fazerV2Passes: '🎟️ ¿Vale el pase?', fazerV2Cobre: 'Cubre',
      fazerV2Especial: '⭐ Especialidad de', fazerV2Gratis: '🆓 Gratis o donación', fazerV2Fontes: 'Fuentes',
      fazerV2Baixa: 'estimación baja confianza', fazerV2Desat: 'investigado hace más de 1 año',
      fazerV2Aviso: '⚠️ Los precios cambian. Verifica el sitio oficial antes de ir.',
    },
    map: { ampliar: 'Ver mapa grande' },
    geral: {
      voltar: 'Atrás', salvar: 'Guardar', comparar: 'Comparar', fechar: 'Cerrar',
      ver: 'Ver', proximo: 'Siguiente', anterior: 'Anterior',
    },
    decisao: {
      heroSelo: 'Capa de decisión antes de la reserva',
      heroH1: 'Descubre el viaje que realmente te conviene.',
      heroP: 'Pon días, presupuesto y tolerancia a complicaciones. Mundo Sem Fim cruza coste real, clima, seguridad y ritmo para decirte dónde vale la pena ir — y dónde es mejor no gastar ahora.',
      wizardSelo: 'Asistente de decisión', wizardH2: '¿Dónde vale ir con tu dinero, tu mes y tu energía?',
      wizardP: 'Todo se recalcula en cuanto cambias. Sin botón de "generar".',
      saindoDe: 'Saliendo de', mes: 'Mes', mesQualquer: 'Cualquier mes', dias: 'Días disponibles',
      orcamento: 'Presupuesto total', estilo: 'Estilo', companhia: 'Compañía',
      tolerancia: 'Tolerancia a complicaciones',
      tolBaixo: 'Baja — quiero comodidad', tolMedio: 'Media — equilibrado', tolAlto: 'Alta — economizo en tierra',
      resultadoInst: 'Resultado instantáneo',
    },
    simulador: {
      badge30s: '30 segundos', titulo: 'Descubre el viaje que te conviene',
      estilo: 'Estilo', dias: 'Días', orcamento: 'Presupuesto US$', mes: 'Mes', qualquer: 'Cualquiera',
      placeholderOpcional: 'opcional', cta: 'Descubrir destino',
      cabeOrcamento: '✓ cabe en presupuesto', acimaOrcamento: 'sobre presupuesto', boaEpoca: 'buena época',
      emTerra: 'en tierra', verDestino: 'Ver destino →', montarRoteiro: 'Armar itinerario',
      rodape: 'Elige tu estilo y mira 3 destinos que coinciden — con coste estimado y el porqué de cada uno.',
      decisaoCompleta: 'Para decisión completa — score, coste real con vuelo y oportunidades — abre Decidir →',
    },
    pilares: {
      titulo: 'Lo que ninguna app de viaje hace — y nosotros sí',
      sub: 'Compiten por venderte la reserva más barata. Nosotros somos la capa de decisión neutral por encima.',
      decideTit: 'Decide contigo', decideTxt: 'No te empuja 200 opciones. Dice qué destino tiene sentido para TU perfil, mes y bolsillo — con score y el porqué de cada uno.', decideCTA: 'Ver la decisión',
      custoTit: 'Coste honesto', custoTxt: 'El precio de vitrina es solo vuelo + hotel. Mostramos el coste REAL del viaje entero, ítem por ítem — sin sorpresas en el mostrador.', custoCTA: 'Ver coste real',
      roteiroTit: 'Itinerario vivo', roteiroTxt: 'Estación × visa × dinero: el orden de los países cambia todo. El plan recalcula clima, visa y dinero cuando lo mueves.', roteiroCTA: 'Abrir el planificador',
      paisesTit: 'países', paisesTxt: 'El mundo entero con coste, mejor época, visa, seguridad y qué comer — no solo lo obvio del estante.', paisesCTA: 'Explorar destinos',
    },
    passos: {
      titulo: 'Cómo funciona',
      p1Tit: 'Descubre', p1Txt: 'Cuenta tu estilo. Rankeamos los destinos por lo que coincide contigo — con score y coste real.',
      p2Tit: 'Decide', p2Txt: 'Compara lado a lado por relación coste-beneficio, seguridad, clima y visa. Sin adivinanzas de blog.',
      p3Tit: 'Planifica & ve', p3Txt: 'Arma la ruta en el orden correcto, genera el itinerario día a día con IA, y reserva con un clic. Todo en un lugar.',
    },
    prova: {
      titulo: 'Por qué confiar en nosotros',
      sub: 'Sin conflicto de interés, con datos rastreables — lo básico que un copiloto de viaje debería tener.',
      neutroTit: 'Consejo neutral', neutroTxt: 'No vendemos la reserva — así que no tenemos motivo para empujarte la opción equivocada. La recomendación es para TU perfil.',
      custoTit: 'Coste real, no vitrina', custoTxt: 'Sumamos lo que la OTA esconde: seguro, eSIM, visa y contingencia. Sabes el número real antes de ir.',
      mundoTit: 'El mundo entero, con fuente', mundoTxt: 'países y 2.000+ lugares turísticos, con datos y fotos de Wikipedia/Wikidata — autoría y licencia en la fuente, no adivinanzas de blog.',
      statPaises: 'países', statPontos: 'lugares turísticos', statMoedas: 'monedas', statGratis: 'Gratis', statGratisL: 'para empezar, sin tarjeta',
    },
    custoReal: {
      heroSelo: 'Vitrina × coste real',
      heroH1: 'El precio de vitrina termina en la compra.',
      heroH1b: 'El coste real aparece durante el viaje.',
      heroP: 'Calcula vuelo, alojamiento, comida, transporte, seguro, eSIM, visa, tours y contingencia. En 3 escenarios: mochila, medio y confort. Sin sorpresas en el mostrador.',
      detalhe: 'Tu viaje en detalle',
      detalheP: 'Todo recalcula en cuanto cambias. Sin botón.',
      onde: 'A dónde va el dinero',
      cenariosTitulo: '3 escenarios — elige el tuyo',
      cenariosP: 'Mantenemos vuelo, seguro y tasas iguales. Solo cambia la vida diaria (alojamiento + comida + transporte local).',
      atencao: 'Atención',
      cambio: 'Tipo de cambio',
      destino: 'Destino', pessoas: 'Personas', passeios: 'Tours US$/día', bagagem: 'Equipaje US$/persona',
      precoVitrine: 'Precio de vitrina', escondido: 'Oculto', custoTotal: 'Coste real total',
      porDia: 'por día', porPessoa: 'por persona', vooEstimado: 'vuelo estimado',
      verAlertasDestino: 'Ver alertas del destino', montarRoteiroOrcamento: 'Armar itinerario con este presupuesto',
    },
    voos: {
      heroSelo: 'Más allá del vuelo barato',
      heroH1: 'El vuelo más barato puede destruir tu primer día.',
      heroP: 'Compara precio, duración y escalas con una lectura práctica: ¿ahorra dinero pero roba energía? ¿Vale esperar? ¿Llega a una hora humana?',
      buscar: 'Buscar vuelos', buscando: 'Buscando…',
      origem: 'Origen', destino: 'Destino', data: 'Fecha',
    },
    comparar: {
      heroSelo: 'Comparar destinos',
      heroH1: 'Comparar destinos',
      heroP: 'Tus favoritos lado a lado: coste, mejor época y regla de visa.',
      criterio: 'Criterio', melhor: 'mejor',
      veredito: 'Veredicto',
    },
    planos: {
      heroSelo: 'Ahorro antes del pasaje',
      heroH1: 'Paga menos para errar menos.',
      heroP: 'Premium se paga solo cuando evita un pasaje mal comprado, un itinerario apurado o un viaje "barato" que sale caro en el detalle.',
      maisPopular: 'Más popular',
      roiSelo: 'Argumento concreto',
      roiH2: '¿Cuánto cuesta una mala elección?',
      roiP: 'Marca los errores que ya cometiste (o puedes cometer). La cuenta normalmente supera un año de Premium en el primer viaje.',
      custoErros: 'Coste de los errores marcados', umaViagem: 'en un solo viaje mal decidido',
      assinarPremium: 'Suscribirse a Premium', verCustoPrimeiro: 'Ver coste real primero',
      economiaLabel: 'Ahorras al menos',
      premiumPor: 'Premium por',
    },
    roteiro: {
      heroSelo: 'Itinerario vivo',
      heroH1: 'Arma un itinerario que puedas vivir.',
      tipoRoteiro: 'Tipo de itinerario',
      gerar: 'Generar itinerario', gerando: 'Generando…',
    },
  },
  ja: {
    nav: {
      descobrir: '発見', decidir: '決定', comparar: '比較',
      custoReal: '実費', planejar: '計画', roteiro: '旅程',
      voos: 'フライト', salvos: '保存', precos: '料金', entrar: 'ログイン', menu: 'メニュー',
    },
    home: {
      heroCTA: '旅を決める', heroSubCTA: '目的地を探す',
      ctaFinalCalcular: '旅費を計算', ctaFinalDescobrir: '3つの旅を発見',
      gratisComecar: '無料で開始', semCartao: 'カード不要', conselhoNeutro: '中立的なアドバイス',
      heroH1a: '人生の旅を決める', heroH1b: 'あなたのために考える副操縦士と一緒に。',
      heroSub: 'OTAは選択肢を押し付けます。私たちはあなたのプロフィールに合わせてどこへ行くか、本当の費用（航空券+ホテルだけではない）を教え、再計算する旅程を作ります。無料で始められます。',
      heroDecidir: '旅を決める', heroExplorar: '目的地を探す',
      problemaSelo: '問題', problemaH2: '問題は選択肢の不足ではない。文脈なき選択肢の過剰だ。',
      problemaP: 'ほとんどの旅は目的地で失敗しません。決定で失敗します — チケットを買う前に。',
      comoDecidoSelo: 'エンジン', comoDecidoH2: 'Mundo Sem Fim はどうやってあなたに合うものを選ぶか',
      comoDecidoP: '答えを変える8つの要因。月を変えた？予算を変えた？ランキングはその場で再計算されます。',
      custoRealSelo: '実費', custoRealH2: '値札の価格は会計で終わる。実費は旅の途中で現れる。',
      custoRealP: '実例: 8日間、ペルー、カップル、バランス型プロフィール。',
      custoRealCTA: '計算機を開く',
      vitrineLabel: '値札の価格', vitrineSub: '航空券 + ホテル',
      escondidoLabel: '実費', escondidoSub: '+ 食事 + 交通 + 保険 + eSIM + ツアー + 予備費',
      diferencaLabel: '差額', diferencaSub: '通常、遅すぎる頃に現れる',
      otasSelo: '私たちの位置', otasH2: '私たちはOTAではありません。その前の決定レイヤーです。',
      otasP: '各ツールは一部しか解決しない。旅全体に価値があるか教えてくれる者がいない。',
      otasFerramenta: 'ツール', otasFaz: '何をする', otasPara: 'どこで止まる', otasChip: '決定',
      faqSelo: 'FAQ', faqH2: '旅行者なら誰もが聞く質問',
      ctaFinalH2: 'チケットを買う前に、この旅が計算に合うか見よう。',
      ctaFinalP: '30秒で: あなたのプロフィール、月、予算に合う3つの目的地 — 航空券だけでなく、旅全体の実費とともに。',
      ctaFinalCusto: '実費を開く', ctaFinalRodape: '無料で開始 · カード不要 · 中立的なアドバイス（予約は販売しません）。',
    },
    destino: {
      pontosTuristicos: '観光スポット', cidadesBases: '都市と拠点', ondefica: '場所',
      verHistoria: '歴史を見る:', lerArtigo: '記事全文を読む',
      lerSobrePais: '国について読む', abrirMapa: 'Googleマップで開く',
      fonteWiki: '出典: ウィキペディア', carregandoHistoria: '歴史を読み込み中…',
      lugares: 'スポット', foraDaRota: '定番外', fotoCredito: '写真',
      fazerTitulo: '何ができて、いくらかかるか', fazerSub: 'アトラクション、博物館、ツアーを入場料・ツアー料金付きで。興味のあるものでフィルター。',
      fazerTodos: 'すべて', catMuseu: '博物館', catPasseio: 'ツアー', catAtracao: 'アトラクション', catParque: '公園', catExperiencia: '体験', catReligioso: '宗教', catNatureza: '自然', catHistorico: '歴史',
      precoGratis: '無料', precoIngresso: '入場', precoTour: 'ツアー', precoEstimado: '推定',
      fazerNota: '参考価格 (2025-2026) — 現地で確認を。現在の為替レートで換算。', fazerVazio: 'この国のアトラクション価格はまだありません。',
      verseFonte: '出典を見る', semResumo: 'ウィキペディアにこの場所の概要が見つかりませんでした。下のボタンで地図を見てください。',
      contextoNota: 'ウィキペディアにはまだこのスポット固有の項目がありません — 上の抜粋は国に関する編集判断です。',
      valeTitulo: '今行く価値はあるか？',
      valeBomMomento: '良い時期', valeAlerta: '予算が多い時のみ',
      valeEspere: '次のサイクルを待つ', valeEvite: '今月は避ける',
      valeCondicional: '価格より目的地を優先する人向け',
      valeBomBarato: '抑えた予算でも行ける時期',
      valeNeutro: 'あなたのプロフィール次第',
      oqueTitulo: '誰も教えてくれないこと',
      oqueP: 'ロマンチックなブログ、ショート動画、インフルエンサーが語らないこと。国別キュレーション。不快でも正直に。',
      oqueNotaIdioma: 'ブラジル・ポルトガル語でキュレーション。自動翻訳は近日対応。',
      // V2 — 「[都市]の特別情報」ブロック
      fazerV2Titulo: 'の特別情報', fazerV2Sub: 'ヒント、パス、名物、無料情報 — 調査時期',
      fazerV2Dicas: '💡 節約のヒント', fazerV2Passes: '🎟️ パスはお得？', fazerV2Cobre: '含まれるもの',
      fazerV2Especial: '⭐ 名物 in', fazerV2Gratis: '🆓 無料または寄付', fazerV2Fontes: '情報源',
      fazerV2Baixa: '信頼度低い推定', fazerV2Desat: '調査から1年以上',
      fazerV2Aviso: '⚠️ 価格は変動します。訪問前に公式サイトで確認してください。',
    },
    map: { ampliar: '大きな地図を見る' },
    geral: {
      voltar: '戻る', salvar: '保存', comparar: '比較', fechar: '閉じる',
      ver: '見る', proximo: '次へ', anterior: '前へ',
    },
    decisao: {
      heroSelo: '予約前の決定レイヤー',
      heroH1: 'あなたに本当に合う旅を見つけよう。',
      heroP: '日数、予算、不便への耐性を入力。Mundo Sem Fim は実費、気候、安全、ペースを交差させて、行く価値のある場所 — そして今は使わないほうがいい場所を教えます。',
      wizardSelo: '決定ウィザード', wizardH2: 'あなたのお金、月、エネルギーで行く価値のある場所は？',
      wizardP: '変更すると全て即座に再計算。「生成」ボタンは不要。',
      saindoDe: '出発地', mes: '月', mesQualquer: 'いつでも', dias: '利用可能日数',
      orcamento: '総予算', estilo: 'スタイル', companhia: '同行者',
      tolerancia: '不便への耐性',
      tolBaixo: '低 — 快適さ重視', tolMedio: '中 — バランス', tolAlto: '高 — 現地で節約',
      resultadoInst: '即時結果',
    },
    simulador: {
      badge30s: '30秒', titulo: 'あなたに合う旅を見つけよう',
      estilo: 'スタイル', dias: '日数', orcamento: '予算US$', mes: '月', qualquer: 'いつでも',
      placeholderOpcional: '任意', cta: '目的地を発見',
      cabeOrcamento: '✓ 予算内', acimaOrcamento: '予算超過', boaEpoca: '良い時期',
      emTerra: '現地', verDestino: '目的地を見る →', montarRoteiro: '旅程を作る',
      rodape: 'スタイルを選んで合う3つの目的地を見よう — 推定費用とそれぞれの理由付き。',
      decisaoCompleta: '完全な決定（スコア、フライト込み実費、機会）は「決定」を開く →',
    },
    pilares: {
      titulo: '他のどの旅行アプリもしない — 私たちがするもの',
      sub: '彼らは最安の予約を売るために競う。私たちはその上の中立的な決定レイヤー。',
      decideTit: 'あなたと共に決定', decideTxt: '200の選択肢を押し付けない。あなたのプロフィール、月、予算に合う目的地を — スコアと理由付きで教える。', decideCTA: '決定を見る',
      custoTit: '正直な費用', custoTxt: '表示価格は航空券+ホテルだけ。旅全体の実費を項目ごとに表示 — カウンターで驚かない。', custoCTA: '実費を見る',
      roteiroTit: '生きた旅程', roteiroTxt: '季節 × ビザ × 予算: 国の順序ですべてが変わる。動かすと気候、ビザ、お金を再計算。', roteiroCTA: 'プランナーを開く',
      paisesTit: '国', paisesTxt: '世界全体を費用、ベストシーズン、ビザ、安全、何を食べるかで — 棚にある明らかなものだけではなく。', paisesCTA: '目的地を探す',
    },
    passos: {
      titulo: '仕組み',
      p1Tit: '発見', p1Txt: 'スタイルを教えて。あなたに合う目的地をランキング — スコアと実費付き。',
      p2Tit: '決定', p2Txt: 'コスパ、安全、気候、ビザで並べて比較。ブログの当てずっぽうなし。',
      p3Tit: '計画して出発', p3Txt: '正しい順序でルートを組み、AIで日々の旅程を生成、ワンクリックで予約。すべて一箇所で。',
    },
    prova: {
      titulo: 'なぜ私たちを信頼するか',
      sub: '利害の対立なし、追跡可能なデータ付き — 旅の副操縦士が持つべき基本。',
      neutroTit: '中立的なアドバイス', neutroTxt: '予約を売らない — だから間違った選択肢を押し付ける理由がない。推薦はあなたのプロフィールに基づく。',
      custoTit: '実費、表示価格ではなく', custoTxt: 'OTAが隠すものを加算: 保険、eSIM、ビザ、予備費。行く前に本当の数字がわかる。',
      mundoTit: '世界全体、出典付き', mundoTxt: 'か国と2,000以上の観光スポット、ウィキペディア/ウィキデータのデータと写真付き — 出典は元に、ブログの当てずっぽうではなく。',
      statPaises: 'か国', statPontos: '観光スポット', statMoedas: '通貨', statGratis: '無料', statGratisL: '開始、カード不要',
    },
    custoReal: {
      heroSelo: '値札 × 実費',
      heroH1: '値札の価格は会計で終わる。',
      heroH1b: '実費は旅の途中で現れる。',
      heroP: '航空券、宿泊、食事、交通、保険、eSIM、ビザ、ツアー、予備費を計算。3つのシナリオで: バックパック、中、快適。窓口で驚かない。',
      detalhe: 'あなたの旅の詳細',
      detalheP: '変更すると即座に再計算。ボタン不要。',
      onde: 'お金はどこへ',
      cenariosTitulo: '3つのシナリオ — 自分のを選ぼう',
      cenariosP: '航空券、保険、税金は同じまま。日常生活（宿泊+食事+現地交通）だけが変わります。',
      atencao: '注意',
      cambio: '為替',
      destino: '目的地', pessoas: '人数', passeios: 'ツアー US$/日', bagagem: '荷物 US$/人',
      precoVitrine: '表示価格', escondido: '隠れた費用', custoTotal: '実費合計',
      porDia: '1日あたり', porPessoa: '1人あたり', vooEstimado: '推定フライト',
      verAlertasDestino: '目的地の注意を見る', montarRoteiroOrcamento: 'この予算で旅程を作る',
    },
    voos: {
      heroSelo: '安いフライトの先へ',
      heroH1: '最安のフライトは初日を台無しにする。',
      heroP: '価格、所要時間、経由を実用的に比較: お金は節約するがエネルギーを奪う？待つ価値は？人間の時刻に着く？',
      buscar: 'フライト検索', buscando: '検索中…',
      origem: '出発', destino: '目的地', data: '日付',
    },
    comparar: {
      heroSelo: '目的地を比較',
      heroH1: '目的地を比較',
      heroP: 'お気に入りを並べて: 費用、最適季節、ビザ規則。',
      criterio: '基準', melhor: '最良',
      veredito: '判定',
    },
    planos: {
      heroSelo: 'チケット前の節約',
      heroH1: '失敗を減らすために少なく払う。',
      heroP: 'Premium は悪いチケット、急ぎすぎの旅程、詳細で高くなる「安い」旅を防ぐと元が取れます。',
      maisPopular: '最人気',
      roiSelo: '具体的な根拠',
      roiH2: '悪い選択の費用は？',
      roiP: 'あなたがした（あるいはする可能性のある）ミスをチェック。請求額は通常、初回旅行で Premium の1年分を超えます。',
      custoErros: 'チェックしたミスの費用', umaViagem: '一度の判断ミスの旅で',
      assinarPremium: 'Premium を申し込む', verCustoPrimeiro: 'まず実費を見る',
      economiaLabel: '少なくとも節約',
      premiumPor: 'Premium を',
    },
    roteiro: {
      heroSelo: '生きた旅程',
      heroH1: '実際に過ごせる旅程を作ろう。',
      tipoRoteiro: '旅程タイプ',
      gerar: '旅程を生成', gerando: '生成中…',
    },
  },
};

// Detecta idioma do browser, normalizando para os nossos 4 suportados.
// "pt-BR", "pt-PT" → pt. "en-US", "en-GB" → en. "es-AR", "es-MX" → es. "ja" → ja.
// Qualquer outro → pt (default Brasil).
function detectarIdiomaBrowser() {
  if (typeof navigator === 'undefined') return IDIOMA_PADRAO;
  const langs = navigator.languages && navigator.languages.length ? navigator.languages : [navigator.language || ''];
  for (const l of langs) {
    const prefixo = String(l).toLowerCase().slice(0, 2);
    if (IDIOMAS.some((i) => i.code === prefixo)) return prefixo;
  }
  return IDIOMA_PADRAO;
}

function lerStorage() {
  try {
    if (typeof localStorage === 'undefined') return null;
    const v = localStorage.getItem(STORAGE_KEY);
    return IDIOMAS.some((i) => i.code === v) ? v : null;
  } catch { return null; }
}
function gravarStorage(code) {
  try {
    if (typeof localStorage !== 'undefined') localStorage.setItem(STORAGE_KEY, code);
    if (typeof document !== 'undefined') document.cookie = `${STORAGE_KEY}=${code}; path=/; max-age=31536000; samesite=lax`;
  } catch {}
}

// Hook React: devolve { idioma, definir, t } onde t(chavePath) → string traduzida.
// Inicializa com pt no SSR pra não dar hydration mismatch; troca após mount.
export function useIdioma() {
  const [idioma, setIdiomaState] = useState(IDIOMA_PADRAO);

  useEffect(() => {
    const salvo = lerStorage();
    const escolhido = salvo || detectarIdiomaBrowser();
    if (escolhido !== IDIOMA_PADRAO) setIdiomaState(escolhido);
    if (typeof document !== 'undefined') document.documentElement.lang = escolhido;
  }, []);

  function definir(code) {
    if (!IDIOMAS.some((i) => i.code === code)) return;
    setIdiomaState(code);
    gravarStorage(code);
    if (typeof document !== 'undefined') document.documentElement.lang = code;
    // Notifica outros componentes na mesma aba.
    if (typeof window !== 'undefined') window.dispatchEvent(new CustomEvent('msf:lang', { detail: { code } }));
  }

  // Tradução de chave dot-notation: t('nav.decidir') → "Decidir" / "Decide" / etc.
  // Fallback automático: idioma → pt → string da própria chave (não estoura).
  function t(path) {
    const partes = String(path || '').split('.');
    const tentar = (dict) => {
      let cur = dict;
      for (const p of partes) {
        if (cur && typeof cur === 'object' && p in cur) cur = cur[p];
        else return null;
      }
      return typeof cur === 'string' ? cur : null;
    };
    return tentar(STRINGS[idioma]) || tentar(STRINGS[IDIOMA_PADRAO]) || path;
  }

  return { idioma, definir, t };
}

// Para componentes server-side que só precisam ler o idioma do cookie.
export function idiomaDoCookie(cookieHeader) {
  if (!cookieHeader) return IDIOMA_PADRAO;
  const m = String(cookieHeader).match(/msf\.lang\.v1=([a-z]{2})/);
  return m && IDIOMAS.some((i) => i.code === m[1]) ? m[1] : IDIOMA_PADRAO;
}
