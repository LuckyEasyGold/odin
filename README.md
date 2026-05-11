<div align="center">
  <h1>⚡ ODIN</h1>
  <p><strong>Open Document Infrastructure Network</strong></p>
  <p>Uma infraestrutura aberta para criação, validação, automação e gestão de documentos profissionais via API.</p>

  <p>
    <a href="https://nextjs.org"><img alt="Next.js" src="https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js"></a>
    <a href="https://www.typescriptlang.org"><img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript"></a>
    <a href="https://www.prisma.io"><img alt="Prisma" src="https://img.shields.io/badge/Prisma-ORM-2D3748?style=for-the-badge&logo=prisma"></a>
    <a href="https://neon.tech"><img alt="Neon" src="https://img.shields.io/badge/Neon-PostgreSQL-00E699?style=for-the-badge&logo=postgresql"></a>
    <a href="https://puppeteer.com"><img alt="Puppeteer" src="https://img.shields.io/badge/Puppeteer-PDF-40B5A4?style=for-the-badge&logo=puppeteer"></a>
    <img alt="Version" src="https://img.shields.io/badge/versão-1.2.0--beta-orange?style=for-the-badge">
  </p>

  <br/>
  </div>

---

## 📖 Sobre o Projeto

**ODIN** é uma camada de infraestrutura open source projetada para padronizar a criação, versionamento e automação de documentos profissionais e jurídicos. 

Diferente de um simples gerador de PDF, o ODIN permite que qualquer sistema (ERP, CRM, Marketplace) gere documentos validados a partir de modelos reutilizáveis e estruturados, com suporte a múltiplas linguagens e assinaturas.

🌐 **Repositório Oficial:** [github.com/LuckyEasyGold/odin](https://github.com/LuckyEasyGold/odin) | [codeberg.org/whodo/odin](https://codeberg.org/whodo/odin)

---

## ✨ Funcionalidades (Status do MVP)

| Funcionalidade | Status |
|---|---|
| 📑 Geração de PDF Profissional (Puppeteer A4) | ✅ Completo |
| 🔐 Autenticação e Perfis (Auth.js / NextAuth) | ✅ Completo |
| 📊 Dashboard do Usuário (Histórico e Carteira) | ✅ Completo |
| 💰 Sistema de Créditos e Marketplace | ✅ Completo |
| 🔑 Gestão de Chaves de API para Devs | ✅ Completo |
| ⭐ Sistema de Avaliações e Feedback | ✅ Completo |
| ✅ Selos de Verificação de Modelos | ✅ Implementado |
| 🔗 API REST estruturada para integrações | ✅ Funcional |

---

## 🚀 Novidades da Fase 4 (Marketplace e Monetização)

O ODIN agora possui um ecossistema econômico sustentável:
- **Carteira Virtual:** Gerenciamento de saldo e histórico de transações financeiras.
- **Marketplace Profissional:** Modelos categorizados entre Gratuitos e Premium (Pagos).
- **Portal do Desenvolvedor:** Geração e revogação de API Keys para automação externa.
- **Segurança Avançada:** Implementação de hashing de senhas com **bcryptjs (Salt 12)** para proteção de dados sensíveis.
- **Infraestrutura Financeira:** Preparado para integração com gateways de pagamento (Mercado Pago).

---

## 🛠️ Stack Tecnológica

- **Monorepo:** [Turborepo](https://turbo.build/) + [pnpm](https://pnpm.io/)
- **Frontend:** [Next.js 15](https://nextjs.org) (App Router)
- **Backend/API:** [Express](https://expressjs.com/) + [tsx](https://tsx.is/)
- **Document Engine:** [Puppeteer](https://pptr.dev/) (Renderização PDF)
- **Templates:** [Handlebars](https://handlebarsjs.com/)
- **Banco de Dados:** [Neon](https://neon.tech) (PostgreSQL Serverless)
- **ORM:** [Prisma](https://www.prisma.io)
- **Linguagem:** [TypeScript](https://www.typescriptlang.org)

---

## 🚀 Instalação e Execução Local

```bash
# 1. Clone o repositório
git clone https://github.com/LuckyEasyGold/odin.git
cd odin

# 2. Instale as dependências (necessário pnpm)
pnpm install

# 3. Configure as variáveis de ambiente
cp .env.example .env
# Edite o .env com sua DATABASE_URL do Neon
```

### Comandos de Desenvolvimento

```bash
# Iniciar API e Web simultaneamente
pnpm dev

# Gerar cliente Prisma
pnpm --filter @odin/storage exec prisma generate

# Popular banco com modelos iniciais
pnpm --filter @odin/storage exec prisma db seed
```

---

## 🗃️ Estrutura do Projeto

```
odin/
├── apps/
│   ├── api/            # API REST (Express)
│   └── web/            # Interface Next.js 15
├── packages/
│   ├── core/           # Tipos e interfaces compartilhadas
│   ├── engine/         # Motor de renderização PDF (Puppeteer)
│   ├── storage/        # Camada de dados e Repositórios (Prisma)
│   └── utils/          # Helpers compartilhados
├── prisma/             # Schema e Migrations
└── ODIN_MASTER_BLUEPRINT.md # Visão estratégica do projeto
```

---

## 🤝 Contribuindo

1. Faça um _fork_ do projeto
2. Crie sua branch: `git checkout -b feature/minha-melhoria`
3. Commit suas mudanças: `git commit -m 'feat: adiciona nova funcionalidade'`
4. Push: `git push origin feature/minha-melhoria`
5. Abra um Pull Request

---

<div align="center">
  <p>Feito com ❤️ por <strong>Vinícius Ramos</strong> e a comunidade <strong>ODIN</strong></p>
</div>