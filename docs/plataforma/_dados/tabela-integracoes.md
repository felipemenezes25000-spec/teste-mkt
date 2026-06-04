# Tabela de Integrações (dados brutos da pesquisa)

> Apoio ao [08 · Arquitetura Técnica](../08-arquitetura-tecnica.md). 18 integrações com tipo de dado, uso, comissão, limitações, custo, prioridade, complexidade e fallback.

## Ordem recomendada de implementação
FASE 0 (ja em producao, manter e endurecer): Wikidata (places.js) + Wikipedia REST (wiki.js) como fonte primaria de POI, descricao e credito de imagem — base do /destino sem custo, com timeout+fallback ja prontos.,FASE 1 (monetizacao imediata, baixo esforco — formalizar afiliados sobre os deep-links que JA existem em links.js): cadastrar nas redes (Travelpayouts/Awin/CJ/Partnerize) e trocar URLs cruas por links de afiliado de Booking, Viator e GetYourGuide. Receita comeca a fluir sem nova engenharia pesada.,FASE 2 (enriquecimento de conteudo): Google Places API (server, com cap de custo) + OpenStreetMap/Overpass como fallback aberto, para horarios/faixa de preco/geocoding/autocomplete onde Wikidata nao cobre.,FASE 3 (camada de confianca): Tripadvisor Content API para notas/ranking/reviews na ficha de destino e atracoes (respeitando termos B2C e atribuicao).,FASE 4 (expandir cobertura de afiliados de experiencia e hospedagem): Klook Affiliate (Asia) e Expedia (afiliado/Vrbo) como provedores adicionais de experiencias e alugueis, redundando Booking/Viator/GYG por regiao.,FASE 5 (camada de voos real, ainda como redirect monetizado): plugar Skyscanner (Affiliates Link API + Indicative Prices) no SEAM buscarVoos() de flights.js, substituindo a faixa por distancia por preco real; afiliado de voo via Travelpayouts/Aviasales como caminho de aprovacao mais facil. Kiwi Tequila como alternativa multimodal/self-transfer (por convite).,FASE 6 (mobilidade terrestre e cambio): Rome2Rio (Search API/White-Label, ja com deep-link) para 'como chegar' multimodal e Omio (deep-link -> Booking API) para venda de trem/onibus/ferry; Wise/Revolut como CTA de afiliado de cambio reforcando o budget mode (open.er-api.com continua a fonte base).,FASE 7 (gastronomia premium, nice-to-have): OpenTable/TheFork via deep-link/afiliado para reserva de mesa, com Google Places como catalogo de restaurantes onde a API de parceiro nao for aprovada.,FUTURO/CONDICIONAL (so se a estrategia virar transacional/merchant, fora do modelo atual de assinatura+afiliado): Duffel API para vender voo (e Stays/Cars) dentro do app com checkout white-label e Duffel Payments. NAO adotar Amadeus Self-Service como base por causa do descomissionamento em 17/07/2026 — preferir Duffel; Amadeus Enterprise so via consolidador/parceiro, exige IATA/ARC.

## Detalhe por integração

### Tripadvisor Content API  ·  prioridade P1 · complexidade media
| Campo | Conteúdo |
|---|---|
| Tipo de dado | Metadados de POI (nome, endereco, coordenadas, categoria), nota agregada, sub-notas, ranking, premios Travelers' Choice, link de reviews e fotos. |
| Uso no app | Enriquecer /destino/[slug] e os cards de atracao com nota/ranking confiavel ao lado dos dados de Wikidata/Wikipedia; selo de reputacao em restaurantes e atracoes. Camada de confianca ('todo mundo confia no TripAdvisor') que aumenta percepcao premium. |
| Modelo de comissão | Sem comissao na Content API em si (e gratuita). Receita vem por tabela: redirecionar reviews/hoteis para TripAdvisor via deep-link de afiliado (CJ/Awin) e via Viator (que e do mesmo grupo). |
| Limitações | SO uso B2C/consumer-facing com fim de aquisicao de trafego; proibido B2B/comercial puro. Limites de chamadas, restricoes de exibicao e de caching (precisa mostrar logo/atribuicao TripAdvisor e respeitar TTL). Em ingles majoritariamente. |
| Custo | Gratuita dentro da cota; excedente/uso fora dos termos pode ser cortado. Custo real = engenharia de mapeamento de location_id + cache. |
| Fallback | Manter a stack atual (Wikidata + Wikipedia REST) como fonte primaria de POI/descricao e usar nota agregada do Google Places quando a chave server existir; sem nota de reviews, exibir so descricao editorial + selo UNESCO/Patrimonio do Wikidata. Reviews viram deep-link 'Ver no TripAdvisor'. |

