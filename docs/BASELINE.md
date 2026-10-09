# Baseline (Lote 0) — antes de qualquer alteração

| Item | Valor |
|---|---|
| Repositório | `github.com/felipemenezes25000-spec/teste-mkt` (pacote `mundo-sem-fim-app`) |
| Caminho de recuperação | **A — repositório intacto** (96 commits, só `main`, árvore limpa) |
| SHA de origem | `846eea84d11fbfeea23afa9500918c4f4a3c3030` |
| Branch de trabalho | `feat/omega-v4-foundation` (sem push) |
| Backup | `C:\Users\Felipe\Downloads\mundo-sem-fim-backups\mundo-sem-fim-846eea8-2026-10-09.bundle` (`git bundle --all`, `git bundle verify` OK, 21,7 MB) |
| Ambiente | Windows 11, Node 24.14.0, npm 11.9.0, Docker 29.4 (Postgres 15 disponível), Playwright 1.62 |
| Alteração pré-existente | `package-lock.json` com bloco `engines` não commitado — preservado |

## Comandos e resultados (antes)

| Verificação | Resultado |
|---|---|
| `npx vitest run` | 33 arquivos, **230/230** testes OK |
| `next build` (Next 14.2.35) | OK, 28 páginas estáticas; só 8 destinos SSG; aviso de Edge Runtime |
| lint | **inexistente** (sem ESLint configurado) |
| typecheck | **inexistente** (projeto JS sem TS) |
| `npm audit --omit=dev` | **1 crítica + 3 altas** (Next 14: DoS no otimizador de imagem, desserialização RSC, smuggling em rewrites) |
| gitleaks (histórico completo) | 4 achados — todos falsos positivos (nomes de chave do localStorage) |
| QA navegador (17 rotas × 390/1440 × claro/escuro) | 20 combinações com problema: **fotos do Wikimedia quebradas** (`ERR_BLOCKED_BY_ORB`, 400/429) em home, explorar, decisão e destinos |

## Catálogo real (contado por script, não pelo README)

| Dataset | Contagem |
|---|---|
| Países (`PAISES_REF`) | 205 (22 curados + 183 extras) |
| Atrações consolidadas por país (`atracoesDoPais`) | 3.310 |
| Atrações com preço (`ATRACOES_PRECOS`) | 2.871 em 205 países (`ingresso` 1.339 · `gratis` 846 · `tour` 632 · `estimado` 54) |
| Overrides de foto (`ATRACOES_IMG`) | 163 |
| Regras de visto p/ passaporte BR | 205/205 (isento 121 · e-visa 33 · visto 32 · on-arrival 15 · eta 4) |
| Coordenadas de atrações/cidades | **nenhuma** (só centróide do país) |
| Proveniência por preço | nenhuma por item (só “estimativa 2025-2026”) |

## Bugs/riscos encontrados no baseline

| Sev. | Achado | Lote | Estado |
|---|---|---|---|
| P0 | Fotos quebradas: larguras de thumbnail fora do padrão Wikimedia → 400/429 | 4 | Corrigido (`wikiThumb` + `media.js`) |
| P0 | Next 14.2.35 com vulnerabilidade crítica | 1 | Corrigido (Next 16.4.0) |
| P1 | Preview de planos liberava Premium em produção via localStorage | 1 | Corrigido |
| P1 | `profiles.plano` editável pelo usuário (RLS de update) | 1 | Corrigido (trigger) |
| P1 | Visto sem regra = “isento 90 dias” (inventado) | 5 | Corrigido (“consultar”) |
| P1 | Foto de outra atração exibida como se fosse o lugar (ex.: Burj Khalifa em “Louvre Abu Dhabi”) | 4 | Corrigido (rótulo ILUSTRATIVA) |
| P1 | `/preview-apis` com selo “preços ao vivo” falso | 8 | Página removida |
| P1 | Voos simulados com nomes de companhias reais | 8 | Cenários sem marca |
| P1 | Webhook Stripe sem dedupe/ordem; 1 só `v1` | 1 | Corrigido |
| P2 | Tour modal bloqueando primeiro valor | 2 | Corrigido |
| P2 | Texto “167 países” (são 205) | 2 | Corrigido |
| P2 | ~750 linhas com emoji como ícone | 2 | Corrigido (ícones próprios) |
| P2 | Câmbio diário chamado de “ao vivo” | 6 | Corrigido |
