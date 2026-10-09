# OMEGA V5 — scorecard (20 pilares × 50 = 1000)

> Regra V5 §23: critério qualitativo exige revisão humana. Onde só há autoavaliação do agente, a
> nota está marcada **(prov.)** = provisória até revisão humana. Nenhuma nota foi preenchida por
> padrão; o total **não** é "10/10" e não deve ser apresentado como tal.

| # | Pilar | Nota /50 | Evidência | O que impede subir |
|---:|---|---:|---|---|
| 1 | Identidade visual e acabamento | 38 (prov.) | MERIDIANO consistente; mapa com paleta própria; QA 7 larguras × 2 temas | Revisão humana de composição; teste em telas físicas |
| 2 | UX / arquitetura da informação | 35 (prov.) | Navegação adaptativa (Hoje), simulador progressivo, CTAs reais | Testes de tarefa com pessoas (§21) |
| 3 | Home / onboarding | 42 | P0 do simulador corrigido; HOME-01/02/03/05/06 E2E + HOME-01..07 unit; Top 3 respeita orçamento | Lighthouse 79–80 (< 90); voo só ilustrativo |
| 4 | Descoberta / decisão | 40 | Neutralidade testada; motivos estruturados e traduzidos; contras honestos | DEC-05/07 não automatizados |
| 5 | Destinos / cidades / lugares | 32 | 205 destinos SSG; seções fixas; fotos com licença | Sem páginas próprias de cidade/bairro/POI; amostra humana foto↔POI |
| 6 | Mapas / geo / rotas | 37 | Paleta MERIDIANO; prévia sem WebGL; EXP-04/09/10 PASS; rotas LIVE/ESTIMATE | Entrada real de POI (DST-07); OSRM público não escala |
| 7 | Imagens / licenças | 43 | 205/205 capas verificadas; placeholder honesto; DST-03/11 PASS | Revisão humana amostral |
| 8 | Pricing / câmbio / RealCost | 38 | Mesma moeda/escopo; minor units; câmbio com data; faixas | Sem cotações reais; PRC-04/05/07 dependem de provider |
| 9 | Voos / hotéis / experiências | 15 | Estados honestos; DEEPLINK com allowlist | **LIVE BLOCKED** (chaves/contratos) |
| 10 | Reservas / wallet | 25 | Máquina de estados; confirmação só verificada pelo servidor (RLS) | Sem provider real nem sandbox de reserva |
| 11 | Trip Mode / offline | 33 | E2E 12/12 (GPS consentido, offline, Plano B) | Teste em aparelho físico e rede real ruim |
| 12 | Mobile / ergonomia | 31 (prov.) | Barra inferior com safe area e alvos ≥ 44 px; 320 px sem overflow | iOS Safari/Android físicos |
| 13 | Acessibilidade | 40 | axe 0 (21 rotas × 2 temas); teclado; zoom 200%; combobox ARIA | Leitor de tela real (NVDA/VoiceOver) |
| 14 | Performance | 33 | JS −21%/−35%; lab 79–90; LCP real < 1 s | Lab ≥ 90 em Home/Destino; RUM p75 inexistente |
| 15 | Segurança / LGPD | 41 | RLS 76/76; SEC-03/08; export/exclusão; sem cookie de terceiro nas fotos | Rate limit distribuído; prompt injection não avaliável sem LLM |
| 16 | Banco / integridade | 39 | Migrations em produção; dinheiro em minor units; testes negativos | Ensaio de backup/restore |
| 17 | APIs / providers / fallback | 33 | API v1 OpenAPI, limites, CORS; degradação de mapa/foto/câmbio testada | Firewall Vercel desafia clientes sem navegador; telemetria de custo |
| 18 | Monetização / B2B | 31 | Checkout com preço do servidor; webhook idempotente; tenant isolado | Sem chaves Stripe/sandbox; termos jurídicos |
| 19 | SEO / idiomas / conteúdo | 38 | canonical/OG; sitemap sem privados; 4 idiomas com 947 chaves em paridade | Editorial longo só em pt; hreflang ausente |
| 20 | Observabilidade / QA / operação | 22 | QA automatizado amplo (E2E 62 passos, 336 telas, Firefox) | Sem Sentry/OTel, SLO, alertas, rollback ensaiado |
| | **Total** | **706 / 1000** | cobertura: 20/20 pilares avaliados, 4 com nota provisória | — |

Leitura honesta: o produto está **EXPERIÊNCIA READY, LIVE BLOCKED** para comércio de viagem e sem
operação/observabilidade de produção. Não há P0 aberto.