### Google Places API  ·  prioridade P1 · complexidade media
| Campo | Conteúdo |
|---|---|
| Tipo de dado | POIs georreferenciados com place_id estavel, nota media, numero de reviews, fotos, faixa de preco ($-$$$$), horarios, telefone, site, categoria, autocomplete e geocoding. |
| Uso no app | Server-side (GOOGLE_PLACES_API_KEY ja previsto no .env) para preencher ficha de cidade/atracao quando Wikidata nao cobre, autocomplete de origem/destino no planner e /voos, geocoding de cidades para o mapa real (worldGeo.js). Place Details para horarios/faixa de preco em restaurantes e atracoes. |
| Modelo de comissão | Nenhum (API paga por chamada, nao e afiliado). Pura fonte de dados/UX. |
| Limitações | CRITICO: proibido cachear conteudo de POI alem do place_id; lat/long so por 30 dias; proibido criar produto 'substancialmente similar' a um mapa/Google Travel. Custo por chamada escala rapido (Place Details US$5-20/1K, Autocomplete ~US$2,83/1K). |
| Custo | Pago por SKU com creditos mensais; precisa de billing ativo do Felipe e restricao de chave (referrer no client, API+IP no server). Risco de custo se exposto sem rate-limit. |
| Fallback | OpenStreetMap/Overpass + Nominatim (geocoding) para POIs/coordenadas sem custo nem trava de cache, e Wikidata/Wikipedia para descricao/foto. Faixa de preco/horarios ficam ausentes (degradacao suave). O app ja roda 100% sem a chave Places hoje. |

### OpenStreetMap/Overpass  ·  prioridade P1 · complexidade media
| Campo | Conteúdo |
|---|---|
| Tipo de dado | POIs com tags (turismo, gastronomia, transporte), coordenadas, nomes multilingues; via Nominatim tambem geocoding/reverse-geocoding. Dados abertos, cacheaveis sem trava. |
| Uso no app | Fallback aberto e gratuito do Google Places: enriquecer atracoes/restaurantes e geocoding de cidades no servidor, com liberdade total de cache (ao contrario do Google). Camada de mapa via tiles OSM no RouteMap quando nao usar tiles Google. |
| Modelo de comissão | Nenhum (dados abertos ODbL). Sem receita; reduz custo de Places. |
| Limitações | Overpass publico tem rate-limit agressivo e instabilidade; Nominatim exige User-Agent identificavel, max ~1 req/s e proibe uso pesado no endpoint publico (precisa self-host para escala). Cobertura/qualidade desigual (otima na Europa, irregular em areas remotas). Licenca ODbL exige atribuicao e share-alike de dados derivados. |
| Custo | Gratuito no endpoint publico; em escala, custo de hospedar instancia Overpass/Nominatim propria. |
| Fallback | Se Overpass/Nominatim publico falhar ou throttlar: cair para Wikidata SPARQL (que ja roda) para POIs e para a tabela estatica de coords das ORIGENS/cidades de referencia ja embutida no app. Geocoding indisponivel = usar coords pre-cadastradas em data.js/worldGeo.js. |

### Wikidata  ·  prioridade P0 · complexidade baixa
| Campo | Conteúdo |
|---|---|
| Tipo de dado | Entidades estruturadas: QID estavel por pais/cidade/atracao, classe (atracao turistica Q570116, Patrimonio UNESCO), imagem (P18), coordenadas, descricoes multilingues, relacoes. |
| Uso no app | JA EM PRODUCAO (app/_lib/places.js): SPARQL puxa pontos turisticos reais por QID do pais para /destino/[slug] (filtra atracao turistica + Patrimonio Mundial, com imagem, cacheado 1 dia, timeout 9s, degrada para []). Base do catalogo de atracoes sem custo nem trava de cache. |
| Modelo de comissão | Nenhum (CC0, dominio publico). Fonte de dados pura, zero custo, zero atribuicao obrigatoria. |
| Limitações | Endpoint SPARQL publico tem limite de tempo/complexidade por query e pode dar timeout em horarios de pico; cobertura depende da riqueza da entidade (cidades pequenas tem poucas atracoes com P18). Exige User-Agent identificavel. |
| Custo | Gratuito. Custo = manter o mapa code->QID (ja existe em destinos.js) e tuning das queries SPARQL. |
| Fallback | Ja implementado: try/catch + AbortSignal.timeout retornam [] sem quebrar render. Sem Wikidata, /destino cai para resumo da Wikipedia + seed de vitrine; manter cache do Next (revalidate) servindo a ultima resposta boa. Considerar mirror SPARQL alternativo (QLever) se o oficial degradar. |

