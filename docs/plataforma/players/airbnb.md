# Airbnb

> **Categoria:** Hospedagem alternativa (aluguel de temporada / short-term rental) + experiencias e servicos locais; marketplace C2C/P2P de viagem
> _Perfil gerado por pesquisa multiagente (jun/2026). Parte do [Relatório de Mercado](../01-relatorio-de-mercado.md) e da [Matriz Competitiva](../02-matriz-competitiva.md)._

## 1. O que faz
Marketplace global que conecta anfitrioes (hosts) e hospedes para aluguel de acomodacoes de curta temporada (casas, apartamentos, quartos, espacos unicos). Em 2025-2026 expandiu agressivamente para virar um "super-app de viagem": relancou Airbnb Experiences (650+ cidades, incluindo "Airbnb Originals" com celebridades) e lancou Airbnb Services (chefs, fotografia, massagem, catering etc. em ~260 cidades), alem de entrar em hoteis boutique, aluguel de carro, transfer de aeroporto e ate delivery de mantimentos. Atua como intermediario e processador de pagamento (merchant of record), retendo o dinheiro ate o check-in.

## 2. Público-alvo
Viajantes de lazer B2C globais que buscam estadias mais longas, em grupo/familia ou com cozinha (vs. hotel), nomades digitais e estadias de media duracao; do lado da oferta, anfitrioes individuais e pequenos gestores de imovel (property managers). Foco crescente em millennials/Gen Z, grupos e viagens "live-like-a-local". Forte em destinos de lazer, cidades e areas sem oferta hoteleira.

## 3. Funcionalidades principais
- Busca/filtros de acomodacoes com mapa, datas, hospedes, preco e amenidades
- Total price display (preco total com taxas antes do checkout) ativado globalmente apos pressao regulatoria
- AirCover for Guests e for Hosts (protecao/seguro, rebooking e refund policy)
- Sistema de reviews bidirecional (1+ bilhao de avaliacoes) com Superhost e Guest Favorites
- Resumos de reviews por IA e comparacao de favoritos por IA (Summer Release 2026)
- Aba Trips com mapa de itinerario compartilhado: reservas + restaurantes/experiencias proximos com tempo de deslocamento
- Assistente de atendimento por IA em 11 idiomas (com planos de canal de voz)
- Airbnb Experiences e Airbnb Services integrados ao app
- Wishlists, mensagens host-guest, calendario e pagamento integrado (parcelamento via parceiros)
- App nativo redesenhado (iOS/Android) com itinerario dia-a-dia e check-in

## 4. Como monetiza
- Modelo principal merchant of record: retem o pagamento e repassa ao host. Receita 2025 de US$ 12,2 bilhoes (+11% a/a); GBV anual US$ 91,3 bi; take rate implicito ~13,6% do GBV (Q4 2025), abaixo dos 14,1% de Q4 2024
- Taxa host-only de 15,5% (deduzida do payout do anfitriao) virou o padrao apos rollout entre out/2025 e abr/2026, substituindo o split fee antigo (host 3-4% + guest ~14-16,5%). Modelo antigo split fee ainda existe em parte da base
- Comissao tambem sobre Airbnb Experiences e Airbnb Services (cut da plataforma sobre cada reserva de servico/experiencia)
- Receita de cambio (FX) e float sobre valores retidos ate o check-in
- Sem modelo de assinatura paga ao consumidor e sem receita relevante de publicidade/ads patrocinados ate 2026 (diferente de Booking/Expedia/Tripadvisor que vendem CPC/sponsored). Monetiza puramente por comissao transacional

## 5. Afiliados
NAO ha programa de afiliados publico e aberto em 2026. O Airbnb Associates Program (afiliado classico, ~25-30% da taxa de servico do hospede) foi ENCERRADO em 31/03/2021 e nunca foi reaberto publicamente. Nao esta presente em nenhuma rede aberta (Awin, CJ, Impact, Partnerize, Travelpayouts) como merchant direto. Existe (a) um programa de indicacao/referral (convide hosts/hospedes por credito, nao escalavel como afiliacao) e (b) um piloto de "influencer affiliate" lancado na Franca em 2025 com comissao atrelada a bookings, porem invite-only/gerenciado caso a caso (sem rede publica, sem autoatendimento, sem deep-link de afiliado para terceiros). Para monetizar trafego "estilo Airbnb", afiliados usam alternativas (Booking ~4-15%, Vrbo, Expedia 4-20%, Viator 8-35%) ou agregadores como Travelpayouts/Stay22 — nao o proprio Airbnb.

