# 💻 Guia do Desenvolvedor ODIN

O ODIN é uma plataforma **API-First**. Tudo o que você vê na interface web pode ser feito via código.

---

## 🔧 Configuração rápida

1. Instale dependências:
```bash
pnpm install
```

2. Suba banco local:
```bash
docker compose up -d
```

3. Migre e popule o banco:
```bash
pnpm --filter @odin/storage prisma migrate deploy
pnpm --filter @odin/storage prisma db seed
```

4. Rode API + Web:
```bash
pnpm dev
```

Base URL local da API: `http://localhost:3001/api/v1`

---

## 🔑 Autenticação

Todas as rotas privadas exigem API Key no header:

```http
x-api-key: odin_live_xxxxxxxxxxxx
```

Você pode gerar sua chave no dashboard em `/dashboard/keys`.

---

## 🛰️ API REST (v1)

### Endpoints principais

- `GET /api/v1` — metadata da API.
- `GET /api/v1/me` — dados do usuário autenticado.
- `GET /api/v1/models` — lista modelos.
- `GET /api/v1/models/:id` — detalhes por ID/slug.
- `POST /api/v1/generate` — gera documento (HTML/PDF).
- `GET /api/v1/generations/:id/download` — baixa PDF de geração.
- `GET /api/v1/verify/:id` — verificação pública por hash/ID.
- `POST /api/v1/generations/:id/sign` — assinatura simplificada.
- `POST /api/v1/generations/:id/sign-native` — assinatura nativa por signatário.
- `GET /api/v1/mcp/tools` — catálogo de ferramentas MCP.

### Gerar Documento
`POST /api/v1/generate`

**Payload**
```json
{
  "modelId": "contrato-servicos-v1",
  "inputs": {
    "cliente": "Empresa X",
    "valor": 1500
  },
  "format": "pdf",
  "signers": [
    { "name": "Nome", "email": "email@exemplo.com", "order": 1 }
  ]
}
```

**Resposta típica**
```json
{
  "generationId": "uuid",
  "html": "<html>...</html>",
  "signatureUrl": "https://.../sign/uuid",
  "message": "Document generated"
}
```

Veja o [Guia de Assinaturas](./FLUXO_ASSINATURAS.md) para detalhes de estados e webhooks.

---

## 📦 SDK Node.js

Recomendado para integrações Node.js/TypeScript.

```bash
npm install @odin/sdk
```

```typescript
import { Odin } from '@odin/sdk';

const odin = new Odin(process.env.ODIN_API_KEY!);
const result = await odin.generateDocument('contrato-servicos-v1', {
  cliente: 'Empresa X',
  valor: 1500
});
```

---

## 🐚 CLI

A CLI do projeto é o pacote `@odin/cli` (bin `odin`).

Uso local (sem publicação global), a partir do monorepo:

```bash
pnpm --filter @odin/cli exec odin list
pnpm --filter @odin/cli exec odin balance --key YOUR_KEY
```

---

## 🤖 MCP (Model Context Protocol)

### Servidor MCP

Pacote: `@odin/mcp-server`.

Comando binário do pacote: `odin-mcp`.

Exemplo de configuração (Cursor/Claude):
- Tipo: `command`
- Comando: `npx @odin/mcp-server`
- Variáveis:
  - `ODIN_API_KEY`: sua chave de API
  - `ODIN_API_URL`: `https://odin-web.vercel.app/api/v1` (opcional)

### Ferramentas disponíveis
- `odin_list_models`
- `odin_get_model`
- `odin_generate_document`

---

## 🪝 Webhooks

Para receber eventos de assinatura:
1. Cadastre a URL no dashboard.
2. ODIN envia `POST` assinado.
3. Valide assinatura via secret configurado.

Evento atual:
- `document.signed`

---

## 🧪 Comandos úteis

```bash
pnpm test
pnpm lint
pnpm format:check
```

---

[⬅️ Voltar para o README principal](../README.md)