### Wikipedia REST  ·  prioridade P0 · complexidade baixa
| Campo | Conteúdo |
|---|---|
| Tipo de dado | Resumo/extrato editorial de destino e atracao (pt), titulo, imagem original/thumbnail, URL canonica; via Commons API tambem autor + licenca da imagem. |
| Uso no app | JA EM PRODUCAO (app/_lib/wiki.js): resumoWiki() alimenta a descricao de cada destino e creditoImagem() resolve autor/licenca do Commons (atende a exigencia de fonte/autoria/licenca do spec). Texto base das fichas e imagem de capa creditada. |
| Modelo de comissão | Nenhum (conteudo CC BY-SA / dominio publico conforme arquivo). Fonte editorial + credito de imagem; zero custo. |
| Limitações | Precisa exibir atribuicao/licenca corretamente (ja tratado). Resumo pode ser generico ou vir como desambiguacao (ja filtrado retornando null). Qualidade do extrato em pt varia por destino. |
| Custo | Gratuito. Custo = engenharia ja paga. |
| Fallback | Ja implementado: retorna null em falha/timeout sem quebrar; nesse caso usar so REST Countries (fatos) + Wikidata. Para credito de imagem ausente, esconder a foto ou marcar 'fonte: Wikimedia Commons' generico. Cache do Next mantem ultima resposta. |

### Booking Affiliate  ·  prioridade P0 · complexidade baixa
| Campo | Conteúdo |
|---|---|
| Tipo de dado | Via deep-link de afiliado: redireciona para busca de hospedagem ja filtrada (cidade+datas). Via Demand API (gated): inventario em tempo real, preco, disponibilidade, tipo de quarto, politica de cancelamento, fotos, geo, reviews verificadas, gestao de pedidos. |
| Uso no app | FASE 1 (ja seamado em _lib/links.js: linkBooking): botao 'Hoteis & hostels' em /destino e no roteiro abrindo Booking pre-filtrado, trocando a URL crua por link de afiliado (Awin/CJ/Travelpayouts) com tag. FASE 2 (futuro): Demand API para mostrar preco/disponibilidade real na propria UI — so se virar parceiro gerenciado. |
| Modelo de comissão | Afiliado last-click via rede (tipicamente 25-40% da comissao que a Booking recebe do hotel, ~4% do valor da estadia liquido) com cookie de atribuicao. Demand API tem modelo de parceiro gerenciado negociado. |
| Limitações | Demand API e GATED (exige aprovacao como Managed Affiliate Partner, nao self-serve; risco de descontinuacao de parceiro). Deep-link de afiliado e imediato, mas comissao so se a rede aprovar o publisher. Nao e GDS classico. |
| Custo | Deep-link: gratuito (so cadastro na rede de afiliados). Demand API: sem custo de licenca, mas custo de onboarding/manutencao e dependencia de aprovacao. |
| Fallback | Ja existe: deep-link cru (sem tag) para Booking continua funcionando hoje. Se a conta de afiliado nao sair, manter o redirect sem monetizar e complementar hospedagem com Hostelworld/Agoda/Expedia deep-links. Demand API indisponivel = nunca mostrar preco na UI, so redirecionar. |

