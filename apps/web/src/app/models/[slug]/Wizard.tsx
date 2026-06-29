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
  const [signers, setSigners] = useState<{ name: string; email: string }[]>([]);
  const [result, setResult] = useState<{ html?: string; generationId?: string; signatureUrl?: string; error?: string } | null>(null);

  const handleChange = (key: string, value: any) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const addSigner = () => setSigners([...signers, { name: "", email: "" }]);
  const removeSigner = (index: number) => setSigners(signers.filter((_, i) => i !== index));
  const updateSigner = (index: number, key: 'name' | 'email', value: string) => {
    const newSigners = [...signers];
    newSigners[index][key] = value;
    setSigners(newSigners);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "";
      const response = await fetch(`${apiUrl}/api/v1/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          modelId: model.id,
          inputs: formData,
          format: "html",
          userId: session?.user?.id,
          signers: signers.filter(s => s.name && s.email)
        }),
      });

      if (!response.ok) throw new Error("Generation failed");

      const data = await response.json();
      setResult({ 
        html: data.html, 
        generationId: data.generationId,
        signatureUrl: data.signatureUrl
      });
    } catch (error) {
      setResult({ error: t.wizard.error });
    } finally {
      setLoading(false);
    }
  };

  // Try server-side PDF (works locally, may fallback to HTML on Vercel)
  const handleDownload = async () => {
    if (!result?.generationId) return;
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "";
    window.open(`${apiUrl}/api/v1/generations/${result.generationId}/download`, "_blank");
  };

  // Client-side PDF via browser print dialog ("Save as PDF")
  const handlePrintPDF = () => {
    if (!result?.html) return;
    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      alert("Pop-up bloqueado. Permita pop-ups para imprimir o documento.");
      return;
    }
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Documento ODIN</title>
        <style>
          @page { margin: 20mm; size: A4; }
          * { box-sizing: border-box; }
          body { 
            font-family: 'Times New Roman', Times, serif !important; 
            font-size: 12pt !important; 
            line-height: 1.6 !important; 
            color: #000 !important; 
            padding: 0 !important;
            margin: 0 !important;
            width: 100%;
          }
          @media print {
            body { padding: 0; margin: 0; }
          }
          img { max-width: 100%; height: auto; }
          table { width: 100%; border-collapse: collapse; }
          td, th { border: 1px solid #000; padding: 8px; }
          p { margin: 0 0 10pt 0; }
    </style>
  </head>
  <body>
    ${result.html}
    <script>
      window.onload = function() { window.print(); };
    <\/script>
  </body>
  </html>
    `);
    printWindow.document.close();
  };

  // Download HTML as a file (always works)
  const handleDownloadHTML = () => {
    if (!result?.html) return;
    const blob = new Blob([result.html], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `documento-odin.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
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

          <div style={{ marginTop: "2.5rem", borderTop: "1px solid var(--card-border)", paddingTop: "1.5rem" }}>
            <h4 style={{ marginBottom: "1rem", fontSize: "0.95rem", color: "var(--foreground)", display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <span>✍️</span> Assinatura Eletrônica (Opcional)
            </h4>
            
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {signers.map((signer, index) => (
                <div key={index} style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                  <input
                    placeholder="Nome"
                    value={signer.name}
                    onChange={(e) => updateSigner(index, "name", e.target.value)}
                    style={{ 
                      flex: 1, 
                      padding: "0.6rem", 
                      borderRadius: "8px", 
                      border: "1px solid var(--card-border)",
                      fontSize: "0.85rem",
                      backgroundColor: "var(--background)",
                      color: "var(--foreground)"
                    }}
                  />
                  <input
                    placeholder="E-mail"
                    type="email"
                    value={signer.email}
                    onChange={(e) => updateSigner(index, "email", e.target.value)}
                    style={{ 
                      flex: 1, 
                      padding: "0.6rem", 
                      borderRadius: "8px", 
                      border: "1px solid var(--card-border)",
                      fontSize: "0.85rem",
                      backgroundColor: "var(--background)",
                      color: "var(--foreground)"
                    }}
                  />
                  <button 
                    type="button" 
                    onClick={() => removeSigner(index)}
                    style={{ 
                      background: "none", 
                      border: "none", 
                      color: "#ef4444", 
                      cursor: "pointer",
                      fontSize: "1.2rem",
                      padding: "0 0.5rem"
                    }}
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>

            {result?.signatureUrl && (
              <div style={{ 
                marginTop: '1.5rem',
                marginBottom: '1.5rem', 
                padding: '1.25rem', 
                background: 'rgba(59, 130, 246, 0.1)', 
                borderRadius: '12px', 
                border: '1px solid rgba(59, 130, 246, 0.2)',
                textAlign: 'left'
              }}>
                <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.85rem', fontWeight: 600, color: '#3b82f6' }}>🔗 Link de Assinatura Nativa</p>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <input 
                    readOnly 
                    value={result.signatureUrl} 
                    style={{ flex: 1, padding: '0.4rem', borderRadius: '6px', border: '1px solid var(--card-border)', fontSize: '0.75rem', background: 'var(--background)', color: 'var(--foreground)' }} 
                  />
                  <button 
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(result.signatureUrl || "");
                      alert("Link copiado!");
                    }}
                    style={{ padding: '0.4rem 0.8rem', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '6px', fontSize: '0.75rem', cursor: 'pointer' }}
                  >
                    Copiar
                  </button>
                </div>
              </div>
            )}

            <button
              type="button"
              onClick={addSigner}
              style={{
                background: "none",
                border: "1px dashed var(--card-border)",
                color: "#2563eb",
                padding: "0.75rem",
                borderRadius: "8px",
                marginTop: "1rem",
                width: "100%",
                cursor: "pointer",
                fontSize: "0.85rem",
                fontWeight: "500"
              }}
            >
              + Adicionar Signatário
            </button>
            <p style={{ fontSize: "0.75rem", color: "var(--muted)", marginTop: "0.5rem" }}>
              Os signatários receberão um e-mail para assinar o documento digitalmente via ODIN SIGN.
            </p>
          </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%",
                padding: "1.25rem",
                backgroundColor: "#2563eb",
                color: "white",
                border: "none",
                borderRadius: "16px",
                fontSize: "1.1rem",
                fontWeight: "bold",
                cursor: loading ? "not-allowed" : "pointer",
                boxShadow: "0 10px 15px -3px rgba(37, 99, 235, 0.3)",
                transition: "all 0.2s ease",
                marginTop: "2rem"
              }}
            >
              {loading ? "Processando..." : (Number((model as any).price) > 0 ? `🚀 Gerar por R$ ${Number((model as any).price).toFixed(2)}` : "🚀 Gerar Documento")}
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
          {result?.html && (
            <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
              <button
                onClick={handlePrintPDF}
                style={{
                  padding: "0.6rem 1rem",
                  backgroundColor: "#2563eb",
                  color: "white",
                  border: "none",
                  borderRadius: "10px",
                  cursor: "pointer",
                  fontWeight: "bold",
                  fontSize: "0.8rem",
                  whiteSpace: "nowrap"
                }}
              >
                🖨️ PDF (Navegador)
              </button>
              {result?.generationId && (
                <button
                  onClick={handleDownload}
                  style={{
                    padding: "0.6rem 1rem",
                    backgroundColor: "#10b981",
                    color: "white",
                    border: "none",
                    borderRadius: "10px",
                    cursor: "pointer",
                    fontWeight: "bold",
                    fontSize: "0.8rem",
                    whiteSpace: "nowrap"
                  }}
                >
                  ⬇️ Download
                </button>
              )}
              <button
                onClick={handleDownloadHTML}
                style={{
                  padding: "0.6rem 1rem",
                  backgroundColor: "transparent",
                  color: "var(--muted)",
                  border: "1px solid var(--card-border)",
                  borderRadius: "10px",
                  cursor: "pointer",
                  fontWeight: "bold",
                  fontSize: "0.8rem",
                  whiteSpace: "nowrap"
                }}
              >
                HTML
              </button>
            </div>
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
