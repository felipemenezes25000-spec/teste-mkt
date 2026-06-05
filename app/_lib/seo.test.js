import { describe, it, expect } from 'vitest';
import {
  construirSitemap,
  jsonLdOrganization,
  jsonLdWebSite,
  jsonLdDestino,
  jsonLdBreadcrumb,
  jsonLdProduto,
  siteUrl,
} from './seo.js';

const BASE = 'https://exemplo.com';
const DESTINOS = [
  { slug: 'japao', nome: 'Japão', code: 'JP', coords: [138, 36], regiao: 'Ásia' },
  { slug: 'peru', nome: 'Peru', code: 'PE', coords: [-75, -10], regiao: 'América do Sul' },
];
const QUANDO = new Date('2026-06-05T00:00:00Z');

describe('construirSitemap', () => {
  it('inclui rotas principais + uma entrada por destino', () => {
    const urls = construirSitemap(DESTINOS, BASE, QUANDO).map((e) => e.url);
    expect(urls).toContain('https://exemplo.com');
    expect(urls).toContain('https://exemplo.com/explorar');
    expect(urls).toContain('https://exemplo.com/decisao');
    expect(urls).toContain('https://exemplo.com/planos');
    expect(urls).toContain('https://exemplo.com/destino/japao');
    expect(urls).toContain('https://exemplo.com/destino/peru');
  });

  it('home tem prioridade máxima e nenhuma URL termina com barra', () => {
    const mapa = construirSitemap(DESTINOS, BASE, QUANDO);
    expect(mapa.find((e) => e.url === 'https://exemplo.com').priority).toBe(1);
    expect(mapa.every((e) => !e.url.endsWith('/'))).toBe(true);
  });

  it('normaliza baseUrl com barra final (não duplica)', () => {
    const urls = construirSitemap(DESTINOS, 'https://exemplo.com/', QUANDO).map((e) => e.url);
    expect(urls).toContain('https://exemplo.com/explorar');
    expect(urls.some((u) => u.includes('//explorar'))).toBe(false);
  });
});

describe('JSON-LD', () => {
  it('Organization: contexto, tipo, nome e url', () => {
    const o = jsonLdOrganization(BASE);
    expect(o['@context']).toBe('https://schema.org');
    expect(o['@type']).toBe('Organization');
    expect(o.name).toBe('Mundo Sem Fim');
    expect(o.url).toBe(BASE);
  });

  it('WebSite: SearchAction aponta pra busca em /explorar', () => {
    const w = jsonLdWebSite(BASE);
    expect(w['@type']).toBe('WebSite');
    const tgt = String(w.potentialAction.target.urlTemplate || w.potentialAction.target);
    expect(tgt).toContain('/explorar');
    expect(tgt).toContain('{search_term_string}');
  });

  it('TouristDestination: nome, url canônica e geo a partir de coords [lng,lat]', () => {
    const j = jsonLdDestino(DESTINOS[0], BASE);
    expect(j['@type']).toBe('TouristDestination');
    expect(j.name).toBe('Japão');
    expect(j.url).toBe('https://exemplo.com/destino/japao');
    expect(j.geo.latitude).toBe(36);
    expect(j.geo.longitude).toBe(138);
  });

  it('TouristDestination: sem coords não quebra (geo ausente)', () => {
    const j = jsonLdDestino({ slug: 'x', nome: 'X' }, BASE);
    expect(j.geo).toBeUndefined();
    expect(j.url).toBe('https://exemplo.com/destino/x');
  });

  it('BreadcrumbList: posições em ordem crescente', () => {
    const b = jsonLdBreadcrumb([
      { nome: 'Início', url: BASE },
      { nome: 'Explorar', url: BASE + '/explorar' },
      { nome: 'Japão', url: BASE + '/destino/japao' },
    ]);
    expect(b['@type']).toBe('BreadcrumbList');
    expect(b.itemListElement.map((i) => i.position)).toEqual([1, 2, 3]);
    expect(b.itemListElement[2].name).toBe('Japão');
    expect(b.itemListElement[2].item).toBe(BASE + '/destino/japao');
  });

  it('Product: lista as ofertas em BRL', () => {
    const p = jsonLdProduto([{ nome: 'Premium', preco: '19.00' }, { nome: 'Pro', preco: '39.00' }], BASE);
    expect(p['@type']).toBe('Product');
    expect(p.offers[0].priceCurrency).toBe('BRL');
    expect(p.offers[0].price).toBe('19.00');
    expect(p.offers[1].price).toBe('39.00');
  });
});

describe('siteUrl — URL pública (fonte única p/ robots + sitemap)', () => {
  it('prioriza NEXT_PUBLIC_SITE_URL quando definido', () => {
    const prev = process.env.NEXT_PUBLIC_SITE_URL;
    process.env.NEXT_PUBLIC_SITE_URL = 'https://meu.dominio';
    expect(siteUrl()).toBe('https://meu.dominio');
    if (prev === undefined) delete process.env.NEXT_PUBLIC_SITE_URL;
    else process.env.NEXT_PUBLIC_SITE_URL = prev;
  });

  it('cai num fallback https quando nada está setado', () => {
    const a = process.env.NEXT_PUBLIC_SITE_URL;
    const b = process.env.VERCEL_PROJECT_PRODUCTION_URL;
    delete process.env.NEXT_PUBLIC_SITE_URL;
    delete process.env.VERCEL_PROJECT_PRODUCTION_URL;
    expect(siteUrl()).toMatch(/^https:\/\//);
    if (a !== undefined) process.env.NEXT_PUBLIC_SITE_URL = a;
    if (b !== undefined) process.env.VERCEL_PROJECT_PRODUCTION_URL = b;
  });
});
