# ODIN Agent Manifest

ODIN é uma infraestrutura aberta para criação, automação e operação de documentos inteligentes.
O projeto está organizado como monorepo pnpm com web app, API, worker, packages compartilhados, engine, storage, SDK, CLI e MCP server.
A visão completa de produto, arquitetura e estratégia está em [ODIN_MASTER_BLUEPRINT.md](./ODIN_MASTER_BLUEPRINT.md).

## Capacidades necessárias

Agentes MCP/IA que entrarem no projeto devem ter, idealmente, as seguintes capacidades ativas:

- Filesystem: read/write/glob/grep.
- pnpm + Node 20+.
- Prisma CLI: migrate e generate.
- Git + gh CLI.
- PostgreSQL: entender schema Prisma e impacto de migrations.
- Next.js 15 App Router: RSC, route handlers e NextAuth v5.
- TypeScript strict.
- Tailwind + shadcn/ui.
- Engine de templates: `@odin/engine`, baseada em Handlebars.
- MCP server tooling: `@odin/mcp-server`.

## Estado do projeto

Checkpoint 2026-05-24:

- Vercel deploy verde após sequência PR #5-#9.
- Migration baseline + community curation aplicada no histórico do projeto via PR #11.
- Auth fix: `session.user.id` forçado a `String` em `apps/web/src/lib/auth.ts`.
- Schema community curation: `User.canCurate`, `communityLevel`, `communityScore`, `communityTitle`, `specialistValidatedByCommunity`.

## Convenções de código

- `PrismaClient` deve ser sempre re-exportado de `@odin/storage`; nunca importar `@prisma/client` direto nas apps/packages consumidoras.
- `postinstall` builda `@odin/core` -> `@odin/engine` -> `@odin/storage` antes de `prisma generate`.
- Dependências do worker devem usar `workspace:*`, não `file:`.

## O que não mexer sem aprovação

- `ODIN_MASTER_BLUEPRINT.md`.
- `schema.prisma`: `User.id`, `Model.createdBy` e `Generation.userId` são `String` UUID; não mudar para `Int`.
- API pública `/api/v1/*`, por compatibilidade.

## Próximos passos planejados

UI/UX em 5 fases:

1. Definir fundação visual, tokens e padrões shadcn/Tailwind.
2. Revisar navegação, layout base e hierarquia de informação.
3. Melhorar fluxos principais de autenticação, dashboard e documentos.
4. Refinar experiência de geração, templates e feedback de estados.
5. Garantir responsividade, acessibilidade e polimento visual.
6. Registrar progresso em tracker antes de retomar execução contínua.

## Comandos úteis

```bash
pnpm dev
pnpm prisma migrate deploy --schema=./packages/storage/prisma/schema.prisma
pnpm prisma studio --schema=./packages/storage/prisma/schema.prisma
pnpm --filter @odin/web build
```
