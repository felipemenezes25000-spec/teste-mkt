# Amadeus (Amadeus IT Group / Amadeus for Developers)

> **Categoria:** GDS / Infraestrutura e API B2B de viagem (distribuicao aerea, IT para companhias aereas, hotelaria e agencias). NAO e um app de consumidor final.
> _Perfil gerado por pesquisa multiagente (jun/2026). Parte do [Relatório de Mercado](../01-relatorio-de-mercado.md) e da [Matriz Competitiva](../02-matriz-competitiva.md)._

## 1. O que faz
Amadeus e a maior empresa de tecnologia de viagem do mundo. Opera um GDS (Global Distribution System) que conecta companhias aereas, hoteis, locadoras, ferrovias e fornecedores a agencias de viagem, OTAs e TMCs, processando bilhoes de transacoes/ano. Alem da distribuicao, vende sistemas de IT para companhias aereas (Altea PSS, reservas, check-in, NDC), aeroportos, hospitalidade e agencias. Para devs, expoe APIs (flight/hotel/destino) via dois canais: Self-Service (pago por uso, em desativacao) e Enterprise (contrato/NDA). Faturou EUR 6,5 bilhoes em 2025.

## 2. Público-alvo
B2B puro: companhias aereas, agencias de viagem (online e offline), OTAs, TMCs (corporativo), redes hoteleiras, ferrovias, aeroportos, consolidadores e empresas de travel-tech que precisam de conteudo/inventario e capacidade de emissao. NAO atende o viajante final diretamente. Devs e startups eram atendidos pelo Self-Service, canal que sera encerrado.

## 3. Funcionalidades principais
- Flight Offers Search e Flight Offers Price (busca e precificacao de voos em 400+ cias)
- Flight Create Orders / emissao de bilhetes (so no Enterprise, exige IATA/ARC)
- Conteudo NDC agregado de ~35 companhias aereas no Travel Platform
- APIs de hotel (Hotel Search, Hotel Booking) com conteudo agregado, inclusive via parceria Expedia (EPS)
- APIs de inspiracao e dados de destino (Flight Inspiration Search, Trip Purpose, Travel Recommendations, Points of Interest, Safe Place)
- Predicao com IA/ML (atraso de voo, escolha de viagem, previsao de preco)
- Sistemas de IT para cias aereas: Altea PSS, reservas, inventario, check-in, Altea NDC
- Solucoes de hospitalidade (CRS, distribuicao hoteleira), aeroporto e pagamentos B2B
- Programa de parceiros (Amadeus Partner Network) e marketplace de apps
- MetaConnect: rede no modelo afiliado conectando cias aereas e empresas de Travel Media (metabusca)

## 4. Como monetiza
- GDS / Air Distribution: taxa de booking por segmento paga pela cia aerea (faixa de mercado ~US$3 a US$15/segmento, media 2,5-3 segmentos/bilhete); ~48% da receita 2025
- Air IT Solutions: modelo transacional/SaaS por passageiro embarcado (PB) + receita por PB crescente; principal motor do segmento de IT (52% da receita)
- Hospitality & Other Solutions: licenca/transacao por reserva e por funcionalidade
- APIs Self-Service: pay-as-you-go com cota mensal gratuita e cobranca por chamada excedente (~EUR 0,001 a EUR 0,025 por call, variando por API; voos sao as mais caras)
- APIs Enterprise: precificacao customizada sob NDA, com account manager dedicado
- NAO ha comissao de afiliado para consumidor, CPC de metabusca aberto, ads display nem assinatura de consumidor

## 5. Afiliados
NAO possui programa de afiliados para criadores de conteudo/sites de consumidor (nada de Awin, CJ, Impact, Partnerize, Travelpayouts). O que existe e B2B: (1) Amadeus Partner Network, programa de parceiros com tiers Connect / Sell / Service e oportunidades de referral e resell de solucoes Amadeus; (2) Amadeus MetaConnect, uma rede no 'modelo afiliado' que conecta companhias aereas a empresas de Travel Media/metabusca (pagamento por trafego/lead qualificado entre players B2B, nao para afiliados individuais). Para um app de planejamento, NAO existe link de afiliado simples para ganhar comissao por venda.

