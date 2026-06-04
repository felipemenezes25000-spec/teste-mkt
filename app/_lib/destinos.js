import { PAISES_REF } from '../_engine/data.js';
import { slugify } from './slug.js';

// Catálogo base de destinos derivado dos países de referência do motor. Cada um
// vira uma página /destino/[slug]; o conteúdo rico (fatos, fotos, atrações) é
// puxado ao vivo nas Server Components. DESTAQUES = vitrine da home (ordem importa).
const DESTAQUES = ['PT', 'TH', 'PE', 'MX', 'TR', 'ID', 'MA', 'VN'];

export const DESTINOS = PAISES_REF.map((p) => ({
  ...p,
  slug: slugify(p.nome),
  destaque: DESTAQUES.includes(p.code),
}));

export function destinoPorSlug(slug) {
  return DESTINOS.find((d) => d.slug === slug) || null;
}

export function destinosDestaque() {
  return DESTAQUES.map((code) => DESTINOS.find((d) => d.code === code)).filter(Boolean);
}

export const REGIOES = [...new Set(DESTINOS.map((d) => d.regiao))];
