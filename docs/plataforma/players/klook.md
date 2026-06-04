# Klook

> **Categoria:** Experiencias / Atividades / Asia (OTA de tours, atracoes, ingressos, transporte e travel essentials)
> _Perfil gerado por pesquisa multiagente (jun/2026). Parte do [Relatório de Mercado](../01-relatorio-de-mercado.md) e da [Matriz Competitiva](../02-matriz-competitiva.md)._

## 1. O que faz
Klook e um marketplace global de experiencias de viagem (tours, ingressos de atracoes, parques tematicos, atividades, passes de transporte, trens, eSIM/Wi-Fi, transfers de aeroporto e cada vez mais hoteis) com origem e forca dominante na Asia-Pacifico. Funciona como OTA mobile-first: 75-80% das reservas vem do app. Em 2024 movimentou ~US$2,5B em GTV e ~US$417M de receita; nos 12 meses ate Q3/2025 chegou a US$3,04B de GTV e US$540M de receita, com take rate de ~18%. Pediu IPO na bolsa de NY em nov/2025.

## 2. Público-alvo
Viajantes de lazer da Asia-Pacifico (Hong Kong, Taiwan, Coreia, Sudeste Asiatico, India) e cada vez mais globais; forte skew Millennial/Gen Z mobile-first (88% dos jovens APAC declararam manter/aumentar gasto em viagem em 2026). Tambem atende merchants/operadores locais de atracoes e atividades como lado da oferta, e parceiros B2B (revendedores, channel managers, OTAs) via API.

## 3. Funcionalidades principais
- Reserva de tours, atracoes, ingressos e atividades com voucher mobile e QR code de entrada
- Skip-the-line e entrada rapida em atracoes (forte na Asia: parques Disney, Universal, observatorios)
- Travel essentials: eSIM/Wi-Fi pocket, passes de trem (JR Pass), metro, transfer de aeroporto, aluguel de carro
- Hoteis e staycations (categoria em expansao, modelo mais agency)
- App mobile-first com Klook Pass (passes combinados de multiplas atracoes por cidade)
- Programa de fidelidade Klook Credits/Klook Cash e cupons
- Klook Kreator (creator economy: +20.000 influenciadores gerando conteudo e reduzindo CAC ~25%)
- IA conversacional / 'conversational commerce' em desenvolvimento (parceria Google Cloud / Gemini) para recomendacao e planejamento
- Reviews e fotos de usuarios por atividade

## 4. Como monetiza
- Comissao sobre reservas (core, ~80% da receita FY2024): take rate liquido ~18% do GTV; comissao bruta tipicamente 15-25% por reserva, variando por categoria, geografia e poder de negociacao do operador
- Modelo hibrido merchant + 1P/wholesale: em trens, passes, eSIM, SIM e transfers Klook compra inventario antecipado e revende como receita cheia (margem maior); demais categorias sao marketplace agency/comissao
- Merchant-facing B2B (cresceu ~40% YoY): placement premium/posicionamento patrocinado, analytics e servicos de marketing vendidos aos operadores
- Spread de cambio e markup pontual de preco em algumas categorias
- Receita de afiliados de saida (paga comissao a publishers que mandam trafego, mas captura GTV incremental)
- Estrategia 2026 'Intelligent Travel': monetizar planejamento de maior valor, one-click booking e possiveis features de assinatura/personalizacao para elevar ARPU

## 5. Afiliados
Sim. Programa de afiliados maduro ('o maior do tipo' em experiencias). Estrutura mista: portal proprio in-house em affiliate.klook.com + distribuicao via redes terceiras, com a Ecomobi atuando como network partner oficial na Asia e tambem presenca em Travelpayouts, FlexOffers, CueLinks e outras. Comissao tipica BAIXA: padrao ~5% na maioria das categorias (atracoes, tours, atividades, transporte, aluguel de carro, hoteis, seguro, passes), 2% em special activities/gift cards, e destaque historico de ate 20% no eSIM e ~10% em bookings origem India; periodos promocionais elevam pontualmente (ex.: 6-8% em atracoes/staycation/car rental). Cookie: 30 dias na maioria, apenas 7 dias em hoteis. Validacao no mes T+1 e pagamento ~90 dias apos validacao (ciclo longo). Ferramentas: gerador de link/deep-link e UTM no dashboard, gerador de cupom (via Ecomobi). Contato: affiliate@klook.com.

