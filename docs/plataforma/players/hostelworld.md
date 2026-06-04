# Hostelworld

> **Categoria:** Hostels / mochileiro / social (OTA de hospedagem econômica + rede social de viagem)
> _Perfil gerado por pesquisa multiagente (jun/2026). Parte do [Relatório de Mercado](../01-relatorio-de-mercado.md) e da [Matriz Competitiva](../02-matriz-competitiva.md)._

## 1. O que faz
OTA especializada em hostels e hospedagem econômica que evoluiu para se posicionar como "a primeira plataforma de viagem social do mundo". Em 2026 combina três frentes: (1) reserva de hostels/camas (core histórico, ~13-17 milhões de avaliações verificadas, 19 idiomas); (2) inventário de "budget accommodation" via fornecedor terceirizado, expandido para ~18.000 destinos; e (3) camada social (chats da cidade, eventos como pub crawls e taco nights, perfis de viajantes) monetizada via assinatura avulsa Social Pass. O app mobile é o centro de gravidade e foi premiado como "Best Hostel App 2026".

## 2. Público-alvo
Mochileiros, viajantes solo e jovens (público-alvo declarado de ~120 milhões de "youth travellers" globais), faixa ~18-35 anos, sensíveis a preço e que valorizam o aspecto social/conhecer pessoas. Forte em rotas clássicas de mochilão (Sudeste Asiático, Europa, América Latina, Austrália). Não atende bem famílias, viajantes corporativos ou público de conforto/luxo.

## 3. Funcionalidades principais
- Busca e reserva de hostels (camas em dormitório e quartos privativos) e budget accommodation em ~18.000 destinos
- Sistema de avaliações verificadas (~13M+ reviews) com notas por critério (limpeza, segurança, staff, ambiente)
- App mobile premiado com chats da cidade (City Chats), mensagens privadas e chats por interesse/plano de viagem
- Eventos sociais curados (pub crawls, beach parties, hikes, karaoke) para conectar viajantes solo
- Perfis de viajantes (idade, idiomas, estatísticas de viagem)
- Social Pass: acesso às features sociais SEM precisar reservar cama (assinatura avulsa)
- Programa de fidelidade/recompensas para hostels (Elevate) e ferramentas de dados para a oferta
- Venda de ancillaries no fluxo: seguro viagem, tours locais e transporte
- Filtros por preço, tipo de quarto, nota, localização e 'vibe' social do hostel
- Mapa de hostels e informações de localização/check-in

## 4. Como monetiza
- Comissão sobre reservas (core): taxa efetiva de comissão subiu de 15,2% (H1 2024) para 16,7% (H2 2025) e ~17,7% no Q1 2026 — modelo predominantemente AGENCY (hóspede paga depósito/parcial via Hostelworld e o saldo no hostel)
- Programa Elevate: hostels diretamente contratados aceitaram aumentos de comissão em troca de mais demanda qualificada, melhores dados e ferramentas de plataforma
- Budget accommodation: receita incremental sobre inventário de terceiros (modelo de revenda/markup)
- Social Pass (assinatura avulsa, lançado nov/2025): €4,99 (1 semana), €9,99 (1 mês), €19,99 (3 meses), €59,99 (1 ano) — sem renovação automática; 37% dos compradores eram novos na Hostelworld
- Ancillaries / ARPU: comissão sobre seguro viagem, tours e transporte vendidos no fluxo de reserva
- Receita líquida FY2025 de €93,8M (+2%), EBITDA ajustado ~€19,9M; meta de crescimento de receita low double-digit em 2026-2027 e margem EBITDA >20%

## 5. Afiliados
Sim, tem programa de afiliados ativo, operado pela rede Partnerize (anteriormente conhecida como PHG / Performance Horizon). Comissão é CPA calculada sobre o DEPÓSITO que a Hostelworld recebe por reserva qualificada — fontes citam ~18-22% do depósito (e agregadores como Travelpayouts anunciam "até 40% do depósito"). Atenção: como a base é o depósito (tipicamente ~10-15% do valor da estadia) e o ticket médio é baixo (~US$20 de preço médio citado, eCPC ~US$0,04), a comissão absoluta por reserva é pequena. Cookie de 30 dias, sem taxa de adesão, pagamento mensal via plataforma PHG/Partnerize, mínimo de saque ~US$30. Também disponível de forma agregada via Travelpayouts. Não usei evidência de presença em Awin/CJ/Impact/Commission Junction; a rede oficial é Partnerize.

