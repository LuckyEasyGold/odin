"use client"

import { useState } from "react";
import { createModel } from "@/app/actions/models";
import Link from "next/link";

export default function ModelEditor({ categories, existingModels }: { categories: any[], existingModels: any[] }) {
  const [selectedModelId, setSelectedModelId] = useState("");
  const [showCustomCategory, setShowCustomCategory] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    template: ""
  });

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
          <label style={{ fontWeight: "bold", color: "#475569" }}>Corpo do Documento (Template)</label>
          <textarea 
            name="template" 
            value={formData.template}
            onChange={(e) => setFormData({...formData, template: e.target.value})}
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
