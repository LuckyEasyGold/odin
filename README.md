# ODIN - Open Document Infrastructure Network

> Infraestrutura aberta para criação, automação e operação de documentos inteligentes.

![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)
![Next.js](https://img.shields.io/badge/Next.js-15.5-black.svg)
![pnpm workspace](https://img.shields.io/badge/pnpm-workspace-orange.svg)
![Status](https://img.shields.io/badge/status-paused%20%2F%20checkpoint-yellow.svg)

## O que é ODIN

ODIN é uma plataforma modular para gerar, versionar e operar documentos digitais com automação, templates e integrações.
O projeto combina uma aplicação web, APIs, engine de templates, storage Prisma/Postgres e ferramentas para SDK, CLI e MCP.
A visão de produto é construir uma rede aberta para infraestrutura documental, com trilhas para uso individual, equipes e comunidade.
Este repositório está em checkpoint para pausa planejada de desenvolvimento e retomada futura.

## Stack

- Next.js 15.5 com App Router
- Prisma com PostgreSQL/Neon
- NextAuth
- pnpm monorepo
- Tailwind CSS
- shadcn/ui

## Estrutura do monorepo

- `apps/web`: aplicação web principal em Next.js.
- `apps/api`: API backend para serviços e integrações.
- `apps/worker`: worker para processamento assíncrono.
- `packages/core`: tipos, contratos e utilitários compartilhados.
- `packages/engine`: engine de templates baseada em Handlebars.
- `packages/storage`: camada Prisma, schema e client compartilhado.
- `packages/sdk-node`: SDK Node.js para consumidores externos.
- `packages/mcp-server`: servidor MCP para integração com agentes.
- `packages/cli`: CLI para operações locais e automações.

## Como rodar

```bash
pnpm install
pnpm prisma migrate deploy --schema=./packages/storage/prisma/schema.prisma
pnpm --filter @odin/web dev
```

## Variáveis de ambiente principais

- `DATABASE_URL`: conexão PostgreSQL/Neon usada pelo Prisma.
- `NEXTAUTH_SECRET`: segredo de assinatura das sessões NextAuth.
- `NEXTAUTH_URL`: URL base da aplicação web.

## Status atual

Checkpoint 2026-05-24 - vide `CHECKPOINT.md` e `.agent`.

- Vercel com deploy verde após sequência de correções.
- Baseline de migrations e campos de curadoria comunitária registrados.
- Desenvolvimento pausado com foco em preservar contexto para retomada.

## Documentos importantes

- [`ODIN_MASTER_BLUEPRINT.md`](./ODIN_MASTER_BLUEPRINT.md): visão de produto, estratégia e arquitetura macro.
- [`.agent`](./.agent): manifesto operacional para agentes MCP/IA que entrarem no projeto.
- [`CHECKPOINT.md`](./CHECKPOINT.md): snapshot de estado para retomada em 2026-05-24.

## Roadmap curto

UI/UX em 5 fases: fundação visual, navegação, fluxos principais, experiência de geração e acabamento responsivo/acessível.
O tracker pendente deve ser usado como referência de execução ao retomar.

## Licença

MIT.
