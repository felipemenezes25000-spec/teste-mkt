# TripIt (SAP Concur)

> **Categoria:** Organizador de itinerario / Travel organizer (gestao de viagem pos-reserva)
> _Perfil gerado por pesquisa multiagente (jun/2026). Parte do [Relatório de Mercado](../01-relatorio-de-mercado.md) e da [Matriz Competitiva](../02-matriz-competitiva.md)._

## 1. O que faz
TripIt e um agregador de itinerarios: o usuario encaminha (ou sincroniza a caixa de entrada) os e-mails de confirmacao de voo, hotel, carro e atividades, e o app monta automaticamente um itinerario mestre unico, cronologico e offline. Na versao Pro adiciona alertas de voo em tempo real, mudancas de portao, mapas de aeroporto, rastreio de assento/tarifa e pontos de fidelidade. E uma ferramenta de ORGANIZACAO pos-reserva, nao de planejamento ou descoberta. Pertence a SAP Concur (adquirida em 2011), o que ancora a versao corporativa no ecossistema de gestao de despesas (TripLink).

## 2. Público-alvo
Viajante frequente, sobretudo a negocios (business traveler) e o entusiasta de milhas/pontos ("points & miles"). Forte penetracao corporativa via SAP Concur TripLink, onde funcionarios de empresas-clientes recebem TripIt Pro de graca. Publico majoritariamente EUA/anglofono, tech-savvy, que ja sabe para onde vai e o que ja reservou.

## 3. Funcionalidades principais
- Criacao automatica de itinerario via encaminhamento de e-mail ou sync da caixa (Gmail/Outlook/iCloud)
- Itinerario mestre unico, cronologico e acessivel offline
- Parsing de confirmacoes em ingles, frances, alemao, japones e espanhol
- Alertas de voo em tempo real, atraso, mudanca de portao e terminal (Pro)
- Seat Tracker (avisa quando abre assento melhor) e Fare Tracker / monitor de tarifa (Pro)
- Mapas interativos de aeroporto e info de lounges (Pro)
- Point Tracker: saldo e expiracao de programas de fidelidade (Pro)
- Compartilhamento de viagem (WhatsApp, Slack, e-mail) e sync com calendario
- Upload de documentos (3 no free, 25/viagem no Pro)
- Modulo de despesas/expense e integracao TripLink com SAP Concur (corporativo)
- Atualizacao visual recente para iOS 26 (Liquid Glass)

## 4. Como monetiza
- Assinatura B2C: TripIt Pro a US$ 49/ano (trial de 30 dias) - principal receita ao consumidor
- Licenciamento B2B/enterprise: empacotado no SAP Concur TripLink; empresas pagam a SAP e os funcionarios ganham Pro - receita via Concur, nao reportada separadamente
- Publicidade no app/free: rede de display e CPM (DoubleClick, Index Exchange, Yahoo/Yield Manager, Google AdSense etc.); Pro remove anuncios
- Comissoes de afiliado/referral de parceiros de viagem recomendados dentro do app (historicamente Hotwire e referral de ate 20% sobre o proprio Pro) - hoje marginal
- Patrocinios customizados e e-mail marketing (mediakit Kochava)

## 5. Afiliados
Nao ha programa de afiliados publico e ativo numa rede principal (Awin/CJ/Impact/Partnerize/Travelpayouts). Esta INDISPONIVEL nos 120+ programas pre-integrados do LinkMyDeals. O que existe e legado: um programa de referral para DESENVOLVEDORES da API anunciado em 2009, que paga ate 20% de comissao sobre vendas do proprio TripIt Pro (nao sobre voos/hoteis) - proprio/direto, nao via rede. Na pratica esta dormente e atrelado ao acesso a API, que foi fechado a novas integracoes. Conclusao: TripIt nao e um bom alvo de monetizacao por afiliado hoje.

## 6. API
SIM, existe uma API REST v1 (docs em tripit.github.io/api), mas esta FECHADA a novas integracoes. Suporte oficial confirma: "The TripIt public API is no longer available for new integrations. Existing API connections will continue to function normally." Os links de registro de novos apps nao funcionam mais. Ha duas variantes historicas: API publica (OAuth, CRUD de itinerarios) e CRS API para parceiros (2-legged OAuth, importacao de reservas). Para uso comercial novo, o caminho indicado e a Concur Connect / Concur Developer Platform (da matriz SAP). NAO e GDS nem NDC - e API de dados de itinerario, nao de booking/disponibilidade.

## 7. Programa de parceiros
Parcerias historicas pontuais (ex.: Hotwire) e o programa de desenvolvedores ligado a API, ambos hoje desativados/legados. O canal de parceria vivo e o corporativo via SAP Concur: App Center do Concur e o TripLink, que conecta reservas externas ao programa de T&E (travel & expense) das empresas. Para um terceiro entrar, o caminho realista e ser app/integracao no ecossistema SAP Concur, nao parceria direta com a marca TripIt.

