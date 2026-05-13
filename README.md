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
- **MCP (Model Context Protocol):** O ODIN é "AI-Native". Conecte sua IA favorita (Cursor, Claude Desktop) diretamente à infraestrutura para gerar documentos via comandos de voz ou chat.
- **Webhooks:** Receba notificações quando um documento for assinado ou gerado.


---

## 🚀 Como o ODIN funciona?

O ecossistema ODIN é dividido em três grandes pilares:

1.  **A Biblioteca (Registry):** Um catálogo de modelos de alta utilidade criados pela comunidade e verificados por especialistas.
2.  **O Motor (Engine):** Transforma dados simples em documentos complexos (PDF/HTML) com design impecável.
3.  **O Selo de Confiança (Compliance):** Um sistema de auditoria que garante que cada modelo atenda a requisitos mínimos de segurança jurídica.

---

## 🛠️ Comece Agora

Escolha seu perfil abaixo para as instruções ideais:

### 👤 Sou um Usuário / Criador de Modelos
- **[Guia de Conceitos (Leigos)](/docs/CONCEITO.md)**: Entenda o que é um modelo, uma variável e como a verificação funciona.
- **Dashboard**: Acesse a interface web para criar e gerenciar seus documentos.

### 💻 Sou um Desenvolvedor
- **[Guia do Desenvolvedor](/docs/GUIA_DESENVOLVEDOR.md)**: Documentação da API, SDK e exemplos de integração.
- **CLI**: `npx odin list` para explorar os modelos via terminal.

---

## 🏗️ Arquitetura Técnica

O projeto é um monorepo modular:
- `apps/web`: Interface Next.js premium para usuários finais.
- `apps/api`: Gateway REST/MCP de alta performance.
- `packages/engine`: Motor de renderização agnóstico.
- `packages/storage`: Camada de persistência com Prisma & PostgreSQL.
- `packages/sdk-node`: Biblioteca oficial para integração Node.js.

---

## 📜 Roadmap de Evolução
- [x] **Fase 1 (MVP)**: Geração básica e catálogo.
- [x] **Fase 2 (Compliance)**: Linter jurídico e selos de verificação.
- [x] **Fase 3 (Ecossistema)**: CLI, SDK e suporte a Agentes de IA (MCP).
- [x] **Fase 4 (Assinatura)**: Fluxo completo de assinatura digital integrada (Documenso).
- [ ] **Fase 5 (Blockchain)**: Registro imutável de integridade.

---

*ODIN - Onde o documento encontra a inteligência e a lei.* ⚖️🔱