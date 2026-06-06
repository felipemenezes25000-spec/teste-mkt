// FlightScoreCard — o voo mais barato não é o melhor voo. Esta UI calcula um
// score 0-100 a partir de preço, duração, escalas, horário de chegada e
// proporção do orçamento — e traduz para o brasileiro que está prestes a errar.
//
// Função PURA (calcScoreVoo) → testável. Sem render no engine.

const HORA_BOA_MIN = 8;   // janela ótima de chegada: 08-19h (ainda salva o dia)
const HORA_BOA_MAX = 19;

// Recebe { preco, duracao, escalas, chegada, bagagem, orcamentoTotalBRL, taxaBRL }
// e retorna { score, breakdown, recomendacao, alerta }.
export function calcScoreVoo(v, ctx = {}) {
  const taxa = Number(ctx.taxaBRL) || 5.4;
  const orcamento = Number(ctx.orcamentoTotalBRL) || 0;
  const duracaoHoras = Number(String(v.duracao || '').match(/\d+/)?.[0] || 0);
  const escalas = Number(v.escalas) || 0;
  const horaChegada = parseHora(v.chegada);
  const horaPartida = parseHora(v.partida);
  const precoUSD = Number(v.preco) || 0;
  const custoBRL = precoUSD * taxa;
  const pesoOrcamento = orcamento > 0 ? custoBRL / orcamento : 0.4;
  const bagagem = v.bagagem === true;

  // Preço (35 pts) — quanto maior o peso no orçamento, menos pontos.
  // Ponto cego: preço caro mas dentro do orçamento ainda perde pontos por valor absoluto.
  const precoScore = clamp(35 - pesoOrcamento * 60, 0, 35);

  // Duração (20 pts) — até 14h ótimo; >24h come o primeiro dia.
  const duracaoScore = duracaoHoras <= 14 ? 20 : duracaoHoras >= 30 ? 0 : 20 - ((duracaoHoras - 14) / 16) * 20;

  // Escalas (15 pts) — direto = 15; 1 escala = 10; 2 = 4; 3+ = 0.
  const escalasScore = escalas === 0 ? 15 : escalas === 1 ? 10 : escalas === 2 ? 4 : 0;

  // Horário de chegada (20 pts) — entre 08-19h preserva o primeiro dia; madrugada destrói.
  let chegadaScore = 20;
  if (horaChegada != null) {
    if (horaChegada >= HORA_BOA_MIN && horaChegada <= HORA_BOA_MAX) chegadaScore = 20;
    else if (horaChegada >= 6 && horaChegada < 8) chegadaScore = 14;
    else if (horaChegada > 19 && horaChegada <= 22) chegadaScore = 12;
    else if (horaChegada > 22 || horaChegada < 6) chegadaScore = 4; // madrugada
  }

  // Bagagem (10 pts) — incluída = 10; cobrança = 4.
  const bagagemScore = bagagem ? 10 : 4;

  const score = Math.round(clamp(precoScore + duracaoScore + escalasScore + chegadaScore + bagagemScore, 0, 100));

  // Recomendação humana — uma frase prescritiva, com o "porquê" mais forte.
  let recomendacao = '';
  let alerta = null;
  let tom = 'neutro';

  if (escalas >= 2 || duracaoHoras >= 28) {
    tom = 'ruim';
    alerta = 'Barato, mas destrói o primeiro dia.';
    recomendacao = `Economia de passagem que cobra ${duracaoHoras}h em trânsito${escalas >= 2 ? ' e ' + escalas + ' escalas' : ''}.`;
  } else if (horaChegada != null && (horaChegada > 22 || horaChegada < 6)) {
    tom = 'alerta';
    alerta = 'Chega de madrugada — perde o primeiro dia.';
    recomendacao = 'Se ainda dá pra trocar por um voo que chega de tarde, vale o adicional.';
  } else if (pesoOrcamento > 0.45) {
    tom = 'alerta';
    alerta = 'Voo domina o orçamento.';
    recomendacao = 'O voo come quase metade do que você tem para a viagem inteira. Só vale se o destino render muito no chão.';
  } else if (score >= 75) {
    tom = 'bom';
    recomendacao = 'Melhor custo-benefício: chega em horário civilizado, escalas tratáveis e preço razoável.';
  } else if (score >= 55) {
    tom = 'neutro';
    recomendacao = 'Boa leitura prática: preço, escalas e duração equilibrados.';
  } else {
    tom = 'alerta';
    recomendacao = 'Atenção: combinação de horário, escalas e preço cobra do primeiro dia.';
  }

  return {
    score,
    tom,
    alerta,
    recomendacao,
    breakdown: {
      preco: Math.round(precoScore),
      duracao: Math.round(duracaoScore),
      escalas: escalasScore,
      chegada: chegadaScore,
      bagagem: bagagemScore,
      pesoOrcamento: Math.round(pesoOrcamento * 100),
      horaChegada,
      horaPartida,
    },
  };
}

