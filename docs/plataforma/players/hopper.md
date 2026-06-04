# Hopper

> **Categoria:** Previsao de preco / OTA mobile (app de busca e reserva de voos, hoteis, casas e carros) com forte camada de fintech de viagem; opera tambem como plataforma B2B via HTS (Hopper Technology Solutions)
> _Perfil gerado por pesquisa multiagente (jun/2026). Parte do [Relatório de Mercado](../01-relatorio-de-mercado.md) e da [Matriz Competitiva](../02-matriz-competitiva.md)._

## 1. O que faz
Hopper e um app mobile-first (iOS/Android) que usa IA e dados historicos de preco para prever se a tarifa de um voo ou hotel vai subir ou cair e recomendar "compre agora" ou "espere". Vende voos, hoteis, casas e aluguel de carro e ganha a maior parte do dinheiro vendendo produtos de fintech de viagem (Price Freeze, Cancel for Any Reason, Price Drop Protection, Disruption Assistance). Desde ~2023 pivotou fortemente para B2B: a divisao HTS licencia sua tecnologia de precificacao, agencia de viagem e fintech para bancos, cias aereas e OTAs (Capital One Travel, Air Canada, WestJet, Nubank, Uber, Trip.com etc.).

## 2. Público-alvo
B2C: viajante de lazer millennial/Gen-Z, sensivel a preco, mobile-first, principalmente EUA/Canada (operacoes B2C em outras regioes como APAC foram cortadas em 2024). Compra avulsa, raramente fideliza a uma cia aerea. B2B (HTS): bancos, fintechs, cias aereas e OTAs que querem adicionar busca de viagem e produtos de fintech ao proprio canal/app sem construir do zero.

## 3. Funcionalidades principais
- Previsao de preco de voos/hoteis com recomendacao comprar vs esperar e alertas de queda
- Price Freeze: congela a tarifa por ate ~20 dias pagando um deposito (com teto de cobertura)
- Cancel for Any Reason (CFAR) e Disruption Assistance for Any Reason (atraso/cancelamento/bagagem)
- Price Drop Protection: reembolsa parte se o preco cair apos a compra
- Watch a trip: monitora rota/datas e notifica o melhor momento
- Carpet bombing de notificacoes push com ofertas e flash sales
- Carrot Cash / cashback in-app que incentiva recompra dentro do app
- Busca e reserva de hoteis, casas (homes) e aluguel de carro, alem de voos
- HTS Assist: agente de IA generativa para atendimento de viagem (B2B)
- Gamificacao e descontos por acoes sociais/indicacao no app

## 4. Como monetiza
- Fintech ancillaries = principal fonte: mais de 70% da receita vem de Price Freeze, CFAR, Disruption Assistance e Price Drop Protection (margem alta, vendidos como add-on no checkout)
- Comissao de agencia sobre voos: tipicamente ~1-4% do bilhete (modelo de agencia/merchant; airfare e quase commodity de baixa margem, usado como isca para vender fintech)
- Comissao/markup sobre hoteis, casas e carros (margens maiores que voos)
- Receita B2B/SaaS-like via HTS: licenciamento de tecnologia + revenue-share sobre fintech vendida nos canais dos parceiros (banco/cia aerea) — segmento que cresceu ~40% a.a. em 2024
- Publicidade/co-marketing e promocoes patrocinadas dentro do app
- Carrot Cash como mecanismo de retencao (nao receita direta, mas trava o cliente no ecossistema)
- Receita total ~US$ 850 mi em 2024 (+21%), ~US$ 7,5 bi em gross bookings

## 5. Afiliados
Sim, possui programa de afiliados para o app de viagem, operado principalmente via CJ Affiliate (Commission Junction), tambem distribuido por agregadores como FlexOffers. Comissao tipica baixa: cerca de 2%-5% por venda (frequentemente citado como ~US$ 2-3 por reserva), cookie de ~30 dias, payout mensal com minimo ~US$ 50. ATENCAO: nao confundir com "Hopper HQ" (hopperhq.com), que e uma ferramenta de agendamento de Instagram sem relacao — esse "Hopper HQ" tem programa proprio com comissao alta, mas NAO e o app de viagem. Para o viajante, a comissao real do Hopper de viagem e modesta e voltada a criadores/blogs.