### Viator Affiliate API  ·  prioridade P1 · complexidade media
| Campo | Conteúdo |
|---|---|
| Tipo de dado | Catalogo completo de experiencias/tours/ingressos por destino (titulo, descricao, fotos, categorias, duracao, idiomas), preco e disponibilidade em tempo real (Full Access), reviews/notas TripAdvisor, politica de cancelamento, geo/ponto de encontro, deep-links e widgets, IDs estaveis para mapeamento. |
| Uso no app | FASE 1 (seamado: linkViator em links.js): botao 'Tours & experiencias' por cidade com deep-link de afiliado (cookie ~8%). FASE 2: Viator Partner API nivel Full para listar experiencias REAIS com preco/foto dentro de /destino e do /roteiro IA (a IA sugere passeios e o card ja traz preco+link), redirecionando o checkout para viator.com. E a integracao de experiencias mais madura do setor. |
| Modelo de comissão | Afiliado ~8% last-click (venda ocorre em viator.com via deep-link). Variante Merchant (merchant of record, reserva dentro do app) existe mas exige certificacao — fora de escopo para B2C por assinatura agora. |
| Limitações | Afiliado puro nao reserva no app (so redireciona). Full Access (preco/disponibilidade em tempo real) requer aprovacao comercial. Cobre so experiencias (nao voos/hotel). Rate limits por parceiro. |
| Custo | Deep-link/afiliado: gratuito via rede (Travelpayouts/Awin) ou programa direto. Partner API Full: sem licenca, mas aprovacao + engenharia de catalogo. |
| Fallback | Ja existe: deep-link de busca Viator funciona sem API. Sem Full Access, nao mostrar preco — so titulo/redirect. Se Viator indisponivel, usar GetYourGuide (mesma funcao) e Klook (forte na Asia) como provedores alternativos de experiencias via deep-link. |

### GetYourGuide Partner API  ·  prioridade P1 · complexidade media
| Campo | Conteúdo |
|---|---|
| Tipo de dado | Catalogo de tours/atividades/ingressos por destino, disponibilidade por data/horario e categoria de ticket, precos de varejo e deals, politica de cancelamento, duracao, reviews/nota, reserva/voucher/status (Partner API), deep-links e widgets, geo/ponto de encontro. |
| Uso no app | FASE 1 (seamado: linkGetYourGuide): botao 'Passeios & ingressos' com deep-link/widget de afiliado (~5-8% last-click) em /destino e no roteiro. FASE 2: Partner API para puxar catalogo+disponibilidade e exibir cards de atividade com preco real, especialmente para destinos europeus (forca da GYG). |
| Modelo de comissão | Afiliado ~5-8% last-click via rede (Awin/Travelpayouts) com deep-link/widget. Partner API com checkout/booking exige aprovacao comercial. |
| Limitações | Partner API completa (catalogo+booking) e gated por aprovacao comercial; rate limit ~1000 req/h. Afiliado menor fica restrito a deep-link/widget. So experiencias (nao voo/hotel). |
| Custo | Deep-link/widget: gratuito via rede. Partner API: sem licenca, mas onboarding comercial + engenharia. |
| Fallback | Ja existe: deep-link de busca GYG funciona sem API. Usar Viator como provedor primario de experiencias e GYG como segundo (ou vice-versa por regiao). Sem nenhuma API de experiencia, manter so deep-links agregados (GYG+Viator+Klook+Civitatis) na ficha do destino. |

### Klook Affiliate  ·  prioridade P2 · complexidade baixa
| Campo | Conteúdo |
|---|---|
| Tipo de dado | Catalogo global de experiencias (preco, descricao, fotos, politica de cancelamento), disponibilidade real-time por slot, precificacao dinamica por viajante/add-ons, reviews, voucher/QR, forte profundidade na ASIA (atracoes, transporte local, passes, eSIM), deep-links rastreaveis com UTM. |
| Uso no app | Deep-link de afiliado (Ecomobi/Travelpayouts) como provedor de experiencias para destinos asiaticos (Tailandia, Vietna, Indonesia, Japao) — onde Viator/GYG sao mais fracos. Botao adicional 'Passeios na Asia' / transporte local / eSIM na ficha do destino e no roteiro. Complementa a vitrine de destaques que ja inclui TH/ID/VN. |
| Modelo de comissão | Afiliado via rede (Ecomobi/Travelpayouts), comissao por venda com tracking UTM/deep-link. Sem merchant no app. |
| Limitações | API de catalogo 1P (Klook OpenAPI) e de parceiro/merchant com aprovacao e onboarding — nao self-service. Para afiliado pequeno, so deep-link/rede. Cobertura ocidental menor que Viator/GYG. |
| Custo | Deep-link/afiliado: gratuito via rede. API de parceiro: aprovacao comercial. |
| Fallback | Usar Viator/GetYourGuide como provedores primarios de experiencias em todo o mundo; Klook so adiciona cobertura/comissao na Asia. Sem Klook, o destino asiatico ainda tem Viator/GYG deep-link. eSIM/transporte local viram link generico se a conta Klook nao sair. |

