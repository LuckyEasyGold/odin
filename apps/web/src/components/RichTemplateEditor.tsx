"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import { Node, mergeAttributes } from "@tiptap/core";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import TextAlign from "@tiptap/extension-text-align";
import { useEffect, useMemo, useState } from "react";

/* -------------------------------------------------------------------------- */
/*  Variable types & serialization                                            */
/* -------------------------------------------------------------------------- */

export type VarType = "texto" | "numero" | "moeda" | "data";

const TYPE_LABELS: Record<VarType, string> = {
  texto: "Texto",
  numero: "Número",
  moeda: "Moeda (R$)",
  data: "Data",
};

const TYPE_COLORS: Record<VarType, { bg: string; fg: string; border: string }> = {
  texto: { bg: "#dbeafe", fg: "#1e40af", border: "#93c5fd" },
  numero: { bg: "#fef3c7", fg: "#92400e", border: "#fcd34d" },
  moeda: { bg: "#dcfce7", fg: "#166534", border: "#86efac" },
  data: { bg: "#fce7f3", fg: "#9d174d", border: "#f9a8d4" },
};

/** Build the Handlebars expression: e.g. {{moeda preco}} */
function toHandlebars(name: string, type: VarType): string {
  return `{{${type} ${name}}}`;
}

/** Parse "{{moeda preco}}" → { type, name }. Returns null if not typed. */
function parseHandlebars(expr: string): { name: string; type: VarType } | null {
  const m = expr.match(/^\{\{\s*(texto|numero|moeda|data)\s+([\w.]+)\s*\}\}$/);
  if (!m) return null;
  return { type: m[1] as VarType, name: m[2] };
}

/* -------------------------------------------------------------------------- */
/*  Variable Node (chip)                                                      */
/* -------------------------------------------------------------------------- */

const VariableNode = Node.create({
  name: "odinVariable",
  group: "inline",
  inline: true,
  atom: true,
  selectable: true,

  addAttributes() {
    return {
      name: { default: "" },
      varType: { default: "texto" as VarType },
    };
  },

  parseHTML() {
    return [
      {
        tag: "span[data-odin-var]",
        getAttrs: (el) => {
          const node = el as HTMLElement;
          return {
            name: node.getAttribute("data-odin-var") || "",
            varType: (node.getAttribute("data-odin-type") as VarType) || "texto",
          };
        },
      },
    ];
  },

  renderHTML({ node, HTMLAttributes }) {
    const expr = toHandlebars(node.attrs.name, node.attrs.varType as VarType);
    return [
      "span",
      mergeAttributes(HTMLAttributes, {
        "data-odin-var": node.attrs.name,
        "data-odin-type": node.attrs.varType,
      }),
      expr,
    ];
  },

  addNodeView() {
    return ({ node }) => {
      const span = document.createElement("span");
      const c = TYPE_COLORS[node.attrs.varType as VarType] || TYPE_COLORS.texto;
      span.setAttribute("data-odin-var", node.attrs.name);
      span.setAttribute("data-odin-type", node.attrs.varType);
      span.setAttribute("title", `${TYPE_LABELS[node.attrs.varType as VarType]} • {{${node.attrs.varType} ${node.attrs.name}}}`);
      span.contentEditable = "false";
      span.style.display = "inline-block";
      span.style.padding = "1px 8px";
      span.style.margin = "0 2px";
      span.style.borderRadius = "999px";
      span.style.backgroundColor = c.bg;
      span.style.color = c.fg;
      span.style.border = `1px solid ${c.border}`;
      span.style.fontSize = "0.85em";
      span.style.fontWeight = "600";
      span.style.fontFamily = "ui-monospace, SFMono-Regular, monospace";
      span.style.cursor = "default";
      span.style.userSelect = "none";
      span.textContent = toHandlebars(node.attrs.name, node.attrs.varType as VarType);
      return { dom: span };
    };
  },
});

/* -------------------------------------------------------------------------- */
/*  Pre-load: rehydrate {{texto x}} / {{moeda x}} / etc into chips            */
/* -------------------------------------------------------------------------- */

