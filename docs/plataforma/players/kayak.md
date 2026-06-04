# KAYAK

> **Categoria:** Metabusca de viagens (travel metasearch) com camada de OTA/booking parcial — subsidiaria da Booking Holdings
> _Perfil gerado por pesquisa multiagente (jun/2026). Parte do [Relatório de Mercado](../01-relatorio-de-mercado.md) e da [Matriz Competitiva](../02-matriz-competitiva.md)._

## 1. O que faz
KAYAK e um buscador-comparador (metasearch) que agrega precos de voos, hoteis e carros de centenas de OTAs, companhias aereas e redes hoteleiras, mostrando-os lado a lado e redirecionando o usuario para o site do fornecedor parceiro para finalizar a compra. Nao e um planejador de viagem: e uma maquina de comparacao de preco e intencao de compra. Em 2025-2026 adicionou camada de IA (AI Mode com tecnologia ChatGPT, laboratorio KAYAK.ai e a ferramenta PriceCheck por screenshot) e ja roda como integracao dentro do proprio ChatGPT.

## 2. Público-alvo
Viajante de lazer e negocios em fase de DECISAO DE COMPRA (ja sabe origem/destino/datas e quer o melhor preco), caca-promocoes, viajante frequente sensivel a preco, e tambem desenvolvedores/afiliados/criadores de conteudo de viagem que querem monetizar audiencia. Forte nos EUA e Europa; KAYAK for Business atende gestao de viagens corporativas.

## 3. Funcionalidades principais
- Metabusca de voos, hoteis e carros com comparacao de preco lado a lado de centenas de fornecedores
- Price Alerts / alertas de queda de preco e Price Forecast (previsao de subida/queda)
- Filtros avancados (escalas, companhias, bagagem, horarios, flexibilidade de datas +-3 dias, mapa de precos por destino)
- Explore: busca por orcamento/inspiracao (mostra para onde dá pra ir com X dolares saindo de uma cidade)
- AI Mode (2025): busca conversacional em linguagem natural usando ChatGPT, integrada ao kayak.com
- KAYAK.ai: laboratorio AI-first com pricing em tempo real
- PriceCheck: usuario sobe print de um itinerario de qualquer site e o KAYAK varre centenas de sites pra validar se o preco e bom
- Integracao nativa dentro do ChatGPT (KAYAK como ferramenta de busca de viagem)
- KAYAK for Business (gestao de viagem corporativa) e KAYAK for Agencies
- Trips: organizador basico de itinerario por parsing de e-mails de confirmacao
- App mobile (iOS/Android) com as mesmas buscas

## 4. Como monetiza
- CPC (cost-per-click): principal fonte. Ganha uma taxa cada vez que o usuario clica num resultado e e enviado ao site do parceiro (OTA/cia aerea/hotel). Tarifas de CPC em viagem estao entre as mais altas do digital por causa da alta intencao de compra
- CPA / comissao de referencia: quando o clique vira reserva no parceiro, o KAYAK pode receber comissao por booking
- Publicidade/ads: banners, posicionamentos patrocinados (sponsored listings) e Ads API dentro dos resultados de busca
- Programa de afiliados invertido: o proprio KAYAK opera uma rede de afiliados e divide receita com publishers que mandam trafego (revenue share)
- Modelo hibrido agency vs merchant dentro do guarda-chuva Booking Holdings; receita de agency (que inclui meta) vem declinando enquanto merchant cresce
- KAYAK for Business: receita B2B de gestao de viagem corporativa
- Sinal de alerta financeiro: a Booking Holdings registrou impairment (baixa contabil) por reducao do fluxo de caixa projetado do KAYAK no 3o trimestre de 2025 — indica pressao sobre o modelo de meta/CPC

## 5. Afiliados
SIM — robusto e multi-rede. O KAYAK Affiliate Network (affiliates.kayak.com) e descrito como a primeira rede de afiliados de metasearch de viagem. Promete ate 50% de revenue share sobre cliques, reservas e receita de ads em todas as verticais (voos, hoteis, carros, pacotes). Disponivel por varias redes: programa in-house (paga o CPC cheio, ~US$0,95/clique), CJ/Commission Junction (~US$0,89/clique), Partnerize e Travelpayouts (modelo de 50% revenue share em vez de CPC fixo). Cookie de 30 dias. ~15.000 parceiros afiliados que somam US$76M+/ano. Formatos: deeplinks, search box, whitelabel e APIs.

