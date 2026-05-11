import { PrismaClient } from "@prisma/client";
import * as dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(__dirname, "../.env") });

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
});

console.log("DATABASE_URL:", process.env.DATABASE_URL);
async function main() {
  // 1. Create a system user
  const systemUser = await prisma.user.upsert({
    where: { username: "system" },
    update: {},
    create: {
      username: "system",
      fullName: "ODIN System",
      avatarUrl: "https://api.dicebear.com/7.x/bottts/svg?seed=odin",
    },
  });

  // 2. Initial Models
  const models = [
    {
      slug: "orcamento-servicos",
      name: "Proposta de Orçamento de Serviços",
      description: "Modelo padrão para orçamentos de prestação de serviços diversos.",
      category: "Financeiro",
      version: "1.0.0",
      template: `
        <div style="font-family: sans-serif; padding: 40px;">
          <h1 style="color: #2563eb;">Orçamento de Serviço</h1>
          <hr />
          <div style="margin-top: 20px;">
            <p><strong>Cliente:</strong> {{clientName}}</p>
            <p><strong>Data:</strong> {{date}}</p>
          </div>
          <div style="margin-top: 30px;">
            <h3>Descrição dos Serviços</h3>
            <p>{{serviceDescription}}</p>
          </div>
          <div style="margin-top: 30px; text-align: right;">
            <h2 style="color: #2563eb;">Total: R$ {{totalValue}}</h2>
          </div>
          <div style="margin-top: 50px; font-size: 12px; color: #666;">
            <p>Este orçamento é válido por {{validityDays}} dias.</p>
          </div>
        </div>
      `,
      schema: {},
      fields: [
        { key: "clientName", type: "text", label: "Nome do Cliente", required: true },
        { key: "date", type: "date", label: "Data do Orçamento", required: true },
        { key: "serviceDescription", type: "textarea", label: "Descrição dos Serviços", required: true },
        { key: "totalValue", type: "currency", label: "Valor Total", required: true },
        { key: "validityDays", type: "number", label: "Dias de Validade", required: true, defaultValue: 15 },
      ],
      tags: ["orçamento", "serviços", "financeiro"],
      license: "MIT",
      createdBy: systemUser.id,
      features: {
        hasIntermediation: false,
        requiresLegalReview: false,
        supportsSignature: true,
        supportsBlockchain: false,
      },
      compliance: { status: "verified" },
    },
    {
      slug: "contrato-prestacao-simples",
      name: "Contrato de Prestação de Serviço Simples",
      description: "Contrato básico para formalização de serviços entre autônomos e empresas.",
      category: "Jurídico",
      version: "1.0.0",
      template: `
        <div style="font-family: serif; padding: 50px; line-height: 1.6;">
          <h1 style="text-align: center;">CONTRATO DE PRESTAÇÃO DE SERVIÇOS</h1>
          <p>Pelo presente instrumento particular, de um lado <strong>{{contratante}}</strong> e de outro lado <strong>{{contratado}}</strong>, celebram o presente contrato sob as seguintes cláusulas:</p>
          
          <h3>1. OBJETO</h3>
          <p>O objeto deste contrato é a prestação de serviços de {{objetoServico}}.</p>
          
          <h3>2. VALOR E PAGAMENTO</h3>
          <p>Pela execução dos serviços, o CONTRATANTE pagará ao CONTRATADO a importância de R$ {{valorContrato}}.</p>
          
          <h3>3. PRAZO</h3>
          <p>O prazo para conclusão dos serviços é de {{prazoDias}} dias.</p>
          
          <div style="margin-top: 100px; display: flex; justify-content: space-between;">
            <div style="border-top: 1px solid black; width: 40%; text-align: center;">CONTRATANTE</div>
            <div style="border-top: 1px solid black; width: 40%; text-align: center;">CONTRATADO</div>
          </div>
        </div>
      `,
      schema: {},
      fields: [
        { key: "contratante", type: "text", label: "Nome do Contratante", required: true },
        { key: "contratado", type: "text", label: "Nome do Contratado", required: true },
        { key: "objetoServico", type: "textarea", label: "Descrição do Objeto", required: true },
        { key: "valorContrato", type: "currency", label: "Valor do Contrato", required: true },
        { key: "prazoDias", type: "number", label: "Prazo (em dias)", required: true },
      ],
      tags: ["contrato", "jurídico", "prestação de serviço"],
      license: "MIT",
      createdBy: systemUser.id,
      features: {
        hasIntermediation: false,
        requiresLegalReview: true,
        supportsSignature: true,
        supportsBlockchain: true,
      },
      compliance: { status: "verified" },
    },
  ];

  for (const model of models) {
    await prisma.model.upsert({
      where: { slug: model.slug },
      update: model,
      create: model,
    });
  }

  console.log("Database seeded successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
