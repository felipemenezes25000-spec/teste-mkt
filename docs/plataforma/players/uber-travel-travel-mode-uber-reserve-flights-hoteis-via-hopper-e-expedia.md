# Uber Travel (Travel Mode + Uber Reserve + flights/hoteis via Hopper e Expedia)

> **Categoria:** Mobilidade / Super-app de viagem (integracoes de transporte, voos e hoteis) - vertical em construcao dentro do app Uber
> _Perfil gerado por pesquisa multiagente (jun/2026). Parte do [Relatório de Mercado](../01-relatorio-de-mercado.md) e da [Matriz Competitiva](../02-matriz-competitiva.md)._

## 1. O que faz
"Uber Travel" nao e um produto unico, e a guarda-chuva de viagem dentro do app Uber: (1) Uber Reserve, que agenda corridas de/para aeroporto com rastreamento de voo (dados OAG) que reajusta o horario do motorista conforme atraso/antecipacao; (2) reserva de voos no app (lancada no Reino Unido em 2023, powered by Hopper / Hopper Cloud); (3) reserva de hoteis e, em breve, alugueis Vrbo, via parceria com a Expedia anunciada no evento GO-GET 2026 (abril/2026), com acesso crescendo para 700 mil+ propriedades; (4) "Travel Mode", lancado em 2026, com recomendacoes locais, reservas de restaurante via OpenTable, room service no hotel e itens esquecidos. A logica e transformar o Uber num "everything app" de transporte+viagem, usando a base de usuarios de mobilidade como funil. O eixo de monetizacao real e a retencao da assinatura Uber One, nao o lucro por reserva.

## 2. Público-alvo
Base massiva de usuarios de mobilidade urbana (170M+ usuarios ativos Uber) que ja usam o app para corridas; viajante de aeroporto que quer transfer confiavel; membros Uber One (46M membros em 47 paises no Q4 2025, +55% a/a) que sao o alvo prioritario das ofertas de hotel/voo. Tambem Uber for Business / corporativo (via integracoes com Navan, importacao de recibos para reembolso). Geografia core: EUA e Reino Unido; voos e hoteis em rollout limitado por pais.

## 3. Funcionalidades principais
- Uber Reserve: corrida agendada de 30 min ate 90 dias de antecedencia, preco e motorista travados antes
- Rastreamento de voo (dados OAG) que reajusta automaticamente o horario de pickup conforme atraso/antecipacao e avisa o motorista
- Flight Capture / melhor horario para sair de casa rumo ao aeroporto
- Tempo de espera gratis pos-pouso (45 min Economy / 60 min Premium) para retirar bagagem
- Reserva de voos in-app (UK, powered by Hopper) com fintech: Price Freeze, Flight Disruption Guarantee, Cancel/Change For Any Reason, VIP support
- Reserva de hoteis via Expedia (700k+ propriedades em rollout) e alugueis Vrbo (chegando)
- Travel Mode: recomendacoes locais, reservas OpenTable, room service no hotel, itens esquecidos
- Uber One: 10% de volta em creditos em hoteis + 20%+ de desconto em lista rotativa de 10k+ hoteis
- Voice Bookings (pedido de corrida por voz, anunciado 2026)
- Uber for Business: itinerario movel + importacao automatica de recibos para reembolso (integra Navan)

## 4. Como monetiza
- Mobilidade (core): take rate sobre cada corrida Reserve/aeroporto - margem real e em transporte, nao em viagem
- Voos: modelo de agencia via Hopper Cloud - Uber e a vitrine, Hopper processa e divide receita de booking + venda de produtos fintech (Price Freeze etc.); Uber capta margem fina + spread dos add-ons
- Hoteis: modelo de afiliado/agencia via Expedia - comissao de OTA repassada, mas analistas (Skift) apontam que a Uber PERDE dinheiro por reserva de membros top-tier; objetivo e retencao de Uber One, nao lucro direto
- Uber One (assinatura): principal alavanca - viagem existe para reduzir churn e aumentar LTV da assinatura (46M membros)
- Publicidade (Uber Advertising, negocio de ~$1B+ run-rate) - destaque de hoteis/restaurantes patrocinados dentro de Travel Mode e potencial futuro
- Lead-gen / cross-sell: corrida ao aeroporto puxa voo, voo puxa hotel, hotel puxa room service - monetizacao por densidade de transacoes do mesmo usuario

