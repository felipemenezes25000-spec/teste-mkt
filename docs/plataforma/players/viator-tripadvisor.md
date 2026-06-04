# Viator (Tripadvisor)

> **Categoria:** Experiencias, tours, atracoes e atividades (OTA de "things to do") - subsidiaria da Tripadvisor
> _Perfil gerado por pesquisa multiagente (jun/2026). Parte do [Relatório de Mercado](../01-relatorio-de-mercado.md) e da [Matriz Competitiva](../02-matriz-competitiva.md)._

## 1. O que faz
Viator e a maior OTA do mundo focada em experiencias: tours, ingressos para atracoes, passeios de barco, day trips, atividades e excursoes. Agrega o inventario de mais de 65.000 operadores locais e lista mais de 300.000 experiencias verificadas em 2.500+ destinos, conectando o viajante ao operador e ficando com uma comissao (take rate) sobre cada reserva. E o motor de monetizacao de "Things to Do" da Tripadvisor, alimentando tambem as paginas de experiencias do proprio Tripadvisor.

## 2. Público-alvo
Dois lados: (1) DEMANDA - viajantes de lazer (forte no publico norte-americano e anglofono) que ja escolheram o destino e querem reservar o que fazer la, com decisao muito orientada a reviews; (2) OFERTA/B2B - operadores de tours e atracoes que querem distribuicao, e milhares de parceiros de distribuicao (4.000+ "demand partners": blogs, OTAs, agencias, apps, hoteis, companhias aereas) que revendem o inventario via API/afiliado.

## 3. Funcionalidades principais
- Busca e catalogo de 300k+ experiencias por destino com filtros (preco, duracao, categoria, idioma)
- Sistema de reviews e fotos integrado com a base massiva da Tripadvisor (principal ativo de confianca)
- Reserva e emissao de voucher/ingresso (muitas com mobile ticket e skip-the-line)
- Politica de cancelamento gratuito ate 24h antes em grande parte do inventario
- Disponibilidade e precos em tempo real por data/horario
- App iOS/Android com vouchers offline e gestao de reservas
- Programa de fidelidade leve e ofertas/cupons sazonais
- Para operadores: portal de gestao de produto, calendario, programa Accelerate (paga mais comissao por mais visibilidade)
- Para parceiros: API de conteudo + booking, deep links e widgets prontos

## 4. Como monetiza
- Comissao sobre o operador (core): take rate efetivo na faixa dos 'meados de 20%' (mid-20s). Base ~20%, subindo para 25-30% e ate 30-35% efetivos para quem entra no programa Accelerate (pontos extras por ranking/visibilidade)
- Modelo merchant of record: Viator e o vendedor de registro, cobra o viajante, repassa ao operador menos a comissao, paga mensalmente ~21 dias uteis apos o fim do mes de viagem
- Programa Accelerate: operador 'compra' posicao pagando comissao adicional (mecanica tipo leilao de visibilidade)
- Comissao paga a PARCEIROS/afiliados que mandam trafego (custo de aquisicao): ~8% padrao no deep-link, com promocoes ate 10-12%
- Embedded distribution gratis dentro da Tripadvisor (secao Things to Do) - canal de demanda de baixo custo
- Receita de escala: Q2/2025 ~US$ 270M de receita (+11% a/a), GMV anual na casa do bilhao+; e a maior linha de crescimento da Tripadvisor

## 5. Afiliados
SIM, forte. Hoje opera REDE PROPRIA in-house ('Viator Partner Program' / partnerresources.viator.com), self-service, sem exigencia de trafego minimo - aprovacao em minutos se ja tem conta Tripadvisor. Comissao tipica ~8% por reserva concluida (experiencia precisa ser realizada para pagar), com promocoes elevando para 10-12%. Cookie/janela de atribuicao de 30 dias. Pagamento: PayPal semanal sem minimo, ou transferencia bancaria mensal com minimo de US$ 50. Migrou da antiga plataforma de afiliados para o novo 'Partner Platform' proprio; nao esta hospedado em Impact/CJ/Awin/ShareASale/Partnerize hoje (blogs antigos ainda citam CJ por causa de presenca legada, mas o programa oficial atual e proprio).

