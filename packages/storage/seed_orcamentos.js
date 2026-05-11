const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const USER_ID = "c6e92785-47e0-41c4-bfa8-9faf097257ec";

const orcamentosLibrary = [
  {
    name: "Orçamento de Obras e Alvenaria (Pedreiro)",
    description: "Orçamento detalhado para construção civil, separando mão de obra e materiais.",
    template: `<h1>ORÇAMENTO DE OBRA - ALVENARIA</h1>
<p>Prestador: {{nome_prestador}} | Cliente: {{cliente}}</p>
<h3>Descrição do Serviço</h3>
<p>{{descricao_servico}}</p>
<table border="1" style="width: 100%; border-collapse: collapse;">
  <tr><th>Item</th><th>Medida (m²)</th><th>Vlr Metro</th><th>Total</th></tr>
  <tr><td>{{item_obra}}</td><td>{{metros_quadrados}}</td><td>R$ {{valor_metro}}</td><td>R$ {{total_item}}</td></tr>
</table>
<p><strong>Prazo de Execução:</strong> {{dias_trabalho}} dias úteis.</p>
<p><strong>Materiais:</strong> {{quem_fornece_materiais}}</p>
<p><strong>Valor Total: R$ {{valor_total}}</strong></p>`
  },
  {
    name: "Orçamento de Pintura Residencial",
    description: "Modelo para pintores com detalhamento de demãos e preparação de superfície.",
    template: `<h1>PROPOSTA DE PINTURA</h1>
<p>Cliente: {{cliente}} | Local: {{endereco}}</p>
<h3>Escopo</h3>
<p>Pintura de {{comodos}} com aplicação de {{numero_demaos}} demãos de tinta {{marca_tinta}}.</p>
<p>Incluso: {{preparacao_superficie}} (lixamento/massa).</p>
<p><strong>Investimento: R$ {{valor_total}}</strong></p>
<p>Garantia: {{tempo_garantia}} meses.</p>`
  },
  {
    name: "Orçamento de Instalações Elétricas",
    description: "Orçamento técnico para eletricistas com foco em pontos de energia e segurança.",
    template: `<h1>ORÇAMENTO DE SERVIÇOS ELÉTRICOS</h1>
<p>Responsável Técnico: {{nome_eletricista}}</p>
<p>Instalação de {{quantidade_pontos}} pontos de energia/luz.</p>
<p>Serviços adicionais: {{servicos_extras}}</p>
<p>Norma Técnica: Conforme NBR-5410.</p>
<p><strong>Total Mão de Obra: R$ {{valor_mao_obra}}</strong></p>`
  },
  {
    name: "Orçamento de Desenvolvimento Web (Sites/Apps)",
    description: "Proposta técnica para desenvolvedores com escopo de telas e funcionalidades.",
    template: `<h1>PROPOSTA DE DESENVOLVIMENTO DIGITAL</h1>
<p>Projeto: {{nome_projeto}}</p>
<h3>Escopo do Software</h3>
<ul>
  <li>Telas: {{quantidade_telas}}</li>
  <li>Tecnologias: {{stack_tecnologica}}</li>
  <li>Integrações: {{integracoes_api}}</li>
</ul>
<p>Hospedagem e Manutenção: {{manutencao_mensal}}</p>
<p><strong>Valor do Projeto: R$ {{valor_total}}</strong></p>
<p>Cronograma: {{prazo_entrega}} dias.</p>`
  },
  {
    name: "Orçamento de Manutenção de Computadores/TI",
    description: "Orçamento para assistência técnica de informática e redes.",
    template: `<h1>ORDEM DE SERVIÇO / ORÇAMENTO TI</h1>
<p>Equipamento: {{equipamento}} | Marca/Modelo: {{marca_modelo}}</p>
<h3>Diagnóstico</h3>
<p>{{problema_identificado}}</p>
<p>Peças a serem trocadas: {{pecas_necessarias}} (R$ {{valor_pecas}})</p>
<p>Mão de Obra: R$ {{valor_servico}}</p>
<p><strong>Total: R$ {{total}}</strong></p>`
  },
  {
    name: "Orçamento de Confeitaria e Bolos Artesanais",
    description: "Modelo charmoso para confeiteiras, detalhando sabores e decorações.",
    template: `<h1>ORÇAMENTO DE CONFEITARIA 🎂</h1>
<p>Evento: {{tipo_evento}} | Data: {{data_entrega}}</p>
<p>Produto: {{produto}} ({{peso_quilos}}kg)</p>
<p>Sabor da Massa: {{sabor_massa}} | Recheio: {{sabor_recheio}}</p>
<p>Decoração: {{detalhes_decoracao}}</p>
<p>Taxa de Entrega: R$ {{taxa_entrega}}</p>
<p><strong>Total: R$ {{total}}</strong></p>`
  },
  {
    name: "Orçamento de Conserto de Eletrodomésticos",
    description: "Ficha técnica para assistência de geladeiras, máquinas e fogões.",
    template: `<h1>ORÇAMENTO ASSISTÊNCIA TÉCNICA</h1>
<p>Aparelho: {{aparelho}} | Série: {{numero_serie}}</p>
<p>Serviço: {{descricao_reparo}}</p>
<p>Peças ORIGINAIS inclusas: {{lista_pecas}}</p>
<p><strong>Garantia do Reparo: {{meses_garantia}} meses.</strong></p>
<p>Valor: R$ {{total}}</p>`
  },
  {
    name: "Orçamento de Limpeza e Conservação (Diarista)",
    description: "Modelo para serviços de limpeza residencial ou comercial.",
    template: `<h1>PROPOSTA DE SERVIÇOS DE LIMPEZA</h1>
<p>Frequência: {{frequência}} ({{dias_semana}})</p>
<p>Tamanho do Imóvel: {{numero_quartos}} quartos e {{numero_banheiros}} banheiros.</p>
<p>Serviços Inclusos: {{detalhes_limpeza}}</p>
<p>Materiais de limpeza: {{quem_fornece}}</p>
<p><strong>Valor por Diária: R$ {{valor_diaria}}</strong></p>`
  },
  {
    name: "Orçamento de Fotografia e Filmagem",
    description: "Proposta para eventos sociais, ensaios e vídeos corporativos.",
    template: `<h1>ORÇAMENTO DE FOTOGRAFIA/VÍDEO</h1>
<p>Evento: {{evento}} | Data: {{data_evento}}</p>
<p>Cobertura: {{horas_cobertura}} horas.</p>
<p>Entrega: {{quantidade_fotos}} fotos editadas via {{forma_entrega}}.</p>
<p><strong>Investimento: R$ {{valor_total}}</strong></p>`
  },
  {
    name: "Orçamento de Design Gráfico e Branding",
    description: "Criação de logos e identidade visual com controle de revisões.",
    template: `<h1>PROPOSTA DE DESIGN GRÁFICO</h1>
<p>Item: {{item_design}}</p>
<p>Número de revisões inclusas: {{num_revisoes}}</p>
<p>Formatos de entrega: {{formatos}} (Vetor/JPG/PNG).</p>
<p><strong>Prazo de criação: {{dias_prazo}} dias.</strong></p>
<p>Valor: R$ {{valor}}</p>`
  }
];

async function main() {
  console.log("Injetando a categoria Master de Orçamentos...");

  // 1. Criar ou encontrar a categoria principal
  const category = await prisma.category.upsert({
    where: { name: "Orçamentos de Serviços" },
    update: {},
    create: {
      name: "Orçamentos de Serviços",
      description: "Modelos profissionais para prestadores de serviços, autônomos e freelancers."
    }
  });

  for (const m of orcamentosLibrary) {
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
        fields: [] // Will be auto-parsed by our new Wizard!
      }
    });
    console.log(`+ Orçamento: ${m.name}`);
  }

  console.log("Biblioteca de Orçamentos finalizada com sucesso!");
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
