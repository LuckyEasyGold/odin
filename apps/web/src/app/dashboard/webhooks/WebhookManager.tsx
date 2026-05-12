"use client";

import { useState } from "react";
import { createWebhook, deleteWebhook } from "@/app/actions/webhooks";

export default function WebhookManager({ initialWebhooks }: { initialWebhooks: any[] }) {
  const [webhooks, setWebhooks] = useState(initialWebhooks);
  const [isAdding, setIsAdding] = useState(false);
  const [url, setUrl] = useState("");
  const [events, setEvents] = useState(["document.signed"]);
  const [loading, setLoading] = useState(false);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createWebhook(url, events);
      window.location.reload(); // Re-fetch all
    } catch (error) {
      alert("Erro ao salvar webhook");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Remover este webhook?")) return;
    try {
      await deleteWebhook(id);
      setWebhooks(webhooks.filter(w => w.id !== id));
    } catch (error) {
      alert("Erro ao remover");
    }
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
        <h2 style={{ margin: 0, fontSize: "1.5rem" }}>Seus Endpoints ({webhooks.length})</h2>
        <button 
          onClick={() => setIsAdding(true)}
          style={{ 
            padding: "0.75rem 1.5rem", 
            backgroundColor: "#10b981", 
            color: "white", 
            border: "none", 
            borderRadius: "12px", 
            fontWeight: "bold",
            cursor: "pointer"
          }}
        >
          + Adicionar Endpoint
        </button>
      </div>

      {isAdding && (
        <form onSubmit={handleAdd} style={{ 
          backgroundColor: "var(--card-bg)", padding: "2rem", borderRadius: "20px", marginBottom: "2.5rem",
          border: "1px solid var(--card-border)", boxShadow: "0 4px 6px var(--shadow)"
        }}>
          <h3 style={{ marginTop: 0 }}>Novo Webhook</h3>
          
          <div style={{ marginBottom: "1.5rem" }}>
            <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "bold", fontSize: "0.9rem" }}>URL de Destino</label>
            <input 
              required
              type="url"
              placeholder="https://seu-sistema.com/api/webhooks/odin"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              style={{ width: "100%", padding: "0.75rem", borderRadius: "10px", border: "1px solid var(--card-border)", backgroundColor: "var(--background)", color: "var(--foreground)" }}
            />
          </div>

          <div style={{ marginBottom: "1.5rem" }}>
            <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "bold", fontSize: "0.9rem" }}>Eventos</label>
            <div style={{ display: "flex", gap: "1rem" }}>
              <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer" }}>
                <input type="checkbox" checked readOnly />
                <span>document.signed</span>
              </label>
              <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--muted)" }}>
                <input type="checkbox" disabled />
                <span>document.generated (Breve)</span>
              </label>
            </div>
          </div>

          <div style={{ display: "flex", gap: "1rem" }}>
            <button type="button" onClick={() => setIsAdding(false)} style={{ padding: "0.75rem 1.5rem", background: "none", border: "1px solid var(--card-border)", borderRadius: "10px", color: "var(--foreground)", cursor: "pointer" }}>Cancelar</button>
            <button type="submit" disabled={loading} style={{ padding: "0.75rem 1.5rem", backgroundColor: "#10b981", color: "white", border: "none", borderRadius: "10px", fontWeight: "bold", cursor: loading ? "not-allowed" : "pointer" }}>
              {loading ? "Salvando..." : "Criar Webhook"}
            </button>
          </div>
        </form>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
        {webhooks.length === 0 ? (
          <div style={{ padding: "3rem", textAlign: "center", border: "2px dashed var(--card-border)", borderRadius: "20px", color: "var(--muted)" }}>
            Nenhum webhook configurado.
          </div>
        ) : (
          webhooks.map((w) => (
            <div key={w.id} style={{ 
              backgroundColor: "var(--card-bg)", padding: "1.5rem", borderRadius: "20px", 
              border: "1px solid var(--card-border)", display: "flex", justifyContent: "space-between", alignItems: "flex-start"
            }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "0.5rem" }}>
                  <span style={{ fontWeight: "bold", fontSize: "1.1rem" }}>{w.url}</span>
                  <span style={{ fontSize: "0.7rem", backgroundColor: "#10b981", color: "white", padding: "0.2rem 0.5rem", borderRadius: "4px", fontWeight: "bold" }}>ATIVO</span>
                </div>
                <div style={{ fontSize: "0.85rem", color: "var(--muted)", marginBottom: "1rem" }}>
                  Eventos: {w.events.join(", ")}
                </div>
                <div style={{ backgroundColor: "var(--background)", padding: "0.75rem", borderRadius: "10px", fontSize: "0.8rem", border: "1px solid var(--card-border)" }}>
                  <span style={{ color: "var(--muted)", marginRight: "0.5rem" }}>Secret:</span>
                  <code style={{ color: "#10b981", fontWeight: "bold" }}>{w.secret}</code>
                </div>
              </div>
              <button 
                onClick={() => handleDelete(w.id)}
                style={{ background: "none", border: "none", color: "#ef4444", fontWeight: "bold", cursor: "pointer", padding: "0.5rem" }}
              >
                Remover
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
