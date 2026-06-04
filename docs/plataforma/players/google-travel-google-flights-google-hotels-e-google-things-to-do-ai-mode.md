# Google Travel (Google Flights, Google Hotels e Google Things to do / AI Mode)

> **Categoria:** Agregador / metabuscador e camada de planejamento (search + comparação), integrado a Search, Maps e Gemini
> _Perfil gerado por pesquisa multiagente (jun/2026). Parte do [Relatório de Mercado](../01-relatorio-de-mercado.md) e da [Matriz Competitiva](../02-matriz-competitiva.md)._

## 1. O que faz
Google Travel e o hub gratuito do Google para busca e comparacao de voos (Google Flights), hospedagem (Google Hotels) e atracoes (Things to do), disponivel em google.com/travel e dentro da Busca, Maps e Gemini. Ele NAO vende nada: agrega precos de companhias aereas e OTAs e redireciona o usuario para fechar a compra no site da cia/OTA/hotel. Em 2025-2026 ganhou camada de IA (AI Mode na Busca e Gemini) que monta itinerarios a partir de prompts ("crie um roteiro de natureza na Costa Rica"), rastreia precos e exporta para Docs/Gmail/Maps.

## 2. Público-alvo
Viajante final mainstream de massa (qualquer pessoa que abre o Google para pesquisar voo/hotel), do mochileiro ao executivo. Tambem hoteis e OTAs como anunciantes/parceiros de inventario. Forte em mercados maduros (EUA, Europa, Brasil); e o ponto de partida default de busca de viagem por estar embutido na Busca do Google.

## 3. Funcionalidades principais
- Google Flights: busca, calendario de precos, mapa de precos, grafico de historico, rastreamento e alertas de preco, filtros (escalas, bagagem, cias)
- Garantia de preco em voos selecionados (Google paga a diferenca se o preco cair apos a compra)
- Google Hotels: comparacao de tarifas entre OTAs e site oficial, mapa, filtros, price tracking e 'deal' badges
- Free Booking Links: links organicos gratuitos de hotel/voo (cia e OTA aparecem sem pagar)
- Hotel Ads: leiloes pagos (CPC/CPA) acima/junto aos links organicos
- Things to do: atracoes, ingressos e atividades por destino
- AI Mode / Gemini: geracao de roteiro por linguagem natural, busca conversacional de voos, exportacao para Docs/Gmail/Maps
- Integracao profunda com Search, Maps, Gmail (itinerarios detectados em e-mails) e Android

## 4. Como monetiza
- Hotel Ads via leilao - modelo dominante hoje e CPC (custo por clique); benchmark travel ~US$2,12 CPC em 2026
- CPA / commission-per-stay (CPS): pagamento so quando a estadia e concluida, descontando cancelamentos/no-shows
- IMPORTANTE: Google encerrou o 'commission bidding' para novas campanhas em 30/abr/2024, sunset das campanhas existentes em 20/fev/2025 e reconciliacao final ate 30/nov/2025 - ou seja, migrou o leilao de hotel majoritariamente para CPC
- Free Booking Links sao gratuitos (receita zero direta) - servem para atrair inventario e trafego; monetizacao vem dos Ads ao redor
- Voos (Google Flights): NAO cobra do usuario nem comissiona o publisher - e isca de trafego para o ecossistema de Ads/Search do Google
- Receita macro do Google Travel vem de publicidade (Search Ads + Hotel Ads), nao de comissao de venda como uma OTA

## 5. Afiliados
NAO existe programa de afiliados do Google Travel/Google Flights para publishers/criadores. Nenhuma rede (proprio, Awin, CJ, Impact, Partnerize, Travelpayouts) intermedia comissao de quem manda trafego PARA o Google. O fluxo de afiliado e o inverso: OTAs (Booking, Expedia, Trip.com etc.) e cias pagam ao Google via Hotel Ads/Search Ads para aparecer. Para um app como o nosso, isso significa zero receita de comissao mandando lead para o Google - a monetizacao real esta nas OTAs que o proprio Google lista (Skyscanner ~20% da receita do parceiro, Trip.com 1-5%, Kiwi 3%, Booking via Awin/Impact ~25-40% da comissao do hotel).

## 6. API
SIM, porem so de PARCEIRO e so para hoteis: a Travel Partner API (endpoint travelpartner.googleapis.com, RESTful, OAuth2), parte do Hotel Center, usada por hoteis/OTAs/connectivity partners para enviar feed ARI (transaction/rate/availability/inventory via mensagens OTA_Hotel*), gerir listings e configurar Hotel Ads. Acesso restrito: aprovacao manual no Travel Partner Center, revisao de 2 a 6 semanas + certificacao de acuracia de preco. NAO ha API publica/oficial de Google Flights nem API de afiliado para consumir dados de voo/hotel e revender - quem precisa de dados de voo recorre a alternativas (SerpApi 'Google Flights', Amadeus, Duffel, Travelpayouts/Aviasales).