## 6. API
SIM - Viator Partner API robusta e madura (docs.viator.com/partner-api), uma das melhores do setor de experiencias. Dois tipos: (1) AFILIADO - acesso total a conteudo, mas a venda acontece em viator.com via deep link (comissao ~8%); variantes 'Affiliate' e 'Affiliate (bookings)'/booking access. (2) MERCHANT - parceiro e merchant of record, processa e reserva DENTRO do proprio site (basket/booking sem sair da pagina), com modelo de comissao (vende ao recommendedRetailPrice e recebe %) OU modelo de markup (define markup e e faturado no partnerTotalPrice). Tres niveis de acesso: Basic Access (so conteudo), Full Access (conteudo + disponibilidade/preco em tempo real) e Full + Booking Access (reserva completa, com etapa opcional de booking-hold para reduzir falha de reserva). NAO e GDS nem NDC - e API REST proprietaria de OTA.

## 7. Programa de parceiros
Ecossistema de parceiros amplo e bem estruturado, com Partner Help Center e Resource Center dedicados. Trilhas: 'Travel content' (criadores/blogs via deep link e widgets), 'Travel commerce' (integracao via API afiliado ou merchant), e parceiros de distribuicao corporativos (OTAs, hoteis, cias aereas - 4.000+ demand partners). Onboarding self-service para afiliados; integracoes merchant exigem certificacao tecnica da API. Para operadores existe o lado supplier (cadastro de produto + Accelerate). Forte alavanca da escala Tripadvisor.

## 8. Dados que oferece
- Catalogo completo de experiencias por destino (titulo, descricao, fotos, categorias, duracao, idiomas)
- Precos e disponibilidade em tempo real por data/horario (Full Access)
- Reviews, notas e fotos agregados da Tripadvisor
- Politicas de cancelamento e regras de voucher por produto
- Geolocalizacao/ponto de encontro e mapa do tour
- Deep links e widgets de produto prontos para afiliados
- IDs de produto/destino estaveis para mapeamento
- Capacidade de reserva, hold e emissao de voucher (Full + Booking)

## 9. Dados que NÃO oferece
- Roteiro montado / itinerario multi-dia (so vende experiencias avulsas, nao planeja a viagem)
- Custo TOTAL realista da viagem (nao tem voo, hospedagem, transporte intermunicipal, alimentacao, cambio)
- Comparacao entre DESTINOS (so compara tours dentro de um destino ja escolhido)
- Perfil profundo/persistente do viajante (nao ha 'super-perfil' com preferencias, ritmo, orcamento)
- Voos, hoteis e carros (fora do escopo - so 'things to do')
- Recomendacao de IA conversacional de planejamento ponta a ponta
- Dados de margem/comissao do operador expostos ao consumidor
- Sequenciamento logistico (o que faz sentido fazer em que dia/ordem geografica)

## 10. Pontos fortes
- Maior inventario de experiencias do mundo (300k+ produtos, 65k+ operadores, 2.500+ destinos)
- Ativo de confianca unico: reviews e marca Tripadvisor + distribuicao embutida gratis dentro do Tripadvisor
- API de parceiro madura e flexivel (afiliado E merchant, conteudo+preco+booking+hold) - referencia do setor
- Programa de afiliados acessivel, sem trafego minimo, pagamento PayPal semanal, janela de 30 dias
- Cancelamento gratuito 24h e mobile vouchers reduzem friccao de compra
- Forte no publico norte-americano (audiencia grande e de alto ticket)
- Escala e saude financeira: ~US$ 270M/trimestre, EBITDA crescendo, prioridade estrategica da Tripadvisor
- Onboarding de afiliado rapido (minutos) reaproveitando conta Tripadvisor

## 11. Pontos fracos
- Take rate alto sobre operadores (meados de 20%, ate 30-35% com Accelerate) gera insatisfacao e pressao de preco
- Atendimento ao cliente muito mal avaliado (1.9/5 no PissedConsumer; reclamacoes recorrentes no Trustpilot)
- Modelo de intermediacao: quando da problema, frequentemente 'joga' o cliente de volta para o operador local
- So vende experiencias avulsas - zero planejamento de viagem, roteiro ou orcamento total
- Comissao de afiliado relativamente baixa (~8%) e so paga apos a experiencia ser realizada (ciclo longo de recebimento)
- Quase nao negocia com operadores medios (rigidez comercial)
- Qualidade do inventario variavel (depende do operador; ha casos de tour cancelado por baixa adesao)
- Forte em NA mas menos dominante na Europa que o GetYourGuide; presenca fraca em alguns mercados emergentes