## 6. API
NAO ha API publica/aberta. Existe API apenas de PARCEIRO, restrita ao programa "Preferred/Approved Software Partner" (channel managers e PMS como Hostaway, Smoobu, Guesty etc.). Em 2026 o programa esta efetivamente FECHADO a aplicacoes nao-solicitadas: a Airbnb nao aceita novos pedidos de acesso e aborda parceiros prospectivos diretamente, com base em volume de oferta, forca tecnica e capacidade de suportar clientes comuns. Nao ha conexao GDS nem NDC. Nao existe API de busca/booking de viagem para apps de planejamento integrarem inventario de acomodacoes diretamente. Dados de mercado (precos/ocupacao) so via terceiros que fazem scraping (AirDNA, AirROI), nao oficiais.

## 7. Programa de parceiros
Dois eixos: (1) Software/distribuicao — "Preferred Software Partner / API partner" para PMS e channel managers gerenciarem listings via API (invite/curado, nao aberto). (2) Marketing/creators — colaboracoes de influencer marketing (brand-level e host-level) e o piloto frances de influencer-affiliate. Nao ha um programa formal, documentado e autoatendido de "travel partner" para apps de terceiros revenderem ou monetizarem reservas de acomodacao Airbnb. Integracao de terceiros e essencialmente bloqueada ou negociada um a um.

## 8. Dados que oferece
- Inventario massivo de acomodacoes unicas/alternativas globalmente (incluindo locais sem hotel)
- Reviews bidirecionais em escala (1B+) com sinais de qualidade (Superhost, Guest Favorite)
- Resumos e sinais estruturados por IA (localizacao, amenidades, family-friendly)
- Preco total com taxas (total price display) no fluxo do consumidor
- Amenidades detalhadas, regras da casa, politica de cancelamento e localizacao aproximada
- Catalogo de Experiences e Services locais por cidade
- Disponibilidade/calendario por listing (no app)

## 9. Dados que NÃO oferece
- API publica de busca/booking ou feed de inventario para terceiros
- Precos historicos / ocupacao / demanda de forma oficial (so via scrapers como AirDNA/AirROI)
- Custo total de viagem alem da hospedagem (nao calcula voo, transporte intermunicipal, alimentacao fora dos Services, cambio)
- Comparacao objetiva entre DESTINOS (so compara listings dentro do mesmo destino/wishlist)
- Endereco exato antes da reserva e dados de contato do host fora da plataforma
- Roteiro multi-cidade/multi-dia real com logica de sequenciamento entre destinos distintos
- Deep-links de afiliado rastreaveis com comissao para parceiros externos

## 10. Pontos fortes
- Marca dominante e quase generica em short-term rental; rede de oferta gigantesca e dificil de replicar (network effect dois lados)
- Inventario unico que hotel/OTA nao tem (casas inteiras, espacos atipicos, destinos sem hotel) - bom para grupos/familias/estadia longa
- Caixa e escala: US$ 12,2 bi receita 2025, ~35% margem EBITDA ajustada, GBV US$ 91,3 bi
- Confianca operacional: reviews em massa, AirCover, pagamento retido ate check-in, total price display
- App e atendimento por IA premiados; forte mobile (4,8/5 App Store)
- Expansao para Experiences/Services/hoteis aumenta share-of-wallet e o transforma em ecossistema de viagem
- Controle total da relacao com o cliente final (sem depender de GDS)

## 11. Pontos fracos
- Atendimento ao cliente com reputacao ruim (scripts, lentidao, casos jogados entre equipes) - Trustpilot ~1,3/5
- Percepcao de precos inflados e taxas (limpeza, servico) apesar do total price display; sensacao de 'piorou'
- Cancelamentos de host de ultima hora e disputas de reembolso/AirCover frustram hospedes
- Fechado para integracao: sem API publica e sem afiliado aberto, o que isola o ecossistema e impede parceiros de monetizar/distribuir
- Inconsistencia de qualidade (limpeza, fotos enganosas, golpes/listings falsos) por ser marketplace P2P
- Pressao regulatoria/restricoes municipais (NY, Barcelona, Lisboa etc.) reduzem oferta em destinos-chave
- Nao resolve a etapa de DECISAO/planejamento ampla: foca em 'qual casa', nao em 'qual destino/quanto custa a viagem toda'

## 12. Reclamações comuns dos usuários
- Atendimento terrivel: respostas roboticas/scripts, suporte que demora dias e transfere o caso repetidamente (Trustpilot)
- Host cancela perto do check-in e hospede fica sem opcao comparavel ou demora pra ser reembolsado
- Taxas escondidas/altas (limpeza e servico) e precos 'super inflados' - 'virou um golpe' (reviews recorrentes)
- Imoveis sujos/diferentes das fotos (manchas, poeira, pragas) e reembolso negado no AirCover por falta de 'prova'
- Golpes (gift cards, listings falsos) com Airbnb e terceiros empurrando responsabilidade entre si
- Mudancas de politica de cancelamento (out/2025: fim do Strict para novos listings, grace de 24h, nova politica 'Limited') geraram confusao em hosts e hospedes