## 7. Programa de parceiros
Travel Partner Center / Hotel Center para hoteis, OTAs e connectivity partners (canais como SiteMinder, Cloudbeat etc.) - dois trilhos: pago (Hotel Ads, CPC/CPA) e organico (Free Booking Links, gratuito). Inclui Transport Features API e programas de Things to do/atividades. Nao ha trilho de parceria para apps de planejamento/decisao quererem RECEBER comissao do Google; a relacao possivel e listar inventario PROPRIO ou virar connectivity partner certificado - nao monetizar trafego enviado ao Google.

## 8. Dados que oferece
- Precos de voo em tempo quase-real, calendario e historico de precos
- Comparacao de tarifas de hotel entre multiplas OTAs e site oficial
- Disponibilidade e tarifas via feed dos parceiros
- Metadados de propriedades, fotos, reviews (puxados do Maps/Business Profile)
- Sinais de preco: 'preco baixo tipico', alertas, deal badges
- Atracoes, ingressos e atividades por destino (Things to do)
- Geolocalizacao e mapa interativo via Google Maps
- Roteiros gerados por IA (AI Mode/Gemini) exportaveis para Docs/Maps

## 9. Dados que NÃO oferece
- Custo TOTAL realista da viagem (voo+hotel+comida+transporte local+atracoes somados) - so mostra precos isolados por categoria
- Orcamento personalizado por perfil/estilo de viajante
- Comparacao lado-a-lado de DESTINOS por custo-beneficio (ex.: Peru vs Tailandia para o meu budget)
- Roteiro dia-a-dia logisticamente otimizado com tempos de deslocamento reais e ritmo do viajante
- Recomendacao de quando/onde com base em super-perfil persistente do usuario
- Dados de muitas cias low-cost / regionais (cobertura desigual; ex.: Southwest so entrou em 2024 e com lacunas, 'bags fly free' nao comunicado)
- Transparencia de taxas finais antes do clique (preco frequentemente muda no checkout do parceiro)
- API publica de voos para terceiros
- Programa de afiliados/comissao para publishers

## 10. Pontos fortes
- Alcance e distribuicao incomparaveis - embutido na Busca, Maps, Gmail, Android e Gemini; e o ponto de partida default de busca de viagem
- Gratuito para o usuario e sem fee adicional no preco
- Google Flights e referencia em UX de busca de voo: calendario, grafico, alertas, garantia de preco
- Velocidade e confiabilidade de infra; dados de preço atualizados em alta frequencia
- Marca/confianca: badge 'site oficial' e neutralidade percebida (Ads nao rankeiam acima de organico, segundo o Google)
- Enforcement de acuracia de preco cada vez mais rigido (set/2025) melhora qualidade do rate pack
- Camada de IA (AI Mode/Gemini) integrando roteiro + voo + hotel num so lugar
- Inventario massivo de hoteis e cias via Hotel Center/Free Booking Links

## 11. Pontos fracos
- NAO fecha a compra - sempre redireciona; o usuario faz a ultima milha noutro site, gerando friccao e abandono
- Preco mostrado frequentemente diferente do preco no checkout do parceiro (caching/feed desatualizado, gaming de OTA)
- Cobertura desigual de low-cost/regionais e de tarifas reais (ex.: Southwest, basic economy mal sinalizada)
- Planejamento e raso: trata voo, hotel e atracoes como silos; nao entrega custo total nem logistica dia-a-dia
- Personalizacao fraca - nao mantem um super-perfil persistente do viajante entre sessoes
- IA generica e dependente de prompt; roteiros sem otimizacao logistica/orcamentaria real
- Conflito de interesse estrutural: hoteis/OTAs pagam por posicao, e o usuario nem sempre ve a tarifa realmente mais barata
- Sem trilho de monetizacao para parceiros de planejamento - so consome trafego, nao compartilha receita

## 12. Reclamações comuns dos usuários
- Preco visto no Google nao existe mais ao clicar - 'rate not available' no site do parceiro (reclamacao recorrente de viajantes e hoteleiros)
- OTAs 'gamificam' tarifas baixas que nao se cumprem, e o hotel gasta mais para manter posicao e ainda atende cliente frustrado
- Southwest: integrou em 2024 mas com menos opcoes que o site proprio e sem comunicar 'bags fly free', causando confusao
- Basic economy mal sinalizado - usuario descobre restricoes so no checkout
- Redirecionamento quebra o fluxo: vi o preco no Google, fui ao site e o preco/assento mudou
- Informacao de hotel incorreta no perfil do Google (Search Community)
- Sensacao de que Ads contaminam a 'neutralidade' do rate pack

