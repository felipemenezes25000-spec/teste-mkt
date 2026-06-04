# Trivago

> **Categoria:** Metabusca de hoteis (hotel metasearch / comparador de precos de hospedagem)
> _Perfil gerado por pesquisa multiagente (jun/2026). Parte do [Relatório de Mercado](../01-relatorio-de-mercado.md) e da [Matriz Competitiva](../02-matriz-competitiva.md)._

## 1. O que faz
Trivago e um comparador (metabusca) global de hoteis: o usuario digita destino e datas, e a plataforma compara precos do MESMO hotel em dezenas de OTAs e sites de marca (Booking.com, Expedia, Hotels.com, Agoda, sites proprios dos hoteis) e mostra qual canal esta mais barato. Trivago NAO processa a reserva nem cobra o cartao: ele faz o "click-out", redirecionando o usuario para o site parceiro, que finaliza a transacao. E uma empresa de capital aberto (Trivago N.V., Nasdaq: TRVG), sediada em Dusseldorf (Alemanha) e controlada pela Expedia Group (59,4% economico / 84,0% de voto em 2025).

## 2. Público-alvo
Viajantes de lazer e a negocios que ja decidiram o DESTINO e a DATA e querem achar o melhor preco do hotel especifico (estagio de "comparacao de preco/conversao", nao de inspiracao). Forte em buscadores deal-hunters sensiveis a preco. Do lado B2B: hoteis independentes e cadeias (via Rate Connect) e OTAs/agencias que querem comprar trafego qualificado de fundo de funil. Base global, com forca historica na Europa (DACH), Americas e Asia-Pacifico.

## 3. Funcionalidades principais
- Busca e comparacao de precos do mesmo hotel em multiplos OTAs/sites de marca em tempo real
- Filtros (preco, estrelas, avaliacao, distancia, comodidades, tipo de propriedade)
- Mapa com pins de hoteis e precos
- Agregacao de notas/reviews de varias fontes (score de reputacao)
- 'Rate Connect' / 'Express Booking' permitindo hoteis colocarem precos diretos e ate finalizar em ambiente trivago em alguns casos
- Alertas e ofertas destacadas ('Top Offer' / 'Best Price')
- App iOS/Android e site web responsivo
- Comparacao tambem de outras hospedagens (apartamentos, casas) agregadas dos parceiros
- Trivago Business Studio (painel gratuito para hoteleiros gerirem perfil, fotos e a campanha)

## 4. Como monetiza
- Receita de referencia (referral) e ~97% do faturamento: EUR 532,9 mi em 2025 (+17% a/a); receita total ~EUR 548,9 mi, EBITDA ajustado ~EUR 15,8 mi (virada de prejuizo)
- Historicamente CPC (custo por clique) em leilao: hoteis/OTAs pagavam ~US$1,20 a US$4,20 por click-out; CPC chegou a representar ~95% do turnover
- MUDANCA-CHAVE 2025/2026: em 1/set/2025 o Rate Connect aposentou o CPC e migrou para modelo SO CPA (comissao por reserva concretizada). Net CPA minimo global de 10%, com tiers tipicos de ~12% a 25% de comissao; quanto maior o lance %, maior o share de impressao
- CPA so cobra apos estadia concretizada (nao cobra clique nem reserva cancelada) - conversao reportada +32% maior que no CPC
- Anuncios/colocacao patrocinada (CPM) e posicoes de destaque regionais
- Assinatura/servicos pagos para hoteleiros (ferramentas premium)
- Os grandes anunciantes Booking Holdings e Expedia Group concentram parcela enorme da receita de referral (risco de concentracao)

## 5. Afiliados
Sim, tem programa de afiliados, operado via redes terceiras (nao e in-house puro). Principais: Awin (perfis separados por pais - ex. Trivago USA, UK, CO) e Travelpayouts; tambem aparece em FlexOffers. O afiliado recebe uma FATIA da comissao/receita que o trivago gera (porque o trivago so ganha no click-out/CPA, o afiliado ganha sobre isso, nao sobre a reserva final). Numeros tipicos citados: via Travelpayouts ~40% do que o trivago fatura no clique, com cookie de 30 dias. Comissao efetiva por usuario tende a ser baixa em valor absoluto porque e fatia-de-fatia.

