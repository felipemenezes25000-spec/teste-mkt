# 07 · Estratégia de Parceiros (B2B / B2C)

> Como atrair parceiros que **pagam ou dão comissão** pra acessar o tráfego qualificado que a plataforma gera. Complementa o [06 · Monetização](06-modelo-de-monetizacao.md).

## A proposta de valor de dois lados

```
        ┌──────────────── MUNDO SEM FIM ────────────────┐
 B2C →  │  Viajante paga assinatura por:                │  ← B2B
        │   • economizar tempo (não costura 5 apps)     │   Parceiro paga/dá comissão por:
        │   • economizar dinheiro (custo real + cortes) │    • tráfego qualificadíssimo
        │   • evitar erro (visto, estação, custo oculto)│    • intenção REAL de compra
        │                                               │    • leads/reservas/cliques
        │   ↓ gera ↓                                    │    • dados agregados de tendência
        │   INTENÇÃO DE COMPRA estruturada e datada     │    • integração no fluxo de decisão
        └───────────────────────────────────────────────┘
```

**Por que o parceiro quer entrar** (o pitch B2B): *"O viajante chega até você já tendo decidido pra onde vai, em que mês, com que orçamento e que estilo — e clicou em 'reservar' no momento exato da decisão do roteiro. Não é um clique frio de metabusca: é intenção qualificada, datada e contextualizada. Conversão maior, CAC menor."*

Isso é o oposto do tráfego de metabusca (frio, comparando só preço). O nosso é **quente e contextual** — o parceiro recebe alguém que já sabe que vai pra Cusco em maio, por 6 dias, com US$ 1.500, perfil aventura. Essa é a venda.

---

## Os quatro tipos de parceria

### 1. Afiliados / OTAs (a base, já coberta)
Booking, Viator, Kiwi, Klook, Wise etc. — via redes ([06](06-modelo-de-monetizacao.md)). Aqui o "parceiro" é o programa de afiliado; a relação é automática (deep-link + tag). **Começa já**, sem negociação.

### 2. Agências de viagem (white-label & revshare)
- **White-label:** a agência usa o nosso motor de decisão + planner com a marca dela. Receita: setup + licença recorrente.
- **Revshare:** a agência manda clientes pro nosso fluxo; dividimos a comissão de afiliado gerada.
- **Co-branded:** roteiros "powered by Mundo Sem Fim" no site da agência.
- *Pitch:* "Você atende 10 clientes/mês na mão; com a gente, 100 — e cada um sai com um roteiro melhor do que você montaria na planilha."

### 3. Influenciadores de viagem (criadores)
- **Roteiro assinado:** o criador monta um roteiro no nosso editor ("Tailândia em 15 dias pela @fulana"), publica, e cada seguidor que executa gera comissão **dividida** criador/plataforma.
- **Link de afiliado compartilhável:** o criador ganha sobre as reservas dos seguidores; nós ganhamos sobre o overhead.
- **Vitrine de criador:** página pública do criador com seus roteiros favoritos.
- *Por que funciona:* hoje o influencer joga o seguidor pra um "link na bio" da Booking e ganha migalha. Com a gente, ele entrega **valor real** (o roteiro pronto) e monetiza melhor — e nós ganhamos distribuição orgânica.

### 4. Secretarias de turismo & DMOs
- **Destaque pago de destino:** "patrocinado" honesto na `/explorar` (claramente rotulado — sem ferir a neutralidade do score).
- **Dados de intenção:** "quantos brasileiros estão planejando ir pra cá neste trimestre, com que orçamento" — inteligência de mercado que secretarias pagam caro (é o que a Atlas Obscura vende como brand partnership, só que quantitativo).
- **Conteúdo oficial:** a secretaria mantém a ficha oficial do destino (eventos, dicas) dentro do nosso `/destino/[slug]`.

---

## A Área de Parceiros (produto B2B)

Uma área self-service (`/parceiros`) onde o parceiro cadastra e gerencia ofertas — espelhando o que o Booking Partner Hub faz, mas pro nosso contexto:

**Funcionalidades:**
- **Cadastro de ofertas:** hotéis, tours, experiências, cupons, links — com deep-link de afiliado/parceiro.
- **Campanhas pagas:** destaque de oferta num destino/época (leilão ou tabela), claramente rotulado.
- **Cupons & deals:** código promocional rastreável que aparece no roteiro do viajante.
- **Painel de performance:** cliques, leads, conversões, comissão gerada, por categoria/destino (UTM).
- **Gestão de afiliados/comissões:** acordo, status de pagamento, relatórios exportáveis (CSV/PDF).
- **API de parceiro:** o parceiro publica inventário/preço via API pra aparecer nativamente (fase avançada).

**Arquitetura (alinhada ao [08](08-arquitetura-tecnica.md)):** tabelas `partners`, `partner_offers`, `partner_campaigns`, `commissions` no Supabase (RLS por parceiro); painel admin pra aprovar ofertas; o `withAffiliate()` resolve o link do parceiro certo no contexto certo.

---

## Marketplace de Consultores de Viagem

Um marketplace de duas pontas (estilo o que falta no mercado):
- **Consultor** monta roteiros premium no nosso editor, publica perfil, define preço do serviço de consultoria.
- **Viajante** contrata o consultor pra um roteiro personalizado; paga pela plataforma.
- **Plataforma** fica com um **take-rate do serviço** (não do estoque — segue neutro) + a comissão de afiliado das reservas que o roteiro gera.
- *Diferencial:* o consultor entrega num produto vivo (recalcula, alerta de visto, custo real) em vez de um PDF morto no e-mail. O cliente continua usando o roteiro durante a viagem.

Isso transforma a plataforma numa **infraestrutura** que outros profissionais usam pra ganhar dinheiro — o que cria um efeito de rede e uma barreira de saída (o consultor não migra porque suas ferramentas e clientes estão aqui).

---

## Playbook de aquisição de parceiros (ordem)

1. **Mês 1:** afiliados via Travelpayouts + Viator/Civitatis/Wise diretos ([06](06-modelo-de-monetizacao.md)). Receita liga sem negociação.
2. **Mês 2-3:** 3-5 **influenciadores BR** de viagem (nicho mochilão/econômico, que casa com a marca) — roteiros assinados. Distribuição orgânica + prova social.
3. **Mês 4-6:** primeiras **agências** pra white-label (piloto com 1-2). Validar o produto B2B.
4. **Mês 6+:** **secretarias de turismo** (começar por destinos-destaque: Peru, Portugal, Tailândia) com dados de intenção. Marketplace de consultores em beta.

## Métricas de parceria
- **Por afiliado:** EPC (earnings per click), taxa de conversão por categoria, comissão/viagem executada.
- **Por parceiro B2B:** ofertas ativas, CTR do destaque, leads gerados, receita.
- **Saúde do funil:** % de roteiros que geram ≥1 clique de afiliado, valor médio de comissão por usuário ativo.

Ver métricas completas no [09 · Roadmap](09-roadmap.md) e [10 · Backlog](10-backlog.md).
