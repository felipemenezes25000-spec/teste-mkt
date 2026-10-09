// Câmbio de referência (open.er-api, base USD) — módulo sem dependências para poder
// entrar no bundle de qualquer página sem arrastar Supabase ou o catálogo.
let _cambioEmVoo = null;
export function buscarCambio() {
  if (_cambioEmVoo) return _cambioEmVoo;
  _cambioEmVoo = buscarCambioDireto().finally(() => { _cambioEmVoo = null; });
  return _cambioEmVoo;
}

async function buscarCambioDireto() {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), 15000);
  try {
    // base USD sempre; ratios independem da moeda base de exibição.
    const res = await fetch('https://open.er-api.com/v6/latest/USD', { signal: ctrl.signal });
    if (!res.ok) throw new Error('HTTP ' + res.status);
    const data = await res.json();
    if (data.result !== 'success' || !data.rates) throw new Error('Resposta de câmbio inválida.');
    return { base: 'USD', rates: data.rates, atualizadoEm: (data.time_last_update_unix || 0) * 1000 };
  } catch (err) {
    if (err.name === 'AbortError') throw new Error('Câmbio demorou demais (timeout).');
    if (err instanceof TypeError) throw new Error('Sem internet para atualizar o câmbio — usando taxas salvas.');
    throw err;
  } finally { clearTimeout(t); }
}

