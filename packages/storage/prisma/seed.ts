import { PrismaClient } from "@prisma/client";
import * as dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(__dirname, "../../../.env") });

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
      categoryName: "Financeiro",
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
      slug: "social-media-management",
      name: "Gestão de Redes Sociais",
      description: "Pacote mensal de gestão de conteúdo e engajamento para redes sociais.",
      categoryName: "Marketing",
      version: "1.0.0",
      template: `
        <div style="font-family: 'Helvetica', sans-serif; padding: 40px; border: 10px solid #f3f4f6;">
          <h1 style="color: #db2777; text-align: center;">Proposta de Social Media</h1>
          <p style="text-align: center; color: #6b7280;">Preparado para: <strong>{{clientName}}</strong></p>
          <hr style="border: 1px solid #f3f4f6;" />
          
          <div style="margin-top: 30px;">
            <h3 style="color: #db2777;">Escopo do Projeto</h3>
            <ul>
              <li>{{postsPerWeek}} posts por semana no Instagram/Facebook</li>
              <li>Gestão de {{platforms}} plataformas</li>
              <li>{{storiesPerMonth}} Stories mensais</li>
              <li>Relatório de métricas ao final do mês</li>
            </ul>
          </div>

          <div style="margin-top: 30px; background-color: #fdf2f8; padding: 20px; border-radius: 8px;">
            <h3 style="margin-top: 0;">Investimento Mensal</h3>
            <p style="font-size: 24px; font-weight: bold; color: #db2777;">R$ {{monthlyFee}}</p>
            <p style="font-size: 12px;">Taxa de setup inicial: R$ {{setupFee}}</p>
          </div>
          
          <div style="margin-top: 40px; font-size: 14px;">
            <p><strong>Início previsto:</strong> {{startDate}}</p>
            <p><strong>Duração do contrato:</strong> {{contractDuration}} meses</p>
          </div>
        </div>
      `,
      schema: {},
      fields: [
        { key: "clientName", type: "text", label: "Nome do Cliente", required: true },
        { key: "postsPerWeek", type: "number", label: "Posts por Semana", required: true, defaultValue: 3 },
        { key: "platforms", type: "text", label: "Plataformas (ex: Instagram, LinkedIn)", required: true },
        { key: "storiesPerMonth", type: "number", label: "Stories por Mês", required: true, defaultValue: 20 },
        { key: "monthlyFee", type: "currency", label: "Mensalidade (R$)", required: true },
        { key: "setupFee", type: "currency", label: "Taxa de Setup (R$)", required: true, defaultValue: 0 },
        { key: "startDate", type: "date", label: "Data de Início", required: true },
        { key: "contractDuration", type: "number", label: "Duração (Meses)", required: true, defaultValue: 6 },
      ],
      tags: ["marketing", "social media", "gestão"],
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
      slug: "web-development-service",
      name: "Desenvolvimento de Web Site/Landing Page",
      description: "Proposta técnica para criação de sites institucionais ou páginas de vendas.",
      categoryName: "TI",
      version: "1.1.0",
      template: `
        <div style="font-family: 'Courier New', Courier, monospace; padding: 40px; color: #1e293b;">
          <h2 style="border-left: 5px solid #0f172a; padding-left: 15px;">PROPOSTA TÉCNICA: {{projectType}}</h2>
          <p>Cliente: <strong>{{clientName}}</strong></p>
          
          <div style="margin-top: 30px;">
            <h3>Especificações Técnicas</h3>
            <p><strong>Tecnologias:</strong> {{techStack}}</p>
            <p><strong>Funcionalidades:</strong> {{featuresList}}</p>
          </div>

          <div style="margin-top: 30px;">
            <h3>Cronograma e Entrega</h3>
            <p>Prazo total estimado: {{deadlineWeeks}} semanas.</p>
          </div>

          <div style="margin-top: 50px; border-top: 2px dashed #cbd5e1; padding-top: 20px;">
            <p style="font-size: 20px;">Valor Total do Projeto: <strong>R$ {{totalPrice}}</strong></p>
            <p>Condições: {{paymentTerms}}</p>
          </div>
        </div>
      `,
      schema: {},
      fields: [
        { key: "clientName", type: "text", label: "Nome do Cliente", required: true },
        { key: "projectType", type: "text", label: "Tipo de Projeto (ex: Landing Page)", required: true },
        { key: "techStack", type: "text", label: "Stack (ex: Next.js, React)", required: true, defaultValue: "Next.js, TailwindCSS" },
        { key: "featuresList", type: "textarea", label: "Funcionalidades Principais", required: true },
        { key: "deadlineWeeks", type: "number", label: "Prazo em Semanas", required: true },
        { key: "totalPrice", type: "currency", label: "Preço Total", required: true },
        { key: "paymentTerms", type: "text", label: "Condições de Pagamento", required: true, defaultValue: "50% entrada, 50% entrega" },
      ],
      tags: ["ti", "desenvolvimento", "web"],
      license: "MIT",
      createdBy: systemUser.id,
      features: {
        hasIntermediation: true,
        requiresLegalReview: false,
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
