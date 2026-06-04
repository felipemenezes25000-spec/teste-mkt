# Wanderlog

> **Categoria:** Planejador de roteiro (trip planner / itinerary builder colaborativo) com camada de metasearch de hospedagem e passeios
> _Perfil gerado por pesquisa multiagente (jun/2026). Parte do [Relatório de Mercado](../01-relatorio-de-mercado.md) e da [Matriz Competitiva](../02-matriz-competitiva.md)._

## 1. O que faz
Wanderlog e um planejador de viagem freemium (web + iOS + Android) que organiza a viagem em itinerario dia-a-dia com mapa colorido por dia/categoria, salvando lugares pesquisados (com foto, endereco, horario, reviews agregados de Google/TripAdvisor) e permitindo colaboracao em tempo real com companheiros de viagem sem exigir conta paga deles. Importa reservas (voo, hotel, carro) por encaminhamento de e-mail/scan do Gmail e oferece uma camada de metabusca de hoteis e passeios que compara precos de Booking.com, Expedia, Hotels.com, Airbnb e Viator, redirecionando o usuario ao parceiro para fechar a compra (Wanderlog ganha comissao de afiliado). Nao reserva voos diretamente; o foco e organizar/decidir, nao ser merchant.

## 2. Público-alvo
Viajantes de lazer DIY (faca-voce-mesmo), casais e grupos de amigos/familia que montam roteiros multi-parada (city-trips, eurotrips, lua de mel) e valorizam o mapa visual para nao cruzar a cidade varias vezes. Forte entre planejadores meticulosos, organizadores de viagens em grupo e quem migra de planilhas/Google Maps/Google Docs. Base global de lingua inglesa; menos penetracao no publico pt-BR.

## 3. Funcionalidades principais
- Itinerario dia-a-dia editavel com lugares salvos (foto, endereco, telefone, horario de funcionamento, site, reviews)
- Mapa interativo color-coded por dia e por categoria (o diferencial mais elogiado)
- Colaboracao em tempo real multi-usuario em trip compartilhada (companheiros editam sem conta paga)
- Aba Explore com recomendacoes agregadas de Google e TripAdvisor
- Import de reservas por encaminhar e-mail ou scan automatico do Gmail (Pro)
- Metabusca de hoteis/Airbnb com alertas de queda de preco comparando Booking/Expedia/Hotels.com/Airbnb
- Passeios e atividades via Viator
- Route optimization / otimizacao de rota do dia (Pro)
- Assistente de IA conversacional que sugere lugares enquanto voce monta (Pro)
- Offline access, dark mode, export PDF e export para Google Maps (Pro)
- Checklists, notas, orcamento simples (split de gastos basico) e armazenamento de anexos

## 4. Como monetiza
- Assinatura Wanderlog Pro (~US$ 39,99/ano em 2026; algumas fontes de 2025 citavam US$ 49,99/ano), responsavel por ~55% da receita
- Comissao de afiliado/CPA sobre reservas de hotel/Airbnb e passeios via redirect para OTAs parceiras (Booking.com, Expedia Group/Hotels.com, Airbnb, Viator) — ~45% da receita nao-assinatura; cresceu ~35% YoY em 2024
- Modelo de afiliado puro (referral/redirect), NAO merchant-of-record: Wanderlog nao processa o pagamento da reserva, so encaminha o lead e recebe % do parceiro
- Creator Shops emergente: influenciadores vendem guias curados (take da plataforma)
- Wanderlog for Business nascente: motor de itinerario white-label para agencias/hoteis boutique (receita de contrato recorrente)
- Sem modelo de CPC/ads display relevante; receita e assinatura + afiliacao

## 5. Afiliados
Wanderlog ATUA COMO AFILIADO (ganha comissao das OTAs), mas NAO opera um programa de afiliados publico para creators/parceiros externos — nao ha rede propria, Awin, CJ, Impact, Partnerize nem Travelpayouts aberta a terceiros. As comissoes recebidas seguem as faixas tipicas do setor: hoteis Booking/Expedia ~2-6% sobre o valor da reserva; passeios Viator/GetYourGuide ~8% repassado ao afiliado (Viator/GYG ficam com ~12-20% do tour). Atencao: o 'Wander Affiliate Program' (rede Impact) que aparece em buscas e de OUTRA empresa (wander.com, aluguel de casas de luxo), nao do Wanderlog.

