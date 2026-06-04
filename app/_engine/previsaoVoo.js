/* =============================================================================
   PREVISÃO DE VOO — "comprar agora ou esperar?"
   ---------------------------------------------------------------------------
   O único moat defensável do Hopper. Gera uma curva de preço DETERMINÍSTICA por
   rota (sem Math.random — mesma rota = mesma curva) e dá um veredito acionável.
   Hoje roda sobre a faixa do provider mock; quando a Skyscanner/Kiwi for plugada
   no seam buscarVoos(), a MESMA função roda sobre preços reais. Função PURA.
   ========================================================================== */

// PRNG seeded (idêntico em espírito ao de flights.js) — determinístico.
function hash(str) {
  let h = 2166136261;
  for (let i = 0; i < String(str).length; i++) { h ^= String(str).charCodeAt(i); h = Math.imul(h, 16777619); }
  return h >>> 0;
}
function rng(seed) {
  return function () {
    seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Curva de preço dos próximos `dias` para uma rota, dentro de uma faixa {min,max}.
// Determinística por rota → o veredito é estável e auditável.
export function curvaPreco(rota, faixa, dias = 30) {
  const min = Math.max(20, Number(faixa && faixa.min) || 120);
  const max = Math.max(min + 20, Number(faixa && faixa.max) || 700);
  const base = (min + max) / 2;
  const amp = (max - min) / 2;
  const r = rng(hash(rota || 'rota'));
  const fase = r() * Math.PI * 2;
  const ciclos = 1.2 + r() * 1.6; // 1–3 ondas no período
  const out = [];
  for (let i = 0; i < dias; i++) {
    const onda = Math.sin((i / dias) * Math.PI * 2 * ciclos + fase);
    const ruido = (r() - 0.5) * 0.18; // pequeno jitter determinístico
    let preco = base + amp * onda * (0.55 + 0.45 * r()) + base * ruido;
    preco = Math.max(min * 0.85, Math.round(preco / 5) * 5);
    out.push({ dia: i, preco });
  }
  return out;
}

// Veredito acionável a partir da curva e do preço atual (o mais barato achado hoje).
export function vereditoCompra(curva, precoAtual) {
  if (!Array.isArray(curva) || curva.length === 0) return null;
  const atual = Number(precoAtual) || curva[0].preco;
  let min = curva[0];
  for (const p of curva) if (p.preco < min.preco) min = p;
  const economia = Math.max(0, atual - min.preco);
  const pctEconomia = atual > 0 ? economia / atual : 0;

  let acao, texto, confianca;
  if (atual <= min.preco * 1.03) {
    acao = 'comprar';
    texto = 'O preço está perto da mínima do período. Comprar agora é uma boa.';
    confianca = 'alta';
  } else if (pctEconomia >= 0.08) {
    acao = 'esperar';
    texto = `Tende a cair ~${Math.round(pctEconomia * 100)}% por volta do dia ${min.dia + 1}. Vale esperar.`;
    confianca = pctEconomia >= 0.15 ? 'alta' : 'média';
  } else {
    acao = 'estavel';
    texto = 'Preço estável no período — sem vantagem clara em esperar.';
    confianca = 'média';
  }
  return { acao, texto, confianca, melhorDia: min.dia, melhorPreco: min.preco, economia };
}
