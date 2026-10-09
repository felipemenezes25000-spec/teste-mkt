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

// Rotas indexáveis. /salvos, /conta e /viagens são pessoais → ficam de fora do índice.
const ROTAS_CORE = [
  { path: '', priority: 1.0, changeFrequency: 'weekly' },
  { path: '/explorar', priority: 0.9, changeFrequency: 'weekly' },
  { path: '/decisao', priority: 0.9, changeFrequency: 'weekly' },
  { path: '/custo-real', priority: 0.9, changeFrequency: 'weekly' },
  { path: '/planejar', priority: 0.8, changeFrequency: 'monthly' },
  { path: '/roteiro', priority: 0.7, changeFrequency: 'monthly' },
  { path: '/voos', priority: 0.6, changeFrequency: 'monthly' },
  { path: '/comparar', priority: 0.6, changeFrequency: 'monthly' },
  { path: '/planos', priority: 0.8, changeFrequency: 'monthly' },
  { path: '/fontes', priority: 0.5, changeFrequency: 'monthly' },
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

// Review + AggregateRating — SÓ a partir de depoimentos REAIS. Retorna null quando
// não há nenhum (ou só exemplos `placeholder:true`), pra NUNCA emitir markup de
// avaliação falso (enganoso + penalizado pelo Google). Liga sozinho quando o Felipe
// preencher _lib/depoimentos.js com depoimentos de verdade.
export function jsonLdReviews(depoimentos = [], baseUrl = '') {
  const reais = (depoimentos || []).filter((d) => d && !d.placeholder && d.texto && d.nota);
  if (!reais.length) return null;
  const base = semBarra(baseUrl);
  const soma = reais.reduce((s, d) => s + Number(d.nota), 0);
  const ratingValue = Math.round((soma / reais.length) * 10) / 10;
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: ORG_NOME,
    url: base,
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue,
      reviewCount: reais.length,
      bestRating: 5,
      worstRating: 1,
    },
    review: reais.map((d) => ({
      '@type': 'Review',
      author: { '@type': 'Person', name: d.autor || 'Viajante' },
      reviewRating: { '@type': 'Rating', ratingValue: Number(d.nota), bestRating: 5, worstRating: 1 },
      reviewBody: d.texto,
    })),
  };
}

// FAQPage a partir de pares {pergunta, resposta}. Ignora entradas incompletas; null
// se não sobrar nenhuma. Usado nas páginas de destino (melhor época/custo) → rich
// results de FAQ no Google, que são SEO de cauda longa puro.
export function jsonLdFaq(perguntas = []) {
  const validas = (perguntas || []).filter((q) => q && q.pergunta && q.resposta);
  if (!validas.length) return null;
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: validas.map((q) => ({
      '@type': 'Question',
      name: q.pergunta,
      acceptedAnswer: { '@type': 'Answer', text: q.resposta },
    })),
  };
}
