// Costura de event-tracking do funil. "Não configurado = no-op seguro":
// sem NEXT_PUBLIC_ANALYTICS, não faz nada (em dev, loga no console pra inspeção).
// Futuro: plugar PostHog/GA/GTM aqui sem tocar os call-sites.
//
// Schema dos eventos do funil:
//   'reservar_click'  { categoria, parceiro, destino }
//   'assinar_click'   { plano }
//   'roteiro_gerado'  { destino, dias }
//   'destino_visto'   { code }
//   'perfil_definido' { preset }

const ATIVO = !!process.env.NEXT_PUBLIC_ANALYTICS;
const DEV = process.env.NODE_ENV !== 'production';

export function track(evento, props = {}) {
  if (typeof window === 'undefined' || !evento) return; // só no client
  const payload = { evento, ...props };
  try {
    if (ATIVO && Array.isArray(window.dataLayer)) {
      window.dataLayer.push({ event: evento, ...props }); // seam GA/GTM
    } else if (DEV) {
      // eslint-disable-next-line no-console
      console.debug('[track]', evento, props);
    }
    // futuro: posthog?.capture(evento, props)
  } catch {
    /* tracking nunca pode quebrar a UX */
  }
  return payload;
}
