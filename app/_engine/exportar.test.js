import { describe, it, expect } from 'vitest';
import { gerarICS, linkMapaRota } from './exportar.js';

const calc = {
  trechos: [
    { id: 'a', nome: 'Geórgia', dias: 30, cidadePrincipal: 'Tbilisi', chegada: new Date(2026, 6, 1), saida: new Date(2026, 6, 31), estacao: { texto: 'Boa época' }, visto: { texto: 'OK' } },
    { id: 'b', nome: 'Tailândia', dias: 20, cidadePrincipal: 'Bangkok', chegada: new Date(2026, 7, 1), saida: new Date(2026, 7, 21) },
  ],
};

describe('gerarICS', () => {
  it('gera um VCALENDAR com um VEVENT por trecho', () => {
    const ics = gerarICS(calc);
    expect(ics).toContain('BEGIN:VCALENDAR');
    expect(ics).toContain('END:VCALENDAR');
    expect((ics.match(/BEGIN:VEVENT/g) || []).length).toBe(2);
    expect(ics).toContain('DTSTART;VALUE=DATE:20260701');
    expect(ics).toContain('SUMMARY:Geórgia · 30 dia(s)');
    expect(ics).toContain('LOCATION:Tbilisi');
  });

  it('escapa vírgulas/; no resumo (RFC 5545)', () => {
    const ics = gerarICS({ trechos: [{ id: 'x', nome: 'A, B; C', dias: 1, chegada: new Date(2026, 0, 1), saida: new Date(2026, 0, 2) }] });
    expect(ics).toContain('SUMMARY:A\\, B\\; C · 1 dia(s)');
  });

  it('calc vazio → calendário válido sem eventos', () => {
    const ics = gerarICS({ trechos: [] });
    expect(ics).toContain('BEGIN:VCALENDAR');
    expect(ics).not.toContain('BEGIN:VEVENT');
  });
});

describe('linkMapaRota', () => {
  it('monta a URL do Google Maps com origem + cidades', () => {
    const url = linkMapaRota({ settings: { origemCidade: 'São Paulo' }, legs: [{ cidadePrincipal: 'Tbilisi' }, { cidadePrincipal: 'Bangkok' }] });
    expect(url).toBe('https://www.google.com/maps/dir/S%C3%A3o%20Paulo/Tbilisi/Bangkok');
  });

  it('null quando há menos de 2 pontos', () => {
    expect(linkMapaRota({ legs: [{ cidadePrincipal: 'Tbilisi' }] })).toBe(null);
    expect(linkMapaRota({ legs: [] })).toBe(null);
  });
});
