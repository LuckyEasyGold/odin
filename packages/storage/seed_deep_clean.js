const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const USER_ID = "c6e92785-47e0-41c4-bfa8-9faf097257ec";

const modelLibrary = [
  // 1. COMERCIAL
  {
    category: "Comercial",
    models: [
      {
        name: "Proposta Comercial Master",
        description: "Apresentação completa de serviços com escopo, cronograma e valores.",
        template: `<h1>PROPOSTA COMERCIAL</h1>
<p>Prezado(a) <strong>{{cliente}}</strong>,</p>
<p>Apresentamos nossa proposta para {{servico}}.</p>
<h3>Escopo</h3>
<p>{{detalhes}}</p>
<h3>Investimento</h3>
<p>R$ {{valor}}</p>`
      },
      {
        name: "Orçamento de Vendas",
        description: "Documento ágil para cotação de produtos e frete.",
        template: `<h1>ORÇAMENTO</h1>
<p>Produto: {{item}} | Quantidade: {{qtd}}</p>
<p>Preço Unitário: R$ {{preco}} | Total: R$ {{total}}</p>`
      }
    ]
  },
  // 2. CONTRATOS
  {
    category: "Contratos",
    models: [
      {
        name: "Contrato de Prestação de Serviços",
        description: "Modelo jurídico padrão para consultoria e serviços técnicos.",
        template: `<h1>CONTRATO DE SERVIÇOS</h1>
<p>CONTRATANTE: {{contratante}} | CONTRATADO: {{contratado}}</p>
<p>Objeto: {{objeto}}</p>
<p>Valor: R$ {{valor}} | Prazo: {{prazo}}</p>`
      },
      {
        name: "Acordo de Confidencialidade",
        description: "Proteção de dados e segredos industriais.",
        template: `<h1>NDA - ACORDO DE SIGILO</h1>
<p>Partes: {{parte_a}} e {{parte_b}}</p>
<p>Projeto: {{projeto}}</p>
<p>Vigência: {{anos}} anos.</p>`
      }
    ]
  },
  // 5. JURÍDICO
  {
    category: "Jurídico",
    models: [
      {
        name: "Procuração Ad Judicia",
        description: "Poderes amplos para representação por advogado.",
        template: `<h1>PROCURAÇÃO</h1>
<p>Outorgante: {{nome}} | CPF: {{cpf}}</p>
<p>Advogado: {{advogado}} | OAB: {{oab}}</p>
<p>Poderes para o foro em geral.</p>`
      },
      {
        name: "Petição de Acordo Extrajudicial",
        description: "Termo de conciliação entre partes para encerramento de conflitos.",
        template: `<h1>TERMO DE ACORDO</h1>
<p>Partes: {{requerente}} e {{requerido}}</p>
<p>Cláusula 1ª: O requerido pagará R$ {{valor}} em {{parcelas}} vezes.</p>`
      }
    ]
  },
  // 4. RECURSOS HUMANOS
  {
    category: "Recursos Humanos",
    models: [
      {
        name: "Contrato de Trabalho (CLT)",
        description: "Contrato padrão conforme as leis trabalhistas brasileiras.",
        template: `<h1>CONTRATO DE TRABALHO</h1>
<p>Empregador: {{empresa}} | Empregado: {{funcionario}}</p>
<p>Cargo: {{cargo}} | Salário: R$ {{salario}}</p>
<p>Início: {{data_inicio}}</p>`
      }
    ]
  },
  // 13. ENGENHARIA
  {
    category: "Engenharia",
    models: [
      {
        name: "Relatório de Visita Técnica",
        description: "Registro de inspeção e acompanhamento de obras.",
        template: `<h1>RELATÓRIO TÉCNICO</h1>
<p>Obra: {{obra}} | Data: {{data}}</p>
<p>Observações: {{notas}}</p>
<p>Conclusão: {{conclusao}}</p>`
      }
    ]
  },
  // 18. IMOBILIÁRIO
  {
    category: "Imobiliário",
    models: [
      {
        name: "Contrato de Locação Residencial",
        description: "Aluguel de imóvel com cláusulas de garantia e prazo.",
        template: `<h1>CONTRATO DE ALUGUEL</h1>
<p>Locador: {{locador}} | Locatário: {{locatario}}</p>
<p>Valor: R$ {{valor}} | Endereço: {{imovel}}</p>`
      }
    ]
  },
  // 12. TI
  {
    category: "Tecnologia da Informação",
    models: [
      {
        name: "Manual de Usuário do Sistema",
        description: "Documentação básica para orientação de usuários finais.",
        template: `<h1>MANUAL DO SISTEMA {{sistema}}</h1>
<p>Objetivo: {{objetivo}}</p>
<p>Passo a passo: {{instrucoes}}</p>`
      }
    ]
  }
];

async function main() {
  console.log("Iniciando limpeza total...");
  
  // Limpar gerações primeiro (devido à chave estrangeira)
  await prisma.generation.deleteMany({});
  await prisma.rating.deleteMany({});
  await prisma.model.deleteMany({});
  console.log("Banco de dados limpo.");

  for (const group of modelLibrary) {
    const category = await prisma.category.findUnique({
      where: { name: group.category }
    });

    if (!category) {
      console.warn(`Aviso: Categoria ${group.category} não encontrada.`);
      continue;
    }

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
  
  console.log("ODIN repovoado com sucesso!");
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