## 13–19. Limitações
| Eixo | Limitação |
|---|---|
| **UX** | Forte em busca isolada, fraco em jornada continua. O usuario salta entre Flights, Hotels e Things to do como abas desconectadas e ainda precisa sair do Google para comprar. Nao ha um fluxo unico 'descobrir destino -> montar roteiro -> ver custo total -> reservar' coeso; o handoff para o parceiro quebra a experiencia e o preco muitas vezes muda no destino. |
| **Personalização** | Personalizacao superficial e episodica. Apesar de ter login Google e historico, nao constroi um super-perfil persistente do viajante (estilo, ritmo, tolerancia a budget, preferencias alimentares, com quem viaja). Cada busca recomeca do zero; recomendacoes sao genericas e baseadas em sinais de curto prazo, nao num modelo rico e durável do usuario. |
| **IA** | IA reativa e dependente de prompt (AI Mode/Gemini). Gera listas de pontos turisticos e itinerarios soltos, mas sem raciocinio de viabilidade: nao calcula deslocamentos reais, nao respeita orcamento total, nao casa voo+hotel+atracoes num plano coerente. E um assistente de sugestao, nao um motor de DECISAO que pondera trade-offs (custo x tempo x experiencia) pelo perfil do viajante. |
| **Roteirização** | Roteirizacao fraca/incipiente. O AI Mode monta esbocos de itinerario exportaveis para Docs/Maps, mas sem otimizacao logistica (ordem dos lugares por proximidade, tempos de traslado, horarios de funcionamento, ritmo realista por dia). Nao equilibra dias intensos vs leves nem encaixa o roteiro dentro de um budget. Resultado e uma lista bonita, nao um plano executavel. |
| **Orçamento** | Quase inexistente como visao de custo TOTAL. Mostra precos por silo (voo X, hotel Y) mas nunca soma voo+hospedagem+alimentacao+transporte local+atracoes num orcamento realista da viagem inteira. Nao adapta o orcamento ao estilo do viajante nem projeta gasto diario. O usuario tem que abrir planilha por fora - exatamente a dor que um app de custo total realista resolve. |
| **Comparação** | Compara FORNECEDORES dentro de um destino/rota (qual OTA, qual voo), mas nao compara DESTINOS entre si. Nao responde 'para meu orcamento e perfil, Peru ou Tailandia rende mais?'. Falta a camada de decisao de destino por custo-beneficio, clima, seguranca, esforco logistico e fit com o viajante - so atende quem ja sabe para onde vai. |
| **Integração** | Integracao assimetrica e fechada para quem planeja. Oferece API so de parceiro para hoteis/OTAs (Travel Partner/Transport API), sem API publica de voos e sem programa de afiliados. Nao da para um app de planejamento puxar dados oficiais nem ganhar comissao mandando trafego ao Google. A integracao viavel e por deep link (abrir google.com/travel pre-preenchido) ou raspagem via SerpApi - util para co |

## 20. Oportunidades para superá-lo
- Fechar a lacuna do CUSTO TOTAL: somar voo+hotel+comida+transporte+atracoes num orcamento realista - algo que o Google nunca entrega
- Comparar DESTINOS por custo-beneficio e fit de perfil (Peru vs Tailandia), nao so fornecedores dentro de um destino
- Super-perfil persistente do viajante que o Google nao mantem - personalizacao real entre sessoes
- Roteiro dia-a-dia logisticamente otimizado (proximidade, tempos de traslado, ritmo, horarios) - resolver onde o AI Mode entrega so lista
- IA de DECISAO com trade-offs (custo x tempo x experiencia) vs IA de sugestao reativa do Gemini
- Transparencia de custo final e curadoria honesta - evitar o 'preco que muda no checkout' que frustra no Google
- Cobrir low-cost/regionais e nichos que o Google sub-representa
- Monetizar exatamente onde o Google nao deixa: ser a camada de planejamento que envia o lead ja decidido para OTAs/cias via afiliado (Booking, Skyscanner, Trip.com) - capturando a comissao downstream que o Google so coleta como Ads

---

