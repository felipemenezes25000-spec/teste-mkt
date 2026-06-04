'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { lerFavoritos, FAV_EVENT } from '../../_lib/favoritos.js';
import { destinoPorCode } from '../../_lib/destinos.js';
import { vistoDe, MESES_PT } from '../../_engine/data.js';

const meses = (arr = []) => (arr.length ? arr.map((m) => MESES_PT[m - 1]).join(', ') : '—');

export function CompararClient() {
  const [codes, setCodes] = useState(null);

  useEffect(() => {
    const sync = () => setCodes(lerFavoritos());
    sync();
    window.addEventListener(FAV_EVENT, sync);
    return () => window.removeEventListener(FAV_EVENT, sync);
  }, []);

  const destinos = (codes || []).map(destinoPorCode).filter(Boolean);

  if (codes === null) return <div className="mt-6 text-inksoft text-sm">Carregando…</div>;

  if (destinos.length < 2) {
    return (
      <div className="mt-6 rounded-2xl border border-dashed border-line bg-card p-10 text-center">
        <div className="text-4xl mb-2" aria-hidden>⚖️</div>
        <p className="text-ink font-semibold">Salve pelo menos 2 destinos pra comparar.</p>
        <p className="text-inksoft text-sm mt-1">Toque no coração nos destinos que te interessam.</p>
        <Link href="/explorar" className="inline-flex mt-4 rounded-xl bg-pine text-white font-semibold px-5 py-2.5 hover:bg-pinedk focusring">Explorar destinos</Link>
      </div>
    );
  }

  const linhas = [
    { k: 'Região', f: (d) => d.regiao },
    { k: 'Moeda local', f: (d) => d.moeda },
    { k: 'Custo médio/dia', f: (d) => `~US$ ${d.custoDia}` },
    { k: 'Melhor época', f: (d) => meses(d.melhoresMeses) },
    { k: 'Visto (passaporte BR)', f: (d) => { const v = vistoDe(d.code, 'BR'); return `${v.tipo} · ${v.dias}d`; } },
    { k: 'Bases sugeridas', f: (d) => (d.cidades || []).slice(0, 3).join(', ') || '—' },
  ];

  return (
    <div className="mt-6 overflow-x-auto rounded-2xl border border-line">
      <table className="w-full border-collapse min-w-[520px] bg-card">
        <thead>
          <tr className="border-b border-line">
            <th className="text-left p-3 text-xs uppercase tracking-wide text-inksoft w-36"> </th>
            {destinos.map((d) => (
              <th key={d.code} className="p-3 text-left">
                <Link href={`/destino/${d.slug}`} className="font-display text-lg text-ink hover:text-pine focusring">{d.nome}</Link>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {linhas.map((l) => (
            <tr key={l.k} className="border-b border-line last:border-0">
              <td className="p-3 text-xs font-semibold text-inksoft whitespace-nowrap">{l.k}</td>
              {destinos.map((d) => <td key={d.code} className="p-3 text-sm text-ink align-top">{l.f(d)}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
