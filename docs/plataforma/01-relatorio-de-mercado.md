# 01 · Relatório de Mercado — travel-tech global (jun/2026)

> Pesquisa multiagente de **37 players** globais de viagem, cada um analisado num framework de 20 pontos (o que faz, público, features, monetização, afiliados, API, dados, pontos fortes/fracos, reclamações, 7 eixos de limitação, oportunidades). Os perfis completos estão em [`players/`](players/); a leitura comparativa em [02 · Matriz](02-matriz-competitiva.md).

## Como ler este relatório
- **[02 · Matriz](02-matriz-competitiva.md)** — uma linha por player, 12 colunas (força, fraqueza, receita, API, afiliados, comissão, integrável, o que precisamos ter).
- **[04 · Gaps](04-gaps-do-mercado.md)** — o que ninguém faz bem (a tese).
- **[06 · Monetização](06-modelo-de-monetizacao.md)** e **[`_dados/tabela-monetizacao.md`](_dados/tabela-monetizacao.md)** — comissões por categoria.
- **[08 · Arquitetura](08-arquitetura-tecnica.md)** e **[`_dados/tabela-integracoes.md`](_dados/tabela-integracoes.md)** — 18 integrações com fallback.

---

## 1. A estrutura do mercado

O mercado de viagem online se organiza em **camadas de execução** — cada player resolve um pedaço da transação — e tem um **vácuo no topo do funil** (a decisão). Mapa:

### Hospedagem
- **OTAs:** [Booking.com](players/booking-com.md) (líder absoluto, ~US$ 186 bi em reservas brutas 2025, take-rate ~14-15%), [Expedia](players/expedia-expedia-group.md), [Agoda](players/agoda.md) (forte na Ásia), [Hostelworld](players/hostelworld.md) (hostels/mochileiro).
- **Metabusca de hotel:** [Trivago](players/trivago.md) (CPC, não vende — compara e redireciona).
- **Alternativa:** [Airbnb](players/airbnb.md) — temporada/experiências; **afiliado morto desde 2021** (relevante pra monetização).

### Voos
- **Metabusca:** [Google Flights](players/google-flights.md) (referência de UX, **não paga afiliado**), [Skyscanner](players/skyscanner.md), [Kayak](players/kayak.md), [Hopper](players/hopper.md) (previsão de preço + fintech, o moat mais defensável do setor).
- **OTA/multimodal:** [Kiwi.com](players/kiwi-com.md) (self-transfer/virtual interlining, melhor CPA de voo: ~3% / ~US$13,50/venda).
- **Infra/API (B2B):** [Amadeus](players/amadeus-amadeus-it-group-amadeus-for-developers.md) (GDS; **Self-Service será descomissionada em 17/07/2026**), [Duffel](players/duffel.md) (NDC moderno, self-serve, o caminho pra virar transacional).

### Transporte terrestre & mobilidade
- [Rome2Rio](players/rome2rio.md) (roteamento door-to-door multimodal — **search-only, não vende**), [Omio](players/omio.md) (trem/ônibus/ferry, vende bilhete, ~6%), [Rentalcars](players/rentalcars-com.md) (carro, ~6%), [Uber Travel](players/uber-travel-travel-mode-uber-reserve-flights-hoteis-via-hopper-e-expedia.md) (transfer/mobilidade).

### Experiências, tours & ingressos
- [GetYourGuide](players/getyourguide.md) (~5-8%, forte na Europa), [Viator](players/viator-tripadvisor.md) (Tripadvisor; ~8%, **afiliado self-service que aprova em minutos**), [Klook](players/klook.md) (Ásia; eSIM paga ~20%), [Civitatis](players/civitatis.md) (mercado hispânico/LatAm; 8-10% + €1/free tour — **fit perfeito pra público BR**).

### Planejamento & organização (os "vizinhos" mais diretos)
- [Wanderlog](players/wanderlog.md) (planejador colaborativo, moat de SEO), [TripIt](players/tripit-sap-concur.md) (organizador de itinerário via e-mail), [Stippl](players/stippl.md) (planejador social), [Roadtrippers](players/roadtrippers.md) (road trip), [Google Travel](players/google-travel-google-flights-google-hotels-e-google-things-to-do-ai-mode.md) (agregador + AI Mode).

### Mapas, conteúdo & reputação
- [Google Maps](players/google-maps.md) (POIs/navegação, base de fato), [Tripadvisor](players/tripadvisor.md) (reviews/Content API), [Lonely Planet](players/lonely-planet.md), [Culture Trip](players/culture-trip-the-culture-trip-theculturetrip-com.md), [Atlas Obscura](players/atlas-obscura.md) (lugares incomuns; US$ 18,3M receita 2025, 65% brand partnerships).

