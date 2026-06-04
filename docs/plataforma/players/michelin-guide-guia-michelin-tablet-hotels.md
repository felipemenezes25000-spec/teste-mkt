# Michelin Guide (Guia MICHELIN) / Tablet Hotels

> **Categoria:** Curadoria gastronomica e de hospedagem de luxo (guia editorial premium + plataforma de reserva de restaurantes e hoteis)
> _Perfil gerado por pesquisa multiagente (jun/2026). Parte do [Relatório de Mercado](../01-relatorio-de-mercado.md) e da [Matriz Competitiva](../02-matriz-competitiva.md)._

## 1. O que faz
E o guia editorial mais prestigiado do mundo em gastronomia (Estrelas MICHELIN, Bib Gourmand) e, desde 2024, em hotelaria de alto padrao (Chaves MICHELIN / MICHELIN Keys). Funciona como camada de CURADORIA e CONFIANCA: inspetores anonimos selecionam restaurantes e hoteis, e o app/site monetizam transformando esse selo em reservas. Restaurantes sao reservaveis via parceiros (Resy, OpenTable, TheFork) e os hoteis sao reservaveis diretamente na plataforma, que roda sobre a tecnologia da Tablet Hotels (adquirida pela Michelin em 2018), cobrando comissao do hotel.

## 2. Público-alvo
Viajante afluente e foodie premium (gastronomia fine dining + hotelaria boutique/luxo), turista cultural de alto poder aquisitivo, casais em ocasioes especiais, e o trade de luxo (consultores de viagem, host agencies como a Fora). Faixa etaria predominante 30-60, alta renda, disposto a pagar por experiencia e por status. Geograficamente concentrado em grandes capitais gastronomicas (Europa, EUA, Japao, grandes cidades da Asia).

## 3. Funcionalidades principais
- Selecao editorial curada por inspetores anonimos (Estrelas, Bib Gourmand para restaurantes; Chaves/Keys, niveis 1-3 para hoteis)
- Busca e filtro de restaurantes por cidade, cozinha, distincao, faixa de preco
- Reserva de restaurante via integracao com Resy, OpenTable e TheFork (Michelin nao opera o motor, apenas faz deeplink/widget)
- Reserva direta de hoteis (mais de 1.500-5.000 propriedades em 130+ paises) sobre tecnologia Tablet Hotels
- Programa de assinatura MICHELIN Guide Plus / Tablet Plus (US$99/ano) com US$100 de credito por estadia, upgrade de quarto, cafe da manha, late check-out e perks VIP
- App iOS/Android e site multi-idioma com mapas, fichas editoriais e fotos
- Listas e artigos editoriais (news & views, roteiros gastronomicos)
- Distribuicao B2B via Demand API e integracao com host agencies (ex.: Fora) para o trade de luxo

## 4. Como monetiza
- Comissao sobre reservas de HOTEL (modelo agency, estimado 10-15% por reserva), via motor Tablet Hotels - principal fonte de receita transacional
- Taxa por reserva de RESTAURANTE (estimada em US$1-2 por cover/reserva confirmada pelos parceiros) - margem muito menor
- Assinatura recorrente MICHELIN Guide Plus / Tablet Plus a US$99/ano (free trial de 30 dias) - receita previsivel
- Patrocinios e parcerias institucionais (ex.: montadoras, cartoes, aguas premium, marcas de luxo que pagam para associar a marca ao selo / cerimonias de premiacao)
- Licenciamento da marca MICHELIN e taxas de organizacao de cerimonias regionais (orgaos de turismo frequentemente pagam para a Michelin lancar um guia na sua regiao)
- Programa de afiliados da Tablet Hotels (CJ Affiliate, ~5% por venda) - Michelin tambem PAGA trafego, alem de receber
- Distribuicao B2B (Demand API / rates&availability) para parceiros do trade de luxo

