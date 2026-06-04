# Booking.com

> **Categoria:** OTA (Online Travel Agency) / Marketplace de hospedagem com expansao para Connected Trip (voos, carros, atracoes, taxis)
> _Perfil gerado por pesquisa multiagente (jun/2026). Parte do [Relatório de Mercado](../01-relatorio-de-mercado.md) e da [Matriz Competitiva](../02-matriz-competitiva.md)._

## 1. O que faz
Maior OTA de hospedagem do mundo (parte da Booking Holdings). Agrega ~29-30 milhoes de listagens (hoteis, pousadas, apartamentos, casas) em 60.000+ destinos e intermedia a reserva entre o viajante e o fornecedor. Desde ~2018 expande para Connected Trip: voos, alugueis de carro, atracoes/ingressos, taxis e seguros, querendo virar o balcao unico ponta-a-ponta da viagem. Em 2025 faturou US$ 26,9 bi de receita (+13%) sobre US$ 186,1 bi de reservas brutas (+12%), com EBITDA ajustado de US$ 9,9 bi.

## 2. Público-alvo
Viajante mainstream global de lazer (e parte de corporativo via Booking.com for Business), faixa ampla mas com forte penetracao Europa/Asia; cada vez mais focado em Gen Z/Millennials (~40% do mercado de viagens em 2026) via app e IA. Do lado da oferta: hoteleiros independentes, redes, gestores de short-term rental e fornecedores de voos/carros/atracoes. Do lado de parceiros: afiliados (sites, blogs, criadores, apps), agencias e metabuscadores.

## 3. Funcionalidades principais
- Busca e filtro de hospedagem com disponibilidade e preco em tempo real (29-30 mi de listagens)
- Avaliacoes verificadas (somente quem reservou e se hospedou pode avaliar) e nota agregada
- Genius: programa de fidelidade em 3 niveis (descontos 10-20%, cafe/upgrade, beneficios vitalicios que nao expiram)
- Connected Trip: voos (+37% YoY, US$ 16,8 bi em 2025), carros, atracoes/ingressos, taxis e seguro de viagem no mesmo fluxo
- AI Trip Planner (LLM via API da OpenAI/ChatGPT) para inspiracao de destino, montagem de roteiro e recomendacao de hospedagem
- Recursos agenticos 2025: Smart Messenger, Auto-Reply e gestao de disrupcoes (cancelamento de voo) em tempo real
- Pagamento facilitado (modelo merchant): processa o cartao, oferece 'Reserve agora, pague depois' e cancelamento gratis em muitas tarifas
- Apps iOS/Android com push, mapa, gestao de reservas e atendimento in-app
- Booking.com for Business (viagem corporativa) e Travel Articles/conteudo de destino para SEO

## 4. Como monetiza
- Comissao de hospedagem (core): tipicamente 15-20% sobre o valor da reserva no modelo agency; ~15% e a taxa mais comum, podendo cair a ~12% em sazonais de baixa demanda
- Modelo merchant (Booking processa o pagamento) ja e MAIOR que o agency: ~US$ 13,5 bi vs ~US$ 6,2 bi de receita nos 9 meses de 2025 (~2,2x). Inclui comissao + receita liquida de transacao + rebates de processamento de cartao + taxas ao cliente
- Programa Preferred / Preferred Plus: hotel paga ~+3 pontos percentuais de comissao para ganhar destaque e melhor ranking nos resultados
- Sponsored/CPC ads (visibilidade leiloada) e Booking Sponsored Benefit, alem de receita de exibicao
- Take rate efetivo da Booking Holdings em torno de ~14-15% das reservas brutas (US$ 26,9 bi receita / US$ 186,1 bi GBV em 2025)
- Voos majoritariamente no modelo agency (margem fina por bilhete) — volume estrategico de aquisicao de cliente, nao margem
- Ancillaries: seguro de viagem, taxas de servico e spread de cambio/FX no pagamento facilitado

