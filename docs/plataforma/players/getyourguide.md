# GetYourGuide

> **Categoria:** Marketplace de experiencias, tours, atracoes e atividades (OTA de "things to do")
> _Perfil gerado por pesquisa multiagente (jun/2026). Parte do [Relatório de Mercado](../01-relatorio-de-mercado.md) e da [Matriz Competitiva](../02-matriz-competitiva.md)._

## 1. O que faz
Marketplace global que conecta viajantes a operadores locais de passeios, ingressos de atracoes, day tours, transfers e atividades. O viajante busca por destino/data, reserva e paga dentro da plataforma; o operador entrega a experiencia. E o maior player europeu de "things to do", com ~200 mil+ experiencias em ~18 mil destinos, agregadas de ~50 mil parceiros de oferta. Em 2025 ultrapassou ~1 bilhao de euros de receita e ~4 bilhoes de euros de GMV, com 33 milhoes+ de experiencias reservadas.

## 2. Público-alvo
Viajantes de lazer (FIT - independentes) que ja escolheram o destino e querem reservar o que fazer la: turistas urbanos, casais, familias e mochileiros que valorizam reserva facil, cancelamento flexivel e app mobile. Lado B2B: operadores/atracoes que buscam distribuicao, e parceiros de distribuicao (companhias aereas, hoteis, OTAs) que embutem a secao de atividades do GetYourGuide via API/white-label.

## 3. Funcionalidades principais
- Busca por destino, data e categoria de atividade
- Reserva e pagamento integrados (checkout proprio)
- Cancelamento gratuito ate 24h antes na maioria das atividades
- Voucher mobile / app com ingressos (iOS e Android), modo offline
- Skip-the-line / fura-fila para grandes atracoes
- GetYourGuide Originals (experiencias curadas e exclusivas, marca propria)
- Reviews verificadas de quem reservou
- Recomendacoes e ranking de atividades por destino
- Suporte ao cliente multilingue 24/7
- Lado supply: extranet, app de operador, Boost (ads/destaque pago), gestao de disponibilidade e precos
- Distribuicao B2B / white-label para parceiros (secao de atividades embutida)

## 4. Como monetiza
- Comissao sobre cada reserva como receita principal: tipicamente ~20% a 30% do valor da reserva (operadores menores/novos no topo da faixa; parceiros de alto volume negociam menor). Comissao respondeu por ~90% da receita em 2024/inicio 2025
- Modelo predominantemente merchant/agency: GetYourGuide processa o pagamento do viajante e repassa ao operador o valor liquido da comissao
- GetYourGuide Originals: maior revenue share / margem em troca de marca propria e desenvolvimento de produto
- Boost / listagens patrocinadas: operadores pagam para subir no ranking e ganhar visibilidade (modelo de ads de alta margem, melhora ARPU)
- Taxas de distribuicao B2B: powering das secoes de 'tours & activities' de companhias aereas, redes hoteleiras e outras OTAs (white-label/API)
- Em 2025 tentou elevar comissao de alguns operadores ate ~30% citando 'condicoes de mercado'; reverteu varios aumentos apos pushback dos parceiros

## 5. Afiliados
Sim, possui programa de afiliados robusto (Partner Program / partner.getyourguide.com), mas SEM rede in-house publica para a maioria - roda via redes terceiras: Awin (~7% base), Travelpayouts (~8%), TradeDoubler (~5% base). Comissao tipica de afiliado de ~5% a 8% sobre reservas concluidas (pago apenas se a atividade aconteceu; cancelamento = sem pagamento). Janela de cookie de 30 dias (Awin/TradeDoubler) a 31 dias (Travelpayouts), atribuicao last-click. Existe ainda um Travel Agent / Partner Network proprio com ~16% nos 2 primeiros meses caindo para ~8% base. Pagamento mensal; threshold baixo (PayPal sem minimo, transferencia ~US$50 em algumas redes).