## 13–19. Limitações
| Eixo | Limitação |
|---|---|
| **UX** | UX de acomodacao e excelente, mas e otimizada para BUSCAR e RESERVAR uma casa, nao para DECIDIR a viagem. O novo mapa de itinerario na aba Trips so aparece DEPOIS da reserva e e centrado no entorno do imovel - nao ajuda quem ainda nao escolheu destino. Total price display existe, mas usuarios ainda reclamam de surpresa de taxas e de precos inflados. Atendimento por IA bom, mas suporte humano e pon |
| **Personalização** | Personalizacao e rasa e reativa: recomenda servicos/experiencias apos a reserva e resume reviews por IA, mas nao monta um super-perfil do viajante (orcamento, ritmo, estilo, restricoes, historico multi-viagem) para guiar a DECISAO. Nao pergunta "que tipo de viajante voce e" antes de sugerir destino - parte do pressuposto de que voce ja sabe para onde vai. |
| **IA** | A IA da Airbnb (resumos de review, comparacao de wishlist, assistente de suporte) e forte mas estreita: opera DENTRO do inventario Airbnb e DEPOIS que voce ja delimitou o destino. Nao faz planejamento de viagem aberto (escolher pais/cidade, montar roteiro completo, estimar custo total realista). E IA de conversao/suporte, nao IA de decisao/curadoria de destino independente de marca. |
| **Roteirização** | Nao roteiriza viagem de verdade: o mapa de Trips lista reservas + pontos proximos a um imovel, sem logica de sequenciamento multi-cidade, multi-dia, otimizacao de deslocamentos entre destinos, ou combinacao com voos/transporte de longa distancia. E um 'mapa do entorno da estadia', nao um itinerario inteligente ponta a ponta. |
| **Orçamento** | So mostra o custo da HOSPEDAGEM (+ servicos/experiencias que vende). Nao calcula custo TOTAL realista da viagem: voos, transporte local, alimentacao fora dos Services, ingressos de terceiros, seguro, cambio, custo de vida do destino. Nem oferece 'modo orcamento' que ajude a escolher destino pelo bolso. O viajante nao consegue responder 'quanto custa a viagem inteira' dentro do Airbnb. |
| **Comparação** | A comparacao por IA so funciona entre LISTINGS salvos no mesmo destino/wishlist. Nao compara DESTINOS entre si (ex.: Peru vs. Tailandia vs. Portugal por custo, clima, seguranca, vibe, distancia). Por ser fechado em acomodacao da propria marca, e estruturalmente incapaz de ser um comparador neutro de destinos ou de canais de compra (voo+hotel+atividades). |
| **Integração** | E o ponto mais fraco para parceiros: sem API publica, sem afiliado aberto, programa de parceria fechado a nao-solicitados e sem deep-link de comissao para terceiros. Um app de planejamento NAO consegue integrar inventario Airbnb oficialmente, nem ganhar comissao mandando trafego para ele. So sobra deep-link 'burro' (sem rastreio/sem receita) ou dados nao-oficiais via scrapers (AirDNA/AirROI). |

## 20. Oportunidades para superá-lo
- Ser o cerebro de DECISAO antes do destino: onde ir, quando, por quanto - etapa que o Airbnb ignora (ele assume que voce ja escolheu)
- Custo TOTAL realista da viagem (voo+hospedagem+transporte+comida+atividades+cambio) - Airbnb so mostra hospedagem
- Comparador NEUTRO de destinos e de canais de hospedagem (Airbnb vs. hotel vs. Booking) - Airbnb nunca dira 'um hotel sai mais barato'
- Super-perfil do viajante para recomendar destino/estilo/orcamento - Airbnb personaliza so apos a reserva
- Roteiro IA multi-cidade ponta a ponta com sequenciamento e tempos - Airbnb so mapeia o entorno da estadia
- Transparencia de custo total e de qualidade real (sem 'surpresa de taxa'), atacando a dor de preco inflado e suporte ruim
- Agnosticismo de fornecedor: levar o usuario ao melhor canal (e capturar afiliado de Booking/Expedia/Viator) ja que o proprio Airbnb nao paga afiliado

---