## 5. Afiliados
SIM. Programa robusto e maduro, gerido principalmente pela rede PROPRIA (Booking.com Partner Centre / Demand Partner Program), com presenca tambem em redes terceiras Awin e CJ Affiliate. Comissao TIPICA: 4% sobre estadias de hospedagem concluidas, 6% sobre alugueis de carro, 4% em atracoes e ~EUR/GBP 2 por bilhete de voo. Estrutura em TIERS (quanto maior o volume mensal, maior o %). Mecanicamente, o afiliado recebe 25-40% da margem da Booking (que e ~15%), resultando em ~4-5,5% efetivo do valor da reserva para a maioria. Cookie de 30 dias; comissao so confirma APOS o check-out do hospede; pagamento mensal, ~30-60 dias depois do mes de check-out. ALERTA: em maio/2025 ocorreu o 'Bookinggeddon' — a Booking encerrou (30 dias de aviso) milhares de pequenos afiliados, inclusive parceiros de 10+ anos e quem fazia 250+ reservas/ano, parte do corte de custos de US$ 400-450 mi; novos/pequenos sao redirecionados para Awin/CJ.

## 6. API
SIM, multiplas. (1) Demand API (developers.booking.com) — RESTful/JSON, autenticacao por X-Affiliate-Id + token, para Managed Affiliate Partners: busca de hospedagem/carros/voos, disponibilidade, detalhes, reviews, criar/cancelar/modificar pedidos e relatorios. (2) API V3 via Partnerships Hub. (3) Messaging API. Tambem deep links de afiliado para casos sem integracao profunda. NAO e GDS classico; conectividade de hotel/NDC para voos roda nos bastidores via parceiros. O acesso a Demand API e gated: exige aprovacao como parceiro gerenciado (nao e auto-servico aberto para qualquer dev pequeno).

## 7. Programa de parceiros
Tres trilhas distintas: (1) Partner Hub / 'Booking.com for Partners' para hoteleiros e fornecedores (extranet, gestao de tarifas, Preferred Program, anuncios). (2) Affiliate Partner Program (Partner Centre proprio + Awin/CJ) para sites/apps/criadores monetizarem trafego. (3) Connectivity/Channel Manager partners e Demand API para integradores tecnicos e revendedores. Co-fundador/exec sinalizou (2024-25) que operar afiliacao em escala ficou complexo (custo, fraude, compliance), empurrando parceiros menores para redes terceiras enquanto retem os grandes em gestao direta.

## 8. Dados que oferece
- Inventario de hospedagem em tempo real: preco, disponibilidade, tipo de quarto, politicas de cancelamento (via Demand API)
- Detalhes ricos de propriedade: fotos, comodidades, localizacao/geo, descricoes
- Avaliacoes verificadas e nota agregada por propriedade
- Disponibilidade e detalhes de carros (depots, fornecedores) e busca de voos/atracoes
- Gestao de pedidos (criar, prever, consultar, cancelar, modificar) e relatorios de orders
- Deep links e widgets de afiliado para redirecionar trafego monetizado

## 9. Dados que NÃO oferece
- Custo TOTAL realista da viagem (nao soma transporte+comida+atividades+cambio+impostos locais num orcamento unico)
- Roteiro dia-a-dia estruturado e logistico (so inspiracao via AI Trip Planner, nao um plano otimizado por geografia/tempo)
- Comparacao lado-a-lado de DESTINOS por criterio (seguranca, clima, custo de vida, visto) — e busca por propriedade, nao por decisao de para onde ir
- Super-perfil persistente e portavel do viajante (preferencias ficam presas no ecossistema Booking, sem export)
- Precos de fornecedores concorrentes/diretos do hotel (justamente o que as clausulas de paridade historicamente bloquearam)
- Dados de custo de vida local, transporte publico e despesas fora-da-plataforma
- Comissoes/precos crus para terceiros sem aprovacao como parceiro gerenciado (Demand API e gated)

