# Agoda

> **Categoria:** OTA (Online Travel Agency) global com foco e liderança na Ásia-Pacífico (APAC); parte do Booking Holdings
> _Perfil gerado por pesquisa multiagente (jun/2026). Parte do [Relatório de Mercado](../01-relatorio-de-mercado.md) e da [Matriz Competitiva](../02-matriz-competitiva.md)._

## 1. O que faz
Agoda é uma OTA de origem asiática (sede em Singapura/Bangkok), fundada em 2005 e adquirida pela Booking Holdings em 2007. É a marca do grupo mais forte em hotéis na Ásia, com inventário de mais de 6 milhões de propriedades, ~130 mil rotas aéreas e ~300 mil atividades. Em 2026 lançou um motor de reserva multi-produto que junta hotel + voo + atividade num único checkout, e opera também um braço B2B/white-label (Rocket Travel by Agoda) que abastece bancos, companhias aéreas e programas de fidelidade.

## 2. Público-alvo
Viajantes de lazer, especialmente no mercado asiático (Tailândia, Japão, Coreia, sudeste asiático, Índia) e caçadores de preço sensíveis a desconto. Forte entre mochileiros, nômades digitais e viajantes que querar hotéis baratos na Ásia. Lado B2B: pequenas OTAs, agências, bancos e programas de fidelidade que querem inventário APAC via API/white-label.

## 3. Funcionalidades principais
- Busca e reserva de hospedagem (hotéis, hostels, resorts, apartamentos, villas, NHA/non-hotel accommodation)
- Voos (desde out/2019) com ~130 mil rotas
- Atividades e atrações (~300 mil) e transfers de aeroporto
- Multi-product booking engine 2026: hotel+voo+atividade em checkout único
- AgodaCash (carteira de crédito/cashback para reuso na plataforma)
- PointsMAX (ganhar pontos do programa de fidelidade favorito do usuário ao reservar)
- Pacotes e promoções, programas de desconto agressivo (preço-isca e mensagens de urgência)
- App mobile com preços exclusivos de app
- Filtros, mapa, reviews de hóspedes, programa de fidelidade por níveis
- B2B / white-label via Rocket Travel by Agoda para bancos e cias aéreas

## 4. Como monetiza
- Modelo híbrido agency + merchant. Agency: hotel cobra o hóspede e paga comissão à Agoda (tipicamente 15-25% no segmento, maior que Booking.com em muitos mercados asiáticos). Merchant: Agoda compra/negocia tarifa net e revende com margem, embolsando o spread (margem = preço de venda - custo net)
- Publicidade / Sponsored Listings: PPC para hoteleiros aparecerem no topo (Top 3 / Top 15) por palavra-chave
- Booking Holdings Sponsored Listings (BHSL): CPC cross-network, lance único aparece em Booking.com + Priceline + Agoda ao mesmo tempo; lances a partir de USD 0,50/clique
- Spread cambial / FX markup e taxas em pagamentos (fonte recorrente de reclamação)
- AgodaCash como mecanismo de lock-in (crédito que só serve dentro da plataforma, aumenta LTV)
- Receita B2B/white-label via Rocket Travel by Agoda (fee de tecnologia/distribuição para bancos, cias e fidelidade; parceria Mastercard jan/2026 para resgate de pontos)

## 5. Afiliados
SIM. Agoda roda programa de afiliados PRÓPRIO (partners.agoda.com / affiliates.support.agoda.com) com painel, link tools e API de afiliado. Comissão típica de 4% a 7% em modelo CPS, escalonando por volume mensal (faixa mais citada: ~5% padrão, até 7% para alto volume; redes terceiras pagam menos, ex.: vCommission ~4,2%, Ecomobi ~4,8%, Cuelinks ~5,4%). Cookie curtíssimo de 1 dia (24h). Também é distribuído via agregadores como Travelpayouts, Cuelinks, Ecomobi e vCommission. IMPORTANTE: o programa de afiliado comissiona basicamente HOSPEDAGEM (voos/atividades em geral fora) e deeplinking é restrito/proibido em algumas redes (ex.: Cuelinks).

## 6. API
SIM, robusta mas de PARCEIRO (não self-serve público). Dois trilhos: (1) API de Afiliado/Demand via partners.agoda.com com Content API (conteúdo de propriedades), Search/Long Tail Search API (disponibilidade e tarifas), Book API e Post-Booking API; auth via OAuth 2.0 (recomendado) ou API-Key + siteid. Tiers: Online Affiliates/MSE (só Search, para metasearch/comparadores), Agoda Fulfill Assisted (Search+Book, Agoda faz pós-venda) e Partner Fulfillment (controle total). (2) B2B/white-label via Rocket Travel by Agoda (Accommodation Distribution API) para bancos/cias/fidelidade. Acesso exige aprovação/contrato e avaliação de modelo de negócio e volume — não há cadastro instantâneo aberto. Sem GDS próprio; não é fonte NDC.

