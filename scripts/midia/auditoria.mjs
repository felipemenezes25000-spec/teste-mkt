#!/usr/bin/env node
// Auditoria de imagens (OMEGA V4 §13): cobertura por nível, licença e fotos
// ilustrativas. Gera docs/IMAGE-COVERAGE-REPORT.md (números reais desta execução).
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const imp = (f) => import(pathToFileURL(path.resolve(f)).href);
const { DESTINOS } = await imp('app/_lib/destinos.js');
const { fotoCapa } = await imp('app/_lib/wiki.js');
const { resolverImagens } = await imp('app/_lib/media.js');
const { arquivoWikimedia } = await imp('app/_lib/wikiThumb.js');
const { ATRACOES_IMG } = await imp('app/_engine/atracoesImgOverride.js');
const { atracoesDoPais } = await imp('app/_engine/atracoes.js');

const HOJE = new Date().toISOString().slice(0, 10);
// 1) heróis de país
const herois = [];
for (let i = 0; i < DESTINOS.length; i += 10) {
  const lote = DESTINOS.slice(i, i + 10);
  herois.push(...(await Promise.all(lote.map((d) => fotoCapa(d).catch(() => null)))));
  process.stdout.write(`\rheróis ${Math.min(i + 10, DESTINOS.length)}/${DESTINOS.length}`);
}
process.stdout.write('\n');
const assets = await resolverImagens(herois.filter(Boolean), { largura: 1280 });
let heroOk = 0, heroLic = 0, heroSemLic = 0, heroSemFoto = 0;
const semFoto = [];
const semLicenca = [];
const licencas = {};
DESTINOS.forEach((d, i) => {
  const u = herois[i];
  if (!u) { heroSemFoto++; semFoto.push(d.nome); return; }
  heroOk++;
  const a = assets.get(arquivoWikimedia(u) || '');
  if (a && a.rightsStatus === 'VERIFIED') { heroLic++; licencas[a.license] = (licencas[a.license] || 0) + 1; }
  else { heroSemLic++; semLicenca.push({ code: d.code, nome: d.nome, url: u, motivo: !arquivoWikimedia(u) ? 'fonte não-Commons' : a ? `status ${a.rightsStatus}` : 'metadado ausente no Commons' }); }
});

// 2) atrações: overrides diretos e reaproveitados (ilustrativos)
let totalAtr = 0, comOverride = 0, overrideIlustrativo = 0;
for (const d of DESTINOS) {
  const lista = atracoesDoPais(d.code) || [];
  totalAtr += lista.length;
  const uso = {};
  for (const a of lista) { const u = ATRACOES_IMG[`${d.code}:${a.nome}`]; if (u) uso[u] = (uso[u] || 0) + 1; }
  for (const a of lista) { const u = ATRACOES_IMG[`${d.code}:${a.nome}`]; if (u) { comOverride++; if (uso[u] > 1) overrideIlustrativo++; } }
}
const pct = (a, b) => (b ? `${((a / b) * 100).toFixed(1)}%` : '—');
const md = `# Image coverage report

> Gerado por \`scripts/midia/auditoria.mjs\` em ${HOJE} (requisições reais à Wikipedia/Commons). OMEGA V4 §11-13.

## Países (foto de capa)

| Métrica | Valor |
|---|---|
| Países no catálogo | ${DESTINOS.length} |
| Com foto de capa encontrada | ${heroOk} (${pct(heroOk, DESTINOS.length)}) |
| …com licença livre verificada (Commons) | ${heroLic} (${pct(heroLic, DESTINOS.length)}) |
| …sem licença verificável (fonte não-Commons ou metadado ausente) | ${heroSemLic} |
| Sem foto (fallback honesto “Sem foto verificada”) | ${heroSemFoto} |

Licenças das capas verificadas: ${Object.entries(licencas).sort((a, b) => b[1] - a[1]).map(([l, n]) => `${l} (${n})`).join(', ')}.

${semLicenca.length ? `Capas sem licença verificada (exibidas com crédito da fonte; pendência de regularização):

| País | Motivo | Arquivo |
|---|---|---|
${semLicenca.map((x) => `| ${x.nome} (${x.code}) | ${x.motivo} | ${decodeURIComponent(x.url.split('/').pop()).slice(0, 60)} |`).join('\n')}` : ''}
${semFoto.length ? `\nSem foto: ${semFoto.join(', ')}.` : ''}

## Atrações

| Métrica | Valor |
|---|---|
| Atrações no catálogo consolidado | ${totalAtr} |
| Com URL de foto direta (override auditado) | ${comOverride} |
| …dessas, reaproveitadas para várias atrações → exibidas como **FOTO ILUSTRATIVA** | ${overrideIlustrativo} |
| Demais | foto resolvida na página (verbete → Openverse → Commons → piso do país **rotulado ilustrativo**) |

## Regras aplicadas

- Thumbnails apenas em larguras padrão do Wikimedia; largura nunca maior que o original (evita 400/429).
- Autor e licença exibidos no botão © de cada foto resolvida pelo serviço de mídia (\`app/_lib/media.js\`).
- Foto que não é do lugar exato recebe o rótulo **FOTO ILUSTRATIVA · {país}**.
- Falha de carregamento → placeholder editorial “Foto indisponível” (nunca imagem genérica fingindo ser o lugar).

## Pendências

- Revisão humana amostral de correspondência foto↔POI para os destinos prioritários (o V4 pede amostragem humana; aqui foi automática + visual em Japão/Itália).
- Fotos de restaurantes/hotéis dependem de provedores contratados (ver docs/PROVIDER-MATRIX.md).
`;
fs.writeFileSync('docs/IMAGE-COVERAGE-REPORT.md', md);
console.log(md.split('\n').slice(0, 20).join('\n'));
