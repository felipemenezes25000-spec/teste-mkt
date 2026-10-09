#!/usr/bin/env node
// E2E da plataforma (fora do escopo original do OMEGA V4, entregue a mais):
// API pública v1, B2B/white-label (proposta → link → visão do cliente sem custo),
// marketplace (adaptar roteiro → viagem) e Trip Pass sem chaves (503 honesto).
// Uso: node scripts/e2e-plataforma.mjs [baseUrl] [pastaSaida]
import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';

const BASE = (process.argv[2] || 'http://localhost:3000').replace(/\/$/, '');
const OUT = process.argv[3] || 'docs/plataforma/_proof/e2e-plataforma';
fs.mkdirSync(OUT, { recursive: true });
const passos = [];
const ok = (nome, cond, extra = '') => { passos.push({ nome, ok: !!cond }); console.log(`${cond ? '✓' : '✗'} ${nome}${extra ? ` — ${extra}` : ''}`); };

// ---------------- API v1 ----------------
const j = async (u, h = {}) => { const r = await fetch(BASE + u, { headers: h }); return { r, b: await r.json().catch(() => null) }; };
let x = await j('/api/v1/destinos?limit=5&month=11');
ok('API lista destinos com meta de frescor', x.r.status === 200 && x.b.data.length === 5 && x.b.meta.freshness === 'HISTORICAL' && x.b.meta.total > 5);
ok('API manda CORS e limite', x.r.headers.get('access-control-allow-origin') === '*' && x.r.headers.get('x-ratelimit-limit') === '30');
x = await j('/api/v1/destinos/jp');
ok('API detalhe JP (código minúsculo aceito)', x.r.status === 200 && x.b.data.code === 'JP' && x.b.data.visa_brazilian_passport && x.b.data.cost_tiers_usd_per_day.medio);
x = await j('/api/v1/destinos/ZZ');
ok('API 404 padronizado', x.r.status === 404 && x.b.error.code === 'not_found');
x = await j('/api/v1/custo?code=PT&days=10&style=medio&travelers=2');
ok('API custo coerente (grupo = pessoa × 2)', x.r.status === 200 && x.b.data.total_group_usd === x.b.data.total_per_person_usd * 2 && x.b.meta.freshness === 'ESTIMATE');
x = await j('/api/v1/custo?code=PT&days=999');
ok('API 400 para parâmetro inválido', x.r.status === 400 && x.b.error.code === 'invalid_request');
x = await j('/api/v1/visto?code=JP&passport=US');
ok('API visto de passaporte sem regra = consultar, não verificado', x.r.status === 200 && x.b.data.verified === false);
x = await j('/api/v1/destinos', { 'x-api-key': 'msf_live_' + 'A'.repeat(32) });
ok('API recusa chave inexistente (401)', x.r.status === 401);
x = await j('/api/v1/openapi.json');
ok('OpenAPI 3.1 publicado', x.r.status === 200 && x.b.openapi === '3.1.0' && Object.keys(x.b.paths).length === 4);
const opt = await fetch(BASE + '/api/v1/destinos', { method: 'OPTIONS' });
ok('preflight CORS', opt.status === 204);
let ultimo = 200;
for (let i = 0; i < 40 && ultimo !== 429; i++) ultimo = (await fetch(BASE + '/api/v1/visto?code=PT', { headers: { 'x-forwarded-for': '203.0.113.9' } })).status;
ok('limite anônimo devolve 429', ultimo === 429);

// ---------------- telas ----------------
const b = await chromium.launch();
const ctx = await b.newContext({ viewport: { width: 1280, height: 900 }, permissions: ['clipboard-read', 'clipboard-write'] });
const p = await ctx.newPage();
const erros = [];
p.on('pageerror', (e) => erros.push(e.message));
const shot = (n) => p.screenshot({ path: path.join(OUT, `${n}.png`), fullPage: false });

