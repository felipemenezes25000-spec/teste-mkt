# Google Maps

> **Categoria:** Mapas / POIs / Navegacao / Descoberta local (com camada crescente de planejamento de viagem por IA via Gemini "Ask Maps")
> _Perfil gerado por pesquisa multiagente (jun/2026). Parte do [Relatório de Mercado](../01-relatorio-de-mercado.md) e da [Matriz Competitiva](../02-matriz-competitiva.md)._

## 1. O que faz
Google Maps e o maior mapa digital e mecanismo de descoberta local do mundo: navegacao por carro/transporte/pe, busca de POIs (restaurantes, hoteis, atracoes), avaliacoes e fotos de uma base de 250-300+ milhoes de lugares e 500+ milhoes de contribuidores, alem de Street View e Immersive View. Em 2025-2026 ganhou camada conversacional de IA ("Ask Maps", baseada em Gemini) que monta sugestoes de paradas, otimiza rota por horario de funcionamento e responde perguntas complexas de planejamento ("paradas recomendadas entre o Grand Canyon e Horseshoe Bend?"). Nao e uma OTA: nao vende a viagem nem e merchant of record; conecta o usuario a parceiros (Hotel Ads, e o futuro booking agentico no AI Mode).

## 2. Público-alvo
Praticamente todo viajante e consumidor global com smartphone (mais de 1 bilhao de usuarios ativos mensais; pre-instalado no Android). No B2B, o publico sao desenvolvedores/empresas que consomem o Google Maps Platform (apps de mobilidade, delivery, imobiliarias, travel-tech) e estabelecimentos locais/hoteis que anunciam via Google Business Profile e Google Hotel Ads.

## 3. Funcionalidades principais
- Navegacao turn-by-turn (carro, transporte publico, a pe, bike) com transito em tempo real e rerouting
- Busca e descoberta de POIs com horarios, telefone, fotos, faixa de preco e avaliacoes
- Avaliacoes/reviews e Local Guides (500M+ contribuidores)
- Street View, Immersive View e Immersive Navigation (simulacao 3D da rota)
- Ask Maps: assistente Gemini para planejamento conversacional e sugestao de paradas
- Listas/salvos, compartilhamento de lugares e timeline de localizacao
- Google Hotel Ads (modulo de hoteis com precos comparados de OTAs/parceiros dentro da ficha do hotel)
- Reservas de restaurante e servicos (integracoes Reserve with Google)
- Google Maps Platform: APIs/SDKs (Places, Directions, Geocoding, Routes, Distance Matrix, Maps Static/JS)

## 4. Como monetiza
- Publicidade local/de busca: anuncios de estabelecimentos e POIs patrocinados dentro do Maps (modelo CPC, parte do ecossistema Google Ads/Performance Max)
- Google Hotel Ads: leilao de hoteis. Em 2025 a Google aposentou os modelos de comissao/CPA (commission-per-stay GHACP, tipicamente 10-15% sobre a diaria liquida; CPA sunset em 19-20/fev/2025) e migrou tudo para CPC e Performance Max com objetivo de ROAS
- Google Maps Platform (API paga): cobranca por 1.000 chamadas por SKU (US$2 a US$30/1K). Em 2025-2026 a Google removeu o credito universal de US$200/mes e criou tiers Essentials/Pro/Enterprise com assinaturas (ex.: Starter US$100/mes, Pro US$1.200/mes)
- Futuro booking agentico (AI Mode/Gemini): Google conecta a parceiros (Booking.com, Expedia, Marriott, IHG, Choice, Wyndham) que sao o merchant of record; Google declarou explicitamente que NAO pretende virar OTA. Modelo de remuneracao (referral/ads) ainda nao divulgado publicamente

## 5. Afiliados
NAO possui programa de afiliados tradicional aberto (nem em Awin, CJ, Impact, Partnerize, Travelpayouts ou rede propria de afiliado). Google Flights e Google Hotels nao tem affiliate program para publishers ganharem comissao por clique/booking. A monetizacao de hoteis acontece pelo lado do anunciante (hotel/OTA paga via Hotel Ads/CPC), nao pelo lado do publisher. Quem quer 'mandar trafego e ganhar comissao' nao consegue via Google Maps; consegue via deeplink que cai numa OTA terceira (e ai a comissao e da OTA, nao da Google).

