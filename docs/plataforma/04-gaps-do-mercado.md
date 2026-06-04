# 04 · Gaps do Mercado — o que NINGUÉM faz bem

> O resultado mais importante da pesquisa. Cruzando as limitações dos 37 players, **10 gaps sistêmicos** aparecem — dores reais do viajante que o mercado inteiro erra, não defeito isolado de um app. Cada gap vira um diferencial nosso.
> **Achado central:** **5 dos 10 gaps já estão materializados em código** no Mundo Sem Fim (jun/2026). Não é roadmap distante — é vantagem que já existe e precisa ser *empacotada e comunicada*.

## Mapa rápido

| # | Gap | Impacto | Quem falha | Status no nosso app |
|---|-----|:---:|:---:|---|
| 1 | **Custo TOTAL realista** (não só voo+hotel) | 🔴 Alto | ~33/37 | ✅ **Pronto** — `calc.js` + `custos.js` + `custoTotal.js` |
| 2 | **Decisão de DESTINO** (pra onde ir), não de fornecedor | 🔴 Alto | ~31/37 | ✅ **Pronto** — `/comparar` + `decisao.js` + `/decisao` |
| 3 | **Roteiro vivo que RECALCULA** (logística real) | 🔴 Alto | ~19/37 | ✅ **Pronto** — `/roteiro` + `calc.js` + `budget.js` + `cenarios.js` |
| 4 | **Orçamento PRESCRITIVO** ("onde cortar"), não descritivo | 🔴 Alto | ~14/37 | ✅ **Pronto** — `budget.js` (`sugerirOrcamento`/`aplicarCortes`) |
| 5 | **Transparência de custos ocultos** (preço honesto) | 🔴 Alto | ~17/37 | ✅ **Estrutural** — não vendemos reserva, sem fee escondido |
| 6 | **Super-perfil que aprende e é portátil** | 🟡 Médio | ~28/37 | ⚙️ **Parcial** — `perfil.js` pronto; falta loop de aprendizado nas ações |
| 7 | **Roteiro consciente do calendário** (estação/visto) | 🔴 Alto | ~22/37 | ✅ **Pronto** — `statusEstacao`/`statusVisto` em `calc.js` |
| 8 | **Neutralidade** (conselho do lado do viajante) | 🟡 Médio | ~16/37 | ✅ **Estrutural** — receita é assinatura+afiliado, não take-rate de estoque |
| 9 | **Viagem como UM workspace contínuo** | 🟡 Médio | ~21/37 | ✅ **Pronto** — rotas que escrevem no mesmo plano |
| 10 | **Pós-venda que não abandona o viajante** | 🟡 Médio | ~25/37 | ✅ **Estrutural** — não intermediamos a transação; checklist preventivo |

A leitura estratégica: **o mercado é gigante em transação e cego em decisão.** Os 37 players competem ferozmente em "te vender a reserva mais barata"; quase nenhum responde "essa viagem inteira faz sentido pra mim e cabe no meu bolso?". É exatamente o espaço onde o Mundo Sem Fim já está.

---

## Os 10 gaps em detalhe

### Gap 1 — Custo TOTAL realista da viagem 🔴
**A dor.** Todo app mostra só o preço do que *ele* vende (passagem, diária, tour, carro, câmbio), nunca a soma realista de tudo que custa *viver* a viagem: hospedagem + comida + transporte local + atrações + seguro + câmbio + taxas + imprevistos, somados por dia e por destino. O viajante sai sabendo "quanto custa a passagem", mas não "quanto essa viagem inteira vai custar de verdade". **Resultado universal: todo mundo abre uma planilha por fora.** É a dor nº 1 e o ponto cego mais transversal dos 37 players.

**Nosso diferencial (já no código).** O motor `calc.js` soma vida diária (na moeda nativa de cada trecho, convertida pelo câmbio do dia via open.er-api) + transporte entre países → `custoTotal`, `custoTerraTotal`, `custoTransporteTotal`, `mediaDia`. O `custos.js` quebra o gasto em 5 categorias (hospedagem 40%, comida 28%, transporte 12%, atrações 12%, extras 8%) em 3 níveis (mochila/médio/conforto). O novo `custoTotal.js` ainda soma **seguro, eSIM, vistos e 12% de contingência** — o número que entregamos é "a viagem inteira custa X", não "a diária custa X".

