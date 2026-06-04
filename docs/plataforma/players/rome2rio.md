# Rome2Rio

> **Categoria:** Roteamento multimodal / Motor de busca e planejamento de transporte ponta-a-ponta (door-to-door)
> _Perfil gerado por pesquisa multiagente (jun/2026). Parte do [Relatório de Mercado](../01-relatorio-de-mercado.md) e da [Matriz Competitiva](../02-matriz-competitiva.md)._

## 1. O que faz
Rome2Rio e um motor de busca de transporte multimodal "ponta-a-ponta": o usuario digita origem e destino (de cidade, endereco, aeroporto ou ponto de interesse) e ele calcula TODAS as combinacoes possiveis de voo, trem, onibus, ferry, carro e ate caminhada, com tempo estimado, distancia e faixa de preco de cada trecho. Nao vende nem emite passagens diretamente: e um agregador que mostra as rotas e redireciona o usuario para parceiros (Omio, Booking.com, Expedia, FlixBus, Trenitalia, Rentalcars etc.) para concluir a reserva, ganhando comissao de afiliado nesse clique. Pertence ao Omio Group desde 2019.

## 2. Público-alvo
Viajantes independentes (FIT), mochileiros, nomades digitais, turistas internacionais e estudantes que precisam descobrir "como ir do ponto A ao ponto B" em regioes/paises desconhecidos, principalmente em transporte terrestre intra e inter-cidades onde o Google Flights/Skyscanner nao ajudam. Tambem atende, como clientes B2B, operadores de transporte, OTAs, DMOs (orgaos de marketing de destino) e portais de viagem que licenciam a API/White Label ou compram publicidade.

## 3. Funcionalidades principais
- Busca door-to-door multimodal combinando voo, trem, onibus, ferry, carro compartilhado, taxi e caminhada num unico resultado
- Cobertura global declarada de 240+ paises/territorios, 10M+ de locais e 20 mil+ operadores de transporte (FlixBus, Trenitalia, Amtrak, Renfe, SNCF, Japan Rail, Greyhound, Blue Star Ferries etc.)
- Estimativa de tempo, distancia e faixa de preco para cada combinacao de rota, inclusive trechos sem reserva online
- Mapa com tracado da rota e visualizacao dos trechos
- Deep-links de reserva para parceiros (Omio para trens/onibus, Booking.com para hoteis, Rentalcars para carros, OTAs de voo)
- Informacoes praticas por trecho: frequencia, operadores, estacoes/terminais
- App mobile (iOS/Android) e versao web
- API de parceiro e solucao White Label embutivel para terceiros
- Plataforma de publicidade nativa/patrocinada para DMOs e parceiros de transporte e hospedagem

## 4. Como monetiza
- Comissao de afiliado por click-through: principal fonte de receita; ganha quando o usuario clica e reserva num parceiro (modelo agency/referencia, NAO merchant de registro na maioria dos bilhetes)
- Comissao/markup via Omio: como faz parte do Omio Group, muitas reservas de trem/onibus passam pelo ticketing do proprio Omio, internalizando a margem; usuarios relatam preco final ate ~15% acima do balcao (ex.: bilhete austriaco de EUR 12,50 saindo por EUR 35)
- Booking fee (taxa de servico) sobre algumas reservas concluidas no fluxo
- Publicidade: aposta estrategica forte para 2026 - anuncios nativos/patrocinados e inspiracionais para DMOs, transporte e hospedagem; empresa declara meta de TRIPLICAR a receita de ads ate o fim de 2026, migrando de programatico para integrado/nativo
- Licenciamento da API e do White Label (taxas por volume de requisicoes + nivel de customizacao) e listagens premium/destaque para parceiros

## 5. Afiliados
Nao opera um programa de afiliados publico de auto-cadastro nas grandes redes (nao esta em Awin/CJ/Impact/Partnerize/Travelpayouts como anunciante para criadores afiliarem). O fluxo e o INVERSO: Rome2Rio e o AFILIADO/publisher que monetiza enviando trafego aos parceiros de reserva (Omio, Booking.com, Expedia, Despegar, Rentalcars, FlixBus, Skyscanner) e embolsa a comissao. Para terceiros, a unica via "tipo afiliado" e o programa de Partner/White Label (free-dashboard.rome2rio.com), onde o parceiro customiza os booking links e ganha receita das proprias relacoes de afiliado - ou seja, monetizacao via licenca/white-label, nao via rede de afiliados aberta. Comissao tipica nao e divulgada publicamente.

