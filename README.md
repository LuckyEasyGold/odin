# ODIN - Open Document Infrastructure Network 🔱🛡️⚖️

> **A infraestrutura padrão para criação, validação e automação de documentos profissionais com segurança jurídica e inteligência.**

---

## 🌟 O que é o ODIN?

O **ODIN** não é apenas um site para preencher contratos. É uma **Rede de Infraestrutura Aberta** concebida para transformar o conhecimento técnico e jurídico em modelos de documentos que são ao mesmo tempo **reutilizáveis**, **programáveis** e **extremamente confiáveis**.

### Para Leigos e Gestores (O Valor)
Se você precisa de documentos que não apenas pareçam profissionais, mas que sigam as melhores práticas do mercado e da lei, o ODIN é seu assistente. Ele garante que:
- **Você não esqueça cláusulas críticas:** Nosso linter jurídico avisa se faltar algo essencial.
- **Os dados estejam corretos:** O preenchimento é guiado e validado em tempo real.
- **Tudo seja rastreável:** Cada documento gerado possui um "DNA digital" (hash) único.

### Para Desenvolvedores (A Potência)
O ODIN foi construído com uma arquitetura modular ("API-First"), permitindo que você integre a geração de documentos complexos em qualquer sistema em minutos.
- **SDK & CLI:** Ferramentas prontas para automação.
- **MCP (Model Context Protocol):** O ODIN é "AI-Native". Conecte sua IA favorita diretamente à infraestrutura para gerar documentos via comandos de voz ou chat.
- **Webhooks:** Receba notificações quando um documento for assinado ou gerado.

---

## 🚀 Quickstart (Local)

### 1) Pré-requisitos
- **Node.js 20+**
- **pnpm 9+**
- **Docker + Docker Compose** (recomendado para banco local)

### 2) Instalação
```bash
pnpm install
```

### 3) Ambiente
Crie o arquivo `.env` na raiz com uma base como esta:
```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/odin"
API_PORT=3001
NEXT_PUBLIC_WEB_URL="http://localhost:3000"
API_URL="http://localhost:3001"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="change-me"

# Opcional para assinaturas Documenso
DOCUMENSO_API_KEY=""

# Opcional para e-mails de assinatura
RESEND_API_KEY=""
EMAIL_FROM="no-reply@odin.local"
```

### 4) Banco de dados
```bash
docker compose up -d
pnpm --filter @odin/storage prisma migrate deploy
pnpm --filter @odin/storage prisma db seed
```

### 5) Executar o projeto
```bash
pnpm dev
```
- Web: `http://localhost:3000`
- API: `http://localhost:3001`

---

## 🛠️ Comece Agora

### 👤 Sou um Usuário / Criador de Modelos
- **[Guia de Conceitos (Leigos)](/docs/CONCEITO.md)**
- **[Fluxo de Assinaturas](/docs/FLUXO_ASSINATURAS.md)**
- **Dashboard**: interface web para criar e gerenciar modelos e gerações.

### 💻 Sou um Desenvolvedor
- **[Guia do Desenvolvedor](/docs/GUIA_DESENVOLVEDOR.md)**
- API base local: `http://localhost:3001/api/v1`

---

## 🏗️ Arquitetura Técnica

O projeto é um monorepo modular:
- `apps/web`: Interface Next.js para usuários finais.
- `apps/api`: Gateway REST/MCP.
- `apps/worker`: Rotinas assíncronas.
- `packages/engine`: Motor de renderização agnóstico.
- `packages/storage`: Camada de persistência com Prisma & PostgreSQL.
- `packages/sdk-node`: Biblioteca oficial para integração Node.js.
- `packages/mcp-server`: Servidor MCP para agentes de IA.
- `packages/cli`: CLI para automação via terminal.

---

## 📜 Roadmap de Evolução
- [x] **Fase 1 (MVP)**: Geração básica e catálogo.
- [x] **Fase 2 (Compliance)**: Linter jurídico e selos de verificação.
- [x] **Fase 3 (Ecossistema)**: CLI, SDK e suporte a Agentes de IA (MCP).
- [x] **Fase 4 (Assinatura)**: Fluxo completo de assinatura digital integrada (Documenso).
- [ ] **Fase 5 (Blockchain)**: Registro imutável de integridade.

---

*ODIN - Onde o documento encontra a inteligência e a lei.* ⚖️🔱
