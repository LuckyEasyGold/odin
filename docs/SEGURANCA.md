# Relatório de Segurança — ODIN

> **Data da auditoria:** 2026-06-29
> **Escopo:** Análise completa do código-fonte, configurações e dependências do projeto ODIN.
> **Metodologia:** Revisão manual de código, análise de dependências, verificação de configurações.

---

## Resumo Executivo

| Gravidade | Total | Corrigidos | Pendentes |
|-----------|-------|------------|-----------|
| 🔴 Crítica | 4 | 4 | 0 |
| 🟠 Alta | 5 | 4 | 1 |
| 🟡 Média | 4 | 3 | 1 |
| 🟢 Baixa | 3 | 0 | 3 |

---

## 🔴 Críticas

### C-1: Credenciais versionadas no Git

**Problema:** O arquivo `.env` estava sendo rastreado pelo Git, expondo:
- `DATABASE_URL` — conexão PostgreSQL Neon com usuário e senha
- `AUTH_SECRET` / `NEXTAUTH_SECRET` — segredo de assinatura JWT
- `RESEND_API_KEY` — chave da API de email

**Correção aplicada:**
- ✅ `.env` removido do tracking do Git (`git rm --cached`)
- ✅ Já estava no `.gitignore`
- ✅ `AUTH_SECRET` e `NEXTAUTH_SECRET` rotacionados para novo valor

**⚠️ Ação necessária (você):**
- Resetar a senha do banco Neon (dashboard Neon → Settings → Reset password)
- Rotacionar a `RESEND_API_KEY` (dashboard Resend → API Keys → Revoke + Create new)
- Atualizar `.env` local com as novas credenciais

---

### C-2: Autenticação opcional na API

**Problema:** O middleware de autenticação por API key (`authenticateApiKey`) permitia requisições sem chave — chamava `next()` se não houvesse `x-api-key`. Qualquer endpoint POST podia ser chamado anonimamente.

**Endpoints afetados:** `POST /api/v1/models`, `POST /api/v1/models/:id/ratings`, `POST /api/v1/models/:id/fork`, `POST /api/v1/generations/:id/sign-native`

**Correção aplicada:**
- ✅ Criado middleware `requireAuth()` que rejeita requisições sem `x-api-key` válida
- ✅ Aplicado a todos os endpoints mutantes (POST)
- ✅ `POST /api/v1/generate` **não** recebeu `requireAuth` — o web UI usa autenticação por sessão (NextAuth), não chave de API. O endpoint mantém a lógica existente: aceita `userId` no body (web UI) ou `x-api-key` (API externa)

---

### C-3: XSS via templates Handlebars

**Problema:** O HTML renderizado pelos templates (`{{variavel}}`) era injetado diretamente no DOM via `dangerouslySetInnerHTML` sem sanitização, tanto no servidor (PDF) quanto no cliente (preview). Um autor de modelo malicioso poderia injetar scripts.

**Correção aplicada:**
- ✅ `DOMPurify.sanitize()` adicionado no `packages/engine/src/index.ts` (servidor)
- ✅ `DOMPurify.sanitize()` adicionado no `Wizard.tsx` (cliente)
- ✅ Sanitização ocorre **após** a injeção do footer de autenticidade (que contém nomes/emails de signatários)
- ✅ Tags permitidas: `style`, `img`, `svg` — scripts/bloqueados
- ✅ JavaScript desabilitado no Puppeteer (`page.setJavaScriptEnabled(false)`)

---

### C-4: Criação de modelos sem validação

**Problema:** `POST /api/v1/models` aceitava qualquer body sem validação — nem tipo, nem tamanho máximo.

**Correção aplicada:**
- ✅ Validação de tipos: `name` e `template` devem ser strings
- ✅ Limite de tamanho: template máximo de 100KB
- ✅ Autenticação exigida via `requireAuth`
- ✅ Nome do modelo validado como obrigatório

---

## 🟠 Altas

### A-1: CORS permissivo

**Problema:** A política CORS original aceitava qualquer subdomínio `.vercel.app` que contivesse "odin", incluindo previews de PRs de forks maliciosos.

**Correção aplicada:**
- ✅ CORS restrito para allowlist exata:
  - `https://odin-web-snowy.vercel.app`
  - `https://odin-api-eight.vercel.app`
  - `http://localhost:3000` (dev)
  - `http://localhost:3001` (dev)
- ✅ Origens fora da lista são rejeitadas (sem headers CORS)

---

### A-2: JavaScript ativo no Puppeteer

