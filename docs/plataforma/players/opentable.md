# OpenTable

> **Categoria:** Reservas de restaurante / marketplace de dining (EUA e global, ~60.000 restaurantes)
> _Perfil gerado por pesquisa multiagente (jun/2026). Parte do [Relatório de Mercado](../01-relatorio-de-mercado.md) e da [Matriz Competitiva](../02-matriz-competitiva.md)._

## 1. O que faz
OpenTable e o maior marketplace de reservas de restaurante do mundo (parte do Booking Holdings). Para o consumidor, e um app/site gratuito que mostra disponibilidade de mesa em tempo real, permite reservar, deixar reviews e ganhar pontos resgataveis. Para o restaurante, e um SaaS de gestao de reservas (livro de reservas eletronico, gestao de mesas, CRM de hospedes, marketing) que alimenta uma rede de demanda. Em 2025 lancou o 'Concierge', um assistente de IA generativa (OpenAI + Perplexity) que responde duvidas sobre os restaurantes e ajuda na descoberta antes de reservar.

## 2. Público-alvo
Dois lados: (1) diners urbanos nos EUA/Canada/UK/Australia que comem fora com frequencia e querem reservar mesa rapido, especialmente para jantar e ocasioes especiais; (2) restaurantes de servico completo (full-service) de medio/alto padrao que precisam encher mesas e gerir reservas. Forte em metropoles dos EUA.

## 3. Funcionalidades principais
- Busca e reserva de mesa com disponibilidade em tempo real por data/hora/numero de pessoas
- Filtros por cozinha, faixa de preco ($-$$$$), bairro, nota e 'reservavel agora'
- Programa de pontos (Dining Points/Rewards) resgataveis em Dining Cheques
- Reviews verificados (so quem reservou e compareceu pode avaliar)
- Concierge: assistente de IA generativa que responde perguntas sobre o restaurante (cardapio, assentos externos, dietas, grupos)
- Experiences: pacotes pagos e menus especiais (degustacao, eventos, festivos)
- Premier/Top-rated lists e curadoria editorial de restaurantes
- Gestao para restaurantes: livro de reservas eletronico, gestao de mesas/turnos, CRM de hospedes, waitlist, pagamentos
- Widget de reserva embutivel no site/Instagram/Facebook do restaurante e em apps de parceiros
- Integracoes com POS, Google, Instagram, e assistentes (Microsoft Copilot, Alexa+, Salesforce Agentforce)

## 4. Como monetiza
- B2B SaaS por assinatura mensal do restaurante: Basic ~US$149/mes, Core ~US$299/mes, Pro ~US$499/mes (precos EUA, 2025-2026)
- Cover fee (taxa por comensal sentado) sobre reservas vindas da REDE OpenTable: ~US$1,50/cover no Basic e ~US$1,00/cover no Core/Pro
- Cover fee sobre reservas vindas do PROPRIO site do restaurante: US$0,25/cover ou flat US$49/mes no Basic; gratis no Core/Pro
- So cobra por comensal efetivamente sentado (nao cobra no-show nem cancelamento)
- Receita de 'Experiences' / menus pagos (OpenTable fica com parte) e Dining Points/Promoted (restaurante paga pontos extras para subir em destaque)
- Publicidade/listagem promovida e colocacao premium na busca
- Comissao/afiliado sobre reservas geradas por parceiros externos (ver afiliados)

## 5. Afiliados
Sim. Programa de afiliados PROPRIO (in-house partner management system), nao roda nas grandes redes (CJ/Awin/Impact/Partnerize) de forma aberta, embora historicamente tenha aparecido em CJ/Impact para campanhas pontuais. Modelo de pagamento por PERFORMANCE: tipicamente US$0,25 a US$1,00 por COMENSAL SENTADO (varia por tier do restaurante e volume), nao por clique. Janela de cookie ~30 dias. Pagamento so por reserva confirmada e comparecida (no-show = US$0). Aprovacao de parceiro/afiliado leva ~3-4 semanas (sandbox + QA). Pagamentos via PayPal/cheque/wire. Comissoes consideradas baixas para o setor de viagens.

