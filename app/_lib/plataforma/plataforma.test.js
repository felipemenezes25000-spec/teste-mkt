import { describe, it, expect } from 'vitest';
import { precoComMargem, novaProposta, adicionarItemProposta, totais, paraPublico, codificarPublico, decodificarPublico, removerItemProposta } from './proposta.js';
import { normalizarMarca, varsDaMarca, contraste, hexParaRgb } from './marca.js';
import { gerarChave, prefixoDe, hashChave, chaveDoPedido, FORMATO_CHAVE } from './apiKeys.js';
import { pedidoCheckout, taxaPlataforma, repasse, PRODUTOS } from './produtos.js';

describe('proposta B2B', () => {
  it('preço = custo + margem com a mesma regra do banco (sem erro de ponto flutuante)', () => {
    expect(precoComMargem(1000000, 15)).toBe(1150000); // mesmo valor do teste de RLS
    expect(precoComMargem(10, 15)).toBe(12); // 11.5 → 12 (float daria 11)
    expect(precoComMargem(100, 0)).toBe(100);
    expect(precoComMargem(100, 999)).toBe(160); // margem limitada a 60%
    expect(precoComMargem(-5, 10)).toBe(0);
  });
  it('valida dados obrigatórios e datas', () => {
    expect(() => novaProposta({ titulo: 'x', clienteNome: 'Ana' })).toThrow();
    expect(() => novaProposta({ titulo: 'Japão', clienteNome: '' })).toThrow();
    expect(() => novaProposta({ titulo: 'Japão', clienteNome: 'Ana', inicio: '2026-11-10', fim: '2026-11-01' })).toThrow();
    expect(() => novaProposta({ titulo: 'Japão', clienteNome: 'Ana', clienteEmail: 'sem-arroba' })).toThrow();
  });
  it('totais, lucro e preço por pessoa', () => {
    let p = novaProposta({ titulo: 'Lua de mel', clienteNome: 'Ana', pessoas: 2, margemPct: 10 });
    p = adicionarItemProposta(p, { titulo: 'Hotel', custo: 1000, tipo: 'LODGING' });
    p = adicionarItemProposta(p, { titulo: 'Passeio', custo: 250.5, tipo: 'EXPERIENCE', dia: 2 });
    const t = totais(p);
    expect(t.custoMinor).toBe(125050);
    expect(t.precoMinor).toBe(137555);
    expect(t.lucroMinor).toBe(12505);
    expect(t.porPessoaMinor).toBe(68778);
    expect(totais(removerItemProposta(p, p.itens[0].id)).custoMinor).toBe(25050);
  });
  it('visão do cliente não expõe custo, margem, lucro nem e-mail', () => {
    let p = novaProposta({ titulo: 'Lua de mel', clienteNome: 'Ana', clienteEmail: 'ana@x.com', margemPct: 20 });
    p = adicionarItemProposta(p, { titulo: 'Hotel', custo: 1000 });
    const pub = paraPublico(p, { nomeExibido: 'Agência X' });
    const s = JSON.stringify(pub);
    expect(s).not.toMatch(/custo|margem|lucro|ana@x\.com/i);
    expect(pub.precoMinor).toBe(120000);
  });
  it('link sem servidor: ida e volta com acentos, e entrada maliciosa é recusada', () => {
    let p = novaProposta({ titulo: 'Japão — cultura', clienteNome: 'Júlia', destinoCode: 'JP' });
    p = adicionarItemProposta(p, { titulo: 'Ryokan em Quioto', custo: 900 });
    const cod = codificarPublico(paraPublico(p, null));
    const volta = decodificarPublico(cod);
    expect(volta.titulo).toBe('Japão — cultura');
    expect(volta.cliente).toBe('Júlia');
    expect(volta.itens[0].titulo).toBe('Ryokan em Quioto');
    expect(decodificarPublico('<script>')).toBeNull();
    expect(decodificarPublico('abc')).toBeNull();
    expect(decodificarPublico(btoa(JSON.stringify({ v: 2 })))).toBeNull();
  });
});

describe('white-label', () => {
  it('normaliza: cor inválida e logo não-https caem no padrão', () => {
    const m = normalizarMarca({ nomeExibido: '  Agência Sol  ', corPrimaria: 'vermelho', logoUrl: 'javascript:alert(1)' });
    expect(m.nomeExibido).toBe('Agência Sol');
    expect(m.corPrimaria).toBe('#2742F5');
    expect(m.logoUrl).toBe('');
    expect(normalizarMarca({ logoUrl: 'http://x.com/l.png' }).logoUrl).toBe('');
    expect(normalizarMarca({ logoUrl: 'https://x.com/l.png' }).logoUrl).toBe('https://x.com/l.png');
  });
  it('texto sobre a cor da marca sempre ≥ 4.5:1 e a cor de texto é escurecida quando precisa', () => {
    for (const cor of ['#C8FA3C', '#FFD400', '#0A7D5A', '#FF6B6B', '#111111', '#7FDBFF']) {
      const v = varsDaMarca({ corPrimaria: cor });
      const fundo = v.style['--c-pine'].split(' ').map(Number);
      const on = v.style['--c-on-pine'].split(' ').map(Number);
      expect(contraste(fundo, on)).toBeGreaterThanOrEqual(4.5);
      expect(contraste(fundo, [243, 245, 248])).toBeGreaterThanOrEqual(4.5);
    }
    expect(varsDaMarca({ corPrimaria: '#FFD400' }).ajustadaParaTexto).toBe(true);
    expect(hexParaRgb('#000000')).toEqual([0, 0, 0]);
  });
});

