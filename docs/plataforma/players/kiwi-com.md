# Kiwi.com

> **Categoria:** OTA de voos / metasearch transacional com Virtual Interlining (self-transfer) e plataforma B2B/API (Tequila)
> _Perfil gerado por pesquisa multiagente (jun/2026). Parte do [Relatório de Mercado](../01-relatorio-de-mercado.md) e da [Matriz Competitiva](../02-matriz-competitiva.md)._

## 1. O que faz
Kiwi.com e uma OTA (agencia de viagens online) sediada na Chequia, especializada em "Virtual Interlining": um algoritmo que combina voos de companhias aereas que NAO tem acordo comercial entre si (inclusive low-cost com legacy), criando rotas auto-conectadas (self-transfer) que frequentemente saem 20-50% mais baratas que itinerarios tradicionais. Vende voos, e tambem trens e onibus (multimodal/ground+air, 800+ transportadoras), cobrando a "Kiwi.com Guarantee" como protecao paga para conexoes que a aerea nao garante. Tem braco B2B (plataforma Tequila) que distribui esse inventario via API/white-label para parceiros.

## 2. Público-alvo
Viajantes sensiveis a preco / budget travelers, mochileiros e nomades que priorizam tarifa baixa acima de conveniencia e estao dispostos a assumir risco de conexao propria; mercados emergentes e rotas long-haul com escalas criativas. No B2B: OTAs, metasearches, agencias e apps de viagem que querem revender inventario de voos e Virtual Interlining (hoje so por convite). Forte presenca em Europa, America Latina e Asia.

## 3. Funcionalidades principais
- Virtual Interlining: motor que gera trilhoes de combinacoes de voos auto-conectados entre aereas sem acordo
- Busca de voos com filtros flexiveis (Nomad/multi-cidade, 'qualquer lugar', mapa de precos, datas flexiveis)
- Kiwi.com Guarantee / Disruption Protection: re-roteamento ou reembolso pago se voo conectante for perdido por atraso
- Multimodal: combinacao de voo + trem + onibus (ground+air interlining)
- App mobile (iOS/Android) com boarding e gestao de reserva
- Venda de ancillaries: bagagem, selecao de assento, check-in, suporte premium
- Plataforma B2B Tequila: API de busca/booking, white-label, deeplinks, widgets e banners para parceiros
- Conteudo agregado de GDS (Amadeus 'Kiwideus', Sabre, Travelport) + conexoes diretas com aereas (95%+ de cobertura)

## 4. Como monetiza
- Markup/margem sobre a tarifa: compra inventario (direto + GDS) e revende com margem (modelo merchant), nucleo do Virtual Interlining
- Comissao/service fee por transacao de voo, trem e onibus
- Kiwi.com Guarantee como produto pago de protecao de conexao (margem alta de ancillary)
- Ancillaries: bagagem, assento, check-in, e suporte ao cliente 'premium' pago (so quem paga acessa atendimento prioritario)
- Taxa de processamento por passageiro/por voo deduzida em reembolsos
- B2B via Tequila: comissao em modelo afiliado OU 'Book with Kiwi.com' (booking-based) cobrada de parceiros
- Receita financeira historica (juros/cartao, parcerias bancarias ~20% a.a. em 2024) e fintech embutida no checkout
- Gross bookings na faixa de ~EUR 2,5 bilhoes

## 5. Afiliados
Sim. Programa proprio (Tequila) e tambem distribuido por REDES: Travelpayouts (principal para criadores de conteudo), Awin (ex.: Kiwi CA), Webgains e agregadores como Cuelinks. Comissao TIPICA: 3% sobre o valor total da reserva (voo/trem/onibus). Com ticket medio ~US$450, isso da ~US$13,50 por venda confirmada (CPA). Cookie de 30 dias, last-click. Modelo CPA por booking confirmado, considerado um dos CPAs mais altos do setor de voos. ATENCAO: desde maio/2024 o programa direto via Tequila passou a ser SOMENTE POR CONVITE para novos parceiros; a porta de entrada pratica para afiliados pequenos/medios hoje e via Travelpayouts/Awin, nao mais cadastro aberto no Tequila.