function hydrateVariables(html: string): string {
  // Replace standalone "{{type name}}" tokens with the chip span.
  return html.replace(/\{\{\s*(texto|numero|moeda|data)\s+([\w.]+)\s*\}\}/g, (_, t, n) => {
    return `<span data-odin-var="${n}" data-odin-type="${t}">{{${t} ${n}}}</span>`;
  });
}

/* -------------------------------------------------------------------------- */
/*  Toolbar                                                                   */
/* -------------------------------------------------------------------------- */

function Toolbar({
  editor,
  onInsertVar,
  rawMode,
  onToggleRaw,
}: {
  editor: any;
  onInsertVar: () => void;
  rawMode: boolean;
  onToggleRaw: () => void;
}) {
  if (!editor) return null;

  const btn = (active: boolean): React.CSSProperties => ({
    padding: "0.35rem 0.6rem",
    border: "1px solid #e2e8f0",
    borderRadius: 6,
    background: active ? "#1e293b" : "white",
    color: active ? "white" : "#475569",
    cursor: "pointer",
    fontSize: "0.85rem",
    fontWeight: 600,
    position: "relative",
  });

  const getFontSize = () => {
    if (editor.isActive("heading", { level: 1 })) return "28px";
    if (editor.isActive("heading", { level: 2 })) return "24px";
    return "16px";
  };

  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: 4,
        padding: 8,
        borderBottom: "1px solid #e2e8f0",
        background: "#f8fafc",
        borderTopLeftRadius: 12,
        borderTopRightRadius: 12,
        alignItems: "center",
      }}
    >
      {!rawMode && (
        <>
          <button
            type="button"
            title="Negrito"
            style={btn(editor.isActive("bold"))}
            onClick={() => editor.chain().focus().toggleBold().run()}
          >
            <b>B</b>
          </button>
          <button
            type="button"
            title="Itálico"
            style={btn(editor.isActive("italic"))}
            onClick={() => editor.chain().focus().toggleItalic().run()}
          >
            <i>I</i>
          </button>
          <button
            type="button"
            title="Sublinhado"
            style={btn(editor.isActive("underline"))}
            onClick={() => editor.chain().focus().toggleUnderline().run()}
          >
            <u>U</u>
          </button>
          <span style={{ width: 1, background: "#e2e8f0", margin: "0 4px" }} />

          {/* Font Size Dropdown */}
          <select
            title="Tamanho da fonte"
            onChange={(e) => {
              const size = e.target.value;
              if (size === "h1") {
                editor.chain().focus().toggleHeading({ level: 1 }).run();
              } else if (size === "h2") {
                editor.chain().focus().toggleHeading({ level: 2 }).run();
              } else {
                editor.chain().focus().setParagraph().run();
              }
            }}
            value={
              editor.isActive("heading", { level: 1 })
                ? "h1"
                : editor.isActive("heading", { level: 2 })
                  ? "h2"
                  : "normal"
            }
            style={{
              padding: "0.35rem 0.6rem",
              border: "1px solid #e2e8f0",
              borderRadius: 6,
              background: "white",
              color: "#475569",
              cursor: "pointer",
              fontSize: "0.85rem",
              fontWeight: 600,
            }}
          >
            <option value="normal">Padrão</option>
            <option value="h1">Grande (28px)</option>
            <option value="h2">Médio (24px)</option>
          </select>

          <span style={{ width: 1, background: "#e2e8f0", margin: "0 4px" }} />

          {/* Alignment Buttons with SVG icons */}
          <button
            type="button"
            title="Alinhar à esquerda"
            style={btn(editor.isActive({ textAlign: "left" }))}
            onClick={() => editor.chain().focus().setTextAlign("left").run()}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <line x1="2" y1="4" x2="14" y2="4" stroke="currentColor" strokeWidth="1.5" />
              <line x1="2" y1="8" x2="10" y2="8" stroke="currentColor" strokeWidth="1.5" />
              <line x1="2" y1="12" x2="12" y2="12" stroke="currentColor" strokeWidth="1.5" />
            </svg>
          </button>
          <button
            type="button"
            title="Centralizar"
            style={btn(editor.isActive({ textAlign: "center" }))}
            onClick={() => editor.chain().focus().setTextAlign("center").run()}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <line x1="1" y1="4" x2="15" y2="4" stroke="currentColor" strokeWidth="1.5" />
              <line x1="3" y1="8" x2="13" y2="8" stroke="currentColor" strokeWidth="1.5" />
              <line x1="2" y1="12" x2="14" y2="12" stroke="currentColor" strokeWidth="1.5" />
            </svg>
          </button>
          <button
            type="button"
            title="Alinhar à direita"
            style={btn(editor.isActive({ textAlign: "right" }))}
            onClick={() => editor.chain().focus().setTextAlign("right").run()}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <line x1="2" y1="4" x2="14" y2="4" stroke="currentColor" strokeWidth="1.5" />
              <line x1="6" y1="8" x2="14" y2="8" stroke="currentColor" strokeWidth="1.5" />
              <line x1="4" y1="12" x2="14" y2="12" stroke="currentColor" strokeWidth="1.5" />
            </svg>
          </button>
          <button
            type="button"
            title="Justificar"
            style={btn(editor.isActive({ textAlign: "justify" }))}
            onClick={() => editor.chain().focus().setTextAlign("justify").run()}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <line x1="2" y1="4" x2="14" y2="4" stroke="currentColor" strokeWidth="1.5" />
              <line x1="2" y1="8" x2="14" y2="8" stroke="currentColor" strokeWidth="1.5" />
              <line x1="2" y1="12" x2="14" y2="12" stroke="currentColor" strokeWidth="1.5" />
            </svg>
          </button>

          <span style={{ width: 1, background: "#e2e8f0", margin: "0 4px" }} />

          <button
            type="button"
            title="Lista com marcadores"
            style={btn(editor.isActive("bulletList"))}
            onClick={() => editor.chain().focus().toggleBulletList().run()}
          >
            • Lista
          </button>
          <button
            type="button"
            title="Lista numerada"
            style={btn(editor.isActive("orderedList"))}
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
          >
            1. Lista
          </button>
          <span style={{ width: 1, background: "#e2e8f0", margin: "0 4px" }} />
          <button
            type="button"
            title="Inserir variável dinâmica"
            onClick={onInsertVar}
            style={{
              ...btn(false),
              background: "#10b981",
              color: "white",
              border: "1px solid #059669",
              fontWeight: 700,
            }}
          >
            ＋ Inserir Variável
          </button>
        </>
      )}
      <span style={{ flex: 1 }} />
      <button
        type="button"
        onClick={onToggleRaw}
        style={{
          ...btn(rawMode),
          background: rawMode ? "#1e293b" : "white",
          color: rawMode ? "white" : "#475569",
        }}
        title="Alternar entre editor visual e modo HTML avançado"
      >
        {rawMode ? "← Voltar ao Visual" : "</> HTML Avançado"}
      </button>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Variable insertion modal                                                  */