## 6. API
SIM, robusta, em 3 camadas. (1) Self-Service (REST/JSON, 'Amadeus for Developers'): autoatendimento, sandbox gratuito, pay-as-you-go — porem SERA DESCOMISSIONADA em 17/07/2026 (registro de novos usuarios pausado antes; chaves desativadas na data). (2) Enterprise (REST + legado): conteudo completo, fares negociadas/privadas e emissao real; exige NDA, accreditacao Amadeus e tipicamente licenca IATA/ARC; negociacao de semanas a meses. (3) Airline IT (Altea/NDC) para companhias aereas. Tipo: GDS + NDC + APIs de parceiro/enterprise. NAO e uma API publica de afiliado aberta.

## 7. Programa de parceiros
Amadeus Partner Network (lancado em 2021): marketplace/ecossistema B2B com onboarding, certificacao e validacao de apps, tiers Connect/Sell/Service definidos pela receita direta gerada a Amadeus no ano anterior, com beneficios de treinamento, suporte, referral e resell. Modulos separados para Travel Sellers & Intermediaries, Airlines e Hospitality. Para virar parceiro de verdade e preciso volume/contrato — nao e um cadastro instantaneo como afiliado.

## 8. Dados que oferece
- Inventario e disponibilidade de voos de 400+ companhias (full-content + NDC de ~35 cias)
- Precificacao detalhada de voos (fare rules, branded fares, ancillaries via NDC)
- Conteudo e booking de hotel (incl. agregacao Expedia EPS) e locadoras
- Dados de inspiracao/destino: recomendacoes, pontos de interesse, proposito de viagem, seguranca (Safe Place)
- Predicoes com ML: atraso de voo, previsao de preco, probabilidade de escolha
- Capacidade transacional real: criar/emitir ordens e bilhetes (apenas Enterprise + IATA/ARC)
- Dados agregados de mercado e analytics de viagem (Enterprise)

## 9. Dados que NÃO oferece
- Roteiro de viagem dia-a-dia pronto (itinerario turistico) — nao e produto deles
- Custo total realista da viagem (hospedagem+comida+transporte local+passeios consolidado) — so vendem componentes
- Comparacao editorial entre destinos para decisao do viajante
- Super-perfil/persona do viajante para personalizacao de consumidor
- Reviews/UGC de consumidor e conteudo inspiracional rico estilo blog
- Custo de vida local, cambio aplicado a orcamento e dicas praticas
- Recomendacao de 'para onde ir' baseada em orcamento e perfil (so flight inspiration por preco bruto)
- No Self-Service: fares privadas/negociadas e emissao (so Enterprise)

## 10. Pontos fortes
- Maior fonte de conteudo aereo e capacidade de emissao do mundo — autoridade e cobertura quase universal
- Conteudo full-content + NDC agregado num so ponto de conexao (reduz integracoes diretas com cias)
- Confiabilidade, escala e SLAs de nivel enterprise; infraestrutura critica do setor
- Portfolio amplo: distribuicao + IT de cias + hotelaria + aeroporto + pagamentos
- Capacidade transacional real (precificar, reservar, emitir bilhete) que poucos tem
- APIs de dados/IA uteis (inspiracao, POIs, predicao de preco/atraso) para enriquecer apps
- Saude financeira forte (EUR 6,5 bi em 2025, crescimento ~6%) — fornecedor estavel de longo prazo

## 11. Pontos fracos
- Encerramento do Self-Service (jul/2026) fecha a porta de entrada barata para startups/devs — fica so Enterprise
- Barreira Enterprise altissima: NDA, accreditacao, IATA/ARC, negociacao de semanas/meses
- Ambiente de teste com dados estaticos/cacheados e cobertura limitada — dificil prototipar com realismo
- Self-Service so da fares publicas; precos/disponibilidade nem sempre batem com producao
- Complexidade de integracao alta (fare rules, NDC, ticketing) — curva ingreme
- Custo por chamada de voo pode escalar rapido em alto volume sem contrato negociado
- Foco B2B/infra: zero camada de decisao, planejamento ou experiencia para o viajante final
- Pricing pouco transparente no Enterprise (so sob NDA)

## 12. Reclamações comuns dos usuários
- 'Mataram a possibilidade de experimentar a menos que voce pague preco enterprise' — reacao da comunidade ao fim do Self-Service (LinkedIn/PhocusWire)
- Dados de sandbox estaticos/limitados levam a surpresas ao migrar para producao
- So fares publicas no Self-Service; sem rates privadas/negociadas sem contrato
- Sem certificacao IATA/ARC nao da pra emitir bilhete — monetizacao direta travada para o pequeno
- Integracao complexa e documentacao que exige bastante esforco para casos reais de ticketing
- Negociacao enterprise longa (semanas a meses) trava cronograma de produto
- Receio de que startups de travel-tech 'nao sobrevivam' a mudanca de acesso
- Custos de voo escalam e pricing enterprise e opaco (so sob NDA)