## Matriz (visão Mundo Sem Fim)
| Critério | Avaliação |
|---|---|
| Força principal | Distribuicao e confianca massivas: e o ponto de partida default de busca de viagem (embutido na Busca, Maps, Gmail, Android e Gemini), gratuito, com a melhor UX de busca de voo do mercado. |
| Fraqueza principal | E busca/comparacao, nao decisao: trata voo/hotel/atracoes como silos, nao entrega custo total nem roteiro executavel, nao mantem perfil do viajante e sempre joga o usuario para fora para comprar (com preco que as vezes muda). |
| Modelo de receita | Publicidade: Hotel Ads em leilao (hoje majoritariamente CPC, ~US$2,12 benchmark travel; CPA/commission-per-stay residual apos sunset do commission bidding em 2025) + Search Ads. Free Booking Links e Google Flights sao gratuitos/isca. Nao comissiona publishers. |
| Possui API? | Parcial - so de parceiro e so para hoteis (Travel Partner API, OAuth2, aprovacao manual 2-6 semanas). Sem API publica de voos e sem API de afiliado para terceiros. |
| Possui afiliados? | Nao - inexistente para quem manda trafego ao Google. O fluxo de comissao e inverso (OTAs/cias pagam o Google via Ads). Para monetizar, nosso app usa afiliados das OTAs que o Google lista (Skyscanner ~20%, Trip.com 1-5%, Booking via rede ~25-40% da comissao). |
| Pode virar parceiro? | Sim, mas limitado: so como anunciante/connectivity partner de inventario PROPRIO no Hotel Center, ou consumindo dados via SerpApi/deep link. Nao ha parceria que pague comissao a um app de planejamento - entao a 'parceria' real e tecnica (conferir preco), nao de receita. |
| Pode pagar comissão? | Nao para nos. O Google nao remunera trafego recebido. Comissao so flui das OTAs/cias finais; portanto montamos receita capturando o lead decidido e enviando via afiliado para essas OTAs - nao para o Google. |
| Pode receber tráfego? | Sim, mas dificil e indireto - o Google e topo de funil concorrente. Podemos captar o trafego que o Google deixa insatisfeito (usuario que precisa de custo total/roteiro/decisao de destino) via SEO/AI Mode e conteudo, posicionando-nos como a camada de DECISAO acima da busca dele. |
| Pode ser integrado? | Parcial - via deep link (abrir google.com/travel pre-preenchido para conferencia de preco) e via Travel Partner API so se tivermos inventario de hotel proprio; dados de voo so por scraping (SerpApi). Nao integravel como fonte oficial de afiliado. |
| **O que precisamos ter p/ superar** | UX de busca de voo/hotel tao rapida e confiavel quanto a do Google (calendario de precos, alertas, historico, garantia/transparencia de preco) E acuracia de preco - mas embrulhada numa camada que o Google nao tem: custo total realista, comparacao de destinos, super-perfil do viajante e roteiro dia-a-dia otimizado. Precisamos ser a camada de DECISAO que termina no deep link de compra afiliado, capt |

## Fontes consultadas
- https://support.google.com/google-ads/answer/9695951 (About commissions per stay for hotel ads)
- https://ppcchief.com/google-ads-benchmarks/travel (benchmark travel CPC 2026 ~US$2,12)
- https://www.mews.com/en/blog/google-hotel-ads-guide (CPC vs commission, sunset do commission bidding 2024-2025)
- https://developers.google.com/hotels/hotel-prices/api-reference/rest (Travel Partner API REST)
- https://developers.google.com/hotels/hotel-prices/dev-guide/api-auth (OAuth2, API restrita a parceiros)
- https://developers.google.com/hotels/hotel-prices/dev-guide/ari-overview (mensagens ARI OTA_Hotel*)
- https://www.oneclickitsolution.com/blog/google-hotel-api (guia hoteleiros 2026, aprovacao 2-6 semanas, Free Booking Links vs Hotel Ads)
- https://www.travelpayouts.com/blog/does-google-flights-have-an-affiliate-program/ (Google Flights NAO tem afiliados; alternativas Skyscanner ~20%, Kiwi 3%, Trip.com 1-5%)
- https://blog.google/products-and-platforms/products/travel/more-choice-travelers-free-hotel-booking-links/ (Free Booking Links gratuitos)
- https://support.google.com/hotelprices/answer/16597854 (mudancas em thresholds de acuracia de preco)
- https://ppcnewsfeed.com/ppc-news/2025-09/google-targets-inaccurate-hotel-prices-with-new-enforcement-policy/ (enforcement de acuracia set/2025)
- https://en.roiback.com/rb-academy/new-way-to-report-fraudulent-prices-from-other-distributors-on-google-hotel-ads (gaming de tarifas por OTAs)
- https://skift.com/2025/03/12/southwest-didnt-get-the-gains-it-expected-from-expedia-and-google-flights/ (Southwest: ganhos abaixo do esperado, bags fly free mal comunicado)
- https://thriftytraveler.com/guides/google-flights/southwest-fares-now-appear/ (Southwest no Google Flights e limitacoes)
- https://techcrunch.com/2025/03/27/google-rolls-out-new-vacation-planning-features-to-search-maps-and-gemini/ (AI Mode/Gemini: itinerarios na Busca/Maps/Gemini, export Docs/Gmail)
- https://gemini.google/discover/ai-trip-planner/ (Gemini como AI trip planner conectado ao Google Flights)
- https://www.nerdwallet.com/travel/learn/google-flights-guide (Google Flights nao vende, redireciona; sem fee)
