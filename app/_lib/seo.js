// Helpers de SEO PUROS (testáveis): montagem do sitemap + blocos JSON-LD (schema.org).
// Sem deps de Next/React — as rotas (sitemap.js/robots.js) e o <JsonLd> só consomem isto.

const ORG_NOME = 'Mundo Sem Fim';
const ORG_DESC =
  'A camada de decisão neutra acima das OTAs: decide pra onde ir pelo seu perfil, mostra o custo real da viagem (não só voo + hotel) e monta o roteiro que recalcula.';

const semBarra = (u) => String(u).replace(/\/+$/, '');

// URL pública do site — fonte única p/ robots.txt e sitemap.xml. Mesma ordem de
// resolução do layout (override explícito → domínio estável da Vercel → fallback).
export function siteUrl() {
  return (
    process.env.NEXT_PUBLIC_SITE_URL ||
    (process.env.VERCEL_PROJECT_PRODUCTION_URL && `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`) ||
    'https://mundo-sem-fim.vercel.app'
  );
}

// Rotas indexáveis. /salvos e /conta são pessoais → ficam de fora do índice.
const ROTAS_CORE = [
  { path: '', priority: 1.0, changeFrequency: 'weekly' },
  { path: '/explorar', priority: 0.9, changeFrequency: 'weekly' },
  { path: '/decisao', priority: 0.9, changeFrequency: 'weekly' },
  { path: '/planejar', priority: 0.8, changeFrequency: 'monthly' },
  { path: '/roteiro', priority: 0.7, changeFrequency: 'monthly' },
  { path: '/voos', priority: 0.6, changeFrequency: 'monthly' },
  { path: '/comparar', priority: 0.6, changeFrequency: 'monthly' },
  { path: '/planos', priority: 0.8, changeFrequency: 'monthly' },
];

export function construirSitemap(destinos = [], baseUrl = '', lastmod = new Date()) {
  const base = semBarra(baseUrl);
  const lastModified = lastmod instanceof Date ? lastmod : new Date(lastmod);
  const core = ROTAS_CORE.map((r) => ({
    url: base + r.path,
    lastModified,
    changeFrequency: r.changeFrequency,
    priority: r.priority,
  }));
  const dest = destinos.map((d) => ({
    url: `${base}/destino/${d.slug}`,
    lastModified,
    changeFrequency: 'monthly',
    priority: 0.7,
  }));
  return [...core, ...dest];
}

export function jsonLdOrganization(baseUrl = '') {
  const base = semBarra(baseUrl);
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: ORG_NOME,
    url: base,
    description: ORG_DESC,
    logo: `${base}/icon.svg`,
  };
}

export function jsonLdWebSite(baseUrl = '') {
  const base = semBarra(baseUrl);
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: ORG_NOME,
    url: base,
    inLanguage: 'pt-BR',
    potentialAction: {
      '@type': 'SearchAction',
      target: { '@type': 'EntryPoint', urlTemplate: `${base}/explorar?q={search_term_string}` },
      'query-input': 'required name=search_term_string',
    },
  };
}

export function jsonLdDestino(d, baseUrl = '') {
  const base = semBarra(baseUrl);
  const out = {
    '@context': 'https://schema.org',
    '@type': 'TouristDestination',
    name: d.nome,
    url: `${base}/destino/${d.slug}`,
    description: `Melhor época, custo médio, pontos turísticos e comida típica de ${d.nome}.`,
  };
  if (Array.isArray(d.coords) && d.coords.length === 2) {
    const [lng, lat] = d.coords;
    out.geo = { '@type': 'GeoCoordinates', latitude: lat, longitude: lng };
  }
  return out;
}

export function jsonLdBreadcrumb(items = []) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: it.nome,
      item: it.url,
    })),
  };
}

export function jsonLdProduto(ofertas = [], baseUrl = '') {
  const base = semBarra(baseUrl);
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: `${ORG_NOME} Premium`,
    description:
      'Assinatura do Mundo Sem Fim: roteiros ilimitados com IA, comparação pelo seu perfil, custo total detalhado, alertas de visto/orçamento e exportação em PDF.',
    brand: { '@type': 'Brand', name: ORG_NOME },
    url: `${base}/planos`,
    offers: ofertas.map((o) => ({
      '@type': 'Offer',
      name: o.nome,
      price: o.preco,
      priceCurrency: 'BRL',
      url: `${base}/planos`,
      availability: 'https://schema.org/InStock',
    })),
  };
}
