import { describe, test, expect } from 'vitest';
import { wikiThumb, larguraPadrao, arquivoWikimedia, LARGURAS_PADRAO } from './wikiThumb.js';

const ORIG = 'https://upload.wikimedia.org/wikipedia/commons/9/91/Lagoa_das_Sete_Cidades3.jpg';
const THUMB = 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/77/Wat_Arun.JPG/3840px-Wat_Arun.JPG';
const FP = 'https://commons.wikimedia.org/wiki/Special:FilePath/';

describe('larguraPadrao (política de thumbnails do Wikimedia)', () => {
  test('sempre devolve uma largura da lista oficial', () => {
    for (const w of [1, 32, 100, 200, 300, 480, 640, 700, 900, 1200, 1600, 5000]) {
      expect(LARGURAS_PADRAO).toContain(larguraPadrao(w));
    }
  });
  test('encaixa no mais próximo e respeita o teto de 1280 no cliente', () => {
    expect(larguraPadrao(480)).toBe(500);
    expect(larguraPadrao(640)).toBe(500);
    expect(larguraPadrao(900)).toBe(960);
    expect(larguraPadrao(1600)).toBe(1280);
    expect(larguraPadrao(32)).toBe(120);
  });
});

describe('wikiThumb', () => {
  test('original do Commons → FilePath em largura padrão', () => {
    expect(wikiThumb(ORIG, 640)).toBe(FP + 'Lagoa_das_Sete_Cidades3.jpg?width=500');
  });
  test('thumb existente fora do padrão → FilePath em largura padrão', () => {
    expect(wikiThumb(THUMB, 960)).toBe(FP + 'Wat_Arun.JPG?width=960');
  });
  test('thumb já em largura padrão (resolvido no servidor) fica intacto', () => {
    const seguro = 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Cittadimatera1.jpg/500px-Cittadimatera1.jpg';
    expect(wikiThumb(seguro, 960)).toBe(seguro);
  });
  test('padrão é 500', () => {
    expect(wikiThumb(ORIG)).toBe(FP + 'Lagoa_das_Sete_Cidades3.jpg?width=500');
  });
  test('preserva nome codificado', () => {
    expect(wikiThumb('https://upload.wikimedia.org/wikipedia/commons/6/65/Torre_Bel%C3%A9m_April_2009-4a.jpg', 1280))
      .toBe(FP + 'Torre_Bel%C3%A9m_April_2009-4a.jpg?width=1280');
  });
  test('FilePath de entrada → só reencaixa o width', () => {
    expect(wikiThumb(FP + 'X.jpg?width=3000', 480)).toBe(FP + 'X.jpg?width=500');
  });
  test('upload local de outra wiki → FilePath daquela wiki', () => {
    expect(wikiThumb('https://upload.wikimedia.org/wikipedia/en/a/a2/Jakarta_National-Monument.jpg', 960))
      .toBe('https://en.wikipedia.org/wiki/Special:FilePath/Jakarta_National-Monument.jpg?width=960');
  });
  test('não-Wikimedia passa direto; vazios retornam como estão', () => {
    expect(wikiThumb('https://exemplo.com/foto.jpg', 640)).toBe('https://exemplo.com/foto.jpg');
    expect(wikiThumb(null, 640)).toBe(null);
    expect(wikiThumb('', 640)).toBe('');
  });
  test('força https', () => {
    expect(wikiThumb('http://commons.wikimedia.org/wiki/Special:FilePath/Kazan.jpg', 480)).toBe(FP + 'Kazan.jpg?width=500');
  });
});

describe('arquivoWikimedia', () => {
  test('extrai o nome do arquivo de qualquer formato', () => {
    expect(arquivoWikimedia(ORIG)).toBe('Lagoa_das_Sete_Cidades3.jpg');
    expect(arquivoWikimedia(THUMB)).toBe('Wat_Arun.JPG');
    expect(arquivoWikimedia(FP + 'Torre_Bel%C3%A9m.jpg?width=500')).toBe('Torre_Belém.jpg');
    expect(arquivoWikimedia('https://exemplo.com/a.jpg')).toBe(null);
  });
});