## 6. API
Sim - duas familias de API. (1) Partner API (code.getyourguide.com/partner-api-spec, OpenAPI no GitHub getyourguide/partner-api-spec): RESTful, JSON, SSL + token de acesso, para parceiros de distribuicao puxarem catalogo de tours/atividades, disponibilidade, fazer reserva/checkout e cancelamento - acesso mediante aprovacao comercial (nao e self-service aberto). (2) Supplier/Integrator API (integrator.getyourguide.com): para operadores e sistemas de reservas/connectivity partners sincronizarem disponibilidade, precos e deals (notify availability, price over API, list/create/delete deals), rate limit de 1000 req/h por parceiro. Para afiliados menores, a integracao pratica e via deep links e widgets das redes (Awin/Travelpayouts), nao API completa. Nao e GDS; nao usa NDC.

## 7. Programa de parceiros
Multiplos trilhos: (a) Affiliate/Partner Program para criadores de conteudo e publishers (via Awin/Travelpayouts/TradeDoubler, links+widgets); (b) Travel Agent / Partner Network proprio com comissao introdutoria maior (~16% -> 8%); (c) Connectivity/Integrator Program para operadores e reservation systems (Supplier API); (d) Distribuicao B2B/white-label para grandes parceiros (aereas, hoteis, OTAs) embutirem atividades via Partner API. Suporte dedicado, OpenAPI specs publicas e geradores de client (Go, TypeScript, Ruby).

## 8. Dados que oferece
- Catalogo de tours/atividades/ingressos por destino (titulo, descricao, fotos, categorias)
- Disponibilidade por data/horario e por categoria de ticket
- Precos de varejo e deals/descontos
- Politica de cancelamento e duracao
- Reviews e nota agregada (de quem reservou)
- Reserva, voucher e status (criar, confirmar, cancelar) via API de parceiro
- Deep links e widgets de produto/destino para afiliados
- Geolocalizacao da atividade e ponto de encontro

## 9. Dados que NÃO oferece
- Roteiro/itinerario multi-dia montado (nao planeja a viagem, so vende atividades avulsas)
- Custo TOTAL realista da viagem (nao soma voos, hospedagem, alimentacao, transporte local, seguro)
- Voos e hospedagem (fora do escopo - so experiencias)
- Comparacao entre DESTINOS (compara atividades dentro de um destino, nao 'Peru vs Tailandia')
- Perfil persistente do viajante / super-perfil de preferencias
- Recomendacao orcamentaria (o que cabe no meu budget de viagem inteira)
- Dados de orcamento diario/por categoria de gasto
- Planejamento de logistica entre cidades/dias
- Feed de precos de voos ou cambio

## 10. Pontos fortes
- Maior inventario de experiencias da Europa e um dos maiores do mundo (~200k+ atividades, ~18k destinos, ~50k operadores)
- Marca forte e topo de funil em 'things to do', com forte SEO e app bem avaliado
- GetYourGuide Originals: produto exclusivo e de margem alta, dificil de replicar
- Cancelamento flexivel (24h) e checkout mobile com voucher offline - alta confianca de conversao
- Profissionalismo de distribuicao: APIs maduras, OpenAPI publica, white-label B2B para aereas/hoteis
- Profitabilidade (EBITDA ajustado positivo) e escala financeira (~1B euro receita, ~4B euro GMV)
- Programa de afiliados acessivel via redes consolidadas (Awin/Travelpayouts) com widgets e deep links prontos

## 11. Pontos fracos
- Foco estreito: vende atividades avulsas, nao planeja a viagem nem da custo total - nao retem o viajante na fase de decisao
- Comissao alta para operadores (20-30%) gera atrito e tentativas recentes de aumento mal recebidas (mid-2025)
- Qualidade desigual dos parceiros: cancelamentos de ultima hora e experiencias entregues por terceiros sem controle total
- Suporte ao cliente criticado quando a reserva da problema (esconde-se atras da politica de cancelamento)
- Comissao de afiliado relativamente baixa (5-8%) e atribuicao last-click - margem fina para quem manda trafego
- Sem personalizacao real nem IA de planejamento; descoberta ainda baseada em ranking/destaque pago (Boost)
- Dependencia de redes terceiras para afiliados (sem programa in-house aberto) limita controle do publisher

