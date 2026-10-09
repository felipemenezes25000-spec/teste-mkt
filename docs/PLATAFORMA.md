# Plataforma — B2B, white-label, API pública, marketplace e checkout

> Itens que o OMEGA V4 deixou **fora do escopo** e que foram entregues a mais, com as
> decisões tomadas sem consulta (o dono pediu "você decide tudo"). Cada decisão tem o
> motivo ao lado para poder ser revista.

## Decisões

| Tema | Decisão | Por quê |
|---|---|---|
| Checkout nativo | Vende só **produtos próprios**: Trip Pass, roteiro de criador e consultoria | Vender voo/hotel exige licença de agência (Cadastur/IATA), responsabilidade solidária e contrato com consolidadora. Reservas continuam com parceiros via `/api/out`. |
| Trip Pass | R$ 49, pagamento único, Premium por 30 dias, sem renovação | Viagem é evento pontual; assinatura mensal afasta quem viaja 1×/ano. |
| Taxa do marketplace | 20% para a plataforma, 80% para o criador/consultor | Faixa usual de marketplaces de serviço; cobre Stripe + suporte. |
| Repasse | Registrado em `purchases` (valor, taxa, vendedor); pagamento manual mensal | Stripe Connect exige onboarding KYC de cada criador — fica para quando houver volume. |
| Roteiros da equipe | Gerados do catálogo (só atrações com coordenada verificada, raio de 700 km, sequência geográfica), gratuitos | Vitrine útil desde o dia 1 **sem inventar** criadores, avaliações ou vendas. |
| Consultores/comunidade | Só aparecem quando existem de verdade no banco; sem perfis fictícios | Regra de honestidade do V4 (§28/§35). |
| Proposta B2B | Local-first + link no fragmento `#` (sem servidor) **ou** salva na conta com link curto e aceite registrado | Agência pequena usa sem cadastro; quem precisa de controle usa a conta. |
| White-label | Nome, cor, logo (https) e rodapé por agência; cor ajustada para contraste WCAG ≥ 4,5:1 | Marca da agência sem quebrar acessibilidade. |
| API pública | REST somente leitura do catálogo; 30 req/min sem chave, 600/min com chave | Avaliação sem atrito; chave só para volume. Dados vivos de terceiros (clima, câmbio, rotas) **não** são revendidos (licenças). |
| Chaves de API | Geradas no navegador, guardadas só como SHA-256, exibidas uma vez | Vazamento do banco não expõe chaves. |

## Onde está

| Peça | Arquivos |
|---|---|
| Banco + RLS | `supabase/migrations/20261009120000_plataforma.sql` (organizations, org_members, proposals, api_keys, creator_profiles, creator_itineraries, creator_itinerary_content, purchases, consult_requests + RPCs) |
| Regras puras | `app/_lib/plataforma/` — `proposta.js`, `marca.js`, `apiKeys.js`, `produtos.js`, `roteirosEquipe.js`, `adaptar.js`, `openapi.js` |
| API v1 | `app/api/v1/{destinos,destinos/[code],custo,visto,openapi.json}` + `_comum.js` (auth, limite, CORS, meta) |
| Checkout | `app/api/stripe/checkout/route.js` (assinatura + produtos), webhook grava `purchases` (`compraDaSessao`) |
| Telas | `/agencias`, `/proposta` (visão do cliente, fora da navegação), `/marketplace`, `/marketplace/r/[slug]` (SSG), `/marketplace/c/[slug]`, `/desenvolvedores`, Trip Pass em `/planos` |
| i18n | `app/_lib/i18nPlataforma.js` (pt/en/es/ja; paridade testada) |

## Garantias testadas

- **RLS (Postgres real, `npm run test:rls`)**: agente não apaga proposta nem muda marca; estranho não vê
  agência/proposta/chave; cliente final vê a proposta por token **sem custo, margem nem e-mail**;
  aceite único; chave guardada só como hash, limite e escopo forçados, revogação definitiva;
  "verificado" e conta Stripe do criador só pelo servidor; conteúdo pago só para autor/comprador;
  compra só pelo servidor e idempotente por sessão Stripe; consultoria segue a máquina de estados
  (nova → aceita com preço → paga pelo servidor → concluída; cliente só cancela).
- **Unitários (`app/_lib/plataforma/plataforma.test.js`, `stripeWebhook.test.js`)**: preço com margem
  igual ao do banco (inteiros, sem erro de ponto flutuante), link adulterado recusado, contraste
  ≥ 4,5:1 para qualquer cor, formato/entropia/hash das chaves, preço nunca vem do cliente,
  compra avulsa só com sessão paga e metadados válidos, roteiros determinísticos.
- **E2E (`scripts/e2e-plataforma.mjs`)**: API (frescor, CORS, 400/401/404/429, OpenAPI), proposta
  com margem → link → cliente sem custo e com a cor da agência, link adulterado, marketplace,
  adaptar roteiro → viagem, portal da API, Trip Pass sem chaves explicando o que falta.

## Para ligar em produção

1. Aplicar as migrations (inclui esta) no Supabase.
2. Stripe: `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET` (evento `checkout.session.completed`),
   `NEXT_PUBLIC_SITE_URL`. Produtos avulsos usam `price_data` — não precisa criar price no painel.
3. Rate limit em memória é por instância: em escala, trocar o armazenamento de `app/_lib/rateLimit.js` por Redis/Upstash (mesma API).
4. Termos do marketplace e da API (repasse, reembolso, atribuição) precisam de revisão jurídica antes de abrir vendas.
