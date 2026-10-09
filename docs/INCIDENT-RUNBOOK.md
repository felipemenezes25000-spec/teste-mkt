# Incident runbook

| Sintoma | Causa provável | Diagnóstico | Ação |
|---|---|---|---|
| Fotos quebradas (400/429) | Largura fora do padrão Wikimedia ou original “unscaled” | DevTools → requests `upload.wikimedia.org`; status 400 “Use thumbnail sizes” ou 429 | Garantir `wikiThumb`/`media.js` (larguras padrão ≤ original). Ver `IMAGE-COVERAGE-REPORT.md` |
| Mapa “indisponível” | OpenFreeMap fora, WebGL ausente, CSP | Console: CSP `connect-src`; `tiles.openfreemap.org` | Checar CSP em `app/_lib/security.mjs`; lista textual continua funcionando |
| Rota sempre “estimada” | FOSSGIS fora, limite 1 req/s, CSP | Requests `routing.openstreetmap.de` | Conferir CSP; aguardar; para escala, subir OSRM próprio |
| Previsão do tempo some | Open-Meteo fora / cota 10k/dia | Requests `api.open-meteo.com` (429) | Contratar API comercial (obrigatório para uso com receita) |
| Despesa “sem conversão” | Frankfurter e open.er-api indisponíveis | Requests de câmbio | Despesa fica salva; reconverter depois (UI já avisa) |
| Assinatura não libera Premium | Webhook falhou / evento fora de ordem | Tabela `stripe_events` (`erro`, `processado_em`) | Reenviar evento pelo painel Stripe; dedupe garante idempotência |
| Usuário vê viagem de outro | **P0 de segurança** | Rodar `npm run test:rls` contra o schema atual | Bloquear deploy; revisar policies |
| Página 500 | Erro de runtime | `app/error.jsx` loga no console; logs da plataforma | Reproduzir local com `next start`; corrigir; reverter se necessário |
| Viagem “não encontrada” | Dados ficam no dispositivo; outro navegador/limpeza | — | Explicar (UI já explica); sync com conta resolve após migrations |

Contatos/escalonamento: definir na operação (não há plantão configurado).
