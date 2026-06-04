# Google Flights

> **Categoria:** Metabusca de voos (flight metasearch) — camada de descoberta de viagem do Google/Alphabet
> _Perfil gerado por pesquisa multiagente (jun/2026). Parte do [Relatório de Mercado](../01-relatorio-de-mercado.md) e da [Matriz Competitiva](../02-matriz-competitiva.md)._

## 1. O que faz
Google Flights e um metabuscador de voos gratuito que agrega precos e disponibilidade de centenas de companhias aereas, GDS e OTAs, alimentado pela engine ITA Software (QPX) que o Google comprou em 2011. Ele NAO vende passagens: o usuario pesquisa, compara e e redirecionado para o site da cia aerea ou de uma OTA (Expedia, etc.) para concluir a compra. Desde o fim do "Book on Google" (EUA: mar/2023), e puramente metabusca + redirect, com foco em ser a camada de descoberta de viagem do ecossistema Google (Search, Maps, Hoteis, Things to Do).

## 2. Público-alvo
Viajantes de lazer e corporativos do mundo todo que ja sabem (ou quase) para onde querem ir e querem achar a passagem mais barata/conveniente. Forte entre power-users de milhas/pontos e cacadores de deal (que tambem usam o ITA Matrix). Publico massivo e global, captado organicamente via Google Search — quem digita "voos para Lisboa" cai nele.

## 3. Funcionalidades principais
- Busca e comparacao de voos de centenas de cias/OTAs em uma so tela
- Mapa de precos por destino (explorar 'para qualquer lugar' dentro de um orcamento)
- Grafico de historico/tendencia de preco da rota e alertas de preco por e-mail
- Calendario de precos por data flexivel (+/- dias, mes inteiro)
- Filtros por escalas, duracao, cia, horario, bagagem, emissao de CO2
- Price Guarantee / Price Insights ('preco baixo/tipico/alto', badge de melhor momento)
- Selo de emissoes de carbono por voo
- Integracao nativa com Google Hotels e Google Travel (cross-sell de hospedagem)
- ITA Matrix (matrix.itasoftware.com): interface avancada de power-user para montar fares complexas

## 4. Como monetiza
- NAO ganha por comissao direta de booking — desde jan/2020 parou de cobrar cias por referral links no proprio Google Flights
- Monetizacao real e INDIRETA: aluga a atencao via Google Search Ads do vertical viagem (anuncios de cia/OTA/hotel no topo do Search), modelo CPC (~US$2,12 medio no vertical travel) e opcao CPA
- Em abr/2026 o Google consolidou os formatos de anuncio de voos/hoteis/Things to Do em campanhas de Search padrao com AI Max e Travel Feeds (preco, imagem, +20% CTR)
- Monetizacao da camada de dados: comportamento de busca de viagem alimenta o motor de ads e perfilamento da Alphabet
- ITA Software (B2B): licencia a engine QPX para cias e players de viagem como produto enterprise pago

## 5. Afiliados
NAO possui programa de afiliados. Confirmado por multiplas fontes (Travelpayouts, NerdWallet): publishers NAO conseguem ganhar comissao mandando trafego PARA o Google Flights — nao ha rede propria nem em Awin/CJ/Impact/Partnerize/Travelpayouts. Quem quer monetizar trafego de busca de voos via afiliado precisa usar concorrentes: Skyscanner (~20% da receita de marca), Kiwi.com (~3% por booking, cookie 30d), Trip.com (1-5%), Aviasales/WayAway (via Travelpayouts).

## 6. API
Nenhuma API publica. A QPX Express (apelidada de "Google Flights API") foi descontinuada em 10/abr/2018; cobrava US$0,035/query apos 50 gratis. Hoje o acesso a engine so existe via produto enterprise ITA Software (QPX) sob contrato direto, voltado a cias/grandes players com orcamento alto. O ITA Matrix (matrix.itasoftware.com) e uma interface web publica de power-user, mas NAO e API (sem endpoint programatico oficial; scraping viola ToS). Para integracao, terceiros usam GDS, NDC e APIs de booking contratadas (Duffel, Amadeus, Travelpayouts, Kiwi).