## 13–19. Limitações
| Eixo | Limitação |
|---|---|
| **UX** | Nao tem UX de consumidor — e API/back-office. A 'UX' relevante e a do desenvolvedor, e ela e considerada complexa: sandbox com dados estaticos, documentacao densa, fluxos de ticketing intrincados e, com o fim do Self-Service, onboarding deixa de ser autoatendimento e vira processo comercial. Nosso app, que e a camada de experiencia do viajante, nao concorre em UX — consome o conteudo deles por tra |
| **Personalização** | Personalizacao e voltada ao negocio (regras de fare, NDC, ofertas da cia), nao ao individuo viajante. Nao ha conceito de super-perfil/persona do consumidor, historico de gostos ou recomendacao afetiva. Entregam dados crus; a inteligencia de 'isto combina com VOCE' precisa ser construida por cima — exatamente o espaco do nosso app. |
| **IA** | Tem IA/ML, porem operacional e de fornecedor: previsao de atraso, previsao de preco, probabilidade de escolha, recomendacoes de destino por sinais de mercado. Nao ha IA conversacional de planejamento, montagem de roteiro narrativo nem assistente de decisao para o viajante. A IA deles otimiza distribuicao/retailing das cias, nao a jornada de decisao do consumidor. |
| **Roteirização** | Nao faz roteirizacao turistica. Entrega componentes (voo, hotel, POIs, recomendacao de destino), mas nao monta itinerario dia-a-dia, sequencia de atracoes, logistica local ou narrativa de viagem. Roteiro completo nao e produto Amadeus — e lacuna estrutural que nosso app preenche. |
| **Orçamento** | Precifica apenas os componentes que distribui (voo, hotel, carro). Nao calcula custo TOTAL realista da viagem (alimentacao, transporte local, passeios, ingressos, cambio, custo de vida local, margem de imprevisto). Nao tem 'modo orcamento' nem otimizacao por teto de gasto para o viajante. Falta toda a camada de custo consolidado e realista — nosso diferencial central. |
| **Comparação** | Compara ofertas dentro de uma categoria (varios voos, varias tarifas), nao DESTINOS para decisao do viajante. Nao responde 'Peru x Tailandia para meu perfil e orcamento'. Nao ha comparacao editorial/holistica (clima, custo, vibe, seguranca, esforco logistico) — so dados transacionais por componente. |
| **Integração** | Tecnicamente e altamente integravel (APIs maduras), MAS a integracao real e cara e burocratica: o caminho facil (Self-Service) acaba em jul/2026, restando Enterprise com NDA, accreditacao e IATA/ARC e meses de negociacao. Para um app jovem, a integracao direta com a emissao da Amadeus e proibitiva no curto prazo — o realista e via consolidador/agregador ou parceiro que ja tenha o contrato. |

## 20. Oportunidades para superá-lo
- Ser a camada de DECISAO e PLANEJAMENTO que a Amadeus nunca teve (roteiro IA + custo total realista + comparacao de destinos) e usar a Amadeus so como fonte de voo/hotel por tras
- Capturar o orfaos do Self-Service: devs e micro-OTAs sem acesso barato a inventario — oferecer experiencia pronta enquanto eles perdem a entrada tecnica
- Calcular CUSTO TOTAL realista (voo+hotel+comida+local+passeios+cambio+buffer), algo que Amadeus nao entrega
- Comparacao 'para onde ir' por perfil e orcamento — substituir a inspiracao crua por preco deles por decisao contextualizada
- Super-perfil do viajante e IA conversacional de planejamento — personalizacao de consumidor que e ponto cego deles
- Onboarding instantaneo e UX consumer-first contra um mundo enterprise lento, contratual e opaco
- Nao depender de uma so fonte: combinar Amadeus (quando viavel via parceiro) com outras fontes para preco/cobertura e resiliencia

---

