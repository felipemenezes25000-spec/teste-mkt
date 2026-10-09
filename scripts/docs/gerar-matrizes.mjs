#!/usr/bin/env node
// Gera docs/PROVIDER-MATRIX.md e docs/MAPS-LICENSE-MATRIX.md a partir do registro
// único app/_lib/provedores.js (o mesmo que alimenta a página /fontes).
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
const { PROVEDORES, ROTULO_ESTADO, VERIFICADO_EM } = await import(pathToFileURL(path.resolve('app/_lib/provedores.js')).href);
const esc = (s) => String(s ?? '—').replace(/\|/g, '\|');
const linhas = PROVEDORES.map((p) => `| ${esc(p.nome)} | ${esc(p.dominio)} | \`${p.estado}\` (${esc(ROTULO_ESTADO[p.estado])}) | ${esc(p.uso)} | ${esc(p.auth)} · ${esc(p.onde)} | ${esc(p.limite)} | ${esc(p.custo)} | ${esc(p.fallback)} | ${esc(p.atribuicao)} | ${esc(p.nota)} |`);
fs.writeFileSync('docs/PROVIDER-MATRIX.md', `# Provider matrix

> Gerado por \`scripts/docs/gerar-matrizes.mjs\` a partir de \`app/_lib/provedores.js\` (fonte única; também exibido em /fontes). Verificado em ${VERIFICADO_EM} com requisições reais deste ambiente. Estados conforme OMEGA V4 §28 — **ADAPTER_READY nunca é tratado como LIVE**.

| Provedor | Domínio | Estado | Uso | Acesso | Limite | Custo | Se falhar | Atribuição | Nota |
|---|---|---|---|---|---|---|---|---|---|
${linhas.join('\n')}

## Bloqueios externos (dependem do dono do produto)

${PROVEDORES.filter((p) => ['KEY_REQUIRED', 'CONTRACT_REQUIRED', 'ADAPTER_READY', 'RESEARCHED'].includes(p.estado)).map((p) => `- **${p.nome}** — \`${p.estado}\`: ${p.nota || p.custo}`).join('\n')}
`);
const mapas = PROVEDORES.filter((p) => ['Mapas', 'Rotas', 'Geo'].includes(p.dominio));
fs.writeFileSync('docs/MAPS-LICENSE-MATRIX.md', `# Maps license matrix

> OMEGA V4 §21. Verificado em ${VERIFICADO_EM}. Nenhuma combinação "base de um provedor + dados de outro" é usada sem checagem: o mapa base é OpenStreetMap (OpenFreeMap), as rotas são OSRM sobre OpenStreetMap (mesma base de dados) e as coordenadas de POIs vêm de Wikipedia/Wikidata (dados factuais, CC BY-SA/CC0). O link “Como chegar/Navegar” abre o Google Maps como **navegação externa** — nenhum dado do Google é exibido ou armazenado no nosso mapa.

| Provedor | Termos de uso de tiles/API | Atribuição exigida | Armazenar geocódigos/POIs | Combinar com outros mapas | Geolocalização | Cota | Custo | Cache/offline |
|---|---|---|---|---|---|---|---|---|
| OpenFreeMap (tiles vetoriais OSM) | Livre, inclusive comercial; serviço “as is” sem SLA | “OpenFreeMap © OpenMapTiles Data from OpenStreetMap” (automática no MapLibre) | Dados OSM sob ODbL (atribuição; share-alike para bases derivadas) | Sim, base OSM | Não envolvida | Sem limite declarado | Grátis (doação) | Cache do navegador; offline completo exigiria tiles próprios |
| OSRM · FOSSGIS (routing.openstreetmap.de) | Uso leve, ≤ 1 req/s, sem scraping | “OSRM · FOSSGIS · © OpenStreetMap” | Rotas calculadas sob demanda; só cache de sessão | Mesma base OSM | Ponto de partida = posição consentida (enviada só ao roteador) | 1 req/s | Grátis | Não; produção em escala exige servidor próprio |
| Wikipedia/Wikidata (coordenadas) | Termos Wikimedia; User-Agent identificado | Link/crédito à fonte | Sim (dados factuais; CC0/CC BY-SA) | Sim | — | Boas práticas (lotes de 50) | Grátis | Gerado em build (\`app/_data/geo/lugares.json\`) |
| Google Maps (link externo) | Só deep link “search/dir” — sem API, sem tiles | — | Não armazenamos nada do Google | Não exibido no nosso mapa | Feita no app do Google | — | — | — |

Itens: ${mapas.map((m) => m.nome).join(', ')}.
`);
console.log('ok', PROVEDORES.length, 'provedores');
