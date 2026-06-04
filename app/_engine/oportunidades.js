/* =============================================================================
   CENTRAL DE OPORTUNIDADES (determinística)
   ---------------------------------------------------------------------------
   Varre o `calc` e devolve ganhos concretos e acionáveis — "se cortar 5 dias no
   país X você fecha o orçamento", "trecho Y fura o visto", "modo mochila economiza
   ~30%". Diferente da IA (probabilística), aqui é REGRA pura e explicável → sempre
   igual, sempre auditável. Complementa o `buscarOportunidades` (IA) já existente.
   ========================================================================== */
import { num } from './utils.js';
import { MESES_PT } from './data.js';
import { sugerirOrcamento } from './budget.js';

const ORDEM = { P0: 0, P1: 1, P2: 2, P3: 3 };

function meses(arr) {
  return (arr || []).map((m) => MESES_PT[m - 1]).filter(Boolean).join(', ');
}

export function escanearOportunidades(calc, opts = {}) {
  if (!calc || !Array.isArray(calc.trechos)) return [];
  const ops = [];
  const trechos = calc.trechos;

  // 1) Furo de visto por trecho → P0 (risco real de deportação/multa).
  for (const t of trechos) {
    if (t.visto && t.visto.nivel === 'over') {
      const excesso = num(t.visto.excesso);
      ops.push({
        tipo: 'visto',
        titulo: `${t.nome} ultrapassa o visto em ${excesso} dia(s)`,
        descricao: `Você planejou ${num(t.dias)} dias, mas o limite é ${num(t.vistoDias)}. Corte ${excesso} dia(s) ou divida a estadia.`,
        ganho: 'Evita problema na imigração',
        economia: Math.round(excesso * num(t.custoEfetivoDia)),
        comoAplicar: `Reduza ${excesso} dia(s) em ${t.nome} (ou verifique extensão de visto).`,
        prioridade: 'P0',
      });
    }
  }

  // 2) Orçamento estoura → P0 (reusa o motor prescritivo de cortes).
  if (calc.folego && calc.folego.cobreTudo === false) {
    const sug = sugerirOrcamento(calc, { pisoMin: opts.pisoMin != null ? opts.pisoMin : 5 });
    if (sug.cortes && sug.cortes.length) {
      ops.push({
        tipo: 'orcamento',
        titulo: `Seu orçamento estoura em ~US$ ${Math.round(num(calc.folego.falta))}`,
        descricao: `Cortando ${sug.diasCortados} dia(s) nos trechos certos você ${sug.status === 'ok' ? 'fecha a conta' : 'reduz bastante o rombo'}.`,
        ganho: `Economia de ~US$ ${Math.round(sug.economiaTotal)}`,
        economia: Math.round(sug.economiaTotal),
        comoAplicar: sug.cortes.map((c) => `−${c.dias}d em ${c.nome}`).join(' · '),
        prioridade: 'P0',
      });
    }
  }

  // 3) Trecho inteiro fora de época → P1.
  for (const t of trechos) {
    if (t.estacao && t.estacao.nivel === 'ruim') {
      ops.push({
        tipo: 'estacao',
        titulo: `${t.nome}: estadia fora da melhor época`,
        descricao: `A melhor janela é ${meses(t.melhoresMeses) || 'outra época'}. Chegar nela melhora clima e evita monção/lotação.`,
        ganho: 'Melhor clima e experiência',
        economia: 0,
        comoAplicar: `Remaneje ${t.nome} para ${meses(t.melhoresMeses) || 'a melhor época'} (reordene a rota).`,
        prioridade: 'P1',
      });
    }
  }

  // 4) Reordenar pela estação → P1 (quando há conflito que reordenar pode resolver).
  if (num(calc.conflitosEstacao) + num(calc.parciaisEstacao) >= 2) {
    ops.push({
      tipo: 'reordenar',
      titulo: 'Reordenar a rota pode encaixar mais trechos na boa época',
      descricao: `${num(calc.conflitosEstacao) + num(calc.parciaisEstacao)} trecho(s) chegam fora do ideal. A ordem muda as datas (chegada = início + soma dos dias anteriores).`,
      ganho: 'Mais trechos no clima certo',
      economia: 0,
      comoAplicar: 'Use "Otimizar com IA" no planejador ou arraste os trechos.',
      prioridade: 'P1',
    });
  }

  // 5) Modo mochila → P2 (economia % sobre a vida diária).
  const terra = num(calc.custoTerraTotal);
  if (terra > 0) {
    const economiaMochila = Math.round(terra * 0.3); // mochila ≈ 0.7× do médio
    if (economiaMochila >= 50) {
      ops.push({
        tipo: 'tier',
        titulo: `Modo mochila economiza ~US$ ${economiaMochila}`,
        descricao: 'Hostel/dormitório, comida de rua e transporte público derrubam ~30% do custo diário, sem perder a viagem.',
        ganho: `~US$ ${economiaMochila} (~30%)`,
        economia: economiaMochila,
        comoAplicar: 'Ajuste o nível de conforto para "Mochila" nos custos.',
        prioridade: 'P2',
      });
    }
  }

  // 6) Trecho mais caro → P2 (onde olhar primeiro pra cortar custo/dia).
  let caro = null;
  for (const t of trechos) {
    if (!caro || num(t.custoEfetivoDia) > num(caro.custoEfetivoDia)) caro = t;
  }
  if (caro && num(caro.custoEfetivoDia) > 0 && trechos.length > 1) {
    ops.push({
      tipo: 'caro',
      titulo: `${caro.nome} é seu trecho mais caro (~US$ ${Math.round(num(caro.custoEfetivoDia))}/dia)`,
      descricao: 'Trocar a base por uma cidade vizinha mais barata, ou reduzir 1–2 dias, tem o maior impacto no total.',
      ganho: 'Maior alavanca de economia',
      economia: 0,
      comoAplicar: `Revise hospedagem/cidades em ${caro.nome} ou ajuste os dias.`,
      prioridade: 'P2',
    });
  }

  ops.sort((a, b) => (ORDEM[a.prioridade] - ORDEM[b.prioridade]) || (num(b.economia) - num(a.economia)));
  return ops;
}