## 6. API
Sem API publica, de parceiro, GDS ou NDC. Wanderlog nao expoe endpoints oficiais para terceiros integrarem dados de itinerario, lugares ou reservas. O repositorio 'natalynyu/wanderlog-api' no GitHub e um projeto estudantil homonimo, sem relacao com a empresa. Integracoes existentes sao consumidas internamente (Google Maps/Places, agregadores de OTA, scan de Gmail). Para um parceiro, a unica via pratica de interoperacao hoje e deep link / redirect, nao API.

## 7. Programa de parceiros
Nao ha programa de parceiros/desenvolvedores estruturado e publico. Existe um esforco inicial B2B ('Wanderlog for Business') para white-label do motor de itinerario a agencias e hoteis, mas e nascente e nao documentado/self-serve. Nao publica termos de parceria, SDK ou onboarding de integradores. Parcerias estrategicas hoje sao com as OTAs (lado da demanda de afiliacao), nao com apps complementares.

## 8. Dados que oferece
- Itinerario estruturado dia-a-dia com lugares geolocalizados
- Metadados ricos de POIs (foto, endereco, horario, telefone, site, rating agregado Google/TripAdvisor)
- Mapa color-coded por dia/categoria
- Recomendacoes de atracoes/restaurantes via Explore
- Comparativo de precos de hospedagem multi-OTA com alerta de queda de preco
- Inventario de passeios/atividades (Viator)
- Parse de confirmacoes de reserva (voo/hotel/carro) a partir de e-mail
- Split simples de despesas e checklist por viagem
- Export PDF e export para Google Maps (Pro)

## 9. Dados que NÃO oferece
- Custo total realista da viagem (orcamento agregado com cambio, impostos, gorjetas, transporte local) — so tem split manual de gastos
- Conversao automatica de moeda
- Roteiro completo auto-gerado a partir de inputs (a IA so sugere lugares, nao monta o dia inteiro sozinha)
- Comparacao lado-a-lado de MULTIPLOS destinos (decidir 'Peru vs Tailandia')
- Previsao/integracao de clima por dia (weather-aware scheduling)
- Alertas em tempo real de voo (atraso, mudanca de portao)
- Super-perfil persistente do viajante reaproveitado entre viagens
- Reserva direta de voos (so redirect; nao e merchant)
- API/feed de dados para terceiros
- Acesso sem conta (exige login)

## 10. Pontos fortes
- Mapa visual color-coded por dia/categoria — o recurso mais elogiado, evita 'cruzar a cidade 4x/dia'
- Colaboracao em tempo real solida: companheiros editam sem precisar pagar
- Tier gratuito generoso (trips e colaboradores ilimitados; cobre o fluxo basico de planejamento)
- Agregacao automatica de metadados de POI ao buscar um lugar (foto, horario, reviews)
- Marca forte e SEO dominante em 'trip planner' (milhoes de paginas de guia indexadas geram aquisicao organica barata)
- Multiplataforma madura (web/iOS/Android) com import por e-mail e scan de Gmail
- Time enxuto e eficiente em capital (~15 pessoas, YC W19, ~US$1,65M levantado, ja >US$1M de receita)

## 11. Pontos fracos
- IA fraca e apenas conversacional: sugere lugares mas NAO gera roteiro completo; reviews citam 'nao reconhece nem para onde voce vai'
- Sem orcamento/custo-total real nem conversao de moeda — gap critico para decisao
- Paywall agressivo em features que parecem basicas (offline maps, dark mode, otimizacao de rota) gera atrito ('paguei US$50 so pelo mapa')
- Templates rigidos, pouca flexibilidade para roteiros complexos/nao-convencionais
- Auto-import de reservas menos confiavel que TripIt — exige 10-15 min de entrada manual
- Sem comparacao de destinos nem perfil persistente do viajante
- Bugs de estabilidade e perda de dados relatados (trips somem, reservas de hotel desaparecem)
- Sem API/programa de afiliados/parceiros — ecossistema fechado

