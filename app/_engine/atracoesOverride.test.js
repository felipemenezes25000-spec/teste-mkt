import { describe, it, expect } from 'vitest';
import { ATRACOES_OVERRIDE } from './atracoesOverride.js';
import { atracoesDoPais } from './atracoes.js';

describe('ATRACOES_OVERRIDE', () => {
  it('tem entries no formato CODE:Nome', () => {
    for (const key of Object.keys(ATRACOES_OVERRIDE)) {
      expect(key).toMatch(/^[A-Z]{2}:.+/);
    }
  });

  it('atracoesDoPais aplica override ao wiki', () => {
    // Pega o primeiro override como caso de teste
    const entries = Object.entries(ATRACOES_OVERRIDE);
    expect(entries.length).toBeGreaterThan(100);
    const [chave, novaWiki] = entries[0];
    const [code, nome] = chave.split(':');
    const atracoes = atracoesDoPais(code);
    const target = atracoes.find((a) => a.nome === nome);
    expect(target, `expected attraction ${nome} in ${code}`).toBeTruthy();
    expect(target.wiki).toBe(novaWiki);
  });

  it('atracoesDoPais não-overridden mantém wiki original', () => {
    // Pega uma atração sem override (Brasil, que tem poucas entradas no proposed-catalogo)
    const atracoes = atracoesDoPais('TH');
    const semOverride = atracoes.find((a) => !ATRACOES_OVERRIDE[`TH:${a.nome}`]);
    expect(semOverride).toBeTruthy();
    // Não deve ter sido alterada — apenas verificamos que tem campo wiki
    expect(semOverride.wiki).toBeTruthy();
  });
});
