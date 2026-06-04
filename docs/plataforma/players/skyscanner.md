# Skyscanner

> **Categoria:** Metabusca de voos (flight metasearch / agregador de viagens) — tambem hoteis e aluguel de carros
> _Perfil gerado por pesquisa multiagente (jun/2026). Parte do [Relatório de Mercado](../01-relatorio-de-mercado.md) e da [Matriz Competitiva](../02-matriz-competitiva.md)._

## 1. O que faz
Skyscanner e um metabuscador global de viagens: agrega e compara precos de voos (e tambem hoteis e aluguel de carros) de mais de 1.200 parceiros de suprimento — companhias aereas e agencias online (OTAs) — em uma unica busca. Nao vende nem processa a passagem: encontra a tarifa mais barata e redireciona o usuario por deep-link para o site da aerea ou OTA, que faz a venda. E controlada pelo Trip.com Group (ex-Ctrip) desde 2016 e faturou ~389,9 milhoes de libras (~US$490M) em 2025.

## 2. Público-alvo
Viajantes de lazer sensiveis a preco e cacadores de promocao no mundo todo (forte na Europa, UK, APAC e mercados emergentes), que buscam a tarifa mais barata e/ou destinos baratos com datas flexiveis. Tambem serve B2B: agencias, OTAs e portais de viagem que licenciam a Travel API. Recursos como "Em qualquer lugar" e mapa de precos atraem o publico de inspiracao/budget travel.

## 3. Funcionalidades principais
- Metabusca de voos comparando 1.200+ aereas e OTAs com deep-link de redirecionamento
- Busca exploratoria 'Everywhere/Em qualquer lugar' — destino mais barato a partir da sua cidade
- Mes inteiro / datas flexiveis e 'Toda a parte' por mapa de precos
- Price alerts (alertas de variacao de preco por rota/data)
- Comparacao de hoteis e aluguel de carros
- Filtros por escalas, duracao, bagagem, horario, companhia, aeroportos
- Selo de transparencia de preco e aviso de 'Self-transfer' (conexao autogerida)
- Apps iOS/Android e versao web multi-idioma/multi-moeda
- Calendario de melhor epoca para viajar e tendencia de preco (subir/cair)
- Travel/Affiliate API e widgets para parceiros B2B

## 4. Como monetiza
- CPC (cost-per-click): a maior parte da receita — aereas e OTAs pagam por clique de saida quando o usuario e redirecionado ao site delas
- CPA / comissao de referencia (cost-per-acquisition): paga quando o clique vira reserva no parceiro
- Publicidade display e colocacoes patrocinadas (sponsored listings) na pagina de resultados
- Taxas/licenciamento da Travel API e widgets para parceiros B2B
- Receita de referencia de seguro-viagem e servicos auxiliares
- Modelo asset-light: nao tem estoque nem processa pagamento — monetiza o PARCEIRO, nao cobra do usuario

## 5. Afiliados
SIM. Programa proprio gerido pela rede Impact.com (impact.com) — nao usa Awin/CJ/Partnerize nem (oficialmente) Travelpayouts para o afiliado direto. Comissao = percentual da comissao que a propria Skyscanner recebe do parceiro de suprimento (base citada ~20%, com estrutura flexivel por performance, ate ~50% em casos). Em valores absolutos os payouts sao baixos: ~GBP 0,07-0,30 por voo, ~GBP 0,30-0,40 por aluguel de carro e ~GBP 1 por hotel. Cookie de 30 dias; pagamento via Impact a partir de US$10. Exige site com 5.000+ visitantes unicos/mes, HTTPS e conteudo de viagem relevante. Ha tambem o Skyscanner Creator Programme (criadores com 1.000+ seguidores).

## 6. API
SIM, porem SOMENTE para PARCEIROS (application-only, nao self-serve/publica). Duas frentes: (1) Travel API (Flights/Hotels/Car Hire) com endpoints Live Prices (tempo real) e Indicative Prices (cache para SEO/browse), mais Autosuggest, Geo, Culture, Carriers; (2) Affiliates Link API (referrals) — gera deep-links para paginas da Skyscanner. Modelo de booking: APENAS redirect/deep-link — a API NAO permite reserva direta (no checkout no parceiro). Nao ha mencao a conectividade NDC ou GDS na documentacao publica. Aprovacao caso a caso ('empresa estabelecida com grande audiencia'), resposta em ~2 semanas; autenticacao por API key. Dados sao mistos realtime + cache.

