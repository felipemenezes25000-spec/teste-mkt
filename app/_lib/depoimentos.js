// Depoimentos REAIS de viajantes. Comece VAZIO e preencha só com depoimentos de
// verdade (com permissão da pessoa). Entradas com `placeholder: true` NÃO aparecem
// no site nem geram JSON-LD de avaliação — isso evita prova social FALSA (enganosa
// e penalizada pelo Google). Quando você adicionar reais, a seção de depoimentos e o
// Review/AggregateRating ligam sozinhos.
//
// Formato de cada entrada:
//   { autor: 'Nome', local: 'contexto (opcional)', nota: 5, texto: 'O que a pessoa disse.' }
//
// Exemplo (placeholder → NÃO renderiza; troque por reais e remova o placeholder):
//   { autor: 'Ana', local: 'mochilão de 6 meses', nota: 5, texto: 'Mudou como planejo.', placeholder: true }

export const DEPOIMENTOS = [];