## 7. Programa de parceiros
Múltiplos trilhos de parceria: (a) Programa de Afiliados próprio para publishers/criadores (CPS 4-7%, cookie 24h); (b) Agoda Partner Hub para hoteleiros, com Sponsored Listings (PPC) e BHSL (CPC cross-network Booking.com/Priceline/Agoda, lance mínimo USD 0,50); (c) Programa de conectividade/distribuição B2B (Affiliate/Demand API em 3 tiers) para OTAs e plataformas de viagem; (d) Rocket Travel by Agoda — braço B2B/white-label para bancos, companhias aéreas, varejo e programas de fidelidade (parceria Mastercard jan/2026 para resgate instantâneo de pontos em estadias e voos).

## 8. Dados que oferece
- Inventário e preços de >6M propriedades (forte em APAC), incl. NHA (apartamentos/villas/hostels)
- Disponibilidade e tarifas em tempo real via Search/Long Tail API
- Conteúdo de propriedades (fotos, comodidades, descrição, política) via Content API
- Voos (~130k rotas) e atividades/atrações (~300k) — via produto, embora afiliação comissione sobretudo hotel
- Reviews e notas de hóspedes
- Deeplinks para páginas específicas (via Travelpayouts; restrito no programa nativo)
- Dados de booking/estatística para afiliados (via API de estatística da rede)
- Preços líquidos/net (modelo merchant) para parceiros B2B contratados

## 9. Dados que NÃO oferece
- Custo TOTAL realista de viagem (só preço do produto reservável: diária, voo, atividade — sem comida, transporte local diário, ingressos avulsos, seguro, câmbio real do dia-a-dia)
- Roteiro dia-a-dia ou itinerário estruturado
- Comparação entre DESTINOS (compara hotéis dentro de um destino, não 'Tailândia vs Vietnã vs Portugal' por custo/clima/vibe)
- Recomendação personalizada por perfil profundo do viajante (orçamento, estilo, restrições)
- Dados de clima, sazonalidade, segurança, vistos por destino
- Cookie longo / atribuição multi-touch (só 24h, ruim para jornada de planejamento longa)
- API self-serve instantânea para devs pequenos (exige contrato/aprovação)
- Comissionamento confiável de voos/atividades para afiliados (foco em hotel)

## 10. Pontos fortes
- Inventário de hospedagem dominante na Ásia-Pacífico — frequentemente mais barato e com mais opções que concorrentes em Tailândia, Japão, Coreia e sudeste asiático
- Pertence ao Booking Holdings: escala financeira, tecnologia de ranking/ads e rede cruzada (BHSL) gigante
- Preços agressivos, cupons, AgodaCash e tarifas-só-de-app que atraem caçadores de desconto
- Stack de API de parceiro completo (Content/Search/Book/Post-Booking) e tiers flexíveis para integradores
- Forte em NHA (apartamentos/villas/hostels), não só hotel de cadeia
- Braço B2B/white-label maduro (Rocket Travel) com casos reais com bancos, cias e Mastercard
- Multi-produto 2026 (hotel+voo+atividade em 1 checkout) aumenta ticket e cross-sell

## 11. Pontos fracos
- Reputação de atendimento péssima: Trustpilot ~1,4 estrela com ~82% de avaliações 1 estrela; pesadelos de reembolso recorrentes
- Crise regulatória no Japão (2025): autoridades criticaram hotéis 'indisponíveis', reservas canceladas e discrepância de preço; pesquisa Nikkei apontou ~20% dos usuários com algum problema e metade com suporte inadequado
- Cookie de afiliado de apenas 24h — péssimo para jornadas de planejamento longas (o usuário pesquisa semanas antes de comprar)
- Programa de afiliado comissiona sobretudo hospedagem; voos/atividades ficam de fora ou são instáveis
- Taxas/markup cambial e 'preço final' diferente do anunciado geram desconfiança
- Histórico de práticas enganosas (CMA-UK 2017: hidden charges, pressure selling, descontos enganosos) e listagens ilegais (Tailândia/Taipei)
- Caso trabalhista 2025 (Singapura): cláusulas de severance que proibiam contato com órgãos públicos — dano reputacional
- Foco quase total em transação/conversão; zero ferramenta de planejamento ou decisão de destino