### Expedia Rapid API  ·  prioridade P2 · complexidade alta
| Campo | Conteúdo |
|---|---|
| Tipo de dado | Inventario de hoteis/alugueis (Vrbo) com preco em tempo real, disponibilidade, fotos, amenidades, politicas de cancelamento, geo, ratings/reviews, net rates (B2B), inventario de carros (+47k fornecedores) e atividades. Relatorios de afiliado via Partnerize. |
| Uso no app | FASE 1: deep-link de afiliado (Expedia via Partnerize/Travelpayouts) como segunda opcao de hospedagem ao lado de Booking em /destino. FASE 2 (avancado): Rapid API B2B para mostrar preco/quarto real na propria UI e cobrir alugueis Vrbo (casas inteiras) — alternativa ao Airbnb, que NAO tem API. |
| Modelo de comissão | Dois modelos: 'Expedia Collect' (Expedia cobra e paga comissao ao parceiro) e 'Partner Collect' (parceiro cobra, paga net rate, fica com markup). Afiliado/deeplink via Partnerize com comissao last-click. |
| Limitações | Rapid API e gated (contrato/onboarding de parceiro, nao chave instantanea). Voo NAO tem API de distribuicao aberta — Expedia cobre so hotel/carro/atividade/Vrbo. Modelo merchant exige assumir cobranca/risco. |
| Custo | Deep-link: gratuito via rede. Rapid API: sem licenca, mas contrato de parceiro + engenharia significativa de booking. |
| Fallback | Hospedagem ja coberta por Booking deep-link (P0). Expedia entra so como redundancia de afiliado e, no maximo futuro, como fonte de alugueis Vrbo para suprir a falta de API do Airbnb. Sem Rapid API, nunca mostrar preco — so redirecionar. Carros podem ir via deep-link Rentalcars/Booking Cars. |

### Skyscanner (Flights API/affiliate)  ·  prioridade P2 · complexidade media
| Campo | Conteúdo |
|---|---|
| Tipo de dado | Tarifas de voo em tempo real (Live Prices) de 1.200+ parceiros, precos indicativos/cacheados por rota, itinerarios completos (escalas, multi-trecho, datas flexiveis), autosuggest/geo/carriers, tendencia de preco, deep-links de redirect (Affiliates Link API). Tambem hoteis e carros. |
| Uso no app | Camada de VOOS com comissao via redirect: na tela /voos (hoje provider mock em _lib/flights.js), usar Affiliates Link API para gerar deep-link monetizado para a aerea/OTA, e Indicative Prices para mostrar faixa de preco real por rota (substituindo a estimativa por distancia). Plugar no SEAM buscarVoos() ja existente. Reserva continua fora do app (so redirect). |
| Modelo de comissão | Afiliado/referral: comissao por redirect qualificado via Affiliates Link API (CPA/CPC conforme acordo). NAO permite booking direto no app — so deep-link. |
| Limitações | API SO para parceiros (application-only, aprovacao caso a caso, 'empresa estabelecida com grande audiencia', ~2 semanas). Sem reserva no checkout do parceiro; sem NDC/GDS. Dados mistos realtime+cache. |
| Custo | Sem licenca; custo = aprovacao como parceiro (barreira de audiencia) + engenharia. Travelpayouts (Aviasales) e alternativa de afiliado de voo mais facil de aprovar para publishers pequenos. |
| Fallback | Manter o provider MOCK deterministico de voos (ja existe e da faixa por distancia) ate ter aprovacao. Se Skyscanner negar acesso, usar Travelpayouts/Aviasales affiliate (mais acessivel) para faixa de preco+deep-link, ou Kiwi Tequila. Google Flights so como link externo cru (linkGoogleFlights ja existe). |

