# Corrigir + Elevar — Mundo Sem Fim (2026-06-05)

Resposta a uma review externa (nota 7/10). Diagnóstico: quase todas as features
que a review pede "criar" **já existem e estão no ar** (HEAD `61abf6b` = origin/main).
O trabalho é **corrigir bugs de confiança + elevar acabamento**, reusando o que existe.
Nada de reconstruir features que funcionam. Não mexer na lógica interna do planner
(`App.jsx`, motor de rota, sync, auth) — só o estado de loading dele.

## Fatia 1 — Confiança (mata a cara de "quebrado/MVP")

### 1.1 "Sobre {país}" correto (bug sistêmico, ~145 países)
- **Causa:** `destino/[slug]/page.jsx` usa `resumoWiki(d.fotoQuery || d.nome)` para
  obter foto **e** texto. `fotoQuery` é uma cidade/landmark (escolhida para o herói),
  então "Sobre Alemanha" mostra o extrato de "Portão de Brandemburgo".
- **Fix:** desacoplar. Foto continua via `fotoQuery`. O texto "Sobre" passa a vir de
  `resumoWiki(d.nome)`. Se o país não tiver extrato, fallback com rótulo honesto.

### 1.2 % do custo honesto
- **Causa:** `CustoVitrineVsReal.jsx` calcula `escondido/real` (~31%) e exibe
  "+US$ X (31%)" colado no "vitrine→real" — lê como "+31% sobre a vitrine" (que é ~44%).
- **Fix:** número principal = "+US$ X acima da vitrine (44%)" (`escondido/vitrine`);
  secundário = "= 31% do custo final". Helper puro `percentuais()` + teste.

### 1.3 /voos sem jargão + autocomplete
- Remover "provider mock" / "arquitetura pronta…" das strings de usuário
  (`voos/page.jsx`, `VoosClient.jsx` — 5 ocorrências). Copy nova honesta.
- `_components/Autocomplete.jsx` genérico/acessível (molde: `GlobalSearch.jsx`) para
  origem/destino no lugar dos `<select>` (destino = 167 = o "select gigante").

### 1.4 Loading → skeleton/empty bonitos (SSR-safe)
- `_components/EmptyState.jsx` (padroniza o padrão inline do `SalvosClient`) e
  `_components/Skeleton.jsx` (usa a classe `skel` dos tokens).
- `/planejar`: `loading` do `dynamic(ssr:false)` vira skeleton da tela do app.
- `/decisao`, `/roteiro`: hero já é SSR; troca o "Carregando…" do widget por skeleton.
- `/salvos`, `/comparar`: skeleton enquanto lê localStorage; empty-state enriquecido
  com 5 destinos recomendados + CTA.

## Fatia 2 — Acabamento premium (híbrido)

- **Tokens** (aditivos, AA, nos 2 temas): `--c-coral` (CTA primário) + `--c-solar`
  (economia/custo real) + `on-coral`/`on-solar`. Expor no Tailwind. Coral só no CTA
  primário; solar nos blocos de economia.
- **Tipografia:** trio display (títulos) + sans (interface) + tabular (`tnum`) nos
  custos. Adicionar fonte display via `next/font` se faltar.
- **Cards + hero:** refinar `DestinoCard` (sombra/badges/gradiente, sem mudar API);
  mini-simulador no hero da home (origem/mês/orçamento/dias/estilo → 3 destinos),
  reusando o motor de decisão. Passe de espaçamento/contraste em home/explorar/destino/planos.

## Verificação (cada fatia)
- Vitest (funções puras: percentuais, fallback do "Sobre", filtro do autocomplete).
- `next build` com `NEXT_DIST_DIR=.next-prod` (não colide com `next dev`).
- Playwright: 0 erros de console, claro/escuro, 390px + desktop.

## Entrega
Fatia 1 → verifica → commit+push no submódulo (Vercel redeploya). Fatia 2 idem.
Por fim, atualizar o ponteiro do submódulo no repo `teste mkt`.