## 6. API
Sim, mas API de PARCEIRO (paga, sob contrato), nao API publica de afiliado nem GDS/NDC. E a Search API de roteamento multimodal (retorna rotas, modos, operadores, tempos e faixas de preco) - documentada em rome2rio.com/documentation. Caracteristicas-chave: (1) e SEARCH/ROUTING ONLY - explicitamente "nao tem capacidade de booking", so retorna as opcoes e deep-links; (2) precificacao por volume de requisicoes + grau de customizacao; (3) recomendam comecar pelo White Label embutivel antes da API pura. Nao expoe emissao/ticketing nem inventario transacional proprio.

## 7. Programa de parceiros
Programa de Parceiros formal via Rome2rio Partner Services (free-dashboard.rome2rio.com) com dois produtos: (1) White Label - busca multimodal embutivel "plug-and-play" no site/app do parceiro (airlines, OTAs, agencias), deploy rapido para prova de conceito; (2) Partner API - integracao mais profunda dos dados de roteamento. Ambos permitem ao parceiro customizar booking links e ganhar receita das proprias relacoes de afiliado. Acima disso ha o canal de Advertising/Partnerships para DMOs e operadores (publicidade nativa, listagens patrocinadas, destaque), area em forte expansao para 2026.

## 8. Dados que oferece
- Rotas multimodais door-to-door entre quaisquer dois pontos do mundo (a grande forca exclusiva)
- Combinacoes voo+trem+onibus+ferry+carro+caminhada num so resultado
- Tempo de viagem, distancia e faixa de preco estimada por trecho e por rota total
- Operadores que cobrem cada trecho e suas estacoes/terminais
- Cobertura de transporte terrestre/regional obscuro que Skyscanner/Google Flights ignoram
- Deep-links de reserva para parceiros (transporte, hotel, carro)
- Frequencia/horarios aproximados de servicos
- Acesso programatico a esses dados de roteamento via Partner API/White Label

## 9. Dados que NÃO oferece
- Roteiro de viagem dia-a-dia (o que fazer, atracoes, sequencia de passeios) - nao e um itinerary planner
- Custo TOTAL realista da viagem (hospedagem+comida+passeios+transporte local somados) - so estima transporte
- Recomendacao/comparacao de DESTINOS (nao ajuda a decidir 'Peru x Tailandia')
- Personalizacao por perfil do viajante (estilo, orcamento, ritmo, interesses)
- Camada de IA conversacional/recomendacao inteligente real
- Preco final garantido e estavel - valores sao estimativas de terceiros, frequentemente desatualizados
- Emissao/ticketing proprio, gestao de reserva, remarcacao ou reembolso (nao e merchant na maioria dos casos)
- Conteudo editorial profundo de destino (clima, seguranca, vistos, cultura)
- Inventario transacional via API (a API nao reserva)

## 10. Pontos fortes
- Cobertura multimodal global incomparavel - resolve transporte terrestre/regional que nenhum concorrente mainstream cobre bem (240+ paises, 20 mil+ operadores)
- Proposta unica e clara: 'como chego de qualquer lugar a qualquer lugar' em um clique
- Marca consolidada e enorme volume - 600M+ de visitantes/ano, autoridade e SEO fortes em buscas de rota
- Sinergia com Omio Group: inventario de trens/onibus europeus bookavel e integrado
- Excelente para descoberta e fase de pesquisa de logistica da viagem
- Modelo asset-light e resiliente (apelidado de 'cockroach' por sobreviver bem), agora com nova alavanca de receita em publicidade
- Oferta B2B madura (API + White Label + Ads) que ja monetiza parceiros e DMOs

## 11. Pontos fracos
- Precos frequentemente imprecisos e inflados vs comprar direto no operador (ex.: EUR 12,50 -> EUR 35; percepcao de markup ~15%)
- Nao e merchant de registro: pos-venda (reembolso, remarcacao, problema) e empurrado ao parceiro, gerando atrito e frustracao
- Ferramenta de busca, nao de planejamento - para no 'como ir', nao ajuda a decidir o que/onde/quanto
- Horarios e mapas com inexatidoes relatadas (servicos inexistentes, rotas erradas)
- Suporte ao cliente fraco/ausente do lado Rome2Rio (sem telefone, redireciona)
- Sem personalizacao nem IA - experiencia generica e igual para todos
- Crescente densidade de anuncios pode degradar UX a medida que aposta em publicidade
- Avaliacoes pos-compra polarizadas/baixas (PissedConsumer ~1,8/5; queixas recorrentes de preco e reembolso)

