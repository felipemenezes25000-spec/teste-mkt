// Override de título da Wikipédia para CIDADES. A lista d.cidades é string[] usada em
// 6 telas, então não dá pra reestruturar — este mapa resolve ambiguidade/sem-foto sem
// mudar o nome exibido. Ex.: "Lagos" (desambiguação que cai em Lagos/Nigéria) →
// "Lagos (Portugal)". Chave: `${code}:${cidade}`. Serve a FOTO (server) e a HISTÓRIA
// do modal (client). Curadoria manual — adicionar conforme a varredura por país.
export const CIDADE_WIKI = {
  'PT:Lagos': 'Lagos (Portugal)',
};

export function cidadeWiki(code, cidade) {
  return CIDADE_WIKI[`${code}:${cidade}`] || cidade;
}
