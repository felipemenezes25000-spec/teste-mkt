import { describe, it, expect } from 'vitest';
import { distanciaKm, trechoEstimado, otimizarDia, simular, hm, mh, modoSugerido } from './rotas.js';

// Quioto (coordenadas reais aproximadas)
const P = {
  hotel: { id: 'hotel', nome: 'Hotel (Estação de Quioto)', lat: 34.9858, lng: 135.7588 },
  fushimi: { id: 'fushimi', nome: 'Fushimi Inari', lat: 34.9671, lng: 135.7727, duracaoMin: 120, abre: '00:00', fecha: '23:59' },
  kiyomizu: { id: 'kiyomizu', nome: 'Kiyomizu-dera', lat: 34.9949, lng: 135.785, duracaoMin: 90, abre: '06:00', fecha: '18:00' },
  kinkakuji: { id: 'kinkakuji', nome: 'Kinkaku-ji', lat: 35.0394, lng: 135.7292, duracaoMin: 60, abre: '09:00', fecha: '17:00' },
  arashiyama: { id: 'arashiyama', nome: 'Arashiyama', lat: 35.0094, lng: 135.6668, duracaoMin: 120, abre: '00:00', fecha: '23:59' },
};

describe('trechos e distância', () => {
  it('haversine plausível e modo sugerido', () => {
    const km = distanciaKm(P.hotel, P.fushimi);
    expect(km).toBeGreaterThan(2); expect(km).toBeLessThan(3);
    expect(modoSugerido(1)).toBe('WALK');
    expect(modoSugerido(8)).toBe('TRANSIT');
  });
  it('trecho estimado é sempre ESTIMATE e avisa transporte não consultado', () => {
    const t = trechoEstimado(P.hotel, P.kinkakuji);
    expect(t.freshness).toBe('ESTIMATE');
    expect(t.warnings.join(' ')).toMatch(/estimado/);
    expect(t.durationSeconds).toBeGreaterThan(0);
  });
  it('sem coordenada → UNAVAILABLE, sem inventar distância', () => {
    const t = trechoEstimado(P.hotel, { id: 'x', nome: 'Sem coord' });
    expect(t.freshness).toBe('UNAVAILABLE');
    expect(t.distanceMeters).toBeNull();
  });
  it('hm/mh', () => { expect(hm('09:30')).toBe(570); expect(mh(570)).toBe('09:30'); expect(hm('x')).toBeNull(); });
});

describe('otimizador do dia', () => {
  it('reordena para reduzir deslocamento e nunca piora', () => {
    const ruim = [P.arashiyama, P.fushimi, P.kinkakuji, P.kiyomizu];
    const r = otimizarDia(ruim, { origem: P.hotel, inicio: '08:00', fim: '21:00' });
    expect(['VALID', 'VALID_WITH_WARNINGS']).toContain(r.status);
    expect(r.depois.deslocMin).toBeLessThanOrEqual(r.antes.deslocMin);
    expect(r.ordem).toHaveLength(4);
  });
  it('respeita horário fixo de reserva', () => {
    const fixo = { ...P.kinkakuji, fixoInicio: '15:00' };
    const r = otimizarDia([fixo, P.fushimi, P.kiyomizu], { origem: P.hotel, inicio: '08:00', fim: '21:00' });
    const passo = r.depois.passos.find((p) => p.id === 'kinkakuji');
    expect(passo.inicio).toBe('15:00');
    expect(r.status).not.toBe('UNFEASIBLE');
  });
  it('detecta dia impossível (não aprova em silêncio)', () => {
    const lotado = [P.fushimi, P.kiyomizu, P.kinkakuji, P.arashiyama].map((p) => ({ ...p, duracaoMin: 240 }));
    const r = otimizarDia(lotado, { origem: P.hotel, inicio: '09:00', fim: '18:00' });
    expect(r.status).toBe('UNFEASIBLE');
    expect(r.avisos.length).toBeGreaterThan(0);
  });
  it('janela de fechamento violada vira aviso', () => {
    const s = simular([{ ...P.kinkakuji, duracaoMin: 60 }], { inicio: '16:30' });
    expect(s.violacoes).toBe(1);
    expect(s.avisos[0]).toMatch(/fecha 17:00/);
  });
  it('sem coordenadas → VALID_WITH_WARNINGS/UNKNOWN_DATA com aviso', () => {
    const r = otimizarDia([{ id: 'a', nome: 'A', duracaoMin: 60 }, { id: 'b', nome: 'B', duracaoMin: 60 }], {});
    expect(['VALID_WITH_WARNINGS', 'UNKNOWN_DATA']).toContain(r.status);
    expect(r.avisos.join(' ')).toMatch(/sem coordenada/);
  });
});