## 6. API
Sim, API REST de PARCEIRO (nao publica/aberta; exige aprovacao). Portais dev.opentable.com e docs.opentable.com com Sandbox e Producao. Principais: Directory API (dados de restaurantes + links de reserva), APIs de sincronizacao de reservas/hospedes/pedidos para POS/CRM, e o trilho de afiliado (links/widget de reserva embutivel com disponibilidade ao vivo). Nao e GDS nem NDC. Acesso so apos virar 'integration partner' aprovado.

## 7. Programa de parceiros
OpenTable Partner Network (opentable.com/restaurant-solutions/api-partners). Dois trilhos: (1) Integration Partner (POS, CRM, tech stack que sincroniza dados via API) e (2) Standard Affiliate Partner (sites/apps que enviam trafego e ganham por reserva). Inclui acesso a Sandbox, revisao manual da equipe de parcerias e QA antes de ir a Producao. Booking Holdings (dono) tambem conecta OpenTable a ecossistema Booking/Priceline/Kayak.

## 8. Dados que oferece
- Disponibilidade de mesa em tempo real (data/hora/no de pessoas)
- Catalogo de ~60.000 restaurantes com cozinha, faixa de preco, bairro, fotos, cardapio
- Notas e reviews verificados de quem realmente comeu no local
- Links/deeplinks de reserva e widget embutivel
- Respostas contextuais via Concierge (IA) sobre cada restaurante
- Para restaurantes parceiros: dados de hospedes, historico, no-show, pedidos (via API de parceiro)

## 9. Dados que NÃO oferece
- Roteiro de viagem completo (so o componente 'jantar', nao a viagem inteira)
- Voos, hospedagem, transporte ou qualquer item nao-restaurante
- Custo total realista de uma viagem (so o gasto da refeicao, e nem sempre com preco final por pessoa)
- Comparacao entre DESTINOS/cidades para decidir para onde ir
- Cobertura forte fora de grandes centros EUA/UK/AU (longtail e mercados emergentes fracos)
- Reservas em restaurantes que usam concorrentes (Resy, Tock, SevenRooms) ou que so atendem walk-in
- Perfil de viajante multi-dominio (so conhece preferencia de dining, nao o super-perfil de viagem)

## 10. Pontos fortes
- Maior rede de demanda de dining do mundo: inventario de ~60.000 restaurantes e marca dominante nos EUA
- Disponibilidade em tempo real confiavel e fluxo de reserva de poucos cliques
- Reviews verificados (so quem compareceu) dao alta confianca vs reviews abertos
- Programa de pontos cria recompra e fidelidade do diner
- Lancou Concierge (IA generativa) em 2025 e integrou com Copilot/Alexa+/Agentforce, entrando cedo na corrida de descoberta por IA
- Lastro do Booking Holdings (capital, distribuicao, dados de viagem)
- Modelo de afiliado por comensal-sentado = lead de altissima qualidade (intencao + presenca confirmada)

## 11. Pontos fracos
- Custo alto e impopular entre restaurantes (assinatura + cover fee por comensal da rede), gerando churn para Resy/Tock/SevenRooms
- Programa de pontos/rewards cheio de atrito: pontos somem, resgate nao chega, cap de US$50 quando se tem US$100, sem split
- Falhas tecnicas: 'reservas-fantasma' que o restaurante nao recebe e glitch sistemico de double-booking em dez/2025
- Suporte ao diner fraco (1,5/5 no Trustpilot), dificil falar com humano
- Foco em refeicao isolada, sem visao de viagem/itinerario
- Cobertura geografica desigual fora de grandes cidades EUA
- API fechada e onboarding de parceiro lento (3-4 semanas + QA)
- Comissoes de afiliado baixas (US$0,25-1,00/comensal) vs outros verticais de travel

## 12. Reclamações comuns dos usuários
- Pontos de fidelidade perdidos / Dining Cheque prometido nunca creditado, as vezes 3+ meses apos resgate
- Reservas-fantasma: app confirma mas o restaurante nao tem registro e nao honra a mesa
- Glitch sistemico em dez/2025 causou double-booking confirmado por usuarios no Reddit
- Cap de resgate (so US$50 mesmo com US$100 acumulado) e impossibilidade de dividir o reward = perda do excedente
- Suporte inacessivel / sem atendimento humano; erros de login, verificacao e confirmacao
- Restaurantes reclamam do custo (cover fees corroem margem) e de pagar pela propria base de clientes
- Cobranca/refund dificeis de resolver; nota geral baixissima do diner (1,5/5 Trustpilot)