## 6. API
Nao tem API publica aberta de afiliado/desenvolvedor. A integracao seria via HTS (Hopper Technology Solutions): API/SDK de parceiro B2B (white-label e embarcado) que expoe busca/booking de voos, hoteis, carros, pacotes (HTS Stays, HTS Cars, HTS Packages), as fintech ancillaries (Price Freeze, CFAR, Disruption Assistance) e o agente HTS Assist. Acesso e por contrato/parceria comercial (request a demo), tipicamente para bancos/cias/OTAs de grande porte — nao e self-serve nem documentacao publica. Conexao a oferta usa GDS/NDC e agregadores nos bastidores (parcerias com Amadeus, Expedia/Travelport), mas isso nao e exposto como API aberta a terceiros pequenos.

## 7. Programa de parceiros
Dois trilhos. (1) HTS (B2B core): parcerias estrategicas de tecnologia/fintech com bancos e cias — Capital One (Capital One Travel; em 2025 a Capital One contratou/absorveu parte do time que construiu o portal), Air Canada, WestJet, Porter, Wizz Air, Frontier, Virgin Australia, AirAsia MOVE, Uber, Nubank, SMBC/SMCC, Trip.com, Tripadvisor, Kayak/Expedia. Modelo de revenue-share + licenciamento. (2) Afiliados/creators (B2C): via CJ Affiliate, baixa comissao, marketing materials e tracking padrao. Nao ha um nivel intermediario simples para um app de planejamento independente plugar com economia atraente — ou voce e parceiro HTS de grande porte, ou e afiliado CJ de baixa comissao.

## 8. Dados que oferece
- Sinal de previsao de preco (subir/cair) e recomendacao comprar vs esperar por rota/data
- Historico e tendencia de preco de voos e hoteis
- Disponibilidade e tarifa de voos, hoteis, casas e carros (no app/parceiro)
- Produtos de fintech/protecao precificados por viagem (premio do Price Freeze, CFAR etc.)
- Datas mais baratas para viajar (calendario de precos)
- Alertas/notificacoes de queda de preco

## 9. Dados que NÃO oferece
- Roteiro de viagem dia a dia / itinerario de atividades
- Custo total realista da viagem (alimentacao, transporte local, passeios, seguro, cambio) — so cobre o componente reservavel
- Comparacao estruturada entre destinos diferentes para decisao (cidade A vs cidade B por orcamento/perfil)
- Recomendacao de destino com base em perfil/gosto do viajante
- Conteudo de experiencias, atracoes, cultura, seguranca, visto, clima por destino
- Planejamento colaborativo em grupo / multi-viajante
- Dados abertos via API para apps independentes de planejamento construirem em cima

## 10. Pontos fortes
- Marca forte em previsao de preco e percepcao de economia (claim de ~US$ 65 economizados por viagem)
- Maquina de fintech de viagem de altissima margem (70%+ da receita) que poucos concorrentes replicam
- Base de dados massiva de precos historicos alimentando os modelos de IA
- Pivot B2B (HTS) bem-sucedido: vira fornecedor de infra de viagem para bancos/cias, receita recorrente
- Distribuicao via gigantes (Capital One, Nubank, Uber) da escala que app proprio nao alcanca
- Experiencia mobile polida, gamificada e com forte retencao (Carrot Cash, push, flash sales)
- Escala financeira: ~US$ 7,5 bi em bookings, ~US$ 850 mi receita 2024

## 11. Pontos fracos
- Reputacao de atendimento ruim: suporte via chatbot, dificil falar com humano, reembolsos demorados (meses)
- Pratica recorrente de devolver em credito de viagem/credito de cia em vez de dinheiro no cartao
- Letra miuda dos produtos fintech (ex.: Price Freeze cobre so ate US$ 100 de alta) gerou acao coletiva por propaganda enganosa
- Voos sao isca de baixa margem; modelo depende de empurrar add-ons, o que irrita parte dos usuarios
- Notificacoes push agressivas/spam percebidas como pressao de venda
- Recuou em B2C fora da America do Norte (cortou times APAC e hotel direto em 2024; multiplas rodadas de layoff)
- Foco crescente em B2B pode esvaziar inovacao e suporte no app B2C
- Sem nenhuma camada de planejamento/decisao de viagem — e ferramenta de transacao, nao de inspiracao

## 12. Reclamações comuns dos usuários
- Reembolso confirmado mas nunca pago; respostas copia-e-cola por meses sem resolucao (Trustpilot)
- Recebeu credito de viagem/credito de cia aerea em vez de reembolso em dinheiro, mesmo tendo pago seguro de cancelamento (Reddit)
- Price Freeze: preco subiu US$ 500 e o app so cobriu US$ 100 por causa do teto na letra miuda
- Hotel congelado aparece como esgotado na hora de reservar, mesmo havendo quartos
- Cobranca/recusa de cancelamento dizendo ser nao-reembolsavel apos uso do freeze, oferecendo so 1/3 de volta
- Atendimento considerado o pior ja visto; so chatbot, sem canal humano efetivo
- Demora de ~2 meses para creditos/reembolsos chegarem

