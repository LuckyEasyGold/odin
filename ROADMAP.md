# ODIN - Roadmap e Melhorias

Este é o documento único para melhorias e pendências operacionais do ODIN.
Para visão de produto, consulte `ODIN_MASTER_BLUEPRINT.md`.
Para o snapshot técnico atual, consulte `CHECKPOINT.md`.

## UI/UX (5 fases)

### Fase 1 — Quick wins
- Melhorar a home com busca no hero e grid de categorias.
- Quebrar `RichTemplateEditor.tsx` em `WizardStepper`, `WizardForm` e `WizardPreview`.
- Tornar o `DeveloperDrawer` toggleável.
- Exibir badge `Verificado por especialistas`, consumindo `User.specialistValidatedByCommunity`.

### Fase 2 — Wizard aprimorado
- Implementar wizard em 3 etapas.
- Adicionar preview live com debounce.
- Agrupar campos por seção/contexto.
- Usar mobile sheet para experiência responsiva.

### Fase 3 — Página por template
- Criar página dedicada por template com SEO.
- Adicionar CTA claro `Usar modelo`.

### Fase 4 — Dashboard
- Adicionar histórico avançado de documentos.
- Implementar favoritos.
- Implementar forks de modelos.

### Fase 5 — Polimento e confiança
- Adicionar microinterações.
- Implementar selo de compliance.

### Restrição de escopo UI/UX
- Não alterar `packages/core`, `packages/engine`, `packages/storage` nem a API `/api/v1/generate/preview` durante essas fases.

## Backend / Infra pendente

### Assinatura eletrônica
A auditoria encontrou implementação existente de assinatura eletrônica em `apps/api`, `apps/web`, `packages/engine`, `packages/core` e schemas Prisma. Portanto, os planos antigos de Fase 4 foram considerados implementados em termos estruturais e removidos como documentos soltos.

Pendências de evolução/validação manual:
- Validar em ambiente real o fluxo Documenso fim a fim.
- Confirmar comportamento de assinaturas sequenciais versus paralelas, caso o produto precise dessa decisão formal.
- Garantir que webhooks Documenso estejam configurados em produção e com secret validado.
- Verificar se os e-mails de solicitação de assinatura são disparados corretamente pelo provedor em produção.
- Validar o status exibido no dashboard para cenários `SENT`, `PARTIALLY_SIGNED`, `COMPLETED`, `REJECTED` e falhas do provedor.

## Dívidas técnicas

- Aplicar `pnpm --filter @odin/storage prisma migrate deploy` em produção, se ainda não tiver sido executado após as migrações recentes.
- Confirmar o fix de `session.user.id` após teste local do usuário.
- Revisar divergências futuras entre documentação pública em `/docs` no app web e este roadmap.

## Itens marcados `duvida` (precisam revisão manual)

- Nenhum item foi marcado como dúvida nesta limpeza. Os documentos auditados foram classificados como implementados ou incorporados neste roadmap.
