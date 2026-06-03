import { MESES_PT } from './data.js';
import { parseDate, addDays, diffDays, num, converter } from './utils.js';

// Quais meses (1..12) a estadia atravessa, dado a chegada e os dias planejados.
function mesesAtravessados(chegada, dias) {
  const set = new Set();
  const total = Math.max(1, dias);
  for (let i = 0; i < total; i++) set.add(addDays(chegada, i).getMonth() + 1);
  return set;
}

// ESTAÇÃO: bom = chega na boa estação · parcial = pega só parte · ruim = tudo fora · na = sem dado.
export function statusEstacao(chegada, dias, melhoresMeses) {
  if (!melhoresMeses || melhoresMeses.length === 0) return { nivel: 'na', texto: 'Sem dados de estação — preencha em "Ajustes".' };
  const mesChegada = chegada.getMonth() + 1;
  const atravessa = mesesAtravessados(chegada, dias);
  const chegaBem = melhoresMeses.includes(mesChegada);
  let pegaParte = false;
  for (const m of atravessa) { if (melhoresMeses.includes(m)) { pegaParte = true; break; } }
  const janela = melhoresMeses.map(m => MESES_PT[m - 1]).join(', ');
  if (chegaBem) return { nivel: 'bom', texto: `Chega em ${MESES_PT[mesChegada - 1]}, dentro da melhor época (${janela}).` };
  if (pegaParte) return { nivel: 'parcial', texto: `Chega em ${MESES_PT[mesChegada - 1]} (fora do ideal), mas a estadia pega parte da boa época (${janela}).` };
  return { nivel: 'ruim', texto: `Estadia inteira fora da melhor época. Ideal: ${janela}. Você chega em ${MESES_PT[mesChegada - 1]}.` };
}

// VISTO: dias planejados x permitidos. Vermelho se ultrapassar.
export function statusVisto(dias, vistoDias) {
  if (!vistoDias || vistoDias <= 0) return { nivel: 'na', texto: 'Sem limite preenchido.' };
  if (dias > vistoDias) return { nivel: 'over', excesso: dias - vistoDias, texto: `Ultrapassa o visto em ${dias - vistoDias} dia(s) (limite ${vistoDias}).` };
  return { nivel: 'ok', folga: vistoDias - dias, texto: `Dentro do limite: ${dias}/${vistoDias} dias (folga de ${vistoDias - dias}).` };
}

// Recalcula TUDO. Cada trecho guarda seus custos na PRÓPRIA moeda; aqui convertemos
// para a moeda base (settings.moedaBase) usando as taxas de câmbio, e todos os
// totais, orçamento e fôlego ficam na moeda base.
export function calcular(plan) {
  const base = plan.settings.moedaBase || 'USD';
  const rates = (plan.settings.fx && plan.settings.fx.rates) || { USD: 1 };
  const inicio = parseDate(plan.settings.dataInicio);
  let cursor = new Date(inicio);

  const trechos = plan.legs.map((leg) => {
    const dias = Math.max(0, Math.round(num(leg.dias)));
    const chegada = new Date(cursor);
    const saida = addDays(chegada, dias);
    cursor = saida;

    const moeda = leg.moeda || base;
    const efetivoNativo = Math.max(0, num(leg.custoDia) - num(leg.economiaDia)); // vida/dia na moeda do trecho
    const custoEfetivoDia = converter(efetivoNativo, moeda, base, rates);         // → base
    const custoTerra = dias * custoEfetivoDia;
    const custoTransporte = converter(Math.max(0, num(leg.transporte)), moeda, base, rates);
    const custoTrecho = custoTerra + custoTransporte;

    return {
      ...leg, dias, chegada, saida, moeda,
      mesChegada: chegada.getMonth() + 1,
      custoEfetivoDia, custoTerra, custoTransporte, custoTrecho,
      estacao: statusEstacao(chegada, dias, leg.melhoresMeses),
      visto: statusVisto(dias, leg.vistoDias),
    };
  });

  let acc = 0;
  trechos.forEach(t => { acc += t.custoTrecho; t.acumulado = acc; });

  const custoTotal = acc;
  const custoTerraTotal = trechos.reduce((s, t) => s + t.custoTerra, 0);
  const custoTransporteTotal = trechos.reduce((s, t) => s + t.custoTransporte, 0);
  const diasTotais = trechos.reduce((s, t) => s + t.dias, 0);
  const fimViagem = trechos.length ? trechos[trechos.length - 1].saida : new Date(inicio);
  const mediaDia = diasTotais > 0 ? custoTerraTotal / diasTotais : 0;
  const orcamento = num(plan.settings.orcamento);

  // FÔLEGO ("runway"): caminha trecho a trecho. Em cada país gasta primeiro o
  // transporte (custo único na chegada) e depois o custo diário de vida.
  let restante = orcamento;
  let dataQuebra = null, trechoQuebraId = null;
  for (const t of trechos) {
    if (dataQuebra) break;
    if (restante >= t.custoTransporte) {
      restante -= t.custoTransporte;
    } else {
      dataQuebra = new Date(t.chegada); trechoQuebraId = t.id; restante = 0; break;
    }
    if (restante >= t.custoTerra) {
      restante -= t.custoTerra;
    } else {
      const diasBancaveis = t.custoEfetivoDia > 0 ? Math.floor(restante / t.custoEfetivoDia) : t.dias;
      dataQuebra = addDays(t.chegada, diasBancaveis); trechoQuebraId = t.id;
      restante -= diasBancaveis * t.custoEfetivoDia;
    }
  }

  const ratio = orcamento > 0 ? custoTotal / orcamento : Infinity;
  let nivel;
  if (orcamento <= 0) nivel = 'vermelho';
  else if (ratio <= 0.85) nivel = 'verde';
  else if (ratio <= 1.0) nivel = 'amarelo';
  else nivel = 'vermelho';

  let folego;
  if (!dataQuebra) {
    const sobra = orcamento - custoTotal;
    const diasExtras = mediaDia > 0 ? Math.floor(sobra / mediaDia) : 0;
    folego = { cobreTudo: true, sobra, diasExtras, fimViagem, nivel, ratio };
  } else {
    const falta = custoTotal - orcamento;
    const diasBancados = diffDays(inicio, dataQuebra);
    const diasDescobertos = Math.max(0, diasTotais - diasBancados);
    folego = { cobreTudo: false, falta, dataQuebra, trechoQuebraId, diasDescobertos, fimViagem, nivel, ratio };
  }

  const conflitosEstacao = trechos.filter(t => t.estacao.nivel === 'ruim').length;
  const parciaisEstacao  = trechos.filter(t => t.estacao.nivel === 'parcial').length;
  const furosVisto       = trechos.filter(t => t.visto.nivel === 'over').length;

  return { base, trechos, custoTotal, custoTerraTotal, custoTransporteTotal, diasTotais, fimViagem, mediaDia, orcamento, folego, conflitosEstacao, parciaisEstacao, furosVisto, inicio };
}
