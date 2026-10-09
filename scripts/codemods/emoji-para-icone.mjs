// Codemod: emojis em TEXTO JSX → <Icon emoji="…" />; emojis em atributos de texto
// (title/aria-label/alt/placeholder) são removidos. Usa @babel/parser só para achar
// os intervalos; a edição é por offset → formatação original preservada.
import { parse } from '@babel/parser';
import fs from 'node:fs';
import path from 'node:path';

const RE = /(?:[\p{Extended_Pictographic}←-⇿✓✔✕★☰☾][️]?(?:‍[\p{Extended_Pictographic}][️]?)*)/gu;
const ATTRS = new Set(['title', 'aria-label', 'alt', 'placeholder']);
const arquivos = process.argv.slice(2);
let total = 0;

function walk(n, fn) {
  if (!n || typeof n.type !== 'string') return;
  fn(n);
  for (const k of Object.keys(n)) {
    if (k === 'loc' || k === 'start' || k === 'end' || k === 'extra') continue;
    const v = n[k];
    if (Array.isArray(v)) v.forEach((x) => x && typeof x.type === 'string' && walk(x, fn));
    else if (v && typeof v.type === 'string') walk(v, fn);
  }
}

for (const f of arquivos) {
  const src = fs.readFileSync(f, 'utf8');
  let ast;
  try { ast = parse(src, { sourceType: 'module', plugins: ['jsx'] }); } catch (e) { console.error('pulei', f, e.message); continue; }
  const edits = [];
  walk(ast.program, (n) => {
    if (n.type === 'JSXText' && RE.test(n.value)) {
      RE.lastIndex = 0;
      const novo = n.value.replace(RE, (m) => `<Icon emoji="${m}" />`);
      edits.push([n.start, n.end, novo]);
    }
    if (n.type === 'JSXAttribute' && n.value && n.value.type === 'StringLiteral' && ATTRS.has(n.name.name) && RE.test(n.value.value)) {
      RE.lastIndex = 0;
      const limpo = n.value.value.replace(RE, '').replace(/\s{2,}/g, ' ').trim();
      edits.push([n.value.start, n.value.end, JSON.stringify(limpo)]);
    }
    // {'🔒'} ou {"⚠️"} soltos entre filhos JSX
    if (n.type === 'JSXExpressionContainer' && n.expression && n.expression.type === 'StringLiteral' && RE.test(n.expression.value)) {
      RE.lastIndex = 0;
      const v = n.expression.value;
      const so = v.replace(RE, '').trim() === '';
      edits.push([n.start, n.end, so ? `<Icon emoji="${v.trim()}" />` : `{${JSON.stringify(v.replace(RE, '').trim())}}`]);
    }
    RE.lastIndex = 0;
  });
  if (!edits.length) continue;
  edits.sort((a, b) => b[0] - a[0]);
  let out = src;
  for (const [s, e, t] of edits) out = out.slice(0, s) + t + out.slice(e);
  if (!/import\s*\{[^}]*\bIcon\b[^}]*\}\s*from\s*['"][^'"]*_ui\/Icon(\.jsx)?['"]/.test(out) && out.includes('<Icon ')) {
    const rel = path.relative(path.dirname(f), path.resolve('app/_ui/Icon.jsx')).split(path.sep).join('/');
    const imp = `import { Icon } from '${rel.startsWith('.') ? rel : './' + rel}';\n`;
    // depois de 'use client' e/ou do último import
    const linhas = out.split('\n');
    let idx = 0;
    for (let i = 0; i < linhas.length; i++) { if (/^import\s/.test(linhas[i]) || /^['"]use client['"]/.test(linhas[i])) idx = i + 1; else if (linhas[i].trim() && !/^\/\//.test(linhas[i]) && idx) break; }
    linhas.splice(idx, 0, imp.trimEnd());
    out = linhas.join('\n');
  }
  fs.writeFileSync(f, out);
  total += edits.length;
  console.log(`${edits.length.toString().padStart(4)}  ${f}`);
}
console.log('total de edições:', total);
