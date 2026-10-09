#!/usr/bin/env node
// E2E da jornada OMEGA V4 §46 (recorte executável localmente):
// São Paulo → Japão, 14 dias, casal, R$ 18.000 → roteiro com rota real, otimização,
// reserva, gasto em JPY convertido, documento com alerta e Modo Viagem.
// Uso: node scripts/e2e-viagem.mjs [baseUrl] [pastaSaida]
import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';

const BASE = (process.argv[2] || 'http://localhost:3000').replace(/\/$/, '');
const OUT = process.argv[3] || 'docs/plataforma/_proof/e2e-viagem';
fs.mkdirSync(OUT, { recursive: true });
const b = await chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
const ctx = await b.newContext({ viewport: { width: 1440, height: 900 }, geolocation: { latitude: 34.9858, longitude: 135.7588 }, permissions: ['geolocation'] });
const p = await ctx.newPage();
const erros = [];
p.on('pageerror', (e) => erros.push(e.message));
const passos = [];
const ok = (nome, cond, extra = '') => { passos.push({ nome, ok: !!cond, extra }); console.log(`${cond ? '✓' : '✗'} ${nome}${extra ? ` — ${extra}` : ''}`); };
const shot = (n) => p.screenshot({ path: path.join(OUT, `${n}.png`), fullPage: false });

try {
  await p.goto(`${BASE}/viagens`, { waitUntil: 'load', timeout: 120000 });
  await p.getByRole('button', { name: /Exemplo: Japão/ }).click({ timeout: 60000 });
  await p.getByRole('button', { name: /Criar viagem/ }).click();
  await p.waitForURL(/\/viagens\/trip_/, { timeout: 30000 });
  ok('cria a viagem Japão 14 dias', /viagens\/trip_/.test(p.url()));
  ok('fuso real do destino', await p.getByText(/Asia\/Tokyo/).isVisible());

  // roteiro: adiciona 3 lugares de Quioto
  const busca = p.getByPlaceholder(/Adicionar lugar de Japão/);
  await busca.waitFor({ timeout: 30000 });
  for (const nome of ['Fushimi', 'Kinkaku', 'Kiyomizu']) {
    await busca.fill(nome);
    await p.locator('button', { hasText: new RegExp(nome, 'i') }).first().click({ timeout: 15000 });
  }
  ok('adiciona 3 lugares com coordenada', (await p.locator('ol li').count()) >= 3);
  await p.waitForSelector('text=Rota calculada agora', { timeout: 30000 }).catch(() => {});
  const rotaLive = await p.getByText('Rota calculada agora').isVisible().catch(() => false);
  ok('rota real pelas ruas (OSRM/FOSSGIS) ou estimativa rotulada', rotaLive || (await p.getByText(/estimad|aproximada/i).first().isVisible()), rotaLive ? 'LIVE' : 'ESTIMATE');
  await p.waitForTimeout(4000);
  await shot('01-roteiro');

  await p.getByRole('button', { name: /Otimizar ordem/ }).click();
  ok('otimizador mostra proposta sem aplicar sozinho', await p.getByRole('region', { name: /Proposta de nova ordem/ }).isVisible());
  const aplicar = p.getByRole('button', { name: /Aplicar nova ordem/ });
  if (await aplicar.isVisible().catch(() => false)) await aplicar.click(); else await p.getByRole('button', { name: /Fechar/ }).click();

  // reservas
  await p.getByRole('tab', { name: /Reservas/ }).click();
  const form = p.locator('form').filter({ hasText: 'Salvar reserva' });
  if (!(await form.isVisible().catch(() => false))) await p.getByRole('button', { name: /Registrar reserva/ }).click();
  await p.locator('select[name=tipo]').selectOption('LODGING');
  await p.locator('input[name=provider]').fill('Booking.com');
  await p.locator('input[name=localizador]').fill('BK-77Q2');
  await p.locator('input[name=confirmada]').check();
  await p.getByRole('button', { name: 'Salvar reserva' }).click();
  ok('reserva importada com status honesto', await p.getByText(/informado por você/).isVisible());

  // despesas em JPY
  await p.getByRole('tab', { name: /Despesas/ }).click();
  await p.locator('input[name=valor]').fill('3200');
  await p.locator('select[name=moeda]').selectOption('JPY');
  await p.locator('input[name=descricao]').fill('Jantar em Pontocho');
  await p.getByRole('button', { name: /Adicionar gasto/ }).click();
  await p.waitForSelector('text=Jantar em Pontocho', { timeout: 20000 });
  const conv = await p.getByText(/≈ R\$/).first().isVisible().catch(() => false);
  ok('gasto em JPY convertido com taxa e data', conv);
  await shot('02-despesas');

  // documentos
  await p.getByRole('tab', { name: /Documentos/ }).click();
  await p.locator('select[name=tipo]').selectOption('PASSAPORTE');
  await p.locator('input[name=validade]').fill('2027-01-15');
  await p.getByRole('button', { name: 'Salvar' }).click();
  ok('alerta de validade do passaporte (6 meses)', await p.getByText(/6 meses/).isVisible());

  // modo viagem
  await p.getByRole('link', { name: /Modo Viagem/ }).first().click();
  await p.waitForURL(/\/hoje$/, { timeout: 30000 });
  await p.waitForSelector('text=Próximo passo', { timeout: 30000 });
  ok('Modo Viagem abre com próximo passo', await p.getByText('Próximo passo').isVisible());
  await p.getByRole('button', { name: /Onde estou/ }).click();
  await p.waitForSelector('text=/Você está a/', { timeout: 20000 }).catch(() => {});
  ok('localização consentida mede distância', await p.getByText(/Você está a/).isVisible().catch(() => false));
  await shot('03-modo-viagem');

  // offline (dados do aparelho)
  await ctx.setOffline(true);
  await p.waitForTimeout(800);
  ok('indicador offline', await p.getByText(/OFFLINE/).isVisible());
  await ctx.setOffline(false);
} catch (e) {
  ok('execução sem exceção', false, String(e.message || e).slice(0, 200));
}
ok('sem erros de página', erros.length === 0, erros.slice(0, 2).join(' | '));
fs.writeFileSync(path.join(OUT, 'resultado.json'), JSON.stringify({ passos, erros }, null, 1));
await b.close();
const falhas = passos.filter((x) => !x.ok).length;
console.log(`\n${passos.length - falhas}/${passos.length} passos OK`);
process.exit(falhas ? 1 : 0);
