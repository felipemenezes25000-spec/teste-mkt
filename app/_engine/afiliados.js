/* =============================================================================
   AFILIADOS — withAffiliate(url, parceiro)
   ---------------------------------------------------------------------------
   Injeta a tag de afiliado (lida de env) num deep-link de parceiro, last-click.
   "Não configurado = no-op seguro": sem env, parceiro desconhecido, ou parceiro
   de EXIBIÇÃO (Google/Rome2Rio/Airbnb — não pagam tráfego) → retorna a URL crua.

   GOTCHA Next.js: só `process.env.NEXT_PUBLIC_X` ESTÁTICO é inlinado no bundle do
   browser; acesso dinâmico vira undefined. Por isso lemos cada env estaticamente
   no mapa IDS e `withAffiliate` aceita um override `ids` (pra testar). Função PURA.
   ========================================================================== */

// IDs lidos ESTATICAMENTE (cada acesso é inlinado pelo Next no client).
export const IDS = {
  booking: process.env.NEXT_PUBLIC_AFF_BOOKING || '',
  viator: process.env.NEXT_PUBLIC_AFF_VIATOR || '',
  getyourguide: process.env.NEXT_PUBLIC_AFF_GYG || '',
  klook: process.env.NEXT_PUBLIC_AFF_KLOOK || '',
  civitatis: process.env.NEXT_PUBLIC_AFF_CIVITATIS || '',
  travelpayouts: process.env.NEXT_PUBLIC_AFF_TRAVELPAYOUTS || '',
  wise: process.env.NEXT_PUBLIC_AFF_WISE || '',
};

// parceiro → nome do parâmetro de afiliado na URL.
const PARAM = {
  booking: 'aid',
  viator: 'pid',
  getyourguide: 'partner_id',
  klook: 'aid',
  civitatis: 'aid',
  travelpayouts: 'marker',
  wise: 'ref',
};

// Parceiros que NÃO pagam tráfego — no-op deliberado (só exibição/comparação).
export const EXIBICAO = new Set(['google', 'rome2rio', 'airbnb']);

// Lista de parceiros monetizáveis (pra UI saber quando há CTA de reserva).
export const PARCEIROS_AFILIADO = Object.keys(PARAM);

export function withAffiliate(url, parceiro, ids = IDS) {
  if (!url || !parceiro) return url;
  if (EXIBICAO.has(parceiro)) return url; // não paga → não decora
  const param = PARAM[parceiro];
  const id = ids && ids[parceiro];
  if (!param || !id) return url; // parceiro desconhecido ou sem env → no-op seguro

  try {
    const u = new URL(url);
    u.searchParams.set(param, id);
    return u.toString();
  } catch {
    // URL relativa/sem protocolo → acrescenta o parâmetro na mão.
    const sep = url.includes('?') ? '&' : '?';
    return `${url}${sep}${encodeURIComponent(param)}=${encodeURIComponent(id)}`;
  }
}

// Há afiliado configurado pra este parceiro? (pra decidir mostrar o CTA de reserva)
export function temAfiliado(parceiro, ids = IDS) {
  return Boolean(PARAM[parceiro] && ids && ids[parceiro]);
}