## Matriz (visão Mundo Sem Fim)
| Critério | Avaliação |
|---|---|
| Força principal | Inventario unico e marca dominante em hospedagem alternativa (network effect dos dois lados, oferta que hotel/OTA nao tem), com escala financeira (US$ 12,2 bi receita 2025) e operacao confiavel (reviews em massa, AirCover, pagamento retido). |
| Fraqueza principal | E uma ilha fechada e focado so na ETAPA DE RESERVA da hospedagem: sem API publica, sem afiliado aberto, sem custo total da viagem, sem comparacao de destinos e sem roteirizacao real - ignora toda a fase de planejamento/decisao e nao deixa parceiros monetizarem. |
| Modelo de receita | Comissao transacional como merchant of record: taxa host-only de 15,5% (pos-rollout 2025-2026), take rate implicito ~13,6% do GBV, + cut sobre Services/Experiences/hoteis + FX/float. Sem ads, sem assinatura. |
| Possui API? | Parcial. Apenas API de PARCEIRO (Preferred Software Partner para PMS/channel managers), invite-only e fechada a novos pedidos em 2026. Sem API publica, sem GDS/NDC, sem API de booking para apps de planejamento. |
| Possui afiliados? | Nao (na pratica). Programa de afiliado publico (Associates) encerrado em 31/03/2021; nao esta em Awin/CJ/Impact/Partnerize/Travelpayouts como merchant. So existe referral e um piloto frances de influencer-affiliate invite-only, sem deep-link de comissao aberto. |
| Pode virar parceiro? | Dificil/improvavel no curto prazo. O programa de software e curado e fechado a nao-solicitados (a Airbnb que escolhe), e nao ha trilha de afiliado para apps de terceiros. Caminho realista: tentar deep-link de marca (sem receita) e, em paralelo, virar parceiro de quem PAGA (Booking/Expedia/Viator/Sta |
| Pode pagar comissão? | Nao para nos como app de planejamento. Airbnb nao remunera trafego de afiliado externo (programa publico morto). Monetizacao via Airbnb so se entrarmos no clube fechado de parceiros - sem garantia. Por isso a comissao real vem de OUTROS players, nao do Airbnb. |
| Pode receber tráfego? | Sim - podemos mandar trafego/lead qualificado pra ele (viajante que ja decidiu destino e orcamento), mas hoje sem ganhar comissao por isso. Otimo para o usuario e para a experiencia, ruim para nossa receita ate haver afiliado/parceria. |
| Pode ser integrado? | Parcial, e fraco. Integracao oficial de inventario/booking: nao (sem API publica/afiliado). Viavel hoje: deep-link de busca pre-preenchida (destino+datas+hospedes) sem rastreio de comissao, e dados de mercado nao-oficiais via AirDNA/AirROI para enriquecer estimativas de custo de hospedagem. |
| **O que precisamos ter p/ superar** | Para superar o Airbnb naquilo que ele faz bem (escolher e confiar numa estadia), nosso app precisa de: (1) agregacao multi-fonte de hospedagem com comparacao NEUTRA Airbnb-vs-hotel-vs-Booking e estimativa de custo via dados de mercado; (2) custo TOTAL da viagem realista (voo+estadia+transporte+comida+cambio) que o Airbnb nao da; (3) roteiro IA multi-cidade ponta a ponta; (4) super-perfil do viajan |

## Fontes consultadas
- https://news.airbnb.com/airbnb-q4-2025-financial-results/
- https://s26.q4cdn.com/656283129/files/doc_financials/2025/q4/Airbnb_Q4-2025-Shareholder-Letter-Final.pdf
- https://www.airbnb.com/resources/hosting-homes/a/simplifying-airbnb-service-fees-746
- https://www.houst.com/blog/airbnb-hosting-fees
- https://www.hostaway.com/blog/airbnb-host-only-fee-what-to-know-about-the-15-percent-host-fee/
- https://www.lodgify.com/blog/airbnb-host-fees/
- https://news.airbnb.com/airbnb-2025-summer-release/
- https://news.airbnb.com/airbnb-2026-summer-release/
- https://techcrunch.com/2026/05/20/airbnb-gets-into-hotels-expands-ai-for-host-onboarding-and-customer-support/
- https://www.euronews.com/travel/2026/05/21/airbnb-expands-beyond-rentals-with-ai-planning-tools-airport-pickups-and-world-cup-experie
- https://elfsight.com/blog/how-to-get-and-use-airbnb-api-partnership-and-integration/
- https://www.airroi.com/blog/best-airbnb-api-providers
- https://developer.withairbnb.com/
- https://www.nichepursuits.com/airbnb-affiliate-program/
- https://hello.pricelabs.co/blog/airbnb-affiliate-program/
- https://influencermarketinghub.com/airbnb-influencer-affiliates/
- https://www.travelpayouts.com/blog/airbnb-affiliate-program-associates-alternatives/
- https://www.trustpilot.com/review/www.airbnb.com
- https://checkthat.ai/brands/airbnb/reviews
- https://www.airbnb.com/help/article/2868
- https://hostex.io/blog/airbnb-refund-policy/