## 12. Reclamações comuns dos usuários
- 'Paguei adiantado, a propriedade cancelou e a Agoda se recusou a reembolsar' (casos Bangkok dez/2025)
- Suporte inalcançável por dias; difícil achar telefone; respostas em loop de 'aguarde 24-48h'
- Agoda joga a responsabilidade para a propriedade ('precisa de aprovação do hotel') que fica inacessível
- Cobranças fraudulentas / cobrança sem ter usado o site (relato de €712 em Singapura)
- Preço sobe do anúncio até o checkout; taxas e câmbio inesperados
- No Japão: hotel listado mas indisponível na chegada, overbooking, reserva sumindo
- Reembolsos demoram semanas ou não saem; AgodaCash empurrado no lugar de dinheiro de volta
- Dificuldade de alterar/cancelar dentro das regras prometidas

## 13–19. Limitações
| Eixo | Limitação |
|---|---|
| **UX** | UX otimizada para conversão rápida e pressão de compra (urgência, 'só restam X', preço-isca), não para deliberação. Bom para quem já sabe destino e datas; ruim para quem está decidindo. Sensação de 'bait' quando o preço final difere do anunciado por taxas/câmbio. Pós-venda (cancelar/reembolsar) é onde a UX desmorona e gera a maior parte das reclamações. |
| **Personalização** | Personalização rasa: recomenda por histórico de cliques e popularidade, não por um super-perfil de viajante (orçamento real, estilo, ritmo, restrições, com quem viaja). Não adapta sugestões a 'lua de mel econômica' vs 'família com 2 filhos' vs 'nômade 30 dias'. Sem memória de intenção de planejamento ao longo de semanas. |
| **IA** | IA voltada a ranking/preço e busca, não a planejamento. Roadmap 2026 promete mais 'AI front-end' conectando hotel+voo+atividade, mas é assistência de compra, não um copiloto de itinerário que monta dia-a-dia, equilibra orçamento total e justifica trade-offs. Não responde 'me planeje 7 dias no Peru com R$ X incluindo tudo'. |
| **Roteirização** | Não faz roteirização. Vende blocos isolados (cama, assento, ingresso de atividade) sem sequenciá-los num itinerário coerente por dia, com deslocamentos, tempo entre pontos e logística. O multi-produto 2026 é checkout combinado, não um roteiro otimizado geográfica/temporalmente. |
| **Orçamento** | Mostra só o preço do que é reservável (diária, voo, atividade). Não calcula custo TOTAL realista da viagem: comida, transporte local diário, ingressos avulsos, seguro, gorjetas, câmbio do dia-a-dia, imprevistos. O viajante não consegue responder 'quanto essa viagem custa de verdade' — só 'quanto custa esta diária'. Markup cambial ainda distorce o número exibido. |
| **Comparação** | Compara propriedades DENTRO de um destino/datas, não compara DESTINOS entre si. Não ajuda a escolher entre 'Tailândia vs Vietnã vs Portugal' por custo total, clima, segurança, vibe e adequação ao perfil. A decisão de PARA ONDE ir acontece toda fora da Agoda — exatamente o gap de topo de funil que uma plataforma de planejamento ocupa. |
| **Integração** | Integrável, mas com atrito: API de parceiro completa (Content/Search/Book/Post-Booking, OAuth2) porém atrás de aprovação/contrato e avaliação de volume — sem self-serve instantâneo. Caminho rápido é via afiliado nativo (link/deeplink) ou agregadores (Travelpayouts, Cuelinks), mas com cookie de só 24h, comissão concentrada em hotel e deeplink restrito em algumas redes. Para integração profunda de i |

## 20. Oportunidades para superá-lo
- Cookie de 24h é fatal para planejamento longo — nosso app captura a intenção semanas antes; podemos nutrir o usuário e disparar o clique de afiliado no momento da decisão, dentro da janela
- Agoda não compara DESTINOS nem calcula custo total: nosso 'comparar destinos' e 'custo total realista' são exatamente o topo de funil que ele não cobre — entregamos a decisão e mandamos o tráfego já quente pra ele fechar a cama
- Atendimento/refund é o ponto mais odiado: posicionar nosso app como camada neutra de PLANEJAMENTO (não somos a OTA, não detemos o problema de reembolso) protege nossa marca enquanto monetizamos o clique
- Markup cambial e 'preço final diferente' geram desconfiança: nosso orçamento realista e transparente vira diferencial de confiança
- Afiliado nativo só comissiona hotel — podemos diversificar (voos/atividades via outros parceiros) e usar Agoda especificamente para hospedagem APAC, onde ele é imbatível em preço
- Roteiro IA + super-perfil entregam o que o roadmap de 'AI' da Agoda só promete: viramos o cérebro de planejamento e ele vira o fulfillment
- Forte na Ásia: para destinos APAC, priorizar Agoda no nosso comparador de tarifas maximiza tanto economia do usuário quanto nossa comissão

---

