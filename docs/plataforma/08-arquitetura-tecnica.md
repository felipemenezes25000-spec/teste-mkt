# 08 · Arquitetura Técnica

> A fundação real do Mundo Sem Fim e como ela escala pra plataforma. Tabela completa das 18 integrações em [`_dados/tabela-integracoes.md`](_dados/tabela-integracoes.md).

## Stack (em produção)

| Camada | Tecnologia | Por quê |
|---|---|---|
| Front + Back | **Next.js 14 (App Router)** | SSG/SSR/ISR + rotas de API no mesmo deploy; SEO + ilhas client |
| Estilo | **Tailwind** + tokens CSS (triplas RGB) | dark mode = reescrever variáveis; `rgb(var(--c-x)/<alpha>)` preserva opacidade |
| Auth + dados | **Supabase** (Postgres + RLS) | magic-link, sync na nuvem, service role pra trava server-side |
| Pagamento | **Stripe** (Checkout + webhook HMAC sem SDK) | assinatura que trava de verdade |
| IA | **/api/ai** (OpenAI-compat) atrás de login + cota | chave escondida no servidor; cota atômica via RPC Postgres |
| Deploy | **Vercel** (Render como alt) | zero-config pro Next; `render.yaml` mantido |
| Testes | **Vitest** (86 testes) | funções puras do motor 100% cobertas |

## Mapa de camadas

```
app/
├── (marketing)/          ← rotas de produto com SEO (AppNav + footer)
│   ├── page.jsx              landing premium
│   ├── explorar/             descobrir destinos (SSG + imagens server)
│   ├── destino/[slug]/       ficha de destino (22 SSG, Wikidata/Wikipedia)
│   ├── comparar/             comparação de destinos (favoritos)
│   ├── decisao/         ★    camada de inteligência (perfil + score + oportunidades)
│   ├── roteiro/              roteiro IA dia-a-dia (gated)
│   ├── voos/                 busca (mock + seam) + deep-links
│   ├── planos/ · conta/      assinatura Stripe
│   └── salvos/
├── planejar/             ← o planner (chrome próprio, fora do grupo marketing)
├── api/                  ← ai · health · me/plan · stripe/{checkout,webhook}
├── _engine/             ★ LÓGICA PURA + testes (o "cérebro")
├── _lib/                ← serviços server-safe das rotas (destinos, wiki, places, links, flights, planos)
├── _ui/                 ← design system (Button, Badge, Modal, Tabs, ThemeToggle, tokens.css)
└── _components/         ← UI composta (AppNav, DestinoCard, Gate, FavoriteButton…)
```

### A camada de inteligência (`_engine/`, novo)
O diferencial defensável vive aqui — **funções puras, testáveis, sem React/fetch**, consumidas tanto pelo planner quanto pelas rotas de marketing:

| Módulo | Papel | Diferencial (gap) |
|---|---|---|
| `calc.js` | motor estação × visto × fôlego; custo total | gaps 1, 3, 7 |
| `custos.js` · `custoTotal.js` | custo por categoria/tier + seguro/eSIM/visto/contingência | gap 1 |
| `score.js` · `indices.js` | Score de Viagem em 8 dimensões | gap 2, 9 |
| `perfil.js` | super-perfil (9 interesses, presets, `aprender`) | gap 6 |
| `decisao.js` | motor de decisão (ranqueia destinos por perfil + "porquê") | gap 2 |
| `oportunidades.js` | central de oportunidades determinística | gap 4 |
| `budget.js` | orçamento prescritivo (`sugerirOrcamento`/`aplicarCortes`) | gap 4 |
| `cenarios.js` | versionamento Rota A vs B | gap 3 |

**Princípio:** dados e UI mudam; o cérebro é puro e coberto por teste. É o que torna o produto auditável e o fosso difícil de copiar.

## Modelo de dados

**Supabase (nuvem, logados):**
- `profiles`, `trips`, `trip_legs` — o plano sincronizado (RLS: cada um vê o seu).
- `subscriptions` — plano efetivo (escrita só via service role no webhook Stripe; leitura via `/api/me/plan` = **trava server-side**).
- `ai_usage_quota` — cota diária de IA (RPC atômica `consumir_ia`).
- *Futuro (plataforma):* `partners`, `partner_offers`, `partner_campaigns`, `commissions`, `perfil_viajante` (persistir o DNA aprendido).

**localStorage (anônimo / offline-first):**
- `mundosemfim.plan.v3` (plano), `mundosemfim.perfil.v1` (DNA), `mundosemfim.cenarios.v1`, favoritos, tema, checklist. Tudo com `normalizarPlano`/migração segura. O app **funciona 100% offline/sem conta**; a conta é o gancho de sync/monetização.

## O padrão de seam (a chave da escalabilidade)

Todo ponto de integração externa é uma **costura** com fallback — a feature funciona hoje (mock/deep-link) e "liga" a API real trocando uma implementação:

