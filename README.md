# ODIN — Open Document Infrastructure Network

> Infraestrutura aberta para criação, automação e operação de documentos profissionais.

![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)
![Next.js](https://img.shields.io/badge/Next.js-15.5-black.svg)
![pnpm workspace](https://img.shields.io/badge/pnpm-monorepo-orange.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue)
![Status](https://img.shields.io/badge/status-active-brightgreen.svg)

---

## Índice

- [O que é ODIN](#o-que-é-odin)
- [Arquitetura](#arquitetura)
- [Stack](#stack)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Começando](#começando)
- [API](#api)
- [Segurança](#segurança)
- [Como Contribuir](#como-contribuir)
- [Deploy](#deploy)
- [Documentação](#documentação)
- [Status do Projeto](#status-do-projeto)
- [Licença](#licença)

---

## O que é ODIN

ODIN é uma plataforma modular que permite:

- **📄 Gerar documentos profissionais** a partir de templates reutilizáveis (Handlebars)
- **✍️ Assinar digitalmente** via ODIN SIGN (integração com Documenso)
- **🔗 API pública** para consumidores externos (SDK, MCP, REST)
- **🔐 Verificar autenticidade** via QR Code + hash SHA-256
- **🏪 Marketplace** de modelos com sistema de reputação e curadoria comunitária

O projeto combina uma aplicação web (Next.js), API Express, engine de templates (Handlebars + Puppeteer para PDF), storage Prisma/PostgreSQL e ferramentas para SDK, CLI e MCP.

---

## Arquitetura

```
┌─────────────┐     ┌─────────────┐     ┌──────────────┐
│  odin-web   │────▶│  odin-api   │────▶│  PostgreSQL  │
│  (Next.js)  │     │  (Express)  │     │   (Neon)     │
│             │     │             │     └──────────────┘
│  /models    │     │  /generate  │     ┌──────────────┐
│  /dashboard │     │  /download  │────▶│   Chromium   │
│  /sign      │     │  /webhooks  │     │  (PDF via    │
└─────────────┘     └─────────────┘     │  Puppeteer)  │
       │                    │           └──────────────┘
       │                    │           ┌──────────────┐
       │                    └───────────▶│   Documenso  │
       │                                │  (Assinatura)│
       ▼                                └──────────────┘
┌─────────────┐
│  SDK/MCP    │
│  Cliente    │
└─────────────┘
```

### Projetos no Vercel

| Projeto | URL | Função |
|---------|-----|--------|
| **odin-web** | `odin-web-snowy.vercel.app` | Frontend Next.js (público) |
| **odin-api** | `odin-api-eight.vercel.app` | API Express (backend) |

> ℹ️ O projeto está dividido em dois deploys Vercel porque a estrutura monorepo + funções serverless excede os limites do plano Hobby em um único deploy.

---

## Stack

### Frontend
- **Next.js 15.5** com App Router
- **NextAuth** — autenticação por credenciais (bcrypt + JWT)
- **TipTap** — editor WYSIWYG de templates
- **CSS Variables** — theming claro/escuro

### Backend
- **Express** — API REST
- **Prisma** — ORM com PostgreSQL (Neon)
- **Handlebars** — engine de templates com helpers tipados ({{texto}}, {{moeda}}, {{data}}, {{numero}})
- **Puppeteer** + **@sparticuz/chromium-min** — geração de PDF
- **Zod** — validação de schemas

### Monorepo
- **pnpm workspace** — 8 pacotes no total
- **TypeScript** 5.8 strict mode
- **Biome** — linter e formatter

---

## Estrutura do Projeto

```
odin/
├── apps/
│   ├── web/          # Next.js (frontend principal)
│   │   └── src/app/
│   │       ├── models/       # Página de modelos (público)
│   │       ├── dashboard/    # Painel do usuário
│   │       ├── sign/         # Assinatura de documentos
│   │       ├── verify/       # Verificação de autenticidade
│   │       └── api/auth/     # Rotas NextAuth
│   ├── api/          # Express API (backend)
│   │   └── src/
│   │       ├── index.ts      # Rotas e middlewares
│   │       ├── lib/webhooks.ts
│   │       ├── services/email.ts
│   │       └── webhooks/documenso.ts
│   └── worker/       # Processamento assíncrono
├── packages/
│   ├── core/         # Tipos, schemas Zod, contratos
│   ├── engine/       # Engine Handlebars + PDF (Puppeteer)
│   ├── storage/      # Prisma schema, repositórios, seeds
│   ├── sdk-node/     # SDK Node.js para consumidores
│   ├── mcp-server/   # Servidor MCP para agentes IA
│   ├── cli/          # CLI para operações locais
│   └── utils/        # Utilitários compartilhados
├── docs/             # Documentação do projeto
│   ├── HISTORICO.md         # Histórico de desenvolvimento
│   ├── SEGURANCA.md         # Auditoria e correções de segurança
│   ├── plano-pdf-vercel.md  # Plano de correção PDF
│   └── ...                  # Demais documentos
├── contracts/        # Contratos e schemas formais
│   ├── api/          # Contratos da API
│   ├── core/         # Contratos centrais
│   ├── engine/       # Contratos da engine
│   └── storage/      # Contratos de storage
├── ODIN_MASTER_BLUEPRINT.md  # Visão de produto
├── ROADMAP.md        # Roteiro de desenvolvimento
└── CHECKPOINT.md     # Snapshot de estado
```

---

## Começando

### Pré-requisitos

- Node.js 20+
- pnpm 9+
- PostgreSQL (local ou Neon)

### Instalação

```bash
# Clone
git clone https://github.com/LuckyEasyGold/odin.git
cd odin

# Instalar dependências
pnpm install

# Configurar variáveis de ambiente
cp .env.example .env  # (se existir) ou crie manualmente
# Edite .env com suas credenciais (veja seção "Variáveis de Ambiente")

# Rodar migrations
pnpm prisma migrate deploy --schema=./packages/storage/prisma/schema.prisma

# Seed do banco (modelos iniciais)
cd packages/storage
pnpm prisma db seed

# Voltar à raiz e rodar
cd ../..
pnpm --filter @odin/web dev        # Frontend em :3000
pnpm --filter @odin/api dev        # API em :3001
```

### Variáveis de Ambiente

```env
# Banco de Dados
DATABASE_URL=postgresql://user:pass@host/db

# Autenticação
AUTH_SECRET=<gerar com: openssl rand -hex 32>
NEXTAUTH_SECRET=<mesmo valor do AUTH_SECRET>
NEXTAUTH_URL=http://localhost:3000

# URLs
NEXT_PUBLIC_WEB_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:3001
API_URL=http://localhost:3001

# Email (Resend)
RESEND_API_KEY=re_...
EMAIL_FROM=noreply@seudominio.com

# Assinatura Digital (Documenso — opcional)
DOCUMENSO_API_KEY=...
DOCUMENSO_WEBHOOK_SECRET=...

# Chromium (apenas para Vercel)
CHROMIUM_DOWNLOAD_URL=https://github.com/Sparticuz/chromium/releases/download/v131.0.1/chromium-v131.0.1-pack.tar
```

---

## API

A API roda em `https://odin-api-eight.vercel.app` e aceita autenticação via header `x-api-key`.

### Endpoints Principais

| Método | Rota | Autenticação | Descrição |
|--------|------|-------------|-----------|
| GET | `/api/v1/models` | ❌ | Listar modelos públicos |
| GET | `/api/v1/models/:id` | ❌ | Detalhes do modelo |
| POST | `/api/v1/models` | ✅ API Key | Criar novo modelo |
| POST | `/api/v1/generate` | ❌ (ou API Key) | Gerar documento (HTML ou PDF) |
| GET | `/api/v1/generations/:id/download` | ❌ | Baixar PDF/HTML |
| POST | `/api/v1/models/:id/ratings` | ✅ API Key | Avaliar modelo |
| POST | `/api/v1/models/:id/fork` | ✅ API Key | Fork de modelo |
| POST | `/api/v1/generations/:id/sign` | ❌ | Assinar documento |
| GET | `/api/v1/verify/:id` | ❌ | Verificar autenticidade |

> 🔒 Endpoints que exigem autenticação (`✅ API Key`) requerem o header `x-api-key` com uma chave válida. Chaves são geradas no dashboard web.

### SDK Node.js

```bash
npm install @odin/sdk-node
```

```typescript
import { Odin } from "@odin/sdk-node";

const odin = new Odin("sua_api_key");

// Listar modelos
const models = await odin.listModels();

// Gerar documento
const result = await odin.generateDocument("meu-modelo", {
  nome_cliente: "João",
  valor_total: "1500.00"
});

// Baixar PDF
await result.download("documento.pdf");
```

### MCP Server

```bash
ODIN_API_KEY=sua_chave npx @odin/mcp-server
```

Integra com Cursor, Claude, VS Code e outros agentes compatíveis com MCP.

---

## Segurança

> 🔐 Veja o relatório completo em [`docs/SEGURANCA.md`](./docs/SEGURANCA.md)

### O que foi auditado (2026-06-29)

- ✅ Autenticação obrigatória em endpoints POST (models, ratings, fork, sign-native)
- ✅ Sanitização DOMPurify em todos os HTML renderizados (servidor + cliente)
- ✅ JavaScript desabilitado no Puppeteer (prevenção de XSS em PDFs)
- ✅ CORS restrito para origens conhecidas
- ✅ Validação de entrada em criação de modelos
- ✅ Secrets rotacionados (AUTH_SECRET)
- ⚠️ Rate limit real pendente (requer Redis/Upstash)

### Práticas Recomendadas

1. **Nunca commite o `.env`** — já está no `.gitignore`
2. **Rotacione credenciais regularmente**, especialmente `DATABASE_URL` e `RESEND_API_KEY`
3. **Use o SDK oficial** para consumir a API — ele gerencia a chave automaticamente
4. **Valide webhooks** recebidos verificando o header `x-odin-signature` com HMAC-SHA256

---

## Como Contribuir

Contribuições são bem-vindas! Siga os passos abaixo:

### 1. Entenda o projeto

Leia os documentos:
- [`docs/HISTORICO.md`](./docs/HISTORICO.md) — decisões arquiteturais e histórico
- [`ODIN_MASTER_BLUEPRINT.md`](./ODIN_MASTER_BLUEPRINT.md) — visão de produto
- [`ROADMAP.md`](./ROADMAP.md) — próximos passos

### 2. Configure o ambiente

```bash
git clone https://github.com/LuckyEasyGold/odin.git
cd odin
pnpm install
# Configure .env (veja seção "Variáveis de Ambiente")
pnpm prisma migrate deploy --schema=./packages/storage/prisma/schema.prisma
```

### 3. Escolha uma issue ou área

| Área | Descrição | Contato |
|------|-----------|---------|
| 🎨 **UI/UX** | Frontend Next.js, componentes, estilos | Issues/Discussions |
| 🔧 **API** | Express, rotas, middlewares, integrações | Issues/Discussions |
| 📄 **Engine** | Handlebars, helpers, PDF, Puppeteer | Issues/Discussions |
| 🔐 **Segurança** | Autenticação, rate limit, sanitização | Issues/Discussions |
| 📚 **SDK/MCP** | SDK Node.js, servidor MCP | Issues/Discussions |

### 4. Padrões de código

- **TypeScript strict mode** em todo o projeto
- **Biome** para linting e formatação (`pnpm lint`)
- **Conventional commits**: `feat:`, `fix:`, `docs:`, `security:`, `refactor:`, etc.
- **Testes** com Vitest (pacote `@odin/core` tem exemplos)

```bash
# Rodar linter
pnpm lint

# Rodar testes
pnpm --filter @odin/core test

# Build de todos os pacotes
pnpm build
```

---

## Deploy

### Vercel

O projeto deploya em dois projetos Vercel separados:

```bash
# Frontend (odin-web)
cd apps/web
vercel --prod

# API (odin-api, da raiz do projeto)
vercel --project odin-api --prod
```

> ⚠️ **Importante:** O `odin-api` precisa da env var `CHROMIUM_DOWNLOAD_URL` configurada para gerar PDFs. Configure no dashboard Vercel: Project Settings → Environment Variables.

### CI/CD

O repositório GitHub está configurado para deploy automático no Vercel via push na branch `main`. Ambos os projetos (`odin-web` e `odin-api`) são deployados automaticamente.

---

## Documentação

| Documento | Conteúdo |
|-----------|----------|
| [`docs/HISTORICO.md`](./docs/HISTORICO.md) | Histórico completo de desenvolvimento |
| [`docs/SEGURANCA.md`](./docs/SEGURANCA.md) | Auditoria de segurança e correções |
| [`docs/plano-pdf-vercel.md`](./docs/plano-pdf-vercel.md) | Plano de correção da geração de PDF |
| [`ODIN_MASTER_BLUEPRINT.md`](./ODIN_MASTER_BLUEPRINT.md) | Visão de produto e arquitetura macro |
| [`ROADMAP.md`](./ROADMAP.md) | Roteiro de desenvolvimento |
| [`CHECKPOINT.md`](./CHECKPOINT.md) | Snapshot de estado (2026-05-24) |
| [codebuff.com/docs](https://codebuff.com/docs) | Documentação do Codebuff (agente CLI) |

---

## Status do Projeto

**Ativo** — Desenvolvimento contínuo com correções de segurança e melhorias de UX.

Últimas atividades:
- 🔒 Auditoria de segurança completa (2026-06-29) — todas as vulnerabilidades críticas corrigidas
- 📄 Geração de PDF no Vercel — corrigida e funcional
- 🎨 UI/UX — preview de documento com campos inline, toggle cards/lista
- 📚 Documentação — expandida com guias de segurança e contribuição

---

## Licença

MIT. Veja o arquivo [LICENSE](./LICENSE) para detalhes.

---

<p align="center">
  Feito com ☕ e 📄 pela comunidade ODIN
</p>
