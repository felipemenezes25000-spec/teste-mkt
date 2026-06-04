# Revolut (Travel)

> **Categoria:** Fintech / superapp financeira com vertical de viagem embarcada (Stays, eSIM, RevPoints/Airline Miles, Revolut Pay para OTAs)
> _Perfil gerado por pesquisa multiagente (jun/2026). Parte do [Relatório de Mercado](../01-relatorio-de-mercado.md) e da [Matriz Competitiva](../02-matriz-competitiva.md)._

## 1. O que faz
A Revolut e uma fintech/superapp (60M+ usuarios em 2026) que embarcou viagem dentro do app financeiro. O nucleo de viagem e o "Stays" (busca e reserva de hoteis e casas de temporada via inventario da Expedia/Vrbo e do agregador Nuitee/LiteAPI, que somou 1,5M+ propriedades e cadeias diretas como Hilton, Marriott e Accor), complementado por eSIM de dados (revenda da 1GLOBAL), programa de pontos RevPoints com resgate em Airline Miles (Flying Blue, Avios) e desconto em Stays, e o Revolut Pay como checkout one-click embutido em OTAs parceiras (Booking.com desde nov/2025, Kiwi.com). E uma camada de pagamento + reserva oportunista dentro de uma carteira/conta multimoeda, nao um planejador de viagem.

## 2. Público-alvo
Base existente de clientes Revolut: viajantes frequentes urbanos, millennials/Gen-Z digitais na Europa, Reino Unido e mercados em expansao (US, India, LatAm, APAC), que ja usam o app para FX/cartao sem IOF/multimoeda e fecham hotel por impulso/conveniencia + cashback. Sensiveis a preco e a recompensa (RevPoints), nao buscam consultoria de roteiro. Forte vies de quem ja e correntista Revolut Premium/Metal/Ultra.

## 3. Funcionalidades principais
- Stays: busca e reserva de hoteis e casas de temporada dentro do app (inventario Expedia/Vrbo + Nuitee/LiteAPI, 1,5M+ propriedades, 170+ paises)
- Cashback/RevPoints em reservas Stays escalonado por plano (de ~0,4% ate 10% em campanhas, pago como pontos)
- RevPoints: programa de pontos pan-europeu com resgate 1:1 em Airline Miles (Flying Blue, Avios) e desconto em Stays
- eSIM de dados para 100+ paises (revenda 1GLOBAL/1GLOBAL), planos de 1GB ate 20GB a partir de ~£1,50; 3GB global gratis no plano Ultra
- Revolut Pay: checkout one-click embutido em Booking.com (acomodacao; voos e carros a caminho) e Kiwi.com, com biometria e RevPoints extra
- Pagamento multimoeda / cartao sem markup de cambio nos limites do plano, seguro de viagem em planos pagos, lounge access (Metal/Ultra)
- Pay later em parte das reservas Stays (cartao Revolut como garantia, cobranca proxima ao check-in)

## 4. Como monetiza
- Modelo de agencia/afiliado sobre acomodacao: a Revolut intermedia inventario de wholesalers/OTAs (Expedia, Nuitee/LiteAPI) e fica com parte da margem do fornecedor — a LiteAPI anuncia margens de parceiro de ate ~20%, acima da media do setor, por cortar intermediarios; parte dessa margem financia o cashback/RevPoints (sem 'booking fee' cobrada do usuario)
- Receita de pagamentos (Revolut Pay): tarifa de processamento/MDR cobrada do merchant (Booking.com adotou Revolut Business) por transacao no checkout one-click
- Cambio (FX): spread/markup acima da franquia mensal do plano em compras e saques no exterior — o motor financeiro real por tras da proposta de viagem
- Assinaturas de plano (Plus/Premium/Metal/Ultra): mensalidade recorrente que embute beneficios de viagem (cashback maior, eSIM gratis, seguro, lounge) — viagem como gancho de upsell
- Revenda de eSIM (1GLOBAL): markup sobre pacotes de dados
- Float/juros e interchange sobre o saldo e gasto no cartao; RevPoints como mecanismo de retencao que aumenta LTV

## 5. Afiliados
Tem programa de afiliados PROPRIO operado na rede Impact (impact.com) — porem ele e voltado a aquisicao de NOVOS CLIENTES Revolut (abertura de conta retail/business), pagando ate ~£500 por venda/conta qualificada, sem minimo de payout, com links e banners. NAO e um programa de afiliado de reserva de viagem: nao da para um terceiro ganhar comissao por mandar trafego que reserva um hotel no Stays. Ou seja, monetiza-se enviando signups de conta, nao bookings.