### Amadeus Self-Service API  ·  prioridade P3 · complexidade alta
| Campo | Conteúdo |
|---|---|
| Tipo de dado | Inventario/disponibilidade de voos de 400+ cias (full-content + NDC), precificacao detalhada (fare rules, branded fares, ancillaries), hotel (incl. EPS) e carros, dados de inspiracao/POI/seguranca, predicoes ML (atraso, previsao de preco), e (so Enterprise+IATA/ARC) emissao real de bilhetes. |
| Uso no app | Provider de VOOS real por tras do SEAM buscarVoos(): Flight Offers Search para precos/itinerarios reais na tela /voos, e Flight Inspiration/Cheapest Date para 'para onde viajar com X de orcamento' (casa com o budget mode). Predicao de preco para o alerta de preco. Booking real so se um dia houver acreditacao IATA — improvavel para B2C solo. |
| Modelo de comissão | Nenhum afiliado nativo (e GDS/API tecnica, pay-as-you-go no Self-Service). Monetizacao indireta: usar dados para enriquecer e redirecionar o booking a um parceiro que pague comissao (Duffel/OTA). |
| Limitações | CRITICO: o tier Self-Service SERA DESCOMISSIONADO em 17/07/2026 (registro pausado antes; chaves desativadas na data) — nao construir dependencia nova sobre ele agora. Enterprise exige NDA + acreditacao + IATA/ARC (semanas a meses). Nao e API de afiliado. |
| Custo | Self-Service: sandbox gratuito + pay-as-you-go por chamada (mas com prazo de morte). Enterprise: contrato/NDA, custo alto, IATA/ARC. |
| Fallback | NAO adotar como base por causa do EOL de jul/2026. Preferir Duffel (moderno, self-serve, booking + pagamento) como provider transacional de voo e Travelpayouts/Skyscanner para afiliado. Manter mock como default. Usar Amadeus so se via consolidador/parceiro white-label, nunca contrato direto no inicio. |

### Duffel API  ·  prioridade P2 · complexidade alta
| Campo | Conteúdo |
|---|---|
| Tipo de dado | Ofertas de voo em tempo real (NDC/GDS/LCC, 300-380+ cias) com fare brands, bagagem, fare rules, mapa de assento, ancillaries; hospedagem (~1.6M propriedades); carros (~40 fornecedores); ciclo completo de order (emissao PNR/ticket, mudanca, cancelamento, reembolso) e Payments (3DS, antifraude, settlement). |
| Uso no app | O caminho REAL para venda de voo DENTRO do app, se um dia formos transacional: plugar no SEAM buscarVoos() para busca com preco real e, via Duffel Links/Elements, oferecer checkout white-label de voo sem virar IATA. Tambem cobre Stays (hotel) e Cars como upsell. E a API transacional mais profunda e moderna entre os players — substitui Amadeus Self-Service (que morre em 2026). |
| Modelo de comissão | Merchant/transacional: o app vende a tarifa (markup proprio sobre a oferta) e processa via Duffel Payments — margem por bilhete, nao comissao de afiliado. Tier pay-as-you-go self-serve + enterprise. |
| Limitações | Nao e afiliado de leitura: exige conta, fluxo de pagamento, conformidade (3DS/antifraude), suporte a mudanca/reembolso e responsabilidade de merchant. Complexidade operacional alta (pos-venda de voo e dificil). Custo de transacao/pagamento. |
| Custo | Self-serve pay-as-you-go (sem licenca fixa) + taxas de Payments por transacao. Custo principal e operacional (suporte, reembolsos, fraude). |
| Fallback | Enquanto nao houver operacao para suportar pos-venda de voo, NAO assumir merchant: usar Skyscanner/Travelpayouts (afiliado/redirect) para monetizar voo sem risco, e manter mock como default na /voos. Duffel vira P1 so quando a estrategia mudar de 'redirect' para 'vender voo'. Stays Duffel e redundante com Booking deep-link. |