## 6. API
Tem API, mas e API de PARCEIRO/CONECTIVIDADE (B2B para advertisers), NAO uma API publica de busca/booking para apps de terceiros. Pilares: (1) trivago FastConnect - conecta o booking engine/PMS do hotel ou OTA ao trivago para enviar precos e disponibilidade em tempo real (precisa de alinhamento/instrucao do trivago antes de implementar); (2) Conversion Tracking API - obriga o advertiser a integrar e gravar o 'trv_reference' em cookie first-party por 30 dias para atribuir bookings induzidos pelo trivago (essencial no modelo CPA). NAO ha GDS/NDC proprio nem API publica que permita um app externo consumir o inventario do trivago para vender hoteis; integracao de fora se da por afiliado (deeplink/widget das redes).

## 7. Programa de parceiros
Dois trilhos. B2B advertiser: 'Rate Connect' + 'Business Studio' para hoteis colocarem precos e comprarem trafego (agora 100% CPA, Net CPA min. 10%, tiers ~12-25%); conectividade tecnica via FastConnect e parceiros certificados (Bookassist, RoomCloud, Seekda, Mirai, Paraty, Roiback etc.) que intermediam a conexao. Afiliado/publisher: via Awin/Travelpayouts/FlexOffers com banners, widgets de busca e deeplinks rastreados. Para um app de planejamento, o caminho realista de monetizacao e o trilho de afiliado (deeplink/widget), nao o FastConnect (que e para quem TEM inventario de hotel).

## 8. Dados que oferece
- Precos do mesmo hotel em multiplos canais/OTAs (comparacao lado a lado)
- Disponibilidade por data informada
- Score de avaliacao agregado de varias fontes + contagem de reviews
- Atributos do hotel (estrelas, comodidades, fotos, tipo de propriedade)
- Geolocalizacao/distancia de pontos de interesse e mapa
- Indicacao de qual canal esta mais barato / deeplink de saida para o parceiro

## 9. Dados que NÃO oferece
- Custo TOTAL realista da viagem (voo + hospedagem + transporte local + alimentacao + passeios) - so cobre hospedagem
- Roteiro / itinerario dia a dia
- Comparacao entre DESTINOS (so compara precos dentro de um mesmo destino/hotel)
- Voos, carros, atividades e experiencias como produto proprio (foco quase puro em hotel)
- Perfil persistente do viajante / recomendacao personalizada por gosto
- Recomendacao de QUANDO ir ou PARA ONDE ir com base em orcamento e perfil
- Conteudo editorial de inspiracao/destino aprofundado
- Reserva e atendimento pos-venda (terceiriza 100% ao OTA/hotel)

## 10. Pontos fortes
- Marca extremamente reconhecida globalmente (a famosa propaganda 'trivago guy'), top-of-mind em comparacao de hotel
- Cobertura ampla de OTAs e sites de marca = boa chance de achar o canal mais barato para um hotel especifico
- Modelo CPA novo (2025) reduz risco para hoteis (so paga apos estadia), tende a atrair mais inventario direto de hoteis
- Respaldo financeiro e tecnico da Expedia Group (controladora)
- Agregacao de reviews multifonte ajuda decisao rapida
- Forte no fundo de funil: captura intencao de compra ja qualificada (otimo para quem MANDA trafego e quer conversao)
- Infra madura de conectividade (FastConnect) e atribuicao (Conversion API)

## 11. Pontos fracos
- Escopo estreito: so hotel/hospedagem - nao resolve a viagem inteira (voo, roteiro, orcamento total)
- Conflito de interesse historico: ordenacao influenciada por quem paga mais (CPC/CPA), nao necessariamente pelo menor preco - gerou multa milionaria na Australia
- 'Top Offer'/'Best Price' nem sempre e o mais barato real, minando a confianca
- Precos de preview as vezes sem taxas/impostos, gerando surpresa no checkout
- Dependencia critica de 2 clientes (Booking Holdings e Expedia) - risco de receita e de neutralidade
- Zero personalizacao real por perfil; experiencia generica de busca
- Pos-venda inexistente do lado trivago (joga o problema para o parceiro)
- Migracao para CPA-only pode reduzir participacao de hoteis menores que nao conseguem bancar 18%+ de comissao, empobrecendo a comparacao

## 12. Reclamações comuns dos usuários
- Preco mostrado no trivago maior/diferente do preco real no proprio provedor ('checei e estava mais barato direto no site')
- Quarto/tarifa selecionada nao 'passa' para o site de booking apos o click-out (some ou muda)
- Chegada ao hotel sem registro da reserva apesar de email de confirmacao (problema do parceiro, mas o usuario culpa o trivago)
- Taxas/depositos ocultos nao informados no trivago
- Cobranca no cartao e depois cancelamento, com respostas automaticas/canned do suporte
- Sensacao de nao saber se ve a melhor oferta da internet ou so a melhor para o trivago
- Suporte limitado: trivago se exime e manda resolver com o provedor final
- Historico de publicidade enganosa (caso ACCC) ainda citado em reviews de 2025/2026 como motivo de desconfianca