## 10. Pontos fortes
- Escala e liquidez de inventario imbativeis: ~29-30 mi de listagens, US$ 186,1 bi em reservas brutas 2025
- Marca de altissima confianca para o ato de RESERVAR + conversao altissima (afiliados se beneficiam disso)
- Pagamento facilitado (merchant) ja maior que agency — controla a transacao, oferece pay-later e cancelamento gratis
- Genius vitalicio cria lock-in de demanda recorrente (status nao expira -> usuario sempre volta)
- Connected Trip ganhando traçao: voos +37% YoY, transacoes multi-vertical +30% YoY
- Investimento pesado e cedo em IA (AI Trip Planner com OpenAI, agentes, integracao com ChatGPT)
- Maquina de SEO/marketing de performance e bolso profundo (EBITDA aj. US$ 9,9 bi) para dominar leilao de trafego
- API de demanda + programa de afiliados maduro = canal real de monetizacao para quem manda trafego

## 11. Pontos fracos
- Atendimento ao cliente muito criticado: reembolsos que levam 71+ dias, muros de IA que impedem falar com humano
- Risco regulatorio/legal alto: 10.000+ hoteis em acao coletiva por paridade; Berlin (dez/2025) condenou; DMA forcou remocao da paridade
- Relacao desgastada com a base de oferta (hoteis reclamam de comissao alta e supressao da reserva direta)
- Confianca dos afiliados abalada pos-'Bookinggeddon' (maio/2025) — risco de descontinuar parceiro a qualquer momento
- Experiencia centrada em TRANSACAO, nao em PLANEJAMENTO/decisao — fraca para 'pra onde vou e quanto custa tudo'
- Roteiro/IA ainda raso (inspiracao generica), preso a vender estoque proprio, nao a otimizar a viagem do usuario
- Reclamacoes de reservas 'fantasma'/overbooking e hospedagem diferente do anunciado
- Dependencia de marketing pago caro; pressao de margem e cortes de custo (US$ 400-450 mi)

## 12. Reclamações comuns dos usuários
- Reembolsos demoram demais — relatos de 71+ dias vs ~2 semanas de concorrentes; dinheiro retido em cancelamentos
- Impossivel falar com humano: sistemas de IA bloqueiam o contato, respostas automaticas em loop
- Reservas que 'somem' ou nao existem na chegada (overbooking / propriedade nao reconhece a reserva)
- Hospedagem muito diferente do anunciado (fotos/comodidades enganosas) e sem suporte quando da errado
- Em voos, joga a culpa nas cias aereas e nao resolve; reembolsos de passagem parados por meses
- Cobrancas e taxas inesperadas no pagamento facilitado; disputas de cartao dificeis
- Hoteis (lado B2B): comissoes altas, ranking dependente de pagar Preferred, paridade forcando preco

