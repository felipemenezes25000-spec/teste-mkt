# Release gates

> V4 §42 · V3 §72. Um release só sai com todos os gates obrigatórios em PASS (ou exceção registrada).

| Gate | Comando / evidência | Estado nesta sessão |
|---|---|---|
| Lint sem erros | `npm run lint` | PASS (0 erros; avisos legados do React Compiler) |
| Typecheck do domínio | `npm run typecheck` | PASS |
| Testes unitários/contrato | `npm test` | PASS (44 arquivos, 313 testes) |
| RLS em Postgres real | `npm run test:rls` | PASS (76/76) |
| Migrations no Supabase de produção | `supabase db push` (projeto `mundo-sem-fim`) | PASS (5/5 aplicadas; anon sem leitura verificado) |
| Build de produção | `npm run build` | PASS |
| QA tela a tela (7 larguras × 2 temas, 24 rotas) | `node scripts/qa-telas.mjs` | PASS (336/336 sem problema) |
| Acessibilidade (axe, teclado, zoom 200%) | `node scripts/a11y.mjs` | PASS (0 violações) |
| Jornada E2E (Japão 14 dias) | `node scripts/e2e-viagem.mjs` | PASS (12/12) |
| E2E plataforma (API, B2B, marketplace, Trip Pass) | `node scripts/e2e-plataforma.mjs` | PASS (23/23) |
| Segredos | `gitleaks git .` | PASS (sem segredos reais) |
| Dependências | `npm audit --omit=dev` | PASS (0) |
| Imagens | `node scripts/midia/auditoria.mjs` | PASS (205/205 capas; 97,1% licença verificada) |
| Provedores honestos | `/fontes` = `PROVIDER-MATRIX.md` | PASS (nenhum ADAPTER_READY exibido como ao vivo) |
| **Bloqueios externos** | — | BLOCKED_EXTERNAL: chaves/contratos (ver CONTINUATION) |
| **Deploy de produção** | Vercel `mundo-sem-fim` | Executado com autorização do dono (ver CONTINUATION) |