## 12. Reclamações comuns dos usuários
- 'Billing is unavailable' ao tentar usar o otimizador de rota (erro de cobranca trava feature Pro)
- App trava e ao reabrir os planos da trip nao aparecem; crashes recorrentes ('Wanderlog keeps stopping')
- Reservas de hotel sumiram da conta (perda de dados/sincronizacao)
- Erros persistentes ao buscar atracoes/restaurantes ('unexpected error, try later') e 'unable to connect, restart the app' para usuarios pagos
- Paywall percebido como abusivo: cobrar por offline/dark mode/rota incomoda em viagem 'once in a lifetime'
- Curva de aprendizado alta vs apps simples
- IA 'terrivel' segundo parte dos reviews; util so como rascunho
- Atrito de assinatura/reembolso e renovacao automatica (queixas de billing)
- Falta de tipos de segmento dedicados para onibus/trem no timeline

## 13–19. Limitações
| Eixo | Limitação |
|---|---|
| **UX** | UX visualmente agradavel e centrada no mapa, mas com curva de aprendizado real: muitos campos, templates rigidos e necessidade de tentativa-e-erro para achar o fluxo ideal. Sensacao de 'excessivo' para viagens simples. Estabilidade fragil (crashes, telas de erro de busca, trips que somem) corroi a confianca justamente no momento da viagem. Paywall intrusivo interrompe tarefas que o usuario conside |
| **Personalização** | Personalizacao limitada a organizar lugares dentro de templates pre-definidos; pouca adaptacao a estilos de viagem (mochilao vs luxo vs trabalho) ou a restricoes pessoais (mobilidade, ritmo, orcamento por dia). Nao ha super-perfil do viajante que aprenda preferencias e reaproveite entre viagens — cada trip comeca quase do zero. |
| **IA** | IA e o calcanhar de Aquiles: assistente apenas conversacional, restrito ao Pro, que SUGERE lugares enquanto o usuario monta manualmente — nao gera um roteiro dia-a-dia completo a partir de inputs (datas, orcamento, interesses). Reviews relatam baixa qualidade contextual ('nao reconhece inteligentemente para onde voce vai'). Sem raciocinio sobre custo, logistica ou trade-offs; serve como rascunho,  |
| **Roteirização** | Tem 'route optimization' (reordena atividades do dia pela rota mais eficiente), mas e Pro, opcional e frequentemente quebrado por erro de billing. Otimiza dentro de um dia ja montado pelo usuario; nao constroi o roteiro inteiro, nao equilibra dias, nao considera horarios de funcionamento/clima/tempo de deslocamento real entre cidades de forma automatica e holistica. |
| **Orçamento** | Gap critico: nao calcula custo total realista da viagem. Oferece apenas split manual de despesas e checklist; sem orcamento agregado por categoria, sem conversao automatica de moeda, sem estimativa de custo de hospedagem+voo+passeios+transporte local+alimentacao. Wanderlog Pro explicitamente 'pula' planejamento budget-aware e cambio automatico. O usuario nao consegue responder 'quanto vai custar'  |
| **Comparação** | Nao existe comparacao de destinos. O produto assume que o usuario JA escolheu para onde vai e foca em organizar aquela cidade. Nao ha ferramenta para decidir entre destinos (ex.: Peru vs Tailandia vs Portugal) por custo, clima, seguranca, melhor epoca, tempo de voo ou adequacao ao perfil. A unica 'comparacao' e de precos de hotel dentro de um destino ja definido. |
| **Integração** | Ecossistema fechado: sem API publica/parceiro, sem GDS/NDC, sem programa de afiliados ou de parceiros self-serve. Integra Google Maps/Places, scan de Gmail e agregadores de OTA apenas para consumo proprio. Para terceiros, a unica interoperacao viavel e deep link/redirect. Sem alertas de voo em tempo real e auto-import de reservas inferior ao TripIt. Isso o torna dificil de 'plugar' como motor ou c |

## 20. Oportunidades para superá-lo
- Entregar roteiro IA REALMENTE auto-gerado (dia-a-dia completo a partir de datas+orcamento+interesses), nao so sugestoes — onde a IA conversacional deles falha
- Mostrar CUSTO TOTAL realista com cambio automatico e quebra por categoria — feature que o Pro deles explicitamente nao tem
- Comparacao lado-a-lado de multiplos destinos (custo, clima, melhor epoca, seguranca, voo) — categoria inteira que Wanderlog ignora
- Super-perfil persistente do viajante que aprende e reaproveita entre viagens (eles recomecam do zero)
- Tirar funcoes basicas do paywall (offline, dark mode, otimizacao de rota) para neutralizar a queixa nº1 de 'paywall abusivo'
- Estabilidade e nunca perder dados (trips/reservas somindo e a dor recorrente deles)
- Acesso sem conta para o primeiro valor (eles exigem login)
- Scheduling consciente de clima e horarios de funcionamento, que eles nao fazem

