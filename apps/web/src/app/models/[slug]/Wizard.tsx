"use client";

import { useState, useMemo, useEffect, useRef, useCallback } from "react";
import { useSession } from "next-auth/react";
import { getTranslation } from "@/locales";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface Variable {
  key: string;
  type: string;
  label: string;
  required: boolean;
}

interface Model {
  id: string;
  name: string;
  template: string;
  fields: any[];
  guidance?: string;
  variableHints?: Record<string, string>;
  price?: number;
}

/* ------------------------------------------------------------------ */
/*  HTML escaping helper                                               */
/* ------------------------------------------------------------------ */

function esc(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

/* ------------------------------------------------------------------ */
/*  CSS (defined as a string so it can be injected once)               */
/* ------------------------------------------------------------------ */

const INLINE_FIELD_CLASS = "odin-inline-field";

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function Wizard({ model }: { model: Model }) {
  const t = getTranslation("pt");
  const { data: session } = useSession();
  const previewRef = useRef<HTMLDivElement>(null);

  /* ---- extract variables ---- */
  const variables: Variable[] = useMemo(() => {
    if (Array.isArray(model.fields) && model.fields.length > 0) {
      return (model.fields as any[]).map((f) => ({
        key: f.key,
        type: f.type || "text",
        label: f.label || f.key,
        required: f.required ?? true,
      }));
    }

    const regex = /{{(?!\/|else\b|#)([^{}]+)}}/g;
    const seen = new Map<string, string>();
    let m: RegExpExecArray | null;
    while ((m = regex.exec(model.template)) !== null) {
      const inner = m[1].trim();
      const parts = inner.split(/\s+/);
      if (parts.length >= 2) {
        // typed – {{texto name}}
        const t = parts[0];
        const name = parts.slice(1).join("_");
        if (!seen.has(name)) seen.set(name, t);
      } else {
        if (!seen.has(parts[0])) seen.set(parts[0], "texto");
      }
    }

    return Array.from(seen.entries()).map(([key, type]) => ({
      key,
      type:
        type === "numero"
          ? "number"
          : type === "moeda"
            ? "currency"
            : type === "data"
              ? "date"
              : "text",
      label:
        key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, " "),
      required: true,
    }));
  }, [model.template, model.fields]);

  /* ---- state ---- */
  const [formData, setFormData] = useState<Record<string, any>>(() =>
    variables.reduce((acc, v) => ({ ...acc, [v.key]: "" }), {}),
  );
  const [loading, setLoading] = useState(false);
  const [signers, setSigners] = useState<{ name: string; email: string }[]>(
    [],
  );
  const [result, setResult] = useState<{
    html?: string;
    generationId?: string;
    signatureUrl?: string;
    error?: string;
  } | null>(null);

  const handleChange = useCallback((key: string, value: any) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  }, []);

  const addSigner = () =>
    setSigners((s) => [...s, { name: "", email: "" }]);
  const removeSigner = (i: number) =>
    setSigners((s) => s.filter((_, idx) => idx !== i));
  const updateSigner = (i: number, k: "name" | "email", v: string) =>
    setSigners((s) => {
      const next = [...s];
      next[i] = { ...next[i], [k]: v };
      return next;
    });

  /* ---- fill default values from hints on first render ---- */
  const initialised = useRef(false);
  useEffect(() => {
    if (initialised.current) return;
    initialised.current = true;
    const hints = (model as any).variableHints;
    if (hints) {
      setFormData((prev) => {
        const next = { ...prev };
        let changed = false;
        for (const v of variables) {
          if (hints[v.key] && !next[v.key]) {
            next[v.key] = hints[v.key];
            changed = true;
          }
        }
        return changed ? next : prev;
      });
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  /* ---- render template with inline fields (stable ref, computed once) ---- */
  const templateRef = useRef<string | null>(null);
  if (!templateRef.current && !result?.html) {
    const regex = /{{(?!\/|else\b|#)([^{}]+)}}/g;
    const inputType = (type: string) => {
      if (type === "number" || type === "currency") return "number";
      if (type === "date") return "date";
      return "text";
    };
    const varTypeMap = new Map(variables.map((v) => [v.key, v.type]));

    templateRef.current = model.template.replace(regex, (_match, expr) => {
      const parts = expr.trim().split(/\s+/);
      const varName = parts[parts.length - 1];
      const type = varTypeMap.get(varName) || "text";
      const hint =
        ((model as any).variableHints?.[varName] as string) || "";

      return `<input
        type="${inputType(type)}"
        placeholder="${esc(hint || varName)}"
        data-var="${esc(varName)}"
        class="${INLINE_FIELD_CLASS}"
        autocomplete="off" />`;
    });
  }

  /* ---- sync formData values to input elements in DOM ---- */
  useEffect(() => {
    const el = previewRef.current;
    if (!el || result?.html) return;
    for (const v of variables) {
      const input = el.querySelector(
        `input[data-var="${v.key}"]`,
      ) as HTMLInputElement | null;
      if (input && formData[v.key] !== undefined && formData[v.key] !== "") {
        input.value = String(formData[v.key]);
      }
    }
  }, [formData, result, variables]);

  /* ---- event delegation for inline fields ---- */
  useEffect(() => {
    const el = previewRef.current;
    if (!el) return;

    const handler = (e: Event) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName === "INPUT" &&
        target.classList.contains(INLINE_FIELD_CLASS)
      ) {
        const key = target.getAttribute("data-var");
        if (key) handleChange(key, (target as HTMLInputElement).value);
      }
    };

    el.addEventListener("input", handler);
    return () => el.removeEventListener("input", handler);
  }, [handleChange]);

  /* ---- focus/blur styling via CSS (injected globally once) ---- */
  useEffect(() => {
    if (document.getElementById("odin-field-styles")) return;
    const style = document.createElement("style");
    style.id = "odin-field-styles";
    style.textContent = `
      .${INLINE_FIELD_CLASS} {
        border: none !important;
        border-bottom: 2px dashed #3b82f6 !important;
        background: rgba(59, 130, 246, 0.06) !important;
        font: inherit !important;
        font-size: inherit !important;
        font-family: inherit !important;
        color: #1e40af !important;
        padding: 0 4px !important;
        margin: 0 2px !important;
        min-width: 80px !important;
        max-width: 280px !important;
        outline: none !important;
        border-radius: 2px !important;
        transition: all 0.2s ease !important;
        display: inline-block !important;
        box-sizing: border-box !important;
        vertical-align: baseline !important;
        height: auto !important;
        line-height: inherit !important;
      }
      .${INLINE_FIELD_CLASS}:focus {
        border-bottom-color: #2563eb !important;
        background: rgba(59, 130, 246, 0.12) !important;
        box-shadow: 0 2px 4px rgba(59, 130, 246, 0.15) !important;
      }
      .${INLINE_FIELD_CLASS}::placeholder {
        color: #94a3b8 !important;
        font-style: italic !important;
        font-size: 0.9em !important;
        opacity: 0.7 !important;
      }
      /* Hide spinners on number inputs */
      .${INLINE_FIELD_CLASS}[type="number"]::-webkit-inner-spin-button,
      .${INLINE_FIELD_CLASS}[type="number"]::-webkit-outer-spin-button {
        -webkit-appearance: none !important;
        margin: 0 !important;
      }
      .${INLINE_FIELD_CLASS}[type="number"] {
        -moz-appearance: textfield !important;
      }
    `;
    document.head.appendChild(style);
  }, []);

  /* ---- generate ---- */
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
          signers: signers.filter((s) => s.name && s.email),
        }),
      });

      if (!response.ok) throw new Error("Generation failed");

      const data = await response.json();
      setResult({
        html: data.html,
        generationId: data.generationId,
        signatureUrl: data.signatureUrl,
      });
    } catch (error) {
      setResult({ error: t.wizard.error });
    } finally {
      setLoading(false);
    }
  };

  /* ---- download ---- */
  const handleDownload = () => {
    if (!result?.generationId) return;
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "";
    window.open(
      `${apiUrl}/api/v1/generations/${result.generationId}/download`,
      "_blank",
    );
  };

  /* ---- regenerate ---- */
  const handleRegenerate = () => {
    setResult(null);
  };

  /* ---- render ---- */
  return (
    <div
      style={{
        maxWidth: "1100px",
        margin: "0 auto",
        color: "var(--foreground)",
      }}
    >
      {/* ═══════ 1. Expert tip  ═══════ */}
      {(model as any).guidance && (
        <div
          style={{
            marginBottom: "2.5rem",
            padding: "1.5rem 2rem",
            backgroundColor: "rgba(59, 130, 246, 0.04)",
            borderRadius: "16px",
            border: "1px solid rgba(59, 130, 246, 0.18)",
            display: "flex",
            gap: "1.25rem",
            alignItems: "flex-start",
          }}
        >
          <span
            style={{
              fontSize: "1.75rem",
              flexShrink: 0,
              marginTop: "2px",
            }}
          >
            💡
          </span>
          <div>
            <h4
              style={{
                margin: "0 0 0.5rem 0",
                color: "var(--primary)",
                fontSize: "1rem",
              }}
            >
              Dicas do Especialista
            </h4>
            <p
              style={{
                margin: 0,
                fontSize: "0.95rem",
                color: "var(--muted)",
                lineHeight: "1.7",
              }}
            >
              {(model as any).guidance as string}
            </p>
          </div>
        </div>
      )}

      {/* ═══════ 2. Document preview  ═══════ */}
      <div
        style={{
          backgroundColor: "var(--card-bg)",
          border: "1px solid var(--card-border)",
          borderRadius: "12px",
          boxShadow: "0 8px 30px var(--shadow)",
          overflow: "hidden",
          position: "relative",
        }}
      >
        {/* paper-like document */}
        <div
          ref={previewRef}
          style={{
            backgroundColor: "#fff",
            color: "#000",
            padding: "3.5rem 4rem",
            minHeight: "600px",
            fontFamily: "'Times New Roman', Times, serif",
            fontSize: "12pt",
            lineHeight: "1.8",
            maxWidth: "210mm",
            margin: "0 auto",
            width: "100%",
            boxSizing: "border-box",
          }}
          dangerouslySetInnerHTML={{
            __html:
              result?.html ||
              templateRef.current ||
              `<p style="color:#999;text-align:center;padding:4rem 0;">Preencha os campos acima para gerar o documento.</p>`,
          }}
        />

        {/* loading overlay */}
        {loading && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "rgba(255,255,255,0.85)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: "1rem",
              zIndex: 10,
            }}
          >
            <div
              style={{
                width: 40,
                height: 40,
                border: "3px solid #e2e8f0",
                borderTopColor: "#3b82f6",
                borderRadius: "50%",
                animation: "odin-spin 0.7s linear infinite",
              }}
            />
            <style>{`@keyframes odin-spin { to { transform: rotate(360deg); } }`}</style>
            <p style={{ color: "#475569", fontWeight: 600, margin: 0 }}>
              Gerando documento...
            </p>
          </div>
        )}
      </div>

      {/* error */}
      {result?.error && (
        <p
          style={{
            color: "#ef4444",
            marginTop: "1rem",
            fontSize: "0.9rem",
            textAlign: "center",
          }}
        >
          {result.error}
        </p>
      )}

      {/* ═══════ 3. Actions below the document  ═══════ */}
      <div
        style={{
          marginTop: "2.5rem",
          display: "flex",
          flexDirection: "column",
          gap: "2.5rem",
        }}
      >
        {/* Signature section */}
        {!result && (
          <div
            style={{
              backgroundColor: "var(--card-bg)",
              border: "1px solid var(--card-border)",
              borderRadius: "16px",
              padding: "2rem",
            }}
          >
            <h4
              style={{
                margin: "0 0 1.25rem 0",
                fontSize: "1rem",
                color: "var(--foreground)",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
              }}
            >
              <span>✍️</span> Assinatura Eletrônica (Opcional)
            </h4>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.75rem",
              }}
            >
              {signers.map((signer, index) => (
                <div
                  key={index}
                  style={{
                    display: "flex",
                    gap: "0.75rem",
                    alignItems: "center",
                  }}
                >
                  <input
                    placeholder="Nome do signatário"
                    value={signer.name}
                    onChange={(e) =>
                      updateSigner(index, "name", e.target.value)
                    }
                    style={{
                      flex: 1,
                      padding: "0.7rem 1rem",
                      borderRadius: "10px",
                      border: "1px solid var(--card-border)",
                      fontSize: "0.9rem",
                      backgroundColor: "var(--background)",
                      color: "var(--foreground)",
                    }}
                  />
                  <input
                    placeholder="E-mail"
                    type="email"
                    value={signer.email}
                    onChange={(e) =>
                      updateSigner(index, "email", e.target.value)
                    }
                    style={{
                      flex: 1,
                      padding: "0.7rem 1rem",
                      borderRadius: "10px",
                      border: "1px solid var(--card-border)",
                      fontSize: "0.9rem",
                      backgroundColor: "var(--background)",
                      color: "var(--foreground)",
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
                      fontSize: "1.25rem",
                      padding: "0.5rem",
                      lineHeight: 1,
                    }}
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={addSigner}
              style={{
                background: "none",
                border: "1px dashed var(--card-border)",
                color: "#2563eb",
                padding: "0.75rem",
                borderRadius: "10px",
                marginTop: "1rem",
                width: "100%",
                cursor: "pointer",
                fontSize: "0.9rem",
                fontWeight: 500,
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "#2563eb";
                e.currentTarget.style.background =
                  "rgba(37, 99, 235, 0.04)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "var(--card-border)";
                e.currentTarget.style.background = "none";
              }}
            >
              + Adicionar Signatário
            </button>
            <p
              style={{
                fontSize: "0.8rem",
                color: "var(--muted)",
                marginTop: "0.75rem",
              }}
            >
              Os signatários receberão um e-mail para assinar o documento
              digitalmente via ODIN SIGN.
            </p>
          </div>
        )}

        {/* signature link after generation */}
        {result?.signatureUrl && (
          <div
            style={{
              padding: "1.25rem 1.5rem",
              background: "rgba(59, 130, 246, 0.08)",
              borderRadius: "12px",
              border: "1px solid rgba(59, 130, 246, 0.2)",
              display: "flex",
              alignItems: "center",
              gap: "1rem",
              flexWrap: "wrap",
            }}
          >
            <span style={{ fontWeight: 600, color: "#3b82f6" }}>
              🔗 Link de Assinatura Nativa
            </span>
            <input
              readOnly
              value={result.signatureUrl}
              style={{
                flex: 1,
                minWidth: 200,
                padding: "0.5rem 0.75rem",
                borderRadius: "8px",
                border: "1px solid var(--card-border)",
                fontSize: "0.8rem",
                background: "var(--background)",
                color: "var(--foreground)",
              }}
            />
            <button
              type="button"
              onClick={() => {
                navigator.clipboard.writeText(
                  result.signatureUrl || "",
                );
                alert("Link copiado!");
              }}
              style={{
                padding: "0.5rem 1rem",
                background: "#3b82f6",
                color: "white",
                border: "none",
                borderRadius: "8px",
                fontSize: "0.85rem",
                cursor: "pointer",
                fontWeight: 600,
              }}
            >
              Copiar
            </button>
          </div>
        )}

        {/* Generate / Download buttons */}
        <div
          style={{
            display: "flex",
            gap: "1rem",
            justifyContent: "center",
          }}
        >
          {!result ? (
            <button
              onClick={handleSubmit}
              disabled={loading}
              style={{
                padding: "1.25rem 3rem",
                backgroundColor: "#2563eb",
                color: "white",
                border: "none",
                borderRadius: "14px",
                fontSize: "1.15rem",
                fontWeight: "bold",
                cursor: loading ? "not-allowed" : "pointer",
                boxShadow: "0 10px 20px -5px rgba(37, 99, 235, 0.35)",
                transition: "all 0.2s ease",
                opacity: loading ? 0.7 : 1,
                minWidth: 280,
              }}
              onMouseEnter={(e) => {
                if (!loading)
                  e.currentTarget.style.transform = "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              {loading
                ? "⏳ Gerando..."
                : Number((model as any).price) > 0
                  ? `🚀 Gerar por R$ ${Number((model as any).price).toFixed(2)}`
                  : "🚀 Gerar Documento"}
            </button>
          ) : (
            <>
              <button
                onClick={handleDownload}
                style={{
                  padding: "1.25rem 3rem",
                  backgroundColor: "#10b981",
                  color: "white",
                  border: "none",
                  borderRadius: "14px",
                  fontSize: "1.15rem",
                  fontWeight: "bold",
                  cursor: "pointer",
                  boxShadow:
                    "0 10px 20px -5px rgba(16, 185, 129, 0.35)",
                  transition: "all 0.2s ease",
                  minWidth: 280,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-2px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                ⬇️ Baixar PDF
              </button>
              <button
                onClick={handleRegenerate}
                style={{
                  padding: "1.25rem 2rem",
                  backgroundColor: "transparent",
                  color: "var(--foreground)",
                  border: "1px solid var(--card-border)",
                  borderRadius: "14px",
                  fontSize: "1.05rem",
                  fontWeight: 600,
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "#2563eb";
                  e.currentTarget.style.color = "#2563eb";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor =
                    "var(--card-border)";
                  e.currentTarget.style.color = "var(--foreground)";
                }}
              >
                ↩️ Refazer
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