/* -------------------------------------------------------------------------- */

function VarModal({
  onCancel,
  onConfirm,
}: {
  onCancel: () => void;
  onConfirm: (name: string, type: VarType) => void;
}) {
  const [name, setName] = useState("");
  const [type, setType] = useState<VarType>("texto");

  const valid = /^[a-zA-Z_][\w.]*$/.test(name);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(15,23,42,0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
      }}
      onClick={onCancel}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "white",
          padding: "2rem",
          borderRadius: 16,
          width: "min(440px, 90vw)",
          boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)",
        }}
      >
        <h3 style={{ margin: "0 0 0.5rem 0", color: "#0f172a" }}>Inserir Variável</h3>
        <p style={{ margin: "0 0 1.25rem 0", color: "#64748b", fontSize: "0.9rem" }}>
          A variável aparecerá no documento e será preenchida no momento da geração.
        </p>

        <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, color: "#334155", marginBottom: 4 }}>
          Nome da variável
        </label>
        <input
          autoFocus
          value={name}
          onChange={(e) => setName(e.target.value.replace(/[^\w.]/g, "_"))}
          placeholder="ex: nome_cliente, valor_total, data_vencimento"
          style={{
            width: "100%",
            padding: "0.6rem 0.8rem",
            borderRadius: 8,
            border: "1px solid #cbd5e1",
            fontFamily: "ui-monospace, SFMono-Regular, monospace",
            marginBottom: "1rem",
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" && valid) onConfirm(name, type);
          }}
        />

        <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, color: "#334155", marginBottom: 4 }}>
          Tipo
        </label>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: "1.5rem" }}>
          {(Object.keys(TYPE_LABELS) as VarType[]).map((t) => {
            const c = TYPE_COLORS[t];
            const active = type === t;
            return (
              <button
                key={t}
                type="button"
                onClick={() => setType(t)}
                style={{
                  padding: "0.6rem",
                  borderRadius: 8,
                  border: `2px solid ${active ? c.fg : c.border}`,
                  background: active ? c.bg : "white",
                  color: c.fg,
                  cursor: "pointer",
                  fontWeight: 600,
                  textAlign: "left",
                }}
              >
                {TYPE_LABELS[t]}
                <div style={{ fontSize: "0.7rem", opacity: 0.8, fontWeight: 400, marginTop: 2 }}>
                  {t === "texto" && "Strings, nomes, descrições"}
                  {t === "numero" && "Quantidade, percentual"}
                  {t === "moeda" && "Formata como R$"}
                  {t === "data" && "Formata como DD/MM/AAAA"}
                </div>
              </button>
            );
          })}
        </div>

        <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
          <button
            type="button"
            onClick={onCancel}
            style={{
              padding: "0.6rem 1rem",
              borderRadius: 8,
              border: "1px solid #cbd5e1",
              background: "white",
              cursor: "pointer",
            }}
          >
            Cancelar
          </button>
          <button
            type="button"
            disabled={!valid}
            onClick={() => onConfirm(name, type)}
            style={{
              padding: "0.6rem 1rem",
              borderRadius: 8,
              border: "none",
              background: valid ? "#10b981" : "#94a3b8",
              color: "white",
              fontWeight: 700,
              cursor: valid ? "pointer" : "not-allowed",
            }}
          >
            Inserir
          </button>
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Main component                                                            */
/* -------------------------------------------------------------------------- */