## 5. Afiliados
SIM, mas em duas camadas distintas. (1) Programa de afiliados PROPRIO para desenvolvedores (Uber Affiliate Program, gerido no Developer Dashboard via Client ID): paga ~US$ 5 por novo passageiro que completa a primeira corrida e ~US$ 30-50 por novo motorista ativado; modelo CPA (so paga em first trip), limite minimo de saque alto (~US$ 250), pagamento mensal, e NAO gera comissao se o usuario ja tiver conta Uber (mesmo inativa). (2) Programa de afiliados de marketing geral (uber.com/affiliate-program) tambem proprio. Importante: NAO ha rede tipo Awin/CJ/Impact/Partnerize/Travelpayouts publica para a vertical de VIAGEM (voos/hoteis) - a monetizacao de viagem para terceiros depende de deeplink de corrida (CPA de signup), nao de comissao sobre voo/hotel.

## 6. API
Tem API, focada em CORRIDAS, nao em viagem. Uber Developer Platform oferece: Ride Requests API, Ride Request Widget (embute o fluxo de corrida no seu app), Deeplinks / Deeplink Generator / Ride Request Button (pickup, destino e produto pre-selecionados via deeplink m.uber.com), e Webhooks de status. A atribuicao de afiliado roda via Client ID nesses deeplinks. NAO existe API publica para reservar VOOS ou HOTEIS de terceiros - voos sao GDS/agency do Hopper Cloud e hoteis vem do estoque Expedia, ambos fechados ao publico externo. Sem NDC/GDS exposto a parceiros. Resumo: API publica de corrida (boa) + zero API publica de viagem.

## 7. Programa de parceiros
Parcerias sao estrategicas e fechadas, nao um programa aberto de auto-cadastro. Fornecedores de inventario: Hopper / Hopper Cloud (voos + fintech), Expedia Group + Vrbo (hoteis e alugueis), OAG (dados de status/horario de voo), OpenTable (reservas de restaurante). Distribuicao reversa: Uber for Business e integracao com Navan (recibos/itinerario); a partir de jun/2026 as corridas Uber passam a aparecer DENTRO do app da Expedia. Para desenvolvedores ha o Developer Program + Affiliate Program (corrida). Nao ha programa publico para um app de viagem virar "revendedor" de voo/hotel da Uber - so da para mandar trafego de corrida via deeplink afiliado.

## 8. Dados que oferece
- Status e horario de voo em tempo real (via OAG) - pouso, atraso, antecipacao
- Estado da corrida agendada (motorista a caminho, ETA, preco travado) via Ride Requests API/webhooks
- Disponibilidade e preco de produtos de corrida por geolocalizacao (UberX, Black, etc.) via deeplink/widget
- Inventario de voos e hoteis DENTRO do app (Hopper/Expedia) - mas apenas para o usuario final, nao exposto via API
- Recomendacoes locais e reservas de restaurante (OpenTable) no Travel Mode
- Recibos de viagem estruturados para reembolso corporativo (Uber for Business/Navan)

## 9. Dados que NÃO oferece
- Custo TOTAL realista de uma viagem (voo+hotel+transfer+alimentacao+passeios) - so mostra pecas isoladas no momento da compra
- Comparacao de DESTINOS (Peru vs Tailandia por orcamento/clima/epoca) - inexistente
- Roteiro dia-a-dia / itinerario inteligente de o-que-fazer
- Preco historico/curva de melhor mes para viajar a um destino (so Hopper interno tem, nao exposto)
- Perfil de viajante persistente e cross-produto para personalizacao de planejamento
- API publica de voos/hoteis com comissao para terceiros
- Dados de comparacao multi-OTA (so vitrine de um fornecedor: Hopper p/ voo, Expedia p/ hotel)
- Visao de planejamento ANTES da decisao - o app so atende quem ja decidiu e quer comprar/transportar

