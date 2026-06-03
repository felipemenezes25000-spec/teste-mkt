import { useState } from 'react';
import { Modal } from '../_ui/Modal.jsx';
import { Button } from '../_ui/Button.jsx';
import { emailValido } from './utils.js';

// Login por "magic link" (Supabase OTP). Substitui o window.prompt() que
// bloqueava a aba (e congelava em iframe/automação). onSubmit(email) DEVE lançar
// em caso de erro — o erro aparece inline, sem fechar o modal.
export default function LoginModal({ onClose, onSubmit }) {
  const [email, setEmail] = useState('');
  const [busy, setBusy] = useState(false);
  const [enviado, setEnviado] = useState(false);
  const [erro, setErro] = useState('');
  const valido = emailValido(email);

  async function enviar(e) {
    if (e && e.preventDefault) e.preventDefault();
    if (!valido || busy) return;
    setBusy(true); setErro('');
    try {
      await onSubmit(email.trim());
      setEnviado(true);
    } catch (err) {
      setErro((err && err.message) || 'Não consegui enviar o link. Tente de novo.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <Modal
      title={enviado ? 'Confira seu e-mail ✉️' : 'Entrar / criar conta'}
      onClose={onClose}
      footer={enviado
        ? <Button onClick={onClose}>Entendi</Button>
        : (
          <>
            <Button variant="secondary" onClick={onClose}>Cancelar</Button>
            <Button onClick={enviar} loading={busy} disabled={!valido}>Enviar link mágico</Button>
          </>
        )}
    >
      {enviado ? (
        <p className="text-sm text-inksoft">
          Enviamos um <b>link mágico</b> para <b className="text-ink">{email.trim()}</b>. Abra o e-mail no mesmo
          aparelho e clique no link pra entrar — a partir daí sua rota <b>salva na nuvem</b> e sincroniza entre dispositivos.
        </p>
      ) : (
        <form onSubmit={enviar} className="space-y-3">
          <p className="text-sm text-inksoft">
            Entre com seu e-mail pra <b className="text-ink">salvar sua rota na nuvem</b>, sincronizar entre dispositivos e
            usar as features de <b className="text-ink">IA</b>. Sem senha: a gente envia um link mágico.
          </p>
          <label className="block text-sm text-ink font-medium">
            E-mail
            <input
              type="email" autoComplete="email" inputMode="email" autoFocus
              value={email}
              onChange={(e) => { setEmail(e.target.value); if (erro) setErro(''); }}
              placeholder="voce@exemplo.com"
              aria-invalid={email && !valido ? true : undefined}
              className="mt-1 w-full px-3 py-2 rounded-lg border border-line bg-input text-ink focusring"
            />
          </label>
          {email && !valido && <p className="text-xs text-clay">Digite um e-mail válido.</p>}
          {erro && <p className="text-xs text-clay" role="alert">{erro}</p>}
          <p className="text-[11px] text-inksoft">Usamos seu e-mail só pra login e pra sincronizar sua rota. Sem spam.</p>
          {/* submit implícito pelo Enter; o botão de envio fica no rodapé do modal */}
          <button type="submit" className="hidden" aria-hidden tabIndex={-1} />
        </form>
      )}
    </Modal>
  );
}
