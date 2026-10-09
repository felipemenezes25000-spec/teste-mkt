// Fase 2: (a) {x.icon} / {CAT_ICON[k] || '📍'} / {cond ? '♥' : '♡'} como FILHO JSX → <Icon emoji={…} />
// (b) strings/templates com emoji + texto (rótulos) → emoji removido.
import { parse } from '@babel/parser';
import fs from 'node:fs';
import path from 'node:path';

const RE = /(?:[\p{Extended_Pictographic}←-⇿✓✔✕★☰☾][️]?(?:‍[\p{Extended_Pictographic}][️]?)*)/gu;
const tem = (s) => { RE.lastIndex = 0; const r = RE.test(s); RE.lastIndex = 0; return r; };
const soEmoji = (s) => s.replace(RE, '').trim() === '' && tem(s);
const limpa = (s) => s.replace(RE, '').replace(/^\s+/, '').replace(/\s{2,}/g, ' ');
let total = 0;

function walk(n, fn, pai = null, chave = null) {
  if (!n || typeof n.type !== 'string') return;
  fn(n, pai, chave);
  for (const k of Object.keys(n)) {
    if (['loc', 'start', 'end', 'extra'].includes(k)) continue;
    const v = n[k];
    if (Array.isArray(v)) v.forEach((x) => x && typeof x.type === 'string' && walk(x, fn, n, k));
    else if (v && typeof v.type === 'string') walk(v, fn, n, k);
  }
}

for (const f of process.argv.slice(2)) {
  const src = fs.readFileSync(f, 'utf8');
  let ast;
  try { ast = parse(src, { sourceType: 'module', plugins: ['jsx'] }); } catch (e) { console.error('pulei', f, e.message); continue; }
  const edits = [];
  const ocupado = [];
  const dentro = (s, e) => ocupado.some(([a, b]) => s >= a && e <= b);
  walk(ast.program, (n, pai, chave) => {
    // (a) expressão de ícone como filho de JSX
    if (n.type === 'JSXExpressionContainer' && pai && (pai.type === 'JSXElement' || pai.type === 'JSXFragment') && chave === 'children') {
      const ex = src.slice(n.expression.start, n.expression.end);
      const ehIcone = /\b(icon|icone|emoji|CAT_ICON|ICON|ICONE)\b/.test(ex) && !/[<]/.test(ex) && !/\bIcon\b/.test(ex);
      const ternEmoji = n.expression.type === 'ConditionalExpression'
        && n.expression.consequent.type === 'StringLiteral' && n.expression.alternate.type === 'StringLiteral'
        && soEmoji(n.expression.consequent.value) && soEmoji(n.expression.alternate.value);
      if (ehIcone || ternEmoji) {
        edits.push([n.start, n.end, `<Icon emoji={${ex}} />`]);
        ocupado.push([n.start, n.end]);
      }
    }
  });
  walk(ast.program, (n, pai, chave) => {
    if (dentro(n.start, n.end)) return;
    if (pai && pai.type === 'ImportDeclaration') return;
    // chave do objeto é icon/icone → valor é ícone puro: mantém
    if (n.type === 'StringLiteral' && tem(n.value)) {
      if (soEmoji(n.value)) return; // ícone puro (renderizado via <Icon emoji>)
      const raw = src.slice(n.start, n.end);
      const q = raw[0];
      edits.push([n.start, n.end, q + limpa(raw.slice(1, -1)) + q]);
    }
    if (n.type === 'TemplateElement' && tem(n.value.raw)) {
      edits.push([n.start, n.end, limpa(n.value.raw)]);
    }
  });
  if (!edits.length) continue;
  edits.sort((a, b) => b[0] - a[0]);
  let out = src;
  for (const [s, e, t] of edits) out = out.slice(0, s) + t + out.slice(e);
  if (out.includes('<Icon ') && !/import\s*\{[^}]*\bIcon\b[^}]*\}\s*from/.test(out)) {
    const rel = path.relative(path.dirname(f), path.resolve('app/_ui/Icon.jsx')).split(path.sep).join('/');
    const linhas = out.split('\n');
    let idx = 0;
    for (let i = 0; i < linhas.length; i++) { if (/^import\s/.test(linhas[i]) || /^['"]use client['"]/.test(linhas[i])) idx = i + 1; else if (linhas[i].trim() && !/^\/\//.test(linhas[i]) && idx) break; }
    linhas.splice(idx, 0, `import { Icon } from '${rel.startsWith('.') ? rel : './' + rel}';`);
    out = linhas.join('\n');
  }
  fs.writeFileSync(f, out);
  total += edits.length;
  console.log(`${String(edits.length).padStart(4)}  ${f}`);
}
console.log('total:', total);
