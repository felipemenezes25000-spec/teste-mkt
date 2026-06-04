# 12 · Critérios de Qualidade

> A régua que mede cada entrega. Se um item não passa aqui, não está pronto.

## As duas réguas finais (acima de tudo)

> **Régua do viajante:** *"Eu pagaria por isso porque economiza tempo, dinheiro e evita erro na viagem."*
>
> **Régua do parceiro:** *"Eu quero integrar porque gera intenção real de compra, tráfego qualificado e conversão."*

Toda feature, antes de sair, responde: *isso aproxima ou afasta o produto dessas duas frases?* Se não aproxima nenhuma, reavalie a prioridade.

---

## Qualidade de engenharia

| Critério | O que significa aqui | Como verificar |
|---|---|---|
| **Código limpo** | Estilo da casa: nomes/idioma/densidade de comentário casados com os vizinhos; comentário explica POR QUÊ em pt-BR | revisão; ler 2-3 arquivos vizinhos antes |
| **Arquitetura escalável** | Lógica pura no `_engine`, serviços no `_lib`, UI no `_ui`/`_components`; efeitos nas bordas | a feature encaixa sem gambiarra |
| **Componentes reutilizáveis** | Reusa Button/Badge/Modal/Tabs/Gate; não recria | sem duplicação de UI |
| **Design system premium** | Tokens (nunca hex cru), dark mode automático, microinterações | `[data-theme=dark]` ok; contraste AA |
| **Responsividade** | Mobile-first; testado em 390px e desktop | navegador real |
| **Testes** | Função pura nova = `.test.js` em `_engine`; casos de borda | `npx vitest run` verde (relate nº) |
| **Mock de APIs** | Provider mock determinístico quando não há chave (ex.: `flights.js`) | feature funciona sem env |
| **Camada de providers (seam)** | Integração entra trocando implementação, sem tocar UI | `buscarVoos`/`withAffiliate`/`chamarLLM` |
| **Cache** | Fetch externo cacheado (Next `revalidate`, mapas in-memory) | `/destino` SSG; câmbio/lugar cacheados |
| **Logs** | `console.warn`/erro em pontos críticos, estruturável por nível | rotas de API |
| **Observabilidade** | Funil instrumentado com eventos/UTM | eventos disparam |
| **Tratamento de erro** | Timeout + try/catch + mensagem clara (401/429/503) | nenhum erro derruba a tela |
| **Fallback de dados** | Degradação segura: cache/seed/estimativa; nunca quebra | desligar a rede → ainda usa |
| **Segurança** | Segredos só no servidor; trava de plano server-side; IA com login+cota; webhook HMAC | curl anônimo não fura |
| **LGPD/GDPR** | Dados mínimos; sync opt-in; export/delete; agregados anonimizados; consentimento | fluxo de conta |
| **SEO** | Metadata + SSG/revalidate nas rotas públicas; JSON-LD onde fizer sentido | `next build` mostra ○/●; lighthouse |
| **Analytics & event tracking** | Cada etapa do funil é um evento; "reservar" carrega categoria/UTM | dashboard de conversão |
| **Funil de conversão** | `explorar→destino→comparar→decisao→planejar→roteiro→reservar→assinar` medido | taxa por etapa |
| **Painel admin** | Moderação de ofertas, assinaturas, saúde de integrações | acesso restrito |
| **Painel de parceiros** | Performance por oferta/campanha, self-service | [07](07-estrategia-de-parceiros.md) |
| **Gestão de afiliados/comissões** | Acordo, status de pagamento, atribuição por UTM | tabela `commissions` |
| **Exportação de relatórios** | CSV/PDF de performance | botão de export |

## Qualidade de produto

- **Honestidade de dados:** toda estimativa é rotulada como estimativa, com disclaimer "confira na fonte oficial" e campo editável. Datas de revisão visíveis (ex.: visto revisado jun/2026).
- **Neutralidade:** recomendação otimiza pela adequação ao viajante, não pela comissão. "Patrocinado" é sempre rotulado.
- **Custo honesto:** o número que aparece é o número que se paga — sem fee escondido (é o nosso diferencial estrutural, [gap 5](04-gaps-do-mercado.md)).
- **Continuidade:** tudo escreve no mesmo plano; nada de abas que não conversam.
- **Tempo até valor:** o usuário vê valor em <60s (a `/decisao` já mostra score+oportunidades de uma viagem-exemplo antes de qualquer cadastro).

## Definição de Pronto (DoD) — checklist por entrega

```
[ ] Lógica nova é função pura no _engine + .test.js (TDD)
[ ] npx vitest run → todos verdes (nº relatado)
[ ] npx next build → sem erro (rotas relatadas)
[ ] Integração externa tem fallback / no-op seguro sem a chave
[ ] Feature paga tem <Gate> + trava server-side conferida
[ ] UI responsiva (390px+) + dark mode + acessível (aria/foco/teclado)
[ ] Verificada no NAVEGADOR (Playwright) com console limpo — evidência descrita
[ ] Segredos fora do git; .env.example atualizado
[ ] Monetização: UTM/atribuição instrumentada antes de divulgar
[ ] Copy em pt-BR, tom "mão na roda", honesto
[ ] Passa nas duas réguas finais (viajante / parceiro)
```

## Anti-padrões (rejeitar)
- ❌ Lógica de cálculo dentro de componente React (vai pro `_engine`, com teste).
- ❌ Hex cru de cor (usar token; senão quebra o dark mode).
- ❌ Fetch sem timeout/fallback (degrada → nunca quebra).
- ❌ Segredo no client ou no commit.
- ❌ Feature paga travada só no client (a verdade é server-side).
- ❌ "Deve funcionar" sem rodar — **evidência sempre antes da afirmação**.
- ❌ Recomendar pelo que paga mais comissão em vez do que é melhor pro viajante.
- ❌ Esconder custo/fee pra parecer mais barato.

## Métrica-norte
**% de roteiros montados que o usuário considera "bom o suficiente pra eu pagar e executar"** — medida indiretamente por: free→paid, % de roteiros com ≥1 clique de afiliado, retenção 30d, NPS. Se essas sobem, as duas réguas finais estão sendo cumpridas.
