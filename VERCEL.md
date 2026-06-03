# Deploy na Vercel (recomendado p/ Next.js — sem hibernar)

A Vercel é a casa do Next.js: **zero-config**. Ela detecta o app, faz `next build`, serve a UI no CDN e transforma `/api/*` em **funções serverless** (cold start sub-segundo — nada do spin-down de 30s do Render). O `render.yaml` é ignorado aqui (pode deixar pra ter as duas opções).

> ⚠️ Plano **Hobby é grátis mas "uso não-comercial"**. Pra validar/MVP serve. Quando começar a **cobrar de verdade**, mude pra **Pro (~US$20/mês)**. (Se quiser free + comercial desde já, a alternativa é Netlify.)

## Caminho A — GitHub + painel (recomendado: deploy automático a cada push)
1. Suba o código (já deixei o git iniciado e commitado):
   ```bash
   cd "C:\Users\Felipe\Downloads\teste mkt\mundo-sem-fim-app"
   git remote add origin https://github.com/SEU_USUARIO/mundo-sem-fim-app.git
   git push -u origin main
   ```
2. Em **vercel.com → Add New… → Project** → importe o repositório. Framework: **Next.js** (detecta sozinho). Não mude build/output.
3. Em **Environment Variables**, adicione (veja a tabela abaixo) e clique **Deploy**.
4. Sai uma URL tipo `https://mundo-sem-fim.vercel.app`.

## Caminho B — Vercel CLI (sem GitHub)
```bash
cd "C:\Users\Felipe\Downloads\teste mkt\mundo-sem-fim-app"
npx vercel login      # abre o navegador
npx vercel            # primeiro deploy (preview)
npx vercel --prod     # deploy de produção
```
As variáveis você adiciona com `npx vercel env add NOME` (ou no painel).

## Variáveis de ambiente (Project → Settings → Environment Variables)
| Nome | Valor | Observação |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://vemfwnhjdzscqqthegvh.supabase.co` | pública |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `sb_publishable_ljXPvpfHjwqgOkBLKT0q8w_0MMp3ieE` | pública (RLS protege) |
| `NEXT_PUBLIC_AI_SERVER` | `1` | liga o modo "IA pelo servidor" |
| `OPENAI_API_KEY` | *sua chave NOVA (rotacionada)* | **segredo** — só no painel, nunca no git |
| `AI_MODEL` | `gpt-4o-mini` | opcional |
| `AI_BASE_URL` | *(vazio)* | opcional (ex.: Groq/OpenRouter) |
| `AI_DAILY_LIMIT` | `50` | opcional — cota diária de IA por usuário logado |
| `NEXT_PUBLIC_SITE_URL` | `https://SEU-APP.vercel.app` | p/ canonical e og:url corretos |

> `NEXT_PUBLIC_*` são embutidas no build → ao mudar, faça **Redeploy**. Marque as variáveis para os ambientes **Production** e **Preview**.

## Depois do deploy
1. Abra `https://SEU-APP.vercel.app/api/health` → deve responder `{"ok":true,"ia":true}` (`ia:true` = a chave foi lida).
2. **Supabase → Authentication → URL Configuration**: em **Site URL** e **Redirect URLs** adicione a URL da Vercel (ex.: `https://SEU-APP.vercel.app`) — senão o login por link mágico não volta certo em produção.
3. Teste: criar conta (Entrar → e-mail), montar rota, otimizar com IA (agora usa a chave do servidor, sem o usuário precisar de chave).

## Local (continua igual)
```bash
npm run dev      # desenvolvimento
npm run build && npm start   # simula produção
```
