import { siteUrl } from './_lib/seo.js';

// robots.txt — libera o catálogo todo pros crawlers e aponta o sitemap. Bloqueia API
// e as áreas pessoais (conta/salvos/viagens), que não têm valor de índice.
export default function robots() {
  const base = siteUrl();
  return {
    rules: [{ userAgent: '*', allow: '/', disallow: ['/api/', '/conta', '/salvos', '/viagens'] }],
    sitemap: `${base}/sitemap.xml`,
    host: base,
  };
}
