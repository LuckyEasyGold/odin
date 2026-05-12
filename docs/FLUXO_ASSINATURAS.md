# ✍️ Fluxo de Assinaturas Eletrônicas (Phase 4)

O ODIN permite que documentos gerados sejam enviados para assinatura digital de forma integrada através do provedor **Documenso**.

## 🚀 Como usar via API

Para iniciar um fluxo de assinatura, basta adicionar o campo `signers` ao seu payload de geração de documento.

### Exemplo de Requisição
`POST /api/v1/generate`

```json
{
  "modelId": "contrato-locacao-v2",
  "inputs": {
    "locador": "João Silva",
    "locatario": "Maria Souza",
    "valor": 2500
  },
  "format": "pdf",
  "signers": [
    {
      "name": "João Silva",
      "email": "joao@exemplo.com",
      "order": 1
    },
    {
      "name": "Maria Souza",
      "email": "maria@exemplo.com",
      "order": 2
    }
  ]
}
```

### Regras Importantes:
1. **Ordem de Assinatura:** Se você definir o campo `order`, os e-mails serão enviados sequencialmente. Caso contrário, todos receberão o convite simultaneamente.
2. **Status Inicial:** O documento será criado com o status `PENDING_SIGNATURE`.
3. **Download:** O PDF gerado será enviado automaticamente para o Documenso.

---

## 🔗 Webhooks de Status

Você pode acompanhar o progresso das assinaturas configurando um Webhook no seu dashboard. O ODIN enviará notificações para os seguintes eventos:

- `document.signed`: Disparado quando um signatário completa sua parte ou quando o documento final é totalmente assinado.

### Exemplo de Payload de Webhook:
```json
{
  "event": "document.signed",
  "data": {
    "generationId": "uuid-da-geracao",
    "status": "SIGNED",
    "signatureStatus": "COMPLETED"
  }
}
```

---

## 🛠️ Configuração do Ambiente

Para que o recurso funcione, o administrador do sistema deve configurar as seguintes variáveis no arquivo `.env`:

```env
DOCUMENSO_API_KEY=sua_chave_api_aqui
```

---

## 🖥️ Uso na Interface Web (Dashboard)

1. Acesse o **Wizard** de qualquer modelo.
2. No final do formulário de dados, utilize a seção **"Assinatura Eletrônica (Opcional)"**.
3. Clique em **"+ Adicionar Signatário"** e preencha o nome e e-mail.
4. Após clicar em **"Gerar Documento"**, você poderá acompanhar o status (ex: "SENT", "COMPLETED") diretamente na sua lista de **Atividade Recente** no Dashboard.
