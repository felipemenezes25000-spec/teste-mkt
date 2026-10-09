# Release gates

> V4 §42 · V3 §72. Um release só sai com todos os gates obrigatórios em PASS (ou exceção registrada).

| Gate | Comando / evidência | Estado nesta sessão |
|---|---|---|
| Lint sem erros | `npm run lint` | PASS (0 erros; avisos legados do React Compiler) |
| Typecheck do domínio | `npm run typecheck` | PASS |
| Testes unitários/contrato | `npm test` | PASS (39 arquivos, 277 testes) |
| RLS em Postgres real | `npm run test:rls` | PASS (34/34) |
| Build de produção | `npm run build` | PASS |
| QA tela a tela (7 larguras × 2 temas, 19 rotas) | `node scripts/qa-telas.mjs` | ver `QA-MATRIX.md` |
| Jornada E2E (Japão 14 dias) | `node scripts/e2e-viagem.mjs` | PASS (12/12) |
| Segredos | `gitleaks git .` | PASS (sem segredos reais) |
| Dependências | `npm audit --omit=dev` | PASS (0) |
| Imagens | `node scripts/midia/auditoria.mjs` | PASS (205/205 capas; 97,1% licença verificada) |
| Provedores honestos | `/fontes` = `PROVIDER-MATRIX.md` | PASS (nenhum ADAPTER_READY exibido como ao vivo) |
| **Bloqueios externos** | — | BLOCKED_EXTERNAL: chaves/contratos (ver CONTINUATION) |
| **Deploy de produção** | — | Não executado (exige autorização do dono) |