---

## Matriz (visão Mundo Sem Fim)
| Critério | Avaliação |
|---|---|
| Força principal | Mapa visual color-coded por dia + colaboracao em tempo real gratuita, sustentados por SEO dominante (milhoes de paginas de guia) que gera aquisicao organica baratissima. |
| Fraqueza principal | Camada de DECISAO inexistente: IA so sugere (nao gera roteiro), sem custo-total/cambio, sem comparacao de destinos, sem perfil persistente — e paywall agressivo em features basicas com bugs de perda de dados. |
| Modelo de receita | Freemium: ~55% assinatura Pro (~US$39,99/ano) + ~45% comissao de afiliado/CPA de OTAs (Booking/Expedia/Hotels.com/Airbnb/Viator) via redirect; Creator Shops e B2B white-label nascentes. |
| Possui API? | Nao — sem API publica, de parceiro, GDS ou NDC; unica interoperacao real e deep link/redirect. |
| Possui afiliados? | Nao opera programa de afiliados publico (atua como afiliado das OTAs, ganhando ~2-6% hotel e ~8% passeios). O 'Wander/Impact' das buscas e outra empresa. |
| Pode virar parceiro? | Sim, mas so via deep link/co-marketing ou B2B white-label nascente — nao ha API nem onboarding self-serve. Parceria seria negociada 1:1, baixa escalabilidade tecnica. |
| Pode pagar comissão? | Nao para nos diretamente (nao tem programa de afiliados). Inversamente: NOS poderiamos virar afiliado das mesmas OTAs que ele usa e capturar a comissao no momento da decisao, antes de o usuario chegar ao Wanderlog. |
| Pode receber tráfego? | Sim — poderiamos mandar leads qualificados pra ele apos a fase de DECISAO (ex.: usuario decidiu o destino e quer um organizador visual de POIs), mas estrategicamente fraco: ele monetizaria a reserva que deveria ser nossa. Melhor reter. |
| Pode ser integrado? | Parcial — apenas via deep link/redirect (abrir uma trip ou busca de hotel); sem API para puxar/empurrar itinerario programaticamente. |
| **O que precisamos ter p/ superar** | Para superar onde ele e bom: (1) mapa visual color-coded por dia com roteamento, no minimo tao polido quanto o dele; (2) colaboracao em tempo real gratuita; (3) agregacao automatica de metadados de POI (foto/horario/reviews) ao salvar um lugar; (4) import de reservas confiavel (melhor que o auto-import deles); (5) maquina de conteudo/SEO de guias para aquisicao organica. E entao GANHAR no que ele  |

## Fontes consultadas
- https://businessmodelcanvastemplate.com/blogs/how-it-works/wanderlog-how-it-works
- https://canvasbusinessmodel.com/blogs/how-it-works/wanderlog-how-it-works
- https://monkeyeatingmango.com/blog/wanderlog-pricing-2026/
- https://www.wandrly.app/reviews/wanderlog
- https://www.aitooldiscovery.com/guides/wanderlog-reddit
- https://justuseapp.com/en/app/1476732439/wanderlog-travel-planner/problems
- https://wanderlog.com/hotels
- https://wanderlog.com/pro
- https://help.wanderlog.com/hc/en-us/articles/13355633360155-Find-hotels-to-book
- https://www.ycombinator.com/companies/wanderlog
- https://www.phocuswire.com/Wanderlog-1-5M-seed-funding
- https://tracxn.com/d/companies/wanderlog/__lelvNWkEOVXLC2fYXKoX0fazml8sWLb7U2Epc5HPuJA
- https://ca.trustpilot.com/review/wanderlog.com
- https://community.ricksteves.com/travel-forum/general-europe/trial-of-wanderlog-and-tripit-inspired-by-trip-research-post
- https://www.travelpayouts.com/blog/best-travel-affiliate-programs-and-networks/
- https://skift.com/2021/09/10/expedia-partners-with-getyourguide-on-tours-and-activities-in-a-blow-to-viator/