- **Voos** (`_lib/flights.js`): `buscarVoos()` cai no `buscarVoosMock` determinístico; o `// SEAM` aceita Amadeus/Kiwi/**Duffel**/Skyscanner. Substituir o provider não toca a UI.
- **Deep-links** (`_lib/links.js`): URLs cruas hoje; a camada **`withAffiliate(url)`** (a construir) injeta a tag de afiliado lida de env. Receita liga sem reescrever a UI ([03 · Oportunidade #2](03-oportunidades.md)).
- **IA** (`_engine/services.js` → `/api/ai`): chave própria do usuário OU servidor (login+cota). Provider trocável (OpenAI/Groq/Anthropic).
- **Câmbio** (`buscarCambio`): open.er-api.com grátis com timeout + fallback pra taxas salvas.
- **Conteúdo** (`_lib/wiki.js`, `_lib/places.js`): Wikipedia REST + Wikidata SPARQL, cacheados, com degradação pra `[]`/`null`.

## Arquitetura de integração (18 APIs, em 7 fases)

Resumo da ordem recomendada (detalhe e fallback de cada uma em [`_dados/tabela-integracoes.md`](_dados/tabela-integracoes.md)):

| Fase | Integrações | Objetivo | Prioridade |
|---|---|---|:---:|
| **0** (em prod) | Wikidata, Wikipedia REST | POI/descrição/imagem grátis | P0 |
| **1** | **Afiliados** sobre os deep-links que já existem (Booking, Viator, GYG via Travelpayouts/Awin/CJ) | Receita imediata | P0 |
| **2** | Google Places (+ OSM/Overpass fallback) | horários/preço/geocoding | P1 |
| **3** | Tripadvisor Content API | nota/reputação (camada de confiança) | P1 |
| **4** | Klook, Expedia/Vrbo | + cobertura de experiência/hospedagem | P2 |
| **5** | Skyscanner (preço real de voo) → seam `buscarVoos` | substituir faixa-por-distância | P2 |
| **6** | Rome2Rio, Omio, Wise/Revolut | multimodal + câmbio | P2 |
| **7** | OpenTable/TheFork | reserva gastronômica | P3 |
| **futuro** | **Duffel** (se virar transacional) | vender voo/stays no app | condicional |

**Flags estratégicas (da pesquisa):**
- ⛔ **Amadeus Self-Service morre em 17/07/2026** — não construir dependência nova; preferir **Duffel**.
- ⛔ **Google Places proíbe cachear conteúdo de POI** (só `place_id`; lat/long ≤30 dias) — usar OSM/Wikidata como base cacheável; Places só onde necessário, com cap de custo.
- ⛔ **Airbnb não tem afiliado** — substituir por Booking apês/Vrbo em qualquer fluxo "estilo Airbnb".
- ✅ Google/Rome2Rio = **exibição**, não receita; booking monetizado sempre cai numa OTA terceira.

## Degradação segura (princípio transversal)

Já é o padrão e deve ser mantido em **todo** fetch externo:
```
timeout (AbortController) → try/catch → fallback (cache/seed/estimativa) → nunca quebra a UI
```
Exemplos vivos: câmbio cai pras taxas salvas; Wikidata retorna `[]`; voos usam mock; IA dá mensagem clara em 401/429/503. **A regra:** uma API externa indisponível degrada a experiência, nunca derruba a tela.

## Segurança & conformidade

- **Segredos só no servidor** (`.env.local`, nunca commitado; `OPENAI_API_KEY`, `STRIPE_SECRET_KEY`, `SUPABASE_SERVICE_ROLE_KEY`). O `.env.example` documenta sem expor.
- **Trava de plano server-side:** `/api/me/plan` lê `subscriptions` via service role; o client (`usePlano`/`<Gate>`) é só UX — a verdade está no servidor.
- **IA blindada:** login (JWT Supabase verificado) + cota atômica → anônimo/curl não queima crédito.
- **Stripe:** webhook valida HMAC (timing-safe, tolerância 5 min) antes de gravar.
- **LGPD/GDPR:** dados pessoais mínimos (e-mail pro magic-link); plano vive em localStorage por padrão (sync é opt-in via login); **export/delete de conta** (a implementar), consentimento de cookies/analytics, e os dados agregados de tendência são **anonimizados** antes de qualquer venda B2B.

## Observabilidade & analytics (a formalizar)

- **Event tracking** do funil de conversão: `explorar → destino → comparar → decisao → planejar → roteiro → reservar(afiliado) → assinar`. Cada etapa é um evento; o "reservar" carrega categoria/UTM pra atribuir comissão.
- **Logs estruturados** nas rotas de API (já há `console.warn` em pontos críticos — formalizar em níveis).
- **Métricas de produto:** ativação (montou 1ª rota), retenção (voltou em 7/30d), conversão free→paid, EPC por categoria de afiliado.
- **Painel admin:** moderação de ofertas de parceiro, visão de assinaturas, saúde dos fetches externos. **Painel de parceiros:** performance por oferta/campanha ([07](07-estrategia-de-parceiros.md)).

## Princípios de evolução
1. **Não quebrar o motor** — Vitest + `next build` verdes a cada mudança (regra que já vale).
2. **Tudo "não configurado = no-op seguro"** — cada integração nova entrega valor mesmo sem a chave (mock/deep-link/fallback).
3. **Lógica pura no `_engine`, efeitos nas bordas** — o cérebro testável fica isolado de React/rede.
4. **SEO nas rotas públicas, ilhas client só pra interação.**
