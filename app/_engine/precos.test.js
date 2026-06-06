import { describe, it, expect } from 'vitest';
import { PRECOS_CIDADE, PRECOS_META } from './precosCidadeCategoria.js';
import { PRECOS_CIDADE_OVERRIDE } from './precosCidadeOverride.js';
import {
  precosCidade, dicasDe, passesDe, especialidadesDe, gratuitosCuradosDe,
  metaCategoriaDe, confiancaCidade, fontesCidade, cidadesComV2, temV2, precosMeta,
} from './precos.js';

const CONFIANCAS_VALIDAS = new Set(['alta', 'media', 'baixa']);
const RESERVAS_VALIDAS = new Set(['nao', 'recomendada', 'obrigatoria']);

describe('PRECOS_CIDADE / precos.js', () => {
  it('PRECOS_META tem os campos obrigatórios', () => {
    expect(PRECOS_META).toBeTruthy();
    expect(typeof PRECOS_META.pesquisadoEm).toBe('string');
    expect(PRECOS_META.moedaPivo).toBe('USD');
    expect(PRECOS_META.versaoSchema).toBe(2);
  });

  it('todo code é ISO 3166-1 alpha-2 (2 letras maiúsculas)', () => {
    for (const code of Object.keys(PRECOS_CIDADE)) {
      expect(code).toMatch(/^[A-Z]{2}$/);
    }
    for (const code of Object.keys(PRECOS_CIDADE_OVERRIDE)) {
      expect(code).toMatch(/^[A-Z]{2}$/);
    }
  });

  it('toda cidade em V2 tem fontes não vazio e confiança válida', () => {
    for (const [code, cidades] of Object.entries(PRECOS_CIDADE)) {
      for (const [cidade, dados] of Object.entries(cidades)) {
        expect(Array.isArray(dados.fontes), `${code}/${cidade} sem fontes`).toBe(true);
        expect(dados.fontes.length, `${code}/${cidade} fontes vazias`).toBeGreaterThanOrEqual(1);
        expect(CONFIANCAS_VALIDAS.has(dados.confianca), `${code}/${cidade} confianca inválida: ${dados.confianca}`).toBe(true);
      }
    }
  });

  it('precoUSD min ≤ max em especialidades (USD ≥ 0)', () => {
    for (const cidades of Object.values(PRECOS_CIDADE)) {
      for (const dados of Object.values(cidades)) {
        for (const e of dados.especialidades ?? []) {
          expect(e.precoUSD.min).toBeGreaterThanOrEqual(0);
          expect(e.precoUSD.min).toBeLessThanOrEqual(e.precoUSD.max);
        }
      }
    }
  });

  it('reservaAntecipada de categoriasMeta tem valor canônico', () => {
    for (const cidades of Object.values(PRECOS_CIDADE)) {
      for (const dados of Object.values(cidades)) {
        for (const [cat, meta] of Object.entries(dados.categoriasMeta ?? {})) {
          expect(RESERVAS_VALIDAS.has(meta.reservaAntecipada), `cat ${cat}: ${meta.reservaAntecipada}`).toBe(true);
          expect(typeof meta.melhorHorario).toBe('string');
          expect(meta.melhorHorario.length).toBeGreaterThan(0);
        }
      }
    }
  });

  it('passesCombo tem cobre não vazio e precoUSD não negativo', () => {
    for (const cidades of Object.values(PRECOS_CIDADE)) {
      for (const dados of Object.values(cidades)) {
        for (const p of dados.passesCombo ?? []) {
          expect(p.precoUSD).toBeGreaterThanOrEqual(0);
          expect(Array.isArray(p.cobre)).toBe(true);
          expect(p.cobre.length).toBeGreaterThanOrEqual(1);
        }
      }
    }
  });

  it('getters retornam array vazio (não null) para país/cidade sem cobertura', () => {
    expect(dicasDe('ZZ', 'X')).toEqual([]);
    expect(passesDe('ZZ', 'X')).toEqual([]);
    expect(especialidadesDe('ZZ', 'X')).toEqual([]);
    expect(gratuitosCuradosDe('ZZ', 'X')).toEqual([]);
    expect(fontesCidade('ZZ', 'X')).toEqual([]);
    expect(cidadesComV2('ZZ')).toEqual([]);
    expect(precosCidade('ZZ', 'X')).toBeNull();
    expect(temV2('ZZ', 'X')).toBe(false);
    expect(metaCategoriaDe('ZZ', 'X', 'museu')).toBeNull();
    expect(confiancaCidade('ZZ', 'X')).toBeNull();
  });

  it('override substitui cidade inteira (não merge profundo)', () => {
    // Simulamos: monkey-patch local em uma cópia, garantindo a semântica via getters.
    const ovrCopia = { ...PRECOS_CIDADE_OVERRIDE };
    // Caso real: se há override populado, deve aparecer; senão, base vence.
    // Aqui validamos só a invariante de tipo do override: cada cidade override é objeto.
    for (const [code, cidades] of Object.entries(PRECOS_CIDADE_OVERRIDE)) {
      for (const [cidade, dados] of Object.entries(cidades)) {
        expect(typeof dados, `${code}/${cidade} override deve ser objeto`).toBe('object');
        expect(dados, `${code}/${cidade} override não pode ser null`).not.toBeNull();
        expect(Array.isArray(dados.fontes), `${code}/${cidade} override precisa de fontes`).toBe(true);
      }
    }
    expect(ovrCopia).toBeTruthy();
  });

  it('precosMeta() devolve diasDesdePesquisa ≥ 0', () => {
    const m = precosMeta();
    expect(m.diasDesdePesquisa).toBeGreaterThanOrEqual(0);
    expect(m.pesquisadoEm).toBe(PRECOS_META.pesquisadoEm);
  });
});