### Kiwi Tequila API  ·  prioridade P3 · complexidade media
| Campo | Conteúdo |
|---|---|
| Tipo de dado | Tarifas/disponibilidade de voos incl. combinacoes self-transfer (inexistentes em GDS), opcoes multimodais ground+air (trem/onibus), duracao/escalas/viabilidade de conexao, ancillaries por reserva, deep-links e widgets de afiliado, inventario de 800+ transportadoras. |
| Uso no app | Provider alternativo de VOOS no SEAM buscarVoos(), com diferencial de rotas self-transfer baratas e multimodal — bom para o publico mochileiro/economico do app (combina com budget mode e tiers 'mochila'). Deep-link/widget de afiliado para monetizar o redirect de voo. |
| Modelo de comissão | Afiliado via rede (Travelpayouts/Awin) com deep-link/widget — comissao por venda/redirect. API Tequila profunda tem modelo de parceiro. |
| Limitações | Desde mai/2024 novos parceiros so entram POR CONVITE (alinhado a metas estrategicas da Kiwi) — acesso a API profunda nao e garantido. Tier free e so sandbox/teste; producao/comercial exige aprovacao. Self-transfer tem risco de perda de conexao (responsabilidade do viajante). |
| Custo | Sandbox gratuito; producao por aprovacao/convite. Afiliado via rede e gratuito de aderir. |
| Fallback | Como a API profunda e por convite, priorizar o afiliado Kiwi via Travelpayouts (deep-link) em vez de integracao Tequila. Se indisponivel, Skyscanner cobre faixa+redirect e Rome2Rio cobre o multimodal. Manter mock como base. Self-transfer some sem Kiwi — usar Rome2Rio/Omio para terrestre. |

### Omio API  ·  prioridade P2 · complexidade media
| Campo | Conteúdo |
|---|---|
| Tipo de dado | Rotas A-a-B multimodais (trem/onibus/ferry/voo) de 3.000+ operadores, com horarios, duracao, baldeacoes, preco por operador/classe, disponibilidade e compra/emissao real de bilhete, add-ons e regras (assento/bagagem/flex). |
| Uso no app | Camada de TRANSPORTE TERRESTRE entre cidades do roteiro (trem/onibus/ferry), especialmente na Europa e Asia — preenche o 'como ir de A pra B' que voo nao cobre. FASE 1: deep-link/affiliate-API para redirecionar a compra. FASE 2: Booking API/white-label para emitir bilhete no app (merchant of record). Complementa Rome2Rio (que so roteia, nao vende). |
| Modelo de comissão | Dois caminhos: deeplink/affiliate-API (monetiza redirect sem assumir checkout) OU Booking API/white-label (parceiro vira merchant of record, fica com margem/markup do bilhete). |
| Limitações | Acesso e B2B sob contrato, nao self-service publico. Booking API (emissao no app) traz responsabilidade de merchant e pos-venda. Cobertura forte em Europa; menor em outras regioes. |
| Custo | Sem licenca publica listada; custo = contrato B2B + engenharia. Afiliado/deeplink e o caminho barato. |
| Fallback | Usar Rome2Rio (ou seu deep-link) para MOSTRAR as opcoes multimodais e o 'como chegar', e redirecionar a compra do trecho terrestre para o site do operador/Omio via deep-link generico. Sem Omio, manter o link Rome2Rio ja seamado (linkRome2Rio em links.js) e deep-links de operadores nacionais (Trainline/Flixbus). |

### Rome2Rio (ou alternativa de rotas)  ·  prioridade P2 · complexidade media
| Campo | Conteúdo |
|---|---|
| Tipo de dado | Rotas multimodais door-to-door entre quaisquer dois pontos (voo+trem+onibus+ferry+carro+caminhada num so resultado), tempo/distancia/faixa de preco por trecho e total, operadores e estacoes/terminais, cobertura de transporte terrestre/regional, deep-links de reserva, frequencia/horarios aproximados. |
| Uso no app | Responder 'como chegar / como circular' em /destino e ENTRE paradas do /roteiro IA (a forca exclusiva e o door-to-door multimodal que Skyscanner/Google ignoram). FASE 1: deep-link de afiliado (linkRome2Rio JA seamado em links.js). FASE 2: Search API/White-Label para renderizar as opcoes de rota com tempo/preco dentro do app. |
| Modelo de comissão | Deep-link de afiliado (monetizavel, simples) com comissao por redirect aos parceiros de transporte/hotel/carro. Partner API/White-Label e paga (search-only, sem booking via API). |
| Limitações | SEARCH/ROUTING ONLY — explicitamente sem capacidade de booking (so retorna opcoes + deep-links). Partner API e paga por volume, sob contrato, sem tier publico gratuito self-service. Precos sao faixas estimadas, nao tarifas firmes. |
| Custo | Deep-link: gratuito. Partner API/White-Label: paga por volume de requisicoes + grau de customizacao (contrato). |
| Fallback | Ja existe deep-link (linkRome2Rio) que funciona sem API — manter como minimo viavel. Sem a Search API, calcular distancia/tempo aproximado com a Distance Matrix do Google (ou Haversine ja usado no app) e deep-linkar Rome2Rio para o detalhe. Omio cobre a venda do trecho terrestre; Kiwi cobre multimodal com voo. |

