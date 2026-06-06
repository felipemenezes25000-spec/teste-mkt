# Preços por cidade × categoria — enriquecimento V2 — Design/Spec

- **Data:** 2026-06-06 · **Origem:** pedido direto do usuário ("colocar todos os passeios, atrações, museus e preços nos 205 países, deep research").

## Contexto e descoberta

V1 já existe e está completo. Não foi commitado. Arquivos atuais (untracked):

- `app/_engine/atracoesPrecos.js` — 205/205 países · 2.871 atrações · schema `{ nome, wiki, cidade, categoria, precoUSD, precoTipo, duracao }` · 8 categorias (museu, passeio, atracao, parque, experiencia, religioso, natureza, historico) · 47% ingresso, 29% grátis, 22% tour, 2% estimado.
- `app/_components/OQueFazer.jsx` — componente que renderiza a lista filtrada por categoria, converte USD→BRL ao vivo via `useCambioBRL`, i18n via `useIdioma`.
- `app/(marketing)/destino/[slug]/page.jsx:306` — já chama `<OQueFazer itens={atracoesPrecosDoPais(d.code)} />`.

V2 NÃO regenera V1. **Adiciona** uma camada agregada por cidade × categoria com 6 campos que V1 não tem: dicaEconomia, passesCombo, especialidades, gratuitosCurados, melhorHorario por categoria, reservaAntecipada por categoria.

## Objetivo

Subir o V1 (lista granular) para a régua de guia de viagem real, sem desperdiçar o trabalho já feito — adicionar a camada que diferencia o app de TripAdvisor genérico (economia, combos, especialidades) e mantém honestidade (gratuitos curados, melhor horário, exigência de reserva).

## Schema V2

Arquivo `app/_engine/precosCidadeCategoria.js` (gerado pelo workflow, não editar à mão):

```js
export const PRECOS_CIDADE = {
  "TH": {
    "Banguecoque": {
      categoriasMeta: {
        templo:          { melhorHorario: "8h-10h (calor e ônibus de turistas)", reservaAntecipada: "nao" },
        museu:           { melhorHorario: "abertura ou últimas 2h", reservaAntecipada: "nao" },
        "tour-dia-todo": { melhorHorario: "saída 7h-8h", reservaAntecipada: "recomendada" },
        // ... outras categorias da cidade
      },
      especialidades: [
        { slug: "luta-muay-thai", precoUSD: { min: 30, max: 60 }, moedaLocal: "1000-2000 THB",
          obs: "Lumpinee = tradicional. Rajadamnern = mais turística.", wiki: "Muay Thai" },
        { slug: "mercado-flutuante", precoUSD: { min: 15, max: 40 }, moedaLocal: "500-1400 THB",
          obs: "Damnoen Saduak famoso; Amphawa autêntico (fim de semana).", wiki: "Mercado flutuante de Damnoen Saduak" }
      ],
      passesCombo: [
        { nome: "Bangkok Sightseeing Pass", precoUSD: 35,
          cobre: ["3 templos principais", "Chao Phraya tour"],
          economia: "~15 USD vs ingressos avulsos" }
      ],
      gratuitosCurados: [
        "Templo Wat Saket (Monte Dourado) — entrada livre, doação opcional",
        "Khao San Road (street food, ambiente)",
        "Lumphini Park (tai chi 6h da manhã)"
      ],
      dicasEconomia: [
        "Calça/blusa cobrindo ombros nos templos evita aluguel de pareo (50 THB)",
        "Tuk-tuk só aceita preço FIXO combinado antes — Grab é mais barato em viagens longas"
      ],
      fontes: ["bma.go.th", "tourismthailand.org", "wikivoyage:Bangkok"]
    },
    // ... outras cidades de TH
  }
  // ... outros 204 países
}

export const PRECOS_META = {
  pesquisadoEm: "2026-06-06",
  metodologia: "Workflow multiagente — 3 fontes por cidade (oficial, comunitária, agregador); enriquecimento sobre V1 (atracoesPrecos.js)",
  moedaPivo: "USD",
  paisesPesquisados: 205,
  cidadesPesquisadas: "~820",
  versaoSchema: 2,
  validadeEstimada: "12 meses"
}
```

**Decisões de schema:**

- **`categoriasMeta` em vez de duplicar atrações:** só os atributos NOVOS por categoria. As atrações específicas continuam em V1 (`atracoesPrecos.js`).
- **`precoUSD: { min, max }` em especialidades/passes:** range, não valor único — envelhece melhor que preço exato.
- **`moedaLocal` é string descritiva:** "1000-2000 THB" mantém contexto pro viajante sem precisar conversão de range.
- **`fontes` é array de slugs auditáveis:** não URLs (quebram), não citações longas (inflam arquivo).

## Unidades

1. **`app/_engine/precosCidadeCategoria.js`** — gerado pelo workflow. ~10-20k linhas estimadas. Header banner "NÃO editar à mão — re-rodar workflow precos-enriquecimento-v2".

2. **`app/_engine/precosCidadeOverride.js`** — stub `{}` com cabeçalho de instrução. Mesmo padrão de `atracoesOverride.js`. **Override SUBSTITUI a cidade inteira** (não merge profundo) — semântica simples: se quer trocar uma dica, copia a cidade do gerado, modifica, cola no override. Vence base.