## 13–19. Limitações
| Eixo | Limitação |
|---|---|
| **UX** | UX de reserva e excelente e rapida, mas a jornada de FIDELIDADE/pos-reserva e ruim: pontos que somem, resgate confuso com cap de US$50 e sem split, e suporte quase inalcancavel. Erros de login/verificacao e 'reservas-fantasma' quebram a confianca exatamente no momento critico (chegar e nao ter mesa). Nota de diner de 1,5/5 no Trustpilot resume a frustracao quando algo da errado. |
| **Personalização** | Personalizacao limitada ao dominio 'dining': conhece preferencia de cozinha, faixa de preco e historico de reservas, mas nao monta um super-perfil de viajante (estilo de viagem, orcamento total, com quem viaja, datas). Recomendacoes ainda sao majoritariamente por popularidade/curadoria editorial; a personalizacao 1:1 baseada em historico foi prometida como 'futuro' do Concierge, nao entregue de fo |
| **IA** | O Concierge (2025) e reativo e raso: responde perguntas sobre UM restaurante (cardapio, assentos, dietas) e ajuda na descoberta dentro do app, mas nao planeja, nao raciocina sobre uma viagem inteira, nao otimiza orcamento nem encadeia decisoes. Booking autonomo e personalizacao por historico estao no roadmap, nao em producao. A IA serve a conversao de reserva, nao ao planejamento. |
| **Roteirização** | Inexistente. OpenTable nao roteiriza nada: nao monta itinerario, nao sequencia dias, nao combina almoco/jantar/passeios, nao considera deslocamento entre locais nem horario do voo. Entrega no maximo uma reserva pontual; o 'jantar de terca as 20h' e um item solto, nunca um dia ou uma viagem planejada. |
| **Orçamento** | So expoe faixa de preco simbolica ($ a $$$$), nao o custo real por pessoa de uma refeicao (sem ticket medio confiavel, sem couvert/gorjeta/bebida). Nao soma gasto de varias refeicoes, nao integra ao custo total da viagem e nao ajuda o usuario a decidir destino por orcamento. Ironicamente, os cover fees encarecem o restaurante sem repassar transparencia de preco ao diner. |
| **Comparação** | Compara RESTAURANTES dentro de uma mesma cidade (por nota, preco, disponibilidade), mas nao compara DESTINOS/cidades para ajudar a decidir para onde viajar. Nao responde 'Lisboa vs Barcelona para uma viagem gastronomica' com custo, clima, logistica. A comparacao e tatica (onde jantar hoje), nunca estrategica (para onde ir). |
| **Integração** | API existe mas e fechada: exige virar parceiro aprovado (3-4 semanas + QA em sandbox), nao ha self-service publico. Directory API e widget/deeplink de afiliado sao o caminho viavel para um app externo, mas a disponibilidade em tempo real completa fica atras do credenciamento. Cobertura concentrada em EUA/UK/AU limita uso global. Nao e GDS/NDC e nao expoe inventario de viagem alem de dining. |

## 20. Oportunidades para superá-lo
- Tratar dining como UM componente do roteiro de viagem (almoco/jantar encaixados no dia, perto dos passeios e do hotel) - algo que OpenTable nao faz
- Mostrar custo real por pessoa da refeicao e somar ao custo TOTAL da viagem, dando a transparencia de preco que OpenTable nao da
- Comparar DESTINOS por experiencia gastronomica + orcamento, nao so restaurantes na mesma cidade
- Super-perfil do viajante alimentando recomendacao de onde comer (dieta, estilo, com quem viaja), indo alem do perfil so-dining
- Cobertura global real (mercados que OpenTable ignora) agregando OpenTable onde forte + Resy/Tock/locais onde nao esta
- IA de PLANEJAMENTO que sequencia e otimiza a viagem inteira, usando OpenTable so como camada de reserva de mesa no fim
- Capturar o diner frustrado com pontos/suporte da OpenTable oferecendo experiencia confiavel de ponta a ponta
- Monetizar enviando lead de alta intencao (viajante com data e destino definidos) e ganhando comissao por comensal-sentado