## 13–19. Limitações
| Eixo | Limitação |
|---|---|
| **UX** | Experiencia e centrada em LISTA DE PRECOS, eficiente mas fria e generica: muitos cards, filtros e leiloes de destaque competindo por atencao. Falta orientacao ('para onde devo ir?', 'isso cabe no meu orcamento total?'). O preview de preco nem sempre traz taxas/impostos, criando atrito e quebra de confianca no checkout. O usuario sai da plataforma (click-out) bem cedo, perdendo a jornada - nao ha c |
| **Personalização** | Praticamente nula. Nao ha super-perfil persistente do viajante (estilo, ritmo, faixa de gasto, com quem viaja, preferencias de bairro/vibe). A ordenacao e movida por lance do anunciante e filtros manuais, nao por adequacao ao gosto da pessoa. Duas pessoas diferentes veem essencialmente o mesmo resultado para a mesma busca. Sem memoria entre sessoes que personalize recomendacoes. |
| **IA** | IA aplicada e rasa do ponto de vista do usuario: foco em ranking/leilao e matching de tarifas, nao em assistente conversacional que entenda 'quero 7 dias relaxantes ate R$8 mil para duas pessoas'. Nao gera recomendacao de destino, nao monta plano, nao raciocina sobre trade-offs de orcamento. Nao ha copiloto de viagem que combine preferencia + restricao financeira + logistica. |
| **Roteirização** | Inexistente. Trivago nao monta itinerario, nao sugere dias, nao encadeia hospedagem com passeios, deslocamentos ou regiao a visitar. Resolve UM ponto isolado (onde dormir e por quanto), nao a sequencia da viagem nem a logica de 'base em X por 3 noites, depois Y por 2'. |
| **Orçamento** | So mostra o custo da HOSPEDAGEM, e mesmo assim as vezes sem taxas no preview. Nao calcula custo TOTAL realista da viagem (voos, transporte local, comida, passeios, seguro, cambio). Nao ajuda a pessoa a saber se a viagem inteira cabe no bolso - apenas se aquele hotel especifico esta barato naquele canal. |
| **Comparação** | A comparacao e PROFUNDA mas ESTREITA: compara canais/precos do MESMO hotel (ou hoteis no mesmo destino), nunca compara DESTINOS entre si ('Lisboa x Bangkok x Cusco para meu orcamento e perfil'). Nao ajuda na decisao de PARA ONDE ir nem QUANDO ir - assume que o usuario ja decidiu tudo e so quer o preco. Alem disso, o ranking sofre vies comercial (quem paga mais aparece melhor), entao a 'melhor' ofe |
| **Integração** | Para um app de planejamento, integracao DIRETA via API e limitada: o FastConnect e para quem tem inventario de hotel (PMS/booking engine) e exige aprovacao/instrucao do trivago; nao ha API publica de busca/booking para consumir o inventario do trivago e vender hoteis dentro do nosso app. O caminho viavel e via AFILIADO (deeplink/widget de Awin/Travelpayouts), o que significa mandar o usuario PARA  |

## 20. Oportunidades para superá-lo
- Resolver a viagem INTEIRA (roteiro + custo total + comparacao de destinos), enquanto o trivago so resolve 'qual canal tem o hotel mais barato'
- Comparar DESTINOS por orcamento e perfil ('cabe R$8 mil? entao Lisboa rende 6 noites, mas Bangkok rende 9') - lacuna total no trivago
- Mostrar custo TOTAL realista (voo+hotel+local+comida+passeios) com taxas incluidas, eliminando a 'surpresa no checkout' que o trivago sofre
- Super-perfil do viajante + IA conversacional que recomenda e planeja, contra a busca generica e impessoal dele
- Confianca/transparencia como diferencial de marca: ser explicitamente neutro e mostrar o preco real com taxas, explorando a reputacao manchada do trivago (caso ACCC, 'nem sempre o mais barato')
- Manter o usuario DENTRO da jornada ate a hora de reservar, e so entao fazer click-out monetizado - capturando o valor de planejamento que o trivago descarta
- Usar o proprio trivago (ou OTAs) como camada de checkout de hotel via deeplink afiliado, ficando com a relacao e os dados do cliente enquanto ele so executa a transacao

---

