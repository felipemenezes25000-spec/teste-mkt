'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useViagens } from '../../_lib/viagens/useViagens.js';
import { viagemDeRoteiro } from '../../_lib/plataforma/adaptar.js';
import { fusoDe } from '../../_lib/viagens/fuso.js';
import { useIdioma } from '../../_lib/i18n.js';
import { Icon } from '../../_ui/Icon.jsx';

const emDias = (n) => { const d = new Date(); d.setUTCDate(d.getUTCDate() + n); return d.toISOString().slice(0, 10); };

// Transforma o roteiro numa viagem do workspace (local, offline) e abre a viagem.
export function AdaptarRoteiro({ roteiro, centro }) {
  const { t } = useIdioma();
  const { aplicar } = useViagens();
  const router = useRouter();
  const [inicio, setInicio] = useState(() => emDias(45));
  const [pessoas, setPessoas] = useState(2);
  const [busy, setBusy] = useState(false);
  const [erro, setErro] = useState('');

  async function adaptar(e) {
    e.preventDefault();
    setBusy(true); setErro('');
    const tz = await fusoDe(centro);
    let id = null;
    const r = aplicar((s) => { const out = viagemDeRoteiro(s, roteiro, { inicio, pessoas, timeZone: tz }); id = out.id; return out.estado; });
    setBusy(false);
    if (r.erro) { setErro(r.erro); return; }
    router.push(`/viagens/${id}`);
  }

  return (
    <form onSubmit={adaptar} className="rounded-2xl border border-line bg-card p-5 space-y-3" aria-label={t('plat.adaptar')}>
      <h2 className="font-display text-xl text-ink">{t('plat.adaptar')}</h2>
      <p className="text-sm text-inksoft">{t('plat.adaptarP')}</p>
      <div className="grid grid-cols-2 gap-3">
        <label className="block text-xs font-medium text-inksoft">{t('viag.ida')}
          <input type="date" required value={inicio} onChange={(e) => setInicio(e.target.value)} className="mt-1 w-full h-10 px-3 rounded-lg border border-line bg-input text-ink text-sm focusring" />
        </label>
        <label className="block text-xs font-medium text-inksoft">{t('viag.pessoas')}
          <input type="number" min="1" max="20" value={pessoas} onChange={(e) => setPessoas(Number(e.target.value))} className="mt-1 w-full h-10 px-3 rounded-lg border border-line bg-input text-ink text-sm focusring tnum" />
        </label>
      </div>
      {erro && <p role="alert" className="text-sm text-danger">{erro}</p>}
      <button type="submit" disabled={busy} className="w-full inline-flex items-center justify-center gap-2 h-11 rounded-lg bg-coral text-oncoral font-semibold hover:brightness-95 disabled:opacity-60 focusring">
        <Icon name="suitcase" size={17} /> {busy ? t('viag.criando') : t('plat.adaptarBtn')}
      </button>
    </form>
  );
}
