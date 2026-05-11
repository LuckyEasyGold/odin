"use client"

import { useState } from "react";
import { updateModel } from "@/app/actions/models";

export default function ModelForm({ model, categories, id }: { model: any, categories: any[], id: string }) {
  const [showCustomCategory, setShowCustomCategory] = useState(false);
  const [formData, setFormData] = useState({
    name: model.name,
    description: model.description || "",
    category: model.categoryId || "",
    template: model.template
  });

  const updateWithId = updateModel.bind(null, id);

  return (
    <form action={updateWithId} style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          <label style={{ fontWeight: "bold", color: "var(--muted)", fontSize: "0.85rem" }}>Nome do Modelo</label>
          <input 
            name="name" 
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            required 
            style={{ padding: "0.75rem", borderRadius: "12px", border: "1px solid var(--card-border)", backgroundColor: "var(--card-bg)", color: "var(--foreground)" }}
          />
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          <label style={{ fontWeight: "bold", color: "var(--muted)", fontSize: "0.85rem" }}>Categoria</label>
          <select 
            name="category" 
            value={formData.category}
            onChange={(e) => {
              const val = e.target.value;
              setFormData({...formData, category: val});
              setShowCustomCategory(val === "custom");
            }}
            style={{ padding: "0.75rem", borderRadius: "12px", border: "1px solid var(--card-border)", backgroundColor: "var(--card-bg)", color: "var(--foreground)" }}
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
            <option value="custom" style={{ fontWeight: "bold", color: "var(--primary)" }}>+ Criar Nova Categoria</option>
          </select>
        </div>
      </div>

      {showCustomCategory && (
        <div style={{ padding: "1.5rem", backgroundColor: "var(--card-bg)", borderRadius: "12px", border: "1px dashed var(--primary)" }}>
          <h4 style={{ margin: "0 0 1rem 0", color: "var(--foreground)" }}>Nova Categoria</h4>
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <input name="newCategoryName" placeholder="Nome da Categoria" style={{ padding: "0.75rem", borderRadius: "8px", border: "1px solid var(--card-border)", backgroundColor: "var(--background)", color: "var(--foreground)" }} />
            <textarea name="newCategoryDesc" placeholder="Descrição..." style={{ padding: "0.75rem", borderRadius: "8px", border: "1px solid var(--card-border)", backgroundColor: "var(--background)", color: "var(--foreground)" }} />
          </div>
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
        <label style={{ fontWeight: "bold", color: "var(--muted)", fontSize: "0.85rem" }}>Descrição Curta</label>
        <input 
          name="description" 
          value={formData.description}
          onChange={(e) => setFormData({...formData, description: e.target.value})}
          required 
          style={{ padding: "0.75rem", borderRadius: "12px", border: "1px solid var(--card-border)", backgroundColor: "var(--card-bg)", color: "var(--foreground)" }}
        />
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
        <label style={{ fontWeight: "bold", color: "var(--muted)", fontSize: "0.85rem" }}>Corpo do Documento (Template)</label>
        <textarea 
          name="template" 
          value={formData.template}
          onChange={(e) => setFormData({...formData, template: e.target.value})}
          required 
          rows={15}
          style={{ 
            padding: "1rem", 
            borderRadius: "12px", 
            border: "2px solid var(--card-border)", 
            backgroundColor: "var(--card-bg)",
            color: "var(--foreground)",
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
        backgroundColor: "var(--card-bg)", 
        borderRadius: "12px",
        border: "1px solid var(--card-border)"
      }}>
        <input 
          type="checkbox" 
          name="isPublic" 
          id="isPublic" 
          defaultChecked={model.isPublic} 
          style={{ width: "20px", height: "20px" }} 
        />
        <label htmlFor="isPublic" style={{ cursor: "pointer" }}>
          <strong style={{ display: "block", color: "var(--foreground)" }}>Modelo Público</strong>
          <span style={{ fontSize: "0.875rem", color: "var(--muted)" }}>Permitir que outros vejam e façam Fork deste modelo.</span>
        </label>
      </div>

      <button type="submit" style={{ 
        padding: "1rem", 
        backgroundColor: "var(--primary)", 
        color: "white", 
        border: "none", 
        borderRadius: "12px", 
        fontWeight: "bold", 
        fontSize: "1.1rem",
        cursor: "pointer",
        boxShadow: "0 10px 15px -3px var(--shadow)"
      }}>
        💾 Salvar Alterações
      </button>
    </form>
  );
}
