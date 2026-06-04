# 05 · Proposta de Produto

> O produto ideal, destilado da pesquisa. Receita em [06](06-modelo-de-monetizacao.md), arquitetura/DB/APIs em [08](08-arquitetura-tecnica.md), roadmap em [09](09-roadmap.md), backlog em [10](10-backlog.md).

## Visão geral

**Mundo Sem Fim é a camada de inteligência de decisão de viagem** — um copiloto neutro que vive *acima* das OTAs. Onde o mercado te ajuda a *comprar* (a reserva mais barata), nós te ajudamos a *decidir* (a viagem certa pra você, no mês certo, dentro do bolso, sem erro) — e só então te entregamos ao melhor fornecedor.

> **A frase que resume:** *os outros apps respondem "quanto custa a passagem?"; nós respondemos "essa viagem inteira faz sentido pra mim e cabe no meu bolso?".*

## Posicionamento

Não é "mais uma OTA", "mais um metasearch" nem "mais um planejador de POIs". É uma **categoria nova**: a infraestrutura de decisão, planejamento e monetização de viagens. Defensável porque os incumbentes não podem copiá-la sem canibalizar o próprio modelo de receita (quem vive de take-rate de estoque não pode ser neutro — [gap 8](04-gaps-do-mercado.md)).

| | OTA (Booking) | Metasearch (Skyscanner) | Planejador (Wanderlog) | **Mundo Sem Fim** |
|---|:---:|:---:|:---:|:---:|
| Decide o destino *com* você | ❌ | ❌ | ❌ | ✅ |
| Custo TOTAL real da viagem | ❌ | ❌ | ❌ | ✅ |
| Roteiro que recalcula | ❌ | ❌ | parcial | ✅ |
| Consciente de visto/estação | ❌ | ❌ | ❌ | ✅ |
| Conselho neutro | ❌ | ❌ | ✅ | ✅ |
| Executa a reserva | ✅ | redirect | redirect | redirect (neutro) |

## Personas (público BR)

**1. Marina, a mochileira de longa duração (núcleo).** 28 anos, vai rodar 4-5 países da Ásia em 4 meses. Dor: encaixar estação × visto × orçamento numa timeline longa sem furar nada. *Já é o caso de uso central do motor.* Paga Pro pelo multi-país + cortes de orçamento.

**2. Rafael & Bia, o casal das férias anuais.** 30 e poucos, 15 dias, querem decidir entre Peru, Portugal e Tailândia. Dor: "qual faz mais sentido pra gente, neste mês, com R$ X?". Usam `/decisao` e `/comparar`. Pagam Premium pelo roteiro pronto + comparar por perfil.

**3. Lucas, o nômade digital.** Multi-país contínuo, precisa de visto datado, câmbio e custo de vida real. Dor: cartão internacional, IOF, janela de visto. Pro. Alto valor de afiliado (Wise, eSIM, seguro).

**4. Família Souza.** Pais + 2 filhos, querem segurança e previsibilidade de custo. Dor: "vai dar quanto, no total, e é seguro?". Premium. Valoriza Score de segurança + custo total honesto.

**5. Camila, a consultora/criadora (lado B2B).** Monta roteiros pros seguidores/clientes. Quer uma ferramenta melhor que a planilha e monetizar. Usa o editor + marketplace/roteiro assinado ([07](07-estrategia-de-parceiros.md)).

## Os 10 diferenciais obrigatórios — com status real

| # | Diferencial | Status | Onde |
|---|---|:---:|---|
| 1 | **Motor de decisão** ("qual faz sentido pra mim") | ✅ **Pronto** | `decisao.js` + `/decisao` |
| 2 | **Custo total realista** (tudo, não só voo+hotel) | ✅ **Pronto** | `calc.js` + `custoTotal.js` |
| 3 | **Comparação inteligente** (destinos por custo-benefício/segurança/clima/perfil) | ✅ **Pronto** | `/comparar` + `score.js` |
| 4 | **IA de roteiro útil** (monta, explica, recalcula) | ✅ **Pronto** | `/roteiro` + `services.js` |
| 5 | **Monetização invisível** (recomenda o melhor, monetiza com afiliado) | ⚙️ **Estrutural** | tese [06](06-modelo-de-monetizacao.md); falta `withAffiliate` |
| 6 | **Super-perfil que aprende** | ⚙️ **Parcial** | `perfil.js`; falta loop de aprendizado |
| 7 | **Roteiro vivo** (muda com clima/visto/orçamento) | ✅ **Pronto** (clima/visto/orçamento) · ⏳ tempo-real (lotação/preço) | `calc.js` |
| 8 | **Central de oportunidades** ("se trocar X, economiza Y") | ✅ **Pronto** | `oportunidades.js` |
| 9 | **Score de viagem** (8 dimensões) | ✅ **Pronto** | `score.js` |
| 10 | **Plataforma parceira** | ⏳ **Planejado** | spec em [07](07-estrategia-de-parceiros.md) |

