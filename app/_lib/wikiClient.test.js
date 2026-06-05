import { describe, test, expect, vi, afterEach } from 'vitest';

// Módulo novo, fresco a cada teste (cache é estado de módulo) + fetch mockado.
async function carregar(fetchImpl) {
  vi.resetModules();
  vi.stubGlobal('fetch', fetchImpl);
  return (await import('./wikiClient.js')).resumoClient;
}
const respostaOk = (body) => ({ ok: true, status: 200, json: async () => body });
const verbeteBom = {
  type: 'standard',
  title: 'Torre de Belém',
  extract: 'A Torre de Belém é um monumento manuelino em Lisboa.',
  content_urls: { desktop: { page: 'https://pt.wikipedia.org/wiki/Torre_de_Bel%C3%A9m' } },
  originalimage: { source: 'https://img/original.jpg' },
  thumbnail: { source: 'https://img/thumb.jpg' },
};

afterEach(() => { vi.unstubAllGlobals(); vi.restoreAllMocks(); });

describe('resumoClient', () => {
  test('retorna extrato, url, título e imagem (prefere originalimage) quando o verbete existe', async () => {
    const f = vi.fn().mockResolvedValue(respostaOk(verbeteBom));
    const resumoClient = await carregar(f);
    const r = await resumoClient('Torre de Belém');
    expect(r).toEqual({
      extrato: 'A Torre de Belém é um monumento manuelino em Lisboa.',
      url: 'https://pt.wikipedia.org/wiki/Torre_de_Bel%C3%A9m',
      titulo: 'Torre de Belém',
      img: 'https://img/original.jpg',
    });
    // chama o endpoint REST pt com espaços virando underscore
    expect(f).toHaveBeenCalledTimes(1);
    expect(f.mock.calls[0][0]).toContain('pt.wikipedia.org/api/rest_v1/page/summary/Torre_de_Bel');
  });

  test('faz cache: a segunda chamada do mesmo título não chama fetch de novo', async () => {
    const f = vi.fn().mockResolvedValue(respostaOk(verbeteBom));
    const resumoClient = await carregar(f);
    await resumoClient('Torre de Belém');
    await resumoClient('Torre de Belém');
    expect(f).toHaveBeenCalledTimes(1);
  });

  test('deduplica chamadas simultâneas (in-flight) num único fetch', async () => {
    const f = vi.fn().mockResolvedValue(respostaOk(verbeteBom));
    const resumoClient = await carregar(f);
    await Promise.all([resumoClient('Torre de Belém'), resumoClient('Torre de Belém')]);
    expect(f).toHaveBeenCalledTimes(1);
  });

  test('título vazio retorna erro sem chamar fetch', async () => {
    const f = vi.fn();
    const resumoClient = await carregar(f);
    expect(await resumoClient('')).toEqual({ erro: true });
    expect(f).not.toHaveBeenCalled();
  });

  test('fallback {erro:true} quando o verbete não existe (404)', async () => {
    const f = vi.fn().mockResolvedValue({ ok: false, status: 404, json: async () => ({}) });
    const resumoClient = await carregar(f);
    expect(await resumoClient('Inexistente')).toEqual({ erro: true });
  });

  test('fallback quando é página de desambiguação', async () => {
    const f = vi.fn().mockResolvedValue(respostaOk({ type: 'disambiguation', title: 'Lagos', extract: 'várias coisas' }));
    const resumoClient = await carregar(f);
    expect(await resumoClient('Lagos')).toEqual({ erro: true });
  });

  test('fallback quando não há extrato', async () => {
    const f = vi.fn().mockResolvedValue(respostaOk({ type: 'standard', title: 'X', extract: '' }));
    const resumoClient = await carregar(f);
    expect(await resumoClient('X')).toEqual({ erro: true });
  });

  test('fallback quando a rede falha (throw)', async () => {
    const f = vi.fn().mockRejectedValue(new Error('network'));
    const resumoClient = await carregar(f);
    expect(await resumoClient('Qualquer')).toEqual({ erro: true });
  });

  test('usa thumbnail quando não há originalimage', async () => {
    const f = vi.fn().mockResolvedValue(respostaOk({ ...verbeteBom, originalimage: undefined }));
    const resumoClient = await carregar(f);
    expect((await resumoClient('Torre de Belém')).img).toBe('https://img/thumb.jpg');
  });
});
