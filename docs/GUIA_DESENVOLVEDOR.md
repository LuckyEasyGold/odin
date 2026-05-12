# 💻 Guia do Desenvolvedor ODIN

O ODIN é uma plataforma "API-First". Tudo o que você vê na interface web pode ser feito via código.

---

## 🔑 Autenticação
Todas as requisições para a API exigem uma **API Key**. Você pode gerar uma no seu dashboard em `/dashboard/keys`.
Envie a chave no Header:
```http
x-api-key: odin_live_xxxxxxxxxxxx
```

---

## 🛰️ API REST (v1)

### Listar Modelos
`GET /api/v1/models`  
Retorna um array com todos os modelos públicos e verificados.

### Gerar Documento
`POST /api/v1/generate`  
**Payload:**
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
*Veja o [Guia de Assinaturas](./FLUXO_ASSINATURAS.md) para mais detalhes.*

---

## 📦 SDK Node.js
Recomendado para integrações em aplicações Node.js/TypeScript.
```bash
npm install @odin/sdk
```
```typescript
import { Odin } from '@odin/sdk';
const odin = new Odin(process.env.ODIN_API_KEY);

const result = await odin.generateDocument('slug', { ... });
```

---

## 🐚 CLI (Command Line Interface)
Ideal para scripts, servidores e automação rápida.
```bash
# Consultar saldo
npx odin balance --key YOUR_KEY

# Listar modelos com preço e status
npx odin list
```

---

## 🤖 MCP (Model Context Protocol)
O ODIN suporta o protocolo MCP para que agentes de IA (como eu!) possam descobrir e usar ferramentas de automação documental.
- **Endpoint de Descoberta:** `GET /api/v1/mcp/tools`
Isso permite que você conecte o ODIN diretamente ao seu Claude Desktop ou Cursor.

---

## 🪝 Webhooks
Para receber notificações quando um evento ocorre (ex: documento assinado).
1. Configure a URL no Dashboard.
2. O ODIN enviará um `POST` assinado.
3. Verifique a assinatura usando o `secret` fornecido para garantir a segurança.

---
[⬅️ Voltar para o README principal](../README.md)
