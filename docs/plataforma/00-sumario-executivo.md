# Mundo Sem Fim — Plataforma de Decisão de Viagem
## 00 · Sumário Executivo & Índice

> **Para o Felipe, ao acordar.** Pesquisa de mercado profunda (37 players), estratégia completa de produto/monetização/parceiros, e **código novo já entregue e testado** que materializa o diferencial. Tudo em pt-BR, versionado neste repo.
> _Gerado em jun/2026 por orquestração multiagente (41 agentes de pesquisa + síntese)._

---

## TL;DR (o essencial em 6 linhas)

1. Pesquisei **37 players** globais de viagem num framework de 20 pontos cada (Booking, Expedia, Skyscanner, Viator, Wise, Hopper, Wanderlog… perfis completos em [`players/`](players/)).
2. Achei **10 gaps sistêmicos** — dores que o mercado inteiro erra. **5 já estão resolvidos no nosso código.**
3. A tese: somos a **camada de decisão neutra** acima das OTAs (assinatura + afiliado, sem conflito de interesse).
4. **Construí e testei** a camada de inteligência que faltava (Score, Motor de Decisão, Super-perfil, Central de Oportunidades, Custo Total) + a tela `/decisao`. **86 testes verdes, build verde, verificada no navegador.**
5. Mapeei a monetização real (comissões por categoria, redes, Travelpayouts-first) e as 18 integrações em 7 fases (com a flag de que **Amadeus morre em jul/2026 → usar Duffel**).
6. Entreguei os **12 documentos** do briefing + backlog acionável + prompt de implementação.

---

## Os 12 entregáveis (o que o briefing pediu)

| # | Documento | O que tem |
|:---:|---|---|
| 1 | [Relatório de Mercado](01-relatorio-de-mercado.md) | panorama dos 37 players por categoria + padrões |
| 2 | [Matriz Competitiva](02-matriz-competitiva.md) | tabela 37×12 (força/fraqueza/receita/API/afiliado/comissão/integrável) |
| 3 | [Oportunidades](03-oportunidades.md) | 12 movimentos acionáveis (P0-P3), cada um amarrado ao código |
| 4 | [Gaps do Mercado](04-gaps-do-mercado.md) | **o que ninguém faz bem** — a tese (5/10 já no nosso código) |
| 5 | [Proposta de Produto](05-proposta-de-produto.md) | visão, posicionamento, personas, 10 diferenciais, telas, fluxos |
| 6 | [Modelo de Monetização](06-modelo-de-monetizacao.md) | assinatura + 17 linhas de comissão + redes + merchant futuro |
| 7 | [Estratégia de Parceiros](07-estrategia-de-parceiros.md) | B2B/B2C, área de parceiros, marketplace de consultores |
| 8 | [Arquitetura Técnica](08-arquitetura-tecnica.md) | stack, camadas, seam, 18 integrações, segurança/LGPD |
| 9 | [Roadmap](09-roadmap.md) | 4 horizontes (MVP→receita→B2B→global) + métricas/riscos/custos |
| 10 | [Backlog](10-backlog.md) | técnico · UX · dados · monetização (P0-P3, esforço) |
| 11 | [Prompt de Implementação](11-prompt-de-implementacao.md) | prompt pronto pro Cursor/Claude, no estilo do repo |
| 12 | [Critérios de Qualidade](12-criterios-de-qualidade.md) | a régua de cada entrega + as 2 réguas finais |

**Dados de apoio:** [matriz](02-matriz-competitiva.md) · [tabela de monetização](_dados/tabela-monetizacao.md) · [tabela de integrações](_dados/tabela-integracoes.md) · [perfis dos 37 players](players/).

---

## O achado central

> **O mercado é gigante em transação e cego em decisão.** Os 37 players competem em "te vender a reserva mais barata"; quase nenhum responde *"essa viagem inteira faz sentido pra mim e cabe no meu bolso?"*.

Isso é **estrutural, não acidental**: quem vive de comissão de estoque não pode dar conselho neutro. Por isso a camada de decisão é defensável — os incumbentes não a ocupam sem canibalizar a própria receita. Os 10 gaps:

