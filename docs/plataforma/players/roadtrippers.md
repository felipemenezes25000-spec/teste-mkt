# Roadtrippers

> **Categoria:** Planejador de road trip (rota multi-parada + descoberta de POIs) para carro e RV, focado em EUA e Canada
> _Perfil gerado por pesquisa multiagente (jun/2026). Parte do [Relatório de Mercado](../01-relatorio-de-mercado.md) e da [Matriz Competitiva](../02-matriz-competitiva.md)._

## 1. O que faz
Roadtrippers e um planejador de viagens de carro/RV que monta rotas multi-parada num mapa e sugere pontos de interesse ao longo do caminho (atracoes, restaurantes, miradouros, campgrounds, hoteis). Em 2026 o nucleo do produto e o "Autopilot", um planejador de roteiro com IA que monta um itinerario em menos de 2 minutos cruzando ~38 milhoes de viagens reais com uma base proprietaria de 4,5+ milhoes de POIs. Pertence ao grupo Roadpass Digital (junto com Campendium, Togo RV, RVillage, Overnight RV Parking), controlado pela Graham Allen Partners.

## 2. Público-alvo
Viajantes de carro e, fortemente, donos de RV/trailer e campistas nos EUA e Canada. Perfil "road trip domestica norte-americana" (familias, aposentados RVers, nomades, casais em viagem de estrada). Pouca aderencia a viagem internacional, voo ou cidade unica.

## 3. Funcionalidades principais
- Construtor de rota multi-parada no mapa (waypoints) com calculo de distancia/tempo/combustivel
- Autopilot: roteiro gerado por IA a partir de poucas perguntas (veiculo, companhia, orcamento por comer/dormir/atividades)
- Base de 4,5M+ POIs (atracoes, diners, parques, miradouros, postos)
- 150.000+ avaliacoes de campgrounds integradas via Campendium (forte para RV)
- Meta-search de hoteis exibindo precos de varios provedores ao longo da rota
- Mapas offline (planos pagos)
- Roteirizacao especifica para RV (altura/peso/tipo de rig, evitar estradas problematicas)
- Compartilhamento e colaboracao de itinerarios
- App iOS/Android + web; navegacao turn-by-turn basica no app
- Roadtrippers for Business: planejador embutivel/co-branded para tourism boards e marcas de RV

## 4. Como monetiza
- Assinatura em multiplos tiers (principal fonte): Free (3 rotas/mes, 7 paradas, com anuncios), Basic ~US$35,99/ano (20 paradas), Pro ~US$49,99/ano (50 paradas), Premium ~US$59,99/ano (150 paradas + Autopilot). Trial de 7 dias
- Anuncios/exibicao na versao gratuita
- Comissao/meta-search de hospedagem: exibe precos de varios provedores de hotel/campground e monetiza o redirecionamento (afiliado), nao e merchant nem agencia
- Conteudo patrocinado e parcerias com tourism boards, destinos e marcas (ex.: fabricantes de RV, Thor Industries no historico do grupo)
- Licenciamento B2B do planejador (Roadtrippers for Business) para parceiros

## 5. Afiliados
Sim. Programa proprio operado via Rakuten Advertising (a rede esta migrando o tracking/pagamentos para a tecnologia da impact.com ao longo de 2026, no acordo Rakuten x impact.com). A comissao e baixa e atrela-se a venda da ASSINATURA, nao a inventario de viagem: tipicamente ~US$5 a US$7 por nova adesao Plus/Premium referida (algumas fontes citam ~6,55%). Janela de cookie na faixa padrao (~30 dias). Material de afiliado disponivel; contato via partnerships@roadpass.com.

## 6. API
Sem API publica de consumo. Nao expoe inventario nem POIs via API aberta para terceiros. O que existe e B2B/parceria: "Roadtrippers for Business" oferece um planejador de viagem embutivel/white-label e integracoes para tourism boards e marcas de RV. Para hospedagem usa meta-search (consome feeds de provedores), mas nao publica uma API de afiliado consumivel por outros apps. Nao e GDS/NDC.