## 7. Programa de parceiros
Skyscanner Partners (partners.skyscanner.net), com trilhas distintas por tamanho/uso: (a) Affiliate Programme via Impact.com — widgets de busca, banners e text links, para sites com 5.000+ visitas/mes; (b) Travel API — para empresas estabelecidas com grande audiencia que querem integrar busca propria e ganhar comissao; (c) Affiliates Link API — redirects programaticos; (d) Skyscanner Creator Programme — criadores de conteudo (TikTok/IG/YouTube/blog) com 1.000+ seguidores. Suporte e onboarding via Zendesk (skyscannerpartnersupport).

## 8. Dados que oferece
- Tarifas/precos de voo em tempo real (Live Prices) de 1.200+ parceiros
- Precos indicativos/cacheados por rota para SEO e paginas de browse
- Itinerarios completos: rotas, escalas, multi-trecho, datas flexiveis
- Deep-links de redirect para aerea/OTA (Affiliates Link API)
- Precos, imagens, amenidades, categoria (estrelas) e politica de cancelamento de hoteis
- Categorias de carro, fornecedores, politica de combustivel, one-way (car hire)
- Autosuggest de lugares, dados geograficos (Geo), companhias (Carriers), cultura/moeda
- Tendencia/indicacao de preco (subir/cair) e melhor epoca por rota

## 9. Dados que NÃO oferece
- Roteiro de viagem dia a dia / itinerario montado (nao e planejador)
- Custo TOTAL realista da viagem (so a passagem/hotel/carro isolados — sem somar comida, transporte local, passeios, cambio real)
- Reserva e pagamento dentro do produto (so redireciona; nao ha booking via API)
- Recomendacao personalizada por perfil/super-perfil do viajante
- Comparacao de DESTINOS por adequacao (so por preco de voo, nao por clima/seguranca/vibe/orcamento total)
- Conteudo de experiencias, atracoes, restaurantes ou 'o que fazer' no destino
- Conectividade NDC/GDS e tarifas negociadas/corporativas (nao documentado)
- Disponibilidade/preco GARANTIDO no checkout — o preco final e do parceiro e pode mudar
- Visao consolidada pos-compra (a reserva vive no parceiro, nao na Skyscanner)

## 10. Pontos fortes
- Marca global lider em metabusca de voos, com enorme trafego organico e reconhecimento
- Cobertura amplissima: 1.200+ parceiros, busca multi-moeda/idioma no mundo todo
- Modelo asset-light altamente escalavel e lucrativo (~24% de margem EBIT, ~US$490M receita 2025)
- Busca exploratoria unica ('Everywhere' + mapa de precos + mes inteiro) otima para inspiracao
- Lastro do Trip.com Group (acesso a inventario e capital)
- API e programa de parceiros maduros (Live/Indicative/Referrals) com 1.200+ supply partners
- Gratuito para o usuario e neutro entre parceiros (compara tudo num lugar)
- Price alerts e tendencia de preco que ajudam timing de compra

## 11. Pontos fracos
- Nao fecha a venda: so redireciona — preco mostrado frequentemente NAO e honrado no parceiro (bait-and-switch percebido)
- Depende de OTAs de ma reputacao (MyTrip, GotoGate, Kiwi) que pagam pra aparecer; usuario cai em agencia ruim
- Sem suporte real ao usuario final pos-redirect (problema vira do parceiro; Skyscanner se isenta)
- Para no preco do voo: nao calcula custo total nem ajuda a DECIDIR a viagem
- Comissao por afiliado em valores absolutos muito baixa (centavos por voo)
- API application-only, sem booking direto e sem NDC/GDS documentado — integracao limitada
- Combinacoes 'self-transfer' arriscadas e nem sempre claramente sinalizadas; algumas opcoes melhores nao aparecem
- Experiencia cada vez mais 'leiloada' a anunciantes; ordenacao influenciada por quem paga (CPC)

