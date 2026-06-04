# Expedia (Expedia Group)

> **Categoria:** OTA / Agencia de Viagens Online + Pacotes + Plataforma B2B de distribuicao
> _Perfil gerado por pesquisa multiagente (jun/2026). Parte do [Relatório de Mercado](../01-relatorio-de-mercado.md) e da [Matriz Competitiva](../02-matriz-competitiva.md)._

## 1. O que faz
Expedia e uma das maiores OTAs (Online Travel Agencies) do mundo, parte do Expedia Group (que tambem opera Hotels.com, Vrbo, trivago e a divisao B2B Expedia Partner Solutions). Permite buscar e reservar hoteis, voos, alugueis de temporada, carros, cruzeiros e atividades, com forte enfase em pacotes empacotados (voo+hotel) e no programa de fidelidade unificado OneKey. Em 2025/2026 a empresa virou tambem uma 'B2B powerhouse': aluga sua tecnologia e inventario (700-800 mil propriedades, +1 milhao de imoveis Vrbo) para outras plataformas via API (Rapid).

## 2. Público-alvo
Viajante de lazer mainstream (B2C) que quer conveniencia de reservar tudo num lugar so e busca desconto via bundle/fidelidade OneKey; alem de um publico B2B robusto: outras OTAs, agencias, plataformas de viagem, bancos/fintechs e agentes de viagem (via TAAP). Geograficamente global, com forca em EUA, Europa e Asia-Pacifico.

## 3. Funcionalidades principais
- Busca e reserva de hoteis e alugueis de temporada (Vrbo integrado)
- Reserva de voos (modelo agency, comissao baixa)
- Pacotes empacotados voo+hotel+carro com desconto (bundle / 'Member Prices')
- Aluguel de carros (+47 mil fornecedores) e transfers
- Atividades, passeios e ingressos
- Cruzeiros
- Programa de fidelidade OneKey (pontos OneKeyCash compartilhados entre Expedia, Hotels.com e Vrbo)
- App mobile com price tracking, 'Price Drop Protection' e ofertas exclusivas de app
- Trip planning basico (salvar viagens, listas) e features de IA conversacional (Romie / assistente de viagem)
- Plataforma B2B: Rapid API, White Label, Travel Redirect API, TAAP para agentes

## 4. Como monetiza
- Modelo Merchant (merchant of record): Expedia cobra o cliente, negocia tarifa liquida com o hotel e fica com o spread/markup - take rate maior, base dos pacotes
- Modelo Agency: facilita a reserva e recebe comissao do fornecedor apos a estadia (tipico de voos e parte de hoteis)
- Lodging (hotel + aluguel temporada) e o motor: ~80%+ da receita global; em 2025 gerou quase US$ 12 bilhoes
- Advertising & Media (Expedia Group Advertising): hoteis e parceiros pagam por destaque/posicao; inclui receita de terceiros do trivago (metasearch, modelo CPC)
- Segmento B2B cresceu para ~38% da receita total em 2025 (distribuicao de inventario via API + white label, ganho no spread net rate)
- Taxas de servico/conveniencia e seguros/ancillaries no checkout
- OneKey como ferramenta de retencao que reduz CAC e aumenta repeat-booking

## 5. Afiliados
Sim. Programa de afiliados consolidado no 'Expedia Group Travel Creator/Affiliate Program', operado tecnicamente pela rede Partnerize (antiga PHG - Performance Horizon Group) para tracking e pagamento. Tambem distribuido via redes agregadoras como Travelpayouts e (historicamente) CJ. Comissoes tipicas por tipo de produto: Voos ~US$ 2 fixo por reserva; Alugueis de temporada, Pacotes e Carros ~2%; Hoteis 3% a 4% (varia por marca/regiao); Atividades e transfers ~5%; Cruzeiros ate ~6%. Cookie de atribuicao curto: ~7 dias na maioria das marcas. Comissao so e paga apos o cliente COMPLETAR a estadia (nao no booking).

## 6. API
Sim, robusta, mas de PARCEIRO (gated, nao publica self-serve aberta). Produto principal: Rapid API (antiga EAN/Expedia Affiliate Network) - API REST B2B de lodging com 700-800 mil propriedades em 200+ paises. Familia Rapid inclui Lodging API, Car API (+110 marcas / 190 paises, com Rapid Car em beta para lançamento full em 2026), Activities API e Vacation Rental/Vrbo API (+1 milhao de imoveis). Ha tambem White Label Travel Platform, Travel Redirect API e Connectivity Hub. Dois modelos de pagamento: 'Expedia Collect' (Expedia cobra o cliente e paga comissao ao parceiro) e 'Partner Collect' (parceiro cobra o cliente, paga a tarifa liquida a Expedia e fica com o markup). Acesso exige aprovacao/contrato de parceiro e onboarding (nao e chave instantanea). Para voos NAO ha API de distribuicao aberta relevante para terceiros.

