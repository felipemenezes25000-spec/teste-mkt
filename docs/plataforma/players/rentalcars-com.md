# Rentalcars.com

> **Categoria:** Aluguel de carro / OTA de car hire (Booking Holdings)
> _Perfil gerado por pesquisa multiagente (jun/2026). Parte do [Relatório de Mercado](../01-relatorio-de-mercado.md) e da [Matriz Competitiva](../02-matriz-competitiva.md)._

## 1. O que faz
Maior agregador/OTA mundial de aluguel de carro: agrega tarifas de 900+ locadoras (Hertz, Avis, Europcar, Sixt, locais) em 60.000+ pontos e 160+ paises, deixa o usuario buscar, comparar e reservar carro (e taxi pre-reservado) num so lugar. Atua como agente (intermedia a reserva com a locadora) OU como principal/merchant (revende a tarifa) conforme o contrato com cada fornecedor. E uma marca do Booking Holdings e seu inventario tambem alimenta o produto de carros do Booking.com.

## 2. Público-alvo
Viajante de lazer e negocios que ja decidiu destino/datas e precisa de carro; foco em mercados de aluguel pre-pago internacional (Europa, EUA, Brasil para destinos turisticos). Tambem B2B: afiliados, blogs de viagem, OTAs e sites que querem monetizar aluguel de carro via widget/deeplink. Nao serve o usuario na fase de inspiracao/planejamento.

## 3. Funcionalidades principais
- Busca e comparacao de tarifas de 900+ locadoras por local/aeroporto e datas
- Filtros por categoria de carro, transmissao, fornecedor, politica de combustivel, nota da locadora
- Price Match Guarantee (igualar preco menor encontrado em outro site)
- Opcoes 'Pay now' (merchant/pre-pago) e 'Pay at pick-up' (agency)
- Venda de protecao paga: Full Protection / Damage Excess Refund (seguro de franquia proprio, alta margem)
- Reviews/notas de locadora e de pontos de retirada
- Gestao de reserva (Manage Booking), cancelamento e app proprio iOS/Android
- Pre-reserva de taxi/transfer aeroporto
- RentalcarsConnect: banners, widgets de busca e booking-engine para afiliados
- Suporte multi-idioma e multi-moeda

## 4. Como monetiza
- Markup/spread sobre tarifa de balcao (modelo merchant/principal): compra tarifa net da locadora e revende com margem ao usuario no 'Pay now'
- Comissao da locadora (modelo agente/agency) nas reservas 'Pay at desk'
- Venda de produtos de protecao proprios (Full Protection / Damage Excess Refund) — add-on de margem muito alta, principal alavanca de receita por reserva
- Receita de taxi/transfer pre-reservado
- Receita do programa de afiliados invertida: paga 6% a parceiros que enviam trafego, mas captura o cliente final e o upsell de seguro
- Parte da receita 'Other' do Booking Holdings; grupo registrou US$26,9 bi de receita total em 2025 e 88 mi de diarias/reservas de carro no ano

## 5. Afiliados
Sim. Programa proprio 'RentalcarsConnect' (gratuito), com tracking e pagamento via CJ Affiliate (Commission Junction) e Awin como redes oficiais; tambem disponivel via Travelpayouts. Comissao tipica ~6% por reserva (car hire + taxi pre-reservado), cookie de 30 dias, pagamento minimo ~GBP 100, ciclo Net-20 (cheque/ACH/Payoneer). Revenue share sobre o valor da reserva.

## 6. API
Sem API publica aberta do Rentalcars. Integracao B2B por dois caminhos: (1) RentalcarsConnect — banners estaticos/dinamicos, widget de resultados e booking-engine via deeplink pre-populado (sem acesso a dados crus); (2) Booking.com Demand API, endpoint Cars (search de carros, detalhes, fornecedores/depots, disponibilidade, reserva e relatorios) — em BETA, restrita a parceiros afiliados aprovados/Managed, exige permissao especial e account manager, autenticacao por Affiliate ID + token. Nao e GDS nem NDC; e API proprietaria de demanda.

## 7. Programa de parceiros
RentalcarsConnect (afiliados/integradores, gratuito) com redes CJ e Awin; camada avancada via Booking.com Partner/Affiliate Partner Centre e Demand API (Managed Affiliate / Connectivity Partner, com aprovacao e account manager). Lado oferta: onboarding de locadoras via marketplace.rentalcars.com.

## 8. Dados que oferece
- Inventario e tarifas de aluguel de carro por local/aeroporto e datas (via deeplink/widget e, p/ aprovados, Demand API Cars)
- Categorias de veiculo, transmissao, politica de combustivel, fornecedor e ponto de retirada
- Disponibilidade e preco 'pay now' vs 'pay at desk'
- Notas/reviews de locadora
- Conteudo de afiliado pronto (banners, formularios de busca, widgets) para embutir