## 12. Reclamações comuns dos usuários
- Preco anunciado dobra/triplica ao clicar e ir pro parceiro — sensacao de isca ('bait price') recorrente
- Cair em OTAs problematicas (MyTrip/GotoGate) com pesadelo de cancelamento e reembolso que nao chega
- Tarifa 'mais barata via terceiros' que sai muito mais cara (ex.: 2o trecho ate 6x o previsto)
- Falta de atendimento: 'quase impossivel falar com alguem', so e-mails no-reply; resolucao baixa (ProductReview ~1,8 estrela, ~19% resolvido)
- Excesso de notificacoes de price alert (dispara por variacao de US$1)
- Algumas opcoes/aereas nao aparecem (scraping bloqueado) ou faltam tarifas como Ryanair 'Priority + 2 malas'
- Self-transfer vendido sem deixar claro o risco de perder conexao/bagagem
- Discrepancia de preco vs site da propria aerea (as vezes mais caro que comprar direto)

## 13–19. Limitações
| Eixo | Limitação |
|---|---|
| **UX** | UX competente em busca, mas a jornada quebra no momento da verdade: o redirect joga o usuario num site de terceiros com layout, preco e regras diferentes — gerando atrito e a percepcao de 'isca'. A pagina de resultados e cada vez mais carregada de colocacoes patrocinadas/CPC, e o app bombardeia com notificacoes de variacao minima de preco. Nao ha continuidade pos-clique (a reserva some pra fora do |
| **Personalização** | Praticamente nula em nivel de perfil. Skyscanner trata todos os usuarios igual: nao constroi um 'super-perfil' (estilo de viagem, tolerancia a escala, orcamento, com quem viaja, preferencias) nem adapta os resultados a isso. A personalizacao se resume a filtros manuais e historico/alertas. Decide por preco, nao por adequacao ao viajante. |
| **IA** | Foco em busca e ranking por preco, nao em IA generativa de planejamento. Mesmo com features de tendencia de preco e alguns experimentos de descoberta, nao entrega um assistente conversacional que monta viagem, justifica trade-offs ou raciocina sobre o contexto do usuario. Nao gera roteiro, nao explica 'por que este destino pra voce'. A 'inteligencia' e estatistica de preco, nao copiloto de decisao |
| **Roteirização** | Inexistente. Skyscanner nao monta roteiro dia a dia, nao sequencia destinos, nao sugere quantos dias em cada lugar nem encadeia voos+hospedagem+passeios num plano. Resolve um trecho (origem-destino) por vez. Nao ha qualquer camada de 'o que fazer', logistica interna ou otimizacao de itinerario multi-cidade como produto de planejamento. |
| **Orçamento** | So mostra o preco isolado do voo (ou hotel/carro), nunca o CUSTO TOTAL realista da viagem. Nao soma alimentacao, transporte local, atracoes, seguro, cambio real, gorjetas ou variacao por temporada. O usuario fica sem saber 'quanto a viagem inteira vai custar de verdade' — e exatamente a lacuna que um app de custo total resolve. |
| **Comparação** | Compara PRECOS de voo entre fornecedores, mas NAO compara DESTINOS por adequacao. O 'Everywhere' ordena por tarifa mais barata, ignorando clima na data, seguranca, vibe, custo de vida no destino, distancia/jet lag ou fit com o perfil. Falta a comparacao decisoria 'Peru vs Tailandia pra MIM, neste mes, com este orcamento e este estilo'. |
| **Integração** | A integracao e poderosa em escala, mas limitada em profundidade: API application-only (aprovacao caso a caso, exige grande audiencia), SEM reserva direta — apenas deep-link/redirect — e sem NDC/GDS documentado. Para um parceiro, isso significa que da pra puxar precos e mandar trafego, mas nao da pra completar o booking nem capturar a transacao dentro do proprio produto. O afiliado paga centavos po |

## 20. Oportunidades para superá-lo
- Resolver a DECISAO, nao so a busca: roteiro IA + custo total realista + comparacao de destinos por adequacao (onde Skyscanner para no preco do voo)
- Mostrar custo TOTAL da viagem (voo+hotel+comida+transporte+passeios+cambio) — diferencial direto contra o 'so a passagem'
- Super-perfil do viajante personalizando recomendacoes (estilo, orcamento, tolerancia a escala) — algo que Skyscanner nao faz
- Comparar DESTINOS ('Peru vs Tailandia pra mim neste mes/orcamento'), nao apenas listar o voo mais barato
- Eliminar a frustracao de 'preco que nao se confirma' deixando claro o custo realista e usando o redirect deles so na hora certa
- Curar/filtrar OTAs ruins (MyTrip/GotoGate) e priorizar fornecedores confiaveis — proteger a confianca que a Skyscanner perde
- Continuidade pos-decisao: salvar o plano, acompanhar a viagem e dar suporte — preenchendo o vazio pos-redirect deles
- Usar a forca da Skyscanner (inventario amplo de voos) via afiliado e focar nossa diferenciacao no planejamento

---

## Matriz (visão Mundo Sem Fim)
| Critério | Avaliação |
|---|---|
| Força principal | Maior inventario e marca de metabusca de voos do mundo (1.200+ parceiros), trafego gigante e modelo asset-light lucrativo — e a referencia em 'achar o voo mais barato'. |
| Fraqueza principal | Para no PRECO DO VOO e so redireciona: nao decide a viagem, nao da custo total, nao personaliza e perde a confianca quando o preco nao se confirma no parceiro. |
| Modelo de receita | CPC (clique de saida) como base + CPA/comissao de referencia + sponsored listings/ads + licenca da Travel API + referencia de seguro. Monetiza o parceiro, nao o usuario (asset-light). |
| Possui API? | Sim, mas parcial: Travel API (Live/Indicative) + Affiliates Link API, application-only, SEM booking direto e sem NDC/GDS documentado — so deep-link/redirect. |
| Possui afiliados? | Sim — programa proprio via Impact.com; ~20% da comissao que a Skyscanner ganha (payout absoluto baixo: ~GBP 0,07-0,30/voo), cookie 30 dias, minimo 5.000 visitas/mes. |
| Pode virar parceiro? | Sim. Via Affiliate Programme (Impact.com) e/ou Travel API/Affiliates Link API. Como parceiro B2B, podemos puxar precos de voo deles e/ou mandar trafego para a Skyscanner e ganhar comissao. |
| Pode pagar comissão? | Sim — paga comissao a nos como afiliado (percentual da comissao dele, valores baixos por voo). Tambem possivel ganhar via Travel API redirecionando trafego nosso pra dentro do funil deles. |
| Pode receber tráfego? | Sim. E um destino natural de checkout: nosso app decide a viagem (roteiro/custo/destino) e manda o usuario para a Skyscanner fechar o voo, monetizando via afiliado/deep-link. |
| Pode ser integrado? | Parcial. Via API de parceiro (aprovacao caso a caso) para precos/Live Prices e via Affiliates Link API para deep-links. Integracao de PRECO e REDIRECT sim; de RESERVA dentro do nosso app, nao. |
| **O que precisamos ter p/ superar** | Cobertura/freshness de precos de voo comparavel (idealmente via API/afiliado da propria Skyscanner ou agregadores tipo Kiwi/Duffel/Travelpayouts), busca exploratoria por destino, alertas de preco, multi-moeda/idioma e deep-links confiaveis — para igualar o que ele faz bem (achar voo barato) enquanto entregamos o que ele nao faz: decidir e planejar a viagem. |

## Fontes consultadas
- https://www.partners.skyscanner.net/product/affiliates
- https://www.partners.skyscanner.net/product/travel-api
- https://developers.skyscanner.net/docs/intro
- https://developers.skyscanner.net/docs/referrals/overview
- https://skyscannerpartnersupport.zendesk.com/hc/en-us/categories/4524560891549-Affiliate-Flights-API
- https://www.partners.skyscanner.net/skyscanner-creator-programme
- https://www.travelpayouts.com/blog/skyscanner-flight-affiliate-program/
- https://www.creator-hero.com/blog/skyscanner-affiliate-program-in-depth-review-pros-and-cons
- https://productmint.com/skyscanner-business-model-how-does-skyscanner-make-money/
- https://fourweekmba.com/how-does-skyscanner-make-money/
- https://miracuves.com/blog/skyscanner-revenue-model/
- https://www.trustpilot.com/review/www.skyscanner.net
- https://www.productreview.com.au/listings/skyscanner
- https://www.complaintsboard.com/skyscanner-b124717
- https://www.tripadvisor.com/ShowTopic-g1-i10702-k11139049-o10-Skyscanner_Prices_completely_different_prices_to_airline-Air_Travel.html
- https://justuseapp.com/en/app/415458524/skyscanner-travel-deals/reviews
- https://www.realjourneytravels.com/gotogate-vs-mytrip-com/
