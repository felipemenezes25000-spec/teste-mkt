# TheFork (antiga LaFourchette / ElTenedor / TheFork, uma empresa Tripadvisor)

> **Categoria:** Marketplace de reservas de restaurante (OTA de restaurantes) — lider na Europa, subsidiaria da Tripadvisor
> _Perfil gerado por pesquisa multiagente (jun/2026). Parte do [Relatório de Mercado](../01-relatorio-de-mercado.md) e da [Matriz Competitiva](../02-matriz-competitiva.md)._

## 1. O que faz
TheFork e o maior marketplace de reserva de mesas em restaurante da Europa: o usuario descobre, compara, le avaliacoes (integradas com Tripadvisor) e reserva mesa gratuitamente, muitas vezes com descontos de 20%-50% e acumulo de pontos de fidelidade (Yums). Para o restaurante, vende um SaaS de gestao de reservas (TheFork Manager) e cobra comissao por cliente que chega via plataforma. E essencialmente o 'OpenTable da Europa', sob o guarda-chuva da Tripadvisor e com parceria com o Guia Michelin.

## 2. Público-alvo
Dois lados. (1) Consumidor: gourmets e viajantes urbanos na Europa que querem reservar mesa, caçar desconto e ler reviews — forte em Franca, Espanha, Italia, e tambem Reino Unido, Portugal, Benelux, Suica, Nordicos e Australia. (2) Restaurante: donos e gerentes de restaurantes independentes e redes que querem encher mesas, reduzir no-shows e ganhar visibilidade online. Mais de 55.000-80.000 restaurantes parceiros em ~11 paises.

## 3. Funcionalidades principais
- Busca e reserva de mesa em tempo real com confirmacao instantanea
- Avaliacoes verificadas (so quem comeu avalia) + integracao com reviews da Tripadvisor
- Descontos permanentes de 20%-50% (TheFork Offers / 'Special Offers')
- Programa de fidelidade Yums (100 Yums/reserva; troca por desconto de 20-50 EUR)
- Filtros por culinaria, preco, bairro, ocasiao; fotos e menus
- TheFork Manager: SaaS para restaurante (agenda eletronica, gestao de mesas/sala, CRM de clientes)
- Lembretes e reconfirmacao por SMS/e-mail para reduzir no-show
- Pre-pagamento e cobranca de no-show em alguns restaurantes
- Widget de reserva sem comissao para o site e redes sociais do proprio restaurante
- Selo e badge 'Yums accepted' e posicionamento patrocinado/Boost no app
- Integracao com Guia Michelin (reserva de estrelados via TheFork)
- Apps iOS/Android (40M+ downloads) e API B2B/POS para parceiros tecnicos

## 4. Como monetiza
- Comissao por cliente (cost-per-cover): tipicamente ~2,00-2,60 EUR por pessoa que efetivamente comparece via plataforma (modelo per-diner, nao per-reserva); em ticket alto pode chegar a 4-6 EUR por pessoa
- Assinatura SaaS do TheFork Manager em 3 niveis: Visibility (~29 EUR/mes), Performance (~89 EUR/mes), Enterprise (~159 EUR/mes) — grade nao mais publicada, exige orcamento
- Modelo hibrido: comissao + assinatura combinadas (nao excludentes)
- Boost / posicionamento patrocinado: restaurante paga para subir no ranking e ganhar destaque
- Yums co-financiado: quando o cliente usa desconto de 20/50 EUR, TheFork deduz 50% do valor da fatura do restaurante (resto e subsidio da plataforma para gerar demanda)
- No lado consumidor: receita de afiliados/CPA quando publishers mandam trafego (rede de afiliacao), e venda de gift cards
- Sinergia de dados/trafego com a Tripadvisor (cross-sell e publicidade dentro do ecossistema)

## 5. Afiliados
Sim, tem programa de afiliados, mas NAO e uma rede unica global — esta fragmentado por pais e operadora, e varios programas ja foram fechados/migrados. Historicamente esteve na Awin (TheFork BE/PT — fechado em fev/2022), FlexOffers (PT, cookie de 20 dias), Plebicom (FR, aberto) e Kwanko (TheFork FR). Agregadores como Cuelinks listam payout por clique baixo (~INR 0,18/clique). Comissao tipicamente CPA/dinamica por reserva valida, geralmente na faixa de ~5%-10% citada por diretorios (numeros variam por pais e nao sao publicados de forma consolidada). Conclusao: afiliacao existe mas e oportunista, regionalizada e de baixa transparencia — nao ha um 'TheFork Partner Network' unico estilo Booking/Travelpayouts.

