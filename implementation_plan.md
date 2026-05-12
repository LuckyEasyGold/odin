# Plano de Implementação: Fase 4 — Assinatura Eletrônica

A Fase 4 elevará o ODIN ao patamar de plataforma de gestão de contratos (CLM), permitindo que documentos gerados sejam assinados digitalmente de forma integrada.

## User Review Required

> [!IMPORTANT]
> A integração inicial será focada no **Documenso**, mas a arquitetura será agnóstica para permitir outras plataformas no futuro. Precisaremos definir se as assinaturas serão sequenciais (um após o outro) ou paralelas.

## Mudanças Propostas

### 1. Banco de Dados (`packages/storage`)
- **Model `Signer` [NEW]:** Nova tabela para armazenar e-mail, nome, status da assinatura e posição (ordem) de cada signatário vinculado a uma geração.
- **Model `Generation` [MODIFY]:** Adicionar campos `externalSignatureId` e `signatureStatus`.

### 2. API & Engine (`apps/api` & `packages/engine`)
- **Signature Service [NEW]:** Módulo para gerenciar a criação de "envelopes" de assinatura via API externa.
- **Webhooks [MODIFY]:** Expandir o sistema de webhooks para processar o retorno de "Documento Assinado".

### 3. Frontend Web (`apps/web`)
- **Wizard [MODIFY]:** Nova etapa opcional "Solicitar Assinaturas" com formulário dinâmico de e-mails.
- **Dashboard [MODIFY]:** Visualização de progresso das assinaturas (ex: "1 de 3 assinaturas coletadas").

## Plano de Verificação

### Testes Automatizados
- Simulação de Webhook de conclusão de assinatura para validar a atualização do status no banco.

### Verificação Manual
- Gerar um documento de teste e verificar se os e-mails de solicitação de assinatura são disparados corretamente.