## 6. API
SIM — Google Maps Platform, uma das APIs de mapas mais completas e usadas do mundo. Tipo: API publica de desenvolvedor (paga, por chave), NAO API de afiliado nem GDS/NDC. Principais SKUs: Places API (Place Details Essentials US$5/1K, Pro US$17/1K, Enterprise US$20/1K; Autocomplete ~US$2,83/1K em sessao nao concluida), Directions/Routes, Geocoding, Distance Matrix, Maps Static e Maps JavaScript. Restricao critica nos Termos: conteudo de POI (exceto place_id) NAO pode ser cacheado/armazenado; lat/long so por ate 30 dias; e proibido criar produto 'substancialmente similar' que recrie funcoes de produtos Google ou um mapa substituto.

## 7. Programa de parceiros
Possui ecossistema de parceiros B2B, mas voltado a oferta, nao a publishers de afiliado: (1) Google Hotel Ads Connectivity Partners (channel managers/OTAs que enviam tarifas e disponibilidade — ex.: SiteMinder, Derbysoft, etc.) para hoteis aparecerem no modulo de precos; (2) Google Maps Platform Partners (revendedores/integradores das APIs); (3) Reserve with Google (parceiros de reserva de restaurantes/atividades). Para o futuro booking agentico no AI Mode, ha parceria com grandes redes/OTAs (Booking.com, Expedia, Marriott, IHG, Choice, Wyndham). Nao ha um 'partner program' onde um app de planejamento receba comissao por enviar usuarios.

## 8. Dados que oferece
- POIs georreferenciados em escala global (250-300M+ lugares) com place_id estavel
- Avaliacoes, nota media, fotos e faixa de preco ($-$$$$) de estabelecimentos
- Horarios de funcionamento, telefone, site, categoria e atributos
- Geometria/rotas, distancia, ETA e tempo de deslocamento (carro/pe/transporte) em tempo real
- Geocoding e reverse geocoding, autocomplete de enderecos
- Comparacao de precos de hoteis (de OTAs/parceiros) e disponibilidade na ficha do hotel
- Imagens Street View / aerea para contexto visual da rota e do entorno

## 9. Dados que NÃO oferece
- Custo TOTAL realista de uma viagem (orcamento agregado de voo+hotel+alimentacao+ingressos+transporte local)
- Comparacao estruturada DESTINO vs DESTINO (clima, seguranca, custo medio diario, melhor epoca) lado a lado
- Inventario/tarifas de voos via API (Google Flights nao expoe API publica nem afiliado)
- Roteiro multi-dia exportavel e editavel via API (o Ask Maps gera no app, mas nao ha endpoint que devolva itinerario estruturado para terceiros)
- Perfil persistente e portavel do viajante (preferencias, restricoes, estilo) acessivel por outro app
- Dados de POI armazenaveis/persistentes (proibido por contrato cachear conteudo alem do place_id)
- Comissao/feed de afiliado para monetizar trafego enviado por terceiros

## 10. Pontos fortes
- Cobertura e frescor de dados de POI incomparaveis no mundo (escala, fotos, reviews, horarios)
- Confianca e ubiquidade da marca; pre-instalado em bilhoes de Androids — custo de aquisicao zero para o usuario
- Navegacao e transito em tempo real best-in-class
- API/Platform madura, documentada e padrao de mercado para geodados
- Integracao vertical com Search, Gemini e Android cria distribuicao e dados de intencao gigantescos
- Camada de IA (Ask Maps/Immersive) avancando rapido em planejamento contextual

## 11. Pontos fracos
- Nao resolve a DECISAO financeira da viagem: nao mostra custo total nem compara destinos por orcamento
- Reviews poluidos por spam e listagens falsas (problema estrutural e publico)
- Sem programa de afiliado: terceiros nao conseguem monetizar trafego enviado ao Maps
- API cara e com termos restritivos (proibicao de cache de POI e de produtos 'similares') que travam quem quer construir em cima
- Foco em descoberta de lugar isolado, nao em planejamento ponta-a-ponta de uma viagem de varios dias com logistica
- Planejamento por IA ainda generico e preso ao app/ecossistema Google, sem personalizacao profunda por perfil persistente
- Conflito de interesse: ao empurrar Hotel Ads/parceiros pagantes, o ranking de hospedagem nao e neutro