## 5. Afiliados
SIM, mas pela marca-irma Tablet Hotels (motor de reservas de hotel do guia), nao pela marca "Michelin Guide" diretamente. Rede: CJ Affiliate (Commission Junction). Comissao tipica relatada: ~5% por venda de hotel. Janela de cookie nao divulgada publicamente (CJ costuma operar 30-45 dias). Importante: cobre a reserva de hoteis curados pelo guia, entao um afiliado consegue, na pratica, monetizar trafego de "hoteis MICHELIN". Nao ha programa de afiliado para reservas de restaurante (essas vao para Resy/OpenTable/TheFork, cada um com seu proprio esquema).

## 6. API
PARCIAL. (1) Existe uma "Demand API / Partnerships Demand API Hotel" para distribuicao B2B de hoteis MICHELIN a parceiros (confirmado por pagina de teste em guide.michelin.com/.../partnerships-demand-api-hotel), de carater de PARCEIRO, nao auto-servico publico. (2) Conectividade de tarifas/disponibilidade de hotel apoiada em parceria com Booking.com para propriedades que nao conectam o PMS diretamente. (3) developer.michelin.com existe, mas e majoritariamente focado em mobilidade/pneus/rotas e APIs de parceiros - NAO ha API publica oficial de dados do GUIA (estrelas/Bib/restaurantes). Quem precisa de dados de restaurantes MICHELIN recorre a scrapers/APIs nao-oficiais de terceiros (GitHub, Apify). Resumindo: integracao de HOTEL e possivel via parceria/afiliado; dados de RESTAURANTE nao tem API oficial.

## 7. Programa de parceiros
Multiplos trilhos: (a) Parceiros de reserva de restaurante - Resy (primeiro parceiro), OpenTable e TheFork (deeplink/widget no site e app). (b) Parceiros institucionais/patrocinadores globais listados em guide.michelin.com/partners. (c) Distribuicao B2B de hoteis via Tablet Hotels para o trade de luxo - ex.: host agency Fora integrou ~1.000 hoteis Tablet Plus com tarifas e disponibilidade para consultores de viagem. (d) Programa de afiliados via CJ Affiliate (Tablet Hotels). (e) Parceria de conectividade com Booking.com. Nao ha um portal publico self-service de "vire parceiro do Guia MICHELIN" para apps de planejamento - acesso e curado/negociado caso a caso.

## 8. Dados que oferece
- Selo de credibilidade: lista curada de restaurantes com distincao (Estrelas 1-3, Bib Gourmand, Prato MICHELIN, Estrela Verde de sustentabilidade)
- Lista curada de hoteis com Chaves MICHELIN (1-3 Keys) e fichas editoriais
- Ficha por estabelecimento: cozinha, faixa de preco (simbolo $), localizacao, descricao editorial, fotos
- Disponibilidade e tarifa de hotel em tempo real (via Tablet/Booking.com) com possibilidade de reserva
- Botao/deeplink de reserva de restaurante para Resy/OpenTable/TheFork
- Conteudo editorial: artigos, listas tematicas, roteiros gastronomicos por cidade

## 9. Dados que NÃO oferece
- Custo TOTAL de uma viagem (so cobre a despesa de jantar/hotel premium, nao voos, transporte, passeios, seguro)
- API publica de dados de restaurantes (estrelas/avaliacoes) para terceiros
- Roteiro/itinerario de viagem dia-a-dia ou logistica entre cidades
- Comparacao entre DESTINOS (cidade A vs cidade B) - so compara estabelecimentos dentro de um lugar
- Faixa de preco realista de refeicao em numeros (so simbolos $-$$$$, sem ticket medio em moeda)
- Avaliacoes/UGC de usuarios comuns em volume (e curadoria de especialistas, nao reviews da multidao como TripAdvisor/Google)
- Opcoes economicas/mochileiro - foco e premium/fine dining, viesado a grandes capitais
- Voos, carros, atividades, ingressos - nada fora de restaurante + hotel