3. **`app/_engine/precos.js`** — pura, com getters:
   - `dicasDe(code, cidade)` → string[]
   - `passesDe(code, cidade)` → PasseCombo[]
   - `especialidadesDe(code, cidade)` → Especialidade[]
   - `gratuitosCuradosDe(code, cidade)` → string[]
   - `metaCategoriaDe(code, cidade, categoria)` → { melhorHorario, reservaAntecipada }
   - `precosMeta()` → PRECOS_META + `diasDesdePesquisa` derivado
   - `cidadesComV2(code)` → string[] (cidades com cobertura V2)

4. **`app/_engine/precos.test.js`** — Vitest. Invariantes:
   - 205 países cobertos (ou exceções documentadas na allowlist)
   - Toda cidade em V2 também aparece em V1
   - precoUSD.min ≤ precoUSD.max
   - Override aplica sobre base
   - cidadesPesquisadas em META bate com count real

5. **`app/_components/OQueFazer.jsx`** — estende. Acima da lista atual, novos blocos colapsáveis:
   - 💡 Dicas de economia (`dicasEconomia`)
   - 🎟️ Vale o passe? (`passesCombo`)
   - ⭐ Especialidade da cidade (`especialidades`)
   - 🆓 Grátis ou doação (`gratuitosCurados`)

   Cada categoria nos chips de filtro ganha tooltip "⏰ {melhorHorario} · 🎫 reserva: {reservaAntecipada}".

## Workflow `precos-enriquecimento-v2`

Pipeline de 4 estágios, 205 países em paralelo respeitando cap 16:

```
País
  ↓ Stage 1: ResolveCidades
    Lê paisesMundo.js + atracoesPrecos.js do país, escolhe cidades com cobertura V1 ≥ 3 atrações
  ↓ Stage 2: PesquisaEnriquecimento (1 agent por cidade, paralelo dentro do país)
    Schema estruturado (PRECOS_CIDADE_SCHEMA).
    Pesquisa 3 fontes obrigatórias: oficial + wikivoyage + agregador.
    Output: 4 blocos + categoriasMeta.
  ↓ Stage 3: VerificaAdversarial (skeptic por cidade)
    Prompt: "Tente refutar dica/passe/especialidade. Default: refutado=true se duvidoso."
    Refutado → reentra Stage 2 com fontes adicionais (max 2 retries).
  ↓ Stage 4: Compila país (pura no script)
    Junta cidades → PRECOS_CIDADE[code].
```

**Estimativas:**
- ~820 cidades × ~2 agentes (pesquisa + verifica) = ~1.640 agentes
- Cap 16 simultâneos → ~103 lotes → **2-3h wall-clock**
- ~5-10M tokens output, ~10M input (~50-100 USD)
- Cap workflow 1000 agentes → divido em 2 chamadas seriais (~415 cidades cada) se necessário

## UI em `/destino/[slug]`

Sem mudança de layout — `OQueFazer.jsx` ganha 4 blocos acima da lista (colapsáveis em mobile). Padrão visual segue o design system existente (`rounded-3xl border border-line bg-card`).

Cidade selecionada = `d.cidadePrincipal` de paisesMundo.js. Chips alternam cidades com cobertura V2.

## Confiança e atualização

- **Cabeçalho:** "Atualizado em {pesquisadoEm}". Após 12 meses, badge "⚠️ pode estar desatualizado".
- **Por bloco:** badge "estimativa baixa confiança" quando QUALQUER um destes: `fontes.length < 2` OU refutação adversarial sobreviveu aos 2 retries OU agente retornou `confianca: "baixa"` explicitamente.
- **Override:** `precosCidadeOverride.js` permite consertar UMA cidade sem rodar workflow. Override vence base.
- **Re-pesquisa parcial:** workflow aceita `args.somentePaises: ["TH","JP"]` — roda só esses (~5min).

## Aceite

1. Workflow concluído com sucesso. `precosCidadeCategoria.js` salvo.
2. Cobertura ≥ 95% (≥ 195 países com bloco V2 não-vazio). Países sem cobertura documentados em allowlist com motivo.
3. `npm test` verde — 8 invariantes em `precos.test.js`.
4. `npm run build` verde.
5. `/destino/tailandia` localmente renderiza dicas + passes + especialidades + gratuitos.
6. Screenshot em `docs/plataforma/_proof/precos-v2-TH.png`.
7. Commit no submódulo com 4 arquivos novos de código (`precosCidadeCategoria.js`, `precosCidadeOverride.js`, `precos.js`, `precos.test.js`) + 1 extensão de `OQueFazer.jsx` + este spec. Sem push automático.

## Limite honesto

- Especialidades e passes em países pequenos (Tuvalu, Nauru, San Marino) podem vir vazios — é ok, UI não renderiza o bloco.
- "Dica de economia" é heurística humana extraída de fontes; vai envelhecer (ex.: passe que mudou de nome). Aceito.
- Workflow não valida atrações INDIVIDUAIS de V1 — só agrega novos campos. Auditoria de preços V1 é tarefa separada (não estourar escopo aqui).

## Riscos

- **Wikivoyage sem cobertura para país pequeno:** fonte única → marca confiança baixa, prossegue.
- **Verificação adversarial muito agressiva:** se ≥10% das cidades refutarem permanentemente, paro e revejo prompt antes de gastar mais tokens.
- **Bundle JS inflando:** `precosCidadeCategoria.js` importado no Server Component (igual `atracoesPrecos.js` faz); só fatia do país serializada no HTML.
