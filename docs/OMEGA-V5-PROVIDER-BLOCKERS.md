# OMEGA V5 — provedores: estado revalidado no fechamento (§22)

> "Revalidado" = chamada real ou leitura do código/ambiente nesta sessão. Termos comerciais de
> terceiros não foram renegociados; onde a licença exige contrato, o estado é BLOCKED_EXTERNAL.

| Provider | Uso | Estado V5 | Evidência nesta sessão | O que falta para LIVE comercial |
|---|---|---|---|---|
| MapLibre + OpenFreeMap | mapa vetorial | LIVE_VERIFIED | canvas renderizado claro/escuro; atribuição OSM visível; paleta só no paint | Plano de contingência se o serviço público cair (o mapa já degrada para lista) |
| FOSSGIS/OSRM | rotas a pé/bike/carro | LIVE_VERIFIED (uso leve) | E2E 12/12 com rota LIVE ou ESTIMATE rotulada | ≤ 1 req/s: produção em escala exige OSRM próprio ou provedor pago |
| Wikidata/Wikipedia | coordenadas, resumos | LIVE_VERIFIED | build gera 205 destinos; capas resolvidas | Cache já em ISR; nada bloqueante |
| Wikimedia Commons | fotos | LIVE_VERIFIED | **205/205 capas com licença verificada** (auditoria real) | Revisão humana amostral foto↔POI |
| Openverse | fallback de fotos | LIVE_VERIFIED | usado na cascata do destino | — |
| Frankfurter/BCE · open.er-api | câmbio de referência | LIVE_VERIFIED (RECENT) | simulador mostra taxa com fonte e data | Não é taxa de cartão (dito na UI) |
| Open-Meteo | clima | CONTRACT_REQUIRED | funciona; plano gratuito é **não comercial** | Contratar plano comercial antes de receita |
| GTFS/transit | transporte público | RESEARCHED | só estimativa rotulada | Feeds por cidade + licença |
| Duffel/Travelpayouts/Amadeus | voos | KEY_REQUIRED | sem chave: cenários estimados sem marca; simulador usa faixa ilustrativa | Chave + contrato; nada é exibido como cotação |
| Expedia/Booking | hotéis | CONTRACT_REQUIRED | DEEPLINK honesto via `/api/out` (allowlist, COM-01 PASS) | Afiliação aprovada |
| Viator/GYG/Tiqets/Klook/Civitatis | experiências | KEY_REQUIRED | preços de referência HISTÓRICO | Chaves |
| OpenTable/TheFork | restaurantes | NÃO INTEGRADO | — | Parceria; hoje "ver como reservar" sem disponibilidade inventada |
| Stripe | checkout próprio | KEY_REQUIRED | sem chave → 503 honesto (COM-03 PASS); webhook idempotente testado | Chaves + webhook + termos (repasse/reembolso/chargeback) |
| Supabase | auth, sync, plataforma | **LIVE (produção)** | projeto `mundo-sem-fim` sa-east-1, 5 migrations, RLS 76/76 em Postgres de teste | Backup/restore ensaiado (não executado) |
| LLM | IA contextual | KEY_REQUIRED | sem chave: otimizador determinístico segue funcionando | Chave + cota + grounding |
| Fontes oficiais de visto | entrada | RESEARCHED | sem regra verificada → "consultar consulado" | Fonte oficial por país/contrato |
| Sentry/OTel | observabilidade | NÃO CONFIGURADO | — | Conta + DSN + política de PII |

**Classificação comercial:** `EXPERIÊNCIA READY, LIVE BLOCKED` para voos, hotéis, experiências,
pagamento e IA. Nenhum preço é exibido como cotação ao vivo.
