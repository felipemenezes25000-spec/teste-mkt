'use client';
import { custoEmReais } from '../_engine/cambio.js';
import { num } from '../_engine/utils.js';
import { linkWise, linkEsim, linkSeguro } from '../_lib/links.js';
import { track } from '../_lib/analytics.js';

// "Prepare a viagem" — serviços que o viajante contrata na fase de planejamento
// (onde nosso app vive): cartão multimoeda (com câmbio em R$ hoje), eSIM e seguro.
// Cada CTA é monetizável (afiliado) e dispara track(). Degrada sem taxaBRL.
const fmtBRL = (v) => `R$ ${num(v).toLocaleString('pt-BR')}`;

export function ServicosDaViagem({ totalUSD, taxaBRL, destino }) {
  const cambio = custoEmReais(totalUSD, taxaBRL);
  const cta = (categoria, parceiro) => track('reservar_click', { categoria, parceiro, destino });
  const cardLink = 'flex items-center gap-2.5 rounded-xl border border-line bg-paper2 p-3 hover:border-pine/40 transition focusring';

  return (
    <div className="rounded-2xl border border-line bg-card p-5">
      <div className="flex items-center gap-2">
        <span aria-hidden className="text-xl">🎒</span>
        <h3 className="font-display text-lg text-ink">Prepare a viagem</h3>
      </div>
      <p className="mt-1 text-sm text-inksoft">O que você resolve agora — e economiza (ou evita dor de cabeça) lá fora.</p>

      {cambio ? (
        <div className="mt-4 rounded-xl bg-paper2 p-3.5">
          <p className="text-xs text-inksoft">Sua viagem custa hoje, em reais:</p>
          <div className="mt-1 flex flex-wrap items-end gap-x-5 gap-y-1">
            <div>
              <p className="text-[11px] text-inksoft">No cartão do banco <span className="opacity-70">(IOF+spread ~{cambio.pctBanco}%)</span></p>
              <p className="font-display text-xl text-inksoft tnum">{fmtBRL(cambio.brlBanco)}</p>
            </div>
            <div>
              <p className="text-[11px] text-pine font-semibold">Com cartão tipo Wise</p>
              <p className="font-display text-xl text-ink tnum">{fmtBRL(cambio.brlWise)}</p>
            </div>
          </div>
          <a href={linkWise()} target="_blank" rel="noopener noreferrer sponsored" onClick={() => cta('cambio', 'wise')}
            className="mt-2.5 inline-flex items-center gap-1 text-xs font-semibold text-pine bg-pine/10 hover:bg-pine/15 rounded-lg px-2.5 py-1.5 focusring">
            💳 Economize ~{fmtBRL(cambio.economiaWise)} com um cartão multimoeda ↗
          </a>
        </div>
      ) : (
        <a href={linkWise()} target="_blank" rel="noopener noreferrer sponsored" onClick={() => cta('cambio', 'wise')}
          className={`mt-4 ${cardLink}`}>
          <span className="text-xl" aria-hidden>💳</span>
          <span className="min-w-0"><span className="block text-sm font-semibold text-ink">Cartão multimoeda ↗</span><span className="block text-[11px] text-inksoft">Sem IOF abusivo (Wise/Revolut)</span></span>
        </a>
      )}

      <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
        <a href={linkEsim(destino)} target="_blank" rel="noopener noreferrer sponsored" onClick={() => cta('esim', 'klook')} className={cardLink}>
          <span className="text-xl" aria-hidden>📶</span>
          <span className="min-w-0"><span className="block text-sm font-semibold text-ink">Chip / eSIM ↗</span><span className="block text-[11px] text-inksoft">Internet ao chegar, sem roaming</span></span>
        </a>
        <a href={linkSeguro()} target="_blank" rel="noopener noreferrer sponsored" onClick={() => cta('seguro', 'safetywing')} className={cardLink}>
          <span className="text-xl" aria-hidden>🛡️</span>
          <span className="min-w-0"><span className="block text-sm font-semibold text-ink">Seguro-viagem ↗</span><span className="block text-[11px] text-inksoft">Exigido em vários países</span></span>
        </a>
      </div>

      <p className="mt-3 text-[11px] text-inksoft">Sugestões de parceiros — podemos receber comissão, sem custo a mais pra você. Compare antes de contratar.</p>
    </div>
  );
}
