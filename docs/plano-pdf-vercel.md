# Plano de Correção: Geração de PDF no Vercel (odin-api)

> **Problema:** O endpoint `/api/v1/generations/:id/download` retorna HTML com extensão `.pdf`
> porque o Chromium não consegue ser executado no ambiente serverless do Vercel.
>
> **Objetivo:** A API do ODIN deve gerar e entregar PDFs profissionais — este é um requisito
> fundamental do projeto, não um detalhe de implementação.

---

## 1. Arquitetura Atual

```
Usuário
  │
  ▼
odin-web (Next.js — odin-web-snowy.vercel.app)
  │
  │  Rewrite: /api/v1/* → NEXT_PUBLIC_API_URL/api/v1/*
  │
  ▼
odin-api (Express — odin-api-eight.vercel.app)
  │
  │  renderDocument(model.template, inputs, { format: "pdf" })
  │
  ▼
@odin/engine → @sparticuz/chromium-min + puppeteer-core → PDF
```

### Projetos Vercel

| Projeto | Root | Framework | Status |
|---|---|---|---|
| `odin-web` | `apps/web` | Next.js 15.5 | ✅ Deploy OK |
| `odin-api` | `apps/api` (ou raiz?) | Express + Node 24.x | ✅ Deploy OK |
| `odin` (legado) | Raiz do repo | Node.js | ❌ Deploys falhando |

### Fluxo da requisição de PDF

1. Wizard.tsx faz POST `/api/v1/generate` com `format: "html"` → recebe HTML + generationId
2. Usuário clica "Baixar PDF"
3. Wizard.tsx abre GET `/api/v1/generations/:id/download` em nova aba
4. `odin-web` faz rewrite para `odin-api/api/v1/generations/:id/download`
5. `odin-api` chama `renderDocument(template, inputs, { format: "pdf" })`
6. Engine tenta lançar Chromium via puppeteer-core
7. **SE Chromium falha** → retorna `{ content: html, degraded: true }` → API envia HTML com Content-Type: text/html
8. **SE Chromium funciona** → retorna Buffer PDF → API envia PDF com Content-Type: application/pdf

---

## 2. Diagnóstico da Falha

### 2.1 Causa Raiz

O Chromium não consegue ser executado no runtime do `odin-api` no Vercel por **dois motivos**:

#### Motivo A: Dependência incorreta

O `packages/engine/package.json` lista `@sparticuz/chromium@^148.0.0` mas o pnpm resolveu
`@sparticuz/chromium-min@131.0.1` no lockfile. O código tentava `require("@sparticuz/chromium")`
enquanto apenas `@sparticuz/chromium-min` estava instalado.

✅ **Já corrigido:** `package.json` → `@sparticuz/chromium-min@^131.0.1`, `require()` → `@sparticuz/chromium-min`.

#### Motivo B: Bibliotecas de sistema ausentes

O Vercel não define `AWS_EXECUTION_ENV` ou `AWS_LAMBDA_JS_RUNTIME`. O `@sparticuz/chromium-min`
usa estas variáveis para decidir se extrai as bibliotecas de sistema (`al2023.tar.br` com libnss3,
libX11, etc.) e configurar `LD_LIBRARY_PATH`.

✅ **Já corrigido em código:** `process.env.AWS_LAMBDA_JS_RUNTIME = "nodejs20.x"` é setado
**antes** do `require("@sparticuz/chromium-min")`, ativando a extração automática de libs.

#### Motivo C: Chromium binary não disponível

O `@sparticuz/chromium-min` **não inclui o binário do Chromium**. Depende de um download externo
via `CHROMIUM_DOWNLOAD_URL` ou dos arquivos `.br` presentes no pacote `@sparticuz/chromium` (full).

❌ **Pendente:** A env var `CHROMIUM_DOWNLOAD_URL` está setada no projeto `odin` (legado, falho),
mas **não** no projeto `odin-api` (ativo).

