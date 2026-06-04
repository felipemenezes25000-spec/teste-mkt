# Wise (ex-TransferWise)

> **Categoria:** Cambio / Conta multimoeda / Fintech de pagamentos transfronteiricos (FX para viajantes e negocios)
> _Perfil gerado por pesquisa multiagente (jun/2026). Parte do [Relatório de Mercado](../01-relatorio-de-mercado.md) e da [Matriz Competitiva](../02-matriz-competitiva.md)._

## 1. O que faz
Wise e uma fintech britanica (listada na LSE, ex-TransferWise) de transferencias internacionais e conta multimoeda. Permite enviar/receber dinheiro em mais de 40 moedas pela taxa media de mercado (mid-market) com fee pequeno e transparente, manter saldos em varias moedas, receber dados de conta locais (USD, EUR, GBP, AUD etc.) e usar um cartao de debito Wise para gastar no exterior na cotacao real. Nao e agencia de viagem nem OTA: e a camada de cambio/pagamento que o viajante usa ANTES e DURANTE a viagem. Em 2025/2026 tambem opera o Wise Platform, infraestrutura de pagamentos B2B vendida a bancos e fintechs (Nubank, Capitec, MBSB etc.).

## 2. Público-alvo
Viajantes internacionais frequentes, nomades digitais, expatriados, freelancers/PMEs que recebem em moeda estrangeira, estudantes no exterior e pessoas que enviam remessas. Secundariamente, bancos/fintechs/marketplaces que querem embutir cambio (via Wise Platform). Forte entre publico tech-savvy/global; em PT-BR cresce via Nubank e brasileiros que viajam/ganham em dolar/euro.

## 3. Funcionalidades principais
- Transferencia internacional na taxa mid-market com fee upfront (~0,33%-0,65% conforme corredor)
- Conta multimoeda com saldo em 40+ moedas
- Dados de conta locais em ate ~9-10 moedas (USD/EUR/GBP/AUD/etc.) para receber como local
- Cartao de debito Wise (Visa/Mastercard) para gasto e saque no exterior na cotacao real
- Saques em ATM com cota mensal isenta (ex.: ~250 USD/mes) e fee acima disso
- Conversao instantanea entre moedas dentro do app
- Wise Assets/Interest: render saldo (em mercados elegiveis) ou stocks
- Pagamentos em lote e multiusuario (Wise Business)
- Wise Platform: API B2B para bancos/fintechs embutirem pagamentos cross-border
- API de afiliado para taxas e cotacoes ao vivo
- Alertas de cotacao e travas de taxa por tempo limitado no quote

## 4. Como monetiza
- Fee de conversao cambial (principal): markup pequeno sobre a mid-market, ~0,33%-0,65% por corredor; take rate medio reportado ~0,62% sobre o volume cross-border (FY24/25)
- Fee fixo + percentual por transferencia, cobrado upfront
- Interchange do cartao: comissao do merchant via bandeira a cada gasto no cartao Wise
- Receita de juros sobre saldos de clientes (income de juros acima de 1% subiu ~50% para ~£230,2M no H1 FY2025)
- Saques em ATM acima da cota: ex. ~1,95 USD + 1,95% por saque alem do limite isento
- Fee de conversao em saque de moeda nao mantida no saldo
- Wise Platform (B2B): receita de licenciamento/uso da infraestrutura por bancos e fintechs
- Wise Assets/Interest: spread/fee sobre saldo rentabilizado e produtos de stocks (mercados elegiveis)

## 5. Afiliados
Sim. Programa proprio "Wise Partnerships / PartnerWise" operado pela rede Partnerize (cadastro em signup.partnerize.com/signup/en/wise). Comissao tipica CPA: ~£10 (ou equivalente na moeda) por novo usuario PESSOAL verificado que conclui uma transacao cross-currency, e ~£50 por nova conta BUSINESS que faz transacao cross-currency. Cookie "lifetime" (sem expiracao declarada; agregadores citam ate 365 dias / vitalicio). Pagamento no inicio do mes seguinte, sacavel para banco ou conta Wise em GBP/USD/EUR/AUD/JPY. Parceiros com 50+ clientes pagantes/mes negociam taxa custom via partnerwise@wise.com. Trilhas separadas para influenciadores e parcerias business (Typeform).