### Gap 2 — Decisão de DESTINO, não lista de fornecedores 🔴
**A dor.** Todo o mercado assume que você *já decidiu* o destino e só ajuda a comparar fornecedores dentro dele (hotel A vs B). Ninguém cobre o topo do funil: "Peru vs Tailândia vs Portugal — qual faz mais sentido pra MIM, neste mês, com este orçamento e este estilo?", cruzando custo total, melhor época, visto, segurança e vibe lado a lado. O viajante indeciso — quem mais precisa de ajuda — decide no escuro ou por achismo de blog.

**Nosso diferencial (já no código).** `/comparar` monta a tabela de decisão de destinos a partir dos favoritos; o novo motor `decisao.js` ranqueia destinos pelo **perfil do viajante** (não alfabético, não por comissão) com um "porquê" por recomendação; e a nova tela `/decisao` materializa isso. É comparação de *sonhos de viagem por adequação ao perfil*, não de fornecedores por preço.

### Gap 3 — Roteiro vivo que RECALCULA 🔴
**A dor.** O mercado se divide entre quem só *organiza* o que você já reservou (itinerário de compras) e quem entrega uma *lista bonita de POIs* sem logística. Quase ninguém gera um roteiro dia-a-dia executável — sequência por proximidade, deslocamento real, horários, ritmo, plano B de chuva, alternativa grátis — que **recalcula** quando você corta um dia ou troca a ordem.

**Nosso diferencial (já no código).** (1) `/roteiro` gera o dia-a-dia com hora, local, custo por item, categoria, plano B de chuva, alternativa grátis + checklist/documentos/segurança. (2) Não é estático: `calc.js` re-deriva datas/estação/visto/fôlego a cada mudança; `budget.js` corta e reescreve o plano; `cenarios.js` versiona Rota A vs B. Mudou um input, tudo recalcula.

### Gap 4 — Orçamento PRESCRITIVO 🔴
**A dor.** Quando existe orçamento, é sempre *descritivo e tardio*: um filtro de preço, um split de despesas depois de gastar, um tracker do que já saiu. Ninguém faz o inverso: "meu teto é X; esta viagem estoura; me diga EXATAMENTE onde cortar (quais dias, em quais países) pra caber". O viajante recebe o diagnóstico, mas resolve o quebra-cabeça sozinho na planilha.

**Nosso diferencial (já no código).** É literalmente o que `budget.js` faz, plugado na UI (BudgetPanel). `sugerirOrcamento(calc)` calcula o excesso e prioriza o corte de forma inteligente — primeiro países que já são problema (furando visto > fora de época > maior custo/dia), com piso de 5 dias/país — e lista quantos dias cortar em cada um com a economia exata. `aplicarCortes(plan)` reescreve o plano num clique. Prescrição acionável: "corte 6 dias na Argentina e 4 na Indonésia → cabe".

### Gap 5 — Transparência de custos ocultos 🔴
**A dor.** A reclamação mais corrosiva de TODO o mercado transacional: o *bait-and-switch* de preço — a tarifa sobe no checkout por taxas, câmbio e fees tardios; markup cambial escondido; surcharge de balcão. O viajante nunca confia no número exibido. **Ninguém entrega um número honesto porque o modelo de receita de quase todos depende de empurrar a reserva.**

**Nosso diferencial (estrutural).** Não vendemos a reserva → não há conflito de interesse pra esconder fee. Somos a camada de decisão neutra. O custo é construído item a item, por categoria e por trecho, com câmbio explícito do dia (e fallback transparente "usando taxas salvas"). Cada estimativa é rotulada honestamente, e visto/comprovante de saída/extensão entram como atrito *visível*, não surpresa no balcão.

### Gap 6 — Super-perfil que aprende e é portátil 🟡
**A dor.** Quase ninguém mantém um perfil rico, persistente e *portátil* do viajante (estilo, ritmo, orçamento real, com quem viaja, restrições, tolerância a risco, passaporte). Onde "personalização" existe, ela serve ao funil (recomenda o de maior take-rate, não o melhor). Cada busca recomeça do zero; as preferências ficam presas no ecossistema de cada fornecedor.

