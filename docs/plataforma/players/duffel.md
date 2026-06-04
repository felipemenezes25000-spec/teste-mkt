# Duffel

> **Categoria:** API de voos (NDC) / infraestrutura fintech de travel B2B
> _Perfil gerado por pesquisa multiagente (jun/2026). Parte do [Relatório de Mercado](../01-relatorio-de-mercado.md) e da [Matriz Competitiva](../02-matriz-competitiva.md)._

## 1. O que faz
Duffel e uma plataforma de infraestrutura B2B (API-first, fundada na Y Combinator S18, sediada em Londres) que permite a qualquer empresa vender voos, hospedagem e carros sem precisar de acreditacao IATA/ARC propria nem de contratos diretos com companhias aereas. Agrega conteudo NDC, GDS e LCC de 300+ a 380+ companhias, processa o pagamento e a emissao do bilhete por baixo (usando a propria acreditacao da Duffel), e cuida de ticketing, remarcacoes e reembolsos. Em abril de 2026 reportou run-rate de Total Transaction Value de ~US$900 milhoes. NAO e site de consumidor nem rede de afiliados: e o encanamento (plumbing) que esta por tras de OTAs, fintechs, super-apps e agencias.

## 2. Público-alvo
Desenvolvedores e produtos B2B: startups de viagem, OTAs novas/medias, fintechs e super-apps querendo adicionar uma vertical de viagem, agencias de viagem corporativa (TMCs), programas de fidelidade/cashback, e empresas que querem vender voos/hoteis/carros sem virar agencia acreditada. Sweet spot: quem quer time-to-market rapido e nao quer lidar com a complexidade de GDS legado (Amadeus/Sabre/Travelport). NAO atende o viajante final diretamente.

## 3. Funcionalidades principais
- Flights API: busca, oferta, booking e order management de 300-380+ companhias (NDC + GDS + LCC, incluindo Emirates, Qatar, Lufthansa, e LCCs como Wizz Air, flydubai, Air Arabia)
- Managed Content: a Duffel empresta sua acreditacao IATA e autoridade de ticketing para quem nao tem (modelo principal de receita)
- Self-accreditation: parceiro maior pode plugar a propria acreditacao IATA/ARC
- Duffel Stays: hospedagem em ~1.6 milhao de propriedades, modelo de comissao compartilhada (crescimento reportado de 10.000% em 12 meses)
- Duffel Cars (lancado 2025/26): aluguel de carro de ~40 fornecedores (Avis, Sixt, Hertz, Enterprise, Europcar) em 40.000+ locais / 200 paises
- Duffel Payments: processamento de pagamento (parceria com Stripe), 3DS, antifraude e settlement, permitindo cobrar o cliente final na hora
- Duffel Links: solucao no-code/low-code que gera um link white-label de busca-e-compra de voos com sua marca, logo, cores e markup, sem escrever codigo
- Componentes de UI prontos (Elements) para acelerar o front-end de busca/checkout
- Order Management: gestao de mudancas iniciadas pela companhia (cancelamentos, reagendamentos) via API
- Ancillaries: venda de bagagem extra, escolha de assento, fares premium e add-ons

## 4. Como monetiza
- Por pedido (Flights): US$3,00 por order confirmada (cobrado mensalmente)
- Managed Content: 1% do valor total do pedido por order confirmada (este e o grande motor de margem quando o parceiro usa a acreditacao da Duffel)
- Ancillaries: US$2,00 por ancillary pago (bagagem, assento etc.)
- Excess Search Fee: US$0,005 por busca excedente acima do ratio 1500:1 (busca:booking) — desincentiva scraping/uso ineficiente
- Conversao de moeda: 2% sobre a taxa de cambio (FX markup) no Payments
- Stays: modelo de comissao compartilhada — o fornecedor paga comissao na reserva concluida e a Duffel divide com o parceiro (quanto mais volume, maior o share do parceiro)
- Margem de pagamento/fintech (Payments + Stripe): estimado em ~15-20% da receita por algumas analises de mercado
- Enterprise: pricing sob medida com descontos por volume; opcao de usar acreditacao propria muda a economia
- Markup do parceiro: a Duffel NAO fica com o markup que o parceiro coloca em cima da tarifa/ancillaries — esse spread e 100% do parceiro (e o gancho comercial dela)