## 10. Pontos fortes
- Marca de confianca incomparavel - o selo MICHELIN e o padrao-ouro global de credibilidade gastronomica; reduz risco de decisao do viajante instantaneamente
- Curadoria de especialistas (inspetores anonimos) percebida como imparcial - diferencial enorme vs reviews manipulaveis
- Poder de intencao comercial altissima: quem busca um restaurante MICHELIN ou hotel com Chave esta perto da compra e e cliente de alto ticket
- Inventario de hotelaria de luxo proprio (Tablet, ~5.000 hoteis) com programa de perks (Plus) que rivaliza com Virtuoso/Amex FHR
- Expansao para hoteis (2024) criou nova vertical transacional de alta margem alem dos restaurantes
- Ecossistema de parcerias maduro (Resy/OpenTable/TheFork em restaurantes; Booking.com e Fora em hoteis)

## 11. Pontos fracos
- Cobertura estreita e elitista: foco em fine dining e luxo em grandes capitais; ignora a maior parte das viagens reais (custo, midscale, regioes fora do eixo Europa/EUA/Japao)
- Nao resolve a viagem - so o jantar e a cama premium; zero roteirizacao, orcamento total, voos ou logistica
- Dependencia de terceiros no rail de restaurante (Resy/OpenTable/TheFork) - Michelin nao controla a reserva nem captura toda a margem
- Sem API publica de dados do guia - dificil integrar oficialmente; ecossistema fechado/curado
- App com reputacao tecnica fragil (JustUseApp safety score ~33/100; queixas de mapa que nao carrega, erros de servidor, problemas em foldables)
- Critica historica de inconsistencia/vies das estrelas (favorecimento a tecnica europeia, restaurantes nao re-visitados, ratings 'erraticos' em mercados novos)
- Alta taxa de fechamento de restaurantes estrelados (estudo NY: >40% fecharam) gera fichas desatualizadas/quebradas

## 12. Reclamações comuns dos usuários
- App buggy: mapa nao carrega por completo, restaurante 'carrega pra sempre' ao clicar (relatos em App Store/Google Play e em foldables)
- Erros de servidor frequentes: 'Sorry, we encountered issues with the servers response. Please try again later.'
- Bug de login com certos caracteres na senha (corrigido apos reclamacoes)
- Reserva de restaurante MICHELIN e dificil na pratica - mesas esgotam; o Guia so faz deeplink, a dor de conseguir mesa permanece no parceiro
- Percepcao de elitismo/preco - util so para quem gasta alto; pouco valor para o viajante medio
- Questionamento da imparcialidade/consistencia das estrelas (vies regional, criterios opacos)
- JustUseApp safety score baixo (~33/100) apesar de nota alta na loja - desconfianca sobre dados/experiencia
- Plus/Tablet Plus visto como pouco vantajoso para quem ja usa consultor Virtuoso ou programas de fidelidade de rede hoteleira

