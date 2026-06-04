# Fatia 2 — Loop de monetização — Design/Spec

- **Data:** 2026-06-04 · **Fatia 2 de 5.** Origem: [03 · Oportunidades](../plataforma/03-oportunidades.md) #4 e #7.

## Objetivo
Fechar o loop de receita iniciado na Fatia 1, capturando as decisões que o viajante toma **na fase de planejamento** (onde nosso app vive): câmbio/cartão internacional, chip/eSIM e seguro. Tudo no-op seguro sem env.

## Unidades
1. **`_engine/cambio.js` → `custoEmReais(valorUSD, taxaBRL, opts)`** (pura): converte pro real mid-market e estima o custo num cartão de banco (IOF 6,38% + spread ~4%) vs uma fintech tipo Wise (≈mid-market). Devolve `{ brlMid, brlBanco, brlWise, economiaWise }`. Testes.
2. **`_engine/afiliados.js`**: + parceiro `safetywing` (seguro, env `NEXT_PUBLIC_AFF_SAFETYWING`). eSIM usa `klook`, câmbio usa `wise` (já existem).
3. **`_lib/links.js`**: `linkWise()`, `linkEsim(local)` (Klook eSIM), `linkSeguro()` (SafetyWing) — decorados com `withAffiliate`.
4. **`_components/ServicosDaViagem.jsx`**: bloco "Prepare a viagem" — (a) "quanto custa em reais hoje" com banco-vs-Wise + CTA cartão; (b) CTAs eSIM e seguro. Cada clique dispara `track('reservar_click', {categoria})`.
5. **Wiring**: `/decisao` (tem `calc`; pega `taxaBRL` de `plano.settings.fx.rates.BRL`).

## Degradação
- Sem `taxaBRL` (rate ausente) → o bloco de câmbio mostra só a chamada genérica, sem números (não quebra).
- Sem env de afiliado → CTAs abrem o parceiro sem tag (no-op).

## Aceite
- `custoEmReais` testado (banco > wise > mid). Bloco aparece em `/decisao`, dark+responsivo. Vitest + build verdes + navegador 0 erros. `.env.example` documenta `NEXT_PUBLIC_AFF_SAFETYWING`.