try {
  // B2B
  await p.goto(`${BASE}/agencias`, { waitUntil: 'load' });
  const marca = p.getByRole('form', { name: /Sua marca/ });
  await marca.locator('input[name=nomeExibido]').fill('Viagens Aurora');
  await marca.locator('input[name=corPrimaria]').fill('#0A7D5A');
  await marca.getByRole('button', { name: 'Salvar' }).click();
  const nova = p.getByRole('form', { name: /Nova proposta/ });
  await nova.locator('input[name=titulo]').fill('Lua de mel no Japão');
  await nova.locator('input[name=clienteNome]').fill('Júlia e Rafa');
  await nova.locator('input[name=margemPct]').fill('15');
  await nova.getByRole('button', { name: 'Criar proposta' }).click();
  const item = p.getByRole('form', { name: /Adicionar item/ });
  for (const [titulo, custo, dia, tipo] of [['Ryokan em Quioto (3 noites)', '6000', '1', 'LODGING'], ['Passe JR 7 dias', '2500', '1', 'TICKET'], ['Cerimônia do chá', '1500', '3', 'EXPERIENCE']]) {
    await item.locator('input[name=titulo]').fill(titulo);
    await item.locator('select[name=tipo]').selectOption(tipo);
    await item.locator('input[name=custo]').fill(custo);
    await item.locator('input[name=dia]').fill(dia);
    await item.getByRole('button', { name: 'Adicionar item' }).click();
  }
  const precoTxt = await p.locator('dd').nth(2).innerText();
  ok('proposta: preço ao cliente = custo + 15%', /11\.500,00/.test(precoTxt), precoTxt);
  await shot('01-agencias');
  await p.getByRole('button', { name: /Copiar link para o cliente/ }).click();
  const link = await p.evaluate(() => navigator.clipboard.readText());
  ok('link da proposta gerado', link.includes('/proposta#'));
  await p.goto(link, { waitUntil: 'load' });
  await p.waitForSelector('text=Lua de mel no Japão');
  const corpo = await p.locator('body').innerText();
  ok('cliente vê preço e itens com a marca da agência', corpo.includes('Viagens Aurora') && corpo.includes('11.500,00') && corpo.includes('Ryokan em Quioto'));
  ok('cliente NÃO vê custo, margem nem lucro', !/6\.000,00|Margem|Lucro|Custo/i.test(corpo));
  const corHeader = await p.locator('header').first().evaluate((el) => getComputedStyle(el).backgroundColor);
  ok('white-label aplica a cor da agência', corHeader === 'rgb(10, 125, 90)', corHeader);
  await shot('02-proposta-cliente');
  await p.goto(`${BASE}/proposta#lixo`, { waitUntil: 'load' });
  ok('link adulterado mostra erro honesto', await p.getByText(/Proposta não encontrada/).isVisible());

  // Marketplace
  await p.goto(`${BASE}/marketplace`, { waitUntil: 'load' });
  const cards = await p.locator('a[href^="/marketplace/r/"]').count();
  ok('marketplace lista roteiros da equipe', cards >= 15, `${cards}`);
  ok('comunidade honesta: sem servidor explica; com servidor e vazia, convida (sem vitrine falsa)', await p.getByText(/aparecem quando a conta|Nenhum roteiro da comunidade ainda/).first().isVisible());
  await shot('03-marketplace');
  await p.goto(`${BASE}/marketplace/r/japao-4-dias`, { waitUntil: 'load' });
  await p.getByRole('button', { name: /Criar minha viagem/ }).click();
  await p.waitForURL(/\/viagens\/trip_/, { timeout: 30000 });
  await p.waitForSelector('text=DIA 01');
  ok('roteiro adaptado vira viagem com dias e lugares', (await p.locator('ol li').count()) >= 2);
  await shot('04-roteiro-adaptado');

  // Desenvolvedores
  await p.goto(`${BASE}/desenvolvedores`, { waitUntil: 'load' });
  await p.getByRole('button', { name: 'Executar' }).click();
  await p.waitForSelector('text=HTTP 200');
  ok('portal da API executa chamada real', await p.getByText('HTTP 200').isVisible());
  await shot('05-desenvolvedores');

  // Trip Pass sem chaves → mensagem honesta (sem login também)
  await p.goto(`${BASE}/planos`, { waitUntil: 'load' });
  await p.getByRole('button', { name: /Comprar Trip Pass/ }).click();
  ok('Trip Pass sem login/chaves explica o que falta', await p.getByText(/Entre na sua conta para pagar|Checkout em configuração/).isVisible());
  ok('sem erros de página', erros.length === 0, erros.join(' | ').slice(0, 200));
} catch (e) {
  ok(`fluxo interrompido: ${e.message.split('\n')[0]}`, false);
  await shot('erro').catch(() => {});
}
await b.close();
const falhas = passos.filter((x) => !x.ok).length;
console.log(`\n${passos.length - falhas}/${passos.length} passos OK`);
fs.writeFileSync(path.join(OUT, 'resultado.json'), JSON.stringify({ quando: new Date().toISOString(), passos }, null, 2));
process.exit(falhas ? 1 : 0);