## 5. Afiliados
NAO possui programa de afiliados no sentido tradicional. Duffel nao esta em Awin, CJ, Impact, Partnerize nem Travelpayouts e nao paga comissao para quem manda trafego. O modelo e o inverso: e infraestrutura de supplier/merchant — VOCE integra a API, vende voos/hoteis/carros e a economia de afiliado/comissao surge no SEU lado (em Stays a comissao do fornecedor e compartilhada com voce; em Flights voce ganha pelo markup e pela venda de ancillaries). Ou seja, com a Duffel voce vira o merchant/agente, nao um afiliado dela.

## 6. API
SIM — API REST moderna e bem documentada e o produto central. Tipos de conteudo: NDC direto (30+ companhias com fares/ancillaries exclusivos), agregacao GDS e conexoes LCC, somando 300-380+ companhias. E uma API de PARCEIRO/MERCHANT (precisa de conta, com tier pay-as-you-go self-serve e enterprise), nao uma API publica de afiliado de leitura. Inclui APIs separadas para Flights, Stays, Cars e Payments. Tambem disponivel via marketplaces (Postman, e listagem no developer hub da IATA/RapidAPI). SDKs e webhooks para order management. Em resumo: e a categoria 'API de parceiro transacional NDC+pagamentos', a mais profunda de integrar entre os players analisados.

## 7. Programa de parceiros
Programa de parceria do tipo plataforma/infra: onboarding self-serve (pay-as-you-go, custo zero de entrada, suporte por email) e trilha Enterprise (pricing bespoke, descontos por volume, suporte tecnico dedicado, estrategia de monetizacao sob medida, opcao de usar acreditacao IATA/ARC propria). Tem programa de tech partners/agencias e cases publicos (ex.: Worldia, integradores). NAO ha programa de 'afiliado/publisher' que pague por trafego — a parceria e sempre 'integre e revenda'. Para um app de planejamento como o nosso, o caminho e ser um cliente-revendedor (merchant of record via Duffel) ou usar Duffel Links para monetizar sem build pesado.

## 8. Dados que oferece
- Ofertas de voo em tempo real com tarifas, classes/fare brands, regras de bagagem, fare rules e disponibilidade (NDC/GDS/LCC)
- Ancillaries detalhados: bagagem, assentos (mapa de assento), upgrades, fares premium
- Conteudo de hospedagem (~1.6M propriedades) com tarifas, fotos, comodidades, politicas de cancelamento
- Inventario de aluguel de carro (~40 fornecedores, 40.000+ locais)
- Order/booking lifecycle: criacao, emissao (PNR/ticket), mudancas, cancelamento, reembolso, creditos de companhia
- Status de pagamento, 3DS, antifraude e settlement via Payments
- Identificadores de companhia, numeros de voo, horarios, duracoes, conexoes e info de remarcacao iniciada pela companhia

## 9. Dados que NÃO oferece
- Roteiros / itinerarios de destino (o que fazer, atracoes, dias) — nao e o escopo
- Custo total realista de viagem (alimentacao, transporte local, ingressos, cambio de gastos no destino)
- Comparacao e ranking de DESTINOS (Peru x Tailandia x Portugal) por perfil/orcamento
- Perfil/intencao do viajante (estilo, ritmo, companhia, restricoes) — a API e transacional, nao de preferencia
- Recomendacao editorial/inspiracional de para onde ir e quando (best time to visit, clima, sazonalidade de preco preditiva)
- Dados de visto, vacina, seguranca, conectividade local, cultura — nao cobre travel intelligence
- Conteudo de experiencias/tours/atividades (nao tem vertical de activities como GetYourGuide/Viator)
- Virtual interlining real estilo Kiwi (combinar companhias sem acordo de interline) — cobertura e via NDC/GDS/LCC, nao hacking de rotas
- Avaliacoes/reviews de usuarios e sinal social sobre voos/hoteis