## 7. Programa de parceiros
Dois trilhos: (1) Afiliados/creators (via Rakuten) para indicar assinaturas Plus/Premium, com material pronto e payout fixo baixo por adesao; (2) Parcerias B2B/comerciais (partnerships@roadpass.com / business.roadtrippers.com) com tourism boards, destinos, fabricantes de RV e operadores, incluindo conteudo patrocinado, listagens e o planejador co-branded. Faz parte do ecossistema Roadpass Digital, o que permite cross-promo entre Campendium, Togo RV, RVillage.

## 8. Dados que oferece
- Rotas multi-parada otimizadas para carro e RV (distancia, tempo, combustivel estimado)
- Base massiva e curada de POIs ao longo da estrada (4,5M+), com forte profundidade em atracoes de beira de estrada nos EUA/Canada
- Dados de campground de alta qualidade (Campendium): 150k+ reviews, tipos de acampamento, RV parks, free/dispersed camping
- Precos de hospedagem via meta-search ao longo da rota
- Roteiro pronto gerado por IA (Autopilot) com itinerario dia a dia
- Mapas offline e perfis de veiculo/rig para roteirizacao

## 9. Dados que NÃO oferece
- Voos / inventario aereo (nenhuma cobertura)
- Custo TOTAL realista da viagem (so estima combustivel; nao soma hospedagem real + comida + atividades + pedagios num orcamento fechado)
- Comparacao entre DESTINOS (e route-first, nao decide 'Peru vs Tailandia')
- Cobertura internacional robusta (POIs e dados ricos sao EUA/Canada-centricos; resto do mundo e fraco)
- Reserva transacional real (e meta-search/redirect, nao fecha booking de hotel/voo dentro do app)
- Super-perfil persistente e rico do viajante (Autopilot pergunta o basico por sessao, sem memoria profunda multi-viagem)
- Transporte publico, trem, city-break sem carro
- Cambio/precos em moeda local e contexto de viagem fora dos EUA

