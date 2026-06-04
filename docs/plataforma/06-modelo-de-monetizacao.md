# 06 · Modelo de Monetização

> Como o Mundo Sem Fim ganha dinheiro sem trair o viajante. Dados de comissão da pesquisa (jun/2026) detalhados em [`_dados/tabela-monetizacao.md`](_dados/tabela-monetizacao.md).

## Tese central

> **Não somos merchant-of-record.** A receita vem de capturar a **intenção de compra no momento da decisão do roteiro** e disparar o lead/clique via deep-link pro player que paga comissão. Como afiliado *last-click*, ganhamos sobre a comissão do parceiro final (OTA/operador) — **sem nunca esconder um fee do viajante.**

Isso resolve o conflito de interesse que trava todos os 37 concorrentes (gap 5 e 8): como não vendemos o estoque, podemos ser **neutros por construção**. A assinatura paga pela *inteligência neutra*; a comissão paga pela *execução* — e os dois incentivos apontam pro mesmo lugar: a melhor decisão do viajante.

```
  VIAJANTE ──paga──> ASSINATURA (Premium/Pro)  ──┐
                                                  ├──> MUNDO SEM FIM (camada de decisão neutra)
  PARCEIRO ──paga──> COMISSÃO/CPA (afiliado)   ──┘         │
                                                           │ manda intenção qualificada
                                                           ▼
                              Booking · Viator · Kiwi · Wise · Klook · Civitatis…
```

---

## Linha 1 — Assinatura (B2C) · o motor previsível

Três planos já implementados (`_lib/planos.js`, `<Gate>`, Stripe real em `/api/stripe/*`):

| Plano | Preço (atual, test) | Para quem | O que libera |
|---|---|---|---|
| **Grátis** | R$ 0 | Aquisição/SEO | Explorar, comparar básico, planner, 1 roteiro IA/dia |
| **Premium** | **R$ 19/mês** · R$ 190/ano | Viajante individual | Roteiro PDF, custos detalhados, comparar avançado (por perfil), alertas de preço/visto, IA sem limite prático |
| **Pro** | **R$ 39/mês** · R$ 390/ano | Multi-país / grupos / nômade | Tudo do Premium + multi-país ilimitado, modo grupo (rateio), colaboração, exportações |

**Princípios de pricing:**
- **Anual com ~2 meses grátis** (R$ 190/R$ 390) — melhora LTV e caixa.
- O *gancho* é sempre a economia: "a assinatura se paga no primeiro corte de orçamento que a gente sugere". Premium custa menos que **uma diária de hostel**.
- Free generoso o suficiente pra viralizar (planner + comparar), com paywall nos momentos de maior valor percebido (PDF do roteiro pronto, comparar "pelo seu perfil", alerta que "salva a viagem").

> **Régua:** o usuário deve pensar *"eu pagaria por isso porque economiza tempo, dinheiro e evita erro na viagem."* Cada feature gated tem que passar nessa régua.

---

## Linha 2 — Comissão / Afiliados (B2B) · a escala

As 17 fontes de comissão do briefing, mapeadas às comissões **reais** da pesquisa. Priorize por **comissão absoluta** (ticket × %), não pelo % isolado.

| # | Categoria | Comissão típica | Melhor parceiro | Prioridade |
|---|---|---|---|:---:|
| 1 | **Hospedagem (hotel)** | 4-7% | Booking (~4% efetivo), Agoda (5-7%) | 🔴 P0 |
| 2 | **Voo** | 1-3% / CPC | **Kiwi 3% (~US$13,50/venda)**, Skyscanner, Aviasales | 🔴 P0 |
| 3 | **Experiências/passeios** | 5-10% | **Viator ~8%**, Civitatis 8-10%, GYG 5-8% | 🔴 P0 |
| 4 | **Câmbio/cartão internacional** | CPA fixo £10-500 | **Wise (~£10-50/conta)**, Revolut | 🔴 P0 |
| 5 | **eSIM/chip** | até ~20% | **Klook eSIM**, Airalo/Holafly | 🟡 P1 |
| 6 | **Aluguel de carro** | ~6% | Rentalcars, Booking Cars | 🟡 P1 |
| 7 | **Hospedagem alternativa** | ~2-4% | Booking apês, Vrbo (**Airbnb não paga**) | 🟡 P1 |
| 8 | **Seguro viagem** | CPA/apólice | SafetyWing/Heymondo (dedicado) > ancillary OTA | 🟡 P2 |
| 9 | **Transporte terrestre** | ~6% | **Omio**, Kiwi (trem/ônibus) | 🟡 P2 |
| 10 | **Hostels** | CPA s/ depósito | Hostelworld (ticket baixo — empacotar) | 🟡 P2 |
| 11 | **Restaurante/reserva** | centavos/comensal | TheFork, OpenTable (feature > receita) | 🟢 P3 |