export interface RichTemplateEditorProps {
  /** Form field name — a hidden input with the serialized HTML/Handlebars is rendered. */
  name: string;
  /** Initial template (HTML with {{type name}} tokens). */
  initialValue?: string;
  /** Optional placeholder for empty editor. */
  placeholder?: string;
  /** Called whenever the serialized template changes. */
  onChange?: (value: string) => void;
}

export default function RichTemplateEditor({
  name,
  initialValue = "",
  placeholder = "Comece a digitar o seu modelo... Use o botão '＋ Inserir Variável' para campos dinâmicos.",
  onChange,
}: RichTemplateEditorProps) {
  const [rawMode, setRawMode] = useState(false);
  const [rawValue, setRawValue] = useState(initialValue);
  const [serialized, setSerialized] = useState(initialValue);
  const [showModal, setShowModal] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link.configure({ openOnClick: false }),
      Placeholder.configure({ placeholder }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      VariableNode,
    ],
    content: hydrateVariables(initialValue),
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      setSerialized(html);
      onChange?.(html);
    },
  });

  // When toggling Raw → Visual, parse current raw text back into editor.
  useEffect(() => {
    if (!editor) return;
    if (!rawMode) {
      editor.commands.setContent(hydrateVariables(rawValue), false);
      setSerialized(rawValue);
      onChange?.(rawValue);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rawMode]);

  // Sync raw textarea value when editor changes
  useEffect(() => {
    if (!rawMode) setRawValue(serialized);
  }, [serialized, rawMode]);

  // Sync external initialValue changes (e.g. when user imports an existing model).
  useEffect(() => {
    if (!editor) return;
    if (initialValue === serialized) return;
    if (rawMode) {
      setRawValue(initialValue);
    } else {
      editor.commands.setContent(hydrateVariables(initialValue), false);
    }
    setSerialized(initialValue);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialValue, editor]);

  const insertVariable = (varName: string, varType: VarType) => {
    setShowModal(false);
    if (!editor) return;
    editor
      .chain()
      .focus()
      .insertContent({
        type: "odinVariable",
        attrs: { name: varName, varType },
      })
      .run();
  };

  const detectedVars = useMemo(() => {
    const matches = serialized.matchAll(/\{\{\s*(texto|numero|moeda|data)\s+([\w.]+)\s*\}\}/g);
    const seen = new Set<string>();
    const list: { name: string; type: VarType }[] = [];
    for (const m of matches) {
      const key = `${m[1]}:${m[2]}`;
      if (!seen.has(key)) {
        seen.add(key);
        list.push({ type: m[1] as VarType, name: m[2] });
      }
    }
    return list;
  }, [serialized]);

  return (
    <div>
      <div
        style={{
          border: "2px solid #e2e8f0",
          borderRadius: 12,
          background: "white",
          overflow: "hidden",
        }}
      >
        <Toolbar
          editor={editor}
          onInsertVar={() => setShowModal(true)}
          rawMode={rawMode}
          onToggleRaw={() => {
            if (rawMode) {
              // back to visual
              setRawMode(false);
            } else {
              setRawValue(serialized);
              setRawMode(true);
            }
          }}
        />

        {rawMode ? (
          <textarea
            value={rawValue}
            onChange={(e) => {
              setRawValue(e.target.value);
              setSerialized(e.target.value);
              onChange?.(e.target.value);
            }}
            rows={18}
            style={{
              width: "100%",
              padding: "1rem",
              border: "none",
              outline: "none",
              fontFamily: "ui-monospace, SFMono-Regular, monospace",
              fontSize: "0.9rem",
              lineHeight: 1.5,
              resize: "vertical",
              background: "#0f172a",
              color: "#e2e8f0",
              minHeight: 320,
            }}
          />
        ) : (
          <div
            style={{
              padding: "1rem 1.25rem",
              minHeight: 320,
              maxHeight: 600,
              overflowY: "auto",
              fontSize: "1rem",
              lineHeight: 1.6,
              color: "#0f172a",
            }}
          >
            <EditorContent editor={editor} />
          </div>
        )}
      </div>

      {detectedVars.length > 0 && (
        <div
          style={{
            marginTop: 12,
            padding: "0.75rem 1rem",
            background: "#f8fafc",
            border: "1px solid #e2e8f0",
            borderRadius: 8,
            fontSize: "0.85rem",
          }}
        >
          <strong style={{ color: "#475569" }}>Variáveis detectadas ({detectedVars.length}):</strong>{" "}
          {detectedVars.map((v) => {
            const c = TYPE_COLORS[v.type];
            return (
              <span
                key={`${v.type}-${v.name}`}
                style={{
                  display: "inline-block",
                  padding: "1px 8px",
                  margin: "2px 4px 2px 0",
                  borderRadius: 999,
                  background: c.bg,
                  color: c.fg,
                  border: `1px solid ${c.border}`,
                  fontSize: "0.8em",
                  fontWeight: 600,
                  fontFamily: "ui-monospace, SFMono-Regular, monospace",
                }}
                title={`${TYPE_LABELS[v.type]}`}
              >
                {v.name}
              </span>
            );
          })}
        </div>
      )}

      {/* Hidden input that carries the value to the form action */}
      <input type="hidden" name={name} value={serialized} />

      {showModal && (
        <VarModal onCancel={() => setShowModal(false)} onConfirm={insertVariable} />
      )}
    </div>
  );
}

export { parseHandlebars, toHandlebars };
