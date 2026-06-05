import { describe, it, expect } from 'vitest';
import { PAISES_REF } from './data.js';
import { ATRACOES } from './atracoes.js';
import { COMIDAS } from './comidas.js';

// Gate de conteúdo: barra contaminação de espanhol e typos-âncora no catálogo dos 167
// países. Roda no `vitest run` (build) → falha o deploy se um vestígio de tradução
// automática (invierno/verano/otoño/desierto) ou o typo "Tortúrios" reaparecer.
// "playa"/"muy" ficam FORA de propósito — aparecem em nomes próprios legítimos
// (ex.: "Playa Porto Mari", em Curaçao).
const PROIBIDOS = [
  { re: /\binvierno\b/i, nome: 'invierno (es) → inverno' },
  { re: /\bverano\b/i, nome: 'verano (es) → verão' },
  { re: /\boto[ñn]o\b/i, nome: 'otoño (es) → outono' },
  { re: /\bdesierto\b/i, nome: 'desierto (es) → deserto' },
  { re: /Tort[úu]rios/i, nome: 'Tortúrios (typo)' },
];

function ocorrencias(re) {
  const achados = [];
  for (const p of PAISES_REF) {
    if (re.test(JSON.stringify(p))) achados.push(`país ${p.code || p.nome}`);
  }
  for (const [code, lista] of Object.entries(ATRACOES)) {
    if (re.test(JSON.stringify(lista))) achados.push(`atrações ${code}`);
  }
  for (const [code, lista] of Object.entries(COMIDAS)) {
    if (re.test(JSON.stringify(lista))) achados.push(`comidas ${code}`);
  }
  return achados;
}

describe('gate de conteúdo — sem espanhol/typo no catálogo dos 167', () => {
  for (const { re, nome } of PROIBIDOS) {
    it(`não contém ${nome}`, () => {
      const achados = ocorrencias(re);
      expect(achados, `"${nome}" encontrado em: ${achados.join(', ')}`).toEqual([]);
    });
  }
});