function clamp(v, min, max) { return Math.max(min, Math.min(max, v)); }
function parseHora(s) {
  if (!s) return null;
  const m = String(s).match(/(\d{1,2})[:h](\d{2})?/);
  if (!m) return null;
  return Number(m[1]);
}

const TOM_UI = {
  bom: { borda: 'border-success-bd', cls: 'bg-success-bg text-success', label: 'Recomendado', icon: '✅' },
  neutro: { borda: 'border-line', cls: 'bg-paper2 text-ink', label: 'OK', icon: '➡️' },
  alerta: { borda: 'border-warn-bd', cls: 'bg-warn-bg text-warn', label: 'Atenção', icon: '⚠️' },
  ruim: { borda: 'border-danger-bd', cls: 'bg-danger-bg text-danger', label: 'Evite', icon: '⛔' },
};

export function FlightScoreCard({ voo, ctx, destaque = false }) {
  const { score, tom, alerta, recomendacao, breakdown } = calcScoreVoo(voo, ctx);
  const ui = TOM_UI[tom] || TOM_UI.neutro;
  const escalasTxt = voo.escalas === 0 ? 'Direto' : `${voo.escalas} escala${voo.escalas > 1 ? 's' : ''}`;
  const bagagemTxt = voo.bagagem ? 'bagagem inclusa' : 'sem bagagem';

  return (
    <article className={`rounded-2xl border bg-card overflow-hidden ${destaque ? 'border-pine ring-1 ring-pine/20 shadow-[var(--e-1)]' : 'border-line'}`}>
      <div className="p-4 sm:p-5 flex flex-wrap items-start gap-x-5 gap-y-3">
        <div className="w-32 sm:w-36 shrink-0">
          <div className="font-semibold text-ink">{voo.companhia || 'Companhia'}</div>
          {destaque && <span className="text-[11px] font-bold text-pine">Melhor custo-benefício</span>}
        </div>
        <div className="text-sm text-ink tnum">{voo.partida} → {voo.chegada}</div>
        <div className="text-xs text-inksoft">{voo.duracao}</div>
        <div className="text-xs text-inksoft">{escalasTxt}</div>
        <div className="text-xs text-inksoft">{bagagemTxt}</div>
        <div className="ml-auto text-right">
          <div className="font-display text-2xl text-ink tnum">US$ {voo.preco}</div>
          <div className="text-[11px] text-inksoft tnum">{breakdown.pesoOrcamento}% do orçamento</div>
        </div>
        <div className="w-full sm:w-auto sm:ml-auto sm:pl-3 flex sm:flex-col items-center gap-2 sm:gap-0.5">
          <span className={`tnum font-display text-3xl ${tom === 'ruim' ? 'text-danger' : tom === 'alerta' ? 'text-warn' : 'text-pine'}`}>{score}</span>
          <span className="text-[10px] uppercase tracking-wider text-inksoft font-bold">/100</span>
        </div>
      </div>

      <div className={`px-4 sm:px-5 py-3 border-t ${ui.borda} ${ui.cls}`}>
        <div className="flex items-center gap-2 text-sm">
          <span aria-hidden>{ui.icon}</span>
          <strong>{ui.label}:</strong>
          <span>{alerta || recomendacao}</span>
        </div>
        {alerta && (
          <p className="mt-1 text-xs opacity-90">{recomendacao}</p>
        )}
      </div>

      <details className="border-t border-line">
        <summary className="px-4 sm:px-5 py-2 text-xs text-inksoft font-medium cursor-pointer hover:text-ink focusring">
          Como calculamos esse score?
        </summary>
        <div className="px-4 sm:px-5 pb-3 text-[11px] text-inksoft">
          Preço {breakdown.preco}/35 · Duração {breakdown.duracao}/20 · Escalas {breakdown.escalas}/15 · Horário {breakdown.chegada}/20 · Bagagem {breakdown.bagagem}/10.
          Chegar entre 8 e 19h dá os 20 pontos completos; madrugada zera essa fatia.
        </div>
      </details>
    </article>
  );
}
