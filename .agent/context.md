# 🧠 Memória do Agente - ODIN (Maio/2026)

## 📌 Visão Geral do Projeto
O ODIN é uma rede de infraestrutura de documentos. O objetivo é permitir que usuários criem, gerenciem e compartilhem modelos de documentos profissionais que podem ser preenchidos manualmente ou via API/IA.

## 🏗️ Arquitetura e Decisões Técnicas
- **Monorepo:** Estruturado com `pnpm workspaces`.
- **Banco de Dados:** Prisma no pacote `@odin/storage`. Migramos para uma taxonomia relacional (tabela `Category` com Parent/Child).
- **Serialização:** Implementamos conversão manual de `Decimal` para `Number` e `Date` para `String` no `page.tsx` do dashboard e criação, para compatibilidade com Next.js 15 Client Components.
- **Wizard:** Implementamos um **Auto-Parser** (regex) no componente `Wizard.tsx`. Se um modelo não tem `fields` definidos, o sistema extrai variáveis `{{...}}` automaticamente do template.

## ✅ Funcionalidades Entregues (Fase 6)
- **Biblioteca Profissional:** Mais de 40 modelos reais (Destaque para a categoria **Orçamentos de Serviços** com 10 modelos específicos).
- **Sistema de Forks:** Botão de Fork na visualização de modelos públicos que permite clonar o modelo para a conta do usuário.
- **Privacidade:** Campo `isPublic` no banco de dados.
- **Navegação:** Navbar universal integrada no `layout.tsx` raiz e Dashboard ajustado.
- **Documentação:** Página `/docs` criada para desenvolvedores.

## 🚀 Próximos Passos (Backlog)
1. **Sistema de Monetização:** Implementar cobrança por geração de documentos premium.
2. **Editor Rich Text:** Substituir o textarea simples por um editor mais robusto (ex: TipTap ou Quill).
3. **Assinatura Visual:** Implementar a renderização visual da assinatura eletrônica (SHA-256) no rodapé dos documentos.
4. **Dashboard Keys:** Finalizar a tela de geração e revogação de `x-api-key`.

---
*Este documento deve ser lido no início de cada nova sessão de desenvolvimento.*