## 6. API
SIM — APIs de afiliado/parceiro (nao GDS/NDC tradicional, nao API publica aberta). Portal em developers.kayak.com e affiliates.kayak.com/apis. Cinco APIs: Flights, Hotels, Cars, Travel Data (insights/tendencias de mercado) e Ads. Retornam preco e disponibilidade ao vivo de centenas de fornecedores. Ha ambiente Sandbox com dados de teste; producao exige aprovacao do caso de uso como integracao de afiliado e emissao de chaves de producao, com acompanhamento de account management. A API e voltada a MONETIZACAO (referir trafego e ganhar comissao), nao a emissao/booking direto fora do ecossistema KAYAK.

## 7. Programa de parceiros
Tres trilhas: (1) KAYAK Affiliate Network para publishers/criadores/apps que mandam trafego (deeplinks, search box, whitelabel, APIs) com rev-share/CPC; (2) Programa de parceiros de oferta para OTAs e fornecedores diretos que querem aparecer com seus precos nos resultados de metasearch (modelo CPC/leilao); (3) KAYAK for Business / KAYAK for Agencies no lado B2B. Aprovacao por formulario descrevendo o negocio e o caso de uso.

## 8. Dados que oferece
- Preco e disponibilidade ao vivo de voos, hoteis e carros de centenas de fornecedores (via API e site)
- Comparacao de preco lado a lado entre OTAs/fornecedores para o MESMO produto
- Price Forecast / tendencia de preco (sobe ou desce) e alertas de queda
- Travel Data API: insights e tendencias de mercado de viagem agregados
- Deeplinks para checkout do parceiro e search boxes/whitelabel embutiveis
- Inventario amplo (5M+ hoteis/propriedades citados) e bilhoes de buscas anuais
- Resultados via integracao em ChatGPT e via AI Mode em linguagem natural

## 9. Dados que NÃO oferece
- Roteiro dia-a-dia / itinerario estruturado por atividades (nao planeja a viagem, so compara o transporte/hospedagem)
- Custo TOTAL realista da viagem (nao soma comida, ingressos, transporte local, passeios, seguro, cambio — so o preco do voo/hotel/carro isolado)
- Comparacao de DESTINOS por adequacao ao perfil (compara precos de uma rota, nao 'Peru vs Tailandia para o meu tipo de viagem')
- Super-perfil persistente do viajante (preferencias, estilo, restricoes que personalizem recomendacoes ao longo do tempo)
- Conteudo curatorial de o-que-fazer / experiencias locais com profundidade
- Transparencia de preco final antes do redirect (taxas, bagagem e regras frequentemente so aparecem no site do terceiro)
- Atendimento/pos-venda da reserva (a compra acontece no parceiro; KAYAK nao assume o suporte)

## 10. Pontos fortes
- Marca global e topo de funil de altissima intencao de compra — bilhoes de buscas/ano
- Inventario gigantesco e comparacao de preco muito confiavel para voo/hotel/carro (forca central do meta)
- Pertence a Booking Holdings (~US$26,9B de receita em 2025), com escala, dados e poder de barganha enormes
- Programa de afiliados e APIs maduros e multi-rede — facil de integrar e monetizar (in-house, CJ, Partnerize, Travelpayouts)
- Pioneiro em IA aplicada a viagem: ChatGPT plugin (2023), AI Mode, KAYAK.ai, PriceCheck e integracao nativa no ChatGPT
- Ferramentas de inteligencia de preco (Forecast, Price Alerts, PriceCheck) que reforcam o angulo 'melhor preco'

## 11. Pontos fracos
- E comparador de PRECO, nao planejador — para no clique e empurra a decisao/risco pro terceiro
- Dependencia de qualidade de terceiros: muitos redirects para OTAs de baixa reputacao geram experiencia ruim que respinga na marca
- Precos exibidos frequentemente NAO batem com o preco final no parceiro (bagagem, taxas, cambio) — percepcao de isca
- Receita de meta/CPC sob pressao (impairment registrado pela Booking Holdings em Q3/2025)
- Camada de IA ainda em fase de teste/rollout (AI Mode so EUA), longe de planejamento de roteiro de verdade
- Nao captura valor do meio do funil (planejamento, inspiracao por perfil, custo total) — so a ponta transacional

