// Simulador da Home (OMEGA V5 F1). Regra PURA e testada:
//   camada 1  custo em terra (estimado, referência jun/2026)    → sempre
//   camada 2  passagem ida e volta (faixa ilustrativa, sem cotação) → só com origem
//   camada 3  total provável (terra + passagem + seguro + contingência) → só com 1 e 2
// O orçamento é comparado na MESMA moeda e no MESMO escopo. Sem câmbio, não há
// comparação; sem passagem, o veredito fala só do custo em terra — nunca "cabe".
import { custoEstadia } from './custos.js';
import { PREMISSAS_PADRAO } from '../_engine/custoTotal.js';
import { distanciaKm, estimarPrecoVoo } from '../_engine/utils.js';
import { money, toDecimal, casasDecimais } from '../_domain/money.js';

export const MOEDAS_SIMULADOR = ['BRL', 'USD', 'EUR', 'GBP', 'JPY', 'ARS', 'MXN', 'CLP'];
export const MOEDA_POR_IDIOMA = { pt: 'BRL', en: 'USD', es: 'EUR', ja: 'JPY' };
// Incerteza do custo de referência: a faixa vai de −15% a +25% do valor central.
export const BANDA = { min: 0.85, max: 1.25 };

const TIER_POR_ESTILO = {
  mochileiro: 'mochila', 'mochilao-sem-perrengue': 'mochila', 'casal-economico': 'mochila',
  luxo: 'conforto', romantico: 'conforto',
};
export const tierDoEstilo = (estilo) => TIER_POR_ESTILO[estilo] || 'medio';

/** Converte USD → moeda com regra de casas decimais da moeda (JPY sem centavos). */
function emMoeda(usd, fx, moeda) {
  if (moeda === 'USD') return toDecimal(money(usd, 'USD'));
  return toDecimal(money(usd * fx.taxa, moeda));
}

/**
 * @param {{ custoDia: number, coords?: [number, number] }} destino
 * @param {{ dias: number, adultos: number, criancas?: number, estilo?: string,
 *           origem?: { coords: [number, number] } | null, moeda: string,
 *           fx?: { taxa: number|null, data?: string|null, fonte?: string } | null, orcamento?: number }} e
 */
export function simularCusto(destino, e) {
  const dias = Math.max(1, Math.min(120, Math.round(Number(e.dias) || 0) || 1));
  const viajantes = Math.max(1, Math.min(20, (Math.round(Number(e.adultos) || 0) || 0) + (Math.round(Number(e.criancas) || 0) || 0)));
  const moeda = MOEDAS_SIMULADOR.includes(e.moeda) ? e.moeda : 'BRL';
  const tier = tierDoEstilo(e.estilo);
  const fxOk = moeda === 'USD' || !!(e.fx && e.fx.taxa > 0);
  const fx = moeda === 'USD' ? { taxa: 1, data: null, fonte: 'mesma moeda' } : e.fx;

  // camada 1 — terra (por pessoa: crianças contadas como adulto, estimativa conservadora)
  const terraPessoaUsd = custoEstadia(destino.custoDia, dias, tier).total;
  const terraUsd = terraPessoaUsd * viajantes;
  const terra = { status: 'ESTIMATE', usd: { min: terraUsd * BANDA.min, centro: terraUsd, max: terraUsd * BANDA.max } };

  // camada 2 — passagem (faixa ilustrativa por distância; NUNCA cotação)
  let passagem = null;
  if (e.origem && Array.isArray(e.origem.coords) && Array.isArray(destino.coords)) {
    const f = estimarPrecoVoo(distanciaKm(e.origem.coords, destino.coords));
    if (f) passagem = { status: 'ESTIMATE', ilustrativa: true, km: Math.round(f.km), usd: { min: f.min * viajantes, max: f.max * viajantes } };
  }

  // camada 3 — total provável (seguro e contingência das premissas do RealCost)
  let total = null;
  if (passagem) {
    const seguro = PREMISSAS_PADRAO.seguroDia * dias * viajantes;
    const c = 1 + PREMISSAS_PADRAO.contingencia;
    total = {
      status: 'ESTIMATE',
      verificado: false,
      usd: { min: (terra.usd.min + passagem.usd.min + seguro) * c, max: (terra.usd.max + passagem.usd.max + seguro) * c },
      inclui: ['terra', 'passagem_ilustrativa', 'seguro', 'contingencia'],
      exclui: ['visto', 'bagagem_extra', 'spread_cartao_iof'],
    };
  }

  const conv = (r) => (fxOk && r ? Object.fromEntries(Object.entries(r).map(([k, v]) => [k, emMoeda(v, fx, moeda)])) : null);
  const out = {
    moeda, dias, viajantes, tier,
    cambio: moeda === 'USD' ? null : fxOk ? { taxa: fx.taxa, data: fx.data || null, fonte: fx.fonte || 'referência' } : { indisponivel: true },
    terra: { ...terra, valor: conv(terra.usd) },
    passagem: passagem ? { ...passagem, valor: conv(passagem.usd) } : null,
    total: total ? { ...total, valor: conv(total.usd) } : null,
  };
  out.veredito = veredito(out, Number(e.orcamento) || 0);
  return out;
}

