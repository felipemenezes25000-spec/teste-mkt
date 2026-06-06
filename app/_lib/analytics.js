// Costura de event-tracking do funil. "Não configurado = no-op seguro":
// sem nenhuma env de analytics, não faz nada (em dev, loga no console pra inspeção).
//
// Suporta 3 sinks (ligar 0, 1 ou todos):
//   • window.dataLayer  — Google Tag Manager (NEXT_PUBLIC_GTM_ID)
//   • window.posthog    — PostHog (NEXT_PUBLIC_POSTHOG_KEY)
//   • NEXT_PUBLIC_ANALYTICS=qualquer-valor — feature flag legada (mantém dataLayer)
//
// Schema dos eventos do funil:
//   'reservar_click'           { categoria, parceiro, destino }
//   'assinar_click'            { plano }
//   'roteiro_gerado'           { destino, dias }
//   'destino_visto'            { code }
//   'perfil_definido'          { preset }
//   'cta_home_final_click'     { variante }      ← A/B test do CTA da home
//   'custo_real_perfil'        { perfil, destino, dias, pessoas }
//   'decisao_calculou'         { perfil, mes, dias, orcamentoBRL }
//   'comparar_vencedor_visto'  { code, vitorias, score }
//   'voos_buscar'              { origem, destino, dias }
//   'voos_alerta_criado'       { origem, destino }
//   'roi_calculou'             { erros_marcados, total, economia }

const ANALYTICS = process.env.NEXT_PUBLIC_ANALYTICS;
const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID;
const POSTHOG_KEY = process.env.NEXT_PUBLIC_POSTHOG_KEY;
const ATIVO = !!(ANALYTICS || GTM_ID || POSTHOG_KEY);
const DEV = process.env.NODE_ENV !== 'production';

export function track(evento, props = {}) {
  if (typeof window === 'undefined' || !evento) return; // só no client
  const payload = { evento, ...props };
  try {
    // GTM dataLayer — ativo se GTM_ID ou NEXT_PUBLIC_ANALYTICS estiver setado.
    if ((GTM_ID || ANALYTICS) && Array.isArray(window.dataLayer)) {
      window.dataLayer.push({ event: evento, ...props });
    }
    // PostHog — SDK injetado em PostHogInit.jsx; expõe window.posthog.
    if (POSTHOG_KEY && window.posthog && typeof window.posthog.capture === 'function') {
      window.posthog.capture(evento, props);
    }
    // Em dev sem analytics ligado, log estruturado no console pra debug.
    if (!ATIVO && DEV) {
      // eslint-disable-next-line no-console
      console.debug('[track]', evento, props);
    }
  } catch {
    /* tracking nunca pode quebrar a UX */
  }
  return payload;
}

// Identifica usuário em PostHog/GTM (chame após login).
export function identify(userId, traits = {}) {
  if (typeof window === 'undefined' || !userId) return;
  try {
    if (POSTHOG_KEY && window.posthog && typeof window.posthog.identify === 'function') {
      window.posthog.identify(userId, traits);
    }
    if ((GTM_ID || ANALYTICS) && Array.isArray(window.dataLayer)) {
      window.dataLayer.push({ event: 'identify', userId, ...traits });
    }
  } catch {}
}
