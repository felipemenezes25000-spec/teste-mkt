import { DESTINOS } from './_lib/destinos.js';
import { construirSitemap, siteUrl } from './_lib/seo.js';

// sitemap.xml — rotas principais + uma entrada por destino (os 167 países). Gerado no
// build a partir do catálogo (DESTINOS); a lógica pura vive em _lib/seo.js (testada).
export default function sitemap() {
  return construirSitemap(DESTINOS, siteUrl(), new Date());
}
