#!/usr/bin/env node
// QA tela a tela (OMEGA V4 §10/§45): percorre as rotas em várias larguras e nos
// temas claro/escuro, coletando erros de console, exceções, requests falhos,
// overflow horizontal e imagens quebradas. Gera screenshots + JSON + resumo.
//
// Uso:  node scripts/qa-telas.mjs [baseUrl] [saida]
//   baseUrl  padrão http://localhost:3000
//   saida    padrão docs/plataforma/_proof/qa-<timestamp>   (pasta ignorada pelo git)
// Flags por env: QA_WIDTHS="390,1440"  QA_ROUTES="/,/explorar"  QA_FULL=1 (full page em todas)
import { chromium, firefox, webkit } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';

const BASE = (process.argv[2] || 'http://localhost:3000').replace(/\/$/, '');
const OUT = process.argv[3] || path.join('docs/plataforma/_proof', 'qa-' + new Date().toISOString().replace(/[:.]/g, '-'));
const WIDTHS = (process.env.QA_WIDTHS || '320,390,768,1024,1280,1440,1920').split(',').map(Number);
const FULL_AT = new Set([390, 1440]);
const DEFAULT_ROUTES = [
  '/', '/explorar', '/destino/japao', '/destino/tailandia', '/destino/italia', '/destino/brasil',
  '/decisao', '/comparar', '/custo-real', '/roteiro', '/voos', '/planos', '/salvos', '/conta',
  '/planejar', '/viagens', '/fontes', '/marketplace', '/marketplace/r/japao-4-dias', '/agencias', '/desenvolvedores', '/proposta', '/offline', '/rota-que-nao-existe',
];
const ROUTES = process.env.QA_ROUTES ? process.env.QA_ROUTES.split(',') : DEFAULT_ROUTES;
const THEMES = (process.env.QA_THEMES || 'light,dark').split(',');

// Ruído conhecido de terceiros que não indica bug do app.
const IGNORAR = [/Download the React DevTools/i, /\[HMR\]/i, /Fast Refresh/i];
const ROTA_404 = '/rota-que-nao-existe'; // 404 esperado: o recurso 404 é a própria página