## 13–19. Limitações
| Eixo | Limitação |
|---|---|
| **UX** | UX mobile e bonita e fluida, mas otimizada para conversao e venda de add-ons, nao para decisao informada. O usuario e bombardeado com push e flash sales (percepcao de spam/pressao). A letra miuda dos produtos de protecao e escondida atras de "More Information", gerando frustracao e acao judicial. Suporte e quase 100% chatbot, sem caminho claro para humano — pessimo no pos-venda. Nao ha experiencia |
| **Personalização** | Personalizacao e rasa e centrada no produto financeiro, nao no viajante. O app reage a rotas/datas que voce busca e empurra fintech relevante aquela compra, mas nao constroi um perfil rico de gosto, estilo de viagem, restricoes (orcamento total, com criancas, mochilao vs luxo) nem recomenda destinos sob medida. Nao ha "super-perfil" do viajante que persista e oriente decisoes amplas — apenas histó |
| **IA** | A IA do Hopper e estreita: prediz preco (subir/cair) e otimiza quando vender add-ons e quando notificar — e excelente nisso. O novo HTS Assist e IA generativa, mas voltada a atendimento/servicing B2B, nao a planejar viagem para o consumidor. Nao ha IA que monte roteiro, raciocine sobre orcamento total, compare destinos por perfil ou inspire. E IA de pricing e conversao, nao IA de planejamento e de |
| **Roteirização** | Inexistente. Hopper nao monta itinerario, nao sugere o que fazer no destino, nao organiza dias, atracoes, logistica local ou ordem de cidades. Trata cada reserva (voo, hotel, carro) como item isolado de checkout. Quem usa Hopper ainda precisa de outra ferramenta para planejar a viagem em si — exatamente a lacuna que um app de roteiro por IA ocupa. |
| **Orçamento** | So enxerga o componente reservavel (passagem, diaria, carro) e o premio dos produtos de protecao. Nao calcula custo total realista da viagem: alimentacao, transporte local, passeios/ingressos, seguro, cambio, gorjetas, taxas de turismo. O foco em "economia" e sobre a tarifa, nao sobre o gasto real do viajante no destino. Nao ha modo orcamento que diga "essa viagem cabe em X reais no total". |
| **Comparação** | Compara precos da MESMA viagem ao longo do tempo (vai subir/cair) e entre datas — muito bem. Mas nao compara DESTINOS diferentes entre si para apoiar a decisao (ex.: Peru vs Tailandia para o seu orcamento e perfil). Falta a camada de decisao "para onde ir": Hopper assume que voce ja decidiu o destino e so quer a melhor tarifa. Comparacao e tatica (quando comprar), nao estrategica (o que/onde escol |
| **Integração** | Para um app pequeno/independente a integracao e dificil e pouco vantajosa. Nao existe API publica self-serve; o caminho de receita decente (HTS) exige ser parceiro corporativo de grande porte sob contrato. O unico caminho acessivel e o afiliado via CJ, de comissao baixa (~2-5% / US$ 2-3 por reserva) e cookie curto (30 dias), o que monetiza mal um trafego de planejamento de alto valor. Ou seja: dif |

## 20. Oportunidades para superá-lo
- Ser a camada de DECISAO e PLANEJAMENTO que falta no Hopper: roteiro por IA + custo total realista, capturando o usuario antes da reserva (topo do funil que o Hopper nao tem)
- Custo total honesto da viagem (com comida, transporte local, passeios, cambio) vs a 'economia' rasa do Hopper sobre a tarifa
- Comparacao estrategica de destinos por perfil/orcamento (para onde ir), enquanto o Hopper so faz comparacao tatica (quando comprar)
- Transparencia radical em taxas/protecoes — anti letra-miuda — explorando a ma reputacao do Price Freeze e dos reembolsos do Hopper
- Suporte humano de verdade no pos-venda, contrastando com o chatbot frustrante e os reembolsos de 2 meses que geram reclamacoes
- Super-perfil persistente do viajante que recomenda e personaliza, algo que o Hopper (focado em pricing/retargeting) nao oferece
- Roteirizacao e planejamento em grupo/colaborativo, terreno totalmente vago no Hopper

---

## Matriz (visão Mundo Sem Fim)
| Critério | Avaliação |
|---|---|
| Força principal | Previsao de preco com IA + maquina de fintech de viagem de altissima margem (Price Freeze, CFAR, Price Drop) que responde por 70%+ da receita, distribuida em escala via parceiros (Capital One, Nubank, Uber) atraves do HTS. |
| Fraqueza principal | Nao tem nenhuma camada de planejamento/decisao de viagem (roteiro, destino, custo total) e carrega reputacao ruim de pos-venda: reembolsos lentos, devolucao em credito, letra miuda do Price Freeze (acao coletiva) e suporte so via chatbot. |
| Modelo de receita | Agencia/merchant: comissao baixa em voos (~1-4%) usada como isca + venda de fintech ancillaries de alta margem (70%+ da receita) + revenue-share/licenciamento B2B via HTS. Receita ~US$ 850 mi (2024). |
| Possui API? | Parcial — sem API publica/self-serve; integracao real so via HTS (API/SDK de parceiro B2B sob contrato) usando GDS/NDC nos bastidores. Para terceiros pequenos, na pratica nao. |
| Possui afiliados? | Sim — via CJ Affiliate (Commission Junction), comissao baixa ~2-5% / US$ 2-3 por reserva, cookie 30 dias, payout mensal min. US$ 50. (Nao confundir com 'Hopper HQ', tool de Instagram.) |
| Pode virar parceiro? | Sim, dois caminhos: (a) afiliado CJ imediato e self-serve, porem mal pago para trafego de planejamento; (b) parceiro HTS, com fintech embarcada e revenue-share melhor, mas exige escala/contrato corporativo — barreira alta no inicio. |
| Pode pagar comissão? | Sim, mas pouco no canal acessivel: ~2-5% (≈US$ 2-3/reserva) via CJ. Via HTS o revenue-share sobre fintech seria bem maior, porem gated por contrato B2B. Conclusao: monetiza mal nosso lead a menos que vire parceiro HTS. |
| Pode receber tráfego? | Sim — Hopper e um excelente destino de conversao para a etapa 'comprar voo/hotel agora'. Mandamos o usuario apos ele decidir destino, orcamento e roteiro no nosso app, capturando comissao no handoff. |
| Pode ser integrado? | Parcial — via afiliado/deeplink CJ (facil, baixa receita) ou via HTS API/SDK (rica: busca + fintech embarcada, mas so como parceiro corporativo). Sem caminho intermediario simples e bem remunerado. |
| **O que precisamos ter p/ superar** | Precisamos do que o Hopper nao tem e dominar bem a transicao para reserva: (1) roteiro por IA + custo total realista + comparacao de destinos como nosso core de decisao; (2) sinal de 'melhor hora de comprar'/alerta de preco proprio ou agregado para nao perder essa forca dele; (3) transparencia total de taxas e suporte humano para vencer pela confianca onde ele falha; (4) handoff de reserva fluido  |

## Fontes consultadas
- https://www.businessofapps.com/data/hopper-statistics/
- https://en.wikipedia.org/wiki/Hopper_(company)
- https://hts.hopper.com/
- https://www.futuretravelexperience.com/company/hopper-technology-solutions/
- https://media.hopper.com/news/airasia-move-and-hts-announce-new-partnership-to-integrate-fintech
- https://electroiq.com/stats/hopper-statistics/
- https://hotelagio.com/hopper-statistics/
- https://canvasbusinessmodel.com/blogs/growth-strategy/hopper-growth-strategy
- https://www.flexoffers.com/affiliate-programs/hopper-affiliate-program/
- https://linkclicky.com/affiliate-program/hopper/
- https://www.trustpilot.com/review/hopper.com
- https://hopper.pissedconsumer.com/reviews/RT-P.html
- https://topclassactions.com/lawsuit-settlements/travel/hopper-class-action-lawsuit-alleges-apps-price-freeze-feature-misleading/
- https://www.classaction.org/news/hoppers-price-freeze-tool-comes-with-a-hidden-catch-class-action-claims
- https://skift.com/2024/11/22/hopper-restructures-with-job-cuts-for-the-second-time-in-a-year/
- https://www.phocuswire.com/Hopper-job-cuts-travel-platform
- https://betakit.com/hopper-restructures-again-following-renewal-of-expedia-partnership/
- https://finance.yahoo.com/news/capital-one-payout-acquire-hopper-155500621.html
- https://www.travelweekly.com/Power-List-2024/Hopper