### Gastronomia
- [OpenTable](players/opentable.md) (reservas EUA, ~US$0,25-1/comensal), [TheFork](players/thefork-antiga-lafourchette-eltenedor-thefork-uma-empresa-tripadvisor.md) (Europa), [Michelin Guide](players/michelin-guide-guia-michelin-tablet-hotels.md) (curadoria premium).

### Fintech & utilidades de viagem
- [Wise](players/wise-ex-transferwise.md) (câmbio mid-market, CPA fixo ~£10-50/conta), [Revolut](players/revolut-travel.md) (até ~£500/conta qualificada), [Splitwise](players/splitwise.md) (divisão de despesas — degradou o gratuito, êxodo de usuários).

---

## 2. Padrões de monetização (o que se repete)

1. **Comissão/CPA domina.** Hospedagem 3-7%, experiências 5-10%, voo 1-3% (ou CPC de centavos na metabusca), carro ~6%, restaurante centavos/comensal. Detalhe por categoria em [06](06-modelo-de-monetizacao.md).
2. **Merchant > agency, e crescendo.** Booking já fatura mais no modelo merchant (processa o pagamento) que no agency — controle da transação vale mais que a comissão pura.
3. **Fintech é a margem alta.** Hopper, Wise, Revolut mostram que o dinheiro *de verdade* está em câmbio, "price freeze", seguro e cartão — não na intermediação magra.
4. **Ads/CPC sobre o inventário.** Booking Preferred (+3pp por destaque), Kayak/Trivago CPC, Tripadvisor — o leilão de visibilidade é receita pura.
5. **Conteúdo vira brand partnership.** Atlas Obscura (65% da receita), Culture Trip, Lonely Planet — quando não há transação, o modelo é mídia/publi.

## 3. Padrões de API & afiliados

- **Quem paga afiliado fácil (auto-serviço):** Viator (aprova em minutos), Civitatis, Klook, Omio, e quase todos via **[Travelpayouts](06-modelo-de-monetizacao.md)** (um cadastro destrava Kiwi, Trip.com, GYG, Klook, Omio, Hostelworld, Civitatis).
- **Quem é gated (aprovação/contrato):** Booking Demand API, Expedia Rapid, GYG Partner API, Skyscanner (exige audiência), Amadeus Enterprise, Omio Booking API.
- **Quem NÃO paga tráfego (tratar como custo/exibição):** Google (Flights/Hotels/Maps), Rome2Rio, Amadeus, Duffel, Airbnb (afiliado encerrado). Ver a regra em [06](06-modelo-de-monetizacao.md).
- **O "Bookinggeddon" (mai/2025):** a Booking encerrou milhares de afiliados pequenos com 30 dias de aviso — lição de arquitetura: **entrar pela rede certa (Awin/CJ/Travelpayouts), nunca depender de um único programa.**

## 4. A grande lacuna: ninguém decide *com* o viajante

O achado central da pesquisa (detalhado em [04](04-gaps-do-mercado.md)): os 37 players competem em **execução de transação** e são quase todos cegos à **decisão**. Eles assumem que você já sabe pra onde vai e só te ajudam a comprar mais barato. Resultado: o viajante abre uma planilha por fora pra somar o custo total, costura 5 apps pra montar a viagem, e decide o destino "no escuro". 

Isso não é acidente — é **estrutural**: quem vive de take-rate de estoque **não pode** dar conselho neutro (recomendaria o que dá mais comissão, não o melhor). Por isso a camada de decisão neutra é um espaço defensável: os incumbentes não a ocupam sem canibalizar a própria receita.

## 5. Conclusão

O Mundo Sem Fim não compete *com* as OTAs — ele se posiciona **acima** delas, como a camada de inteligência de decisão (custo total real, decisão de destino, roteiro vivo, orçamento prescritivo) que captura a **intenção de compra no momento da decisão** e a entrega ao fornecedor que paga melhor comissão. Vende assinatura pro viajante (que economiza tempo, dinheiro e evita erro) e comissão/lead pro parceiro (que recebe tráfego qualificadíssimo). Esta é a tese desenvolvida em [05 · Proposta de Produto](05-proposta-de-produto.md), [06 · Monetização](06-modelo-de-monetizacao.md) e [07 · Parceiros](07-estrategia-de-parceiros.md).
