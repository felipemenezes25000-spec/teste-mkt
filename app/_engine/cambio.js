/* =============================================================================
   CÂMBIO — "quanto custa em reais hoje"
   ---------------------------------------------------------------------------
   A dor nº 1 do viajante BR: o custo aparece em US$, mas ele paga em R$ — e o
   cartão do banco ainda come IOF + spread. `custoEmReais` traduz o total da
   viagem pro real de hoje e mostra quanto um cartão de banco custa a mais que
   uma fintech tipo Wise (gancho do CTA de afiliado). Função PURA → testável.
   ========================================================================== */
import { num } from './utils.js';

// IOF de compras/saques internacionais (3,38% desde 2025; usamos 6,38% como o
// teto histórico que muita gente ainda paga em cartão de débito/saque) + spread
// típico de banco (~4%). Wise ≈ mid-market + taxa pequena (~0,6%). Editável.
export const PREMISSAS_CAMBIO = { iof: 0.0638, spreadBanco: 0.04, spreadWise: 0.006 };

export function custoEmReais(valorUSD, taxaBRL, premissas = {}) {
  const v = num(valorUSD);
  const taxa = num(taxaBRL);
  if (v <= 0 || taxa <= 0) return null; // sem rate → o componente degrada

  const p = { ...PREMISSAS_CAMBIO, ...premissas };
  const brlMid = v * taxa;
  const brlBanco = brlMid * (1 + p.iof + p.spreadBanco);
  const brlWise = brlMid * (1 + p.spreadWise);
  const economiaWise = brlBanco - brlWise;

  return {
    brlMid: Math.round(brlMid),
    brlBanco: Math.round(brlBanco),
    brlWise: Math.round(brlWise),
    economiaWise: Math.round(economiaWise),
    pctBanco: Math.round((p.iof + p.spreadBanco) * 100),
  };
}