## 6. API
Sim, tem API, mas e de PARCEIRO (B2B/POS), nao de afiliado/aggregator. Portal oficial em docs.thefork.io expoe: B2B-API (criar/gerir reserva, disponibilidade em tempo real, webhooks de eventos de reserva, menus pre-definidos, dados do cliente como alergias/restricoes/preferencias) e POS-API. Acesso so para parceiros autorizados (restaurantes, grupos, plataformas de CRM e POS), exige contrato e credenciais via portal, com rate limit por contrato e versionamento com janela de suporte de 6 meses. NAO existe API publica para um app de viagem listar/comparar restaurantes ou monetizar reservas como afiliado tecnico — a integracao de consumidor passa por deeplink/afiliacao, nao por API aberta. Nao e GDS/NDC (irrelevante para a categoria).

## 7. Programa de parceiros
Multiplas camadas de parceria: (1) Parceria-mae com Tripadvisor (dona) e parceria estrategica internacional com o Guia Michelin (reserva de estrelados). (2) Parceiros de tecnologia via API B2B/POS (CRMs, sistemas de PDV, grupos de restaurantes) com onboarding por contrato no portal de developers. (3) Programa de afiliados/publishers regionalizado via redes terceiras (Awin/FlexOffers/Plebicom/Kwanko). (4) Programa de indicacao 'Sponsorship' para consumidores (indique e ganhe). Nao ha um programa unico, self-service e global de parceiro de distribuicao para apps de viagem.

## 8. Dados que oferece
- Disponibilidade de mesa em tempo real e slots de horario (via API de parceiro)
- Confirmacao/lifecycle de reserva e webhooks de eventos
- Ficha do restaurante: culinaria, faixa de preco, fotos, menus pre-definidos
- Avaliacoes verificadas e nota agregada (reforcada por reviews Tripadvisor)
- Ofertas/descontos vigentes (20%-50%) e elegibilidade Yums
- Dados do cliente para o restaurante: alergias, intolerancias, restricoes alimentares, preferencias de mesa
- Geolocalizacao e bairro do restaurante; indicadores de popularidade/no-show

## 9. Dados que NÃO oferece
- Nenhum dado de custo TOTAL de viagem (voo, hospedagem, transporte) — so o restaurante
- Sem feed publico/aberto de catalogo de restaurantes para apps de terceiros sem contrato
- Nao fornece roteiro/itinerario nem encadeamento de refeicoes ao longo de uma viagem
- Sem precificacao prevista da conta media confiavel por pessoa exposta em API (o que voce paga de fato no jantar)
- Sem dados comparativos entre destinos/cidades (custo de comer fora em Lisboa vs Bangkok)
- Nao expoe perfil de gosto/super-perfil do viajante reutilizavel fora do ecossistema
- Cobertura fraca/inexistente fora da Europa+Australia (sem EUA, America Latina, Asia, Africa)
- Sem dados de IA generativa/recomendacao contextual de viagem expostos a parceiros

## 10. Pontos fortes
- Lider absoluto de reservas de restaurante na Europa, com efeito de rede dos dois lados (55-80 mil restaurantes, 40M+ downloads, 20M+ reviews)
- Respaldo e trafego da Tripadvisor + parceria com o Guia Michelin = autoridade e inventario premium
- Marca e confianca fortes em mercados-chave (FR/ES/IT); Trustpilot ~4,4/5 e Android ~4,8/5
- Ganho real para o usuario: descontos permanentes de 20-50% e fidelidade Yums (no-show de apenas 0,4% em reservas Yums)
- SaaS de gestao (TheFork Manager) que prende o restaurante no ecossistema e gera receita recorrente alem da comissao
- API B2B/POS madura (Kong, webhooks, versionamento) para integrar CRMs e PDVs de restaurantes
- Modelo de monetizacao diversificado e resiliente: comissao + assinatura + boost + Yums co-financiado

## 11. Pontos fracos
- Cobertura geografica restrita: forte so na Europa+Australia; quase ausente em EUA, LatAm, Asia e Africa — limita para viagem global
- API e fechada a parceiros contratados; nao ha distribuicao self-service para apps de viagem monetizarem reservas
- Programa de afiliados fragmentado, regionalizado e de baixa comissao/transparencia (varios fechados)
- Dependencia/lock-in caro para restaurantes: 6.000+ EUR/mes em zonas turisticas gera atrito e churn potencial
- Foco em transacao de reserva, nao em planejamento — nao ajuda o viajante a montar roteiro nem a estimar custo total
- Comissao por cliente corroi margem do restaurante e gera ma vontade do lado da oferta (reclamacao recorrente)
- Experiencia centrada em desconto/cupom pode atrair cacador de promocao, nao necessariamente fit de gosto