## 6. API
Sim, mas restrita. API "Tequila by Kiwi.com" (tequila.kiwi.com) com endpoints de busca, multi-city/Nomad e booking. Tipo: API de parceiro/afiliado (nao GDS publica, nao NDC certificada). Possui tier free de sandbox/teste com chave gerada no portal, mas uso em PRODUCAO, volume alto e uso comercial exigem aprovacao e contrato de parceria. Desde maio/2024 novos parceiros so entram POR CONVITE alinhado a metas estrategicas; parceiros existentes mantem acesso a docs, relatorios e ferramentas. Ela mesma consome GDS (Amadeus/Sabre/Travelport) e conexoes diretas com aereas por tras.

## 7. Programa de parceiros
Plataforma B2B "Tequila by Kiwi.com" com tiers: (1) afiliados pequenos usam integracoes simples (deeplinks, widgets, banners) e Kiwi cuida da experiencia de compra; (2) parceiros medios constroem proprio fluxo de busca/booking via API; (3) grandes OTAs negociam termos comerciais customizados e integracao direta aos sistemas. Dois modelos de partnership ao aplicar: "Kiwi.com Affiliate Program" (manda trafego, Kiwi fecha) ou "Book with Kiwi.com" (parceiro processa o booking). Acesso a novos: invitation-only desde 2024.

## 8. Dados que oferece
- Tarifas e disponibilidade de voos (incl. combinacoes self-transfer inexistentes em GDS tradicional)
- Precos de trem e onibus / opcoes multimodais ground+air
- Duracao, escalas, layovers e viabilidade de conexao auto-construida
- Precos de ancillaries (bagagem, assento) por reserva
- Deeplinks e widgets prontos para afiliados
- Dados de booking/transacao para parceiros B2B via relatorios Tequila
- Inventario agregado de 800+ transportadoras aereas e terrestres

## 9. Dados que NÃO oferece
- Custo TOTAL realista da viagem (hospedagem, alimentacao, transporte local, passeios, cambio) - so cobre o transporte
- Roteiro/itinerario dia-a-dia no destino (o que fazer, ordem, tempo em cada lugar)
- Recomendacao de destino baseada em perfil/orcamento ('para onde ir com X reais')
- Comparacao lado-a-lado de DESTINOS (clima, seguranca, custo de vida, melhor epoca)
- Perfil/preferencias persistentes do viajante para personalizacao
- Conteudo de hospedagem proprio robusto (foco e transporte, nao hotel)
- Conselho/IA conversacional de planejamento de viagem
- Transparencia total sobre risco real de self-transfer e direitos do passageiro (EC261) na propria busca

## 10. Pontos fortes
- Tecnologia de Virtual Interlining unica e dominante: ~25-30% do mercado global de itinerarios auto-construidos, dificil de replicar
- Tarifas frequentemente 20-50% menores que codeshares tradicionais
- Cobertura de inventario enorme (95%+) combinando GDS + diretas + low-cost que metasearches ignoram
- Multimodal real (voo+trem+onibus) - poucos concorrentes fazem
- Marca forte em budget travel e SEO/long-tail de rotas exoticas
- Kiwi.com Guarantee transforma o maior risco (conexao perdida) em produto pago/monetizavel
- CPA de afiliado alto (~US$13,5/venda, 3%) atrativo para criadores de conteudo

## 11. Pontos fracos
- Reputacao de atendimento ruim: nota baixa cronica no Trustpilot/BBB, reembolsos negados/demorados (ate 3 meses)
- Self-transfer gera risco real ao usuario; sem a Guarantee paga, perda de conexao = quase nada reembolsado
- Suporte humano 'pago' (so quem compra tier premium acessa atendimento decente) gera revolta
- Casos de reservas feitas com 'credit shell'/nome divergente que sao canceladas pela aerea vespera do voo
- Programa B2B/afiliado fechado (invitation-only desde 2024) - barreira para novos integradores
- Foco quase total em transporte: nao resolve planejamento da viagem em si
- Taxas de processamento por passageiro/por voo corroem reembolsos
- Dependencia de GDS de terceiros (custo e risco de relacionamento)

