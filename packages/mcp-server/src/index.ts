#!/usr/bin/env node
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { Odin } from "@odin/sdk";
import * as dotenv from "dotenv";
import path from "path";

// Carregar variáveis de ambiente
dotenv.config();

const API_KEY = process.env.ODIN_API_KEY;
const API_URL = process.env.ODIN_API_URL || "http://localhost:3001/api/v1";

if (!API_KEY) {
  console.error("ERRO: ODIN_API_KEY não configurada.");
  process.exit(1);
}

const odin = new Odin(API_KEY, { apiUrl: API_URL });

/**
 * Criação do servidor MCP
 */
const server = new Server(
  {
    name: "odin-mcp-server",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

/**
 * Listagem de ferramentas disponíveis
 */
server.setRequestHandler(ListToolsRequestSchema, async () => {
  try {
    const models = await odin.listModels();
    
    // Ferramentas base
    const baseTools = [
      {
        name: "odin_list_models",
        description: "Lista todos os modelos de documentos disponíveis no ODIN",
        inputSchema: {
          type: "object",
          properties: {},
        },
      },
      {
        name: "odin_get_balance",
        description: "Consulta o saldo atual na carteira ODIN",
        inputSchema: {
          type: "object",
          properties: {},
        },
      }
    ];

    // Gerar ferramentas dinâmicas para cada modelo (opcional, mas muito poderoso)
    // Para simplificar agora, vamos expor uma ferramenta genérica de geração
    const dynamicTools = [
      {
        name: "odin_generate_document",
        description: "Gera um documento profissional a partir de um modelo do ODIN",
        inputSchema: {
          type: "object",
          properties: {
            modelSlug: {
              type: "string",
              description: "O slug do modelo (ex: 'contrato-servicos')",
            },
            inputs: {
              type: "object",
              description: "Objeto contendo as variáveis para preencher o modelo",
            },
            format: {
              type: "string",
              enum: ["html", "pdf"],
              default: "html",
              description: "Formato de saída do documento",
            },
          },
          required: ["modelSlug", "inputs"],
        },
      },
    ];

    return {
      tools: [...baseTools, ...dynamicTools],
    };
  } catch (error) {
    console.error("Erro ao listar ferramentas:", error);
    return { tools: [] };
  }
});

/**
 * Execução das ferramentas
 */
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    switch (name) {
      case "odin_list_models": {
        const models = await odin.listModels();
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(models, null, 2),
            },
          ],
        };
      }

      case "odin_get_balance": {
        // Usando o endpoint /me do SDK
        // @ts-ignore - Odin SDK might not have getBalance yet, but we know /me has it
        const response = await (odin as any).client.get('/me');
        const balance = response.data.balance;
        return {
          content: [
            {
              type: "text",
              text: `Seu saldo atual no ODIN é R$ ${Number(balance).toFixed(2)}`,
            },
          ],
        };
      }

      case "odin_generate_document": {
        const { modelSlug, inputs, format } = args as any;
        const result = await odin.generateDocument(modelSlug, inputs, { format });
        
        return {
          content: [
            {
              type: "text",
              text: `Documento gerado com sucesso! ID: ${result.generationId}\n${result.message || ""}`,
            },
            {
              type: "text",
              text: result.html || "O documento foi gerado. Você pode baixá-lo no dashboard.",
            },
          ],
        };
      }

      default:
        throw new Error(`Ferramenta desconhecida: ${name}`);
    }
  } catch (error: any) {
    return {
      isError: true,
      content: [
        {
          type: "text",
          text: `Erro ao executar ferramenta ${name}: ${error.message}`,
        },
      ],
    };
  }
});

/**
 * Inicialização do transporte (STDIO)
 */
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("ODIN MCP Server rodando via STDIO");
}

main().catch((error) => {
  console.error("Erro fatal no servidor MCP:", error);
  process.exit(1);
});
