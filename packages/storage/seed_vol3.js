const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const USER_ID = "c6e92785-47e0-41c4-bfa8-9faf097257ec";

const modelLibraryVol3 = [
  // 6. COMPRAS
  {
    category: "Compras",
    models: [
      {
        name: "Ordem de Compra de Insumos",
        description: "Pedido formal para aquisição de matérias-primas e insumos industriais.",
        template: `<h1>ORDEM DE COMPRA</h1>
<p>Solicitamos o envio de {{item}} na quantidade de {{qtd}}.</p>`
      },
      {
        name: "Cadastro de Fornecedor Homologado",
        description: "Ficha técnica para registro e avaliação de novos parceiros.",
        template: `<h1>FICHA DE FORNECEDOR</h1>
<p>Empresa: {{nome}} | CNPJ: {{cnpj}} | Contato: {{contato}}</p>`
      }
    ]
  },
  // 7. ESTOQUE
  {
    category: "Estoque",
    models: [
      {
        name: "Guia de Saída de Material",
        description: "Documento para controle de retirada de itens do almoxarifado.",
        template: `<h1>SAÍDA DE ESTOQUE</h1>
<p>Item: {{item}} | Qtd: {{qtd}} | Destino: {{setor}}</p>`
      },
      {
        name: "Relatório de Inventário de Estoque",
        description: "Ficha para conferência periódica de saldos físicos.",
        template: `<h1>INVENTÁRIO</h1>
<p>Data: {{data}} | Item: {{item}} | Saldo Físico: {{saldo}}</p>`
      }
    ]
  },
  // 14. EDUCAÇÃO
  {
    category: "Educação e Treinamento",
    models: [
      {
        name: "Certificado de Participação em Treinamento",
        description: "Documento para comprovação de horas de capacitação interna.",
        template: `<h1>CERTIFICADO</h1>
<p>Certificamos que {{aluno}} concluiu o treinamento de {{curso}} com carga de {{horas}}h.</p>`
      },
      {
        name: "Lista de Presença em Workshop",
        description: "Registro de frequência para eventos e palestras.",
        template: `<h1>LISTA DE PRESENÇA</h1>
<p>Evento: {{evento}} | Data: {{data}}</p>
<p>Participante: {{nome}} | Assinatura: ________________</p>`
      }
    ]
  },
  // 17. LICITAÇÕES
  {
    category: "Licitações",
    models: [
      {
        name: "Declaração de Habilitação Jurídica",
        description: "Termo obrigatório para participação em editais públicos.",
        template: `<h1>DECLARAÇÃO DE HABILITAÇÃO</h1>
<p>A empresa {{empresa}} declara que atende a todos os requisitos do edital {{edital_num}}.</p>`
      }
    ]
  },
  // 19. SEGUROS
  {
    category: "Seguros",
    models: [
      {
        name: "Aviso de Sinistro de Automóvel",
        description: "Formulário para comunicação de acidentes à seguradora.",
        template: `<h1>AVISO DE SINISTRO</h1>
<p>Segurado: {{nome}} | Placa: {{placa}}</p>
<p>Descrição do evento: {{descricao}} | Data: {{data}}</p>`
      }
    ]
  }
];

async function main() {
  console.log("Iniciando injeção final Vol 3...");
  for (const group of modelLibraryVol3) {
    const category = await prisma.category.findUnique({ where: { name: group.category } });
    if (!category) continue;
    for (const m of group.models) {
      await prisma.model.create({
        data: {
          name: m.name,
          slug: m.name.toLowerCase().replace(/ /g, "-").replace(/[^\w-]+/g, "") + "-" + Math.floor(Math.random()*1000),
          description: m.description,
          categoryId: category.id,
          template: m.template,
          isPublic: true,
          isActive: true,
          createdBy: USER_ID,
          version: "1.0.0",
          schema: {},
          fields: {}
        }
      });
      console.log(`+ Modelo: ${m.name}`);
    }
  }
  console.log("Biblioteca 100% Completa!");
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
