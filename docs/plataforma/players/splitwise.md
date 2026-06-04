# Splitwise

> **Categoria:** Divisao de despesas em grupo (group expense splitting / shared ledger fintech)
> _Perfil gerado por pesquisa multiagente (jun/2026). Parte do [Relatório de Mercado](../01-relatorio-de-mercado.md) e da [Matriz Competitiva](../02-matriz-competitiva.md)._

## 1. O que faz
Splitwise e um app/ledger compartilhado que registra quem pagou o que num grupo (viagem, republica, casal, jantar) e calcula automaticamente quem deve quanto a quem, simplificando dividas com algoritmo de netting. Suporta multiplas moedas no mesmo grupo, divisao por partes iguais/percentual/itens, e desde 2024 permite quitar dividas direto via Pay by Bank (open banking, parceria Tink) em alguns paises da Europa. Em early-2025 ja rastreava mais de US$100 bilhoes em despesas compartilhadas acumuladas e passou de 100 milhoes de downloads.

## 2. Público-alvo
Viajantes em grupo (mochileiros, amigos, casais em lua de mel), colegas de republica/moradia compartilhada, casais que dividem contas da casa e grupos sociais que dividem jantares e eventos. Forte entre millennials/Gen-Z digitalmente fluentes nos EUA, Reino Unido e Europa; emergente em B2B para gestores de imoveis e operadores de co-living.

## 3. Funcionalidades principais
- Registro de despesas com divisao igual, por percentual, por partes ou por item
- Algoritmo de simplificacao de dividas (netting) que minimiza o numero de transferencias no grupo
- Suporte a multiplas moedas no mesmo grupo (registro multimoeda gratis; conversao automatica e Pro)
- Grupos, amigos, comentarios e notificacoes de atividade
- Scan de recibo com OCR item-a-item (Pro)
- Quitacao via Pay by Bank / open banking com Tink (UK, FR, DE, AT) e integracoes Venmo/PayPal
- Graficos de gastos por categoria e ao longo do tempo (Pro)
- API self-serve OAuth para integracoes nao comerciais
- Splitwise Card (cartao para dividir gastos, mercado US)

## 4. Como monetiza
- Assinatura Splitwise Pro freemium: ~US$4,99/mes ou ~US$39,99-49,99/ano (remove anuncios, conversao de moeda automatica, OCR de recibo, limite de despesas removido) — estimado 25-30% da receita
- Publicidade in-app: banners segmentados de servicos financeiros, viagem e cartoes de credito, exibidos no tier gratuito em momentos de alta intencao
- Comissoes/referral de fintech: receita de parceiros no momento de 'settle up' (Pay by Bank via Tink, links de pagamento), capturando intencao financeira
- Receita acumulada estimada acima de US$25 milhoes/ano (2025); meta de EBITDA positivo no fim de 2025
- B2B licensing emergente para gestores de imoveis e co-living

## 5. Afiliados
Nao possui programa de afiliados tradicional aberto (nem proprio nem em redes como Awin, CJ, Impact, Partnerize ou Travelpayouts). Nao ha link/comissao publica para terceiros promoverem o Pro. A monetizacao 'tipo afiliado' acontece ao contrario: o PROPRIO Splitwise e quem recebe comissoes de parceiros fintech (Tink/Pay by Bank, processadores de pagamento) e de anunciantes (cartoes, viagem) no fluxo de quitacao. Para se associar, a unica via e parceria B2B/comercial direta via developers@splitwise.com.

## 6. API
Possui API. Documentada em dev.splitwise.com, segue OpenAPI v3, autenticacao via OAuth e API Key. Existem dois niveis: (1) API self-serve publica, gratuita, voltada a prototipagem e projetos pessoais/nao comerciais, com rate limits conservadores e numero limitado de usuarios conectaveis; (2) API privada/Enterprise sob licenca comercial negociada caso a caso. Permite ler/escrever usuarios, grupos, amigos, despesas, saldos, comentarios e ler categorias/moedas/notificacoes. NAO e GDS nem NDC. Restricao critica: os termos PROIBEM aplicacoes que repliquem ou compitam com o Splitwise.

## 7. Programa de parceiros
Nao ha programa de parceiros self-service publico com comissionamento. Parcerias sao estrategicas/B2B negociadas diretamente: o caso de referencia e a integracao com a Tink (open banking, Pay by Bank) iniciada em 2024 no UK e expandida em 2025 para Franca, Alemanha e Austria, que rendeu +150% em account checks e transacoes PIS. Tambem ha integracoes de pagamento com Venmo/PayPal. Onboarding de parceiro tecnico/comercial e via developers@splitwise.com.

## 8. Dados que oferece
- Despesas detalhadas por grupo (valor, pagador, divisao, categoria, moeda, data)
- Saldos liquidos quem-deve-quem com simplificacao de dividas
- Estrutura de grupos, membros e relacoes de amizade
- Historico/atividade e comentarios por despesa
- Conversao multimoeda com taxas mid-market (XE.com) no momento do lancamento
- Categorias e moedas de referencia via API
- Graficos de gasto por categoria e tendencia temporal (Pro)

