import { describe, it, expect } from 'vitest';
import { sanitizeRoteiro } from './services.js';

describe('sanitizeRoteiro', () => {
  it('normaliza um roteiro válido e preserva os campos', () => {
    const out = sanitizeRoteiro({
      resumo: 'Bangkok em 2 dias',
      custoEstimado: 'US$ 120–180',
      dias: [
        { dia: 1, titulo: 'Templos', itens: [{ hora: '09:00', atividade: 'Grande Palácio', local: 'Bangkok', custo: '~US$ 15', categoria: 'cultura', gratis: 'Wat Pho por fora', planoB: 'Museu Nacional' }] },
        { titulo: 'Mercados', itens: [{ atividade: 'Chatuchak' }] },
      ],
      checklist: ['Protetor solar', ''],
      documentos: ['Passaporte'],
      seguranca: ['Cuidado com tuk-tuk'],
      economia: ['Coma em mercados'],
    });
    expect(out.dias).toHaveLength(2);
    expect(out.dias[0].itens[0].atividade).toBe('Grande Palácio');
    expect(out.dias[1].dia).toBe(2); // preenche o dia faltante pela posição
    expect(out.checklist).toEqual(['Protetor solar']); // remove strings vazias
    expect(out.resumo).toBe('Bangkok em 2 dias');
  });

  it('tolera campos faltando / objeto vazio sem quebrar', () => {
    const out = sanitizeRoteiro({ dias: [{ itens: [{}] }] });
    expect(out.dias[0].itens[0]).toHaveProperty('atividade', '');
    expect(out.checklist).toEqual([]);
    expect(out.custoEstimado).toBe('');
  });

  it('lança erro quando não há dias', () => {
    expect(() => sanitizeRoteiro({ dias: [] })).toThrow();
    expect(() => sanitizeRoteiro({})).toThrow();
    expect(() => sanitizeRoteiro(null)).toThrow();
  });
});