## 12. Reclamações comuns dos usuários
- Bait-and-switch de preco: preco anunciado sobe muito ao ser redirecionado ao terceiro; alertas de 'melhor oferta' que na pratica saem bem mais caros
- Informacao de voo imprecisa: bagagem de mao mostrada como inclusa nos resultados quando nao esta
- Redireciona para empresas terceiras mal-avaliadas/golpistas (relatos citando Flight Mover como site que coleta dados pessoais, e Underpricer com praticas ruins) — usuarios alertados a 'fazer sua propria pesquisa'
- Atendimento ao cliente apontado como inutil: empurra o problema para o parceiro, que tambem nao resolve; dificuldade enorme com reembolso
- Reservas/carros que somem ou sao cancelados sem aviso, forcando rebooking mais caro de ultima hora
- Termos de cancelamento de aluguel de carro que viram 'nao reembolsavel' logo apos o pagamento
- Cobrancas inesperadas e taxas ocultas que so aparecem no checkout do terceiro

## 13–19. Limitações
| Eixo | Limitação |
|---|---|
| **UX** | A UX e densa e orientada a resultados de busca (listas, filtros, tabelas de preco) — otima para quem ja sabe o que quer, ruim para quem esta indeciso ou planejando. O fluxo termina abruptamente no redirect para um site de terceiro com visual e padroes totalmente diferentes, quebrando a experiencia e a confianca. AI Mode suaviza a entrada (linguagem natural) mas ainda desemboca na mesma lista trans |
| **Personalização** | Personalizacao fraca e efemera. Nao existe super-perfil persistente do viajante (estilo, ritmo, restricoes alimentares, tolerancia a risco, com quem viaja). As recomendacoes sao funcao da query do momento, nao do historico/identidade do usuario. Sem memoria de longo prazo que melhore a recomendacao a cada viagem. |
| **IA** | A IA (AI Mode/KAYAK.ai/integracao ChatGPT) e essencialmente uma camada conversacional sobre a MESMA metabusca de preco — resolve 'me ache um voo barato' melhor, mas nao planeja a viagem, nao monta roteiro com logica de tempo/deslocamento, nem raciocina sobre custo total ou adequacao de destino ao perfil. Ainda em rollout limitado (AI Mode so nos EUA) e posicionado como 'test lab', nao produto madu |
| **Roteirização** | Nao faz roteirizacao. Nao gera itinerario dia-a-dia, nao sequencia atividades por proximidade/horario, nao equilibra deslocamentos, nao sugere o-que-fazer no destino. O 'Trips' apenas organiza confirmacoes de reserva ja feitas (parsing de e-mail), nao constroi o plano da viagem. |
| **Orçamento** | So calcula o preco isolado de voo/hotel/carro. Nao estima o CUSTO TOTAL realista da viagem (alimentacao, ingressos, transporte local, passeios, seguro, gorjetas, cambio, imprevistos). O usuario sai do KAYAK sem saber quanto a viagem inteira vai custar — apenas quanto custa a passagem ou a diaria, e mesmo esse numero muda no checkout do terceiro. |
| **Comparação** | Compara PRECO do MESMO produto entre vendedores (qual OTA vende o voo X mais barato). NAO compara DESTINOS entre si por adequacao (Peru vs Tailandia para um casal aventureiro com 10 dias e orcamento Y), nem custo-de-vida no destino, nem trade-offs de experiencia. O 'Explore' chega perto (para onde vou com X dolares) mas e inspiracao por preco de passagem, nao decisao multifator entre destinos. |
| **Integração** | Integracao tecnica e facil pelo nosso lado (APIs de Flights/Hotels/Cars/Travel Data/Ads com sandbox, deeplinks, search box, whitelabel e multiplas redes de afiliado). A limitacao e de PROFUNDIDADE e CONTROLE: a API serve para referir trafego e monetizar, nao para emitir/gerenciar a reserva dentro do nosso app nem para customizar a experiencia de checkout — o usuario sempre 'vaza' para o ambiente d |

## 20. Oportunidades para superá-lo
- Eles param no preco do voo/hotel; nos entregamos o CUSTO TOTAL realista da viagem (com comida, passeios, transporte local, cambio) — fechamos a lacuna de orcamento que mais gera frustracao
- Eles comparam vendedores do mesmo produto; nos comparamos DESTINOS por adequacao ao perfil e custo total — decisao de 'para onde ir', nao so 'onde comprar'
- Eles nao tem super-perfil persistente; nosso app aprende o viajante e personaliza roteiro e recomendacoes a cada viagem
- Eles nao roteirizam; nos montamos itinerario dia-a-dia coerente (tempo, deslocamento, o-que-fazer) — e so no fim mandamos o trafego de alta intencao pro KAYAK pra fechar voo/hotel via afiliado
- Bait-and-switch e redirect para terceiros ruins corroem confianca; nos podemos ser a camada de confianca/curadoria que valida e contextualiza o preco antes do redirect
- Eles sao topo de funil transacional; nos ocupamos o MEIO do funil (planejamento, inspiracao, decisao) que o KAYAK nao monetiza — e capturamos o usuario antes dele, virando a fonte de trafego qualificado

