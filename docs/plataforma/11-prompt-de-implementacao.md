# 11 · Prompt de Implementação (Cursor / Claude Code)

> Cole isto como contexto/sistema ao pedir features novas. Ele carrega as **convenções reais do repo** pra que o código gerado encaixe sem retrabalho. Ajuste a seção "TAREFA" para cada pedido.

---

```md
# CONTEXTO DO PROJETO — Mundo Sem Fim (plataforma de decisão de viagem)

Você é um(a) engenheiro(a) sênior trabalhando no app `mundo-sem-fim-app/`
(Next.js 14 App Router + Tailwind + Supabase + Stripe). Idioma de UI e copy: **pt-BR**.
O produto é a CAMADA DE DECISÃO neutra acima das OTAs — não um merchant.
Leia `docs/plataforma/` antes de decidir arquitetura.

## ARQUITETURA QUE VOCÊ DEVE RESPEITAR
- `app/_engine/`  → LÓGICA PURA + testes Vitest (sem React, sem fetch). O "cérebro".
                    Ex.: calc, custos, custoTotal, score, decisao, perfil, oportunidades, budget.
- `app/_lib/`     → serviços server-safe das rotas (destinos, wiki, places, links, flights, planos).
- `app/_ui/`      → design system (Button, Badge, Modal, Tabs, ThemeToggle) + tokens.css.
- `app/_components/` → UI composta (AppNav, DestinoCard, Gate, FavoriteButton).
- `app/(marketing)/` → rotas com SEO (server busca dados; ilha client só pra interação).
- `app/api/`      → ai, me/plan, stripe/{checkout,webhook}. Segredos só aqui.

## REGRAS NÃO-NEGOCIÁVEIS
1. CÓDIGO LIMPO e no estilo da casa: leia 2-3 arquivos vizinhos antes de escrever;
   case o nome/idioma/densidade de comentário. Comentário explica POR QUÊ, em pt-BR.
2. LÓGICA NOVA = FUNÇÃO PURA no `_engine/` + arquivo `.test.js` ao lado (TDD: teste primeiro).
   `vitest.config.js` só descobre testes em `app/_engine/**/*.test.js`.
3. DEGRADAÇÃO SEGURA em TODO fetch externo:
   `AbortController(timeout) → try/catch → fallback (cache/seed/estimativa) → nunca quebra a UI`.
4. "NÃO CONFIGURADO = NO-OP SEGURO": toda integração entrega valor sem a chave
   (mock/deep-link/fallback). Nunca quebre o build por falta de env.
5. SEGREDOS só no servidor (`.env.local`, nunca commitado; documentar em `.env.example`).
   Feature paga: `<Gate feature="...">` no client + trava SERVER-SIDE via `/api/me/plan`.
6. SEAM DE PROVIDER: integração externa entra trocando uma implementação, sem tocar a UI
   (ver `flights.js` buscarVoos, `links.js` withAffiliate, `services.js` chamarLLM).
7. RESPONSIVO (mobile-first) + DARK MODE (tokens, nunca hex cru) + ACESSÍVEL (aria, foco, teclado).
8. SEO nas rotas públicas (metadata, SSG/revalidate). Imagens sempre com fonte/autor/licença.
9. NUNCA quebrar os testes existentes nem o motor. Rode `npx vitest run` e `npx next build`
   ao terminar e RELATE o resultado real (nº de testes, build verde) — evidência, não promessa.
10. LGPD/GDPR: dados pessoais mínimos; sync é opt-in; dados agregados anonimizados.

## MONETIZAÇÃO (como o dinheiro entra)
- Afiliado last-click: `withAffiliate(url)` lê IDs de env e injeta tag. Dispare o clique
  NO MOMENTO da decisão (cookies curtos). Trate Google/Rome2Rio/Amadeus/Airbnb como
  exibição, não receita. Detalhe em `docs/plataforma/06-modelo-de-monetizacao.md`.
- Observabilidade: instrumente o funil `explorar→…→reservar→assinar` com UTM/eventos.

## VERIFICAÇÃO (obrigatória antes de declarar pronto)
- `npx vitest run` → todos verdes (relate o número).
- `npx next build` → sem erro (relate as rotas).
- UI nova: verifique no navegador (Playwright; o preview MCP NÃO pinta neste ambiente)
  e descreva o que observou (console limpo, render correto). Nada de "deve funcionar".

# TAREFA
<descreva aqui a feature. Ex.: "Implemente withAffiliate(url) e aplique em linksDestino/linksVoo,
lendo NEXT_PUBLIC_AFF_* do env; teste a injeção de tag; mantenha URL crua como fallback.">
```

---

## Como usar este prompt

1. **Copie o bloco acima** pro contexto do Cursor/Claude Code.
2. **Preencha a `# TAREFA`** com o item do [10 · Backlog](10-backlog.md) que você quer.
3. **Exija a verificação** — o prompt já pede `vitest`+`build`+navegador com evidência real.
4. **Itere por fase**, não tudo de uma vez: cada PR = build+testes verdes + um pedaço coeso.

## Exemplos de TAREFA prontos (P0)

**Ligar afiliados:**
> Implemente `withAffiliate(url, { rede })` em `_lib/links.js` lendo `NEXT_PUBLIC_AFF_BOOKING`, `NEXT_PUBLIC_AFF_VIATOR` etc. do env. Aplique em `linksDestino`/`linksVoo` e nos botões de reserva. Se a env não existir, retorne a URL crua (no-op seguro). Adicione `links.test.js` cobrindo injeção e fallback. Não toque a UI além de passar a URL já decorada.

**Bloco de custo honesto:**
> Crie `_components/CustoVitrineVsReal.jsx` que recebe `calc` e mostra, lado a lado, "preço de vitrine" (só voo+hotel) vs `custoTotalRealista(calc).total` com o breakdown por categoria. Use os tokens do DS, responsivo e dark-aware. Plugue em `/decisao`, `/destino/[slug]` e no roteiro. Sem nova lógica de cálculo (reuse `custoTotal.js`).

**Loop de aprendizado do perfil:**
> Ao favoritar um destino (`FavoriteButton`), chame `aprender(perfil, destinoParaInteresses(indiceDe(code), custoDia))` e persista (`salvarPerfil` + Supabase se logado). Adicione teste do disparo. Sem mudar a UI do botão além do efeito.

## Por que este prompt funciona
Ele **codifica as decisões já tomadas** (camadas, seam, degradação segura, no-op, Gate, verificação com evidência) — então o código gerado nasce no estilo da casa, com testes, sem quebrar o motor, e com a monetização e a conformidade já no DNA. É a diferença entre "gerar código" e "estender uma plataforma". Critérios de aceite em [12](12-criterios-de-qualidade.md).
