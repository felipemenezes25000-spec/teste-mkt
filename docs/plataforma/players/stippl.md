# Stippl

> **Categoria:** Planejador de viagem social / all-in-one (planejamento + organizacao de reservas + tracking social + AI itinerary), com camada de afiliados e produto B2B (agencias e hoteis)
> _Perfil gerado por pesquisa multiagente (jun/2026). Parte do [Relatório de Mercado](../01-relatorio-de-mercado.md) e da [Matriz Competitiva](../02-matriz-competitiva.md)._

## 1. O que faz
Stippl e um app mobile (iOS/Android) de Amsterda que se posiciona como "um app de viagem pra substituir todos": planeja roteiro dia-a-dia (inclusive via IA), organiza confirmacoes de voo/hotel/atividade num so lugar com acesso offline, monta rota no mapa e lista de bagagem, e tem forte componente social/tracking (linha do tempo de fotos, mapa de paises visitados, reels/videos 3D cinematicos da viagem compartilhaveis por link sem o seguidor instalar o app). Monetiza por comissao de afiliado quando o usuario reserva via Booking.com e GetYourGuide, revende eSIM em 190+ paises, vende assinatura PRO e tem braco B2B (itinerary software pra agentes e concierge digital pra hoteis).

## 2. Público-alvo
Viajantes independentes e mochileiros millennial/Gen-Z que fazem trips longas e multi-destino, casais e grupos de amigos que planejam juntos, e "travel creators" que querem monetizar audiencia via afiliado. No B2B: agentes de viagem autonomos / pequenas agencias e hoteis boutique que querem um concierge digital.

## 3. Funcionalidades principais
- Roteiro dia-a-dia com route builder e day planner no mapa
- AI Travel Planner: gera itinerario completo (atividades, restaurantes, transporte, hospedagem) em ~2 min a partir de destino/datas/estilo
- Organizador de reservas (voo/hotel/trem/atividade) num inbox unico, acessivel offline
- Modo offline completo (rota, roteiro, reservas e mapas sem internet)
- Travel tracker / live trip: timeline de fotos por destino e link publico de acompanhamento ao vivo
- Reels e videos 3D cinematicos automaticos da rota + fotos (feature mais elogiada)
- Scratch map / world tracker com estatisticas de paises visitados
- Smart packing lists por destino e duracao
- Planejamento colaborativo em grupo
- Split de despesas / budget tracking
- Marketplace de eSIM em 190+ paises dentro do app
- Programa de pontos/rewards (reserva ou indica amigo -> pontos -> PRO ou eSIM)
- Stippl for Creators: itinerarios brandados com links de afiliado
- Stippl for Business: propostas/quotes brandados, pipeline de clientes, export PDF (agentes)
- Stippl for Hotels: concierge digital via QR code no check-in

## 4. Como monetiza
- Comissao de afiliado em reservas de hospedagem via Booking.com (afiliado recebe ~25-40% da comissao da Booking, que e ~15% do hotel; ou esquema flat ~4% por estadia concluida, cookie 30 dias)
- Comissao de afiliado em tours/atividades via GetYourGuide (~7-8% tipico, via redes Awin/Travelpayouts/CJ)
- Revenda de eSIM/planos de dados locais em 190+ paises (margem sobre o data plan)
- Assinatura Stippl PRO (a partir de ~US$9,99/mes) destravando colaboracao e offline avancado
- B2B SaaS: Stippl for Business (itinerary software pra agentes, trial 7 dias) e Stippl for Hotels (concierge com comissao sobre bookings de tours/restaurantes/spa)
- Programa de pontos como retencao (nao receita direta) e, no roadmap, photo books pagos

## 5. Afiliados
Stippl atua como AFILIADO (publisher), nao como rede. Repassa parte via "Stippl for Creators" mas nao publica % nem rede propria. As comissoes que ele captura vem das redes dos parceiros: GetYourGuide e distribuido por Awin (base ~7%), Travelpayouts (~8%) e CJ Affiliate; Booking.com via CJ/Awin (afiliado recebe ~25-40% da comissao da Booking ou esquema flat ~4%). Nao foi confirmado um programa de afiliados PROPRIO aberto a terceiros com comissao publicada — o "for Creators" parece ser sub-afiliacao/white-label do trafego que Stippl ja monetiza.