## 6. API
Sim, dois niveis. (1) API de AFILIADO/comparacao: endpoints GET /v1/rates (taxas ao vivo) e POST /v2/quotes (preco, fee, prazo estimado) — exige aprovacao como afiliado e credenciais via partnerwise@wise.com; Basic Auth; ambientes sandbox (api.wise-sandbox.com) e live (api.transferwise.com); traz SO as taxas da Wise (nao compara concorrentes). (2) Wise Platform / Wise Business API: API de PARCEIRO/embedded para bancos, fintechs e empresas (travel/marketplace/workforce) enviarem, receberem e gastarem cross-border — integracao com suporte dedicado, contas de parceiro e KYC. Nao e GDS/NDC (irrelevante; nao e inventario de viagem). Nao ha API publica aberta self-service para qualquer dev sem aprovacao.

## 7. Programa de parceiros
Tres camadas: (a) Afiliados/criadores via Partnerize (CPA £10 pessoal / £50 business). (b) Wise Platform: parcerias B2B com bancos e fintechs para embutir pagamentos (clientes Nubank, Capitec, Allica, MBSB; +13 parceiros novos no ultimo ano segundo a empresa); inclui setor de travel. (c) Parcerias business/enterprise diretas via partnerwise@wise.com e Typeform para volumes altos e termos customizados.

## 8. Dados que oferece
- Taxas de cambio ao vivo (mid-market) por par de moedas via GET /v1/rates
- Cotacoes com fee, prazo de entrega e metodo de pagamento via POST /v2/quotes
- Custo real de gastar/sacar no exterior (cotacao + fee transparente)
- Limites de gasto e saque do cartao e cota ATM isenta por mes
- Dados de conta locais para receber como local em varias moedas
- Comparativo proprio Wise vs bancos (markup escondido) em conteudo de marketing
- Infraestrutura de pagamento cross-border (via Wise Platform) para parceiros

## 9. Dados que NÃO oferece
- Precos de voos, hoteis, carros ou qualquer inventario de viagem
- Roteiros, atracoes, custo de vida ou orcamento total de uma viagem
- Comparacao de cotacoes de CONCORRENTES (API so retorna taxas da propria Wise)
- Recomendacao de destino ou conteudo de planejamento
- Previsao de gasto da viagem por categoria (so o custo do cambio/saque)
- Dados de perfil de viajante ou preferencias de viagem
- API publica aberta de cotacao sem aprovacao previa de afiliado

## 10. Pontos fortes
- Cotacao mid-market real com fee transparente — referencia de mercado para 'cambio justo'
- Marca global confiavel, listada em bolsa, lucrativa ha varios anos
- Cartao multimoeda excelente para viagem: gasto e saque na cotacao real com cota ATM isenta
- Conta multimoeda com dados locais para receber como nativo em varias moedas
- Programa de afiliado claro e atrativo (CPA fixo £10/£50, cookie longa, payout flexivel)
- API de afiliado simples (rates + quotes) facil de integrar para mostrar custo de cambio
- Wise Platform abre porta para parceria B2B/embedded de pagamentos
- Conversao instantanea e UX de app muito bem avaliada na operacao normal

## 11. Pontos fracos
- Nada de planejamento de viagem: e cambio puro, nao decide destino, roteiro nem orcamento
- API de comparacao mostra so as proprias taxas — nao serve para comparar players
- Acesso a API depende de aprovacao manual (partnerwise@wise.com), nao e self-service
- Suporte reativo e lento em casos de problema (respostas reportadas em ~7 dias)
- Contas congeladas/desativadas sem aviso claro geram forte atrito de confianca
- Render/juros sobre saldo so em mercados elegiveis (restricoes regulatorias)
- Mudancas de estrutura de fee de ATM (a partir de mai/2026) podem reduzir vantagem de saque
- Sem programa de fidelidade/cashback robusto comparado a alguns concorrentes de cartao

