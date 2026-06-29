# Histórico de Desenvolvimento — ODIN

> Documento oficial de registro do desenvolvimento do projeto ODIN (Open Document Infrastructure Network).
> Todo marco técnico, decisão arquitetural e incidente relevante deve ser registrado aqui.

---

## 2026-05-24 — Checkpoint Inicial

**Estado:** Desenvolvimento pausado intencionalmente.
**Branch:** `feat/migration-community-fields`
**Deploy:** Vercel operacional com migrações aplicadas.
**PRs mergeados nesta sessão:** #5 ao #11 (correções de tipo, build, Next.js, migrations).

### Pendências registradas
- UI/UX em 5 fases (vide ROADMAP.md)
- Confirmação de `prisma migrate deploy` em produção
- Evolução de assinatura eletrônica Documenso

---

## 2026-06-29 — Retomada e Correção de PDF no Vercel

**Contexto:** Usuário reportou que a geração de PDF no Vercel parou de funcionar — o endpoint de download retornava HTML com extensão `.pdf`.

### Diagnóstico
1. **Mismatch de dependência:** `@sparticuz/chromium@^148.0.0` no `package.json` vs `@sparticuz/chromium-min@131.0.1` instalado no `node_modules` (pnpm resolveu do lockfile).
2. **Tamanho do bundle:** `@sparticuz/chromium` completo (~150-200MB) excedia o limite de 50MB compactado do Vercel Hobby — deploys falhando há 41 dias.
3. **Bibliotecas de sistema ausentes:** O Vercel não define `AWS_EXECUTION_ENV` ou `AWS_LAMBDA_JS_RUNTIME`, então o `@sparticuz/chromium` não extraía as libs de sistema (libnss3, libX11, etc.) necessárias para o Chromium rodar.
4. **IncludeFiles incompatível com pnpm:** O glob `**/node_modules/@sparticuz/chromium/bin/**` no `vercel.json` não funcionava com o virtual store do pnpm.

### Ações tomadas
1. **`packages/engine/package.json`:** `@sparticuz/chromium@^148.0.0` → `@sparticuz/chromium-min@^131.0.1`
2. **`packages/engine/src/index.ts`:**
   - Troca do `require()` para `@sparticuz/chromium-min`
   - `process.env.AWS_LAMBDA_JS_RUNTIME = "nodejs20.x"` **antes** do `require()` (para ativar extração de libs)
   - `LD_LIBRARY_PATH` configurado automaticamente pelo `setupLambdaEnvironment`
   - `setGraphicsMode = false` (desabilita GPU em serverless)
   - Suporte a `CHROMIUM_DOWNLOAD_URL` para download do Chromium em runtime
   - Logs detalhados com prefixo `[ODIN PDF]`
3. **`vercel.json`:** `maxDuration` 60 → 300s, `memory: 1024`, removido `includeFiles`
4. **Env var `CHROMIUM_DOWNLOAD_URL`** configurada no projeto `odin` (Vercel)

### Descoberta: Múltiplos projetos Vercel

Identificou-se que o ODIN possui **3 projetos no Vercel**:

| Projeto | URL | Status |
|---|---|---|
| `odin` | `odin-luckyeasygolds-projects.vercel.app` | ❌ Deploys falhando há 41 dias |
| `odin-web` | `odin-web-snowy.vercel.app` | ✅ Frontend Next.js operacional |
| `odin-api` | `odin-api-eight.vercel.app` | ✅ API Express operacional |

A arquitetura real é:
- **`odin-web`** → Next.js (`apps/web`), deploy bem-sucedido
- **`odin-api`** → Express API, deploy bem-sucedido
- As env vars cruciais (`CHROMIUM_DOWNLOAD_URL`, `DATABASE_URL`) estavam no projeto `odin` (falho), **não** no `odin-api` (ativo)

### Erro cometido
Foi implementada uma solução client-side de PDF via `window.print()` no Wizard.tsx, o que compromete a essência do ODIN (API profissional que entrega PDFs). Esta abordagem foi revertida.

### Lições aprendidas
1. Sempre verificar em qual projeto Vercel as env vars estão configuradas
2. ctx: 3 projetos Vercel distintos exigem coordenação de deploys e env vars
3. O chromium-min funciona no Vercel, mas requer:
   - `CHROMIUM_DOWNLOAD_URL` apontando para o pack do Chromium
   - `AWS_LAMBDA_JS_RUNTIME` setado **antes do require()**
   - `maxDuration` suficiente (300s para cold start)
4. pnpm monorepo + Vercel exige atenção ao hoisting de dependências

### Pendentes
- [ ] Configurar env var `CHROMIUM_DOWNLOAD_URL` no projeto `odin-api`
- [ ] Configurar env var `AWS_LAMBDA_JS_RUNTIME` no projeto `odin-api` (ou manter em código)
- [ ] Verificar se o `odin-api` está deployando da raiz ou de `apps/api`
- [ ] Validar PDF funcional no `odin-api` após correção
- [ ] Verificar deploy automático do GitHub → `odin-api`

---

## Template para novos registros

```markdown
## YYYY-MM-DD — Título do Marco

**Contexto:** ...
**Decisão:** ...
**Impacto:** ...
**Autor:** ...
```
