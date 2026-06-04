'use client';
import { useMemo, useState } from 'react';
import { DestinoCard } from '../../_components/DestinoCard.jsx';

// Busca + filtros (região/orçamento) + ordenação, no client. Recebe os destinos
// já com imagem (puxada no servidor) — aqui é só filtrar/ordenar/renderizar.
const ORDENS = [
  { id: 'nome', label: 'A–Z' },
  { id: 'barato', label: 'Mais barato' },
  { id: 'caro', label: 'Mais caro' },
];

export function ExplorarClient({ destinos }) {
  const [q, setQ] = useState('');
  const [regiao, setRegiao] = useState('');
  const [maxCusto, setMaxCusto] = useState(0); // 0 = sem teto
  const [ordem, setOrdem] = useState('nome');

  const regioes = useMemo(() => [...new Set(destinos.map((d) => d.regiao))].sort(), [destinos]);

  const filtrados = useMemo(() => {
    const termo = q.trim().toLowerCase();
    let lista = destinos.filter((d) => {
      if (regiao && d.regiao !== regiao) return false;
      if (maxCusto && d.custoDia > maxCusto) return false;
      if (termo) {
        const hay = (d.nome + ' ' + d.regiao + ' ' + (d.cidades || []).join(' ')).toLowerCase();
        if (!hay.includes(termo)) return false;
      }
      return true;
    });
    if (ordem === 'barato') lista = [...lista].sort((a, b) => a.custoDia - b.custoDia);
    else if (ordem === 'caro') lista = [...lista].sort((a, b) => b.custoDia - a.custoDia);
    else lista = [...lista].sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR'));
    return lista;
  }, [destinos, q, regiao, maxCusto, ordem]);

  const field = 'px-3 py-2 rounded-lg border border-line bg-input text-ink focusring text-sm';

  return (
    <div className="mt-6">
      <div className="flex flex-wrap gap-2 items-center">
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="🔍 Buscar país ou cidade…" aria-label="Buscar destino" className={`${field} flex-1 min-w-[180px]`} />
        <select value={regiao} onChange={(e) => setRegiao(e.target.value)} aria-label="Filtrar por região" className={field}>
          <option value="">Todas as regiões</option>
          {regioes.map((r) => <option key={r} value={r}>{r}</option>)}
        </select>
        <select value={maxCusto} onChange={(e) => setMaxCusto(Number(e.target.value))} aria-label="Filtrar por orçamento" className={field}>
          <option value={0}>Qualquer orçamento</option>
          <option value={25}>Até US$ 25/dia</option>
          <option value={35}>Até US$ 35/dia</option>
          <option value={60}>Até US$ 60/dia</option>
        </select>
        <select value={ordem} onChange={(e) => setOrdem(e.target.value)} aria-label="Ordenar" className={field}>
          {ORDENS.map((o) => <option key={o.id} value={o.id}>{o.label}</option>)}
        </select>
      </div>

      <p className="mt-3 text-xs text-inksoft" aria-live="polite">{filtrados.length} destino(s)</p>

      {filtrados.length === 0 ? (
        <div className="mt-3 rounded-2xl border border-dashed border-line bg-card p-10 text-center text-inksoft">
          Nenhum destino com esses filtros. Tente afrouxar a busca.
        </div>
      ) : (
        <div className="mt-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {filtrados.map((d) => <DestinoCard key={d.code} d={d} img={d.img} />)}
        </div>
      )}
    </div>
  );
}