## 12. Reclamações comuns dos usuários
- Reembolsos demorados (ate ~5 dias uteis) ou negados apos prometidos; viajante fica sem o dinheiro e sem alternativa
- Tours cancelados pelo operador 1 dia antes (relatos de 2-3 atividades canceladas vespera, ex. Marrakech)
- Suporte ao cliente ineficaz e sem disposicao real para resolver quando a reserva falha
- Cobranca em duplicidade (ex. familia em Roma cobrada duas vezes)
- Voucher para local que estava fechado na hora do uso (ex. lounge no Changi/Singapura, nov/2025) sem solucao
- Recusa de reembolso mesmo com problema de seguranca do operador (ex. barco que havia capotado, ago/2025)
- Nota media morna em agregadores (relatos de ~2.5/5 em alguns sites de review), refletindo inconsistencia operacional

## 13–19. Limitações
| Eixo | Limitação |
|---|---|
| **UX** | UX de e-commerce transacional e eficiente para reservar UMA atividade, mas pobre para PLANEJAR: nao existe visao de viagem, calendario consolidado ou montagem de roteiro. Descoberta e empurrada por ranking e listagens pagas (Boost), nao por adequacao ao viajante. Quando algo da errado, o fluxo de suporte e burocratico e frustrante (reclamacoes recorrentes). |
| **Personalização** | Personalizacao rasa: recomendacoes por popularidade/destino e ads, sem super-perfil persistente do viajante (estilo, ritmo, restricoes, orcamento, com quem viaja). Nao aprende preferencias entre viagens nem adapta sugestoes ao contexto da viagem inteira - trata cada sessao como uma compra isolada. |
| **IA** | IA voltada a relevancia de busca, ranking e operacoes, nao a planejamento conversacional. Nao ha um assistente que monte itinerario, justifique escolhas, encaixe atividades em dias/horarios ou otimize por orcamento e logistica. A 'inteligencia' serve a conversao de catalogo, nao a decisao de viagem do usuario. |
| **Roteirização** | Praticamente inexistente: o produto vende atividades soltas e nao gera itinerario multi-dia, nao sequencia por proximidade geografica, horario de funcionamento ou deslocamento entre pontos. Cabe ao viajante montar manualmente a agenda; o GetYourGuide nao conhece o resto da viagem (voos, hotel, cidades, datas). |
| **Orçamento** | So mostra o preco da atividade. Nao calcula custo TOTAL realista da viagem (voos + hospedagem + alimentacao + transporte local + atividades + seguro), nao tem modo orcamento, nem responde 'o que cabe em X reais'. O viajante nao tem nocao de quanto a soma das experiencias pesa no orcamento global. |
| **Comparação** | Compara atividades DENTRO de um destino, mas nao compara DESTINOS entre si (ex. custo/experiencia de Peru vs Tailandia vs Portugal). Nao ajuda na decisao de PARA ONDE ir - assume que o destino ja foi escolhido. Falta visao de trade-off destino x orcamento x estilo, que e justamente o topo de funil de decisao. |
| **Integração** | Boa para INTEGRAR atividades no nosso app: Partner API RESTful (catalogo, disponibilidade, reserva, cancelamento) + afiliado via Awin/Travelpayouts com deep links e widgets. Limitacoes: Partner API completa depende de aprovacao comercial (nao self-service); afiliado tipico fica em deep link/widget com comissao 5-8% last-click; cobre apenas experiencias (nao voos/hotel), entao precisamos de outras  |

## 20. Oportunidades para superá-lo
- Ser a camada de DECISAO e PLANEJAMENTO que o GetYourGuide nao e: roteiro IA multi-dia que sequencia atividades por geografia/horario e injeta os produtos deles via deep link (eles viram fornecedor, nos a interface)
- Mostrar custo TOTAL realista da viagem (voos+hotel+comida+transporte+atividades) - eles so mostram o preco da atividade isolada
- Comparar DESTINOS (Peru vs Tailandia vs Portugal) por custo/estilo/clima antes de o viajante escolher - eles assumem destino ja escolhido
- Super-perfil persistente do viajante que aprende entre viagens e personaliza - eles tratam cada compra como sessao isolada
- Resgatar a confianca onde eles falham: curadoria de operadores confiaveis, transparencia de politica de reembolso e visibilidade de risco de cancelamento
- Monetizar o mesmo inventario via afiliado (Awin/Travelpayouts ~8%) sem assumir o atrito de comissao alta do operador nem o suporte pos-venda
- Descoberta por adequacao ao perfil/orcamento em vez de ranking pago (Boost) - sugestao honesta vence a vitrine patrocinada deles

---

