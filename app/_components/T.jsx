'use client';
import { useIdioma } from '../_lib/i18n.js';

// Tradução in-line para uso em Server Components que precisam de string
// reativa ao idioma do usuário. Renderiza `fallback` no SSR/SSG e troca
// para a tradução após hydrate (client lê localStorage/navigator).
//
// Uso: <T k="destino.pontosTuristicos" fallback="Pontos turísticos" />
//
// Por que existe: páginas SSG (/destino/[slug]) são pré-renderizadas no
// build, então tServerFactory + cookies() não funciona — o cookie é lido
// apenas em runtime. Para evitar forçar `dynamic = 'force-dynamic'` (que
// destruiria SSG/ISR e SEO), usamos este wrapper client cirúrgico.
export function T({ k, fallback }) {
  const { t } = useIdioma();
  const v = t(k);
  return v && v !== k ? v : (fallback || k);
}
