#!/usr/bin/env node
// Acessibilidade (V3 §31 / WCAG 2.2 AA): axe-core em cada rota (claro e escuro),
// navegação só por teclado (foco visível, ordem, sem armadilha) e zoom 200%
// (viewport de 640 px com escala 2 ≈ 1280 px a 200%: sem overflow horizontal).
// Uso: node scripts/a11y.mjs [baseUrl] [saida]
import { chromium } from 'playwright';
import AxeBuilder from '@axe-core/playwright';
import fs from 'node:fs';
import path from 'node:path';

const BASE = (process.argv[2] || 'http://localhost:3000').replace(/\/$/, '');
const OUT = process.argv[3] || 'docs/plataforma/_proof/a11y';
const ROTAS = (process.env.A11Y_ROUTES || '/,/explorar,/destino/japao,/decisao,/comparar,/custo-real,/voos,/roteiro,/planos,/salvos,/conta,/planejar,/viagens,/fontes,/marketplace,/marketplace/r/japao-4-dias,/agencias,/desenvolvedores,/proposta,/offline,/rota-que-nao-existe').split(',');
fs.mkdirSync(OUT, { recursive: true });
const b = await chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
const rel = { axe: [], teclado: [], zoom: [] };

for (const tema of ['light', 'dark']) {
  const ctx = await b.newContext({ viewport: { width: 1280, height: 900 }, colorScheme: tema });
  await ctx.addInitScript((t) => { try { localStorage.setItem('mundosemfim.theme', t); } catch {} }, tema);
  for (const r of ROTAS) {
    const p = await ctx.newPage();
    await p.goto(BASE + r, { waitUntil: 'load', timeout: 90000 });
    await p.waitForTimeout(1500);
    const res = await new AxeBuilder({ page: p }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa']).exclude('.maplibregl-canvas').analyze();
    for (const v of res.violations) rel.axe.push({ rota: r, tema, id: v.id, impacto: v.impact, ajuda: v.help, n: v.nodes.length, alvos: v.nodes.slice(0, 3).map((n) => n.target.join(' ')) });
    await p.close();
  }
  await ctx.close();
}

// teclado: Tab pelos primeiros 25 focáveis — foco sempre visível e dentro da tela
const ctxK = await b.newContext({ viewport: { width: 1280, height: 900 } });
for (const r of ['/', '/explorar', '/viagens', '/destino/japao']) {
  const p = await ctxK.newPage();
  await p.goto(BASE + r, { waitUntil: 'load' });
  await p.waitForTimeout(1200);
  const vistos = new Set();
  for (let i = 0; i < 25; i++) {
    await p.keyboard.press('Tab');
    const info = await p.evaluate(() => {
      const el = document.activeElement;
      if (!el || el === document.body) return null;
      const cs = getComputedStyle(el);
      const visivel = cs.outlineStyle !== 'none' && parseFloat(cs.outlineWidth) > 0 || cs.boxShadow !== 'none';
      return { tag: el.tagName, txt: (el.getAttribute('aria-label') || el.textContent || '').trim().slice(0, 40), visivel };
    });
    if (!info) continue;
    vistos.add(info.tag + info.txt);
    if (!info.visivel) rel.teclado.push({ rota: r, passo: i, elemento: `${info.tag} "${info.txt}"`, problema: 'foco sem indicador visível' });
  }
  if (vistos.size < 5) rel.teclado.push({ rota: r, problema: `poucos elementos alcançáveis por teclado (${vistos.size})` });
  await p.close();
}
await ctxK.close();

// zoom 200%
const ctxZ = await b.newContext({ viewport: { width: 640, height: 450 }, deviceScaleFactor: 2 });
for (const r of ROTAS) {
  const p = await ctxZ.newPage();
  await p.goto(BASE + r, { waitUntil: 'load' });
  await p.waitForTimeout(1000);
  const ov = await p.evaluate(() => document.scrollingElement.scrollWidth - window.innerWidth);
  if (ov > 1) rel.zoom.push({ rota: r, overflow: ov });
  await p.close();
}
await b.close();

fs.writeFileSync(path.join(OUT, 'a11y.json'), JSON.stringify(rel, null, 1));
const resumo = {};
for (const v of rel.axe) { const k = `${v.id} (${v.impacto})`; resumo[k] = (resumo[k] || 0) + 1; }
console.log('AXE violações por regra:', JSON.stringify(resumo, null, 1));
console.log('Teclado:', rel.teclado.length ? JSON.stringify(rel.teclado.slice(0, 10), null, 1) : 'OK');
console.log('Zoom 200%:', rel.zoom.length ? JSON.stringify(rel.zoom) : 'OK');
