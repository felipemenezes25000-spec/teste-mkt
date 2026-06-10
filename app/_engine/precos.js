// Getters puros sobre PRECOS_CIDADE (V2) + override. Sem efeitos colaterais.
// Override SUBSTITUI a cidade inteira (semântica simples e previsível).
import { PRECOS_CIDADE, PRECOS_META } from './precosCidadeCategoria.js';
import { PRECOS_CIDADE_OVERRIDE } from './precosCidadeOverride.js';

function getCidadeData(code, cidade) {
  if (!code || !cidade) return null;
  const ovrCidade = PRECOS_CIDADE_OVERRIDE[code]?.[cidade];
  if (ovrCidade) return ovrCidade;
  return PRECOS_CIDADE[code]?.[cidade] ?? null;
}

export function precosCidade(code, cidade) {
  return getCidadeData(code, cidade);
}

export function dicasDe(code, cidade) {
  return getCidadeData(code, cidade)?.dicasEconomia ?? [];
}

export function passesDe(code, cidade) {
  return getCidadeData(code, cidade)?.passesCombo ?? [];
}

export function especialidadesDe(code, cidade) {
  return getCidadeData(code, cidade)?.especialidades ?? [];
}

export function gratuitosCuradosDe(code, cidade) {
  return getCidadeData(code, cidade)?.gratuitosCurados ?? [];
}

export function metaCategoriaDe(code, cidade, categoria) {
  return getCidadeData(code, cidade)?.categoriasMeta?.[categoria] ?? null;
}

export function confiancaCidade(code, cidade) {
  return getCidadeData(code, cidade)?.confianca ?? null;
}

export function fontesCidade(code, cidade) {
  return getCidadeData(code, cidade)?.fontes ?? [];
}

export function cidadesComV2(code) {
  if (!code) return [];
  const base = Object.keys(PRECOS_CIDADE[code] ?? {});
  const ovr = Object.keys(PRECOS_CIDADE_OVERRIDE[code] ?? {});
  return [...new Set([...base, ...ovr])];
}

export function temV2(code, cidade) {
  return getCidadeData(code, cidade) !== null;
}

// Fatia V2 completa de um país, pronta pra atravessar a fronteira server→client
// como prop: o catálogo inteiro (~2.9MB) fica no bundle do servidor e só as
// cidades do país viajam serializadas no HTML. Consumida por OQueFazer.
export function dadosV2DoPais(code) {
  const cidades = cidadesComV2(code);
  if (!cidades.length) return null;
  const porCidade = {};
  for (const cidade of cidades) {
    porCidade[cidade] = {
      dicas: dicasDe(code, cidade),
      passes: passesDe(code, cidade),
      especialidades: especialidadesDe(code, cidade),
      gratuitos: gratuitosCuradosDe(code, cidade),
      fontes: fontesCidade(code, cidade),
      confianca: confiancaCidade(code, cidade),
    };
  }
  return { cidades, porCidade, meta: precosMeta() };
}

export function precosMeta() {
  const pesquisadoEm = PRECOS_META?.pesquisadoEm;
  let diasDesdePesquisa = 0;
  if (pesquisadoEm) {
    const dataPesquisa = new Date(pesquisadoEm).getTime();
    if (!Number.isNaN(dataPesquisa)) {
      diasDesdePesquisa = Math.max(0, Math.floor((Date.now() - dataPesquisa) / 86400000));
    }
  }
  return { ...PRECOS_META, diasDesdePesquisa };
}