## 6. API
Sem API publica de inventario/booking de viagem. O developer.revolut.com expoe APIs de Business, Merchant/Revolut Pay (aceitar pagamento), Open Banking e Partner API de cripto-ramp — nada de busca de hoteis, voos ou Stays para terceiros. A integracao de viagem da Revolut e como CONSUMIDORA de APIs de terceiros (Nuitee/LiteAPI, Expedia, e o lado merchant do Booking.com). Para nos, o ponto de integracao viavel e (a) Revolut Pay como metodo de checkout e (b) o afiliado de conta via Impact — nao o catalogo de Stays.

## 7. Programa de parceiros
Dois eixos: (1) Parcerias de distribuicao de pagamento — Revolut Pay embarcado em OTAs (Booking.com nov/2025, o maior parceiro de viagem a adotar Revolut Pay, cobrindo UK, India, US, LatAm e APAC; Kiwi.com). (2) Parcerias de suprimento de inventario para o Stays via Nuitee/LiteAPI e Expedia/Vrbo. Hoteis/cadeias entram como fornecedores via LiteAPI (rate parity, gestao de tarifas e disponibilidade), nao via marketplace aberto. Para airlines, parcerias de loyalty (Flying Blue, Avios) para resgate de RevPoints. Nao ha um 'partner program' aberto para apps de planejamento plugarem catalogo.

## 8. Dados que oferece
- Tarifas e disponibilidade de hoteis e casas de temporada (preco final no app, via Expedia/Vrbo/Nuitee)
- Valor de cashback/RevPoints estimado por reserva conforme plano do usuario
- Cotacao de cambio em tempo real / preco em multimoeda do gasto
- Precos e cobertura de planos de eSIM por pais/regiao
- Taxa de conversao RevPoints -> Airline Miles e parceiros de resgate
- Confirmacao e gestao basica da reserva (amend/cancel conforme politica do fornecedor)

## 9. Dados que NÃO oferece
- Roteiro/itinerario dia-a-dia ou sugestao do que fazer no destino
- Custo total realista da viagem (voo+hospedagem+alimentacao+transporte+passeios+seguro)
- Comparacao entre destinos (ex.: Peru vs Tailandia por orcamento/epoca/perfil)
- Recomendacao personalizada por perfil do viajante (super-perfil, estilo, restricoes)
- Conteudo editorial/guia, clima por temporada, seguranca, vistos de forma estruturada
- Precos historicos/previsao de preco de voo, alertas de queda, melhor mes para ir
- Inventario de experiencias/tours/atividades e restaurantes integrado a reserva
- Planejamento colaborativo em grupo / orcamento compartilhado

## 10. Pontos fortes
- Distribuicao gigantesca e barata: 60M+ usuarios ja logados e com cartao cadastrado — conversao de reserva sem friccao de pagamento (one-click + biometria)
- Pagamento e a maior dor resolvida: multimoeda, sem markup nos limites do plano, FX nativo — vantagem real para viagem internacional
- Loop de recompensa (RevPoints/cashback ate 10%) que cria retencao e incentiva fechar dentro do app
- Inventario competitivo via Nuitee/LiteAPI + Expedia/Vrbo (1,5M+ propriedades, cadeias diretas Hilton/Marriott/Accor)
- Margem de fornecedor superior a media (LiteAPI ate ~20%) que sustenta o cashback sem cobrar fee do usuario
- Confianca de marca fintech e seguranca de pagamento; capilaridade crescente (US, India, LatAm, APAC)
- Revolut Pay vira trilho de pagamento aceito por OTAs externas (Booking.com), ampliando alcance alem do app

## 11. Pontos fracos
- Zero camada de planejamento/decisao: nao ajuda a escolher destino, montar roteiro nem estimar custo total — so executa a reserva de quem ja decidiu
- Experiencia de viagem subordinada ao app financeiro; busca de hotel pobre vs OTAs dedicadas (filtros, mapa, conteudo, reviews limitados)
- Atendimento ao cliente notoriamente fraco para reservas: casos de pagamento que nao chega ao hotel e reembolso travado viram crise (sem balcao humano de viagem)
- Cadeia de responsabilidade difusa: Revolut + Nuitee/Expedia + hotel — quando da problema, cliente fica no meio do fogo cruzado
- Cashback some no cancelamento de 'pay now' e nao-reembolsavel nao devolve dinheiro — gera frustracao e percepcao de armadilha
- Sem IA de viagem, sem comparacao de destinos, sem orcamento — proposta puramente transacional e oportunista
- Voos: nao vende voo de verdade no app (so resgate de pontos/miles e cashback via Kiwi.com), experiencia fragmentada
- Dependente de planos pagos para o melhor cashback — beneficio de viagem e isca de assinatura, nao produto autonomo

