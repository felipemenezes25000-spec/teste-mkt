# Fatia 1 — Receita + Custo Honesto — Design/Spec

- **Data:** 2026-06-04
- **Contexto:** primeira de **5 fatias** que entregam o produto surpreendente que o viajante vive. Cada fatia = spec → plano → implementação → no ar. Ordem das 5: **(1) Receita + Custo Honesto** → (2) Loop de monetização → (3) Perfil que aprende → (4) Voos reais + previsão → (5) Conteúdo vivo + dados.
- **Origem:** [03 · Oportunidades](../plataforma/03-oportunidades.md) #1 e #2, [06 · Monetização](../plataforma/06-modelo-de-monetizacao.md).

## 1. Objetivo
Dois resultados, ambos de baixo esforço e alto retorno:
1. **Ligar a primeira receita** de afiliado sobre o tráfego de altíssima intenção que o app já gera (gente que pagou assinatura e montou a viagem inteira) — hoje esse clique sai sem nenhuma tag.
2. **Transformar o "custo total real" em gancho de conversão visível** — o bloco "Custo de vitrine vs Custo real" materializa a dor nº 1 do mercado (gap 1).

Princípio inegociável (da tese): **tudo "não configurado = no-op seguro"** — o app funciona 100% sem nenhuma chave de afiliado.

## 2. As 4 unidades (isoladas e testáveis)

### Unidade A — `_engine/afiliados.js` → `withAffiliate(url, parceiro)`
- **Função pura** (mora no `_engine` pra ser testável; as rotas/`_lib` importam de lá — ver seção 6). Recebe uma URL de deep-link + a chave do parceiro; lê o ID da rede de uma env e injeta o parâmetro de afiliado certo; devolve a URL decorada.
- **Registry de parceiros** (param/forma de decorar por parceiro):
  - `booking` → `aid=` (Awin/CJ deep-link ou aid direto), env `NEXT_PUBLIC_AFF_BOOKING`
  - `viator` → `pid=`/campaign, env `NEXT_PUBLIC_AFF_VIATOR`
  - `getyourguide` → `partner_id=`, env `NEXT_PUBLIC_AFF_GYG`
  - `klook` → `aid=`, env `NEXT_PUBLIC_AFF_KLOOK`
  - `civitatis` → `aid=`, env `NEXT_PUBLIC_AFF_CIVITATIS`
  - `travelpayouts` (voo/kiwi/omio) → `marker=`, env `NEXT_PUBLIC_AFF_TRAVELPAYOUTS`
  - `wise` → tag de afiliado, env `NEXT_PUBLIC_AFF_WISE`
  - `exibicao` (google, rome2rio, airbnb) → **no-op deliberado** (não pagam tráfego; ver [06](../plataforma/06-modelo-de-monetizacao.md))
- **Degradação:** parceiro sem env, parceiro desconhecido, ou marcado `exibicao` → retorna a **URL crua, intacta**.
- **Sem novos params de UTM na URL de saída** (UTM vai pro `track()`, não pro parceiro). `withAffiliate` só cuida da tag de afiliado.
- **Testes** (`afiliados.test.js`): injeção correta por parceiro com env setada; fallback sem env; parceiro desconhecido; parceiro `exibicao` (no-op); URL já com query (acrescenta `&` corretamente).

### Unidade B — `_lib/custoTotal.js` → `resumoVitrineVsReal(calc)` + `_components/CustoVitrineVsReal.jsx`
- **`resumoVitrineVsReal(calc)`** (função pura, em `custoTotal.js`): devolve `{ vitrine, real, economia, categorias }`, onde:
  - `vitrine` = só o que uma OTA mostraria = transporte entre trechos + a fatia de **hospedagem** da vida diária (≈40% via `custos.js`). É o "preço de vitrine".
  - `real` = `custoTotalRealista(calc).total` (já inclui comida, transporte local, atrações, seguro, eSIM, visto, contingência).
  - `economia`/diferença = quanto a vitrine ESCONDE.
- **`CustoVitrineVsReal.jsx`**: componente burro que recebe esse resumo e mostra os dois números lado a lado + o breakdown ("a vitrine te mostra X; a viagem real custa Y — e aqui está cada item escondido"). Tokens do DS, responsivo, dark, acessível.
- **Plugado em** `/decisao` (tem `calc`), `/roteiro` (tem `calc`), e `/destino/[slug]` (monta um calc mínimo de 1 trecho a partir de `custoDia`+estimativa de voo).
- **Testes:** `custoTotal.test.js` ganha casos de `resumoVitrineVsReal` (vitrine < real; economia > 0; categorias somam).

