# 03 · Oportunidades acionáveis

> Doze movimentos concretos para o Mundo Sem Fim, derivados da pesquisa dos 37 players. Cada um está **amarrado a um arquivo de código que já existe** — quase nenhuma é "começar do zero"; a maioria é "fechar o loop" de algo já construído.
> Priorização: **P0** (fazer já) → **P3** (quando houver fôlego). Esforço/retorno entre parênteses.

## Matriz esforço × retorno

```
RETORNO
 alto │  P1 Câmbio+Wise        P0 Custo Honesto      P1 Previsão voo
      │  P0 Ligar afiliados    P1 Modo grupo         P1 Roteiro reservável
 médio│  P2 eSIM/seguro        P2 Aprender perfil    P3 Multimodal real
      │                        P2 Alerta visto       P3 SEO programático
      │                        P2 Comparar gated
      └─────────────────────────────────────────────────────────
         baixo                 médio                 alto   ESFORÇO
```

Regra de ouro: **comece pelo canto superior-esquerdo** (alto retorno, baixo esforço) — Custo Honesto, Ligar Afiliados, Câmbio+Wise. São os três que mais movem ponteiro com menos código.

---

## P0 — Fazer já

### 1. Custo Total Honesto vs. "preço de vitrine" das OTAs (baixo esforço / alto retorno)
**A jogada.** Toda OTA/metabusca para no "voo + hotel" e esconde o resto. Você já tem o motor que ninguém tem (`custoTotal.js` + `custos.js` em 3 tiers). Materialize um bloco comparativo **"Custo de vitrine vs Custo real"** na página de destino, na `/decisao` e no roteiro: "A passagem é US$ 600. A viagem inteira é US$ 3.150 — e aqui está cada item." É o gancho de conversão nº 1, porque ataca a dor nº 1 do mercado (gap 1) com prova visual.
**Código:** `custoTotal.js`, `custos.js` (já existem) + novo componente comparativo.

### 2. Ligar a monetização de afiliado que já está stubada (baixo / alto)
**A jogada.** `links.js` diz explicitamente "sem afiliado, trocáveis quando houver conta" — e hoje `linksVoo`/`linksDestino` não carregam **nenhuma** tag. Você já manda tráfego de altíssima intenção (gente que pagou assinatura e montou a viagem inteira) de graça pra Booking/GYG/Viator. Adicione uma camada `withAffiliate(url)` que lê o ID da rede de uma env e injeta a tag. **Receita começa a fluir sem engenharia pesada.** Ver [06 · Monetização](06-modelo-de-monetizacao.md) e [07 · Parceiros](07-estrategia-de-parceiros.md).
**Código:** `_lib/links.js`, `_engine/utils.js` (linksVoo) + `withAffiliate()`.

---

## P1 — Próxima onda (alto retorno)

### 3. Previsão "compre agora vs. espere" de voo — roubar o único moat do Hopper (médio / alto)
**A jogada.** O ativo defensável do Hopper é dizer "o preço vai subir, compre agora" (e isso vende fintech de 70% de margem). Seu `/voos` hoje tem alerta local que não prevê nada. Use o provider determinístico (`flights.js`) pra desenhar uma **curva de preço por data** e um veredito "comprar/esperar" + mini-gráfico da melhor data. O alerta de preço já é gated Premium.
**Código:** `_lib/flights.js` + `VoosClient`.

### 4. Conversor de câmbio ao vivo no orçamento + cartão Wise (baixo / alto)
**A jogada.** `calc.js` já faz multimoeda (`settings.fx.rates`) e o orçamento vive em USD. Falta o que o viajante pt-BR mais sofre: **"quanto isso dá em REAL hoje, e quanto o IOF/spread do meu banco vai comer?"** Mostre o orçamento "em reais hoje" + um CTA Wise/Revolut (CPA fixo robusto: ~£10–50 por conta, ver [06](06-modelo-de-monetizacao.md)). Fit perfeito: todo viajante BR precisa de cartão internacional, e decide isso *na fase de planejamento* — onde nosso app vive.
**Código:** `calc.js` (fx já presente) + `custoTotal.js` + seam Wise via `withAffiliate`.

### 5. Modo grupo: rateio estilo Splitwise embutido no orçamento (médio / alto)
**A jogada.** Splitwise só divide *depois* e degradou o gratuito (êxodo de usuários — ver [perfil](players/splitwise.md)). Você já calcula custo total e por trecho; adicione "quantos viajantes" + quem paga o quê (voo, hospedagem por trecho, custo diário compartilhado) → divisão **antes** da viagem. Amarra ao `FEATURES.colaboracao = 'pro'` (upsell Pro).
**Código:** novo `split.js` (puro, testável) sobre `custoTotal.js`/`calc.js` + `<Gate>`.

