import { describe, it, expect } from 'vitest';
import { dadosLocais, apagarDadosLocais, pacoteExportacao } from './meusDados.js';

const mem = (obj) => { const m = new Map(Object.entries(obj)); return { get length() { return m.size; }, key: (i) => [...m.keys()][i] ?? null, getItem: (k) => m.get(k) ?? null, removeItem: (k) => m.delete(k), _m: m }; };

describe('LGPD — dados do aparelho', () => {
  it('exporta só as chaves do app e desserializa JSON', () => {
    const st = mem({ 'msf.viagens.v1': '{"viagens":[1]}', 'mundosemfim.theme': 'dark', 'outro.site': 'x' });
    expect(dadosLocais(st)).toEqual({ 'msf.viagens.v1': { viagens: [1] }, 'mundosemfim.theme': 'dark' });
  });
  it('apaga só as chaves do app', () => {
    const st = mem({ 'msf.viagens.v1': '{}', 'mundosemfim.plan.v3': '{}', 'outro.site': 'x' });
    expect(apagarDadosLocais(st)).toBe(2);
    expect([...st._m.keys()]).toEqual(['outro.site']);
  });
  it('pacote tem formato versionado', () => {
    expect(pacoteExportacao({ local: {}, conta: null }).formato).toBe('mundo-sem-fim/export@1');
  });
});
