# Fatia 4 — Voos (previsão) + Modo grupo — Design/Spec

- **Data:** 2026-06-04 · **Fatia 4 de 5.** Origem: [03 · Oportunidades](../plataforma/03-oportunidades.md) #3 e #5.

## Objetivo
Duas features "uau": prever **comprar vs esperar** (o único moat do Hopper) e dividir o custo **antes** da viagem (o que o Splitwise não faz).

## Limite honesto
Preço de voo **real** exige aprovação de afiliado/API (Skyscanner/Kiwi) — tarefa de cadastro do Felipe; o seam `buscarVoos` já está pronto. A previsão roda hoje sobre a faixa do provider mock (determinística por rota) e, quando a API real for plugada, roda igual sobre preço real **sem mudar a UI**.

## Unidades
1. **`_engine/previsaoVoo.js`** (pura): `curvaPreco(rota, faixa, dias)` (curva determinística por rota, PRNG seeded) + `vereditoCompra(curva, precoAtual)` → `{ acao: comprar|esperar|estavel, texto, melhorDia, economia }`. 7 testes.
2. **`/voos`**: card `PrevisaoVoo` com o veredito + mini-gráfico de 30 dias (barra escura = dia mais barato).
3. **`_engine/split.js`** (pura): `dividirCusto(total, n, categorias)` (por pessoa + por categoria) e `acertarContas(pagamentos, n)` (quem deve quanto — settle-up). 5 testes.
4. **`_components/ModoGrupo.jsx`** + `/decisao`: rateio por pessoa, gated `<Gate feature="colaboracao">` (Pro).

## Aceite
- `/voos` mostra veredito+gráfico após buscar. `/decisao` mostra modo grupo (upsell free / split pro). Vitest + build verdes + navegador 0 erros. Provas `_proof/fatia4-*.png`.
