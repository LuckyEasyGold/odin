const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const categories = [
  { name: "Comercial", sub: ["Proposta Comercial", "Orçamento", "Pedido de Venda", "Cotação", "Tabela de Preços"] },
  { name: "Contratos", sub: ["Prestação de Serviços", "Compra e Venda", "Locação", "Parceria Comercial", "Confidencialidade (NDA)"] },
  { name: "Financeiro", sub: ["Fatura", "Recibo", "Nota de Débito", "Demonstrativo Financeiro", "Comprovante de Pagamento"] },
  { name: "Recursos Humanos", sub: ["Contrato de Trabalho", "Advertência", "Avaliação de Desempenho", "Solicitação de Férias", "Termo de Rescisão"] },
  { name: "Jurídico", sub: ["Procuração", "Termo de Responsabilidade", "Declaração", "Petição", "Parecer Jurídico"] },
  { name: "Compras", sub: ["Solicitação de Compra", "Ordem de Compra", "Mapa de Cotação", "Pedido ao Fornecedor", "Cadastro de Fornecedor"] },
  { name: "Estoque", sub: ["Entrada de Mercadorias", "Saída de Mercadorias", "Inventário", "Ajuste de Estoque", "Transferência Interna"] },
  { name: "Produção", sub: ["Ordem de Produção", "Ficha Técnica", "Controle de Qualidade", "Relatório de Produção", "Checklist Operacional"] },
  { name: "Logística", sub: ["Romaneio", "Conhecimento de Transporte", "Manifesto de Carga", "Etiqueta de Expedição", "Comprovante de Entrega"] },
  { name: "Atendimento ao Cliente", sub: ["Ordem de Serviço", "Chamado Técnico", "Relatório de Atendimento", "Termo de Aceite", "Pesquisa de Satisfação"] },
  { name: "Marketing", sub: ["Briefing", "Plano de Campanha", "Cronograma de Publicação", "Relatório de Métricas", "Proposta de Patrocínio"] },
  { name: "Tecnologia da Informação", sub: ["Documento de Requisitos", "Manual do Sistema", "Relatório de Bugs", "Plano de Backup", "Política de Segurança"] },
  { name: "Engenharia", sub: ["Memorial Descritivo", "ART/RRT", "Projeto Técnico", "Laudo Técnico", "Relatório de Inspeção"] },
  { name: "Educação e Treinamento", sub: ["Certificado", "Lista de Presença", "Plano de Aula", "Material Didático", "Avaliação"] },
  { name: "Saúde e Segurança", sub: ["Análise de Risco", "Ficha de EPI", "Relatório de Acidente", "DDS", "Check-list de Segurança"] },
  { name: "Governança e Compliance", sub: ["Código de Conduta", "Política Interna", "Auditoria", "Plano de Ação", "Registro de Não Conformidade"] },
  { name: "Licitações", sub: ["Edital", "Proposta Técnica", "Proposta Comercial", "Declarações", "Documentação de Habilitação"] },
  { name: "Imobiliário", sub: ["Contrato de Locação", "Vistoria de Imóvel", "Proposta de Compra", "Escritura", "Recibo de Aluguel"] },
  { name: "Seguros", sub: ["Proposta de Seguro", "Apólice", "Aviso de Sinistro", "Relatório de Perdas", "Endosso"] },
  { name: "Administração Geral", sub: ["Ata de Reunião", "Memorando", "Ofício", "Circular", "Relatório Gerencial"] }
];

async function main() {
  console.log("Iniciando semeadura de categorias...");
  for (const cat of categories) {
    const parent = await prisma.category.upsert({
      where: { name: cat.name },
      update: {},
      create: { name: cat.name }
    });
    console.log(`Categoria: ${parent.name}`);
    for (const sub of cat.sub) {
      await prisma.category.upsert({
        where: { name: sub },
        update: { parentId: parent.id },
        create: { name: sub, parentId: parent.id }
      });
    }
  }
  console.log("Categorias semeadas com sucesso!");
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
