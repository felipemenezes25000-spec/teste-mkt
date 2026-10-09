'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import { carregar, salvar, CHAVE } from './store.js';

// Estado das viagens no dispositivo, sincronizado entre abas (evento storage).
// `aplicar(fn)` roda uma transformação PURA do store; erros de validação voltam
// como { erro } para a UI mostrar — nada é gravado pela metade.
export function useViagens() {
  const [estado, setEstado] = useState(null); // null = carregando (SSR seguro)
  const ref = useRef(null);

  useEffect(() => {
    const s = carregar();
    ref.current = s;
    setEstado(s); // eslint-disable-line react-hooks/set-state-in-effect
    const onStorage = (e) => { if (e.key === CHAVE) { const n = carregar(); ref.current = n; setEstado(n); } };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const aplicar = useCallback((fn) => {
    try {
      const novo = fn(ref.current || carregar());
      ref.current = novo;
      setEstado(novo);
      const ok = salvar(novo);
      return ok ? { ok: true } : { ok: true, aviso: 'Não foi possível salvar neste navegador (modo privado?). As mudanças valem só nesta aba.' };
    } catch (e) {
      return { erro: (e && e.message) || 'Não foi possível salvar.' };
    }
  }, []);

  return { estado, aplicar, carregando: estado === null };
}