## 7. Programa de parceiros
Multiplas camadas: (1) Expedia Partner Solutions (EPS) - braco B2B para integradores via Rapid API e White Label; (2) Certified Technology Partners Program - integradores homologados que facilitam a conexao; (3) TAAP (Travel Agent Affiliate Program) - para agentes de viagem, comissao escalonada por volume anual: hoteis ~8,5% (faixa US$0-50k) ate ~11,5%+ (US$300k+), carros 5,5%-7,5%, pacotes 4%-6%; gratuito para aderir, calcula comissao sobre o valor bruto (com taxas), permite 'agency service charge' de ate 30% sobre lodging/pacotes, e tem o TAAP Rewards (lançado global em 2025, incluindo Brasil). (4) Affiliate/Creator Program para sites e criadores de conteudo (via Partnerize).

## 8. Dados que oferece
- Inventario de hoteis/alugueis com preco em tempo real, disponibilidade, fotos, amenidades e politicas de cancelamento (via Rapid API)
- Geolocalizacao de propriedades, ratings e reviews de hospedes
- Tarifas liquidas (net rates) e tarifas de varejo para parceiros B2B
- Inventario de carros (+47 mil fornecedores) e atividades
- Conteudo de Vrbo (imoveis inteiros)
- Dados de reserva/itinerario para o proprio cliente e para o parceiro via Expedia/Partner Collect
- Relatorios de performance de afiliado (cliques, reservas, comissao) via Partnerize

## 9. Dados que NÃO oferece
- Custo TOTAL realista de uma viagem (nao soma comida, transporte local, ingressos, cambio, gorjetas - so o que e bookavel)
- Comparacao objetiva entre DESTINOS (clima, seguranca, custo de vida, melhor epoca) - so compara hoteis/voos dentro de um destino ja escolhido
- Roteiro dia-a-dia estruturado (o que fazer em cada dia, sequencia logica, tempo de deslocamento)
- Perfil profundo e persistente do viajante (estilo, ritmo, restricoes) usado para personalizar de verdade
- Recomendacao de destino imparcial baseada em orcamento/perfil (o motor empurra inventario monetizavel, nao a melhor escolha para o usuario)
- Dados de voos via API aberta para terceiros (distribuicao de voo e fechada)
- Transparencia total de fees antes do checkout final (fees aparecem tarde)

## 10. Pontos fortes
- Escala e inventario gigantescos (700-800k propriedades, +1M Vrbo, +47k fornecedores de carro) - cobertura global dificil de bater
- Marca consolidada e confianca para fechar a TRANSACAO (checkout, pagamento, suporte pos-venda existem)
- Pacotes empacotados (bundle voo+hotel) com desconto real - valor que players so-de-hotel nao tem
- OneKey: programa de fidelidade cross-brand poderoso para retencao e repeat-booking
- Forca B2B/Rapid API: monetiza inventario sem precisar do trafego direto (38% da receita)
- Capacidade de ser merchant of record - assume pagamento e risco, viabiliza markup e bundle
- Caixa e poder de negociacao com hoteis (net rates competitivas)

## 11. Pontos fracos
- UX de PLANEJAMENTO fraca: e um motor de busca/checkout, nao um planejador - assume que o usuario ja sabe para onde vai
- Personalizacao rasa: 'recomendacoes' sao majoritariamente o inventario que da mais margem, nao o melhor para o viajante
- Pressao comercial e dark patterns ('so resta 1 quarto!', 'X pessoas vendo agora') corroem confianca
- Fees e condicoes que aparecem tarde no funil geram surpresa e reclamacao
- Atendimento ao cliente com reputacao ruim (refunds travados, dificuldade de falar com humano)
- IA/roteirizacao ainda incipiente comparada a planejadores dedicados
- Atribuicao de afiliado avara: cookie de so 7 dias e comissao paga so apos a estadia

## 12. Reclamações comuns dos usuários
- Reembolsos travados/atrasados - prometem 5-7 dias uteis ou '2 ciclos de fatura' e nao pagam; casos de hotel autorizar refund e Expedia 'simplesmente nao processar'
- Taxas escondidas - carros e reservas com fees nao explicitos no inicio, cliente acaba pagando ate 50% a mais
- Cobranca dupla - cobrados duas vezes mesmo quando a reserva nao se completa
- Atendimento ruim - horas no telefone, transferencias, chat encerrado quando se pede email de reclamacao
- Bait-and-switch percebido - preco/condicao muda entre busca e checkout
- Dificuldade de resolver problema quando ha 3 partes (Expedia + hotel/cia aerea + cliente), com cada um jogando a responsabilidade para o outro
- Cancelamentos e mudancas de companhia aerea mal comunicados