## 8. Dados que oferece
- Itinerario estruturado pos-reserva (voos, hoteis, carros, atividades) com horarios, localizadores e numeros de confirmacao
- Status de voo em tempo real, portao, terminal e atrasos (Pro)
- Disponibilidade de assentos e alertas de tarifa para voos ja reservados (Pro)
- Mapas de aeroporto e informacoes de lounge
- Saldos e expiracao de programas de fidelidade (Point Tracker, Pro)
- Dados de despesa de viagem para reembolso corporativo (via TripLink/Concur)

## 9. Dados que NÃO oferece
- Precos comparativos ou disponibilidade para COMPRAR voos/hoteis (nao e motor de busca/booking)
- Custo total realista da viagem antes de reservar (cambio, diarias, transporte local, comida)
- Recomendacao de destino ou descoberta ('para onde ir')
- Roteiro dia-a-dia de atividades/pontos turisticos com sugestao de o que fazer
- Sugestoes personalizadas por perfil/interesse do viajante
- Conteudo de inspiracao, mapa real de pontos de interesse e otimizacao de rota intra-destino
- Parsing confiavel fora de 5 idiomas (PT-BR incluido fica fragil)

## 10. Pontos fortes
- Automacao de itinerario lider de categoria: encaminhou o e-mail, esta organizado
- Confiabilidade de alertas de voo em tempo real (referencia para viajante a negocios)
- Acesso offline solido - funciona no aeroporto sem internet
- Marca consolidada e base instalada grande, especialmente nos EUA
- Distribuicao corporativa embutida via SAP Concur/TripLink (canal que concorrentes nao tem)
- Foco em points & miles (Point Tracker) que fideliza o nicho de milhas

## 11. Pontos fracos
- So organiza o que JA foi reservado - zero ajuda na decisao/planejamento
- Sem orcamento/custo total realista da viagem
- Sem roteirizacao de atividades nem descoberta de destino
- UX considerada datada, 'clunky' e sobrecarregada; fraca em iPad (sem drag-and-drop, sem duplicar evento)
- Paywall de US$ 49/ano para recursos basicos esperados (alertas em tempo real)
- Parsing quebra fora de ingles/FR/DE/JA/ES - ruim para o mercado BR/LatAm
- API fechada a novos parceiros = dificil integrar
- Descontinuou o app Android em certo momento, gerando migracao de usuarios
- Sem IA generativa real de planejamento - e regras/parsing, nao assistente

## 12. Reclamações comuns dos usuários
- Logout frequente no iOS - desloga e pede login justamente no aeroporto, quando mais se precisa
- Renovacao automatica da assinatura sem aviso claro (cobranca surpresa)
- Quedas de servidor que deixaram usuarios sem acesso ao itinerario por horas
- Coleta excessiva de dados pessoais para restaurar acesso a conta
- UI nova vista como sobrecarregada: toggles animados demais, excesso de opcoes ao criar atividade
- Parsing falha/perde detalhes de e-mails fora dos idiomas suportados, exigindo correcao manual
- Interface fraca no iPad/iPhone: nao copia/duplica evento, sem arrastar e soltar
- Percepcao de pouca evolucao do produto sob a SAP (estagnacao)

## 13–19. Limitações
| Eixo | Limitação |
|---|---|
| **UX** | UX percebida como datada e 'clunky'. Versao iPad notavelmente fraca (sem drag-and-drop, sem duplicar evento). A reformulacao recente foi criticada por excesso de toggles animados e opcoes ao criar atividade. Bug recorrente de logout no iOS quebra a confianca no momento critico (embarque). Visual sem apelo ('no cool graphics'), funcional mas sem encanto. |
| **Personalização** | Praticamente inexistente. Nao constroi perfil do viajante (interesses, ritmo, orcamento, estilo). Trata todo usuario igual: o app reflete o que foi reservado, sem adaptar recomendacoes, sem aprender preferencias e sem sugerir nada com base em quem voce e. O unico 'perfil' real e o de programas de fidelidade (Point Tracker). |
| **IA** | Nao tem IA generativa de planejamento. A 'inteligencia' e parsing baseado em regras de e-mails de confirmacao mais alertas de status de voo - automacao, nao assistente. Nao gera roteiros, nao responde 'o que fazer em X', nao monta plano por linguagem natural. Em 2026 fica para tras de apps com LLM que criam itinerario conversacional. |
| **Roteirização** | Nula como planejador: nao sugere atividades, nao monta dia-a-dia, nao otimiza rota entre pontos de interesse nem indica o que visitar. Coloca em ordem cronologica o que voce ja reservou, mas nao ajuda a DECIDIR o que incluir no roteiro. Sem mapa de POIs com sugestoes. |
| **Orçamento** | Nao calcula custo total realista de viagem. O modulo existente e de DESPESA/expense pos-fato (reembolso corporativo via Concur), nao de estimativa pre-viagem. Nao soma passagem + diarias + transporte local + alimentacao + cambio para dizer 'esta viagem vai custar X'. Zero comparacao de custo entre destinos. |
| **Comparação** | Nao compara destinos nem opcoes de compra. Nao e motor de busca: nao mostra preco/disponibilidade para reservar, nao confronta 'Peru vs Tailandia' por custo, clima ou adequacao ao perfil. So agrega o que ja foi comprado; toda a fase de decisao acontece fora do app. |
| **Integração** | API publica FECHADA a novas integracoes (so conexoes legadas seguem funcionando); registro de novos apps desativado. Para integrar de verdade hoje, o caminho e o ecossistema SAP Concur (Concur Connect/App Center), mais pesado e B2B. Nao expoe busca/booking (sem GDS/NDC). Resultado: dificil mandar/receber trafego programaticamente; integracao viavel so por deep-link manual ou parceria corporativa v |

