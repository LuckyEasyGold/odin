"use client"

import { createModel } from "@/app/actions/models";
import Link from "next/link";

export default function NewModelPage() {
  return (
    <div style={{ maxWidth: "800px", margin: "0 auto" }}>
      <header style={{ marginBottom: "2rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h1 style={{ fontSize: "1.875rem", fontWeight: "bold", color: "#1e293b" }}>✨ Criar Novo Modelo</h1>
          <p style={{ color: "#64748b" }}>Contribua com a biblioteca e ajude a automatizar o mundo.</p>
        </div>
        <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
          <button 
            type="button"
            onClick={() => alert("COMO CRIAR SEU DOCUMENTO:\n\n1. Escreva o texto normal.\n2. Onde quiser um campo variável, use {{nome_do_campo}}.\n\nExemplo:\n'Eu, {{nome}}, portador do CPF {{cpf}}, recebi o valor de {{valor}}.'\n\nIsso criará automaticamente campos para Nome, CPF e Valor na hora de gerar o documento!")}
            style={{ 
              padding: "0.5rem 1rem", 
              backgroundColor: "#f1f5f9", 
              border: "1px solid #e2e8f0", 
              borderRadius: "8px", 
              cursor: "pointer",
              fontSize: "0.875rem",
              fontWeight: "600"
            }}
          >
            ❓ Ajuda e Exemplos
          </button>
          <Link href="/dashboard" style={{ color: "#64748b", textDecoration: "none", fontSize: "0.875rem" }}>Cancelar</Link>
        </div>
      </header>

      <form action={createModel} style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            <label style={{ fontWeight: "bold", color: "#475569" }}>Nome do Modelo</label>
            <input 
              name="name" 
              placeholder="Ex: Recibo de Pagamento Simples" 
              required 
              style={{ padding: "0.75rem", borderRadius: "8px", border: "1px solid #e2e8f0" }}
            />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            <label style={{ fontWeight: "bold", color: "#475569" }}>Categoria</label>
            <select name="category" style={{ padding: "0.75rem", borderRadius: "8px", border: "1px solid #e2e8f0" }}>
              <option value="Jurídico">Jurídico</option>
              <option value="Comercial">Comercial</option>
              <option value="RH">Recursos Humanos</option>
              <option value="Pessoal">Pessoal</option>
              <option value="Outros">Outros</option>
            </select>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          <label style={{ fontWeight: "bold", color: "#475569" }}>Descrição Curta</label>
          <input 
            name="description" 
            placeholder="Ex: Modelo para recibos rápidos de serviços prestados." 
            required 
            style={{ padding: "0.75rem", borderRadius: "8px", border: "1px solid #e2e8f0" }}
          />
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          <label style={{ fontWeight: "bold", color: "#475569" }}>Corpo do Documento (Template)</label>
          <textarea 
            name="template" 
            placeholder={`DECLARAÇÃO DE RECEBIMENTO

Eu, {{nome_completo}}, recebi de {{nome_pagador}} a importância de {{valor_reais}} referente a {{descricao_servico}}.

Data: {{data_hoje}}
Assinatura: __________________________`} 
            required 
            rows={15}
            style={{ 
              padding: "1rem", 
              borderRadius: "12px", 
              border: "2px solid #e2e8f0", 
              fontFamily: "monospace",
              fontSize: "1rem",
              lineHeight: "1.5"
            }}
          />
        </div>

        <button type="submit" style={{ 
          padding: "1rem", 
          backgroundColor: "#10b981", 
          color: "white", 
          border: "none", 
          borderRadius: "12px", 
          fontWeight: "bold", 
          fontSize: "1.1rem",
          cursor: "pointer",
          boxShadow: "0 4px 6px -1px rgba(16, 185, 129, 0.3)"
        }}>
          🚀 Publicar Modelo
        </button>
      </form>
    </div>
  );
}
