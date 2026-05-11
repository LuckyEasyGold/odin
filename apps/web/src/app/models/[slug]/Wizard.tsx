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
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))", gap: "2.5rem", color: "var(--foreground)" }}>
      {/* Form Side */}
      <div>
        {/* @ts-ignore */}
        {model.guidance && (
          <div style={{ 
            marginBottom: "2rem", 
            padding: "1.5rem", 
            backgroundColor: "rgba(59, 130, 246, 0.05)", 
            borderRadius: "16px", 
            border: "1px solid rgba(59, 130, 246, 0.2)",
            display: "flex",
            gap: "1rem",
            alignItems: "flex-start"
          }}>
            <span style={{ fontSize: "1.5rem" }}>💡</span>
            <div>
              <h4 style={{ margin: "0 0 0.5rem 0", color: "var(--primary)" }}>Dicas do Especialista</h4>
              <p style={{ margin: 0, fontSize: "0.9rem", color: "var(--muted)", lineHeight: "1.6" }}>
                {/* @ts-ignore */}
                {model.guidance}
              </p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ 
          backgroundColor: "var(--card-bg)", 
          padding: "2rem", 
          borderRadius: "24px", 
          boxShadow: "0 4px 6px var(--shadow)",
          border: "1px solid var(--card-border)"
        }}>
          <h3 style={{ marginBottom: "1.5rem", color: "var(--foreground)" }}>{model.name}</h3>
          
          <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            {fields.map((field) => (
              <div key={field.key} style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                <label style={{ fontWeight: "bold", fontSize: "0.85rem", color: "var(--muted)" }}>
                  {field.label} {field.required && <span style={{ color: "#ef4444" }}>*</span>}
                </label>
                {field.type === "textarea" ? (
                  <textarea
                    value={formData[field.key] || ""}
                    onChange={(e) => handleChange(field.key, e.target.value)}
                    required={field.required}
                    /* @ts-ignore */
                    placeholder={model.variableHints?.[field.key] || field.placeholder || `Preencha o ${field.label.toLowerCase()}...`}
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
                    type={field.type}
                    value={formData[field.key] || ""}
                    onChange={(e) => handleChange(field.key, e.target.value)}
                    required={field.required}
                    /* @ts-ignore */
                    placeholder={model.variableHints?.[field.key] || field.placeholder || `Preencha o ${field.label.toLowerCase()}...`}
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
          </div>

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
              marginTop: "2rem",
              boxShadow: "0 4px 10px var(--shadow)"
            }}
          >
            {loading ? t.wizard.loading : t.wizard.generate}
          </button>
        </form>
      </div>

      {/* Preview Side */}
      <div style={{ 
        backgroundColor: "var(--card-bg)", 
        border: "1px solid var(--card-border)", 
        padding: "2rem", 
        borderRadius: "24px", 
        minHeight: "500px", 
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
              color: "black",
              padding: "3rem", 
              borderRadius: "8px",
              border: "1px solid #ddd", 
              boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
              minHeight: "600px"
            }} 
            dangerouslySetInnerHTML={{ __html: result.html }} 
          />
        ) : (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "400px", color: "var(--muted)" }}>
            <span style={{ fontSize: "4rem", marginBottom: "1.5rem" }}>📄</span>
            <p style={{ textAlign: "center", maxWidth: "250px" }}>
              {loading ? t.wizard.loading : "Preencha o formulário para visualizar o documento em tempo real."}
            </p>
          </div>
        )}
        
        {result?.error && <p style={{ color: "#ef4444", marginTop: "1rem" }}>{result.error}</p>}
      </div>
    </div>
  );
}
