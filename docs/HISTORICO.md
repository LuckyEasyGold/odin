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

## 2026-06-29 — Mobile-First: Transformação em App Mobile Responsivo + PWA

**Contexto:** Usuário solicitou uma versão responsiva com aparência de aplicativo mobile para o ODIN. O projeto tinha design desktop-first, sem suporte mobile adequado.

### Diagnóstico
1. **Layout desktop-first:** Navbar fixa no topo, sidebar do dashboard fixa em 260px — quebrava em telas < 768px
2. **Sem PWA:** Não havia manifest.json, viewport meta, ícones para instalação como app
3. **Formulários não responsivos:** Inputs e botões com tamanhos fixos, sem adaptação mobile
4. **Tabelas sem scroll:** Wallet, Keys e list view da página de modelos não tinham overflow-x
5. **Sem touch feedback:** Nenhum `-webkit-tap-highlight-color`, active states, ou animações de toque

### Ações tomadas

#### 1. Design System Mobile-First (`globals.css`)
- Adicionado `--bottom-nav-height`, `--safe-area-top/bottom`, `--radius-*` tokens
- `-webkit-tap-highlight-color: transparent` em todos os botões
- `overscroll-behavior: none` no body
- `input:focus` com box-shadow sutil
- Classes utilitárias: `.card-grid`, `.table-responsive`, `.page-container`, `.page-enter`, `.btn-primary`, `.btn-secondary`
- Media queries para ≥768px (`.show-desktop`/`.show-mobile`)
- Animações: `fadeIn`, `slideUp`, shimmer skeleton, toast

#### 2. Bottom Tab Bar no Mobile (`Navbar.tsx`)
- Mobile: bottom tabs fixas com ícones SVG (Início, Modelos, Docs, Entrar/Painel)
- Tab ativa com indicador superior e cor primária
- Desktop: mantida a navbar superior original com blur, scroll detection
- Dashboard tem sua própria bottom nav separada (escondida do Navbar global)

#### 3. Dashboard Mobile (`DashboardMobileNav.tsx` + `layout.tsx`)
- Desktop: sidebar fixa à esquerda com links, info do usuário, botão sair
- Mobile: bottom tab bar com 5 abas (Painel, Carteira, Chaves, Webhooks, Criar)
- Conteúdo principal com `overflow-x: hidden`, padding responsivo

#### 4. PWA Suporte
- `manifest.json` com todos os tamanhos de ícone (72-512px)
- Viewport meta com `viewport-fit=cover`, `maximum-scale=1.0`, `user-scalable=no`
- Meta tags: `apple-mobile-web-app-capable`, `theme-color`, `status-bar-style`
- Ícones em `/icons/`

#### 5. Páginas Adaptadas para Mobile
| Página | Adaptações |
|--------|-----------|
| **Landing** (`page.tsx`) | Fontes com `clamp()`, CTA com `btn-primary`/`btn-secondary`, grid responsivo, emoji 🔱 no hero |
| **Modelos** (`models/page.tsx`) | Filtros em grid responsivo `auto-fit`, inputs menores, padding responsivo |
| **Model Detail** (`models/[slug]/page.tsx`) | Header em coluna, badges adaptados, overflow-x nos action buttons |
| **Wizard** (`Wizard.tsx`) | Padding responsivo no documento, inputs de signatários com `flex-wrap`, botões com `btn-primary`/`btn-secondary` |
| **Login/Register** | Usa variáveis CSS do tema, cards com `var(--radius-xl)`, inputs unificados |
| **Dashboard > Wallet** | Cards com `clamp()` padding, extrato com `table-responsive` para scroll horizontal |
| **Dashboard > Keys** | Padding responsivo, dica de segurança adaptada |
| **Dashboard > Webhooks** | Padding responsivo, boxes adaptados |
| **Docs** | Fontes `clamp()`, grid de navegação responsivo |

#### 6. Acessibilidade e Touch
- `-webkit-tap-highlight-color: transparent` em elementos interativos
- `:active` states com `scale(0.96)` nos action buttons
- Scroll customizado com `::-webkit-scrollbar`
- Selection color com a cor primária

### Impacto
- ✅ Interface nativa mobile com bottom tabs fixas
- ✅ PWA instalável como app no celular
- ✅ Todas as páginas adaptadas para viewport < 768px
- ✅ Dashboard funcional em mobile com bottom nav própria
- ✅ Touch feedback e animações suaves
- ✅ Código legado preservado (sem breaking changes no layout desktop)

### Pendências
- [ ] Gerar ícones PNG reais (atualmente SVG placeholder)
- [ ] Testar em dispositivos iOS e Android reais
- [ ] Adicionar service worker para cache offline
- [ ] Testar PWA install prompt

---

## Template para novos registros

```markdown
## YYYY-MM-DD — Título do Marco

**Contexto:** ...
**Decisão:** ...
**Impacto:** ...
**Autor:** ...
```