## 6. API
Sim, mas e API de PARCEIRO/MERCHANT com aprovacao, nao API publica aberta. Documentada em klook.gitbook.io/openapi como 'Klook API Specification', destinada a merchants, sistemas de reserva e channel managers. Oferece: recuperacao de conteudo de produto, disponibilidade em tempo real (slot-based, capacidade restante, blackout dates), precificacao dinamica por tipo de viajante/opcoes/add-ons, holds de disponibilidade e price-locking durante booking/cancelamento, em bulk e real-time. Tambem ha data feeds e white-label para parceiros de distribuicao. NAO e GDS/NDC (e tours & activities, nao voos). Para afiliados existe tracking via rede (Ecomobi/Travelpayouts) e deep-links, mas nao uma API publica de catalogo self-service sem onboarding.

## 7. Programa de parceiros
Multiplos trilhos: (1) Affiliate Program (publishers/sites de conteudo) via affiliate.klook.com + redes (Ecomobi, Travelpayouts, FlexOffers); (2) Klook Partner / API & white-label para OTAs, channel managers e revendedores integrarem catalogo; (3) lado da oferta para operadores/merchants listarem atividades; (4) Klook Kreator para criadores de conteudo monetizarem. Onboarding de afiliado e relativamente acessivel; integracao via API exige aprovacao comercial e e voltada a parceiros de distribuicao/B2B.

## 8. Dados que oferece
- Catalogo global de experiencias com preco, descricao, fotos, politica de cancelamento
- Disponibilidade real-time por slot/horario, capacidade restante e blackout dates (via API de parceiro)
- Precificacao dinamica por tipo de viajante, opcoes, add-ons e pacotes
- Reviews/notas e fotos de usuarios por atividade
- Voucher/QR de entrada e instrucoes de resgate
- Forte profundidade de inventario na Asia (atracoes, transporte local, passes, eSIM)
- Deep-links de afiliado rastreaveis com UTM

## 9. Dados que NÃO oferece
- Roteiro/itinerario estruturado multi-dia (planejamento dia-a-dia) — e ponto-de-venda, nao planejador
- Custo TOTAL realista de viagem (voo + hospedagem + alimentacao + transporte + atividades) — so cobre o que vende
- Comparacao objetiva entre destinos (clima, seguranca, visto, custo de vida) — nao e funcao da plataforma
- Dados de voo / NDC / GDS (nao opera passagens aereas)
- Super-perfil persistente do viajante exportavel (preferencias ficam no silo Klook, nao portaveis)
- Preco transparente de operadores concorrentes lado a lado (so mostra inventario Klook)
- Catalogo publico self-service via API sem onboarding (afiliado depende de rede/deep-link)
- Cobertura profunda fora da Asia equivalente a GetYourGuide/Viator no Ocidente

## 10. Pontos fortes
- Lider dominante em experiencias na Asia-Pacifico, com inventario local dificil de replicar (parques, trens, passes, eSIM, transfers)
- Escala real: US$3,04B GTV e US$540M receita (TTM Q3/2025), +34-40% YoY, EBITDA ajustado positivo pela 1a vez
- App mobile-first com altissima conversao (75-80% das reservas no app) e forte recompra
- Travel essentials (eSIM, JR Pass, transfer) criam alta frequencia e entrada antecipada na jornada
- Creator economy (Klook Kreator) e parceria Google Cloud/Gemini reduzindo CAC e impulsionando IA
- Programa de afiliados amplo + API de parceiro robusta = multiplos canais de distribuicao para integrar
- Modelo hibrido merchant+1P captura margem maior em categorias-chave

## 11. Pontos fracos
- Nao planeja viagem: e transacional, sem roteiro multi-dia, sem custo total, sem comparacao de destinos
- Comissao de afiliado BAIXA (~5% padrao) e ciclo de pagamento longo (~90 dias) — economics fracos para quem manda trafego
- Cookie de hotel curtissimo (7 dias) penaliza conversao em categoria de ticket alto
- Reclamacoes recorrentes de reembolso (atrasos, reembolso so em Klook Cash, valores parciais retidos)
- Atendimento ao cliente percebido como ruim: sem telefone/email geral, SLA de chat falho, voucher divergente do anunciado
- Acusacao de filtrar reviews negativos reais, reduzindo confiabilidade da prova social
- Forca concentrada na Asia; fora dela compete em desvantagem com GetYourGuide/Viator
- Ainda nao lucrativo (net loss FY2024 -US$99M, melhorou para -US$17M em 2025)
- IA/planejamento ainda incipiente e preso ao funil de venda do proprio catalogo (vies de inventario)

