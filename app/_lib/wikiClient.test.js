import { describe, test, expect, vi, afterEach } from 'vitest';

// Módulo novo, fresco a cada teste (cache é estado de módulo) + fetch mockado.
// O cliente usa a Action API da Wikipédia (w/api.php), não a REST summary —
// retorna 3-4 parágrafos com história/curiosidades em vez do lead seco.
async function carregar(fetchImpl) {
  vi.resetModules();
  vi.stubGlobal('fetch', fetchImpl);
  // limpa sessionStorage entre testes pra cache não vazar
  if (typeof sessionStorage !== 'undefined') sessionStorage.clear();
  return (await import('./wikiClient.js')).resumoClient;
}

const okJson = (body) => ({ ok: true, status: 200, json: async () => body });

// Página real-formato da Action API: query.pages[pageid] = {extract, fullurl, title, original, thumbnail}
function pagina({ titulo = 'Capela Sistina', extract, fullurl, original, thumbnail, missing, disambiguation }) {
  const page = { pageid: 1, ns: 0, title: titulo };
  if (missing) page.missing = '';
  if (extract != null) page.extract = extract;
  if (fullurl) page.fullurl = fullurl;
  if (original) page.original = { source: original };
  if (thumbnail) page.thumbnail = { source: thumbnail };
  if (disambiguation) page.pageprops = { disambiguation: '' };
  return { batchcomplete: '', query: { pages: { 1: page } } };
}

const verbeteBom = pagina({
  titulo: 'Capela Sistina',
  extract: 'A Capela Sistina é uma das capelas mais importantes do complexo do Palácio Apostólico, residência oficial do Papa. Seu nome deriva do Papa Sisto IV, que a mandou restaurar entre 1473 e 1481.',
  fullurl: 'https://pt.wikipedia.org/wiki/Capela_Sistina',
  original: 'https://img/original.jpg',
  thumbnail: 'https://img/thumb.jpg',
});

afterEach(() => { vi.unstubAllGlobals(); vi.restoreAllMocks(); });

describe('resumoClient (Action API)', () => {
  test('retorna extrato longo, url, título e imagem (prefere original)', async () => {
    const f = vi.fn().mockResolvedValue(okJson(verbeteBom));
    const resumoClient = await carregar(f);
    const r = await resumoClient('Capela Sistina');
    expect(r.extrato).toMatch(/Capela Sistina/);
    expect(r.extrato).toMatch(/Palácio Apostólico/);
    expect(r.url).toBe('https://pt.wikipedia.org/wiki/Capela_Sistina');
    expect(r.titulo).toBe('Capela Sistina');
    expect(r.img).toBe('https://img/original.jpg');
    // chama Action API, não REST summary
    expect(f).toHaveBeenCalledTimes(1);
    expect(f.mock.calls[0][0]).toContain('pt.wikipedia.org/w/api.php');
    expect(f.mock.calls[0][0]).toContain('exchars=1200');
    expect(f.mock.calls[0][0]).toContain('explaintext=1');
  });

  test('faz cache: a segunda chamada do mesmo título não chama fetch de novo', async () => {
    const f = vi.fn().mockResolvedValue(okJson(verbeteBom));
    const resumoClient = await carregar(f);
    await resumoClient('Capela Sistina');
    await resumoClient('Capela Sistina');
    expect(f).toHaveBeenCalledTimes(1);
  });

  test('deduplica chamadas simultâneas (in-flight) num único fetch', async () => {
    const f = vi.fn().mockResolvedValue(okJson(verbeteBom));
    const resumoClient = await carregar(f);
    await Promise.all([resumoClient('Capela Sistina'), resumoClient('Capela Sistina')]);
    expect(f).toHaveBeenCalledTimes(1);
  });

  test('título vazio retorna erro sem chamar fetch', async () => {
    const f = vi.fn();
    const resumoClient = await carregar(f);
    expect(await resumoClient('')).toEqual({ erro: true });
    expect(f).not.toHaveBeenCalled();
  });

  test('fallback {erro:true} quando a página está marcada como missing', async () => {
    const f = vi.fn().mockResolvedValue(okJson(pagina({ titulo: 'Inexistente', missing: true })));
    const resumoClient = await carregar(f);
    // sem pt → tenta en (também missing)
    f.mockResolvedValueOnce(okJson(pagina({ titulo: 'Inexistente', missing: true })));
    expect(await resumoClient('Inexistente')).toEqual({ erro: true });
  });

  test('fallback quando a página é desambiguação', async () => {
    const desambig = pagina({ titulo: 'Lagos', extract: 'Lagos pode se referir a...', disambiguation: true });
    const f = vi.fn().mockResolvedValue(okJson(desambig));
    const resumoClient = await carregar(f);
    expect(await resumoClient('Lagos')).toEqual({ erro: true });
  });

  test('fallback quando o extrato é curto demais (stub)', async () => {
    const stub = pagina({ titulo: 'Stub', extract: 'Stub muito curto.' });
    const f = vi.fn().mockResolvedValue(okJson(stub));
    const resumoClient = await carregar(f);
    expect(await resumoClient('Stub')).toEqual({ erro: true });
  });

  test('fallback quando a rede falha (throw)', async () => {
    const f = vi.fn().mockRejectedValue(new Error('network'));
    const resumoClient = await carregar(f);
    expect(await resumoClient('Qualquer')).toEqual({ erro: true });
  });

  test('cai pra en.wikipedia quando pt vem vazio', async () => {
    const ptVazio = okJson(pagina({ titulo: 'Tuvalu Spot', missing: true }));
    const enBom = okJson(pagina({
      titulo: 'Tuvalu Spot',
      extract: 'Tuvalu Spot is a notable landmark in the central Pacific, known for its coral reefs and traditional Polynesian culture. The site has been inhabited for over 3000 years.',
      fullurl: 'https://en.wikipedia.org/wiki/Tuvalu_Spot',
      original: 'https://img/en.jpg',
    }));
    const f = vi.fn().mockResolvedValueOnce(ptVazio).mockResolvedValueOnce(enBom);
    const resumoClient = await carregar(f);
    const r = await resumoClient('Tuvalu Spot');
    expect(r.extrato).toMatch(/Polynesian culture/);
    expect(r.url).toContain('en.wikipedia.org');
    expect(f).toHaveBeenCalledTimes(2);
    expect(f.mock.calls[0][0]).toContain('pt.wikipedia.org');
    expect(f.mock.calls[1][0]).toContain('en.wikipedia.org');
  });

  test('limpa referências [1] [carece de fontes] do extrato', async () => {
    const sujo = pagina({
      titulo: 'Lugar',
      extract: 'O lugar foi fundado em 1500[1]. É um marco da região[2][carece de fontes]. Hoje recebe muitos visitantes que vêm conhecer sua arquitetura única.',
    });
    const f = vi.fn().mockResolvedValue(okJson(sujo));
    const resumoClient = await carregar(f);
    const r = await resumoClient('Lugar');
    expect(r.extrato).not.toMatch(/\[\d+\]/);
    expect(r.extrato).not.toMatch(/carece de fontes/);
    expect(r.extrato).toContain('fundado em 1500');
  });

  test('usa thumbnail quando não há original', async () => {
    const semOriginal = pagina({
      titulo: 'Capela Sistina',
      extract: verbeteBom.query.pages[1].extract,
      thumbnail: 'https://img/thumb.jpg',
    });
    const f = vi.fn().mockResolvedValue(okJson(semOriginal));
    const resumoClient = await carregar(f);
    expect((await resumoClient('Capela Sistina')).img).toBe('https://img/thumb.jpg');
  });
});
