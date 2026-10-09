# Route inventory

> Estado após a sessão OMEGA V4 de 2026-10-09. Tipo conforme `next build` (Next 16.4): ○ estático · ● SSG · ƒ dinâmico.

| Rota | Tipo | Propósito | Dados | Estados cobertos | SEO | Status |
|---|---|---|---|---|---|---|
| `/` | ○ ISR 1d | Primeiro valor: simulador no hero, jornada, destaques, confiança | Catálogo (bundle) + capas via `media.js` | foto falhou → placeholder; simulador sem perfil | canonical, OG da marca | TESTED (QA) |
| `/explorar` | ○ ISR 1d | World Explorer: mapa ⇄ lista, camadas, filtros, URL | Catálogo + capas | mapa indisponível → aviso + lista; vazio → mensagem | canonical | TESTED (QA + mapa) |
| `/destino/[slug]` | ● 8 SSG + ISR | Destino completo: hero, ficha com frescor, custos, galeria, atlas, logística, antes de ir, reservar | Wikipedia/Commons, coordenadas, catálogo | sem foto/sem coordenada/sem visto → honesto | JSON-LD destino/FAQ/breadcrumb, OG por destino | TESTED (QA 4 destinos) |
| `/decisao` | ○ ISR 1d | Recomendação Top N pelo perfil | Motor de decisão (puro) | — | sim | TESTED (QA) |
| `/comparar` | ○ | Matriz 2–4 destinos, pesos, `?d=` | Favoritos + URL + seletor | <2 destinos → orientação | sim | TESTED (QA) |
| `/custo-real` | ○ ISR 1d | Custo real da viagem inteira | Motor de custos + câmbio do dia | sem rede → câmbio fixo rotulado | sim | TESTED (QA) |
| `/voos` | ○ | Score do voo e janela de compra | Cenários estimados (sem provedor) | aviso “cenários estimados” | sim | PROVIDER_READY (busca real BLOCKED_EXTERNAL) |
| `/roteiro` | ○ | Roteiro com IA | `/api/ai` (login) ou chave do usuário | sem IA → mensagem | sim | IMPLEMENTED (IA KEY_REQUIRED) |
| `/planejar` | ○ | Planner multi-país (estação × visto × fôlego) | localStorage + Supabase opcional | onboarding inline | sim | TESTED (QA) |
| `/viagens` | ○ | Minhas viagens (local-first) | localStorage | vazio, criação com validação | noindex | TESTED (E2E) |
| `/viagens/[id]` | ƒ | Workspace: roteiro/mapa/rota, reservas, despesas, documentos, resumo | localStorage + OSRM + Open-Meteo + câmbio | não encontrada, offline, provider fora | noindex | TESTED (E2E) |
| `/viagens/[id]/hoje` | ƒ | Modo Viagem | localStorage + GPS consentido + clima | negado, offline, pré-visualização | noindex | TESTED (E2E) |
| `/salvos` | ○ | Favoritos | localStorage + `/api/fotos` | vazio → recomendados | robots disallow | TESTED (QA) |
| `/planos` | ○ | Planos e ROI | Stripe (checkout no servidor) | sem chave → aviso | sim | IMPLEMENTED (Stripe ADAPTER_READY) |
| `/conta` | ○ | Conta, plano, preview só em dev | Supabase/Stripe | sem config → grátis | disallow | IMPLEMENTED |
| `/fontes` | ○ | Fontes, selos e estado real dos provedores | `provedores.js`, `geo` meta | — | sim | TESTED (QA) |
| `/offline` | ○ | Shell offline do service worker | — | — | — | TESTED (QA) |
| 404 | ○ | Recuperação útil | — | — | — | TESTED (QA) |
| `/api/lugares/[code]` | ƒ | Atrações/cidades com coordenada e preço de referência | `lugares.json`, catálogo | 404 país inválido | — | TESTED (E2E) |
| `/api/fotos` | ƒ | Capas com crédito por código | Wikipedia/Commons | sem foto → null | — | IMPLEMENTED |
| `/api/out` | ƒ | Saída rastreada para parceiros (allowlist) | — | 400 destino não permitido | — | TESTED (unit) |
| `/api/stripe/webhook` | ƒ | Assinaturas | Stripe + Supabase service | 503 sem config; dedupe; ordem | — | TESTED (unit) |
| `/api/stripe/checkout`, `/api/me/plan`, `/api/ai`, `/api/health` | ƒ | Pagamento, plano, IA, saúde | — | 401/503 seguros | — | IMPLEMENTED |
| `/preview-apis` | — | (removida: mockup com “ao vivo” falso) | — | — | — | DEFERRED_WITH_REASON |