## 12. Reclamações comuns dos usuários
- Contas bloqueadas ou desativadas sem aviso ou explicacao, com fundos retidos por periodos longos (Trustpilot/ConsumerAffairs, casos atualizados ate abr/2026)
- Suporte lento — tempo medio de resposta reportado em torno de 7 dias em casos de hold
- Usuario desativado apos 6 anos de conta com apelacao nao revisada
- Percepcao de que reviews 1-estrela sao removidas do Trustpilot (disputa sobre moderacao)
- Verificacao/KYC e pedidos de documentos repetidos que travam transacoes urgentes
- Limites de gasto/saque do cartao surpreendendo usuarios em viagem
- Conversao extra ao sacar em moeda nao mantida no saldo pega usuarios desavisados

## 13–19. Limitações
| Eixo | Limitação |
|---|---|
| **UX** | UX do app e bem avaliada para o fluxo normal (cambio, cartao, saldo), mas e uma jornada puramente financeira: zero contexto de viagem. O usuario chega ja sabendo quanto e para onde vai; a Wise nao ajuda a decidir nada. Quando algo da errado (hold/KYC), a UX colapsa em filas de suporte lentas e telas de verificacao sem previsibilidade — o ponto fraco de experiencia nao e a tela, e o atendimento em  |
| **Personalização** | Personalizacao e financeira (moedas que voce usa, alertas de taxa), nao de viajante. Nao existe perfil de viagem, preferencias de destino, estilo de viagem ou historico de itinerarios. A Wise nao sabe se voce e mochileiro ou luxo — so sabe seus corredores de moeda. Logo, nao adapta nada ao objetivo da viagem, so ao fluxo de dinheiro. |
| **IA** | Sem camada de IA voltada a decisao de viagem. Pode haver automacao/risco/antifraude e otimizacao de roteamento de pagamento nos bastidores, mas nada de IA conversacional que recomende destino, monte roteiro ou estime custo total. A 'inteligencia' da Wise e operacional (roteamento, compliance), nao de planejamento. |
| **Roteirização** | Inexistente. Wise nao roteiriza viagem nem nada turistico — nao tem nocao de dias, cidades, atracoes ou logistica. O unico 'roteamento' e o de pagamento (qual conta-pool usar para liquidar a transferencia), que e invisivel ao usuario e irrelevante para planejamento. |
| **Orçamento** | Cobre apenas o componente CAMBIO do orcamento: quanto custa converter/gastar/sacar moeda. Nao monta orcamento total de viagem (voos, hospedagem, alimentacao, passeios). Mostra o custo real do dinheiro, mas nao o custo real da viagem — falta totalmente a visao de gasto por categoria e custo de vida no destino. |
| **Comparação** | A comparacao da Wise e enviesada e estreita: compara Wise vs bancos/tradicionais para provar que e mais barata, mas a API de afiliado retorna SO as taxas da propria Wise. Nao compara objetivamente com Revolut, Western Union, Remitly ou cartoes locais de forma neutra, e nao compara nada de viagem (destinos, datas, custo). Serve para vender a Wise, nao para o usuario decidir entre opcoes. |
| **Integração** | Boa em pagamentos, fechada em descoberta. A API de afiliado (rates/quotes) e simples mas exige aprovacao manual e so expoe dados proprios; a Wise Platform e potente mas e integracao B2B pesada (banco/fintech), nao um plugin leve para um app de planejamento. Nao ha webhook/feed publico de 'custo de cambio do destino' pronto para consumir sem virar parceiro formal. |

## 20. Oportunidades para superá-lo
- Wise so cuida do cambio: nosso app cobre o que vem antes (escolha de destino, roteiro IA, custo total realista) e leva o usuario ate o momento de precisar de cambio — posicao natural de topo de funil
- A comparacao da Wise e auto-promocional: nosso app pode comparar destinos e ate opcoes de cambio/cartao de forma neutra, ganhando confianca
- Wise ignora orcamento total da viagem: integramos o custo de cambio/cartao Wise dentro de um orcamento completo (voo+hotel+dia a dia), virando o lugar onde o numero faz sentido
- Suporte/holds da Wise geram ansiedade: nosso super-perfil pode antecipar 'leve cartao Wise + 1 backup' e educar o viajante, reduzindo o medo e gerando confianca na nossa recomendacao
- API de afiliado da Wise (quotes ao vivo) permite mostrar 'quanto seus 5.000 EUR de viagem custam em cambio hoje' e converter via afiliado CPA — feature que a propria Wise nao entrega no contexto de planejamento
- Wise nao tem perfil de viajante: cruzamos destino + duracao + estilo para recomendar a moeda/cartao certo no momento certo, algo que a Wise nunca fara

