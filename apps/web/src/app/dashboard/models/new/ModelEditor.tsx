"use client"

import { useState, useMemo } from "react";
import { createModel } from "@/app/actions/models";
import Link from "next/link";
import { analyzeModelCompliance } from "@/lib/legalLinter";

export default function ModelEditor({ categories, existingModels }: { categories: any[], existingModels: any[] }) {
  const [selectedModelId, setSelectedModelId] = useState("");
  const [showCustomCategory, setShowCustomCategory] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    template: "",
    guidance: ""
  });

  const compliance = useMemo(() => analyzeModelCompliance(formData.template), [formData.template]);

  const handleImport = (id: string) => {
    const model = existingModels.find(m => m.id === id);
    if (model) {
      setFormData({
        name: `${model.name} (Cópia)`,
        description: model.description || "",
        category: model.categoryId || "",
        template: model.template
      });
      setSelectedModelId(id);
    }
  };

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto" }}>
      <header style={{ marginBottom: "2rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h1 style={{ fontSize: "1.875rem", fontWeight: "bold", color: "#1e293b" }}>✨ Criar Novo Modelo</h1>
          <p style={{ color: "#64748b" }}>Baseie-se em modelos existentes ou crie do zero.</p>
        </div>
        <div style={{ display: "flex", gap: "1rem" }}>
          <button 
            type="button"
            onClick={() => alert("DICA: Use {{variavel}} no texto para criar campos dinâmicos!")}
            style={{ padding: "0.5rem 1rem", border: "1px solid #e2e8f0", borderRadius: "8px", cursor: "pointer" }}
          >
            ❓ Ajuda
          </button>
          <Link href="/dashboard" style={{ color: "#64748b", textDecoration: "none", alignSelf: "center" }}>Cancelar</Link>
        </div>
      </header>

      {/* Seletor de Importação */}
      <div style={{ marginBottom: "2rem", padding: "1.5rem", backgroundColor: "#eff6ff", borderRadius: "16px", border: "1px solid #bfdbfe" }}>
        <label style={{ fontWeight: "bold", color: "#1e40af", display: "block", marginBottom: "0.5rem" }}>
          📥 Importar de um modelo existente?
        </label>
        <select 
          value={selectedModelId} 
          onChange={(e) => handleImport(e.target.value)}
          style={{ width: "100%", padding: "0.75rem", borderRadius: "8px", border: "1px solid #3b82f6" }}
        >
          <option value="">-- Começar do Zero --</option>
          {existingModels.map(m => (
            <option key={m.id} value={m.id}>{m.name} ({m.category?.name || "Sem Categoria"})</option>
          ))}
        </select>
      </div>

      <form action={createModel} style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            <label style={{ fontWeight: "bold", color: "#475569" }}>Nome do Modelo</label>
            <input 
              name="name" 
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              required 
              style={{ padding: "0.75rem", borderRadius: "8px", border: "1px solid #e2e8f0" }}
            />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            <label style={{ fontWeight: "bold", color: "#475569" }}>Categoria / Subcategoria</label>
            <select 
              name="category" 
              value={formData.category}
              onChange={(e) => {
                const val = e.target.value;
                setFormData({...formData, category: val});
                setShowCustomCategory(val === "custom");
              }}
              style={{ padding: "0.75rem", borderRadius: "8px", border: "1px solid #e2e8f0" }}
            >
              <option value="">Selecione...</option>
              {categories.map(c => (
                <optgroup key={c.id} label={c.name}>
                  <option value={c.id}>{c.name} (Principal)</option>
                  {c.children?.map((sub: any) => (
                    <option key={sub.id} value={sub.id}>-- {sub.name}</option>
                  ))}
                </optgroup>
              ))}
              <option value="custom" style={{ fontWeight: "bold", color: "#2563eb" }}>+ Criar Nova Categoria</option>
            </select>
          </div>
        </div>

        {showCustomCategory && (
          <div style={{ padding: "1.5rem", backgroundColor: "#f1f5f9", borderRadius: "12px", border: "1px dashed #cbd5e1" }}>
            <h4 style={{ margin: "0 0 1rem 0", color: "#1e293b" }}>Nova Categoria</h4>
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <input name="newCategoryName" placeholder="Nome da Categoria (Ex: Engenharia Civil)" style={{ padding: "0.75rem", borderRadius: "8px", border: "1px solid #e2e8f0" }} />
              <textarea name="newCategoryDesc" placeholder="Descrição da categoria..." style={{ padding: "0.75rem", borderRadius: "8px", border: "1px solid #e2e8f0" }} />
            </div>
          </div>
        )}

        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          <label style={{ fontWeight: "bold", color: "#475569" }}>Descrição Curta</label>
          <input 
            name="description" 
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            required 
            style={{ padding: "0.75rem", borderRadius: "8px", border: "1px solid #e2e8f0" }}
          />
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          <label style={{ fontWeight: "bold", color: "#475569" }}>Dicas e Orientação do Especialista</label>
          <textarea 
            name="guidance" 
            value={formData.guidance}
            onChange={(e) => setFormData({...formData, guidance: e.target.value})}
            placeholder="Explique para que serve este documento e dê dicas de preenchimento para o usuário..."
            rows={3}
            style={{ padding: "0.75rem", borderRadius: "8px", border: "1px solid #e2e8f0" }}
          />
        </div>

        {compliance.score > 0 && (
          <div style={{ padding: "1.5rem", backgroundColor: "rgba(59, 130, 246, 0.05)", borderRadius: "16px", border: "1px solid rgba(59, 130, 246, 0.2)" }}>
            <h4 style={{ margin: "0 0 1rem 0", color: "#1e40af" }}>✍️ Exemplos de Preenchimento (Placeholders)</h4>
            <p style={{ fontSize: "0.8rem", color: "#1e40af", marginBottom: "1rem" }}>Defina o texto que aparecerá dentro de cada campo para guiar o usuário.</p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              {compliance.foundClauses.map(clause => (
                <div key={clause} style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
                  <label style={{ fontSize: "0.75rem", fontWeight: "bold", color: "#1e40af" }}>Exemplo para {clause}:</label>
                  <input 
                    name={`hint_${clause.toLowerCase().replace(/ /g, "_")}`}
                    placeholder={`Ex: Informação de ${clause}...`}
                    style={{ padding: "0.5rem", borderRadius: "6px", border: "1px solid rgba(59, 130, 246, 0.3)" }}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <label style={{ fontWeight: "bold", color: "#475569" }}>Corpo do Documento (Template)</label>
            <div style={{ 
              fontSize: "0.75rem", 
              padding: "0.25rem 0.75rem", 
              borderRadius: "9999px", 
              backgroundColor: compliance.score > 70 ? "#dcfce7" : "#fef9c3",
              color: compliance.score > 70 ? "#166534" : "#854d0e",
              fontWeight: "bold"
            }}>
              ⚖️ Saúde Jurídica: {compliance.score}%
            </div>
          </div>
          
          <div style={{ display: "grid", gridTemplateColumns: "1fr 280px", gap: "1.5rem" }}>
            <textarea 
              name="template" 
              value={formData.template}
              onChange={(e) => setFormData({...formData, template: e.target.value})}
              required 
              rows={20}
              style={{ 
                padding: "1rem", 
                borderRadius: "12px", 
                border: "2px solid #e2e8f0", 
                fontFamily: "monospace",
                fontSize: "1rem",
                lineHeight: "1.5",
                backgroundColor: "var(--background)",
                color: "var(--foreground)"
              }}
            />
            
            <div style={{ 
              padding: "1.25rem", 
              backgroundColor: "var(--card-bg)", 
              borderRadius: "16px", 
              border: "1px solid var(--card-border)",
              fontSize: "0.85rem"
            }}>
              <h4 style={{ margin: "0 0 1rem 0", color: "var(--foreground)" }}>Checklist Jurídico</h4>
              <ul style={{ listLines: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                {["Objeto", "Preço e Pagamento", "Prazo", "Rescisão", "Obrigações", "Foro"].map(clause => {
                  const isPresent = compliance.foundClauses.includes(clause);
                  return (
                    <li key={clause} style={{ 
                      display: "flex", 
                      alignItems: "center", 
                      gap: "0.5rem",
                      color: isPresent ? "#10b981" : "var(--muted)",
                      fontWeight: isPresent ? "bold" : "normal"
                    }}>
                      {isPresent ? "✅" : "⭕"} {clause}
                    </li>
                  );
                })}
              </ul>
              {compliance.missingClauses.length > 0 && (
                <div style={{ marginTop: "1.5rem", padding: "0.75rem", backgroundColor: "rgba(245, 158, 11, 0.1)", borderRadius: "8px", color: "#d97706", fontSize: "0.75rem" }}>
                  <strong>Dica:</strong> Adicione as cláusulas marcadas com ⭕ para aumentar sua pontuação de conformidade.
                </div>
              )}
            </div>
          </div>
        </div>

        <div style={{ 
          display: "flex", 
          alignItems: "center", 
          gap: "1rem", 
          padding: "1rem", 
          backgroundColor: "#f8fafc", 
          borderRadius: "12px",
          border: "1px solid #e2e8f0"
        }}>
          <input type="checkbox" name="isPublic" id="isPublic" defaultChecked style={{ width: "20px", height: "20px" }} />
          <label htmlFor="isPublic">
            <strong style={{ display: "block" }}>Tornar este modelo Público</strong>
            <span style={{ fontSize: "0.875rem", color: "#64748b" }}>Permitir que outros vejam e façam Fork deste modelo.</span>
          </label>
        </div>

        <button type="submit" style={{ 
          padding: "1rem", 
          backgroundColor: "#10b981", 
          color: "white", 
          border: "none", 
          borderRadius: "12px", 
          fontWeight: "bold", 
          fontSize: "1.1rem",
          cursor: "pointer"
        }}>
          🚀 Publicar Modelo
        </button>
      </form>
    </div>
  );
}
