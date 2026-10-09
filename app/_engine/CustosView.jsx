import { fmtMoeda, fmtData } from './utils.js';
import { Icon } from '../_ui/Icon.jsx';

// Aba "Custos": quebra de gastos por trecho + detalhe do fôlego. Tudo derivado
// do mesmo motor (calc), na moeda base.
export default function CustosView({ calc }) {
  const cur = calc.base;
  const f = calc.folego;
  return (
    <section aria-label="Custos da viagem" className="rise rounded-2xl border border-line bg-card p-4 sm:p-5">
      <h2 className="font-display text-2xl text-ink mb-3">Custos & fôlego</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-sm tnum">
          <thead>
            <tr className="text-left text-xs text-inksoft border-b border-line">
              <th className="py-2 pr-3 font-semibold">#</th>
              <th className="pr-3 font-semibold">País</th>
              <th className="pr-3 font-semibold">Dias</th>
              <th className="pr-3 font-semibold">Em terra</th>
              <th className="pr-3 font-semibold"><Icon emoji="✈" /> Transp.</th>
              <th className="pr-3 font-semibold">Trecho</th>
              <th className="pr-3 font-semibold">Acumulado</th>
            </tr>
          </thead>
          <tbody>
            {calc.trechos.map((t, i) => (
              <tr key={t.id} className="border-b border-line/60">
                <td className="py-2 pr-3 text-inksoft">{i + 1}</td>
                <td className="pr-3 text-ink">{t.nome}</td>
                <td className="pr-3">{t.dias}</td>
                <td className="pr-3">{fmtMoeda(t.custoTerra, cur)}</td>
                <td className="pr-3">{fmtMoeda(t.custoTransporte, cur)}</td>
                <td className="pr-3 font-semibold text-ink">{fmtMoeda(t.custoTrecho, cur)}</td>
                <td className="pr-3">{fmtMoeda(t.acumulado, cur)}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="font-semibold text-ink">
              <td className="py-2 pr-3"></td>
              <td className="pr-3">Total</td>
              <td className="pr-3">{calc.diasTotais}</td>
              <td className="pr-3">{fmtMoeda(calc.custoTerraTotal, cur)}</td>
              <td className="pr-3">{fmtMoeda(calc.custoTransporteTotal, cur)}</td>
              <td className="pr-3">{fmtMoeda(calc.custoTotal, cur)}</td>
              <td className="pr-3"></td>
            </tr>
          </tfoot>
        </table>
      </div>
      <div className="mt-4 text-sm rounded-xl border border-line bg-paper2/50 p-3">
        {calc.orcamento <= 0 ? (
          <p className="text-danger">Defina seu orçamento lá em cima pra ver o fôlego.</p>
        ) : f.cobreTudo ? (
          <p className="text-success">Orçamento de <b>{fmtMoeda(calc.orcamento, cur)}</b> cobre a viagem toda. Sobra <b>{fmtMoeda(f.sobra, cur)}</b> — cerca de <b>{f.diasExtras} dias</b> a mais no ritmo de vida ({fmtMoeda(calc.mediaDia, cur)}/dia). Fim previsto: {fmtData(f.fimViagem)}.</p>
        ) : (
          <p className="text-danger">A grana acaba em <b>{fmtData(f.dataQuebra)}</b> — faltam <b>{fmtMoeda(f.falta, cur)}</b> pra fechar ({f.diasDescobertos} dias da viagem descobertos).</p>
        )}
        <p className="text-xs text-inksoft mt-1">Valores na moeda base ({cur}); trechos em outras moedas são convertidos pelo câmbio aproximado.</p>
      </div>
    </section>
  );
}