/**
 * Veredito comparável. Códigos:
 *   SEM_ORCAMENTO · SEM_CAMBIO
 *   TOTAL_CABE · TOTAL_NO_LIMITE · TOTAL_ACIMA       (escopo: total provável estimado)
 *   TERRA_CABE · TERRA_NO_LIMITE · TERRA_ACIMA       (escopo: só terra, passagem fora)
 */
export function veredito(r, orcamento) {
  if (!(orcamento > 0)) return { codigo: 'SEM_ORCAMENTO' };
  if (!r.terra.valor) return { codigo: 'SEM_CAMBIO' };
  const base = r.total ? r.total.valor : r.terra.valor;
  const escopo = r.total ? 'TOTAL' : 'TERRA';
  const sufixo = orcamento >= base.max ? 'CABE' : orcamento < base.min ? 'ACIMA' : 'NO_LIMITE';
  return { codigo: `${escopo}_${sufixo}`, escopo, folga: orcamento - base.max };
}

/** Formata faixa na moeda (sem centavos para leitura; JPY já é inteiro). */
export function fmtFaixa(f, moeda, locale = 'pt-BR') {
  if (!f) return '—';
  const nf = new Intl.NumberFormat(locale, { style: 'currency', currency: moeda, maximumFractionDigits: 0, minimumFractionDigits: 0 });
  const passo = casasDecimais(moeda) === 0 ? 1000 : 10; // JPY/CLP: arredonda em milhar
  const arred = (v) => Math.round(v / passo) * passo;
  return `${nf.format(arred(f.min))} – ${nf.format(arred(f.max))}`;
}

/** Contras honestos de um destino para o perfil/viagem (Top 3 "por que talvez não"). */
export function contras(destino, { mes, horasVoo, vistoTipo, veredito: v }) {
  const out = [];
  if (mes && !(destino.melhoresMeses || []).includes(mes)) out.push('fora_epoca');
  if (horasVoo && horasVoo >= 14) out.push('voo_longo');
  if (vistoTipo === 'visto' || vistoTipo === 'consultar') out.push(vistoTipo === 'visto' ? 'visto_consular' : 'visto_verificar');
  if (v && /ACIMA|NO_LIMITE/.test(v.codigo)) out.push('orcamento_apertado');
  return out;
}

const RANK_VEREDITO = { CABE: 0, NO_LIMITE: 1, ACIMA: 2 };
/** Com orçamento comparável, quem cabe vem antes (sort estável preserva o ranking do perfil). */
export function ordenarPorOrcamento(itens) {
  const rank = (x) => { const m = /CABE|NO_LIMITE|ACIMA/.exec(x.custo.veredito.codigo); return m ? RANK_VEREDITO[m[0]] : 0; };
  return [...itens].sort((a, b) => rank(a) - rank(b));
}
