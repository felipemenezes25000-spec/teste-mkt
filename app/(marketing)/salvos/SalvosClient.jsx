'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { lerFavoritos, FAV_EVENT } from '../../_lib/favoritos.js';
import { destinoPorCode } from '../../_lib/destinos.js';
import { imagemWiki } from '../../_lib/wiki.js';
import { DestinoCard } from '../../_components/DestinoCard.jsx';

export function SalvosClient() {
  const [codes, setCodes] = useState(null); // null = ainda lendo localStorage
  const [imgs, setImgs] = useState({});

  useEffect(() => {
    const sync = () => setCodes(lerFavoritos());
    sync();
    window.addEventListener(FAV_EVENT, sync);
    return () => window.removeEventListener(FAV_EVENT, sync);
  }, []);

  const destinos = (codes || []).map(destinoPorCode).filter(Boolean);

  // Busca as imagens no client (Wikipedia REST tem CORS aberto).
  useEffect(() => {
    let vivo = true;
    destinos.forEach((d) => {
      if (imgs[d.code] !== undefined) return;
      imagemWiki(d.fotoQuery || d.nome).then((src) => {
        if (vivo) setImgs((p) => ({ ...p, [d.code]: src || null }));
      });
    });
    return () => { vivo = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [codes]);

  if (codes === null) return <div className="mt-6 text-inksoft text-sm">Carregando…</div>;

  if (destinos.length === 0) {
    return (
      <div className="mt-6 rounded-2xl border border-dashed border-line bg-card p-10 text-center">
        <div className="text-4xl mb-2" aria-hidden>♡</div>
        <p className="text-ink font-semibold">Nenhum destino salvo ainda.</p>
        <p className="text-inksoft text-sm mt-1">Toque no coração de qualquer destino pra salvar aqui.</p>
        <Link href="/explorar" className="inline-flex mt-4 rounded-xl bg-pine text-white font-semibold px-5 py-2.5 hover:bg-pinedk focusring">Explorar destinos</Link>
      </div>
    );
  }

  return (
    <div className="mt-6">
      <div className="flex items-center justify-between gap-3 mb-3">
        <p className="text-sm text-inksoft" aria-live="polite">{destinos.length} destino(s) salvo(s)</p>
        {destinos.length >= 2 && <Link href="/comparar" className="text-sm font-semibold text-pine hover:underline focusring">⚖️ Comparar →</Link>}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {destinos.map((d) => <DestinoCard key={d.code} d={d} img={imgs[d.code]} />)}
      </div>
      <p className="mt-6 text-xs text-inksoft border-t border-line pt-4">
        💾 Seus salvos ficam neste navegador. Sua rota no{' '}
        <Link href="/planejar" className="text-pine hover:underline focusring font-semibold">Planejador</Link>{' '}
        sincroniza na nuvem quando você entra na conta — aí você abre de qualquer aparelho.
      </p>
    </div>
  );
}