**7 de 10 prontos, 2 parciais, 1 planejado.** O produto não é uma promessa — é uma realidade que precisa ser empacotada, comunicada e monetizada.

## Mapa de features (status)

### ✅ Núcleo de decisão (pronto)
Custo total real · custos mín/médio/conforto · score 8 dimensões · comparador de destinos · motor de decisão por perfil · otimizador de orçamento (cortes) · otimizador de tempo (ritmo) · ranking custo-benefício · roteiro IA dia-a-dia · plano B de chuva · roteiro grátis · super-perfil (presets) · central de oportunidades · cenários (Rota A vs B) · checklist automático · documentos/visto/comprovante de saída · melhores épocas/clima/estação · câmbio multimoeda · mapa real · favoritos · histórico/salvos · export PDF/print · compartilhar por link · modo offline (localStorage) · IA conversacional (otimizar/oportunidades).

### ⚙️ Em fechamento (parcial → oportunidades [03](03-oportunidades.md))
Memória de preferências que **aprende** das ações (#8) · monetização afiliada **ligada** (#2) · roteiro **reservável** (#6) · câmbio ao vivo + cartão Wise (#4) · modo grupo/rateio (#5).

### ⏳ Próximas (roadmap [09](09-roadmap.md))
Voos em tempo real (Skyscanner/Duffel) · hospedagens/passeios em tempo real (Booking/Viator API) · alertas de preço push/e-mail · previsão "comprar/esperar" · roteiros temáticos (gastronômico/romântico/família/luxo/acessível) via presets de perfil · roteiro vivo a lotação/preço · vacinas/segurança/golpes por destino · internet/chip · transporte local · plataforma parceira · marketplace de consultores · SEO programático · i18n.

> Os "roteiros temáticos" (gastronômico, romântico, família, mochileiro, luxo, acessível) **não são telas separadas** — são presets do `perfil.js` que reponderam o Score e o roteiro IA. Um eixo, infinitos roteiros.

## Telas & fluxos

**O fluxo-mestre (tudo escreve no mesmo plano):**
```
/explorar ──> /destino/[slug] ──> ♥ favoritar ──> /comparar ──> /decisao
   (descobrir)    (aprofundar)                      (decidir)   (score+perfil)
                                                                     │
                                       "adicionar à rota" ──────────▶ /planejar
                                                                     │ (montar)
                                          /roteiro <── gerar IA ◀────┘
                                          (dia-a-dia)                │
                                          /voos · reservar (afiliado)│
                                                                     ▼
                                          /planos ──> assinar (Stripe)
```

**Telas principais:**
- **`/` landing** — posicionamento + prova de valor + CTA.
- **`/explorar`** — busca/filtros (região/orçamento/estilo), grade de destinos.
- **`/destino/[slug]`** — fatos, pontos turísticos reais (Wikidata), gastronomia, custos 3 tiers, imagens creditadas, deep-links, "adicionar à rota", "gerar roteiro".
- **`/decisao`** ★ — perfil do viajante → destinos recomendados (ranqueados + "porquê") → Score da viagem (8 dimensões) + custo total → central de oportunidades.
- **`/comparar`** — destinos lado a lado (custo/época/visto/score).
- **`/planejar`** — o planner (tripé estação×visto×fôlego, multi-moeda, mapa, cenários, budget, checklist).
- **`/roteiro`** — roteiro IA dia-a-dia (gated PDF).
- **`/voos`** — busca (mock→real) + deep-links + alerta.
- **`/planos` · `/conta`** — assinatura.
- **`/parceiros`** ⏳ — área B2B ([07](07-estrategia-de-parceiros.md)).

**Fluxos críticos:**
- **Decisão:** indeciso entra em `/decisao`, escolhe perfil, vê destinos rankeados pra ele → favorita → compara → adiciona à rota.
- **Orçamento estoura:** o app detecta (`budget.js`), a central de oportunidades diz onde cortar, 1 clique aplica.
- **Furo de visto:** `oportunidades.js` alerta (P0) antes de embarcar → vira gancho de e-mail.
- **Executar:** no roteiro, cada item pago tem "reservar" (afiliado, last-click).

## Banco de dados, APIs, receita, roadmap, backlog
Cada um tem seu documento: **DB & APIs** → [08](08-arquitetura-tecnica.md) + [`tabela-integracoes`](_dados/tabela-integracoes.md); **receita** → [06](06-modelo-de-monetizacao.md); **crescimento & roadmap** → [09](09-roadmap.md); **backlog** (técnico/UX/dados/monetização) → [10](10-backlog.md).

## A régua final
> **Viajante:** *"Eu pagaria por isso porque economiza tempo, dinheiro e evita erro na viagem."*
> **Parceiro:** *"Eu quero integrar porque gera intenção real de compra, tráfego qualificado e conversão."*

Toda decisão de produto se mede contra essas duas frases. Critérios completos em [12](12-criterios-de-qualidade.md).
