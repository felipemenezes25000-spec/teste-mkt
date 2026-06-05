'use client';
import { useEffect, useMemo, useState } from 'react';
import { DestinoCard } from '../../_components/DestinoCard.jsx';
import { colecoesEditorial, TEMAS_EXPLORAR, temasDoDestino } from '../../_lib/editorial.js';

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
  const [tema, setTema] = useState(''); // chip humano ativo ('' = nenhum)

  // Busca via URL (?q=) — alimenta a SearchAction do JSON-LD e permite deep-link de busca.
  useEffect(() => {
    const t = new URLSearchParams(window.location.search).get('q');
    if (t) setQ(t);
  }, []);

  const regioes = useMemo(() => [...new Set(destinos.map((d) => d.regiao))].sort(), [destinos]);
  const colecoes = useMemo(() => colecoesEditorial(destinos), [destinos]);
  // Tema -> destinos (calculado uma vez). Alimenta o filtro por chip e a contagem.
  const temasPorCode = useMemo(() => new Map(destinos.map((d) => [d.code, temasDoDestino(d)])), [destinos]);
  const contagemTema = useMemo(() => {
    const c = {};
    for (const temas of temasPorCode.values()) for (const t of temas) c[t] = (c[t] || 0) + 1;
    return c;
  }, [temasPorCode]);

  const filtrados = useMemo(() => {
    const termo = q.trim().toLowerCase();
    let lista = destinos.filter((d) => {
      if (regiao && d.regiao !== regiao) return false;
      if (maxCusto && d.custoDia > maxCusto) return false;
      if (tema && !(temasPorCode.get(d.code) || []).includes(tema)) return false;
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
  }, [destinos, q, regiao, maxCusto, ordem, tema, temasPorCode]);

  const field = 'px-3 py-2 rounded-lg border border-line bg-input text-ink focusring text-sm';
  const temFiltro = q.trim() || regiao || maxCusto || ordem !== 'nome' || tema;

  return (
    <div className="mt-8 space-y-10">
      {/* CHIPS — filtros humanos lastreados em dado real (custo/região/dimensões) */}
      <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Filtrar por estilo de viagem">
        {TEMAS_EXPLORAR.map((t) => {
          const n = contagemTema[t.id] || 0;
          if (!n) return null;
          const ativo = tema === t.id;
          return (
            <button
              key={t.id}
              type="button"
              aria-pressed={ativo}
              onClick={() => setTema(ativo ? '' : t.id)}
              className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-sm font-semibold border transition focusring ${ativo ? 'bg-pine text-white border-pine' : 'bg-card text-ink border-line hover:border-pine/50'}`}
            >
              <span aria-hidden>{t.icon}</span>{t.label}
              <span className={ativo ? 'text-white/80 text-xs' : 'text-inksoft text-xs'}>{n}</span>
            </button>
          );
        })}
        {tema && (
          <button type="button" onClick={() => setTema('')} className="ml-1 text-sm text-pine hover:underline px-2 py-1 focusring">limpar</button>
        )}
      </div>

      {!temFiltro && (
        <div className="space-y-10">
          {colecoes.map((colecao) => (
            <section key={colecao.id} aria-labelledby={`${colecao.id}-h`}>
              <div className="flex items-end justify-between gap-3 mb-4">
                <div>
                  <h2 id={`${colecao.id}-h`} className="font-display text-2xl sm:text-3xl text-ink">{colecao.titulo}</h2>
                  <p className="mt-1 text-sm text-inksoft max-w-2xl">{colecao.subtitulo}</p>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {colecao.destinos.slice(0, 4).map((d) => <DestinoCard key={`${colecao.id}-${d.code}`} d={d} img={d.img} />)}
              </div>
            </section>
          ))}
        </div>
      )}

      <section aria-labelledby="catalogo-h" className="rounded-[2rem] border border-line bg-card/70 p-4 sm:p-5">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2 mb-4">
          <div>
            <h2 id="catalogo-h" className="font-display text-2xl text-ink">{temFiltro ? 'Resultado da busca' : 'Catálogo completo'}</h2>
            <p className="text-sm text-inksoft">Use quando quiser procurar um país específico ou filtrar pelo bolso.</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 items-center">
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Buscar país ou cidade…" aria-label="Buscar destino" className={`${field} flex-1 min-w-[180px]`} />
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
      </section>
    </div>
  );
}