## 13–19. Limitações
| Eixo | Limitação |
|---|---|
| **UX** | Otimizada para CONVERSAO/checkout, nao para descoberta e decisao. O fluxo assume destino e datas ja definidos e empurra o usuario para reservar o mais rapido possivel, com urgencia artificial ('ultimo quarto', 'X olhando agora') e fees que aparecem tarde. Quem ainda esta na duvida 'para onde vou e quanto isso custa de verdade' nao e atendido - a tela e uma lista de resultados monetizados, nao um e |
| **Personalização** | Personalizacao superficial e enviesada pela margem. Nao mantem um super-perfil persistente do viajante (estilo, ritmo, restricoes alimentares, tolerancia a caminhada, orcamento real). As 'recomendacoes' refletem inventario com melhor take rate e campanhas de advertising pagas por hoteis, nao o que e objetivamente melhor para aquele usuario. OneKey personaliza preco/fidelidade, mas nao a EXPERIENCI |
| **IA** | IA ainda emergente e focada em assistir a compra (assistente conversacional tipo Romie, sugestao de hoteis), nao em planejar a viagem inteira. Nao gera roteiro dia-a-dia coerente com logica de deslocamento, nem raciocina sobre trade-offs de orcamento total. A IA serve ao funil de booking (vender mais inventario), nao ao objetivo do viajante de tomar a melhor decisao. |
| **Roteirização** | Praticamente inexistente como produto. Expedia organiza ITINERARIO de reservas (o que voce ja comprou: voo tal dia, check-in tal dia), mas nao constroi um ROTEIRO de o-que-fazer (sequencia de atracoes, tempo realista por dia, deslocamentos, encaixe de atividades por bairro). Nao ha planejamento dia-a-dia inteligente - apenas um carrinho de itens bookaveis. |
| **Orçamento** | So mostra o custo do que e BOOKAVEL na plataforma (hotel, voo, carro, atividade comissionada). Nao calcula o custo TOTAL e realista da viagem: alimentacao, transporte local, ingressos nao vendidos por eles, cambio, gorjetas, imprevistos. O usuario nao consegue responder 'essa viagem cabe no meu orcamento de R$ X?' - so ve o subtotal das reservas, sempre com fees que sobem no final. |
| **Comparação** | Compara OPCOES dentro de um destino ja escolhido (hotel A vs hotel B, voo X vs voo Y), mas nao compara DESTINOS entre si de forma decisoria (Tailandia vs Portugal vs Peru por custo total, clima na data, seguranca, melhor epoca, vibe). Como e remunerada por venda, qualquer 'comparacao' tende a empurrar o destino/inventario mais lucrativo, nao a recomendacao neutra que o viajante indeciso precisa. |
| **Integração** | Integravel, porem assimetrica. Da para mandar trafego e monetizar via Affiliate (Partnerize) com deep links, ou integrar inventario de hotel/carro/atividade via Rapid API (modelo B2B, requer aprovacao e contrato). MAS: voos quase nao tem API de distribuicao para terceiros; o cookie de afiliado e curto (7 dias); a comissao so paga apos a estadia (fluxo de caixa lento); e a API B2B exige onboarding/ |

## 20. Oportunidades para superá-lo
- Ser o 'andar de cima' do funil: resolver POR QUE/PARA ONDE/QUANTO CUSTA (decisao) onde a Expedia so resolve o COMO COMPRAR - e mandar o usuario ja decidido para reservar la (ganhando comissao)
- Custo TOTAL realista da viagem (comida, transporte local, ingressos, cambio) que a Expedia nunca mostra - vira nosso diferencial central de confianca
- Comparacao NEUTRA entre destinos por orcamento/perfil/epoca - imparcial justamente porque nao vendemos o inventario
- Roteiro dia-a-dia com IA (sequencia logica, deslocamentos, encaixe por bairro) que a Expedia nao tem
- Super-perfil persistente do viajante para personalizacao real, contra a personalizacao enviesada-por-margem deles
- UX sem dark patterns / urgencia falsa - posicionamento de 'conselheiro honesto' contra a fadiga de pressao comercial da Expedia
- Capturar o usuario CEDO (fase sonho/pesquisa) com cookie/relacao longa, e so monetizar a transacao no fim - resolvendo a janela de 7 dias e o vies pro-booking deles

