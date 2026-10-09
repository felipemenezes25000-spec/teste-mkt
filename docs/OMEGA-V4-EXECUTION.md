# OMEGA V4 — registro de execução

Sessão de 2026-10-09 · branch `feat/omega-v4-foundation` · commits por lote (sem push).
Prompt: `MUNDO_SEM_FIM_OMEGA_V4_DEFINITIVO_RECOVERY_FIRST.md` (o arquivo V3 é idêntico ao anexo do V4).

## Decisões (ADRs curtos)

| # | Decisão | Por quê | Alternativa descartada |
|---|---|---|---|
| 1 | Caminho A (recuperação), sem reescrever do zero | Repo intacto, 230 testes passando; V4 §49 | Big-bang greenfield |
| 2 | Next 14 → **16.4** + React 19 | Vulnerabilidade crítica sem correção na linha 14 | Ficar no 14 com risco aceito |
| 3 | Manter JS; contratos novos com JSDoc + `tsc --checkJs` (`app/_domain`) | TS gradual sem migração total (V4 §36) | Converter tudo para TS |
| 4 | Identidade **MERIDIANO** (tinta/papel polar, azul meridiano, lima de sinal; Bricolage + Geist + Geist Mono) | Dono rejeitou a identidade antiga; ver `BRAND-RATIONALE.md` | Aurora, Carimbo |
| 5 | Nomes de token legados mantidos como aliases | Migrar ~1.500 usos sem big-bang | Renomear tudo de uma vez |
| 6 | Ícones próprios + codemods (Babel parser, edição por offset) | V4 proíbe emoji como ícone; preservar formatação | Lib de ícones externa |
| 7 | Mapas: MapLibre + **OpenFreeMap** (OSM) | Sem chave, uso comercial permitido, atribuição automática | Google Maps JS (chave, custo, regras de mistura) |
| 8 | Rotas: **OSRM/FOSSGIS** com fila ≤ 1 req/s; estimativa rotulada como fallback | Real e grátis para uso leve; honesto quando indisponível | Linha reta sem rótulo |
| 9 | Coordenadas: Wikipedia → Wikidata P625 (QID), com validação de distância | Identidade canônica e proveniência; descarta homônimos | Geocoder comercial |
| 10 | Viagens **local-first** (localStorage + migração de esquema) e sync Supabase como adaptador | Funciona offline e sem conta; RLS pronto para quando houver projeto | Exigir login |
| 11 | Reserva importada = `CONFIRMED` por `import_manual`, rotulada | V4: nunca fingir confirmação do fornecedor | Esconder status |
| 12 | Câmbio = RECENTE com data (BCE/Frankfurter, open.er-api) | Fontes publicam taxa diária | Chamar de “ao vivo” |
| 13 | Voos sem provedor = cenários estimados **sem marcas** | Não sugerir ofertas que não existem | Mock com companhias reais |
| 14 | Saída para parceiros via `/api/out` com allowlist https | Atribuição + anti open redirect | Links diretos sem rastreio |

## O que foi entregue por lote

- **L0** — backup verificado, baseline medido (`BASELINE.md`), QA baseline com screenshots, catálogo contado.
- **L1** — `app/_domain/{money,evidence,booking,time,provider,rotas}.js` com testes; migration `20261009000000_trip_workspace.sql` (membros/papéis, itinerário, reservas, despesas, documentos, alertas, `stripe_events`, `affiliate_clicks`, `commission_ledger`, exclusão de conta LGPD); `scripts/rls-test.mjs` (34 casos, Postgres real no Docker); webhook Stripe reescrito; ESLint 9, typecheck, scripts `verify`, `test:rls`, `qa`.
- **L2** — tokens/tipografia/raios/elevação novos, marca e ícone, `Icon` (~120 glifos), `Foto`, `SourceTrust`, `Marca`, nav e rodapé novos, cards sociais.
- **L3** — home (simulador no hero, jornada, confiança nos dados), World Explorer (mapa ⇄ lista, camadas custo/época/visto, estado na URL).
- **L4** — serviço de mídia (`media.js`), capas 205/205, foto ilustrativa rotulada, coordenadas canônicas (`app/_data/geo/lugares.json`), mapa por país.
- **L5** — neutralidade do ranking testada, comparador com pesos e seleção direta, visto “consultar”.
- **L6** — selos de frescor em preços, câmbio com data, despesas com taxa/fonte/data.
- **L7** — rota real (FOSSGIS), otimizador do dia (2-opt + janelas + horário fixo + status), mapa do planner interativo.
- **L8** — `/fontes` + `PROVIDER-MATRIX.md` gerado de `provedores.js`; mockups enganosos removidos.
- **L9** — `/viagens` e workspace (roteiro, reservas, despesas, documentos, resumo/prontidão).
- **L10** — Modo Viagem (próximo passo, hora de sair, localização consentida, clima, Plano B revisável, offline).
- **L11** — `/api/out`, ledger/cliques com RLS, Stripe robusto.
- **L12** — sitemap/robots, noindex de áreas pessoais, OG por destino.
- **L13** — QA tela a tela automatizado, E2E da jornada, gitleaks, npm audit.
- **L14** — esta documentação + `CONTINUATION.md`.

## Fora do escopo desta sessão (não implementado — registrado, não escondido)

- B2B/agências, white-label, marketplace de creators/consultores, portal de API pública (V4 §39/§75): exigem modelo comercial, contratos e multi-tenant em produção. A base de RLS/papéis (`trip_members`) é o ponto de partida.
- Checkout nativo/embedded de viagens (V4 §30 modos 3-4): exige parceiro e licença; hoje só `DEEPLINK` (honesto).
- i18n das telas novas (en/es/ja): textos novos estão em pt-BR.
- Monitoramento de produção (SLO, alertas), Lighthouse em dispositivo real.

## Como verificar localmente

```bash
npm run verify          # lint + typecheck + testes (277)
npm run test:rls        # RLS em Postgres real (requer Docker)
npm run build && npx next start -p 3107
node scripts/qa-telas.mjs http://localhost:3107       # QA tela a tela
node scripts/e2e-viagem.mjs http://localhost:3107     # jornada Japão 14 dias
node scripts/midia/auditoria.mjs                      # cobertura de imagens
node scripts/geo/geocodificar.mjs                     # regera coordenadas
node scripts/docs/gerar-matrizes.mjs                  # regera matrizes de provedores/mapas
```
