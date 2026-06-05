import { describe, test, expect } from 'vitest';
import { wikiThumb } from './wikiThumb.js';

const ORIG = 'https://upload.wikimedia.org/wikipedia/commons/9/91/Lagoa_das_Sete_Cidades3.jpg';
const THUMB = 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/77/Wat_Arun.JPG/3840px-Wat_Arun.JPG';
const FP = 'https://commons.wikimedia.org/wiki/Special:FilePath/';

// Usa Special:FilePath/<arquivo>?width=N — lida com upscale (devolve original) e
// downscale (gera thumb) sem 400, sem precisar saber o tamanho do original.
describe('wikiThumb', () => {
  test('URL original do Commons → Special:FilePath na largura pedida', () => {
    expect(wikiThumb(ORIG, 640)).toBe(FP + 'Lagoa_das_Sete_Cidades3.jpg?width=640');
  });

  test('URL que já é thumb → Special:FilePath do mesmo arquivo, nova largura', () => {
    expect(wikiThumb(THUMB, 640)).toBe(FP + 'Wat_Arun.JPG?width=640');
  });

  test('largura padrão é 640', () => {
    expect(wikiThumb(ORIG)).toBe(FP + 'Lagoa_das_Sete_Cidades3.jpg?width=640');
  });

  test('preserva nome de arquivo com caracteres codificados', () => {
    expect(wikiThumb('https://upload.wikimedia.org/wikipedia/commons/6/65/Torre_Bel%C3%A9m_April_2009-4a.jpg', 1280))
      .toBe(FP + 'Torre_Bel%C3%A9m_April_2009-4a.jpg?width=1280');
  });

  test('Special:FilePath de entrada → só ajusta o width', () => {
    expect(wikiThumb(FP + 'X.jpg', 480)).toBe(FP + 'X.jpg?width=480');
    expect(wikiThumb(FP + 'X.jpg?width=3000', 480)).toBe(FP + 'X.jpg?width=480');
  });

  test('imagem local de outra wiki (/wikipedia/en/) → Special:FilePath no host daquela wiki', () => {
    expect(wikiThumb('https://upload.wikimedia.org/wikipedia/en/a/a2/Jakarta_National-Monument.jpg', 960))
      .toBe('https://en.wikipedia.org/wiki/Special:FilePath/Jakarta_National-Monument.jpg?width=960');
  });

  test('URL não-Wikimedia passa direto', () => {
    expect(wikiThumb('https://exemplo.com/foto.jpg', 640)).toBe('https://exemplo.com/foto.jpg');
  });

  test('valores vazios retornam como estão', () => {
    expect(wikiThumb(null, 640)).toBe(null);
    expect(wikiThumb('', 640)).toBe('');
  });

  test('largura para blur (32px) também funciona', () => {
    expect(wikiThumb(ORIG, 32)).toBe(FP + 'Lagoa_das_Sete_Cidades3.jpg?width=32');
  });
});