## 12. Reclamações comuns dos usuários
- Reembolsos atrasados ou nao cumpridos; em varios casos devolvido so em 'Klook Cash' em vez do cartao, prendendo o cliente na plataforma
- Retencao parcial de valor em produto marcado como 'totalmente reembolsavel' (ex.: Swiss Pass ~AUD4.500 com ~AUD300 retidos)
- Voucher divergente do anunciado (ex.: hotel com cafe da manha que veio sem cafe; sem resposta do suporte)
- Overbooking/sem lugar disponivel na chegada mesmo com garantia do suporte (ex.: onibus em Taiwan)
- Ausencia de canal de atendimento geral (sem telefone/email unico); suporte so por link da reserva especifica
- Chat sem resposta dentro do SLA (4h) e e-mails ignorados
- Trustpilot/ProductReview: alegacao de que a Klook rejeita reviews factuais negativos para proteger operadores, distorcendo a media

## 13–19. Limitações
| Eixo | Limitação |
|---|---|
| **UX** | Excelente UX de COMPRA (mobile-first, voucher/QR instantaneo, alta conversao), mas UX de PLANEJAMENTO inexistente: o usuario navega por SKUs avulsos de atividades sem visao de jornada, sem montar um dia, sem entender como uma experiencia se encaixa na viagem. E uma vitrine de catalogo, nao uma ferramenta de decisao. Pos-venda fragiliza a experiencia (suporte ruim, atrito em reembolso). |
| **Personalização** | Personalizacao rasa e baseada em comportamento de compra/popularidade dentro do silo Klook, sem super-perfil persistente do viajante (estilo, ritmo, orcamento, restricoes, companhia de viagem) nem portabilidade desses dados. Recomenda 'o que vende mais naquela cidade', nao 'o que combina com VOCE'. Nao constroi entendimento longitudinal do viajante entre viagens. |
| **IA** | IA ainda incipiente: foco anunciado em 'conversational commerce' com Google Cloud/Gemini, mas o objetivo e empurrar reservas do proprio catalogo (vies de inventario), nao planejar de forma neutra. Nao gera roteiro multi-dia coerente, nao raciocina sobre logistica/tempo/deslocamento entre pontos, nem otimiza orcamento total. A IA serve a venda, nao a decisao independente do viajante. |
| **Roteirização** | Nao faz roteirizacao. Nao existe construtor de itinerario dia-a-dia, sequenciamento geografico, encaixe de horarios, tempo de deslocamento ou balanceamento de atividades por dia. O usuario precisa montar o roteiro por conta propria (ou em outra ferramenta) e usar a Klook apenas para comprar os componentes isolados. |
| **Orçamento** | So enxerga o gasto com o que ela mesma vende (atividades, passes, transfers). Nao calcula custo TOTAL realista da viagem (voos, hospedagem completa, alimentacao diaria, transporte local agregado, taxas) nem oferece modo orcamento. Impossivel saber, dentro da Klook, quanto a viagem inteira vai custar ou comparar cenarios de orcamento por destino. |
| **Comparação** | Nao compara destinos. Nao ha visao lado a lado de clima, sazonalidade, seguranca, exigencia de visto, custo de vida ou 'melhor epoca' entre opcoes (ex.: Tailandia vs Vietna vs Bali). A comparacao se limita a SKUs de atividade dentro de uma mesma cidade ja escolhida — ou seja, atua so depois que a decisao de destino ja foi tomada em outro lugar. |
| **Integração** | Integravel, porem com atritos: API de parceiro/merchant exige aprovacao comercial (nao e catalogo publico self-service); para afiliado a captura de catalogo depende de redes terceiras (Ecomobi/Travelpayouts/FlexOffers) e deep-links, com comissao baixa (~5%) e pagamento lento (~90 dias). Bom para monetizar a CAMADA de experiencias da Asia via deeplink/afiliado, mas economics fracos e dependencia de |

