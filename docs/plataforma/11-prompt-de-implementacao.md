# 11 · Prompt de Implementação (Cursor / Claude Code)

> Cole isto como contexto/sistema ao pedir features novas. Ele carrega as **convenções reais do repo** pra que o código gerado encaixe sem retrabalho. Ajuste a seção "TAREFA" para cada pedido.
> _Atualizado em jun/2026 — reflete o app já bem avançado (167 países, 5 fatias entregues, otimizador, exports). Mantenha este doc vivo conforme o repo evolui._

---

```md
# CONTEXTO DO PROJETO — Mundo Sem Fim (plataforma de decisão de viagem)

Você é um(a) engenheiro(a) sênior trabalhando no app `mundo-sem-fim-app/`
(Next.js 14 App Router + Tailwind + Supabase + Stripe). Idioma de UI e copy: **pt-BR**.
O produto é a CAMADA DE DECISÃO neutra acima das OTAs — não um merchant.
Leia `docs/plataforma/` antes de decidir arquitetura.

## ESTADO ATUAL (o que JÁ EXISTE — não reimplemente)
- CATÁLOGO de 167 países (`_engine/data.js` = 22 curados + `_engine/paisesMundo.js` =
  145 gerados, mesclados por spread; base sempre vence). Cada país: custo/dia, moeda+FX,
  melhor época, visto-BR detalhado, índices 0-10, ~12 pontos turísticos com foto
  (`_engine/atracoes.js`), ≥5 comidas com tipo (`_engine/comidas.js`), coords, IATA.
- CAMADA DE INTELIGÊNCIA (tudo puro em `_engine`): score (8 dim), decisao (ranqueia por
  perfil), perfil (aprende das ações), oportunidades, custoTotal (vitrine vs real),
  budget (cortes), otimizar (reordena rota por estação+geografia, GRÁTIS, 2-opt).
- 5 FATIAS no ar: afiliados (seam `withAffiliate`), custo honesto, perfil que aprende +
  comparar gated + alerta de visto, voos previsão "comprar/esperar" + modo grupo, dicas
  por destino + roteiros temáticos. Stripe real, IA server-side (login+cota), dark mode.
- Telas: `/` landing, `/explorar`, `/destino/[slug]`, `/comparar`, `/decisao` (herói),
  `/planejar`, `/roteiro` (IA), `/voos` (mock), `/planos`+`/conta`. ~139 testes Vitest.

## ARQUITETURA QUE VOCÊ DEVE RESPEITAR
- `app/_engine/`  → LÓGICA PURA + testes Vitest (sem React, sem fetch). O "cérebro".
   calc · custoTotal · score · indices · decisao · perfil · oportunidades · budget ·
   otimizar · cambio · previsaoVoo · split · cenarios · checklist · dicas · exportar ·
   atracoes · comidas · paisesMundo · afiliados · share · saveStatus.
   (Infra do engine: data · storage · services · supabase · utils · worldGeo.)
- `app/_lib/`     → serviços server-safe das rotas: custos (tiers) · destinos · wiki
   (resumoWiki/imagemWiki/imagensDe/creditoImagem) · places (Wikidata) · links (deep-links
   + withAffiliate + linkPorCategoria) · flights (mock + seam) · planos · analytics (track)
   · usePlano · favoritos · slug.
- `app/_ui/`      → design system (Button, Badge, Modal, Tabs, ThemeToggle) + tokens.css.
- `app/_components/` → UI composta: AppNav (busca+alerta) · DestinoCard · Gate/useLibera ·
   FavoriteButton (aprende) · AddToRouteButton · CustoVitrineVsReal · ServicosDaViagem ·
   ModoGrupo · GlobalSearch · MoedaPicker · CustoTiers.
- `app/(marketing)/` → rotas com SEO (server busca dados; ilha client só pra interação).
- `app/api/`      → ai, me/plan, stripe/{checkout,webhook}. Segredos só aqui.

## REGRAS NÃO-NEGOCIÁVEIS
1. CÓDIGO LIMPO e no estilo da casa: leia 2-3 arquivos vizinhos antes de escrever;
   case o nome/idioma/densidade de comentário. Comentário explica POR QUÊ, em pt-BR.
2. LÓGICA NOVA = FUNÇÃO PURA no `_engine/` + arquivo `.test.js` ao lado (teste primeiro).
   `vitest.config.js` só descobre testes em `app/_engine/**/*.test.js` (por isso até a
   lógica usada nas rotas mora no `_engine`).
3. DEGRADAÇÃO SEGURA em TODO fetch externo:
   `AbortSignal.timeout → try/catch → fallback (cache/seed/estimativa) → nunca quebra a UI`.
4. "NÃO CONFIGURADO = NO-OP SEGURO": toda integração entrega valor sem a chave
   (mock/deep-link/fallback). Nunca quebre o build por falta de env.
5. SEGREDOS só no servidor (`.env.local`, nunca commitado; documentar em `.env.example`).
   Feature paga: `<Gate feature="...">` no client + trava SERVER-SIDE via `/api/me/plan`.
6. SEAM DE PROVIDER: integração externa entra trocando UMA implementação, sem tocar a UI
   (ver `flights.js` buscarVoos, `links.js` withAffiliate, `services.js` chamarLLM).
7. LISTAS GRANDES (moedas, países, atrações): NUNCA um `<select>` com centenas de
   `<option>` repetido por item. Use um PICKER leve (botão + dropdown com busca; opções
   só entram no DOM quando abre). Padrões: `MoedaPicker`, `GlobalSearch`, `AdicionarPais`.
8. RESPONSIVO (mobile-first) + DARK MODE (tokens, nunca hex cru) + ACESSÍVEL (aria, foco, teclado).
9. SEO nas rotas públicas (metadata). Catálogo grande: SSG só dos destaques +
   `dynamicParams=true` (ISR) pro resto — senão 150+ páginas × fetch travam o build.
10. IMAGENS: `imagemWiki` cai pt→en→media-list do artigo (cobertura máxima, sem placeholder);
    `creditoImagem` filtra autor-lixo do Commons. Sempre crédito fonte/autor/licença.
11. NUNCA quebrar os testes existentes nem o motor. Rode `npx vitest run` e `npx next build`
    ao terminar e RELATE o resultado real (nº de testes, build verde) — evidência, não promessa.
12. LGPD/GDPR: dados pessoais mínimos; sync é opt-in; dados agregados anonimizados.

## MONETIZAÇÃO (como o dinheiro entra)
- Afiliado last-click: `withAffiliate(url, parceiro)` (em `_engine/afiliados.js`) lê IDs de
  env e injeta tag. Dispare o clique NO MOMENTO da decisão (cookies curtos). Trate
  Google/Rome2Rio/Amadeus/Airbnb como exibição, não receita. Detalhe em
  `docs/plataforma/06-modelo-de-monetizacao.md`.
- Observabilidade: instrumente o funil `explorar→…→reservar→assinar` via `track()` (UTM/eventos).

## VERIFICAÇÃO (obrigatória antes de declarar pronto)
- `npx vitest run` → todos verdes (relate o número).
- `npx next build` → sem erro (relate as rotas). NUNCA rode `next build` com um `next dev`
  vivo no mesmo `.next` — o build limpa o dir e o dev server passa a dar 404 nos chunks.
- UI nova: verifique no navegador (Playwright; o preview MCP NÃO pinta neste ambiente)
  e descreva o que observou (console limpo, render correto). Nada de "deve funcionar".

# TAREFA
<descreva aqui a feature — ver "Tarefas abertas" abaixo ou o backlog (10)>
```