## 12. Reclamações comuns dos usuários
- Listagens falsas/golpes: Google removeu 10.000+ perfis falsos e processou rede de golpistas (mar/2025), com bait-and-switch em 'duress verticals' (chaveiro, guincho)
- Reviews removidos sem explicacao clara — Trustpilot da Maps em ~1,5/5; donos e Local Guides reclamam de remocoes injustas (flag como 'fake engagement' mesmo com foto/recibo)
- Volume de spam de reviews: 292M+ avaliacoes bloqueadas/removidas em 2025 (1 em cada 5 tentativas viola politica)
- Erros de rota e rerouting: rotas incorretas em areas rurais, recalcular constante em faixas HOV/pedagio rapido, direcoes a pe imperfeitas
- Dados de estabelecimento desatualizados (horario, numero da casa errado)
- Consumo de bateria na navegacao
- Mudancas de politica de reviews (jul/2025) que reverificaram e removeram reviews legitimos em massa

## 13–19. Limitações
| Eixo | Limitação |
|---|---|
| **UX** | UX otima para 'achar UM lugar e ir ate ele', mas hostil para PLANEJAR. Nao existe uma tela unica de 'minha viagem' com dias, blocos e logistica; o usuario tem que salvar pins soltos em listas e montar tudo na cabeca. O modulo de hoteis aparece com ruido de anuncios e o foco e na acao imediata (ir/ligar/reservar), nao na deliberacao calma entre opcoes. Ask Maps melhora isso, mas vive dentro do flux |
| **Personalização** | Personalizacao e implicita e rasa (historico de buscas, lugares salvos). Nao ha super-perfil explicito do viajante (ritmo, orcamento, restricoes alimentares, estilo aventura vs conforto, viaja com criancas) que molde as recomendacoes de forma consistente e auditavel. As sugestoes do Ask Maps sao contextuais ao momento, nao a uma identidade de viajante persistente e portavel. |
| **IA** | A IA (Gemini/Ask Maps) e forte em conhecimento espacial e em responder 'o que ha no caminho/perto', mas e generalista e ancorada no inventario Google. Nao raciocina sobre trade-off de CUSTO TOTAL, nem faz comparacao normativa entre destinos, nem assume a persona do viajante para curar. Como roda no ecossistema fechado da Google, terceiros nao tem acesso a essa IA por API para compor no proprio pro |
| **Roteirização** | Roteiriza no sentido de OTIMIZAR ROTA/parada (sequencia geografica, horarios de funcionamento), mas nao monta um ROTEIRO de viagem real multi-dia com pernoite, deslocamentos intermunicipais, ritmo diario e folgas. E navegacao + sugestao de parada, nao um itinerario estruturado e editavel de 5-10 dias com manha/tarde/noite. E nao ha endpoint para exportar esse roteiro a outro app. |
| **Orçamento** | Ponto cego total. Google Maps mostra faixa de preco de POI ($-$$$$) e tarifa de hotel via Hotel Ads, mas NAO soma o custo da viagem inteira (voo + hospedagem + comida + ingressos + transporte local + margem), nao projeta gasto diario realista nem ajuda a decidir 'qual destino cabe no meu bolso'. Quem quer planejar por orcamento nao encontra essa logica em lugar nenhum do produto. |
| **Comparação** | Compara PRECOS de hoteis dentro de uma mesma cidade/ficha, mas nao compara DESTINOS entre si (Peru vs Tailandia por custo medio diario, clima, seguranca, melhor epoca, tempo de voo). A unidade de comparacao do Maps e o lugar/estabelecimento, nunca o destino como decisao de alto nivel — exatamente a etapa anterior em que o viajante mais precisa de ajuda. |
| **Integração** | Integravel tecnicamente (API madura), porem com travas pesadas para nosso caso: (1) os Termos proibem cachear/armazenar conteudo de POI alem do place_id e proibem criar produto 'substancialmente similar' a produtos Google, o que limita guardar dados para montar nosso proprio acervo; (2) custo por chamada relevante em escala (Places Pro US$17/1K); (3) nao ha afiliado, entao integrar nao gera receit |

## 20. Oportunidades para superá-lo
- Ser o 'cerebro' de DECISAO que falta: custo total realista da viagem e comparacao destino-vs-destino, etapas que o Maps simplesmente nao cobre
- Super-perfil persistente e portavel do viajante que personaliza tudo (o Maps so tem sinais implicitos e rasos)
- Roteiro multi-dia estruturado e editavel (manha/tarde/noite, pernoite, deslocamentos) vs sugestao de parada solta do Maps
- Curadoria neutra e transparente de hospedagem/atividade — sem o conflito de empurrar quem paga Hotel Ads
- Monetizar via afiliado/comissao (Booking, Expedia via Travelpayouts/Awin/Impact) algo que o Maps nao oferece a parceiros
- Usar place_id do Maps como cola de POI (permitido) e construir POR CIMA a camada de orcamento, comparacao e roteiro que ele nao tem
- Combater a fraqueza de reviews falsos com curadoria/sinais proprios mais confiaveis para a decisao

