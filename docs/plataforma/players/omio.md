# Omio

> **Categoria:** Transporte terrestre multimodal (trem + onibus + ferry) com flights agregados; OTA/agregador com camada de distribuicao B2B (API + white-label)
> _Perfil gerado por pesquisa multiagente (jun/2026). Parte do [Relatório de Mercado](../01-relatorio-de-mercado.md) e da [Matriz Competitiva](../02-matriz-competitiva.md)._

## 1. O que faz
Omio (ex-GoEuro, sede em Berlim) e um agregador e OTA de transporte que permite buscar, comparar e comprar passagens de trem, onibus, ferry e voo em mais de 3.000 operadores na Europa, America do Norte, Asia e alem, num so checkout. Comprou a Rome2rio (2019), que alimenta a busca multimodal "de A a B". Alem do app/site B2C, opera um braco B2B forte que distribui esse inventario via API e white-label para Uber, Google, KAYAK, TUI, LNER, easyGroup/easyTrain e outros. Em abril/2026 lancou checkout dentro do ChatGPT.

## 2. Público-alvo
Viajante internacional/intra-Europa que precisa cruzar fronteiras por terra (mochileiro, turista, viagem a lazer e corporativo leve), tipicamente que nao conhece os operadores locais de cada pais e prefere um so app/idioma/moeda/pagamento. Forte em rotas Europa Ocidental e cada vez mais EUA (Amtrak, Greyhound, FlixBus) e Asia (lancou Japao em mar/2026). No B2B: OTAs, super-apps de mobilidade, operadoras ferroviarias e agencias que querem oferecer transporte terrestre sem construir as integracoes.

## 3. Funcionalidades principais
- Busca multimodal A-a-B comparando trem, onibus, ferry e voo lado a lado (motor herdado da Rome2rio)
- Compra/emissao de bilhete dentro do proprio Omio (mobile ticket / QR no app) para muitos operadores
- Cobertura de 3.000+ operadores em Europa, EUA, Asia (DB, SNCF, Trenitalia, Renfe, FlixBus, Amtrak, Greyhound, Eurostar, ferries via Direct Ferries Connect)
- App iOS/Android com bilhete offline, alertas e gestao da viagem
- Omio Flex / bilhetes flexiveis e add-ons pagos (reserva de assento, seguro, bagagem, embarque prioritario)
- Plataforma em 12+ idiomas com pagamento e moeda local
- Camada B2B: Booking API plug-and-play, white-label e widgets de afiliado
- Lancamento de compra conversacional dentro do ChatGPT (abr/2026)

## 4. Como monetiza
- Comissao dos operadores de transporte por bilhete vendido (receita principal; % varia por operador e modal, geralmente maior em onibus/trem)
- Service fee cobrado do consumidor pela intermediacao (varia por trip, plataforma desktop/app, datas)
- Booking rate cobrado do consumidor pela busca/combinacao/processamento (pode incidir junto com o service fee)
- Add-ons/ancillaries: assento, seguro (Omio Flex), bagagem, embarque prioritario
- Publicidade/posicionamento pago: operadores pagam por mais visibilidade na plataforma
- B2B/distribuicao: receita de API e white-label (fee de tecnologia + margem sobre inventario) com parceiros como Uber, KAYAK, Google, TUI
- Receita ~US$ 64,5M em 2025 (vs US$ 38,1M em 2024), time ~464 pessoas, ~27M usuarios/mes

## 5. Afiliados
Sim. Programa proprio (omio.com/affiliate) com banners, widgets customizaveis, deeplinks e uma search API; e tambem distribuido por redes terceiras. Via Travelpayouts: revenue-share de 6% do valor da reserva, cookie de 30 dias, ticket medio ~US$81, eCPC ~US$0,07 (Deutsche Bahn excluido de cashback/desconto). Tambem aparece via Impact e redes regionais (Admitad, InvolveAsia). Faixa reportada por terceiros vai de ~2% a 8% conforme mercado/ROI; modelo 100% performance (CPA/rev-share). Nao ha evidencia de uso de Awin/CJ/Partnerize como rede principal.