fs.mkdirSync(OUT, { recursive: true });
const slug = (r) => (r === '/' ? 'home' : r.replace(/^\//, '').replace(/[/?=&]/g, '_'));

// QA_BROWSER=chromium|firefox|webkit (WebKit = motor do Safari)
const NAV = process.env.QA_BROWSER || 'chromium';
const browser = NAV === 'firefox' ? await firefox.launch() : NAV === 'webkit' ? await webkit.launch()
  : await chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
const resultados = [];

for (const theme of THEMES) {
  for (const width of WIDTHS) {
    const height = width <= 430 ? 844 : 900;
    const ctx = await browser.newContext({ viewport: { width, height }, colorScheme: theme, deviceScaleFactor: 1 });
    // O app lê o tema de localStorage ('mundosemfim.theme') antes do paint.
    await ctx.addInitScript((t) => { try { localStorage.setItem('mundosemfim.theme', t); } catch {} }, theme);
    for (const rota of ROUTES) {
      const page = await ctx.newPage();
      const r = { rota, width, theme, console: [], pageErrors: [], failed: [], status: null };
      page.on('console', (m) => {
        if (m.type() === 'error' || m.type() === 'warning') {
          const t = m.text();
          if (rota === ROTA_404 && /status of 404/.test(t)) return;
          if (!IGNORAR.some((re) => re.test(t))) r.console.push(`${m.type()}: ${t.slice(0, 300)}`);
        }
      });
      page.on('pageerror', (e) => r.pageErrors.push(String(e.message || e).slice(0, 300)));
      page.on('requestfailed', (q) => {
        const err = q.failure()?.errorText || '';
        if (!/ERR_ABORTED|cancelled|NS_BINDING_ABORTED/i.test(err)) r.failed.push(`${err} ${q.url().slice(0, 160)}`);
      });
      page.on('response', (s) => { if (s.status() >= 400 && !s.url().endsWith('/rota-que-nao-existe')) r.failed.push(`${s.status()} ${s.url().slice(0, 160)}`); });
      try {
        const resp = await page.goto(BASE + rota, { waitUntil: 'load', timeout: 60000 });
        r.status = resp ? resp.status() : null;
        await page.waitForTimeout(1200);
        // rola até o fim para disparar lazy-load, volta ao topo
        await page.evaluate(async () => {
          const h = document.scrollingElement.scrollHeight;
          for (let y = 0; y < h; y += 700) { window.scrollTo(0, y); await new Promise((x) => setTimeout(x, 60)); }
          window.scrollTo(0, 0);
        });
        await page.waitForTimeout(800);
        Object.assign(r, await page.evaluate(() => {
          const vw = window.innerWidth;
          const sw = document.scrollingElement.scrollWidth;
          const culpados = [];
          if (sw > vw + 1) {
            for (const el of document.querySelectorAll('body *')) {
              const b = el.getBoundingClientRect();
              if (b.right > vw + 1 && b.width > 0 && getComputedStyle(el).position !== 'fixed') {
                const id = el.tagName.toLowerCase() + (el.id ? '#' + el.id : '') + (typeof el.className === 'string' && el.className ? '.' + el.className.split(' ').slice(0, 3).join('.') : '');
                culpados.push(`${id} right=${Math.round(b.right)}`);
                if (culpados.length > 5) break;
              }
            }
          }
          const imgs = [...document.images];
          const quebradas = imgs.filter((i) => i.complete && i.naturalWidth === 0 && i.getAttribute('src')).map((i) => i.currentSrc || i.src).slice(0, 10);
          const semAlt = imgs.filter((i) => !i.hasAttribute('alt')).length;
          const hosts = [...new Set(imgs.map((i) => { try { return new URL(i.currentSrc || i.src).host; } catch { return ''; } }).filter(Boolean))];
          return { overflow: sw > vw + 1 ? sw - vw : 0, culpados, imagens: imgs.length, quebradas, semAlt, hosts, titulo: document.title, h1: (document.querySelector('h1')?.textContent || '').trim().slice(0, 120) };
        }));
        const full = process.env.QA_FULL === '1' || FULL_AT.has(width);
        await page.screenshot({ path: path.join(OUT, `${slug(rota)}__${width}__${theme}.png`), fullPage: full });
      } catch (e) {
        r.pageErrors.push('NAVEGACAO: ' + String(e.message || e).slice(0, 200));
      }
      resultados.push(r);
      await page.close();
    }
    await ctx.close();
  }
}
await browser.close();

fs.writeFileSync(path.join(OUT, 'qa.json'), JSON.stringify(resultados, null, 1));
const problemas = resultados.filter((r) => r.pageErrors.length || r.console.length || r.overflow || r.quebradas?.length || (r.status >= 500) || (r.status === 404 && r.rota !== '/rota-que-nao-existe') || r.failed.length);
const linhas = problemas.map((r) => `- ${r.rota} @${r.width} ${r.theme}: status=${r.status}` +
  (r.overflow ? ` overflow=${r.overflow}px [${r.culpados.join('; ')}]` : '') +
  (r.pageErrors.length ? ` EXCEÇÕES=${JSON.stringify(r.pageErrors)}` : '') +
  (r.console.length ? ` console=${JSON.stringify(r.console.slice(0, 3))}` : '') +
  (r.quebradas?.length ? ` imgsQuebradas=${JSON.stringify(r.quebradas.slice(0, 3))}` : '') +
  (r.failed.length ? ` falhas=${JSON.stringify([...new Set(r.failed)].slice(0, 3))}` : ''));
const resumo = `# QA tela a tela — ${new Date().toISOString()}\nBase: ${BASE}\nCombinações: ${resultados.length} (rotas ${ROUTES.length} × larguras ${WIDTHS.join('/')} × temas ${THEMES.join('/')})\nCom problema: ${problemas.length}\n\n${linhas.join('\n') || 'Nenhum problema detectado.'}\n`;
fs.writeFileSync(path.join(OUT, 'RESUMO.md'), resumo);
console.log(resumo.slice(0, 6000));
console.log('Saída:', OUT);
process.exit(0);
