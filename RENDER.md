# Deploy no Render (backend + frontend juntos)

O app Next.js roda no Render como **Web Service**: serve a interface **e** as rotas de API (`/api/ai`, `/api/health`). A chave da OpenAI fica como **variável de ambiente no Render** — escondida do navegador. Assim a IA funciona **sem o usuário precisar de chave própria**.

## Pré-requisito: código num repositório Git
O Render faz deploy a partir de um repo (GitHub/GitLab). Se ainda não tem:
```bash
cd "C:\Users\Felipe\Downloads\teste mkt\mundo-sem-fim-app"
git init && git add . && git commit -m "app inicial"
# crie um repo no GitHub e:
git remote add origin https://github.com/SEU_USUARIO/mundo-sem-fim-app.git
git push -u origin main
```
> O `.gitignore` já ignora `node_modules`, `.next` e **`.env*`** — segredos não vão pro git.

## Deploy (1-clique via Blueprint)
1. No Render: **New + → Blueprint** → conecte o repositório (ele lê o `render.yaml`).
2. Render cria o Web Service `mundo-sem-fim` com:
   - build `npm install && npm run build`, start `npx next start -p $PORT`
   - health check em `/api/health`
3. Em **Environment**, preencha os segredos marcados (`sync:false`):
   - `OPENAI_API_KEY` = sua chave **nova** (rotacionada) da OpenAI (ou Groq, etc.)
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = a chave *publishable* do Supabase
   - (opcional) `AI_BASE_URL` se usar Groq/OpenRouter; `AI_MODEL` já vem `gpt-4o-mini`
   - `NEXT_PUBLIC_SITE_URL` = a URL pública (ex.: `https://mundo-sem-fim.onrender.com`) — p/ canonical/OG
   - `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_AI_SERVER=1` e `AI_DAILY_LIMIT=50` já vêm no Blueprint.
4. **Create** → aguarde o build. A URL fica tipo `https://mundo-sem-fim.onrender.com`.

## Importante
- **Variáveis `NEXT_PUBLIC_*` são embutidas no build** — ao alterá-las, faça um novo deploy.
- Plano **free hiberna** após inatividade (1ª request demora ~30s pra acordar). Suba pra *Starter* pra produção.
- No Supabase → Authentication → URL Configuration, adicione a URL do Render em **Site URL / Redirect URLs** pro login (magic link) funcionar em produção.
- Teste rápido depois do deploy: abra `https://SEU-APP.onrender.com/api/health` → deve responder `{"ok":true,"ia":true}` (ia:true confirma que a chave da OpenAI foi lida).

## Verificação local (sem deploy)
```bash
npm run build && npm start
# /api/health → {"ok":true,"ia":false}  (false porque não há OPENAI_API_KEY local)
# Com a chave: crie .env.local com OPENAI_API_KEY=... e a IA passa a responder pelo /api/ai
```