## 20. Oportunidades para superá-lo
- TripIt so atua DEPOIS da reserva - nosso app domina a fase de DECISAO (para onde ir, quanto custa, qual destino combina comigo)
- Entregar custo total realista pre-viagem (cambio, diarias, transporte, comida) - lacuna total deles
- Roteiro dia-a-dia gerado por IA com mapa real de POIs - eles nao roteirizam nada
- Comparacao de destinos lado a lado por custo/clima/perfil - inexistente no TripIt
- Super-perfil do viajante personalizando tudo - eles tratam todos iguais
- Suporte forte a PT-BR/LatAm e parsing multilingue - ponto fraco confirmado deles
- UX moderna e mobile-first (incl. iPad decente) - reclamacao recorrente deles
- Como nao competem em planejamento, podem virar PARCEIRO de organizacao pos-reserva em vez de rival
- Modelo de afiliado/comissao em booking que o TripIt nao explora - monetizamos onde ele nao monetiza

---

## Matriz (visão Mundo Sem Fim)
| Critério | Avaliação |
|---|---|
| Força principal | Automacao de itinerario pos-reserva lider, alertas de voo em tempo real confiaveis e distribuicao corporativa embutida via SAP Concur/TripLink. |
| Fraqueza principal | Atua so depois da compra: zero planejamento, orcamento, roteirizacao, comparacao de destino ou personalizacao - exatamente a fase de decisao onde nosso app vive. |
| Modelo de receita | Assinatura B2C (TripIt Pro US$ 49/ano) + licenca enterprise empacotada no SAP Concur TripLink + publicidade display/CPM no free; afiliado e marginal. |
| Possui API? | Parcial - existe API REST v1 mas FECHADA a novas integracoes (so conexoes legadas seguem); novos parceiros via Concur Connect. Sem GDS/NDC. |
| Possui afiliados? | Nao (efetivamente) - so um referral legado de ate 20% sobre o proprio Pro, dormente; ausente das redes principais (Awin/CJ/Impact/Partnerize). |
| Pode virar parceiro? | Sim, mas via SAP Concur (App Center/TripLink), nao com a marca TripIt direto. Caminho B2B, mais lento. Como complemento (organizacao pos-reserva) faz sentido; como afiliado de booking, nao. |
| Pode pagar comissão? | Nao de forma relevante - nao paga comissao por trafego de booking; o unico payout e o referral legado sobre assinaturas Pro (ate 20%), pouco atrativo e atrelado a API fechada. |
| Pode receber tráfego? | Sim - podemos mandar o usuario que JA decidiu e reservou para o TripIt organizar o itinerario; faz sentido como handoff pos-decisao, mas com baixa monetizacao de retorno. |
| Pode ser integrado? | Parcial - integracao tecnica limitada (API fechada a novos; viavel so por deep-link ou via Concur). Melhor tratar como destino de handoff do que como integracao profunda. |
| **O que precisamos ter p/ superar** | Igualar/superar o que ele faz bem: importacao automatica de confirmacoes por e-mail (com PT-BR), itinerario unico offline, alertas de voo em tempo real e sync de calendario - mas tudo acoplado a nossa camada superior de decisao (IA de roteiro, custo total, comparacao de destinos e super-perfil), entregando o ciclo completo planejar-decidir-organizar que o TripIt nao tem. |

## Fontes consultadas
- https://www.tripit.com/web/pro/pricing
- https://www.concur.com/products/tripit-pro
- https://www.tripit.com/web/blog/business-travel/tripit-pro-concur-triplink
- https://help.tripit.com/en/support/solutions/articles/103000391296-tripit-public-api
- https://tripit.github.io/api/doc/v1/
- https://tripit.github.io/api/doc/v1/crs.html
- https://github.com/tripit/api/issues/288
- https://github.com/tripit/api/issues/289
- https://www.tripit.com/web/blog/default/hotwire-partnership-and-new-tripit-developer-program
- https://linkmydeals.com/affiliate-programs/info/tripit.com/
- https://media-index.kochava.com/ad_partners/tripit
- https://vizologi.com/business-strategy-canvas/tripit-business-model-canvas/
- https://www.going.com/guides/tripit-review
- https://www.wandrly.app/reviews/tripit
- https://www.trustpilot.com/review/www.tripit.com
- https://apps.apple.com/us/app/tripit-travel-planner/id311035142
- https://wanderlog.com/blog/2024/11/26/wanderlog-vs-tripit/
- https://tineo.ai/blog/tripit-pro-vs-free-worth-it/