---

## Matriz (visão Mundo Sem Fim)
| Critério | Avaliação |
|---|---|
| Força principal | Base de POIs, navegacao e dados de lugar em escala global incomparavel, com marca confiavel e distribuicao pre-instalada em bilhoes de dispositivos. |
| Fraqueza principal | Resolve 'achar e chegar a UM lugar', mas nao resolve a DECISAO da viagem (custo total, comparacao de destinos, roteiro multi-dia, perfil do viajante) — e nao paga parceiros por trafego. |
| Modelo de receita | Publicidade (CPC local + Google Hotel Ads, agora CPC/Performance Max apos matar CPA/comissao em 2025) e venda da API paga Google Maps Platform por 1.000 chamadas; futuro booking agentico no AI Mode com parceiros como merchant of record (Google nao vira OTA). |
| Possui API? | Sim — Google Maps Platform (Places, Directions, Geocoding, Routes etc.), API publica de desenvolvedor PAGA, nao de afiliado/GDS. Restricoes de cache de POI e de produto similar. |
| Possui afiliados? | Nao — sem programa de afiliado (nada em Awin/CJ/Impact/Partnerize/Travelpayouts/proprio). Monetiza pelo lado do anunciante (hotel/OTA paga), nao paga publishers que enviam trafego. |
| Pode virar parceiro? | Parcial — da pra ser parceiro tecnico do Maps Platform (consumir API) e de Hotel Ads pelo lado do anunciante, mas NAO ha caminho para receber comissao por mandar usuarios ao Maps. Parceria real de receita seria com OTAs por tras (Booking/Expedia), nao com o Maps. |
| Pode pagar comissão? | Nao para nos — o Google Maps nao repassa comissao a terceiros que enviam trafego (nao e rede de afiliado). Quem paga comissao no fluxo e a OTA final (Booking/Expedia), nao a Google. |
| Pode receber tráfego? | Sim — podemos mandar o usuario ao Maps via deeplink (place_id/rota) para navegacao e detalhes de lugar; util como camada de 'ir ate la', mas sem retorno financeiro direto da Google. |
| Pode ser integrado? | Parcial — via API paga (mapa, rota, place_id, geocoding) e via deeplink. Travado por: proibicao de cachear conteudo de POI alem do place_id, proibicao de produto 'substancialmente similar', e custo por chamada em escala. Sem integracao de booking/comissao. |
| **O que precisamos ter p/ superar** | Para sermos melhores que o Maps onde ele e bom: usar place_id/mapa/rota do Google como base confiavel de 'lugar e deslocamento' (permitido), porem entregar EM CIMA o que ele nao tem — custo total realista, comparacao destino-vs-destino, roteiro multi-dia editavel, super-perfil do viajante e curadoria neutra; e fechar a monetizacao via afiliado de OTA (Travelpayouts/Awin/Impact) que o Maps nao ofer |

## Fontes consultadas
- https://www.woosmap.com/blog/google-maps-api-pricing-breakdown
- https://mapsplatform.google.com/pricing/
- https://developers.google.com/maps/billing-and-pricing/pricing
- https://developers.google.com/maps/documentation/places/web-service/policies
- https://cloud.google.com/maps-platform/terms/maps-service-terms
- https://www.seekda.com/en/post/google-hotel-ads-cpa-model-is-ending-heres-what-you-need-to-know/
- https://www.mirai.com/blog/what-is-google-hotel-ads-commission-program-ghacp-and-how-does-it-work/
- https://support.google.com/google-ads/answer/9695951
- https://www.travelpayouts.com/blog/does-google-flights-have-an-affiliate-program/
- https://skift.com/2025/11/17/google-is-building-agentic-travel-booking-plus-other-travel-ai-updates/
- https://skift.com/2025/11/20/google-agentic-ai-travel-booking-no-intention-become-ota/
- https://www.phocuswire.com/google-agentic-travel-booking-ai
- https://blog.google/products-and-platforms/products/maps/ask-maps-immersive-navigation/
- https://techcrunch.com/2025/03/27/google-rolls-out-new-vacation-planning-features-to-search-maps-and-gemini/
- https://www.cbsnews.com/news/google-maps-fake-listings-lawsuit-scams/
- https://www.seroundtable.com/google-maps-spam-fighting-2025-41176.html
- https://www.trustpilot.com/review/maps.google.com
- https://travel.google/partners/hotels/for-connectivity-partners/