## 6. API
Sim, robusta e estrategica. Booking API plug-and-play (parceiro pode virar merchant of record e gerenciar pagamento/checkout no proprio ambiente) + Search/Content API + solucoes White-Label de marca. Da acesso a 3.000+ operadores (trem/onibus/ferry/voo). Tecnologia ja usada por Uber, Google, KAYAK, TUI, LNER, easyGroup/easyTrain, Iryo Conecta. Nao e GDS classico nem NDC de cia aerea: e agregacao propria de rail/bus/ferry (inclui Direct Ferries Connect para ferries). Acesso e B2B sob contrato, nao API publica self-service.

## 7. Programa de parceiros
Dois trilhos. (1) Afiliado/redirecionamento (omio.com/affiliate + Travelpayouts/Impact): manda trafego, ganha comissao, Omio fica como merchant. (2) B2B "Omio for Business / Omio B2B": Booking API e White-Label onde o parceiro embute inventario sob sua propria marca e pode ser o merchant of record. Modelo de distribuicao tipo supplier-of-transport: ganha presenca em super-apps de mobilidade e OTAs (Uber, KAYAK, Google Travel, TUI live abr/2026, easyTrain fim de 2025).

## 8. Dados que oferece
- Opcoes de rota A-a-B multimodais (trem/onibus/ferry/voo) com horarios, duracao e numero de baldeacoes
- Precos por operador e por classe/tarifa, incluindo tarifas flexiveis
- Disponibilidade e compra/emissao real de bilhete (nao so redirect)
- Cobertura de operador por pais/cidade e estacoes/terminais
- Add-ons e regras de bilhete (assento, bagagem, flex)
- Via API: conteudo de inventario, busca, booking e ticketing para 3.000+ operadores

## 9. Dados que NÃO oferece
- Roteiro de viagem dia-a-dia (so o trecho de transporte, nao o que fazer no destino)
- Custo total realista da viagem (hospedagem, alimentacao, atracoes, cambio) — so o preco do transporte
- Comparacao de DESTINOS (decidir 'para onde ir'); assume que o usuario ja sabe origem e destino
- Recomendacao personalizada por perfil/orcamento do viajante
- Hospedagem, tours, atividades, aluguel de carro de forma integrada ao roteiro
- Transparencia previa e estavel do fee total antes de iniciar a busca (so revela no checkout)
- Sinal de qualidade/confiabilidade do operador (atrasos, reputacao) de forma estruturada

## 10. Pontos fortes
- Maior profundidade de inventario terrestre multimodal da Europa (trem+onibus+ferry) num so lugar, dificil de replicar
- Compra e emissao reais no app, com bilhete/QR e pagamento/idioma local — nao so comparador
- Motor multimodal A-a-B da Rome2rio integrado (autoridade em 'como ir de X a Y')
- Marca e SEO fortes em travel-tech europeu, ~27M usuarios/mes
- Camada B2B/API que ja virou infraestrutura de transporte de Uber, Google, KAYAK, TUI — distribuicao alem do proprio app
- Expansao agressiva 2025-2026: EUA, Japao, ferries (Direct Ferries), checkout no ChatGPT

## 11. Pontos fracos
- Service fee + booking rate deixam o preco frequentemente acima da compra direta no operador; pouca transparencia ate o checkout
- Atendimento ao cliente muito mal avaliado: reembolsos lentos/negados, empurra responsabilidade para o operador, suporte por chatbot que anda em circulos
- Em cancelamento/atraso do operador, Omio se exime e manda o cliente resolver com a transportadora
- Casos de cobranca dupla/indevida e bilhete 'nao reembolsavel apos download' mesmo em tarifa flex
- E camada de transacao de transporte, nao de PLANEJAMENTO: nao decide destino, nao monta roteiro, nao calcula custo total
- Reembolso muitas vezes so em voucher, nao em dinheiro; espera de ~15 dias relatada