## 12. Reclamações comuns dos usuários
- Reservas-fantasma: cliente recebe confirmacao (e ate lembrete) mas o restaurante esta cheio ou fechado no dia
- Pre-pagamento sem mesa: jantares pre-pagos (ex.: reveillon em Malaga) sem mesa disponivel na chegada, com 'compensacao' so em Yums
- Yums dificil de gastar: poucos restaurantes aceitam em certas regioes, entao o cliente acumula mas nao usa
- Gift cards somem antes do prazo informado (expiram as 23:59 do dia anterior ao indicado)
- Suspensao de conta com perda de todos os Yums acumulados, sem aviso claro
- Reducao de beneficios ao longo do tempo: menos descontos e fim do reembolso automatico em cancelamento de ultima hora pelo restaurante
- Lado restaurante: reservas fraudulentas/no-shows com contatos ficticios; comissao alta e percebida como abusiva
- Atendimento ao cliente lento/insatisfatorio em disputas (tema recorrente no Trustpilot, iOS ~4,0/5)

## 13–19. Limitações
| Eixo | Limitação |
|---|---|
| **UX** | UX focada em uma unica tarefa (achar mesa e reservar agora), nao em jornada de viagem. A experiencia gira em torno de listas, filtros e cupons; nao ha contexto de 'estou planejando uma viagem de 5 dias a Lisboa'. O usuario que cruza varias cidades/datas precisa repetir buscas manuais, sem agenda integrada ao roteiro. A enxurrada de descontos vira ruido e atrai cacador de promocao em vez de fit de  |
| **Personalização** | Personalizacao e rasa e transacional: baseada em historico de reservas, alergias e preferencias de mesa que ficam presas no ecossistema TheFork/restaurante. Nao existe um super-perfil do viajante portavel (orcamento, ritmo, gostos, companhia, restricoes) que oriente a curadoria. As recomendacoes sao guiadas por desconto/popularidade, nao por afinidade real com o perfil. Nossa brecha: usar o super- |
| **IA** | IA e essencialmente busca/ranking e antifraude/no-show, nao planejamento generativo. Nao ha assistente que monte 'onde comer' ao longo de uma viagem, equilibre orcamento, distancia e horarios, ou explique por que aquele restaurante combina com o usuario. Nenhuma capacidade de IA conversacional de planejamento e exposta a parceiros via API. Nossa brecha: nossa IA de roteiro pode ser a camada de dec |
| **Roteirização** | Zero roteirizacao. TheFork nao monta itinerario, nao sequencia refeicoes ao longo dos dias, nao considera deslocamento entre atracoes e restaurante, nem encadeia 'manha-passeio / almoco / tarde / jantar'. Cada reserva e um evento isolado. Para uma viagem de varios dias e cidades, o trabalho de juntar tudo num plano coerente fica 100% com o usuario. Nossa brecha gigante: somos a camada de roteiro q |
| **Orçamento** | Orcamento e tratado como cupom, nao como custo total realista. Mostra faixa de preco (simbolos) e desconto, mas nao estima quanto a pessoa vai gastar de fato com comida na viagem inteira, nem soma isso ao custo de voo/hospedagem/transporte. Nao compara o custo de comer fora entre destinos. Nossa brecha: integrar o gasto com refeicoes (incluindo o desconto TheFork) ao custo total da viagem e ao 'mo |
| **Comparação** | Comparacao e so restaurante-vs-restaurante dentro de uma cidade — nunca destino-vs-destino. Nao responde 'em qual cidade vou comer melhor/mais barato' nem ajuda a escolher para onde viajar. Fora da Europa+Australia praticamente nao ha inventario para comparar. Nossa brecha: comparacao de destinos (incluindo gastronomia e custo de comer fora como criterio) e onde somos fortes e o TheFork e cego; po |
| **Integração** | Integracao para nos e o ponto mais critico: a API e fechada a parceiros contratados de restaurante/CRM/POS, sem trilha self-service para um app de viagem distribuir reservas e monetizar como afiliado tecnico. O caminho realista de integracao e via deeplink afiliado por rede regional (Awin/FlexOffers/Plebicom/Kwanko), com comissao baixa/variavel e cobertura so europeia. Webhooks e dados ricos exist |

## 20. Oportunidades para superá-lo
- Ser a camada de DECISAO e ROTEIRO que falta: posicionar cada refeicao no dia/horario certo da viagem e usar o TheFork apenas como motor de reserva por deeplink
- Cobrir o mundo que o TheFork nao cobre (EUA, LatAm, Asia, Africa) — fora da Europa ele e quase inexistente, e ali nosso roteiro e custo total ganham sozinhos
- Custo total realista de comer fora por destino e por viagem, somado a voo/hospedagem — o TheFork so mostra cupom, nunca o gasto agregado
- Comparacao destino-vs-destino com gastronomia e custo de refeicao como criterio — capacidade que o TheFork estruturalmente nao tem
- Super-perfil do viajante para curar 'onde voce comeria' por afinidade real, nao por desconto/popularidade, e so entao reservar via TheFork
- Resolver as dores de confianca dele (reserva-fantasma, Yums travado, suporte ruim) sendo a camada que so encaminha para inventario confiavel e mostra alternativas
- Capturar o trafego de planejamento (topo de funil) que o TheFork nao tem: quem ainda esta escolhendo destino/datas, e entregar a ele a reserva ja no fim do funil