## 10. Pontos fortes
- Base de distribuicao gigantesca e habito diario - funil de mobilidade que nenhuma OTA tem
- Confiabilidade do transfer aeroporto com rastreamento de voo OAG (reajuste automatico + espera gratis) - melhor da categoria em mobilidade
- Marca de altissima confianca e penetracao global de pagamento ja cadastrado (1-tap)
- Uber One como flywheel: 46M membros, creditos cruzados que prendem o usuario no ecossistema
- Integracao real corrida<->voo<->hotel no mesmo app, com fintech de protecao (Hopper) embutida
- Capacidade de subsidiar (perder dinheiro em hotel) para ganhar retencao - bolso profundo
- Ecossistema de dev maduro para corridas (widget, deeplink, affiliate CPA)
- Uber Advertising como motor de receita incremental sobre o inventario de viagem

## 11. Pontos fracos
- Nao e ferramenta de PLANEJAMENTO - so serve quem ja decidiu; nao ajuda a escolher destino, montar roteiro ou estimar custo total
- Vitrine de fornecedor unico por vertical (Hopper p/ voo, Expedia p/ hotel) = sem comparacao real, precos nem sempre os melhores
- Cobertura geografica fragmentada: voos so UK, hoteis em rollout EUA - longe de global
- Zero personalizacao de viagem por perfil; trata todo mundo como comprador transacional
- Reclamacoes cronicas de cobranca/atendimento (PissedConsumer 1.6/5, 82% negativo; Trustpilot cheio de overcharge)
- Cancelamento/no-show no Reserve gera atrito (taxas maiores, motoristas reclamam de cancelamento tardio)
- Sem API publica de viagem - terceiros nao conseguem monetizar voo/hotel via Uber
- Modelo de viagem nao lucrativo por si - dependente de subsidio/assinatura, vulneravel se Uber One esfriar

## 12. Reclamações comuns dos usuários
- Overcharge / cobrancas nao autorizadas: estimativa de EUR20 vira EUR26 cobrado; relatos de saques multiplos de 100-200 (ex.: 900 AUD) no cartao
- Reembolso negado ou demorado; recobranca de pedagio dias depois de ja ter sido estornado
- Atendimento ruim - dificil achar humano, respostas de IA, sensacao de 'aprendeu a licao mas nao devolve o dinheiro' (PissedConsumer 1.6/5, 82% desfavoravel)
- Uber Reserve: taxa de cancelamento maior que on-demand; cobranca em circunstancias pouco claras
- Motoristas reclamam que passageiro cancela 2h antes e o pagamento de Reserve nao compensa o tempo/deslocamento
- Para viagem especificamente: usuarios percebem que precos de voo/hotel no app nem sempre batem com OTAs dedicadas (vitrine unica)
- Cobertura limitada gera frustracao - voos so no UK, hoteis so em alguns mercados

