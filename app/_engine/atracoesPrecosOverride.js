// Correções manuais sobre ATRACOES_PRECOS (gerado por workflow). Chave =
// 'CODE::nome exato'. Sobrevive à regeneração do arquivo de dados.
// Origem: auditoria estatística + revisão por agente (jun/2026).
//
// Aplica-se em atracoesPrecosDoPais: se houver override pra um item, substitui
// precoUSD/precoTipo.
export const ATRACOES_PRECOS_OVERRIDE = {
  // Inconsistência: marcado 'ingresso' com preço 0. Shwenandaw faz parte do
  // bilhete combinado da zona arqueológica de Mandalay (~US$10). Confirmado por
  // auditoria estatística + revisão por agente (39/40 estavam corretos).
  'MM::Mosteiro Shwenandaw (mosteiro de teca)': { precoUSD: 10, precoTipo: 'ingresso' },
};