---

## Matriz (visão Mundo Sem Fim)
| Critério | Avaliação |
|---|---|
| Força principal | Efeito de rede dominante em reservas de restaurante na Europa (55-80 mil restaurantes, 40M+ downloads, 20M+ reviews) com respaldo de Tripadvisor e Guia Michelin, inventario premium e descontos reais. |
| Fraqueza principal | E so transacao de reserva no momento, restrito a Europa+Australia, sem planejamento, sem custo total e com API fechada a parceiros nao-restaurante — nao ajuda o viajante a decidir nem a montar a viagem. |
| Modelo de receita | Hibrido: comissao por cliente que comparece (~2,0-2,6 EUR/pessoa) + assinatura SaaS TheFork Manager (29/89/159 EUR/mes) + boost/patrocinado + Yums co-financiado (50% do desconto debitado do restaurante) + afiliados/gift cards no lado consumidor. |
| Possui API? | Sim, mas parcial para nos: API B2B/POS robusta (reserva, disponibilidade, webhooks, dados de cliente) porem fechada a parceiros contratados de restaurante/CRM/POS — sem API publica de afiliado/aggregator para app de viagem. |
| Possui afiliados? | Sim, porem fragmentado e regional: Awin (BE/PT, parte fechada), FlexOffers (PT, cookie 20 dias), Plebicom (FR), Kwanko (FR); comissao CPA dinamica/baixa (~5-10% citado em diretorios), sem rede global unica. |
| Pode virar parceiro? | Sim, de forma pragmatica: como publisher/afiliado nas redes regionais (Awin/FlexOffers/Plebicom/Kwanko) para mandar trafego e, em escala, buscar acordo B2B direto/deeplink. Pouco provavel uma parceria de distribuicao self-service no curto prazo. |
| Pode pagar comissão? | Sim, para nos: paga comissao por reserva valida via rede de afiliacao (CPA), entao podemos monetizar mandando o usuario do roteiro para reservar — limitado a inventario europeu e a comissao baixa/variavel. |
| Pode receber tráfego? | Sim: e candidato natural a receber nosso trafego qualificado de fim de funil (viajante que ja escolheu destino/datas e quer reservar onde comer) nos destinos europeus que ele cobre. |
| Pode ser integrado? | Parcial: integravel via deeplink afiliado de imediato (Europa); integracao por API so apos contrato B2B (voltado a restaurante/CRM/POS, nao a app de viagem). Sem feed aberto de catalogo global. |
| **O que precisamos ter p/ superar** | Camada de decisao+roteiro com IA (sequenciar refeicoes no dia/horario), cobertura global de gastronomia, custo total realista de comer fora somado a voo/hospedagem, comparacao destino-vs-destino e super-perfil de gosto — usando o TheFork como motor de reserva por deeplink/afiliado onde ele e forte (Europa), nunca como nossa fonte de inventario ou de planejamento. |

## Fontes consultadas
- https://vizologi.com/business-strategy-canvas/thefork-business-model-canvas/
- https://deru.es/en/blog/software-restaurantes-reservas/
- https://joincaramel.com/blog/post-23/
- https://www.theforkmanager.com/en/restaurant-software-price
- https://www.saasworthy.com/product/thefork-manager/pricing
- https://docs.thefork.io/B2B-API/introduction
- https://docs.thefork.io/POS-API/how-it-works
- https://docs.thefork.io/getting-started
- https://medium.com/thefork/how-we-leverage-kong-to-build-a-public-api-41073709541c
- https://affi.io/m/thefork
- https://www.kwanko.com/program-directory/program/affiliate/affiliation/The%20fork%20FR%20/77979/
- https://www.cuelinks.com/campaigns/thefork-affiliate-program
- https://www.thefork.com/yums
- https://www.theforkmanager.com/en/landing-page/yums
- https://www.trustpilot.com/review/thefork.com
- https://apps.apple.com/us/app/thefork-restaurant-bookings/id424850908
- https://about.thefork.com/
- https://ir.tripadvisor.com/news-releases/news-release-details/michelin-guide-tripadvisor-and-thefork-launch-international
- https://twintable.io/blog/couts-caches-thefork