## 6. API
Sem API publica de desenvolvedor documentada. Nao tem GDS/NDC proprio nem API de parceiro aberta. A "integracao" e via afiliado/deeplink para Booking.com e GetYourGuide (consumindo as APIs/links DELES, nao expondo uma API do Stippl). Integracao com Stippl hoje so seria possivel por afiliado, deeplink ou parceria comercial B2B caso-a-caso. Incerto se ha API privada interna.

## 7. Programa de parceiros
Tres trilhas: (1) Stippl for Creators — creators publicam roteiros brandados e ganham comissao de afiliado sobre bookings da audiencia (termos/percentual nao divulgados); (2) Stippl for Business — SaaS pra agentes de viagem (propostas brandadas, pipeline, export, trial de 7 dias sem cartao, seats ilimitados); (3) Stippl for Hotels — concierge digital por QR code no check-in, hotel ganha comissao/referral sobre tours, restaurantes e spa reservados pelos hospedes. Nenhuma dessas e um programa tecnico de integracao (sem developer portal).

## 8. Dados que oferece
- Roteiro estruturado dia-a-dia (atividades, refeicoes, transporte, hospedagem sugerida)
- Rota geografica entre destinos no mapa
- Sugestoes de POIs/atividades (alimentadas por catalogo proprio + GetYourGuide)
- Estimativa basica de orcamento / split de despesas
- Conteudo social: fotos, timeline da viagem, reels 3D, link publico de live trip
- Lista de bagagem por destino/duracao
- Disponibilidade e precos de hospedagem (via Booking.com) e atividades (via GetYourGuide) dentro do fluxo
- Planos de eSIM por pais

## 9. Dados que NÃO oferece
- API publica / feed estruturado consumivel por terceiros
- Custo total realista e granular da viagem (cambio, taxas, gorjetas, transporte local detalhado) — orcamento e raso
- Comparacao lado-a-lado de DESTINOS (custo, clima, seguranca, melhor epoca)
- Voos com busca/tarifa real propria (so guarda a confirmacao; nao e metabusca)
- Dados de seguranca, visto, vacinas, clima sazonal por destino de forma decisoria
- Datas de transito multi-dia entre destinos (limitacao confirmada por usuarios)
- Super-perfil persistente do viajante reutilizavel entre viagens
- Cobertura completa de POIs (usuarios relatam destinos/lugares ausentes na base)

## 10. Pontos fortes
- All-in-one real: planejamento + reservas + offline + social num so app, reduz fragmentacao
- Camada social/visual diferenciada (reels 3D cinematicos, live trip por link) com forte apelo Gen-Z e efeito viral/aquisicao organica
- Modo offline robusto — funciona sem wifi em qualquer lugar
- AI itinerary rapido (~2 min) como gancho de topo de funil
- Monetizacao diversificada (afiliado + eSIM + PRO + B2B) reduz dependencia de uma fonte
- Base de 250k+ usuarios em 160+ paises e 1.5M+ trips — traction e prova social
- Expansao B2B (agentes + hoteis) abre canal de receita recorrente alem do consumidor
- Foco em viagem longa/multi-destino, nicho menos servido que weekend trips

## 11. Pontos fracos
- Instabilidade tecnica cronica: crashes frequentes, tela branca e travamentos de 2+ min em acoes simples
- Sem sincronizacao confiavel entre dispositivos (iPhone <-> iPad nao sincroniza)
- Orcamento/custo total e raso — nao entrega numero realista de quanto a viagem vai custar
- IA generica e dependente de catalogo com lacunas (lugares ausentes, sugestoes pouco especificas)
- Sem API publica — dificil integrar/parcerizar tecnicamente
- Comissao de afiliado e fonte fraca e volatil (Booking paga % de %, GYG ~7-8%, cookies curtos)
- Capital limitado (~US$1.48M total) vs. concorrentes (Wanderlog, TripIt/Concur, Booking) — pouca margem pra escalar infra
- Modelo espalhado (consumidor + creators + agentes + hoteis + eSIM) arrisca falta de foco e execucao
- Limitacao de datas de transito multi-dia quebra justamente o caso de uso multi-destino que ele promete

