// LGPD (art. 18): exportar e apagar os dados do usuário. Tudo que o app guarda no
// aparelho tem prefixo conhecido; o que está na conta vem de /api/me/export (RLS).
export const PREFIXOS_LOCAIS = ['mundosemfim.', 'msf.'];

/** Coleta os dados locais do app (só chaves do Mundo Sem Fim). */
export function dadosLocais(storage = typeof localStorage !== 'undefined' ? localStorage : null) {
  const out = {};
  if (!storage) return out;
  for (let i = 0; i < storage.length; i++) {
    const k = storage.key(i);
    if (!k || !PREFIXOS_LOCAIS.some((p) => k.startsWith(p))) continue;
    const v = storage.getItem(k);
    try { out[k] = JSON.parse(v); } catch { out[k] = v; }
  }
  return out;
}

/** Remove os dados locais do app (mantém outras chaves do navegador intactas). */
export function apagarDadosLocais(storage = typeof localStorage !== 'undefined' ? localStorage : null) {
  if (!storage) return 0;
  const chaves = [];
  for (let i = 0; i < storage.length; i++) { const k = storage.key(i); if (k && PREFIXOS_LOCAIS.some((p) => k.startsWith(p))) chaves.push(k); }
  chaves.forEach((k) => storage.removeItem(k));
  return chaves.length;
}

export function pacoteExportacao({ local, conta }) {
  return {
    formato: 'mundo-sem-fim/export@1',
    geradoEm: new Date().toISOString(),
    aviso: 'Cópia dos seus dados no Mundo Sem Fim. Dados do aparelho (local) e da conta (quando logado).',
    local, conta: conta || null,
  };
}