## 13–19. Limitações
| Eixo | Limitação |
|---|---|
| **UX** | UX otimizada para CONVERTER em reserva, com tatica de urgencia/escassez agressiva ('so resta 1', 'reservado 5x hoje', riscado de preco) que gera desconfianca e fadiga de decisao. O fluxo e bom para quem JA sabe destino e datas, mas pessimo para explorar/decidir. Pos-venda e o ponto fraco grave: muro de IA, dificuldade de achar humano, gestao de problema frustrante. |
| **Personalização** | Personalizacao existe mas e a servico de VENDER estoque (recomendar hotel/deal por comportamento passado), nao de entender o viajante como pessoa. Nao ha super-perfil persistente e portavel: preferencias ficam presas no ecossistema, sem export, sem um 'DNA do viajante' que orquestre a viagem inteira de forma neutra entre fornecedores. |
| **IA** | AI Trip Planner e parcialmente LLM (API OpenAI/ChatGPT) sobre os modelos da casa, mas com conflito de interesse estrutural: a IA empurra o que a Booking monetiza, nao o melhor roteiro neutro. Forte em inspiracao/conversa e disrupcao operacional (Smart Messenger), fraca em raciocinio de planejamento real (logistica, custo total, trade-offs de destino). Agentes ainda nascentes em 2025-26. |
| **Roteirização** | Nao entrega roteiro dia-a-dia logistico e otimizado. O AI Trip Planner sugere ideias e lugares, mas nao monta uma sequencia eficiente por geografia/tempo/horario de funcionamento, nem amarra hospedagem+transporte+atividades num plano executavel. Roteirizacao seria e estruturada nao e o produto — o produto e a reserva. |
| **Orçamento** | Mostra preco da hospedagem (e, no Connected Trip, de voo/carro), mas NAO calcula o custo TOTAL realista da viagem: nao soma comida, transporte local, atividades, cambio, taxas/impostos locais, gorjetas ou imprevistos. Nao existe 'modo orcamento' que diga 'esta viagem custa X no total e cabe no seu budget'. O foco e o ticket da reserva, nao o custo de viver a viagem. |
| **Comparação** | Compara PROPRIEDADES dentro de um destino, nao DESTINOS entre si. Nao ajuda a decidir 'Peru x Tailandia x Portugal' por custo total, clima, seguranca, visto, tempo de voo, vibe. Alem disso, historicamente as clausulas de paridade suprimiram a exibicao de precos mais baratos do hotel/concorrentes — comparacao verdadeiramente neutra nunca foi do interesse da plataforma. |
| **Integração** | Tecnicamente integravel via Demand API (REST/JSON, X-Affiliate-Id), API V3, deep links e redes Awin/CJ — bom para PUXAR inventario e MANDAR trafego monetizado. POReM: acesso a Demand API e gated (exige aprovacao como parceiro gerenciado), e o 'Bookinggeddon' de 2025 mostrou risco de plataforma — pequenos parceiros podem ser cortados com 30 dias de aviso. Integracao = sim, mas com dependencia e ris |

## 20. Oportunidades para superá-lo
- Ser a camada NEUTRA de DECISAO/PLANEJAMENTO (pra onde ir, quanto custa tudo, qual roteiro) e usar a Booking so como motor de reserva no fim — invertendo o jogo: nos somos o topo do funil
- Entregar CUSTO TOTAL realista (transporte+comida+atividades+cambio+local) que a Booking estruturalmente nao calcula
- Comparacao real de DESTINOS por criterio (seguranca, clima, visto, custo de vida) — algo que OTA centrada em propriedade nao faz
- Roteiro dia-a-dia logistico e otimizado de verdade, sem vies de empurrar estoque proprio
- Super-perfil portavel e neutro do viajante (o 'DNA' que a Booking nao oferece e prende no ecossistema)
- Atendimento/relacao humana e transparencia como contraposicao ao muro de IA e reembolsos de 71 dias
- Captar viajante 6-12 meses ANTES da reserva (fase de sonho/decisao), quando a Booking ainda nao entrou, e monetizar via afiliado/Demand API no momento da conversao
- Posicionamento anti-dark-pattern: sem urgencia falsa, transparente sobre preco e taxas — confianca como diferencial

---

