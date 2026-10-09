// Roteiros-base da EQUIPE Mundo Sem Fim para o marketplace (gratuitos).
// Gerados de forma determinística do catálogo: atrações COM coordenada
// verificada, agrupadas por cidade e ordenadas por vizinho mais próximo,
// 3 por dia, num raio de 700 km do núcleo. Uso no SERVIDOR (importa o dataset de coordenadas).
import { DESTINOS } from '../destinos.js';
import { DESTINOS_PRIORITARIOS } from '../destinos-prioritarios.js';
import { pontosDoPais } from '../geo.js';

const POR_DIA = 3;
const MAX_DIAS = 10;
const MIN_DIAS = 3;
const RAIO_KM = 700; // cidades longe do núcleo (ilhas, outra costa) ficam de fora

function km(a, b) {
  const R = 6371;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLng = ((b.lng - a.lng) * Math.PI) / 180;
  const h = Math.sin(dLat / 2) ** 2 + Math.cos((a.lat * Math.PI) / 180) * Math.cos((b.lat * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

/** Ordena por vizinho mais próximo a partir do primeiro ponto. */
export function vizinhoMaisProximo(pontos) {
  if (pontos.length < 3) return [...pontos];
  const resto = [...pontos];
  const out = [resto.shift()];
  while (resto.length) {
    const ult = out[out.length - 1];
    let mi = 0;
    for (let i = 1; i < resto.length; i++) if (km(ult, resto[i]) < km(ult, resto[mi])) mi = i;
    out.push(resto.splice(mi, 1)[0]);
  }
  return out;
}

export function roteiroDoDestino(d) {
  const { atracoes } = pontosDoPais(d);
  const porCidade = new Map();
  for (const a of atracoes) {
    const c = a.sub || d.cidadePrincipal || d.nome;
    if (!porCidade.has(c)) porCidade.set(c, []);
    porCidade.get(c).push(a);
  }
  // cidades com mais atrações primeiro; a principal ganha desempate
  const cidades = [...porCidade.entries()]
    .filter(([, l]) => l.length >= 2)
    .sort((a, b) => b[1].length - a[1].length || (a[0] === d.cidadePrincipal ? -1 : 1));
  const centro = (l) => ({ lat: l.reduce((s, p) => s + p.lat, 0) / l.length, lng: l.reduce((s, p) => s + p.lng, 0) / l.length });
  const nucleo = cidades.length ? centro(cidades[0][1]) : null;
  // perto do núcleo e visitadas em sequência geográfica (sem ir e voltar)
  const perto = cidades.filter(([, l]) => km(nucleo, centro(l)) <= RAIO_KM).map(([c, l]) => ({ c, l, ...centro(l) }));
  const sequencia = vizinhoMaisProximo(perto);
  const dias = [];
  const usadas = [];
  for (const { c: cidade, l: lista } of sequencia) {
    if (dias.length >= MAX_DIAS) break;
    const ordem = vizinhoMaisProximo(lista);
    for (let i = 0; i < ordem.length && dias.length < MAX_DIAS; i += POR_DIA) {
      dias.push({
        dia: dias.length + 1,
        cidade,
        itens: ordem.slice(i, i + POR_DIA).map((a) => ({ titulo: a.nome, placeId: a.id, lat: a.lat, lng: a.lng, duracaoMin: 120 })),
      });
    }
    usadas.push(cidade);
  }
  if (dias.length < MIN_DIAS) return null;
  const n = dias.length;
  return {
    slug: `${d.slug}-${n}-dias`,
    titulo: `${d.nome} em ${n} dias`,
    destinoCode: d.code,
    destinoNome: d.nome,
    regiao: d.regiao,
    cidades: usadas,
    dias,
    totalDias: n,
    resumo: `${usadas.slice(0, 4).join(', ')}${usadas.length > 4 ? ' e mais' : ''}: ${n} dias com ${dias.reduce((s, x) => s + x.itens.length, 0)} paradas agrupadas por cidade e ordenadas por proximidade.`,
    autor: { nome: 'Equipe Mundo Sem Fim', tipo: 'equipe' },
    precoMinor: 0,
    moeda: 'BRL',
    melhoresMeses: d.melhoresMeses || [],
    custoDia: d.custoDia,
    metodo: 'Gerado do catálogo: só atrações com coordenada verificada (Wikipedia/Wikidata), 3 por dia, sem horários fixos. Ajuste ritmo e datas ao adaptar.',
  };
}

let _cache = null;
export function roteirosEquipe() {
  if (_cache) return _cache;
  _cache = DESTINOS_PRIORITARIOS.map((code) => DESTINOS.find((d) => d.code === code)).filter(Boolean).map(roteiroDoDestino).filter(Boolean);
  return _cache;
}

export function roteiroEquipePorSlug(slug) {
  return roteirosEquipe().find((r) => r.slug === slug) || null;
}
