# 10 · Backlog (técnico · UX · dados · monetização)

> Itens acionáveis pra alimentar um board. Prioridade **P0** (já) → **P3** (depois). Esforço **S/M/L**. Referências ao código real e às oportunidades ([03](03-oportunidades.md)).

## 🛠️ Backlog técnico

| Pri | Item | Esf. | Notas |
|:---:|---|:---:|---|
| P0 | `withAffiliate(url)` lendo IDs de env; aplicar em `links.js`/`utils.js` | S | base de toda receita de afiliado |
| P0 | Camada de **event tracking** do funil (`explorar→…→reservar→assinar`) | M | precede qualquer otimização de conversão |
| P0 | Persistir **perfil do viajante** no Supabase (logados) | S | tabela `perfil_viajante` + sync |
| P1 | Acionar **loop de aprendizado** do `perfil.js` em favoritar/gerar/adicionar | M | `aprender()` já existe — falta o disparo |
| P1 | Plugar **Skyscanner/Travelpayouts** no seam `buscarVoos()` (preço real) | L | substitui faixa-por-distância |
| P1 | Curva de preço + veredito **"comprar/esperar"** em `/voos` | M | usa provider determinístico |
| P1 | `split.js` (rateio de grupo) puro + testes + `<Gate>` Pro | M | [#5](03-oportunidades.md) |
| P1 | Seam de **e-mail/push** (Resend/OneSignal) pra alertas de visto/preço | M | gancho de retenção |
| P2 | **Google Places** server-side (cap de custo, restrição de chave) + OSM fallback | L | respeitar trava de cache do Places |
| P2 | **Tripadvisor Content API** (nota/ranking na ficha) | M | camada de confiança |
| P2 | Tabelas `partners`/`partner_offers`/`commissions` + RLS | L | base da área B2B |
| P2 | **Painel admin** (moderação de ofertas, assinaturas, saúde de fetch) | L | |
| P3 | **SEO programático** ("custo de X", "X vs Y") + JSON-LD | L | aquisição orgânica |
| P3 | Avaliar **Duffel** como provider transacional (merchant) | L | só com volume |
| P3 | Export/delete de conta (LGPD), consentimento de cookies | M | conformidade |
| P3 | Logs estruturados por nível + dashboard de observabilidade | M | |

## 🎨 Backlog UX

| Pri | Item | Esf. | Notas |
|:---:|---|:---:|---|
| P0 | Componente **"Custo de vitrine vs Custo real"** (destino/decisão/roteiro) | M | o gancho de conversão #1 |
| P0 | Botão **"Reservar"** por item do roteiro (last-click, por categoria) | M | [#6](03-oportunidades.md) |
| P1 | **Onboarding de perfil** (quiz curto → preset) na 1ª visita à `/decisao` | S | hoje só chips de preset |
| P1 | **Badge global de alerta** (furo de visto/estação) persistente no AppNav | S | "feature que salva a viagem" |
| P1 | Bloco **"em reais hoje"** no orçamento + CTA cartão | S | dor pt-BR |
| P1 | **Comparador 2-4 destinos** lado a lado (custo total + score por perfil) | M | gated avançado |
| P2 | Estados de loading (skeletons) e empty states consistentes nas telas novas | S | já há padrão |
| P2 | Microinterações no Score (animação de barra, radar opcional) | S | premium feel |
| P2 | Tela/área **`/parceiros`** (cadastro de oferta, painel) | L | [07](07-estrategia-de-parceiros.md) |
| P2 | Revisão de **acessibilidade AA** nas telas novas (`/decisao`) | S | aria/contraste/teclado |
| P3 | Tour guiado das features de inteligência | M | |
| P3 | i18n (EN/ES) das strings | L | |

## 🗂️ Backlog de dados

| Pri | Item | Esf. | Notas |
|:---:|---|:---:|---|
| P0 | Revisar/expandir **`indices.js`** (segurança/gastronomia/etc.) com fonte datada | M | hoje são estimativas curadas |
| P1 | **Visto datado** por passaporte: ampliar cobertura + data de revisão | M | já estruturado em `data.js` |
| P1 | **Custos por cidade** (não só país) — refinar `cidadesCusto` | M | já há o campo |
| P1 | **Vacinas/segurança/golpes** por destino (camada estática + fonte) | L | disclaimer "fonte oficial" |
| P2 | **Internet/chip/transporte local** por destino | M | casa com eSIM afiliado |
| P2 | Expandir catálogo além dos 22 destinos (via APIs ao vivo + cache) | L | Wikidata/Places |
| P2 | **Melhores épocas** mais granulares (por região dentro do país) | M | |
| P3 | Base de **eventos/festivais** por destino/mês | L | enriquece roteiro |
| P3 | **Pratos típicos** estruturados (Wikidata) por cidade | M | já há curadoria em `data.js` |

## 💰 Backlog de monetização

| Pri | Item | Esf. | Notas |
|:---:|---|:---:|---|
| P0 | Cadastrar **Travelpayouts** (destrava ~10 players) | S | semana 1 |
| P0 | Cadastrar **Viator** (self-service) + **Civitatis** + **Wise** + **Revolut** | S | alto payout direto |
| P0 | Hospedagem via **Awin/CJ** (evita "Bookinggeddon") + **Agoda** próprio | M | |
| P1 | CTA **eSIM (Klook ~20%)** + **seguro (SafetyWing/Heymondo)** no roteiro | M | número já existe em `custoTotal.js` |
| P1 | **Cartão Wise/Revolut** CTA no câmbio (CPA fixo £10-500) | S | melhor fit BR |
| P1 | Gerenciador de **links com UTM** + dashboard de conversão por categoria | M | medir e cortar |
| P2 | **Destaque pago** de destino (rotulado) na `/explorar` | M | secretarias/OTAs |
| P2 | **Dados agregados de tendência** (anonimizados) — produto B2B | L | LGPD-safe |
| P2 | **Roteiro assinado** por influenciador + receita dividida | L | [07](07-estrategia-de-parceiros.md) |
| P3 | **White-label** (licença + setup) | L | piloto agência |
| P3 | **Marketplace de consultores** (take-rate de serviço) | L | |
| P3 | **API Premium** (motor de decisão como serviço) | L | |

## Definição de pronto (DoD) por item
1. Função pura nova → **teste Vitest** + `next build` verde.
2. Integração externa → **fallback/no-op seguro** se a chave não existir.
3. Feature paga → **`<Gate>`** + trava server-side conferida.
4. Tela nova → responsiva + dark mode + acessível + verificada no navegador.
5. Monetização → **UTM** e atribuição instrumentadas antes de divulgar.

> Sequência recomendada de execução em [09 · Roadmap](09-roadmap.md). Critérios de aceite globais em [12 · Qualidade](12-criterios-de-qualidade.md).