## 12. Reclamações comuns dos usuários
- App trava/da tela branca e congela por 2+ minutos ao fazer acoes simples (ex.: escolher restaurante)
- Crashes frequentes durante o planejamento, frustrante pra trip importante
- Nao sincroniza entre celular e iPad — precisa replicar manualmente as mudancas
- Impossivel ajustar datas de transito entre destinos (ex.: 2 dias de cruzeiro/transporte entre cidades)
- Lugares/destinos faltando na base de busca
- Sugestoes da IA as vezes genericas ou com erros de calculo de datas
- Percepcao de que features uteis (offline/colaboracao) ficam atras do paywall PRO
- Sync issues e perda/inconsistencia de dados entre sessoes

## 13–19. Limitações
| Eixo | Limitação |
|---|---|
| **UX** | UX visualmente moderna e social, mas minada por bugs: travamentos de 2+ min, tela branca, crashes e dessincronizacao entre dispositivos tornam o uso frustrante no momento critico (durante a viagem ou planejamento final). A forca esta na camada de compartilhamento (reels, live link), nao na confiabilidade do fluxo de planejamento. |
| **Personalização** | Personalizacao limitada a inputs por viagem (destino, datas, estilo: relax/cultural/aventura). Nao mantem um super-perfil persistente do viajante (preferencias, restricoes, historico, ritmo, budget habitual) que se reutilize e melhore entre viagens. Cada trip recomeca quase do zero; recomendacao nao aprende com o comportamento real. |
| **IA** | IA e gancho de topo de funil ("itinerario em 2 min") mas entrega plano generico, dependente de catalogo proprio com lacunas (lugares ausentes) e com erros relatados (ex.: calculo de datas). Nao explica trade-offs, nao otimiza por custo real nem por logica de roteirizacao geografica forte; tende a sugestoes obvias em vez de decisao informada e especifica. |
| **Roteirização** | Tem route builder no mapa, mas a roteirizacao falha no caso multi-destino que ele mesmo promete: usuarios nao conseguem definir datas de transito multi-dia entre destinos (ex.: cruzeiro/trem de 2 dias), quebrando a continuidade temporal. Nao otimiza ordem de visita por distancia/tempo/custo de forma robusta nem trata transporte intercidades como leg planejavel com tarifa. |
| **Orçamento** | Orcamento e o ponto mais fraco: oferece split de despesas e tracking basico, mas nao calcula o CUSTO TOTAL REALISTA da viagem (hospedagem + voos + transporte local + alimentacao + atividades + taxas + cambio + buffer). Nao ha estimativa decisoria por destino que ajude o viajante a escolher PARA ONDE ir com base em quanto custa. |
| **Comparação** | Nao compara DESTINOS entre si (custo total, clima sazonal, seguranca, visto, melhor epoca, vibe). E um planejador de uma viagem ja decidida, nao uma ferramenta de DECISAO de para onde ir. Tambem nao compara opcoes de voo/hotel de forma neutra (so empurra Booking/GYG via afiliado), entao falta comparacao imparcial. |
| **Integração** | Sem API publica/developer portal: nao da pra integrar tecnicamente de forma limpa. Os pontos de conexao sao via afiliado/deeplink (consumindo Booking/GetYourGuide) ou parceria B2B comercial caso-a-caso. Para um terceiro, integrar com Stippl hoje significa essencialmente link de afiliado ou negociacao manual — nao ha contrato de dados estruturado. |

## 20. Oportunidades para superá-lo
- Estabilidade como diferencial barato: Stippl trava 2+ min e crasha; ganhamos so sendo rapidos e confiaveis
- Entregar custo total realista da viagem que Stippl nao calcula
- Comparacao de destinos (custo/clima/seguranca/epoca) inexistente nele
- Super-perfil persistente vs. personalizacao por-trip descartavel dele
- Roteirizacao multi-destino com legs de transito multi-dia — falha confirmada dele
- Sincronizacao multi-device confiavel (ele nao sincroniza iPhone/iPad)
- IA decisoria e especifica vs. itinerario generico de 2 min
- Comparacao imparcial de voos/hoteis vs. empurrar so Booking/GYG por afiliado
- Cobertura de POIs sem lacunas (usuarios relatam lugares ausentes)