## 20. Oportunidades para superá-lo
- Ser o PLANEJADOR neutro que decide (destino + roteiro + orcamento total) e usar a Klook apenas como fornecedor de experiencias na Asia via deeplink/afiliado — ficar na camada de decisao, acima do ponto-de-venda dele
- Entregar custo TOTAL realista da viagem (voo+hospedagem+comida+transporte+atividades) que a Klook estruturalmente nao mostra
- Comparacao objetiva de destinos (clima, visto, seguranca, custo de vida, melhor epoca) — etapa anterior que a Klook ignora
- Roteiro IA multi-dia com sequenciamento geografico e logistica (tempo de deslocamento), encaixando experiencias Klook como blocos
- Super-perfil persistente e portatil do viajante (estilo/ritmo/orcamento/companhia) que a Klook nao tem
- Curadoria multi-fornecedor (Klook + GetYourGuide + Viator) com comparacao de preco e cobertura, eliminando o vies de inventario unico da Klook
- Transparencia e confianca (mostrar reviews reais agregados de varias fontes) onde a Klook e acusada de filtrar avaliacoes negativas
- Cobertura global equilibrada: usar Klook onde ela e forte (Asia) e outros fornecedores fora da Asia, dando ao usuario o melhor dos dois

---

## Matriz (visão Mundo Sem Fim)
| Critério | Avaliação |
|---|---|
| Força principal | Lider absoluto em inventario de experiencias e travel essentials na Asia-Pacifico (atracoes, trens/passes, eSIM, transfers), com app de altissima conversao e escala de US$3B+ de GTV. |
| Fraqueza principal | E ponto-de-venda transacional, nao planejador: nao faz roteiro, custo total nem comparacao de destinos; alem de suporte/reembolso ruins e reviews acusados de filtragem. |
| Modelo de receita | Comissao/take rate ~18% do GTV (15-25% bruto por reserva) + modelo hibrido 1P/wholesale em passes/eSIM/transfers + B2B merchant (placement/analytics/marketing). ~80% da receita vem de comissao. |
| Possui API? | Sim, parcial — API de parceiro/merchant (klook.gitbook.io/openapi) com aprovacao para produto, disponibilidade real-time e preco; nao e API publica self-service nem GDS/NDC. |
| Possui afiliados? | Sim — in-house (affiliate.klook.com) + redes Ecomobi (oficial APAC), Travelpayouts, FlexOffers, CueLinks; comissao ~5% padrao (ate 20% eSIM), cookie 30d (7d hotel), pagamento ~90d. |
| Pode virar parceiro? | Sim — como fornecedor de experiencias na nossa camada de planejamento (deeplink/afiliado imediato; integracao de catalogo via API de parceiro mediante contrato B2B). |
| Pode pagar comissão? | Sim — paga comissao de afiliado, mas baixa (~5% padrao) e com ciclo lento (~90 dias); economics so compensam em volume e em categorias premium (eSIM 20%). |
| Pode receber tráfego? | Sim — alvo ideal para receber trafego qualificado de quem ja decidiu fazer experiencias na Asia; mandamos leads no momento da reserva e monetizamos via afiliado/deeplink. |
| Pode ser integrado? | Parcial — facil via afiliado/deeplink e rede (Ecomobi/Travelpayouts); integracao 1P de catalogo (API de parceiro) exige aprovacao comercial e onboarding. |
| **O que precisamos ter p/ superar** | Roteiro IA multi-dia com logistica real, custo TOTAL da viagem, comparacao objetiva de destinos, super-perfil persistente do viajante e agregacao multi-fornecedor com reviews neutros — para sermos a camada de DECISAO que monetiza a Klook (e concorrentes) como mero fornecedor de SKUs, sem o vies de inventario unico dele. |

## Fontes consultadas
- https://thebusinessrule.com/klook-business-model-secrets-behind-540m-revenue-growth/
- https://www.mostlymetrics.com/p/klook-ipo-s1-breakdown
- https://skift.com/2025/11/10/klook-ipo-global-travel-experiences-future/
- https://www.pymnts.com/news/ipo/2025/travel-platform-klook-books-24-growth-in-ipo-filing/
- https://getlasso.co/affiliate/klook/
- https://ecomobi.com/klook-affiliate-program-review/
- https://www.cuelinks.com/campaigns/klook-affiliate-program
- https://involve.asia/blog/klook-affiliate-program/
- https://affiliate.klook.com/home
- https://klook.gitbook.io/openapi
- https://www.klook.com/partner/
- https://www.altexsoft.com/techtalks/how-to-integrate-klook-api/
- https://www.klook.com/newsroom/partnership-2024-google-cloud/
- https://marketech-apac.com/klook-expands-google-cloud-partnership-to-improve-platforms-ai-capabilities-for-travel-services/
- https://www.klook.com/newsroom/travelpulse-2026-biggerbudgets-boldertrips/
- https://www.trustpilot.com/review/www.klook.com
- https://klook.pissedconsumer.com/complaints/RT-P.html
- https://www.productreview.com.au/listings/klook-travel
