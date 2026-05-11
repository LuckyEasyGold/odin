# ODIN - Open Document Infrastructure Network

> Uma infraestrutura aberta para criação, validação, automação e gestão de documentos profissionais via API.

## Instalação

```bash
# Instalar dependências
pnpm install

# Iniciar desenvolvimento
pnpm dev
```

## Scripts

| Script | Descrição |
|--------|-----------|
| `pnpm dev` | Inicia todas as aplicações em modo desenvolvimento |
| `pnpm build` | Build de todos os pacotes |
| `pnpm test` | Executa os testes |
| `pnpm test:coverage` | Executa testes com cobertura |
| `pnpm format` | Formata o código |
| `pnpm lint` | Verifica o código |

## Estrutura

```
odin/
├── apps/
│   ├── api/        # API REST (Express)
│   ├── web/        # Interface web (Next.js)
│   └── worker/     # Worker de processamento (BullMQ)
├── packages/
│   ├── core/       # Tipos, schemas Zod e interfaces TypeScript
│   ├── engine/     # Renderização Handlebars/PDF (Puppeteer)
│   ├── storage/    # Persistência Prisma/PostgreSQL
│   └── utils/      # Utilitários comuns
├── contracts/      # JSON contracts para cada módulo
├── scripts/        # Scripts de automação
└── tests/          # Testes integrados
```

## Pacotes

### @odin/core
Tipos e schemas Zod para validação de dados:
- `Model`, `Field`, `Generation`, `Rating`, `ApiKey`
- Schemas Zod para runtime validation

### @odin/engine
Renderização de documentos:
- Handlebars templates
- PDF generation with Puppeteer

### @odin/storage
Repositórios Prisma:
- `ModelRepository` - CRUD de modelos
- `GenerationRepository` - Armazenamento de documentos gerados
- `RatingRepository` - Avaliações
- `ApiKeyRepository` - Gerenciamento de chaves API

### @odin/api
REST API Express:
- `GET/POST /api/v1/models` - CRUD de modelos
- `POST /api/v1/generate` - Geração de documentos
- `GET /api/v1/mcp/tools` - Discovery de ferramentas

### @odin/web
Interface Next.js:
- Landing page
- Browse de modelos
- Wizard de preenchimento

### @odin/worker
Processamento assíncrono:
- Fila BullMQ para geração de PDFs
- Processamento em background

## Variáveis de Ambiente

Copie `.env.example` para `.env` e configure:

```env
DATABASE_URL=postgresql://user:password@localhost:5432/odin
REDIS_URL=redis://localhost:6379
API_PORT=3000
```

## Licença

MIT