### 6. Roteiro IA "reservável": cada item com deep-link de afiliado + custo somado (médio / alto)
**A jogada.** Wanderlog/Stippl monetizam jogando o roteiro pra fora via redirect. Seu `RoteiroView` já renderiza itens com hora/local/custo e já linka Google Maps. **Feche o loop:** em cada atividade paga, um botão "Reservar" (Viator/GYG por categoria) + somatório de custos no PDF gated. Captura a intenção *no momento exato da decisão* — crítico por causa dos cookies curtos de afiliado (ver [06](06-modelo-de-monetizacao.md)).
**Código:** `RoteiroClient.jsx` + `_lib/links.js`.

---

## P2 — Consolidação (retorno médio, constroem o fosso de retenção)

### 7. eSIM, seguro-viagem e transfer como linha de receita (baixo / médio)
**A jogada.** `custoTotal.js` já *itemiza* seguro, eSIM e taxas de visto como custo — mas só como número. Vire cada linha num CTA monetizado: "Seguro deste roteiro a partir de US$ X" (afiliado SafetyWing/Heymondo), "eSIM pra esta viagem" (Klook eSIM paga ~20%). O número já está na tela; falta o botão.
**Código:** `custoTotal.js` (categorias seguro/esim/vistos) + `withAffiliate`.

### 8. Aprender o perfil das ações — moat de retenção que cresce com o uso (médio / médio)
**A jogada.** `perfil.js` já tem o núcleo de aprendizado (`aprender()`, `destinoParaInteresses()`), mas hoje o perfil só muda quando o usuário troca o preset. **Acione o loop:** ao favoritar destino, gerar roteiro ou adicionar à rota, nutra o perfil automaticamente; persista no Supabase para logados. Quanto mais usa, melhor fica — retenção que a concorrência não tem (gap 6).
**Código:** `perfil.js` + `FavoriteButton`/`AddToRouteButton`/`RoteiroClient`.

### 9. Alerta de visto/estação como gancho de e-mail e prova de valor (médio / médio)
**A jogada.** `oportunidades.js` já detecta furo de visto (P0, risco de deportação) e estadia fora de época — coisas que **nenhum concorrente avisa**. Eleve de painel passivo pra alerta acionável: badge global persistente + seam de e-mail/push pra logados ("Sua viagem fura o visto da Indonésia em 15 dias"). É a feature "que salva sua viagem" — marketing puro.
**Código:** `oportunidades.js` + `calc.js` (`statusVisto`/`statusEstacao`).

### 10. Comparar destinos pelo SEU perfil, gated como upsell Premium (médio / médio)
**A jogada.** `planos.js` já reserva `comparar-avancado` para premium e `decisao.js` já produz as 8 dimensões + "porquê" por destino. Materialize um comparador 2–4 destinos lado a lado: custo total realista, melhor época, visto, e o **score por perfil**. O comparador básico fica grátis (aquisição); o "pelo seu perfil" é o gancho de upgrade.
**Código:** `decisao.js` + `custoTotal.js` + `FEATURES['comparar-avancado']` + `<Gate>`.

---

## P3 — Quando houver fôlego (alto esforço)

### 11. Roteamento multimodal real entre trechos (trem/ônibus/ferry) (alto / médio)
**A jogada.** Hoje o transporte entre trechos é tratado como voo/estimativa. Pra Europa e Sudeste Asiático (seus destaques PT/TR + TH/VN/ID) muita conexão é trem/ônibus/ferry — terreno do Rome2Rio/Omio. Adicione opção multimodal no `TrechoCard` com seam Omio/Rome2Rio afiliado (ambos já em `links.js`).
**Código:** `calc.js` (custoTransporte) + `_lib/links.js` (Rome2Rio já presente).

### 12. SEO programático de páginas de destino/comparação (alto / médio)
**A jogada.** O moat de aquisição do Wanderlog/Lonely Planet/Civitatis é SEO em escala. Você já gera `/destino/[slug]` estáticas (`generateStaticParams`, `revalidate 86400`) com conteúdo real. Crie rotas server-rendered programáticas: "**custo de viajar pra X**", "**melhor época pra X**", "**X vs Y**" — com metadata e JSON-LD. Aquisição orgânica baratíssima.
**Código:** `DestinoPage` (já SSG) + `custos.js`/`indices.js`/`decisao.js` + novas rotas.

---

## Sequência sugerida (90 dias)

1. **Semanas 1–2:** Custo Honesto (#1) + Ligar Afiliados (#2) — receita e diferenciação imediatas.
2. **Semanas 3–6:** Câmbio+Wise (#4) + Roteiro reservável (#6) + eSIM/seguro (#7) — completa o loop de monetização.
3. **Semanas 7–10:** Aprender perfil (#8) + Alerta visto (#9) + Comparar gated (#10) — fosso de retenção + upsell.
4. **Semanas 11–12:** Previsão de voo (#3) + Modo grupo (#5) — features "uau" de marketing.
5. **Depois:** Multimodal (#11) + SEO programático (#12) — escala de aquisição e cobertura.

Detalhamento por tarefa no [10 · Backlog](10-backlog.md). Roadmap por fases no [09 · Roadmap](09-roadmap.md).
