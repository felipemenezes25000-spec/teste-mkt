import Script from 'next/script';

// Injeta GTM e/ou PostHog no <head> APENAS se as envs estiverem configuradas.
// Componente Server-Safe (Server Component). Sem env → não renderiza nada.
//
// Estratégia de loading:
//   • GTM: 'afterInteractive' — carrega depois do hydrate inicial, mantém INP bom.
//   • PostHog: 'lazyOnload' — carrega em idle, menor impacto em LCP.
// Em ambos: dataLayer/posthog ficam globais e o track() em _lib/analytics.js
// consome direto. NUNCA inicializamos com PII no payload (LGPD-friendly).
export function AnalyticsScripts() {
  const gtm = process.env.NEXT_PUBLIC_GTM_ID;
  const phKey = process.env.NEXT_PUBLIC_POSTHOG_KEY;
  const phHost = process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://us.i.posthog.com';

  if (!gtm && !phKey) return null;

  return (
    <>
      {gtm && (
        <>
          <Script
            id="gtm-init"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `
                (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
                new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
                j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
                'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
                })(window,document,'script','dataLayer','${gtm}');
              `,
            }}
          />
        </>
      )}
      {phKey && (
        <Script
          id="posthog-init"
          strategy="lazyOnload"
          dangerouslySetInnerHTML={{
            __html: `
              !function(t,e){var o,n,p,r;e.__SV||(window.posthog=e,e._i=[],e.init=function(i,s,a){function g(t,e){var o=e.split(".");2==o.length&&(t=t[o[0]],e=o[1]),t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}}(p=t.createElement("script")).type="text/javascript",p.async=!0,p.src=s.api_host+"/static/array.js",(r=t.getElementsByTagName("script")[0]).parentNode.insertBefore(p,r);var u=e;for(void 0!==a?u=e[a]=[]:a="posthog",u.people=u.people||[],u.toString=function(t){var e="posthog";return"posthog"!==a&&(e+="."+a),t||(e+=" (stub)"),e},u.people.toString=function(){return u.toString(1)+".people (stub)"},o="capture identify alias people.set people.set_once set_config register register_once unregister opt_out_capturing has_opted_out_capturing opt_in_capturing reset isFeatureEnabled onFeatureFlags getFeatureFlag getFeatureFlagPayload reloadFeatureFlags group updateEarlyAccessFeatureEnrollment getEarlyAccessFeatures getActiveMatchingSurveys getSurveys getNextSurveyStep onSessionId".split(" "),n=0;n<o.length;n++)g(u,o[n]);e._i.push([i,s,a])},e.__SV=1)}(document,window.posthog||[]);
              posthog.init('${phKey}',{api_host:'${phHost}',person_profiles:'identified_only',capture_pageview:true});
            `,
          }}
        />
      )}
    </>
  );
}

// noscript do GTM — vai no <body> pra cobrir o caso de JS desligado.
export function AnalyticsNoscript() {
  const gtm = process.env.NEXT_PUBLIC_GTM_ID;
  if (!gtm) return null;
  return (
    <noscript>
      <iframe
        src={`https://www.googletagmanager.com/ns.html?id=${gtm}`}
        height="0" width="0"
        style={{ display: 'none', visibility: 'hidden' }}
        title="Google Tag Manager (noscript)"
      />
    </noscript>
  );
}