**Outras linhas de afiliado:** links afiliados genéricos em qualquer conteúdo (blog/SEO), e o "roteiro reservável" (cada item do dia com botão de reserva — [03 · Oportunidade #6](03-oportunidades.md)).

### Regras de produto que maximizam a comissão
1. **Dispare o clique no momento exato da decisão** (cookies são curtos: Agoda 24h, Expedia ~7d). O CTA "Reservar" sai do bloco do dia/atividade do roteiro, *last-click*, não de uma página genérica de ofertas.
2. **Priorize ticket alto:** voo de longa distância, carro, hospedagem e experiências — onde o valor por reserva é alto. Restaurante/hostel/metabusca entram como *completude*, não fonte de receita.
3. **Estratégia do mochileiro:** como Hostelworld paga migalha, o ganho do público budget vem de **empacotar** no mesmo roteiro itens de ticket maior — voo (Kiwi), tours (Viator/Civitatis), eSIM (Klook ~20%), seguro e cartão Wise.
4. **Trate como CUSTO, nunca receita:** Google, Rome2Rio, Amadeus, Duffel e Airbnb **não pagam tráfego** — servem só pra exibir/comparar; o booking monetizado cai sempre numa OTA terceira que paga.

---

## Linha 3 — Plataforma (B2B avançado)

Quando houver volume e dados:
- **API Premium** — expor o motor de decisão (custo total, score, melhor época, visto datado) como API pra agências, blogs e apps. Cobrança por chamada/assinatura.
- **White-label** — o planner + camada de decisão com a marca de uma agência/secretaria de turismo. Receita por licença/setup + recorrência.
- **Dados agregados de tendência** — "pra onde os brasileiros querem ir neste trimestre", intenção por destino/época/orçamento (anonimizado, LGPD-safe). Vendável a secretarias de turismo, OTAs e operadores — é o ativo que a Atlas Obscura monetiza como brand partnership, só que *quantitativo*.

## Linha 4 — Parcerias & Marketplace

Detalhado em [07 · Estratégia de Parceiros](07-estrategia-de-parceiros.md):
- **Parcerias com agências** (white-label, comissão revshare).
- **Influenciadores** (roteiros assinados, link de afiliado compartilhado, receita dividida).
- **Secretarias de turismo** (destaque pago de destino, dados de intenção).
- **Marketplace de consultores de viagem** — consultor monta roteiro no nosso editor, cobra do cliente, a plataforma fica com % (take-rate de serviço, não de estoque — segue neutro).

---

## Visão de médio prazo: de afiliado a merchant

O teto da comissão de afiliado (4-8%) é baixo. Com volume comprovado, avaliar **virar merchant-of-record** via **[Duffel](players/duffel.md)** (voo: markup próprio + US$2/ancillary + share de hotéis) ou Expedia Rapid "Partner Collect" — capturando a margem cheia em vez de uma fatia. Exige operação de pagamento/suporte/risco; só faz sentido com escala. **Nunca via Amadeus Self-Service** (descomissionada em 17/07/2026).

## Stack de redes (enxuto)

| Rede | Cobre | Quando |
|---|---|---|
| **Travelpayouts** | Kiwi, Trip.com, GYG, Klook, Omio, Hostelworld, Civitatis, Aviasales | **Semana 1** (1 cadastro destrava ~10 players, fit BR) |
| **Programas próprios** | Viator (aprova em minutos), Civitatis, Agoda, Wise, Revolut | Semana 1-2 (alto payout, valem o cadastro direto) |
| **Awin + CJ** | Booking, Rentalcars, hospedagem | Desde o início (evita o "Bookinggeddon") |
| **Impact** | Skyscanner, Revolut | Conforme necessidade |
| **Partnerize** | Expedia, Wise, Hostelworld | Conforme necessidade |

**Centralizar tudo num gerenciador de links com UTM** pra medir conversão por categoria e cortar o que não performa. Implementação técnica: a camada `withAffiliate(url)` da [Oportunidade #2](03-oportunidades.md) lê os IDs de rede de variáveis de ambiente.

## Projeção ilustrativa (unit economics)

> Números ilustrativos pra raciocínio, não previsão.

- **Assinatura:** 1.000 assinantes Premium (R$19) = **R$ 19k/mês** recorrente. Com 5% de conversão do free, isso implica ~20k usuários ativos.
- **Afiliado:** um viajante que reserva voo (Kiwi US$13,50) + 2 tours (Viator US$8 cada em ticket €90) + Wise (£15) + eSIM (Klook) ≈ **US$ 40-60 de comissão por viagem executada**. A 500 viagens executadas/mês = **~US$ 25k/mês**.
- **Insight:** assinatura dá previsibilidade e financia a aquisição; afiliado escala com o uso. Juntos, **a receita por usuário cresce sem aumentar o preço da assinatura** — porque o mesmo roteiro que ele pagou pra montar gera comissão quando ele executa.
