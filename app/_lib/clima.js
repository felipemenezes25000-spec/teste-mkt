// Previsão do tempo (OMEGA V4 §38): Open-Meteo (sem chave; CC BY 4.0).
// ATENÇÃO comercial: o plano gratuito é só para uso NÃO comercial — produção com
// receita exige a API comercial (docs/PROVIDER-MATRIX.md → CONTRACT_REQUIRED).
import { chamarProvider } from '../_domain/provider.js';

export const ATRIBUICAO_CLIMA = 'Previsão: Open-Meteo.com (CC BY 4.0)';
const WMO = {
  0: ['Céu limpo', 'sun'], 1: ['Poucas nuvens', 'sun'], 2: ['Parcialmente nublado', 'cloud'], 3: ['Nublado', 'cloud'],
  45: ['Neblina', 'cloud'], 48: ['Neblina', 'cloud'], 51: ['Garoa', 'rain'], 53: ['Garoa', 'rain'], 55: ['Garoa forte', 'rain'],
  61: ['Chuva fraca', 'rain'], 63: ['Chuva', 'rain'], 65: ['Chuva forte', 'rain'], 71: ['Neve fraca', 'snow'], 73: ['Neve', 'snow'], 75: ['Neve forte', 'snow'],
  80: ['Pancadas', 'rain'], 81: ['Pancadas', 'rain'], 82: ['Pancadas fortes', 'rain'], 95: ['Tempestade', 'wind'], 96: ['Tempestade com granizo', 'wind'], 99: ['Tempestade com granizo', 'wind'],
};
export const descreverTempo = (c) => WMO[c] || ['Condição desconhecida', 'cloud'];

/** Previsão diária (até 16 dias) para lat/lng. */
export async function previsao(lat, lng, dias = 7) {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat.toFixed(3)}&longitude=${lng.toFixed(3)}&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max&timezone=auto&forecast_days=${Math.min(16, dias)}`;
  const r = await chamarProvider(
    { nome: 'open-meteo', estado: 'LIVE_VERIFIED', timeoutMs: 9000, idempotente: true, freshness: 'LIVE', validadeMs: 3 * 3600 * 1000, attribution: ATRIBUICAO_CLIMA, sourceUrl: 'https://open-meteo.com' },
    async (signal) => {
      const res = await fetch(url, { signal });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return res.json();
    },
  );
  if (!r.data || !r.data.daily) return { status: 'UNAVAILABLE', dias: [], evidencia: r.evidence[0] };
  const d = r.data.daily;
  return {
    status: r.status, evidencia: r.evidence[0], timezone: r.data.timezone,
    dias: d.time.map((t, i) => ({ data: t, codigo: d.weather_code[i], max: d.temperature_2m_max[i], min: d.temperature_2m_min[i], chuva: d.precipitation_probability_max[i] })),
  };
}
