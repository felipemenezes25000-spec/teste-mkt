# CONTINUATION — retomada entre sessões (OMEGA V4 §48)

> Leia isto e o `git log` antes de qualquer alteração. Não presuma que algo está pronto
> só porque está escrito aqui — rode as verificações.

```text
CURRENT SHA        ver `git log -1` (main = feat/omega-v4-foundation após o merge)
BRANCH             main (publicada em origin) · trabalho feito em feat/omega-v4-foundation
LAST COMPLETED     lotes 0–14 + fase 2: i18n das telas novas, LGPD, CSP nonce opcional, rate limit,
                   a11y (axe 0), Firefox/WebKit, Lighthouse, 205 destinos SSG, e a plataforma
                   (B2B/white-label, API v1, marketplace, checkout próprio) — docs/PLATAFORMA.md
LAST TEST RESULT   vitest 44 arquivos / 313 testes · test:rls 76/76 · e2e-viagem 12/12 ·
                   e2e-plataforma 23/23 · qa-telas 336/336 (24 rotas × 7 larguras × 2 temas) ·
                   Firefox 42/42 · axe 0 violações
PRODUÇÃO           Vercel projeto `mundo-sem-fim` → https://mundo-sem-fim-lac.vercel.app
                   (mundo-sem-fim.vercel.app pertence a terceiros); vercel.json fixa framework nextjs.
                   Supabase projeto `mundo-sem-fim` (ref ikdodbandfndcgyhbzzp, sa-east-1), 5 migrations
                   aplicadas; auth site_url/redirects via supabase/config.toml (`supabase config push`).
                   Senha do banco e chaves só em .env.local (não versionado).
BLOCKERS           (externos, do dono) Stripe (chaves; checkout responde 503 até lá), IA (chave),
                   afiliados/provedores (voos, hotéis, experiências), Open-Meteo comercial,
                   Stripe Connect p/ repasse automático, revisão jurídica dos termos do marketplace/API
NEXT EXACT STEP    1) chaves Stripe + webhook (checkout.session.completed) na Vercel;
                   2) SUPABASE_SERVICE_ROLE_KEY na Vercel quando o webhook for ligado;
                   3) domínio próprio e atualizar supabase/config.toml + NEXT_PUBLIC_SITE_URL;
                   4) monitoramento (SLO/alertas) e teste em iOS/Android reais
SAFETY WARNINGS    não fazer force push nem reset; nunca commitar .env*; Open-Meteo gratuito é NÃO
                   comercial; FOSSGIS ≤ 1 req/s; rate limit em memória é por instância
```

## Comandos

```bash
npm run verify
npm run test:rls
npm run build && npx next start -p 3107
node scripts/qa-telas.mjs http://localhost:3107
node scripts/e2e-viagem.mjs http://localhost:3107
node scripts/e2e-plataforma.mjs http://localhost:3107
node scripts/a11y.mjs http://localhost:3107
```