## Matriz (visão Mundo Sem Fim)
| Critério | Avaliação |
|---|---|
| Força principal | Maior e mais confiavel fonte de conteudo aereo (400+ cias, full-content + NDC) com capacidade real de precificar, reservar e emitir bilhete — infraestrutura critica e estavel (EUR 6,5 bi em 2025). |
| Fraqueza principal | E pura infraestrutura B2B: zero camada de decisao, planejamento, roteiro, custo total ou personalizacao para o viajante final — e fechou (jul/2026) a porta barata (Self-Service), deixando so o caminho Enterprise caro e burocratico. |
| Modelo de receita | B2B transacional: taxa por segmento de booking no GDS (~US$3-15/segmento) + IT de cias por passageiro embarcado + hotelaria por reserva; APIs pay-as-you-go (Self-Service) ou contrato sob NDA (Enterprise). Sem comissao/afiliado/ads de consumidor. |
| Possui API? | Sim. Self-Service REST (pay-as-you-go, mas DESATIVADA em 17/07/2026) + Enterprise (NDA, accreditacao, IATA/ARC) + Airline IT (Altea/NDC). API de parceiro/enterprise, nao de afiliado aberto. |
| Possui afiliados? | Nao para consumidor (nada de Awin/CJ/Impact/Travelpayouts). So B2B: Amadeus Partner Network (tiers Connect/Sell/Service) e MetaConnect (rede afiliado cia aerea <-> Travel Media). Sem link de comissao por venda para apps. |
| Pode virar parceiro? | Sim, mas alto custo de entrada: via Amadeus Partner Network ou contrato Enterprise, exigindo NDA, accreditacao e tipicamente IATA/ARC, com negociacao de semanas a meses. Inviavel no curtissimo prazo para app jovem; viavel no medio prazo ou via consolidador/agregador que ja tenha o contrato. |
| Pode pagar comissão? | Nao no modelo de afiliado/consumidor. Amadeus e fornecedor de conteudo (NOS pagamos pelo uso/contrato) e/ou a cia paga taxa de GDS a Amadeus. Para o nosso app, a monetizacao realista nao vem de 'comissao da Amadeus', e sim de markup/fee proprio sobre o booking ou de afiliados de outras fontes; a Ama |
| Pode receber tráfego? | Pouco relevante no sentido de afiliado direto. Nos NAO mandamos trafego para 'amadeus.com'; usamos a API para fechar voo/hotel dentro do nosso fluxo. O trafego de venda vai para a cia/hotel via inventario Amadeus, nao para um site de consumidor Amadeus. |
| Pode ser integrado? | Parcial. Tecnicamente sim (APIs maduras de voo/hotel/POIs/predicao), mas o acesso facil (Self-Service) acaba em jul/2026; o caminho de producao serio (Enterprise + emissao) exige NDA, accreditacao e IATA/ARC. Integracao realista no inicio: via agregador/consolidador parceiro (deeplink/booking white- |
| **O que precisamos ter p/ superar** | Para superar a Amadeus naquilo que ela faz bem (conteudo e booking), nosso app NAO deve tentar virar GDS — deve ser a melhor CAMADA por cima: (1) abstrair fornecedores (Amadeus quando viavel via parceiro, + outras fontes) para nao depender de um so e ter resiliencia e melhor preco; (2) garantir confiabilidade de preco/disponibilidade real no booking; (3) entregar o que eles nao tem: roteiro IA, cu |

## Fontes consultadas
- https://developers.amadeus.com/pricing
- https://developers.amadeus.com/self-service/apis-docs/guides/developer-guides/pricing/
- https://developers.amadeus.com/blog/new-self-service-pricing-amadeus-api
- https://www.phocuswire.com/amadeus-shut-down-self-service-apis-portal-developers
- https://tragento.com/en/amadeus-announced-the-shutdown-of-the-self-service-api-portal-for-developers/
- https://oneclicktraveltech.com/blogs/travel/amadeus-self-service-api-shutdown
- https://amadeus.com/en/newsroom/press-releases/amadeus-fy-2025-results-revenue-growth
- https://amadeus.com/content/dam/amadeus/corporate/documents/en/investors/2025/financial-results/quarterly-results/q4-2025/2025-amadeus-results-presentation.pdf
- https://amadeus.com/en/travel-sellers/products/travel-platform-gds
- https://amadeus.com/en/travel-glossary/ndc
- https://amadeus.com/en/newsroom/press-releases/frontier-airlines-distribution-ndc-amadeus
- https://amadeus.com/en/partners
- https://amadeus.com/en/partners/tiers-benefits
- https://amadeus.com/en/travel-sellers/products/amadeus-metaconnect
- https://developers.amadeus.com/self-service/apis-docs/guides/developer-guides/test-data/
- https://www.altexsoft.com/blog/amadeus-api-integration/
- https://edana.ch/en/2025/08/15/amadeus-api-integration-practical-guide-to-access-gds-content/
- https://phptravels.com/blog/amadeus-self-service-rest-api-vs-enterprise-rest-api
