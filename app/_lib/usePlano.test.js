import { describe, it, expect } from 'vitest';
import { temSessaoSalva } from './usePlano.js';

const mem = (chaves) => ({ length: chaves.length, key: (i) => chaves[i] });

describe('usePlano — sessão salva', () => {
  it('detecta a chave de sessão do Supabase e ignora as demais', () => {
    expect(temSessaoSalva(mem(['msf.viagens.v1', 'sb-ikdodbandfndcgyhbzzp-auth-token']))).toBe(true);
    expect(temSessaoSalva(mem(['msf.lang.v1', 'sb-x-code-verifier']))).toBe(false);
    expect(temSessaoSalva(null)).toBe(false);
    expect(temSessaoSalva({ get length() { throw new Error('bloqueado'); } })).toBe(false);
  });
});
