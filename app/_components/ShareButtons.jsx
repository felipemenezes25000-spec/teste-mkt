'use client';
import { useState } from 'react';
import { Icon } from '../_ui/Icon.jsx';

// Botões de compartilhamento social. WhatsApp/X são <a> target=_blank (navegação de
// topo → fora da CSP, sem allowlist). "Copiar" usa clipboard; "📤" usa a Web Share
// API nativa (mobile) com fallback pra copiar. Sem dependências externas.
export function ShareButtons({ url, titulo, texto }) {
  const [copiado, setCopiado] = useState(false);
  const msg = texto || titulo;
  const wa = `https://wa.me/?text=${encodeURIComponent(`${msg} ${url}`)}`;
  const x = `https://twitter.com/intent/tweet?text=${encodeURIComponent(msg)}&url=${encodeURIComponent(url)}`;

  const copiar = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 1800);
    } catch {
      try {
        const ta = document.createElement('textarea');
        ta.value = url; ta.style.position = 'fixed'; ta.style.opacity = '0';
        document.body.appendChild(ta); ta.select(); document.execCommand('copy');
        document.body.removeChild(ta);
        setCopiado(true);
        setTimeout(() => setCopiado(false), 1800);
      } catch { /* nenhum método de cópia disponível */ }
    }
  };
  const nativo = async () => {
    try { if (navigator.share) await navigator.share({ title: titulo, text: texto, url }); else await copiar(); } catch { /* cancelado */ }
  };

  const cls = 'inline-flex items-center gap-1.5 rounded-lg border border-line bg-card px-3 py-2 text-sm font-semibold text-ink hover:border-pine/50 transition focusring';
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-sm text-inksoft mr-1">Compartilhar:</span>
      <a href={wa} target="_blank" rel="noopener noreferrer" className={cls}><Icon emoji="💬" /> WhatsApp</a>
      <a href={x} target="_blank" rel="noopener noreferrer" className={cls} aria-label="Compartilhar no X/Twitter">𝕏 Twitter</a>
      <button type="button" onClick={copiar} className={cls}>{copiado ? 'Copiado!' : 'Copiar link'}</button>
      <button type="button" onClick={nativo} className={`${cls} sm:hidden`} aria-label="Mais opções de compartilhamento"><Icon emoji="📤" /></button>
    </div>
  );
}