---

## Matriz (visão Mundo Sem Fim)
| Critério | Avaliação |
|---|---|
| Força principal | Maior rede de demanda de reservas de restaurante do mundo (~60.000 restaurantes), disponibilidade em tempo real e marca dominante de dining nos EUA, com lastro do Booking Holdings. |
| Fraqueza principal | Visao estreita: resolve a reserva de UMA mesa, nao a viagem. Sem roteiro, sem custo total, sem comparacao de destinos, e com fidelidade/suporte ao diner muito criticados (1,5/5 Trustpilot). |
| Modelo de receita | B2B SaaS do restaurante (assinatura US$149-499/mes) + cover fee por comensal sentado (US$1,00-1,50 rede; US$0,25 site proprio) + Experiences/pontos promovidos/ads + afiliado por comensal. |
| Possui API? | Parcial. API REST de PARCEIRO (Directory + sync + widget/deeplink de afiliado), so com aprovacao (3-4 semanas + sandbox/QA). Nao e publica, nem GDS/NDC. |
| Possui afiliados? | Sim. Programa proprio (in-house), pagamento por performance ~US$0,25-1,00 por comensal SENTADO, cookie ~30 dias, so reserva comparecida paga; comissoes baixas para o setor. |
| Pode virar parceiro? | Sim. Via OpenTable Partner Network como Standard Affiliate Partner (enviar trafego e ganhar por reserva) e/ou Integration Partner (consumir Directory/availability). Requer aprovacao manual. |
| Pode pagar comissão? | Sim, mas baixo: ~US$0,25-1,00 por comensal sentado, modelo CPA performance puro (no-show nao paga). Lead de qualidade, ticket de comissao pequeno. |
| Pode receber tráfego? | Sim. OpenTable pode mandar diners de alta intencao para nosso app via deeplink/parceria, mas estrategicamente o trafego que mais nos interessa e o contrario: nos somos upstream (planejamento) e ele e downstream (reserva). |
| Pode ser integrado? | Parcial. Integravel via Directory API + widget/deeplink de afiliado apos virar parceiro; disponibilidade ao vivo completa fica atras do credenciamento. Onde OpenTable nao cobre, complementar com Resy/Tock/locais. |
| **O que precisamos ter p/ superar** | (1) Reserva de mesa de poucos cliques com disponibilidade ao vivo (via integracao OpenTable + alternativas); (2) reviews/sinal de confianca de quem realmente foi; (3) cobertura agregada multi-fonte e global, nao so EUA; (4) experiencia de fidelidade/suporte CONFIAVEL para capturar o diner frustrado; e principalmente (5) o que OpenTable nao tem: encaixar o jantar no ROTEIRO, mostrar custo real soma |

## Fontes consultadas
- https://www.opentable.com/restaurant-solutions/plans/
- https://restaurant.eatapp.co/blog/opentable-pricing
- https://tekpon.com/software/opentable/pricing/
- https://tablelink.app/blog/opentable-fees-explained
- https://www.getapp.com/all-software/a/opentable-for-restaurants/pricing/
- https://www.opentable.com/restaurant-solutions/api-partners/
- https://www.opentable.com/restaurant-solutions/api-partners/become-a-partner/
- https://dev.opentable.com/
- https://docs.opentable.com/
- https://elfsight.com/blog/how-to-get-and-use-opentable-api/
- https://uppromote.com/affiliate-directory/opentable/
- https://howtojoinaffiliateprograms.com/opentable-affiliate-program/
- https://help.opentable.com/s/article/OpenTable-Affiliate-Program-1505261059868
- https://www.opentable.com/blog/concierge-ai-dining-assistant/
- https://www.pymnts.com/restaurant-innovation/2025/opentable-debuts-ai-powered-concierge-for-diners/
- https://restauranttechnologynews.com/2025/08/opentable-launches-embedded-concierge-to-answer-diner-questions-and-drive-restaurant-bookings/
- https://www.trustpilot.com/review/www.opentable.com
- https://opentable.pissedconsumer.com/review.html
- https://www.complaintsboard.com/opentable-b122917
- https://viewfromthewing.com/new-opentable-scam-to-cheat-you-out-of-your-points/