## 13–19. Limitações
| Eixo | Limitação |
|---|---|
| **UX** | App e site sao orientados a NAVEGACAO/DESCOBERTA de uma lista curada, nao a um fluxo de PLANEJAMENTO. Sem onboarding de perfil, sem montagem de viagem, sem visao de jornada. Reclamacoes recorrentes de lentidao, mapa que nao carrega e erros de servidor minam a experiencia justamente no momento da decisao. Em hoteis ate reserva direto, mas restaurante joga o usuario para fora (Resy/OpenTable/TheFork |
| **Personalização** | Praticamente nula. Nao ha super-perfil do viajante: a curadoria e a mesma para todos (a lista MICHELIN nao muda conforme quem voce e, seu orcamento, restricoes alimentares, estilo de viagem ou companhia). Recomendacao = selo editorial generico, nao recomendacao 1:1. O unico 'personalizado' e o credito/perk do Plus apos a compra, nao na decisao. |
| **IA** | Nao e um produto de IA. E curadoria humana (inspetores) + busca/filtro tradicional. Sem assistente conversacional, sem recomendacao preditiva, sem geracao de roteiro, sem matching semantico entre desejo do usuario e estabelecimento. A inteligencia esta no julgamento humano da marca, nao em software - o que e forte em confianca, mas zero em escala/personalizacao automatizada. |
| **Roteirização** | Inexistente. O Guia nao monta itinerario, nao sequencia dias, nao conecta restaurante + hotel + deslocamento, nao otimiza por geografia/tempo. Entrega pontos isolados num mapa; cabe ao usuario transformar isso em plano. Nao ha 'um dia gastronomico em Lisboa' montado - so a lista. |
| **Orçamento** | Muito limitada. Para restaurantes mostra apenas simbolos de faixa de preco ($ a $$$$), sem ticket medio real em moeda local nem estimativa por pessoa. Para hoteis mostra a tarifa, mas nada de CUSTO TOTAL da viagem (voos, transporte, passeios). Por ser focado em premium, nao serve para quem planeja por orcamento; nao existe 'modo orcamento' nem somatorio de gastos da viagem. |
| **Comparação** | So compara estabelecimentos DENTRO de um destino (restaurante X vs Y na mesma cidade, via filtro). Nao compara DESTINOS entre si (Lisboa vs Bangkok em custo, clima, densidade gastronomica, valor). Nao ha visao de 'para onde ir' - assume que o usuario ja escolheu a cidade. Logo, falha como ferramenta de decisao de destino, que e o topo do funil de viagem. |
| **Integração** | Assimetrica. Hoteis: integraveis via Demand API de parceiro, afiliado CJ (~5%) e conectividade Booking.com - viavel. Restaurantes: SEM API oficial de dados (estrelas/fichas), entao integrar a curadoria gastronomica oficialmente e dificil; a reserva ja pertence a Resy/OpenTable/TheFork. Nao ha self-service para apps de planejamento - acesso e negociado caso a caso. Para nos, integrar 'hoteis MICHEL |

## 20. Oportunidades para superá-lo
- Ele para no 'onde comer/dormir de luxo'; nosso app entrega a viagem inteira - roteiro IA + custo total realista (voos+hotel+comida+passeios), englobando o MICHELIN como uma camada de qualidade dentro de um plano maior
- Ele e elitista e concentrado em capitais; cobrimos todas as faixas de orcamento e destinos, usando o selo MICHELIN so como sinal premium opcional, nao como o produto inteiro
- Restaurante joga o usuario pra fora (Resy/OpenTable/TheFork) e nao tem API; podemos ser a camada de PLANEJAMENTO que orquestra esses parceiros e ainda monetiza o hotel MICHELIN via afiliado CJ (~5%) e Demand API
- Zero personalizacao e zero IA: nosso super-perfil + IA recomendam o restaurante/hotel MICHELIN certo para AQUELE viajante (orcamento, restricao, ocasiao), algo que o Guia generico nunca faz
- App tecnicamente fragil (score ~33/100, mapa que nao carrega): UX rapida e confiavel de planejamento e um diferencial facil
- Sem orcamento real nem ticket medio em moeda: traduzimos '$$$' em valor por pessoa estimado e somamos ao custo total da viagem
- Sem comparacao de destinos: oferecemos 'Lisboa vs Bangkok' por custo/densidade gastronomica MICHELIN, capturando o topo do funil que ele ignora

---

## Matriz (visão Mundo Sem Fim)
| Critério | Avaliação |
|---|---|
| Força principal | Marca de confianca/curadoria gastronomica e de hotelaria de luxo padrao-ouro mundial, com altissima intencao de compra de clientes de alto ticket. |
| Fraqueza principal | Resolve so o jantar e a cama premium em grandes capitais - sem roteiro, sem custo total da viagem, sem personalizacao, sem IA e sem cobertura de orcamento/destino. |
| Modelo de receita | Comissao de hotel (modelo agency ~10-15%) via Tablet Hotels + taxa por reserva de restaurante (~US$1-2) + assinatura Plus (US$99/ano) + patrocinios/licenciamento de marca; tambem paga afiliados via CJ (~5%). |
| Possui API? | Parcial: Demand API de PARCEIRO para hoteis (B2B) + conectividade Booking.com; SEM API publica oficial de dados de restaurantes (estrelas). developer.michelin.com e majoritariamente mobilidade/pneus. |
| Possui afiliados? | Sim, via marca-irma Tablet Hotels na rede CJ Affiliate, ~5% por venda de hotel (cookie ~30-45d, nao divulgado). Nao ha afiliado para reserva de restaurante. |
| Pode virar parceiro? | Sim, mas curado/negociado: trilhos existentes sao afiliado CJ (hoteis), Demand API de parceiro (hoteis B2B) e conectividade Booking.com. Para restaurantes, parceria seria via Resy/OpenTable/TheFork, nao com a Michelin diretamente. |
| Pode pagar comissão? | Sim - paga comissao a afiliados pela Tablet via CJ (~5% por venda de hotel). Nao paga por lead/CPC; so por reserva confirmada (CPA). |
| Pode receber tráfego? | Sim - alvo ideal para mandarmos trafego qualificado de alto ticket (foodies/luxo) e monetizar a reserva de hotel; o selo MICHELIN aumenta conversao e valor medio do pedido. |
| Pode ser integrado? | Parcial: hoteis MICHELIN integraveis via afiliado CJ + Demand API/Booking.com (deeplink e reserva). Dados de restaurantes (estrelas/fichas) sem API oficial - integracao depende de parceria fechada ou fontes nao-oficiais (scraping). |
| **O que precisamos ter p/ superar** | Para superar o que ele faz bem (confianca + descoberta de qualidade premium): (1) camada de curadoria/qualidade que exiba o selo MICHELIN (Estrelas/Keys) como sinal dentro do roteiro, agregando outras fontes (World's 50 Best, Gault&Millau, locais) para nao depender so dele; (2) super-perfil + IA que recomende o estabelecimento MICHELIN certo para o viajante especifico (orcamento, restricao, ocasia |

## Fontes consultadas
- https://guide.michelin.com/us/en/booking-partnership-between-the-michelin-guide-and-resy
- https://guide.michelin.com/us/en/restaurants/online-reservation
- https://skift.com/2018/12/03/michelin-guide-owner-buys-tablet-hotels-to-build-a-travel-business/
- https://www.tablethotels.com/en/michelin-merger
- https://guide.michelin.com/us/en/hotels-stays/test-city/partnerships-demand-api-hotel-12040
- https://developer.michelin.com/en
- https://linkclicky.com/affiliate-program/tablet-hotels/
- https://www.travelpayouts.com/blog/best-hotel-affiliate-program/
- https://www.michelinkeyhotels.com/articles/michelin-guide-plus-membership-review
- https://guide.michelin.com/us/en/member-program/becomeamember
- https://www.travelweekly.com/Travel-News/Hotel-News/Fora-partnership-Tablet-Hotels
- https://www.travelmole.com/news/boutique-hotel-platform-tablet-acquired-by-michelin/
- https://robbreport.com/travel/hotels/michelin-guide-rating-hotels-1235299646/
- https://justuseapp.com/en/app/1541129177/michelin-guide/reviews
- https://apps.apple.com/us/app/the-michelin-guide/id1541129177
- https://play.google.com/store/apps/details?id=com.viamichelin.android.gm21
- https://en.wikipedia.org/wiki/Michelin_Guide
- https://www.cnbc.com/2026/02/25/doordash-resy-opentable-restaurant-reservation-wars.html
- https://hospitalitytech.com/tablet-hotels-announces-new-strategic-initiatives-following-integration-michelin-guide