## 6. API
Sim — Partner API documentada via Swagger/OpenAPI (partner-api.hostelworld.com e hpa-partner-api.hostelworld.com), concedida "caso a caso" mediante contato com affiliates@hostelworld.com. É uma API de PARCEIRO/AFILIADO (não pública aberta, não GDS/NDC). Expõe: busca de disponibilidade para datas em lista de propriedades, informações de reserva (termos e preço mais barato de um quarto num período), e Property Links (links de referral/deep link para o hostel). Para afiliados de menor porte, há alternativas mais simples: Deep Links + Creatives e um Feed filtrável (XML/data feed) com propriedades, preços e reviews. Há também integrações de inbound (channel managers/PMS como e4jConnect, Rentals United) para hostels sincronizarem tarifas/inventário — mas isso é fornecimento de oferta, não distribuição para parceiros.

## 7. Programa de parceiros
Hostelworld Affiliate Programme (partners.hostelworld.com), via Partnerize. Três níveis de solução: (1) Deep Links + Creatives (banners/links em vários tamanhos e 19 idiomas) para blogs/sites de conteúdo; (2) Feed (dados filtráveis de propriedades, preços, reviews) para sites/apps que querem montar páginas próprias; (3) API (caso a caso) para integrações mais profundas de disponibilidade/preço. Adesão gratuita, aprovação por análise, comissão CPA sobre depósito, cookie 30 dias, pagamento mensal. Foco do programa é em criadores de conteúdo de viagem e mochilão, não em super-apps de planejamento com decisão transacional embarcada.

## 8. Dados que oferece
- Disponibilidade de camas/quartos por destino e datas (via API/Feed)
- Preço mais barato de um quarto num período + termos de reserva
- Inventário de hostels e budget accommodation em ~18.000 destinos
- Avaliações verificadas (~13M+) com notas por critério e textos de reviews
- Property info: descrição, comodidades, fotos, localização do hostel
- Deep links / referral links para a página do hostel (atribuição de afiliado)
- Sinais sociais únicos: 'vibe' do hostel, eventos, chats e perfis de viajantes (no app)
- Idiomas/localização (19 idiomas) e dados de check-in

## 9. Dados que NÃO oferece
- Roteiro de viagem ou sugestão de itinerário (não é função da plataforma)
- Custo total realista de uma viagem (transporte intercidades, alimentação, passeios, câmbio) — só o custo da cama
- Comparação cruzada entre destinos diferentes (cidade A vs cidade B como decisão)
- Voos, trens, aluguel de carro ou pacotes (só ancillaries pontuais de transporte/tours no fluxo)
- Hotéis tradicionais, resorts, apart-hotéis de médio/alto padrão (foco em econômico)
- Super-perfil de preferências do viajante portável/exportável via API
- Dados estruturados de orçamento/budget por categoria de gasto
- Recomendação personalizada por IA generativa exposta a parceiros
- Acesso GDS/NDC ou conteúdo de companhias aéreas

## 10. Pontos fortes
- Líder de categoria absoluto em hostels — maior marca e maior base de inventário/reviews de hostel do mundo, com forte reconhecimento entre mochileiros
- Moat social difícil de copiar: chats, eventos e perfis criam efeito de rede (viajantes vão onde estão outros viajantes), reforçado pela métrica de 37% de compradores de Social Pass novos na base
- App mobile premiado (Best Hostel App 2026) e experiência otimizada para o público jovem
- Inventário de nicho que OTAs generalistas (Booking, Expedia) cobrem mal — muitos hostels independentes só estão bem representados na Hostelworld
- Reputação pública sólida (Trustpilot ~4,5/5 com 21k+ reviews)
- Diversificação de receita recente (Social Pass como assinatura + budget accommodation + ancillaries) reduzindo dependência da comissão pura
- Poder de precificação crescente sobre a oferta (comissão subindo de 15,2% para 17,7% sem queda de conversão)

## 11. Pontos fracos
- Ticket e comissão absoluta baixíssimos (preço médio ~US$20, comissão afiliado sobre o DEPÓSITO) — péssimo para monetização de afiliado por reserva, exige altíssimo volume
- Categoria restrita a hostels/econômico: não serve famílias, casais de conforto, corporativo nem público acima de ~35 anos
- Crescimento de receita anêmico (+2% em FY2025) — mercado maduro e dependente de aumento de comissão e de novas SKUs (Social Pass)
- Modelo agency com depósito gera atrito e confusão (usuário pensa que depósito abate do total; é a comissão da Hostelworld)
- Dependência operacional do hostel para honrar a reserva — overbooking e quarto diferente do reservado geram reclamações
- API fechada 'caso a caso' e foco em criadores de conteúdo, não em parceiros de planejamento/decisão transacional
- Zero capacidade de planejamento de viagem (roteiro, orçamento total, comparação de destinos) — é ponto-de-compra, não ponto-de-decisão
- Exposto a Booking.com avançando no segmento budget/hostel e a apps sociais de viagem solo concorrentes (tendência 2026 nos EUA)

