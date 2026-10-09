// Fuso horário real do destino (Open-Meteo, timezone=auto) para horários locais
// corretos. Sem rede: 'UTC' (a UI mostra o fuso usado).
export async function fusoDe(coords) {
  if (!Array.isArray(coords)) return 'UTC';
  try {
    const r = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${coords[1]}&longitude=${coords[0]}&timezone=auto&forecast_days=1&daily=weather_code`, { signal: AbortSignal.timeout(6000) });
    const d = await r.json();
    return d.timezone || 'UTC';
  } catch { return 'UTC'; }
}