## 12. Reclamações comuns dos usuários
- Reembolsos negados ou que demoram semanas sem explicacao; pedidos de reembolso parcial ignorados
- Atendimento ruim: chamadas caem, live chat 'sempre indisponivel', respostas lentas
- Cobranca dupla e erros de reserva
- Informacao enganosa: taxa de entrada exibida como 'incluida' mas o voucher dizia que estava excluida
- Confusao de voucher: tour remarcado teve preco atualizado mas NAO o horario, fazendo o cliente perder o passeio
- Tickets falsos/invalidos; cliente mandado para telefone do operador na India e Viator alegando nao ser responsavel
- Tours cancelados por baixa adesao, com Viator apenas redirecionando ao operador local
- Falta de ajuda em disputas - sensacao de descaso quando o operador some

## 13–19. Limitações
| Eixo | Limitação |
|---|---|
| **UX** | UX e de e-commerce de catalogo (buscar -> filtrar -> reservar), nao de planejamento. O usuario precisa JA saber o destino e garimpar entre milhares de tours; nao ha jornada guiada de 'o que devo fazer nesta viagem'. Pos-compra a experiencia degrada (vouchers confusos, horarios desatualizados, suporte ausente). Excesso de opcoes semelhantes para a mesma atracao gera paralisia de escolha. |
| **Personalização** | Personalizacao rasa: ordena por popularidade/review e ofertas, mas nao constroi um perfil persistente do viajante (ritmo, interesses, orcamento, com quem viaja, restricoes). Nao adapta sugestoes ao estilo da viagem nem ao roteiro ja montado. Recomendacao e por destino, nao por pessoa. |
| **IA** | Nao tem um copiloto de planejamento por IA conversacional ponta a ponta. A inteligencia se resume a ranking/relevancia e reviews; nao interpreta um pedido tipo 'monte 5 dias em Lisboa com 2 criancas e orcamento X' nem encadeia experiencias num plano coerente. IA generativa de planejamento de viagem e justamente o vazio do produto. |
| **Roteirização** | Inexistente como roteirizador. Vende blocos isolados de experiencia, sem montar itinerario multi-dia, sem sequenciar por dia, sem otimizar deslocamento/geografia, sem encaixar horarios entre atividades. Nao sabe se dois tours comprados conflitam de horario nem se fazem sentido na mesma janela. |
| **Orçamento** | So enxerga o custo das experiencias - ignora o custo TOTAL da viagem (voo, hospedagem, transporte local/intermunicipal, alimentacao, cambio, taxas). Nao oferece visao de 'quanto a viagem inteira vai custar' nem modo orcamento. O cliente nao consegue planejar gasto realista; pior, ja reclamam de taxas 'incluidas' que na pratica eram extras (transparencia de custo fraca). |
| **Comparação** | Nao compara DESTINOS - assume destino ja decidido e so compara tours dentro dele. Nao responde 'Peru x Tailandia para meu perfil e orcamento'. A comparacao existente e produto-vs-produto na mesma cidade, nao decisao de para onde ir. Zero apoio a fase de decisao de destino, que e exatamente o topo do funil que antecede a compra de experiencias. |
| **Integração** | Do lado de quem INTEGRA Viator, e excelente (API afiliado e merchant maduras, deep links, widgets). A limitacao e o inverso: Viator nao se integra a um planejador externo nem importa roteiros - ele quer ser o destino final da compra, nao um componente dentro do plano de outro app. Nao expoe dados de planejamento, so de catalogo/booking. Para o nosso caso isso e bom (da pra plugar), mas significa q |

## 20. Oportunidades para superá-lo
- Ser a CAMADA DE PLANEJAMENTO que falta: montar roteiro multi-dia por IA e injetar tours Viator nos slots certos (Viator vira fornecedor, nos viramos o cerebro)
- Mostrar CUSTO TOTAL realista da viagem (voo+hotel+transporte+comida+experiencias) onde Viator so mostra o preco do tour
- Comparar DESTINOS por perfil e orcamento - o topo de funil que Viator nao toca - e converter para experiencias via afiliado
- Super-perfil persistente do viajante para recomendar a experiencia certa, resolvendo a paralisia de escolha entre tours quase iguais
- Sequenciamento logico (horarios, geografia, ritmo) que evita conflitos - dor real relatada nos vouchers do Viator
- Ganhar confianca no pos-venda/suporte percebido, onde o NPS do Viator e baixissimo (1.9/5)
- Transparencia total de taxas (combater as reclamacoes de 'taxa incluida' que era extra)
- Curadoria qualidade-sobre-quantidade: filtrar os 300k produtos para os poucos que cabem no plano do usuario