## 12. Reclamações comuns dos usuários
- 'Preco muito mais caro que comprar direto' - bilhete austriaco de EUR 12,50 cobrado a EUR 35; trecho Pendik-Istambul anunciado a GBP 10 custava GBP 35
- Comissao/markup percebido de ~15% deixando cada opcao mais cara que alternativas
- Dificuldade/impossibilidade de reembolso e remarcacao - obrigam a falar com o parceiro (Omio/FlixBus/Skyscanner), nao com a Rome2Rio
- Horarios e servicos inexistentes ou desatualizados; mapas imprecisos
- Ausencia de telefone/suporte direto; cliente fica sem resposta
- Problemas no fluxo de compra e funcionalidade do site/app
- Emails de confirmacao com erro (alguns relatos de suporte rapido, ~20 min, mas inconsistente)
- Experiencia pos-compra dependente do parceiro: descoberta otima, atendimento ruim

## 13–19. Limitações
| Eixo | Limitação |
|---|---|
| **UX** | UX focada em uma tarefa unica (busca de rota) e funcional, mas estagnada: fluxo de pesquisa -> lista de opcoes -> redirect. Nao guia o usuario alem do 'como ir', exige varios cliques para sair e reservar no parceiro, e a densidade crescente de anuncios nativos/patrocinados (estrategia 2026) tende a poluir a tela. Sem onboarding personalizado, sem conta que entenda o viajante, sem continuidade entr |
| **Personalização** | Praticamente nula. Os resultados sao identicos para qualquer pessoa - nao considera orcamento, estilo de viagem, ritmo, companhia (familia/solo), tolerancia a conexoes ou preferencias de conforto. Nao ha 'super-perfil' do viajante; a unica 'memoria' e salvar rotas. Nao adapta ordenacao nem recomendacao ao usuario. |
| **IA** | Sem camada de IA generativa/recomendadora real. O core e um algoritmo de roteamento (grafo multimodal), nao um assistente que raciocina sobre a viagem, responde em linguagem natural ou monta plano. Nao ha copiloto conversacional, nem sintese inteligente de trade-offs (mais barato vs mais rapido vs mais confortavel) explicada ao usuario. |
| **Roteirização** | Faz roteirizacao de TRANSPORTE (sequencia de trechos A->B), mas NAO faz roteiro de VIAGEM (itinerario dia-a-dia com atracoes, passeios, refeicoes, tempo em cada lugar). Nao monta '7 dias no Peru'; so responde 'como ir de Lima a Cusco'. Nao otimiza multi-cidade/multi-parada como um planejador de itinerario faz, nem encaixa logistica com atividades. |
| **Orçamento** | So estima o custo do TRANSPORTE, e mesmo esse e impreciso/inflado e instavel (precos de terceiros desatualizados). Nao calcula o custo TOTAL realista da viagem (hospedagem + alimentacao + passeios + transporte local + taxas). Nao tem 'modo orcamento' que mostre quanto a viagem inteira vai custar nem ajuste opcoes ao teto financeiro do usuario. |
| **Comparação** | Compara MEIOS DE TRANSPORTE/ROTAS para um mesmo par origem-destino, mas NAO compara DESTINOS. Nao ajuda a decidir 'Peru x Tailandia x Portugal' por custo, clima, tempo de voo ou adequacao ao perfil. Foca em 'como chegar', nunca em 'para onde valer mais a pena ir' - exatamente a decisao de topo de funil que ele nao cobre. |
| **Integração** | Integravel, mas com restricoes: a API e de PARCEIRO (paga, contratual) e SEARCH-ONLY - retorna rotas e deep-links, mas NAO reserva (sem booking/ticketing via API), nao expoe GDS/NDC. Nao ha API publica de afiliado de auto-servico. Para um terceiro, as vias sao White Label embutivel (rapido, porem pouco customizavel e com a marca/UX deles) ou a Partner API (mais flexivel, custo por volume). Deep-li |

## 20. Oportunidades para superá-lo
- Ele PARA no 'como ir'; nos comecamos onde ele para - transformamos a rota em roteiro de viagem dia-a-dia com atracoes, passeios e logistica integrada
- Ele so estima transporte e infla preco; nos entregamos CUSTO TOTAL realista da viagem (transporte+hospedagem+comida+passeios) - a resposta que o viajante de verdade quer
- Ele nao compara destinos; nos resolvemos a decisao de topo de funil ('Peru x Tailandia') por custo, clima, perfil e tempo - e so DEPOIS embutimos a rota dele
- Ele e impessoal; nosso super-perfil do viajante personaliza tudo (orcamento, estilo, ritmo) - vantagem que ele estruturalmente nao tem
- Ele nao tem IA; nosso copiloto explica trade-offs e monta plano em linguagem natural
- Sua fraqueza de preco/reembolso vira nossa transparencia: mostramos preco real e alertamos quando comprar direto e melhor, ganhando confianca
- Sua aposta crescente em ads degrada UX; nosso diferencial e experiencia limpa, centrada na decisao, sem poluicao publicitaria
- Usamos os deep-links de afiliado dele como nossa camada de transporte multimodal pronta - integramos a forca dele e monetizamos sem reconstruir o grafo de rotas

