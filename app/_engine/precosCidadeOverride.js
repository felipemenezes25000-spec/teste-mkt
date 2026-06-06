// Override editorial sobre PRECOS_CIDADE (auto-gerado pelo workflow
// "precos-enriquecimento-v2"). Chave 'CODE' (ISO 3166-1 alpha-2),
// valor objeto { cidade: { ...mesmo formato de PRECOS_CIDADE[code][cidade] } }.
//
// Override SUBSTITUI a cidade inteira (não merge profundo). Pra corrigir UMA
// dica, copie a cidade inteira do gerado, modifique, cole aqui.
//
// Override NUNCA é regerado por workflow — é a forma de manter correções
// editoriais perenes entre re-pesquisas.
export const PRECOS_CIDADE_OVERRIDE = {
};
