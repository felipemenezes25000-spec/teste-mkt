import { describe, it, expect } from 'vitest';
import { rotuloSalvamento } from './saveStatus.js';

describe('rotuloSalvamento — rótulo do indicador de salvo', () => {
  it('deslogado (local): saved/saving/error', () => {
    const ok = rotuloSalvamento(false, 'saved');
    expect(ok.texto).toBe('Salvo neste navegador');
    expect(ok.tone).toBe('success');
    expect(ok.icone).toBe('✓');
    expect(ok.spinner).toBe(false);

    const salvando = rotuloSalvamento(false, 'saving');
    expect(salvando.texto).toBe('Salvando…');
    expect(salvando.spinner).toBe(true);
    expect(salvando.tone).toBe('neutral');

    const erro = rotuloSalvamento(false, 'error');
    expect(erro.tone).toBe('warn');
    expect(erro.texto).toBe('Não foi possível salvar');
  });

  it('logado (nuvem): saved/saving/error', () => {
    expect(rotuloSalvamento(true, 'saved').texto).toBe('Salvo na nuvem');
    expect(rotuloSalvamento(true, 'saving').texto).toBe('Sincronizando…');
    expect(rotuloSalvamento(true, 'saving').spinner).toBe(true);
    const erro = rotuloSalvamento(true, 'error');
    expect(erro.texto).toBe('Falha ao sincronizar');
    expect(erro.tone).toBe('warn');
  });

  it('estado ausente cai em "saved" (repouso calmo)', () => {
    expect(rotuloSalvamento(false).tone).toBe('success');
    expect(rotuloSalvamento(true).texto).toBe('Salvo na nuvem');
  });

  it('mobile sempre tem um rótulo curto', () => {
    expect(rotuloSalvamento(true, 'saved').textoCurto).toBe('Salvo');
    expect(rotuloSalvamento(false, 'error').textoCurto).toBe('Erro ao salvar');
    expect(rotuloSalvamento(true, 'saving').textoCurto).toBe('Sincronizando…');
  });
});
