// Slug estável a partir de um nome (remove acentos, troca não-alfanumérico por
// hífen). Determinístico, sem depender de locale. Usado nas rotas /destino/[slug].
// \p{Diacritic} (flag u) evita ter caracteres combinantes literais no fonte.
export function slugify(s = '') {
  return String(s)
    .normalize('NFD').replace(/\p{Diacritic}/gu, '')
    .toLowerCase().trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
