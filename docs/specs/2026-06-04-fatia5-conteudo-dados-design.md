# Fatia 5 — Conteúdo vivo + dados — Design/Spec

- **Data:** 2026-06-04 · **Fatia 5 de 5 (última do produto que o viajante vive).** Origem: [05 · Proposta](../plataforma/05-proposta-de-produto.md), backlog de dados.

## Objetivo
Completar a experiência com a camada de DADOS práticos (o que salva a viagem) e os roteiros temáticos.

## Unidades
1. **`_engine/dicas.js`** (dados + pura): `dicasDe(code)` → segurança, golpes comuns, saúde/vacinas, transporte local, internet/chip — curadoria por REGIÃO com overrides por país (ex.: altitude em PE/BO, moto/jetski em TH, medina em MA). Estimativas de referência. 4 testes.
2. **`/destino`**: seção "✈️ Antes de ir" com as 5 categorias (só as que têm conteúdo).
3. **Roteiros temáticos** em `/roteiro`: 8 presets (gastronômico/romântico/família/mochileiro/luxo/cultural/aventura/praia) que pré-preenchem interesses + conforto + ritmo. Um eixo, infinitos roteiros — sem telas novas.

## Limite honesto
Hospedagem/experiências REAIS dentro da UI (preço/disponibilidade) exigem aprovação de API de parceiro (Booking Demand/Viator Full) — tarefa do Felipe; os deep-links de afiliado já existem (Fatia 1). Cobertura além dos 22 destinos vem das APIs ao vivo + cache (já em produção via Wikidata/Wikipedia).

## Aceite
- `/destino` mostra "Antes de ir" com dicas da região+país. `/roteiro` tem a fileira de temas que pré-preenche. Vitest + build verdes + navegador 0 erros. Provas `_proof/fatia5-*.png`.