## 7. Programa de parceiros
Nao ha programa de parceria aberto para sites de planejamento/afiliados. Para cias e OTAs, "parceria" significa: (a) aparecer nos resultados via feed de dados que o Google ingere de GDS/cias, e (b) anunciar (pagar) via Google Ads/Travel Feeds. Para B2B de tecnologia, a porta e o ITA Software (licenciamento da engine). Nao existe canal oficial para um app de planejamento receber comissao ou trafego rastreavel do Google Flights.

## 8. Dados que oferece
- Preco e disponibilidade de voos por rota/data de centenas de cias e OTAs
- Historico e tendencia de preco da rota (subindo/caindo, preco tipico)
- Calendario e mapa de precos (datas flexiveis, destinos dentro de orcamento)
- Duracao, numero/locais de escalas, cias operadoras, horarios
- Estimativa de emissoes de CO2 por voo
- Cabine/classe basica de bagagem (limitado), link de redirect para o vendedor
- Deeplink para concluir a compra no site da cia/OTA

## 9. Dados que NÃO oferece
- Custo TOTAL real da viagem (so passagem; nao soma hotel, comida, transporte local, passeios)
- Comparacao normalizada de preco-com-bagagem entre cias (bag fees ficam fora do ranking)
- Fares de algumas low-cost (notadamente Southwest nos EUA nao aparece; cobertura irregular de ultrabaratas)
- Tarifas member-only / flash sales logadas exclusivas da cia (~10% dos casos o site da cia sai mais barato)
- Roteiro / itinerario dia-a-dia ou sugestao de o que fazer no destino
- Comparacao de DESTINOS por custo de vida/clima/seguranca/vibe (so compara voos)
- Perfil persistente do viajante (preferencias, estilo, restricoes) cross-trip
- API publica ou link de afiliado rastreavel para terceiros

## 10. Pontos fortes
- Cobertura, velocidade e confiabilidade de dados imbativeis (engine ITA/QPX, lider de mercado)
- Distribuicao gigante e gratuita: integrado ao Google Search/Maps, captura intencao no topo do funil sem custo de aquisicao
- UX de busca limpa, rapida e com ferramentas poderosas (mapa de precos, grafico de tendencia, datas flexiveis)
- Price Insights/Guarantee gera confianca real na decisao de 'comprar agora ou esperar'
- Marca Google = confianca por padrao; neutralidade percebida (nao vende, so compara)
- Gratuito e sem login obrigatorio para a maior parte das funcoes

## 11. Pontos fracos
- Resolve so UMA etapa (achar o voo) — zero planejamento de viagem completa
- Sem custo total da viagem nem orcamento real (passagem isolada engana)
- Buracos de cobertura (Southwest, low-cost) quebram a promessa de 'ver tudo'
- Comparacao nao normaliza bagagem/extras — preco mostrado nem sempre e o que se paga
- Redireciona para OTAs terceiras de qualidade variavel (risco de mau atendimento/fraude fora do controle do Google)
- Zero personalizacao/perfil persistente do viajante; comeca do zero toda busca
- Sem API/afiliado: ecossistema fechado, impossivel monetizar trafego enviado a ele
- Sem suporte ao cliente (Google nao atende pos-venda da passagem)

## 12. Reclamações comuns dos usuários
- 'O preco some no checkout': ~22% dos casos a tarifa menor do Google desaparece ao somar taxas obrigatorias no site do vendedor
- Redirect para OTA gera pesadelo de pos-venda: cobranca estranha, pedido de pagamento suspeito (ex.: e-mail pedindo deposito em conta na Africa do Sul apos booking Delta), sem suporte do Google
- Southwest e varias low-cost nao aparecem — usuario perde opcoes mais baratas
- Nao da pra comparar preco final com bagagem entre cias; basic economy confunde
- Mudancas/cancelamentos viram dor de cabeca quando a compra foi por OTA e nao direto na cia
- Discrepancia entre o que aparece no Google e o que o site da cia mostra (voo 'some' ao clicar)
- Alertas de preco as vezes atrasam ou nao refletem a tarifa real disponivel