## 12. Reclamações comuns dos usuários
- Atendimento ao cliente lento/inacessível e métodos de contato difíceis (reclamação recorrente no PissedConsumer e ComplaintsBoard)
- Recusa de reembolso em cancelamentos e disputas sobre política de 'free cancellation' anunciada
- Cobranças sem confirmação e glitches no fluxo de reserva (charges without confirmation)
- Confusão sobre o depósito: usuários acham que abate do valor total, mas é a comissão não reembolsável da plataforma
- Hostel não responde após a reserva; discrepância entre o que foi reservado e o que foi entregue
- Overbooking / tipo de quarto indisponível no check-in (mitigado por política de reembolso de depósito + US$50 de crédito, mas gera fricção)
- Cobrança por mais pessoas do que o solicitado em alguns casos
- Críticas técnicas ao app/site (bugs de booking) apesar da nota geral alta no Trustpilot

## 13–19. Limitações
| Eixo | Limitação |
|---|---|
| **UX** | UX otimizada para um único job-to-be-done: achar e reservar uma cama barata rápido, no mobile. É boa nisso, mas é puramente transacional/listagem — não há fluxo de decisão, comparação multi-destino ou montagem de viagem. O atrito do depósito (pagar parcial agora, saldo no hostel) confunde o usuário sobre quanto realmente vai gastar. A camada social é forte no app, mas vive isolada da etapa de plan |
| **Personalização** | Personalização rasa: filtros (preço, nota, tipo de quarto, vibe) e perfis sociais com idade/idiomas/stats, mas sem um super-perfil de preferências do viajante (estilo de viagem, ritmo, orçamento-alvo, interesses) que guie recomendações ou seja portável. Não aprende o histórico para sugerir o próximo destino ou hostel de forma proativa fora do contexto social. |
| **IA** | Sem IA generativa de planejamento visível ao usuário ou exposta a parceiros. A inteligência da plataforma é de matching social (conectar viajantes/eventos) e de demanda qualificada para hostels (Elevate), não de gerar roteiro, estimar custo total ou recomendar destino. Não há assistente de IA conversacional para decisão de viagem. |
| **Roteirização** | Zero roteirização. Não monta itinerário, não sequencia cidades, não calcula deslocamentos entre destinos nem sugere quantos dias por lugar. O usuário precisa decidir o roteiro em outro lugar e só vem à Hostelworld para reservar a cama de cada parada — exatamente a lacuna que um app de planejamento preenche. |
| **Orçamento** | Mostra apenas o custo da hospedagem (e ancillaries pontuais), nunca o custo TOTAL realista da viagem: não soma transporte intercidades, alimentação, passeios, câmbio ou custo de vida do destino. Não existe 'modo orçamento' que projete o gasto da viagem inteira. Para o mochileiro sensível a preço, isso é uma lacuna enorme de decisão. |
| **Comparação** | Comparação só DENTRO de um destino (hostel A vs hostel B na mesma cidade). Não compara destinos diferentes entre si (ex.: Lisboa vs Bangkok vs Medellín por custo, vibe, clima, segurança) — que é a decisão de topo de funil do mochileiro. Não cruza categorias de gasto nem oferece um 'qual destino cabe no meu bolso/perfil'. |
| **Integração** | API de parceiro existe mas é concedida caso a caso e voltada a criadores de conteúdo (deep links, feed, banners), não a um super-app de planejamento que queira embutir disponibilidade/preço de cama e fechar a reserva com atribuição. Não há super-perfil exportável, nem webhooks de eventos sociais, nem GDS/NDC. Integração transacional profunda exige negociação bilateral e a economia é fraca (comissã |

## 20. Oportunidades para superá-lo
- Ser o ponto-de-DECISÃO antes do ponto-de-compra: nosso app planeja o mochilão (roteiro IA + custo total + comparação de destinos) e manda o tráfego já-decidido pra Hostelworld na hora de reservar a cama de cada parada — capturamos o topo do funil que ela não tem
- Mostrar o CUSTO TOTAL realista da viagem (cama + transporte + comida + passeios + câmbio), enquanto a Hostelworld só mostra o preço da cama e ainda confunde com o depósito
- Comparar DESTINOS entre si por custo/vibe/clima/segurança (Lisboa vs Bangkok vs Medellín) — decisão que a Hostelworld não faz, ela só compara hostels dentro da cidade
- Super-perfil do viajante portável e IA de recomendação proativa de próximo destino/hostel, algo que a personalização rasa dela não entrega
- Roteiro multi-destino com sequência de cidades e dias por parada — a Hostelworld não roteiriza nada
- Resolver a dor de transparência: deixar claro quanto o usuário REALMENTE vai pagar (incluindo depósito/comissão) antes de mandar pro checkout dela
- Empacotar a camada social/eventos como um 'porquê ir' dentro do planejamento, em vez de isolada no app de reserva
- Diversificar monetização: como a comissão de cama é baixíssima, ganhamos somando voos/transporte/seguro/tours de maior ticket no mesmo roteiro, usando a Hostelworld só como uma das pontas de hospedagem econômica

---

## Matriz (visão Mundo Sem Fim)
| Critério | Avaliação |
|---|---|
| Força principal | Líder absoluto em hostels com o maior inventário/reviews da categoria e um moat social (chats, eventos, perfis) que cria efeito de rede entre mochileiros — viajantes vão onde estão outros viajantes. |
| Fraqueza principal | É ponto-de-compra puro, sem nenhuma capacidade de planejamento/decisão (roteiro, custo total, comparação de destinos), com ticket e comissão de afiliado baixíssimos (base = depósito de estadia de ~US$20). |
| Modelo de receita | Comissão agency sobre reservas (efetiva ~17,7% no Q1 2026, subindo) + assinatura avulsa Social Pass (€4,99-€59,99) + markup em budget accommodation de terceiros + ancillaries (seguro/tours/transporte). |
| Possui API? | Parcial — Partner API Swagger/OpenAPI concedida caso a caso (disponibilidade, preço, property links, reviews); não é pública aberta nem GDS/NDC. Alternativas mais simples: deep links e data feed. |
| Possui afiliados? | Sim — rede Partnerize (ex-PHG); CPA sobre o depósito, citado ~18-22% do depósito (Travelpayouts anuncia 'até 40% do depósito'), cookie 30 dias, pago mensal, mínimo ~US$30. Comissão absoluta por reserva é pequena por causa do ticket baixo. |
| Pode virar parceiro? | Sim — via Affiliate Programme (Partnerize) imediatamente, e via Partner API/Feed mediante negociação caso a caso com affiliates@hostelworld.com para integração transacional mais profunda de hostels no nosso roteiro. |
| Pode pagar comissão? | Sim, mas pouco em termos absolutos — CPA sobre depósito de estadia barata. Só vale com volume alto; nossa monetização real virá de empacotar transporte/voos/seguro/tours de maior ticket no mesmo roteiro, usando a Hostelworld como uma das pontas de hospedagem. |
| Pode receber tráfego? | Sim — somos topo de funil (decisão de destino + roteiro + orçamento) e mandamos tráfego JÁ-DECIDIDO pra ela fechar a cama, exatamente o público mochileiro que ela quer e que decide em outro lugar. |
| Pode ser integrado? | Parcial — via affiliate deep links/feed desde já (fácil), ou via Partner API (disponibilidade/preço) por acordo bilateral. Sem super-perfil exportável nem webhooks sociais; integração transacional profunda depende de negociação. |
| **O que precisamos ter p/ superar** | Para ganhar dela no que ela faz bem (hospedagem econômica + social), precisamos: (1) agregar inventário de hostels de MÚLTIPLAS fontes (Hostelworld + Hostelsclub + Booking budget) e comparar dentro e ENTRE destinos; (2) mostrar custo total realista da estadia + viagem, resolvendo a confusão do depósito; (3) trazer a dimensão social/eventos como 'porquê ir' dentro do planejamento, não isolada; (4)  |

## Fontes consultadas
- https://www.investing.com/news/transcripts/earnings-call-transcript-hostelworld-sees-growth-in-h2-2025-q1-2026-93CH-4581868
- https://businesscloud.co.uk/live-blog/revenues-up-to-e93-8m-at-listed-hostelworld/
- https://www.webintravel.com/hostelworld-charts-new-course-as-worlds-first-social-travel-platform/
- https://partners.hostelworld.com/solutions/
- https://partners.hostelworld.com/faqs/
- https://partner-api.hostelworld.com/
- https://hpa-partner-api.hostelworld.com/
- https://signup.partnerize.com/signup/en/hostelworld
- https://www.travelpayouts.com/en/offers/hostelworld-affiliate-program
- https://referralrocket.io/affiliate-program/hostelworld_xH
- https://getlasso.co/affiliate/hostelworld/
- https://www.hostelworld.com/socialpass
- https://www.hostelworld.com/blog/hostelworld-social-pass-the-social-app-no-booking-required/
- https://www.prnewswire.com/news-releases/best-hostel-app-2026-hostelworld-named-top-mobile-app-for-booking-hostels-by-consumer365-302767896.html
- https://www.trustpilot.com/review/www.hostelworld.com
- https://hostelworld.pissedconsumer.com/review.html
- https://www.complaintsboard.com/hostelworld-b121731
- https://www.hostelworld.com/blog/is-hostelworld-legit/
