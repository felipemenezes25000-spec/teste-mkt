# Tripadvisor

> **Categoria:** Reviews + Meta-busca + Marketplace de Experiencias (UGC/avaliacoes + agregador de precos de hotel + OTA de tours via Viator + reservas de restaurante via TheFork)
> _Perfil gerado por pesquisa multiagente (jun/2026). Parte do [Relatório de Mercado](../01-relatorio-de-mercado.md) e da [Matriz Competitiva](../02-matriz-competitiva.md)._

## 1. O que faz
Maior plataforma de avaliacoes de viagem do mundo (mais de 1 bilhao de reviews/opinioes, ~150M membros). Funciona como tres negocios sob um guarda-chuva: (1) o site/app "Core" Tripadvisor, que agrega reviews de hoteis/restaurantes/atracoes e funciona como meta-busca de hoteis (manda o clique para OTAs e hoteis e cobra por isso) + venda de midia/ads; (2) Viator, a OTA/marketplace de tours, atividades e atracoes (merchant of record, fica com a comissao do operador); (3) TheFork, lider europeu de reserva de restaurantes (cobra por talher/cover + assinatura do software). Em 2025 fez US$1,891 bi de receita, mas o Core esta em declinio estrutural por causa de AI Overviews/ChatGPT que respondem a pesquisa de viagem direto na busca.

## 2. Público-alvo
Dois lados. Demanda (B2C): viajantes em fase de pesquisa/decisao que querem ler reviews, comparar hoteis, reservar tours/atracoes (Viator) e mesas (TheFork) — perfil global, forte em EUA e Europa. Oferta (B2B): hoteis, restaurantes, operadores de tours/atracoes e DMOs que pagam por exposicao, leads (CPC) e listagens; alem de publishers/criadores e desenvolvedores que monetizam via afiliado/API.

## 3. Funcionalidades principais
- Avaliacoes e notas (rating de bolhas 1-5) de hoteis, restaurantes e atracoes com fotos e UGC
- Meta-busca de hoteis: compara precos de varias OTAs/hoteis e faz click-out
- Viator: busca, reserva e pagamento de >300 mil tours, atividades e atracoes (skip-the-line, day tours, ingressos)
- TheFork: reserva de mesa em tempo real em restaurantes da Europa/Australia, com promocoes e programa de fidelidade
- Rankings 'Travelers' Choice' e 'Best of the Best' (selo de reputacao para negocios)
- Forum/comunidade de viajantes e perguntas e respostas
- Ferramentas de gestao para negocios (Management Center, respostas a reviews, Business Advantage pago)
- Listas, salvamentos e funcoes de planejamento basico (roteiro leve, 'Trips')
- Apps mobile (Tripadvisor e Viator) e, desde 2025-2026, recursos AI-nativos e um app Viator dentro do ecossistema ChatGPT (agentic AI, prova de conceito)

## 4. Como monetiza
- Comissao de experiencias (Viator): fica com a comissao do operador de tour/atracao como merchant of record — maior motor de crescimento; segmento Experiences cresceu ~12% em 2025
- CPC / referral de hoteis (meta-busca): cobra por clique/click-out quando manda o viajante para uma OTA ou hotel (modelo TripConnect CPC e leiloes de hotel); segmento 'Hotels & Other' em forte declinio (-20% no Q1 2026, hoteis -23%)
- Midia e publicidade (display/branded content/ads) no site Core, vendida a hoteis, marcas e DMOs
- TheFork: comissao por talher/cover (~EUR 2 a EUR 4 por pessoa que chega via plataforma; ex.: EUR 2,60/pessoa em alguns mercados) + assinatura do software TheFork Manager em 3 niveis
- Assinaturas/produtos B2B para negocios (Business Advantage, ferramentas de destaque e analytics)
- Programa de afiliados (revenue share de click-out de hotel e % de bookings de experiencias) — receita indireta via parceiros/publishers