### 2.2 Por que o deploy do `odin` falha

O projeto `odin` (raiz do repositório) falha porque:
- Inclui tanto o Next.js quanto a API no mesmo deploy
- O vercel.json roteia para `api/index.ts` que importa todo o workspace
- O bundle total excede os limites do Vercel Hobby

Já o `odin-api` deploya **apenas** a API (ou tem uma configuração mais enxuta), por isso
consegue fazer deploy bem-sucedido.

---

## 3. Estratégia de Correção

### 3.1 Curto Prazo (deve ser feito imediatamente)

| # | Ação | Responsável | Prioridade |
|---|---|---|---|
| 1 | Configurar `CHROMIUM_DOWNLOAD_URL` no **projeto `odin-api`** do Vercel | Dev | 🔴 Alta |
| 2 | Verificar se `AWS_LAMBDA_JS_RUNTIME=nodejs20.x` já está em código (✅ sim) | Dev | 🔴 Alta |
| 3 | Forçar deploy do `odin-api` (push no GitHub ou deploy manual) | Dev | 🔴 Alta |
| 4 | Testar download de PDF pelo `odin-api` | Dev/User | 🔴 Alta |
| 5 | Se falhar, verificar logs no dashboard do Vercel (Função → Logs) | Dev | 🟡 Média |

### 3.2 Médio Prazo (se o curto prazo não resolver)

Se o `CHROMIUM_DOWNLOAD_URL` + `AWS_LAMBDA_JS_RUNTIME` não resolverem, as causas prováveis são:

1. **Download do Chromium excede 60MB** — O `downloadAndExtract` do chromium-min tem
   `maxBodyLength: 60MB` (hardcoded). Se o pack for maior, o download falha silenciosamente.
   - **Solução:** Usar `@sparticuz/chromium` (full) em vez de `-min`, que já vem com os `.br`
     embutidos. Requer Vercel **Pro** (Large Functions até 5GB).

2. **Tempo de cold start > 300s** — Download + extração de ~150MB pode levar mais de 5 minutos.
   - **Solução:** Aumentar `maxDuration` no `odin-api` (se o plano permitir).
   - **Solução alternativa:** Self-host o Chromium pack no Vercel Blob ou S3 (mais rápido que GitHub).

3. **Node.js 24.x não suportado pelo chromium-min** — O `odin-api` roda Node 24.
   - **Solução:** Verificar compatibilidade `chromium-min@131.0.1` com Node 24. Se necessário,
     configurar `NODE_VERSION=20.x` no Vercel.

### 3.3 Longo Prazo (arquitetura)

Se o Vercel continuar sendo um ambiente problemático para Chromium:

| Opção | Descrição | Prós | Contras |
|---|---|---|---|
| **A – Vercel Pro (Large Functions)** | Usar `@sparticuz/chromium` full com 5GB de função | Sem cold start download, performance | Custo mensal ($20/mês) |
| **B – Cloud PDF Service** | Browserless.io, PDFShift, ou similar | Sem Chromium no deploy | Dependência externa, latência de rede |
| **C – Deploy separado com Docker** | API em Railway/Render/Fly.io com Docker | Chromium funciona nativo | Outra plataforma para gerenciar |
| **D – API própria em VPS** | DigitalOcean, Hetzner com Docker Compose | Controle total | Mais trabalho operacional |

**Recomendação:** Tentar Opção A primeiro (Pro + Large Functions). Se não for viável,
ir para Opção C (Railway com Docker).

---

## 4. Plano de Implementação Detalhado

### Passo 1: Configurar env vars no `odin-api`

```bash
# Via Vercel CLI
vercel env add CHROMIUM_DOWNLOAD_URL production
# Valor: https://github.com/Sparticuz/chromium/releases/download/v131.0.1/chromium-v131.0.1-pack.tar

# Se precisar forçar Node 20:
vercel env add NODE_VERSION production
# Valor: 20.x
```

