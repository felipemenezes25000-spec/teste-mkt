# OMEGA V5 — baseline real (F0)

> Medido nesta sessão, 2026-10-09, antes de qualquer mudança da V5. Ambiente: Windows 11,
> Node 24.14, build de produção local (`next build` + `next start -p 3107`).

```text
SHA testado        4da2baceead54ae0b53f952419311075e0b30082 (main = origin/main)
Branch de trabalho feat/omega-v5 (a partir do SHA acima)
Backup             C:\Users\Felipe\Downloads\mundo-sem-fim-backups\mundo-sem-fim-4da2bac-v5-baseline.bundle (git bundle --all)
```

## Comandos e resultados

| Comando | Resultado no baseline |
|---|---|
| `npm run verify` (lint + typecheck + vitest) | lint 0 erros (48 avisos legados) · typecheck OK · **44 arquivos / 313 testes OK** |
| `npm run build` | OK · 258 páginas (205 destinos SSG + 20 roteiros + rotas) |
| `npm run test:rls` | 76/76 (Postgres 15 no Docker) — reexecutado na fase anterior; migrations inalteradas no F0 |
| `scripts/e2e-viagem.mjs` | 12/12 |
| `scripts/e2e-plataforma.mjs` | 23/23 |

## Lighthouse mobile (lab, 4G simulado, Moto G Power) — baseline

| Rota | Perf | A11y | Boas práticas | SEO | LCP | TBT |
|---|---:|---:|---:|---:|---:|---:|
| `/` | 75 | 100 | 79 | 100 | 5,3 s | 200 ms |
| `/explorar` | 70 | 100 | 79 | 100 | 4,6 s | 540 ms |
| `/destino/japao` | 75 | 100 | 79 | 100 | 6,3 s | 170 ms |
| `/viagens` | 75 | 100 | 100 | 63* | 4,5 s | 330 ms |

\* `/viagens` é `noindex` por desenho (dados pessoais) — SEO baixo é esperado.
Boas práticas 79 = cookie de terceiro `WMF-Uniq` gravado pelo CDN do Wikimedia nas fotos.

## Reconciliação de documentos V4 × código

| Alegação | Verificação | Situação |
|---|---|---|
| 205 destinos SSG (`ROUTE-INVENTORY` antigo dizia 8) | `generateStaticParams` gera 205; build lista 258 páginas | Docs V4 atualizados já diziam 205 — confirmado |
| Supabase `ADAPTER_READY` (PROVIDER-MATRIX antigo) | Projeto `mundo-sem-fim` (sa-east-1) com 5 migrations aplicadas; anon sem leitura | Produção ligada; Stripe/IA seguem sem chave |
| 199/205 capas com licença | Auditoria real: 199/205 | Confirmado → corrigido para 205/205 no F5 |
| `MobileBottomNav` | Componente existia mas **não era montado** em nenhum layout | Corrigido no F7 |
| Simulador "cabe no orçamento" | Compara orçamento (moeda indefinida) com custo em terra USD | P0 → corrigido no F1 |

## Provider states no baseline

Ver `docs/OMEGA-V5-PROVIDER-BLOCKERS.md` (revalidado no fechamento).
