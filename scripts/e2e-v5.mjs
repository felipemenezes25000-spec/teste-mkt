#!/usr/bin/env node
// E2E dos casos OMEGA V5 (§20) executáveis em navegador local. Cada passo leva o ID
// da matriz. Uso: node scripts/e2e-v5.mjs [baseUrl] [pastaSaida]
import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';

const BASE = (process.argv[2] || 'http://localhost:3000').replace(/\/$/, '');
const OUT = process.argv[3] || 'docs/plataforma/_proof/e2e-v5';
fs.mkdirSync(OUT, { recursive: true });
const passos = [];
const ok = (id, nome, cond, extra = '') => { passos.push({ id, nome, ok: !!cond, extra }); console.log(`${cond ? '✓' : '✗'} ${id} ${nome}${extra ? ` — ${extra}` : ''}`); };
const b = await chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });

async function pagina(opts = {}) {
  const ctx = await b.newContext({ viewport: { width: 1280, height: 900 }, ...opts });
  const p = await ctx.newPage();
  const erros = [];
  p.on('pageerror', (e) => erros.push(e.message));
  p.on('console', (m) => { if (m.type() === 'error' && !/tiles|Failed to load resource.*(openfreemap|wikimedia)/i.test(m.text())) erros.push(m.text().slice(0, 140)); });
  return { ctx, p, erros };
}
const textoSim = (p) => p.locator('section[aria-labelledby=sim-titulo]').innerText();

