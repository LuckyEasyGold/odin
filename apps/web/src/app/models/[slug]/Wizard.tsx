"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { getTranslation } from "@/locales";

interface Field {
  key: string;
  type: string;
  label: string;
  required: boolean;
  placeholder?: string;
  defaultValue?: any;
}

interface Model {
  id: string;
  name: string;
  template: string;
  fields: Field[];
}

export default function Wizard({ model }: { model: Model }) {
  const t = getTranslation("pt");
  const { data: session } = useSession();

  // Automatic variable detection if fields is empty
  const fields = (() => {
    if (Array.isArray(model.fields) && model.fields.length > 0) return model.fields;
    
    // Extract variables from template using regex: {{variableName}}
    const matches = model.template.match(/{{([^{}]+)}}/g) || [];
    const uniqueVars = Array.from(new Set(matches.map(m => m.replace(/{{|}}/g, ""))));
    
    return uniqueVars.map(v => ({
      key: v,
      label: v.charAt(0).toUpperCase() + v.slice(1).replace(/_/g, " "),
      type: "text",
      required: true,
      placeholder: "",
      defaultValue: ""
    })) as Field[];
  })();

  const [formData, setFormData] = useState<Record<string, any>>(
    fields.reduce((acc, f) => ({ ...acc, [f.key]: f.defaultValue || "" }), {})
  );
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ html?: string; generationId?: string; error?: string } | null>(null);

  const handleChange = (key: string, value: any) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    try {
      const response = await fetch("http://localhost:3001/api/v1/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          modelId: model.id,
          inputs: formData,
          format: "html",
          userId: session?.user?.id,
        }),
      });

      if (!response.ok) throw new Error("Generation failed");

      const data = await response.json();
      setResult({ html: data.html, generationId: data.generationId });
    } catch (error) {
      setResult({ error: t.wizard.error });
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    if (!result?.generationId) return;
    window.open(`http://localhost:3001/api/v1/generations/${result.generationId}/download`, "_blank");
  };

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "2rem" }}>
      <form onSubmit={handleSubmit} style={{ 
        backgroundColor: "var(--card-bg)", 
        padding: "2rem", 
        borderRadius: "24px",
        border: "1px solid var(--card-border)",
        boxShadow: "0 4px 6px var(--shadow)"
      }}>
        <h3 style={{ color: "var(--foreground)", marginBottom: "1.5rem" }}>{model.name}</h3>
        {fields.map((field) => (
          <div key={field.key} style={{ marginBottom: "1.25rem" }}>
            <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "bold", fontSize: "0.85rem", color: "var(--muted)" }}>
              {field.label} {field.required && "*"}
            </label>
            {field.type === "textarea" ? (
              <textarea
                value={formData[field.key]}
                onChange={(e) => handleChange(field.key, e.target.value)}
                required={field.required}
                placeholder={field.placeholder}
                style={{ 
                  width: "100%", 
                  padding: "0.75rem", 
                  borderRadius: "12px", 
                  border: "1px solid var(--card-border)",
                  backgroundColor: "var(--background)",
                  color: "var(--foreground)",
                  fontSize: "1rem"
                }}
                rows={4}
              />
            ) : (
              <input
                type={field.type === "currency" || field.type === "number" ? "number" : field.type}
                value={formData[field.key]}
                onChange={(e) => handleChange(field.key, e.target.value)}
                required={field.required}
                placeholder={field.placeholder}
                style={{ 
                  width: "100%", 
                  padding: "0.75rem", 
                  borderRadius: "12px", 
                  border: "1px solid var(--card-border)",
                  backgroundColor: "var(--background)",
                  color: "var(--foreground)",
                  fontSize: "1rem"
                }}
              />
            )}
          </div>
        ))}
        <button
          type="submit"
          disabled={loading}
          style={{
            width: "100%",
            padding: "1rem",
            backgroundColor: "var(--primary)",
            color: "white",
            border: "none",
            borderRadius: "12px",
            fontWeight: "bold",
            fontSize: "1rem",
            cursor: loading ? "not-allowed" : "pointer",
            marginTop: "1rem"
          }}
        >
          {loading ? t.wizard.loading : t.wizard.generate}
        </button>
      </form>

      <div style={{ 
        backgroundColor: "var(--card-bg)", 
        border: "1px solid var(--card-border)", 
        padding: "2rem", 
        borderRadius: "24px", 
        minHeight: "400px", 
        position: "relative",
        boxShadow: "0 4px 6px var(--shadow)"
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
          <h3 style={{ margin: 0, color: "var(--foreground)" }}>{t.wizard.preview}</h3>
          {result?.generationId && (
            <button
              onClick={handleDownload}
              style={{
                padding: "0.6rem 1.25rem",
                backgroundColor: "#10b981",
                color: "white",
                border: "none",
                borderRadius: "10px",
                cursor: "pointer",
                fontWeight: "bold",
                fontSize: "0.85rem"
              }}
            >
              Baixar (PDF)
            </button>
          )}
        </div>
        
        {result?.html ? (
          <div 
            style={{ 
              backgroundColor: "white", 
              color: "black", // Preview always white paper
              padding: "2rem", 
              borderRadius: "8px",
              border: "1px solid #ddd", 
              boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
              minHeight: "400px"
            }} 
            dangerouslySetInnerHTML={{ __html: result.html }} 
          />
        ) : (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "300px", color: "var(--muted)" }}>
            <span style={{ fontSize: "3rem", marginBottom: "1rem" }}>📄</span>
            <p style={{ textAlign: "center" }}>
              {loading ? t.wizard.loading : "Preencha o formulário para visualizar o documento."}
            </p>
          </div>
        )}
        
        {result?.error && <p style={{ color: "#ef4444", marginTop: "1rem" }}>{result.error}</p>}
      </div>
    </div>
  );
}
