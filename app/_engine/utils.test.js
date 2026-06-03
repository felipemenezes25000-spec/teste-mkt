import { describe, it, expect } from 'vitest';
import { emailValido } from './utils.js';

describe('emailValido', () => {
  it('aceita e-mails comuns', () => {
    expect(emailValido('felipe@gmail.com')).toBe(true);
    expect(emailValido('a@b.co')).toBe(true);
    expect(emailValido('x.y+z@sub.dominio.com.br')).toBe(true);
  });
  it('ignora espaços nas pontas', () => {
    expect(emailValido('  felipe@gmail.com  ')).toBe(true);
  });
  it('rejeita strings sem formato de e-mail', () => {
    expect(emailValido('')).toBe(false);
    expect(emailValido('abc')).toBe(false);
    expect(emailValido('a@b')).toBe(false);     // sem TLD
    expect(emailValido('a@b.c')).toBe(false);    // TLD curto demais
    expect(emailValido('a @b.com')).toBe(false); // espaço no meio
    expect(emailValido('a@@b.com')).toBe(false); // arroba dupla
  });
  it('é seguro com entradas não-string', () => {
    expect(emailValido(null)).toBe(false);
    expect(emailValido(undefined)).toBe(false);
    expect(emailValido(123)).toBe(false);
  });
});
