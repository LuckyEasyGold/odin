const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const modelLibrary = [
  // 1. COMERCIAL
  {
    category: "Comercial",
    models: [
      {
        name: "Proposta Comercial de Prestação de Serviços",
        description: "Modelo profissional para apresentação de serviços e valores para clientes corporativos.",
        template: `<h1>PROPOSTA COMERCIAL</h1>
<p>Prezado(a) <strong>{{cliente}}</strong>,</p>
<p>A <strong>{{sua_empresa}}</strong> tem o prazer de apresentar esta proposta para a prestação de serviços de {{servico_desc}}.</p>
<h3>Escopo do Trabalho</h3>
<p>{{escopo}}</p>
<h3>Investimento</h3>
<p>O valor total do projeto é de <strong>R$ {{valor_total}}</strong>.</p>
<p>Validade da proposta: {{validade}}.</p>`
      },
      {
        name: "Orçamento de Venda de Produtos",
        description: "Documento para formalização de preços e prazos de entrega de mercadorias.",
        template: `<h1>ORÇAMENTO Nº {{numero}}</h1>
<p>Cliente: {{cliente}} | Data: {{data}}</p>
<table border="1" style="width: 100%; border-collapse: collapse;">
  <tr><th>Produto</th><th>Qtd</th><th>Preço Un.</th></tr>
  <tr><td>{{produto}}</td><td>{{qtd}}</td><td>R$ {{preco}}</td></tr>
</table>
<p><strong>Total: R$ {{total}}</strong></p>
<p>Prazo de entrega: {{prazo}} dias.</p>`
      }
    ]
  },
  // 2. CONTRATOS
  {
    category: "Contratos",
    models: [
      {
        name: "Contrato de Prestação de Serviços Autônomos",
        description: "Contrato padrão para formalizar o trabalho entre freelancer e contratante.",
        template: `<h1>CONTRATO DE PRESTAÇÃO DE SERVIÇOS</h1>
<p>CONTRATANTE: {{contratante}}, CPF/CNPJ {{doc_contratante}}.</p>
<p>CONTRATADO: {{contratado}}, CPF/CNPJ {{doc_contratado}}.</p>
<p>Cláusula 1ª: O CONTRATADO prestará os serviços de {{objeto}} durante o período de {{prazo}}.</p>
<p>Cláusula 2ª: O valor acordado é de R$ {{valor}} pagos via {{forma_pagamento}}.</p>`
      },
      {
        name: "Acordo de Confidencialidade (NDA)",
        description: "Termo jurídico para proteção de segredos comerciais e informações sensíveis.",
        template: `<h1>TERMO DE CONFIDENCIALIDADE</h1>
<p>As partes {{empresa_a}} e {{empresa_b}} concordam em manter sigilo absoluto sobre {{projeto}}.</p>
<p>A quebra deste sigilo acarretará multa de R$ {{multa}} e penalidades previstas em lei.</p>
<p>Vigência: {{anos}} anos.</p>`
      }
    ]
  },
  // 3. FINANCEIRO
  {
    category: "Financeiro",
    models: [
      {
        name: "Recibo de Pagamento de Honorários",
        description: "Comprovante simples de recebimento de valores por serviços prestados.",
        template: `<h1>RECIBO DE PAGAMENTO</h1>
<p>Recebi de {{pagador}} a importância de <strong>R$ {{valor}}</strong> referente a {{referencia}}.</p>
<p>Dou plena e total quitação pelo valor recebido.</p>
<p>{{cidade}}, {{data}}</p>`
      },
      {
        name: "Nota de Débito",
        description: "Documento para cobrança de despesas reembolsáveis ou serviços extras.",
        template: `<h1>NOTA DE DÉBITO</h1>
<p>A empresa {{empresa}} solicita o reembolso de despesas conforme listado:</p>
<ul><li>{{despesa}} - R$ {{valor_despesa}}</li></ul>
<p><strong>Total a pagar: R$ {{total}}</strong></p>`
      }
    ]
  },
  // 4. RECURSOS HUMANOS
  {
    category: "Recursos Humanos",
    models: [
      {
        name: "Advertência Disciplinar ao Funcionário",
        description: "Formalização de conduta inadequada conforme a CLT.",
        template: `<h1>ADVERTÊNCIA DISCIPLINAR</h1>
<p>Ao colaborador {{nome_colaborador}}.</p>
<p>Fica o senhor advertido por {{motivo}} ocorrido em {{data_ocorrido}}.</p>
<p>Ciente de que a reincidência poderá acarretar suspensão ou demissão por justa causa.</p>`
      },
      {
        name: "Solicitação de Gozo de Férias",
        description: "Documento para o colaborador solicitar o período de descanso anual.",
        template: `<h1>SOLICITAÇÃO DE FÉRIAS</h1>
<p>Eu, {{nome}}, solicito o período de férias de {{inicio}} a {{fim}}.</p>
<p>Conto com {{dias_abono}} dias de abono pecuniário.</p>`
      }
    ]
  },
  // 5. JURÍDICO
  {
    category: "Jurídico",
    models: [
      {
        name: "Procuração Ad Judicia",
        description: "Poderes para advogados representarem clientes em processos judiciais.",
        template: `<h1>PROCURAÇÃO</h1>
<p>OUTORGANTE: {{cliente}}, residente em {{endereco}}.</p>
<p>OUTORGADO: {{advogado}}, OAB/{{oab_uf}} nº {{oab_num}}.</p>
<p>PODERES: Para o foro em geral, em qualquer juízo, instância ou tribunal.</p>`
      },
      {
        name: "Declaração de Residência",
        description: "Termo de fé pública para comprovação de endereço.",
        template: `<h1>DECLARAÇÃO DE RESIDÊNCIA</h1>
<p>Eu, {{nome}}, portador do CPF {{cpf}}, declaro para os devidos fins que resido no endereço {{endereco}} desde {{data_inicio}}.</p>`
      }
    ]
  },
  // 6. COMPRAS
  {
    category: "Compras",
    models: [
      {
        name: "Ordem de Compra de Materiais",
        description: "Autorização formal de compra enviada a fornecedores.",
        template: `<h1>ORDEM DE COMPRA {{oc_numero}}</h1>
<p>Fornecedor: {{fornecedor}}</p>
<p>Solicitamos o envio de {{material}} conforme cotação {{cota_ref}}.</p>
<p>Faturamento: {{condicao_pagamento}}</p>`
      },
      {
        name: "Cadastro de Novo Fornecedor",
        description: "Formulário para homologação e registro de parceiros comerciais.",
        template: `<h1>FICHA DE CADASTRO - FORNECEDOR</h1>
<p>Razão Social: {{razao_social}}</p>
<p>CNPJ: {{cnpj}} | Inscrição Estadual: {{ie}}</p>
<p>Banco: {{banco}} Ag: {{agencia}} C/C: {{conta}}</p>`
      }
    ]
  },
  // 12. TECNOLOGIA DA INFORMAÇÃO
  {
    category: "Tecnologia da Informação",
    models: [
      {
        name: "Documento de Requisitos de Software",
        description: "Definição funcional de funcionalidades para desenvolvimento de sistemas.",
        template: `<h1>ESPECIFICAÇÃO DE REQUISITOS</h1>
<p>Projeto: {{projeto}} | Versão: {{versao}}</p>
<h3>RF001 - {{funcionalidade}}</h3>
<p><strong>Descrição:</strong> {{descricao_requisito}}</p>
<p><strong>Prioridade:</strong> {{prioridade}}</p>`
      },
      {
        name: "Relatório de Incidente (Bug Report)",
        description: "Documento técnico para reporte de falhas em sistemas.",
        template: `<h1>RELATÓRIO DE BUG</h1>
<p>Sistema: {{sistema}} | Ambiente: {{ambiente}}</p>
<p>Título: {{titulo_erro}}</p>
<p>Passos para reproduzir: {{passos}}</p>
<p>Resultado esperado: {{esperado}} | Resultado obtido: {{obtido}}</p>`
      }
    ]
  },
  // 13. ENGENHARIA
  {
    category: "Engenharia",
    models: [
      {
        name: "Memorial Descritivo de Obra",
        description: "Detalhamento técnico de materiais e processos para construção civil.",
        template: `<h1>MEMORIAL DESCRITIVO</h1>
<p>Obra: {{nome_obra}} | Responsável: {{eng_responsavel}}</p>
<p>Este documento descreve as etapas de {{etapa}} conforme projeto {{projeto_ref}}.</p>
<p>Materiais: {{lista_materiais}}</p>`
      },
      {
        name: "Laudo de Inspeção Técnica",
        description: "Avaliação profissional sobre o estado de estruturas ou equipamentos.",
        template: `<h1>LAUDO TÉCNICO Nº {{laudo_id}}</h1>
<p>Data da Inspeção: {{data}} | Local: {{local}}</p>
<p>Conclusão: {{conclusao_tecnica}}</p>
<p>Recomendações: {{recomendacoes}}</p>`
      }
    ]
  },
  // 18. IMOBILIÁRIO
  {
    category: "Imobiliário",
    models: [
      {
        name: "Contrato de Locação Residencial",
        description: "Contrato padrão para aluguel de casas e apartamentos.",
        template: `<h1>CONTRATO DE LOCAÇÃO</h1>
<p>LOCADOR: {{locador}} | LOCATÁRIO: {{locatario}}</p>
<p>Imóvel situado em: {{endereco_imovel}}</p>
<p>Aluguel mensal: R$ {{valor_aluguel}} | Garantia: {{garantia}}</p>`
      },
      {
        name: "Termo de Vistoria de Imóvel",
        description: "Registro do estado do imóvel na entrega ou devolução das chaves.",
        template: `<h1>LAUDO DE VISTORIA</h1>
<p>Pintura: {{estado_pintura}}</p>
<p>Elétrica/Hidráulica: {{estado_instalacoes}}</p>
<p>Observações: {{notas}}</p>`
      }
    ]
  },
  // 20. ADMINISTRAÇÃO GERAL
  {
    category: "Administração Geral",
    models: [
      {
        name: "Ata de Reunião Ordinária",
        description: "Registro formal de decisões e tópicos discutidos em reuniões.",
        template: `<h1>ATA DE REUNIÃO</h1>
<p>Data: {{data}} | Horário: {{hora}} | Local: {{local}}</p>
<p>Participantes: {{participantes}}</p>
<p>Pauta: {{pauta}}</p>
<p>Deliberações: {{decisoes}}</p>`
      },
      {
        name: "Ofício de Comunicação Externa",
        description: "Documento formal para comunicação entre empresas ou órgãos públicos.",
        template: `<h1>OFÍCIO Nº {{num_oficio}}</h1>
<p>Para: {{destinatario}}</p>
<p>Assunto: {{assunto}}</p>
<p>Prezados, comunicamos que {{mensagem}}.</p>
<p>Atenciosamente, {{assinatura}}</p>`
      }
    ]
  }
];

async function main() {
  console.log("Iniciando limpeza e repovoamento da biblioteca...");
  
  // 1. Limpar modelos existentes
  await prisma.model.deleteMany({});
  console.log("Modelos antigos removidos.");

  // 2. Inserir novos modelos vinculados às categorias
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
          slug: m.name.toLowerCase().replace(/ /g, "-").replace(/[^\w-]+/g, ""),
          description: m.description,
          categoryId: category.id,
          template: m.template,
          isPublic: true,
          isActive: true,
          createdBy: "system", // Or a valid system user ID
          version: "1.0.0",
          schema: {},
          fields: {}
        }
      });
      console.log(`Modelo criado: ${m.name} [${group.category}]`);
    }
  }
  
  console.log("Biblioteca repovoada com sucesso!");
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
