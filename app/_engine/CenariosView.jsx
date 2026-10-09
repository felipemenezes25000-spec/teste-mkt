import { useState } from 'react';
import { fmtMoeda } from './utils.js';
import { resumoDe } from './cenarios.js';
import { Button } from '../_ui/Button.jsx';
import { Icon } from '../_ui/Icon.jsx';

// Células de métrica de um cenário (reaproveitadas na linha "Atual" e nas salvas).
function Metricas({ r }) {
  return (
    <>
      <td className="pr-3">{r.nPaises}</td>
      <td className="pr-3">{r.diasTotais}</td>
      <td className="pr-3 text-ink font-medium">{fmtMoeda(r.custoTotal, r.base)}</td>
      <td className={`pr-3 whitespace-nowrap ${r.cabe ? 'text-success' : 'text-danger'}`}>
        {r.cabe ? `sobra ${fmtMoeda(r.folgaOuFalta, r.base)}` : `falta ${fmtMoeda(r.folgaOuFalta, r.base)}`}
      </td>
      <td className={`pr-3 ${r.furosVisto > 0 ? 'text-danger' : 'text-success'}`}>{r.furosVisto > 0 ? `${r.furosVisto} furo(s)` : 'ok'}</td>
      <td className={`pr-3 ${r.conflitosEstacao > 0 ? 'text-danger' : 'text-success'}`}>{r.conflitosEstacao > 0 ? `${r.conflitosEstacao} fora` : 'ok'}</td>
    </>
  );
}

export default function CenariosView({ plan, cenarios, onSalvar, onCarregar, onRemover }) {
  const [nome, setNome] = useState('');
  const atual = resumoDe(plan);

  function salvar() {
    onSalvar(nome.trim() || `Cenário ${cenarios.length + 1}`);
    setNome('');
  }

  return (
    <section className="rise rounded-2xl border border-line bg-card p-4 sm:p-5" aria-label="Comparar cenários">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <h2 className="font-display text-2xl text-ink"><Icon emoji="⚖️" /> Comparar cenários</h2>
        <div className="flex items-center gap-2">
          <input value={nome} onChange={(e) => setNome(e.target.value)} placeholder={`Cenário ${cenarios.length + 1}`}
            onKeyDown={(e) => { if (e.key === 'Enter') salvar(); }}
            aria-label="Nome do cenário" className="px-2.5 py-1.5 rounded-lg border border-line bg-input text-ink focusring text-sm w-36" />
          <Button size="sm" onClick={salvar}><Icon emoji="💾" /> Salvar atual</Button>
        </div>
      </div>
      <p className="mt-1 text-sm text-inksoft">Salve versões da sua rota e compare <b className="text-ink">custo, dias, fôlego, visto e estação</b> lado a lado — pra decidir entre a Rota A e a B.</p>

      <div className="mt-4 overflow-x-auto">
        <table className="w-full text-sm tnum">
          <thead>
            <tr className="text-left text-xs text-inksoft border-b border-line">
              <th className="py-2 pr-3 font-semibold">Cenário</th>
              <th className="pr-3 font-semibold">Países</th>
              <th className="pr-3 font-semibold">Dias</th>
              <th className="pr-3 font-semibold">Custo total</th>
              <th className="pr-3 font-semibold">Fôlego</th>
              <th className="pr-3 font-semibold">Visto</th>
              <th className="pr-3 font-semibold">Estação</th>
              <th className="pr-3 font-semibold" aria-label="Ações"></th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-line bg-pine/5">
              <td className="py-2 pr-3 font-semibold text-pine whitespace-nowrap">● Atual</td>
              <Metricas r={atual} />
              <td className="pr-3" />
            </tr>
            {cenarios.map((c) => (
              <tr key={c.id} className="border-b border-line/60">
                <td className="py-2 pr-3 text-ink">{c.nome}</td>
                <Metricas r={resumoDe(c.plan)} />
                <td className="pr-3 whitespace-nowrap">
                  <button onClick={() => onCarregar(c)} className="text-xs font-semibold text-pine hover:underline focusring">Carregar</button>
                  <button onClick={() => onRemover(c.id)} className="ml-3 text-xs text-clay hover:underline focusring">Remover</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {cenarios.length === 0 && (
        <p className="mt-3 text-xs text-inksoft">Nenhum cenário salvo ainda — dê um nome e clique <b className="text-ink">Salvar atual</b> pra fotografar esta rota. Depois mude a ordem/dias e salve outra pra comparar.</p>
      )}
    </section>
  );
}