## 12. Reclamações comuns dos usuários
- Hotel nao recebeu o pagamento: cliente chega no destino (as vezes em viagem de negocios) e descobre que a reserva nao foi paga, sendo cobrado de novo direto no balcao (Trustpilot)
- Reembolso fantasma: prometido ha mais de uma semana e nada cai; cliente fala com 4+ agentes diferentes e ninguem resolve (Trustpilot)
- Suporte com script repetitivo ('entendemos sua frustracao', 'escalei o caso') e troca constante de agente sem solucao
- Quase perder voo de volta porque o hotel ainda cobrava por falta de confirmacao de pagamento
- Cashback retirado no cancelamento e ausencia de reembolso em reservas nao-reembolsaveis percebidos como injustos
- Disputa de responsabilidade entre Revolut e o fornecedor (Expedia/Nuitee/hotel), deixando o usuario sem canal claro

## 13–19. Limitações
| Eixo | Limitação |
|---|---|
| **UX** | UX de viagem espremida dentro de um app de banco: busca de hospedagem com filtros, mapa e conteudo inferiores aos das OTAs dedicadas; sem inspiracao, sem guia, sem jornada de descoberta. O fluxo e otimo no pagamento (one-click) e fraco na exploracao. Quando algo da errado, a UX de suporte e um buraco negro (chat com script, sem time de viagem). Brecha enorme para um app cuja UX inteira gira em tor |
| **Personalização** | Personalizacao quase nula no contexto de viagem: a Revolut conhece o gasto/cartao do usuario, mas nao tem super-perfil de viajante (estilo, ritmo, interesses, restricoes, com quem viaja). Nao adapta sugestoes de destino/hospedagem ao perfil — mostra inventario generico ordenado por preco/disponibilidade. Nosso super-perfil do viajante e diferencial direto e nao replicavel por uma fintech focada em |
| **IA** | Nao ha IA de planejamento de viagem. O 'AI' da Revolut esta em fraude/risco/assistente financeiro, nao em montar roteiro, responder 'para onde ir' ou estimar custo. O inventario Nuitee/LiteAPI ate se posiciona para a 'era agentica', mas isso e infra de distribuicao para terceiros — nao um copiloto de viagem voltado ao consumidor Revolut. Nosso roteiro por IA + Q&A de decisao e justamente o que a R |
| **Roteirização** | Inexistente. A Revolut nao monta itinerario dia-a-dia, nao sequencia atividades, nao integra voo+hotel+experiencias+transporte numa linha do tempo. Vende hospedagem avulsa (e pontos para milhas). Nao ha nocao de viagem como projeto — so de transacao. Roteirizacao e um espaco totalmente aberto para nos. |
| **Orçamento** | Nao calcula custo total realista da viagem. O cashback/multimoeda ajuda a PAGAR melhor, mas nao responde 'quanto vou gastar no total nesse destino' (voo+hospedagem+comida+transporte local+passeios+seguro+eSIM). Nao ha modo orcamento, nem comparacao de custo de vida por destino, nem ajuste por epoca/duracao/perfil. Lacuna central que nosso 'custo total realista' preenche. |
| **Comparação** | Nao compara destinos. A Revolut nao ajuda a escolher entre, por exemplo, Portugal x Tailandia x Peru por orcamento, clima, seguranca, epoca ideal ou aderencia ao perfil. A 'comparacao' no app e entre tarifas de hoteis ja dentro de um destino escolhido. Toda a etapa de decisao de destino — o coracao do nosso produto — esta fora do escopo dela. |
| **Integração** | Para um app de planejamento, a Revolut e dificil de integrar como FORNECEDOR de viagem: nao expoe API publica de Stays/voos, e o afiliado (Impact) so paga por abertura de conta, nao por reserva. As integracoes uteis sao: (a) oferecer Revolut Pay como metodo de checkout no nosso fluxo (via API merchant) e (b) afiliado de signup de conta. Inventario de hotel teriamos que buscar na fonte (Nuitee/Lite |

## 20. Oportunidades para superá-lo
- Possuir a etapa de DECISAO (para onde ir, quando, com que orcamento) que a Revolut ignora — capturar o usuario antes da reserva e direcionar a compra
- Calcular custo TOTAL realista por destino/perfil — algo que cashback e FX da Revolut nao resolvem
- IA de roteiro + super-perfil do viajante como camada de inteligencia que a fintech nao tem nem pretende ter
- Suporte/responsabilidade de viagem confiavel: transformar a maior reclamacao da Revolut (pagamento nao chega ao hotel, reembolso travado, script) em diferencial de confianca
- Comparacao multi-destino lado a lado (orcamento, clima, seguranca, epoca) — etapa totalmente ausente na Revolut
- Agnosticismo de fornecedor: comparar Booking/Expedia/Nuitee/diretos pelo melhor preco-valor, em vez de prender o usuario a um unico inventario
- Voos de verdade com previsao de preco e melhor epoca — a Revolut so resgata milhas/cashback, nao planeja o voo
- Usar o proprio Revolut Pay + afiliado de conta como monetizacao adicional, mandando para a Revolut o que ela faz bem (pagar) e ficando com o que ela nao faz (planejar)

---

## Matriz (visão Mundo Sem Fim)
| Critério | Avaliação |
|---|---|
| Força principal | Distribuicao massiva (60M+ usuarios logados com cartao) + checkout de pagamento sem friccao (Revolut Pay one-click, multimoeda/FX nativo) e loop de recompensa (RevPoints/cashback ate 10%) que converte reserva por impulso. |
| Fraqueza principal | Zero planejamento/decisao de viagem (sem roteiro, sem custo total, sem comparacao de destino, sem personalizacao) + suporte de reserva notoriamente ruim (pagamento que nao chega ao hotel, reembolso travado). |
| Modelo de receita | Agencia/afiliado sobre margem de fornecedor de hospedagem (Nuitee/LiteAPI ate ~20%, Expedia/Vrbo) que financia cashback sem fee ao usuario; + MDR de Revolut Pay; + spread de FX; + assinaturas de plano; + revenda de eSIM (1GLOBAL). |
| Possui API? | Parcial/Nao para viagem: sem API publica de inventario de Stays/voos; existe API merchant (Revolut Pay), Business e Open Banking. Integravel como metodo de pagamento, nao como fonte de oferta. |
| Possui afiliados? | Sim, porem deslocado: programa proprio na rede Impact pagando ate ~£500 por NOVA CONTA Revolut (signup), nao por reserva de viagem. Nao ha comissao de booking para terceiros. |
| Pode virar parceiro? | Sim, como parceiro de PAGAMENTO/AQUISICAO: integrar Revolut Pay no nosso checkout (API merchant) e entrar no afiliado de conta (Impact). Nao como fornecedor de inventario de hotel — esse vem da fonte (Nuitee/Expedia). |
| Pode pagar comissão? | Nao por reserva de viagem (nao ha afiliado de booking). Sim por aquisicao: ate ~£500 por conta Revolut qualificada via Impact. Receita nossa viria de signups, nao de bookings dela. |
| Pode receber tráfego? | Sim — podemos mandar leads qualificados para abrir conta Revolut (ganho via Impact) e usuarios para pagar com Revolut Pay. Mas mandar trafego de RESERVA para o Stays nao nos remunera, entao nao e o canal de monetizacao de booking. |
| Pode ser integrado? | Parcial — via API merchant (Revolut Pay como opcao de checkout) e via deeplink/afiliado de conta (Impact). Inventario de Stays nao e integravel por terceiros. |
| **O que precisamos ter p/ superar** | Checkout de pagamento tao sem friccao quanto o Revolut Pay (one-click, multimoeda) E sustentado por roteiro IA, custo total realista, comparacao de destinos e super-perfil — alem de suporte/responsabilidade de reserva confiavel e agnosticismo de fornecedor para sempre achar o melhor preco-valor. Ou seja: igualar a Revolut no PAGAR e vence-la no DECIDIR e no CONFIAR. |

## Fontes consultadas
- https://www.revolut.com/legal/stays/
- https://www.revolut.com/blog/post/say-hello-to-stays/
- https://www.nuitee.com/blog/nuitee-revolut-unlocking-hotels-access-to-millions-of-travelers
- https://www.liteapi.travel/
- https://skift.com/2025/09/09/nuitee-travel-api-connectivity/
- https://help.revolut.com/en-LT/help/more/stays/how-does-cashback-for-stays-bookings-work/
- https://www.revolut.com/rev-points/
- https://help.revolut.com/help/revpoints/airline-miles/question-what-are-airline-miles/
- https://www.kiwi.com/stories/revolut-kiwi-com-the-ultimate-travel-hack-combo/
- https://www.revolut.com/news/revolut_expands_travel_footprint_launches_new_payments_partnership_with_online_travel_platform_booking_com/
- https://www.pymnts.com/partnerships/2025/booking-com-turns-to-revolut-for-one-click-checkout/
- https://fintech.global/2025/11/18/revolut-and-booking-com-unveil-new-payment-partnership/
- https://www.revolut.com/esim/global-esim/
- https://wise.com/gb/blog/revolut-esim-review
- https://www.revolut.com/en-US/become-a-revolut-affiliate/
- https://www.impact.com/
- https://developer.revolut.com/
- https://www.trustpilot.com/review/www.revolut.com
- https://www.phocuswire.com/uk-banking-app-revolut-launches-travel-booking-product
- https://shorttermrentalz.com/news/revolut-homes-unveiling-market-share/
