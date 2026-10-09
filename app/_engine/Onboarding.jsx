import { useState, useEffect } from 'react';
import { Modal } from '../_ui/Modal.jsx';
import { Button } from '../_ui/Button.jsx';
import { Icon } from '../_ui/Icon.jsx';

const KEY = 'mundosemfim.onboarded.v1';

// Boas-vindas de 1ª execução: explica o tripé (estação × visto × fôlego).
// Mostra uma vez (flag no localStorage). Reabrível pelo botão "Ajuda".
export default function Onboarding({ forcado, onClose }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    try { if (!localStorage.getItem(KEY)) setOpen(true); } catch (e) {}
  }, []);
  useEffect(() => { if (forcado) setOpen(true); }, [forcado]);

  if (!open) return null;
  const fechar = () => { try { localStorage.setItem(KEY, '1'); } catch (e) {} setOpen(false); onClose && onClose(); };

  const Card = ({ icon, t, children }) => (
    <div className="rounded-lg border border-line bg-paper2/50 p-3">
      <div className="text-lg" aria-hidden><Icon emoji={icon} /></div>
      <b className="text-ink text-sm">{t}</b>
      <p className="text-xs text-inksoft mt-0.5">{children}</p>
    </div>
  );

  return (
    <Modal title="Bem-vindo ao Mundo Sem Fim" onClose={fechar}
      footer={<Button onClick={fechar}>Começar a planejar <Icon emoji="→" /></Button>}>
      <p className="text-sm text-inksoft">
        O que a gente faz e os apps de férias curtas não fazem: te ajudar a decidir <b className="text-ink">em que ORDEM</b> fazer os países — cruzando os três fatores que quebram um mochilão longo:
      </p>
      <div className="grid sm:grid-cols-3 gap-2">
        <Card icon="🌤️" t="Estação">chegar na seca, não na monção.</Card>
        <Card icon="🛂" t="Visto">não ficar mais dias do que o visto permite.</Card>
        <Card icon="💰" t="Fôlego">ver o dia exato em que a grana acaba.</Card>
      </div>
      <p className="text-sm text-inksoft">
        Arraste os trechos (ou use ▲▼) e <b className="text-ink">tudo recalcula na hora</b>. Já deixamos uma rota de exemplo pronta — edite à vontade. Tudo fica salvo no seu navegador (e na nuvem, se você entrar).
      </p>
    </Modal>
  );
}