---

## Como usar este prompt

1. **Copie o bloco acima** pro contexto do Cursor/Claude Code.
2. **Preencha a `# TAREFA`** com um item das "Tarefas abertas" ou do [10 · Backlog](10-backlog.md).
3. **Exija a verificação** — o prompt já pede `vitest`+`build`+navegador com evidência real.
4. **Itere por fatia**, não tudo de uma vez: cada PR = build+testes verdes + um pedaço coeso,
   commit em branch `feat/...` → merge ff → push.

## Tarefas abertas (o que REALMENTE falta — jun/2026)

**Voos & câmbio AO VIVO (precisa de chave do Felipe):**
> Plugue um provider real no `// SEAM` de `_lib/flights.js` `buscarVoos()`: comece pelo
> AFILIADO (Skyscanner Affiliates Link API ou Aviasales/Travelpayouts) pra preço real +
> deep-link monetizado, mantendo o mock como fallback quando não houver chave. A UI de
> `/voos` e a previsão (`previsaoVoo.js`) NÃO mudam — passam a rodar sobre preço real.
> Câmbio já é ao vivo (open.er-api); reforce o bloco "em reais hoje" com cotação Wise se
> a chave de afiliado existir.

**Alertas por e-mail/push (precisa de serviço + cron):**
> Crie o seam de alertas: ao detectar furo de visto/estouro (`oportunidades.js`) ou queda
> de preço, enfileire num `alertas` no Supabase; um Vercel Cron (`/api/cron/alertas`) varre
> e envia via Resend (e-mail) / OneSignal (push). Sem serviço configurado = no-op seguro
> (só registra). Gated: só pra logados; alerta de preço é Premium (`alertas-preco`).

**Quiz de onboarding (puro código):**
> Na 1ª visita à `/decisao`, um quiz de 3 perguntas (estilo, ritmo, prioridade) que mapeia
> pra `perfilDoPreset`/pesos e já mostra as recomendações. Persistir o perfil. Pular se já
> houver perfil salvo. Sem fricção pra quem já sabe (botão "pular").

**Plataforma B2B (fatias 6-9 — ver [07](07-estrategia-de-parceiros.md)):**
> Área `/parceiros` (cadastro de ofertas/campanhas), gestão de comissões, painel admin,
> white-label, marketplace de consultores. Tabelas `partners`/`partner_offers`/`commissions`
> no Supabase com RLS por parceiro.

## Por que este prompt funciona
Ele **codifica as decisões já tomadas** (camadas, seam, degradação segura, no-op, Gate,
picker leve, ISR do catálogo, verificação com evidência) e o **estado atual** (o que já
existe) — então o código gerado nasce no estilo da casa, com testes, sem quebrar o motor
nem reimplementar o que existe. É a diferença entre "gerar código" e "estender uma
plataforma". Critérios de aceite em [12](12-criterios-de-qualidade.md).
