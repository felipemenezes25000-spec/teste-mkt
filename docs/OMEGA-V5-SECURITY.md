# OMEGA V5 — segurança, privacidade e banco (F9)

| Caso | Verificação | Resultado |
|---|---|---|
| SEC-01/02 Isolamento A×B e tenant A×B | `npm run test:rls` em Postgres 15 descartável (Docker), claims de JWT reais | 76/76 (inclui 41 casos de plataforma: agência, proposta, chave de API, marketplace, compras) |
| SEC-03 Segredo no bundle | `e2e-v5`: varre chunks da Home por `sk_live/test`, `sb_secret`, `service_role`, `whsec_`, `OPENAI_API_KEY` | PASS — nenhum |
| SEC-08 Headers | `e2e-v5`: CSP com `frame-ancestors 'none'`, `nosniff`, `Referrer-Policy`; HSTS em produção (curl) | PASS |
| SEC-07 Export/exclusão LGPD | `MeusDados` + `/api/me/export` + RPC `excluir_minha_conta` (caso RLS) | PASS (automático); exclusão real em produção não exercitada |
| SEC-09 GPS em log | Localização só em memória da página (Modo Viagem), nunca enviada; código revisado | PASS |
| COM-01 Open redirect | `/api/out` com allowlist → 400 para domínio externo (`e2e-v5`) | PASS |
| COM-03/06 Checkout | Sem chave → 503; preço só do servidor (`pedidoCheckout`, teste unitário) | PASS |
| COM-04/05 Webhook duplicado/fora de ordem | `stripeWebhook.test.js` (HMAC, tolerância, dedupe, ordem, compra idempotente) | PASS (unitário; sem sandbox Stripe real) |
| COM-07/08 Margem/tenant | RLS + E2E: cliente vê proposta sem custo/margem; agência A não vê B | PASS |
| COM-10 Chave revogada | RLS: revogação definitiva; `validar_api_key` deixa de validar | PASS |
| COM-11 Rate limit | API v1 (30/min sem chave, 600 com chave), IA, checkout, export | PASS em instância única; **distribuído não implantado** (em memória por instância) |
| SEC-04 XSS em texto importado | React escapa texto; proposta por link decodifica e **valida** campos; sem `dangerouslySetInnerHTML` com dado de usuário | PASS por revisão + teste de link adulterado |
| SEC-05 Prompt injection | IA sem chave em produção; prompts não executam ações sem diff confirmado | NÃO AVALIADO (sem LLM ativo) |
| SEC-06 Upload | Não há upload de arquivo no produto | N/A |
| SEC-10 Backup/restore | Migrações aplicadas em projeto novo, sem dados reais; ensaio de restore **não executado** | PENDENTE |
| SEC-11 Rate limit distribuído | Documentado: trocar armazenamento por Redis/Upstash | DEFERRED_WITH_REASON (sem escala ainda) |
| SEC-12 Segredo em artefatos | Senha do banco e chaves só em `.env.local` (ignorado pelo git, pela Vercel via `.vercelignore`); gitleaks: só falsos positivos (`i18nKey`) | PASS |

Privacidade: a V5 trouxe o `usePlano` sem chamada de rede para anônimos (menos tráfego com
identificador) e fotos do Wikimedia sem cookie de terceiro (`crossOrigin="anonymous"`).