describe('chaves da API', () => {
  it('gera no formato certo, únicas, com prefixo exibível', () => {
    const a = gerarChave(); const b = gerarChave('test');
    expect(a).toMatch(FORMATO_CHAVE);
    expect(b.startsWith('msf_test_')).toBe(true);
    expect(a).not.toBe(gerarChave());
    expect(prefixoDe(a)).toMatch(/^msf_live_[A-Za-z0-9]{6}$/);
    expect(prefixoDe('msf_live_curta')).toBeNull();
    expect(() => gerarChave('prod')).toThrow();
  });
  it('hash SHA-256 conhecido', async () => {
    expect(await hashChave('abc')).toBe('ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad');
  });
  it('lê a chave do header x-api-key ou Bearer', () => {
    const req = (h) => ({ headers: new Headers(h) });
    expect(chaveDoPedido(req({ 'x-api-key': ' msf_live_x ' }))).toBe('msf_live_x');
    expect(chaveDoPedido(req({ authorization: 'Bearer msf_test_y' }))).toBe('msf_test_y');
    expect(chaveDoPedido(req({ authorization: 'Bearer eyJabc.def' }))).toBeNull();
  });
});

describe('checkout de produtos próprios', () => {
  it('preço nunca vem do cliente e ids são validados', () => {
    expect(pedidoCheckout({ plano: 'premium' })).toEqual({ tipo: 'assinatura', plano: 'premium' });
    expect(pedidoCheckout({ plano: 'gold' }).erro).toBeTruthy();
    expect(pedidoCheckout({ produto: 'trip_pass', preco: 1 })).toEqual({ tipo: 'produto', produto: 'trip_pass', id: null });
    expect(pedidoCheckout({ produto: 'roteiro', id: 'x' }).erro).toBeTruthy();
    expect(pedidoCheckout({ produto: 'roteiro', id: '40000000-0000-0000-0000-0000000000C1' }).id).toBe('40000000-0000-0000-0000-0000000000c1');
    expect(pedidoCheckout({ produto: 'voo' }).erro).toBeTruthy();
    expect(pedidoCheckout(null).erro).toBeTruthy();
  });
  it('taxa de 20% e repasse fecham o valor', () => {
    expect(taxaPlataforma(4900)).toBe(980);
    expect(repasse(4900)).toBe(3920);
    expect(taxaPlataforma(4900) + repasse(4900)).toBe(4900);
    expect(PRODUTOS.trip_pass.precoMinor).toBe(4900);
  });
});

describe('marketplace: roteiros da equipe e adaptação', () => {
  it('gera roteiros determinísticos só com pontos que têm coordenada', async () => {
    const { roteirosEquipe, roteiroEquipePorSlug, vizinhoMaisProximo } = await import('./roteirosEquipe.js');
    const lista = roteirosEquipe();
    expect(lista.length).toBeGreaterThanOrEqual(15);
    for (const r of lista) {
      expect(r.totalDias).toBeGreaterThanOrEqual(3);
      expect(r.totalDias).toBeLessThanOrEqual(10);
      expect(r.precoMinor).toBe(0);
      for (const d of r.dias) {
        expect(d.itens.length).toBeGreaterThan(0);
        expect(d.itens.length).toBeLessThanOrEqual(3);
        for (const it of d.itens) expect(Number.isFinite(it.lat) && Number.isFinite(it.lng)).toBe(true);
      }
    }
    expect(new Set(lista.map((r) => r.slug)).size).toBe(lista.length);
    expect(roteiroEquipePorSlug(lista[0].slug)).toBe(lista[0]);
    const v = vizinhoMaisProximo([{ lat: 0, lng: 0 }, { lat: 0, lng: 10 }, { lat: 0, lng: 1 }]);
    expect(v.map((p) => p.lng)).toEqual([0, 1, 10]);
  });
  it('adapta roteiro numa viagem local com um dia por dia do roteiro', async () => {
    const { roteirosEquipe } = await import('./roteirosEquipe.js');
    const { viagemDeRoteiro } = await import('./adaptar.js');
    const { estadoVazio } = await import('../viagens/store.js');
    const r = roteirosEquipe().find((x) => x.destinoCode === 'JP') || roteirosEquipe()[0];
    const { estado, id } = viagemDeRoteiro(estadoVazio(), r, { inicio: '2026-11-01', pessoas: 2, timeZone: 'Asia/Tokyo' });
    const v = estado.viagens.find((x) => x.id === id);
    expect(v.dias.length).toBe(r.totalDias);
    expect(v.itens.length).toBe(r.dias.reduce((s, d) => s + d.itens.length, 0));
    expect(v.itens.every((i) => v.dias.includes(i.dia))).toBe(true);
    expect(() => viagemDeRoteiro(estadoVazio(), r, { inicio: '' })).toThrow();
  });
});
