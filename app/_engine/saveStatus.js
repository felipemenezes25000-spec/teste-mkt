// Mapeia o estado de salvamento para o rótulo do indicador (texto, cor e se mostra
// spinner). Função pura — sem React, sem DOM — pra ser testável como o resto do motor.
// naNuvem=true quando o usuário está logado e a nuvem (Supabase) está ativa; aí o
// salvamento que importa é a sincronização, não o localStorage.
// estado: 'saving' | 'saved' | 'error'.  tone casa com os tons do <Badge>.
export function rotuloSalvamento(naNuvem, estado = 'saved') {
  if (estado === 'saving') {
    const t = naNuvem ? 'Sincronizando…' : 'Salvando…';
    return { texto: t, textoCurto: t, tone: 'neutral', spinner: true, icone: null };
  }
  if (estado === 'error') {
    return {
      texto: naNuvem ? 'Falha ao sincronizar' : 'Não foi possível salvar',
      textoCurto: 'Erro ao salvar', tone: 'warn', spinner: false, icone: '⚠',
    };
  }
  // 'saved' (repouso) — estado calmo e tranquilizador, é o default.
  return {
    texto: naNuvem ? 'Salvo na nuvem' : 'Salvo neste navegador',
    textoCurto: 'Salvo', tone: 'success', spinner: false, icone: '✓',
  };
}