---

## Matriz (visão Mundo Sem Fim)
| Critério | Avaliação |
|---|---|
| Força principal | Escala absurda de inventario + marca confiavel que FECHA a transacao (merchant of record, pagamento, pacotes voo+hotel, OneKey) e ainda monetiza B2B via Rapid API (~38% da receita). |
| Fraqueza principal | E motor de busca/checkout, nao planejador: nao ajuda a DECIDIR (para onde, quanto custa de verdade, qual roteiro) e queima confianca com fees tardios, urgencia falsa e suporte ruim. |
| Modelo de receita | Merchant (spread/markup) + Agency (comissao) + Advertising/metasearch (CPC trivago) + B2B (distribuicao de inventario via API). Lodging e ~80%+ da receita; B2B ja e ~38%. |
| Possui API? | Sim (parcial/gated): Rapid API B2B robusta para hotel/carro/atividade/Vrbo, com Expedia Collect e Partner Collect; exige contrato e homologacao. Voos sem API aberta para terceiros. |
| Possui afiliados? | Sim: Affiliate/Creator Program via Partnerize (PHG), tambem em Travelpayouts. Comissoes ~2% (carro/pacote/aluguel), 3-4% hotel, 5% atividades, ate 6% cruzeiro, US$2/voo. Cookie 7 dias, paga so apos a estadia. |
| Pode virar parceiro? | Sim, em duas frentes: (a) afiliado/creator via Partnerize para monetizar trafego de saida com deep links; (b) parceiro B2B Rapid API para puxar inventario de hotel/carro/atividade para dentro do nosso app. TAAP fica de fora (e para agentes). |
| Pode pagar comissão? | Sim. Modelo afiliado (CPA, ~2-6% pago apos estadia) e o caminho natural para nos remunerar quando mandamos o lead/booking. Via Rapid 'Partner Collect' tambem da para embutir markup proprio. |
| Pode receber tráfego? | Sim - e o destino ideal para enviarmos o usuario JA DECIDIDO (deciso 'reservar este hotel/pacote'), capturando comissao no fim do funil de decisao que construimos. |
| Pode ser integrado? | Parcial: via affiliate/deeplink (rapido) e via Rapid API B2B para hotel/carro/atividade (requer aprovacao). Voo e o ponto fraco - integrar voo exige outro fornecedor (GDS/NDC ou Skyscanner/Kiwi/Duffel). |
| **O que precisamos ter p/ superar** | Para superar a Expedia naquilo que ela faz bem (converter), precisamos: (1) checkout/handoff de booking sem atrito (deep link confiavel ou Rapid), (2) cobertura de preco/disponibilidade em tempo real boa o suficiente para o usuario confiar no nosso custo total, (3) ofertas de pacote/bundle competitivas - e vencer no que ela NAO faz: decisao, custo total real, roteiro IA e comparacao neutra de dest |

## Fontes consultadas
- https://www.businesswire.com/news/home/20260507466383/en/Expedia-Group-Reports-First-Quarter-2026-Results
- https://www.sec.gov/Archives/edgar/data/0001324424/000132442426000031/earningsrelease-q12026.htm
- https://pitchgrade.com/companies/expedia
- https://www.financialcontent.com/article/finterra-2026-3-2-expedia-group-expe-from-tech-unification-to-b2b-powerhouse-2026-research-feature
- https://www.statista.com/topics/3363/expedia-inc/
- https://getlasso.co/affiliate/expedia/
- https://creator.expediagroup.com/commission-terms
- https://www.travelpayouts.com/en/offers/expedia-us-affiliate-program/
- https://help.affiliates.expediagroup.com/hc/en-us/articles/1500003709001-What-is-Partnerize-and-why-do-I-have-to-create-an-account-with-them
- https://signup.partnerize.com/signup/en/expedia
- https://partner.expediagroup.com/en-us/solutions/build-your-travel-experience/rapid-api
- https://developers.expediagroup.com/docs/api
- https://www.zentrumhub.com/blog/expedia-rapid-hotel-api-integration/
- https://partner.expediagroup.com/en-us/resources/blog/building-next-generation-of-b2b-travel-technology
- https://partner.expediagroup.com/en-us/solutions/build-your-travel-experience/travel-agent-affiliate-program
- https://travedeus.com/blog/marketing/what-is-expedia-taap
- https://travelclubreview.com/expedia-travel-agent-affiliate-program/
- https://www.trustpilot.com/review/www.expedia.com
- https://www.trustpilot.com/review/www.expedia.co.uk
