import { describe, it, expect } from 'vitest';
import { planoExemplo } from './storage.js';
import { gerarChecklist } from './checklist.js';

describe('gerarChecklist', () => {
  it('gera grupos com itens universais + derivados da rota', () => {
    const grupos = gerarChecklist(planoExemplo());
    const todos = grupos.flatMap((g) => g.itens);
    expect(grupos.length).toBeGreaterThanOrEqual(2);
    expect(todos.some((i) => /Passaporte/.test(i.texto))).toBe(true);   // universal
    expect(todos.some((i) => /Indonésia/.test(i.texto))).toBe(true);    // derivado da rota
  });

  it('ids são únicos e estáveis por trecho (pra persistir o "feito")', () => {
    const ids = gerarChecklist(planoExemplo()).flatMap((g) => g.itens).map((i) => i.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('rota vazia ainda traz os itens genéricos', () => {
    expect(gerarChecklist({ legs: [] }).flatMap((g) => g.itens).length).toBeGreaterThan(0);
  });
});