## 12. Reclamações comuns dos usuários
- 'Paguei tarifa reembolsavel, cancelei com antecedencia e disseram que nao reembolsa porque o bilhete foi baixado'
- 'Zero suporte humano — so bots que te mandam em circulos; ninguem responde email/telefone'
- 'Omio lava as maos quando o trem e cancelado e manda resolver com a ferroviaria, que manda de volta pra Omio'
- 'Taxas escondidas — sai mais caro que comprar direto no operador'
- 'App bugou e cobrou meu cartao por bilhetes que eu nao comprei / cobranca dupla'
- 'So devolvem em voucher, nunca em dinheiro; reembolso demora ~15 dias de proposito'
- Trustpilot/PissedConsumer com forte concentracao de avaliacoes baixas sobre reembolso e billing

## 13–19. Limitações
| Eixo | Limitação |
|---|---|
| **UX** | Fluxo de compra do trecho e eficiente, mas a UX e centrada na TRANSACAO de um trecho, nao na jornada. O usuario so chega ao Omio depois de ja ter decidido origem, destino e datas — nao ha apoio a decisao. Pior ponto: fee total (service fee + booking rate) so aparece tarde, no checkout, gerando sensacao de bait; e o pos-venda (reembolso/cancelamento) e onde a UX desaba. |
| **Personalização** | Praticamente nula. Nao ha super-perfil do viajante: nao considera orcamento, estilo (conforto vs barato), tolerancia a baldeacao, preferencia de modal, mobilidade, viagem com criancas etc. Resultados sao os mesmos para qualquer pessoa na mesma rota; ordenacao por preco/tempo, sem recomendacao baseada em quem e o viajante. |
| **IA** | IA aplicada a operacao (busca/ranking) e agora a um checkout conversacional no ChatGPT (abr/2026), mas nao ha IA de planejamento: nao gera roteiro, nao raciocina sobre trade-offs de custo/tempo/experiencia, nao explica 'por que esse trajeto faz sentido pra voce'. O uso mais visivel de IA no atendimento (chatbot) e justamente a maior fonte de reclamacao. |
| **Roteirização** | Faz roteirizacao de transporte ponto-a-ponto (A-a-B, incluindo multi-trecho via Rome2rio), mas nao faz roteiro de VIAGEM: nao encadeia varios destinos numa sequencia logica de dias, nao otimiza ordem de cidades, nao integra hospedagem/atividades, nao monta itinerario de N dias. Resolve 'como ir de X a Y', nao 'que itinerario de 12 dias eu faco pela Europa'. |
| **Orçamento** | So mostra o custo do transporte (e ainda com fee revelado tarde). Nao calcula custo TOTAL realista da viagem (hospedagem, comida, atracoes, transporte local, cambio), nao tem modo orcamento, nao ajuda a responder 'quanto custa essa viagem inteira' nem a comparar destinos por custo total. Pode ate distorcer a percepcao de custo ao esconder taxas ate o final. |
| **Comparação** | Compara OPCOES DE TRANSPORTE dentro de uma rota ja escolhida (operadores/modais/precos), mas nao compara DESTINOS entre si. Nao responde 'Portugal vs Tailandia para meu perfil e orcamento', que e a decisao a montante. Alem disso, a propria comparacao de preço e enviesada pelas taxas e por priorizar a compra dentro do Omio. |
| **Integração** | Tecnicamente e dos mais integraveis do setor (Booking API, white-label, search API de afiliado, deeplinks, ja dentro de Uber/Google/KAYAK/TUI e do ChatGPT). A friccao nao e tecnica e sim comercial/qualidade: API de booking robusta exige contrato B2B (nao e self-service publico), e o risco reputacional do pos-venda fraco do Omio respinga em quem integra o checkout dele. Para afiliado puro, porem, e |

## 20. Oportunidades para superá-lo
- Ser a camada de DECISAO/planejamento que Omio nao e (escolher destino, roteiro IA, custo total, super-perfil) e usar Omio so como executor do trecho de transporte via afiliado/deeplink
- Transparencia total de preco: mostrar o fee/booking rate desde o inicio e comparar Omio vs compra direta, virando o ponto fraco dele em confianca nossa
- Custo TOTAL realista (transporte+hospedagem+comida+atracoes) — algo que Omio estruturalmente nao entrega
- Comparacao de destinos por perfil e orcamento (decisao a montante que o Omio nem toca)
- Personalizacao por super-perfil do viajante (orcamento, estilo, baldeacao, mobilidade) que Omio ignora
- Roteiro multi-destino de N dias com transporte encaixado automaticamente entre cidades
- Aproveitar a frustracao com o pos-venda/chatbot do Omio: nos planejamos e damos contexto, e oferecemos o booking onde ele e bom (Europa terrestre), gerenciando expectativa do usuario