## Matriz (visão Mundo Sem Fim)
| Critério | Avaliação |
|---|---|
| Força principal | Inventário de hospedagem dominante e barato na Ásia-Pacífico, apoiado pela escala do Booking Holdings (tecnologia, ads cross-network BHSL e poder de preço). |
| Fraqueza principal | Reputação de pós-venda catastrófica (Trustpilot ~1,4, crise regulatória no Japão 2025, reembolsos travados) somada a zero capacidade de planejamento/decisão de viagem — só converte quem já decidiu. |
| Modelo de receita | Híbrido agency (comissão ~15-25%) + merchant (margem sobre tarifa net) + publicidade PPC/CPC (Sponsored Listings e BHSL a partir de USD 0,50/clique) + B2B/white-label (Rocket Travel) + lock-in via AgodaCash. |
| Possui API? | Sim — API de parceiro completa (Content/Search/Long-Tail/Book/Post-Booking, OAuth2 ou API-Key, 3 tiers). Não é self-serve público; exige aprovação/contrato. Sem GDS/NDC próprio. |
| Possui afiliados? | Sim — programa próprio (partners.agoda.com) CPS 4-7% escalonando por volume (~5% típico), cookie de só 24h, comissiona sobretudo hospedagem; também via Travelpayouts/Cuelinks/Ecomobi/vCommission. |
| Pode virar parceiro? | Sim. Caminho rápido: afiliado nativo ou agregador (Travelpayouts) para começar a monetizar já. Caminho profundo: aplicar à Demand/Affiliate API (tier MSE/Online Affiliate) para puxar tarifas e mandar booking — sujeito a aprovação de volume. |
| Pode pagar comissão? | Sim — CPS 4-7% sobre hospedagem (tende a ~5%, até 7% em alto volume). Atenção: cookie de 24h e foco em hotel limitam captura; planejar disparo do clique no momento da decisão. |
| Pode receber tráfego? | Sim — é destino ideal de tráfego qualificado para FULFILLMENT de hospedagem, principalmente em destinos APAC onde tem o melhor preço. |
| Pode ser integrado? | Sim (Parcial sem contrato): via afiliado/deeplink (Travelpayouts) de imediato; via API de inventário (Search/Book) mediante relação comercial e aprovação de volume. Deeplink restrito em algumas redes (ex.: Cuelinks). |
| **O que precisamos ter p/ superar** | Para superar Agoda no que ele faz bem (hospedagem barata APAC): (1) um meta-comparador de tarifas de hospedagem que inclua Agoda e mostre o preço FINAL real (com câmbio/taxas) eliminando a sensação de bait; (2) priorização inteligente de Agoda para destinos asiáticos no nosso ranking; (3) deeplink/afiliado disparado no momento exato da decisão para vencer o cookie de 24h; (4) transparência de preç |

## Fontes consultadas
- https://en.wikipedia.org/wiki/Agoda
- https://developer.agoda.com/demand/docs/getting-started
- https://partners.agoda.com/DeveloperPortal/APIDoc
- https://affiliates.support.agoda.com/kb/s/article/Search-API-Guideline
- https://partners.agoda.com/Content/Documents/AffiliateLiteApi/Affiliate_Lite_API_V2.0.pdf
- https://getlasso.co/affiliate/agoda/
- https://www.cuelinks.com/campaigns/agoda-affiliate-program
- https://ecomobi.com/agoda-affiliate-program-earn-4-8-commission-with-ecomobi/
- https://www.vcommission.com/blog/publishers/agoda-affiliate-program-scale-earnings-with-the-best-flight-hotel-deals-worldwide/
- https://www.zentrumhub.com/blog/agoda-hotel-api-guide/
- https://www.rockettravel.com/our-solutions/accommodation-api
- https://partnerhub.agoda.com/hotel-solutions/sponsored-listings/
- https://partnerhub.agoda.com/what-is-bhsl/
- https://partnerhub.agoda.com/hotel-solutions/booking-holdings-sponsored-listings/
- https://www.mastercard.com/news/ap/en/newsroom/press-releases/en/2026/agoda-and-mastercard-collaborate-to-modernize-loyalty-programs-with-flexible-travel-rewards/
- https://thethaiger.com/travel/agodas-plan-make-everything-possible-for-partners-2026
- https://www.travelandtourworld.com/news/article/singapores-agoda-brings-ultimate-freedom-to-travellers-with-innovative-booking-system-that-combines-hotels-flights-and-activities-into-a-single-stress-free-experience/
- https://www.trustpilot.com/review/www.agoda.com
- https://www.bbb.org/us/ny/new-york/profile/online-travel-agency/agoda-0121-161919/complaints
- https://agoda.pissedconsumer.com/complaints/RT-P.html
- https://trvlguides.com/articles/how-agoda-makes-money
- https://businessmodelhub.in/agoda-business-model/
- https://support.travelpayouts.com/hc/en-us/categories/200358578-API-and-data
