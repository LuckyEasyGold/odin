const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const USER_ID = "c6e92785-47e0-41c4-bfa8-9faf097257ec";

const modelLibraryVol2 = [
  // 3. FINANCEIRO
  {
    category: "Financeiro",
    models: [
      {
        name: "Recibo de Quitação de Dívida",
        description: "Comprovante formal de recebimento de valores e quitação de débitos.",
        template: `<h1>RECIBO DE QUITAÇÃO</h1>
<p>Recebi de {{pagador}} a quantia de R$ {{valor}}.</p>
<p>Referente a: {{referencia}}</p>`
      },
      {
        name: "Nota de Débito para Reembolso",
        description: "Documento para solicitação de reembolso de despesas corporativas.",
        template: `<h1>NOTA DE DÉBITO</h1>
<p>Solicitamos o reembolso de {{despesa}} no valor de R$ {{valor}}.</p>`
      }
    ]
  },
  // 9. LOGÍSTICA
  {
    category: "Logística",
    models: [
      {
        name: "Comprovante de Entrega de Mercadorias",
        description: "Termo de recebimento para controle de frete e entregas.",
        template: `<h1>COMPROVANTE DE ENTREGA</h1>
<p>Recebi as mercadorias constantes na NF {{nf_num}} em perfeito estado.</p>
<p>Data: {{data}} | Recebido por: {{nome}}</p>`
      },
      {
        name: "Romaneio de Carga",
        description: "Lista detalhada de itens para transporte e expedição.",
        template: `<h1>ROMANEIO DE CARGA</h1>
<p>Veículo: {{placa}} | Motorista: {{motorista}}</p>
<p>Itens: {{lista_itens}}</p>`
      }
    ]
  },
  // 11. MARKETING
  {
    category: "Marketing",
    models: [
      {
        name: "Briefing de Campanha Publicitária",
        description: "Documento estruturado para guiar a criação de campanhas.",
        template: `<h1>BRIEFING DE PROJETO</h1>
<p>Cliente: {{cliente}} | Objetivo: {{objetivo}}</p>
<p>Público-alvo: {{publico}} | Verba: R$ {{orcamento}}</p>`
      },
      {
        name: "Cronograma de Postagens em Redes Sociais",
        description: "Planejamento mensal de conteúdo para mídias digitais.",
        template: `<h1>CRONOGRAMA SOCIAL MEDIA</h1>
<p>Mês: {{mes}} | Canal: {{canal}}</p>
<p>Conteúdo: {{conteudo}} | Data: {{data_publicacao}}</p>`
      }
    ]
  },
  // 15. SAÚDE E SEGURANÇA
  {
    category: "Saúde e Segurança",
    models: [
      {
        name: "Análise Preliminar de Risco (APR)",
        description: "Documento obrigatório para segurança do trabalho em atividades de risco.",
        template: `<h1>APR - ANÁLISE DE RISCO</h1>
<p>Atividade: {{atividade}} | Local: {{local}}</p>
<p>Risco Identificado: {{risco}} | Medida Preventiva: {{medida}}</p>`
      },
      {
        name: "Termo de Entrega de EPI",
        description: "Registro de fornecimento de equipamentos de proteção ao funcionário.",
        template: `<h1>ENTREGA DE EPI</h1>
<p>Funcionário: {{nome}} | Equipamento: {{epi_nome}}</p>
<p>Comprometo-me a usar e zelar pelo equipamento recebido.</p>`
      }
    ]
  },
  // 20. ADMINISTRAÇÃO GERAL
  {
    category: "Administração Geral",
    models: [
      {
        name: "Ata de Reunião de Diretoria",
        description: "Registro oficial de deliberações administrativas.",
        template: `<h1>ATA DE REUNIÃO</h1>
<p>Pauta: {{pauta}} | Decisões: {{decisoes}}</p>`
      },
      {
        name: "Memorando Interno",
        description: "Comunicado oficial entre departamentos da mesma empresa.",
        template: `<h1>MEMORANDO INTERNO</h1>
<p>De: {{origem}} | Para: {{destino}}</p>
<p>Assunto: {{assunto}} | Mensagem: {{mensagem}}</p>`
      }
    ]
  }
];

async function main() {
  console.log("Iniciando injeção de biblioteca Vol 2...");
  
  for (const group of modelLibraryVol2) {
    const category = await prisma.category.findUnique({
      where: { name: group.category }
    });

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
  
  console.log("Volume 2 concluído!");
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
