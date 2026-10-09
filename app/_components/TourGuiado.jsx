'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Modal } from '../_ui/Modal.jsx';
import { Icon } from '../_ui/Icon.jsx';

// Tour guiado de 3 passos da PLATAFORMA (decidir → planejar → roteiro). Aparece uma
// vez na 1ª visita às telas de produto (gate no localStorage) e é reabrível pelo
// rodapé (evento 'msf:tour'). Complementa o onboarding do planner (tripé), que é
// específico do /planejar — aqui é a orientação do fluxo geral.
const KEY = 'mundosemfim.tour.v1';
const PASSOS = [
  { icon: '🧠', t: 'Primeiro: decida pra onde ir', d: 'A gente ranqueia os destinos pelo SEU perfil — com nota e o porquê de cada um. Sem rolar 200 opções no escuro.' },
  { icon: '🗺️', t: 'Depois: monte a rota na ordem certa', d: 'Estação × visto × fôlego: a ordem dos países muda tudo. O plano recalcula clima, visto e grana assim que você mexe.' },
  { icon: '✨', t: 'Por fim: roteiro + custo real', d: 'Gere o roteiro dia a dia com IA e veja o custo REAL da viagem inteira — não só voo + hotel.' },
];

export function TourGuiado() {
  const [open, setOpen] = useState(false);
  const [i, setI] = useState(0);

  // Não abre sozinho: modal na 1ª visita bloqueava o primeiro valor (OMEGA V4 §30).
  // Abre só sob demanda (rodapé → evento 'msf:tour').

  useEffect(() => {
    const reopen = () => { setI(0); setOpen(true); };
    window.addEventListener('msf:tour', reopen);
    return () => window.removeEventListener('msf:tour', reopen);
  }, []);

  if (!open) return null;
  const fechar = () => { try { localStorage.setItem(KEY, '1'); } catch {} setOpen(false); setI(0); };
  const p = PASSOS[i];
  const ultimo = i === PASSOS.length - 1;
  const btn = 'rounded-full bg-ink text-white font-cond font-extrabold uppercase tracking-[.05em] px-4 py-2 hover:bg-ink/85 focusring';

  return (
    <Modal
      title={p.t}
      onClose={fechar}
      footer={
        <div className="flex items-center gap-2 w-full">
          <span className="text-xs text-inksoft mr-auto" aria-hidden>{i + 1} / {PASSOS.length}</span>
          {i > 0 && (
            <button onClick={() => setI(i - 1)} className="text-sm font-semibold text-inksoft hover:text-ink px-3 py-2 rounded-lg focusring"><Icon emoji="←" /> Voltar</button>
          )}
          {ultimo
            ? <Link href="/decisao" onClick={fechar} className={btn}>Começar (grátis) <Icon emoji="→" /></Link>
            : <button onClick={() => setI(i + 1)} className={btn}>Próximo <Icon emoji="→" /></button>}
        </div>
      }
    >
      <p className="text-inksoft leading-relaxed">{p.d}</p>
      <button onClick={fechar} className="text-xs text-inksoft underline hover:text-ink focusring">pular introdução</button>
    </Modal>
  );
}