### Passo 2: Verificar deploy do `odin-api`

Após push no GitHub, verificar se o `odin-api` fez deploy automático:

```bash
vercel list odin-api
```

Confirmar que o último deploy está `Ready` e contém os commits recentes.

### Passo 3: Testar o fluxo completo

```bash
# 1. Gerar documento (formato HTML)
curl -X POST https://odin-api-eight.vercel.app/api/v1/generate \
  -H "Content-Type: application/json" \
  -d '{ "modelId": "<model-slug>", "inputs": {}, "format": "html" }'

# 2. Usar o generationId retornado para baixar PDF
curl -o documento.pdf \
  https://odin-api-eight.vercel.app/api/v1/generations/<generationId>/download

# 3. Verificar se é PDF de verdade
file documento.pdf  # Deve retornar "PDF document"
```

### Passo 4: Se falhar, diagnosticar com logs

1. Acessar https://vercel.com/luckyeasygolds-projects/odin-api
2. Clicar no deployment mais recente
3. Clicar em "View Function Logs"
4. Procurar logs com prefixo `[ODIN PDF]` para identificar onde falhou

### Passo 5: Alternativa — Usar `@sparticuz/chromium` full

Se `chromium-min` continuar falhando:

```bash
# 1. No Vercel, ativar Large Functions:
# Dashboard → Project Settings → Functions → Enable Large Functions

# 2. Reverter para @sparticuz/chromium (full):
cd packages/engine
pnpm remove @sparticuz/chromium-min
pnpm add @sparticuz/chromium@^131.0.1

# 3. Manter AWS_LAMBDA_JS_RUNTIME no código
# 4. Remover CHROMIUM_DOWNLOAD_URL (não precisa mais)
```

---

## 5. Dependências e Riscos

### Dependências

| Item | Status |
|---|---|
| `@sparticuz/chromium-min@131.0.1` | ✅ Instalado |
| `puppeteer-core@^24.43.1` | ✅ Instalado |
| `CHROMIUM_DOWNLOAD_URL` no `odin-api` | ❌ Pendente |
| `AWS_LAMBDA_JS_RUNTIME=nodejs20.x` | ✅ Em código |
| Node 20.x compatível | ⚠️ Verificar (Vercel usa 24.x) |

### Riscos

| Risco | Probabilidade | Impacto | Mitigação |
|---|---|---|---|
| Download do Chromium > 60MB | Média | Alto | Usar `@sparticuz/chromium` full (Pro) |
| Cold start > 300s | Alta | Alto | Aumentar timeout ou Pro plan |
| Node 24 incompatível | Baixa | Alto | Forçar NODE_VERSION=20.x |
| Vercel Hobby insuficiente | Alta | Alto | Migrar para Pro ou Railway |

---

## 6. Critérios de Sucesso

- [ ] `curl -o teste.pdf https://odin-api-eight.vercel.app/api/v1/generations/{id}/download`
      retorna um PDF válido (não HTML)
- [ ] `file teste.pdf` retorna `PDF document`
- [ ] O PDF abre corretamente em qualquer leitor
- [ ] O selo de autenticidade (QR Code + Hash) aparece no rodapé do PDF
- [ ] O tempo de resposta é aceitável (< 30s em produção após warm-up)

---

## 7. Referências

- `packages/engine/src/index.ts` — Implementação do `renderDocument`
- `packages/engine/package.json` — Dependências do chromium-min
- `apps/api/src/index.ts` — Endpoints de geração e download
- `docs/HISTORICO.md` — Histórico de desenvolvimento do ODIN
- `ODIN_MASTER_BLUEPRINT.md` — Visão de produto e arquitetura
- `CHECKPOINT.md` — Estado do projeto em 2026-05-24

---

*Documento criado em 2026-06-29 como parte do plano de correção da geração de PDF no Vercel.*
