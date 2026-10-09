# Maps license matrix

> OMEGA V4 §21. Verificado em 2026-10-09. Nenhuma combinação "base de um provedor + dados de outro" é usada sem checagem: o mapa base é OpenStreetMap (OpenFreeMap), as rotas são OSRM sobre OpenStreetMap (mesma base de dados) e as coordenadas de POIs vêm de Wikipedia/Wikidata (dados factuais, CC BY-SA/CC0). O link “Como chegar/Navegar” abre o Google Maps como **navegação externa** — nenhum dado do Google é exibido ou armazenado no nosso mapa.

| Provedor | Termos de uso de tiles/API | Atribuição exigida | Armazenar geocódigos/POIs | Combinar com outros mapas | Geolocalização | Cota | Custo | Cache/offline |
|---|---|---|---|---|---|---|---|---|
| OpenFreeMap (tiles vetoriais OSM) | Livre, inclusive comercial; serviço “as is” sem SLA | “OpenFreeMap © OpenMapTiles Data from OpenStreetMap” (automática no MapLibre) | Dados OSM sob ODbL (atribuição; share-alike para bases derivadas) | Sim, base OSM | Não envolvida | Sem limite declarado | Grátis (doação) | Cache do navegador; offline completo exigiria tiles próprios |
| OSRM · FOSSGIS (routing.openstreetmap.de) | Uso leve, ≤ 1 req/s, sem scraping | “OSRM · FOSSGIS · © OpenStreetMap” | Rotas calculadas sob demanda; só cache de sessão | Mesma base OSM | Ponto de partida = posição consentida (enviada só ao roteador) | 1 req/s | Grátis | Não; produção em escala exige servidor próprio |
| Wikipedia/Wikidata (coordenadas) | Termos Wikimedia; User-Agent identificado | Link/crédito à fonte | Sim (dados factuais; CC0/CC BY-SA) | Sim | — | Boas práticas (lotes de 50) | Grátis | Gerado em build (`app/_data/geo/lugares.json`) |
| Google Maps (link externo) | Só deep link “search/dir” — sem API, sem tiles | — | Não armazenamos nada do Google | Não exibido no nosso mapa | Feita no app do Google | — | — | — |

Itens: OpenFreeMap (tiles OSM), OSRM · FOSSGIS (routing.openstreetmap.de), Transporte público em tempo real (GTFS-RT), Wikipedia + Wikidata (coordenadas).