## 13–19. Limitações
| Eixo | Limitação |
|---|---|
| **UX** | UX otimizada para TRANSACAO rapida (pedir corrida, comprar voo/hotel ja decidido), nao para EXPLORACAO/decisao. Travel Mode adiciona recomendacoes, mas tudo dentro da metafora de 'app de corrida'. Nao existe tela de comparar destinos, simular orcamento ou construir roteiro. O viajante em fase de sonho/pesquisa nao tem o que fazer ali. Alem disso, o atrito de cobranca/atendimento (muito reclamado)  |
| **Personalização** | Praticamente nula no eixo viagem. A Uber personaliza corrida (enderecos frequentes, casa/trabalho) mas NAO mantem um super-perfil de viajante (estilo, orcamento, ritmo, companhia, gostos) que adapte recomendacoes de destino/roteiro. Travel Mode entrega recomendacoes genericas/turisticas, nao curadoria por perfil individual. Membros Uber One ganham desconto, mas isso e beneficio de fidelidade, nao  |
| **IA** | IA voltada a operacao (matching, pricing dinamico, voice booking para pedir corrida, suporte automatizado), nao a PLANEJAMENTO inteligente de viagem. Nao gera roteiro dia-a-dia, nao raciocina sobre 'melhor destino dado meu orcamento e epoca', nao monta plano multi-cidade. O 'AI' anunciado no GO-GET 2026 e assistente de execucao/voz, nao copiloto de planejamento de viagem. Aqui ha brecha clara para |
| **Roteirização** | Inexistente. Uber nao monta itinerario de viagem (sequencia de dias, atracoes, deslocamentos otimizados entre pontos). Resolve apenas o trecho ponto-a-ponto de corrida e a compra avulsa de voo/hotel. Nao existe 'roteiro de 7 dias no Peru' nem otimizacao de logistica diaria. Travel Mode lista recomendacoes soltas, sem encadeamento temporal ou geografico. |
| **Orçamento** | Nao oferece visao de CUSTO TOTAL realista da viagem. Mostra preco da corrida, do voo e do hotel isoladamente no checkout, mas nunca soma voo+hospedagem+transfer+alimentacao+passeios num orcamento unico, nem permite planejar dentro de um teto. Hopper tem inteligencia de preco/curva de voo, mas isso fica interno e nao vira ferramenta de orcamento de viagem para o usuario. Modo orcamento e um vazio t |
| **Comparação** | Comparacao fraca e enviesada por fornecedor unico. Voos saem do Hopper, hoteis da Expedia - o usuario ve a vitrine de UM agregador por vertical, nao um meta-comparador multi-fonte (como Skyscanner/Kayak/Google Flights). Pior ainda na comparacao de DESTINOS: nao existe comparar Peru vs Tailandia por custo, clima ou epoca. A comparacao se limita a ordenar opcoes dentro de um unico catalogo. |
| **Integração** | Para CORRIDAS a integracao e excelente (widget, deeplink, affiliate CPA, webhooks). Para VIAGEM (voo/hotel) e fechada: sem API publica, inventario de Hopper/Expedia nao exposto, parcerias sao 1:1 e estrategicas (nao auto-servico). Um app de planejamento NAO consegue revender voo/hotel da Uber nem receber comissao sobre eles - so consegue plugar a corrida via deeplink afiliado (CPA de signup, ~US$5 |

## 20. Oportunidades para superá-lo
- Ser o cerebro de PLANEJAMENTO/DECISAO (destino, roteiro IA, custo total) que a Uber nao tem - e usar a Uber so como executor do transfer no fim do funil
- Comparacao real multi-fornecedor de voos/hoteis (vs vitrine unica Hopper/Expedia) - posicionar-se como neutro e a favor do usuario
- Custo TOTAL realista da viagem (voo+hotel+transfer+comida+passeios) - exatamente o que a Uber nunca soma
- Super-perfil de viajante persistente para personalizar destino e roteiro - a Uber so personaliza corrida
- Comparacao de DESTINOS por orcamento/clima/epoca - inexistente na Uber
- Cobertura global de planejamento (Uber so tem voo no UK / hotel em poucos mercados)
- Confianca: evitar o atrito de overcharge/atendimento que mancha a Uber em compras de ticket alto
- Roteiro dia-a-dia com logistica otimizada - vazio total na Uber, e plugar Uber Reserve como o transfer entre os pontos do roteiro

---

## Matriz (visão Mundo Sem Fim)
| Critério | Avaliação |
|---|---|
| Força principal | Funil de distribuicao diaria gigante (mobilidade) + transfer aeroporto com rastreamento de voo OAG, marca confiavel, pagamento 1-tap e Uber One (46M membros) como flywheel de retencao cruzada. |
| Fraqueza principal | Nao planeja viagem - so atende quem ja decidiu e quer comprar/transportar; sem roteiro, sem custo total, sem comparacao de destinos, vitrine de fornecedor unico por vertical e zero API publica de viagem. |
| Modelo de receita | Take rate de corrida (core) + modelo de agencia/afiliado de baixa margem em voo (Hopper Cloud) e hotel (Expedia, frequentemente subsidiado) cujo objetivo real e reter assinatura Uber One; complementado por Uber Advertising. Para terceiros, so paga CPA de signup de corrida (~US$5). |
| Possui API? | Parcial - API publica robusta de CORRIDA (Ride Requests, Widget, Deeplink, webhooks); NENHUMA API publica de voo/hotel (Hopper/Expedia fechados). |
| Possui afiliados? | Sim, proprio (Uber Affiliate Program no Developer Dashboard): ~US$5/novo passageiro first-trip, ~US$30-50/motorista, CPA, min US$250, NAO via Awin/CJ/Impact/Travelpayouts e NAO cobre comissao de voo/hotel. |
| Pode virar parceiro? | Parcial - como integrador de CORRIDA sim (deeplink/widget + afiliado), facil e self-service. Como revendedor de VOO/HOTEL nao - exige deal estrategico fechado (Hopper/Expedia operam B2B 1:1), inviavel para app pequeno. |
| Pode pagar comissão? | Sim, mas so na corrida e via CPA de first-trip (~US$5/passageiro), nao recorrente e nao sobre o valor da viagem. Nao paga % sobre voo/hotel a terceiros. |
| Pode receber tráfego? | Sim - canal natural para enviar o usuario do nosso planejador rumo ao transfer (Uber Reserve agendado para o aeroporto do roteiro). Receber trafego DELE para nos e improvavel (app fechado, sem afiliado de saida para planejamento). |
| Pode ser integrado? | Parcial - via deeplink/Ride Request Widget para a corrida (1-tap, com atribuicao de afiliado por Client ID). Voo/hotel NAO integraveis sem parceria privada. Estrategia: integrar Uber Reserve como o 'transfer' dentro do nosso roteiro/custo total. |
| **O que precisamos ter p/ superar** | (1) Motor de roteiro-IA dia-a-dia que a Uber nao tem; (2) custo TOTAL realista somando todos os componentes; (3) comparacao multi-fornecedor de voos/hoteis e comparacao de DESTINOS; (4) super-perfil de viajante para personalizacao; (5) confiabilidade/transparencia de preco e suporte (evitar o overcharge que mancha a Uber); (6) integrar Uber Reserve como executor de transfer via deeplink afiliado,  |

## Fontes consultadas
- https://www.uber.com/us/en/newsroom/improving-the-airport-travel-experience/
- https://www.oag.com/blog/uber-reserves-cloud-transformation-with-oag
- https://www.uber.com/gb/en/newsroom/uber-takes-to-the-skies-with-flight-bookings-now-available-in-the-uk-uber-app/
- https://www.phocuswire.com/uber-flight-bookings-uk-hopper
- https://skift.com/2023/05/10/uber-teams-with-hopper-for-flights-and-fintech/
- https://investor.uber.com/news-events/news/press-release-details/2026/Uber-Expands-into-Travel-with-Hotel-Bookings-and-New-In-App-Features/default.aspx
- https://skift.com/2026/04/29/uber-to-add-hotels-via-expedia-deal-with-vrbo-rentals-to-come/
- https://skift.com/2026/04/30/ubers-hotel-deal-tells-you-more-about-expedias-future-than-ubers/
- https://www.phocuswire.com/news/technology/uber-hotel-booking-expedia-group
- https://www.cnbc.com/2026/04/29/uber-ai-travel-hotels-go-get.html
- https://www.uber.com/hr/en/newsroom/go-get-2026/
- https://developer.uber.com/docs/riders/affiliate-program/introduction
- https://developer.uber.com/docs/riders/affiliate-program/faq
- https://developer.uber.com/products/ride-requests-deeplink
- https://www.uber.com/us/en/affiliate-program/
- https://navan.com/integrations
- https://help.uber.com/en/riders/article/using-uber-reserve
- https://www.trustpilot.com/review/www.uber.com
- https://uber.pissedconsumer.com/review.html
- https://www.uberpeople.net/threads/reservation-cancellation-doesnt-make-sense.465038/