---

## Matriz (visão Mundo Sem Fim)
| Critério | Avaliação |
|---|---|
| Força principal | Cambio justo na taxa mid-market + cartao multimoeda de viagem com marca global confiavel e API de afiliado pronta para gerar receita. |
| Fraqueza principal | Faz so cambio/pagamento — zero planejamento, roteiro, orcamento total ou comparacao neutra de viagem; e meio, nao decisao. |
| Modelo de receita | Fee de conversao cambial (~0,62% take rate medio) + interchange do cartao + juros sobre saldos + saques ATM acima da cota + Wise Platform B2B. |
| Possui API? | Sim. Parcial/aprovada: API de afiliado (GET /v1/rates, POST /v2/quotes — so taxas Wise) e Wise Platform/Business API (embedded B2B). Nao e self-service publica nem GDS/NDC. |
| Possui afiliados? | Sim. Rede Partnerize; CPA ~£10 por usuario pessoal e ~£50 por business na 1a transacao cross-currency; cookie longa/vitalicia; payout multimoeda. |
| Pode virar parceiro? | Sim. Como afiliado/criador via Partnerize (rapido) e, em escala, parceria direta (50+ clientes/mes) ou ate Wise Platform para embutir cambio no proprio app. |
| Pode pagar comissão? | Sim. CPA fixo £10 pessoal / £50 business por conversao qualificada (nao % do gasto); taxa custom acima de 50 clientes/mes. |
| Pode receber tráfego? | Sim. Mandamos trafego qualificado (viajante que ja sabe destino/orcamento e vai precisar de moeda/cartao) e monetizamos via CPA do afiliado. |
| Pode ser integrado? | Parcial, via affiliate API + deeplink: mostramos cotacao de cambio ao vivo do orcamento da viagem e linkamos a abertura de conta/cartao Wise com tag de afiliado. Integracao mais profunda exige virar parceiro formal. |
| **O que precisamos ter p/ superar** | Orcamento de viagem que ja embute o custo de cambio/cartao em tempo real (consumindo a quote da Wise), recomendacao de moeda/cartao por destino e estilo no super-perfil, comparacao neutra de opcoes de cambio, e CTA contextual 'abrir conta Wise para esta viagem' com deeplink de afiliado — entregando o cambio no momento exato da decisao, algo que a Wise nao faz no contexto de planejamento. |

## Fontes consultadas
- https://wise.com/gb/affiliate-program/
- https://wise.com/gb/partnerwise
- https://docs.wise.com/guides/product/send-money/use-cases/affiliates
- https://docs.wise.com/api-reference
- https://docs.wise.com/
- https://wise.com/platform/
- https://wise.com/platform/financial-institutions/
- https://wecantrack.com/programs/wise-affiliate-program/
- https://getlasso.co/affiliate/wise/
- https://uppromote.com/affiliate-program-directory/wise/
- https://reverbico.com/blog/how-does-wise-make-money-history-and-monetization-strategy/
- https://fourweekmba.com/how-does-wise-make-money-wise-business-model/
- https://www.netguru.com/blog/wise-growth-lessons-learned
- https://wise.com/us/pricing/card-fees
- https://wise.com/help/articles/3GuSCwDgRqiYrsUc2eo7MN/atm-withdrawal-structure-and-fees
- https://wise.com/help/articles/2899986/what-are-my-wise-card-spending-limits
- https://ca.trustpilot.com/review/wise.com
- https://www.consumeraffairs.com/finance/transferwise.html
- https://www.fintechfutures.com/cross-border-payments/capitec-leverages-wise-platform-for-international-payments-solutions
- https://www.fintechfutures.com/cross-border-payments/mbsb-becomes-first-malaysian-bank-to-integrate-wise-platform
