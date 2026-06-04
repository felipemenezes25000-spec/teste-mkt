# 09 · Roadmap

> Quatro horizontes, do que já existe ao global. Cada item linka a oportunidade ([03](03-oportunidades.md)) ou backlog ([10](10-backlog.md)) correspondente.

## Horizonte 0 — Fundação (✅ entregue, jun/2026)

A base já está no ar e testada — **não é roadmap, é ativo**:
- Planner completo (estação × visto × fôlego), multi-moeda, mapa real, cenários, budget prescritivo, checklist, share.
- Rotas premium: landing, `/explorar`, `/destino/[slug]` (22 SSG), `/comparar`, `/roteiro` IA, `/voos` (mock+seam), `/planos`+`/conta`.
- **Camada de inteligência:** `score.js`, `decisao.js`, `perfil.js`, `oportunidades.js`, `custoTotal.js`, `indices.js` + tela `/decisao`.
- Assinatura Stripe real, IA server-side com login+cota, dark mode, 86 testes Vitest.

## Horizonte 1 — Do MVP à receita (0-3 meses) 🎯

**Tema: ligar a monetização e fechar os loops já construídos.** Maior ROI, menor esforço.

| Sprint | Entrega | Oportunidade |
|---|---|---|
| 1-2 | **Bloco "Custo de vitrine vs Custo real"** na decisão/destino/roteiro | [#1](03-oportunidades.md) |
| 1-2 | **`withAffiliate()`** + cadastro Travelpayouts/Viator/Civitatis/Wise | [#2](03-oportunidades.md), [06](06-modelo-de-monetizacao.md) |
| 3-4 | **Câmbio ao vivo "em reais hoje"** + CTA Wise/Revolut | [#4](03-oportunidades.md) |
| 3-4 | **Roteiro reservável** (botão por item, last-click) | [#6](03-oportunidades.md) |
| 5-6 | **eSIM/seguro/transfer** como CTA monetizado | [#7](03-oportunidades.md) |
| 5-6 | **Alerta de visto/estação** (badge + seam e-mail) | [#9](03-oportunidades.md) |

**Meta do horizonte:** primeira receita de afiliado fluindo + assinatura validada (free→paid > 3%). **Marco:** "a viagem que o usuário monta já gera comissão quando ele executa."

## Horizonte 2 — Profundidade Premium & retenção (3-6 meses)

**Tema: o fosso que cresce com o uso.**
- **Perfil que aprende** das ações (favoritar/gerar/adicionar nutre o `perfil.js`; persiste no Supabase) — [#8](03-oportunidades.md).
- **Comparar "pelo seu perfil"** gated Premium — [#10](03-oportunidades.md).
- **Modo grupo / rateio** (Pro) — [#5](03-oportunidades.md).
- **Voos reais** via Skyscanner/Travelpayouts no seam (`buscarVoos`) + previsão "comprar/esperar" (anti-Hopper) — [#3](03-oportunidades.md).
- **Hospedagem/experiências reais** na UI via API (Booking Demand/Viator Full) onde aprovado.
- **Roteiros temáticos** (gastronômico/romântico/família/luxo/acessível) como presets de perfil.
- **Vacinas/segurança/golpes/chip/transporte local** por destino (camada de dados).

**Meta:** retenção 30d > 25%, NPS positivo, "a feature que salva a viagem" como gancho de marketing.

## Horizonte 3 — Plataforma B2B (6-12 meses)

**Tema: virar infraestrutura que outros usam.** Detalhe em [07](07-estrategia-de-parceiros.md).
- **Área de Parceiros** (`/parceiros`): cadastro de ofertas, campanhas, cupons, painel de performance.
- **Gestão de afiliados/comissões** + relatórios exportáveis.
- **White-label** piloto com 1-2 agências.
- **Roteiro assinado por influenciador** + receita dividida.
- **Marketplace de consultores** (beta).
- **API Premium** (motor de decisão como serviço) + **dados agregados de tendência** (anonimizados) pra secretarias.
- **Painel admin** (moderação, assinaturas, saúde de integrações).

**Meta:** ≥1 linha de receita B2B ativa (white-label OU dados OU marketplace), 5+ parceiros pagantes.

## Horizonte 4 — Global & transacional (12+ meses)

**Tema: escala internacional e captura de margem cheia.**
- **i18n** (EN/ES primeiro — Civitatis prova o apetite hispânico).
- **Roteiro vivo em tempo real** (lotação, preço, horário, atraso de voo, localização atual, orçamento restante).
- **Merchant-of-record via Duffel** (vender voo/stays no app com markup próprio) — só com volume comprovado ([06](06-modelo-de-monetizacao.md)).
- **App nativo** (hoje PWA cobre instalação).
- **SEO programático** em escala (rotas "custo de X", "melhor época de X", "X vs Y") — [#12](03-oportunidades.md).
- **Cobertura de destinos** muito além dos 22 atuais (via APIs ao vivo + cache).

**Meta:** presença internacional, receita transacional complementando afiliado, aquisição orgânica dominante.

---

## Métricas por horizonte

| Métrica | H1 | H2 | H3 |
|---|---|---|---|
| **Ativação** (montou 1ª rota) | baseline | +20% | — |
| **Free → Paid** | >3% | >5% | >6% |
| **Retenção 30d** | baseline | >25% | >30% |
| **EPC** (earnings per click afiliado) | medir | otimizar | — |
| **% roteiros com ≥1 clique afiliado** | >20% | >40% | — |
| **Receita B2B** | — | — | ≥1 linha |
| **MRR** (assinatura) | primeiro R$ | crescer | escalar |

Funil instrumentado: `explorar → destino → comparar → decisao → planejar → roteiro → reservar → assinar` (ver [08 · Observabilidade](08-arquitetura-tecnica.md)).

## Riscos & mitigações

| Risco | Impacto | Mitigação |
|---|---|---|
| Dependência de afiliado (ex.: "Bookinggeddon") | Alto | Multi-rede (Travelpayouts+Awin+CJ), nunca um só programa |
| Amadeus Self-Service EOL 17/07/2026 | Médio | Preferir Duffel; mock como default |
| Custo de Google Places escala | Médio | OSM/Wikidata como base; Places com cap + rate-limit |
| Aquisição cara (CAC) | Alto | SEO programático + influenciadores + free viral |
| IA cara/abusada | Médio | Login + cota atômica (já feito); cache de respostas |
| Comissão de afiliado é teto baixo | Médio | Assinatura como base previsível; merchant via Duffel no futuro |
| Dados de visto/custo desatualizam | Médio | Disclaimer "confira na fonte", campos editáveis, revisão datada |

## Custos (ordem de grandeza)

- **H0-H1:** ~zero infra (Vercel Hobby→Pro ~US$20/mês quando comercial; Supabase free→Pro ~US$25/mês; Stripe % por transação; IA pay-as-you-go com cota). Afiliados = grátis de aderir.
- **H2:** + Google Places (pay-per-call, com cap), e-mail/push (Resend/OneSignal ~US$0-20/mês), domínio.
- **H3:** + custo de suporte/operação B2B, possivelmente um BD/analytics dedicado.
- **H4:** + i18n (tradução), operação de merchant (suporte/reembolso/fraude via Duffel), app stores.

**Prioridade orçamentária:** gastar primeiro no que liga receita (H1 é quase custo-zero), reinvestir a receita de afiliado/assinatura nos horizontes seguintes.