## 5. Afiliados
Sim, robusto e um dos pilares de distribuicao. NAO tem rede proprietaria de signup direto: a entrada e via redes terceiras — CJ (Commission Junction), Awin e Travelpayouts. Comissoes tipicas: (a) Hoteis — ~50% da comissao/receita que o Tripadvisor ganha por click-out elegivel na secao de hoteis (sobe ate ~80% em promocoes); (b) Experiencias/Viator — 8% sobre bookings completos, subindo ate 12% para afiliados de alto volume. Cookie: ~14 dias no programa Tripadvisor; ate 30 dias no programa Viator (Travel Content Partners). Pagamento mensal, minimo tipico US$50-100 (Viator paga semanalmente via PayPal sem minimo em alguns casos).

## 6. API
Sim — multiplas APIs, separadas por negocio. (1) Content API (developer-tripadvisor.com): expoe localizacao, nome/endereco/coordenadas, nota, ranking, sub-notas, premios, link de reviews e fotos; gratuita, porem SO para uso B2C/consumer-facing com fim de aquisicao de trafego, sem uso B2B/comercial puro, com limites de chamadas e restricoes de exibicao/caching. (2) Viator Partner API v2 (docs.viator.com) — a mais aberta: niveis Basic (conteudo limitado), Full (reviews + disponibilidade em tempo real) e Full+Booking (transacao no proprio site do parceiro = merchant of record); afiliados sem booking redirecionam para viator.com via URL com cookie. (3) Connectivity Solutions / Hotel Availability Check (HAC) API, Hotel Pricing API e Instant Booking API para parceiros de connectivity (OTAs/IBEs), modelo de comissao, sem upfront, com SLA (resposta < 5s). Nao e GDS nem NDC.

## 7. Programa de parceiros
Ecossistema amplo de parceria. TripConnect (CPC para hoteis/IBEs e Connectivity Partners B2B, modelo de comissao sem pagamento upfront); Viator Partner Program (Affiliate via Awin/CJ/Travelpayouts, Travel Commerce Partners via API, e Merchant Partners que vendem no proprio site); programa para criadores/publishers; e API partnerships (precisa virar 'approved partner' via formulario e receber API key). Onboarding de afiliado tecnico via affiliateapi@tripadvisor.com. Em 2026 abriu frente de parceria com AI (app Viator no ChatGPT) sinalizando distribuicao via agentes/LLMs.