## Matriz (visão Mundo Sem Fim)
| Critério | Avaliação |
|---|---|
| Força principal | Maior inventario de experiencias/tours da Europa e um dos maiores do mundo (~200k+ atividades, ~18k destinos, ~50k operadores), marca forte em 'things to do', app e checkout de alta conversao, e GetYourGuide Originals exclusivo. |
| Fraqueza principal | So vende atividade avulsa: nao planeja a viagem, nao da custo total, nao compara destinos, nao personaliza por perfil - abandona o viajante em toda a fase de DECISAO, que e onde nosso app vive. |
| Modelo de receita | Comissao de ~20-30% sobre cada reserva do operador (merchant/agency, ~90% da receita) + GetYourGuide Originals (margem maior) + Boost/listagens patrocinadas + taxas de distribuicao B2B/white-label. |
| Possui API? | Sim - Partner API RESTful (catalogo, disponibilidade, reserva, cancelamento; token+SSL; OpenAPI publica) mediante aprovacao comercial, alem da Supplier/Integrator API para operadores. Nao e GDS/NDC. |
| Possui afiliados? | Sim, mas via redes terceiras (sem programa in-house aberto): Awin ~7%, Travelpayouts ~8%, TradeDoubler ~5%; cookie 30-31 dias, last-click, pago so se a atividade aconteceu. |
| Pode virar parceiro? | Sim - como afiliado imediatamente (Awin/Travelpayouts: deep links + widgets) e, com escala, como parceiro de distribuicao via Partner API (catalogo+booking embutido) ou Travel Agent Network proprio (~16%->8%). |
| Pode pagar comissão? | Sim - nos pagaria ~5-8% por reserva referida (afiliado) ou comissao de agente (~8% base, ~16% intro); modelo last-click, sem pagamento se houver cancelamento. |
| Pode receber tráfego? | Sim - e um destino natural para mandarmos trafego/leads qualificados (viajante que ja decidiu destino+datas no nosso planejador e quer reservar a atividade), capturando comissao de afiliado. |
| Pode ser integrado? | Sim (parcial) - via affiliate deep link/widget (rapido, ~5-8% last-click) ou via Partner API (catalogo+disponibilidade+booking, mas requer aprovacao comercial e cobre so experiencias, nao voos/hotel). |
| **O que precisamos ter p/ superar** | Roteirizacao IA multi-dia com sequenciamento por geografia/horario que consome o catalogo deles via deep link; calculo de custo TOTAL realista (voos+hotel+comida+transporte+atividades); comparador de DESTINOS; super-perfil persistente do viajante; e curadoria/transparencia de confiabilidade do operador (onde eles mais falham). Assim nos viramos a camada de decisao e eles, o fornecedor de inventari |

## Fontes consultadas
- https://www.thetraveler.org/the-business-model-behind-getyourguide-explained/
- https://businessmodelhub.in/getyourguide-business-model-how-it-makes-money/
- https://arival.travel/article/getyourguide-commission-increasing-for-some-operators/
- https://supply.getyourguide.support/hc/en-us/articles/30401036915229-Understanding-the-New-Commission-Breakdown-System
- https://www.xola.com/articles/an-overview-to-getyourguide-for-tours-and-attractions/
- https://partner.getyourguide.com/
- https://affiliate.watch/affiliate/getyourguide
- https://www.affpaying.com/getyourguideaffiliateprogram
- https://getlasso.co/affiliate/get-your-guide/
- https://ui.awin.com/merchant-profile/18925
- https://code.getyourguide.com/partner-api-spec/
- https://github.com/getyourguide/partner-api-spec
- https://integrator.getyourguide.com/documentation/overview
- https://supply.getyourguide.support/hc/en-us/articles/14150246193181-API-Features-and-Functionalities
- https://www.getyourguide.press/blog/milestone-from-getyourguide-getyourguide-is-profitable----on-an-adjusted-ebitda-basis----and-has-been-for-the-past-year-with-revenue-approaching-eu1-billion-for-the-last-12-full-months
- https://www.webintravel.com/getyourguide-first-experiences-platform-to-hit-e1b-in-revenue/
- https://www.trustpilot.com/review/www.getyourguide.com
- https://getyourguide.pissedconsumer.com/reviews/RT-P.html
- https://www.smartcustomer.com/reviews/getyourguide.com
