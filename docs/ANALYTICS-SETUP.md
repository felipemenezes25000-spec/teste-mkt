# Analytics — setup & schema

Costura de tracking do Mundo Sem Fim. Sem env configurada → **no-op seguro**
(em dev, `track()` loga no console). Suporta 3 sinks paralelos: GTM (dataLayer),
PostHog e a flag legada `NEXT_PUBLIC_ANALYTICS=1`.

## TL;DR

Para ligar em produção, defina **uma** das envs no Vercel:

```
NEXT_PUBLIC_GTM_ID=GTM-XXXXXXX        # Google Tag Manager
# ou
NEXT_PUBLIC_POSTHOG_KEY=phc_xxxxxxxx  # PostHog
NEXT_PUBLIC_POSTHOG_HOST=https://us.i.posthog.com  # opcional, default já é us
```

Pode definir as duas — eventos são enviados para ambos os sinks.

## Onde fica o quê

| Arquivo | Função |
|---|---|
| `app/_lib/analytics.js` | `track(evento, props)` e `identify(userId, traits)` |
| `app/_components/AnalyticsScripts.jsx` | Injeção condicional de GTM/PostHog no `<head>` + noscript |
| `app/layout.jsx` | Plug do `<AnalyticsScripts />` no root layout |

## Schema de eventos do funil

Cada evento é uma string + objeto JSON pequeno. Sem PII (e-mail, nome, telefone).

| Evento | Onde | Props |
|---|---|---|
| `cta_home_final_click` | Home → CTA final | `{ variante: 'A' \| 'B' }` |
| `perfil_definido` | /decisao | `{ preset }` |
| `custo_real_perfil` | /custo-real | `{ perfil, destino, dias, pessoas }` |
| `roi_calculou` | /planos → ROI | `{ erros_marcados, total }` |
| `assinar_click` | /planos → CTA | `{ plano }` |
| `voos_buscar` | /voos | `{ origem, destino, dias }` |
| `voos_alerta_criado` | /voos | `{ origem, destino }` |
| `roteiro_solicitado` | /roteiro | `{ destino, dias, ritmo, conforto }` |
| `roteiro_gerado` | /roteiro | `{ destino, dias }` |
| `reservar_click` | Componente afiliado | `{ categoria, parceiro, destino }` |
| `favorito_add` | DestinoCard | `{ code }` |
| `home_scroll_50` | Home | `{ }` |
| `home_scroll_90` | Home | `{ }` |
| `login_solicitado` | LoginModal | `{ metodo: 'magic_link' }` |
| `login_ok` | App.jsx (após auth) | `{ provedor }` |

E `identify(userId, { criado_em, provedor })` é chamado uma vez por sessão
quando o usuário autentica via Supabase.

## Setup no GTM (Google Tag Manager)

1. Crie um container no [tagmanager.google.com](https://tagmanager.google.com).
2. Copie o ID `GTM-XXXXXXX` e cole em `NEXT_PUBLIC_GTM_ID` no Vercel.
3. No GTM, crie uma **Variável de Camada de Dados** chamada `evento`.
4. Crie um **Acionador** do tipo "Evento personalizado" com nome de evento `.*`
   (regex), para capturar todos os tracks.
5. Crie uma tag GA4 / Mixpanel / outra com esse acionador.

### Tag exemplo para GA4

- Tipo: **Google Analytics: evento GA4**
- ID de medição: `G-XXXXXXX` (do seu GA4)
- Nome do evento: `{{Event}}` (variável built-in)
- Parâmetros adicionais: usar variáveis da camada de dados (`variante`, `plano`,
  `destino`, etc.)

## Setup no PostHog

1. Crie projeto em [posthog.com](https://posthog.com) (US ou EU host).
2. Copie a **Project API Key** (formato `phc_xxxxxxxx`) e cole em
   `NEXT_PUBLIC_POSTHOG_KEY`.
3. Cole o host (`https://us.i.posthog.com` ou `https://eu.i.posthog.com`) em
   `NEXT_PUBLIC_POSTHOG_HOST`.
4. O SDK é injetado em `lazyOnload` — capture de pageviews automático.

### Funnels recomendados (PostHog)

- **Activation**: `cta_home_final_click` → `perfil_definido` → `favorito_add`
- **Decisão → planejar**: `perfil_definido` → `custo_real_perfil` → `roteiro_solicitado` → `roteiro_gerado`
- **Conversão**: `roi_calculou` → `assinar_click`
- **A/B do CTA**: filtrar `cta_home_final_click` por `variante`

## Eventos de scroll (home)

`home_scroll_50` e `home_scroll_90` disparam quando o usuário rola 50% e 90% da
home, respectivamente. Sinal de engagement com o conteúdo editorial novo (FAQ,
custo real, OTAs comparison).

## LGPD/Privacidade

- Nenhum tracking envia e-mail, nome ou telefone.
- `identify()` envia só `userId` (Supabase UUID) + `criado_em` + `provedor`.
- Sem opt-out explícito por enquanto. Em prod, considerar banner de consentimento
  para usuários europeus (GDPR) ou desligar tracking até consentimento.

## Debug local

Em `NODE_ENV=development` sem env de analytics setada, cada `track()` faz:

```
console.debug('[track]', evento, props)
```

Em produção sem env, é silencioso.
