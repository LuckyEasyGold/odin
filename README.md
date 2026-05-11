# ODIN - Open Document Infrastructure Network 🔱🛡️

O ODIN é uma infraestrutura de documentos aberta, descentralizada e colaborativa, projetada para profissionais autônomos, empresas e integração com Inteligência Artificial.

## 🚀 Estado Atual: Fase 6 (Ecossistema Colaborativo)

A plataforma evoluiu para um ecossistema completo de gestão e geração de documentos profissionais.

### Principais Funcionalidades:
- **Biblioteca Profissional:** 40+ modelos reais em 20 categorias (Jurídico, Comercial, TI, Engenharia, Confeitaria, Obras, etc.).
- **Geração Inteligente:** Auto-parser de variáveis `{{ }}` que cria formulários instantaneamente.
- **Ecossistema Colaborativo:** Sistema de **Forks** (criação de versões baseadas em modelos existentes) e visibilidade **Público/Privado**.
- **DNA Digital:** Assinatura eletrônica e prova de integridade via SHA-256.
- **API & MCP:** Integração nativa com agentes de IA via Model Context Protocol.

## 🛠️ Tecnologias
- **Frontend:** Next.js 15 (App Router), TypeScript, Vanilla CSS (Premium Design).
- **Backend/API:** Node.js, MCP Protocol.
- **Banco de Dados:** PostgreSQL (Neon) com Prisma ORM.
- **Autenticação:** NextAuth.js.

## 🏃 Como Rodar
1. Instale as dependências: `pnpm install`
2. Configure o `.env` (Banco Neon e NextAuth).
3. Sincronize o banco: `pnpm db:push`
4. Inicie o servidor: `pnpm dev`

## 📖 Documentação
Acesse `/docs` no navegador para detalhes sobre a API e integração com IA.

---
*ODIN - Onde o documento encontra a inteligência.*