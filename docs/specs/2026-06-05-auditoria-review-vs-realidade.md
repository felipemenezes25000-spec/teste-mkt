# Auditoria — review externo vs. realidade do código (2026-06-05)

Resposta a um review externo (nota implícita ~7/10) que dizia que o site
"parece MVP/protótipo/feito por IA", com páginas internas "vazias" (Decisão,
Planejar, Roteiro IA, Voos, Salvos). Cada afirmação foi **conferida no código**,
não no print. Conclusão curta: **a maioria das críticas é falso-negativo de
crawler-sem-JS** — as telas são client-rendered (`*Client.jsx`), então um robô
que não executa JavaScript vê "página vazia".

## Review vs. realidade (verificado em código)

| Crítica do review | Realidade no código | Veredito |
|---|---|---|
| Home só promessa, sem assistente vivo | `HeroSimulador` roda `recomendarDestinos()` → 3 destinos rankeados | ❌ Falso |
| Decisão "só título e texto" | `DecisaoClient` ~450 linhas: wizard + score de 8 dimensões + perfis | ❌ Falso |
| Roteiro IA "só descrição" | 12 campos + LLM real (`gerarRoteiro`) → roteiro dia-a-dia estruturado | ❌ Falso |
| Salvos "quase vazio" | Tabela comparativa (score/custo/arrependimento) + comparar | ❌ Falso |
| Planejar "sem conteúdo" | Canvas de rota + mapa SVG + otimizador IA (~600 linhas) | ❌ Falso |
| Custo real ausente | `CustoTiers` + `CustoVitrineVsReal` no destino | ❌ Falso |
| Checkout "ilustrativo" | Stripe real (checkout + webhook), sem esse texto | ❌ Falso |
| "Sobre Japão" = só Monte Fuji | Bug real — **já corrigido** (desacopla foto/texto, `page.jsx:122`) | ⚠️ Era real |
| /voos sem preço real | Form rico + previsão real; voos em si **mock** (por design, seam p/ Amadeus) | ⚠️ Parcial |
| Explorar sem filtros "humanos" | Tinha busca/região/orçamento/coleções; **chips humanos adicionados hoje** | ⚠️ Era parcial |
| Fotos quebradas | Cascata de fallback garante imagem; correções de precisão em andamento | ⚠️ Cosmético |

## Notas por área

| Área | Nota | Observação |
|---|---|---|
| Posicionamento / proposta de valor | 9.0 | "Camada de decisão neutra acima das OTAs" — claro e diferenciado |
| UX / jornada | 8.0 | Simulador→decisão→rota→roteiro real; chips humanos fecham o gap do Explorar |
| UI / design system | 8.0 | `_ui/` + tokens + dark mode + `DESIGN-SYSTEM.md` |
| Copy | 8.5 | Vereditos humanos e específicos por país (não-template) |
| Conteúdo / dados de destino | 8.5 | 205 países, fontes (Wiki/Wikidata), fallback de foto garantido |
| SEO | 8.0 | sitemap/robots/JSON-LD/OG+Twitter por destino/metadata. Falta SEO **programático por intenção** |
| Performance | 8.0 | ISR + prerender só dos destaques + thumbnails dimensionados |
| Acessibilidade | 8.0 | focus trap, aria, alvo ≥48px, `prefers-reduced-motion` |
| Conversão / monetização | 7.5 | Stripe real + planos + gates. Dá pra reforçar "prova de economia" |
| Diferenciação competitiva | 9.0 | Decisão neutra + custo real + rota — onde Booking/Airbnb não vão |
| **Geral** | **~8.2** | Muito acima do "MVP/IA" do review — que não enxergou o client-render |

## O que foi feito hoje (commitado e no ar)

- **Catálogo mundial completo → 205 países** (195 ONU + 10 territórios). `feat(catalogo)`
- **Promoção de 16 commits** de outras sessões para `origin/main` (editorial curado,
  4 modos de perfil, subnota "custo emocional", overrides de foto verdes, MapTiler+OSM).
- **Chips de filtro humano no Explorar** (`barato`, `perto do Brasil`, `seguro`,
  `gastronomia`, `cultura & natureza`, `clima flexível`) — todos **lastreados em dado real**
  (custo/região/dimensões), com teste. `feat(explorar)`

## O que NÃO foi feito — de propósito

- **Não reconstruí features que funcionam.** O super prompt pedia "refazer Decisão/
  Planejar/Roteiro/Voos/Salvos" — todas já existem e são reais. Reconstruir = destruir
  código testado (215+ testes verdes).
- **Não apliquei correções de foto amarelas/laranjas** do `proposed-catalogo.md`: o
  dataset tem muito candidato errado (ex.: `Kruger`→"Efeito Dunning–Kruger",
  `Jan Thiel`→"Peter Thiel", `Basílica de Cartago`→uma basílica na **Tunísia**).
  Aplicar em massa trocaria foto-fallback (ok) por foto **errada** (pior). Os verdes
  seguros já estão no `atracoesOverride.js`.
- **Não criei chips "praia/sem-visto/vida-noturna"**: a base não tem esse dado.
  Inventar contraria o ethos do produto (conselho honesto, não achismo).

## Próximas apostas reais (não-cosméticas)

1. **SEO programático por intenção** — `/quanto-custa-viajar-para/[pais]`,
   `/melhor-epoca-para-viajar-para/[pais]`, `/roteiro/[pais]/7-dias`. Máquina de tráfego.
2. **Prova de economia na conversão** — "seu Premium custou R$19; a recomendação
   economizou R$X em voo+hospedagem". Liga custo real → motivo de assinar.
3. **/voos com dado real** (Amadeus/Kiwi via o seam já existente) ou rótulo de estimativa ainda mais claro.