## 9. Dados que NÃO oferece
- Nenhum dado de roteiro, atracoes, clima, voos ou hospedagem (so carro/taxi)
- Sem feed publico/aberto de precos (precisa ser afiliado aprovado para a Demand API)
- Sem custo-total de viagem nem contexto de orcamento alem do carro
- Sem dados de perfil/preferencia do viajante exportaveis
- Sem comparacao entre destinos — so entre carros num mesmo local
- Sem webhook/push de mudanca de preco para o parceiro no nivel afiliado padrao
- Detalhes finais de cobertura/exclusoes do seguro so sao revelados pela locadora na retirada

## 10. Pontos fortes
- Maior cobertura de oferta do mercado (900+ locadoras, 60.000+ pontos, 160+ paises) — liquidez imbativel
- Marca e escala do Booking Holdings (confianca, SEO, orcamento de marketing gigante)
- Conversao altamente otimizada e funil de checkout maduro multi-moeda/idioma
- Price Match Guarantee reduz objecao de preco
- Produto de protecao de franquia proprio gera margem alta e fideliza o checkout
- Programa de afiliado simples e bem distribuido (CJ, Awin, Travelpayouts) — facil de integrar via deeplink

## 11. Pontos fracos
- Reputacao de transparencia ruim: taxas/surcharges de local aparecem so na retirada apesar do selo 'No Hidden Costs'
- Atendimento pos-venda muito criticado (reembolso negado, chat que nao abre, transferencias infinitas)
- Atrito com locadoras: seguro proprio as vezes rejeitado no balcao, forcando recompra
- Foco estreito em transacao de carro — zero ajuda na decisao/planejamento da viagem
- Demand API de carros ainda em beta e fechada — barreira para integracao profunda
- Dependencia do upsell de seguro como motor de receita gera incentivo desalinhado com o usuario
- Experiencia generica de OTA, pouca personalizacao

## 12. Reclamações comuns dos usuários
- Preco final ate 3x o anunciado por surcharges de local/aeroporto nao mostrados na busca
- Reembolso recusado ou so 'gesto de boa vontade' apos cancelamento; cobrancas mantidas mesmo com erro admitido
- Seguro/Full Protection comprado no site rejeitado pela locadora no balcao
- Caucao (deposito) retida muito alem do esperado ou debitada sem explicacao clara
- Disputas de combustivel (full-to-empty) e cobranças surpresa na devolucao
- Suporte inacessivel: dezenas de ligacoes/emails sem resolucao
- Damage Excess Refund nao cobre rodas/pneus e demora meses quando ha terceiro envolvido
- Carro rebaixado de categoria mesmo pagando premium

## 13–19. Limitações
| Eixo | Limitação |
|---|---|
| **UX** | UX puramente transacional de OTA: leva direto a busca de carro com datas pre-populadas, sem onboarding, sem contexto de viagem. Selo 'No Hidden Costs' contraria a experiencia real (surcharges no balcao), corroendo confianca. Pos-venda e o ponto mais fraco — gestao de reserva e suporte geram frustracao recorrente. |
| **Personalização** | Quase nula. Nao constroi perfil do viajante (estilo, mobilidade, com criancas, preferencia de marca/cambio automatico) nem recomenda categoria de carro com base no roteiro. Personalizacao se limita a filtros manuais na sessao; nada persiste como super-perfil reutilizavel entre viagens. |
| **IA** | Sem IA conversacional ou de recomendacao voltada ao usuario final. Nao explica em linguagem natural qual cobertura faz sentido, nao prevê armadilhas (depósito, combustível) de forma proativa nem casa o carro ao itinerario. Ranking e otimizado para conversao/margem, nao para a melhor decisao do viajante. |
| **Roteirização** | Inexistente. Nao monta roteiro, nao sabe se o trajeto exige 4x4/quilometragem livre/cruzar fronteira, nao sugere quando faz sentido alugar carro vs transporte publico. Trata o carro como item isolado, fora de qualquer dia-a-dia de viagem. |
| **Orçamento** | So mostra o custo do carro (e mesmo assim incompleto, com surcharges escondidos ate a retirada). Nao soma combustivel, pedágios, estacionamento, franquia/depósito ou seguro no custo-total realista da viagem. O usuario nao consegue ver o impacto do carro no orcamento global do trip. |
| **Comparação** | Compara apenas carros dentro de um mesmo local/data. Nao compara destinos, nem o custo-de-mobilidade entre cidades/paises, nem 'alugar vs nao alugar'. Nao ajuda a escolher para onde ir — pressupoe destino ja decidido. |
| **Integração** | Integracao de saida (afiliado) e facil via deeplink/widget e redes CJ/Awin/Travelpayouts, mas a integracao de dados rica (Demand API Cars) e beta, fechada e exige aprovacao + account manager. Sem feed publico de precos, sem webhook de preco, e sem como puxar inventario para uma UI propria no nivel afiliado padrao — limita comparacao nativa dentro do nosso app. |