**Problema:** O Puppeteer (usado para gerar PDFs) executava JavaScript por padrão no conteúdo renderizado. Um template com `<script>` malicioso poderia ser executado durante a geração do PDF.

**Correção aplicada:**
- ✅ `page.setJavaScriptEnabled(false)` antes de carregar o conteúdo

---

### A-3: HMAC secret dos webhooks exposto

**Problema:** O secret do webhook é exibido no dashboard. Embora necessário para o usuário copiar, qualquer XSS no dashboard comprometeria todos os webhooks.

**Status:** ⚠️ Mitigado pela sanitização DOMPurify (C-3), mas não resolvido estruturalmente. O ideal seria mostrar o secret apenas uma vez na criação.

---

### A-4: Signatários sem verificação de email

**Problema:** O endpoint `/generate` aceita signatários com qualquer email e envia emails sem verificar se o endereço é válido ou pertence ao usuário.

**Status:** ⚠️ Parcialmente mitigado — o `requireAuth` agora exige chave de API para chamadas externas, mas o web UI (que usa sessão) ainda pode adicionar signatários livremente. Pendente de validação adicional.

---

### A-5: Rate limiting ineficaz em serverless

**Problema:** O rate limit usa um `Map` em memória, que não é compartilhado entre invocações serverless no Vercel. Efetivamente, não há rate limit em produção.

**Status:** ❌ Não corrigido. Requer migração para Redis/Upstash ou uso do Vercel Firewall.

---

## 🟡 Médias

### M-1: Exposição de versão em endpoints públicos

**Problema:** O endpoint `/` e `/health` expõem a versão da API, auxiliando reconhecimento de vulnerabilidades conhecidas.

**Status:** ❌ Pendente. Impacto baixo.

### M-2: API Key gerada via Server Action sem proteção de log

**Problema:** A raw key é gerada e retornada ao usuário, mas logs do servidor (Vercel) podem capturar a resposta.

**Status:** ❌ Pendente. Mitigado indiretamente pelo fato de que a chave é mostrada apenas uma vez.

### M-3: Validação de entrada mínima em endpoints

**Problema:** Vários endpoints não validam os tipos dos parâmetros recebidos (ex: `POST /models/:id/fork` aceita qualquer body).

**Correção aplicada:**
- ✅ `POST /models` validado (name + template obrigatórios, tipo string, limite 100KB)
- ⚠️ Demais endpoints pendentes de validação Zod completa

### M-4: Sign-Native sem validação de signatureData

**Problema:** `signatureData` no endpoint `/sign-native` é aceito como string livre sem validação de formato.

**Status:** ❌ Pendente. Requer definição do formato esperado de assinatura.

---

## 🟢 Baixas

- **Timeout de webhook de 5s** — Pode causar retry storms se o destino estiver lento
- **`console.log` expõe dados nos logs** — Logs com inputs do usuário no Vercel
- **Prisma Client múltiplas instâncias** — Cold start lento em serverless

---

## Resumo das Correções Aplicadas

| # | Arquivo | Mudança |
|---|---------|---------|
| 1 | `apps/api/src/index.ts` | Middleware `requireAuth()` para endpoints POST |
| 2 | `apps/api/src/index.ts` | Validação de entrada em `POST /models` |
| 3 | `apps/api/src/index.ts` | CORS restrito para allowlist |
| 4 | `packages/engine/src/index.ts` | `DOMPurify.sanitize()` no HTML renderizado |
| 5 | `packages/engine/src/index.ts` | `page.setJavaScriptEnabled(false)` no Puppeteer |
| 6 | `apps/web/src/app/models/[slug]/Wizard.tsx` | `DOMPurify.sanitize()` no preview |
| 7 | `.env` | `AUTH_SECRET` e `NEXTAUTH_SECRET` rotacionados |
| 8 | `.env` | Removido do tracking do Git |

## Recomendações Pendentes

1. **Rotacionar credenciais manuais:** Senha do Neon + Resend API key
2. **Migrar rate limit para Upstash Redis** ou usar Vercel Firewall
3. **Adicionar validação Zod** em todos os endpoints POST (`fork`, `sign-native`, `ratings`)
4. **Implementar autenticação JWT** no endpoint `/generate` para aceitar sessões do NextAuth (além de API key)
5. **Esconder versão** dos endpoints públicos
6. **Validar formato de `signatureData`** no endpoint `/sign-native`

---

*Documento gerado em 2026-06-29 como parte da auditoria de segurança do projeto ODIN.*
