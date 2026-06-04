import { describe, it, expect } from 'vitest';
import { normalizarPlano, novoTrechoDeRef } from './storage.js';
import { PAISES_REF } from './data.js';

describe('normalizarPlano — migração dos campos novos (visto granular + custo por cidade)', () => {
  it('preenche extensão/comprovante/cidadesCusto em planos antigos', () => {
    const antigo = { legs: [{ nome: 'X', dias: 10, custoDia: 20 }] };
    const l = normalizarPlano(antigo).legs[0];
    expect(l.vistoExtensao).toBe(false);
    expect(l.vistoExtensaoNota).toBe('');
    expect(l.vistoComprovanteSaida).toBe(true); // default seguro: a maioria pede onward
    expect(l.cidadesCusto).toEqual({});
  });

  it('preserva valores já preenchidos (não sobrescreve)', () => {
    const p = { legs: [{ nome: 'Y', dias: 5, custoDia: 10, vistoComprovanteSaida: false, vistoExtensao: true, vistoExtensaoNota: '+30d', cidadesCusto: { Bali: 25 } }] };
    const l = normalizarPlano(p).legs[0];
    expect(l.vistoComprovanteSaida).toBe(false);
    expect(l.vistoExtensao).toBe(true);
    expect(l.vistoExtensaoNota).toBe('+30d');
    expect(l.cidadesCusto.Bali).toBe(25);
  });

  it('novoTrechoDeRef já vem com os campos novos', () => {
    const t = novoTrechoDeRef(PAISES_REF[0], 'BR');
    expect(t.vistoComprovanteSaida).toBe(true);
    expect(t.vistoExtensao).toBe(false);
    expect(t.cidadesCusto).toEqual({});
  });
});