## 20. Oportunidades para superá-lo
- Custo-total honesto do carro: estimar surcharges de aeroporto, combustivel, pedágio, estacionamento e franquia ANTES de mandar pro checkout — atacando direto a reclamacao nº1 de 'preco 3x maior'
- Explicar seguro/franquia com IA em linguagem clara e avisar do risco de rejeicao no balcao e do deposito — virar o conselheiro que o Rentalcars nao e
- Casar carro ao roteiro: so sugerir aluguel quando o itinerario justifica, com a categoria certa (estradas, bagagem, fronteira)
- Comparar 'alugar vs transporte publico/transfer' no orcamento da viagem inteira
- Super-perfil persistente (preferencia de cambio, marca, com criancas) que pre-seleciona o carro certo em toda viagem
- Camada de confianca/transparencia (alertas de letras miudas, politica de combustivel, avaliacoes reais de balcao) como diferencial vs reputacao fraca dele
- Monetizar mandando lead qualificado e ja 'decidido' via deeplink CJ/Awin e capturar a comissao de 6% sem assumir o atrito de pos-venda

---

## Matriz (visão Mundo Sem Fim)
| Critério | Avaliação |
|---|---|
| Força principal | Liquidez e cobertura de oferta de aluguel de carro imbativeis (900+ locadoras, 60k pontos) com a marca e o funil de conversao do Booking Holdings. |
| Fraqueza principal | Transparencia de preco e pos-venda ruins (surcharges no balcao, reembolso negado, seguro rejeitado) + foco so na transacao, zero ajuda na decisao/planejamento. |
| Modelo de receita | Markup/merchant sobre tarifa net + comissao de agente + upsell de seguro de franquia proprio (alta margem); parte da receita 'Other' do Booking Holdings. |
| Possui API? | Parcial — sem API publica; Booking.com Demand API (Cars) existe mas e beta e restrita a parceiros aprovados; afiliado padrao so tem deeplink/widget. |
| Possui afiliados? | Sim — RentalcarsConnect via CJ Affiliate e Awin (e Travelpayouts), ~6% por reserva, cookie 30 dias, min ~GBP100. |
| Pode virar parceiro? | Sim — entrar como afiliado RentalcarsConnect (CJ/Awin/Travelpayouts) ja monetiza; parceria profunda exige status de Managed Affiliate/Connectivity Partner do Booking p/ Demand API. |
| Pode pagar comissão? | Sim — paga ~6% CPS ao afiliado que envia a reserva (modelo de revenue share via CJ/Awin). |
| Pode receber tráfego? | Sim — e exatamente o destino ideal: nosso app manda o lead ja decidido (destino+datas+categoria) via deeplink e fatura a comissao. |
| Pode ser integrado? | Parcial — facil via deeplink/widget de afiliado; integracao de dados nativa (precos na nossa UI) so com Demand API Cars aprovada (beta, fechada). |
| **O que precisamos ter p/ superar** | Custo-total realista do carro (com surcharges/combustivel/pedágio/franquia), conselheiro de seguro/depósito com IA, recomendacao de carro casada ao roteiro e super-perfil persistente; tudo terminando num deeplink CJ/Awin que monetiza sem herdar o atrito de pos-venda do Rentalcars. |

## Fontes consultadas
- https://partnerships.booking.com/rentalcarsconnect
- https://www.rentalcars.com/en/affiliate/examples/
- https://www.affpaying.com/rentalcarsconnect
- https://www.travelpayouts.com/en/offers/rentalcars-affiliate-program
- https://developers.booking.com/demand/docs/open-api/demand-api/cars
- https://developers.booking.com/demand/docs/cars/getting-started
- https://www.bookingholdings.com/brands/rentalcars/
- https://www.trustpilot.com/review/www.rentalcars.com
- https://www.trustguide.ai/reviews/rentalcars-com
- https://www.rentalcars.com/protection-information
- https://en.wikipedia.org/wiki/Booking_Holdings
- https://www.businessofapps.com/data/booking-statistics/
- https://www.altexsoft.com/blog/car-rental-apis-integrations-with-gdss-otas-and-tech-providers/
- https://affreborn.com/car-rental-affiliate-programs/