## 13–19. Limitações
| Eixo | Limitação |
|---|---|
| **UX** | UX de busca excelente, mas e uma ferramenta transacional de etapa unica: o usuario entra, acha o voo e sai. Nao existe jornada de planejamento — nenhum espaco para salvar uma viagem em construcao, juntar voo + hotel + passeios + orcamento num lugar so, nem retomar de onde parou. Brecha: nossa plataforma pode ser o 'workspace' da viagem inteira, onde o voo e so um card dentro de um plano vivo. |
| **Personalização** | Praticamente nula. Cada busca comeca do zero; nao ha perfil persistente (origem favorita, estilo de viagem, restricoes alimentares/mobilidade, tolerancia a escala, faixa de orcamento, com quem viaja). O 'Google sabe tudo de voce' nao se traduz em recomendacao de viagem personalizada aqui. Brecha: nosso super-perfil do viajante personaliza tudo (destinos, roteiro, voos sugeridos) — algo que o Googl |
| **IA** | Tem inteligencia preditiva de PRECO (Price Insights, 'comprar ou esperar'), mas nao tem IA generativa de PLANEJAMENTO: nao conversa, nao entende 'quero 7 dias relaxantes de praia ate R$8 mil saindo de SP' e devolve um plano. E busca estruturada por filtros, nao assistente. Brecha: nossa IA de roteiro + decisao parte da intencao em linguagem natural e entrega plano completo, nao so uma lista de voo |
| **Roteirização** | Inexistente. Google Flights nao monta itinerario dia-a-dia, nao sugere o que fazer no destino, nao sequencia atividades nem conecta voo com a logistica local. Roteirizacao mora no Google Maps/Things to Do, desconectado da decisao de voo. Brecha: nosso produto une decisao de destino + voo + roteiro IA num fluxo so — o Google obriga o usuario a costurar 3 produtos separados na mao. |
| **Orçamento** | Mostra so o preco da PASSAGEM, nunca o custo TOTAL realista da viagem (hospedagem + alimentacao + transporte local + passeios + seguro). O 'explorar dentro do orcamento' filtra so por valor de voo, o que induz a decisao errada (voo barato para destino caro). Brecha central nossa: orcamento total realista por destino e o coracao da nossa proposta — exatamente o que o Google nao faz. |
| **Comparação** | Compara VOOS muito bem, mas nao compara DESTINOS como decisao de viagem (custo de vida, clima na epoca, seguranca, vibe, distancia, esforco logistico, custo total). E mesmo nos voos, nao normaliza bagagem/extras e tem buracos (Southwest/low-cost). Brecha: nossa comparacao de destinos lado a lado (custo total, clima, perfil) responde 'PARA ONDE vou' — o Google so responde 'qual VOO' depois que voce |
| **Integração** | Ecossistema fechado: sem API publica (QPX morta em 2018), sem programa de afiliados, sem deeplink de parceiro rastreavel. Nao da para integrar oficialmente, embeddar resultados, nem receber/enviar trafego monetizado. ITA Matrix nao tem API e scraping fere ToS. Para um app externo, e uma muralha — so resta link 'cru' nao-comissionavel ou usar agregadores alternativos (Skyscanner/Kiwi/Duffel/Travelp |

## 20. Oportunidades para superá-lo
- Custo TOTAL da viagem, nao so passagem: virar o 'orcamento de verdade' que o Google nao da
- Decisao de DESTINO (comparar para onde ir por custo/clima/vibe) antes do voo — capturar o usuario um passo ANTES do Google Flights
- Roteiro IA + super-perfil: transformar intencao em linguagem natural num plano completo, nao numa lista de filtros
- Cobertura honesta de low-cost e preco-com-bagagem normalizado (resolver o buraco do Southwest e do 'preco some no checkout')
- Ser o workspace persistente da viagem (salvar, evoluir, voltar) em vez de busca descartavel de etapa unica
- Monetizar via afiliado de voos (Skyscanner/Kiwi/Trip.com/Travelpayouts) — algo que o proprio Google Flights nao permite a ninguem, abrindo espaco para nos sermos o agregador-com-comissao que ele nao e

---

## Matriz (visão Mundo Sem Fim)
| Critério | Avaliação |
|---|---|
| Força principal | Dados de voo imbativeis (engine ITA/QPX) + distribuicao gratuita e gigante via Google Search, capturando intencao de viagem no topo do funil sem custo de aquisicao. |
| Fraqueza principal | Resolve so UMA etapa (achar o voo) e e ecossistema fechado: sem custo total, sem destino, sem roteiro, sem personalizacao, sem API e sem afiliado. |
| Modelo de receita | Indireto: Google Search Ads do vertical viagem (CPC ~US$2,12 / opcao CPA, Travel Feeds desde 2026) + camada de dados/atencao alimentando o motor de ads da Alphabet + licenciamento B2B da engine ITA Software. NAO cobra comissao de booking desde 2020. |
| Possui API? | Nao (publica). QPX Express morreu em abr/2018; so resta produto enterprise ITA Software sob contrato. ITA Matrix e UI, nao API. |
| Possui afiliados? | Nao. Sem programa proprio nem em Awin/CJ/Impact/Travelpayouts — confirmado por multiplas fontes. |
| Pode virar parceiro? | Nao de forma util para um app de planejamento. So ha porta para cias/OTAs (anunciar via Google Ads) ou B2B-tech (licenciar ITA). Nenhum canal de comissao/co-distribuicao para nos. |
| Pode pagar comissão? | Nao. Google Flights nao paga comissao a publishers/sites parceiros por trafego enviado a ele. |
| Pode receber tráfego? | Sim, na pratica — da para deeplinkar o usuario ao Google Flights para a etapa de voo. POReM e trafego nao monetizavel (sem afiliado), entao so faz sentido como conveniencia, nao como receita. Melhor mandar para Skyscanner/Kiwi/Trip.com, que pagam comissao. |
| Pode ser integrado? | Nao oficialmente. Sem API/afiliado/deeplink de parceiro. Integracao real da camada de voos deve usar alternativas (Duffel/Amadeus/NDC para booking; Skyscanner/Kiwi/Travelpayouts para metabusca-com-comissao). Google Flights so como referencia de UX e link externo 'cru'. |
| **O que precisamos ter p/ superar** | Para superar o Google naquilo que ele faz bem (achar voo): (1) integrar uma fonte de voos com comissao e cobertura ampla (Skyscanner/Kiwi/Duffel/Travelpayouts) com preco-com-bagagem NORMALIZADO e low-cost inclusas; (2) Price Insights proprio ('comprar ou esperar') sobre essa fonte; (3) mostrar o voo SEMPRE dentro do custo TOTAL da viagem e do roteiro, transformando a busca de voo (commodity do Goo |

## Fontes consultadas
- https://www.foxbusiness.com/money/google-flights-ends-ads-airlines
- https://skift.com/2020/01/22/google-flights-ends-booking-charges-for-airlines-that-paid/
- https://www.travelpayouts.com/blog/does-google-flights-have-an-affiliate-program/
- https://www.travelpayouts.com/blog/google-flights-api/
- https://duffel.com/blog/google-flights-api
- https://www.travolution.com/news/google-to-phase-out-booking-functionality-for-flights-from-this-month/
- https://support.google.com/travel/answer/11583641
- https://www.nerdwallet.com/travel/learn/google-flights-guide
- https://thepointsguy.com/airline/google-flights-guide/
- https://www.going.com/guides/how-to-use-google-flights
- https://www.alibaba.com/product-insights/is-booking-flights-with-google-flights-really-cheaper-than-airline-direct-or-just-misleading.html
- https://www.tripadvisor.com/ShowTopic-g1-i10702-k14564397-Booking_through_Google_Flights-Air_Travel.html
- https://matrix.itasoftware.com/
- https://userguest.com/how-googles-new-travel-feeds-in-search-ads-will-impact-hoteliers-and-how-to-make-the-most-of-them/
- https://www.mightytravels.com/2025/01/7-lesser-known-flight-search-tools-that-outperform-google-flights-in-2025/
