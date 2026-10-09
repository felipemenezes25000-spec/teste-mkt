# OMEGA V5 — continuação

```text
BRANCH            feat/omega-v5 (a partir de 4da2bac); ver `git log --oneline 4da2bac..`
STATUS            F0–F14 executados; nenhum P0 aberto; scorecard 706/1000 (OMEGA-V5-QUALITY-SCORECARD.md)
COMO VERIFICAR    npm run verify · npm run test:rls · npm run build && npx next start -p 3107
                  node scripts/e2e-v5.mjs http://localhost:3107
                  node scripts/e2e-viagem.mjs http://localhost:3107
                  node scripts/e2e-plataforma.mjs http://localhost:3107
                  node scripts/a11y.mjs http://localhost:3107
                  node scripts/qa-telas.mjs http://localhost:3107
                  node scripts/midia/auditoria.mjs
PRODUÇÃO          https://mundo-sem-fim-lac.vercel.app publicado com a V5 (22182d4) em 2026-10-09;
                  e2e-viagem 12/12 e simulador verificados em produção; Supabase sem migrations novas
```

## Próximos passos com maior impacto (sem duplicar trabalho)

1. **Comércio live**: chaves Stripe (sandbox → produção) + webhook; um provedor de voo (Duffel/
   Travelpayouts) para trocar a faixa ilustrativa por cotação com TTL; afiliação de hotel.
2. **Observabilidade**: Sentry/OTel com política de PII, SLO de disponibilidade das rotas de viagem,
   alerta de provider fora; RUM consentido para p75 de CWV.
3. **Performance**: fotos do hero em AVIF/WebP pelo próprio domínio (orçamento de imagem da Vercel ou CDN).
4. **Validação humana**: sessões por persona (§21), iPhone/Android físicos, NVDA/VoiceOver,
   amostra foto↔POI dos 30 destinos prioritários.
5. **Escala**: OSRM próprio ou provedor de rotas; rate limit distribuído (Upstash/Redis);
   regra de firewall da Vercel para `/api/v1/*`; ensaio de backup/restore do Supabase.
6. **Conteúdo**: páginas de cidade só quando houver dados próprios suficientes (evitar thin pages);
   `hreflang` quando houver URLs por idioma.

## Armadilhas registradas

- Importar `_engine/data.js` (ou algo que o importe, como `utils.js` antigo) em componente client
  arrasta o catálogo de 205 países para o bundle — use `meses.js`, `cambioRede.js`, imports dinâmicos.
- Teste de função pura não deve importar componente `.jsx` (estoura tempo sob carga) — extraia o puro.
- `Intl` usa espaço não separável depois do símbolo da moeda (`R$ 1.234`) — regex com `\s*`.