---

## Matriz (visão Mundo Sem Fim)
| Critério | Avaliação |
|---|---|
| Força principal | Maior inventario de experiencias do mundo + ativo de confianca da Tripadvisor (reviews) + distribuicao embutida e API de parceiro madura. E o fornecedor de 'o que fazer' mais completo e o mais facil de integrar/monetizar. |
| Fraqueza principal | Zero planejamento: vende experiencias avulsas sem roteiro, sem custo total da viagem, sem comparacao de destinos e sem perfil do viajante - alem de NPS de suporte pessimo (1.9/5). Ele resolve a compra, nao a DECISAO. |
| Modelo de receita | Comissao take-rate sobre operadores (meados de 20%, ate 30-35% com Accelerate) como merchant of record; paga ~8% (ate 10-12% em promo) a afiliados que trazem trafego. Receita ~US$270M/trimestre, principal motor de crescimento da Tripadvisor. |
| Possui API? | Sim - Partner API REST madura, em 2 modos (afiliado deep-link e merchant booking-in-place) e 3 niveis (Basic/Full/Full+Booking), com hold de reserva. Nao e GDS/NDC. |
| Possui afiliados? | Sim - rede PROPRIA in-house (Viator Partner Program), ~8% por reserva (promo 10-12%), cookie 30 dias, PayPal semanal sem minimo. Nao esta em CJ/Impact/Awin/Partnerize hoje. |
| Pode virar parceiro? | Sim, com baixissima barreira: afiliado self-service aprovado em minutos (deep link + ~8%), ou integracao merchant via API para reservar dentro do nosso app e capturar comissao maior, mantendo o usuario na nossa experiencia. |
| Pode pagar comissão? | Sim - paga ~8% por reserva concluida (ate 10-12% em promo) no modelo afiliado; no modelo merchant, percentual de comissao sobre o recommendedRetailPrice ou margem via markup. Pagamento PayPal semanal / banco mensal (min US$50). |
| Pode receber tráfego? | Sim - e o destino ideal para o trafego de fundo de funil do nosso planejador: depois de definir destino, roteiro e orcamento, mandamos o usuario (deep link) ou reservamos via API as experiencias daquele plano, monetizando cada lead qualificado. |
| Pode ser integrado? | Sim, totalmente - via API merchant (reserva sem sair do app), API afiliado/booking, deep links ou widgets. Integracao tecnica madura; merchant exige certificacao. Ideal plugar como fornecedor de inventario de experiencias. |
| **O que precisamos ter p/ superar** | Roteiro multi-dia por IA com sequenciamento logistico real (horario+geografia) onde encaixamos os tours Viator nos slots certos; custo TOTAL da viagem (nao so o tour); comparacao de destinos por perfil/orcamento (topo de funil que ele ignora); super-perfil persistente que filtra os 300k produtos para os 3 certos; e um pos-venda/transparencia de taxas confiavel para vencer onde o suporte dele (1.9/ |

## Fontes consultadas
- https://docs.viator.com/partner-api/
- https://docs.viator.com/partner-api/technical/
- https://docs.viator.com/partner-api/merchant/technical/
- https://docs.viator.com/partner-api/affiliate/technical/
- https://partnerresources.viator.com/
- https://partnerresources.viator.com/travel-commerce/merchant/
- https://partnerresources.viator.com/travel-commerce/affiliate/
- https://partnerresources.viator.com/travel-commerce/merchant/pricing/
- https://www.partner.viator.com/partner/popups/whatis_migration.jsp
- https://www.travelpayouts.com/blog/viator-affiliate-program/
- https://commissiondex.com/program/viator/
- https://getlasso.co/affiliate/viator/
- https://automate.travel/blog/viator-vs-getyourguide-for-operators/
- https://www.sambahq.com/ota-supplier-guide/ota-commission-rates
- https://pro.regiondo.com/blog/viator-vs-getyourguide-which-ota-can-get-you-more-bookings/
- https://www.investing.com/news/company-news/tripadvisor-q2-2025-presentation-revenue-up-64-as-viator-and-thefork-lead-growth-93CH-4179081
- https://www.sec.gov/Archives/edgar/data/0001526520/000119312525268047/trip-20250930.htm
- https://viator.pissedconsumer.com/review.html
- https://www.trustpilot.com/review/www.viator.com
- https://apps.apple.com/us/app/viator-tours-attractions/id434832826
- https://businessmodelhub.in/viator-business-model/