## Matriz (visão Mundo Sem Fim)
| Critério | Avaliação |
|---|---|
| Força principal | Escala e liquidez de inventario de hospedagem (~29-30 mi de listagens, US$ 186 bi em reservas) + marca de confianca para RESERVAR + altissima conversao. E o motor de reserva default do planeta. |
| Fraqueza principal | E uma maquina de TRANSACAO, nao de DECISAO/PLANEJAMENTO: nao da custo total realista, nao compara destinos, nao roteiriza de verdade e tem pos-venda/atendimento muito criticado. O topo do funil (sonho/decisao) esta descoberto. |
| Modelo de receita | Comissao de hospedagem 15-20% (agency) + modelo merchant ja maior (~2,2x: ~US$ 13,5 bi vs ~US$ 6,2 bi em 9M/2025) com pagamento facilitado, Preferred (+~3pp), ads/CPC e ancillaries. Take rate efetivo ~14-15% do GBV. |
| Possui API? | Sim — Demand API (REST/JSON, X-Affiliate-Id), API V3, Messaging API e deep links. Mas acesso gated (aprovacao como parceiro gerenciado). |
| Possui afiliados? | Sim — rede propria (Partner Centre) + Awin + CJ. Tipico: 4% hospedagem, 6% carros, 4% atracoes, ~EUR2/voo; tiers por volume; cookie 30 dias; paga apos check-out. Risco: 'Bookinggeddon' cortou milhares em 2025. |
| Pode virar parceiro? | Sim — como afiliado (Awin/CJ ou direto) e, com aprovacao, como Managed Demand Partner via API. Caminho realista de receita para nos. |
| Pode pagar comissão? | Sim — paga ~4-5,5% efetivo do valor da reserva ao afiliado (25-40% da margem dele) sobre estadias concluidas; 6% em carros. Modelo CPA pos-checkout. |
| Pode receber tráfego? | Sim — nosso app pode MANDAR trafego/leads qualificados (viajante ja com destino+datas+budget decididos) e capturar comissao no clique de reserva. |
| Pode ser integrado? | Parcial — via Demand API/API V3 (gated), deep links e Awin/CJ. Da pra puxar inventario/preco e enviar trafego, mas com dependencia de aprovacao e risco de descontinuacao de parceiro. |
| **O que precisamos ter p/ superar** | Para vencer a Booking onde ela e forte (reservar com confianca), precisamos: (1) cobertura/preco de hospedagem confiavel via integracao (Demand API/afiliado) para o usuario nao precisar sair do nosso app; (2) transparencia radical de preco e taxas (anti-dark-pattern) para ganhar a confianca que o atendimento dela perde; (3) ser o topo do funil — perfil + custo total + comparacao de destino + rotei |

## Fontes consultadas
- https://www.sec.gov/Archives/edgar/data/0001075531/000107553125000050/q3-25bkngearningsrelease.htm
- https://www.phocuswire.com/booking-holdings-q4-full-year-2025-earnings
- https://www.travelweekly.com/Travel-News/Travel-Technology/Booking-Holdings-q4-call-connected-trip
- https://www.stocktitan.net/sec-filings/BKNG/10-k-booking-holdings-inc-files-annual-report-7fb6c3d1394a.html
- https://hotelub.fr/en/commissions-booking-com-the-exact-calculation-for-property-owners/
- https://www.altexsoft.com/blog/agency-model/
- https://www.booking.com/affiliate-program/v2/index.html
- https://partnerships.booking.com/
- https://affiliates.support.booking.com/kb/s/article/Commission-and-Payments
- https://reacheffect.com/blog/how-much-does-booking-com-pay-affiliates/
- https://mize.tech/blog/all-about-the-booking-com-affiliate-partner-program-for-travel-agents/
- https://www.awin.com/us/advertisers/partner/booking.com
- https://www.cj.com/en-gb/publisher/partners/booking.com
- https://developers.booking.com/demand/docs/open-api/demand-api
- https://partnerships.booking.com/api-v3
- https://news.booking.com/bookingcom-launches-new-ai-trip-planner-to-enhance-travel-planning-experience/
- https://news.booking.com/bookingcom-debuts-agentic-ai-innovations-adding-to-its-robust-suite-of-genai-tools-for-customers/
- https://www.hoteldive.com/news/chatgpt-travel-planning-booking/654104/
- https://www.hospitality.today/article/booking-coms-new-genius-push-reshapes-loyalty-expectations
- https://www.hotel-online.com/news/why-10000-hotels-are-suing-booking-com-over-rate-parity-rules
- https://www.mylighthouse.com/resources/blog/booking-vs-berlin-court-rate-parity
- https://news.booking.com/legal-claims-parity-class-actions/
- https://www.trustpilot.com/review/www.booking.com
- https://tripian.com/what-is-booking-coms-ai-trip-planner-strategy/