## 10. Pontos fortes
- Developer experience de referencia no setor: API REST limpa, docs boas, sandbox, SDKs — integra voo em dias, nao meses (vs GDS legado)
- Remove a maior barreira do varejo de viagem: NAO precisa de acreditacao IATA/ARC nem de contratos diretos com companhias (Managed Content)
- Stack completo num so fornecedor: voos + hoteis + carros + PAGAMENTOS (Stripe) + ticketing + order management
- Acesso a conteudo NDC exclusivo (30+ companhias) + LCCs que faltam no GDS tradicional (Wizz, flydubai, Air Arabia)
- Duffel Links permite ir ao ar sem time de engenharia (no-code, white-label, markup dinamico)
- Modelo comercial alinhado: parceiro fica com 100% do markup e dos ancillaries; custo de entrada zero (pay-as-you-go)
- Pagamentos e antifraude embutidos — resolve 3DS, chargeback e settlement que normalmente travam fintechs novas
- Escala e tracao crescentes (~US$900M TTV run-rate em 2026), sinal de confiabilidade para parceiros

## 11. Pontos fracos
- Suporte pos-integracao fraco e recorrente nas reclamacoes: B2B critico esperando 24h+ por resposta; relatos de emails ignorados apos semanas de build
- Custos empilham em escala: US$3/order + 1% do valor + US$2/ancillary + 2% FX podem comer margem fina de quem vende barato
- 1% sobre o valor total (Managed Content) e caro em tickets de alto valor (voo internacional premium) comparado a uma comissao GDS negociada
- Cobertura NDC ainda incompleta vs Amadeus/Sabre (490+/400+ companhias) — algumas rotas/fares so existem no GDS legado
- Nao faz virtual interlining como a Kiwi/Tequila — perde combinacoes criativas de rota baratas
- Excess Search Fee (1500:1) penaliza casos de uso de muita busca e pouca conversao — ruim para metabuscador/comparador
- Risco de plataforma: voce fica dependente da acreditacao e do uptime da Duffel; erros de integracao de companhia foram reportados sem suporte agil
- Empresa relativamente pequena (~56 funcionarios, ~US$10,5M receita em 2024) e capital limitado (~US$56M) para a ambicao de 'Universal Travel API'

## 12. Reclamações comuns dos usuários
- Trustpilot: avaliacoes 1/5 chamando o suporte de 'uma vergonha absoluta para uma plataforma B2B'; mais de 24h para responder problema urgente de viagem
- Relato de desenvolvedor: depois de ~3.500 linhas de codigo escritas em cima da Duffel, a empresa parou de responder os emails
- Agencias de viagem alertando publicamente para nao depender da plataforma — 'custou tempo, dinheiro e a confianca do cliente'
- Erros no sistema e na integracao com companhias aereas sem que ninguem ajude a corrigir (G2/Trustpilot)
- G2: features de relatorio/reporting fracas — relatorios de despesa simples, sem breakdown e filtros de controle de custo
- Percepcao de 'integracao facil, mas sem suporte depois' — bom para comecar, doloroso quando algo quebra em producao
- Preocupacao com cobertura de fares/companhias faltando vs GDS quando o cliente espera 'todas as opcoes'

