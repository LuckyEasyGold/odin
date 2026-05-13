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
O ODIN é **AI-Native**. Suportamos o protocolo MCP para que agentes de IA possam descobrir e usar ferramentas de automação documental diretamente.

### Como Conectar um Agente (Cursor / Claude Desktop)
Adicione um servidor MCP com as seguintes configurações:
- **Tipo:** `command`
- **Comando:** `npx @odin/mcp-server`
- **Variáveis de Ambiente:**
  - `ODIN_API_KEY`: Sua x-api-key.
  - `ODIN_API_URL`: `https://odin-web.vercel.app/api/v1` (Opcional).

### Ferramentas Disponíveis
O servidor MCP expõe automaticamente as seguintes funções para a IA:
- `odin_list_models`: Lista todos os templates disponíveis.
- `odin_get_balance`: Consulta o saldo do usuário.
- `odin_generate_document`: Gera o documento (HTML/PDF) a partir de um slug e inputs.

### Exemplos de Comandos para a IA
- *"Quais são os modelos de orçamento disponíveis no ODIN?"*
- *"Crie uma proposta de marketing usando o modelo 'proposta-v2' para o cliente 'Loja do Zé' com valor de R$ 3000."*
- *"Verifique se tenho saldo suficiente para gerar um contrato de R$ 50."*


---

## 🪝 Webhooks
Para receber notificações quando um evento ocorre (ex: documento assinado).
1. Configure a URL no Dashboard.
2. O ODIN enviará um `POST` assinado.
3. Verifique a assinatura usando o `secret` fornecido para garantir a segurança.

---
[⬅️ Voltar para o README principal](../README.md)
