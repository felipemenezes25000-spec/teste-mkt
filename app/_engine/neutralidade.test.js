import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { recomendarDestinos } from './decisao.js';
import { perfilDoPreset } from './perfil.js';
import { DESTINOS } from '../_lib/destinos.js';

// OMEGA V4 §39 / §75: "A comissão nunca define o ranking da viagem".
// Guarda estrutural: os módulos de ranking não podem importar nada de afiliados,
// links de parceiros ou planos pagos. E o resultado não pode variar com as
// variáveis de afiliado do ambiente.
const MODULOS_RANKING = ['decisao.js', 'score.js', 'perfil.js', 'indices.js', 'oportunidades.js'];

describe('neutralidade do ranking', () => {
  it('módulos de ranking não importam afiliados/links/planos', () => {
    for (const m of MODULOS_RANKING) {
      const src = fs.readFileSync(path.join(__dirname, m), 'utf8');
      const imports = [...src.matchAll(/from\s+['"]([^'"]+)['"]/g)].map((x) => x[1]);
      for (const i of imports) expect(i, `${m} importa ${i}`).not.toMatch(/afiliad|links|planos|usePlano|stripe/i);
    }
  });

  it('ranking idêntico com e sem tags de afiliado configuradas', () => {
    const perfil = perfilDoPreset('equilibrado');
    const sem = recomendarDestinos(DESTINOS, perfil).map((r) => r.id);
    const antes = { ...process.env };
    process.env.NEXT_PUBLIC_AFF_BOOKING = 'tag-x';
    process.env.NEXT_PUBLIC_AFF_VIATOR = 'tag-y';
    const com = recomendarDestinos(DESTINOS, perfil).map((r) => r.id);
    process.env = antes;
    expect(com).toEqual(sem);
  });
});