| Gap | Status no nosso app |
|---|---|
| Custo TOTAL realista (não só voo+hotel) | ✅ pronto (`calc.js`+`custoTotal.js`) |
| Decisão de DESTINO (pra onde ir) | ✅ pronto (`decisao.js`+`/decisao`) |
| Roteiro vivo que recalcula | ✅ pronto (`calc.js`+`budget.js`) |
| Orçamento prescritivo (onde cortar) | ✅ pronto (`budget.js`) |
| Transparência de custos ocultos | ✅ estrutural (não vendemos reserva) |
| Super-perfil que aprende | ⚙️ `perfil.js` pronto; falta plugar o loop |
| Consciente de visto/estação | ✅ pronto (`statusEstacao`/`statusVisto`) |
| Neutralidade (lado do viajante) | ✅ estrutural (assinatura+afiliado) |
| Workspace contínuo | ✅ pronto (tudo no mesmo plano) |
| Pós-venda que não abandona | ✅ estrutural (não intermediamos) |

Detalhe em [04 · Gaps](04-gaps-do-mercado.md).

---

## O que eu CONSTRUÍ nesta sessão (código, não só doc)

A pesquisa confirmou que faltava a **camada de inteligência de decisão**. Então construí — funções puras, testadas, no padrão da casa (`app/_engine/`):

| Arquivo | O que faz | Diferencial |
|---|---|---|
| `indices.js` | índices por país (segurança, gastronomia, natureza, cultura…) | base do score/decisão |
| `score.js` | **Score de Viagem** em 8 dimensões (custo-benefício, segurança, risco, economia…) | diferencial #9 |
| `perfil.js` | **Super-perfil** do viajante (9 interesses, 9 presets, `aprender()`) | diferencial #6 |
| `decisao.js` | **Motor de Decisão** (ranqueia destinos por perfil + "porquê") | diferencial #1 |
| `oportunidades.js` | **Central de Oportunidades** determinística (visto, orçamento, estação) | diferencial #8 |
| `custoTotal.js` | **Custo Total Realista** (vida+transporte+seguro+eSIM+visto+contingência) | diferencial #2 |
| `(marketing)/decisao/` | a tela `/decisao` que materializa tudo (perfil→recomendações→score→oportunidades) | — |

**Prova:** o teste mais forte mostra que os *mesmos 2 destinos* (Bolívia barata vs Portugal premium) produzem **vencedores opostos** conforme o perfil (mochileiro→Bolívia, luxo→Portugal). É o motor de decisão personalizando de verdade — algo que nenhum dos 37 faz de forma transparente.

**Verificação (evidência, não promessa):**
- ✅ **86 testes Vitest** verdes (48 originais + 38 novos) — zero regressão.
- ✅ **`next build`** verde (37 páginas; `/decisao` gera como SSG).
- ✅ Verificada no **navegador (Playwright)**: render correto, **0 erros de console**, personalização ao vivo (trocar perfil reordena as recomendações). Screenshots em `decisao-full.png` / `decisao-luxo.png`.

---

## Os 3 primeiros passos (se eu fosse você)

1. **Ligar a receita (semana 1, baixo esforço):** cadastrar **Travelpayouts** (1 cadastro destrava Kiwi/Trip.com/GYG/Klook/Omio/Civitatis) + Viator/Wise diretos, e implementar `withAffiliate()` ([Oportunidade #2](03-oportunidades.md)). Você já manda tráfego de altíssima intenção de graça.
2. **Empacotar o diferencial (semana 1-2):** o bloco **"Custo de vitrine vs Custo real"** ([Oportunidade #1](03-oportunidades.md)) — prova visual da dor nº 1 do mercado, gancho de conversão.
3. **Comunicar:** a `/decisao` já está pronta e linda. Use-a como a tela-herói do marketing ("o copiloto que decide com você").

---

## Pendências de credencial (do seu lado — não bloqueiam o produto)
- Envs Stripe na Vercel + `STRIPE_WEBHOOK_SECRET` (ver `docs/STRIPE-SETUP.md`).
- Cadastros de afiliado (Travelpayouts/Viator/Wise) → preencher `NEXT_PUBLIC_AFF_*`.
- (Opcional) `GOOGLE_PLACES_API_KEY` com billing+cap, quando for enriquecer fichas.

Tudo segue o padrão **"não configurado = no-op seguro"**: o app funciona 100% sem nenhuma dessas chaves.

---

*Bom descanso — está tudo aqui, pesquisado, decidido, documentado e, no que dava, já construído e testado. 🌍*
