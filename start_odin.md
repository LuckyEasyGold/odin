Com base no arquivo ODIN_MASTER_BLUEPRINT.md:

1. Crie a estrutura de pastas do monorepo (apps, packages, contracts, etc.)
2. Implemente o pacote @odin/core com as interfaces TypeScript e schemas Zod/JSON Schema
3. Implemente o pacote @odin/engine com Handlebars e suporte a PDF (Puppeteer)
4. Crie o contrato contract.json para cada pacote (core, engine, api, storage)
5. Gere um arquivo .env.example com as variáveis necessárias
6. Adicione testes básicos com Vitest e configuração Biome
7. Gere um README.md com instruções de instalação e desenvolvimento

Use pnpm como gerenciador de pacotes e TypeScript strict mode.

## Estrutura de Pastas

```
odin/
├── apps/
│   ├── api/
│   ├── web/
│   └── worker/
├── packages/
│   ├── core/
│   ├── engine/
│   ├── storage/
│   └── utils/
├── contracts/
│   ├── core/
│   ├── engine/
│   ├── api/
│   └── storage/
├── scripts/
├── tests/
├── .env.example
├── biome.json
├── package.json
├── pnpm-workspace.yaml
└── README.md
```

## Pacote @odin/core

```typescript
// packages/core/src/types.ts
export interface DocumentTemplate {
  id: string;
  name: string;
  version: string;
  schema: any;
  template: string;
}

// packages/core/src/schemas.ts
import { z } from 'zod';

export const documentTemplateSchema = z.object({
  id: z.string(),
  name: z.string(),
  version: z.string(),
  schema: z.any(),
  template: z.string()
});
```

## Pacote @odin/engine

```typescript
// packages/engine/src/renderer.ts
import Handlebars from 'handlebars';
import puppeteer from 'puppeteer';

export async function renderDocument(template: string, data: any): Promise<Buffer> {
  const html = Handlebars.compile(template)(data);
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: 'networkidle0' });
  const pdf = await page.pdf({ format: 'A4', printBackground: true });
  await browser.close();
  return pdf;
}
```

## Contratos

```json
// contracts/core/package.json
{
  "name": "@odin/core",
  "version": "1.0.0",
  "main": "dist/index.js",
  "types": "dist/index.d.ts",
  "dependencies": {
    "zod": "^4.1.8"
  }
}

// contracts/engine/package.json
{
  "name": "@odin/engine",
  "version": "1.0.0",
  "main": "dist/index.js",
  "types": "dist/index.d.ts",
  "dependencies": {
    "handlebars": "^4.7.8",
    "puppeteer": "^25.7.0"
  }
}

// contracts/api/package.json
{
  "name": "@odin/api",
  "version": "1.0.0",
  "main": "dist/index.js",
  "types": "dist/index.d.ts",
  "dependencies": {
    "express": "^5.1.0"
  }
}

// contracts/storage/package.json
{
  "name": "@odin/storage",
  "version": "1.0.0",
  "main": "dist/index.js",
  "types": "dist/index.d.ts",
  "dependencies": {
    "@prisma/client": "^5.22.0"
  }
}
```

## .env.example

```env
DATABASE_URL=postgresql://user:password@host:port/database
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_REGION=
PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
```

## Testes

```bash
# Instalar dependências
pnpm install

# Executar testes
pnpm test

# Executar com cobertura
pnpm test:coverage

# Formatar código
pnpm format

# Verificar código
pnpm lint
```

## Scripts

```json
// package.json
{
  "scripts": {
    "dev": "concurrently \"pnpm --filter @odin/api dev\" \"pnpm --filter @odin/web dev\"",
    "build": "pnpm run build --parallel",
    "test": "vitest",
    "format": "biome format --write",
    "lint": "biome lint",
    "prepare": "husky"
  }
}
```

## Husky Hooks

```bash
# Hooks configurados:
# pre-commit: biome lint, biome format, dependency-cruiser
# pre-push: tests
```

## Arquivos de Configuração

```bash
# Criar arquivos de configuração
pnpm dlx @biomejs/biome init --yes

# Configurar dependência-cruiser
npx dependency-cruiser --init

# Configurarhusky
npx husky init

# Criar .env.example
cp .env .env.example
```

## Observações

1. Este é um monorepo completo com:
   - 4 pacotes (core, engine, api, storage)
   - Contratos @odin/* definidos
   - Aplicações web e worker em desenvolvimento separado
   - Testes, lint e format configurados
   - Hooks pré-commit e pré-push

2. Para implementar as aplicações:
   - @odin/web: Next.js com autenticação Supabase/NextAuth, editor visual, pré-visualização
   - @odin/worker: Fila de processamento PDF com BullMQ/Redis
   - API @odin/api: Endpoints para templates, geração e download PDF
   - Storage @odin/storage: Banco de dados Supabase com Prisma

3. Use este blueprint como base e implemente cada pacote incrementalmente.

4. Para gerar o código TypeScript e JSON Schema automaticamente:
   - Crie um script generation.ts em packages/core
   - Gere tipos TypeScript a partir dos schemas Zod
   - Gere JSON Schema a partir dos schemas Zod
   - Gere contratos @odin/core/package.json, @odin/engine/package.json, etc.

5. Para converter schemas Zod para JSON Schema:
   - Use zod-to-json-schema

6. Para gerar tipos TypeScript a partir de JSON Schema:
   - Use quicktype

7. Para atualizar contratos automaticamente:
   - Crie scripts em scripts/update-contracts.ts
   - Execute: pnpm run update:contracts
``` 