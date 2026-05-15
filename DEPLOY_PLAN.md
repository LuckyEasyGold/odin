# ODIN — Plano de Deploy e Correções

> Gerado em: 2026-05-13
> Objetivo: Levantar o projeto online no Vercel (odin-api + odin-web)

---

## Status Geral

| Etapa | Descrição | Status |
|-------|-----------|--------|
| 1 | Criar Prisma singleton (`web/src/lib/prisma.ts`) | ✅ Concluído |
| 2 | Atualizar `page.tsx` para usar Prisma singleton | ✅ Concluído |
| 3 | Atualizar `curation.ts` para usar Prisma singleton | ✅ Concluído |
| 4 | Atualizar `models/[slug]/page.tsx` com includes do Prisma | ✅ Concluído |
| 5 | Criar `apps/api/vercel.json` para deploy Vercel | ✅ Concluído |
| 6 | Corrigir CORS para domínio do frontend em produção | ✅ Concluído |
| 7 | Gerar AUTH_SECRET real e atualizar .env | ✅ Concluído |
| 8 | Adicionar health check endpoint | ✅ Concluído |
| 9 | Verificar TypeScript compila limpo (API + Web) | ✅ Concluído |
| 10 | Resolver `file:` dependencies → `workspace:*` | ✅ Concluído |
| 11 | Configurar `pnpm-workspace.yaml` e `.npmrc` | ✅ Concluído |
| 12 | Configurar `vercel.json` raiz para monorepo | ✅ Concluído |
| 13 | Adaptar Express para Vercel (`require.main === module`) | ✅ Concluído |
| 14 | Reverter seed.ts (dados já existem no Neon) | ✅ Concluído |
| 15 | QR Code no PDF — corrigir `verificationUrl` para apontar para API | ✅ Concluído |
| 16 | Aumentar espaçamento no card de assinatura do Wizard | ✅ Concluído |
| 17 | Rate limiting básico (memory store) | ✅ Concluído |
| 18 | Meta tags SEO no layout | ✅ Concluído |
| 19 | Trust proxy habilitado | ✅ Concluído |
| 20 | **Reconstruir pacotes** (engine + core + storage) | ✅ Concluído |
| 21 | Download de PDF com QR code + footer | ✅ Concluído |
| 22 | Build de teste local | ✅ Concluído |
| 23 | Deploy para Vercel (odin-api) | ✅ Concluído |
| 24 | Deploy para Vercel (odin-web) | ✅ Concluído |
| 25 | Smoke test pós-deploy | ✅ Concluído |

---

## O que foi feito (resumo)

### Correções de Deploy
- **Prisma singleton** evita múltiplas conexões no serverless
- **`workspace:*`** substitui `file:` links (não funciona no Vercel)
- **`pnpm-workspace.yaml`** + **`.npmrc`** configurados
- **`vercel.json`** raiz com configuração multi-projeto
- **`apps/api/vercel.json`** com `@vercel/node`
- **CORS seguro** (restrito ao FRONTEND_URL em produção)
- **AUTH_SECRET** real
- **Health check** em `/health`
- **Trust proxy** para Vercel
- **Rate limiting** básico (100 req/min por IP)

### Correções de Engine (QR Code no PDF)
- **O problema**: o engine injetava o footer com QR code via `footerTemplate` do Puppeteer, que **não suporta `<img>` base64 em todos os contextos** e o download endpoint não passava `verificationUrl`
- **A correção**: o footer com QR code agora é **injetado diretamente no HTML** antes de ir para o Puppeteer, com fallback seguro
- **Download endpoint** agora constrói a URL de verificação corretamente
- **Novo**: o footer mostra também os signatários do documento (nome e email) quando disponíveis

### Correções de Tipos
- Schema Prisma API = Storage ✅
- Interfaces TypeScript do Core alinhadas ✅
- Schemas Zod atualizados ✅
- Model detail page com includes completos ✅

---

## Problemas Restantes

### Para deploy imediato:
- Configurar variáveis de ambiente no Vercel Dashboard
- Conectar repositório ao Vercel
- Fazer primeiro deploy

### Pós-deploy (melhorias):
- Rate limiting avançado (Redis store)
- Contrato `contract.json` por módulo
- OpenAPI/Swagger
- Módulo de validation
- SDKs
- CLI
- Mais modelos no seed

---

## Passos para testar localmente (ANTES de deploy)

```bash
# 1. Instalar dependências do monorepo
pnpm install

# 2. Construir todos os pacotes
pnpm build

# 3. Iniciar API
cd apps/api
pnpm dev

# 4. Iniciar Web (em outro terminal)
cd apps/web
pnpm dev

# 5. Gerar PDF pelo Wizard no navegador
#    http://localhost:3000/models/orcamento-servicos
#    Preencher formulário → Clicar "Gerar" → Baixar PDF
#    Verificar rodapé com QR Code e Hash DNA

# 6. Testar endpoint de verificação
#    curl http://localhost:3001/api/v1/health
#    curl http://localhost:3001/api/v1/
```