# Mundo Sem Fim → Plataforma Premium de Viagens — Spec (foundation: Next.js + Supabase)

- **Data:** 2026-06-04 · **Branch:** `feat/premium-platform`
- **Fundação confirmada:** `mundo-sem-fim-app/` (Next.js 14 App Router + Supabase). Substitui o spec anterior (que assumia o app Vite client-side — descartado).

## 1. Por que esta fundação
Diferente do Vite client-side, aqui há **backend (Supabase) + rota de servidor** → dá pra ter **assinatura que TRAVA de verdade**, **chave de IA escondida no servidor** e **sync na nuvem**. É a base certa pro objetivo de monetização por assinatura.

## 2. O que JÁ existe (NÃO reconstruir — construir em cima)
- Shell Next (`app/page.jsx` = SPA client-only), SEO/OG/PWA, fontes via `next/font`.
- **Design system** (`app/_ui/`): `Button`, `Badge`, `Modal` (focus trap), `EmptyState`, `Tabs`, `ThemeToggle` + `tokens.css` (cores em triplas RGB) → **dark mode pronto** via `[data-theme="dark"]`.
- **Auth + sync** (`_engine/supabase.js`): magic-link, tabelas `trips`/`trip_legs`.
- **IA no servidor** (`app/api/ai/route.js`): exige login (JWT Supabase) + cota diária (`consumir_ia`). `_engine/services.js` cai pro `/api/ai` quando o usuário não tem chave.
- Planner completo: motor estação×visto×fôlego (`calc.js`), multi-moeda+câmbio, mapa real (`worldGeo.js`), custos por cidade, **budget mode**, **cenários**, **checklist**, **share link**, save-status, onboarding. Testes Vitest (41) + deploy (Vercel/Render).
- `.env.example` já prevê **Google Maps/Places** (`NEXT_PUBLIC_GOOGLE_MAPS_JS_KEY`, `GOOGLE_PLACES_API_KEY`).

## 3. O que ADICIONAMOS (a camada "produto premium")

### Decisões de arquitetura
- **Rotas Next reais** (não SPA única) para as seções novas → SEO, deep-link, code-split, sensação premium. O planner atual vira a rota `/planejar`.
- **Server Components com `fetch` cacheado** (`next: { revalidate }`) para conteúdo de destino (REST Countries, Wikipedia/Wikidata) — sem CORS, sem chave no client, rápido e cacheado. Ilhas client só para interação (favoritar, filtrar, comparar).
- **Serviços em `app/_lib/`** (server-safe): `countries.js`, `wiki.js`, `places.js`, `cache.js`, `links.js`, `flights.js`, `slug.js`.
- **Assinatura real:** tabela `subscriptions` no Supabase + Stripe Checkout + webhook (`/api/stripe/webhook`) + `/api/me/plan`; `<Gate>` que confere o plano no servidor para features pagas (ex.: gerar roteiro). Paywall/upsell em `/planos`.
- **Atribuição de imagem** sempre: fonte + autor + licença (Wikipedia/Commons).

### Telas / rotas
- `/` — **landing premium** (hero, destinos em destaque, prova de valor, CTA assinar/planejar).
- `/explorar` — explorador (busca, filtros: região/estilo/orçamento/melhor época; grid de cards).
- `/destino/[slug]` — país/cidade: fatos, melhor época, pontos turísticos, gastronomia, custos mín/médio/confortável, imagens creditadas, deep-links (Booking/Airbnb/GYG/Viator/Rome2Rio/Maps), "adicionar à rota", "gerar roteiro".
- `/planejar` — o planner atual (intacto).
- `/roteiro` — **roteiro IA dia a dia** (objetivo central): inputs (destino, dias, orçamento, ritmo, interesses, restrição, conforto) → timeline editável (ordem, deslocamento, custo, plano B chuva, grátis/premium, segurança, checklist, documentos), exportar PDF. **Gated (premium).**
- `/voos` — busca de voos (provider **mock** + seam Amadeus/Kiwi/Duffel) + faixa de preço (já existe estimativa por distância) + alerta de preço (local).
- `/planos` + `/conta` — assinatura, comparação de planos, status.

## 4. Plano por fase (cada fase = build+testes verdes + commit)
- **A — Navegação & landing:** rotas, `AppNav` global, home premium, mover planner p/ `/planejar`.
- **B — Explorador & destino (conteúdo real):** `_lib` (countries/wiki/places/cache/slug/links), `/explorar`, `/destino/[slug]`, favoritos (local→Supabase), comparar.
- **C — Roteiro IA:** prompt + (re)uso do `/api/ai`, `/roteiro`, render timeline + PDF.
- **D — Assinatura real:** Supabase `subscriptions`, Stripe checkout+webhook, `/api/me/plan`, `<Gate>`, `/planos`, `/conta`.
- **E — Voos & integrações:** `/voos` (mock+seam), deep-links, alerta de preço local.
- **F — Custos premium & extras:** expandir `CustosView` (mín/médio/confortável por dia/cidade/país), comparar destinos, exportar PDF, microinterações.
- **G — QA:** testes Vitest novos, `next build` verde, verificação no navegador (Playwright — preview MCP não pinta neste ambiente).

## 5. Fontes de dados & atribuição
REST Countries v3.1, Wikidata SPARQL, Wikipedia REST, OpenStreetMap/Overpass, open.er-api.com (câmbio), Google Places (quando a chave do servidor existir). Toda imagem registra fonte/autor/licença e linka a origem.

## 6. Não-objetivos (agora)
- Preço de voo em tempo real (mock + seam; chave paga = Felipe).
- Curadoria manual de "todos os pontos turísticos" (cobertura via APIs ao vivo + cache + seed vitrine).
- i18n além de pt-BR.
- App nativo (PWA já cobre instalação).

## 7. Risco/guardrails
- Não quebrar o planner nem os 41 testes existentes; rodar Vitest + build a cada fase.
- Segredos só no servidor (`.env.local`); nunca commitar chave.
- Manter padrão de degradação segura (timeout + fallback) em todo fetch externo.
- Stripe/Supabase exigem chaves do Felipe p/ produção: entrego com modo "não configurado = no-op seguro" (mesmo padrão do `supabaseConfigurado`).