---

## Matriz (visão Mundo Sem Fim)
| Critério | Avaliação |
|---|---|
| Força principal | Metabusca de preco de voo/hotel/carro em escala global, com altissima intencao de compra, inventario gigante e marca/financas da Booking Holdings por tras. |
| Fraqueza principal | Para no preco e empurra a decisao e o risco para terceiros (muitos de baixa reputacao); nao planeja a viagem, nao calcula custo total, nao personaliza por perfil — e a percepcao de bait-and-switch corroi a confianca. |
| Modelo de receita | CPC/CPA (clique e comissao por reserva no parceiro) + ads/sponsored + revenue share de afiliados + B2B (KAYAK for Business). Receita de meta sob pressao (impairment na Booking Holdings em Q3/2025). |
| Possui API? | Sim — APIs de afiliado/parceiro (Flights, Hotels, Cars, Travel Data, Ads) com Sandbox e aprovacao de caso de uso. Nao e GDS/NDC nem API aberta; serve para referir trafego e monetizar, nao para booking dentro do nosso app. |
| Possui afiliados? | Sim — KAYAK Affiliate Network multi-rede: in-house (~US$0,95/clique), CJ (~US$0,89/clique), Partnerize e Travelpayouts (50% revenue share). Cookie 30 dias. Formatos: deeplink, search box, whitelabel, API. |
| Pode virar parceiro? | Sim — via KAYAK Affiliate Network (in-house, CJ, Partnerize ou Travelpayouts), aprovando nosso app como integracao de afiliado e pegando chaves de producao das APIs. Caminho rapido e documentado. |
| Pode pagar comissão? | Sim — para NOS (somos publisher/afiliado). KAYAK paga a NOS por clique (CPC ~US$0,89-0,95) ou rev-share de ate 50% quando mandamos trafego/leads de alta intencao para fechar voo/hotel/carro. |
| Pode receber tráfego? | Sim — somos a ponta ideal de envio: no fim do planejamento/decisao no nosso app, despachamos o usuario ja decidido pro KAYAK fechar voo/hotel/carro, monetizando via afiliado. |
| Pode ser integrado? | Parcial — integravel via API de afiliado, deeplink, search box ou whitelabel para preco/disponibilidade ao vivo e redirect monetizado. Nao integravel para emitir/gerenciar a reserva dentro do nosso app (o booking 'vaza' pro KAYAK/terceiro). |
| **O que precisamos ter p/ superar** | Metabusca de preco de voo/hotel/carro tao confiavel e rapida quanto a deles DENTRO do nosso fluxo (consumindo a API/afiliado do proprio KAYAK e de outros), com transparencia de preco final/taxas/bagagem que eles falham em dar, alertas/forecast de preco, e tudo isso costurado ao roteiro IA + custo total + comparacao de destinos + super-perfil — para sermos o cerebro de planejamento que termina no m |

## Fontes consultadas
- https://miracuves.com/blog/kayak-revenue-model/
- https://fourweekmba.com/how-does-kayak-make-money/
- https://productmint.com/the-kayak-business-model-how-does-kayak-make-money/
- https://affiliates.kayak.com/
- https://affiliates.kayak.com/apis
- https://developers.kayak.com/
- https://help.affiliates.kayak.com/article/812-do-you-offer-an-api
- https://odiproductions.com/blog/kayak-affiliate-program
- https://www.travelpayouts.com/blog/best-travel-affiliate-programs-and-networks/
- https://commissiondex.com/benchmark/kayak/
- https://www.trustpilot.com/review/kayak.com
- https://www.consumeraffairs.com/travel/kayakcom.html
- https://skift.com/2025/05/28/can-kayak-ai-solve-travels-complex-problems-heres-how-it-works/
- https://skift.com/2025/10/15/kayak-ai-mode-natural-language-search/
- https://www.kayak.com/news/kayak-chatgpt/
- https://dataconomy.com/2025/10/17/kayak-adds-built-in-ai-mode-for-trip-planning-using-chatgpt/
- https://www.sec.gov/Archives/edgar/data/0001075531/000107553125000051/bkng-20250930.htm