---

## Matriz (visão Mundo Sem Fim)
| Critério | Avaliação |
|---|---|
| Força principal | Cobertura de roteamento multimodal door-to-door global (incl. transporte terrestre/regional obscuro) com 20 mil+ operadores, 240+ paises e 600M+ visitas/ano - dado de rota que quase ninguem mais tem. |
| Fraqueza principal | E so busca de transporte: para no 'como ir', com precos imprecisos/inflados e zero planejamento, personalizacao, comparacao de destino ou custo total da viagem. |
| Modelo de receita | Comissao de afiliado por click-through (modelo agency/referencia, reforcado pelo ticketing do Omio) + booking fee + publicidade nativa/patrocinada em forte expansao (meta de triplicar ads ate fim de 2026) + licenca de API/White Label. |
| Possui API? | Parcial - tem Partner API (paga, contratual) de roteamento SEARCH-ONLY; nao reserva, nao e GDS/NDC e nao ha API publica de afiliado. |
| Possui afiliados? | Nao no sentido classico (nao esta em Awin/CJ/Impact/Travelpayouts como anunciante). Ele e o AFILIADO/publisher que monetiza enviando trafego aos parceiros; comissao propria nao divulgada. |
| Pode virar parceiro? | Sim - via Partner API/White Label (free-dashboard.rome2rio.com) para usar o roteamento dele, e via deep-links de afiliado para monetizar reservas. Parceria de Ads tambem possivel, mas menos relevante pra nos. |
| Pode pagar comissão? | Sim, indiretamente - como publisher, ao integrarmos os deep-links de reserva dele (ou do Omio Group) recebemos comissao das reservas que originarmos; nao ha tabela publica de % e e provavel via contrato/White Label. |
| Pode receber tráfego? | Sim - alto valor: somos topo de funil (decisao de destino + roteiro + orcamento) e mandamos leads quentes para a etapa de logistica/reserva dele, exatamente o trafego qualificado que ele monetiza. |
| Pode ser integrado? | Parcial - integravel via deep-link de afiliado (simples, monetizavel) ou Partner API/White Label (paga, search-only, sem booking via API). Sem opcao publica/gratuita de auto-servico. |
| **O que precisamos ter p/ superar** | 1) Camada propria de transporte multimodal (via Partner API/deep-links da Rome2Rio ou Omio) para nao reinventar o grafo de rotas; 2) preco mais transparente/atual que o dele, alertando quando comprar direto; 3) o que ele NAO tem e nosso fosso: roteiro IA dia-a-dia, custo TOTAL realista, comparacao de destinos e super-perfil do viajante - tudo personalizado e sem poluicao de ads. |

## Fontes consultadas
- https://www.rome2rio.com/about/
- https://www.rome2rio.com/advertise/
- https://vizologi.com/business-strategy-canvas/rome2rio-business-model-canvas/
- https://www.traveldailynews.com/tour-operators/rome2rio-expands-advertising-business-adds-to-executive-team/
- https://www.webintravel.com/rome2rio-expands-advertising-business-adds-to-executive-team/
- https://www.phocuswire.com/Omio-acquires-Rome2Rio
- https://techcrunch.com/2019/10/31/omio-buys-rome2rio-to-build-out-its-global-travel-aggregator-business/
- https://en.wikipedia.org/wiki/Rome2rio
- https://free-dashboard.rome2rio.com/Account/Register
- https://www.rome2rio.com/documentation/1-4/search/
- https://www.altexsoft.com/techtalks/best-easy-to-use-api-option-for-a-travel-portal-for-flight-and-accommodation-travelpayouts-rome2rio-or-something-else/
- https://www.pilotplans.com/blog/rome2rio-review
- https://www.trustpilot.com/review/rome2rio.com
- https://rome2rio.pissedconsumer.com/review.html
- https://wereadreviews.com/we-read-100-reviews-of-rome2rio-heres-what-we-found/
- https://www.eyefortravel.com/distribution-strategies/rome2rio-very-successful-cockroach
- https://destinationsinternational.org/partner/rome2rio