try {
  // ---------------- HOME ----------------
  {
    const { ctx, p, erros } = await pagina();
    await p.goto(`${BASE}/?sim=1&o=GRU&m=BRL&d=14&a=2&c=0&b=18000&e=equilibrado`, { waitUntil: 'load' });
    await p.locator('section[aria-labelledby=sim-titulo] ol > li').first().waitFor({ timeout: 30000 });
    const t = await textoSim(p);
    ok('HOME-01', 'BRL + origem SP: três camadas em R$, sem US$ misturado', /Em terra[\s\S]*R\$[\s\S]*Passagem ida e volta[\s\S]*R\$[\s\S]*Total provável[\s\S]*R\$/.test(t) && !/US\$/.test(t.split('Por que')[0]));
    ok('HOME-03', 'passagem rotulada como ilustrativa e total como "não é preço final"', /sem cotação/.test(t) && /não é preço final/.test(t));
    ok('HOME-05', 'Top 3 sem cadastro', (await p.locator('section[aria-labelledby=sim-titulo] ol > li').count()) === 3);
    ok('HOME-01b', 'câmbio exibido com fonte e data', /Câmbio .*\(.*\) de \d{4}-\d{2}-\d{2}/.test(t) || /Câmbio indisponível/.test(t));
    ok('HOME-01c', 'nenhum selo legado "cabe no orçamento" sem escopo', !/^cabe no orçamento$/m.test(t));
    await p.screenshot({ path: path.join(OUT, 'home-01.png') });
    // HOME-02: sem origem
    await p.goto(`${BASE}/?sim=1&m=BRL&d=10&a=2&c=0&b=50000&e=equilibrado`, { waitUntil: 'load' });
    await p.locator('section[aria-labelledby=sim-titulo] ol > li').first().waitFor({ timeout: 30000 });
    const t2 = await textoSim(p);
    ok('HOME-02', 'sem origem: total indisponível e veredito só do custo em terra', /Indisponível sem origem/.test(t2) && /passagem não incluída|Custo em terra/.test(t2) && !/Total estimado cabe/.test(t2));
    // HOME-06: muda viajantes → valores mudam
    const terra2 = (t2.match(/Em terra[\s\S]*?(R\$\s*[\d.]+)/) || [])[1];
    await p.goto(`${BASE}/?sim=1&m=BRL&d=10&a=4&c=0&b=50000&e=equilibrado`, { waitUntil: 'load' });
    await p.locator('section[aria-labelledby=sim-titulo] ol > li').first().waitFor({ timeout: 30000 });
    const terra4 = ((await textoSim(p)).match(/Em terra[\s\S]*?(R\$\s*[\d.]+)/) || [])[1];
    ok('HOME-06', 'trocar viajantes recalcula', terra2 && terra4 && terra2 !== terra4, `${terra2} → ${terra4}`);
    ok('PER-06', 'Home sem erros de console/página', erros.length === 0, erros.join(' | ').slice(0, 160));
    await ctx.close();
  }
  // ---------------- VIS-01: 320 px ----------------
  for (const rota of ['/', '/explorar', '/destino/japao', '/viagens', '/marketplace']) {
    const { ctx, p } = await pagina({ viewport: { width: 320, height: 720 } });
    await p.goto(BASE + rota, { waitUntil: 'load' });
    await p.waitForTimeout(800);
    const over = await p.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    ok('VIS-01', `320 px sem rolagem horizontal ${rota}`, over <= 1, `${over}px`);
    await ctx.close();
  }
  // ---------------- EXPLORER ----------------
  {
    const { ctx, p, erros } = await pagina();
    const mapReq = [];
    p.on('request', (r) => { if (/openfreemap|maplibre/i.test(r.url())) mapReq.push(r.url()); });
    await p.goto(`${BASE}/explorar`, { waitUntil: 'networkidle' });
    ok('EXP-10', 'MapLibre e tiles não carregam antes da interação', mapReq.length === 0, `${mapReq.length} requests`);
    ok('ACC-03', 'mapa tem alternativa textual (lista) e prévia com rótulo', (await p.locator('[role=img][aria-label]').count()) > 0 && (await p.locator('li', { hasText: /US\$ \d+\/dia/ }).count()) > 50);
    await p.locator('button', { hasText: /Abrir mapa interativo/ }).first().click();
    await p.locator('canvas.maplibregl-canvas').first().waitFor({ timeout: 30000 });
    ok('EXP-10b', 'mapa interativo carrega ao pedir', mapReq.length > 0);
    ok('PER-06', 'Explorar sem erros', erros.length === 0, erros.join(' | ').slice(0, 160));
    await ctx.close();
  }
  {
    // EXP-04: sem WebGL a lista continua operando
    const ctx = await b.newContext({ viewport: { width: 1280, height: 900 } });
    await ctx.addInitScript(() => { const orig = HTMLCanvasElement.prototype.getContext; HTMLCanvasElement.prototype.getContext = function (t, ...r) { return /webgl/i.test(t) ? null : orig.call(this, t, ...r); }; });
    const p = await ctx.newPage();
    await p.goto(`${BASE}/explorar`, { waitUntil: 'load' });
    await p.locator('button', { hasText: /Abrir mapa interativo/ }).first().click();
    await p.waitForTimeout(6000);
    const aviso = await p.getByText(/Mapa indisponível agora/).isVisible().catch(() => false);
    await p.locator('input[placeholder*="País"]').first().fill('Japão');
    await p.waitForTimeout(800);
    const lista = await p.locator('li', { hasText: 'Japão' }).count();
    ok('EXP-04', 'sem WebGL: aviso honesto e lista filtra normalmente', aviso && lista > 0);
    ok('EXP-09', 'mapa indisponível explica e oferece a lista', aviso);
    await ctx.close();
  }
  // ---------------- DESTINO ----------------
  {
    const { ctx, p, erros } = await pagina();
    await p.route(/upload\.wikimedia\.org|commons\.wikimedia\.org/, (r) => r.abort());
    await p.goto(`${BASE}/destino/japao`, { waitUntil: 'load' });
    await p.waitForTimeout(1500);
    const quebradas = await p.evaluate(() => [...document.images].filter((i) => i.complete && i.naturalWidth === 0 && i.offsetParent).length);
    const placeholders = await p.getByText(/Foto indisponível/).count();
    ok('DST-03/PER-07', 'CDN de imagem fora: placeholder honesto, sem imagem quebrada visível', quebradas === 0 && placeholders > 0, `${placeholders} placeholders`);
    ok('DST-09', 'preço de referência marcado como histórico', (await p.getByText(/HISTÓRICO|referência jun\/2026/i).count()) > 0);
    ok('DST-14', 'SEO: canonical e og:title presentes', (await p.locator('link[rel=canonical]').count()) === 1 && (await p.locator('meta[property="og:title"]').count()) === 1);
    ok('PER-06', 'Destino sem erros de página', erros.filter((e) => !/net::ERR_FAILED|Failed to load/i.test(e)).length === 0);
    await ctx.close();
  }
  // ---------------- COMMERCE / SEGURANÇA ----------------
  {
    const r = await fetch(`${BASE}/api/stripe/checkout`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ produto: 'trip_pass', preco: 1 }) });
    ok('COM-03', 'checkout sem Stripe/login responde indisponível honesto', r.status === 503 || r.status === 401, `HTTP ${r.status}`);
    const r2 = await fetch(`${BASE}/api/out?u=https://evil.example.com`);
    ok('COM-01', 'saída afiliada recusa domínio fora da allowlist', r2.status >= 400 && r2.status < 500, `HTTP ${r2.status}`);
    const h = (await fetch(`${BASE}/`)).headers;
    ok('SEC-08', 'CSP, nosniff, frame-ancestors e referrer-policy presentes', /frame-ancestors 'none'/.test(h.get('content-security-policy') || '') && h.get('x-content-type-options') === 'nosniff' && !!h.get('referrer-policy'));
    // SEC-03: nenhum segredo nos chunks enviados ao navegador
    const html = await (await fetch(`${BASE}/`)).text();
    const chunks = [...new Set(html.match(/\/_next\/static\/chunks\/[\w-]+\.js/g) || [])];
    let vazou = [];
    for (const c of chunks) {
      const js = await (await fetch(BASE + c)).text();
      for (const re of [/sk_(live|test)_[A-Za-z0-9]{10,}/, /sb_secret_[A-Za-z0-9_-]{10,}/, /service_role/, /whsec_[A-Za-z0-9]{10,}/, /OPENAI_API_KEY\s*[:=]\s*["'][^"']+/]) if (re.test(js)) vazou.push(`${c}:${re}`);
    }
    ok('SEC-03', 'nenhum segredo nos chunks da Home', vazou.length === 0, vazou.join(', '));
  }
} catch (e) {
  ok('ERRO', `fluxo interrompido: ${e.message.split('\n')[0]}`, false);
}
await b.close();
const falhas = passos.filter((x) => !x.ok).length;
console.log(`\n${passos.length - falhas}/${passos.length} passos OK`);
fs.writeFileSync(path.join(OUT, 'resultado.json'), JSON.stringify({ quando: new Date().toISOString(), base: BASE, passos }, null, 2));
process.exit(falhas ? 1 : 0);