## Matriz (visão Mundo Sem Fim)
| Critério | Avaliação |
|---|---|
| Força principal | Marca global dominante em comparacao de preco de hotel + cobertura ampla de OTAs no fundo de funil (alta intencao de compra ja qualificada). |
| Fraqueza principal | Escopo estreito (so hotel) e vies comercial no ranking: nao planeja a viagem, nao compara destinos, nao calcula custo total, e nem sempre mostra o preco realmente mais barato. |
| Modelo de receita | Performance/referral: historicamente CPC (US$1,20-4,20/click), agora Rate Connect 100% CPA (Net CPA min. 10%, tiers ~12-25%); ~97% da receita vem de referral. Tambem CPM/destaque e servicos a hoteleiros. |
| Possui API? | Parcial - tem API de PARCEIRO (FastConnect para enviar precos/disponibilidade + Conversion Tracking API para atribuicao), mas NAO tem API publica de busca/booking para apps de terceiros. |
| Possui afiliados? | Sim - via redes terceiras: Awin (perfis por pais) e Travelpayouts (~40% da receita do clique, cookie 30 dias), tambem FlexOffers. Afiliado ganha fatia da comissao do trivago, nao da reserva final. |
| Pode virar parceiro? | Sim, como publisher/afiliado (deeplink/widget Awin/Travelpayouts) para monetizar click-out de hotel. Como advertiser/FastConnect, so faz sentido se tivermos inventario proprio de hotel - nao e o nosso caso. |
| Pode pagar comissão? | Sim, indiretamente: ao mandarmos trafego e o usuario reservar via parceiro do trivago, ganhamos fatia da comissao (modelo CPC/CPA repassado pela rede de afiliados). Valor absoluto por usuario tende a ser baixo (fatia-de-fatia). |
| Pode receber tráfego? | Sim, mas pouco provavel ser relevante: o trivago e fundo de funil e quer reter/click-out para OTAs, nao distribuir trafego para apps de planejamento. Nao ha programa dele que nos mande usuarios. |
| Pode ser integrado? | Parcial - via afiliado/deeplink (mandar usuario para fora e ganhar comissao) e viavel; integracao via API de inventario para vender hotel dentro do nosso app NAO e oferecida publicamente. Alternativa melhor: integrar OTAs/agregadores que tenham API real de booking e usar trivago so como benchmark de |
| **O que precisamos ter p/ superar** | (1) Comparacao de preco de hotel confiavel e com TAXAS INCLUIDAS no preview (resolver a dor #1 do trivago); (2) Cobertura multi-OTA via APIs/afiliados para garantir 'achamos o canal mais barato'; (3) Manter isso DENTRO do nosso fluxo de planejamento (roteiro+orcamento total+comparacao de destinos) em vez de jogar o usuario para fora cedo; (4) Ranking honesto e transparente (sem vies de quem-paga-m |

## Fontes consultadas
- https://www.sec.gov/Archives/edgar/data/0001683825/000168382526000003/exhibit991_q4x2025.htm
- https://www.sec.gov/Archives/edgar/data/0001683825/000168382526000006/trvg-20251231.htm
- https://www.sec.gov/Archives/edgar/data/0001683825/000168382525000033/form6-k2025closingofprojec.htm
- https://developer.trivago.com/
- https://developer.trivago.com/fastconnect/fast-connect-overview.html
- https://developer.trivago.com/conversiontracking/conversion-api.html
- https://www.mirai.com/blog/trivago-launches-its-cpa-or-commissionable-model-what-is-it-and-how-does-it-work/
- https://www.mirai.com/blog/trivago-improves-commissions-programme-net-cpa/
- https://www.paratytech.com/en/news/trivago-says-goodbye-to-cpc-cpa-takes-over.html
- https://en.roiback.com/rb-academy/change-in-the-bidding-model-for-payment-campaigns-on-trivago
- https://go.bookassist.com/en/knowledge/upcoming-changes-to-trivago-cpc-campaigns-faqs
- https://www.seekda.com/en/post/introducing-trivago-net-cpa-support-in-seekda-metasearch/
- https://www.prostay.com/blog/hotel-metasearch-bidding-2026/
- https://www.travelpayouts.com/en/offers/trivago-affiliate-program/
- https://www.travelpayouts.com/blog/trivago-affiliate-program/
- https://ui.awin.com/merchant-profile/66034
- https://getlasso.co/affiliate/trivago/
- https://www.accc.gov.au/media-release/trivago-to-pay-447-million-in-penalties-for-misleading-consumers-over-hotel-room-rates
- https://www.accc.gov.au/media-release/trivago-loses-appeal-after-misleading-consumers-over-hotel-ads
- https://www.trustpilot.com/review/trivago.com
- https://www.consumeraffairs.com/travel/trivago.html
- https://gaiagazer.com/trivago-review/
- https://fourweekmba.com/trivago-business-model/
