# Fatia 3 — Perfil que aprende + retenção — Design/Spec

- **Data:** 2026-06-04 · **Fatia 3 de 5.** Origem: [03 · Oportunidades](../plataforma/03-oportunidades.md) #8, #9, #10.

## Objetivo
O fosso que cresce com o uso: o app aprende o perfil das AÇÕES, personaliza o comparar (upsell) e avisa o que salva a viagem (visto/estação).

## Unidades
1. **Perfil que aprende** — `perfil.js` ganha `PERFIL_EVENT` (disparado em `salvarPerfil`) e `aprenderComFavorito(code)` (lê o perfil, aprende dos índices+custo do destino via `aprender`/`destinoParaInteresses`, salva). `FavoriteButton` chama isso ao favoritar. `/decisao` escuta `PERFIL_EVENT` e re-renderiza com o perfil atualizado.
2. **Comparar "pelo seu perfil" (gated)** — `/comparar` ganha um bloco "Qual combina mais com você" (`recomendarDestinos` sobre os favoritos: score + porquê), atrás de `<Gate feature="comparar-avancado">` (Premium). O comparador básico segue grátis.
3. **Alerta de visto/estação** — `AppNav` mostra um badge "⚠ N" quando a rota salva tem furo de visto ou estoura orçamento (`escanearOportunidades` P0), linkando `/decisao`. É a prova de valor "que salva a viagem".

## Degradação
- Sem perfil salvo → usa o equilibrado. Sem plano salvo → badge não aparece. Aprendizado falha em silêncio (try/catch) sem quebrar o favoritar.

## Aceite
- Favoritar um destino move o perfil na direção dele (visível ao reabrir `/decisao`). Bloco gated aparece pra free (upsell) e libera pra premium (demo). Badge aparece com a rota-exemplo (furo de visto na Indonésia). Vitest + build verdes + navegador 0 erros.
