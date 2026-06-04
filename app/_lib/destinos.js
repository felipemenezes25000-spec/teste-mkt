import { PAISES_REF } from '../_engine/data.js';
import { slugify } from './slug.js';
import { WIKIDATA_EXTRA } from '../_engine/paisesMundo.js';

// Catálogo base de destinos derivado dos países de referência do motor. Cada um
// vira uma página /destino/[slug]; o conteúdo rico (fatos, fotos, atrações) é
// puxado ao vivo nas Server Components. DESTAQUES = vitrine da home (ordem importa).
const DESTAQUES = ['PT', 'TH', 'PE', 'MX', 'TR', 'ID', 'MA', 'VN'];

// QID do país na Wikidata — usado pra puxar pontos turísticos reais (SPARQL).
const WIKIDATA = {
  ...WIKIDATA_EXTRA,
  TH: 'Q869', VN: 'Q881', KH: 'Q424', LA: 'Q819', ID: 'Q252', MY: 'Q833',
  PH: 'Q928', IN: 'Q668', NP: 'Q837', LK: 'Q854', PE: 'Q419', BO: 'Q750',
  CO: 'Q739', AR: 'Q414', CL: 'Q298', MX: 'Q96', GT: 'Q774', PT: 'Q45',
  GE: 'Q230', TR: 'Q43', MA: 'Q1028', ZA: 'Q258',
};

export const DESTINOS = PAISES_REF.map((p) => ({
  ...p,
  slug: slugify(p.nome),
  destaque: DESTAQUES.includes(p.code),
  wikidataId: WIKIDATA[p.code] || null,
}));

export function destinoPorSlug(slug) {
  return DESTINOS.find((d) => d.slug === slug) || null;
}

export function destinoPorCode(code) {
  return DESTINOS.find((d) => d.code === code) || null;
}

export function destinosDestaque() {
  return DESTAQUES.map((code) => DESTINOS.find((d) => d.code === code)).filter(Boolean);
}

export const REGIOES = [...new Set(DESTINOS.map((d) => d.regiao))];