## 8. Dados que oferece
- Reviews e UGC em escala (>1 bilhao de opinioes) sobre hoteis, restaurantes e atracoes
- Notas, sub-notas, rankings e selos de reputacao (Travelers' Choice)
- Conteudo estruturado de >300 mil produtos de experiencias/tours via Viator (descricao, preco, fotos, termos, disponibilidade em tempo real no nivel Full)
- Comparativo de precos de hoteis entre varias OTAs (meta-busca / click-out)
- Disponibilidade e reserva de mesas de restaurante em tempo real (TheFork, Europa/Australia)
- Metadados de localizacao (coordenadas, endereco, categoria) via Content API
- Fotos e ranking de pontos de interesse

## 9. Dados que NÃO oferece
- Custo TOTAL realista de uma viagem (nao soma voo + hospedagem + comida + transporte + experiencias num orcamento unico)
- Roteiro dia-a-dia inteligente e otimizado por logistica/tempo (so listas e salvamentos soltos)
- Voos / passagens aereas como produto bookavel (nao e meta-busca de voo; nao tem GDS/NDC)
- Comparacao estruturada entre DESTINOS (cidade A vs cidade B por clima, custo, seguranca, vibe) — e organizado por POI, nao por decisao de destino
- Super-perfil persistente do viajante que personaliza tudo (recomendacao ainda e fraca e generica)
- Precos historicos / previsao de melhor epoca para comprar
- Dados B2B abertos para uso analitico (Content API proibe uso nao-consumer/comercial)
- Reviews completos sem restricao via API gratuita (ha limites de exibicao/caching)

## 10. Pontos fortes
- Marca e confianca: maior acervo de reviews de viagem do mundo, top-of-mind na fase de pesquisa
- SEO/conteudo historicamente dominante (paginas de POI rankeiam organicamente — embora agora ameacado por AI)
- Viator e ativo forte e em crescimento: inventario gigante de tours/atracoes, merchant of record, programa de afiliado e API maduros (8-12%)
- TheFork e lider de reservas de restaurante na Europa/Australia (rede dificil de replicar)
- Programa de afiliados acessivel via 3 redes (Awin/CJ/Travelpayouts) com comissoes altas no click-out de hotel (ate 50-80%)
- APIs de conteudo e de experiencias bem documentadas e prontas para integracao
- Selos (Travelers' Choice) com valor real de marketing para negocios

## 11. Pontos fracos
- Core/Hotels em declinio estrutural: AI Overviews e ChatGPT canibalizam o trafego de pesquisa (estimativa de ~33% de queda em visitas via SEO; Hotels -23% no Q1 2026)
- Dependencia historica de trafego organico do Google — vulneravel a mudanca de algoritmo e LLMs
- Problema cronico de reviews falsos: ~8% dos 31,1M de reviews de 2024 eram fraudulentos (2,7M removidos), erodindo a confianca
- Suporte ao cliente fraco/quase inexistente — reclamacao recorrente
- Personalizacao e recomendacao fracas: experiencia generica, nao centrada no perfil do viajante
- Nao resolve planejamento de ponta a ponta (sem custo total, sem roteiro otimizado, sem voos)
- Modelo de meta-busca de hotel comoditizado e pressionado por Google/Booking
- Q1 2026 com prejuizo liquido (US$32,4M) e receita caindo 4% a/a — empresa voltou a avaliar 'strategic alternatives'

## 12. Reclamações comuns dos usuários
- Reviews falsos de concorrentes que nao sao removidos mesmo com prova documentada (negocios)
- Reviews legitimos de alerta deletados em silencio usando a brecha da politica de 'first-hand experience' — ambiente artificialmente positivo (viajantes)
- Suporte ao cliente ausente: 'nao tem suporte real quando voce precisa', dificil falar com alguem
- Cancelamentos com reembolso travado (Viator): clientes esperando o dinheiro de volta sem retorno
- Relatos de extorsao: ameacas de review ruim a menos de pagamento, com Tripadvisor as vezes mantendo o ator malicioso ja banido por outras plataformas
- Percepcao de que o sistema favorece quem paga por exposicao (CPC/ads/Business Advantage)
- Inconsistencia entre nota exibida e experiencia real por causa de 'review boosting' (54% das fraudes)

## 13–19. Limitações
| Eixo | Limitação |
|---|---|
| **UX** | UX pesada, fragmentada e cheia de anuncios/CTAs de monetizacao. O usuario navega por POI isolado (hotel X, atracao Y, restaurante Z) e precisa montar mentalmente a viagem — nao ha um fluxo unico de planejamento. As tres marcas (Tripadvisor, Viator, TheFork) sao experiencias desconectadas. Mobile melhorou, mas a densidade de listagens patrocinadas e a ausencia de um 'norte' de decisao deixam o viaj |
| **Personalização** | Personalizacao rasa: recomendacoes sao genericas, baseadas em popularidade/ranking e nao num super-perfil persistente (orcamento, ritmo, estilo, restricoes alimentares, com quem viaja). Nao aprende com o usuario ao longo do tempo de forma util para a decisao. Mesmo com login, a experiencia entrega 'o mais popular' e nao 'o certo para voce'. |
| **IA** | Ate 2025 a IA era cosmetica ('AI-powered' summaries de reviews). Em 2026 a empresa anunciou virada para arquitetura 'AI-nativa' e experimentos com IA agentica (app Viator no ChatGPT), mas isso e reativo — nasceu da ameaca das AI Overviews que estao destruindo o trafego do Core. Hoje a IA nao entrega roteiro completo, orcamento total nem decisao de destino; e assistente de descoberta, nao copiloto  |
| **Roteirização** | Praticamente inexistente como produto. Oferece 'listas/salvamentos' e 'Trips', mas nao gera roteiro dia-a-dia otimizado por logistica, tempo de deslocamento, horarios de funcionamento ou ritmo do viajante. Nao conecta os POIs salvos numa sequencia executavel. Quem usa Tripadvisor ainda precisa de outra ferramenta (ou planilha) para montar o roteiro de verdade. |
| **Orçamento** | Nao existe visao de custo total da viagem. Mostra faixa de preco por item (US$ a US$$$$ no hotel, preco do tour no Viator, ~EUR 2-4/cover no TheFork), mas nunca soma voo + hospedagem + alimentacao + transporte local + experiencias num orcamento realista por viajante/dia. O viajante nao sai do Tripadvisor sabendo 'quanto essa viagem vai custar de verdade'. |
| **Comparação** | Compara PRECOS de um mesmo hotel entre OTAs (meta-busca), mas NAO compara DESTINOS entre si. Nao existe 'Lisboa vs Barcelona vs Atenas' por custo medio, clima na data, seguranca, deslocamento, vibe e adequacao ao perfil. A comparacao e intra-categoria e intra-POI, nunca a decisao macro de 'para onde ir'. Isso deixa todo o topo do funil (escolha de destino) descoberto. |
| **Integração** | Integravel, mas em silos e com amarras. Viator Partner API e o caminho mais limpo (conteudo + booking + afiliado, comissao 8-12%). Content API e gratuita porem restrita a uso B2C de aquisicao de trafego, com limites de chamada e regras de exibicao/caching que travam uso analitico. Hoteis dependem de Connectivity/HAC API com SLA (<5s) e aprovacao como parceiro. Nao ha um endpoint unico que entregue |

## 20. Oportunidades para superá-lo
- Eles NAO entregam custo total realista — nosso app vira o lugar onde o viajante descobre 'quanto custa de verdade' (voo+hotel+comida+transporte+experiencias)
- Eles NAO escolhem destino — dominar a comparacao macro de destinos (custo/clima/seguranca/vibe na data) captura o topo do funil que o Tripadvisor ignora
- Eles NAO geram roteiro otimizado — entregar roteiro dia-a-dia logistico transforma POIs soltos em viagem executavel
- Personalizacao real via super-perfil supera o 'mais popular' generico deles
- Trafego do Core esta caindo por AI — ser AI-nativo de planejamento desde o inicio nos posiciona onde o Tripadvisor chega tarde e reativo
- Suporte e confianca: reviews falsos e suporte ausente sao dor publica — podemos curar conteudo (inclusive consumindo a base deles via API) com camada de confianca melhor
- Monetizar o trafego deles: integrar Viator (8-12%) e click-out de hotel (afiliado ate 50%) DENTRO do nosso roteiro, virando a camada de decisao que envia o booking para eles e fica com a comissao

---

## Matriz (visão Mundo Sem Fim)
| Critério | Avaliação |
|---|---|
| Força principal | Maior base de reviews/confianca de viagem do mundo + Viator (marketplace de experiencias merchant-of-record, em crescimento) e TheFork (lider de reserva de restaurante na Europa). |
| Fraqueza principal | Core/Hotels em declinio estrutural pela canibalizacao da pesquisa por AI Overviews/ChatGPT (Hotels -23% Q1 2026); zero planejamento de ponta a ponta (sem custo total, sem roteiro, sem escolha de destino) e suporte/anti-fraude fracos. |
| Modelo de receita | Tres motores: comissao de experiencias (Viator, merchant of record), CPC/referral + midia em hoteis (Core, declinante) e comissao por cover + assinatura (TheFork). Receita 2025 US$1,891 bi; Q1 2026 com prejuizo. |
| Possui API? | Sim — Viator Partner API v2 (Basic/Full/Full+Booking, a mais aberta), Content API (gratuita mas restrita a B2C de aquisicao) e Connectivity/HAC/Instant Booking para hoteis. Nao e GDS/NDC. |
| Possui afiliados? | Sim — via Awin, CJ e Travelpayouts. Hotel ~50% da comissao por click-out (ate 80% em promo, cookie ~14d); Viator 8% subindo a 12% por volume (cookie ate 30d). |
| Pode virar parceiro? | Sim. Caminhos: afiliado (Awin/CJ/Travelpayouts), Viator Travel Commerce Partner via API (ate Full+Booking no nosso app), TripConnect/Connectivity para hoteis, e Content API para enriquecer fichas. Onboarding tecnico via affiliateapi@tripadvisor.com. |
| Pode pagar comissão? | Sim — para NOS (somos nos que recebemos): 8-12% em bookings de experiencia Viator e ate ~50% da comissao de hotel no click-out. Modelo CPA/revenue-share, pagamento mensal. |
| Pode receber tráfego? | Sim — mandamos trafego/leads qualificados pra eles a partir do nosso roteiro/decisao (click-out de hotel, deep-link de tour Viator, reserva TheFork) e monetizamos a comissao. Eles tambem podem (em tese) nos mandar trafego, mas o trafego deles esta encolhendo. |
| Pode ser integrado? | Sim (parcial). Viator = integracao plena (conteudo+booking+comissao via API/deeplink). Hoteis = via Connectivity/HAC API ou afiliado/click-out. Reviews/POI = via Content API (com limites B2C e de caching). Sem endpoint unico combinado — integra-se marca a marca. |
| **O que precisamos ter p/ superar** | Para sermos melhores que o Tripadvisor no que ele faz bem (descoberta confiavel + booking de experiencia): (1) consumir o inventario Viator via API e exibir experiencias DENTRO de um roteiro otimizado, monetizando 8-12%; (2) ter uma camada de confianca/curadoria melhor que reviews falsos + suporte humano; (3) cobrir o que eles nao tem — custo total realista, escolha de destino e roteiro dia-a-dia  |

## Fontes consultadas
- https://www.sec.gov/Archives/edgar/data/0001526520/000119312526210278/trip-ex99_1.htm (Tripadvisor 8-K FY2026 — receita 2025 US$1,891 bi, Q1 2026 receita -4%, prejuizo US$32,4M, segmentos)
- https://www.investing.com/news/company-news/tripadvisor-q1-2026-slides-marketplace-shift-advances-amid-revenue-decline-93CH-4669028 (Q1 2026: Hotels & Other -20%, Hotels -23%, pivot para marketplace)
- https://www.investing.com/news/company-news/tripadvisor-q2-2025-presentation-revenue-up-64-as-viator-and-thefork-lead-growth-93CH-4179081 (Viator e TheFork como motores de crescimento)
- https://skift.com/2026/02/12/tripadvisor-sees-traffic-decline-from-ai-overviews-considers-strategic-alternatives-again/ (queda de trafego por AI Overviews; 'strategic alternatives')
- https://eturbonews.com/tripadvisor-ai-decline-warning-online-travel-agents/ (estimativa ~33% de queda em visitas SEO por AI)
- https://www.tripadvisor.com/affiliates?tab=faqs (programa de afiliados oficial: hotel 50% do payout, experiencias 8%)
- https://strackr.com/blog/tripadvisor-affiliate-program (redes CJ/Awin/Travelpayouts, cookie 14 dias, ate 80% em promo)
- https://docs.viator.com/partner-api/ (Viator Partner API v2; niveis de acesso Basic/Full/Full+Booking)
- https://partnerresources.viator.com/travel-commerce/levels-of-access/ (afiliado redireciona para viator.com; booking restrito ao merchant of record)
- https://commissiondex.com/program/viator/ (Viator 8-12%, cookie ate 30 dias, payout)
- https://developer-tripadvisor.com/content-api/ (Content API: dados expostos; gratuita; so B2C/aquisicao de trafego)
- https://developer-tripadvisor.com/connectivity-solutions/hotel-availability-check-api/ (HAC API, SLA <5s, modelo de comissao, sem upfront)
- https://www.cnbc.com/2025/05/26/heres-how-many-fake-reviews-tripadvisor-found-on-its-website-in-2024-.html (2,7M reviews falsos removidos em 2024; ~8% dos 31,1M; 54% review boosting)
- https://uk.trustpilot.com/review/www.tripadvisor.com (reclamacoes: reviews falsos nao removidos, reviews legitimos deletados, suporte ausente, reembolso travado)
- https://deru.es/en/blog/software-restaurantes-reservas/ (TheFork ~EUR 2-2,60/cover; modelo comissao + assinatura TheFork Manager)
- https://about.thefork.com/ (TheFork lider de reservas de restaurante na Europa/Australia)
