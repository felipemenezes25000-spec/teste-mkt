// Dados de figurinha de cada país (álbum, pacotinho, home) a partir do catálogo.
// Uso no SERVIDOR (importa o catálogo inteiro); o navegador recebe as bases prontas
// e usa _lib/figurinhaMes.js para aplicar o mês.
import { PAISES_REF, vistoDe, SEED_FX } from '../_engine/data.js';
import { indiceDe } from '../_engine/indices.js';
import { slugify } from './slug.js';
import { capaPais, videosPais } from './midia.js';
import { faixaMeses, noMes } from './figurinhaMes.js';

export { MESES, M3, faixaMeses, noMes } from './figurinhaMes.js';

const VISTO_CURTO = { isento: 'isento', 'e-visa': 'e-visa', eta: 'eta', 'on-arrival': 'na chegada', visto: 'prévio', consultar: 'consultar' };

/** Base da figurinha de um país (sem mês). */
export function baseFigurinha(code) {
  const i = PAISES_REF.findIndex((p) => p.code === code);
  if (i < 0) return null;
  const p = PAISES_REF[i];
  const seguranca = indiceDe(code).seguranca;
  const meses = p.melhoresMeses || [];
  const v = vistoDe(code, 'BR');
  return {
    code, nome: p.nome, slug: slugify(p.nome), regiao: p.regiao, numero: `${code} ${String((i % 99) + 1).padStart(2, '0')}`,
    meses, faixa: faixaMeses(meses), custoDia: p.custoDia, seguranca, alerta: seguranca <= 3,
    visto: { tipo: v.tipo, dias: v.dias || 0, curto: VISTO_CURTO[v.tipo] || v.tipo },
  };
}

/** Figurinha de um país para o mês `mes` (0–11). */
export function figurinhaDe(code, mes) { return noMes(baseFigurinha(code), mes); }

/** Bases de todos os países (ordem do catálogo). */
export function todasBases() { return PAISES_REF.map((p) => baseFigurinha(p.code)); }

/** Quantos países estão na hora certa no mês. */
export function contarHoraCerta(mes) { return todasBases().filter((b) => noMes(b, mes).bom).length; }

/** Mídia leve para o navegador: capa (1 largura + srcset opcional) e 1º vídeo, com crédito. */
export function midiaLeve(codes, { largura = 500, srcset = false, video = true } = {}) {
  const out = {};
  for (const c of codes) {
    const capa = capaPais(c, largura);
    const v = video ? videosPais(c)[0] : null;
    if (!capa && !v) continue;
    out[c] = {
      capa: capa ? { src: capa.src, ...(srcset ? { srcSet: capa.srcSet } : {}), lugar: capa.lugar, credito: capa.credito } : null,
      video: v ? { src: v.src, poster: v.poster, lugar: v.lugar, credito: v.credito } : null,
    };
  }
  return out;
}

/** Câmbio de referência USD→BRL (semente do app; a tela diz que é referência). */
export const CAMBIO_BRL = SEED_FX.rates.BRL;
