# OMEGA V5 — auditoria de UX, marca, interação, responsivo, navegação e copy

> Consolida os entregáveis de V5 §3.2 (`visual-audit`, `brand-final`, `interaction-spec`,
> `responsive-matrix`, `navigation-map`, `copy-audit`) num documento, para não multiplicar
> arquivos sem produto (V5 §0 "não é objetivo"). Capturas: `docs/plataforma/_proof/` (local).

## Achados visuais e correções

| Tela | Achado | Ação |
|---|---|---|
| Home | Simulador ficava enorme e empurrava o título | Título fixo ao lado; resultados compactos em 3 camadas |
| Home | Seletor "Mês" truncado em 1440 px | Grade redistribuída |
| Home (en/es/ja) | Motivo do destino em português | Motivos estruturados e traduzidos |
| Explorar | Mapa carregava pesado e "prendia" a rolagem no celular | Prévia com continentes e botão "Abrir mapa interativo" (hover ativa no desktop) |
| Explorar/Destino | Mapa com cara de template | Paleta MERIDIANO (água azul polar, terra papel, noite atlas no escuro) |
| Mapa escuro | Controles brancos | Controles e atribuição no tema |
| Destino | Foto falhando virava ícone quebrado | Placeholder editorial honesto |
| Celular | Sem navegação inferior | Barra adaptativa (Descobrir, Decidir, Hoje*, Viagens, Salvos) |

## Marca (MERIDIANO) — decisão V5

Mantida: azul meridiano `#2742F5` (rota/seleção), lima `#C8FA3C` (próxima ação), papel polar
`#F3F5F8`, noite atlas `#070B14`; Bricolage Grotesque / Geist / Geist Mono. Testada em CTA, mapa
(água/terra), alertas e dinheiro. Contraste: axe 0 violações (21 rotas × 2 temas). Nova aplicação:
paleta cartográfica em `app/_components/mapa/paletaMapa.js`.

## Interação

- Motion existente 120–450 ms (`riseIn` .45 s); `prefers-reduced-motion` respeitado pelo CSS global.
- Mapa: nada de animação de entrada; zoom/pan do usuário.
- Combobox de origem: setas, Enter, Esc, `aria-activedescendant`.

## Responsivo

`scripts/qa-telas.mjs`: 24 rotas × 320/390/768/1024/1280/1440/1920 × claro/escuro (ver QA-MATRIX).
`e2e-v5` VIS-01: zero rolagem horizontal em 320 px nas 5 rotas críticas. Larguras 360/430 não
estão na matriz automática (cobertas por 320/390 e pelo layout fluido) — registrado.

## Navegação

| Contexto | Desktop | Celular |
|---|---|---|
| Descoberta | Descobrir · Decidir · Planejar · Viagens · Ferramentas | barra inferior + menu |
| Em viagem (em curso ou ≤ 3 dias) | Viagens → workspace → Modo Viagem | atalho **Hoje** em destaque na barra |
| Plataforma | Ferramentas → Marketplace, Agências, API | menu |

## Copy

Preço: "estimativa", "faixa ilustrativa · sem cotação", "não é preço final", "referência jun/2026".
Câmbio: "referência; não inclui spread do cartão nem IOF". Veredito nunca diz "cabe" sem escopo
("Só o custo em terra cabe — passagem não incluída").

## Não avaliado (exige pessoas/dispositivos)

Teste com usuários reais por persona (§21), iPhone/Android físicos, NVDA/VoiceOver.
