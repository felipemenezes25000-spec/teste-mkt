'use client';
import { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import { lerFavoritos, FAV_EVENT } from '../../_lib/favoritos.js';
import { destinoPorCode, DESTINOS } from '../../_lib/destinos.js';
import { imagemWiki } from '../../_lib/wiki.js';
import { DestinoCard } from '../../_components/DestinoCard.jsx';
import { EmptyState } from '../../_components/EmptyState.jsx';
import { CardsSkeleton } from '../../_components/Skeleton.jsx';

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
  const vazio = codes !== null && destinos.length === 0;
  // 5 recomendados (destaques) pra preencher o estado vazio com algo útil.
  const recomendados = useMemo(() => {
    const dest = DESTINOS.filter((d) => d.destaque);
    return (dest.length ? dest : DESTINOS).slice(0, 5);
  }, []);
  const aMostrar = vazio ? recomendados : destinos;

  // Busca as imagens no client (Wikipedia REST tem CORS aberto).
  useEffect(() => {
    let vivo = true;
    aMostrar.forEach((d) => {
      if (imgs[d.code] !== undefined) return;
      imagemWiki(d.fotoQuery || d.nome).then((src) => {
        if (vivo) setImgs((p) => ({ ...p, [d.code]: src || null }));
      });
    });
    return () => { vivo = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [codes]);

  if (codes === null) return <div className="mt-6"><CardsSkeleton n={4} /></div>;

  if (vazio) {
    return (
      <div className="mt-6">
        <EmptyState
          icon="♡"
          title="Você ainda não salvou destinos."
          subtitle="Toque no coração de qualquer destino pra guardar aqui. Pra começar, estes são ótimos pra brasileiros:"
          actions={[{ href: '/explorar', label: 'Explorar destinos', primary: true }, { href: '/decisao', label: 'Decidir por mim' }]}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {recomendados.map((d) => <DestinoCard key={d.code} d={d} img={imgs[d.code]} />)}
          </div>
        </EmptyState>
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