---

## Matriz (visão Mundo Sem Fim)
| Critério | Avaliação |
|---|---|
| Força principal | Camada social/visual viral (reels 3D cinematicos + live trip por link) somada a all-in-one com offline robusto — gera aquisicao organica Gen-Z e retencao emocional. |
| Fraqueza principal | Instabilidade tecnica cronica (crashes, tela branca, freeze de 2+ min, sem sync entre devices) e orcamento/decisao de destino quase inexistentes — falha justamente no nucleo de planejamento/decisao. |
| Modelo de receita | Diversificado mas raso: afiliado (Booking.com + GetYourGuide), revenda de eSIM, assinatura PRO ~US$9,99/mes, B2B SaaS (agentes + concierge de hoteis), rewards e photo books no roadmap. |
| Possui API? | Nao — sem API publica/developer portal; integracao so via afiliado/deeplink (consumindo Booking/GYG) ou parceria B2B manual. |
| Possui afiliados? | Sim, como publisher: monetiza GetYourGuide (Awin/Travelpayouts/CJ, ~7-8%) e Booking.com (CJ/Awin, ~25-40% da comissao da Booking ou flat ~4%); repassa via 'for Creators' sem % publicado e sem rede propria aberta. |
| Pode virar parceiro? | Sim, mas so comercialmente (caso-a-caso): co-marketing, hand-off de trafego ou parceria B2B; nao ha via tecnica/programatica pronta. Parceria de conteudo via 'for Creators' e plausivel. |
| Pode pagar comissão? | Improvavel pagar comissao A NOS de forma estruturada (nao e rede; ele e o afiliado que captura a comissao). No maximo revenue-share negociado em piloto B2B. |
| Pode receber tráfego? | Sim — faz sentido MANDAR pra ele leads que querem a camada social/reels/live-trip e organizacao offline, segmentos onde ele e forte e nos nao precisamos competir. |
| Pode ser integrado? | Parcial — via deeplink/afiliado e parceria B2B; sem API publica, integracao tecnica profunda nao e possivel hoje. |
| **O que precisamos ter p/ superar** | Para superar o que Stippl faz bem: (1) estabilidade e velocidade reais (zero freeze/crash, sync multi-device instantaneo); (2) camada de compartilhamento atraente (roteiro/mapa/custo compartilhavel por link, opcionalmente reels) pra nao perder o apelo social; (3) offline confiavel; (4) e, no que ele falha, nosso fosso: custo total realista por viagem, comparacao de destinos, super-perfil persisten |

## Fontes consultadas
- https://www.stippl.io/
- https://www.stippl.io/creators
- https://business.stippl.io/
- https://www.stippl.io/for-hotels
- https://www.stippl.io/ai-travel-planner
- https://www.stippl.io/esim
- https://apps.apple.com/us/app/stippl-travel-planner/id6443617088
- https://play.google.com/store/apps/details?id=com.stippl.stippl
- https://justuseapp.com/en/app/6443617088/stippl-the-travel-planner/reviews
- https://www.wandrly.app/reviews/stippl
- https://www.eu-startups.com/2024/04/amsterdam-based-travel-app-stippl-raises-e575k-to-develop-the-ai-planning-journey/
- https://techfundingnews.com/booking-com-rival-in-amsterdam-stippl-lands-e575k-to-curate-genai-driven-travel-planning-and-experiences/
- https://www.phocuswire.com/stippl-funding-ai-travel-planning-expansion
- https://app.dealroom.co/companies/stippl
- https://www.crunchbase.com/organization/stippl
- https://partner.getyourguide.com/
- https://www.affpaying.com/getyourguideaffiliateprogram
- https://affiliates.support.booking.com/kb/s/article/Commission-and-Payments
- https://reacheffect.com/blog/how-much-does-booking-com-pay-affiliates/
- https://www.cj.com/en-gb/publisher/partners/booking.com