## 9. Dados que NÃO oferece
- Roteiro de viagem ou itinerario dia-a-dia (nao planeja, so contabiliza o que ja foi gasto)
- Orcamento prospectivo / estimativa de custo total ANTES da viagem (so registra gasto realizado, sem framework de budget)
- Comparacao entre destinos ou recomendacao de para onde ir
- Precos de voos, hoteis, passeios ou inventario de viagem para compra
- Perfil de preferencias do viajante / personalizacao de recomendacao
- Sugestoes de o que fazer, restaurantes, atracoes (nao e guia)
- Previsao de gastos futuros com base em destino/duracao

## 10. Pontos fortes
- Lider de categoria com efeito de rede massivo: 100M+ downloads e marca quase sinonimo de 'dividir conta de viagem'
- Algoritmo de simplificacao de dividas e UX de lancamento de despesa muito polidos e confiaveis
- Multimoeda nativo no mesmo grupo com taxas mid-market (XE) — perfeito para viagem internacional
- Quitacao integrada via Pay by Bank/open banking (Tink) e Venmo/PayPal reduz friccao real de pagamento
- Cross-platform solido (iOS, Android, web, desktop) com sync confiavel
- Caso de uso de viagem em grupo extremamente forte e recorrente (alta intencao no pos-decisao da viagem)

## 11. Pontos fracos
- Monetizacao agressiva recente gerou backlash: limite de ~3 despesas/dia no tier gratuito mais cooldown de 10s para adicionar 1 despesa
- Recursos antes gratuitos (scan de recibo, conversao de moeda) foram movidos para o paywall sem aviso, irritando base leal
- Escopo limitadissimo: so contabiliza gasto passado — nao planeja, nao orca, nao recomenda nada
- Sem qualquer camada de IA/recomendacao ou inteligencia de viagem
- API self-serve fraca para uso comercial (rate limits baixos) e termos que proibem apps concorrentes
- Anuncios no tier gratuito degradam experiencia; percepcao de 'ficou ganancioso'

## 12. Reclamações comuns dos usuários
- 'Paywall surpresa': limite de 2-3 despesas por dia no gratuito, com muitos migrando para alternativas (Tricount, Spliit, GoodShare, Splitty)
- Cooldown de 10 segundos para adicionar uma unica despesa e visto como artificial e punitivo
- Scan/anexo de recibo, que era gratis, agora exige Pro — considerado contra-intuitivo
- Percepcao de 'greed'/ganancia: features essenciais bloqueadas atras de assinatura sem comunicacao previa
- Anuncios intrusivos de servicos financeiros no tier gratuito
- Conversao de moeda travada no Pro frustra justamente o publico de viagem internacional

## 13–19. Limitações
| Eixo | Limitação |
|---|---|
| **UX** | UX de lancamento de despesa e excelente, MAS o tier gratuito foi deliberadamente degradado: limite de ~3 despesas/dia, cooldown de 10s por lancamento e banners de anuncio. Isso cria friccao artificial num app que o usuario abre justamente em momentos rapidos (na hora de pagar a conta). A experiencia 'limpa' agora exige pagar. |
| **Personalização** | Praticamente nula. Nao ha perfil do viajante, preferencias, estilo de viagem ou qualquer adaptacao por usuario. O app trata todos igual — e uma calculadora de divisao, nao um produto personalizado. Nenhuma nocao de quem e o viajante alem de nome e moeda-base. |
| **IA** | Sem IA real de produto. O 'algoritmo' e netting de dividas (otimizacao matematica simples) e OCR de recibo (Pro). Nao ha recomendacao, previsao de gasto, sugestao inteligente nem assistente. Zero camada generativa ou preditiva. |
| **Roteirização** | Inexistente. Splitwise nao tem nenhum conceito de roteiro, itinerario, dias, atracoes ou sequencia de viagem. Ele entra DEPOIS que a viagem ja esta acontecendo, apenas para contabilizar gastos. Nao ajuda a decidir o que fazer nem a montar dias. |
| **Orçamento** | Critica e estrategica: Splitwise so registra gasto JA realizado e nao oferece framework de orcamento prospectivo. O proprio mercado aponta que 'ele faz a conta mas nao da um budget' — o usuario precisa estimar e monitorar o orcamento total da viagem por fora. Nao estima custo de uma viagem antes dela acontecer. |
| **Comparação** | Nenhuma capacidade de comparar destinos, datas, custos esperados ou cenarios. Ele lida com um unico grupo/viagem ja em curso e nao ajuda na decisao de 'Peru vs Tailandia' ou 'quanto custaria cada opcao'. Comparacao de destinos esta totalmente fora do escopo. |
| **Integração** | Integracao tecnica e POSSIVEL mas restrita: API self-serve OAuth tem rate limits baixos e os termos proibem apps que 'repliquem ou compitam'. Para uso comercial serio exige licenca privada negociada (developers@splitwise.com). Nao ha deeplink de afiliado padronizado nem programa publico — integracao depende de relacao B2B. Risco: como ele tambem captura intencao financeira, pode ver um app de plan |