---

## Matriz (visão Mundo Sem Fim)
| Critério | Avaliação |
|---|---|
| Força principal | Maior inventario terrestre multimodal (trem+onibus+ferry) da Europa com compra/emissao real num so app, replicado via API que ja e infraestrutura de Uber/Google/KAYAK/TUI. |
| Fraqueza principal | E camada de transacao de UM trecho, sem planejamento (destino, roteiro, custo total, perfil), e com pos-venda/reembolso muito mal avaliado. |
| Modelo de receita | Comissao de operadores + service fee/booking rate do consumidor + add-ons + ads de posicionamento + receita de API/white-label B2B. |
| Possui API? | Sim — Booking API plug-and-play (parceiro pode ser merchant of record) + search API de afiliado + white-label; B2B sob contrato, nao self-service publico. |
| Possui afiliados? | Sim — programa proprio (widgets/deeplinks/search API) e via Travelpayouts (rev-share 6%, cookie 30 dias) e Impact/Admitad/InvolveAsia; faixa ~2-8%. |
| Pode virar parceiro? | Sim — como fornecedor de transporte terrestre via Booking API/white-label (nos viramos checkout proprio e potencialmente merchant of record) ou, mais leve, como afiliado. |
| Pode pagar comissão? | Sim — paga comissao de afiliado (~6% rev-share via Travelpayouts, 30 dias) e/ou compartilha margem em modelo B2B/API. |
| Pode receber tráfego? | Sim — e justamente o caso ideal: nosso app decide destino/roteiro/custo e manda lead qualificado de alta intencao para o trecho de transporte do Omio. |
| Pode ser integrado? | Sim (completo) — via Booking API/white-label para booking nativo, ou via deeplink/affiliate-API para monetizar redirect sem assumir o checkout. |
| **O que precisamos ter p/ superar** | Igualar a confiabilidade do trecho de transporte: cobertura multimodal Europa via Omio API, compra/deeplink fluido com preco transparente (fee desde o inicio + comparacao com compra direta) e expectativa clara de pos-venda, tudo embrulhado na nossa camada de planejamento (roteiro IA, custo total, comparacao de destinos, super-perfil) que o Omio nao tem. |

## Fontes consultadas
- https://www.omio.com/affiliate
- https://www.travelpayouts.com/en/offers/omio-affiliate-program/
- https://www.travelpayouts.com/blog/goeuro-affiliate-program/
- https://affiliate.watch/affiliate/omio
- https://getlasso.co/affiliate/omio/
- https://uppromote.com/affiliate-directory/omio/
- https://www.omio.com/corporate/omio-b2b/
- https://www.omio.com/b2b
- https://www.directferriesconnect.com/news/direct-ferries-connect-api-powers-new-global-partnership-with-omio
- https://www.prnewswire.co.uk/news-releases/omio-expands-white-label-network-with-new-tui-partnership-302779064.html
- https://finance.yahoo.com/news/easytrain-joins-omios-white-label-112800545.html
- https://www.omio.com/corporate/newsroom/press-releases/omio-announces-partnership-with-uber/
- https://help.omio.com/hc/en-us/articles/13705489840796-What-is-the-service-fee-What-is-the-booking-rate-Can-I-be-charged-with-both
- https://canvasbusinessmodel.com/blogs/how-it-works/omio-how-it-works
- https://getlatka.com/companies/omio.com
- https://www.trustpilot.com/review/omio.com
- https://omio.pissedconsumer.com/review.html
- https://minimalist.travel/transport/trains/omio-review/
- https://davidwilliamrosales.com/2026/03/21/omio-review/
- https://justuseapp.com/en/app/885372509/omio-book-train-bus-flight/reviews