**Nosso diferencial (parcial — oportunidade clara).** O "tripé" (estação × visto × fôlego) já é um perfil estrutural persistente, salvo (localStorage + Supabase) e portátil (export + link `#r=`). O novo `perfil.js` adiciona o **DNA explícito do viajante** (9 interesses + presets + `aprender()`). Falta plugar o *loop*: favoritar destino, gerar roteiro e adicionar à rota devem nutrir o perfil automaticamente (ver [03 · Oportunidades](03-oportunidades.md), P2).

### Gap 7 — Roteiro consciente do calendário 🔴
**A dor.** O mercado trata a viagem como atemporal: vende destino e logística sem cruzar a *data* com a realidade do lugar — melhor época, monção, janela de visto que expira, alta vs baixa temporada. O viajante reserva 7 dias num lugar em plena monção, ou fica mais que o visto permite, **e ninguém avisa.**

**Nosso diferencial (já no código).** É o eixo central de `calc.js`: `statusEstacao` classifica cada estadia em bom/parcial/ruim cruzando a chegada (derivada da ordem) com os `melhoresMeses`; `statusVisto` marca "over" quando os dias furam o limite daquele passaporte. Reordenou os países? Datas e estação recalculam. É o plano consciente do calendário que ninguém entrega.

### Gap 8 — Neutralidade (conselho do lado do viajante) 🟡
**A dor.** Mesmo na onda de IA, quase todo player tem conflito de interesse estrutural: a "inteligência" serve ao funil de venda, não à melhor decisão neutra. Rankings sofrem viés comercial; "comparações" empurram o mais lucrativo; assistentes de IA são camada conversacional sobre a mesma metabusca de preço.

**Nosso diferencial (estrutural).** Receita é **assinatura + afiliado last-click**, não take-rate de estoque próprio → o incentivo é a melhor decisão do usuário. A IA raciocina sobre estação/visto/fôlego e custo total; os deep-links existem como *conveniência de execução depois da decisão*, não como o produto. (Ver a tese de monetização em [06](06-modelo-de-monetizacao.md).)

### Gap 9 — A viagem como UM workspace contínuo 🟡
**A dor.** O viajante costura a jornada em silos: decide destino num blog, voo num metasearch, hotel em outro, atividades num terceiro, transporte num quarto, divide despesas num quinto, organiza numa planilha. Nenhum player oferece um workspace único onde "descobrir → comparar → montar roteiro → ver custo total → ajustar orçamento → executar" vive num lugar só.

**Nosso diferencial (já no código).** Mundo Sem Fim *é* o workspace: `/explorar → /destino/[slug] → /comparar → /decisao → /planejar → /roteiro → /voos` onde tudo escreve no MESMO plano. "Adicionar à rota" joga um destino no planner; favoritos alimentam `/comparar`; o plano sincroniza na nuvem, versiona cenários, gera checklist e exporta por link.

### Gap 10 — Pós-venda que não abandona o viajante 🟡
**A dor.** A falha operacional mais universal: reembolsos que demoram meses, muro de chatbot impedindo falar com humano, reservas que "somem", e o empurra-empurra de responsabilidade quando algo dá errado. Como quase todos terceirizam a entrega e ganham por intermediar, ninguém assume a dor quando a viagem quebra.

**Nosso diferencial (estrutural).** Não somos o intermediário da transação → removemos a fonte do empurra-empurra. A reserva é executada direto na fonte/parceiro escolhido pelo viajante, sem uma camada de revenda nossa pra travar reembolso. O checklist deriva documentos/comprovante de saída/seguro da rota pra reduzir o que dá errado *antes* de acontecer. Entregamos clareza e deixamos o viajante no controle.

---

## Conclusão estratégica

O fosso não é uma feature — é uma **categoria**: o Mundo Sem Fim não é "mais uma OTA", é a **camada de inteligência de decisão** que vive *acima* das OTAs. Os 37 players são fornecedores de execução (e fontes de comissão); nós somos o copiloto neutro que decide *com* o viajante e depois o entrega ao melhor fornecedor. Essa posição é defensável justamente porque os incumbentes **não podem copiá-la sem canibalizar o próprio modelo de receita** (quem vive de take-rate não pode ser neutro). Ver a proposta de produto em [05](05-proposta-de-produto.md).