### Unidade C — Roteiro reservável (`(marketing)/roteiro/RoteiroClient.jsx`)
- Cada item do dia com categoria "comprável" (hospedagem/atração/transporte/comida) ganha um botão **"Reservar"** → `withAffiliate(linkDaCategoria(item, destino), parceiro)`, last-click.
- Mapa categoria→parceiro: hospedagem→booking, atração/passeio→viator (ou gyg), transporte→travelpayouts/rome2rio, comida→(deep-link de busca, sem afiliado por ora).
- Dispara `track('reservar_click', { categoria, destino, parceiro })` no clique.
- Somatório de custos do roteiro já existe/expande-se; sem nova lógica de cálculo pesada.

### Unidade D — `_lib/analytics.js` → `track(evento, props)`
- **Costura fina de event-tracking.** Lê config de env (`NEXT_PUBLIC_ANALYTICS`); sem config → **no-op** (em dev, `console.debug`).
- Expõe `track(evento, props)`. Eventos-chave do funil, com destaque pro `reservar_click` (carrega categoria/parceiro/destino) e `assinar_click`.
- Schema de eventos documentado no arquivo. Futuro: plugar PostHog/GA — fora do escopo desta fatia.

## 3. Fluxo de dados
```
calc ─→ resumoVitrineVsReal(calc) ─→ <CustoVitrineVsReal/>            (render do gancho)
deep-link cru (links.js) ─→ withAffiliate(url, parceiro) ─→ URL decorada
        └─ onClick ─→ track('reservar_click', {categoria, parceiro, destino}) ─→ navega
```

## 4. Envs novas (documentar em `.env.example`, todas opcionais)
`NEXT_PUBLIC_AFF_BOOKING`, `NEXT_PUBLIC_AFF_VIATOR`, `NEXT_PUBLIC_AFF_GYG`, `NEXT_PUBLIC_AFF_KLOOK`, `NEXT_PUBLIC_AFF_CIVITATIS`, `NEXT_PUBLIC_AFF_TRAVELPAYOUTS`, `NEXT_PUBLIC_AFF_WISE`, `NEXT_PUBLIC_ANALYTICS`.

## 5. Tratamento de erro / degradação
- `withAffiliate`: parceiro sem env / desconhecido / `exibicao` → URL crua intacta.
- `CustoVitrineVsReal`: `calc` ausente/vazio → não renderiza (sem quebrar a página).
- `track`: sem config → no-op silencioso.

## 6. Arquivos
- **Novos:** `app/_engine/afiliados.js` (lógica pura `withAffiliate`) + `app/_engine/afiliados.test.js`, `app/_lib/analytics.js` (`track`), `app/_components/CustoVitrineVsReal.jsx`.
- **Estendidos:** `app/_engine/custoTotal.js` (+`resumoVitrineVsReal`) e `custoTotal.test.js`; `app/_lib/links.js` (helper `linkPorCategoria`, e passa a usar `withAffiliate`); `RoteiroClient.jsx`, `DecisaoClient.jsx`, `destino/[slug]/page.jsx` (plugar o bloco); `.env.example`.
- *Nota de tooling:* testes só são descobertos em `app/_engine/**/*.test.js` (ver `vitest.config.js`). Por isso `afiliados.js` (puro, server-safe) mora em `_engine`; `_lib/links.js` o importa. Mantém o padrão "lógica pura e testável no `_engine`".

## 7. Fora de escopo (YAGNI — próximas fatias)
- Preço real de voo (Fatia 4). Câmbio ao vivo + CTA Wise dedicado (Fatia 2 — o seam withAffiliate já prepara). Perfil que aprende (Fatia 3). Dashboard visual de conversão (a `track()` emite; o painel vem depois).

## 8. Critérios de aceite
- [ ] `withAffiliate` injeta a tag quando a env existe e é no-op quando não — coberto por teste.
- [ ] Bloco "vitrine vs real" aparece em `/decisao`, `/destino/[slug]` e `/roteiro`, dark + responsivo + acessível.
- [ ] No roteiro, cada item comprável tem "Reservar" que abre a URL decorada e dispara `track`.
- [ ] `.env.example` documenta as envs novas; nada quebra sem elas (no-op seguro).
- [ ] **Vitest verde** (novos testes incluídos) + **`next build` verde** + verificado no **navegador** (Playwright) com console limpo — evidência descrita.