## 20. Oportunidades para superá-lo
- Cobrir o ANTES da viagem (planejamento, orcamento prospectivo, comparacao de destinos) onde Splitwise nao atua — ele so cobre o 'durante/depois' contabil
- Oferecer orcamento total realista por destino com IA, exatamente o framework de budget que ele admite nao ter
- Manter divisao de despesas BASICA gratuita e sem cooldown/limite, capturando os usuarios revoltados com o paywall agressivo (Tricount, GoodShare ja fazem isso)
- Adicionar super-perfil do viajante e recomendacao por IA, camada que Splitwise nao tem nem sinaliza ter
- Posicionar Splitwise como ferramenta complementar de quitacao (deeplink/handoff) enquanto NOS somos o cerebro de decisao e orcamento — ele vira utilitario, nos viramos a plataforma
- Capturar a comissao de viagem (voos/hoteis/passeios) que Splitwise nao monetiza, ja que ele so monetiza no fluxo de pagamento P2P

---

## Matriz (visão Mundo Sem Fim)
| Critério | Avaliação |
|---|---|
| Força principal | Padrao de mercado em divisao de despesas em grupo (100M+ downloads, marca = 'dividir conta de viagem'), com UX confiavel, multimoeda nativo e quitacao via open banking. |
| Fraqueza principal | Escopo puramente contabil e retroativo: nao planeja, nao orca antes, nao recomenda, nao compara destinos, sem IA — e degradou o gratuito com limites/anuncios, gerando exodo de usuarios. |
| Modelo de receita | Freemium: Pro ~US$4,99/mes ou ~US$40-50/ano (~25-30% da receita) + anuncios segmentados (financas/viagem/cartoes) + comissoes/referral de fintech no 'settle up' (Tink/Pay by Bank, Venmo/PayPal) + B2B licensing emergente. Receita ~US$25M+/ano. |
| Possui API? | Sim (parcial para nos). Self-serve OAuth/OpenAPI gratuita com rate limits baixos e termos que PROIBEM apps concorrentes; uso comercial exige licenca privada via developers@splitwise.com. |
| Possui afiliados? | Nao. Sem programa de afiliado/comissao publico (nenhuma rede). Inverso: e o Splitwise quem recebe comissao de parceiros fintech/anunciantes. Parceria so via B2B direto. |
| Pode virar parceiro? | Sim, mas apenas via acordo B2B/comercial negociado (e-mail developers@splitwise.com); nao ha onboarding self-service. Possivel risco de ser visto como semi-concorrente no fluxo de pagamento. |
| Pode pagar comissão? | Nao para nos como afiliados (ele nao paga comissao a terceiros). No maximo um acordo de revenue-share comercial sob contrato; o fluxo natural de comissao e ele recebendo, nao pagando. |
| Pode receber tráfego? | Sim. Faz total sentido mandar trafego/handoff pra ele: nosso usuario, depois de DECIDIR e planejar a viagem, precisa dividir despesas em grupo — podemos fazer deeplink/handoff pro Splitwise no momento certo. |
| Pode ser integrado? | Parcial. Via API self-serve (limitada) ou deeplink/handoff para divisao de despesas. Integracao profunda/comercial precisa de licenca privada. Sem afiliado, a integracao seria por valor de produto, nao por receita direta. |
| **O que precisamos ter p/ superar** | Divisao de despesas em grupo nativa, gratuita e sem friccao (sem limite diario nem cooldown), com multimoeda e taxas mid-market — para nao perder o usuario pro Splitwise nesse momento; e idealmente quitacao via open banking/links de pagamento, capturando o 'settle up' que e a parte que Splitwise monetiza. |

## Fontes consultadas
- https://www.splitwise.com/pro
- https://www.splitwise.com/subscriptions/new
- https://www.areweeven.com/blog/splitwise-free-vs-pro-2026
- https://splittyapp.com/learn/splitwise-free-limits/
- https://www.itvoice.in/splitwise-has-introduced-restrictions-on-the-number-of-free-expenses-users-can-add
- https://businessmodelcanvastemplate.com/blogs/how-it-works/splitwise-how-it-works
- https://www.ainvest.com/aime/share/splitwise-money-b3f5a9/
- https://dev.splitwise.com/
- https://github.com/splitwise/api-docs
- https://tink.com/press/splitwise-tink-partner/
- https://fintech.global/2025/10/20/splitwise-and-tink-expand-pay-by-bank-across-europe/
- https://www.pymnts.com/news/payment-methods/2024/tink-teams-with-splitwise-to-offer-pay-by-bank/
- https://x.com/ArtemR/status/1740150704268849568
- https://www.trustpilot.com/review/splitwise.com
- https://www.androidcentral.com/apps-software/the-app-splitwise-is-the-best-hack-to-split-group-trip-expenses-in-2026
- https://www.alibaba.com/product-insights/step-by-step-guide-to-using-splitwise-for-group-travel-expenses-across-5-currencies-and-8-people.html
- https://avantstay.com/blog/best-apps-planning-splitting-costs-group-vacation/