### Wise/Revolut (cambio)  ·  prioridade P2 · complexidade baixa
| Campo | Conteúdo |
|---|---|
| Tipo de dado | Wise: taxas de cambio ao vivo mid-market (GET /v1/rates) e cotacoes com fee/prazo (POST /v2/quotes); custo real de gastar/sacar no exterior; comparativo Wise vs banco. Revolut: cambio em tempo real, planos/RevPoints, Revolut Pay como checkout. |
| Uso no app | Reforcar o budget/multi-moeda que JA existe (o app converte custos USD e usa cambio open.er-api.com): mostrar cotacao mid-market ao vivo do orcamento da viagem e o 'quanto custa de verdade levar/sacar la fora', com CTA de afiliado para abrir conta/cartao Wise (tag de afiliado) — receita por aquisicao de conta. Util porque o publico viaja e precisa de cartao multimoeda. |
| Modelo de comissão | Afiliado: comissao por nova conta/cartao Wise (via partnerwise/Impact) e Revolut (via Impact) com deep-link/tag. A API de taxas em si nao paga; a receita e CPA por conversao de conta. |
| Limitações | API Wise de taxas exige aprovacao como afiliado (credenciais via partnerwise) e SO traz taxas da Wise (nao compara concorrentes). Revolut nao tem API de cambio publica para terceiros — so afiliado de conta + Revolut Pay como metodo de checkout. KYC/regulatorio do lado deles. |
| Custo | API de taxas Wise: gratuita apos aprovacao de afiliado. Afiliado: gratuito de aderir; receita CPA. |
| Fallback | Manter open.er-api.com (ja em uso) como fonte de cambio mid-market no budget — funciona sem qualquer aprovacao. Wise/Revolut entram so como CTA de afiliado (deep-link) e, opcionalmente, cotacao 'ao vivo' quando a chave de afiliado existir. Sem afiliado aprovado, o cambio do app nao depende deles. |

### OpenTable/TheFork (reservas)  ·  prioridade P3 · complexidade media
| Campo | Conteúdo |
|---|---|
| Tipo de dado | Disponibilidade de mesa em tempo real (data/hora/pessoas), catalogo de restaurantes (cozinha, faixa de preco, bairro, fotos, cardapio/menus), notas e reviews verificados, ofertas/descontos (TheFork Yums 20-50%), links/widget de reserva, dados de cliente (alergias/preferencias) para o restaurante. |
| Uso no app | Camada de GASTRONOMIA no /destino e no /roteiro IA (refeicoes do dia): sugerir restaurantes e oferecer 'Reservar mesa' via deep-link/widget de afiliado — OpenTable para EUA/global, TheFork para Europa. Casa com a categoria 'Comida' que ja existe no custos.js e com o apelo premium (curadoria gastronomica, possivel selo Michelin no futuro). |
| Modelo de comissão | Afiliado/CPA por reserva concretizada via deep-link/widget (programas de afiliado das duas marcas). APIs nativas (Directory/B2B) sao de parceiro e mais voltadas a CPA por cover do que a revenue-share de catalogo. |
| Limitações | Directory API (OpenTable) e B2B-API (TheFork) sao de PARCEIRO com aprovacao; disponibilidade ao vivo completa fica atras do credenciamento. TheFork e essencialmente Europa; OpenTable forte em EUA. Sem feed aberto de catalogo global — integra-se marca a marca, complementar com Google Places/Resy onde nao cobrem. |
| Custo | Deep-link/widget de afiliado: gratuito de aderir. APIs de parceiro: aprovacao + engenharia. Custo principal e cobertura desigual por regiao. |
| Fallback | Para a ficha gastronomica, usar Google Places (nota/faixa de preco/horario) ou OSM como fonte de restaurantes e oferecer 'reservar' como deep-link de busca para OpenTable/TheFork sem API. Onde nenhum cobre, deep-link generico de mapa/Google. A reserva real e nice-to-have, nao bloqueia o roteiro. |