## 12. Reclamações comuns dos usuários
- Reembolsos prometidos por voos cancelados que nunca chegam, mesmo apos meses de pedidos
- Para voos cancelados pela aerea, Kiwi obriga a abrir processo no sistema deles com espera de ate 3 meses
- Self-transfer perdido sem Guarantee: usuario recebe so taxas de aeroporto de volta
- Atendimento da conflitante, enganoso e 'desonesto'; callbacks de supervisor que nunca acontecem
- Cobranca de taxa por passageiro/por voo deduzida do reembolso
- Impossivel falar com suporte sem pagar tier premium
- Reserva cancelada na vespera por uso de credit shell com nome divergente do passageiro
- Sensacao geral de 'pegadinha' com taxas escondidas no checkout

## 13–19. Limitações
| Eixo | Limitação |
|---|---|
| **UX** | Fluxo de busca e poderoso mas sobrecarrega o usuario com opcoes self-transfer cujo risco real (trocar de aeroporto/terminal, re-check-in de bagagem, sem protecao a aerea) fica minimizado ate o checkout. Upsell agressivo de Guarantee, bagagem e suporte premium polui a jornada. Pos-venda (reembolso, alteracao, suporte) e o ponto mais doloroso e mancha a experiencia inteira. |
| **Personalização** | Praticamente nula. Busca e transacional e anonima; nao constroi um perfil persistente do viajante (estilo de viagem, tolerancia a risco/conexao, orcamento, historico, companhia). Cada busca recomeca do zero. Nao recomenda destinos sob medida nem adapta a experiencia ao tipo de viajante. |
| **IA** | A IA do Kiwi e um motor de OTIMIZACAO COMBINATORIA (encontrar a combinacao de voos mais barata/viavel), nao IA de planejamento. Nao ha assistente conversacional que entenda intencao ('quero 10 dias de praia barata em junho'), nem geracao de roteiro, nem aconselhamento. E inteligencia de preco de transporte, nao de decisao de viagem. |
| **Roteirização** | Nao faz roteirizacao de DESTINO. Resolve so o trecho de deslocamento (origem-destino e multi-cidade). Nao diz o que fazer, em que ordem, quantos dias em cada lugar, nem monta itinerario dia-a-dia. O 'Nomad'/multi-city e otimizacao de rota aerea, nao planejamento de experiencia no solo. |
| **Orçamento** | So cobre o custo do TRANSPORTE (voo/trem/onibus + ancillaries). Nao calcula custo total realista da viagem: hospedagem, alimentacao, transporte local, ingressos, cambio, seguro. O viajante sai sabendo a passagem mas nao quanto a viagem inteira vai custar - exatamente a lacuna que um planejador de custo total preenche. |
| **Comparação** | Compara TARIFAS para um mesmo par origem-destino, nao DESTINOS entre si. Nao ajuda a decidir 'Peru x Tailandia x Portugal' por custo total, clima, seguranca, melhor epoca, vibe. A comparacao e de preco de bilhete, nao de adequacao do destino ao perfil e ao bolso do viajante. |
| **Integração** | API Tequila existe e e robusta tecnicamente, mas o acesso virou invitation-only desde maio/2024: novos parceiros nao se cadastram livremente, dependem de aprovacao alinhada a metas estrategicas do Kiwi. Para players pequenos/medios, a via realista de monetizacao e afiliado via Travelpayouts/Awin (deeplink + 3% CPA, cookie 30d), nao a API direta. Isso limita integracao profunda (busca inline, super |

## 20. Oportunidades para superá-lo
- Kiwi nao calcula CUSTO TOTAL da viagem - nosso app entrega voo (via afiliado Kiwi) + hospedagem + alimentacao + local + passeios num numero realista
- Kiwi minimiza o risco real do self-transfer ate o checkout - podemos ser TRANSPARENTES sobre risco de conexao e EC261, ganhando confianca que ele perdeu
- Reputacao de pos-venda pessima do Kiwi - nosso valor e DECISAO (nao somos a OTA que processa/reembolsa), entao herdamos a comissao sem herdar a dor do suporte
- Kiwi nao recomenda DESTINO por perfil/orcamento - nosso super-perfil + comparacao de destinos resolve o 'para onde ir' que ele ignora
- Kiwi nao tem roteiro/itinerario - geramos o dia-a-dia e mandamos o trafego de voo qualificado pra ele monetizar via afiliado
- Kiwi e anonimo e transacional - nosso perfil persistente personaliza e aumenta conversao do deeplink
- Fechamento do programa B2B abre espaco pra agregarmos MULTIPLAS OTAs (Kiwi + Skyscanner + Aviasales) e nao depender so dele

---

## Matriz (visão Mundo Sem Fim)
| Critério | Avaliação |
|---|---|
| Força principal | Virtual Interlining: tecnologia unica que cria rotas auto-conectadas baratissimas (20-50% menores) com cobertura de inventario de 95%+ (GDS + diretas + low-cost), liderando ~25-30% do mercado global de itinerarios auto-construidos. |
| Fraqueza principal | Reputacao toxica de pos-venda (reembolsos negados/lentos, suporte pago, risco de self-transfer empurrado ao usuario) somada a um escopo restrito a transporte - nao resolve planejamento, destino, roteiro nem custo total da viagem. |
| Modelo de receita | Merchant/markup sobre tarifa + service fees + ancillaries (Kiwi.com Guarantee, bagagem, suporte premium) + taxas de reembolso; B2B via comissao Tequila (afiliado ou booking-based); historicamente receita financeira/fintech no checkout. |
| Possui API? | Sim (parcial) - API Tequila (busca + booking + multi-city), com sandbox free, mas producao/comercial exige contrato; acesso a NOVOS parceiros e invitation-only desde mai/2024. |
| Possui afiliados? | Sim - 3% CPA por booking confirmado (~US$13,5/venda), cookie 30d last-click, via Travelpayouts (principal), Awin e Webgains; programa direto Tequila so por convite. |
| Pode virar parceiro? | Sim, em dois niveis: (a) imediato como AFILIADO via Travelpayouts/Awin com deeplink (sem aprovacao do Kiwi); (b) parceria de API/white-label direta apenas se convidados/aprovados pelo Kiwi (invitation-only). |
| Pode pagar comissão? | Sim - paga 3% do valor da reserva (voo/trem/onibus) ao afiliado que enviar o booking; modelo CPA via rede (Travelpayouts/Awin), pagamento por venda confirmada. |
| Pode receber tráfego? | Sim - e exatamente onde queremos mandar trafego: viajante que ja decidiu destino/datas no nosso app vai pro Kiwi comprar a passagem barata via deeplink afiliado, e nos ficamos com os 3%. |
| Pode ser integrado? | Parcial - integracao leve via deeplink/widget afiliado (Travelpayouts/Awin) e imediata; integracao profunda (busca inline, preco em tempo real, super-perfil) depende de convite para a API Tequila. |
| **O que precisamos ter p/ superar** | Custo TOTAL realista da viagem (voo+hospedagem+comida+local+passeios) como camada que o Kiwi nao tem; transparencia honesta sobre risco de self-transfer/EC261; comparacao de DESTINOS por perfil e orcamento; roteiro IA dia-a-dia; super-perfil persistente que personaliza e converte; e agregar MULTIPLAS fontes de voo (nao depender so do Kiwi) usando o deeplink dele como uma das opcoes de checkout. |

## Fontes consultadas
- https://en.wikipedia.org/wiki/Kiwi.com
- https://www.phocuswire.com/kiwi-connects-ground-air
- https://media.kiwi.com/articles-and-interviews/better-for-business-kiwi-com-takes-a-new-approach-to-partnerships/
- https://partners.kiwi.com/technology-services/b2b-partnership-model/
- https://tequila.kiwi.com/
- https://kiwicom.github.io/margarita/docs/guide-tequila-api-key
- https://support.travelpayouts.com/hc/en-us/articles/360019237899-Kiwi-com-affiliate-program-API
- https://www.travelpayouts.com/en/offers/kiwi-affiliate-program/
- https://www.travelpayouts.com/blog/kiwi-com-affiliate-program/
- https://ui.awin.com/merchant-profile/19859
- https://www.webgains.com/public/en/directory/kiwi-com-affiliate-programme/
- https://media.kiwi.com/articles-and-interviews/ninety-five-per-cent-and-counting/
- https://www.sabre.com/insights/releases/kiwi-com-partners-with-sabre-to-expand-its-reach/
- https://cloud.google.com/blog/products/api-management/a-moving-experience-how-kiwicom-built-a-travel-platform-with-apis
- https://www.trustpilot.com/review/kiwi.com
- https://www.bbb.org/us/fl/miami/profile/travel-agency/kiwicom-inc-0633-90562676/complaints