## 10. Pontos fortes
- Lider de mercado e marca dominante em road trip nos EUA/Canada (#1 da categoria, 38M+ viagens planejadas)
- Base de POIs e de campgrounds (Campendium) dificilmente replicavel: dado proprietario + reviews
- Nicho RV defensavel e monetizavel (ecossistema Roadpass Digital inteiro voltado a RVers)
- Autopilot entrega um 'primeiro rascunho' de roteiro rapido e util para quem nao quer pesquisar
- UX de mapa/rota madura e reconhecida; mobile bem estabelecido
- Multiplos tiers de preco capturam disposicao a pagar diferente (US$36 a US$60/ano)

## 11. Pontos fracos
- Versao gratuita muito limitada (3 rotas/mes, so 7 paradas das quais 2 sao origem/destino = 5 reais) e cheia de anuncios
- Dados de POI desatualizados: usuarios relatam que ate ~2/3 dos negocios mostrados ja fecharam
- Monetizacao de afiliado fraca por adesao (US$5-7); depende de assinatura barata, nao de comissao de viagem
- Sem voos, sem orcamento total, sem comparacao de destinos: e planejador de rota, nao de DECISAO de viagem
- Cobertura essencialmente EUA/Canada; quase inutil para viagem internacional/Brasil
- Navegacao in-app inferior a Google Maps/Waze
- Backlash do redesign com IA: parte da base achou que o Autopilot 'estragou' a exploracao livre que amavam
- Praticas de cobranca/auto-renovacao geram reclamacao e dano de reputacao

## 12. Reclamações comuns dos usuários
- Auto-renovacao ativada por padrao, sem lembrete claro; cobrancas inesperadas e recusa de reembolso ('paguei US$60 e nao consegui usar, sem reembolso')
- Cobranca de renovacao em 2026 mesmo apos cancelamento em 2025, sem resposta do suporte
- Dados desatualizados: muitos POIs fechados/realocados ainda aparecem; info de horario/contato defasada
- 'A IA estragou uma coisa otima' - perda da funcao de explorar livremente a area ao redor apos o redesign do Autopilot
- Free version enganosa: prometem 7 paradas mas so da pra usar 5; sensacao de que US$30+/ano nao vale vs Google + TripAdvisor de graca
- Suporte ruim/dificil de contatar: formulario de feedback quebrado, sem email/telefone visivel
- Navegacao do app pior que apps dedicados de GPS

## 13–19. Limitações
| Eixo | Limitação |
|---|---|
| **UX** | Free tier hostil (3 rotas/mes, 5 paradas uteis, muitos anuncios) empurra o usuario pro paywall cedo demais. O redesign de 2024-2025 que colocou o Autopilot no centro irritou parte da base que perdeu a exploracao livre do mapa. Navegacao turn-by-turn fraca obriga a saltar pro Google Maps, quebrando o fluxo. Suporte e cancelamento sao pontos de atrito notorios. |
| **Personalização** | Autopilot pergunta o basico por sessao (veiculo, companhia, orcamento grosso por comer/dormir/atividade), mas nao mantem um super-perfil persistente do viajante entre viagens. Nao aprende estilo, ritmo, restricoes alimentares, mobilidade, preferencias de tipo de atracao ou historico. Personalizacao e rasa e efemera, presa ao caso de uso 'road trip de carro/RV'. |
| **IA** | A IA (Autopilot) e boa em route-first dentro dos EUA/Canada usando dado proprietario, mas e estreita: nao raciocina sobre escolha de destino, nao compara opcoes de viagem, nao monta orcamento total realista e nao lida com viagem internacional/aerea. E um gerador de itinerario de estrada, nao um copiloto de decisao. Parte dos usuarios reclamou que a IA reduziu o controle manual que tinham antes. |
| **Roteirização** | Excelente em rota multi-parada de carro/RV; pessimo fora disso. Nao roteiriza viagem com voos, trem, transporte publico, hopping entre paises ou city-break sem carro. Otimiza por estrada/combustivel, nao por melhor uso de tempo+dinheiro de uma viagem completa porta a porta. Roteiro = sequencia de paradas no mapa, nao um plano de viagem multimodal com logistica de chegada. |
| **Orçamento** | So estima combustivel da rota. Nao entrega CUSTO TOTAL fechado da viagem: nao soma hospedagem real + alimentacao + atracoes + pedagios + voo num numero confiavel, nem mostra cenarios (econômico/conforto). O 'orcamento' do Autopilot e um input qualitativo para filtrar sugestoes, nao um output financeiro realista que ajude o usuario a decidir se a viagem cabe no bolso. |
| **Comparação** | Nao existe comparacao de DESTINOS. O produto e route-first: voce ja decidiu 'de X para Y' e ele preenche o meio. Nao responde 'Peru vs Tailandia vs Portugal' por custo total, clima, epoca, perfil. Tambem nao compara hospedagem de forma estruturada alem do meta-search pontual de hotel ao longo da rota. |
| **Integração** | Sem API publica para terceiros plugarem POIs/rotas/Autopilot. Integracao so via afiliado de assinatura (Rakuten, payout baixo) ou parceria B2B negociada (white-label/embed, conteudo patrocinado). Hospedagem e meta-search redirect, sem booking transacional nem feed de afiliado consumivel por outro app. Para um terceiro, a unica monetizacao facil e mandar trafego e ganhar US$5-7 por assinante, o que |

## 20. Oportunidades para superá-lo
- Cobrir o que ele ignora: escolha e COMPARACAO de destinos por custo total + perfil (ele so faz o meio do caminho de uma rota ja decidida)
- Orcamento TOTAL realista (hospedagem+comida+atracoes+transporte+voo) vs o 'so combustivel' dele
- Internacional/Brasil de verdade, onde a base EUA/Canada-centrica do Roadtrippers nao serve
- Super-perfil persistente do viajante (memoria multi-viagem) contra a personalizacao efemera por sessao do Autopilot
- Dados sempre frescos / validacao de POI aberto-fechado, atacando a reclamacao cronica de info desatualizada
- Multimodal (voo+trem+publico), nao so carro/RV
- Transparencia de cobranca e cancelamento como diferencial de confianca contra o atrito de auto-renovacao dele
- Booking real/comissao de viagem (hotel/voo/tour) em vez de depender de afiliado de assinatura barata

---

## Matriz (visão Mundo Sem Fim)
| Critério | Avaliação |
|---|---|
| Força principal | Dado proprietario insubstituivel (4,5M+ POIs de estrada + 150k reviews de campground via Campendium) e marca #1 de road trip nos EUA/Canada, ancorada no nicho RV do ecossistema Roadpass Digital. |
| Fraqueza principal | E planejador de ROTA, nao de DECISAO de viagem: sem voos, sem custo total realista, sem comparacao de destinos, EUA/Canada-centrico e com dados de POI frequentemente desatualizados. |
| Modelo de receita | Assinatura multi-tier (US$36-60/ano) como motor principal + anuncios no free + meta-search/afiliado de hospedagem + conteudo patrocinado e parcerias B2B/tourism boards. |
| Possui API? | Parcial/Nao - sem API publica de consumo; so B2B/white-label negociado (Roadtrippers for Business) e meta-search interno de hotel. Nao e GDS/NDC. |
| Possui afiliados? | Sim - via Rakuten Advertising (migrando para tecnologia impact.com em 2026); paga ~US$5-7 por adesao Plus/Premium, janela ~30 dias. Comissao de assinatura, nao de viagem. |
| Pode virar parceiro? | Sim, mas como complemento de nicho: parceria B2B (embed/co-branded para road trip de carro/RV nos EUA) ou consumo de conteudo de campground. Pouco util pra viagem internacional/aerea do nosso publico. |
| Pode pagar comissão? | Sim, porem baixo e so sobre assinatura propria (~US$5-7/adesao via Rakuten/impact.com). Nao paga comissao sobre inventario de viagem; ROI de mandar trafego pra ele e fraco. |
| Pode receber tráfego? | Sim - faz sentido mandar pra ele usuarios que ja decidiram fazer uma road trip de carro/RV nos EUA/Canada e querem o melhor mapa de paradas e campgrounds. Fora desse caso, nao. |
| Pode ser integrado? | Parcial - via afiliado (Rakuten/impact.com) para monetizar adesoes e, no maximo, deeplink para o planejador; integracao profunda de dados/Autopilot exige acordo B2B, pois nao ha API publica. |
| **O que precisamos ter p/ superar** | Para superar onde ele e bom: (1) qualidade de POI igual ou melhor MAS sempre fresca (validacao aberto/fechado), (2) roteirizacao de estrada com perfil de veiculo competitiva, (3) dados de camping/RV via parceria (ate o proprio Campendium) onde nao formos fortes, e (4) UX de mapa madura. Tudo isso embrulhado no que ele NAO tem: comparacao de destinos, custo total realista, super-perfil persistente, |

## Fontes consultadas
- https://www.upperinc.com/reviews/roadtrippers-reviews/
- https://www.wandrly.app/reviews/roadtrippers
- https://roadtrippers.com/membership/
- https://roadtrippers.com/affiliate/
- https://roadtrippers.com/partnerships/
- https://getlasso.co/affiliate/roadtrippers-com/
- https://www.shopper.com/partnerships/roadtrippers-com-affiliate-program
- https://www.rakuten.com/roadtrippers.com
- https://www.amnavigator.com/blog/2026/05/04/impact-rakuten-alliance-affiliate-marketing/
- https://roadtrippers.com/media-center/new-ai-trip-planner-autopilot/
- https://www.accessnewswire.com/newsroom/en/travel/roadtrippers-supercharges-autopilottm-the-ai-trip-planner-you-loved-now-smarter-than-ever-1018273
- https://support.roadtrippers.com/hc/en-us/articles/24995143275412-Using-Autopilot-to-Plan-a-Trip
- https://www.trustpilot.com/review/www.roadtrippers.com
- https://justuseapp.com/en/app/944060491/roadtrippers-trip-planner/reviews
- https://rvbusiness.com/thor-industries-to-sell-majority-interest-of-roadpass-digital/
- https://rvbusiness.com/togo-group-continues-growth-with-campendium-acquisition/
- https://en.wikipedia.org/wiki/Roadtrippers
- http://business.roadtrippers.com/
- https://play.google.com/store/apps/details?id=com.roadtrippers
