import { useCallback, useRef, useState } from 'react';
import { Modal } from '../_ui/Modal.jsx';
import { Button } from '../_ui/Button.jsx';

// Confirmação como Promise<boolean>, substituindo window.confirm() (síncrono e
// bloqueante — congelava a aba em iframe/automação). Uso:
//   const { confirm, confirmElement } = useConfirm();
//   if (await confirm({ title, message, confirmLabel })) { ... }
// e renderize {confirmElement} uma vez na árvore.
const PADRAO = { title: 'Tem certeza?', message: '', confirmLabel: 'Confirmar', cancelLabel: 'Cancelar', variant: 'danger' };

export function useConfirm() {
  const [opts, setOpts] = useState(null);
  const resolver = useRef(null);

  const confirm = useCallback((o) => new Promise((resolve) => {
    resolver.current = resolve;
    setOpts({ ...PADRAO, ...o });
  }), []);

  const fechar = useCallback((val) => {
    setOpts(null);
    const r = resolver.current;
    resolver.current = null;
    if (r) r(val);
  }, []);

  const confirmElement = opts ? (
    <Modal
      title={opts.title}
      onClose={() => fechar(false)}
      footer={(
        <>
          <Button variant="secondary" onClick={() => fechar(false)}>{opts.cancelLabel}</Button>
          <Button variant={opts.variant} onClick={() => fechar(true)}>{opts.confirmLabel}</Button>
        </>
      )}
    >
      <p className="text-sm text-inksoft">{opts.message}</p>
    </Modal>
  ) : null;

  return { confirm, confirmElement };
}
