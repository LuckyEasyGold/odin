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
  const [formData, setFormData] = useState<Record<string, any>>(
    model.fields.reduce((acc, f) => ({ ...acc, [f.key]: f.defaultValue || "" }), {})
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
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem" }}>
      <form onSubmit={handleSubmit} style={{ backgroundColor: "#f9fafb", padding: "1.5rem", borderRadius: "8px" }}>
        <h3>{model.name}</h3>
        {model.fields.map((field) => (
          <div key={field.key} style={{ marginBottom: "1rem" }}>
            <label style={{ display: "block", marginBottom: "0.25rem", fontWeight: "bold" }}>
              {field.label} {field.required && "*"}
            </label>
            {field.type === "textarea" ? (
              <textarea
                value={formData[field.key]}
                onChange={(e) => handleChange(field.key, e.target.value)}
                required={field.required}
                placeholder={field.placeholder}
                style={{ width: "100%", padding: "0.5rem", borderRadius: "4px", border: "1px solid #ccc" }}
                rows={4}
              />
            ) : (
              <input
                type={field.type === "currency" || field.type === "number" ? "number" : field.type}
                value={formData[field.key]}
                onChange={(e) => handleChange(field.key, e.target.value)}
                required={field.required}
                placeholder={field.placeholder}
                style={{ width: "100%", padding: "0.5rem", borderRadius: "4px", border: "1px solid #ccc" }}
              />
            )}
          </div>
        ))}
        <button
          type="submit"
          disabled={loading}
          style={{
            width: "100%",
            padding: "0.75rem",
            backgroundColor: "#2563eb",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: loading ? "not-allowed" : "pointer",
          }}
        >
          {loading ? t.wizard.loading : t.wizard.generate}
        </button>
      </form>

      <div style={{ border: "1px solid #eee", padding: "1.5rem", borderRadius: "8px", minHeight: "400px", position: "relative" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
          <h3 style={{ margin: 0 }}>{t.wizard.preview}</h3>
          {result?.generationId && (
            <button
              onClick={handleDownload}
              style={{
                padding: "0.5rem 1rem",
                backgroundColor: "#10b981",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                fontSize: "0.8rem"
              }}
            >
              {t.wizard.generate} (PDF)
            </button>
          )}
        </div>
        {result?.html && (
          <div 
            style={{ 
              backgroundColor: "white", 
              padding: "1rem", 
              border: "1px solid #ddd", 
              boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
              minHeight: "300px"
            }} 
            dangerouslySetInnerHTML={{ __html: result.html }} 
          />
        )}
        {result?.error && <p style={{ color: "red" }}>{result.error}</p>}
        {!result && !loading && (
          <p style={{ color: "#999", textAlign: "center", marginTop: "100px" }}>
            Preencha o formulário para visualizar o documento.
          </p>
        )}
        {loading && <p style={{ textAlign: "center", marginTop: "100px" }}>{t.wizard.loading}</p>}
      </div>
    </div>
  );
}
