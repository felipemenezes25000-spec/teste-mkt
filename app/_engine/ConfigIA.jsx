import { useState } from 'react';
import { AI_PROVIDERS, MOEDAS } from './data.js';
import { fmtTimestamp, num } from './utils.js';
import { Modal } from '../_ui/Modal.jsx';
import { Button } from '../_ui/Button.jsx';
import { Icon } from '../_ui/Icon.jsx';

const nomeMoeda = (code) => (MOEDAS.find(m => m.code === code) || {}).nome || code;

export default function ConfigIA({ ai, onSaveAi, onClose, fx, moedasEmUso, onAtualizarCambio, cambioBusy, onSetRate }) {
  const [draft, setDraft] = useState(ai);
  const prov = AI_PROVIDERS[draft.provider] || AI_PROVIDERS.openai;
  const rates = (fx && fx.rates) || {};

  function setProvider(p) {
    const def = AI_PROVIDERS[p];
    setDraft(d => ({ ...d, provider: p, baseUrl: def.baseUrl || d.baseUrl || '', model: def.model || d.model || '' }));
  }

  return (
    <Modal title="IA & Configurações" onClose={onClose}
      footer={<Button variant="secondary" onClick={onClose}>Fechar</Button>}>
      <p className="text-sm text-inksoft">As features de IA chamam o provedor que você escolher, com a <b>sua própria chave</b> — guardada só no seu navegador, nada vai pra servidor nenhum. <b className="text-ink">Funciona sem login.</b></p>

      <div className="text-xs bg-success-bg border border-success-bd text-success rounded-lg p-3">
        <p className="font-semibold mb-1"><Icon emoji="🎁" /> Não tem chave? Pegue uma de graça (Groq, ~2 min):</p>
        <ol className="list-decimal pl-4 space-y-0.5">
          <li>Crie conta em <b>console.groq.com</b> (gratuito).</li>
          <li>Em <b>API Keys</b>, gere uma chave (começa com <code>gsk_</code>).</li>
          <li>Aqui, escolha o provedor <b>Groq (free tier)</b> e cole a chave. Pronto.</li>
        </ol>
        <p className="mt-1 opacity-80">OpenAI e Anthropic funcionam igual, mas são pagos por uso.</p>
      </div>

      <label className="block text-sm text-ink font-medium">Provedor
        <select value={draft.provider} onChange={(e) => setProvider(e.target.value)} className="mt-1 w-full px-3 py-2 rounded-lg border border-line bg-input focusring">
          {Object.entries(AI_PROVIDERS).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
        </select>
      </label>
      <label className="block text-sm text-ink font-medium">Chave de API
        <input type="password" value={draft.apiKey} placeholder={prov.keyHint} onChange={(e) => setDraft(d => ({ ...d, apiKey: e.target.value }))}
          className="mt-1 w-full px-3 py-2 rounded-lg border border-line bg-input focusring" />
      </label>
      <div className="grid sm:grid-cols-2 gap-3">
        <label className="block text-sm text-ink font-medium">Endpoint (base URL)
          <input value={draft.baseUrl} placeholder={prov.baseUrl || 'https://...'} onChange={(e) => setDraft(d => ({ ...d, baseUrl: e.target.value }))}
            className="mt-1 w-full px-3 py-2 rounded-lg border border-line bg-input focusring text-sm" />
        </label>
        <label className="block text-sm text-ink font-medium">Modelo
          <input value={draft.model} placeholder={prov.model || 'modelo'} onChange={(e) => setDraft(d => ({ ...d, model: e.target.value }))}
            className="mt-1 w-full px-3 py-2 rounded-lg border border-line bg-input focusring text-sm" />
        </label>
      </div>
      <div className="flex justify-end">
        <Button onClick={() => onSaveAi(draft)}>Salvar IA</Button>
      </div>

      {/* Câmbio */}
      <div className="border-t border-line pt-4">
        <div className="flex items-center justify-between gap-2">
          <h4 className="font-display text-lg text-ink">Câmbio</h4>
          <Button variant="secondary" size="sm" onClick={onAtualizarCambio} loading={cambioBusy}><Icon emoji="↻" /> Atualizar câmbio agora</Button>
        </div>
        <p className="text-xs text-inksoft mt-1">
          {fx && fx.atualizadoEm ? `Atualizado em ${fmtTimestamp(fx.atualizadoEm)} (fonte gratuita, sem chave).` : 'Usando taxas iniciais aproximadas — clique em atualizar quando tiver internet.'}
          {' '}As taxas são aproximadas e editáveis; confira antes de decisões financeiras.
        </p>
        <div className="mt-2 grid sm:grid-cols-2 gap-2">
          {moedasEmUso.map(code => (
            <label key={code} className="text-xs text-inksoft flex items-center gap-2 bg-input border border-line rounded-lg px-2 py-1.5">
              <span className="w-10 font-semibold text-ink">{code}</span>
              <span className="text-[11px]">1 USD =</span>
              <input type="number" step="any" min="0" value={rates[code] ?? ''} onChange={(e) => onSetRate(code, num(e.target.value))}
                aria-label={`Taxa de ${nomeMoeda(code)} por dólar`} className="flex-1 w-full px-2 py-1 rounded border border-line bg-input text-ink tnum focusring" />
            </label>
          ))}
        </div>
      </div>

      <div className="text-xs text-inksoft bg-paper2 rounded-lg p-3 border border-line">
        <Icon emoji="⚠" /> A chave de IA fica em texto no <code>localStorage</code> deste navegador. Não use em computador compartilhado e <b>nunca</b> compartilhe o arquivo exportado (a exportação já remove a chave por segurança).
      </div>
    </Modal>
  );
}
