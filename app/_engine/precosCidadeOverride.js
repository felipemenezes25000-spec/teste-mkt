// Override editorial sobre PRECOS_CIDADE (auto-gerado pelo workflow
// "precos-enriquecimento-v2"). Chave 'CODE' (ISO 3166-1 alpha-2),
// valor objeto { cidade: { ...mesmo formato de PRECOS_CIDADE[code][cidade] } }.
//
// Override SUBSTITUI a cidade inteira (não merge profundo). Pra corrigir UMA
// dica, copie a cidade inteira do gerado, modifique, cole aqui.
//
// Override NUNCA é regerado por workflow — é a forma de manter correções
// editoriais perenes entre re-pesquisas.
//
// EXEMPLO de uso (descomente e adapte):
//
// export const PRECOS_CIDADE_OVERRIDE = {
//   TH: {
//     'Bangkok': {
//       categoriasMeta: {
//         templo: { melhorHorario: '7h-9h (calor e ônibus de turistas)', reservaAntecipada: 'nao' },
//         museu:  { melhorHorario: 'abertura ou últimas 2h', reservaAntecipada: 'nao' },
//       },
//       especialidades: [
//         { slug: 'muay-thai', precoUSD: { min: 30, max: 60 }, moedaLocal: '1000-2000 THB',
//           obs: 'Lumpinee = arena tradicional. Rajadamnern = mais turística.' },
//       ],
//       passesCombo: [],
//       gratuitosCurados: ['Wat Saket (Monte Dourado) — entrada livre, doação opcional'],
//       dicasEconomia: ['Tuk-tuk só com preço FIXO combinado antes — Grab é mais barato'],
//       fontes: ['override-editorial-felipe'],
//       confianca: 'alta',
//     },
//   },
// };
export const PRECOS_CIDADE_OVERRIDE = {
};