## 13–19. Limitações
| Eixo | Limitação |
|---|---|
| **UX** | Duffel nao tem UX de consumidor para descoberta/planejamento. Mesmo o Duffel Links e um fluxo transacional de busca-e-compra de voo (origem/destino/data -> resultado -> checkout), nao uma jornada de inspiracao, comparacao de destinos ou montagem de roteiro. A experiencia 'final' renderizada pelo parceiro e basica e centrada na transacao; nao ha contexto, narrativa, mapa, clima ou 'por que ir'. Par |
| **Personalização** | Personalizacao e cosmetica e transacional, nao de perfil. Em Links voce customiza logo, cores e URL e pode aplicar markup; a API aceita parametros de busca (cabine, passageiros, bagagem). Mas nao existe nocao de super-perfil do viajante (estilo, ritmo, companhia, tolerancia de orcamento, historico) que molde recomendacoes. A Duffel responde 'quais voos existem para X', nunca 'qual viagem combina c |
| **IA** | Sem camada de IA de planejamento/decisao voltada ao usuario. O foco e API determinista de inventario e pagamento. Nao ha geracao de roteiro, recomendacao inteligente de destino, otimizacao de custo total por IA, nem agente conversacional de viagem para o consumidor. Em 2026 ate posicionam a API como 'pronta para agentes de IA' (terceiros podem plugar), mas a inteligencia de decisao precisa vir de  |
| **Roteirização** | Zero roteirizacao. Nao monta itinerario multi-dia, nao sequencia destinos, nao sugere quantos dias em cada lugar, nao integra atividades/tours nem logistica intra-destino. Resolve o trecho aereo (e hotel/carro como itens isolados), mas nao costura a viagem completa dia a dia. Combinacoes multi-cidade dependem do que NDC/GDS oferecem; nao ha otimizacao criativa de rota (e sem virtual interlining es |
| **Orçamento** | So enxerga o custo do que ela vende (tarifa + ancillaries + cambio). Nao calcula custo TOTAL realista da viagem: alimentacao, transporte local, ingressos, passeios, gorjetas, seguro, poder de compra no destino, sazonalidade de preco. Nao ha 'modo orcamento' que diga 'com R$X voce faz Peru por 8 dias incluindo tudo'. O numero que a Duffel mostra e o preco da transacao, nao o custo de existir naquel |
| **Comparação** | Compara OPCOES dentro de um destino/rota ja escolhida (qual voo, qual hotel, qual carro), nao DESTINOS entre si. Nao responde 'Peru x Tailandia x Portugal: qual cabe no meu orcamento, clima e perfil?'. Falta a dimensao de decisao de para-onde-ir, ranking por custo-total/experiencia/perfil, e o lado inspiracional. O comparador da Duffel e de fornecedores, nao de sonhos de viagem. |
| **Integração** | Tecnicamente uma das MELHORES para integrar (API REST moderna, sandbox, SDKs, Payments embutido) — esse e o ponto forte. As friccoes sao comerciais e operacionais, nao de DX: (1) suporte pos-integracao lento trava producao; (2) custos por order/ancillary/FX precisam ser modelados para nao matar a margem; (3) Excess Search Fee (1500:1) penaliza nosso caso de uso de muita busca exploratoria (compara |

## 20. Oportunidades para superá-lo
- Ser o CEREBRO de decisao que a Duffel nao e: roteiro por IA, custo total realista e comparacao de destinos por perfil — e usar a Duffel so como braco de booking quando o usuario decide
- Resolver o 'para onde ir' (inspiracao + comparacao Peru x Tailandia x Portugal) que a Duffel ignora totalmente — capturamos o usuario MUITO antes do momento transacional
- Entregar custo TOTAL da viagem (comida, transporte local, ingressos, cambio) vs o custo so-da-tarifa da Duffel — nosso numero e mais honesto e util
- Super-perfil do viajante moldando recomendacoes — a Duffel e generica e sem memoria de quem e o usuario
- UX de jornada/storytelling/mapa real para o consumidor — a Duffel so tem fluxo transacional
- Camada de comparacao multi-fornecedor: como nao dependemos de uma so acreditacao, podemos comparar Duffel com outras fontes e mostrar a melhor opcao ao usuario
- Suporte e confiabilidade percebida: clientes reclamam que a Duffel 'some' apos integracao — nosso produto pode abstrair isso e nunca expor o usuario a um buraco de suporte
- Evitar o Excess Search Fee: fazer toda a exploracao/comparacao com dados proprios/cacheados e so disparar a busca paga da Duffel no momento da intencao real de compra

---

## Matriz (visão Mundo Sem Fim)
| Critério | Avaliação |
|---|---|
| Força principal | Infraestrutura B2B que remove a barreira de acreditacao IATA e contratos com companhias: integra voo+hotel+carro+pagamento com a melhor developer experience do setor, deixando 100% do markup com o parceiro. |
| Fraqueza principal | E so o encanamento transacional — nao tem inteligencia de decisao, descoberta de destino, custo total nem UX de consumidor; e o suporte pos-integracao e cronicamente reclamado em B2B critico. |
| Modelo de receita | Taxas transacionais empilhadas (US$3/order + 1% do valor via Managed Content + US$2/ancillary + 2% FX) + comissao compartilhada em Stays + margem de Payments (~15-20%); enterprise bespoke. NAO paga afiliado — voce e o merchant. |
| Possui API? | Sim — API REST de parceiro/merchant NDC+GDS+LCC (300-380+ companhias) com produtos separados de Flights, Stays, Cars e Payments; a integracao mais profunda e completa entre os players. |
| Possui afiliados? | Nao — nao tem rede de afiliado (nada de Awin/CJ/Impact/Travelpayouts) e nao paga por trafego. A economia de comissao acontece no SEU lado: voce revende e fica com markup; em Stays a comissao do fornecedor e compartilhada com voce. |
| Pode virar parceiro? | Sim — via conta de parceiro/merchant: pay-as-you-go self-serve para validar rapido, ou Enterprise (pricing por volume, suporte dedicado, opcao de acreditacao propria). Tambem da pra comecar sem codigo via Duffel Links. |
| Pode pagar comissão? | Sim, indiretamente: a Duffel nao paga comissao por lead, mas habilita NOSSA monetizacao — ganhamos markup sobre a tarifa, US$2 de ancillaries que vendermos e share de comissao em hoteis. Nos viramos o merchant of record que captura a margem. |
| Pode receber tráfego? | Nao — a Duffel nao gera nem manda trafego de consumidor (e B2B headless). O trafego e sempre do nosso lado; a Duffel so executa a transacao que originamos. |
| Pode ser integrado? | Sim (integracao profunda) — via API REST de Flights/Stays/Cars/Payments para booking completo dentro do nosso app, ou via Duffel Links/Elements para um atalho white-label de checkout. Deeplink puro nao e o modelo dela; a forca e o booking embutido. |
| **O que precisamos ter p/ superar** | Para ser melhor que a Duffel naquilo que ela faz bem (executar o booking), nosso app NAO precisa reconstruir a acreditacao/encanamento — precisa: (1) usar a Duffel como motor de booking de voo/hotel/carro por baixo; (2) ter uma camada de decisao superior (roteiro IA + custo total + comparacao de destinos + super-perfil) que a Duffel nao tem; (3) controlar QUANDO chamar a API paga (so na intencao r |

## Fontes consultadas
- https://duffel.com/pricing
- https://duffel.com/
- https://duffel.com/flights
- https://duffel.com/flights/content/managed
- https://duffel.com/ndc
- https://duffel.com/stays
- https://duffel.com/links
- https://duffel.com/payments
- https://duffel.com/blog/introducing-duffel-links-the-fastest-way-to-start-selling-flights-2
- https://duffel.com/blog/access-routes-from-more-than-380-airlines-on-duffel
- https://duffel.com/why-duffel/tequila-by-kiwi-vs-duffel
- https://www.traveldailynews.com/people/new-appointments/duffel-launches-duffel-cars-expanding-its-travel-api-suite/
- https://www.trustpilot.com/review/www.duffel.com
- https://www.g2.com/products/duffel/reviews
- https://www.producthunt.com/products/duffel/reviews
- https://businessmodelcanvastemplate.com/blogs/how-it-works/duffel-how-it-works
- https://www.altexsoft.com/infographics/ndc-aggregator-ecosystem/
- https://getlatka.com/companies/duffel.com
- https://www.crunchbase.com/organization/duffelhq
- https://news.ycombinator.com/item?id=34818317
- https://financialit.net/news/apis/duffel-and-stripe-enable-seamless-flight-payments-processing-through-powerful-api
- https://phptravels.com/blog/travel-api-suppliers
